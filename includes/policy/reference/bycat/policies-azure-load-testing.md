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
|[Azure load testing resource should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F65c4f833-1f2e-426c-8780-f6d7593bed7a) |Use customer-managed keys(CMK) to manage the encryption at rest for your Azure Load Testing resource. By default the encryptio is done using Service managed keys, customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more at [https://docs.microsoft.com/azure/load-testing/how-to-configure-customer-managed-keys?tabs=portal](../../../../articles/load-testing/how-to-configure-customer-managed-keys.md). |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Load%20Testing/LoadTestService_CMK_Audit.json) |
