import { useRecoilState } from "recoil"
import userAtom from "../atoms/userAtom";
import { toast } from "react-toastify";

const Header = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            localStorage.removeItem("user");
            setUser(null);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }

      };
    return (
      <div className="flex p-5 border-b border-gray-300 bg-neutral-800 text-white flex-col items-end">
        <div>{user ? "Welcome, " + user.username : ""}</div>
        <div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );
}

export default Header