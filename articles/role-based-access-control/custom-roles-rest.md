---
title: Create custom roles using the REST API - Azure | Microsoft Docs
description: Learn how to create custom roles for role-based access control (RBAC) using the REST API. This includes how to list, create, update, and delete custom roles.
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
ms.date: 06/20/2018
ms.author: rolyon
ms.reviewer: bagovind

---
# Create custom roles using the REST API

If the [built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles. This article describes how to create and manage custom roles using the REST API.

## Create a custom role
Create a custom role.

To create a custom role, you must have access to `Microsoft.Authorization/roleDefinitions/write` operation on all the `AssignableScopes`. Of the built-in roles, only *Owner* and *User Access Administrator* are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure role-based access control](role-assignments-portal.md).

### Request
Use the **PUT** method with the following URI:

    https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the first *AssignableScope* of the custom role. The following examples show how to specify the scope for different levels.

   * Subscription: /subscriptions/{subscription-id}  
   * Resource Group: /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  
   * Resource: /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1  
2. Replace *{role-definition-id}* with a new GUID, which becomes the GUID identifier of the new custom role.
3. Replace *{api-version}* with 2015-07-01.

For the request body, provide the values in the following format:

```
{
  "name": "7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7",
  "properties": {
    "roleName": "Virtual Machine Operator",
    "description": "Lets you monitor virtual machines and restart them.",
    "type": "CustomRole",
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ]
  }
}

```

| Element Name | Required | Type | Description |
| --- | --- | --- | --- |
| name |Yes |String |GUID identifier of the custom role. |
| properties.roleName |Yes |String |Display name of the custom role. Maximum size 128 characters. |
| properties.description |No |String |Description of the custom role. Maximum size 1024 characters. |
| properties.type |Yes |String |Set to "CustomRole." |
| properties.permissions.actions |Yes |String[] |An array of action strings specifying the operations granted by the custom role. |
| properties.permissions.notActions |No |String[] |An array of action strings specifying the operations to exclude from the operations granted by the custom role. |
| properties.assignableScopes |Yes |String[] |An array of scopes in which the custom role can be used. |

### Response
Status code: 201

```
{
  "properties": {
    "roleName": "Virtual Machine Operator",
    "type": "CustomRole",
    "description": "Lets you monitor virtual machines and restart them.",
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "createdOn": "2015-12-18T00:10:51.4662695Z",
    "updatedOn": "2015-12-18T00:10:51.4662695Z",
    "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7",
  "type": "Microsoft.Authorization/roleDefinitions",
  "name": "7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7"
}

```

## Update a custom role
Modify a custom role.

To modify a custom role, you must have access to `Microsoft.Authorization/roleDefinitions/write` operation on all the `AssignableScopes`. Of the built-in roles, only *Owner* and *User Access Administrator* are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure role-based access control](role-assignments-portal.md).

### Request
Use the **PUT** method with the following URI:

    https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the first *AssignableScope* of the custom role. The following examples show how to specify the scope for different levels:

   * Subscription: /subscriptions/{subscription-id}  
   * Resource Group: /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  
   * Resource: /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1  
2. Replace *{role-definition-id}* with the GUID identifier of the custom role.
3. Replace *{api-version}* with 2015-07-01.

For the request body, provide the values in the following format:

```
{
  "name": "7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7",
  "properties": {
    "roleName": "Virtual Machine Operator",
    "description": "Lets you monitor virtual machines and restart them.",
    "type": "CustomRole",
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ]
  }
}

```

| Element Name | Required | Type | Description |
| --- | --- | --- | --- |
| name |Yes |String |GUID identifier of the custom role. |
| properties.roleName |Yes |String |Display name of the updated custom role. |
| properties.description |No |String |Description of the updated custom role. |
| properties.type |Yes |String |Set to "CustomRole." |
| properties.permissions.actions |Yes |String[] |An array of action strings specifying the operations to which the updated custom role grants access. |
| properties.permissions.notActions |No |String[] |An array of action strings specifying the operations to exclude from the operations which the updated custom role grants. |
| properties.assignableScopes |Yes |String[] |An array of scopes in which the updated custom role can be used. |

### Response
Status code: 201

```
{
  "properties": {
    "roleName": "Virtual Machine Operator",
    "type": "CustomRole",
    "description": "Lets you monitor virtual machines and restart them.",
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "createdOn": "2015-12-18T00:10:51.4662695Z",
    "updatedOn": "2015-12-18T00:10:51.4662695Z",
    "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7",
  "type": "Microsoft.Authorization/roleDefinitions",
  "name": "7c8c8ccd-9838-4e42-b38c-60f0bbe9a9d7"
}

```

## Delete a custom role
Delete a custom role.

To delete a custom role, you must have access to `Microsoft.Authorization/roleDefinitions/delete` operation on all the `AssignableScopes`. Of the built-in roles, only *Owner* and *User Access Administrator* are granted access to this operation. For more information about role assignments and managing access for Azure resources, see [Azure role-based access control](role-assignments-portal.md).

### Request
Use the **DELETE** method with the following URI:

    https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{role-definition-id}?api-version={api-version}

Within the URI, make the following substitutions to customize your request:

1. Replace *{scope}* with the scope at which you wish to delete the role definition. The following examples show how to specify the scope for different levels:

   * Subscription: /subscriptions/{subscription-id}  
   * Resource Group: /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1  
   * Resource: /subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.Web/sites/mysite1  
2. Replace *{role-definition-id}* with the GUID role definition id of the custom role.
3. Replace *{api-version}* with 2015-07-01.

### Response
Status code: 200

```
{
  "properties": {
    "roleName": "Virtual Machine Operator",
    "type": "CustomRole",
    "description": "Lets you monitor virtual machines and restart them.",
    "assignableScopes": [
      "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e"
    ],
    "permissions": [
      {
        "actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.Compute/*/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Network/*/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/*/read",
          "Microsoft.Support/*",
          "Microsoft.Compute/virtualMachines/start/action",
          "Microsoft.Compute/virtualMachines/restart/action"
        ],
        "notActions": []
      }
    ],
    "createdOn": "2015-12-16T00:07:02.9236555Z",
    "updatedOn": "2015-12-16T00:07:02.9236555Z",
    "createdBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e",
    "updatedBy": "877f0ab8-9c5f-420b-bf88-a1c6c7e2643e"
  },
  "id": "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/providers/Microsoft.Authorization/roleDefinitions/0bd62a70-e1b8-4e0b-a7c2-75cab365c95b",
  "type": "Microsoft.Authorization/roleDefinitions",
  "name": "0bd62a70-e1b8-4e0b-a7c2-75cab365c95b"
}

```

## Next steps

- [Custom roles in Azure](custom-roles.md)
- [Manage access using RBAC and the REST API](role-assignments-rest.md)
- [Azure REST API Reference](/rest/api/azure/)