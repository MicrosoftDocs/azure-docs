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

This article explains how to replace a faulty or underperforming network device in Azure Operator Nexus Network Fabric (NNF).
It covers devices such as the Top of Rack (TOR) switch, Customer Edge (CE) switch, Network Packet Broker (NPB), and the Management Switch.
The replacement is performed using the Return Material Authorization (RMA) process.
This process is designed to minimize service disruption and safely reintegrate the new hardware into the fabric.

## Scenarios for device replacement

Device replacement may be required in the following situations:

- Inconsistent Performance (Flakiness): The device shows intermittent connectivity or performance degradation.

- Hardware Failure: The device experiences critical hardware malfunctions that can't be fixed through standard troubleshooting.

- Persistent Unreachability: The device is permanently unreachable despite repeated recovery attempts.

## Prerequisites

To ensure a smooth and timely RMA process, verify the following prerequisites before initiating deployment:

  - Azure CLI is installed and properly configured

  - Permissions are granted to manage Microsoft.ManagedNetworkFabric resources

  - Replacement device is powered on and physically connected

  - Replacement device supports Zero Touch Provisioning (ZTP)

  - To prevent failure during the device disable action if the device is affected by continuous reboots due to hardware issues, it is advised to power off the device prior to initiating the RMA process. 

  - Before initiating the RMA deployment, perform the following checks:
    
    
    - Interface Speed Validation

        - Confirm that the ma1 interface speed is set to 100 Mbps or higher.

        - If the speed is below 100 Mbps, update it accordingly to prevent delays or potential timeouts during the RMA process.

    - Device Storage Check
        - Ensure the device has a minimum of 3 GB of free space available.

        - This action is required to successfully download and stage the necessary image files.
 
## Device types supported

- Customer Edge (CE)
- Top of Rack (TOR)
- Management Switch (Mgmt Switch)
- Network Packet Broker (NPB)

## Steps to replace a device

### Step 1: Disable administrative state

Use the following command to disable the administrative state of the device:

```Azure CLI
az networkfabric device update-admin-state \
  --state Disable \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

This action sets the following states:

- Device Administrative State: Disabled

- Fabric Administrative State: EnabledDegraded

>[!Note] 
> This action is not permitted by the service, if any of the following operations are in progress at the fabric level:
> - Device upgrade
> - Configuration push
> - Secret or certificate updates
> - Administrative lock
> - Terminal Server (TS) reprovisioning.

### Step 2: Update the serial number

Execution conditions:
- Device Administrative State must be `Disabled`
- Fabric Administrative State must be `EnabledDegraded`

Once the replacement device is physically installed, update its serial number in the fabric resource:

```Azure CLI
az networkfabric device update \
  --serial-number "replacement-serial-number" \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

Error recovery guidance:

- If RMA fails due to an incorrect serial number, repatching is allowed without a support ticket.

- If validation fails after device bootstrap, the system returns the status: Device Unable to Boot Up - Failed.

This action performs the following tasks:

- Update serial number stored in Azure ARM resource

- Keeps the device in `Disabled` state and Fabric Administrative State in `EnabledDegraded`

### Step 3: Ensure device is in ZTP Mode

Verify that the replacement device is in ZTP mode. If not, configure the device for ZTP before continuing.

> [!Note]
> ZTP enables automatic configuration retrieval during the RMA process.

### Step 4: Initiate RMA process

Initiate the RMA process using the following command:

```Azure CLI
az networkfabric device update-admin-state \
  --state RMA \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

- Network Fabric Controller pushes all required configuration files to the new replaced device. It is advised to retry the operation if there's transient failures until success is confirmed.

- The device boots into its base configuration using the maintenance profile. This condition applies only to TOR and CE device types.

This action sets the following states:

- Device Administrative State: UnderMaintenance

- Fabric Administrative State: EnabledDegraded

### Step 5: Refresh configuration

This operation pushes the latest configuration to the device (for all type of the devices). If a maintenance profile is already configured on the device (applicable to CE and TOR), it will be retained during this operation.

```Azure CLI
az networkfabric device refresh-configuration --resource-name <resource-name> --resource-group <rg-name>
```

This action keeps the device in following states:

- Device Administrative State: UnderMaintenance

- Fabric Administrative State: EnabledDegraded

### Step 6: Enable administrative state.

Once configuration is applied successfully, bring the device back into active service:

```Azure CLI
az networkfabric device update-admin-state \
  --state Enable \
  --resource-name "nf-device-name" \
  --resource-group "resource-group-name"
```

This action sets the following state once it's fully healthy and synchronized with the fabric:

- Device Administrative State: `Enabled`

- Fabric Administrative State: `Enabled` 

>[!Note]
> In a given fabric if there are any other device is in Disabled state then the Fabric Administrative State will maintained as : `EnabledDegraded` 

## Summary

The RMA workflow in Network Fabric ensures seamless device replacement with controlled state transitions and full configuration synchronization. This helps maintain service continuity and operational consistency across the network.
