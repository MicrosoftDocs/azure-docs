---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 10/10/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Attestation providers should disable public network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5e7e928c-8693-4a23-9bf3-1c77b9a8fe97) |To improve the security of Azure Attestation Service, ensure that it isn't exposed to the public internet and can only be accessed from a private endpoint. Disable the public network access property as described in aka.ms/azureattestation. This option disables access from any public address space outside the Azure IP range, and denies all logins that match IP or virtual network-based firewall rules. This reduces data leakage risks. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Attestation/Attestation_PublicNetworkAccess_Audit.json) |
|[Azure Attestation providers should use private endpoints](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7b256a2d-058b-41f8-bed9-3f870541c40a) |Private endpoints provide a way to connect Azure Attestation providers to your Azure resources without sending traffic over the public internet. By preventing public access, private endpoints help protect against undesired anonymous access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Attestation/Attestation_PrivateLink_AuditIfNotExists.json) |
