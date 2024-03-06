import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import orderAtom from "../atoms/orderAtom";
interface SidebarState {
  customerName: string;
  orderStatus: string;
  address: string;
  priceRange: [number, number];
}

interface QueryParams {
  customer_name?: string;
  address?: string;
  search_min_amt?: number;
  search_max_amt?: number;
  order_status?: string;
  search_start_date?: string;
  search_end_date?: string;
}

const Sidebar = () => {
  const setOrder = useSetRecoilState(orderAtom);
  const [state, setState] = useState<SidebarState>({
    customerName: "",
    orderStatus: "default",
    address: "",
    priceRange: [0, 10000],
  });

  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const formattedStartDateTime = new Date(
      last24Hours.getTime() - last24Hours.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    const formattedEndDateTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setStartDateTime(formattedStartDateTime);
    setEndDateTime(formattedEndDateTime);
  }, []);

  const handleStartDateTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDateTime(e.target.value);
  };

  const handleEndDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDateTime(e.target.value);
  };

  const handlePriceRangeChange = (newValue: [number, number]) => {
    setState((prev) => ({ ...prev, priceRange: newValue }));
  };

  const handleOrderStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState((prev) => ({ ...prev, orderStatus: e.target.value }));
  };

  const parsedData = (inputDate: string): string => {
    const parsedDate = new Date(inputDate);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const hours = parsedDate.getHours().toString().padStart(2, "0");
    const minutes = parsedDate.getMinutes().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:00`;
    return formattedDate;
  };

  const handleSubmit = async (mode: string) => {
    if (mode === "submit") {
      setIsLoading(true);
      const queryParse: QueryParams = {
        customer_name: state.customerName || undefined,
        address: state.address || undefined,
        search_min_amt: state.priceRange[0],
        search_max_amt: state.priceRange[1],
        order_status:
          state.orderStatus !== "default" ? state.orderStatus : undefined,
        search_start_date: parsedData(startDateTime),
        search_end_date: parsedData(endDateTime),
      };

      const fields = Object.fromEntries(
        Object.entries(queryParse).filter(([_, value]) => value !== undefined)
      );

      try {
        const queryParams = new URLSearchParams(fields).toString();
        const res = await fetch("/api/order/get?" + queryParams, {
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await res.json();

        if (data.error) {
          toast.error(data.error);
          return;
        }

        setOrder(data.data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setState({
        customerName: "",
        orderStatus: "default",
        address: "",
        priceRange: [0, 10000],
      });
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const formattedStartDateTime = new Date(
        last24Hours.getTime() - last24Hours.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);
      const formattedEndDateTime = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16);

      setStartDateTime(formattedStartDateTime);
      setEndDateTime(formattedEndDateTime);

      try {
        const res = await fetch("/api/order/get", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (res.status === 304) {
          return;
        }

        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
          return;
        }

        setOrder(data.data);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="bg-neutral-900 w-[20%] p-3 flex flex-col text-white">
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <label className="block text-white-700 text-sm font-bold mb-2">
            Customer Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={state.customerName}
            onChange={(e) =>
              setState((prev) => ({ ...prev, customerName: e.target.value }))
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Order Status:
          </label>
          <select
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={state.orderStatus}
            onChange={handleOrderStatusChange}
          >
            <option value="default" disabled>
              Select an order status
            </option>
            <option value="Shipped">Shipped</option>
            <option value="Processing">Processing</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-white-700 text-sm font-bold mb-2">
            Address:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={state.address}
            onChange={(e) =>
              setState((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-white-700 text-sm font-bold mb-2">
            Price Range:
          </label>
          <input
            type="range"
            min={0}
            max={100000}
            value={state.priceRange[0]}
            onChange={(e) =>
              handlePriceRangeChange([
                parseInt(e.target.value),
                state.priceRange[1],
              ])
            }
            className="w-full"
          />
          <div className="flex justify-between">
            <span>${state.priceRange[0]}</span>
            <span>${state.priceRange[1]}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-4">
            <label className="block text-white-700 text-sm font-bold mb-2">
              Start Date and Time:
            </label>
            <input
              type="datetime-local"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={startDateTime}
              onChange={handleStartDateTimeChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white-700 text-sm font-bold mb-2">
              End Date and Time:
            </label>
            <input
              type="datetime-local"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={endDateTime}
              onChange={handleEndDateTimeChange}
            />
          </div>
        </div>

        <div className="flex w-full">
          <button
            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1 mr-2"
            onClick={() => handleSubmit("clear")}
          >
            Clear
          </button>
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleSubmit("submit")}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
