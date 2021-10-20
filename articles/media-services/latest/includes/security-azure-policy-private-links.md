---
author: johndeu
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2021
ms.author: johndeu
---

## Azure Policy definitions for Private Links

Azure Media Services supports several built-in use case based [Azure Policy](../../../governance/policy/overview.md) definitions. 

The following policy definitions are available for use with Private Links:

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Media Services accounts should use an API that supports Private Link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa77d8bb4-8d22-4bc1-a884-f582a705b480) |Media Services accounts should be created with an API that supports private link. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Media%20Services/MediaServices_RequirePrivateLinkSupport_Audit.json) |
|[Azure Media Services should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a591bf5-918e-4a5f-8dad-841863140d61) |Azure Private Link lets you connect your virtual networks to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to Media Services, you can reduce data leakage risks. Learn more about private links at: [https://aka.ms/mediaservicesprivatelinkdocs](../../../../articles/media-services/latest/security-private-link-how-to.md). |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Media%20Services/MediaServices_PrivateLink_AuditIfNotExists.json) |
|[Configure Azure Media Services to use private DNS zones](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb4a7f6c1-585e-4177-ad5b-c2c93f4bb991) |Use private DNS zones to override the DNS resolution for a private endpoint. A private DNS zone links to your virtual network to resolve to Media Services account. Learn more at: [https://aka.ms/mediaservicesprivatelinkdocs](../../../../articles/media-services/latest/security-private-link-how-to.md). |DeployIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Media%20Services/MediaServices_PrivateLinkDns_DeployIfNotExists.json) |
|[Configure Azure Media Services with private endpoints](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc5632066-946d-4766-9544-cd79bcc1286e) |Private endpoints connect your virtual networks to Azure services without a public IP address at the source or destination. By mapping private endpoints to Media Services, you can reduce data leakage risks. Learn more about private links at: [https://aka.ms/mediaservicesprivatelinkdocs](../../../../articles/media-services/latest/security-private-link-how-to.md). |DeployIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Media%20Services/MediaServices_PrivateLink_DeployIfNotExists.json) |

Refer to [Azure Policy for Media Services](../security-azure-policy.md) for a complete list of all built-in policy definitions and use cases.

For details on how to deploy and use Azure Policy definitions see the article ["What is Azure Policy?"](../../../governance/policy/overview.md)