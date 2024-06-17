import React from 'react';
import { render, screen} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProfilePage from '../ProfilePage';
import { GET_USER_ID, USER_DETAILS } from '../../common/constants/url_constants';
describe('ProfilePage Component', () => {
  beforeEach(() => {
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', { value: mockStorage });
  });

  it('redirects to login when no JWT token is present', async () => {
    sessionStorage.getItem = jest.fn(() => null);

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const loginPage = await screen.findByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });

  it('renders profile details after successful API calls', async () => {
    const mockUserId = 'mockUserId';
    const mockUserDetails = {
      username: 'John Doe',
      image: 'avatar.jpg',
    };

    sessionStorage.getItem = jest.fn(() => 'mockToken');

    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url === GET_USER_ID) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUserId),
        } as Response);
      } else if (url === `${USER_DETAILS}/${mockUserId}`) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUserDetails),
        } as Response);
      }
     
      return Promise.resolve({} as Response);
    });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <ProfilePage />
      </MemoryRouter>
    );

    const usernameElement = await screen.findByText('John Doe');
    const avatarElement = screen.getByAltText('avatar');

    expect(usernameElement).toBeInTheDocument();
    expect(avatarElement).toBeInTheDocument();
  });

});
