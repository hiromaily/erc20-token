import Web3 from 'web3';
//import { TransactionConfig } from 'web3-core';
import { TransactionReceipt, TransactionConfig } from 'web3-core';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import HyToken from '../build/contracts/HyToken.json';

const web3: Web3 = new Web3('http://127.0.0.1:7545');
web3.eth.handleRevert = true;

const contractAbi: AbiItem[] = HyToken.abi as AbiItem[];
const conAddress = '0x014C2061ba81a6Da4b8dD32b1322598D99B711D0';
const contract: Contract = new web3.eth.Contract(contractAbi, conAddress);

const callBalanceOf = async (
  owner: string,
  account: string
): Promise<string> => {
  const txObject: TransactionConfig = {
    from: owner,
    to: conAddress,
    data: contract.methods.balanceOf(account).encodeABI() as string,
  } as TransactionConfig;
  return await web3.eth.call(txObject);
};
  
const callTransfer = async (
  from: string,
  to: string,
  amount: number
): Promise<TransactionReceipt> => {
  const txObject: TransactionConfig = {
    from: from,
    to: conAddress,
    data: contract.methods.transfer(to, amount).encodeABI() as string,
  } as TransactionConfig;
  return await web3.eth.sendTransaction(txObject);
};

// WIP
// const callTransferFrom = async (
//   from: string,
//   to: string,
//   amount: number
// ): Promise<TransactionReceipt> => {
//   const txObject: TransactionConfig = {
//     from: from,
//     to: conAddress,
//     data: contract.methods.transferFrom(from, to, amount).encodeABI() as string,
//   } as TransactionConfig;
//   return await web3.eth.sendTransaction(txObject);
// };

const main = async (): Promise<void> => {
  const owner = '0xd0446b3eD62f23815bE724C17e34C0617A186e34';
  try {
    console.log(`command: ${process.argv[2]}`);
    switch (process.argv[2]) {
      case 'balance': {
        // validate args
        if (process.argv.length != 4 || process.argv[3] == '') {
          console.error('4th args for target address is required');
          break;
        }
        const targetAddr: string = process.argv[3];
        const hexBalance: string = await callBalanceOf(owner, targetAddr);
        console.log(`balance: ${parseInt(hexBalance, 16)}`);
        break;
      }
      case 'transfer': {
        // validate args
        if (
          process.argv.length != 5 ||
          process.argv[3] == '' ||
          process.argv[4] == ''
        ) {
          console.error(
            '4th args for target address and 5th args for amount is required'
          );
          break;
        }
        const resultJSON = await callTransfer(
          owner,
          process.argv[3],
          Number(process.argv[4])
        );
        console.log('result:', resultJSON);
        break;
      }
    }
  } catch (e) {
    console.log('error in main: ', e);
    console.dir(e);
  }
  //when calling callReturnParam()
  //Error: Error: Returned error: execution reverted
};
if (process.argv.length < 3) {
  console.error('run with parameter: [balance, transfer]');
} else {
  void main();
}
