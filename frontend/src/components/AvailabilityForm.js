import { useState } from 'react'
import { useSetAvailability } from "../hooks/useSetAvailability"

const AvailabilityForm = () => {

  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const {setAvailability, error, isLoading} = useSetAvailability()

  const handleSubmit = async (e) => {

    e.preventDefault()

    const user = JSON.parse(localStorage.getItem('user'))
    const user_id = user.user_id

    await setAvailability(user_id, startTime, endTime)

    alert('Your availability has been set from ' + startTime + ' to ' + endTime)

}

    return ( 
        
    <form className="availability_form" onSubmit={handleSubmit}> 
      <h3>Select Your Availability for Today</h3>

      <label>Start Time</label>

      <input
        type="time"
        onChange={(e) => setStartTime(e.target.value)}
        id="startTime" 
        value={startTime}
      />

      <label>End Time</label>

      <input
        type="time"
        onChange={(e) => setEndTime(e.target.value)}
        id="startTime" 
        value={endTime}
      />

      <button disabled={isLoading}>Set Your Availability</button>
      {error && <div className="error">{error}</div>}

    </form>

     );
}
 
export default AvailabilityForm;