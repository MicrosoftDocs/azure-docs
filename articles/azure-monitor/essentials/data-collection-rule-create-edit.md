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

# Create and edit data collection rules (DCRs) and associations in Azure Monitor

There are multiple methods for creating a [data collection rule (DCR)](./data-collection-rule-overview.md) in Azure Monitor. In some cases, Azure Monitor can create and manage the DCR according to settings that you configure in the Azure portal. In other cases, you need to create your own DCRs to customize particular scenarios.

This article describes the different methods for creating and editing a DCR. For the contents of the DCR itself, see [Structure of a data collection rule in Azure Monitor](./data-collection-rule-structure.md).

## Permissions

 You require the following permissions to create DCRs and associations:

| Built-in role | Scopes | Reason |
|:---|:---|:---|
| [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Create or edit DCRs, assign rules to the machine, deploy associations. |
| [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor)<br>[Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator)</li></ul> | <ul><li>Virtual machines, virtual machine scale sets</li><li>Azure Arc-enabled servers</li></ul> | Deploy agent extensions on the VM (virtual machine). |
| Any role that includes the action *Microsoft.Resources/deployments/** | <ul><li>Subscription and/or</li><li>Resource group and/or </li><li>An existing DCR</li></ul> | Deploy Azure Resource Manager templates. |

## Automated methods to create a DCR

The following table lists methods to create data collection scenarios using the Azure portal where the DCR is created for you. In these cases, you don't need to interact directly with the DCR itself.

| Scenario | Resources | Description |
|:---|:---|:---|
| Monitor a virtual machine | [Enable VM Insights overview](../vm/vminsights-enable-overview.md) | When you enable VM Insights on a VM, the Azure Monitor agent is installed and a DCR is created and associated with the VM. This DCR collects a predefined set of performance counters and shouldn't be modified. |
|  | [Collect data with Azure Monitor Agent](../agents/azure-monitor-agent-data-collection.md) | When you create a DCR in the Azure portal, an association is created for each machine that you add to **Resources**. |
| Container insights | [Enable Container Insights](../containers/kubernetes-monitoring-enable.md#enable-prometheus-and-grafana) | When you enable Container Insights on a Kubernetes cluster, a containerized version of the Azure Monitor agent is installed, and a DCR with association to the cluster is created that collects data according to the configuration you selected. You may need to modify this DCR to add a transformation. |
| Workspace transformation | [Add a transformation in a workspace data collection rule using the Azure portal](../logs/tutorial-workspace-transformations-portal.md) | Create a transformation for any supported table in a Log Analytics workspace. This transformation is specified within a DCR, which is linked to the workspace. The transformation is then applied to any data sent to that table from any legacy workloads that don't yet utilize DCR. |

## Create a DCR

Azure provides a centralized cloud based data collection configuration plan for virtual machines, virtual machine scale sets, on-premises machines, and Prometheus metrics from containers.

This article explains how to create a DCR from scratch. There are other solutions, such as Sentinel, VM Insights, and Application Insights, that offer DCR creation as part of their workflows. Sometimes, the DCRs created by these different solutions may appear to conflict. There are three tables where Windows events can be directed:

* Sentinel security audit events are sent to the SecurityEvents table.
* Windows Event Forwarding (WEF) connector events go to the WindowsEvent table.
* Events collected from scratch using the Windows event collection are sent to the Event table.

To create a data collection rule using the Azure CLI, PowerShell, API, or ARM templates, create a JSON file, starting with one of the [sample DCRs](./data-collection-rule-samples.md). Use information in [Structure of a data collection rule in Azure Monitor](./data-collection-rule-structure.md) to modify the JSON file for your particular environment and requirements.

> [!IMPORTANT]
> Create your data collection rule in the same region as your destination Log Analytics workspace or Azure Monitor workspace. You can associate the data collection rule to machines or containers from any subscription or resource group in the tenant. To send data across tenants, you must first enable [Azure Lighthouse](../../lighthouse/overview.md).

## [Portal](#tab/portal)
The Azure portal provides a simplified experience for creating a DCR for virtual machines and virtual machine scale sets. Using this method, you don't need to understand the structure of a DCR unless you want to want to implement an advanced feature such as a transformation. The process for creating this DCR with various data sources is described in [Collect data with Azure Monitor Agent](../agents/azure-monitor-agent-data-collection.md).


### [CLI](#tab/CLI)
Use the [az monitor data-collection rule create](/cli/azure/monitor/data-collection/rule) command to create a DCR from your JSON file.

```azurecli
az monitor data-collection rule create --location 'eastus' --resource-group 'my-resource-group' --name 'my-dcr' --rule-file 'C:\MyNewDCR.json' --description 'This is my new DCR'
```

Use the [az monitor data-collection rule association create](/cli/azure/monitor/data-collection/rule/association) command to create an association between your DCR and resource.

```azurecli
az monitor data-collection rule association create --name "my-vm-dcr-association" --rule-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/dataCollectionRules/my-dcr" --resource "subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm"
```

### [PowerShell](#tab/powershell)
Use the [New-AzDataCollectionRule](/powershell/module/az.monitor/new-azdatacollectionrule) cmdlet to create a DCR from your JSON file.

```powershell
New-AzDataCollectionRule -Name 'my-dcr' -ResourceGroupName 'my-resource-group' -JsonFilePath 'C:\MyNewDCR.json'
```

Use the [New-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/new-azdatacollectionruleassociation) command to create an association between your DCR and resource.

```powershell
 New-AzDataCollectionRuleAssociation -TargetResourceId '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm' -DataCollectionRuleId '/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.insights/datacollectionrules/my-dcr' -AssociationName 'my-vm-dcr-association'
```



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
* [Data collection rules](/azure/templates/microsoft.insights/datacollectionrules)
* [Data collection rule associations](/azure/templates/microsoft.insights/datacollectionruleassociations)

#### DCR

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

* [Read about the detailed structure of a data collection rule](data-collection-rule-structure.md)
* [Get details on transformations in a data collection rule](data-collection-transformations.md)
