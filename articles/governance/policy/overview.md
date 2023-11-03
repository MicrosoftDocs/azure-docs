---
title: Overview of Azure Policy
description: Azure Policy is a service in Azure, that you use to create, assign and, manage policy definitions in your Azure environment.
ms.date: 06/15/2023
ms.topic: overview
ms.author: davidsmatlak
author: davidsmatlak
---

# What is Azure Policy?

Azure Policy helps to enforce organizational standards and to assess compliance at-scale. Through
its compliance dashboard, it provides an aggregated view to evaluate the overall state of the
environment, with the ability to drill down to the per-resource, per-policy granularity. It also
helps to bring your resources to compliance through bulk remediation for existing resources and
automatic remediation for new resources.

> [!NOTE]
> For more information on remediation, see
> [Remediate non-compliant resources with Azure Policy](./how-to/remediate-resources.md).

Common use cases for Azure Policy include implementing governance for resource consistency,
regulatory compliance, security, cost, and management. Policy definitions for these common use cases
are already available in your Azure environment as built-ins to help you get started.

Specifically, some useful governance actions you can enforce with Azure Policy include:

- Ensuring your team deploys Azure resources only to allowed regions
- Enforcing the consistent application of taxonomic tags
- Requiring resources to send diagnostic logs to a Log Analytics workspace

It's important to recognize that with the introduction of [Azure Arc](../../azure-arc/overview.md), you can extend your
policy-based governance across different cloud providers and even to your local datacenters.

All Azure Policy data and objects are encrypted at rest. For more information, see
[Azure data encryption at rest](../../security/fundamentals/encryption-atrest.md).

## Overview

Azure Policy evaluates resources and actions in Azure by comparing the properties of those resources to business
rules. These business rules, described in [JSON format](./concepts/definition-structure.md), are
known as [policy definitions](#policy-definition). To simplify management, several business rules
can be grouped together to form a [policy initiative](#initiative-definition) (sometimes called a
_policySet_). Once your business rules have been formed, the policy definition or initiative is
[assigned](#assignments) to any scope of resources that Azure supports, such as
[management groups](../management-groups/overview.md), subscriptions,
[resource groups](../../azure-resource-manager/management/overview.md#resource-groups), or
individual resources. The assignment applies to all resources within the
[Resource Manager scope](../../azure-resource-manager/management/overview.md#understand-scope) of
that assignment. Subscopes can be excluded, if necessary. For more information, see
[Scope in Azure Policy](./concepts/scope.md).

Azure Policy uses a [JSON format](./concepts/definition-structure.md) to form the logic the
evaluation uses to determine whether a resource is compliant or not. Definitions include metadata
and the policy rule. The defined rule can use functions, parameters, logical operators, conditions,
and property [aliases](./concepts/definition-structure.md#aliases) to match exactly the scenario you
want. The policy rule determines which resources in the scope of the assignment get evaluated.

### Understand evaluation outcomes

Resources are evaluated at specific times during the resource lifecycle, the policy assignment
lifecycle, and for regular ongoing compliance evaluation. The following are the times or events that
cause a resource to be evaluated:

- A resource is created or updated in a scope with a policy assignment.
- A policy or initiative is newly assigned to a scope.
- A policy or initiative already assigned to a scope is updated.
- During the standard compliance evaluation cycle, which occurs once every 24 hours.

For detailed information about when and how policy evaluation happens, see
[Evaluation triggers](./how-to/get-compliance-data.md#evaluation-triggers).

### Control the response to an evaluation

Business rules for handling non-compliant resources vary widely between organizations. Examples of
how an organization wants the platform to respond to a non-compliant resource include:

- Deny the resource change
- Log the change to the resource
- Alter the resource before the change
- Alter the resource after the change
- Deploy related compliant resources
- Block actions on resources

Azure Policy makes each of these business responses possible through the application of
[effects](./concepts/effects.md). Effects are set in the **policy rule** portion of the
[policy definition](./concepts/definition-structure.md).

### Remediate non-compliant resources

While these effects primarily affect a resource when the resource is created or updated, Azure
Policy also supports dealing with existing non-compliant resources without needing to alter that
resource. For more information about making existing resources compliant, see
[remediating resources](./how-to/remediate-resources.md).

### Video overview

The following overview of Azure Policy is from Build 2018. For slides or video download, visit
[Govern your Azure environment through Azure Policy](/events/Build/2018/THR2030)
on Channel 9.

> [!VIDEO https://www.youtube.com/embed/dxMaYF2GB7o]

## Getting started

### Azure Policy and Azure RBAC

There are a few key differences between Azure Policy and Azure role-based access control (Azure
RBAC). Azure Policy evaluates state by examining properties on resources that are represented in Resource Manager and properties of some Resource Providers. Azure Policy ensures that resource state is compliant to your business rules without concern for who made the change or who has permission to make a change. Azure Policy through DenyAction effect can also block certain actions on resources. Some Azure Policy resources, such as [policy definitions](#policy-definition), [initiative definitions](#initiative-definition), and [assignments](#assignments), are visible to all users. This design enables transparency to all users and services for what policy rules are set
in their environment.

Azure RBAC focuses on managing user
[actions](../../role-based-access-control/resource-provider-operations.md) at different scopes. If
control of an action is required based on user information, then Azure RBAC is the correct tool to use. Even if an individual has access to perform an action, if the result is a non-compliant resource, Azure Policy still blocks the create or update.

The combination of Azure RBAC and Azure Policy provides full scope control in Azure.

### Azure RBAC permissions in Azure Policy

Azure Policy has several permissions, known as operations, in two Resource Providers:

- [Microsoft.Authorization](../../role-based-access-control/resource-provider-operations.md#microsoftauthorization)
- [Microsoft.PolicyInsights](../../role-based-access-control/resource-provider-operations.md#microsoftpolicyinsights)

Many built-in roles grant permission to Azure Policy resources. The **Resource Policy Contributor**
role includes most Azure Policy operations. **Owner** has full rights. Both **Contributor** and
**Reader** have access to all _read_ Azure Policy operations.

**Contributor** may trigger resource
remediation, but can't _create_ or _update_ definitions and assignments. **User Access Administrator** is
necessary to grant the managed identity on **deployIfNotExists** or **modify** assignments necessary
permissions.

> [!NOTE]
> All Policy objects, including definitions, initiatives, and assignments, will be readable to all
> roles over its scope. For example, a Policy assignment scoped to an Azure subscription will be readable
> by all role holders at the subscription scope and below.

If none of the built-in roles have the permissions required, create a
[custom role](../../role-based-access-control/custom-roles.md).

Azure Policy operations can have a significant effect on your Azure environment. Only the minimum set of permissions necessary to perform a task should be assigned and these permissions shouldn't be granted to users who don't need them.

> [!NOTE]
> The managed identity of a **deployIfNotExists** or **modify** policy assignment needs enough
> permissions to create or update targeted resources. For more information, see
> [Configure policy definitions for remediation](./how-to/remediate-resources.md#configure-the-policy-definition).

### Special permissions requirement for Azure Policy with Azure Virtual Network Manager

[Azure Virtual Network Manager (preview)](../../virtual-network-manager/overview.md) enables you to apply consistent management and security policies to multiple Azure virtual networks (VNets) throughout your cloud infrastructure. Azure Virtual Network Manager (AVNM) dynamic groups use Azure Policy definitions to evaluate VNet membership in those groups.

To create, edit, or delete Azure Virtual Network Manager dynamic group policies, you need:

- Read and write Azure RBAC permissions to the underlying policy
- Azure RBAC permissions to join the network group (Classic Admin authorization isn't supported).

Specifically, the required resource provider permission is `Microsoft.Network/networkManagers/networkGroups/join/action`.

> [!IMPORTANT]
> To modify AVNM dynamic groups, you must be granted access via Azure RBAC role assignment only.
> Classic Admin/legacy authorization is not supported; this means if your account were
> assigned only the co-administrator subscription role, you'd have no permissions on AVNM
> dynamic groups.

### Resources covered by Azure Policy

Although a policy can be assigned at the management group level, _only_ resources at the subscription or resource group level are evaluated.

For certain resource providers such as [Machine configuration](../machine-configuration/overview.md), [Azure Kubernetes Service](../../aks/intro-kubernetes.md), and [Azure Key Vault](../../key-vault/general/overview.md), there's a deeper integration for managing settings and objects. To find out more, go to [Resource Provider modes](./concepts/definition-structure.md#resource-provider-modes).

### Recommendations for managing policies

Here are a few pointers and tips to keep in mind:

-  Start with an `audit` or `auditIfNotExist` effect instead of an enforcement (`deny`, `modify`, `deployIfNotExist`)  effect to track impact of your policy definition on the resources in your environment. If you have scripts already in place to autoscale your applications, setting an enforcement effect may hinder such automation tasks already in place.

- Consider organizational hierarchies when creating definitions and assignments. We recommend
  creating definitions at higher levels such as the management group or subscription level. Then,
  create the assignment at the next child level. If you create a definition at a management group,
  the assignment can be scoped down to a subscription or resource group within that management
  group.

- We recommend creating and assigning initiative definitions even for a single policy definition.
  For example, you have policy definition _policyDefA_ and create it under initiative definition
  _initiativeDefC_. If you create another policy definition later for _policyDefB_ with goals
  similar to _policyDefA_, you can add it under _initiativeDefC_ and track them together.

    - Once you've created an initiative assignment, policy definitions added to the initiative also
  become part of that initiative's assignments.

  - When an initiative assignment is evaluated, all policies within the initiative are also evaluated.
  If you need to evaluate a policy individually, it's better to not include it in an initiative.

- Manage Azure Policy resources as code with manual reviews on changes to policy definitions,
  initiatives, and assignments. To learn more about suggested patterns and tooling, see
  [Design Azure Policy as Code Workflows](./concepts/policy-as-code.md).

## Azure Policy objects

### Policy definition

The journey of creating and implementing a policy in Azure Policy begins with creating a policy
definition. Every policy definition has conditions under which it's enforced. And, it has a defined
effect that takes place if the conditions are met.

In Azure Policy, we offer several built-in policies that are available by default. For example:

- **Allowed Storage Account SKUs** (Deny): Determines if a storage account being deployed is within
  a set of SKU sizes. Its effect is to deny all storage accounts that don't adhere to the set of
  defined SKU sizes.
- **Allowed Resource Type** (Deny): Defines the resource types that you can deploy. Its effect is to
  deny all resources that aren't part of this defined list.
- **Allowed Locations** (Deny): Restricts the available locations for new resources. Its effect is
  used to enforce your geo-compliance requirements.
- **Allowed Virtual Machine SKUs** (Deny): Specifies a set of virtual machine SKUs that you can
  deploy.
- **Add a tag to resources** (Modify): Applies a required tag and its default value if it's not
  specified by the deploy request.
- **Not allowed resource types** (Deny): Prevents a list of resource types from being deployed.

To implement these policy definitions (both built-in and custom definitions), you need to assign
them. You can assign any of these policies through the Azure portal, PowerShell, or Azure CLI.

Policy evaluation happens with several different actions, such as policy assignment or policy
updates. For a complete list, see [Policy evaluation
triggers](./how-to/get-compliance-data.md#evaluation-triggers).

To learn more about the structures of policy definitions, review
[Policy Definition Structure](./concepts/definition-structure.md).

Policy parameters help simplify your policy management by reducing the number of policy definitions
you must create. You can define parameters when creating a policy definition to make it more
generic. Then you can reuse that policy definition for different scenarios. You do so by passing in
different values when assigning the policy definition. For example, specifying one set of locations
for a subscription.

Parameters are defined when creating a policy definition. When a parameter is defined, it's given a
name and optionally given a value. For example, you could define a parameter for a policy titled
_location_. Then you can give it different values such as _EastUS_ or _WestUS_ when assigning a
policy.

For more information about policy parameters, see
[Definition structure - Parameters](./concepts/definition-structure.md#parameters).

### Initiative definition

An initiative definition is a collection of policy definitions that are tailored toward achieving
a singular overarching goal. Initiative definitions simplify managing and assigning policy
definitions. They simplify by grouping a set of policies as one single item. For example, you could
create an initiative titled **Enable Monitoring in Microsoft Defender for Cloud**, with a goal to monitor
all the available security recommendations in your Microsoft Defender for Cloud instance.

> [!NOTE]
> The SDK, such as Azure CLI and Azure PowerShell, use properties and parameters named **PolicySet**
> to refer to initiatives.

Under this initiative, you would have policy definitions such as:

- **Monitor unencrypted SQL Database in Microsoft Defender for Cloud** - For monitoring unencrypted SQL databases
  and servers.
- **Monitor OS vulnerabilities in Microsoft Defender for Cloud** - For monitoring servers that don't satisfy the
  configured baseline.
- **Monitor missing Endpoint Protection in Microsoft Defender for Cloud** - For monitoring servers without an
  installed endpoint protection agent.

Like policy parameters, initiative parameters help simplify initiative management by reducing
redundancy. Initiative parameters are parameters being used by the policy definitions within the
initiative.

For example, take a scenario where you have an initiative definition - **initiativeC**, with policy
definitions **policyA** and **policyB** each expecting a different type of parameter:

| Policy | Name of parameter |Type of parameter  |Note |
|---|---|---|---|
| policyA | allowedLocations | array  |This parameter expects a list of strings for a value since the parameter type has been defined as an array |
| policyB | allowedSingleLocation |string |This parameter expects one word for a value since the parameter type has been defined as a string |

In this scenario, when defining the initiative parameters for **initiativeC**, you have three
options:

- Use the parameters of the policy definitions within this initiative: In this example,
  _allowedLocations_ and _allowedSingleLocation_ become initiative parameters for **initiativeC**.
- Provide values to the parameters of the policy definitions within this initiative definition. In
  this example, you can provide a list of locations to **policyA**'s parameter -
  **allowedLocations** and **policyB**'s parameter - **allowedSingleLocation**. You can also provide
  values when assigning this initiative.
- Provide a list of _value_ options that can be used when assigning this initiative. When you assign
  this initiative, the inherited parameters from the policy definitions within the initiative, can
  only have values from this provided list.

When creating value options in an initiative definition, you're unable to input a different value
during the initiative assignment because it's not part of the list.

To learn more about the structures of initiative definitions, review
[Initiative Definition Structure](./concepts/initiative-definition-structure.md).

### Assignments

An assignment is a policy definition or initiative that has been assigned to a
specific scope. This scope could range from a [management group](../management-groups/overview.md)
to an individual resource. The term _scope_ refers to all the resources, resource groups,
subscriptions, or management groups that the definition is assigned to. Assignments are inherited by
all child resources. This design means that a definition applied to a resource group is also applied
to resources in that resource group. However, you can exclude a subscope from the assignment.

For example, at the subscription scope, you can assign a definition that prevents the creation of
networking resources. You could exclude a resource group in that subscription that is intended for
networking infrastructure. You then grant access to this networking resource group to users that you
trust with creating networking resources.

In another example, you might want to assign a resource type allowlist definition at the management
group level. Then you assign a more permissive policy (allowing more resource types) on a child
management group or even directly on subscriptions. However, this example wouldn't work because
Azure Policy is an explicit deny system. Instead, you need to exclude the child management group or
subscription from the management group-level assignment. Then, assign the more permissive definition
on the child management group or subscription level. If any assignment results in a resource getting
denied, then the only way to allow the resource is to modify the denying assignment.

Policy assignments always use the latest state of their assigned definition or initiative when
evaluating resources. If a policy definition that's already assigned is changed, all existing
assignments of that definition will use the updated logic when evaluating.

For more information on setting assignments through the portal, see [Create a policy assignment to
identify non-compliant resources in your Azure environment](./assign-policy-portal.md). Steps for
[PowerShell](./assign-policy-powershell.md) and [Azure CLI](./assign-policy-azurecli.md) are also
available. For information on the assignment structure, see
[Assignments Structure](./concepts/assignment-structure.md).

## Maximum count of Azure Policy objects

[!INCLUDE [policy-limits](../../../includes/azure-policy-limits.md)]

## Next steps

Now that you have an overview of Azure Policy and some of the key concepts, here are the suggested
next steps:

- [Review the policy definition structure](./concepts/definition-structure.md).
- [Assign a policy definition using the portal](./assign-policy-portal.md).
