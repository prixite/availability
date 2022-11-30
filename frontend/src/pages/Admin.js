import { Link } from 'react-router-dom'
import AvailabilityForm from "../components/AvailabilityForm";
import AvailabilityTable from '../components/AvailabilityTable';

const Admin = () => {
    return ( 
        <div>
        <AvailabilityForm/>
        <AvailabilityTable/>
        <div style={{width:"100%", textAlign:"center"}}>
        <Link to="/user/all">
          <button className='availabilitybutton'>Check Other Users Availability</button>
        </Link>
        </div>
        </div>
     );
}
 
export default Admin;