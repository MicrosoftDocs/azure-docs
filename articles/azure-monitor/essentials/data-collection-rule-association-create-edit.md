---
title: Create and edit data collection rules associations (DCRAs) in Azure Monitor
description: Details on creating and editing data collection rule associations (DCRAs) in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/15/2023
ms.reviewer: nikeist
ms.custom: references_regions
---

# Create and edit data collection rule associations (DCRAs) in Azure Monitor
[Data collection rule associations (DCRAs)](./data-collection-rule-overview.md#data-collection-rule-associations-dcra) connect [data collection rules (DCRs)](./data-collection-rule-overview.md) to resources with monitoring data to collect. This is a many-to-many relationship, where a single DCR can be associated with multiple resources, and a single resource can be associated with multiple DCRs. This article describes how to create and edit associations in Azure Monitor.

:::image type="content" source="media/data-collection-rule-overview/data-collection-rule-associations.png" lightbox="media/data-collection-rule-overview/data-collection-rule-associations.png" alt-text="Diagram that shows DCRAs connected to a DCR." border="false":::

## Automatic creation
There are several scenarios where associations are automatically created for you when you create and configure a DCR.

| Scenario | Description |
|:---|:---|
| [Enable VM insights on a VM](../vm/vminsights-enable-overview.md) | When you enable VM insights on a VM, a DCR is created along with an association between the VM and the DCR. |
| [Enable Container insights on a Kubernetes cluster](../containers/kubernetes-monitoring-enable.md) | When you enable Container insights on a cluster, a DCR is created along with an association between the cluster and the DCR. |
| [Create a DCR for a VM in the Azure portal](../agents/azure-monitor-agent-data-collection.md) | When you create a DCR in the Azure portal, an association is created for each machine that you add to **Resources**. |

## View associations
There are multiple methods to view the associations for a particular DCR or resource.

### [Portal](#tab/portal)
Use the preview DCR experience in the Azure portal to view associations by DCR or by resource. From the **Monitor** menu in the Azure portal, select **Data Collection Rules**. Click the banner at the top of the screen to use the preview experience.

### By DCR

In the **Data collection rules** view, the **Resource Count** shows the number of resources associated with the DCR. Click this number to open the **Resources** page for the DCR. This lists the resources associated with the DCR. Click **Add** to add additional resources. Select 

### By Resource

Using the **Resources** view, you can create new associations to one or more DCRs for a particular resource. Select the resource and then click **Associate to existing data collection rules**.

:::image type="content" source="media/data-collection-rule-view/resources-view-associate.png" alt-text="Screenshot of the create association button in the resources view in  the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view-associate.png":::

This opens a list of DCRs that can be associated with the current resource. This list only includes DCRs that are valid for the particular resource. For example, if the resource is a VM with the Azure Monitor agent (AMA) installed, only DCRs that process AMA data are listed. 

:::image type="content" source="media/data-collection-rule-view/resources-view-create-associations.png" alt-text="Screenshot of the create associations view in the resources view in the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view-create-associations.png":::

Click **Review & Associate** to create the association.


### [CLI](#tab/cli)




### [PowerShell](#tab/powershell)

```powershell
 new-azdatacollectionruleassociation -TargetResourceId /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm -DataCollectionRuleId /subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.insights/datacollectionrules/my-dcr -AssociationName my-vm-my-dcr
```

## Create associations


### [ARM](#tab/arm)

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

## Azure policy
Using Azure Policy, you can quickly associate a DCR with multiple resources and have them automatically associated with any new resources that are created. There are multiple built-in policies and policy initiatives that you can use to manage DCRAs. For more information, see [Use Azure Policy to install and manage the Azure Monitor agent](../agents/azure-monitor-agent-policy.md).

To apply a definition, you create an assignment with a particular scope. The definition is applied to all resources of the particular type within that scope. For example, you can apply a policy to all virtual machines in a subscription or a resource group. The definitions that manage DCR associations take the resource ID as a parameter, so you specify this ID when you create the assignment. 

Azure Monitor provides a simplified experience in the portal to quickly create an assignment for a DCR scoped to a particular resource group. From the **Monitor** menu in the Azure portal, select **Data Collection Rules**, and then click on the DCR you want to associate with resources. Select **Policies (Preview)**. 

:::image type="content" source="media/data-collection-rule-association-create-edit/policies-page.png" alt-text="Screenshot of policies page for a data collection rule." lightbox="media/data-collection-rule-association-create-edit/policies-page.png":::

Click either **Assign Policy** or **Assign Initiative** depending on the type of definition you want to assign. This opens up the policy assignment blade where you can specify the scope and other parameters.

:::image type="content" source="media/data-collection-rule-association-create-edit/assign-policy-page.png" alt-text="Screenshot of new policy association page for a data collection rule." lightbox="media/data-collection-rule-association-create-edit/assign-policy-page.png":::

| Setting | Description |
|:---|:---|
| Subscription | The subscription with the resource group to use as the scope. |
| Resource group | The resource group to use as the scope. The DCR will be assigned to all resource in this resource group, depending on the resource group managed by the definition. |
| Policy/Initiative definition | The definition to assign. The dropdown will include all definitions in the subscription that accept DCR as a parameter. |
| Assignment Name | A name for the assignment. Must be unique in the subscription. |
| Description | Optional description of the assignment. |
| Policy Enforcement | The policy is only actually applied if enforcement is enabled. If disabled, only assessments for the policy are performed. |


## Next steps

- [Read about the detailed structure of a data collection rule](data-collection-rule-structure.md)
- [Get details on transformations in a data collection rule](data-collection-transformations.md)
