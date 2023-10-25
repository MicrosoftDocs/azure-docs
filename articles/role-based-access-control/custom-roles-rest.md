---
title: Create or update Azure custom roles using the REST API - Azure RBAC
description: Learn how to list, create, update, or delete Azure custom roles using the REST API and Azure role-based access control (Azure RBAC).
services: active-directory
documentationcenter: na
author: rolyon
manager: amycolannino
editor: ''

ms.assetid: 1f90228a-7aac-4ea7-ad82-b57d222ab128
ms.service: role-based-access-control
ms.workload: multiple
ms.tgt_pltfrm: rest-api
ms.topic: how-to
ms.date: 04/05/2023
ms.author: rolyon
ms.reviewer: bagovind

---
# Create or update Azure custom roles using the REST API

If the [Azure built-in roles](built-in-roles.md) don't meet the specific needs of your organization, you can create your own custom roles. This article describes how to list, create, update, or delete custom roles using the REST API.

## Prerequisites

You must use the following version:

- `2015-07-01` or later

For more information, see [API versions of Azure RBAC REST APIs](/rest/api/authorization/versions).

## List all custom role definitions

To list all custom role definitions in a tenant, use the [Role Definitions - List](/rest/api/authorization/role-definitions/list) REST API.

- The following example lists all custom role definitions in a tenant:

    **Request**
    
    ```http
    GET https://management.azure.com/providers/Microsoft.Authorization/roleDefinitions?$filter=type+eq+'CustomRole'&api-version=2022-04-01
    ```
    
    **Response**
    
    ```json
    {
        "value": [
            {
                "properties": {
                    "roleName": "Billing Reader Plus",
                    "type": "CustomRole",
                    "description": "Read billing data and download invoices",
                    "assignableScopes": [
                        "/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15"
                    ],
                    "permissions": [
                        {
                            "actions": [
                                "Microsoft.Authorization/*/read",
                                "Microsoft.Billing/*/read",
                                "Microsoft.Commerce/*/read",
                                "Microsoft.Consumption/*/read",
                                "Microsoft.Management/managementGroups/read",
                                "Microsoft.CostManagement/*/read",
                                "Microsoft.Billing/invoices/download/action",
                                "Microsoft.CostManagement/exports/*"
                            ],
                            "notActions": [
                                "Microsoft.CostManagement/exports/delete"
                            ],
                            "dataActions": [],
                            "notDataActions": []
                        }
                    ],
                    "createdOn": "2021-05-22T21:57:23.5764138Z",
                    "updatedOn": "2021-05-22T21:57:23.5764138Z",
                    "createdBy": "68f66d4c-c0eb-4009-819b-e5315d677d70",
                    "updatedBy": "68f66d4c-c0eb-4009-819b-e5315d677d70"
                },
                "id": "/providers/Microsoft.Authorization/roleDefinitions/17adabda-4bf1-4f4e-8c97-1f0cab6dea1c",
                "type": "Microsoft.Authorization/roleDefinitions",
                "name": "17adabda-4bf1-4f4e-8c97-1f0cab6dea1c"
            }
        ]
    }
    ```

## List all custom role definitions at a scope

To list custom role definitions at a scope, use the [Role Definitions - List](/rest/api/authorization/role-definitions/list) REST API.

1. Start with the following request:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions?$filter={filter}&api-version=2022-04-01
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the roles.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId1}` | Subscription |
    > | `subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}` | Resource group |
    > | `subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}/providers/Microsoft.Web/sites/{site1}` | Resource |
    > | `providers/Microsoft.Management/managementGroups/{groupId1}` | Management group |

1. Replace *{filter}* with the role type.

    > [!div class="mx-tableFixed"]
    > | Filter | Description |
    > | --- | --- |
    > | `$filter=type+eq+'CustomRole'` | Filter based on the CustomRole type |

    The following example lists all custom role definitions in a subscription:
    
    **Request**
    
    ```http
    GET https://management.azure.com/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15/providers/Microsoft.Authorization/roleDefinitions?$filter=type+eq+'CustomRole'&api-version=2022-04-01
    ```
    
    **Response**
    
    ```json
    {
        "value": [
            {
                "properties": {
                    "roleName": "Billing Reader Plus",
                    "type": "CustomRole",
                    "description": "Read billing data and download invoices",
                    "assignableScopes": [
                        "/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15"
                    ],
                    "permissions": [
                        {
                            "actions": [
                                "Microsoft.Authorization/*/read",
                                "Microsoft.Billing/*/read",
                                "Microsoft.Commerce/*/read",
                                "Microsoft.Consumption/*/read",
                                "Microsoft.Management/managementGroups/read",
                                "Microsoft.CostManagement/*/read",
                                "Microsoft.Billing/invoices/download/action",
                                "Microsoft.CostManagement/exports/*"
                            ],
                            "notActions": [
                                "Microsoft.CostManagement/exports/delete"
                            ],
                            "dataActions": [],
                            "notDataActions": []
                        }
                    ],
                    "createdOn": "2021-05-22T21:57:23.5764138Z",
                    "updatedOn": "2021-05-22T21:57:23.5764138Z",
                    "createdBy": "68f66d4c-c0eb-4009-819b-e5315d677d70",
                    "updatedBy": "68f66d4c-c0eb-4009-819b-e5315d677d70"
                },
                "id": "/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15/providers/Microsoft.Authorization/roleDefinitions/17adabda-4bf1-4f4e-8c97-1f0cab6dea1c",
                "type": "Microsoft.Authorization/roleDefinitions",
                "name": "17adabda-4bf1-4f4e-8c97-1f0cab6dea1c"
            }
        ]
    }
    ```

## List a custom role definition by name

To get information about a custom role definition by its display name, use the [Role Definitions - Get](/rest/api/authorization/role-definitions/get) REST API.

1. Start with the following request:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions?$filter={filter}&api-version=2022-04-01
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the roles.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId1}` | Subscription |
    > | `subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}` | Resource group |
    > | `subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}/providers/Microsoft.Web/sites/{site1}` | Resource |
    > | `providers/Microsoft.Management/managementGroups/{groupId1}` | Management group |

1. Replace *{filter}* with the display name for the role.

    > [!div class="mx-tableFixed"]
    > | Filter | Description |
    > | --- | --- |
    > | `$filter=roleName+eq+'{roleDisplayName}'` | Use the URL encoded form of the exact display name of the role. For instance, `$filter=roleName+eq+'Virtual%20Machine%20Contributor'` |

    The following example lists a custom role definition named Billing Reader Plus in a subscription:
    
    **Request**
    
    ```http
    GET https://management.azure.com/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15/providers/Microsoft.Authorization/roleDefinitions?$filter=roleName+eq+'Billing Reader Plus'&api-version=2022-04-01
    ```
    
    **Response**
    
    ```json
    {
        "value": [
            {
                "properties": {
                    "roleName": "Billing Reader Plus",
                    "type": "CustomRole",
                    "description": "Read billing data and download invoices",
                    "assignableScopes": [
                        "/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15"
                    ],
                    "permissions": [
                        {
                            "actions": [
                                "Microsoft.Authorization/*/read",
                                "Microsoft.Billing/*/read",
                                "Microsoft.Commerce/*/read",
                                "Microsoft.Consumption/*/read",
                                "Microsoft.Management/managementGroups/read",
                                "Microsoft.CostManagement/*/read",
                                "Microsoft.Billing/invoices/download/action",
                                "Microsoft.CostManagement/exports/*"
                            ],
                            "notActions": [
                                "Microsoft.CostManagement/exports/delete"
                            ],
                            "dataActions": [],
                            "notDataActions": []
                        }
                    ],
                    "createdOn": "2021-05-22T21:57:23.5764138Z",
                    "updatedOn": "2021-05-22T21:57:23.5764138Z",
                    "createdBy": "68f66d4c-c0eb-4009-819b-e5315d677d70",
                    "updatedBy": "68f66d4c-c0eb-4009-819b-e5315d677d70"
                },
                "id": "/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15/providers/Microsoft.Authorization/roleDefinitions/17adabda-4bf1-4f4e-8c97-1f0cab6dea1c",
                "type": "Microsoft.Authorization/roleDefinitions",
                "name": "17adabda-4bf1-4f4e-8c97-1f0cab6dea1c"
            }
        ]
    }
    ```

## List a custom role definition by ID

To get information about a custom role definition by its unique identifier, use the [Role Definitions - Get](/rest/api/authorization/role-definitions/get) REST API.

1. Use the [Role Definitions - List](/rest/api/authorization/role-definitions/list) REST API to get the GUID identifier for the role.

1. Start with the following request:

    ```http
    GET https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{roleDefinitionId}?api-version=2022-04-01
    ```

1. Within the URI, replace *{scope}* with the scope for which you want to list the roles.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId1}` | Subscription |
    > | `subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}` | Resource group |
    > | `subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}/providers/Microsoft.Web/sites/{site1}` | Resource |
    > | `providers/Microsoft.Management/managementGroups/{groupId1}` | Management group |

1. Replace *{roleDefinitionId}* with the GUID identifier of the role definition.

    The following example lists a custom role definition with the identifier 17adabda-4bf1-4f4e-8c97-1f0cab6dea1c in a subscription:
   
    **Request**
    
    ```http
    GET https://management.azure.com/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15/providers/Microsoft.Authorization/roleDefinitions/17adabda-4bf1-4f4e-8c97-1f0cab6dea1c?api-version=2022-04-01
    ```
    
    **Response**
    
    ```json
    {
        "properties": {
            "roleName": "Billing Reader Plus",
            "type": "CustomRole",
            "description": "Read billing data and download invoices",
            "assignableScopes": [
                "/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15"
            ],
            "permissions": [
                {
                    "actions": [
                        "Microsoft.Authorization/*/read",
                        "Microsoft.Billing/*/read",
                        "Microsoft.Commerce/*/read",
                        "Microsoft.Consumption/*/read",
                        "Microsoft.Management/managementGroups/read",
                        "Microsoft.CostManagement/*/read",
                        "Microsoft.Billing/invoices/download/action",
                        "Microsoft.CostManagement/exports/*"
                    ],
                    "notActions": [
                        "Microsoft.CostManagement/exports/delete"
                    ],
                    "dataActions": [],
                    "notDataActions": []
                }
            ],
            "createdOn": "2021-05-22T21:57:23.5764138Z",
            "updatedOn": "2021-05-22T21:57:23.5764138Z",
            "createdBy": "68f66d4c-c0eb-4009-819b-e5315d677d70",
            "updatedBy": "68f66d4c-c0eb-4009-819b-e5315d677d70"
        },
        "id": "/subscriptions/473a4f86-11e3-48cb-9358-e13c220a2f15/providers/Microsoft.Authorization/roleDefinitions/17adabda-4bf1-4f4e-8c97-1f0cab6dea1c",
        "type": "Microsoft.Authorization/roleDefinitions",
        "name": "17adabda-4bf1-4f4e-8c97-1f0cab6dea1c"
    }
    ```

## Create a custom role

To create a custom role, use the [Role Definitions - Create Or Update](/rest/api/authorization/role-definitions/create-or-update) REST API. To call this API, you must be signed in with a user that is assigned a role that has the `Microsoft.Authorization/roleDefinitions/write` permission on all the `assignableScopes`. Of the built-in roles, only [Owner](built-in-roles.md#owner) and [User Access Administrator](built-in-roles.md#user-access-administrator) include this permission.

1. Review the list of [resource provider operations](resource-provider-operations.md) that are available to create the permissions for your custom role.

1. Use a GUID tool to generate a unique identifier that will be used for the custom role identifier. The identifier has the format: `00000000-0000-0000-0000-000000000000`

1. Start with the following request and body:

    ```http
    PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{roleDefinitionId}?api-version=2022-04-01
    ```

    ```json
    {
      "name": "{roleDefinitionId}",
      "properties": {
        "roleName": "",
        "description": "",
        "type": "CustomRole",
        "permissions": [
          {
            "actions": [
    
            ],
            "notActions": [
    
            ]
          }
        ],
        "assignableScopes": [
          "/subscriptions/{subscriptionId1}",
          "/subscriptions/{subscriptionId2}",
          "/subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}",
          "/subscriptions/{subscriptionId2}/resourceGroups/{resourceGroup2}",
          "/providers/Microsoft.Management/managementGroups/{groupId1}"
        ]
      }
    }
    ```

1. Within the URI, replace *{scope}* with the first `assignableScopes` of the custom role.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId1}` | Subscription |
    > | `subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}` | Resource group |
    > | `providers/Microsoft.Management/managementGroups/{groupId1}` | Management group |

1. Replace *{roleDefinitionId}* with the GUID identifier of the custom role.

1. Within the request body, replace *{roleDefinitionId}* with the GUID identifier.

1. If `assignableScopes` is a subscription or resource group, replace the *{subscriptionId}* or *{resourceGroup}* instances with your identifiers.

1. If `assignableScopes` is a management group, replace the *{groupId}* instance with your management group identifier.

1. In the `actions` property, add the actions that the role allows to be performed.

1. In the `notActions` property, add the actions that are excluded from the allowed `actions`.

1. In the `roleName` and `description` properties, specify a unique role name and a description. For more information about the properties, see [Azure custom roles](custom-roles.md).

    The following shows an example of a request body:

    ```json
    {
      "name": "88888888-8888-8888-8888-888888888888",
      "properties": {
        "roleName": "Virtual Machine Operator",
        "description": "Can monitor and restart virtual machines.",
        "type": "CustomRole",
        "permissions": [
          {
            "actions": [
              "Microsoft.Storage/*/read",
              "Microsoft.Network/*/read",
              "Microsoft.Compute/*/read",
              "Microsoft.Compute/virtualMachines/start/action",
              "Microsoft.Compute/virtualMachines/restart/action",
              "Microsoft.Authorization/*/read",
              "Microsoft.ResourceHealth/availabilityStatuses/read",
              "Microsoft.Resources/subscriptions/resourceGroups/read",
              "Microsoft.Insights/alertRules/*",
              "Microsoft.Support/*"
            ],
            "notActions": []
          }
        ],
        "assignableScopes": [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
          "/providers/Microsoft.Management/managementGroups/marketing-group"
        ]
      }
    }
    ```

## Update a custom role

To update a custom role, use the [Role Definitions - Create Or Update](/rest/api/authorization/role-definitions/create-or-update) REST API. To call this API, you must be signed in with a user that is assigned a role that has the `Microsoft.Authorization/roleDefinitions/write` permission on all the `assignableScopes`. Of the built-in roles, only [Owner](built-in-roles.md#owner) and [User Access Administrator](built-in-roles.md#user-access-administrator) include this permission.

1. Use the [Role Definitions - List](/rest/api/authorization/role-definitions/list) or [Role Definitions - Get](/rest/api/authorization/role-definitions/get) REST API to get information about the custom role. For more information, see the earlier [List all custom role definitions](#list-all-custom-role-definitions) section.

1. Start with the following request:

    ```http
    PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{roleDefinitionId}?api-version=2022-04-01
    ```

1. Within the URI, replace *{scope}* with the first `assignableScopes` of the custom role.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId1}` | Subscription |
    > | `subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}` | Resource group |
    > | `providers/Microsoft.Management/managementGroups/{groupId1}` | Management group |

1. Replace *{roleDefinitionId}* with the GUID identifier of the custom role.

1. Based on the information about the custom role, create a request body with the following format:

    ```json
    {
      "name": "{roleDefinitionId}",
      "properties": {
        "roleName": "",
        "description": "",
        "type": "CustomRole",
        "permissions": [
          {
            "actions": [
    
            ],
            "notActions": [
    
            ]
          }
        ],
        "assignableScopes": [
          "/subscriptions/{subscriptionId1}",
          "/subscriptions/{subscriptionId2}",
          "/subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}",
          "/subscriptions/{subscriptionId2}/resourceGroups/{resourceGroup2}",
          "/providers/Microsoft.Management/managementGroups/{groupId1}"
        ]
      }
    }
    ```

1. Update the request body with the changes you want to make to the custom role.

    The following shows an example of a request body with a new diagnostic settings action added:

    ```json
    {
      "name": "88888888-8888-8888-8888-888888888888",
      "properties": {
        "roleName": "Virtual Machine Operator",
        "description": "Can monitor and restart virtual machines.",
        "type": "CustomRole",
        "permissions": [
          {
            "actions": [
              "Microsoft.Storage/*/read",
              "Microsoft.Network/*/read",
              "Microsoft.Compute/*/read",
              "Microsoft.Compute/virtualMachines/start/action",
              "Microsoft.Compute/virtualMachines/restart/action",
              "Microsoft.Authorization/*/read",
              "Microsoft.ResourceHealth/availabilityStatuses/read",
              "Microsoft.Resources/subscriptions/resourceGroups/read",
              "Microsoft.Insights/alertRules/*",
              "Microsoft.Insights/diagnosticSettings/*",
              "Microsoft.Support/*"
            ],
            "notActions": []
          }
        ],
        "assignableScopes": [
          "/subscriptions/00000000-0000-0000-0000-000000000000",
          "/providers/Microsoft.Management/managementGroups/marketing-group"
        ]
      }
    }
    ```

## Delete a custom role

To delete a custom role, use the [Role Definitions - Delete](/rest/api/authorization/role-definitions/delete) REST API. To call this API, you must be signed in with a user that is assigned a role that has the `Microsoft.Authorization/roleDefinitions/delete` permission on all the `assignableScopes`. Of the built-in roles, only [Owner](built-in-roles.md#owner) and [User Access Administrator](built-in-roles.md#user-access-administrator) include this permission.

1. Remove any role assignments that use the custom role. For more information, see [Find role assignments to delete a custom role](custom-roles.md#find-role-assignments-to-delete-a-custom-role).

1. Use the [Role Definitions - List](/rest/api/authorization/role-definitions/list) or [Role Definitions - Get](/rest/api/authorization/role-definitions/get) REST API to get the GUID identifier of the custom role. For more information, see the earlier [List all custom role definitions](#list-all-custom-role-definitions) section.

1. Start with the following request:

    ```http
    DELETE https://management.azure.com/{scope}/providers/Microsoft.Authorization/roleDefinitions/{roleDefinitionId}?api-version=2022-04-01
    ```

1. Within the URI, replace *{scope}* with the scope that you want to delete the custom role.

    > [!div class="mx-tableFixed"]
    > | Scope | Type |
    > | --- | --- |
    > | `subscriptions/{subscriptionId1}` | Subscription |
    > | `subscriptions/{subscriptionId1}/resourceGroups/{resourceGroup1}` | Resource group |
    > | `providers/Microsoft.Management/managementGroups/{groupId1}` | Management group |

1. Replace *{roleDefinitionId}* with the GUID identifier of the custom role.

## Next steps

- [Azure custom roles](custom-roles.md)
- [Assign Azure roles using the REST API](role-assignments-rest.md)
- [Azure REST API Reference](/rest/api/azure/)
