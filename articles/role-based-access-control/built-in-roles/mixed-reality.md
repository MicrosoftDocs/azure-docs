---
title: Azure built-in roles for Mixed reality - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Mixed reality category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for Mixed reality

This article lists the Azure built-in roles in the Mixed reality category.


## Remote Rendering Administrator

Provides user with conversion, manage session, rendering and diagnostics capabilities for Azure Remote Rendering

[Learn more](/azure/remote-rendering/how-tos/authentication)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/convert/action | Start asset conversion |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/convert/read | Get asset conversion properties |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/convert/delete | Stop asset conversion |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/managesessions/read | Get session properties |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/managesessions/action | Start sessions |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/managesessions/delete | Stop sessions |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/render/read | Connect to a session |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/diagnostic/read | Connect to the Remote Rendering inspector |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides user with conversion, manage session, rendering and diagnostics capabilities for Azure Remote Rendering",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/3df8b902-2a6f-47c7-8cc5-360e9b272a7e",
  "name": "3df8b902-2a6f-47c7-8cc5-360e9b272a7e",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.MixedReality/RemoteRenderingAccounts/convert/action",
        "Microsoft.MixedReality/RemoteRenderingAccounts/convert/read",
        "Microsoft.MixedReality/RemoteRenderingAccounts/convert/delete",
        "Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/read",
        "Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/action",
        "Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/delete",
        "Microsoft.MixedReality/RemoteRenderingAccounts/render/read",
        "Microsoft.MixedReality/RemoteRenderingAccounts/diagnostic/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Remote Rendering Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Remote Rendering Client

Provides user with manage session, rendering and diagnostics capabilities for Azure Remote Rendering.

[Learn more](/azure/remote-rendering/how-tos/authentication)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/managesessions/read | Get session properties |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/managesessions/action | Start sessions |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/managesessions/delete | Stop sessions |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/render/read | Connect to a session |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/RemoteRenderingAccounts/diagnostic/read | Connect to the Remote Rendering inspector |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Provides user with manage session, rendering and diagnostics capabilities for Azure Remote Rendering.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/d39065c4-c120-43c9-ab0a-63eed9795f0a",
  "name": "d39065c4-c120-43c9-ab0a-63eed9795f0a",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/read",
        "Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/action",
        "Microsoft.MixedReality/RemoteRenderingAccounts/managesessions/delete",
        "Microsoft.MixedReality/RemoteRenderingAccounts/render/read",
        "Microsoft.MixedReality/RemoteRenderingAccounts/diagnostic/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Remote Rendering Client",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Spatial Anchors Account Contributor

Lets you manage spatial anchors in your account, but not delete them

[Learn more](/azure/spatial-anchors/concepts/authentication)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/create/action | Create spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/discovery/read | Discover nearby spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/properties/read | Get properties of spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/query/read | Locate spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/submitdiag/read | Submit diagnostics data to help improve the quality of the Azure Spatial Anchors service |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/write | Update spatial anchors properties |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage spatial anchors in your account, but not delete them",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/8bbe83f1-e2a6-4df7-8cb4-4e04d4e5c827",
  "name": "8bbe83f1-e2a6-4df7-8cb4-4e04d4e5c827",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.MixedReality/SpatialAnchorsAccounts/create/action",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/query/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Spatial Anchors Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Spatial Anchors Account Owner

Lets you manage spatial anchors in your account, including deleting them

[Learn more](/azure/spatial-anchors/concepts/authentication)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/create/action | Create spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/delete | Delete spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/discovery/read | Discover nearby spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/properties/read | Get properties of spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/query/read | Locate spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/submitdiag/read | Submit diagnostics data to help improve the quality of the Azure Spatial Anchors service |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/write | Update spatial anchors properties |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage spatial anchors in your account, including deleting them",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/70bbe301-9835-447d-afdd-19eb3167307c",
  "name": "70bbe301-9835-447d-afdd-19eb3167307c",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.MixedReality/SpatialAnchorsAccounts/create/action",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/delete",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/query/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Spatial Anchors Account Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Spatial Anchors Account Reader

Lets you locate and read properties of spatial anchors in your account

[Learn more](/azure/spatial-anchors/concepts/authentication)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/discovery/read | Discover nearby spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/properties/read | Get properties of spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/query/read | Locate spatial anchors |
> | [Microsoft.MixedReality](../permissions/mixed-reality.md#microsoftmixedreality)/SpatialAnchorsAccounts/submitdiag/read | Submit diagnostics data to help improve the quality of the Azure Spatial Anchors service |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you locate and read properties of spatial anchors in your account",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5d51204f-eb77-4b1c-b86a-2ec626c49413",
  "name": "5d51204f-eb77-4b1c-b86a-2ec626c49413",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/query/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Spatial Anchors Account Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)