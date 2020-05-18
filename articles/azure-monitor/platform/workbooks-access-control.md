---
title: Azure Monitor Workbooks access control
description: Simplify complex reporting with prebuilt and custom parameterized workbooks with role based access control
services: azure-monitor
author: mrbullwinkle
manager: carmonm

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/23/2019
ms.author: mbullwin
---

# Access control

Access control in workbooks refers to two things:

* Access required to read data in a workbook. This access is controlled by standard [Azure roles](https://docs.microsoft.com/azure/role-based-access-control/overview) on the resources used in the workbook. Workbooks do not specify or configure access to those resources. Users would usually get this access to those resources using the [Monitoring Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-reader) role on those resources.

* Access required to save workbooks

    - Saving private `("My")` workbooks requires no additional privileges. All users can save private workbooks, and only they can see those workbooks.
    - Saving shared workbooks requires write privileges in a resource group to save the workbook. These privileges are usually specified by the [Monitoring Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-contributor) role, but can also be set via the *Workbooks Contributor* role.
    
## Standard roles with workbook-related privileges

[Monitoring Reader](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-reader) includes standard /read privileges that would be used by monitoring tools (including workbooks) to read data from resources.

[Monitoring Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-contributor) includes general `/write` privileges used by various monitoring tools for saving items (including `workbooks/write` privilege to save shared workbooks).
“Workbooks Contributor” adds “workbooks/write” privileges to an object to save shared workbooks.
No special privileges are required for users to save private workbooks that only they can see.

For custom Role-based access control:

Add `microsoft.insights/workbooks/write` to save shared workbooks. For more details, see the [Workbook Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#monitoring-contributor) role.

## Next steps

* [Get started](workbooks-visualizations.md) learning more about workbooks many rich visualizations options.
