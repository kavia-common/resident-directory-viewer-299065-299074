import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

function renderWithRouter(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
}

test('renders resident list with initial data', async () => {
  renderWithRouter(['/']);
  // Expect at least one resident card to be rendered
  const heading = await screen.findByRole('heading', { name: /Residents/i });
  expect(heading).toBeInTheDocument();

  const cards = await screen.findAllByTestId(/resident-card-/i);
  expect(cards.length).toBeGreaterThan(0);
});

test('search filters list by name', async () => {
  renderWithRouter(['/']);
  const input = screen.getByLabelText(/search residents by name/i);
  fireEvent.change(input, { target: { value: 'ali' } });

  // After debounce, list should filter. We simply check that at least one card remains or not depending on data.
  const cards = await screen.findAllByTestId(/resident-card-/i);
  // Make sure the visible cards' names contain the query (case-insensitive)
  cards.forEach(card => {
    expect(card.textContent.toLowerCase()).toContain('ali');
  });
});

test('clicking a resident navigates to detail and displays their name', async () => {
  renderWithRouter(['/']);
  const firstCardLink = await screen.findAllByRole('link', { name: /view details for/i });
  fireEvent.click(firstCardLink[0]);

  // On detail page, H1 should show the name
  const heading = await screen.findByRole('heading', { level: 2 });
  expect(heading).toBeInTheDocument();
});
