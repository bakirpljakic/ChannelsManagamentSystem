import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie'; // Uvozimo js-cookie biblioteku
import './Details.css';

const Details = () => {
  const [campaign, setCampaign] = useState(null);
  const [media, setMedia] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  useEffect(() => {
    const getCampaignById = async (id) => {
      try {
        const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/campaign/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch campaign by ID');
        }

        const data = await response.json();
        const formattedCampaign = {
          ...data.campaign[0],
          durationfrom: formatDate(data.campaign[0].durationfrom),
          durationto: formatDate(data.campaign[0].durationto),
        };
        setCampaign(formattedCampaign);

        // Pozovi funkciju za dohvat medijskih podataka kampanje
        getCampaignMedia(id);
      } catch (error) {
        console.error('Error fetching campaign by ID:', error);
      }
    };

    const getCampaignMedia = async (campaignId) => {
      try {
        const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/campaignmedia/${campaignId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign media');
        }
        const mediaData = await response.json();
        setMedia(mediaData);
      } catch (error) {
        console.error('Error fetching campaign media:', error);
      }
    };

    const storedCampaignId = Cookies.get('selectedCampaignId');
    if (storedCampaignId) {
      getCampaignById(storedCampaignId);
    }
  }, []);

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div className="unique-campaign-container">
      <table>
        <tbody>
          <tr>
            <td style={{ width: "350px", verticalAlign: "middle" }}>
              {campaign ? (
                <div className="campaign-details">
                  <p>
                    Name:
                    <input type="text" value={campaign.name} readOnly />
                  </p>
                  <p>
                    Channel:
                    <input type="text" value={campaign.channels} readOnly />
                  </p>
                  <p>
                    Media Type:
                    <input type="text" value={campaign.mediatypes} readOnly />
                  </p>
                  <p>
                    Duration Start:
                    <input type="text" value={campaign.durationfrom} readOnly />
                  </p>
                  <p>
                    Duration End:
                    <input type="text" value={campaign.durationto} readOnly />
                  </p>
                </div>
              ) : (
                <p className="loading">Loading...</p>
              )}
            </td>
            <td className="media-container">
              {media.map((item) => (
                <div key={item.id} className="media-card">
                  {item.type.toLowerCase() === 'banner' ? (
                    <a href={item.banner_link} target="_blank" rel="noopener noreferrer">
                      <img src={item.url} alt={item.type} style={{ width: "100%" }} />
                    </a>
                  ) : item.type.toLowerCase() === 'text' ? (
                    <p>{item.text}</p>
                  ) : item.type.toLowerCase() === 'link' ? (
                    <a href={item.text} target="_blank" rel="noopener noreferrer">
                      {item.text}
                    </a>
                  ) : item.type.toLowerCase() === 'video' ? (
                    <video controls width="250" height="200">
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : item.type.toLowerCase() === 'audio' ? (
                    <iframe title={item.type} src={item.url} width="250" height="50"></iframe>
                  ) : (
                    <img src={item.url} alt={item.type} style={{ width: "100%" }} />
                  )}
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Details;
