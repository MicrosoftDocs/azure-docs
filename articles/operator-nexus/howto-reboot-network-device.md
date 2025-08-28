---
title: Reboot a Network Device in Azure Operator Nexus Network Fabric
description: Learn how to reboot a network device in Azure Operator Nexus Network Fabric by using graceful and ungraceful reboot methods.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/24/2025
ms.custom: template-how-to
---

# Reboot a network device

This article explains how to reboot a network device in Azure Operator Nexus Network Fabric. It introduces two reboot modes that users can use to restart their devices without requiring zero-touch provisioning (ZTP).

A new `POST` action was added to the device resource. Users can trigger a reboot and monitor its success or failure by using the configuration state property.

## Reboot modes

Azure Operator Nexus Network Fabric version 8.1 introduces four reboot modes:

- Graceful reboot without ZTP
- Ungraceful reboot without ZTP
- Graceful reboot with ZTP
- Ungraceful reboot with ZTP

### Graceful reboot without ZTP (default mode)

A graceful reboot ensures a stable restart process by temporarily placing the device in maintenance mode.

#### How it works

- The device enters maintenance mode before the reboot.
- The reboot uses the last saved configuration stored on the device.
- Upon successful restart, the device exits maintenance mode automatically.

#### Command to execute a graceful reboot

Use the following Azure CLI command:

```Azure CLI
az networkfabric device reboot --network-device-name <DeviceName> --resource-group <ResourceGroupName> --reboot-type GracefulRebootWithoutZTP
```

#### Considerations

While the device is in maintenance mode, the following operations are blocked:

- Configuration updates
- Software upgrades
- Device replacement flows

Maintenance mode is automatically removed after the reboot is completed successfully.

### Ungraceful reboot without ZTP

An ungraceful reboot is a faster restart option that doesn't place the device in maintenance mode.

#### How it works

- The device immediately reboots by using the last saved configuration.
- Unlike the graceful reboot, the device remains operational without entering maintenance mode.

#### Command to execute an ungraceful reboot

Use the following Azure CLI command:

```Azure CLI

az networkfabric device reboot --network-device-name <DeviceName> --resource-group <ResourceGroupName> --reboot-type UnGracefulRebootWithoutZTP

```

#### Considerations

- The fabric is still placed in maintenance mode, but the device itself isn't.
- Blocked operations during the reboot:

  - Configuration pushes
  - Software upgrades
  - Device replacement flows

- The current `runRW` configuration persists across the reboot.

## Administrative and configuration state during reboot

- When a reboot is triggered, the administrative state changes to `UnderMaintenance` in the device overview.
- Upon a successful reboot, the administrative state transitions back to `Enabled`.
- If the reboot fails:

  - The configuration state remains `Failed`.
  - The administrative state remains `UnderMaintenance`.

### Graceful reboot with ZTP

This reboot mode places the device into maintenance mode and reboots it into ZTP mode, which allows for reprovisioning.

#### How it works

- The device enters maintenance mode.
- It reboots into ZTP mode.
- Users can bootstrap the device via the terminal server and perform a device refresh through a lock-boxed admin action to bring it out of maintenance mode.

#### Command to execute a graceful reboot

Use the following Azure CLI command:

```Azure CLI

az networkfabric device reboot --network-device-name <DeviceName> --resource-group <ResourceGroupName> --reboot-type GracefulRebootWithZTP 

```

User intervention is required for bootstrapping and refreshing the device to exit maintenance mode.

### Ungraceful reboot with ZTP

This mode initiates an immediate reboot without draining traffic and places the device directly into ZTP mode.

#### How it works

- The device reboots immediately into ZTP mode without entering maintenance mode.
- Users can bootstrap the device via the terminal server and perform a device refresh through a lock-boxed admin action.

#### Command to execute an ungraceful reboot

Use the following Azure CLI command:

```Azure CLI

az networkfabric device reboot --network-device-name <DeviceName> --resource-group <ResourceGroupName> --reboot-type UnGracefulRebootWithZTP 

```

After an ungraceful reboot into ZTP mode, the device must be manually placed into maintenance mode.

Rebooting into ZTP mode doesn't preserve the read-write configuration. The device boots in ZTP mode and is ready for bootstrapping via the terminal server.

## Summary of key differences

| Feature | Graceful reboot without ZTP | Ungraceful reboot without ZTP | Graceful reboot with ZTP | Ungraceful reboot with ZTP |
|---------|----------------------------|------------------------------|--------------------------|----------------------------|
| Enters device maintenance mode? | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| Enters fabric maintenance mode? | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Uses last saved configuration? | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Blocks configuration updates, upgrades, and replacement flows? | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Persists running configuration? | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
