---
title: Role-based access control (RBAC) with REST - Azure | Microsoft Docs
description: Managing role-based access control (RBAC) with the REST API
services: active-directory
documentationcenter: na
author: rolyon
manager: mtillman
editor: ''

ms.assetid: 1f90228a-7aac-4ea7-ad82-b57d222ab128
ms.service: role-based-access-control
ms.workload: multiple
ms.tgt_pltfrm: rest-api
ms.devlang: na
ms.topic: article
ms.date: 06/04/2018
ms.author: rolyon

---
# Use RBAC to manage access with the REST API

[Role-based access control (RBAC)](overview.md) helps you manage access to Azure resources. For example, you can allow a user to manage the virtual machines in a particular resource group. You manage access for users, groups, and service principals (applications) by assigning roles at a particular scope. You can manage access using the Azure portal, Azure PowerShell, Azure CLI, Azure SDKs, or REST API. This article describes the common ways to manage access using the REST API.

## List access

To list role assignments (list access), you can use one of the [Role Assignments - List](/rest/api/authorization/roleassignments/list) REST APIs. To refine your results, you specify a scope and an optional filter. To call the API, you must have access to the `Microsoft.Authorization/roleAssignments/read` operation at the specified scope. All [built-in roles](built-in-roles.md) are granted access to this operation.

1. Start with the following request:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments?api-version=2015-07-01&$filter={filter}
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the role assignments.

    | Scope | Type |
    | --- | --- |
    | `subscriptions/{subscriptionId}` | Subscription |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1` | Resource group |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1/ providers/Microsoft.Web/sites/mysite1` | Resource |

1. Replace *{filter}* with the condition that you want to apply to filter the role assignment list.

    | Filter | Description |
    | --- | --- |
    | `$filter=atScope()` | List role assignments for only the specified scope, not including the role assignments at subscopes. |
    | `$filter=principalId%20eq%20'{objectId}'` | List role assignments for a specified user, group, or service principal. |
    | `$filter=assignedTo('{objectId}')` | List role assignments for a specified user, including ones inherited from groups. |

## Grant access

To create a role assignment (grant access), you use the [Role Assignments - Create](/rest/api/authorization/roleassignments/create) REST API and specify the security principal, role definition, and scope. To call this API, you must have access to `Microsoft.Authorization/roleAssignments/write` operation. Of the built-in roles, only [Owner](built-in-roles.md#owner) and [User Access Administrator](built-in-roles.md#user-access-administrator) are granted access to this operation.

1. Use the [Role Definitions - List](/rest/api/authorization/roledefinitions/list) REST API or see [Built-in roles](built-in-roles.md) to get the identifier for the role definition you want to assign.

1. Use a GUID tool to generate a unique identifier that will be used for the role assignment identifier. The identifier has the format: `00000000-0000-0000-0000-000000000000`

1. Start with the following request and body:

    ```http
    PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}?api-version=2015-07-01
    ```

    ```json
    {
      "properties": {
        "roleDefinitionId": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/{roleDefinitionId}",
        "principalId": "{principalId}"
      }
    }
    ```
    
1. Within the URI, replace *{scope}* with the scope for the role assignment.

    | Scope | Type |
    | --- | --- |
    | `subscriptions/{subscriptionId}` | Subscription |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1` | Resource group |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1/ providers/Microsoft.Web/sites/mysite1` | Resource |

1. Replace *{roleAssignmentName}* with the GUID identifier of the role assignment.

1. Within the request body, replace *{subscriptionId}* with your subscription identifier.

1. Replace *{roleDefinitionId}* with the role definition identifier.

1. Replace *{principalId}* with the object identifier of the user, group, or service principal that will be assigned the role.

## Remove access

To remove a role assignment (remove access), use the [Role Assignments - Delete](/rest/api/authorization/roleassignments/delete) REST API. To call this API, you must have access to the `Microsoft.Authorization/roleAssignments/delete` operation. Of the built-in roles, only [Owner](built-in-roles.md#owner) and [User Access Administrator](built-in-roles.md#user-access-administrator) are granted access to this operation.

1. Get the role assignment identifier (GUID). This identifier is returned when you first create the role assignment or you can get it by listing the role assignments.

1. Start with the following request:

    ```http
    DELETE https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentName}?api-version=2015-07-01
    ```

1. Within the URI, replace *{scope}* with the scope for removing the role assignment.

    | Scope | Type |
    | --- | --- |
    | `subscriptions/{subscriptionId}` | Subscription |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1` | Resource group |
    | `subscriptions/{subscriptionId}/resourceGroups/myresourcegroup1/ providers/Microsoft.Web/sites/mysite1` | Resource |

1. Replace *{roleAssignmentName}* with the GUID identifier of the role assignment.

## Next steps

- [Azure REST API Reference](/rest/api/azure/)
- [Built-in roles](built-in-roles.md)
- [Understand role definitions](role-definitions.md)