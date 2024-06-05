---
ms.service: azure-policy
ms.topic: include
ms.date: 05/30/2024
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fca88aadc-6e2b-416c-9de2-5a0f01d1693f) |Although a virtual machine's OS and data disks are encrypted-at-rest by default using platform managed keys; resource disks (temp disks), data caches, and data flowing between Compute and Storage resources are not encrypted. Use Azure Disk Encryption or EncryptionAtHost to remediate. Visit [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) to compare encryption offerings. This policy requires two prerequisites to be deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). |AuditIfNotExists, Disabled |[1.2.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/LinuxVMEncryption_AINE.json) |
