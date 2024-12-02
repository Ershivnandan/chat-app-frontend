import { useAuth } from "../../context/AuthContext"


const Dashboard = () => {

  const {logout} = useAuth();
  return (
    <div>
      Dashboard Works

      <button onClick={logout} className="px-2 py-1 rounded-lg bg-blue-500">Log out</button>
    </div>
  )
}

export default Dashboard
