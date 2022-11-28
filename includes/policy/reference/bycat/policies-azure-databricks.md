---
author: timwarner-msft
ms.service: azure-policy
ms.topic: include
ms.date: 11/04/2022
ms.author: timwarner
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Databricks Workspaces should disable public network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e7849de-b939-4c50-ab48-fc6b0f5eeba2) |Azure Databricks Workspaces should have public network access disabled. Disabling public network access improves security by ensuring that the resource isn't exposed on the public internet. You can limit exposure of your resources by creating private endpoints instead. Learn more at: [https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject) |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Databricks/Databricks_AuditPublicNetworkAccess.json) |