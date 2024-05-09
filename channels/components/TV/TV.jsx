import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Uvozimo js-cookie biblioteku
import './TV.css';

function TV() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const regionId = Cookies.get('selectedRegionId'); // Učitavanje ID-a regiona iz cookie-ja
    if (regionId) {
      getCampaignsByGroup(regionId);
    } else {
      getAllCampaigns(); // Učitavanje svih kampanja ako nije odabrana specifična regija
    }
  }, []);

  const getAllCampaigns = async () => {
    const channelName = 'TV';
    try {
      const response = await fetch(`http://localhost:3000/channel/${channelName}/campaigns`, {
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

  const getCampaignsByGroup = async (regionId) => {
    const channelName = 'TV';

    try {
      const response = await fetch(`http://localhost:3000/campaign/regiongroups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ group_id: regionId, channel: channelName }) // Dodajemo ime kanala u tijelo zahtjeva
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns for the selected region');
      }

      const campaignData = await response.json();
      setCampaigns(campaignData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns for the selected region:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDownload = (campaignId) => {
    const url = `http://localhost:3000/request-campaign/${campaignId}/media/download`;

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

  const handleDetailsClick = (campaignId) => {
    Cookies.set('selectedCampaignId', campaignId, { expires: 1 });
    navigate(`/details`);
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
          <button
            className="button details"
            onClick={() => handleDetailsClick(campaign.id)}
          >
            Details
          </button>
          <button className="button download" onClick={() => handleDownload(campaign.id)}>Download</button>
        </div>
      ))}
    </div>
  );
}

export default TV;
