---
title: How to put a network device in maintenance mode within Nexus Network Fabric
description: Process of configuring network device in maintenance mode
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/17/2024
ms.custom: template-how-to
---

# Device maintenance mode 

Maintenance mode provides ability to isolate network fabric device  from the network in order to perform maintenance operations such as troubleshooting, log collection and diagnostics and executing any supported commands via method D  or method A.  

When user puts device in maintenance mode, all process running on device are gracefully shut down and all physical ports are shut down. During maintenance mode traffic is carried over to the paired device  for example if TOR1 undergoes maintenance, paired device TOR2 would carry all traffic with minimal traffic loss during switch over.  To switch over traffic no user intervention is required. 

## Key considerations  

Only one device at a time can be in maintenance mode  

Fabric upgrades are restricted when device is in maintenance mode

## How to put a device into maintenance mode

This guide will walk you through the process of putting a device into maintenance mode and then returning it to normal operation.


## Parameters required for maintenance mode

Before you begin, you need to understand the parameters required for managing the maintenance state of a device. Here is a quick reference table:

| Parameter          | Description                  | Example           |
|--------------------|------------------------------|-------------------|
| `--resource-group` | Resource group name          | resourcegroup     |
| `--resource-name`  | Name of the network device   | AggrRack-CE1      |
| `--state`          | State of the device          | UnderMaintenance or Enabled |

## Putting a device into maintenance mode

To place a device into maintenance mode, follow these steps:

1. Install the latest version of the [az CLI extension ](./howto-install-cli-extensions.md)

2. Open your command-line interface (CLI).

3. Use the `az networkfabric device update-admin-state` command with the appropriate parameters.

### Command syntax

```azurecli
az networkfabric device update-admin-state --resource-group "resourcegroup" --resource-name "exampledevicename" --state UnderMaintenance
```

### Example command

```azuecli
az networkfabric device update-admin-state --resource-group "resourcegroup" --resource-name "AggrRack-CE1" --state UnderMaintenance
```

### Expected output

After executing the command, you can verify the state of the device using the `az networkfabric device show` command:

```azurecli
az networkfabric device show --resource-group "resourcegroup" --resource-name "exampledevicename"
```

#### Example output

```json
{
  "administrativeState": "UnderMaintenance",
  "configurationState": "Succeeded",
  "hostName": "HOSTNAME",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resourcegroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/exampledevicename",
  "location": "eastus",
  "name": "exampledevicename",
  "networkDeviceRole": "CE",
  "networkDeviceSku": "DefaultSku",
  "networkRackId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resourcegroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/nffab100g-6-1-aggrack",
  "provisioningState": "Succeeded",
  "resourceGroup": "resourcegroup",
  "serialNumber": "Arista;DCS-7280CR3K;11.01;XXXXXXXXXXX",
  "systemData": {
    "createdAt": "2024-04-23T18:06:34.7467102Z",
    "createdBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13",
    "createdByType": "Application",
    "lastModifiedAt": "2024-05-14T06:50:32.7391425Z",
    "lastModifiedBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13",
    "lastModifiedByType": "Application"
  },
  "type": "microsoft.managednetworkfabric/networkdevices",
  "version": "3.0.0"
}
```

## Returning a device to normal operation

Once the maintenance activities are complete, you can return the device to its normal operational state.

### Command Syntax

```azurecli
az networkfabric device update-admin-state --resource-group "resourcegroup" --resource-name "exampledevicename" --state Enable
```

### Example Command

```azurecli
az networkfabric device update-admin-state --resource-group "resourcegroup" --resource-name "AggrRack-CE1" --state Enable
```

### Expected Output

Verify the state of the device using the `az networkfabric device show` command:

```azurecli
az networkfabric device show --resource-group "resourcegroup" --resource-name "exampledevicename"
```

#### Example Output

```json
{
  "administrativeState": "Enabled",
  "configurationState": "Succeeded",
  "hostName": "HOSTNAME",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resourcegroup/providers/Microsoft.ManagedNetworkFabric/networkDevices/exampledevicename",
  "location": "eastus",
  "name": "exampledevicename",
  "networkDeviceRole": "CE",
  "networkDeviceSku": "DefaultSku",
  "networkRackId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resourcegroup/providers/Microsoft.ManagedNetworkFabric/networkRacks/nffab100g-6-1-aggrack",
  "provisioningState": "Succeeded",
  "resourceGroup": "resourcegroup",
  "serialNumber": "Arista;DCS-728XXXX;11.01;XXXXXXXXXXX",
  "systemData": {
    "createdAt": "2024-04-23T18:06:34.7467102Z",
    "createdBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13",
    "createdByType": "Application",
    "lastModifiedAt": "2024-05-14T07:10:50.6839353Z",
    "lastModifiedBy": "cbe7d642-9e0a-475d-b2bf-2cb0a9825e13",
    "lastModifiedByType": "Application"
  },
  "type": "microsoft.managednetworkfabric/networkdevices",
  "version": "3.0.0"
}
```

By following these steps, you can efficiently manage the maintenance state of your network devices, ensuring minimal disruption to your network operations.