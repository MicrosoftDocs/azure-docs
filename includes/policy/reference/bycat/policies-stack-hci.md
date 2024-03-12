---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 02/27/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Azure Stack HCI servers should have consistently enforced application control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7384fde3-11b0-4047-acbd-b3cf3cc8ce07) |At a minimum, apply the Microsoft WDAC base policy in enforced mode on all Azure Stack HCI servers. Applied Windows Defender Application Control (WDAC) policies must be consistent across servers in the same cluster. |Audit, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/WdacCompliance_Audit.json) |
|[\[Preview\]: Azure Stack HCI servers should meet Secured-core requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F56c47221-b8b7-446e-9ab7-c7c9dc07f0ad) |Ensure that all Azure Stack HCI servers meet the Secured-core requirements. To enable the Secured-core server requirements: 1. From the Azure Stack HCI clusters page, go to Windows Admin Center and select Connect. 2. Go to the Security extension and select Secured-core. 3. Select any setting that is not enabled and click Enable. |Audit, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/SecuredCoreCompliance_Audit.json) |
|[\[Preview\]: Azure Stack HCI systems should have encrypted volumes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae95f12a-b6fd-42e0-805c-6b94b86c9830) |Use BitLocker to encrypt the OS and data volumes on Azure Stack HCI systems. |Audit, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/DataAtRestEncrypted_Audit.json) |
|[\[Preview\]: Host and VM networking should be protected on Azure Stack HCI systems](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faee306e7-80b0-46f3-814c-d3d3083ed034) |Protect data on the Azure Stack HCI hosts network and on virtual machine network connections. |Audit, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stack%20HCI/DataInTransitProtected_Audit.json) |
