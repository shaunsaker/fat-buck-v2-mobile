import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { RHYTHM } from '../../constants';
import { ScreenRouteProps, Screens } from '../../Router';
import { deleteWallet, saveWallet } from '../../store/actions';
import { navigate } from '../../store/navigation/actions';
import { WalletData, WalletId } from '../../store/wallets/models';
import { selectWalletsLoading } from '../../store/wallets/selectors';
import { getDate } from '../../utils/getDate';
import { getUniqueId } from '../../utils/getUniqueId';
import { Background } from '../Background';
import Button, { ButtonKinds } from '../Button';
import { HeaderBar } from '../HeaderBar';
import { Input } from '../Input';
import { InputContainer } from '../InputContainer';
import { PageHeader } from '../PageHeader';

const EditWalletContainer = styled.View`
  flex: 1;
  align-items: center;
  padding: 0 ${RHYTHM}px ${RHYTHM}px;
`;

const TextInputContainer = styled.View`
  margin-bottom: ${RHYTHM}px;
`;

const CaptureQRCodeButtonContainer = styled.View``;

const SubmitButtonContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const DeleteButtonContainer = styled.View`
  margin-bottom: ${RHYTHM}px;
`;

export const NAME_INPUT_PLACEHOLDER_TEXT = 'Enter your wallet name...';
export const ADDRESS_INPUT_PLACEHOLDER_TEXT = 'Enter your wallet address...';
export const QR_CODE_BUTTON_TEXT = 'CAPTURE QR CODE INSTEAD';
export const DELETE_BUTTON_TEXT = 'DELETE';
export const SUBMIT_BUTTON_TEXT = 'SUBMIT';

interface EditWalletBaseProps {
  name: string;
  address: string;
  isNewWallet: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  onChangeName: (text: string) => void;
  onChangeAddress: (text: string) => void;
  onCaptureQRCode: () => void;
  onSubmit: () => void;
  onDelete: () => void;
}

const EditWalletBase = ({
  name,
  address,
  isNewWallet,
  isLoading,
  isDisabled,
  onChangeName,
  onChangeAddress,
  onCaptureQRCode,
  onSubmit,
  onDelete,
}: EditWalletBaseProps) => {
  return (
    <Background>
      <HeaderBar showClose />

      <InputContainer>
        <PageHeader>{isNewWallet ? 'Add' : 'Edit'} Wallet</PageHeader>

        <EditWalletContainer>
          <TextInputContainer>
            <Input
              placeholder={NAME_INPUT_PLACEHOLDER_TEXT}
              value={name}
              autoFocus
              onChangeText={onChangeName}
            />
          </TextInputContainer>

          <TextInputContainer>
            <Input
              placeholder={ADDRESS_INPUT_PLACEHOLDER_TEXT}
              value={address}
              onChangeText={onChangeAddress}
            />
          </TextInputContainer>

          <CaptureQRCodeButtonContainer>
            <Button
              kind={ButtonKinds.accentFilled}
              small
              onPress={onCaptureQRCode}>
              {QR_CODE_BUTTON_TEXT}
            </Button>
          </CaptureQRCodeButtonContainer>

          <SubmitButtonContainer>
            {!isNewWallet ? (
              <DeleteButtonContainer>
                <Button
                  kind={ButtonKinds.danger}
                  disabled={isLoading}
                  onPress={onDelete}>
                  {DELETE_BUTTON_TEXT}
                </Button>
              </DeleteButtonContainer>
            ) : null}

            <Button
              kind={ButtonKinds.primary}
              loading={isLoading}
              disabled={isDisabled}
              onPress={onSubmit}>
              {SUBMIT_BUTTON_TEXT}
            </Button>
          </SubmitButtonContainer>
        </EditWalletContainer>
      </InputContainer>
    </Background>
  );
};

export interface EditWalletProps {
  route: ScreenRouteProps<Screens.editWallet>;
}

export const EditWallet = ({ route }: EditWalletProps) => {
  const [name, setName] = useState(route.params?.name || '');
  const [address, setAddress] = useState(route.params?.address || '');
  const dispatch = useDispatch();
  const isNewWallet = !route.params?.name;
  const isLoading = useSelector(selectWalletsLoading);
  const isDisabled = !name || !address || isLoading;

  useEffect(() => {
    // if the route updates with the address, ie. from QRCode
    if (route.params?.address) {
      setAddress(route.params?.address);
    }
  }, [route.params]);

  const onChangeName = useCallback((text: string) => {
    setName(text);
  }, []);

  const onChangeAddress = useCallback((text: string) => {
    setAddress(text);
  }, []);

  const onCaptureQRCode = useCallback(() => {
    dispatch(navigate(Screens.QRCodeScanner));
  }, [dispatch]);

  const onSubmit = useCallback(() => {
    const id = route.params?.id || getUniqueId();
    const dateAdded = getDate();
    const wallet: WalletData = {
      id,
      name,
      address,
      dateAdded,
    };
    dispatch(saveWallet(wallet));
  }, [dispatch, name, address, route.params]);

  const onDelete = useCallback(() => {
    const id = route.params?.id as WalletId;
    dispatch(deleteWallet(id));
  }, [dispatch, route.params]);

  return (
    <EditWalletBase
      name={name}
      address={address}
      onChangeName={onChangeName}
      onChangeAddress={onChangeAddress}
      isNewWallet={isNewWallet}
      isLoading={isLoading}
      isDisabled={isDisabled}
      onCaptureQRCode={onCaptureQRCode}
      onSubmit={onSubmit}
      onDelete={onDelete}
    />
  );
};
