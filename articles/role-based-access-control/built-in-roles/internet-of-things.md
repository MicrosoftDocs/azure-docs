---
title: Azure built-in roles for Internet of Things - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Internet of Things category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: reference
ms.workload: identity
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure built-in roles for Internet of Things

This article lists the Azure built-in roles in the Internet of Things category.


## Azure Digital Twins Data Owner

Full access role for Digital Twins data-plane

[Learn more](/azure/digital-twins/concepts-security)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/digitaltwins/* | Read, create, update, or delete any Digital Twin |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/digitaltwins/commands/* | Invoke any Command on a Digital Twin |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/digitaltwins/relationships/* | Read, create, update, or delete any Digital Twin Relationship |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/eventroutes/* | Read, delete, create, or update any Event Route |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/jobs/* |  |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/models/* | Read, create, update, or delete any Model |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/query/* | Query any Digital Twins Graph |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Full access role for Digital Twins data-plane",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/bcd981a7-7f74-457b-83e1-cceb9e632ffe",
  "name": "bcd981a7-7f74-457b-83e1-cceb9e632ffe",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.DigitalTwins/digitaltwins/*",
        "Microsoft.DigitalTwins/digitaltwins/commands/*",
        "Microsoft.DigitalTwins/digitaltwins/relationships/*",
        "Microsoft.DigitalTwins/eventroutes/*",
        "Microsoft.DigitalTwins/jobs/*",
        "Microsoft.DigitalTwins/models/*",
        "Microsoft.DigitalTwins/query/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Digital Twins Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Digital Twins Data Reader

Read-only role for Digital Twins data-plane properties

[Learn more](/azure/digital-twins/concepts-security)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/digitaltwins/read | Read any Digital Twin |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/digitaltwins/relationships/read | Read any Digital Twin Relationship |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/eventroutes/read | Read any Event Route |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/jobs/import/read | Read any Bulk Import Job |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/jobs/imports/read | Read any Bulk Import Job |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/jobs/deletions/read | Read any Bulk Delete Job |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/models/read | Read any Model |
> | [Microsoft.DigitalTwins](../permissions/internet-of-things.md#microsoftdigitaltwins)/query/action | Query any Digital Twins Graph |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read-only role for Digital Twins data-plane properties",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/d57506d4-4c8d-48b1-8587-93c323f6a5a3",
  "name": "d57506d4-4c8d-48b1-8587-93c323f6a5a3",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.DigitalTwins/digitaltwins/read",
        "Microsoft.DigitalTwins/digitaltwins/relationships/read",
        "Microsoft.DigitalTwins/eventroutes/read",
        "Microsoft.DigitalTwins/jobs/import/read",
        "Microsoft.DigitalTwins/jobs/imports/read",
        "Microsoft.DigitalTwins/jobs/deletions/read",
        "Microsoft.DigitalTwins/models/read",
        "Microsoft.DigitalTwins/query/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Digital Twins Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Device Update Administrator

Gives you full access to management and content operations

[Learn more](/azure/iot-hub-device-update/device-update-control-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/read | Performs a read operation related to updates |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/write | Performs a write operation related to updates |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/delete | Performs a delete operation related to updates |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/management/read | Performs a read operation related to management |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/management/write | Performs a write operation related to management |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/management/delete | Performs a delete operation related to management |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Gives you full access to management and content operations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/02ca0879-e8e4-47a5-a61e-5c618b76e64a",
  "name": "02ca0879-e8e4-47a5-a61e-5c618b76e64a",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Insights/alertRules/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.DeviceUpdate/accounts/instances/updates/read",
        "Microsoft.DeviceUpdate/accounts/instances/updates/write",
        "Microsoft.DeviceUpdate/accounts/instances/updates/delete",
        "Microsoft.DeviceUpdate/accounts/instances/management/read",
        "Microsoft.DeviceUpdate/accounts/instances/management/write",
        "Microsoft.DeviceUpdate/accounts/instances/management/delete"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Device Update Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Device Update Content Administrator

Gives you full access to content operations

[Learn more](/azure/iot-hub-device-update/device-update-control-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/read | Performs a read operation related to updates |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/write | Performs a write operation related to updates |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/delete | Performs a delete operation related to updates |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Gives you full access to content operations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/0378884a-3af5-44ab-8323-f5b22f9f3c98",
  "name": "0378884a-3af5-44ab-8323-f5b22f9f3c98",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Insights/alertRules/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.DeviceUpdate/accounts/instances/updates/read",
        "Microsoft.DeviceUpdate/accounts/instances/updates/write",
        "Microsoft.DeviceUpdate/accounts/instances/updates/delete"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Device Update Content Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Device Update Content Reader

Gives you read access to content operations, but does not allow making changes

[Learn more](/azure/iot-hub-device-update/device-update-control-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/read | Performs a read operation related to updates |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Gives you read access to content operations, but does not allow making changes",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/d1ee9a80-8b14-47f0-bdc2-f4a351625a7b",
  "name": "d1ee9a80-8b14-47f0-bdc2-f4a351625a7b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Insights/alertRules/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.DeviceUpdate/accounts/instances/updates/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Device Update Content Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Device Update Deployments Administrator

Gives you full access to management operations

[Learn more](/azure/iot-hub-device-update/device-update-control-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/management/read | Performs a read operation related to management |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/management/write | Performs a write operation related to management |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/management/delete | Performs a delete operation related to management |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/read | Performs a read operation related to updates |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Gives you full access to management operations",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e4237640-0e3d-4a46-8fda-70bc94856432",
  "name": "e4237640-0e3d-4a46-8fda-70bc94856432",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Insights/alertRules/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.DeviceUpdate/accounts/instances/management/read",
        "Microsoft.DeviceUpdate/accounts/instances/management/write",
        "Microsoft.DeviceUpdate/accounts/instances/management/delete",
        "Microsoft.DeviceUpdate/accounts/instances/updates/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Device Update Deployments Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Device Update Deployments Reader

Gives you read access to management operations, but does not allow making changes

[Learn more](/azure/iot-hub-device-update/device-update-control-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/management/read | Performs a read operation related to management |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/read | Performs a read operation related to updates |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Gives you read access to management operations, but does not allow making changes",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/49e2f5d2-7741-4835-8efa-19e1fe35e47f",
  "name": "49e2f5d2-7741-4835-8efa-19e1fe35e47f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Insights/alertRules/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.DeviceUpdate/accounts/instances/management/read",
        "Microsoft.DeviceUpdate/accounts/instances/updates/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Device Update Deployments Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Device Update Reader

Gives you read access to management and content operations, but does not allow making changes

[Learn more](/azure/iot-hub-device-update/device-update-control-access)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Support](../permissions/general.md#microsoftsupport)/* | Create and update a support ticket |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/updates/read | Performs a read operation related to updates |
> | [Microsoft.DeviceUpdate](../permissions/internet-of-things.md#microsoftdeviceupdate)/accounts/instances/management/read | Performs a read operation related to management |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Gives you read access to management and content operations, but does not allow making changes",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/e9dba6fb-3d52-4cf0-bce3-f06ce71b9e0f",
  "name": "e9dba6fb-3d52-4cf0-bce3-f06ce71b9e0f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Insights/alertRules/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.DeviceUpdate/accounts/instances/updates/read",
        "Microsoft.DeviceUpdate/accounts/instances/management/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Device Update Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## IoT Hub Data Contributor

Allows for full access to IoT Hub data plane operations.

[Learn more](/azure/iot-hub/iot-hub-dev-guide-azure-ad-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/IotHubs/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to IoT Hub data plane operations.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4fc6c259-987e-4a07-842e-c321cc9d413f",
  "name": "4fc6c259-987e-4a07-842e-c321cc9d413f",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Devices/IotHubs/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "IoT Hub Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## IoT Hub Data Reader

Allows for full read access to IoT Hub data-plane properties

[Learn more](/azure/iot-hub/iot-hub-dev-guide-azure-ad-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/IotHubs/*/read |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/IotHubs/fileUpload/notifications/action | Receive, complete, or abandon file upload notifications |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full read access to IoT Hub data-plane properties",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/b447c946-2db7-41ec-983d-d8bf3b1c77e3",
  "name": "b447c946-2db7-41ec-983d-d8bf3b1c77e3",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Devices/IotHubs/*/read",
        "Microsoft.Devices/IotHubs/fileUpload/notifications/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "IoT Hub Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## IoT Hub Registry Contributor

Allows for full access to IoT Hub device registry.

[Learn more](/azure/iot-hub/iot-hub-dev-guide-azure-ad-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/IotHubs/devices/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to IoT Hub device registry.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/4ea46cd5-c1b2-4a8e-910b-273211f9ce47",
  "name": "4ea46cd5-c1b2-4a8e-910b-273211f9ce47",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Devices/IotHubs/devices/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "IoT Hub Registry Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## IoT Hub Twin Contributor

Allows for read and write access to all IoT Hub device and module twins.

[Learn more](/azure/iot-hub/iot-hub-dev-guide-azure-ad-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/IotHubs/twins/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for read and write access to all IoT Hub device and module twins.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/494bdba2-168f-4f31-a0a1-191d2f7c028c",
  "name": "494bdba2-168f-4f31-a0a1-191d2f7c028c",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Devices/IotHubs/twins/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "IoT Hub Twin Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)