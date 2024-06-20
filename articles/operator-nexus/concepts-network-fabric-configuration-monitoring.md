---
title: Azure Operator Nexus Network Fabric configuration monitoring
description: Overview of configuration monitoring for Azure Operator Nexus.
author: sushantjrao
ms.author: sushrao
ms.reviewer: sushrao
ms.date: 04/27/2024
ms.service: azure-operator-nexus
ms.topic: conceptual
---

# Nexus Network Fabric configuration monitoring overview

Nexus Network Fabric stands out as a robust solution, providing comprehensive support for identifying and reporting configuration differences across all devices.

## Understanding configuration differences

Configuration changes within network devices occur frequently, driven by automation or manual interventions such as break glass procedures. Nexus Network Fabric offers a robust mechanism to track these modifications, ensuring transparency and accountability in network management.

## Comprehensive reporting

One of the key features of Nexus Network Fabric is its ability to generate detailed reports on configuration differences. With every modification to the running configuration, whether initiated through Nexus itself or via break glass procedures, Nexus Network Fabric captures and highlights the changes.

## Result categories attributes

Nexus Network Fabric meticulously tracks configuration changes, associating each difference with essential attributes:

| Attribute          | Description                                                                                       |
|--------------------|---------------------------------------------------------------------------------------------------|
| Timestamp          | Indicates the time when the configuration change occurred in UTC.                                 |
| Event Category     | Indicates the type of event captured, such as "systemSessionHistoryUpdates."                       |
| Fabric ID          | Refers to the ARM ID of the Network Fabric.                                                       |
| Device Name        | Indicates the device ID, such as TORs, CEs, etc.                                                  |
| Session Diffs      | Refers to the configuration differences within the device, including additions and deletions.      |
| Session ID         | Refers to the unique identifier (or name) of the configuration session that initiated the change.  |
| Device ID/Resource ID | Refers to the ARM ID of the resource such as TORs, CEs, NPBs, MGMT switches.                       |


## Enhanced accountability

By monitoring and reporting on configuration changes, Nexus Network Fabric enhances accountability within network management. Administrators can swiftly identify the individuals responsible for initiating modifications, facilitating effective oversight and adherence to security protocols.

## Next steps

[How to configure diagnostic settings and monitor configuration differences](howto-configure-diagnostic-settings-monitor-configuration-differences.md)
