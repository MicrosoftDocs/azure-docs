---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 08/08/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Application definition for Managed Application should use customer provided storage account](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9db7917b-1607-4e7d-a689-bca978dd0633) |Use your own storage account to control the application definition data when this is a regulatory or compliance requirement. You can choose to store your managed application definition within a storage account provided by you during creation, so that its location and access can be fully managed by you to fulfill regulatory compliance requirements. |audit, Audit, deny, Deny, disabled, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Managed%20Application/ApplicationDefinition_Missing_StorageAccount_Deny.json) |
