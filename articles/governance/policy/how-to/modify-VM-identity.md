---
title: Remediate identities for virtual machines
description: Learn how to update virtual machines' and virtual machine scale sets' identities to be user assigned as a pre-reqiste to intall the Azure Monitoring Agent
ms.date: 04/02/2023
ms.topic: how-to
author: kenieva
ms.author: kenieva
---
# Adding an user assigned managed identity to existing virtual machine or virtual machine scale set resources

Existing virtual machines and virtual machines scale sets that need to use the [Azure Monitoring Agent](../../../azure-monitor/agents/agents-overview.md) must be updated to use an user assigned managed identity. This article shows the steps needed to assign a custom definition that adds a user assigned identity to those resources at scale via Azure Policy.

 > [!NOTE]
> The definition template MUST be assigned with enforcement mode disabled (DoNotEnforce) to prevent failures on newly created resources. 

# Prerequisites 

1. Create an user assigned identity that has permissions needed to install the Azure Monitoring Agent within the resources. 


# Using Portal

To remediate the exisiting resources, follow these steps:

1. Launch the Azure Policy service in the Azure portal by clicking **All services**, then searching
   for and selecting **Policy**.

1. Select **Definitions** on the left side of the Azure Policy page.

1. Use the **Policy definition** button to create a custom policy definition.

1. On the tab, set the following options:

   - **Definition Location**: Set to target scope.
   - **Name**: Set to name the custom definition. Example: "Modify identities on existing VMs and VMSS [ASSIGN TO DO NOT ENFORCE]"

1. In the **Policy Rule** json block, remove the example JSON and paste the following definition that uses the `modify` effect to add the user assign identity: 

```json 
{
  "mode": "Indexed",
  "parameters": {
    "userAssignedIdentities": {
      "type": "String",
      "metadata": {
        "displayName": "userAssignedIdentities"
      }
    }
  },
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "in": [
            "Microsoft.Compute/virtualMachines",
            "Microsoft.Compute/virtualMachineScaleSets"
          ]
        },
        {
          "value": "[requestContext().apiVersion]",
          "greaterOrEquals": "2018-10-01"
        },
        {
          "field": "identity.userAssignedIdentities",
          "notContainsKey": "[parameters('userAssignedIdentities')]"
        }
      ]
    },
    "then": {
      "effect": "modify",
      "details": {
        "roleDefinitionIds": [
          "/providers/microsoft.authorization/roleDefinitions/9980e02c-c2be-4d73-94e8-173b1dc7cf3c"
        ],
        "operations": [
          {
            "operation": "AddOrReplace",
            "field": "identity.type",
            "value": "[if(contains(field('identity.type'), 'SystemAssigned'), 'SystemAssigned,UserAssigned', 'UserAssigned')]"
          },
          {
            "operation": "addOrReplace",
            "field": "identity.userAssignedIdentities",
            "value": "[createObject(parameters('userAssignedIdentities'), createObject())]"
          }
        ]
      }
    }
  }
}

```

   1. Select **Save**. Once the custom policy definition is created successfuly, click **Assign** within the definition view blade. Or nagivate the **Assignments** tab to assign the definition. 

   1. Ensure that the information in **Scope** and **Basics** is set as expected. 

   1. Set **Policy enforcement** to **Disabled**. This will disable any enforcement at resource creation or update time. Learn more on [enforcement mode](../concepts/assignment-structure.md#enforcement-mode)

   > [!NOTE]
   > The definition template MUST be assigned with enforcement mode disabled (DoNotEnforce) to prevent failures on newly created resources.  

   1. Click the **Parameters** tab. The parameter `userAssignedIdentities` expects an exisiting user assigned identity ID with proper permissions to the virtual machine or virtual machine scale set. The ID should be inputted in the following format: `/subscriptions/subID/resourceGroups/RGName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/testUAMI`

   1. Click the **Remediation** tab, check the **create a remediation task** box so that any exisiting VMs and VMSS will be remediated. For assignments at the management group level, a remediation can be triggered after assignment creation, following the [remediate resources tutorial](./remediate-resources.md). 

   1. Ensure that the information in **managed identity** is as expected. 

   1. Select **Review + create**. Your custom definition has been assigned. For assignments at the subscription level or lower scope, all exisiting virtual machines and virtual machines scale sets will be remediated via a policy remediation task. Any future virtual machine or virtual machine scale sets or assignments at the management group level must can be remediated by following the [remediate resources tutorial](./remediate-resources.md). 


## Next steps

- Understand [Remediation task structure](../concepts/remediation-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Learn how to [remediate non-compliant resources](remediate-resources.md).
- Learn more on [enforcement mode](../concepts/assignment-structure.md#enforcement-mode)
- Learn more on [installing Azure Monitor Agent using Azure Policy](../../../azure-monitor/agents/azure-monitor-agent-manage.md)

