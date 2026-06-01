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
|Required inheritance from assignment on scope to each member/descendant resource|Supported|Supported|Supported|Not Supported|Not Supported|
|Consolidation of resources for reduction of Role Assignments/Policy Assignments|Supported|Supported|Supported|Not Supported|Not Supported*|
|Grouping of resources that are shared across scope boundaries. Ex. Global Networking resources in one subscription/resource group that are shared across multiple applications that have their own subscriptions/resource groups. |Not Supported| Not Supported|Not Supported|Supported|Not Supported**|

*: Azure tags can be used as criteria within Azure Policy to apply policies to certain resources. Azure tags are subject to limitations.

**: Tags can be applied across scopes and are added to resources individually. However, does not support first-class native grouping functionality. 