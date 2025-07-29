---
ms.service: azure-policy
ms.custom: 
ms.topic: include
ms.date: 07/17/2025
author: kenieva
ms.author: kenieva
---


|Scenario|[Resource Group](/azure/azure-resource-manager/management/overview#resource-groups)|[Subscription](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-subscription-limits)|[Management Group](https://www.learn.microsoft.com/azure/governance/management-groups/overview)|[Service Group](/azure/governance/service-groups/overview)|[Tags](/azure/azure-resource-manager/management/tag-resources)|
|--------|--------------|------------|----------------|-------------|----|
|Require Inheritance from assignment on scope to each member/descendant resource|Supported*|Supported|Supported|Not Supported|Not Supported|
|Consolidation of resources for reduction of Role Assignments/Policy Assignments|Supported|Supported|Supported|Not Supported|Not Supported|
|Grouping of resources that are shared across scope boundaries. Ex. Global Networking resources in one subscription/resource group that are shared across multiple applications that have their own subscriptions/resource groups. |Not Supported| Not Supported|Not Supported|Supported|Supported|
|Create separate groupings that allow for separate aggregations of metrics|Not Supported|Supported|Supported|Supported|Supported**|
|Enforce enterprise-wide restrictions or organizational configurations across many resources|Supported*|Supported*|Supported*|Not Supported|Supported***|

*: When a policy is applied to a scope, the enforcement is to all of the members within the scope. For example, on a Resource Group it only applies to the resources under it.

**: Tags can be applied across scopes and are added to resources individually. Azure Policy has built-in policies that can help manage tags.

***: Azure tags can be used as criteria within Azure Policy to apply policies to certain resources. Azure tags are subject to limitations.
