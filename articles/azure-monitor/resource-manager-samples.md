---
title: Resource Manager template samples for Azure Monitor
description: Deploy and configure Azure Monitor features by using Resource Manager templates.
author: bwren
ms.author: bwren
services: azure-monitor
ms.topic: sample
ms.date: 05/18/2020 
ms.custom: devx-track-azurepowershell
---
# Resource Manager template samples for Azure Monitor

You can deploy and configure Azure Monitor at scale by using [Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md). This article lists sample templates for Azure Monitor features. You can modify these samples for your particular requirements and deploy them by using any standard method for deploying Resource Manager templates. 

## Deploying the sample templates
The basic steps to use the one of the template samples are:

1. Copy the template and save it as a JSON file.
2. Modify the parameters for your environment and save the JSON file.
3. Deploy the template by using [any deployment method for Resource Manager templates](../azure-resource-manager/templates/deploy-powershell.md). 

For example, use the following commands to deploy the template and parameter file to a resource group by using PowerShell or the Azure CLI:

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName my-subscription
New-AzResourceGroupDeployment -Name AzureMonitorDeployment -ResourceGroupName my-resource-group -TemplateFile azure-monitor-deploy.json -TemplateParameterFile azure-monitor-deploy.parameters.json
```

```azurecli
az login
az deployment group create \
    --name AzureMonitorDeployment \
    --resource-group ResourceGroupofTargetResource \
    --template-file azure-monitor-deploy.json \
    --parameters azure-monitor-deploy.parameters.json
```

## List of sample templates

- [Agents](agents/resource-manager-agent.md): Deploy and configure the Log Analytics agent and a diagnostic extension.
- Alerts:
  - [Log alert rules](alerts/resource-manager-alerts-log.md): Configure alerts from log queries and Azure Activity Log.
  - [Metric alert rules](alerts/resource-manager-alerts-metric.md): Configure alerts from metrics that use different kinds of logic.
- [Application Insights](app/resource-manager-app-resource.md)
- [Diagnostic settings](essentials/resource-manager-diagnostic-settings.md): Create diagnostic settings to forward logs and metrics from different resource types.
- [Log queries](logs/resource-manager-log-queries.md): Create saved log queries in a Log Analytics workspace.
- [Log Analytics workspace](logs/resource-manager-workspace.md): Create a Log Analytics workspace and configure a collection of data sources from the Log Analytics agent.
- [Workbooks](visualize/resource-manager-workbooks.md): Create workbooks.
- [Container insights](containers/resource-manager-container-insights.md): Onboard clusters to Container insights.
- [Azure Monitor for VMs](vm/resource-manager-vminsights.md): Onboard virtual machines to Azure Monitor for VMs.

## Next steps

- Learn more about [Resource Manager templates](../azure-resource-manager/templates/overview.md).