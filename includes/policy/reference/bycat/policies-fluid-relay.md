---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/15/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Fluid Relay should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F46388f67-373c-4018-98d3-2b83172dd13a) |Use customer-managed keys to manage the encryption at rest of your Fluid Relay server. By default, customer data is encrypted with service-managed keys, but CMKs are commonly required to meet regulatory compliance standards. Customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you, with full control and responsibility, including rotation and management. Learn more at [https://docs.microsoft.com/azure/azure-fluid-relay/concepts/customer-managed-keys](../../../../articles/azure-fluid-relay/concepts/customer-managed-keys.md). |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Fluid%20Relay/FluidRelay_CMKEnabled_Audit.json) |
