import { CompilerConfig } from '@ton-community/blueprint';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { compile as compileFunc } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    preCompileHook: async () => {
        await compileFunc('VoteKeeper');
    },

    targets: ['contracts/auto/vote-keeper-code.func',
              'contracts/jetton-wallet.func'],

    postCompileHook: async (code) => {
        const auto = path.join(__dirname, '..', 'contracts', 'auto');
        await mkdir(auto, { recursive: true });
        await writeFile(path.join(auto, 'jetton-wallet-code.func'), `cell jetton_wallet_code() asm "B{${code.toBoc().toString('hex')}} B>boc PUSHREF";`);
    }
};
