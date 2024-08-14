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
| [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Create or edit DCRs, assign rules to the machine, deploy associations. |
| [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)<br>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, virtual machine scale sets</li><li>Azure Arc-enabled servers</li></ul> | Deploy agent extensions on the VM. |
| Any role that includes the action *Microsoft.Resources/deployments/** | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Deploy Azure Resource Manager templates. |

## Automated methods to create a DCR
The following table lists methods to create data collection scenarios using the Azure portal where the DCR is created for you. In these cases you don't need to interact directly with the DCR itself.

| Scenario | Resources | Description |
|:---|:---|:---|
| Monitor a virtual machine | [Enable VM insights overview](../vm/vminsights-enable-overview.md) | When you enable VM insights on a VM, the Azure Monitor agent is installed, and a DCR is created that collects a predefined set of performance counters. You shouldn't modify this DCR. |
| Container insights | [Enable Container insights](../containers/kubernetes-monitoring-enable.md#enable-prometheus-and-grafana) | When you enable Container insights on a Kubernetes cluster, a containerized version of the Azure Monitor agent is installed, and a DCR is created that collects data according to the configuration you selected. You may need to modify this DCR to add a transformation. |
| Workspace transformation | [Add a transformation in a workspace data collection rule using the Azure portal](../logs/tutorial-workspace-transformations-portal.md) | Create a transformation for any supported table in a Log Analytics workspace. The transformation is defined in a DCR that's then associated with the workspace. It's applied to any data sent to that table from a legacy workload that doesn't already use a DCR. |


## Create a DCR

Azure provides a centralized cloud based data collection configuration plan for virtual machines, virtual machine scale sets, On-Prem machines and Prometheus metrics from containers.

This article describes how to create a DCR from scratch. There are other insights solution that provide DCR creation experiences like Sentinel, VM insights, and Application Insights that create DCRs as part of there own workflows. Some time the DCRs created in these by different solution can seem to conflict. There are three tables to which Windows events can be sent to. Sentinel security audit events with go to SecurityEvents, WEF connector events go to the WindowsEvent table. If you use the scratch Windows event collection the results go to the Event table.

To create a data collection rule using the Azure CLI, PowerShell, API, or ARM templates, create a JSON file, starting with one of the [sample DCRs](./data-collection-rule-samples.md). Use information in [Structure of a data collection rule in Azure Monitor](./data-collection-rule-structure.md) to modify the JSON file for your particular environment and requirements.

> [!IMPORTANT]
> Create your data collection rule in the same region as your destination Log Analytics workspace or Azure Monitor workspace. You can associate the data collection rule to machines or containers from any subscription or resource group in the tenant. To send data across tenants, you must first enable [Azure Lighthouse](../../lighthouse/overview.md).

## [Portal](#tab/portal)

On the **Monitor** menu, select **Data Collection Rules** > **Create** to open the page to create a new data collection rule.
   
:::image type="content" source="media/data-collection-rule-create-edit/data-collection-rules-updated.png" lightbox="media/data-collection-rule-create-edit/data-collection-rules-updated.png" alt-text="Screenshot that shows the Create button on the Data Collection Rules screen." border="false":::

Configure the settings in each step of the wizard, as detailed below.
 
### Basics 

:::image type="content" source="media/data-collection-rule-create-edit/data-collection-rule-basics-updated.png" lightbox="media/data-collection-rule-create-edit/data-collection-rule-basics-updated.png" alt-text="Screenshot that shows the Basics step of the Data Collection Rule screen.":::

| Screen element | Description |
|:---|:---|
| **Rule name** | Enter a name for the data collection rule. |
| **Subscription** | Associate the data collection rule to a subscription. |
| **Resource Group** | Associate the data collection rule to a resource group. |
| **Region** | Create your data collection rule in the same region as your destination Log Analytics workspace. You can associate the data collection rule to machines from any subscription or resource group in the tenant. |
| **Platform Type** | Select **Windows** or **Linux**, or **All**, which allows for both Windows and Linux platforms. |
| **Data Collection Endpoint** | To collect **Linux syslog data**, **IIS logs**, **custom text logs** or **custom JSON logs**, select an existing data collection endpoint or create a new endpoint.<br>You don't need an endpoint to collect performance counters and Windows event logs.<br>On this tab, you can only select a data collection endpoint in the same region as the data collection rule. The agent sends collected data to this data collection endpoint. For more information, see [Components of a data collection endpoint](../essentials/data-collection-endpoint-overview.md#components-of-a-dce). |

### Resources

:::image type="content" source="media/data-collection-rule-create-edit/data-collection-rule-virtual-machines-with-endpoint.png" lightbox="media/data-collection-rule-create-edit/data-collection-rule-virtual-machines-with-endpoint.png" alt-text="Screenshot that shows the Resources tab of the Data Collection Rule screen.":::

| Screen element | Description |
|:---|:---|
| **+ Add resources** | Associate virtual machines, Virtual Machine Scale Sets, and Azure Arc for servers to the data collection rule. The Azure portal installs Azure Monitor Agent on resources that don't already have the agent installed.|
|**Enable Data Collection Endpoints**| If the machine you're monitoring is not in the same region as your destination Log Analytics workspace, enable data collection endpoints and select an endpoint in the region of the monitored machine to collect **Linux syslog data**, **IIS logs**, **custom text logs** or **custom JSON logs**.<br>If the monitored machine is in the same region as your destination Log Analytics workspace, or if you're collecting performance counters and Windows event logs, don't select a data collection endpoint on the **Resources** tab.<br>The data collection endpoint on the **Resources** tab is the configuration access endpoint, as described in [Components of a data collection endpoint](../essentials/data-collection-endpoint-overview.md#components-of-a-dce).<br>If you need network isolation using private links, select existing endpoints from the same region for the respective resources or [create a new endpoint](../essentials/data-collection-endpoint-overview.md).|
|**Agent extension identity**| Use a system-assigned managed identity, or select an existing user-assigned identity assigned to the virtual machine. For more information, see [Managed identity types](/entra/identity/managed-identities-azure-resources/overview#managed-identity-types).|

### Collect and deliver

On the **Collect and deliver** tab, select **Add data source** and configure the settings on the **Source** and **Destination** tabs, as detailed below.

:::image type="content" source="media/data-collection-rule-create-edit/data-collection-rule-data-source-destination.png" lightbox="media/data-collection-rule-create-edit/data-collection-rule-data-source-destination.png" alt-text="Screenshot that shows the Collect and deliver tab of the Data Collection Rule wizard. On this tab, you define which data source Azure Monitor Agent collects data from and where the agent sends the data." border="false":::

| Screen element | Description |
|:---|:---|
| **Data source** | Select a **Data source type** and define related fields based on the data source type you select. For more information about collecting data from the various data source types, see [Collect data with Azure Monitor Agent](../agents/azure-monitor-agent-data-collection.md)|
| **Destination** | Add one or more destinations for each source. You can select multiple destinations of the same or different types.  |

### Review + create

Review the data collection rule details and select **Create** to create the data collection rule.

> [!NOTE]
> It can take up to 5 minutes for data to be sent to the destinations when you create a data collection rule using the data collection rule wizard.

### [CLI](#tab/CLI)
Use the [az monitor data-collection rule create](/cli/azure/monitor/data-collection/rule) command to create a DCR from your JSON file using the Azure CLI as shown in the following example.

```azurecli
az monitor data-collection rule create --location 'eastus' --resource-group 'my-resource-group' --name 'myDCRName' --rule-file 'C:\MyNewDCR.json' --description 'This is my new DCR'
```

### [PowerShell](#tab/powershell)
Use the [New-AzDataCollectionRule](/powershell/module/az.monitor/new-azdatacollectionrule) cmdlet to create the DCR from your JSON file using PowerShell as shown in the following example.

```powershell
New-AzDataCollectionRule -Location 'east-us' -ResourceGroupName 'my-resource-group' -RuleName 'myDCRName' -RuleFile 'C:\MyNewDCR.json' -Description 'This is my new DCR'
```

**Data collection rules**

| Action | Command |
|:---|:---|
| Get rules | [Get-AzDataCollectionRule](/powershell/module/az.monitor/get-azdatacollectionrule) |
| Create a rule | [New-AzDataCollectionRule](/powershell/module/az.monitor/new-azdatacollectionrule) |
| Update a rule | [Update-AzDataCollectionRule](/powershell/module/az.monitor/update-azdatacollectionrule) |
| Delete a rule | [Remove-AzDataCollectionRule](/powershell/module/az.monitor/remove-azdatacollectionrule) |
| Update "Tags" for a rule | [Update-AzDataCollectionRule](/powershell/module/az.monitor/update-azdatacollectionrule) |

**Data collection rule associations**

| Action | Command |
|:---|:---|
| Get associations | [Get-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/get-azdatacollectionruleassociation) |
| Create an association | [New-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/new-azdatacollectionruleassociation) |
| Delete an association | [Remove-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/remove-azdatacollectionruleassociation) |

### [API](#tab/api)
Use the [DCR create API](/rest/api/monitor/data-collection-rules/create) to create the DCR from your JSON file. You can use any method to call a REST API as shown in the following examples.


```powershell
$ResourceId = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/dataCollectionRules/my-dcr"
$FilePath = ".\my-dcr.json"
$DCRContent = Get-Content $FilePath -Raw 
Invoke-AzRestMethod -Path ("$ResourceId"+"?api-version=2022-06-01") -Method PUT -Payload $DCRContent
```


```azurecli
ResourceId="/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/dataCollectionRules/my-dcr"
FilePath="my-dcr.json"
az rest --method put --url $ResourceId"?api-version=2022-06-01" --body @$FilePath
```


### [ARM](#tab/arm)

See the following references for defining DCRs and associations in a template.
- [Data collection rules](/azure/templates/microsoft.insights/datacollectionrules)
- [Data collection rule associations](/azure/templates/microsoft.insights/datacollectionruleassociations)

Use the following template to create a DCR using information from [Structure of a data collection rule in Azure Monitor](./data-collection-rule-structure.md) and [Sample data collection rules (DCRs) in Azure Monitor](./data-collection-rule-samples.md) to define the `dcr-properties`.

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

#### DCR Association -Azure VM
The following sample creates an association between an Azure virtual machine and a data collection rule.

**Bicep template file**

```bicep
@description('The name of the virtual machine.')
param vmName string

@description('The name of the association.')
param associationName string

@description('The resource ID of the data collection rule.')
param dataCollectionRuleId string

resource vm 'Microsoft.Compute/virtualMachines@2021-11-01' existing = {
  name: vmName
}

resource association 'Microsoft.Insights/dataCollectionRuleAssociations@2021-09-01-preview' = {
  name: associationName
  scope: vm
  properties: {
    description: 'Association of data collection rule. Deleting this association will break the data collection for this virtual machine.'
    dataCollectionRuleId: dataCollectionRuleId
  }
}
```

**ARM template file**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "The name of the virtual machine."
      }
    },
    "associationName": {
      "type": "string",
      "metadata": {
        "description": "The name of the association."
      }
    },
    "dataCollectionRuleId": {
      "type": "string",
      "metadata": {
        "description": "The resource ID of the data collection rule."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/dataCollectionRuleAssociations",
      "apiVersion": "2021-09-01-preview",
      "scope": "[format('Microsoft.Compute/virtualMachines/{0}', parameters('vmName'))]",
      "name": "[parameters('associationName')]",
      "properties": {
        "description": "Association of data collection rule. Deleting this association will break the data collection for this virtual machine.",
        "dataCollectionRuleId": "[parameters('dataCollectionRuleId')]"
      }
    }
  ]
}
```

**Parameter file**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-azure-vm"
    },
    "associationName": {
      "value": "my-windows-vm-my-dcr"
    },
    "dataCollectionRuleId": {
      "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.insights/datacollectionrules/my-dcr"
    }
   }
}
```
### DCR Association -Arc-enabled server
The following sample creates an association between an Azure Arc-enabled server and a data collection rule.

**Bicep template file**

```bicep
@description('The name of the virtual machine.')
param vmName string

@description('The name of the association.')
param associationName string

@description('The resource ID of the data collection rule.')
param dataCollectionRuleId string

resource vm 'Microsoft.HybridCompute/machines@2021-11-01' existing = {
  name: vmName
}

resource association 'Microsoft.Insights/dataCollectionRuleAssociations@2021-09-01-preview' = {
  name: associationName
  scope: vm
  properties: {
    description: 'Association of data collection rule. Deleting this association will break the data collection for this Arc server.'
    dataCollectionRuleId: dataCollectionRuleId
  }
}
```

**ARM template file**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "The name of the virtual machine."
      }
    },
    "associationName": {
      "type": "string",
      "metadata": {
        "description": "The name of the association."
      }
    },
    "dataCollectionRuleId": {
      "type": "string",
      "metadata": {
        "description": "The resource ID of the data collection rule."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/dataCollectionRuleAssociations",
      "apiVersion": "2021-09-01-preview",
      "scope": "[format('Microsoft.HybridCompute/machines/{0}', parameters('vmName'))]",
      "name": "[parameters('associationName')]",
      "properties": {
        "description": "Association of data collection rule. Deleting this association will break the data collection for this Arc server.",
        "dataCollectionRuleId": "[parameters('dataCollectionRuleId')]"
      }
    }
  ]
}
```

**Parameter file**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "value": "my-hybrid-vm"
    },
    "associationName": {
      "value": "my-windows-vm-my-dcr"
    },
    "dataCollectionRuleId": {
      "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.insights/datacollectionrules/my-dcr"
    }
   }
}
```
---


## Edit a DCR
To edit a DCR, you can use any of the methods described in the previous section to create a DCR using a modified version of the JSON.

If you need to retrieve the JSON for an existing DCR, you can copy it from the **JSON View** for the DCR in the Azure portal. You can also retrieve it using an API call as shown in the following PowerShell example.

```powershell
$ResourceId = "<ResourceId>" # Resource ID of the DCR to edit
$FilePath = "<FilePath>" # Store DCR content in this file
$DCR = Invoke-AzRestMethod -Path ("$ResourceId"+"?api-version=2022-06-01") -Method GET
$DCR.Content | ConvertFrom-Json | ConvertTo-Json -Depth 20 | Out-File -FilePath $FilePath
```

For a tutorial that walks through the process of retrieving and then editing an existing DCR, see [Tutorial: Edit a data collection rule (DCR)](./data-collection-rule-edit.md).

## Next steps

- [Read about the detailed structure of a data collection rule](data-collection-rule-structure.md)
- [Get details on transformations in a data collection rule](data-collection-transformations.md)
