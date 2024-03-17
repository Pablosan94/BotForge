import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

export type AuthContextType = {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: (_: SetStateAction<string | null>) => {},
});

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;
