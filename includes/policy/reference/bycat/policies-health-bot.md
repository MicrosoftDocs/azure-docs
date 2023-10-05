---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 09/19/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Health Bots should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4d080fa5-a6d2-4f98-ba9c-f482d0d335c0) |Use customer-managed keys (CMK) to manage the encryption at rest of the data of your healthbots. By default, the data is encrypted at rest with service-managed keys, but CMK are commonly required to meet regulatory compliance standards. CMK enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more at [https://docs.microsoft.com/azure/health-bot/cmk](/azure/health-bot/cmk) |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Health%20Bot/%20HealthBot_CustomerManagedKey_Audit.json) |
