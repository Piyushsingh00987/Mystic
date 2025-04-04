
import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';

export function useAuthState() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user state from localStorage
    const currentUser = authService.getCurrentUser();
    
    // Validate token if user exists
    if (currentUser && !authService.validateToken()) {
      // Token has expired, attempt to refresh
      const refreshSuccess = authService.refreshToken();
      if (!refreshSuccess) {
        // If refresh fails, log out
        authService.logout();
        setUser(null);
      } else {
        // Get updated user with new token
        setUser(authService.getCurrentUser());
      }
    } else {
      setUser(currentUser);
    }
    
    setLoading(false);

    // Set up listener for storage events to sync across tabs
    const handleStorageChange = () => {
      const newUser = authService.getCurrentUser();
      setUser(newUser);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check token validity periodically
    const tokenValidator = setInterval(() => {
      if (authService.getCurrentUser() && !authService.validateToken()) {
        const refreshSuccess = authService.refreshToken();
        if (!refreshSuccess) {
          authService.logout();
          setUser(null);
        }
      }
    }, 10 * 60 * 1000); // Check every 10 minutes
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(tokenValidator);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.signUp(name, email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      const result = await authService.socialLogin(provider);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: any) => {
    setLoading(true);
    try {
      const result = await authService.updateUserProfile(userData);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavoriteState = async (stateId: string) => {
    try {
      if (!user) return { success: false, message: "User not authenticated" };
      
      // Check if user has savedStates array
      const savedStates = user.savedStates || [];
      
      // Check if the state is already saved
      const isStateSaved = savedStates.includes(stateId);
      
      // Update the array
      const updatedSavedStates = isStateSaved
        ? savedStates.filter((id: string) => id !== stateId)
        : [...savedStates, stateId];
      
      // Update user profile
      const result = await authService.updateUserProfile({
        ...user,
        savedStates: updatedSavedStates,
      });
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      
      return {
        success: result.success,
        message: isStateSaved 
          ? "State removed from favorites" 
          : "State added to favorites",
        user: result.user
      };
    } catch (error) {
      console.error("Toggle favorite error:", error);
      return { 
        success: false, 
        message: "Failed to update favorite states"
      };
    }
  };

  const addTrip = async (trip: any) => {
    try {
      if (!user) return { success: false, message: "User not authenticated" };
      
      // Check if user has trips array
      const trips = user.trips || [];
      
      // Generate a new ID for the trip
      const newTripId = trips.length > 0 
        ? Math.max(...trips.map((t: any) => t.id)) + 1 
        : 1;
      
      // Add new trip with ID
      const newTrip = { ...trip, id: newTripId };
      
      // Update user profile
      const result = await authService.updateUserProfile({
        ...user,
        trips: [...trips, newTrip],
        recentActivities: [
          { 
            id: Date.now(),
            type: 'trip_added',
            description: `Added a trip to ${trip.destination}`,
            date: new Date().toISOString()
          },
          ...(user.recentActivities || []).slice(0, 4) // Keep only the 5 most recent activities
        ]
      });
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error("Add trip error:", error);
      return { 
        success: false, 
        message: "Failed to add trip"
      };
    }
  };

  const deleteTrip = async (tripId: number) => {
    try {
      if (!user) return { success: false, message: "User not authenticated" };
      
      // Check if user has trips array
      const trips = user.trips || [];
      
      // Find the trip to be deleted
      const tripToDelete = trips.find((t: any) => t.id === tripId);
      
      if (!tripToDelete) {
        return { success: false, message: "Trip not found" };
      }
      
      // Filter out the trip to be deleted
      const updatedTrips = trips.filter((t: any) => t.id !== tripId);
      
      // Update user profile
      const result = await authService.updateUserProfile({
        ...user,
        trips: updatedTrips,
        recentActivities: [
          { 
            id: Date.now(),
            type: 'trip_deleted',
            description: `Removed a trip to ${tripToDelete.destination}`,
            date: new Date().toISOString()
          },
          ...(user.recentActivities || []).slice(0, 4) // Keep only the 5 most recent activities
        ]
      });
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error("Delete trip error:", error);
      return { 
        success: false, 
        message: "Failed to delete trip"
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Dispatch a storage event to sync across tabs
    window.dispatchEvent(new Event('storage'));
  };

  return { 
    user, 
    loading, 
    login,
    signUp,
    socialLogin,
    updateProfile,
    toggleFavoriteState,
    addTrip,
    deleteTrip,
    logout, 
    isAuthenticated: !!user 
  };
}
