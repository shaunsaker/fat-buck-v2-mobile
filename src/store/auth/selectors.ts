import { ApplicationState } from '../reducers';

export const selectIsAuthenticated = (state: ApplicationState) => {
  return Boolean(state.auth.uid && state.auth.email && state.auth.phoneNumber);
};

export const selectIsAuthLoading = (state: ApplicationState) =>
  state.auth.loading;

export const selectAuthConfirmationResult = (state: ApplicationState) =>
  state.auth.confirmationResult;

export const selectIsNewUser = (state: ApplicationState) =>
  !state.welcome.hasSeenWelcome;
