import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import RegisterCard from "../components/RegisterCard";
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);
    return (
        <>
            {authScreenState === 'login' ? <LoginCard /> : <RegisterCard />}
        </>
    )
}

export default AuthPage