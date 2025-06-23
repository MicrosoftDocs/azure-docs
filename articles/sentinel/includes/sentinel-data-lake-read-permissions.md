---
title: Microsoft Sentinel data lake query and read permissions.
ms.date: 06/23/2025
ms.topic: include
---


#### Query and read data in the Microsoft Sentinel data lake

You can query data in the data lake based on your roles.

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. To read tables across all workspaces in the data lake using interactive notebook queries, you must have one of the following Microsoft Entra ID roles.
+ [Global reader](/entra/identity/role-based-access-control/permissions-reference#global-reader)
+ [Security reader](/azure/role-based-access-control/built-in-roles/security#security-reader)
+ [Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)
+ [Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator)
+ [Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator)

Alternatively, you may have access to interactive queries for specific workspaces rather than across the entire data lake by using Azure RBAC and Microsoft Defender XDR roles. 

To provide access to the default workspace in the data lake to query tables use a Microsoft Defender XDR role with [security data basics (read)](/defender-xdr/custom-permissions-details?source=recommendations#security-operations--security-data) over the Microsoft Sentinel data collection.

For Sentinel workspace in the data lake other than the default, use the following Azure RBAC built-in roles to run queries and read data over that workspace: 

+ [Log Analytics Reader](/azure/role-based-access-control/built-in-roles/monitor#log-analytics-reader)
+ [Reader](/azure/role-based-access-control/built-in-roles/general#reader)
+ [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor)
+ [Owner](/azure/role-based-access-control/built-in-roles/privileged#owner)
