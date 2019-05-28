---
title: Manage access to Azure resources using RBAC and the REST API - Azure | Microsoft Docs
description: Learn how to manage access to Azure resources for users, groups, and applications using role-based access control (RBAC) and the REST API. This includes how to list access, grant access, and remove access.
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
ms.topic: conceptual
ms.date: 06/20/2018
ms.author: rolyon
ms.reviewer: bagovind

---
# Manage access to Azure resources using RBAC and the REST API

[Role-based access control (RBAC)](overview.md) is the way that you manage access to Azure resources. This article describes how you manage access for users, groups, and applications using RBAC and the REST API.

## List access

In RBAC, to list access, you list the role assignments. To list role assignments, use one of the [Role Assignments - List](/rest/api/authorization/roleassignments/list) REST APIs. To refine your results, you specify a scope and an optional filter.

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
    
       
     > [!NOTE]
     > In the above example Microsoft.web is the resource provider is used which refers to App service instance. Similarly you can use any other resource provider and build the Scope URI. In order to understand more please refer to [Azure Resource providers and types](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-supported-services) and supported [Azure RM resource provider operations](https://docs.microsoft.com/en-us/azure/role-based-access-control/resource-provider-operations).  
     
1. Replace *{filter}* with the condition that you want to apply to filter the role assignment list.

    | Filter | Description |
    | --- | --- |
    | `$filter=atScope()` | List role assignments for only the specified scope, not including the role assignments at subscopes. |
    | `$filter=principalId%20eq%20'{objectId}'` | List role assignments for a specified user, group, or service principal. |
    | `$filter=assignedTo('{objectId}')` | List role assignments for a specified user, including ones inherited from groups. |

## Grant access

In RBAC, to grant access, you create a role assignment. To create a role assignment, use the [Role Assignments - Create](/rest/api/authorization/roleassignments/create) REST API and specify the security principal, role definition, and scope. To call this API, you must have access to the `Microsoft.Authorization/roleAssignments/write` operation. Of the built-in roles, only [Owner](built-in-roles.md#owner) and [User Access Administrator](built-in-roles.md#user-access-administrator) are granted access to this operation.

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

In RBAC, to remove access, you remove a role assignment. To remove a role assignment, use the [Role Assignments - Delete](/rest/api/authorization/roleassignments/delete) REST API. To call this API, you must have access to the `Microsoft.Authorization/roleAssignments/delete` operation. Of the built-in roles, only [Owner](built-in-roles.md#owner) and [User Access Administrator](built-in-roles.md#user-access-administrator) are granted access to this operation.

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

- [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/resource-group-template-deploy-rest.md)
- [Azure REST API Reference](/rest/api/azure/)
- [Create custom roles for Azure resources using the REST API](custom-roles-rest.md)
