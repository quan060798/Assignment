import { atom } from "recoil";
import { Order } from "../../model/order.model";

const orderAtom = atom({
  key: "orderAtom",
  default: [] as Order[],
});

export default orderAtom;
