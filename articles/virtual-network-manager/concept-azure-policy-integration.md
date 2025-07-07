---
title: "Configuring network groups with Azure Policy in Azure Virtual Network Manager"
description: Learn how to configure network groups with Azure Policy in Azure Virtual Network Manager to create scalable and dynamic virtual network environments. Optimize your network group membership control with policy definitions and assignments.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 06/10/2024
ms.custom: template-concept, engagement-fy23, seo-fy24
#customer intent: As a network administrator, I want to learn how to use Azure Policy to define dynamic network group membership in Azure Virtual Network Manager so that I can create scalable and dynamically adapting virtual network environments in my organization.
---

# Configuring network groups with Azure Policy in Azure Virtual Network Manager

In this article, you learn how [Azure Policy](../governance/policy/overview.md) is used in Azure Virtual Network Manager to define dynamic network group membership. Dynamic network groups allow you to create scalable and dynamically adapting virtual network environments in your organization.

## Azure Policy overview

Azure Policy evaluates resources in Azure by comparing the properties of those resources to business rules. These business rules, described in JSON format, are known as [policy definitions](#network-group-policy-definition). Once your business rules are formed, the policy definition is assigned to any scope of resources that Azure supports, such as management groups, subscriptions, resource groups, or individual resources. The assignment applies to all resources within the Resource Manager scope of that assignment. Learn more about scope usage with [Scope in Azure Policy](../governance/policy/concepts/scope.md).

> [!NOTE]
> Azure Policy is only used for the definition of dynamic network group membership.


## Network group policy definition

Creating and implementing a policy in Azure Policy begins with creating a policy definition resource. Every policy definition has conditions for enforcement, and a defined effect that takes place if the conditions are met.

With network groups, your policy definition includes your conditional expression for matching virtual networks meeting your criteria, and specifies the destination network group where any matching resources are placed. The `addToNetworkGroup` effect is used to place resources in the destination network group. Here's a sample of a policy rule definition with the `addToNetworkGroup` effect. For all custom policies, the `mode` property is set to `Microsoft.Network.Data` to target the network group resource provider and is required for creating a policy definition for Azure Virtual Network Manager.

```json
"mode": "Microsoft.Network.Data",
"policyRule": {
      "if": {
        "allOf": [
          {
            "field": "Name",
            "contains": "-gen"
          }
        ]
      },
      "then": {
        "effect": "addToNetworkGroup",
        "details": {
          "networkGroupId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup2/providers/Microsoft.Network/networkManagers/myAVNM/networkGroups/myNG"
        }
      }
}

```

> [!IMPORTANT]
> When defining a policy, the `networkGroupId` must be the full resource ID of the target network group as seen in the sample definition. It does not support parameterization in the policy definition. If you need to parameterize the network group, you can utilize an Azure Resource Manager template to create the policy definition and assignment.

When Azure Policy is used with Azure Virtual Network Manager, the policy targets a [Resource Provider property](../governance/policy/concepts/definition-structure.md#resource-provider-modes) of `Microsoft.Network.Data`. Because of this, you need to specify a *policyType* of `Custom` in your policy definition. When you [create a policy to dynamically add members](how-to-exclude-elements.md) in Virtual Network Manager, this is applied automatically when the policy is created. You only need to choose `custom` when [creating a new policy definition](../governance/policy/tutorials/create-and-manage.md) through Azure Policy or other tooling outside of the Virtual Network Manager dashboard.

Here's a sample of a policy definition with the `policyType` property set to `Custom`.

```json

"properties": {
      "displayName": "myProdAVNM",
      "policyType": "Custom",
      "mode": "Microsoft.Network.Data",
      "metadata": {
        "category": "Azure Virtual Network Manager",
        "createdBy": "-----------------------------",
        "createdOn": "2023-04-10T15:35:35.9308987Z",
        "updatedBy": null,
        "updatedOn": null
      }
}

```
Learn more about [policy definition structure](../governance/policy/concepts/definition-structure.md).

## Create a policy assignment

Similar to Virtual Network Manager configurations, policy definitions don't immediately take effect when you create them. To begin applying, you must create a policy Assignment, which assigns a definition to evaluate at a given scope. Currently, all resources within the scope are evaluated against the definition, which allows a single reusable definition that you can assign at multiple places for more granular group membership control. Learn more information on the [Assignment Structure](../governance/policy/concepts/assignment-structure.md) for Azure Policy.
  
Policy definitions and assignment can be created through with API/PS/CLI or [Azure Policy Portal]().

## Required permissions

To use network groups with Azure Policy, users need the following permissions:
- `Microsoft.Authorization/policyassignments/Write` and `Microsoft.Authorization/policydefinitions/Write` are needed at the scope you're assigning.
- `Microsoft.Network/networkManagers/networkGroups/join/action` action is needed on the target network group referenced in the **Add to network group** section. This permission allows for the adding and removing of objects from the target network group.
- When using set definitions to assign multiple policies at the same time, concurrent `Microsoft.Network/networkManagers/networkGroups/join/action` permissions are needed on all definitions being assigned at the time of assignment.

To set the needed permissions, users can be assigned built-in roles with [role-based access control](../role-based-access-control/quickstart-assign-role-user-portal.md):
- **Network Contributor** role to the target network group.
- **Resource Policy Contributor** role at the target scope level.

For more granular role assignment, you can create [custom roles](../role-based-access-control/custom-roles-portal.md) using the `Microsoft.Network/networkManagers/networkGroups/join/action` permission and `policy/write` permission.

> [!IMPORTANT]
> To modify AVNM dynamic groups, you must be granted access via Azure RBAC role assignment only.
> Classic Admin/legacy authorization is not supported; this means if your account were
> assigned only the co-administrator subscription role, you'd have no permissions on AVNM
> dynamic groups.

Along with the required permissions, your subscriptions and management groups must be registered with the following resource providers:
- `Microsoft.Network` is required to create virtual networks.
- `Microsoft.PolicyInsights` is required to use Azure Policy.

To set register the needed providers, use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) in Azure PowerShell or [az provider register](/cli/azure/provider) in Azure CLI.

## Helpful tips

### Type filtering

When configuring your policy definitions, we recommend you include a **type** condition to scope it to virtual networks. This condition allows a policy to filter out non virtual network operations and improve the efficiency of your policy resources.

### Regional slicing

Policy resources are global, which means that any change takes effect on all resources under the assignment scope, regardless of region. If regional slicing and gradual rollout is a concern for you, we recommend you include a `where location in []` condition. Then, you can incrementally expand the locations list to gradually roll out the effect.

### Assignment scoping
If you're following management group best practices using [Azure management groups](../governance/management-groups/overview.md), it's likely you already have your resources organized in a hierarchy structure. Using assignments, you can assign the same definition to multiple distinct scopes within your hierarchy, allowing you to have higher granularity control of which resources are eligible for your network group.

### Deleting an Azure Policy definition associated with a network group

You can be instances where you no longer need an Azure Policy definition. Instances include when a network group associated with a policy is deleted, or you have an unused policy that you no longer need. To delete the policy, you need to delete the policy association object, and then delete the policy definition in [Azure Policy](../governance/policy/tutorials/create-custom-policy-definition.md#clean-up-resources). Once deletion is completed, the definition name can't be reused or re-referenced when associating a new definition to a network group.

## Next steps

- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance.
- Learn about [configuration deployments](concept-deployments.md) in Azure Virtual Network Manager.
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).
