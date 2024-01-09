---
title: Create and edit data collection rules (DCRs) in Azure Monitor
description: Details on creating and editing data collection rules (DCRs) in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/15/2023
ms.reviewer: nikeist
ms.custom: references_regions
---

# Create and edit data collection rules (DCRs) in Azure Monitor
There are multiple methods for creating a [data collection rule (DCR)](./data-collection-rule-overview.md) in Azure Monitor. In some cases, Azure Monitor will create and manage the DCR according to settings that you configure in the Azure portal. In other cases, you might need to create your own DCRs to customize particular scenarios.

This article describes the different methods for creating and editing a DCR. For the contents of the DCR itself, see [Structure of a data collection rule in Azure Monitor](./data-collection-rule-structure.md).

## Permissions
 You require the following permissions to create DCRs and associations:

| Built-in role | Scopes | Reason |
|:---|:---|:---|
| [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Create or edit DCRs, assign rules to the machine, deploy associations). |
| [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)<br>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, virtual machine scale sets</li><li>Azure Arc-enabled servers</li></ul> | Deploy agent extensions on the VM. |
| Any role that includes the action *Microsoft.Resources/deployments/** | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Deploy Azure Resource Manager templates. |

## Automated methods to create a DCR
The following table lists methods to create data collection scenarios using the Azure portal where the DCR is created for you. In these cases you don't need to interact directly with the DCR itself.

| Scenario | Resources | Description |
|:---|:---|:---|
| Azure Monitor Agent | [Configure data collection for Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md) | Use the Azure portal to create a DCR that specifies events and performance counters to collect from a machine with Azure Monitor Agent. Then associate that rule with one or more virtual machines. Azure Monitor Agent will be installed on any machines that don't currently have it.  |
| | [Enable VM insights overview](../vm/vminsights-enable-overview.md) | When you enable VM insights on a VM, the Azure Monitor agent is installed, and a DCR is created that collects a predefined set of performance counters. You shouldn't modify this DCR. |
| Container insights | [Enable Container insights](../containers/prometheus-metrics-enable.md) | When you enable Container insights on a Kubernetes cluster, a containerized version of the Azure Monitor agent is installed, and a DCR is created that collects data according to the configuration you selected. You may need to modify this DCR to add a transformation. |
| Text or JSON logs | [Collect logs from a text or JSON file with Azure Monitor Agent](../agents/data-collection-text-log.md?tabs=portal) | Use the Azure portal to create a DCR to collect entries from a text log on a machine with Azure Monitor Agent.  |
| Workspace transformation | [Add a transformation in a workspace data collection rule using the Azure portal](../logs/tutorial-workspace-transformations-portal.md) | Create a transformation for any supported table in a Log Analytics workspace. The transformation is defined in a DCR that's then associated with the workspace. It's applied to any data sent to that table from a legacy workload that doesn't use a DCR. |


## Manually create a DCR
To manually create a DCR, create a JSON file using the appropriate configuration for the data collection that you're configuring. Start with one of the [sample DCRs](./data-collection-rule-samples.md) and use information in [Structure of a data collection rule in Azure Monitor](./data-collection-rule-structure.md) to modify the JSON file for your particular environment and requirements.

Once you have the JSON file created, you can use any of the following methods to create the DCR:

## [CLI](#tab/CLI)
Use the [az monitor data-collection rule create](/cli/azure/monitor/data-collection/rule) command to create a DCR from your JSON file using the Azure CLI as shown in the following example.

```azurecli
az monitor data-collection rule create --location 'eastus' --resource-group 'my-resource-group' --name 'myDCRName' --rule-file 'C:\MyNewDCR.json' --description 'This is my new DCR'
```

## [PowerShell](#tab/powershell)
Use the [New-AzDataCollectionRule](/powershell/module/az.monitor/new-azdatacollectionrule) cmdlet to create the DCR from your JSON file using PowerShell as shown in the following example.

```powershell
New-AzDataCollectionRule -Location 'east-us' -ResourceGroupName 'my-resource-group' -RuleName 'myDCRName' -RuleFile 'C:\MyNewDCR.json' -Description 'This is my new DCR'
```


## [API](#tab/api)
Use the [DCR create API](/rest/api/monitor/data-collection-rules/create) to create the DCR from your JSON file. You can use any method to call a REST API as shown in the following examples.


```powershell
$ResourceId = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/dataCollectionRules/my-dcr"
$FilePath = ".\my-dcr.json"
$DCRContent = Get-Content $FilePath -Raw 
Invoke-AzRestMethod -Path ("$ResourceId"+"?api-version=2021-09-01-preview") -Method PUT -Payload $DCRContent
```


```azurecli
ResourceId="/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/dataCollectionRules/my-dcr"
FilePath="my-dcr.json"
az rest --method put --url $ResourceId"?api-version=2021-09-01-preview" --body @$FilePath
```


## [ARM](#tab/arm)
Using an ARM template, you can define parameters so you can provide particular values at the time you install the DCR. This allows you to use a single template for multiple installations. Use the following template, copying in the JSON for your DCR and adding any other parameters you want to use. 

See [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates) for different methods to deploy ARM templates.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "dataCollectionRuleName": {
            "type": "string",
            "metadata": {
                "description": "Specifies the name of the Data Collection Rule to create."
            }
        },
        "location": {
            "type": "string",
            "metadata": {
                "description": "Specifies the location in which to create the Data Collection Rule."
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "name": "[parameters('dataCollectionRuleName')]",
            "location": "[parameters('location')]",
            "apiVersion": "2021-09-01-preview",
            "properties": {
                "<dcr-properties>"
            }
        }
    ]
}

```
---

The following tutorials include examples of manually creating DCRs.

- [Send data to Azure Monitor using Logs ingestion API (Resource Manager templates)](../logs/tutorial-logs-ingestion-api.md)
- [Add transformation in workspace data collection rule to Azure Monitor using Resource Manager templates](../logs/tutorial-workspace-transformations-api.md)

## Edit a DCR
To edit a DCR, you can use any of the methods described in the previous section to create a DCR using a modified version of the JSON.

If you need to retrieve the JSON for an existing DCR, you can copy it from the **JSON View** for the DCR in the Azure portal. You can also retrieve it using an API call as shown in the following PowerShell example.

```powershell
$ResourceId = "<ResourceId>" # Resource ID of the DCR to edit
$FilePath = "<FilePath>" # Store DCR content in this file
$DCR = Invoke-AzRestMethod -Path ("$ResourceId"+"?api-version=2021-09-01-preview") -Method GET
$DCR.Content | ConvertFrom-Json | ConvertTo-Json -Depth 20 | Out-File -FilePath $FilePath
```

For a tutorial that walks through the process of retrieving and then editing an existing DCR, see [Tutorial: Edit a data collection rule (DCR)](./data-collection-rule-edit.md).

## Next steps

- [Read about the detailed structure of a data collection rule](data-collection-rule-structure.md)
- [Get details on transformations in a data collection rule](data-collection-transformations.md)
