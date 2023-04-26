import { Beget } from './lib/beget.js';

const beget = new Beget();
await beget.getToken();
// console.log(await beget.getToken());
// console.log(await beget.revokeToken());
// console.log(await beget.getVPSconfig());
// console.log(await beget.getPOlist());
// console.log(await beget.getSSHkeysList());
// console.log(await beget.getNetworks());
// console.log(await beget.createVPS());
// console.log(await beget.deleteVPS('6e01d119-bd4b-4e29-bb53-77573221ab0d'));
// console.log(await beget.getVPSlist());

console.log(await beget.createVPS2('ans1'));
console.log(await beget.createVPS2('ans2'));
console.log(await beget.createVPS2('ans3'));
await beget.generateConfigSSH();

await beget.generateConfigSSH(
  '\\\\wsl.localhost\\Ubuntu-20.04\\root\\.ssh\\config',
  '\\\\wsl.localhost\\Ubuntu-20.04\\root\\.ssh\\known_hosts',
  true,
);

// await beget.generateAnsibleIP();
await beget.generateAnsibleIP2();

// console.log(await beget.deleteAll_VPS());
