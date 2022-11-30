import Developer from './Developer'
import Admin from './Admin';
import { useAuthContext } from '../hooks/useAuthContext'

const User = () => {
    const { user } = useAuthContext()
    if (user.userRole === "Developer") 
    {return ( <Developer/> )}
    else {return ( <Admin/> )}
}
 
export default User;