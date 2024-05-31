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
|[Communication service resource should use a managed identity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbcff6755-335b-484d-b435-d1161db39cdc) |Assigning a managed identity to your Communication service resource helps ensure secure authentication. This identity is used by this Communication service resource to communicate with other Azure services, like Azure Storage, in a secure way without you having to manage any credentials. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Communication/Communication_ManagedIdentity_Audit.json) |
|[Communication service resource should use allow listed data location](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F93c45b74-42a1-4967-b25d-82c4dc630921) |Create a Communication service resource only from an allow listed data location. This data location determines where the data of the communication service resource will be stored at rest, ensuring your preferred allow listed data locations as this cannot be changed after resource creation. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Communication/Communication_DataLocation_Audit.json) |
