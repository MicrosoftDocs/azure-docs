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
|[\[Preview\]: Load tests using Azure Load Testing should be run only against private endpoints from within a virtual network.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd855fd7a-9be5-4d84-8b75-28d41aadc158) |Azure Load Testing engine instances should use virtual network injection for the following purposes: 1. Isolate Azure Load Testing engines to a virtual network. 2. Enable Azure Load Testing engines to interact with systems in either on premises data centers or Azure service in other virtual networks. 3. Empower customers to control inbound and outbound network communications for Azure Load Testing engines. |Audit, Deny, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Load%20Testing/LoadTestService_NetworkIsolation_Audit.json) |
|[Azure load testing resource should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F65c4f833-1f2e-426c-8780-f6d7593bed7a) |Use customer-managed keys(CMK) to manage the encryption at rest for your Azure Load Testing resource. By default the encryptio is done using Service managed keys, customer-managed keys enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more at [https://docs.microsoft.com/azure/load-testing/how-to-configure-customer-managed-keys?tabs=portal](/azure/load-testing/how-to-configure-customer-managed-keys). |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Load%20Testing/LoadTestService_CMK_Audit.json) |
