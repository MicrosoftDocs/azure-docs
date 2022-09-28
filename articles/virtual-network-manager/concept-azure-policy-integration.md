---
title: "Configuring Azure Policy with network groups in Azure Virtual Network Manager (Preview)"
description: Learn about how to utilize Azure Policy to configure a high scale and dynamic network group used with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 08/22/2022
ms.custom: template-concept
---

# Configuring Azure Policy with network groups in Azure Virtual Network Manager (Preview)

In this article, you'll learn how [Azure Policy](../governance/policy/overview.md) is used in Azure Virtual Network Manager to define dynamic network group membership. Dynamic network groups allow you to create scalable and dynamically adapting virtual network environments in your organization. 

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Azure Policy overview

Azure Policy evaluates resources in Azure by comparing the properties of those resources to business rules. These business rules, described in JSON format, are known as [policy definitions](#policy-definition). Once your business rules have been formed, the policy definition is assigned to any scope of resources that Azure supports, such as management groups, subscriptions, resource groups, or individual resources. The assignment applies to all resources within the Resource Manager scope of that assignment. Learn more about scope usage with [Scope in Azure Policy](../governance/policy/concepts/scope.md).

> [!NOTE]
> Azure Policy is only used for the definition of dynamic network group membership.


## Policy definition

Creating and implementing a policy in Azure Policy begins with creating a policy definition resource. Every policy definition has conditions under which it's enforced, and a defined effect that takes place if the conditions are met.

With network groups, your policy definition includes your conditional expression for matching virtual networks meeting your criteria, and specifies the destination network group where any matching resources are placed. The `addToNetworkGroup` effect is used to accomplish this. The following is a sample of a policy rule definition with the `addToNetworkGroup` effect. 

```json

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
          "networkGroupId": "/subscriptions/12345678-abcd-123a-1234-1234abcd7890/resourceGroups/myResourceGroup2/providers/Microsoft.Network/networkManagers/myAVNM/networkGroups/myNG"
        }
      }
}

```
Learn more about [policy definition structure](../governance/policy/concepts/definition-structure.md).

## Policy assignments

Similar to Virtual Network Manager configurations, policy definitions don't immediately take effect when you create them. To begin applying, you must create a Policy Assignment, which assigns a definition to evaluate at a given scope. Currently, all resource within the scope will be evaluated against the definition. This allows you to have a single reusable definition that you can assign at multiple places for more granular group membership control. Learn more information on the [Assignment Structure](../governance/policy/concepts/assignment-structure.md) for Azure Policy.
  
Policy definitions and assignment can be created through with API/PS/CLI or [Azure Policy Portal]().

## Required permissions

To use Azure Policy with network groups, users need the following permissions:
- `Microsoft.Authorization/policyassignments/Write` and `Microsoft.Authorization/policydefinitions/Write` are needed at the scope you're assigning.
- `Microsoft.Network/networkManagers/networkGroups/join/action` action is needed on the target network group referenced in the **Add to network group** section. This permission allows for the adding and removing of objects from the target network group.
- When using set definitions to assign multiple policies at the same time, concurrent `networkGroup/join/action` permissions are needed on all definitions being assigned at the time of assignment.

To set the needed permissions, users can be assigned built-in roles with [role-based access control](../role-based-access-control/quickstart-assign-role-user-portal.md):
- **Network Contributor** role to the target network group. 
- **Resource Policy Contributor** role at the target scope level.

For more granular role assignment, you can create [custom roles](../role-based-access-control/custom-roles-portal.md) using the `networkGroups/join/action` permission and `policy/write` permission.
## Helpful tips

### Type filtering

When configuring your policy definitions, it's recommended to always include a **type** condition to scope it to virtual networks. This will allow Policy to filter out non virtual network operations and improve the efficiency of your policy resources.

### Regional slicing

Policy resources are global, which means that any change will take effect on all resources under the assignment scope, regardless of region. If regional slicing and gradual rollout is a concern for you, it's recommended to also include a `where location in []` condition. Then, you can incrementally expand the locations list to gradually roll out the effect.

### Assignment scoping
If you're following management group best practices using [Azure management groups](../governance/management-groups/overview.md), it's likely you already have your resources organized in a hierarchy structure. Using assignments, you can assign the same definition to multiple distinct scopes within your hierarchy, allowing you to have higher granularity control of which resources are eligible for your network group

## Next steps

- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance.
- Learn about [configuration deployments](concept-deployments.md) in Azure Virtual Network Manager.
- Learn how to block network traffic with a [SecurityAdmin configuration](how-to-block-network-traffic-portal.md).
