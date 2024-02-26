---
title: "Tutorial: Add user assign identities to virtual machines"
description: Learn how to update virtual machines' and virtual machine scale sets' identities to be user assigned as a prerequisite to install the Azure Monitoring Agent
ms.date: 04/02/2023
ms.topic: how-to
ms.custom: devx-track-azurepowershell
author: kenieva
ms.author: kenieva
---
# Tutorial: Adding user assigned managed identities to existing virtual machines or virtual machine scale sets 

Existing virtual machines and virtual machines scale sets that need to use the [Azure Monitoring Agent](../../../azure-monitor/agents/agents-overview.md) must be updated to use a user assigned managed identity. This article shows the steps needed to assign a custom definition that adds a user assigned identity to those resources at scale via Azure Policy.

 > [!NOTE]
> The definition template MUST be assigned with [enforcement mode disabled (DoNotEnforce)](../concepts/assignment-structure.md#enforcement-mode) to prevent failures on newly created resources. 

## Prerequisites 

- Create a user assigned identity that has permissions needed to install the Azure Monitoring Agent within the resources. 

## Create, assign and remediate policy definition 
### Using portal

To remediate the existing resources, follow these steps:

1. Launch the Azure Policy service in the Azure portal by clicking **All services**, then searching
   for and selecting **Policy**.

1. Select **Definitions** on the left side of the Azure Policy page.

1. Use the **+Policy definition** button to create a custom policy definition.

1. On the tab, set the following options:

   - **Definition Location**: Set to target scope.
   - **Name**: Set to name of the custom definition. Example: "_Modify identities on existing VM and VMSS [ASSIGN TO DO NOT ENFORCE]_"

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

1. Select **Save**. Once the custom policy definition is created successfully, the definition view will be populated. Select the **Assign** button or navigate to the **Assignments** tab to assign the definition.

1. Ensure that the information in **Scope** and **Basics** is set as expected. 

1. Set **Policy enforcement** to **Disabled**. EnforcementMode disables any enforcement at resource creation or update time. Learn more on [enforcement mode](../concepts/assignment-structure.md#enforcement-mode).

    > [!NOTE]
    > The definition template MUST be assigned with enforcement mode disabled (DoNotEnforce) to prevent failures on newly created resources.  

1. Select the **Parameters** tab. The parameter `userAssignedIdentities` expects an existing user assigned identity ID with proper permissions to the virtual machine or virtual machine scale set. The ID should be inputted in the following format: `/subscriptions/subID/resourceGroups/RGName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/testUAMI`

1. Select the **Remediation** tab, check the **create a remediation task** box so that any existing virtual machines and virtual machine scale sets can be remediated. For assignments at the management group level, a remediation can be triggered after assignment creation, following the [remediate resources tutorial](../how-to//remediate-resources.md). 

1. Ensure that the information in **managed identity** is as expected. 

1. Select **Review + create**. Your custom definition has been assigned. For assignments at the subscription level or below, the existing virtual machines and virtual machines scale sets are remediated via a policy remediation task. Any future virtual machines and virtual machine scale sets or assignments at the management group level must be remediated by following the [remediate resources tutorial](../how-to/remediate-resources.md). 


### Using PowerShell

1. Use the following JSON snippet to create a JSON file with the name _ModifyVMIdentities.json_.

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

   For more information about authoring a policy definition, see [Azure Policy Definition
   Structure](../concepts/definition-structure.md).

1. Run the following command to create a policy definition using the ModifyVMIdentities.json file.

   ```azurepowershell-interactive
   New-AzPolicyDefinition -Name 'ModifyVMIdentities' -DisplayName 'Modify identities on existing VMs and VMSS' -Policy 'ModifyVMIdentities.json'
   ```

   The command creates a policy definition named _Modify identities on existing VMs and VMSS_.

   When called without location parameters, `New-AzPolicyDefinition` defaults to saving the policy
   definition in the selected subscription of the session's context. To save the definition to a
   different location, use the following parameters:

   - **SubscriptionId** - Save to a different subscription. Requires a _GUID_ value.
   - **ManagementGroupName** - Save to a management group. Requires a _string_ value.

1. After you create your policy definition, you can create a policy assignment by running the
   following commands:

   ```azurepowershell-interactive
   $Subscription = Get-AzSubscription -SubscriptionName 'Subscription01'
   $Policy = Get-AzPolicyDefinition -Name 'ModifyVMIdentities'
   $VMuserassignedidentity = Get-AzUserAssignedIdentity -ResourceGroupName 'NMidentityRG' -Name $VMuserassignedidentityname
   $VMuserassignedidentityid = $VMuserassignedidentity.Id
   New-AzPolicyAssignment -Name 'ModifyVMIdentities' -PolicyDefinition $Policy -Scope "/subscriptions/$($Subscription.Id)" -EnforcementMode DoNotEnforce -Location 'westus' -IdentityType "SystemAssigned" -PolicyParameterObject $VMuserassignedidentityid
   ```

    > [!NOTE]
    > The definition  MUST be assigned with enforcement mode disabled (DoNotEnforce) to prevent failures on newly created resources.  

   Replace _Subscription01_ with the name of your intended resource group.

   The **Scope** parameter on `New-AzPolicyAssignment` works with management group, subscription,
   resource group, or a single resource. The parameter uses a full resource path, which the
   **ResourceId** property on `Get-AzResourceGroup` returns. The pattern for **Scope** for each
   container is as follows. Replace `{rName}`, `{rgName}`, `{subId}`, and `{mgName}` with your
   resource name, resource group name, subscription ID, and management group name, respectively.
   `{rType}` would be replaced with the **resource type** of the resource, such as
   `Microsoft.Compute/virtualMachines` for a VM.

   - Resource - `/subscriptions/{subID}/resourceGroups/{rgName}/providers/{rType}/{rName}`
   - Resource group - `/subscriptions/{subId}/resourceGroups/{rgName}`
   - Subscription - `/subscriptions/{subId}`
   - Management group - `/providers/Microsoft.Management/managementGroups/{mgName}`

1. After you create the policy assignment, you can create a remediation task that adds the identity to existing virtual machine and virtual machine scale sets resources by running the following command: 

    ```azurepowershell-interactive
    Start-AzPolicyRemediation -Name 'remediationVMidentities' -PolicyAssignmentId '/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyAssignments/ModifyVMIdentities'
    ```


## Next steps

- Understand [Remediation task structure](../concepts/remediation-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Learn how to [remediate noncompliant resources](../how-to/remediate-resources.md).
- Learn more on [enforcement mode](../concepts/assignment-structure.md#enforcement-mode)
- Learn more on [installing Azure Monitor Agent using Azure Policy](../../../azure-monitor/agents/azure-monitor-agent-manage.md)
