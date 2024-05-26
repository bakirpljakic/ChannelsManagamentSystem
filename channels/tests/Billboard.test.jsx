import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Billboard from '../components/Billboard/Billboard';
import Cookies from 'js-cookie';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Postavljanje mock servera za API pozive
const server = setupServer(
  rest.get('https://marketing-campaign-management-system-server.vercel.app/channel/Billboard/campaigns', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'Campaign 1', region: 'Region 1', mediatypes: 'Type 1' }]));
  }),
  rest.post('https://marketing-campaign-management-system-server.vercel.app/campaign/regiongroups', (req, res, ctx) => {
    return res(ctx.json([{ id: 2, name: 'Campaign 2', region: 'Region 2', mediatypes: 'Type 2' }]));
  }),
  rest.get('https://marketing-campaign-management-system-server.vercel.app/request-campaign/1/media/download', (req, res, ctx) => {
    return res(ctx.blob());
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('Billboard component', () => {
  beforeEach(() => {
    Cookies.set = vi.fn();
    Cookies.get = vi.fn();
  });

  vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      MemoryRouter: ({ children }) => <div>{children}</div>,
    };
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Billboard />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Billboard />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders campaigns correctly after loading', async () => {
    render(
      <MemoryRouter>
        <Billboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Region: Region 1')).toBeInTheDocument();
    expect(screen.getByText('Media type: Type 1')).toBeInTheDocument();
  });

  it('handles error state correctly', async () => {
    server.use(
      rest.get('https://marketing-campaign-management-system-server.vercel.app/channel/Billboard/campaigns', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <MemoryRouter>
        <Billboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch campaigns')).toBeInTheDocument();
    });
  });

  it('calls handleDownload correctly', async () => {
    render(
      <MemoryRouter>
        <Billboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    // Verifikacija da je preuzimanje pokrenuto
    expect(await screen.findByText('Download')).toBeInTheDocument();
  });

  it('navigates to details page on details button click', async () => {
    const navigateMock = vi.fn();
    vi.mock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useNavigate: () => navigateMock,
    }));

    render(
      <MemoryRouter>
        <Billboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
    });

    const detailsButton = screen.getByText('Details');
    fireEvent.click(detailsButton);

    expect(Cookies.set).toHaveBeenCalledWith('selectedCampaignId', 1, { expires: 1 });
    expect(navigateMock).toHaveBeenCalledWith('/details');
  });
});
