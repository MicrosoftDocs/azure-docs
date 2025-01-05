---
title: Azure built-in roles for Integration - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Integration category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 12/12/2024
ms.custom: generated
---

# Azure built-in roles for Integration

This article lists the Azure built-in roles in the Integration category.


## API Management Developer Portal Content Editor

Can customize the developer portal, edit its content, and publish it.

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/portalRevisions/read | Lists a collection of developer portal revision entities. or Gets developer portal revision specified by its identifier. |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/portalRevisions/write | Creates a new developer portal revision. or Updates the description of specified portal revision or makes it current. |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/contentTypes/read | Returns list of content types or Returns content type |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/contentTypes/delete | Removes content type. |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/contentTypes/write | Creates new content type |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/contentTypes/contentItems/read | Returns list of content items or Returns content item details |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/contentTypes/contentItems/write | Creates new content item or Updates specified content item |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/contentTypes/contentItems/delete | Removes specified content item. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can customize the developer portal, edit its content, and publish it.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c031e6a8-4391-4de0-8d69-4706a7ed3729",
  "name": "c031e6a8-4391-4de0-8d69-4706a7ed3729",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/portalRevisions/read",
        "Microsoft.ApiManagement/service/portalRevisions/write",
        "Microsoft.ApiManagement/service/contentTypes/read",
        "Microsoft.ApiManagement/service/contentTypes/delete",
        "Microsoft.ApiManagement/service/contentTypes/write",
        "Microsoft.ApiManagement/service/contentTypes/contentItems/read",
        "Microsoft.ApiManagement/service/contentTypes/contentItems/write",
        "Microsoft.ApiManagement/service/contentTypes/contentItems/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Developer Portal Content Editor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## API Management Service Contributor

Can manage service and the APIs

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/* | Create and manage API Management service |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage service and the APIs",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/312a565d-c81f-4fd8-895a-4e21e48d571c",
  "name": "312a565d-c81f-4fd8-895a-4e21e48d571c",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Service Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## API Management Service Operator Role

Can manage service but not the APIs

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/*/read | Read API Management Service instances |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/backup/action | Backup API Management Service to the specified container in a user provided storage account |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/delete | Delete API Management Service instance |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/managedeployments/action | Change SKU/units, add/remove regional deployments of API Management Service |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/read | Read metadata for an API Management Service instance |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/restore/action | Restore API Management Service from the specified container in a user provided storage account |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/updatecertificate/action | Upload TLS/SSL certificate for an API Management Service |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/updatehostname/action | Setup, update or remove custom domain names for an API Management Service |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/write | Create or Update API Management Service instance |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/users/keys/read | Get keys associated with user |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage service but not the APIs",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e022efe7-f5ba-4159-bbe4-b44f577e9b61",
  "name": "e022efe7-f5ba-4159-bbe4-b44f577e9b61",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/*/read",
        "Microsoft.ApiManagement/service/backup/action",
        "Microsoft.ApiManagement/service/delete",
        "Microsoft.ApiManagement/service/managedeployments/action",
        "Microsoft.ApiManagement/service/read",
        "Microsoft.ApiManagement/service/restore/action",
        "Microsoft.ApiManagement/service/updatecertificate/action",
        "Microsoft.ApiManagement/service/updatehostname/action",
        "Microsoft.ApiManagement/service/write",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.ApiManagement/service/users/keys/read"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Service Operator Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## API Management Service Reader Role

Read-only access to service and APIs

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/*/read | Read API Management Service instances |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/read | Read metadata for an API Management Service instance |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/users/keys/read | Get keys associated with user |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read-only access to service and APIs",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/71522526-b88f-4d52-b57f-d31fc3546d0d",
  "name": "71522526-b88f-4d52-b57f-d31fc3546d0d",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/*/read",
        "Microsoft.ApiManagement/service/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.ApiManagement/service/users/keys/read"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Service Reader Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## API Management Service Workspace API Developer

Has read access to tags and products and write access to allow: assigning APIs to products, assigning tags to products and APIs. This role should be assigned on the service scope.

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/tags/read | Lists a collection of tags defined within a service instance. or Gets the details of the tag specified by its identifier. |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/tags/apiLinks/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/tags/operationLinks/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/tags/productLinks/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/products/read | Lists a collection of products in the specified service instance. or Gets the details of the product specified by its identifier. |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/products/apiLinks/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/read | Read metadata for an API Management Service instance |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/authorizationServers/read | Lists a collection of authorization servers defined within a service instance. or Gets the details of the authorization server without secrets. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Has read access to tags and products and write access to allow: assigning APIs to products, assigning tags to products and APIs. This role should be assigned on the service scope.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/9565a273-41b9-4368-97d2-aeb0c976a9b3",
  "name": "9565a273-41b9-4368-97d2-aeb0c976a9b3",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/tags/read",
        "Microsoft.ApiManagement/service/tags/apiLinks/*",
        "Microsoft.ApiManagement/service/tags/operationLinks/*",
        "Microsoft.ApiManagement/service/tags/productLinks/*",
        "Microsoft.ApiManagement/service/products/read",
        "Microsoft.ApiManagement/service/products/apiLinks/*",
        "Microsoft.ApiManagement/service/read",
        "Microsoft.ApiManagement/service/authorizationServers/read",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Service Workspace API Developer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## API Management Service Workspace API Product Manager

Has the same access as API Management Service Workspace API Developer as well as read access to users and write access to allow assigning users to groups. This role should be assigned on the service scope.

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/users/read | Lists a collection of registered users in the specified service instance. or Gets the details of the user specified by its identifier. |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/tags/read | Lists a collection of tags defined within a service instance. or Gets the details of the tag specified by its identifier. |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/tags/apiLinks/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/tags/operationLinks/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/tags/productLinks/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/products/read | Lists a collection of products in the specified service instance. or Gets the details of the product specified by its identifier. |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/products/apiLinks/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/groups/read | Lists a collection of groups defined within a service instance. or Gets the details of the group specified by its identifier. |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/groups/users/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/read | Read metadata for an API Management Service instance |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/authorizationServers/read | Lists a collection of authorization servers defined within a service instance. or Gets the details of the authorization server without secrets. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Has the same access as API Management Service Workspace API Developer as well as read access to users and write access to allow assigning users to groups. This role should be assigned on the service scope.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/d59a3e9c-6d52-4a5a-aeed-6bf3cf0e31da",
  "name": "d59a3e9c-6d52-4a5a-aeed-6bf3cf0e31da",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/users/read",
        "Microsoft.ApiManagement/service/tags/read",
        "Microsoft.ApiManagement/service/tags/apiLinks/*",
        "Microsoft.ApiManagement/service/tags/operationLinks/*",
        "Microsoft.ApiManagement/service/tags/productLinks/*",
        "Microsoft.ApiManagement/service/products/read",
        "Microsoft.ApiManagement/service/products/apiLinks/*",
        "Microsoft.ApiManagement/service/groups/read",
        "Microsoft.ApiManagement/service/groups/users/*",
        "Microsoft.ApiManagement/service/read",
        "Microsoft.ApiManagement/service/authorizationServers/read",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Service Workspace API Product Manager",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## API Management Workspace API Developer

Has read access to entities in the workspace and read and write access to entities for editing APIs. This role should be assigned on the workspace scope.

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/*/read |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/apis/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/apiVersionSets/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/policies/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/schemas/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/products/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/policyFragments/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/namedValues/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/tags/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/backends/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/certificates/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/diagnostics/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/loggers/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Has read access to entities in the workspace and read and write access to entities for editing APIs. This role should be assigned on the workspace scope.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/56328988-075d-4c6a-8766-d93edd6725b6",
  "name": "56328988-075d-4c6a-8766-d93edd6725b6",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/workspaces/*/read",
        "Microsoft.ApiManagement/service/workspaces/apis/*",
        "Microsoft.ApiManagement/service/workspaces/apiVersionSets/*",
        "Microsoft.ApiManagement/service/workspaces/policies/*",
        "Microsoft.ApiManagement/service/workspaces/schemas/*",
        "Microsoft.ApiManagement/service/workspaces/products/*",
        "Microsoft.ApiManagement/service/workspaces/policyFragments/*",
        "Microsoft.ApiManagement/service/workspaces/namedValues/*",
        "Microsoft.ApiManagement/service/workspaces/tags/*",
        "Microsoft.ApiManagement/service/workspaces/backends/*",
        "Microsoft.ApiManagement/service/workspaces/certificates/*",
        "Microsoft.ApiManagement/service/workspaces/diagnostics/*",
        "Microsoft.ApiManagement/service/workspaces/loggers/*",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Workspace API Developer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## API Management Workspace API Product Manager

Has read access to entities in the workspace and read and write access to entities for publishing APIs. This role should be assigned on the workspace scope.

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/*/read |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/products/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/subscriptions/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/groups/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/tags/* |  |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/notifications/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Has read access to entities in the workspace and read and write access to entities for publishing APIs. This role should be assigned on the workspace scope.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/73c2c328-d004-4c5e-938c-35c6f5679a1f",
  "name": "73c2c328-d004-4c5e-938c-35c6f5679a1f",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/workspaces/*/read",
        "Microsoft.ApiManagement/service/workspaces/products/*",
        "Microsoft.ApiManagement/service/workspaces/subscriptions/*",
        "Microsoft.ApiManagement/service/workspaces/groups/*",
        "Microsoft.ApiManagement/service/workspaces/tags/*",
        "Microsoft.ApiManagement/service/workspaces/notifications/*",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Workspace API Product Manager",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## API Management Workspace Contributor

Can manage the workspace and view, but not modify its members. This role should be assigned on the workspace scope.

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage the workspace and view, but not modify its members. This role should be assigned on the workspace scope.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0c34c906-8d99-4cb7-8bb7-33f5b0a1a799",
  "name": "0c34c906-8d99-4cb7-8bb7-33f5b0a1a799",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/workspaces/*",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Workspace Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## API Management Workspace Reader

Has read-only access to entities in the workspace. This role should be assigned on the workspace scope.

[Learn more](/azure/api-management/api-management-role-based-access-control)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiManagement](../permissions/integration.md#microsoftapimanagement)/service/workspaces/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Has read-only access to entities in the workspace. This role should be assigned on the workspace scope.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ef1c2c96-4a77-49e8-b9a4-6179fe1d2fd2",
  "name": "ef1c2c96-4a77-49e8-b9a4-6179fe1d2fd2",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/workspaces/*/read",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Workspace Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## App Configuration Contributor

Grants permission for all management operations, except purge, for App Configuration resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.AppConfiguration](../permissions/integration.md#microsoftappconfiguration)/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | [Microsoft.AppConfiguration](../permissions/integration.md#microsoftappconfiguration)/locations/deletedConfigurationStores/purge/action | Purge the specified deleted configuration store. |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants permission for all management operations, except purge, for App Configuration resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/fe86443c-f201-4fc4-9d2a-ac61149fbda0",
  "name": "fe86443c-f201-4fc4-9d2a-ac61149fbda0",
  "permissions": [
    {
      "actions": [
        "Microsoft.AppConfiguration/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [
        "Microsoft.AppConfiguration/locations/deletedConfigurationStores/purge/action"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "App Configuration Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## App Configuration Data Owner

Allows full access to App Configuration data.

[Learn more](/azure/azure-app-configuration/concept-enable-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AppConfiguration](../permissions/integration.md#microsoftappconfiguration)/configurationStores/*/read |  |
> | [Microsoft.AppConfiguration](../permissions/integration.md#microsoftappconfiguration)/configurationStores/*/write |  |
> | [Microsoft.AppConfiguration](../permissions/integration.md#microsoftappconfiguration)/configurationStores/*/delete |  |
> | [Microsoft.AppConfiguration](../permissions/integration.md#microsoftappconfiguration)/configurationStores/*/action |  |
> | **NotDataActions** |  |
> | [Microsoft.AppConfiguration](../permissions/integration.md#microsoftappconfiguration)/configurationStores/useSasAuth/action | Use SAS authentication for the configuration store. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows full access to App Configuration data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5ae67dd6-50cb-40e7-96ff-dc2bfa4b606b",
  "name": "5ae67dd6-50cb-40e7-96ff-dc2bfa4b606b",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AppConfiguration/configurationStores/*/read",
        "Microsoft.AppConfiguration/configurationStores/*/write",
        "Microsoft.AppConfiguration/configurationStores/*/delete",
        "Microsoft.AppConfiguration/configurationStores/*/action"
      ],
      "notDataActions": [
        "Microsoft.AppConfiguration/configurationStores/useSasAuth/action"
      ]
    }
  ],
  "roleName": "App Configuration Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## App Configuration Data Reader

Allows read access to App Configuration data.

[Learn more](/azure/azure-app-configuration/concept-enable-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AppConfiguration](../permissions/integration.md#microsoftappconfiguration)/configurationStores/*/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows read access to App Configuration data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/516239f1-63e1-4d78-a4de-a74fb236a071",
  "name": "516239f1-63e1-4d78-a4de-a74fb236a071",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AppConfiguration/configurationStores/*/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "App Configuration Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## App Configuration Reader

Grants permission for read operations for App Configuration resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.AppConfiguration](../permissions/integration.md#microsoftappconfiguration)/*/read |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/read | Read a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/read | Gets or lists deployments. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants permission for read operations for App Configuration resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/175b81b9-6e0d-490a-85e4-0d422273c10c",
  "name": "175b81b9-6e0d-490a-85e4-0d422273c10c",
  "permissions": [
    {
      "actions": [
        "Microsoft.AppConfiguration/*/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "App Configuration Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure API Center Compliance Manager

Allows managing API compliance in Azure API Center service.

[Learn more](/azure/api-center/enable-api-analysis-linting)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiCenter](../permissions/integration.md#microsoftapicenter)/services/*/read |  |
> | [Microsoft.ApiCenter](../permissions/integration.md#microsoftapicenter)/services/workspaces/apis/versions/definitions/updateAnalysisState/action | Updates analysis results for specified API definition. |
> | [Microsoft.ApiCenter](../permissions/integration.md#microsoftapicenter)/services/workspaces/apis/versions/definitions/exportSpecification/action | Exports API definition file. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows managing API compliance in Azure API Center service.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ede9aaa3-4627-494e-be13-4aa7c256148d",
  "name": "ede9aaa3-4627-494e-be13-4aa7c256148d",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiCenter/services/*/read",
        "Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/updateAnalysisState/action",
        "Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/exportSpecification/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure API Center Compliance Manager",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure API Center Data Reader

Allows for access to Azure API Center data plane read operations.

[Learn more](/azure/api-center/enable-api-center-portal)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ApiCenter](../permissions/integration.md#microsoftapicenter)/services/*/read |  |
> | [Microsoft.ApiCenter](../permissions/integration.md#microsoftapicenter)/services/workspaces/apis/versions/definitions/exportSpecification/action | Exports API definition file. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for access to Azure API Center data plane read operations.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c7244dfb-f447-457d-b2ba-3999044d1706",
  "name": "c7244dfb-f447-457d-b2ba-3999044d1706",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.ApiCenter/services/*/read",
        "Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/exportSpecification/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure API Center Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure API Center Service Contributor

Allows managing Azure API Center service.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiCenter](../permissions/integration.md#microsoftapicenter)/services/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | [Microsoft.ApiCenter](../permissions/integration.md#microsoftapicenter)/services/workspaces/apis/versions/definitions/updateAnalysisState/action | Updates analysis results for specified API definition. |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows managing Azure API Center service.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/dd24193f-ef65-44e5-8a7e-6fa6e03f7713",
  "name": "dd24193f-ef65-44e5-8a7e-6fa6e03f7713",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiCenter/services/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [
        "Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/updateAnalysisState/action"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure API Center Service Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure API Center Service Reader

Allows read-only access to Azure API Center service.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ApiCenter](../permissions/integration.md#microsoftapicenter)/services/*/read |  |
> | [Microsoft.ApiCenter](../permissions/integration.md#microsoftapicenter)/services/workspaces/apis/versions/definitions/exportSpecification/action | Exports API definition file. |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows read-only access to Azure API Center service.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/6cba8790-29c5-48e5-bab1-c7541b01cb04",
  "name": "6cba8790-29c5-48e5-bab1-c7541b01cb04",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiCenter/services/*/read",
        "Microsoft.ApiCenter/services/workspaces/apis/versions/definitions/exportSpecification/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure API Center Service Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Relay Listener

Allows for listen access to Azure Relay resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Relay](../permissions/integration.md#microsoftrelay)/*/wcfRelays/read |  |
> | [Microsoft.Relay](../permissions/integration.md#microsoftrelay)/*/hybridConnections/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Relay](../permissions/integration.md#microsoftrelay)/*/listen/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for listen access to Azure Relay resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/26e0b698-aa6d-4085-9386-aadae190014d",
  "name": "26e0b698-aa6d-4085-9386-aadae190014d",
  "permissions": [
    {
      "actions": [
        "Microsoft.Relay/*/wcfRelays/read",
        "Microsoft.Relay/*/hybridConnections/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Relay/*/listen/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Relay Listener",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Relay Owner

Allows for full access to Azure Relay resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Relay](../permissions/integration.md#microsoftrelay)/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Relay](../permissions/integration.md#microsoftrelay)/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to Azure Relay resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/2787bf04-f1f5-4bfe-8383-c8a24483ee38",
  "name": "2787bf04-f1f5-4bfe-8383-c8a24483ee38",
  "permissions": [
    {
      "actions": [
        "Microsoft.Relay/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Relay/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Relay Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Relay Sender

Allows for send access to Azure Relay resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Relay](../permissions/integration.md#microsoftrelay)/*/wcfRelays/read |  |
> | [Microsoft.Relay](../permissions/integration.md#microsoftrelay)/*/hybridConnections/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Relay](../permissions/integration.md#microsoftrelay)/*/send/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for send access to Azure Relay resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/26baccc8-eea7-41f1-98f4-1762cc7f685d",
  "name": "26baccc8-eea7-41f1-98f4-1762cc7f685d",
  "permissions": [
    {
      "actions": [
        "Microsoft.Relay/*/wcfRelays/read",
        "Microsoft.Relay/*/hybridConnections/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Relay/*/send/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Relay Sender",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Resource Notifications System Topics Subscriber

Lets you create system topics and event subscriptions on all system topics exposed currently and in the future by Azure Resource Notifications

[Learn more](/azure/event-grid/event-schema-resource-notifications)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ResourceNotifications](../permissions/integration.md#microsoftresourcenotifications)/systemTopics/subscribeToResources/action | Permission to perform creation and event subscription creation on a Resources system topic |
> | [Microsoft.ResourceNotifications](../permissions/integration.md#microsoftresourcenotifications)/systemTopics/subscribeToHealthResources/action | Permission to perform creation and event subscription creation on a HealthResources system topic |
> | [Microsoft.ResourceNotifications](../permissions/integration.md#microsoftresourcenotifications)/systemTopics/subscribeToMaintenanceResources/action | Permission to perform creation and event subscription creation on a MaintenanceResources system topic |
> | [Microsoft.ResourceNotifications](../permissions/integration.md#microsoftresourcenotifications)/systemTopics/subscribeToComputeResources/action | Permission to perform creation and event subscription creation on a ComputeResources system topic |
> | [Microsoft.ResourceNotifications](../permissions/integration.md#microsoftresourcenotifications)/systemTopics/subscribeToComputeScheduleResources/action | Permission to perform creation and event subscription creation on a ComputeScheduleResources system topic |
> | [Microsoft.ResourceNotifications](../permissions/integration.md#microsoftresourcenotifications)/systemTopics/subscribeToContainerServiceEventResources/action | Permission to perform creation and event subscription creation on a ContainerServiceEventResources system topic |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/eventSubscriptions/write | Create or update an eventSubscription |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/systemTopics/eventSubscriptions/write | Create or update a SystemTopic eventSubscription |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you create system topics and event subscriptions on all system topics exposed currently and in the future by Azure Resource Notifications",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0b962ed2-6d56-471c-bd5f-3477d83a7ba4",
  "name": "0b962ed2-6d56-471c-bd5f-3477d83a7ba4",
  "permissions": [
    {
      "actions": [
        "Microsoft.ResourceNotifications/systemTopics/subscribeToResources/action",
        "Microsoft.ResourceNotifications/systemTopics/subscribeToHealthResources/action",
        "Microsoft.ResourceNotifications/systemTopics/subscribeToMaintenanceResources/action",
        "Microsoft.ResourceNotifications/systemTopics/subscribeToComputeResources/action",
        "Microsoft.ResourceNotifications/systemTopics/subscribeToComputeScheduleResources/action",
        "Microsoft.ResourceNotifications/systemTopics/subscribeToContainerServiceEventResources/action",
        "Microsoft.EventGrid/eventSubscriptions/write",
        "Microsoft.EventGrid/systemTopics/eventSubscriptions/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Resource Notifications System Topics Subscriber",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Service Bus Data Owner

Allows for full access to Azure Service Bus resources.

[Learn more](/azure/service-bus-messaging/authenticate-application)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to Azure Service Bus resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/090c5cfd-751d-490a-894a-3ce6f1109419",
  "name": "090c5cfd-751d-490a-894a-3ce6f1109419",
  "permissions": [
    {
      "actions": [
        "Microsoft.ServiceBus/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ServiceBus/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Service Bus Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Service Bus Data Receiver

Allows for receive access to Azure Service Bus resources.

[Learn more](/azure/service-bus-messaging/authenticate-application)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/*/queues/read |  |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/*/topics/read |  |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/*/topics/subscriptions/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/*/receive/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for receive access to Azure Service Bus resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0",
  "name": "4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0",
  "permissions": [
    {
      "actions": [
        "Microsoft.ServiceBus/*/queues/read",
        "Microsoft.ServiceBus/*/topics/read",
        "Microsoft.ServiceBus/*/topics/subscriptions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ServiceBus/*/receive/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Service Bus Data Receiver",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Service Bus Data Sender

Allows for send access to Azure Service Bus resources.

[Learn more](/azure/service-bus-messaging/authenticate-application)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/*/queues/read |  |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/*/topics/read |  |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/*/topics/subscriptions/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ServiceBus](../permissions/integration.md#microsoftservicebus)/*/send/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for send access to Azure Service Bus resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/69a216fc-b8fb-44d8-bc22-1f3c2cd27a39",
  "name": "69a216fc-b8fb-44d8-bc22-1f3c2cd27a39",
  "permissions": [
    {
      "actions": [
        "Microsoft.ServiceBus/*/queues/read",
        "Microsoft.ServiceBus/*/topics/read",
        "Microsoft.ServiceBus/*/topics/subscriptions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ServiceBus/*/send/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Service Bus Data Sender",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## BizTalk Contributor

Lets you manage BizTalk services, but not access to them.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | Microsoft.BizTalkServices/BizTalk/* | Create and manage BizTalk services |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage BizTalk services, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5e3c6656-6cfa-4708-81fe-0de47ac73342",
  "name": "5e3c6656-6cfa-4708-81fe-0de47ac73342",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.BizTalkServices/BizTalk/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "BizTalk Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Chamber Admin

Lets you manage everything under your Modeling and Simulation Workbench chamber.

[Learn more](/azure/modeling-simulation-workbench/how-to-guide-manage-users)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/*/read |  |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/fileRequests/manage/action | manage fileRequests |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/connector/setCopyPaste/action |  |
> | **DataActions** |  |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/upload/action |  |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/files/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage everything under your Modeling and Simulation Workbench chamber.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4e9b8407-af2e-495b-ae54-bb60a55b1b5a",
  "name": "4e9b8407-af2e-495b-ae54-bb60a55b1b5a",
  "permissions": [
    {
      "actions": [
        "Microsoft.ModSimWorkbench/*/read",
        "Microsoft.ModSimWorkbench/workbenches/chambers/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [
        "Microsoft.ModSimWorkbench/workbenches/chambers/fileRequests/manage/action",
        "Microsoft.ModSimWorkbench/workbenches/chambers/connector/setCopyPaste/action"
      ],
      "dataActions": [
        "Microsoft.ModSimWorkbench/workbenches/chambers/upload/action",
        "Microsoft.ModSimWorkbench/workbenches/chambers/files/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Chamber Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Chamber User

Lets you view everything under your Modeling and Simulation Workbench chamber, but not make any changes.

[Learn more](/azure/modeling-simulation-workbench/how-to-guide-manage-users)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/*/read |  |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/workloads/* |  |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/getUploadUri/action | getUploadUri chambers |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/fileRequests/getDownloadUri/action | getDownloadUri fileRequests |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.ModSimWorkbench](../permissions/integration.md#microsoftmodsimworkbench)/workbenches/chambers/upload/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you view everything under your Modeling and Simulation Workbench chamber, but not make any changes.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4447db05-44ed-4da3-ae60-6cbece780e32",
  "name": "4447db05-44ed-4da3-ae60-6cbece780e32",
  "permissions": [
    {
      "actions": [
        "Microsoft.ModSimWorkbench/workbenches/chambers/*/read",
        "Microsoft.ModSimWorkbench/workbenches/chambers/workloads/*",
        "Microsoft.ModSimWorkbench/workbenches/chambers/getUploadUri/action",
        "Microsoft.ModSimWorkbench/workbenches/chambers/fileRequests/getDownloadUri/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ModSimWorkbench/workbenches/chambers/upload/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Chamber User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DeID Batch Data Owner

Create and manage DeID batch jobs. This role is in preview and subject to change.

[Learn more](/azure/healthcare-apis/deidentification/manage-access-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthDataAIServices](../permissions/integration.md#microsofthealthdataaiservices)/DeidServices/Batch/write | Creates batches |
> | [Microsoft.HealthDataAIServices](../permissions/integration.md#microsofthealthdataaiservices)/DeidServices/Batch/delete | Deletes a batch |
> | [Microsoft.HealthDataAIServices](../permissions/integration.md#microsofthealthdataaiservices)/DeidServices/Batch/read | Reads a batch |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Create and manage DeID batch jobs. This role is in preview and subject to change.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8a90fa6b-6997-4a07-8a95-30633a7c97b9",
  "name": "8a90fa6b-6997-4a07-8a95-30633a7c97b9",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthDataAIServices/DeidServices/Batch/write",
        "Microsoft.HealthDataAIServices/DeidServices/Batch/delete",
        "Microsoft.HealthDataAIServices/DeidServices/Batch/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "DeID Batch Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DeID Batch Data Reader

Read DeID batch jobs. This role is in preview and subject to change.

[Learn more](/azure/healthcare-apis/deidentification/manage-access-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthDataAIServices](../permissions/integration.md#microsofthealthdataaiservices)/DeidServices/Batch/read | Reads a batch |
> | **NotDataActions** |  |
> | [Microsoft.HealthDataAIServices](../permissions/integration.md#microsofthealthdataaiservices)/DeidServices/Batch/write | Creates batches |
> | [Microsoft.HealthDataAIServices](../permissions/integration.md#microsofthealthdataaiservices)/DeidServices/Batch/delete | Deletes a batch |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read DeID batch jobs. This role is in preview and subject to change.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b73a14ee-91f5-41b7-bd81-920e12466be9",
  "name": "b73a14ee-91f5-41b7-bd81-920e12466be9",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthDataAIServices/DeidServices/Batch/read"
      ],
      "notDataActions": [
        "Microsoft.HealthDataAIServices/DeidServices/Batch/write",
        "Microsoft.HealthDataAIServices/DeidServices/Batch/delete"
      ]
    }
  ],
  "roleName": "DeID Batch Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DeID Data Owner

Full access to DeID data. This role is in preview and subject to change

[Learn more](/azure/healthcare-apis/deidentification/manage-access-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthDataAIServices](../permissions/integration.md#microsofthealthdataaiservices)/DeidServices/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access to DeID data. This role is in preview and subject to change",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/78e4b983-1a0b-472e-8b7d-8d770f7c5890",
  "name": "78e4b983-1a0b-472e-8b7d-8d770f7c5890",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthDataAIServices/DeidServices/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "DeID Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DeID Realtime Data User

Execute requests against DeID realtime endpoint. This role is in preview and subject to change.

[Learn more](/azure/healthcare-apis/deidentification/manage-access-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthDataAIServices](../permissions/integration.md#microsofthealthdataaiservices)/DeidServices/Realtime/action | Allows access to the realtime endpoint |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Execute requests against DeID realtime endpoint. This role is in preview and subject to change.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/bb6577c4-ea0a-40b2-8962-ea18cb8ecd4e",
  "name": "bb6577c4-ea0a-40b2-8962-ea18cb8ecd4e",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthDataAIServices/DeidServices/Realtime/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "DeID Realtime Data User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DICOM Data Owner

Full access to DICOM data.

[Learn more](/azure/healthcare-apis/configure-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/dicomservices/resources/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access to DICOM data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/58a3b984-7adf-4c20-983a-32417c86fbc8",
  "name": "58a3b984-7adf-4c20-983a-32417c86fbc8",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthcareApis/workspaces/dicomservices/resources/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "DICOM Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DICOM Data Reader

Read and search DICOM data.

[Learn more](/azure/healthcare-apis/configure-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/dicomservices/resources/read | Read DICOM resources (includes searching and change feed).  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read and search DICOM data.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e89c7a3c-2f64-4fa1-a847-3e4c9ba4283a",
  "name": "e89c7a3c-2f64-4fa1-a847-3e4c9ba4283a",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthcareApis/workspaces/dicomservices/resources/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "DICOM Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## EventGrid Contributor

Lets you manage EventGrid operations.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/* | Create and manage Event Grid resources |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage EventGrid operations.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/1e241071-0855-49ea-94dc-649edcd759de",
  "name": "1e241071-0855-49ea-94dc-649edcd759de",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.EventGrid/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "EventGrid Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## EventGrid Data Sender

Allows send access to event grid events.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/topics/read | Read a topic |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/domains/read | Read a domain |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/partnerNamespaces/read | Read a partner namespace |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/namespaces/read | Read a namespace |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/events/send/action | Send events to topics |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows send access to event grid events.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/d5a91429-5739-47e2-a06b-3470a27159e7",
  "name": "d5a91429-5739-47e2-a06b-3470a27159e7",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.EventGrid/topics/read",
        "Microsoft.EventGrid/domains/read",
        "Microsoft.EventGrid/partnerNamespaces/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.EventGrid/namespaces/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.EventGrid/events/send/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "EventGrid Data Sender",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## EventGrid EventSubscription Contributor

Lets you manage EventGrid event subscription operations.

[Learn more](/azure/event-grid/security-authorization)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/eventSubscriptions/* | Create and manage regional event subscriptions |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/topicTypes/eventSubscriptions/read | List global event subscriptions by topic type |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/locations/eventSubscriptions/read | List regional event subscriptions |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/locations/topicTypes/eventSubscriptions/read | List regional event subscriptions by topictype |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage EventGrid event subscription operations.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/428e0ff0-5e57-4d9c-a221-2c70d0e0a443",
  "name": "428e0ff0-5e57-4d9c-a221-2c70d0e0a443",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.EventGrid/eventSubscriptions/*",
        "Microsoft.EventGrid/topicTypes/eventSubscriptions/read",
        "Microsoft.EventGrid/locations/eventSubscriptions/read",
        "Microsoft.EventGrid/locations/topicTypes/eventSubscriptions/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "EventGrid EventSubscription Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## EventGrid EventSubscription Reader

Lets you read EventGrid event subscriptions.

[Learn more](/azure/event-grid/security-authorization)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/eventSubscriptions/read | Read an eventSubscription |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/topicTypes/eventSubscriptions/read | List global event subscriptions by topic type |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/locations/eventSubscriptions/read | List regional event subscriptions |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/locations/topicTypes/eventSubscriptions/read | List regional event subscriptions by topictype |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read EventGrid event subscriptions.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/2414bbcf-6497-4faf-8c65-045460748405",
  "name": "2414bbcf-6497-4faf-8c65-045460748405",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.EventGrid/eventSubscriptions/read",
        "Microsoft.EventGrid/topicTypes/eventSubscriptions/read",
        "Microsoft.EventGrid/locations/eventSubscriptions/read",
        "Microsoft.EventGrid/locations/topicTypes/eventSubscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "EventGrid EventSubscription Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## EventGrid TopicSpaces Publisher

Lets you publish messages on topicspaces.

[Learn more](/azure/event-grid/mqtt-client-microsoft-entra-token-and-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/*/read |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/topicSpaces/publish/action | Publish to a topic space |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you publish messages on topicspaces.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a12b0b94-b317-4dcd-84a8-502ce99884c6",
  "name": "a12b0b94-b317-4dcd-84a8-502ce99884c6",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.EventGrid/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.EventGrid/topicSpaces/publish/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "EventGrid TopicSpaces Publisher",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## EventGrid TopicSpaces Subscriber

Lets you subscribe messages on topicspaces.

[Learn more](/azure/event-grid/mqtt-client-microsoft-entra-token-and-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/*/read |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.EventGrid](../permissions/integration.md#microsofteventgrid)/topicSpaces/subscribe/action | Subscribe to a topic space |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you subscribe messages on topicspaces.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4b0f2fd7-60b4-4eca-896f-4435034f8bf5",
  "name": "4b0f2fd7-60b4-4eca-896f-4435034f8bf5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.EventGrid/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.EventGrid/topicSpaces/subscribe/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "EventGrid TopicSpaces Subscriber",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## FHIR Data Contributor

Role allows user or principal full access to FHIR Data

[Learn more](/azure/healthcare-apis/configure-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/* |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/* |  |
> | **NotDataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/smart/action | Allows user to access FHIR Service according to SMART on FHIR specification. |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/smart/action | Allows user to access FHIR Service according to SMART on FHIR specification. |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Role allows user or principal full access to FHIR Data",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5a1fc7df-4bf1-4951-a576-89034ee01acd",
  "name": "5a1fc7df-4bf1-4951-a576-89034ee01acd",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthcareApis/services/fhir/resources/*",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/*"
      ],
      "notDataActions": [
        "Microsoft.HealthcareApis/services/fhir/resources/smart/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/smart/action"
      ]
    }
  ],
  "roleName": "FHIR Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## FHIR Data Converter

Role allows user or principal to convert data from legacy format to FHIR

[Learn more](/azure/healthcare-apis/configure-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/convertData/action | Data convert operation ($convert-data) |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/convertData/action | Data convert operation ($convert-data) |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Role allows user or principal to convert data from legacy format to FHIR",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a1705bd2-3a8f-45a5-8683-466fcfd5cc24",
  "name": "a1705bd2-3a8f-45a5-8683-466fcfd5cc24",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthcareApis/services/fhir/resources/convertData/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/convertData/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "FHIR Data Converter",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## FHIR Data Exporter

Role allows user or principal to read and export FHIR Data

[Learn more](/azure/healthcare-apis/configure-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/export/action | Export operation ($export). |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/export/action | Export operation ($export). |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Role allows user or principal to read and export FHIR Data",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3db33094-8700-4567-8da5-1501d4e7e843",
  "name": "3db33094-8700-4567-8da5-1501d4e7e843",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthcareApis/services/fhir/resources/read",
        "Microsoft.HealthcareApis/services/fhir/resources/export/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/read",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/export/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "FHIR Data Exporter",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## FHIR Data Importer

Role allows user or principal to read and import FHIR Data

[Learn more](/azure/healthcare-apis/fhir/import-data)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/import/action | Import FHIR resources in batch. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Role allows user or principal to read and import FHIR Data",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4465e953-8ced-4406-a58e-0f6e3f3b530b",
  "name": "4465e953-8ced-4406-a58e-0f6e3f3b530b",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/read",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/import/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "FHIR Data Importer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## FHIR Data Reader

Role allows user or principal to read FHIR Data

[Learn more](/azure/healthcare-apis/configure-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Role allows user or principal to read FHIR Data",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4c8d0bbc-75d3-4935-991f-5f3c56d81508",
  "name": "4c8d0bbc-75d3-4935-991f-5f3c56d81508",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthcareApis/services/fhir/resources/read",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "FHIR Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## FHIR Data Writer

Role allows user or principal to read and write FHIR Data

[Learn more](/azure/healthcare-apis/configure-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/write | Write FHIR resources (includes create and update). |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/delete | Delete FHIR resources (soft delete). |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/export/action | Export operation ($export). |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/resourceValidate/action | Validate operation ($validate). |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/reindex/action | Allows user to run Reindex job to index any search parameters that haven't yet been indexed. |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/convertData/action | Data convert operation ($convert-data) |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/editProfileDefinitions/action | Allows user to perform Create Update Delete operations on profile resources. |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/import/action | Import FHIR resources in batch. |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/write | Write FHIR resources (includes create and update). |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/delete | Delete FHIR resources (soft delete). |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/export/action | Export operation ($export). |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/resourceValidate/action | Validate operation ($validate). |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/reindex/action | Allows user to run Reindex job to index any search parameters that haven't yet been indexed. |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/convertData/action | Data convert operation ($convert-data) |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/editProfileDefinitions/action | Allows user to perform Create Update Delete operations on profile resources. |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/import/action | Import FHIR resources in batch. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Role allows user or principal to read and write FHIR Data",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3f88fce4-5892-4214-ae73-ba5294559913",
  "name": "3f88fce4-5892-4214-ae73-ba5294559913",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthcareApis/services/fhir/resources/read",
        "Microsoft.HealthcareApis/services/fhir/resources/write",
        "Microsoft.HealthcareApis/services/fhir/resources/delete",
        "Microsoft.HealthcareApis/services/fhir/resources/export/action",
        "Microsoft.HealthcareApis/services/fhir/resources/resourceValidate/action",
        "Microsoft.HealthcareApis/services/fhir/resources/reindex/action",
        "Microsoft.HealthcareApis/services/fhir/resources/convertData/action",
        "Microsoft.HealthcareApis/services/fhir/resources/editProfileDefinitions/action",
        "Microsoft.HealthcareApis/services/fhir/resources/import/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/read",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/write",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/delete",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/export/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/resourceValidate/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/reindex/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/convertData/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/editProfileDefinitions/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/import/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "FHIR Data Writer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## FHIR SMART User

Role allows user to access FHIR Service according to SMART on FHIR specification

[Learn more](/azure/healthcare-apis/configure-azure-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/read | Read FHIR resources (includes searching and versioned history).  |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/services/fhir/resources/smart/action | Allows user to access FHIR Service according to SMART on FHIR specification. |
> | [Microsoft.HealthcareApis](../permissions/integration.md#microsofthealthcareapis)/workspaces/fhirservices/resources/smart/action | Allows user to access FHIR Service according to SMART on FHIR specification. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Role allows user to access FHIR Service according to SMART on FHIR specification",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4ba50f17-9666-485c-a643-ff00808643f0",
  "name": "4ba50f17-9666-485c-a643-ff00808643f0",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.HealthcareApis/services/fhir/resources/read",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/read",
        "Microsoft.HealthcareApis/services/fhir/resources/smart/action",
        "Microsoft.HealthcareApis/workspaces/fhirservices/resources/smart/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "FHIR SMART User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Integration Service Environment Contributor

Lets you manage integration service environments, but not access to them.

[Learn more](/azure/logic-apps/add-artifacts-integration-service-environment-ise)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/integrationServiceEnvironments/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage integration service environments, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a41e2c5b-bd99-4a07-88f4-9bf657a760b8",
  "name": "a41e2c5b-bd99-4a07-88f4-9bf657a760b8",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Support/*",
        "Microsoft.Logic/integrationServiceEnvironments/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Integration Service Environment Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Integration Service Environment Developer

Allows developers to create and update workflows, integration accounts and API connections in integration service environments.

[Learn more](/azure/logic-apps/add-artifacts-integration-service-environment-ise)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/integrationServiceEnvironments/read | Reads the integration service environment. |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/integrationServiceEnvironments/*/join/action |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows developers to create and update workflows, integration accounts and API connections in integration service environments.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c7aa55d3-1abb-444a-a5ca-5e51e485d6ec",
  "name": "c7aa55d3-1abb-444a-a5ca-5e51e485d6ec",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Support/*",
        "Microsoft.Logic/integrationServiceEnvironments/read",
        "Microsoft.Logic/integrationServiceEnvironments/*/join/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Integration Service Environment Developer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Intelligent Systems Account Contributor

Lets you manage Intelligent Systems accounts, but not access to them.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | Microsoft.IntelligentSystems/accounts/* | Create and manage intelligent systems accounts |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Intelligent Systems accounts, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/03a6d094-3444-4b3d-88af-7477090a9e5e",
  "name": "03a6d094-3444-4b3d-88af-7477090a9e5e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.IntelligentSystems/accounts/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Intelligent Systems Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Logic App Contributor

Lets you manage logic apps, but not change access to them.

[Learn more](/azure/logic-apps/logic-apps-securing-a-logic-app)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.ClassicStorage](../permissions/storage.md#microsoftclassicstorage)/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
> | [Microsoft.ClassicStorage](../permissions/storage.md#microsoftclassicstorage)/storageAccounts/read | Return the storage account with the given account. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricAlerts/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/logdefinitions/* | This permission is necessary for users who need access to Activity Logs via the portal. List log categories in Activity Log. |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/* | Read metric definitions (list of available metric types for a resource). |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/* | Manages Logic Apps resources. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
> | [Microsoft.Storage](../permissions/storage.md#microsoftstorage)/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/connectionGateways/* | Create and manages a Connection Gateway. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/connections/* | Create and manages a Connection. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/customApis/* | Creates and manages a Custom API. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/serverFarms/join/action | Joins an App Service Plan |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/serverFarms/read | Get the properties on an App Service Plan |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/functions/listSecrets/action | List Function secrets. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage logic app, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/87a39d53-fc1b-424a-814c-f7e04687dc9e",
  "name": "87a39d53-fc1b-424a-814c-f7e04687dc9e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ClassicStorage/storageAccounts/listKeys/action",
        "Microsoft.ClassicStorage/storageAccounts/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metricAlerts/*",
        "Microsoft.Insights/diagnosticSettings/*",
        "Microsoft.Insights/logdefinitions/*",
        "Microsoft.Insights/metricDefinitions/*",
        "Microsoft.Logic/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/listkeys/action",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Support/*",
        "Microsoft.Web/connectionGateways/*",
        "Microsoft.Web/connections/*",
        "Microsoft.Web/customApis/*",
        "Microsoft.Web/serverFarms/join/action",
        "Microsoft.Web/serverFarms/read",
        "Microsoft.Web/sites/functions/listSecrets/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Logic App Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Logic App Operator

Lets you read, enable, and disable logic apps, but not edit or update them.

[Learn more](/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-logic-app-operations)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/*/read | Read Insights alert rules |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricAlerts/*/read |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/diagnosticSettings/*/read | Gets diagnostic settings for Logic Apps |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/*/read | Gets the available metrics for Logic Apps. |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/*/read | Reads Logic Apps resources. |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/workflows/disable/action | Disables the workflow. |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/workflows/enable/action | Enables the workflow. |
> | [Microsoft.Logic](../permissions/integration.md#microsoftlogic)/workflows/validate/action | Validates the workflow. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/connectionGateways/*/read | Read Connection Gateways. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/connections/*/read | Read Connections. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/customApis/*/read | Read Custom API. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/serverFarms/read | Get the properties on an App Service Plan |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read, enable and disable logic app.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/515c2055-d9d4-4321-b1b9-bd0c9a0f79fe",
  "name": "515c2055-d9d4-4321-b1b9-bd0c9a0f79fe",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*/read",
        "Microsoft.Insights/metricAlerts/*/read",
        "Microsoft.Insights/diagnosticSettings/*/read",
        "Microsoft.Insights/metricDefinitions/*/read",
        "Microsoft.Logic/*/read",
        "Microsoft.Logic/workflows/disable/action",
        "Microsoft.Logic/workflows/enable/action",
        "Microsoft.Logic/workflows/validate/action",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/connectionGateways/*/read",
        "Microsoft.Web/connections/*/read",
        "Microsoft.Web/customApis/*/read",
        "Microsoft.Web/serverFarms/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Logic App Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Logic Apps Standard Contributor (Preview)

You can manage all aspects of a Standard logic app and workflows. You can't change access or ownership.

[Learn more](/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-logic-app-operations)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/*/read |  |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/certificates/* | Create and manage a certificate. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/connectionGateways/* | Create and manages a Connection Gateway. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/connections/* | Create and manages a Connection. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/customApis/* | Creates and manages a Custom API. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/serverFarms/* | Create and manage an App Service Plan. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/* | Create and manage a web app. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "You can manage all aspects of a Standard logic app and workflows. You can't change access or ownership.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ad710c24-b039-4e85-a019-deb4a06e8570",
  "name": "ad710c24-b039-4e85-a019-deb4a06e8570",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/*/read",
        "Microsoft.Web/certificates/*",
        "Microsoft.Web/connectionGateways/*",
        "Microsoft.Web/connections/*",
        "Microsoft.Web/customApis/*",
        "Microsoft.Web/serverFarms/*",
        "Microsoft.Web/sites/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Logic Apps Standard Contributor (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Logic Apps Standard Developer (Preview)

You can create and edit workflows, connections, and settings for a Standard logic app. You can't make changes outside the workflow scope.

[Learn more](/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-logic-app-operations)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/*/read |  |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/connections/* | Create and manages a Connection. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/customApis/* | Creates and manages a Custom API. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/config/list/Action | List Web App's security sensitive settings, such as publishing credentials, app settings and connection strings |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/config/Write | Update Web App's configuration settings |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/config/web/appsettings/delete | Delete Web Apps App Setting |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/config/web/appsettings/write | Create or Update Web App Single App setting |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/deployWorkflowArtifacts/action | Create the artifacts in a Logic App. |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/hostruntime/* | Get or list hostruntime artifacts for the web app or function app. |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/listworkflowsconnections/action | List logic app's connections by its ID in a Logic App. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/publish/Action | Publish a Web App |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/config/appsettings/write | Create or Update Web App Slot's Single App setting |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/config/list/Action | List Web App Slot's security sensitive settings, such as publishing credentials, app settings and connection strings |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/config/web/appsettings/delete | Delete Web App Slot's App Setting |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/deployWorkflowArtifacts/action | Create the artifacts in a deployment slot in a Logic App. |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/listworkflowsconnections/action | List logic app's connections by its ID in a deployment slot in a Logic App. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/publish/Action | Publish a Web App Slot |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/workflows/* |  |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/workflowsconfiguration/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "You can create and edit workflows, connections, and settings for a Standard logic app. You can't make changes outside the workflow scope.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/523776ba-4eb2-4600-a3c8-f2dc93da4bdb",
  "name": "523776ba-4eb2-4600-a3c8-f2dc93da4bdb",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/*/read",
        "Microsoft.Web/connections/*",
        "Microsoft.Web/customApis/*",
        "Microsoft.Web/sites/config/list/Action",
        "microsoft.web/sites/config/Write",
        "microsoft.web/sites/config/web/appsettings/delete",
        "microsoft.web/sites/config/web/appsettings/write",
        "microsoft.web/sites/deployWorkflowArtifacts/action",
        "microsoft.web/sites/hostruntime/*",
        "microsoft.web/sites/listworkflowsconnections/action",
        "Microsoft.Web/sites/publish/Action",
        "microsoft.web/sites/slots/config/appsettings/write",
        "Microsoft.Web/sites/slots/config/list/Action",
        "microsoft.web/sites/slots/config/web/appsettings/delete",
        "microsoft.web/sites/slots/deployWorkflowArtifacts/action",
        "microsoft.web/sites/slots/listworkflowsconnections/action",
        "Microsoft.Web/sites/slots/publish/Action",
        "microsoft.web/sites/workflows/*",
        "microsoft.web/sites/workflowsconfiguration/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Logic Apps Standard Developer (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Logic Apps Standard Operator (Preview)

You can enable and disable the logic app, resubmit workflow runs, as well as create connections. You can't edit workflows or settings.

[Learn more](/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-logic-app-operations)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/*/read |  |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/applySlotConfig/Action | Apply web app slot configuration from target slot to the current web app |
> | [microsoft.web](../permissions/web-and-mobile.md#microsoftweb)/sites/hostruntime/* | Get or list hostruntime artifacts for the web app or function app. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/restart/Action | Restart a Web App |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/restart/Action | Restart a Web App Slot |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/slotsswap/Action | Swap Web App deployment slots |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/start/Action | Start a Web App Slot |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/slots/stop/Action | Stop a Web App Slot |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/slotsdiffs/Action | Get differences in configuration between web app and slots |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/slotsswap/Action | Swap Web App deployment slots |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/start/Action | Start a Web App |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/stop/Action | Stop a Web App |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/write | Create a new Web App or update an existing one |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "You can enable and disable the logic app, resubmit workflow runs, as well as create connections. You can't edit workflows or settings.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b70c96e9-66fe-4c09-b6e7-c98e69c98555",
  "name": "b70c96e9-66fe-4c09-b6e7-c98e69c98555",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/*/read",
        "Microsoft.Web/sites/applySlotConfig/Action",
        "microsoft.web/sites/hostruntime/*",
        "Microsoft.Web/sites/restart/Action",
        "Microsoft.Web/sites/slots/restart/Action",
        "Microsoft.Web/sites/slots/slotsswap/Action",
        "Microsoft.Web/sites/slots/start/Action",
        "Microsoft.Web/sites/slots/stop/Action",
        "Microsoft.Web/sites/slotsdiffs/Action",
        "Microsoft.Web/sites/slotsswap/Action",
        "Microsoft.Web/sites/start/Action",
        "Microsoft.Web/sites/stop/Action",
        "Microsoft.Web/sites/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Logic Apps Standard Operator (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Logic Apps Standard Reader (Preview)

You have read-only access to all resources in a Standard logic app and workflows, including the workflow runs and their history.

[Learn more](/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-logic-app-operations)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/operations/read | Gets or lists deployment operations. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/operationresults/read | Get the subscription operation results. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "You have read-only access to all resources in a Standard logic app and workflows, including the workflow runs and their history.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4accf36b-2c05-432f-91c8-5c532dff4c73",
  "name": "4accf36b-2c05-432f-91c8-5c532dff4c73",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Logic Apps Standard Reader (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Scheduler Job Collections Contributor

Lets you manage Scheduler job collections, but not access to them.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Scheduler/jobcollections/* | Create and manage job collections |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Scheduler job collections, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/188a0f2f-5c9e-469b-ae67-2aa5ce574b94",
  "name": "188a0f2f-5c9e-469b-ae67-2aa5ce574b94",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Scheduler/jobcollections/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Scheduler Job Collections Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Services Hub Operator

Services Hub Operator allows you to perform all read, write, and deletion operations related to Services Hub Connectors.

[Learn more](/services-hub/health/sh-connector-roles)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.ServicesHub](../permissions/integration.md#microsoftserviceshub)/connectors/write | Create or update a Services Hub Connector |
> | [Microsoft.ServicesHub](../permissions/integration.md#microsoftserviceshub)/connectors/read | View or List Services Hub Connectors |
> | [Microsoft.ServicesHub](../permissions/integration.md#microsoftserviceshub)/connectors/delete | Delete Services Hub Connectors |
> | [Microsoft.ServicesHub](../permissions/integration.md#microsoftserviceshub)/connectors/checkAssessmentEntitlement/action | Lists the Assessment Entitlements for a given Services Hub Workspace |
> | [Microsoft.ServicesHub](../permissions/integration.md#microsoftserviceshub)/supportOfferingEntitlement/read | View the Support Offering Entitlements for a given Services Hub Workspace |
> | [Microsoft.ServicesHub](../permissions/integration.md#microsoftserviceshub)/workspaces/read | List the Services Hub Workspaces for a given User |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Services Hub Operator allows you to perform all read, write, and deletion operations related to Services Hub Connectors.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/82200a5b-e217-47a5-b665-6d8765ee745b",
  "name": "82200a5b-e217-47a5-b665-6d8765ee745b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.ServicesHub/connectors/write",
        "Microsoft.ServicesHub/connectors/read",
        "Microsoft.ServicesHub/connectors/delete",
        "Microsoft.ServicesHub/connectors/checkAssessmentEntitlement/action",
        "Microsoft.ServicesHub/supportOfferingEntitlement/read",
        "Microsoft.ServicesHub/workspaces/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Services Hub Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)