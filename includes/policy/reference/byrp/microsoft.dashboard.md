---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 08/03/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Managed Grafana should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3a97e513-f75e-4230-8137-1efad4eadbbc) |Azure Private Link lets you connect your virtual networks to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to Managed Grafana, you can reduce data leakage risks. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Managed%20Grafana/AMG_PrivateEndpoints_Audit.json) |
|[Azure Managed Grafana workspaces should disable public network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe8775d5a-73b7-4977-a39b-833ef0114628) |Disabling public network access improves security by ensuring that your Azure Managed Grafana workspace isn't exposed on the public internet. Creating private endpoints can limit exposure of your workspaces. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Managed%20Grafana/AMG_PublicNetworkAccess_Deny.json) |
|[Configure Azure Managed Grafana dashboards with private endpoints](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbc33de80-97cd-4c11-b6b4-d075e03c7d60) |Private endpoints connect your virtual networks to Azure services without a public IP address at the source or destination. By mapping private endpoints to Azure Managed Grafana, you can reduce data leakage risks. |DeployIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Managed%20Grafana/AMG_PrivateEndpoints_DeployIfNotExists.json) |
|[Configure Azure Managed Grafana workspaces to disable public network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F67529aa1-5285-4b1c-8e6f-5ccd861ac98e) |Disable public network access for your Azure Managed Grafana workspace so that it's not accessible over the public internet. This can reduce data leakage risks. |Modify, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Managed%20Grafana/AMG_PublicNetworkAccess_Modify.json) |
