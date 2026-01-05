---
title: Azure built-in roles for Internet of Things - Azure RBAC
description: This article lists the Azure built-in roles for Azure role-based access control (Azure RBAC) in the Internet of Things category. It lists Actions, NotActions, DataActions, and NotDataActions.
ms.service: role-based-access-control
ms.topic: generated-reference
ms.workload: identity
author: rolyon
manager: pmwongera
ms.author: rolyon
ms.date: 12/31/2025
ms.custom: generated
---

# Azure built-in roles for Internet of Things

This article lists the Azure built-in roles in the Internet of Things category.


## Azure Device Registry Contributor

Allows for full access to IoT devices within Azure Device Registry Namespace.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.deviceregistry/namespaces/read | Get a Namespace |
> | microsoft.deviceregistry/namespaces/devices/* |  |
> | microsoft.deviceregistry/namespaces/discovereddevices/* |  |
> | microsoft.deviceregistry/namespaces/credentials/read | Get a Credential |
> | microsoft.deviceregistry/namespaces/credentials/policies/read | List Policy resources by Credential |
> | [microsoft.devices](../permissions/internet-of-things.md#microsoftdevices)/iothubs/certificates/* |  |
> | [microsoft.devices](../permissions/internet-of-things.md#microsoftdevices)/iothubs/read | Gets the IotHub resource(s) |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | microsoft.deviceregistry/namespaces/credentials/policies/issueCertificate/action | Allows certificate issuance using certificate based policies. |
> | [microsoft.devices](../permissions/internet-of-things.md#microsoftdevices)/iothubs/devices/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to IoT devices within Azure Device Registry Namespace.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/a5c3590a-3a1a-4cd4-9648-ea0a32b15137",
  "name": "a5c3590a-3a1a-4cd4-9648-ea0a32b15137",
  "permissions": [
    {
      "actions": [
        "microsoft.deviceregistry/namespaces/read",
        "microsoft.deviceregistry/namespaces/devices/*",
        "microsoft.deviceregistry/namespaces/discovereddevices/*",
        "microsoft.deviceregistry/namespaces/credentials/read",
        "microsoft.deviceregistry/namespaces/credentials/policies/read",
        "microsoft.devices/iothubs/certificates/*",
        "microsoft.devices/iothubs/read"
      ],
      "notActions": [],
      "dataActions": [
        "microsoft.deviceregistry/namespaces/credentials/policies/issueCertificate/action",
        "microsoft.devices/iothubs/devices/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Device Registry Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Device Registry Credentials Contributor

Allows for full access to manage credentials and policies within Azure Device Registry Namespace.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | microsoft.deviceregistry/namespaces/credentials/* |  |
> | microsoft.deviceregistry/namespaces/credentials/policies/* |  |
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
  "description": "Allows for full access to manage credentials and policies within Azure Device Registry Namespace.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/09267e11-2e06-40b5-8fe4-68cea20794c9",
  "name": "09267e11-2e06-40b5-8fe4-68cea20794c9",
  "permissions": [
    {
      "actions": [
        "microsoft.deviceregistry/namespaces/credentials/*",
        "microsoft.deviceregistry/namespaces/credentials/policies/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Device Registry Credentials Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure Device Registry Onboarding

Allows for full access to Azure Device Registry Namespace and X.509 certificate provisioning.

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | Microsoft.DeviceRegistry/namespaces/read | Get a Namespace |
> | Microsoft.DeviceRegistry/namespaces/write | Update a Namespace |
> | Microsoft.DeviceRegistry/namespaces/delete | Delete a Namespace |
> | Microsoft.DeviceRegistry/namespaces/credentials/* |  |
> | Microsoft.DeviceRegistry/namespaces/credentials/policies/* |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/iothubs/* |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/provisioningServices/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/provisioningServices/enrollments/* |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/provisioningServices/enrollmentGroups/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to Azure Device Registry Namespace and X.509 certificate provisioning.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/547f7f0a-69c0-4807-bd9e-0321dfb66a84",
  "name": "547f7f0a-69c0-4807-bd9e-0321dfb66a84",
  "permissions": [
    {
      "actions": [
        "Microsoft.DeviceRegistry/namespaces/read",
        "Microsoft.DeviceRegistry/namespaces/write",
        "Microsoft.DeviceRegistry/namespaces/delete",
        "Microsoft.DeviceRegistry/namespaces/credentials/*",
        "Microsoft.DeviceRegistry/namespaces/credentials/policies/*",
        "Microsoft.Devices/iothubs/*",
        "Microsoft.Devices/provisioningServices/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Devices/provisioningServices/enrollments/*",
        "Microsoft.Devices/provisioningServices/enrollmentGroups/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Device Registry Onboarding",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

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

## Azure IoT Operations Administrator

View, create, edit and delete AIO resources. Manage all resources, including instance and its downstream resources.

[Learn more](/azure/iot-operations/secure-iot-ops/built-in-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | Microsoft.IoTOperations/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | Microsoft.DeviceRegistry/Assets/* |  |
> | Microsoft.DeviceRegistry/AssetEndpointProfiles/* |  |
> | Microsoft.DeviceRegistry/Namespaces/Assets/* |  |
> | Microsoft.DeviceRegistry/Namespaces/Devices/* |  |
> | Microsoft.DeviceRegistry/Namespaces/DiscoveredAssets/* |  |
> | Microsoft.DeviceRegistry/Namespaces/DiscoveredDevices/* |  |
> | Microsoft.DeviceRegistry/SchemaRegistries/* |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Edge/sites/read | Get a Site |
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
  "description": "View, create, edit and delete AIO resources. Manage all resources, including instance and its downstream resources.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/5bc02df6-6cd5-43fe-ad3d-4c93cf56cc16",
  "name": "5bc02df6-6cd5-43fe-ad3d-4c93cf56cc16",
  "permissions": [
    {
      "actions": [
        "Microsoft.IoTOperations/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.DeviceRegistry/Assets/*",
        "Microsoft.DeviceRegistry/AssetEndpointProfiles/*",
        "Microsoft.DeviceRegistry/Namespaces/Assets/*",
        "Microsoft.DeviceRegistry/Namespaces/Devices/*",
        "Microsoft.DeviceRegistry/Namespaces/DiscoveredAssets/*",
        "Microsoft.DeviceRegistry/Namespaces/DiscoveredDevices/*",
        "Microsoft.DeviceRegistry/SchemaRegistries/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Edge/sites/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure IoT Operations Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Azure IoT Operations Onboarding

User can Azure arc connect and deploy Azure IoT Operations securely.

[Learn more](/azure/iot-operations/secure-iot-ops/built-in-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | Microsoft.IoTOperations/* |  |
> | Microsoft.DeviceRegistry/register/action | Register the subscription for Microsoft.DeviceRegistry |
> | Microsoft.DeviceRegistry/schemaRegistries/read | Get a SchemaRegistry |
> | Microsoft.DeviceRegistry/schemaRegistries/write | Update a SchemaRegistry |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/write |  |
> | [Microsoft.Insights](../permissions/monitor.md#microsoftinsights)/alertRules/* | Create and manage a classic metric alert |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Edge/sites/read | Get a Site |
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
  "description": "User can Azure arc connect and deploy Azure IoT Operations securely.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/7b7c71ed-33fa-4ed2-a91a-e56d5da260b5",
  "name": "7b7c71ed-33fa-4ed2-a91a-e56d5da260b5",
  "permissions": [
    {
      "actions": [
        "Microsoft.IoTOperations/*",
        "Microsoft.DeviceRegistry/register/action",
        "Microsoft.DeviceRegistry/schemaRegistries/read",
        "Microsoft.DeviceRegistry/schemaRegistries/write",
        "Microsoft.Authorization/*/read",
        "Microsoft.Authorization/*/write",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Edge/sites/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure IoT Operations Onboarding",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Device Provisioning Service Data Contributor

Allows for full access to Device Provisioning Service data-plane operations.

[Learn more](/azure/iot-dps/concepts-control-access-dps-azure-ad)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/provisioningServices/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to Device Provisioning Service data-plane operations.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/dfce44e4-17b7-4bd1-a6d1-04996ec95633",
  "name": "dfce44e4-17b7-4bd1-a6d1-04996ec95633",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Devices/provisioningServices/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Device Provisioning Service Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Device Provisioning Service Data Reader

Allows for full read access to Device Provisioning Service data-plane properties.

[Learn more](/azure/iot-dps/concepts-control-access-dps-azure-ad)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | [Microsoft.Devices](../permissions/internet-of-things.md#microsoftdevices)/provisioningServices/*/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full read access to Device Provisioning Service data-plane properties.",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/10745317-c249-44a1-a5ce-3a4353c0bbd8",
  "name": "10745317-c249-44a1-a5ce-3a4353c0bbd8",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Devices/provisioningServices/*/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Device Provisioning Service Data Reader",
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

## Firmware Analysis Admin

Administrative user that can upload/view firmwares & configure firmware workspaces

[Learn more](/azure/defender-for-iot/device-builders/defender-iot-firmware-analysis-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
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
  "description": "Administrative user that can upload/view firmwares & configure firmware workspaces",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/9c1607d1-791d-4c68-885d-c7b7aaff7c8a",
  "name": "9c1607d1-791d-4c68-885d-c7b7aaff7c8a",
  "permissions": [
    {
      "actions": [
        "Microsoft.IoTFirmwareDefense/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Firmware Analysis Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Firmware Analysis Reader

View firmware images but not upload them or perform any workspace configuration

[Learn more](/azure/firmware-analysis/firmware-analysis-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/*/read |  |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/workspaces/firmwares/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | **NotActions** |  |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/firmwareGroups/* |  |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/workspaces/firmwares/write | The operation to update firmware. |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/workspaces/firmwares/delete | The operation to delete a firmware. |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View firmware images but not upload them or perform any workspace configuration",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/2a94a2fd-3c4f-45d1-847d-6585ba88af94",
  "name": "2a94a2fd-3c4f-45d1-847d-6585ba88af94",
  "permissions": [
    {
      "actions": [
        "Microsoft.IoTFirmwareDefense/*/read",
        "Microsoft.IoTFirmwareDefense/workspaces/firmwares/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*"
      ],
      "notActions": [
        "Microsoft.IoTFirmwareDefense/firmwareGroups/*",
        "Microsoft.IoTFirmwareDefense/workspaces/firmwares/write",
        "Microsoft.IoTFirmwareDefense/workspaces/firmwares/delete"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Firmware Analysis Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Firmware Analysis User

Upload and analyze firmware images but not perform any workspace configuration

[Learn more](/azure/firmware-analysis/firmware-analysis-rbac)

> [!div class="mx-tableFixed"]
> | Actions | Description |
> | --- | --- |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/* |  |
> | [Microsoft.Authorization](../permissions/management-and-governance.md#microsoftauthorization)/*/read | Read roles and role assignments |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | [Microsoft.Resources](../permissions/management-and-governance.md#microsoftresources)/deployments/* | Create and manage a deployment |
> | **NotActions** |  |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/firmwareGroups/* |  |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/register/action | Register the subscription for Microsoft.IoTFirmwareDefense |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/unregister/action | Unregister the subscription for Microsoft.IoTFirmwareDefense |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/workspaces/write | The operation to update a firmware analysis workspaces. |
> | [Microsoft.IoTFirmwareDefense](../permissions/internet-of-things.md#microsoftiotfirmwaredefense)/workspaces/delete | The operation to delete a firmware analysis workspace. |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Upload and analyze firmware images but not perform any workspace configuration",
  "id": "/providers/Microsoft.Authorization/roleDefinitions/53b2724d-1e51-44fa-b586-bcace0c82609",
  "name": "53b2724d-1e51-44fa-b586-bcace0c82609",
  "permissions": [
    {
      "actions": [
        "Microsoft.IoTFirmwareDefense/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*"
      ],
      "notActions": [
        "Microsoft.IoTFirmwareDefense/firmwareGroups/*",
        "Microsoft.IoTFirmwareDefense/register/action",
        "Microsoft.IoTFirmwareDefense/unregister/action",
        "Microsoft.IoTFirmwareDefense/workspaces/write",
        "Microsoft.IoTFirmwareDefense/workspaces/delete"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Firmware Analysis User",
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