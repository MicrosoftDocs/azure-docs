---
title: Azure Monitor Workbooks access control
description: Simplify complex reporting with prebuilt and custom parameterized workbooks with role based access control
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/16/2021
---

# Access control

Access control in workbooks refers to two things:

* Access required to read data in a workbook. This access is controlled by standard [Azure roles](../../role-based-access-control/overview.md) on the resources used in the workbook. Workbooks do not specify or configure access to those resources. Users would usually get this access to those resources using the [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) role on those resources.

* Access required to save workbooks

    - Saving workbooks requires write privileges in a resource group to save the workbook. These privileges are usually specified by the [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) role, but can also be set via the *Workbooks Contributor* role.
    
## Standard roles with workbook-related privileges

[Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) includes standard /read privileges that would be used by monitoring tools (including workbooks) to read data from resources.

[Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) includes general `/write` privileges used by various monitoring tools for saving items (including `workbooks/write` privilege to save shared workbooks).
“Workbooks Contributor” adds “workbooks/write” privileges to an object to save shared workbooks.

For custom roles:

Add `microsoft.insights/workbooks/write` to save workbooks. For more details, see the [Workbook Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) role.

## Next steps

* [Get started](./workbooks-overview.md#visualizations) learning more about workbooks many rich visualizations options.