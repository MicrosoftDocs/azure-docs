---
title: Azure built-in roles for Networking - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Networking category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for Networking

This article lists the Azure built-in roles in the Networking category.


## Azure Front Door Domain Contributor

For internal use within Azure. Can manage Azure Front Door domains, but can't grant access to other users.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/profileresults/customdomainresults/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/customdomains/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/customdomains/write |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/customdomains/delete |  |
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
  "description": "For internal use within Azure. Can manage Azure Front Door domains, but can't grant access to other users.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0ab34830-df19-4f8c-b84e-aa85b8afa6e8",
  "name": "0ab34830-df19-4f8c-b84e-aa85b8afa6e8",
  "permissions": [
    {
      "actions": [
        "Microsoft.Cdn/operationresults/profileresults/customdomainresults/read",
        "Microsoft.Cdn/profiles/customdomains/read",
        "Microsoft.Cdn/profiles/customdomains/write",
        "Microsoft.Cdn/profiles/customdomains/delete",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Front Door Domain Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Front Door Domain Reader

For internal use within Azure. Can view Azure Front Door domains, but can't make changes.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/profileresults/customdomainresults/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/customdomains/read |  |
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
  "description": "For internal use within Azure. Can view Azure Front Door domains, but can't make changes.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0f99d363-226e-4dca-9920-b807cf8e1a5f",
  "name": "0f99d363-226e-4dca-9920-b807cf8e1a5f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Cdn/operationresults/profileresults/customdomainresults/read",
        "Microsoft.Cdn/profiles/customdomains/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Front Door Domain Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Front Door Profile Reader

Can view AFD standard and premium profiles and their endpoints, but can't make changes.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/edgenodes/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/* |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/*/read |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/profileresults/afdendpointresults/CheckCustomDomainDNSMappingStatus/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/queryloganalyticsmetrics/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/queryloganalyticsrankings/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/querywafloganalyticsmetrics/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/querywafloganalyticsrankings/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/afdendpoints/CheckCustomDomainDNSMappingStatus/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/Usages/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/afdendpoints/Usages/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/origingroups/Usages/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/rulesets/Usages/action |  |
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
  "description": "Can view AFD standard and premium profiles and their endpoints, but can't make changes.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/662802e2-50f6-46b0-aed2-e834bacc6d12",
  "name": "662802e2-50f6-46b0-aed2-e834bacc6d12",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cdn/edgenodes/read",
        "Microsoft.Cdn/operationresults/*",
        "Microsoft.Cdn/profiles/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Cdn/operationresults/profileresults/afdendpointresults/CheckCustomDomainDNSMappingStatus/action",
        "Microsoft.Cdn/profiles/queryloganalyticsmetrics/action",
        "Microsoft.Cdn/profiles/queryloganalyticsrankings/action",
        "Microsoft.Cdn/profiles/querywafloganalyticsmetrics/action",
        "Microsoft.Cdn/profiles/querywafloganalyticsrankings/action",
        "Microsoft.Cdn/profiles/afdendpoints/CheckCustomDomainDNSMappingStatus/action",
        "Microsoft.Cdn/profiles/Usages/action",
        "Microsoft.Cdn/profiles/afdendpoints/Usages/action",
        "Microsoft.Cdn/profiles/origingroups/Usages/action",
        "Microsoft.Cdn/profiles/rulesets/Usages/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Front Door Profile Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Front Door Secret Contributor

For internal use within Azure. Can manage Azure Front Door secrets, but can't grant access to other users.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/profileresults/secretresults/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/secrets/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/secrets/write |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/secrets/delete |  |
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
  "description": "For internal use within Azure. Can manage Azure Front Door secrets, but can't grant access to other users.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3f2eb865-5811-4578-b90a-6fc6fa0df8e5",
  "name": "3f2eb865-5811-4578-b90a-6fc6fa0df8e5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Cdn/operationresults/profileresults/secretresults/read",
        "Microsoft.Cdn/profiles/secrets/read",
        "Microsoft.Cdn/profiles/secrets/write",
        "Microsoft.Cdn/profiles/secrets/delete",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Front Door Secret Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Front Door Secret Reader

For internal use within Azure. Can view Azure Front Door secrets, but can't make changes.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/profileresults/secretresults/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/secrets/read |  |
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
  "description": "For internal use within Azure. Can view Azure Front Door secrets, but can't make changes.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0db238c4-885e-4c4f-a933-aa2cef684fca",
  "name": "0db238c4-885e-4c4f-a933-aa2cef684fca",
  "permissions": [
    {
      "actions": [
        "Microsoft.Cdn/operationresults/profileresults/secretresults/read",
        "Microsoft.Cdn/profiles/secrets/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Front Door Secret Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## CDN Endpoint Contributor

Can manage CDN endpoints, but can't grant access to other users.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/edgenodes/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/* |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/endpoints/* |  |
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
  "description": "Can manage CDN endpoints, but can't grant access to other users.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/426e0c7f-0c7e-4658-b36f-ff54d6c29b45",
  "name": "426e0c7f-0c7e-4658-b36f-ff54d6c29b45",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cdn/edgenodes/read",
        "Microsoft.Cdn/operationresults/*",
        "Microsoft.Cdn/profiles/endpoints/*",
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
  "roleName": "CDN Endpoint Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## CDN Endpoint Reader

Can view CDN endpoints, but can't make changes.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/edgenodes/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/* |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/endpoints/*/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/afdendpoints/validateCustomDomain/action |  |
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
  "description": "Can view CDN endpoints, but can't make changes.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/871e35f6-b5c1-49cc-a043-bde969a0f2cd",
  "name": "871e35f6-b5c1-49cc-a043-bde969a0f2cd",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cdn/edgenodes/read",
        "Microsoft.Cdn/operationresults/*",
        "Microsoft.Cdn/profiles/endpoints/*/read",
        "Microsoft.Cdn/profiles/afdendpoints/validateCustomDomain/action",
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
  "roleName": "CDN Endpoint Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## CDN Profile Contributor

Can manage CDN and Azure Front Door standard and premium profiles and their endpoints, but can't grant access to other users.

[Learn more](/azure/cdn/cdn-app-dev-net)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/edgenodes/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/* |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/* |  |
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
  "description": "Can manage CDN and Azure Front Door standard and premium profiles and their endpoints, but can't grant access to other users.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/ec156ff8-a8d1-4d15-830c-5b80698ca432",
  "name": "ec156ff8-a8d1-4d15-830c-5b80698ca432",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cdn/edgenodes/read",
        "Microsoft.Cdn/operationresults/*",
        "Microsoft.Cdn/profiles/*",
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
  "roleName": "CDN Profile Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## CDN Profile Reader

Can view CDN profiles and their endpoints, but can't make changes.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/edgenodes/read |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/operationresults/* |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/*/read |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/afdendpoints/validateCustomDomain/action |  |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/CheckResourceUsage/action |  |
> | [Microsoft.Cdn](../permissions/networking.md#microsoftcdn)/profiles/endpoints/CheckResourceUsage/action |  |
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
  "description": "Can view CDN profiles and their endpoints, but can't make changes.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8f96442b-4075-438f-813d-ad51ab4019af",
  "name": "8f96442b-4075-438f-813d-ad51ab4019af",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cdn/edgenodes/read",
        "Microsoft.Cdn/operationresults/*",
        "Microsoft.Cdn/profiles/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Cdn/profiles/afdendpoints/validateCustomDomain/action",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Cdn/profiles/CheckResourceUsage/action",
        "Microsoft.Cdn/profiles/endpoints/CheckResourceUsage/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "CDN Profile Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Classic Network Contributor

Lets you manage classic networks, but not access to them.

[Learn more](/azure/virtual-network/virtual-network-manage-peering)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.ClassicNetwork](../permissions/networking.md#microsoftclassicnetwork)/* | Create and manage classic networks |
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
  "description": "Lets you manage classic networks, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b34d265f-36f7-4a0d-a4d4-e158ca92e90f",
  "name": "b34d265f-36f7-4a0d-a4d4-e158ca92e90f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ClassicNetwork/*",
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
  "roleName": "Classic Network Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DNS Zone Contributor

Lets you manage DNS zones and record sets in Azure DNS, but does not let you control who has access to them.

[Learn more](/azure/dns/dns-protect-zones-recordsets)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/dnsZones/* | Create and manage DNS zones and records |
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
  "description": "Lets you manage DNS zones and record sets in Azure DNS, but does not let you control who has access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/befefa01-2a29-4197-83a8-272ff33ce314",
  "name": "befefa01-2a29-4197-83a8-272ff33ce314",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/dnsZones/*",
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
  "roleName": "DNS Zone Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Network Contributor

Lets you manage networks, but not access to them.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/* | Create and manage networks |
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
  "description": "Lets you manage networks, but not access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4d97b98b-1d4f-4787-a291-c67834d212e7",
  "name": "4d97b98b-1d4f-4787-a291-c67834d212e7",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/*",
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
  "roleName": "Network Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Private DNS Zone Contributor

Lets you manage private DNS zone resources, but not the virtual networks they are linked to.

[Learn more](/azure/dns/dns-protect-private-zones-recordsets)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsZones/* |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsOperationResults/* |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/privateDnsOperationStatuses/* |  |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/read | Get the virtual network definition |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/virtualNetworks/join/action | Joins a virtual network. Not Alertable. |
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
  "description": "Lets you manage private DNS zone resources, but not the virtual networks they are linked to.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b12aa53e-6015-4669-85d0-8515ebb3ae7f",
  "name": "b12aa53e-6015-4669-85d0-8515ebb3ae7f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Network/privateDnsZones/*",
        "Microsoft.Network/privateDnsOperationResults/*",
        "Microsoft.Network/privateDnsOperationStatuses/*",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/join/action",
        "Microsoft.Authorization/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Private DNS Zone Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Traffic Manager Contributor

Lets you manage Traffic Manager profiles, but does not let you control who has access to them.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Network](../permissions/networking.md#microsoftnetwork)/trafficManagerProfiles/* |  |
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
  "description": "Lets you manage Traffic Manager profiles, but does not let you control who has access to them.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a4b10055-b0c7-44c2-b00f-c7b5b3550cf7",
  "name": "a4b10055-b0c7-44c2-b00f-c7b5b3550cf7",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/trafficManagerProfiles/*",
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
  "roleName": "Traffic Manager Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)