---
title: Move role assignments for lab accounts
titleSuffix: Azure Lab Services
description: Learn how Azure Lab Services provides protection with Azure role-based access control (Azure RBAC) integration.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 04/20/2023
---

# Move role assignments from lab accounts to lab plans

If you are moving from lab accounts to lab plans, it’s important to understand differences between lab accounts and lab plans and how this impacts role assignments:

Lab accounts serve as a parent to labs; as a result, the roles assigned on a lab account are automatically inherited by its child labs.
Lab plans and labs are siblings to each other; this means that labs don’t inherit roles from lab plans.
For example, if you have users that are assigned the Owner or Contributor role at the lab account level, you should instead assign the Owner and Contributor roles at the resource group level for your lab plans.  Roles assigned on a lab plan’s resource group will automatically grant permission to all  labs within the resource group.


The table below shows recommendations to map roles from the earlier version of Azure Lab Services to roles in the August 2022 Update (Classic).

**TODO: add table**

* In the earlier version, the lab’s Contributor and Owner roles required that the Reader role also be assigned on the lab account.  In the August 2022 update, you do not need to assign the role at the lab plan or resource group level.

## Next steps