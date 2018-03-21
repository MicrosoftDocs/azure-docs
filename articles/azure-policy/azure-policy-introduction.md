---
title: Overview of Azure Policy | Microsoft Docs
description: Azure Policy is a service in Azure, that you use to create, assign and, manage policy definitions in your Azure environment.
services: azure-policy
keywords:
author: bandersmsft
ms.author: banders; nini
ms.date: 01/17/2018
ms.topic: overview
ms.service: azure-policy
manager: carmonm
ms.custom: mvc
---

# What is Azure Policy?

IT governance creates clarity between business goals and IT projects. Good IT governance involves planning your initiatives and setting priorities on a strategic level. Does your company experience a significant number of IT issues that never seem to get resolved? Implementing policies helps you better manage and prevent them. Implementing policies is where Azure Policy comes in.

Azure Policy is a service in Azure that you use to create, assign and, manage policy definitions. Policy definitions enforce different rules and actions over your resources, so those resources stay compliant with your corporate standards and service level agreements. Azure Policy runs an evaluation of your resources, scanning for those not compliant with the policy definitions you have. For example, you can have a policy to allow only certain type of virtual machines. Another requires that all resources have a particular tag. These policies are then evaluated when creating and updating resources.

## How is it different from RBAC?

There are a few key differences between policy and role-based access control (RBAC). RBAC focuses on user actions at different scopes. For example, you might be added to the contributor role for a resource group at the desired scope. The role allows you to make changes to that resource group. Policy focuses on resource properties during deployment and for already existing resources. For example, through policies, you can control the types of resources that can be provisioned. Or, you can restrict the locations in which the resources can be provisioned. Unlike RBAC, policy is a default allow and explicit deny system.

To use policies, you must be authenticated through RBAC. Specifically, your account needs the:

- `Microsoft.Authorization/policydefinitions/write` permission to define a policy.
- `Microsoft.Authorization/policyassignments/write` permission to assign a policy.

These permissions are not included in the **Contributor** role.


## Policy definition

Every policy definition has conditions under which it is enforced. And, it has an accompanying action that takes place if the conditions are met.

In Azure Policy, we offer some built-in policies that are available to you by default. For example:

- **Require SQL Server 12.0**: This policy definition has conditions/rules to ensure that all SQL servers use version 12.0. Its action is to deny all servers that do not meet these criteria.
- **Allowed Storage Account SKUs**: This policy definition has a set of conditions/rules that determine if a storage account that is being deployed is within a set of SKU sizes. Its action is to deny all servers that do not adhere to the set of defined SKU sizes.
- **Allowed Resource Type**: This policy definition has a set of conditions/rules to specify the resource types that your organization can deploy. Its action is to deny all resources that are not part of this defined list.
- **Allowed Locations**: This policy enables you to restrict the locations that your organization can specify when deploying resources. Its action is used to enforce your geo-compliance requirements.
- **Allowed Virtual Machine SKUs**: This policy enables you to specify a set of virtual machine SKUs that your organization can deploy.
- **Apply tag and its default value**: This policy applies a required tag and its default value, if it is not specified by the user.
- **Enforce tag and its value**: This policy enforces a required tag and its value to a resource.
- **Not allowed resource types**: This policy enables you to specify the resource types that your organization cannot deploy.

You can assign any of these policies through the Azure portal, PowerShell, or Azure CLI.

To learn more about the structures of policy definitions, look at this article - [Policy Definition Structure](policy-definition.md).

## Policy assignment

A policy assignment is a policy definition that has been assigned to take place within a specific scope. This scope could range from a management group to a resource group. The term *scope* refers to all the resource groups, subscriptions, or management groups that the policy definition is assigned to. Policy assignments are inherited by all child resources. So, if a policy is applied to a resource group, it is applied to all the resources in that resource group. However, you can exclude a subscope from the policy assignment. For example, at the subscription scope, you can assign a policy that prevents the creation of networking resources. However, you exclude one resource group within the subscription that is intended for networking infrastructure. You grant access to this networking resource group to users that you trust with creating networking resources.

For more information on setting policy definitions and assignments, see [Create a policy assignment to identify non-compliant resources in your Azure environment](assign-policy-definition.md).

## Policy parameters

Policy parameters help simplify your policy management by reducing the number of policy definitions you must create. You can define parameters when creating a policy definition to make it more generic. Then you can reuse that policy definition for different scenarios. You do so by passing in different values when assigning the policy definition. For example, specifying one set of locations for a subscription.

Parameters are defined/created when creating a policy definition. When a parameter is defined, it is given a name and optionally given a value. For example, you could define a parameter for a policy titled *location*. Then you can give it different values such as *EastUS* or *WestUS* when assigning a policy.

<!--
Next link should point to new Concept page for Parameters
-->
For more information about policy parameters, see [Resource Policy Overview - Parameters](policy-definition.md#parameters).

## Initiative definition
An initiative definition is collection of policy definitions that are tailored towards achieving a singular overarching goal. Initiative definitions simplify managing and assigning policy definitions. They simplify by grouping a set of policies as one single item. For example, you could create an initiative titled **Enable Monitoring in Azure Security Center**, with a goal to monitor all the available security recommendations in your Azure Security Center.

Under this initiative, you would have policy definitions such as:

1. **Monitor unencrypted SQL Database in Security Center** – For monitoring unencrypted SQL databases and servers.
2. **Monitor OS vulnerabilities in Security Center** – For monitoring servers that do not satisfy the configured baseline.
3. **Monitor missing Endpoint Protection in Security Center** – For monitoring servers without an installed endpoint protection agent.

<!--
For more information about initiative definitions, see Initiative Definitions.+ (instead of linking to this, link out to Concept page on Initiative Definitions)
-->

## Initiative assignment
Like a policy assignment, an initiative assignment is an initiative definition assigned to a specific scope. Initiative assignments reduce the need to make several initiative definitions for each scope. This scope could also range from a management group to a resource group.

From the preceding example, the **Enable Monitoring in Azure Security Center** initiative can be assigned to different scopes. For example, one assignment can be assigned to **subscriptionA**. Another can be assigned to **subscriptionB**.

## Initiative parameters
Like policy parameters, initiative parameters help simplify initiative management by reducing redundancy. Initiative parameters are essentially the list of parameters being used by the policy definitions within the initiative.

For example, take a scenario where you have an initiative definition - **initiativeC**, with two policy definitions. Each policy definition having one defined parameter:

| Policy | name of parameter |Type of parameter  |Note |
|---|---|---|---|
| policyA | allowedLocations | array  |This parameter expects a list of strings for a value since the parameter type has been defined as an array |
| policyB | allowedSingleLocation |string |This parameter expects one word for a value since the parameter type has been defined as a string |

In this scenario, when defining the initiative parameters for **initiativeC**, you have three options:

1. Use the parameters of the policy definitions within this initiative: In this example, *allowedLocations* and *allowedSingleLocation* become initiative parameters for **initiativeC**.
2. Provide values to the parameters of the policy definitions within this initiative definition. In this example, you can provide a list of locations to **policyA’s parameter – allowedLocations** and **policyB’s parameter – allowedSingleLocation**.
You can also provide values when assigning this initiative.
3. Provide a list of *value* options that can be used when assigning this initiative. When you assign this initiative, the inherited parameters from the policy definitions within the initiative, can only have values from this provided list.

For example, you might create a list of value options in an initiative definition that contain *EastUS*, *WestUS*, *CentralUS*, and *WestEurope*. If so, you are unable to input a different value such as *Southeast Asia* during the initiative assignment, because it is not part of the list.

## Recommendations for managing policies

While creating and managing policy definitions and assignments, here are a few pointers we advise you to follow:

- If you are creating policy definitions in your environment, we recommend starting with an audit effect, as opposed to a deny effect, to keep track of the impact of your policy definition on the resources in your environment. If you have scripts already in place to autoscale up your applications, setting a deny effect may hinder those automations tasks you already have in place.
- It is important to keep organizational hierarchies in mind when creating definitions and assignments. We recommend creating definitions at a higher level, for example at the management group or subscription level, and assigning at the next child level. For example, if you create a policy definition at the management group level, a policy assignment of that definition can be scoped down to a subscription level within that management group.
- We encourage using the standard pricing tier, to better understand the compliance state of your environment. For more information about our pricing models and what each of them offer, take a look at [Pricing](https://azure.microsoft.com/pricing/details/azure-policy).
- We recommend always using initiative definitions instead of policy definitions, even if you only have one policy in mind. For example, if you have a policy definition – *policyDefA* and you create it under the initiative definition - *initiativeDefC*, if you decide to create another policy definition later for *policyDefB* with goals similar to that of *policyDefA*, you can add it under *initiativeDefC* and track them better that way.

   Keep in mind that once you have created an initiative assignment from an initiative definition, any new policy definitions added to the initiative definition automatically roll under the initiative assignment(s) under that initiative definition. However, if there’s a new parameter introduced to the new policy definition, you need to update the initiative definition and assignments by editing the initiative definition or assignment.

## Next steps

Now that you have an overview of Azure Policy and some of the key concepts we’re introducing, here are the suggested next steps:

- [Assign a policy definition](./assign-policy-definition.md)
- [Assign a policy definition using the Azure CLI](./assign-policy-definition-cli.md)
- [Assign a policy definition using PowerShell](./assign-policy-definition-ps.md)
