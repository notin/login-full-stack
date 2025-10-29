# Login Frontend Application

A modern React-based authentication and user management frontend application with user profiles, browsing, and search functionality.

## Features

### Authentication
- User registration with email and password
- Secure login with JWT token authentication
- Protected routes with automatic authentication checking
- Persistent session management with localStorage

### User Profile Management
- **Dashboard**: View and edit your profile
  - Name editing
  - Bio/About section
  - Skills/Tools as tags (comma-separated input)
  - Profile image URL with validation
  - Real-time profile updates

### User Browsing & Search
- **Browse Page**: Search and discover other users
  - Search by Name, Email, User ID, or Skills
  - Debounced search (500ms delay for better performance)
  - User cards with profile information
  - Display profile images, bios, and skills

### UI/UX
- Responsive design with modern gradient backgrounds
- Clean and intuitive interface
- Loading states and error handling
- Form validation (URL validation for profile images)
- Active navigation states

## 🛠️ Tech Stack

- **React 18.2** - UI library
- **TypeScript** - Type safety
- **Jotai** - State management (atomic state)
- **Axios** - HTTP client for API requests
- **Webpack 5** - Module bundler
- **Babel** - JavaScript compiler
- **CSS3** - Styling with custom components

##  Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running (see backend README)

##  Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory (optional - defaults to localhost):

```env
REACT_APP_API_URL=http://localhost:2323/api
```

### Running the Application

#### Development Mode (with hot reload)
```bash
npm start
```
or
```bash
npm run start:live
```

The application will be available at `http://localhost:7878`

#### Production Build
```bash
# Build for production
npm run build

# Serve production build locally
npm run build:start
```

##  Project Structure

```
login-front-end/
├── src/
│   ├── components/          # React components
│   │   ├── AuthInitializer.tsx    # Auth state initialization
│   │   ├── Browse.tsx             # User browsing/search component
│   │   ├── Dashboard.tsx          # User dashboard/profile management
│   │   ├── Header.tsx             # Navigation header (when logged in)
│   │   ├── Login.tsx              # Login form
│   │   └── Register.tsx           # Registration form
│   ├── atoms/               # Jotai state atoms
│   │   ├── auth.ts                # Auth state atoms
│   │   └── authActions.ts         # Auth action atoms (login, logout, register)
│   ├── services/            # API services
│   │   └── api.ts                 # Axios API client and endpoints
│   ├── App.tsx              # Main app component with routing logic
│   ├── index.ts             # Entry point
│   └── index.css            # Global styles
├── dist/                    # Production build output
├── webpack.config.js        # Webpack configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

##  Key Components

### Authentication Flow

1. **Login/Register** → Authenticate user
2. **AuthInitializer** → Restore session from localStorage on app load
3. **Protected Routes** → Redirect to login if not authenticated
4. **Dashboard** → Main user area with profile management
5. **Browse** → Search and view other users

### State Management

The app uses **Jotai** for atomic state management:

- `userAtom` - Current user data
- `tokenAtom` - JWT authentication token
- `pageViewAtom` - Current page/view state
- `isAuthenticatedAtom` - Derived authentication status

### API Integration

All API calls go through `src/services/api.ts`:

- **Auth Service**: Login, Register
- **Protected Service**: Get/Update Profile, Search Users, Get Protected Data

##  Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with webpack-dev-server |
| `npm run start:live` | Start dev server with live reload and hot module replacement |
| `npm run build` | Build production bundle |
| `npm run build:dev` | Build development bundle |
| `npm run build:start` | Build and serve production bundle locally |

##  Security Features

- JWT tokens stored in localStorage
- Automatic token refresh handling
- 401/403 error handling with auto-logout
- URL validation for profile images
- Protected routes that require authentication

##  Styling

- Component-specific CSS files
- Modern gradient backgrounds
- Responsive grid layouts
- Hover effects and transitions
- Skill tags display
- Profile image styling with fallbacks

##  API Integration

The frontend expects a backend API running at `http://localhost:2323/api` (or custom URL via env variable).

### Required Endpoints:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/protected/profile` - Get user profile
- `PUT /api/protected/profile` - Update user profile
- `GET /api/protected/search` - Search users (with filter and query params)
- `GET /api/protected/data` - Get protected data

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend is configured to allow requests from `http://localhost:7878`
2. **Authentication not persisting**: Check that localStorage is enabled in browser
3. **API connection errors**: Verify backend is running and `REACT_APP_API_URL` is correct

### Development Tips

- Use browser DevTools to inspect Jotai atoms
- Check Network tab for API request/response debugging
- Console logs are available for auth state debugging

##  License

MIT


---

For backend setup and configuration, see the backend README.

