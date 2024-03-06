import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import { useState } from "react";
import { toast } from "react-toastify";
import userAtom from "../atoms/userAtom";
const LoginCard = () => {
    const setAuthScreenState = useSetRecoilState(authScreenAtom);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });
    const setUser = useSetRecoilState(userAtom);

    const handleSubmit = async (e: any) => {
        setLoading(true);
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            })
            const data = await res.json();
            if (data.error) {
                toast.error(data.error);
                return;
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            toast.success('Login Successful');
        } catch (error) {
            console.log(error);
            toast.error('Error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
            </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
            <div className="text-left">
                <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
                >
                Username
                </label>
                <div className="mt-2">
                <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={inputs.username}
                    onChange={(e) => setInputs({...inputs, username: e.target.value})}
                />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                >
                    Password
                </label>
                </div>
                <div className="mt-2">
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={inputs.password}
                    onChange={(e) => setInputs({...inputs, password: e.target.value})}
                />
                </div>
            </div>

            <div>
                <button
                    type="button"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                Sign in
                </button>
            </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not Yet Register?{' '}
                    <a
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        onClick={() => setAuthScreenState('signup')}
                    >
                        Register
                    </a>
                </p>
            </form>
        </div>
        </div>
    );
}

export default LoginCard