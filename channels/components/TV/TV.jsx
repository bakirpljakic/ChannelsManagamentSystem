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
    const channelName = 'TV'; // This could also be dynamic if needed
    try {
      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/channel/${channelName}/campaigns`, {
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


  const handleDownload = (campaignId) => {
    const url = `https://marketing-campaign-management-system-server.vercel.app/request-campaign/${campaignId}/media/download`;

    fetch(url, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "campaign_media";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading the file:', error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="campaigns-container">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="campaign-card">
          <h3>{campaign.name}</h3>
          <p>Region: {campaign.region}</p>
          <p>Media type: {campaign.mediatypes}</p>
          <button className="button details">Details</button>
          <button className="button download" onClick={() => handleDownload(campaign.id)}>Download</button>
        </div>
      ))}
    </div>
  );
}

export default TV;
