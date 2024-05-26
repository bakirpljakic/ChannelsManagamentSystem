import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import Display from '../components/Display/Display';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

describe('Display component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<Display />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message if fetching campaigns fails', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch campaigns'));

    render(<Display />);
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch campaigns')).toBeInTheDocument();
    });
  });

  it('renders campaigns correctly after loading', async () => {
    const mockCampaigns = [
      { id: 1, name: 'Campaign 1', region: 'Region 1', mediatypes: 'Type 1' },
      { id: 2, name: 'Campaign 2', region: 'Region 2', mediatypes: 'Type 2' },
    ];
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCampaigns),
    });

    render(<Display />);

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
    });
  });

  it('handles download button click', async () => {
    const mockCampaigns = [{ id: 1, name: 'Campaign 1', region: 'Region 1', mediatypes: 'Type 1' }];
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCampaigns),
    });

    const { getByText } = render(<Display />);

    await waitFor(() => {
      fireEvent.click(getByText('Download'));
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles details button click', async () => {
    const mockCampaigns = [{ id: 1, name: 'Campaign 1', region: 'Region 1', mediatypes: 'Type 1' }];
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCampaigns),
    });

    const { getByText } = render(
      <MemoryRouter>
        <Display />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(getByText('Details'));
    });

    expect(Cookies.set).toHaveBeenCalledTimes(1);
    expect(Cookies.set).toHaveBeenCalledWith('selectedCampaignId', 1, { expires: 1 });
  });
});
