---
title: Assign Microsoft Entra admin roles with Microsoft Graph API
description: Assign and remove Microsoft Entra administrator roles with Graph API in Microsoft Entra ID
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: how-to
ms.date: 02/04/2022
ms.author: rolyon
ms.reviewer: vincesm
ms.custom: it-pro
ms.collection: M365-identity-device-management
---
# Assign custom admin roles using the Microsoft Graph API in Microsoft Entra ID 

You can automate how you assign roles to user accounts using the Microsoft Graph API. This article covers POST, GET, and DELETE operations on roleAssignments.

## Prerequisites

- Microsoft Entra ID P1 or P2 license
- Privileged Role Administrator or Global Administrator
- Admin consent when using Graph Explorer for Microsoft Graph API

For more information, see [Prerequisites to use PowerShell or Graph Explorer](prerequisites.md).

## POST Operations on RoleAssignment

Use the [Create unifiedRoleAssignment](/graph/api/rbacapplication-post-roleassignments) API to assign the role.

### Example 1: Create a role assignment between a user and a role definition

```http
POST https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments
Content-type: application/json
```

Body

```http
{
    "@odata.type": "#microsoft.graph.unifiedRoleAssignment",
    "principalId": "ab2e1023-bddc-4038-9ac1-ad4843e7e539",
    "roleDefinitionId": "194ae4cb-b126-40b2-bd5b-6091b380977d",
    "directoryScopeId": "/"  // Don't use "resourceScope" attribute in Azure AD role assignments. It will be deprecated soon.
}
```

Response

```http
HTTP/1.1 201 Created
```

### Example 2: Create a role assignment where the principal or role definition does not exist

```http
POST https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments
```

Body

```http
{
    "@odata.type": "#microsoft.graph.unifiedRoleAssignment",
    "principalId": "2142743c-a5b3-4983-8486-4532ccba12869",
    "roleDefinitionId": "194ae4cb-b126-40b2-bd5b-6091b380977d",
    "directoryScopeId": "/"  //Don't use "resourceScope" attribute in Azure AD role assignments. It will be deprecated soon.
}
```

Response

```http
HTTP/1.1 404 Not Found
```

### Example 3: Create a role assignment on a single resource scope

```http
POST https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments
```

Body

```http
{
    "@odata.type": "#microsoft.graph.unifiedRoleAssignment",
    "principalId": "2142743c-a5b3-4983-8486-4532ccba12869",
    "roleDefinitionId": "e9b2b976-1dea-4229-a078-b08abd6c4f84",    //role template ID of a custom role
    "directoryScopeId": "/13ff0c50-18e7-4071-8b52-a6f08e17c8cc"  //object ID of an application
}
```

Response

```http
HTTP/1.1 201 Created
```

### Example 4: Create an administrative unit scoped role assignment on a built-in role definition which is not supported

```http
POST https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments
```

Body

```http
{
    "@odata.type": "#microsoft.graph.unifiedRoleAssignment",
    "principalId": "ab2e1023-bddc-4038-9ac1-ad4843e7e539",
    "roleDefinitionId": "29232cdf-9323-42fd-ade2-1d097af3e4de",    //role template ID of Exchange Administrator
    "directoryScopeId": "/administrativeUnits/13ff0c50-18e7-4071-8b52-a6f08e17c8cc"    //object ID of an administrative unit
}
```

Response

```http
HTTP/1.1 400 Bad Request
{
    "odata.error":
    {
        "code":"Request_BadRequest",
        "message":
        {
            "message":"The given built-in role is not supported to be assigned to a single resource scope."
        }
    }
}
```

Only a subset of built-in roles are enabled for Administrative Unit scoping. Refer to [this documentation](admin-units-assign-roles.md) for the list of built-in roles supported over an administrative unit.

## GET Operations on RoleAssignment

Use the [List unifiedRoleAssignments](/graph/api/rbacapplication-list-roleassignments) API to get the role assignment.

### Example 5: Get role assignments for a given principal

```http
GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments?$filter=principalId+eq+'<object-id-of-principal>'
```

Response

```http
HTTP/1.1 200 OK
{
"value":[
            { 
                "id": "mhxJMipY4UanIzy2yE-r7JIiSDKQoTVJrLE9etXyrY0-1"
                "principalId": "ab2e1023-bddc-4038-9ac1-ad4843e7e539",
                "roleDefinitionId": "10dae51f-b6af-4016-8d66-8c2a99b929b3",
                "directoryScopeId": "/"  
            } ,
            {
                "id": "CtRxNqwabEKgwaOCHr2CGJIiSDKQoTVJrLE9etXyrY0-1"
                "principalId": "ab2e1023-bddc-4038-9ac1-ad4843e7e539",
                "roleDefinitionId": "fe930be7-5e62-47db-91af-98c3a49a38b1",
                "directoryScopeId": "/"
            }
        ]
}
```

### Example 6: Get role assignments for a given role definition.

```http
GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments?$filter=roleDefinitionId+eq+'<object-id-or-template-id-of-role-definition>'
```

Response

```http
HTTP/1.1 200 OK
{
"value":[
            {
                "id": "CtRxNqwabEKgwaOCHr2CGJIiSDKQoTVJrLE9etXyrY0-1"
                "principalId": "ab2e1023-bddc-4038-9ac1-ad4843e7e539",
                "roleDefinitionId": "fe930be7-5e62-47db-91af-98c3a49a38b1",
                "directoryScopeId": "/"
            }
     ]
}
```

### Example 7: Get a role assignment by ID.

```http
GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments/lAPpYvVpN0KRkAEhdxReEJC2sEqbR_9Hr48lds9SGHI-1
```

Response

```http
HTTP/1.1 200 OK
{ 
    "id": "mhxJMipY4UanIzy2yE-r7JIiSDKQoTVJrLE9etXyrY0-1",
    "principalId": "ab2e1023-bddc-4038-9ac1-ad4843e7e539",
    "roleDefinitionId": "10dae51f-b6af-4016-8d66-8c2a99b929b3",
    "directoryScopeId": "/"
}
```

### Example 8: Get role assignments for a given scope

```http
GET https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments?$filter=directoryScopeId+eq+'/d23998b1-8853-4c87-b95f-be97d6c6b610'
```

Response

```http
HTTP/1.1 200 OK
{
"value":[
            { 
                "id": "mhxJMipY4UanIzy2yE-r7JIiSDKQoTVJrLE9etXyrY0-1"
                "principalId": "ab2e1023-bddc-4038-9ac1-ad4843e7e539",
                "roleDefinitionId": "10dae51f-b6af-4016-8d66-8c2a99b929b3",
                "directoryScopeId": "/d23998b1-8853-4c87-b95f-be97d6c6b610"
            } ,
            {
                "id": "CtRxNqwabEKgwaOCHr2CGJIiSDKQoTVJrLE9etXyrY0-1"
                "principalId": "ab2e1023-bddc-4038-9ac1-ad4843e7e539",
                "roleDefinitionId": "3671d40a-1aac-426c-a0c1-a3821ebd8218",
                "directoryScopeId": "/d23998b1-8853-4c87-b95f-be97d6c6b610"
            }
        ]
}
```

## DELETE Operations on RoleAssignment

Use the [Delete unifiedRoleAssignment](/graph/api/unifiedroleassignment-delete) API to delete the role assignment.

### Example 9: Delete a role assignment between a user and a role definition.

```http
DELETE https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments/lAPpYvVpN0KRkAEhdxReEJC2sEqbR_9Hr48lds9SGHI-1
```

Response
```http
HTTP/1.1 204 No Content
```

### Example 10: Delete a role assignment that no longer exists

```http
DELETE https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments/lAPpYvVpN0KRkAEhdxReEJC2sEqbR_9Hr48lds9SGHI-1
```

Response

```http
HTTP/1.1 404 Not Found
```

### Example 11: Delete a role assignment between self and Global Administrator role definition

```http
DELETE https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments/lAPpYvVpN0KRkAEhdxReEJC2sEqbR_9Hr48lds9SGHI-1
```

Response

```http
HTTP/1.1 400 Bad Request
{
    "odata.error":
    {
        "code":"Request_BadRequest",
        "message":
        {
            "lang":"en",
            "value":"Removing self from Global Administrator built-in role is not allowed"},
            "values":null
        }
    }
}
```

We prevent users from deleting their own Global Administrator role to avoid a scenario where a tenant has zero Global Administrators. Removing other roles assigned to self is allowed.

## Next steps

* Feel free to share with us on the [Microsoft Entra administrative roles forum](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789)
* For more about role permissions, see [Microsoft Entra built-in roles](permissions-reference.md)
* For default user permissions, see a [comparison of default guest and member user permissions](../fundamentals/users-default-permissions.md)
