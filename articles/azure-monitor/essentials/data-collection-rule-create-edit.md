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
| Container insights | [Enable Container insights](../containers/kubernetes-monitoring-enable.md#enable-prometheus-and-grafana) | When you enable Container insights on a Kubernetes cluster, a containerized version of the Azure Monitor agent is installed, and a DCR is created that collects data according to the configuration you selected. You may need to modify this DCR to add a transformation. |
| Workspace transformation | [Add a transformation in a workspace data collection rule using the Azure portal](../logs/tutorial-workspace-transformations-portal.md) | Create a transformation for any supported table in a Log Analytics workspace. The transformation is defined in a DCR that's then associated with the workspace. It's applied to any data sent to that table from a legacy workload that doesn't use a DCR. |


## Manually create a DCR
To manually create a DCR, create a JSON file using the appropriate configuration for the data collection that you're configuring. Start with one of the [sample DCRs](./data-collection-rule-samples.md) and use information in [Structure of a data collection rule in Azure Monitor](./data-collection-rule-structure.md) to modify the JSON file for your particular environment and requirements.

Once you have the JSON file created, you can use any of the following methods to create the DCR:

## [Portal](#tab/portal)

1. On the **Monitor** menu, select **Data Collection Rules**.
1. Select **Create** to create a new data collection rule and associations.
   
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rules-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rules-updated.png" alt-text="Screenshot that shows the Create button on the Data Collection Rules screen." border="false":::

1. Enter a **Rule name** and specify a **Subscription**, **Resource Group**, **Region**, and **Platform Type**:

    - **Region** specifies where the DCR will be created. The virtual machines and their associations can be in any subscription or resource group in the tenant.
    - **Platform Type** specifies the type of resources this rule can apply to. The **Custom** option allows for both Windows and Linux types.

    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-basics-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-basics-updated.png" alt-text="Screenshot that shows the Basics tab of the Data Collection Rule screen.":::

1. On the **Resources** tab: 
1. 
    1. Select **+ Add resources** and associate resources to the data collection rule. Resources can be virtual machines, Virtual Machine Scale Sets, and Azure Arc for servers. The Azure portal installs Azure Monitor Agent on resources that don't already have it installed. 

        > [!IMPORTANT]
        > The portal enables system-assigned managed identity on the target resources, along with existing user-assigned identities, if there are any. For existing applications, unless you specify the user-assigned identity in the request, the machine defaults to using system-assigned identity instead.
    
        If you need network isolation using private links, select existing endpoints from the same region for the respective resources or [create a new endpoint](../essentials/data-collection-endpoint-overview.md).

    1. Select **Enable Data Collection Endpoints**.
    1. Select a data collection endpoint for each of the resources associate to the data collection rule.

    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-virtual-machines-with-endpoint.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-virtual-machines-with-endpoint.png" alt-text="Screenshot that shows the Resources tab of the Data Collection Rule screen.":::

1. On the **Collect and deliver** tab, select **Add data source** to add a data source and set a destination.
1. Select a **Data source type**.
1. Select which data you want to collect. For performance counters, you can select from a predefined set of objects and their sampling rate. For events, you can select from a set of logs and severity levels.
     
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png" alt-text="Screenshot that shows the Azure portal form to select basic performance counters in a data collection rule." border="false":::

1. Select **Custom** to collect logs and performance counters that aren't [currently supported data sources](azure-monitor-agent-overview.md#data-sources-and-destinations) or to [filter events by using XPath queries](#filter-events-using-xpath-queries). You can then specify an [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) to collect any specific values. For an example, see [Sample DCR](data-collection-rule-sample-agent.md).
     
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png" alt-text="Screenshot that shows the Azure portal form to select custom performance counters in a data collection rule." border="false":::

1. On the **Destination** tab, add one or more destinations for the data source. You can select multiple destinations of the same or different types. For instance, you can select multiple Log Analytics workspaces, which is also known as multihoming.

    You can send Windows event and Syslog data sources to Azure Monitor Logs only. You can send performance counters to both Azure Monitor Metrics and Azure Monitor Logs. At this time, hybrid compute (Arc for Server) resources **do not** support the Azure Monitor Metrics (Preview) destination.
     
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-destination.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-destination.png" alt-text="Screenshot that shows the Azure portal form to add a data source in a data collection rule." border="false":::

1. Select **Add data source** and then select **Review + create** to review the details of the data collection rule and association with the set of virtual machines.
1. Select **Create** to create the data collection rule.

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
