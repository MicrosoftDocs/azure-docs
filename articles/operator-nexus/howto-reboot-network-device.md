---
title: How to reboot network device in Azure Operator Nexus Network Fabric
description: Learn how to reboot a network device in Azure Operator Nexus Network Fabric using graceful and ungraceful reboot methods.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/24/2025
ms.custom: template-how-to
---

# Reboot a network device

This guide explains how to reboot a **Network device** in Azure Nexus Network Fabric. It introduces two reboot modes that allow users to restart their devices without requiring **Zero Touch Provisioning (ZTP)**.  

A **new POST action** has been added to the **device resource**, enabling users to trigger a reboot and monitor its success or failure using the **configuration state property**.  

## Reboot Modes

Azure Operator Nexus Network Fabric version 8.1 introduces four reboot modes:  

- Graceful Reboot without ZTP (Zero Touch Provisioning)  

- Ungraceful Reboot without ZTP  

- Graceful Reboot with ZTP  

- Ungraceful Reboot with ZTP  

### Graceful reboot without ZTP (default mode)  

A **graceful reboot** ensures a stable restart process by temporarily placing the device in maintenance mode.  

#### How it works  

- The device enters **maintenance mode** before the reboot.

- The reboot uses the **last saved configuration** stored on the device.

- Upon successful restart, the device **exits maintenance mode** automatically.  

#### Command to execute a graceful reboot  

Use the following Azure CLI command:  

```Azure CLI
az networkfabric device reboot --network-device-name <DeviceName> --resource-group <ResourceGroupName> --reboot-type GracefulRebootWithoutZTP
```

#### Considerations  

While the device is in **maintenance mode**, the following operations are **blocked**:  

- Configuration updates.

- Software upgrades.

- Device replacement flows.

Maintenance mode is **automatically removed** after the reboot is completed successfully.  


### Ungraceful reboot without ZTP  

An **ungraceful reboot** is a faster restart option that **does not** place the device in maintenance mode.  

#### How it works

- The device **immediately reboots** using the **last saved configuration**.

- Unlike the graceful reboot, the device **remains operational** without entering maintenance mode.

#### Command to execute an ungraceful reboot  

Use the following **Azure CLI command**:  

```Azure CLI

az networkfabric device reboot --network-device-name <DeviceName> --resource-group <ResourceGroupName> --reboot-type UnGracefulRebootWithoutZTP

```

#### Considerations  

- The **Fabric** is still placed in **maintenance mode**, but the **device itself is not**.

- **Blocked operations during the reboot:**

  - Configuration pushes  

  - Software upgrades  

  - Device replacement flows  

- The **current runRW configuration persists** across the reboot.  

## Administrative and Configuration state during reboot  

- When a reboot is triggered, the **administrative state** changes to **UnderMaintenance** in the device overview.  

- Upon a successful reboot, the **administrative state** transitions back to **Enabled**.  

- If the reboot fails:  

  - The **configuration state** remains in **Failed**.  

  - The **administrative state** remains in **UnderMaintenance**.  

### Graceful Reboot with ZTP 

This reboot mode places the device into maintenance mode and reboots it into ZTP mode, allowing for re-provisioning.  

#### How it works

- The device enters maintenance mode.  

- Reboots into ZTP mode.  

- User can bootstrap the device via the Terminal Server (TS) and perform a device refresh through a lock-boxed admin action to bring it out of maintenance mode.  

#### Command to execute a graceful reboot

```Azure CLI

az networkfabric device reboot --network-device-name <DeviceName> --resource-group <ResourceGroupName> --reboot-type GracefulRebootWithZTP 

```

> [!Note]
> User intervention is required for bootstrapping and refreshing the device to exit maintenance mode.  

### Ungraceful Reboot with ZTP 

This mode initiates an immediate reboot without draining traffic, placing the device directly into ZTP mode.  

#### How it works

- The device reboots immediately into ZTP mode without entering maintenance mode.  

- User can bootstrap the device via the Terminal Server and perform a device refresh through a lock-boxed admin action.  

#### Command to execute an ungraceful reboot  

```Azure CLI

az networkfabric device reboot --network-device-name <DeviceName> --resource-group <ResourceGroupName> --reboot-type UnGracefulRebootWithZTP 

```

>[!Note] 
> After an ungraceful reboot into ZTP mode, the device must be manually placed into maintenance mode.

>[!Note]
> Rebooting into ZTP mode does not preserve the read-write (RW) configuration. The device will boot in ZTP mode, ready for bootstrapping via the Terminal Server.

## Summary of key differences  

| Feature | Graceful Reboot Without ZTP | Ungraceful Reboot Without ZTP | Graceful Reboot With ZTP | Ungraceful Reboot With ZTP |
|---------|----------------------------|------------------------------|--------------------------|----------------------------|
| **Enters device maintenance mode?** | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| **Enters fabric maintenance mode?** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Uses last saved configuration?** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Blocks configuration updates, upgrades, and replacement flows?** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Persists running configuration?** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |


