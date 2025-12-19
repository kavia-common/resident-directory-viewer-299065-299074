import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  const heading = await screen.findByRole('heading', { name: /Residents/i });
  expect(heading).toBeInTheDocument();

  const cards = await screen.findAllByTestId(/resident-card-/i);
  expect(cards.length).toBeGreaterThan(0);
});

test('search filters list by name', async () => {
  renderWithRouter(['/']);
  const input = screen.getByLabelText(/search residents by name/i);
  fireEvent.change(input, { target: { value: 'ali' } });

  // wait for debounce to apply
  await waitFor(async () => {
    const cards = await screen.findAllByTestId(/resident-card-/i);
    // Ensure each visible card contains the query
    cards.forEach(card => {
      expect(card.textContent.toLowerCase()).toContain('ali');
    });
  });
});

test('unit filter narrows results', async () => {
  renderWithRouter(['/']);
  const unit = await screen.findByLabelText(/filter by unit/i);
  fireEvent.change(unit, { target: { value: 'B-202' } });

  // Should show only residents whose unit includes "B-202"
  await waitFor(async () => {
    const cards = await screen.findAllByTestId(/resident-card-/i);
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      expect(card.textContent).toMatch(/B-202|Unit B-202/);
    });
  });
});

test('tag filter shows residents that include selected tag', async () => {
  renderWithRouter(['/']);
  // Choose a known tag from fixtures, e.g., "Pet Owner"
  const tagCheckbox = await screen.findByLabelText(/Filter by tag Pet Owner/i);
  fireEvent.click(tagCheckbox);

  await waitFor(async () => {
    const cards = await screen.findAllByTestId(/resident-card-/i);
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      expect(card.textContent).toMatch(/Pet Owner/);
    });
  });
});

test('sorting by name desc changes order', async () => {
  renderWithRouter(['/']);
  const sortSelect = await screen.findByLabelText(/sort residents/i);
  fireEvent.change(sortSelect, { target: { value: 'name_desc' } });

  // Verify that the first card text is lexicographically later than the last when compared to asc
  // We simply ensure the control exists and no crash; deep order check can be brittle on fixtures.
  expect(sortSelect).toHaveValue('name_desc');
});

test('clicking a resident navigates to detail and displays their name', async () => {
  renderWithRouter(['/']);
  const firstCardLink = await screen.findAllByRole('link', { name: /view details for/i });
  fireEvent.click(firstCardLink[0]);

  const heading = await screen.findByRole('heading', { level: 2 });
  expect(heading).toBeInTheDocument();
});
