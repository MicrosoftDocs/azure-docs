---
title: Azure built-in roles for Web and Mobile - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Web and Mobile category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for Web and Mobile

This article lists the Azure built-in roles in the Web and Mobile category.


## Azure Maps Data Contributor

Grants access to read, write, and delete access to map related data from an Azure maps account.

[Learn more](/azure/azure-maps/azure-maps-authentication)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Maps](../permissions/web-and-mobile.md#microsoftmaps)/accounts/*/read |  |
> | [Microsoft.Maps](../permissions/web-and-mobile.md#microsoftmaps)/accounts/*/write |  |
> | [Microsoft.Maps](../permissions/web-and-mobile.md#microsoftmaps)/accounts/*/delete |  |
> | [Microsoft.Maps](../permissions/web-and-mobile.md#microsoftmaps)/accounts/*/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants access to read, write, and delete access to map related data from an Azure maps account.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8f5e0ce6-4f7b-4dcf-bddf-e6f48634a204",
  "name": "8f5e0ce6-4f7b-4dcf-bddf-e6f48634a204",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Maps/accounts/*/read",
        "Microsoft.Maps/accounts/*/write",
        "Microsoft.Maps/accounts/*/delete",
        "Microsoft.Maps/accounts/*/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Maps Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Maps Data Reader

Grants access to read map related data from an Azure maps account.

[Learn more](/azure/azure-maps/azure-maps-authentication)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Maps](../permissions/web-and-mobile.md#microsoftmaps)/accounts/*/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants access to read map related data from an Azure maps account.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/423170ca-a8f6-4b0f-8487-9e4eb8f49bfa",
  "name": "423170ca-a8f6-4b0f-8487-9e4eb8f49bfa",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Maps/accounts/*/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Maps Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Spring Cloud Config Server Contributor

Allow read, write and delete access to Azure Spring Cloud Config Server

[Learn more](/azure/spring-apps/basic-standard/how-to-access-data-plane-azure-ad-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AppPlatform](../permissions/compute.md#microsoftappplatform)/Spring/configService/read | Read the configuration content(for example, application.yaml) for a specific Azure Spring Apps service instance |
> | [Microsoft.AppPlatform](../permissions/compute.md#microsoftappplatform)/Spring/configService/write | Write config server content for a specific Azure Spring Apps service instance |
> | [Microsoft.AppPlatform](../permissions/compute.md#microsoftappplatform)/Spring/configService/delete | Delete config server content for a specific Azure Spring Apps service instance |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allow read, write and delete access to Azure Spring Cloud Config Server",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a06f5c24-21a7-4e1a-aa2b-f19eb6684f5b",
  "name": "a06f5c24-21a7-4e1a-aa2b-f19eb6684f5b",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AppPlatform/Spring/configService/read",
        "Microsoft.AppPlatform/Spring/configService/write",
        "Microsoft.AppPlatform/Spring/configService/delete"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Spring Cloud Config Server Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Spring Cloud Config Server Reader

Allow read access to Azure Spring Cloud Config Server

[Learn more](/azure/spring-apps/basic-standard/how-to-access-data-plane-azure-ad-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AppPlatform](../permissions/compute.md#microsoftappplatform)/Spring/configService/read | Read the configuration content(for example, application.yaml) for a specific Azure Spring Apps service instance |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allow read access to Azure Spring Cloud Config Server",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/d04c6db6-4947-4782-9e91-30a88feb7be7",
  "name": "d04c6db6-4947-4782-9e91-30a88feb7be7",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AppPlatform/Spring/configService/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Spring Cloud Config Server Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Spring Cloud Data Reader

Allow read access to Azure Spring Cloud Data

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AppPlatform](../permissions/compute.md#microsoftappplatform)/Spring/*/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allow read access to Azure Spring Cloud Data",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b5537268-8956-4941-a8f0-646150406f0c",
  "name": "b5537268-8956-4941-a8f0-646150406f0c",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AppPlatform/Spring/*/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Spring Cloud Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Spring Cloud Service Registry Contributor

Allow read, write and delete access to Azure Spring Cloud Service Registry

[Learn more](/azure/spring-apps/basic-standard/how-to-access-data-plane-azure-ad-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AppPlatform](../permissions/compute.md#microsoftappplatform)/Spring/eurekaService/read | Read the user app(s) registration information for a specific Azure Spring Apps service instance |
> | [Microsoft.AppPlatform](../permissions/compute.md#microsoftappplatform)/Spring/eurekaService/write | Write the user app(s) registration information for a specific Azure Spring Apps service instance |
> | [Microsoft.AppPlatform](../permissions/compute.md#microsoftappplatform)/Spring/eurekaService/delete | Delete the user app registration information for a specific Azure Spring Apps service instance |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allow read, write and delete access to Azure Spring Cloud Service Registry",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/f5880b48-c26d-48be-b172-7927bfa1c8f1",
  "name": "f5880b48-c26d-48be-b172-7927bfa1c8f1",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AppPlatform/Spring/eurekaService/read",
        "Microsoft.AppPlatform/Spring/eurekaService/write",
        "Microsoft.AppPlatform/Spring/eurekaService/delete"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Spring Cloud Service Registry Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Spring Cloud Service Registry Reader

Allow read access to Azure Spring Cloud Service Registry

[Learn more](/azure/spring-apps/basic-standard/how-to-access-data-plane-azure-ad-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.AppPlatform](../permissions/compute.md#microsoftappplatform)/Spring/eurekaService/read | Read the user app(s) registration information for a specific Azure Spring Apps service instance |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allow read access to Azure Spring Cloud Service Registry",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/cff1b556-2399-4e7e-856d-a8f754be7b65",
  "name": "cff1b556-2399-4e7e-856d-a8f754be7b65",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AppPlatform/Spring/eurekaService/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Spring Cloud Service Registry Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Media Services Account Administrator

Create, read, modify, and delete Media Services accounts; read-only access to other Media Services resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/*/read |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/assets/listStreamingLocators/action | List Streaming Locators for Asset |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/streamingLocators/listPaths/action | List Paths |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/write | Create or Update any Media Services Account |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/delete | Delete any Media Services Account |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/privateEndpointConnections/* |  |
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
  "description": "Create, read, modify, and delete Media Services accounts; read-only access to other Media Services resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/054126f8-9a2b-4f1c-a9ad-eca461f08466",
  "name": "054126f8-9a2b-4f1c-a9ad-eca461f08466",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Media/mediaservices/*/read",
        "Microsoft.Media/mediaservices/assets/listStreamingLocators/action",
        "Microsoft.Media/mediaservices/streamingLocators/listPaths/action",
        "Microsoft.Media/mediaservices/write",
        "Microsoft.Media/mediaservices/delete",
        "Microsoft.Media/mediaservices/privateEndpointConnectionsApproval/action",
        "Microsoft.Media/mediaservices/privateEndpointConnections/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Media Services Account Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Media Services Live Events Administrator

Create, read, modify, and delete Live Events, Assets, Asset Filters, and Streaming Locators; read-only access to other Media Services resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/*/read |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/assets/* |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/assets/assetfilters/* |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/streamingLocators/* |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/liveEvents/* |  |
> | **NotActions** |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/assets/getEncryptionKey/action | Get Asset Encryption Key |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/streamingLocators/listContentKeys/action | List Content Keys |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Create, read, modify, and delete Live Events, Assets, Asset Filters, and Streaming Locators; read-only access to other Media Services resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/532bc159-b25e-42c0-969e-a1d439f60d77",
  "name": "532bc159-b25e-42c0-969e-a1d439f60d77",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Media/mediaservices/*/read",
        "Microsoft.Media/mediaservices/assets/*",
        "Microsoft.Media/mediaservices/assets/assetfilters/*",
        "Microsoft.Media/mediaservices/streamingLocators/*",
        "Microsoft.Media/mediaservices/liveEvents/*"
      ],
      "notActions": [
        "Microsoft.Media/mediaservices/assets/getEncryptionKey/action",
        "Microsoft.Media/mediaservices/streamingLocators/listContentKeys/action"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Media Services Live Events Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Media Services Media Operator

Create, read, modify, and delete Assets, Asset Filters, Streaming Locators, and Jobs; read-only access to other Media Services resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/*/read |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/assets/* |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/assets/assetfilters/* |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/streamingLocators/* |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/transforms/jobs/* |  |
> | **NotActions** |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/assets/getEncryptionKey/action | Get Asset Encryption Key |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/streamingLocators/listContentKeys/action | List Content Keys |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Create, read, modify, and delete Assets, Asset Filters, Streaming Locators, and Jobs; read-only access to other Media Services resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e4395492-1534-4db2-bedf-88c14621589c",
  "name": "e4395492-1534-4db2-bedf-88c14621589c",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Media/mediaservices/*/read",
        "Microsoft.Media/mediaservices/assets/*",
        "Microsoft.Media/mediaservices/assets/assetfilters/*",
        "Microsoft.Media/mediaservices/streamingLocators/*",
        "Microsoft.Media/mediaservices/transforms/jobs/*"
      ],
      "notActions": [
        "Microsoft.Media/mediaservices/assets/getEncryptionKey/action",
        "Microsoft.Media/mediaservices/streamingLocators/listContentKeys/action"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Media Services Media Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Media Services Policy Administrator

Create, read, modify, and delete Account Filters, Streaming Policies, Content Key Policies, and Transforms; read-only access to other Media Services resources. Cannot create Jobs, Assets or Streaming resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/*/read |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/assets/listStreamingLocators/action | List Streaming Locators for Asset |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/streamingLocators/listPaths/action | List Paths |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/accountFilters/* |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/streamingPolicies/* |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/contentKeyPolicies/* |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/transforms/* |  |
> | **NotActions** |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/contentKeyPolicies/getPolicyPropertiesWithSecrets/action | Get Policy Properties With Secrets |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Create, read, modify, and delete Account Filters, Streaming Policies, Content Key Policies, and Transforms; read-only access to other Media Services resources. Cannot create Jobs, Assets or Streaming resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/c4bba371-dacd-4a26-b320-7250bca963ae",
  "name": "c4bba371-dacd-4a26-b320-7250bca963ae",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Media/mediaservices/*/read",
        "Microsoft.Media/mediaservices/assets/listStreamingLocators/action",
        "Microsoft.Media/mediaservices/streamingLocators/listPaths/action",
        "Microsoft.Media/mediaservices/accountFilters/*",
        "Microsoft.Media/mediaservices/streamingPolicies/*",
        "Microsoft.Media/mediaservices/contentKeyPolicies/*",
        "Microsoft.Media/mediaservices/transforms/*"
      ],
      "notActions": [
        "Microsoft.Media/mediaservices/contentKeyPolicies/getPolicyPropertiesWithSecrets/action"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Media Services Policy Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Media Services Streaming Endpoints Administrator

Create, read, modify, and delete Streaming Endpoints; read-only access to other Media Services resources.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metrics/read | Read metrics |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/metricDefinitions/read | Read metric definitions |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/*/read |  |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/assets/listStreamingLocators/action | List Streaming Locators for Asset |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/streamingLocators/listPaths/action | List Paths |
> | [Microsoft.Media](../permissions/web-and-mobile.md#microsoftmedia)/mediaservices/streamingEndpoints/* |  |
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
  "description": "Create, read, modify, and delete Streaming Endpoints; read-only access to other Media Services resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/99dba123-b5fe-44d5-874c-ced7199a5804",
  "name": "99dba123-b5fe-44d5-874c-ced7199a5804",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Media/mediaservices/*/read",
        "Microsoft.Media/mediaservices/assets/listStreamingLocators/action",
        "Microsoft.Media/mediaservices/streamingLocators/listPaths/action",
        "Microsoft.Media/mediaservices/streamingEndpoints/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Media Services Streaming Endpoints Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SignalR AccessKey Reader

Read SignalR Service Access Keys

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/*/read |  |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/listkeys/action | View the value of SignalR access keys in the management portal or through API |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
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
  "description": "Read SignalR Service Access Keys",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/04165923-9d83-45d5-8227-78b77b0a687e",
  "name": "04165923-9d83-45d5-8227-78b77b0a687e",
  "permissions": [
    {
      "actions": [
        "Microsoft.SignalRService/*/read",
        "Microsoft.SignalRService/SignalR/listkeys/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SignalR AccessKey Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SignalR App Server

Lets your app server access SignalR Service with AAD auth options.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/auth/accessKey/action | Generate an AccessKey for signing AccessTokens, the key will expire in 90 minutes by default |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/serverConnection/write | Start a server connection |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/clientConnection/write | Close client connection |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets your app server access SignalR Service with AAD auth options.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/420fcaa2-552c-430f-98ca-3264be4806c7",
  "name": "420fcaa2-552c-430f-98ca-3264be4806c7",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.SignalRService/SignalR/auth/accessKey/action",
        "Microsoft.SignalRService/SignalR/serverConnection/write",
        "Microsoft.SignalRService/SignalR/clientConnection/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "SignalR App Server",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SignalR REST API Owner

Full access to Azure SignalR Service REST APIs

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/auth/clientToken/action | Generate an AccessToken for client to connect to ASRS, the token will expire in 5 minutes by default |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/hub/* |  |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/group/* |  |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/clientConnection/* |  |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/user/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access to Azure SignalR Service REST APIs",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/fd53cd77-2268-407a-8f46-7e7863d0f521",
  "name": "fd53cd77-2268-407a-8f46-7e7863d0f521",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.SignalRService/SignalR/auth/clientToken/action",
        "Microsoft.SignalRService/SignalR/hub/*",
        "Microsoft.SignalRService/SignalR/group/*",
        "Microsoft.SignalRService/SignalR/clientConnection/*",
        "Microsoft.SignalRService/SignalR/user/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "SignalR REST API Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SignalR REST API Reader

Read-only access to Azure SignalR Service REST APIs

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/group/read | Check group existence or user existence in group |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/clientConnection/read | Check client connection existence |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/user/read | Check user existence |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read-only access to Azure SignalR Service REST APIs",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ddde6b66-c0df-4114-a159-3618637b3035",
  "name": "ddde6b66-c0df-4114-a159-3618637b3035",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.SignalRService/SignalR/group/read",
        "Microsoft.SignalRService/SignalR/clientConnection/read",
        "Microsoft.SignalRService/SignalR/user/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "SignalR REST API Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SignalR Service Owner

Full access to Azure SignalR Service REST APIs

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/SignalR/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access to Azure SignalR Service REST APIs",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7e4f1700-ea5a-4f59-8f37-079cfe29dce3",
  "name": "7e4f1700-ea5a-4f59-8f37-079cfe29dce3",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.SignalRService/SignalR/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "SignalR Service Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## SignalR/Web PubSub Contributor

Create, Read, Update, and Delete SignalR service resources

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.SignalRService](../permissions/web-and-mobile.md#microsoftsignalrservice)/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
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
  "description": "Create, Read, Update, and Delete SignalR service resources",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8cf5e20a-e4b2-4e9d-b3a1-5ceb692c2761",
  "name": "8cf5e20a-e4b2-4e9d-b3a1-5ceb692c2761",
  "permissions": [
    {
      "actions": [
        "Microsoft.SignalRService/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SignalR/Web PubSub Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Web Plan Contributor

Manage the web plans for websites. Does not allow you to assign roles in Azure RBAC.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/serverFarms/* | Create and manage server farms |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/hostingEnvironments/Join/Action | Joins an App Service Environment |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/autoscalesettings/* |  |
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
  "description": "Lets you manage the web plans for websites, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/2cc479cb-7b4d-49a8-b449-8c00fd0f0a4b",
  "name": "2cc479cb-7b4d-49a8-b449-8c00fd0f0a4b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/serverFarms/*",
        "Microsoft.Web/hostingEnvironments/Join/Action",
        "Microsoft.Insights/autoscalesettings/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Web Plan Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Website Contributor

Manage websites, but not web plans. Does not allow you to assign roles in Azure RBAC.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/components/* | Create and manage Insights components |
> | [Microsoft.ResourceHealth](../permissions/management-and-governance.md#microsoftresourcehealth)/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/certificates/* | Create and manage website certificates |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/listSitesAssignedToHostName/read | Get names of sites assigned to hostname. |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/serverFarms/join/action | Joins an App Service Plan |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/serverFarms/read | Get the properties on an App Service Plan |
> | [Microsoft.Web](../permissions/web-and-mobile.md#microsoftweb)/sites/* | Create and manage websites (site creation also requires write permissions to the associated App Service Plan) |
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
  "description": "Lets you manage websites (not web plans), but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/de139f84-1756-47ae-9be6-808fbbe84772",
  "name": "de139f84-1756-47ae-9be6-808fbbe84772",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/components/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/certificates/*",
        "Microsoft.Web/listSitesAssignedToHostName/read",
        "Microsoft.Web/serverFarms/join/action",
        "Microsoft.Web/serverFarms/read",
        "Microsoft.Web/sites/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Website Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)