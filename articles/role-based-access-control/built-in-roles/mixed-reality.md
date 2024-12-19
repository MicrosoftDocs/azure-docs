---
title: Azure built-in roles for Mixed reality - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Mixed reality category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 12/12/2024
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

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)