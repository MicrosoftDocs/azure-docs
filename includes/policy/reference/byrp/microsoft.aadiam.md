---
ms.service: azure-policy
ms.topic: include
ms.date: 02/10/2025
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Active Directory should use private link to access Azure services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2e9411a0-0c5a-44b3-9ddb-ff10a1a2bf28) |Azure Private Link lets you connect your virtual networks to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to Azure AD, you can reduce data leakage risks. Learn more at: [https://aka.ms/privateLinkforAzureADDocs](https://aka.ms/privateLinkforAzureADDocs). It should be only used from isolated VNETs to Azure services, with no access to the Internet or other services (M365). |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Active%20Directory/PrivateLinkForAzureAD_PrivateLink_AINE.json) |
|[Configure Private Link for Azure AD with private endpoints](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb923afcf-4c3a-4ed6-8386-1ff64b68de47) |Private endpoints connect your virtual networks to Azure services without a public IP address at the source or destination. By mapping private endpoints to Azure AD, you can reduce data leakage risks. Learn more at: [https://aka.ms/privateLinkforAzureADDocs](https://aka.ms/privateLinkforAzureADDocs). It should be only used from isolated VNETs to Azure services, with no access to the Internet or other services (M365). |DeployIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Active%20Directory/PrivateLinkForAzureAD_PrivateEndpoint_DINE.json) |
