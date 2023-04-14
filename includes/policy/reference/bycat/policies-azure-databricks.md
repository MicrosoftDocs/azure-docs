---
author: timwarner-msft
ms.service: azure-policy
ms.topic: include
ms.date: 02/21/2023
ms.author: timwarner
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Databricks Workspaces should disable public network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e7849de-b939-4c50-ab48-fc6b0f5eeba2) |Azure Databricks Workspaces should have public network access disabled. Disabling public network access improves security by ensuring that the resource isn't exposed on the public internet. You can limit exposure of your resources by creating private endpoints instead. Learn more at: [https://docs.microsoft.com/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject) |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Databricks/Databricks_AuditPublicNetworkAccess.json) |
|[Configure diagnostic settings for Azure Databricks Workspace to Log Analytics workspace](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F23057b42-ca8d-4aa0-a3dc-96a98b5b5a3d) |Deploys the diagnostic settings for Azure Databricks Workspace to stream resource logs to a Log Analytics workspace when any Azure Databricks Workspace which is missing this diagnostic settings is created or updated. |DeployIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Databricks/Databricks_AuditDiagnosticLog_DINE.json) |
|[Resource logs in Azure Databricks Workspace should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F138ff14d-b687-4faa-a81c-898c91a87fa2) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Databricks/Databricks_AuditDiagnosticLog_Audit.json) |