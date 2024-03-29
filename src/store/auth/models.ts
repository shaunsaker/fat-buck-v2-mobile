import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export enum AuthActionTypes {
  INITIATE_SIGN_IN = '@@auth/INITIATE_SIGN_IN',
  INITIATE_SIGN_IN_SUCCESS = '@@auth/INITIATE_SIGN_IN_SUCCESS',
  SIGN_IN = '@@auth/SIGN_IN',
  SIGN_IN_SUCCESS = '@@auth/SIGN_IN_SUCCESS',
  SIGN_IN_ERROR = '@@auth/SIGN_IN_ERROR',
  SIGN_OUT = '@@auth/SIGN_OUT',
  SIGN_OUT_SUCCESS = '@@auth/SIGN_OUT_SUCCESS',
  SIGN_OUT_ERROR = '@@auth/SIGN_OUT_ERROR',
  SEND_PASSWORD_RESET_EMAIL = '@@auth/SEND_PASSWORD_RESET_EMAIL',
  SEND_PASSWORD_RESET_EMAIL_SUCCESS = '@@auth/SEND_PASSWORD_RESET_EMAIL_SUCCESS',
  SEND_PASSWORD_RESET_EMAIL_ERROR = '@@auth/SEND_PASSWORD_RESET_EMAIL_ERROR',
}

export interface AuthState extends FirebaseAuthTypes.User {
  loading: boolean;
  confirmationResult: FirebaseAuthTypes.ConfirmationResult | undefined;
}
