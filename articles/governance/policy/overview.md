---
title: Overview of Azure Policy
description: Azure Policy is a service in Azure, that you use to create, assign and, manage policy definitions in your Azure environment.
author: DCtheGeek
ms.author: dacoulte
ms.date: 12/06/2018
ms.topic: overview
ms.service: azure-policy
manager: carmonm
---
# Overview of the Azure Policy service

Governance validates that your organization can achieve its goals through effective and efficient
use of IT. It meets this need by creating clarity between business goals and IT projects.

Does your company experience a significant number of IT issues that never seem to get resolved?
Good IT governance involves planning your initiatives and setting priorities on a strategic level
to help manage and prevent issues. This strategic need is where Azure Policy comes in.

Azure Policy is a service in Azure that you use to create, assign, and manage policies. These
policies enforce different rules and effects over your resources, so those resources stay compliant
with your corporate standards and service level agreements. Azure Policy meets this need by
evaluating your resources for non-compliance with assigned policies. For example, you can have a
policy to allow only a certain SKU size of virtual machines in your environment. Once this policy
is implemented, new and existing resources are evaluated for compliance. With the right type of
policy, existing resources can be brought into compliance. Later in this documentation, we'll go
over more details on how to create and implement policies with Azure Policy.

> [!IMPORTANT]
> Azure Policy's compliance evaluation is now provided for all assignments
> regardless of pricing tier. If your assignments do not show the compliance data, please ensure that
> the subscription is registered with the Microsoft.PolicyInsights resource provider.

[!INCLUDE [service-provider-management-toolkit](../../../includes/azure-lighthouse-supported-service.md)]

## How is it different from RBAC?

There are a few key differences between Azure Policy and role-based access control (RBAC). RBAC
focuses on user actions at different scopes. You might be added to the contributor role for a
resource group, allowing you to make changes to that resource group. Azure Policy focuses on
resource properties during deployment and for already existing resources. Azure Policy controls
properties such as the types or locations of resources. Unlike RBAC, Azure Policy is a default allow
and explicit deny system.

### RBAC Permissions in Azure Policy

Azure Policy has several permissions, known as operations, in two Resource Providers:

- [Microsoft.Authorization](../../role-based-access-control/resource-provider-operations.md#microsoftauthorization)
- [Microsoft.PolicyInsights](../../role-based-access-control/resource-provider-operations.md#microsoftpolicyinsights)

Many Built-in roles grant permission to Azure Policy resources. The **Resource Policy Contributor
(Preview)** role includes most Azure Policy operations. **Owner** has full rights. Both
**Contributor** and **Reader** can use all read Azure Policy operations, but **Contributor** can
also trigger remediation.

If none of the Built-in roles have the permissions required, create a [custom role](../../role-based-access-control/custom-roles.md).

## Policy definition

The journey of creating and implementing a policy in Azure Policy begins with creating a policy
definition. Every policy definition has conditions under which it's enforced. And, it has a defined
effect that takes place if the conditions are met.

In Azure Policy, we offer several built-in policies that are available by default. For example:

- **Require SQL Server 12.0**: Validates that all SQL servers use version 12.0. Its effect is to deny all servers that don't meet these criteria.
- **Allowed Storage Account SKUs**: Determines if a storage account being deployed is within a set of SKU sizes. Its effect is to deny all storage accounts that don't adhere to the set of defined SKU sizes.
- **Allowed Resource Type**: Defines the resource types that you can deploy. Its effect is to deny all resources that aren't part of this defined list.
- **Allowed Locations**: Restricts the available locations for new resources. Its effect is used to enforce your geo-compliance requirements.
- **Allowed Virtual Machine SKUs**: Specifies a set of virtual machine SKUs that you can deploy.
- **Apply tag and its default value**: Applies a required tag and its default value if it's not specified by the deploy request.
- **Enforce tag and its value**: Enforces a required tag and its value to a resource.
- **Not allowed resource types**: Prevents a list of resource types from being deployed.

To implement these policy definitions (both built-in and custom definitions), you'll need to assign
them. You can assign any of these policies through the Azure portal, PowerShell, or Azure CLI.

Policy evaluation happens with several different actions, such as policy assignment or policy
updates. For a complete list, see [Policy evaluation
triggers](./how-to/get-compliance-data.md#evaluation-triggers).

To learn more about the structures of policy definitions, review [Policy Definition Structure](./concepts/definition-structure.md).

## Policy assignment

A policy assignment is a policy definition that has been assigned to take place within a specific
scope. This scope could range from a [management group](../management-groups/overview.md) to a
resource group. The term *scope* refers to all the resource groups, subscriptions, or management
groups that the policy definition is assigned to. Policy assignments are inherited by all child
resources. This design means that a policy applied to a resource group is also applied to resources
in that resource group. However, you can exclude a subscope from the policy assignment.

For example, at the subscription scope, you can assign a policy that prevents the creation of
networking resources. You could exclude a resource group in that subscription that is intended for
networking infrastructure. You then grant access to this networking resource group to users that
you trust with creating networking resources.

In another example, you might want to assign a resource type allow list policy at the management
group level. And then assign a more permissive policy (allowing more resource types) on a child
management group or even directly on subscriptions. However, this example wouldn't work because
policy is an explicit deny system. Instead, you need to exclude the child management group or
subscription from the management group-level policy assignment. Then, assign the more permissive
policy on the child management group or subscription level. If any policy results in a resource
getting denied, then the only way to allow the resource is to modify the denying policy.

For more information on setting policy definitions and assignments through the portal, see [Create
a policy assignment to identify non-compliant resources in your Azure
environment](assign-policy-portal.md). Steps for [PowerShell](assign-policy-powershell.md) and
[Azure CLI](assign-policy-azurecli.md) are also available.

## Policy parameters

Policy parameters help simplify your policy management by reducing the number of policy definitions
you must create. You can define parameters when creating a policy definition to make it more
generic. Then you can reuse that policy definition for different scenarios. You do so by passing in
different values when assigning the policy definition. For example, specifying one set of locations
for a subscription.

Parameters are defined when creating a policy definition. When a parameter is defined, it's
given a name and optionally given a value. For example, you could define a parameter for a policy
titled *location*. Then you can give it different values such as *EastUS* or *WestUS* when
assigning a policy.

For more information about policy parameters, see [Definition structure - Parameters](./concepts/definition-structure.md#parameters).

## Initiative definition

An initiative definition is a collection of policy definitions that are tailored towards achieving
a singular overarching goal. Initiative definitions simplify managing and assigning policy
definitions. They simplify by grouping a set of policies as one single item. For example, you could
create an initiative titled **Enable Monitoring in Azure Security Center**, with a goal to monitor
all the available security recommendations in your Azure Security Center.

Under this initiative, you would have policy definitions such as:

- **Monitor unencrypted SQL Database in Security Center** – For monitoring unencrypted SQL databases and servers.
- **Monitor OS vulnerabilities in Security Center** – For monitoring servers that don't satisfy the configured baseline.
- **Monitor missing Endpoint Protection in Security Center** – For monitoring servers without an installed endpoint protection agent.

## Initiative assignment

Like a policy assignment, an initiative assignment is an initiative definition assigned to a
specific scope. Initiative assignments reduce the need to make several initiative definitions for
each scope. This scope could also range from a management group to a resource group.

Each initiative is assignable to different scopes. One initiative can be assigned to both
**subscriptionA** and **subscriptionB**.

## Initiative parameters

Like policy parameters, initiative parameters help simplify initiative management by reducing
redundancy. Initiative parameters are parameters being used by the policy definitions within the
initiative.

For example, take a scenario where you have an initiative definition - **initiativeC**, with policy definitions **policyA** and **policyB** each expecting a different type of parameter:

| Policy | Name of parameter |Type of parameter  |Note |
|---|---|---|---|
| policyA | allowedLocations | array  |This parameter expects a list of strings for a value since the parameter type has been defined as an array |
| policyB | allowedSingleLocation |string |This parameter expects one word for a value since the parameter type has been defined as a string |

In this scenario, when defining the initiative parameters for **initiativeC**, you have three
options:

- Use the parameters of the policy definitions within this initiative: In this example, *allowedLocations* and *allowedSingleLocation* become initiative parameters for **initiativeC**.
- Provide values to the parameters of the policy definitions within this initiative definition. In this example, you can provide a list of locations to **policyA’s parameter – allowedLocations** and **policyB’s parameter – allowedSingleLocation**. You can also provide values when assigning this initiative.
- Provide a list of *value* options that can be used when assigning this initiative. When you assign this initiative, the inherited parameters from the policy definitions within the initiative, can only have values from this provided list.

When creating value options in an initiative definition, you're unable to input a different value
during the initiative assignment because it's not part of the list.

## Maximum count of Azure Policy objects

[!INCLUDE [policy-limits](../../../includes/azure-policy-limits.md)]

## Recommendations for managing policies

Here are a few pointers and tips to keep in mind:

- Start with an audit effect instead of a deny effect to track impact of your policy definition on
the resources in your environment. If you have scripts already in place to autoscale your
applications, setting a deny effect may hinder such automation tasks already in place.

- Consider organizational hierarchies when creating definitions and assignments. We recommend
creating definitions at higher levels such as the management group or subscription level. Then,
create the assignment at the next child level. If you create a definition at a management group,
the assignment can be scoped down to a subscription or resource group within that management group.

- We recommend creating and assigning initiative definitions even for a single policy definition.
For example, you have policy definition *policyDefA* and create it under initiative definition
*initiativeDefC*. If you create another policy definition later for *policyDefB* with goals similar
to *policyDefA*, you can add it under *initiativeDefC* and track them together.

- Once you've created an initiative assignment, policy definitions added to the initiative also become
part of that initiatives assignments.

- When an initiative assignment is evaluated, all policies within the initiative are also
evaluated. If you need to evaluate a policy individually, it's better to not include it in an
initiative.

## Video overview

The following overview of Azure Policy is from Build 2018. For slides or video download,
visit [Govern your Azure environment through Azure Policy](https://channel9.msdn.com/events/Build/2018/THR2030) on Channel 9.

> [!VIDEO https://www.youtube.com/embed/dxMaYF2GB7o]

## Next steps

Now that you have an overview of Azure Policy and some of the key concepts, here are the suggested
next steps:

- [Assign a policy definition using the portal](assign-policy-portal.md).
- [Assign a policy definition using the Azure CLI](assign-policy-azurecli.md).
- [Assign a policy definition using PowerShell](assign-policy-powershell.md).
- Review what a management group is with [Organize your resources with Azure management groups](..//management-groups/overview.md).
- View [Govern your Azure environment through Azure Policy](https://channel9.msdn.com/events/Build/2018/THR2030) on Channel 9.