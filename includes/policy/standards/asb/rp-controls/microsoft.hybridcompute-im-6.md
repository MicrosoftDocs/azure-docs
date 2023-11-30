---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/21/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authentication to Linux machines should require SSH keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F630c64f9-8b6b-4c64-b511-6544ceff6fd6) |Although SSH itself provides an encrypted connection, using passwords with SSH still leaves the VM vulnerable to brute-force attacks. The most secure option for authenticating to an Azure Linux virtual machine over SSH is with a public-private key pair, also known as SSH keys. Learn more: [https://docs.microsoft.com/azure/virtual-machines/linux/create-ssh-keys-detailed](../../../../../articles/virtual-machines/linux/create-ssh-keys-detailed.md). |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_LinuxNoPasswordForSSH_AINE.json) |
