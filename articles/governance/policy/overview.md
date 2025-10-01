---
title: Overview of Azure Policy
description: An overview of the Azure Policy service that you use to create, assign, and manage policy definitions in your Azure environment.
ms.date: 03/04/2025
ms.topic: overview
---

# What is Azure Policy?

This overview describes how Azure Policy helps to enforce organizational standards and to assess compliance at-scale. Through its compliance dashboard, it provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to the per-resource, per-policy granularity. It also helps to bring your resources to compliance through bulk remediation for existing resources and automatic remediation for new resources.

> [!NOTE]
> For more information about remediation, see [Remediate non-compliant resources with Azure Policy](./how-to/remediate-resources.md).

Common use cases for Azure Policy include implementing governance for resource consistency, regulatory compliance, security, cost, and management. Policy definitions for these common use cases are already available in your Azure environment as built-ins to help you get started.

Some useful governance actions you can enforce with Azure Policy include:

- Ensure your team deploys Azure resources only to allowed regions.
- Enforce the consistent application of taxonomic tags.
- Require resources to send diagnostic logs to a Log Analytics workspace.

It's important to recognize that with the introduction of [Azure Arc](/azure/azure-arc/overview), you can extend your policy-based governance across different cloud providers and even to your local datacenters.

All Azure Policy data and objects are encrypted at rest. For more information, see [Azure data encryption at rest](../../security/fundamentals/encryption-atrest.md).

## Overview

Azure Policy evaluates resources and actions in Azure by comparing the properties of those resources to business rules. These business rules, described in [JSON format](./concepts/definition-structure-basics.md), are known as [policy definitions](#policy-definition). To simplify management, several business rules can be grouped together to form a [policy initiative](#initiative-definition), also referred to as a _policySet_.

After your business rules are formed, the policy definition or initiative is [assigned](#assignments) to any scope of resources that Azure supports. For example, [management groups](../management-groups/overview.md), subscriptions, [resource groups](../../azure-resource-manager/management/overview.md#resource-groups), or individual resources. The assignment applies to all resources within the [Resource Manager scope](../../azure-resource-manager/management/overview.md#understand-scope) of that assignment. Subscopes can be excluded, if necessary. For more information, see [Scope in Azure Policy](./concepts/scope.md).

Azure Policy uses a [JSON format](./concepts/definition-structure-basics.md) to form the logic the evaluation uses to determine whether a resource is compliant or not. Definitions include metadata and the policy rule. The defined rule can use functions, parameters, logical operators, conditions, and property [aliases](./concepts/definition-structure-alias.md) to match exactly the scenario you want. The policy rule determines which resources in the scope of the assignment get evaluated.

### Understand evaluation outcomes

Resources are evaluated at specific times during the resource lifecycle, the policy assignment lifecycle, and for regular ongoing compliance evaluation. The following are the times or events that cause a resource to be evaluated:

- A resource is created or updated in a scope with a policy assignment.
- A scope gets a new assignment of a policy or initiative.
- A policy or initiative already assigned to a scope is updated.
- The standard compliance evaluation cycle that occurs once every 24 hours.

For detailed information about when and how policy evaluation happens, see [Evaluation triggers](./how-to/get-compliance-data.md#evaluation-triggers).

### Control the response to an evaluation

Business rules for handling non-compliant resources vary widely between organizations. Examples of how an organization wants the platform to respond to a non-compliant resource include:

- Deny the resource change.
- Log the change to the resource.
- Alter the resource before the change.
- Alter the resource after the change.
- Deploy related compliant resources.
- Block actions on resources.

Azure Policy makes each of these business responses possible through the application of [effects](./concepts/effect-basics.md). Effects are set in the **policy rule** portion of the [policy definition](./concepts/definition-structure-basics.md).

### Remediate non-compliant resources

While these effects primarily affect a resource when the resource is created or updated, Azure Policy also supports dealing with existing non-compliant resources without needing to alter that resource. For more information about making existing resources compliant, see [Remediate non-compliant resources with Azure Policy](./how-to/remediate-resources.md).

## Getting started

### Azure Policy and Azure RBAC

There are a few key differences between Azure Policy and Azure role-based access control (Azure RBAC). Azure Policy evaluates state by examining properties on resources that are represented in Resource Manager and properties of some Resource Providers. Azure Policy ensures that resource state is compliant to your business rules without concern for who made the change or who has permission to make a change. Azure Policy through DenyAction effect can also block certain actions on resources. Some Azure Policy resources, such as [policy definitions](#policy-definition), [initiative definitions](#initiative-definition), and [assignments](#assignments), are visible to all users. This design enables transparency to all users and services for what policy rules are set in their environment.

Azure RBAC focuses on managing user [actions](../../role-based-access-control/resource-provider-operations.md) at different scopes. If control of an action is required based on user information, then Azure RBAC is the correct tool to use. Even if an individual has access to perform an action, if the result is a non-compliant resource, Azure Policy still blocks the create or update.

The combination of Azure RBAC and Azure Policy provides full scope control in Azure.

### Azure RBAC permissions in Azure Policy

Azure Policy has several permissions, known as operations, in two Resource Providers:

- [Microsoft.Authorization](../../role-based-access-control/resource-provider-operations.md#microsoftauthorization)
- [Microsoft.PolicyInsights](../../role-based-access-control/resource-provider-operations.md#microsoftpolicyinsights)

Many built-in roles grant permission to Azure Policy resources. The **Resource Policy Contributor** role includes most Azure Policy operations. **Owner** has full rights. Both **Contributor** and **Reader** have access to all _read_ Azure Policy operations.

**Contributor** might trigger resource remediation, but can't _create_ or _update_ definitions and assignments. **User Access Administrator** is necessary to grant the managed identity on `deployIfNotExists` or `modify` assignments necessary permissions.

> [!NOTE]
> All Policy objects, including definitions, initiatives, and assignments, are readable to all roles over its scope. For example, a Policy assignment scoped to an Azure subscription is readable by all role holders at the subscription scope and lower.

If none of the built-in roles have the permissions required, create a [custom role](../../role-based-access-control/custom-roles.md).

Azure Policy operations can have a significant effect on your Azure environment. Only assign the minimum set of permissions necessary to perform a task and only grant these permissions to users who need permission.

> [!NOTE]
> The managed identity of a `deployIfNotExists` or `modify` policy assignment needs enough permissions to create or update targeted resources. For more information, see [Configure the policy definition](./how-to/remediate-resources.md#configure-the-policy-definition).

### Special permissions requirement for Azure Policy with Azure Virtual Network Manager

[Azure Virtual Network Manager (preview)](../../virtual-network-manager/overview.md) enables you to apply consistent management and security policies to multiple Azure virtual networks throughout your cloud infrastructure. Azure Virtual Network Manager (AVNM) dynamic groups use Azure Policy definitions to evaluate virtual network membership in those groups.

To create, edit, or delete Azure Virtual Network Manager dynamic group policies, you need:

- Read and write Azure RBAC permissions to the underlying policy
- Azure RBAC permissions to join the network group. Classic Administrator authorization isn't supported.

The required resource provider permission is `Microsoft.Network/networkManagers/networkGroups/join/action`.

> [!IMPORTANT]
> To modify AVNM dynamic groups, you must be granted access via Azure RBAC role assignment only. Classic Administrator or legacy authorization isn't supported. If your account was assigned only the Co-Administrator subscription role, you wouldn't have permissions on AVNM dynamic groups.

### Resources covered by Azure Policy

Although a policy can be assigned at the management group level, _only_ resources at the subscription or resource group level are evaluated.

For certain resource providers such as [Machine configuration](../machine-configuration/overview.md), [Azure Kubernetes Service](/azure/aks/intro-kubernetes), and [Azure Key Vault](/azure/key-vault/general/overview), there's a deeper integration for managing settings and objects. To find out more, go to [Resource Provider modes](./concepts/definition-structure-basics.md#resource-provider-modes).

### Recommendations for managing policies

Here are a few pointers and tips to keep in mind:

- Start with an `audit` or `auditIfNotExists` effect instead of an enforcement (`deny`, `modify`, `deployIfNotExists`) effect to track how your policy definition affects the resources in your environment. If you have scripts already in place to autoscale your applications, setting an enforcement effect might hinder such automation tasks already in place.

- Consider organizational hierarchies when you create definitions and assignments. We recommend creating definitions at higher levels such as the management group or subscription level. Then, create the assignment at the next child level. If you create a definition at a management group, the assignment can be scoped down to a subscription or resource group within that management group.

- We recommend creating and assigning initiative definitions even if starting with a single policy definition. This method enables you to add policy definitions to the initiative later without increasing the number of assignments to manage.

  - For example, imagine you create policy definition _policyDefA_ and add it to initiative definition _initiativeDefC_. If you later create another policy definition _policyDefB_ with goals similar to _policyDefA_, you can add it under _initiativeDefC_ and track them together.

  - After you create an initiative assignment, policy definitions added to the initiative also become part of that initiative's assignments.

  - When an initiative assignment is evaluated, all policies within the initiative are also evaluated. If you need to evaluate a policy individually, it's better to not include it in an initiative.

- Manage Azure Policy resources as code with manual reviews on changes to policy definitions, initiatives, and assignments. To learn more about suggested patterns and tooling, see [Design Azure Policy as Code workflows](./concepts/policy-as-code.md).

## Azure Policy objects

The objects include policy definitions, initiative definitions, and assignments.

### Policy definition

The journey to create and implement a policy in Azure Policy begins when you create a policy definition. Every policy definition has conditions that are enforced. And, it has a defined effect that takes place if the conditions are met.

In Azure Policy, we offer several built-in policies that are available by default. For example:

- **Allowed Storage Account SKUs** (Deny): Determines if a storage account being deployed is within a set of SKU sizes. Its effect is to deny all storage accounts that don't adhere to the set of defined SKU sizes.
- **Allowed Resource Type** (Deny): Defines the resource types that you can deploy. Its effect is to deny all resources that aren't part of this defined list.
- **Allowed Locations** (Deny): Restricts the available locations for new resources. Its effect is used to enforce your geo-compliance requirements.
- **Allowed Virtual Machine SKUs** (Deny): Specifies a set of virtual machine SKUs that you can deploy.
- **Add a tag to resources** (Modify): Applies a required tag and its default value if the deploy request doesn't specify it.
- **Not allowed resource types** (Deny): Prevents a list of resource types from being deployed.

To implement these policy definitions (both built-in and custom definitions), you need to assign them. You can assign any of these policies through the Azure portal, PowerShell, or Azure CLI.

Policy evaluation happens with several different actions, such as policy assignment or policy updates. For a complete list, see [Policy evaluation triggers](./how-to/get-compliance-data.md#evaluation-triggers).

To learn more about the structures of policy definitions, review [Azure Policy definition structure basics](./concepts/definition-structure-basics.md).

Policy parameters help simplify your policy management by reducing the number of policy definitions you must create. You can define parameters when creating a policy definition to make it more generic. Then you can reuse that policy definition for different scenarios. You do so by passing in different values when assigning the policy definition. For example, specifying one set of locations for a subscription.

Parameters are defined when you create a policy definition. The parameter's definition includes the parameter name and optional values. For example, you could define a parameter for a policy titled _location_. Then you can give it different values such as _EastUS_ or _WestUS_ when assigning a policy.

For more information about policy parameters, see [Azure Policy definition structure parameters](./concepts/definition-structure-parameters.md).

### Initiative definition

An initiative definition is a collection of policy definitions that are tailored toward achieving a singular overarching goal. Initiative definitions simplify managing and assigning policy definitions. They simplify by grouping a set of policies as one single item. For example, you could create an initiative titled **Enable Monitoring in Microsoft Defender for Cloud**, with a goal to monitor all the available security recommendations in your Microsoft Defender for Cloud instance.

> [!NOTE]
> The SDK, such as Azure CLI and Azure PowerShell, use properties and parameters named **PolicySet** to refer to initiatives.

Under this initiative, you would have policy definitions such as:

- **Monitor unencrypted SQL Database in Microsoft Defender for Cloud** - For monitoring unencrypted SQL databases and servers.
- **Monitor OS vulnerabilities in Microsoft Defender for Cloud** - For monitoring servers that don't satisfy the configured baseline.
- **Monitor missing Endpoint Protection in Microsoft Defender for Cloud** - For monitoring servers without an installed endpoint protection agent.

Like policy parameters, initiative parameters help simplify initiative management by reducing redundancy. Initiative parameters are parameters being used by the policy definitions within the initiative.

For example, in the following scenario you have an initiative definition **initiativeC**, with policy definitions **policyA** and **policyB** where each expects a different type of parameter:

| Policy | Name of parameter | Type of parameter  | Note |
|---|---|---|---|
| **policyA** | `allowedLocations` | array  | This parameter expects a list of strings for a value since the parameter type was defined as an array. |
| **policyB** | `allowedSingleLocation` | string | This parameter expects one word for a value since the parameter type was defined as a string. |

When you define the initiative parameters for **initiativeC**, you have three options:

- Use the parameters of the policy definitions within this initiative: In this example, `allowedLocations` and `allowedSingleLocation` become initiative parameters for **initiativeC**.
- Provide values to the parameters of the policy definitions within this initiative definition. In this example, you can provide a list of locations to the **policyA** parameter `allowedLocations` and the **policyB** `allowedSingleLocation`. You can also provide values when you assign this initiative.
- Provide a list of _value_ options that can be used when assigning this initiative. When you assign this initiative, the inherited parameters from the policy definitions within the initiative, can only have values from this provided list.

When you create value options in an initiative definition, you're unable to input a different value during the initiative assignment because it's not part of the list.

To learn more about the structures of initiative definitions, review [Azure Policy initiative definition structure](./concepts/initiative-definition-structure.md).

### Assignments

An assignment is a policy definition or initiative that was assigned to a specific scope. This scope could range from a [management group](../management-groups/overview.md) to an individual resource. The term _scope_ refers to all the resources, resource groups, subscriptions, or management groups that the definition is assigned to. All child resources inherit the assignments. This design means that a definition applied to a resource group is also applied to resources in that resource group. However, you can exclude a subscope from the assignment.

For example, at the subscription scope, you can assign a definition that prevents the creation of networking resources. You could exclude a resource group in that subscription that is intended for networking infrastructure. You then grant access to this networking resource group to users that you trust with creating networking resources.

In another example, you might want to assign a resource type allowlist definition at the management group level. Then you assign a more permissive policy (allowing more resource types) on a child management group or even directly on subscriptions. However, this example wouldn't work because Azure Policy is an explicit deny system. Instead, you need to exclude the child management group or subscription from the management group-level assignment. Then, assign the more permissive definition on the child management group or subscription level. If any assignment results in a resource getting denied, then the only way to allow the resource is to modify the denying assignment.

Policy assignments always use the latest state of their assigned definition or initiative when evaluating resources. If an assigned policy definition is changed, all existing assignments of that definition use the updated logic when evaluating.

For more information on setting assignments through the portal, see [Create a policy assignment to identify non-compliant resources in your Azure environment](./assign-policy-portal.md). Steps for [PowerShell](./assign-policy-powershell.md) and [Azure CLI](./assign-policy-azurecli.md) are also available. For information on the assignment structure, see [Azure Policy assignment structure](./concepts/assignment-structure.md).

## Maximum count of Azure Policy objects

[!INCLUDE [policy-limits](../includes/policy/azure-policy-limits.md)]

## Next steps

Now that you have an overview of Azure Policy and some of the key concepts, use the following links to learn more about the service.

- [Azure Policy glossary](./policy-glossary.md).
- [Azure Policy definition structure basics](./concepts/definition-structure-basics.md).
- [Quickstart: Create a policy assignment to identify non-compliant resources using Azure portal](./assign-policy-portal.md).
