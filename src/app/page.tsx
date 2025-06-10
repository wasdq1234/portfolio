import { getProfileWithCareers } from '@/lib/database';
import Portfolio from '@/components/Portfolio';

export default async function Home() {
  const profileData = await getProfileWithCareers();

  return <Portfolio profileData={profileData} />;
}
