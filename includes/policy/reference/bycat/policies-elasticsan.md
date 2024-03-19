---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 03/18/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[ElasticSan should disable public network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6a92fe1f-0b86-44ae-843d-2db3d2b571ae) |Disable public network access for your ElasticSan so that it's not accessible over the public internet. This can reduce data leakage risks. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/ElasticSan/PublicNetworkAccess_Audit.json) |
|[ElasticSan Volume Group should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7698f4ed-80ce-4e13-b408-ee135fa400a5) |Use customer-managed keys to manage the encryption at rest of your VolumeGroup. By default, customer data is encrypted with platform-managed keys, but CMKs are commonly required to meet regulatory compliance standards. Customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you, with full control and responsibility, including rotation and management. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/ElasticSan/VolumeGroup_Encryption_Audit.json) |
|[ElasticSan Volume Group should use private endpoints](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1abc5157-29f8-4dbd-b28e-ff99526cb8b7) |Private endpoints lets administrator connect virtual networks to Azure services without a public IP address at the source or destination. By mapping private endpoints to volume group, administrator can reduce data leakage risks |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/ElasticSan/VolumeGroup_PrivateEndpoints_Audit.json) |
