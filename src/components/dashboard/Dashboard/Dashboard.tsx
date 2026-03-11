import { BookingUsersChart } from './BookingUsersChart'
import RecentActivity from './RecentActivity'
import { RevenueChart } from './RevenueChart'
import StatsCards from './Statics'


const Dashboard = () => {
  return (
    <div className=''>
      <StatsCards />
      <div className="px-5 flex items-center gap-5 -mt-44 mb-6">
        <RevenueChart />
        <BookingUsersChart />
      </div>      
      <RecentActivity />      
    </div>
  )
}

export default Dashboard