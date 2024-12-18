---
ms.service: azure-policy
ms.topic: include
ms.date: 12/06/2024
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Health Data Services de-identification service should disable public network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc5f34731-7ab9-42ff-922d-ef4920068b74) |Disabling public network access improves security by ensuring that the resource isn't exposed on the public internet. You can limit exposure of your resources by creating private endpoints instead. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Health%20Deidentification%20Service/HealthDeidentification_PublicNetworkAccess_Audit.json) |
|[Azure Health Data Services de-identification service should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd9b2d63d-a233-4123-847a-7f7e5f5d7e7a) |Azure Health Data Services de-identification service should have at least one approved private endpoint connection. Clients in a virtual network can securely access resources that have private endpoint connections through private links. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Health%20Deidentification%20Service/HealthDeidentification_PrivateLink_Audit.json) |
