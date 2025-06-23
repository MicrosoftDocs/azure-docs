---
title: Microsoft Sentinel data lake notebook write permissions
ms.date: 06/23/2025
ms.topic: include
---

#### Write to tables in the Microsoft Sentinel data lake

To write to tables to any workspace in the data lake in interactive notebook queries, you must have one of the following Microsoft Entra ID roles.  Microsoft Entra ID roles provides broad access across all workspaces in the data lake. 

+ [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)
+ [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator)
+ [Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)

Alternatively, you can have the ability to write output to a specific workspace. If you have the following permissions on the workspace, you will be able to create, update, and delete tables within that workspace:
+ [Microsoft Defender XDR role](/defender-xdr/m365d-permissions) with data (manage) over the Microsoft Sentinel data collection, for the default workspace. 
+ For any other Sentinel workspace in the data lake, any built-in or custom role that includes the following Azure RBAC  [Microsoft operational insights](/azure/role-based-access-control/permissions/monitor#microsoftoperationalinsights) permissions on that workspace: 
    + Microsoft.operationalinsights/workspaces/write
    + microsoft.operationalinsights/workspaces/tables/write
    + microsoft.operationalinsights/workspaces/tables/delete