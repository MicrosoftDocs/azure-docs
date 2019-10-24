---
title: Create interactive reports with Azure Monitor workbooks | Microsoft docs
description: Simplify complex reporting with prebuilt and custom parameterized workbooks
services: azure-monitor
author: mrbullwinkle
manager: carmonm
ms.service: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/15/2019
ms.author: mbullwin
---

# Access control

Access control in workbooks refers to two things:

1. Access required to read data in a workbook - this is controlled by standard Azure roles on the resources used in the workbook. Workbooks itself does not specify or configure access to those resources. Users would usually get this access to those resources using the "Monitoring Reader" role on those resources.

2. Access required to save workbooks

- Saving private ("My") workbooks requires no additional privileges. All users can save private workbooks, and only they can see those workbooks.
- Saving shared workbooks requires write privileges in a resource group to save the workbook. This is is usually specified by the "Monitoring Contributor" role, but can also be set via the "Workbooks Contributor" role

## Standard roles with workbook related privledges

[Monitoring Reader]() includes standard /read privileges that would be used by monitoring tools (including workbooks) to read data from resources.

[Monitoring Contributor]() includes general /write privileges used by various monitoring tools for saving items (including workbooks/write privilege to save shared workbooks)
“Workbooks Contributor” adds “workbooks/write” privileges to an object to save shared workbooks.
No special privileges are required for users to save “My” private workbooks that only they can see.

For custom RBAC:
Add “microsoft.insights/workbooks/write” to save shared workbooks. See the "Workbook Contributor" role for more details

## Next steps
