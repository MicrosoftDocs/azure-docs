---
title: "Configuring network groups with Azure Policy in Azure Virtual Network Manager"
description: Learn how to configure network groups with Azure Policy in Azure Virtual Network Manager to create scalable and dynamic virtual network environments. Optimize your network group membership control with policy definitions and assignments.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 07/11/2025
ms.custom: template-concept, engagement-fy23, seo-fy24
#customer intent: As a network administrator, I want to learn how to use Azure Policy to define dynamic network group membership in Azure Virtual Network Manager so that I can create scalable and dynamically adapting virtual network environments in my organization.
---

# Configuring network groups with Azure Policy in Azure Virtual Network Manager

In this article, you learn how [Azure Policy](../governance/policy/overview.md) is used in Azure Virtual Network Manager to conditionally define network group membership. Using Azure Policy to define your network group membership enables automatic configuration deployment to your network resources, empowering you to create scalable and dynamic virtual network environments for your organization.

## Azure Policy overview

Azure Policy evaluates resources in Azure by comparing the properties of those resources to your desired business rules. These business rules, described in JSON format, are known as [policy definitions](#network-group-policy-definition). Once you create your business rules, the policy definition is assigned to any scope of resources that Azure supports, such as management groups, subscriptions, resource groups, or individual resources. The policy assignment applies to all resources within the Resource Manager scope of that assignment. Learn more about scope usage with [Scope in Azure Policy](../governance/policy/concepts/scope.md).

## Network group policy definition

Creating and implementing a policy in Azure Policy begins with creating a policy definition resource. Every policy definition has conditions for enforcement and a defined effect that takes place if the conditions are met.

With Azure Virtual Network Manager's [network groups](concept-network-groups.md), your policy definition includes your conditional expression for matching virtual networks that meet your criteria, and specifies the network group that those matching virtual networks join. The `addToNetworkGroup` effect is used to place resources in the destination network group. Here's a sample of a policy rule definition with the `addToNetworkGroup` effect. For all custom policies, the `mode` property is set to `Microsoft.Network.Data` to target the network group resource provider and is required for creating a policy definition for Azure Virtual Network Manager.

> [!NOTE]
> Azure Policy currently only supports the definition of network group membership for virtual networks.

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
> When you define a policy, the `networkGroupId` must be the full resource ID of the target network group as seen in the sample definition. It doesn't support parameterization in the policy definition. If you need to parameterize the network group, you can utilize an Azure Resource Manager template to create the policy definition and assignment.

When Azure Policy is used with Azure Virtual Network Manager, the policy targets a [Resource Provider property](../governance/policy/concepts/definition-structure.md#resource-provider-modes) of `Microsoft.Network.Data`. Because of this behavior, you need to specify a *policyType* of `Custom` in your policy definition. When you [create a policy to dynamically add members](how-to-exclude-elements.md) in Azure Virtual Network Manager, it is applied automatically when the policy is created. You only need to choose `custom` when [creating a new policy definition](../governance/policy/tutorials/create-and-manage.md) through Azure Policy or other tooling outside of the Azure Virtual Network Manager dashboard.

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
  
Policy definitions and assignment can be created via Azure Virtual Network Manager or Azure Policy.

## Required permissions

To use network groups with Azure Policy, users need the following permissions:
- `Microsoft.Authorization/policyassignments/Write` and `Microsoft.Authorization/policydefinitions/Write` are needed at the scope you're assigning.
- `Microsoft.Network/networkManagers/networkGroups/join/action` is needed on the target network group. This permission allows for the addition and removal of member resources from the target network group.
- When using set definitions to assign multiple policies at the same time, concurrent `Microsoft.Network/networkManagers/networkGroups/join/action` permissions are needed on all definitions being assigned simultaneously.

To set the needed permissions, users can be assigned built-in roles with [role-based access control](../role-based-access-control/quickstart-assign-role-user-portal.md):
- **Network Contributor** role to the target network group.
- **Resource Policy Contributor** role at the target scope level.

For more granular role assignment, you can create [custom roles](../role-based-access-control/custom-roles-portal.md) using the `Microsoft.Network/networkManagers/networkGroups/join/action` permission and `policy/write` permission.

> [!IMPORTANT]
> To modify Azure Virtual Network Manager network groups with Azure Policy, you must be granted access via Azure Role-Based Access Control (RBAC) role assignment only.
> Classic Admin or legacy authorization isn't supported. This means if your account is
> assigned only the co-administrator subscription role, you don't have any permissions on the network groups.

Along with the required permissions, your subscriptions and management groups must be registered with the following resource providers:
- `Microsoft.Network` is required to create virtual networks.
- `Microsoft.PolicyInsights` is required to use Azure Policy.

To set register the needed providers, use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) in Azure PowerShell or [az provider register](/cli/azure/provider) in the Azure CLI.

## Helpful tips

### Type filtering

When configuring your policy definitions, we recommend you include a **type** condition to scope it to virtual networks. This condition allows a policy to filter out non-virtual network operations and improve the efficiency of your policy resources.

### Regional slicing

Policy resources are global, meaning that any change to the policy definition takes effect on all resources under the assignment scope, regardless of region. If you desire regional slicing or gradual rollout, we recommend you include a `where location in []` condition. You can then incrementally expand the location list to gradually roll out network group membership and subsequent configuration deployment.

### Assignment scoping
If you're following best practices using [Azure management groups](../governance/management-groups/overview.md), you might already have your resources organized in a hierarchical structure. Using policy assignments, you can assign the same policy definition to multiple distinct scopes within your hierarchy, allowing you to have a higher granularity of control over which resources are eligible for your network group.

### Deleting an Azure Policy definition associated with a network group

You might have scenarios where you no longer need an Azure Policy definition. Scenarios include when a network group associated with a policy is deleted or you have an unused policy that you no longer need. To delete the policy, you must delete the policy association object, then delete the policy definition in [Azure Policy](../governance/policy/tutorials/create-custom-policy-definition.md#clean-up-resources). Once deletion is completed, the definition name can no longer be re-referenced when associating a new definition to a network group.

## Next steps

- Learn how to [define network group membership with Azure Policy](how-to-define-network-group-membership-azure-policy.md) in Azure Virtual Network Manager.
- Learn more about [network groups](concept-network-groups.md) in Azure Virtual Network Manager.
- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance.
- Learn about [configuration deployments](concept-deployments.md) in Azure Virtual Network Manager.
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).
