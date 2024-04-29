import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Uzmi funkciju za formatiranje datuma

const Details = () => {
  const { campaignId } = useParams(); // Dobivanje ID kampanje iz URL-a
  const [campaign, setCampaign] = useState(null);

  // Funkcija za formatiranje datuma
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  useEffect(() => {
    // Funkcija za dohvaćanje detalja kampanje s odgovarajućim ID-om
    const getCampaignById = async (id) => {
      try {
        const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/campaign/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch campaign by ID');
        }

        const data = await response.json();
        const formattedCampaign = {
          ...data.campaign[0],
          durationfrom: formatDate(data.campaign[0].durationfrom), // Formatiraj datum po potrebi
          durationto: formatDate(data.campaign[0].durationto), // Formatiraj datum po potrebi
        };
        setCampaign(formattedCampaign);
      } catch (error) {
        console.error('Error fetching campaign by ID:', error);
      }
    };

    if (campaignId) {
      getCampaignById(campaignId);
    }
  }, [campaignId]);

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div className="campaign-details">
      <h2>Campaign Details</h2>
      <p>
        <strong>Name:</strong> {campaign.name}
      </p>
      <p>
        <strong>Channel:</strong> {campaign.channels}
      </p>
      <p>
        <strong>Media Type:</strong> {campaign.mediatypes}
      </p>
      <p>
        <strong>Duration Start:</strong> {campaign.durationfrom}
      </p>
      <p>
        <strong>Duration End:</strong> {campaign.durationto}
      </p>
      {/* Dodaj dodatne detalje kampanje prema potrebi */}
    </div>
  );
};

export default Details;
