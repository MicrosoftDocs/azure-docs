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
|[Azure Front Door profiles should use Premium tier that supports managed WAF rules and private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdfc212af-17ea-423a-9dcb-91e2cb2caa6b) |Azure Front Door Premium supports Azure managed WAF rules and private link to supported Azure origins. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/CDN/AFD_Premium_Sku_Audit.json) |
|[Azure Front Door Standard and Premium should be running minimum TLS version of 1.2](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F679da822-78a7-4eff-8fff-a899454a9970) |Setting minimal TLS version to 1.2 improves security by ensuring your custom domains are accessed from clients using TLS 1.2 or newer. Using versions of TLS less than 1.2 is not recommended since they are weak and do not support modern cryptographic algorithms. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/CDN/AFD_Standard_Premium_MinimumTls_Audit.json) |
|[Secure private connectivity between Azure Front Door Premium and Azure Storage Blob, or Azure App Service](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdaba2cce-8326-4af3-b049-81a362da024d) |Private link ensures private connectivity between AFD Premium and Azure Storage Blob or Azure App Service over the Azure backbone network, without the Azure Storage Blob or the Azure App Service being publicly exposed to the internet. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/CDN/AFD_Premium_PrivateLink_Enabled_Audit.json) |
