---
author: timwarner-msft
ms.service: azure-policy
ms.topic: include
ms.date: 02/14/2023
ms.author: timwarner
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Linux machines should encrypt temp disks, caches, and data flows between Compute and Storage resources.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fca88aadc-6e2b-416c-9de2-5a0f01d1693f) |Requires that prerequisites are deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). Use Azure Disk Encryption or Encryption At Host to protect your virtual machine's OS and data disks, temp disks, data caches and any data flowing between compute and storage. To learn more about different disk encryption offerings, see [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison). |AuditIfNotExists, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_LinuxVMEncryption_AINE.json) |
|[\[Preview\]: Windows machines should encrypt temp disks, caches, and data flows between Compute and Storage resources.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3dc5edcd-002d-444c-b216-e123bbfa37c0) |Requires that prerequisites are deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). Use Azure Disk Encryption or Encryption At Host to protect your virtual machine's OS and data disks, temp disks, data caches and any data flowing between compute and storage. To learn more about different disk encryption offerings, see [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison). |AuditIfNotExists, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsVMEncryption_AINE.json) |
