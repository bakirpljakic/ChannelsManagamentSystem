import React, { useState, useEffect } from 'react';
import './TV.css';

function TV() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllCampaigns();
  }, []);

  const getAllCampaigns = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server.vercel.app/campaign', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const campaignData = await response.json();
      setCampaigns(campaignData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="campaigns-container">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="campaign-card">
          <h3>{campaign.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default TV;
