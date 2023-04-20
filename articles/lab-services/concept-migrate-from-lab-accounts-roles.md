---
title: Move role assignments for lab accounts
titleSuffix: Azure Lab Services
description: Learn how role assignment in different when migrating from lab accounts to lab plans in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 04/20/2023
---

# Move role assignments from lab accounts to lab plans in Azure Lab Services

When you move from lab accounts to lab plans in Azure Lab Services, it’s important to understand the differences between lab accounts and lab plans and the effect on role assignments. In this article, you learn how to update role assignments when moving from lab accounts to lab plans.

## Differences between role assignments for lab accounts and lab plans

Lab accounts serve as a parent to labs. When you assign a role on a lab account, the associated labs automatically inherit this role and permissions. 

On the other hand, lab plans and labs are sibling resources in Azure, which means that labs don’t inherit roles and permissions from the associated lab plan.

For example, consider you have assigned the Owner or Contributor role to users at the lab account level. To obtain the same permissions with a lab plan, you should instead assign the Owner or Contributor role at the lab plan's resource group level. When you assign the role to the resource group, all labs within that resource group are also assigned this role.

## Recommendations

The following table shows recommendations for mapping role assignments from lab accounts to lab plans in Azure Lab Services.

| Role type | Lab account role | Lab account assignment | Lab plan role | Lab plan assignment |
| --------- | ---------------- | ---------------------- | ------------- | ------------------- |
| Administrator | Owner | Lab account | Owner | Resource group |
| Administrator | Contributor | Lab account | Contributor | Resource group |
| Lab management | Lab Creator | Lab account | Lab Creator | Lab plan |
| Lab management | Owner** | Lab | Owner | Resource group or lab |
| Lab management | Contributor** | Lab | Lab Contributor | Lab |

** For lab accounts, the lab’s Contributor and Owner roles require that you also assign the Reader role on the lab account. For lab plans, you don't have to assign the Reader role at the lab plan or resource group level.

## Next steps

- Learn more about [Azure role-based access control for Azure Lab Services](./concept-lab-services-role-based-access-control.md)

- Learn more about [moving from lab accounts to lab plans](./migrate-to-2022-update.md)
