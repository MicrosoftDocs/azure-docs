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
|[\[Preview\]: Linux virtual machines should enable Azure Disk Encryption or EncryptionAtHost.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fca88aadc-6e2b-416c-9de2-5a0f01d1693f) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys; temp disks and data caches aren't encrypted, and data isn't encrypted when flowing between compute and storage resources. Use Azure Disk Encryption or EncryptionAtHost to encrypt all this data.Visit [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) to compare encryption offerings. This policy requires two prerequisites to be deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). |AuditIfNotExists, Disabled |[1.1.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_LinuxVMEncryption_AINE.json) |
|[\[Preview\]: Windows virtual machines should enable Azure Disk Encryption or EncryptionAtHost.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3dc5edcd-002d-444c-b216-e123bbfa37c0) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys; temp disks and data caches aren't encrypted, and data isn't encrypted when flowing between compute and storage resources. Use Azure Disk Encryption or EncryptionAtHost to encrypt all this data.Visit [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) to compare encryption offerings. This policy requires two prerequisites to be deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). |AuditIfNotExists, Disabled |[1.1.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsVMEncryption_AINE.json) |
