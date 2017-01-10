---
title: 'Tenant admin elevate access - RBAC | Microsoft Docs'
description: This topic describes the built in roles for role-based access control (RBAC).
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila
editor: rqureshi

ms.assetid: b547c5a5-2da2-4372-9938-481cb962d2d6
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/09/201
ms.author: kgremban

---
# Elevate access as a tenant admin with Role-Based Access Control 

Role-based Access Control helps tenant administrators get temporary elevations in access so that they can grant higher permissions than normal. A tenant admin can elevate herself to the User Access Administrator role when needed. That role gives the tenant admin permissions to grant herself of others roles at the "/" scope. 

This feature is important because it allows the tenant admin to see all the subscription that exist in an organization. It also allows for automation apps (like invoicing and auditing) to access all the subscriptions and provide an accurate view of the state of the organization from a billing or asset management perspective.  

## How to elevate access

The basic process works with the following steps:

1. All tenant administrators have permissions to call a special action, *elevateAccess*. Using the REST endpoint of ARM, a tenant admin calls *elevateAccess* to grant themselves the User Access Administrator role.

2. As a User Access Admin, the tenant admin creates a [role assignment](/rest/api/authorization/roleassignments) assign any role at any scope. The following example shows the properties for assigning the Reader role at "/" scope:

    ```
    { "properties":{
    "roleDefinitionId": "providers/Microsoft.Authorization/roleDefinitions/acdd72a7338548efbd42f606fba81ae7",
    "principalId": "cbc5e050-d7cd-4310-813b-4870be8ef5bb",
    "scope": "/"
    },
    "id": "providers/Microsoft.Authorization/roleAssignments/64736CA0-56D7-4A94-A551-973C2FE7888B",
    "type": "Microsoft.Authorization/roleAssignments",
    "name": "64736CA0-56D7-4A94-A551-973C2FE7888B"
    }
    ```

3. The tenant admin can also delete role assignments at "/" scope.

4. The tenant admin revokes their User Access Admin privileges until they're needed again.

It's important to remember that the User Access Admin role should be inactive until needed. As a safety measure, always revoke the privileges when not needed. This is a safeguard to prevent the privileges from falling into the hands of a third party if the tenant admin account gets compromised. 

