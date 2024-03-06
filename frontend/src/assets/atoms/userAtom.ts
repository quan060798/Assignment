import { atom } from "recoil";

const userAtom = atom({
    key: 'userAtom',
    default: (() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    })(),
})

export default userAtom;