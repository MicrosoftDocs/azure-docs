---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 01/02/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[ElasticSan Volume Group should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7698f4ed-80ce-4e13-b408-ee135fa400a5) |Use customer-managed keys to manage the encryption at rest of your VolumeGroup. By default, customer data is encrypted with platform-managed keys, but CMKs are commonly required to meet regulatory compliance standards. Customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you, with full control and responsibility, including rotation and management. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/ElasticSan/ElasticSan_VolumeGroup_Encryption_Audit.json) |
