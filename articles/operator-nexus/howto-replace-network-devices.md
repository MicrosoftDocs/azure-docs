---
title: How to replace network devices in Azure Operator Nexus Network Fabric
description: Process of replacing network devices in Azure Operator Nexus Network Fabric.
author: sushantjrao 
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/12/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Replace a network device in Azure Operator Nexus Network Fabric (NNF)

This article describes how to replace a faulty or underperforming network device Top of Rack (TOR), Customer Edge(CE) Network Packet Broker (NPB) and Management Switch in Azure Operator Nexus Network Fabric (NNF) using the RMA (Return Material Authorization) process which ensures minimal disruption and safe reintegration of the replacement hardware into the fabric.

## Scenarios for device replacement

Device replacement may be required in the following situations:

- Inconsistent Performance (Flakiness): The device shows intermittent connectivity or performance degradation.

- Hardware Failure: The device experiences critical hardware malfunctions that can't be fixed through standard troubleshooting.

- Persistent Unreachability: The device is permanently unreachable despite repeated recovery attempts.

## Prerequisites

- Azure CLI installed and configured.

- Required permissions to manage Microsoft.ManagedNetworkFabric resources.

- Replacement device powered on and connected physically.

- Replacement device must support Zero Touch Provisioning (ZTP).

- To ensure a smooth and timely RMA process, please verify the following before initiating deployment:
    
    - Interface Speed Validation

        - Confirm that the ma1 interface speed is set to 100 Mbps or higher.

        - If the speed is below 100 Mbps, update it accordingly to prevent delays or potential timeouts during the RMA process.

    - Device Storage Check
        - Ensure the device has a minimum of 2 GB of free space available.

        - This is required to successfully download and stage the necessary image files.
 
## Device Types Supported

- Customer Edge (CE)
- Top of Rack (TOR)
- Management Switch (Mgmt Switch)
- Network Packet Broker (NPB)

## Steps to replace a device

1. Disable administrative state.

Use the following command to disable the administrative state of the device:

```Azure CLI
az networkfabric device update-admin-state \
  --state Disable \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

This action sets the following states:

  -  Device Administrative State: Disabled

  - Fabric Administrative State: EnabledDegraded

> Note: 
> This action is not permitted by the service, if any of the following operations are in progress at the fabric level:<br> - Device upgrade<br> - Configuration push<br> - Secret or certificate updates<br>Administrative lock<br> - Terminal Server (TS) reprovisioning.

2. Update the serial number.

Execution Conditions:
  - Device Administrative State must be `Disabled`
  - Fabric Administrative State must be `EnabledDegraded`

Once the replacement device is physically installed, update its serial number in the fabric resource:

```Azure CLI
az networkfabric device update \
  --serial-number "replacement-serial-number" \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

Error Recovery Guidance:

  - If RMA fails due to incorrect serial number, re-patching is allowed without a support ticket

  - Validation occurs after device bootstrap; failure returns status: 'Device Unable to Boot Up - Failed'

This action perfoms following:

  - Update serial number stored in Azure ARM resource

  - Keeps the device in Disabled state

3. Ensure device is in ZTP Mode.

Verify that the replacement device is in ZTP mode. If not, configure the device for ZTP before continuing.

> [!Note]
> ZTP enables automatic configuration retrieval during the RMA process.

This action sets the following states:

  - Device Administrative State: UnderMaintenance

  - Fabric Administrative State: EnabledDegraded

The device will boot into its base configuration using the maintenance profile and is applicable only for TOR and CE device types.

4. Set RMA State.

Initiate the RMA process using the following command:

```Azure CLI
az networkfabric device update-admin-state \
  --state RMA \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

This will:

- Trigger the Network Fabric Controller to push all required configuration files to the replacement device.

- Retry the operation if there is transient failures until success is confirmed.

5. Refresh configuration

This step pushes the latest configuration to the device after it enters maintenance mode (applicable only for CE and TOR).

```Azure CLI
az networkfabric device refresh-configuration --resource-name <resource-name> --resource-group <rg-name>
```

This will push the latest config to the device.

6. Enable administrative state.

Once configuration is applied successfully, bring the device back into active service:

```Azure CLI
az networkfabric device update-admin-state \
  --state Enable \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

This will: 

- Sets device state to Enabled once it's fully healthy and synchronized with the fabric.

## Summary

The RMA workflow in Network Fabric ensures seamless device replacement with controlled state transitions and full configuration synchronization. This helps maintain service continuity and operational consistency across the network.
