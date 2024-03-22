---
title: Resource Manager template samples for Azure Monitor
description: Deploy and configure Azure Monitor features by using Resource Manager templates.
author: bwren
ms.author: bwren
services: azure-monitor
ms.topic: sample
ms.date: 08/09/2023
ms.reviewer: robb
---
# Resource Manager template samples for Azure Monitor

You can deploy and configure Azure Monitor at scale by using [Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md). This article lists sample templates for Azure Monitor features. You can modify these samples for your particular requirements and deploy them by using any standard method for deploying Resource Manager templates.

## Deploy the sample templates

The basic steps to use one of the template samples are:

1. Copy the template and save it as a JSON file.
2. Modify the parameters for your environment and save the JSON file.
3. Deploy the template by using [any deployment method for Resource Manager templates](../azure-resource-manager/templates/deploy-portal.md).

Following are basic steps for using different methods to deploy the sample templates. Follow the included links for more details.

## [Azure portal](#tab/portal)

For more details, see [Deploy resources with ARM templates and Azure portal](../azure-resource-manager/templates/deploy-portal.md).

1. In the Azure portal, select **Create a resource**, search for **template**. and then select **Template deployment**.
2. Select **Create**.
4. Select **Build your own template in editor**.
5. Click **Load file** and select your template file.
6. Click **Save**.
7. Fill in parameter values.
8. Click **Review + Create**.

## [CLI](#tab/cli)

For more details, see [How to use Azure Resource Manager (ARM) deployment templates with Azure CLI](../azure-resource-manager/templates/deploy-cli.md).

```azurecli
az login
az deployment group create \
    --name AzureMonitorDeployment \
    --resource-group <resource-group> \
    --template-file azure-monitor-deploy.json \
    --parameters azure-monitor-deploy.parameters.json
```

## [PowerShell](#tab/powershell)

For more details, see [Deploy resources with ARM templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md).

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName <subscription>
New-AzResourceGroupDeployment -Name AzureMonitorDeployment -ResourceGroupName <resource-group> -TemplateFile azure-monitor-deploy.json -TemplateParameterFile azure-monitor-deploy.parameters.json
```

## [REST API](#tab/api)

For more details, see [Deploy resources with ARM templates and Azure Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md).

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Resources/deployments/{deploymentName}?api-version=2020-10-01
```

In the request body, provide a link to your template and parameter file.

```json
{
 "properties": {
   "templateLink": {
     "uri": "http://mystorageaccount.blob.core.windows.net/templates/template.json",
     "contentVersion": "1.0.0.0"
   },
   "parametersLink": {
     "uri": "http://mystorageaccount.blob.core.windows.net/templates/parameters.json",
     "contentVersion": "1.0.0.0"
   },
   "mode": "Incremental"
 }
}
```

---

## List of sample templates

- [Agents](agents/resource-manager-agent.md): Deploy and configure the Log Analytics agent and a diagnostic extension.
- Alerts:
  - [Log search alert rules](alerts/resource-manager-alerts-log.md): Configure alerts from log queries and Azure Activity Log.
  - [Metric alert rules](alerts/resource-manager-alerts-metric.md): Configure alerts from metrics that use different kinds of logic.
- [Application Insights](app/create-workspace-resource.md)
- [Diagnostic settings](essentials/resource-manager-diagnostic-settings.md): Create diagnostic settings to forward logs and metrics from different resource types.
- [Enable Prometheus metrics](containers/kubernetes-monitoring-enable.md?tabs=arm#enable-prometheus-and-grafana): Install the Azure Monitor agent on your AKS cluster and send Prometheus metrics to your Azure Monitor workspace.
- [Log queries](logs/resource-manager-log-queries.md): Create saved log queries in a Log Analytics workspace.
- [Log Analytics workspace](logs/resource-manager-workspace.md): Create a Log Analytics workspace and configure a collection of data sources from the Log Analytics agent.
- [Workbooks](visualize/resource-manager-workbooks.md): Create workbooks.
- [Azure Monitor for VMs](vm/resource-manager-vminsights.md): Onboard virtual machines to Azure Monitor for VMs.

## Next steps

Learn more about [Resource Manager templates](../azure-resource-manager/templates/overview.md).
