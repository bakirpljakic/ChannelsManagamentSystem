import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import Details from '../components/Details/Details';

describe('Details component', () => {
  it('renders loading state initially', () => {
    render(<Details />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders campaign details correctly after loading', async () => {
    // Simulacija podataka za kampanju i medije
    const mockCampaign = {
      id: 1,
      name: 'Campaign 1',
      channels: 'Channel 1',
      mediatypes: 'Type 1',
      durationfrom: '01.01.2022',
      durationto: '31.01.2022',
    };
    const mockMedia = [
      { id: 1, type: 'banner', url: 'banner-url', banner_link: 'banner-link' },
      { id: 2, type: 'text', text: 'Text media' },
    ];

    // Simulacija fetch poziva
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ campaign: [mockCampaign] }),
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMedia),
    });

    render(<Details />);

    // Provera da li je Loading poruka nestala
    await screen.findByText('Campaign 1');
    expect(screen.getByText('Campaign 1')).toBeTruthy();
    expect(screen.getByText('Text media')).toBeTruthy();
  });
});
