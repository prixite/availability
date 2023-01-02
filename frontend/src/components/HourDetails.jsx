/* eslint-disable */

const HoursDetails = ({ user }) => {
    return ( 
        <table style={{ width: "34%", margin: "auto", marginBottom: "40px" }}>
        <thead>
          <th style={{ height: "40px", border: "1px solid #1aac83" }}> Weekly Hours </th>
          <th style={{ height: "40px", border: "1px solid #1aac83" }}> Monthly Hours </th>
        </thead>
        <tbody>
          <tr>
            <td style={{ height: "40px" }}>{user.monthAvailableHours}</td>
            <td style={{ height: "40px" }}>{user.name}</td>
          </tr>
        </tbody>
      </table>
     );
}
 
export default HoursDetails;