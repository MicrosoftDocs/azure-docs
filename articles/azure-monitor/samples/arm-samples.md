---
title: Azure Monitor resource manager samples
description: Deploy and configure Azure Monitr features using resource manager templates
author: bwren
ms.author: bwren
services: azure-monitor
ms.topic: sample
ms.date: 4/20/2020
ms.subservice: alerts
---
# Azure Monitor resource manager samples

Azure Monitor can deployed and configured at scale using [Azure Resource Manager template](../../azure-resource-manager/templates/template-syntax.md). The following articles provide sample templates for different Azure Monitor features. These samples can be modified for your particular requirements and deployed using any standard method for deploying Resource Manager templates. 

## Deploying the sample templates
The basic steps to use the samples are:

1. Copy the template and save as a JSON file.
2. Modify the parameters for your environment and save as a JSON file.
4. Deploy the template using [any deployment method](../../azure-resource-manager/templates/deploy-powershell.md). 

For example, use the following commands to deploy  the template and parameters file using PowerShell or Azure CLI.

Using Azure PowerShell

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName <yourSubscriptionName>
New-AzResourceGroupDeployment -Name AzureMonitorDeployment -ResourceGroupName my-resource-group -TemplateFile azure-monitor-deploy.json -TemplateParameterFile azure-monitor-deploy.parameters.json
```

```azurecli
az login
az group deployment create \
    --name AlertDeployment \
    --resource-group ResourceGroupofTargetResource \
    --template-file azure-monitor-deploy.json \
    --parameters azure-monitor-deploy.parameters.json
```

## List of sample templates

- [Agents](arm-agent.md) - Deploy and configure Log Analytics agent and diagnostic extension.
- Alerts
  - [Log alert rules](arm-alerts-log.md) - Alerts from log queries and Azure activity log.
  - [Metric alert rules](arm-alerts-metric.md) - Alerts from metrics using different kinds of logic.
- Application Insights - Coming soon.
- [Diagnostic settings](arm-diagnostic-settings.md) - Create diagnostic settings to forward logs and metrics from different resource types.
- [Log queries](arm-log-queries.md) - Create saved log queries in a Log Analytics workspace.
- [Log Analytics Workspace](arm-workspace.md) - Create Log Analytics workspace and configure collection of different data sources from Log Analytics agent.
- [Workbooks](arm-workbooks.md) - Create workbooks.
- [Azure Monitor for containers](arm-container-insights.md) - Onboard containers to Azure Monitor for containers.
- [Azure Monitor for VMs](arm-vminsights.md) - Onboard virtual machines to Azure Monitor for VMs.



## Next steps

- Learn how to [create an action group with Resource Manager templates](../platform/action-groups-create-resource-manager-template.md)
- For the JSON syntax and properties, see [Microsoft.Insights/metricAlerts](/azure/templates/microsoft.insights/metricalerts) template reference.
