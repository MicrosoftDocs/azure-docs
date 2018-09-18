---
title: Overview of Azure Policy
description: Azure Policy is a service in Azure, that you use to create, assign and, manage policy definitions in your Azure environment.
services: azure-policy
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: overview
ms.service: azure-policy
manager: carmonm
ms.custom: mvc
---
# What is Azure Policy?

IT Governance ensures that your organization is able to achieve its goals through an effective and
efficient use of IT. It does this by creating clarity between your business goals and IT projects.

Does your company experience a significant number of IT issues that never seem to get resolved?
Good IT governance involves planning your initiatives and setting priorities on a strategic level
to help manage and prevent issues. This is where Azure Policy comes in.

Azure Policy is a service in Azure that you use to create, assign and, manage policies. These
policies enforce different rules and effects over your resources, so those resources stay compliant
with your corporate standards and service level agreements. Azure Policy does this by running
evaluations of your resources and scanning for those not compliant with the policies you have
created. For example, you can have a policy to allow only a certain SKU size of virtual machines in
your environment. Once this policy has been implemented, it will then be evaluated when creating
and updating resources, as well as over your already existing resources. Later on in this
documentation, we will go over more details on how to create and implement policies with Azure
policy.

> [!IMPORTANT]
> Azure Policy's compliance evaluation is now provided for all assignments
> regardless of pricing tier. If your assignments do not show the compliance data, please ensure that
> the subscription is registered with the Microsoft.PolicyInsights resource provider.

## How is it different from RBAC?

There are a few key differences between policy and role-based access control (RBAC). RBAC focuses
on user actions at different scopes. For example, you might be added to the contributor role for a
resource group at the desired scope. The role allows you to make changes to that resource group.
Policy focuses on resource properties during deployment and for already existing resources. For
example, through policies, you can control the types of resources that can be provisioned. Or, you
can restrict the locations in which the resources can be provisioned. Unlike RBAC, policy is a
default allow and explicit deny system.

### RBAC Permissions in Azure Policy

Azure Policy has permissions represented as operations in two different Resource Providers:

- [Microsoft.Authorization](../../role-based-access-control/resource-provider-operations.md#microsoftauthorization)
- [Microsoft.PolicyInsight](../../role-based-access-control/resource-provider-operations.md#microsoftpolicyinsights)

Several of the Built-in roles have various levels of permission to Azure Policy resources, such as
**Security Admin** that can manage policy assignments and definitions but cannot view compliance
information and **Reader** that can read details regarding policy assignments and definitions, but
cannot make changes or view compliance information. While **Owner** has full rights,
**Contributor** does not have any Azure Policy permissions. To grant permission to view Policy
compliance details, create a [custom role](../../role-based-access-control/custom-roles.md).

## Policy definition

The journey of creating and implementing a policy in Azure Policy begins with creating a policy
definition. Every policy definition has conditions under which it is enforced. And, it has an
accompanying effect that takes place if the conditions are met.

In Azure Policy, we offer some built-in policies that are available to you by default. For example:

- **Require SQL Server 12.0**: This policy definition has conditions/rules to ensure that all SQL servers use version 12.0. Its effect is to deny all servers that do not meet these criteria.
- **Allowed Storage Account SKUs**: This policy definition has a set of conditions/rules that determine if a storage account that is being deployed is within a set of SKU sizes. Its effect is to deny all storage accounts that do not adhere to the set of defined SKU sizes.
- **Allowed Resource Type**: This policy definition has a set of conditions/rules to specify the resource types that your organization can deploy. Its effect is to deny all resources that are not part of this defined list.
- **Allowed Locations**: This policy enables you to restrict the locations that your organization can specify when deploying resources. Its effect is used to enforce your geo-compliance requirements.
- **Allowed Virtual Machine SKUs**: This policy enables you to specify a set of virtual machine SKUs that your organization can deploy.
- **Apply tag and its default value**: This policy applies a required tag and its default value, if it is not specified by the user.
- **Enforce tag and its value**: This policy enforces a required tag and its value to a resource.
- **Not allowed resource types**: This policy enables you to specify the resource types that your organization cannot deploy.

In order to implement these policy definitions (both built-in and custom definitions), you will
need to assign them. You can assign any of these policies through the Azure portal, PowerShell, or
Azure CLI.

Keep in mind that a policy re-evaluation happens about once an hour, which means that if you make
changes to your policy definition after implementing the policy (creating a policy assignment) it
will be re-evaluated over your resources within the hour.

To learn more about the structures of policy definitions, review [Policy Definition Structure](./concepts/definition-structure.md).

## Policy assignment

A policy assignment is a policy definition that has been assigned to take place within a specific
scope. This scope could range from a [management group](../management-groups/overview.md) to a
resource group. The term *scope* refers to all the resource groups, subscriptions, or management
groups that the policy definition is assigned to. Policy assignments are inherited by all child
resources. This means that if a policy is applied to a resource group, it is applied to all the
resources in that resource group. However, you can exclude a subscope from the policy assignment.

For example, at the subscription scope, you can assign a policy that prevents the creation of
networking resources. However, you exclude one resource group within the subscription that is
intended for networking infrastructure. You grant access to this networking resource group to users
that you trust with creating networking resources.

In another example, you might want to assign a resource type whitelist policy at the management
group level. And then assign a more permissive policy (allowing more resource types) on a child
management group or even directly on subscriptions. However, this example wouldn't work because
policy is an explicit deny system. Instead, you need to exclude the child management group or
subscription from the management group-level policy assignment. Then, assign the more permissive
policy on the child management group or subscription level. To summarize, if any policy results in
a resource getting denied, then the only way to allow the resource is to modify the denying policy.

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

Parameters are defined/created when creating a policy definition. When a parameter is defined, it
is given a name and optionally given a value. For example, you could define a parameter for a
policy titled *location*. Then you can give it different values such as *EastUS* or *WestUS* when
assigning a policy.

For more information about policy parameters, see [Resource Policy Overview - Parameters](./concepts/definition-structure.md#parameters).

## Initiative definition

An initiative definition is a collection of policy definitions that are tailored towards achieving
a singular overarching goal. Initiative definitions simplify managing and assigning policy
definitions. They simplify by grouping a set of policies as one single item. For example, you could
create an initiative titled **Enable Monitoring in Azure Security Center**, with a goal to monitor
all the available security recommendations in your Azure Security Center.

Under this initiative, you would have policy definitions such as:

- **Monitor unencrypted SQL Database in Security Center** – For monitoring unencrypted SQL databases and servers.
- **Monitor OS vulnerabilities in Security Center** – For monitoring servers that do not satisfy the configured baseline.
- **Monitor missing Endpoint Protection in Security Center** – For monitoring servers without an installed endpoint protection agent.

## Initiative assignment

Like a policy assignment, an initiative assignment is an initiative definition assigned to a
specific scope. Initiative assignments reduce the need to make several initiative definitions for
each scope. This scope could also range from a management group to a resource group.

From the preceding example, the **Enable Monitoring in Azure Security Center** initiative can be
assigned to different scopes. For example, one assignment can be assigned to **subscriptionA**.
Another can be assigned to **subscriptionB**.

## Initiative parameters

Like policy parameters, initiative parameters help simplify initiative management by reducing
redundancy. Initiative parameters are essentially the list of parameters being used by the policy
definitions within the initiative.

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

For example, you might create a list of value options in an initiative definition that contain
*EastUS*, *WestUS*, *CentralUS*, and *WestEurope*. If so, you are unable to input a different value
such as *Southeast Asia* during the initiative assignment, because it is not part of the list.

## Maximum count of Policy objects

[!INCLUDE [policy-limits](../../../includes/azure-policy-limits.md)]

## Recommendations for managing policies

While creating and managing policy definitions and assignments, here are a few pointers we advise
you to follow and tips to keep in mind:

- If you are creating policy definitions in your environment, we recommend starting with an audit
effect, as opposed to a deny effect, to keep track of the impact of your policy definition on the
resources in your environment. If you have scripts already in place to autoscale up your
applications, setting a deny effect may hinder those automations tasks you already have in place.
- It is important to keep organizational hierarchies in mind when creating definitions and
assignments. We recommend creating definitions at a higher level, for example at the management
group or subscription level, and assigning at the next child level. For example, if you create a
policy definition at the management group level, a policy assignment of that definition can be
scoped down to a subscription level within that management group.
- We recommend always using initiative definitions instead of policy definitions, even if you only
have one policy in mind. For example, if you have a policy definition – *policyDefA* and you create
it under the initiative definition - *initiativeDefC*, if you decide to create another policy
definition later for *policyDefB* with goals similar to that of *policyDefA*, you can add it under
*initiativeDefC* and track them better that way.
- Keep in mind that once you have created an initiative assignment from an initiative definition,
any new policy definitions added to the initiative definition automatically roll under the
initiative assignment(s) under that initiative definition.
- Once an initiative assignment is triggered, all policies within the initiative will be triggered
as well. However, if you needed to execute a policy individually, it is better to not include it in
an initiative.

## Video Overview

The following overview of Azure Policy is from Build 2018. For slides or video download, please
visit [Govern your Azure environment through Azure Policy](https://channel9.msdn.com/events/Build/2018/THR2030) on Channel 9.

> [!VIDEO https://www.youtube.com/embed/dxMaYF2GB7o]

## Next steps

Now that you have an overview of Azure Policy and some of the key concepts, here are the suggested
next steps:

- [Assign a policy definition using the portal](assign-policy-portal.md)
- [Assign a policy definition using the Azure CLI](assign-policy-azurecli.md)
- [Assign a policy definition using PowerShell](assign-policy-powershell.md)
- Review what a management group is with [Organize your resources with Azure management groups](..//management-groups/overview.md)
- View [Govern your Azure environment through Azure Policy](https://channel9.msdn.com/events/Build/2018/THR2030) on Channel 9