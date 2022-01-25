import { auth } from "../firebase";

export const getCurrentuser = () => {
    return auth.currentUser;
};
