import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';
//import { TransactionReceipt, TransactionConfig } from 'web3-core';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import HyToken from '../build/contracts/HyToken.json';

const web3: Web3 = new Web3('http://127.0.0.1:7545');
web3.eth.handleRevert = true;

const contractAbi: AbiItem[] = HyToken.abi as AbiItem[];
const conAddress = '0x014C2061ba81a6Da4b8dD32b1322598D99B711D0';
const contract: Contract = new web3.eth.Contract(contractAbi, conAddress);

// const callUpdateCounter = async (
//   owner: string,
//   count: number
// ): Promise<TransactionReceipt> => {
//   const txObject: TransactionConfig = {
//     from: owner,
//     to: conAddress,
//     data: contract.methods.updateCounter(count).encodeABI() as string,
//   } as TransactionConfig;
//   return await web3.eth.sendTransaction(txObject);
// };

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

const main = async (): Promise<void> => {
  const owner = '0xd0446b3eD62f23815bE724C17e34C0617A186e34';
  try {
    console.log(`command: ${process.argv[2]}`);
    switch (process.argv[2]) {
      case 'balance': {
        const txHash: string = await callBalanceOf(owner, owner);
        console.log(`tx hash: ${txHash}`);
        break;
      }
      case 'update':
        console.log('update');
        //const txHash = await callUpdateCounter(owner, 1);
        break;
    }
  } catch (e) {
    console.log('error in main: ', e);
    console.dir(e);
  }
  //when calling callReturnParam()
  //Error: Error: Returned error: execution reverted
};
if (process.argv.length != 3) {
  console.error('run with parameter: balance, ');
} else {
  void main();
}
console.log(process.argv);
