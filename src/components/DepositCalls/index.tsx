import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { BLOCK_CHAIR_URL } from '../../config';
import { RHYTHM } from '../../constants';
import { navigate, Screens } from '../../Router';
import { DepositCallData } from '../../store/depositCalls/models';
import { selectPendingDepositCalls } from '../../store/depositCalls/selectors';
import { Wallets } from '../../store/wallets/models';
import { selectWallets } from '../../store/wallets/selectors';
import { getTimeSince } from '../../utils/getTimeSince';
import { Background } from '../Background';
import Button, { ButtonKinds } from '../Button';
import { HeaderBar } from '../HeaderBar';
import { PageHeader } from '../PageHeader';
import { Table, Column, Row } from '../Table';
import { useLinking } from '../useLinking';

const COLUMNS: Column[] = [
  {
    label: 'Wallet',
    style: {
      flex: 1,
    },
  },
  {
    label: 'Status',
    style: {
      flex: 1,
    },
  },
  {
    label: 'Created',
    style: { flex: 1 },
  },
  {
    label: '',
    style: { flex: 1 },
  },
];

const DepositCallsContainer = styled.View`
  flex: 1;
`;

const ViewButtonContainer = styled.View``;

const CreateNewButtonContainer = styled.View`
  align-items: center;
`;

interface DepositCallsBaseProps {
  rows: Row[];
  onCreateNewDeposit: () => void;
}

const DepositCallsBase = ({
  rows,
  onCreateNewDeposit,
}: DepositCallsBaseProps) => {
  return (
    <Background>
      <HeaderBar showClose />

      <PageHeader>Deposit BTC</PageHeader>

      <DepositCallsContainer>
        <Table
          title="My Pending Deposits"
          columns={COLUMNS}
          rows={rows}
          paddingHorizontal={RHYTHM / 2}
        />
      </DepositCallsContainer>

      <CreateNewButtonContainer>
        <Button kind={ButtonKinds.primary} onPress={onCreateNewDeposit}>
          CREATE NEW DEPOSIT
        </Button>
      </CreateNewButtonContainer>
    </Background>
  );
};

interface DepositCallsProps {}

export const getWalletNameFromDepositCall = (
  wallets: Wallets,
  depositCall: DepositCallData,
): string => {
  return (
    wallets[
      Object.keys(wallets).filter(
        (key) => wallets[key].address === depositCall.walletAddress,
      )[0]
    ]?.name || ''
  );
};

export const DepositCalls = ({}: DepositCallsProps) => {
  const pendingDepositCalls = useSelector(selectPendingDepositCalls);
  const wallets = useSelector(selectWallets);
  const { openLink } = useLinking();

  const onViewDepositCall = useCallback(
    (depositCall: DepositCallData) => {
      const link = `${BLOCK_CHAIR_URL}/${depositCall.walletAddress}`;
      openLink(link);
    },
    [openLink],
  );

  const onCreateNewDeposit = useCallback(() => {
    navigate();
    navigate(Screens.deposit);
  }, []);

  const rows: Row[] = pendingDepositCalls.map((depositCall) => {
    const walletName = getWalletNameFromDepositCall(wallets, depositCall);

    return {
      id: depositCall.id,
      cells: [
        {
          label: walletName,
        },
        {
          label: depositCall.status,
        },
        {
          label: getTimeSince(depositCall.date),
        },
        {
          label: '',
          children: (
            <ViewButtonContainer
              key="button"
              style={COLUMNS[COLUMNS.length - 1].style}>
              <Button
                kind={ButtonKinds.accent}
                onPress={() => onViewDepositCall(depositCall)}
                small>
                VIEW
              </Button>
            </ViewButtonContainer>
          ),
        },
      ],
    };
  });

  return (
    <DepositCallsBase rows={rows} onCreateNewDeposit={onCreateNewDeposit} />
  );
};