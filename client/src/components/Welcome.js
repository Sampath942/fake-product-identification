import { Link } from "react-router-dom";



const Welcome = () => {
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center">
        <Link to="/add"><button className="btn btn-primary m-2">Add Item</button></Link>
        <Link to="/list"><button className="btn btn-primary m-2">List Items</button></Link>
        <Link to="/scan"><button className="btn btn-primary m-2">Scan QR</button></Link>
      </div>
    </div>
    );

}

export default Welcome;