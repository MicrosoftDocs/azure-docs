---
title: Assign Azure roles using the REST API - Azure RBAC
description: Learn how to grant access to Azure resources for users, groups, service principals, or managed identities using the REST API and Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: multiple
ms.tgt_pltfrm: rest-api
ms.topic: how-to
ms.date: 10/19/2022
ms.author: rolyon

---
# Assign Azure roles using the REST API

[!INCLUDE [Azure RBAC definition grant access](../../includes/role-based-access-control/definition-grant.md)] This article describes how to assign roles using the REST API.

## Prerequisites

[!INCLUDE [Azure role assignment prerequisites](../../includes/role-based-access-control/prerequisites-role-assignments.md)]

You must use the following versions:

- `2015-07-01` or later to assign an Azure role
- `2018-09-01-preview` or later to assign an Azure role to a new service principal

For more information, see [API versions of Azure RBAC REST APIs](/rest/api/authorization/versions).

## Assign an Azure role

To assign a role, use the [Role Assignments - Create](/rest/api/authorization/role-assignments/create) REST API and specify the security principal, role definition, and scope. To call this API, you must have access to the `Microsoft.Authorization/roleAssignments/write` action. Of the built-in roles, only [Owner](built-in-roles.md#owner) and [User Access Administrator](built-in-roles.md#user-access-administrator) are granted access to this action.

1. Use the [Role Definitions - List](/rest/api/authorization/role-definitions/list) REST API or see [Built-in roles](built-in-roles.md) to get the identifier for the role definition you want to assign.

1. Use a GUID tool to generate a unique identifier that will be used for the role assignment identifier. The identifier has the format: `00000000-0000-0000-0000-000000000000`

1. Start with the following request and body:

    ```http
    PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}?api-version=2022-04-01
    ```

    ```json
    {
      "properties": {
        "roleDefinitionId": "/{scope}/providers/Microsoft.Authorization/roleDefinitions/{roleDefinitionId}",
        "principalId": "{principalId}"
      }
    }
    ```

1. Within the URI, replace *{scope}* with the scope for the role assignment.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `providers/Microsoft.Management/managementGroups/{groupId1}` | Management group |
    > | `subscriptions/{subscriptionId1}` | Subscription |
    > | `subscriptions/{subscriptionId1}/resourceGroups/myresourcegroup1` | Resource group |
    > | `subscriptions/{subscriptionId1}/resourceGroups/myresourcegroup1/providers/microsoft.web/sites/mysite1` | Resource |

    In the previous example, microsoft.web is a resource provider that refers to an App Service instance. Similarly, you can use any other resource providers and specify the scope. For more information, see [Azure Resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md) and supported [Azure resource provider operations](resource-provider-operations.md).  

1. Replace *{roleAssignmentId}* with the GUID identifier of the role assignment.

1. Within the request body, replace *{scope}* with the same scope as in the URI.

1. Replace *{roleDefinitionId}* with the role definition identifier.

1. Replace *{principalId}* with the object identifier of the user, group, or service principal that will be assigned the role.

The following request and body assigns the [Backup Reader](built-in-roles.md#backup-reader) role to a user at subscription scope:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId1}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId1}?api-version=2022-04-01
```

```json
{
  "properties": {
    "roleDefinitionId": "/subscriptions/{subscriptionId1}/providers/Microsoft.Authorization/roleDefinitions/a795c7a0-d4a2-40c1-ae25-d81f01202912",
    "principalId": "{objectId1}"
  }
}
```

The following shows an example of the output:

```json
{
    "properties": {
        "roleDefinitionId": "/subscriptions/{subscriptionId1}/providers/Microsoft.Authorization/roleDefinitions/a795c7a0-d4a2-40c1-ae25-d81f01202912",
        "principalId": "{objectId1}",
        "principalType": "User",
        "scope": "/subscriptions/{subscriptionId1}",
        "condition": null,
        "conditionVersion": null,
        "createdOn": "2022-05-06T23:55:23.7679147Z",
        "updatedOn": "2022-05-06T23:55:23.7679147Z",
        "createdBy": null,
        "updatedBy": "{updatedByObjectId1}",
        "delegatedManagedIdentityResourceId": null,
        "description": null
    },
    "id": "/subscriptions/{subscriptionId1}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId1}",
    "type": "Microsoft.Authorization/roleAssignments",
    "name": "{roleAssignmentId1}"
}
```

### New service principal

If you create a new service principal and immediately try to assign a role to that service principal, that role assignment can fail in some cases. For example, if you create a new managed identity and then try to assign a role to that service principal, the role assignment might fail. The reason for this failure is likely a replication delay. The service principal is created in one region; however, the role assignment might occur in a different region that hasn't replicated the service principal yet.

To address this scenario, use the [Role Assignments - Create](/rest/api/authorization/role-assignments/create) REST API and set the `principalType` property to `ServicePrincipal`. You must also set the `apiVersion` to `2018-09-01-preview` or later. `2022-04-01` is the first stable version.

```http
PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleAssignments/{roleAssignmentId}?api-version=2022-04-01
```

```json
{
  "properties": {
    "roleDefinitionId": "/{scope}/providers/Microsoft.Authorization/roleDefinitions/{roleDefinitionId}",
    "principalId": "{principalId}",
    "principalType": "ServicePrincipal"
  }
}
```

## Next steps

- [List Azure role assignments using the REST API](role-assignments-list-rest.md)
- [Deploy resources with Resource Manager templates and Resource Manager REST API](../azure-resource-manager/templates/deploy-rest.md)
- [Azure REST API Reference](/rest/api/azure/)
- [Create or update Azure custom roles using the REST API](custom-roles-rest.md)
