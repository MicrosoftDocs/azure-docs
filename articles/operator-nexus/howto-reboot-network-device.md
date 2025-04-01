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

## Summary of key differences  

| **Feature**  | **Graceful Reboot Without ZTP** | **Ungraceful Reboot Without ZTP** |  
|-------------|--------------------------------|----------------------------------|  
| **Puts device in maintenance mode?** | ✅ Yes | ❌ No |  
| **Puts Fabric in maintenance mode?** | ✅ Yes | ✅ Yes |  
| **Uses last saved configuration?** | ✅ Yes | ✅ Yes |  
| **Blocks configuration updates, upgrades, and replacement flows?** | ✅ Yes | ✅ Yes |  
| **Persists runRW configuration?** | ✅ Yes | ✅ Yes |

