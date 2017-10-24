---
title: Overview of Azure Policy | Microsoft Docs 
description: Azure Policy is a service in Azure, that you use to create, assign and, manage policy definitions in your Azure environment.
services: azure-policy 
keywords: 
author: Jim-Parker
ms.author: jimpark; nini
ms.date: 10/06/2017
ms.topic: overview
ms.service: azure-policy
manager: jochan
ms.custom: mvc
---

# What is Azure Policy?

IT governance creates clarity between business goals and IT projects. Good IT governance involves planning your initiatives and setting priorities on a strategic level. If your company experiences a significant number of IT issues that never seem to get resolved, implementing policies helps you better manage and prevent them. This is where Azure Policy comes in.

Azure Policy is a service in Azure that you use to create, assign and, manage policy definitions. Policy definitions enforce different rules and actions over your resources, so those resources stay compliant with your corporate standards and service level agreements. It does this by running an evaluation of your resources, to scan for which ones are not compliant with the policy definitions you have in place.

## Policy definition

Every policy definition has conditions under which it is enforced and an accompanying action that takes place if the conditions are met.

In Azure Policy, we offer some built-in policies that are available to you by default. For example:

- **Require SQL Server 12.0**: This policy definition has conditions/rules to ensure that all SQL servers use version 12.0. Its action is to deny all servers that do not meet these criteria.
- **Allowed Storage Account SKUs**: This policy definition has a set of conditions/rules that determine if a storage account that is being deployed is within a set of SKU sizes. Its action is to deny all servers that do not adhere to the set of defined SKU sizes.
- **Allowed Resource Type**: This policy definition has a set of conditions/rules to specify the resource types that your organization can deploy. Its action is to deny all resources that are not part of this defined list.

To learn more about the structures of policy definitions, look at this article - [Policy Definition Structure](../azure-resource-manager/resource-manager-policy.md#policy-definition-structure).

## Policy assignment
A policy assignment is a policy definition that has been assigned to take place within a specific scope. This scope could range from a Management Group to a Resource Group.

For more information on setting policy definitions and assignments, see [Resource Policy Overview](../azure-resource-manager/resource-manager-policy.md).

## Policy parameters
Policy parameters help simplify your policy management by reducing the number of policy definitions you must create. You can define parameters when creating a policy definition to make it more generic. Then you can reuse that policy definition for different scenarios by passing in different values (such as specifying one set of locations for a subscription) when assigning the policy.

Parameters are defined/created when creating a policy definition. When a parameter is defined, it is given a name and optionally given a value. For example, you could define a parameter for a policy as a location and then give it different values such as *EastUS* or *WestUS* when assigning a policy.

For more information about policy parameters, see [Resource Policy Overview - Parameters](../azure-resource-manager/resource-manager-policy.md#parameters).

## Initiative definition
An initiative definition is collection of policy definitions that are tailored towards achieving a singular overarching goal. For example, you could create an initiative titled **Enable Monitoring in Azure Security Center**, with a goal to monitor all the available security recommendations in your Azure Security Center.

Under this initiative, you would have policy definitions such as:

1. **Monitor unencrypted SQL Database in Security Center** – For monitoring unencrypted SQL databases and servers.
2. **Monitor OS vulnerabilities in Security Center** – For monitoring servers that do not satisfy the configured baseline.
3. **Monitor missing Endpoint Protection in Security Center** – For monitoring servers without an installed endpoint protection agent.

## Initiative assignment
Like a policy assignment, an initiative assignment is an initiative definition assigned to a specific scope. Initiative assignments reduce the need to make several initiative definitions for each scope. This scope could also range from a management group to a resource group.

From the preceding example, the **Enable Monitoring in Azure Security Center** initiative can be assigned to different scopes. For example, one assignment can be assigned to **subscriptionA**, while another can be assigned to **subscriptionB**.

## Initiative parameters
Like policy parameters, initiative parameters help simplify initiative management by reducing redundancy. Initiative parameters are essentially the list of parameters being used by the policy definitions within the initiative.

For example, take a scenario where you have an initiative definition - **initiativeC**, with two policy definitions. Each policy definition having one defined parameter:

|Policy  |name of parameter     |Type of parameter  |Note                                                                                                |
|--------|----------------------|-------|----------------------------------------------------------------------------------------------------------------|
|policyA |allowedLocations      |array  |This parameter expects a list of strings for a value since the parameter type has been defined as an array |
|policyB |allowedSingleLocation |string |This parameter expects one word for a value since the parameter type has been defined as a string          |

In this scenario, when defining the initiative parameters for **initiativeC**, you have three options:

1. Leverage the parameters of the policy definitions within this initiative: In this example, *allowedLocations* and *allowedSingleLocation* become initiative parameters for **initiativeC**.
2. Provide values to the parameters of the policy definitions within this initiative definition. In this example, you can provide a list of locations to **policyA’s parameter – allowedLocations** and **policyB’s parameter – allowedSingleLocation**.
You can also provide values when assigning this initiative.
3. Provide a list of *value* options that can be used when assigning this initiative. This means that when you assign this initiative, the inherited parameters from the policy definitions within the initiative, can only have values from this provided list.

For example, if your provided list of value options while creating the initiative definition, has – *EastUS*, *WestUS*, *CentralUS*, and *WestEurope*, you will be unable to input a different value such as *Southeast Asia* during the initiative assignment, because it is not part of the list.

## Recommendations for managing policies

While creating and managing policy definitions and assignments, here are a few pointers we advise you to follow:

- If you are creating policy definitions in your environment, we recommend starting with an audit effect, as opposed to a deny effect, to keep track the impact of your policy definition in your environment. If you have scripts already in place to autoscale up your applications, setting a deny effect may hinder those automations tasks you already have in place.
- It is important to keep organizational hierarchies in mind when creating definitions and assignments. We recommend creating definitions at a higher level, for example at the management group or subscription level, and assigning at the next child level. For example, if you create a policy definition at the management group level, a policy assignment of that definition can be scoped down to a subscription level.
- We encourage using the standard pricing tier, to better understand the compliance state of your environment.
- We recommend always using initiative definitions instead of policy definitions, even if you only have one policy in mind. For example, if you have a policy definition – *policyDefA* and you create it under the initiative definition - *initiativeDefC*, if you decide to create another policy definition with goals like that of *policyDefA*, you can simply add it under *initiativeDefC* and track them better that way.

   Keep in mind that once you have created an initiative assignment from an initiative definition, any new policy definitions added to the initiative definition will automatically roll under the initiative assignment(s) under that initiative definition. However, if there’s a new parameter introduced to the new policy definition, you need to update the initiative definition and assignments to reflect this by editing the definition or assignment.

## Next steps:
Now that you have an overview of Azure Policy and some of the key concepts we’re introducing, here are the suggested next steps:

- [Assign a policy definition](./assign-policy-definition.md)
- [Assign a policy definition using the Azure CLI](./assign-policy-definition-cli.md)
- [Assign a policy definition using PowerShell](./assign-policy-definition-ps.md)
