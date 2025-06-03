---
title: How to replace a device in Azure Operator Nexus Network Fabric
description: Learn how to replace a network device in Azure Operator Nexus Network Fabric.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/16/2025
ms.custom:
  - template-how-to
  - build-2025
---

# Replace a device in Azure Operator Nexus Network Fabric (NNF)

This article describes how to replace a faulty or underperforming device in Azure Operator Nexus Network Fabric (NNF) using the RMA (Return Material Authorization) process which ensures minimal disruption and safe reintegration of the replacement hardware into the fabric.

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

## Steps to replace a device

1. Shutdown and remove the device from service (If reachable).

If the original device is still reachable and connected to the Network Fabric:

Manually power it down and remove it from service.

> [!Important]
> This step is manual and applicable only if the device is responsive.

2. Disable administrative state.

Use the following command to disable the administrative state of the device:

```Azure CLI
az networkfabric device update-admin-state \
  --state Disable \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

This action:

- Moves the device to a degraded state: EnabledDegraded.

- Excludes the device from all control plane actions such as:

    - Certificate rotations
    
    - Password rotations
    
    - Fabric upgrades

3. Update the serial number.

Once the replacement device is physically installed, update its serial number in the fabric resource:

```Azure CLI
az networkfabric device update \
  --serial-number "replacement-serial-number" \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

4. Ensure device is in ZTP Mode.

Verify that the replacement device is in ZTP mode. If not, configure the device for ZTP before continuing.

> [!Note]
> ZTP enables automatic configuration retrieval during the RMA process.

5. Set RMA State.

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

6. Enable administrative state.

Once configuration is applied successfully, bring the device back into active service:

```Azure CLI
az networkfabric device update-admin-state \
  --state Enable \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

This will: 

- Performs a partial reconcile of the device state.
- Sets device state to Enabled once it's fully healthy and synchronized with the fabric.

## Summary

The RMA workflow in Network Fabric ensures seamless device replacement with controlled state transitions and full configuration synchronization. This helps maintain service continuity and operational consistency across the network.
