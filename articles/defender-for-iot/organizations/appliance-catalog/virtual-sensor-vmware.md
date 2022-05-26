---
title: OT sensor VM (VMWare ESXi) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT OT sensor as a virtual appliance using VMWare ESXi.
ms.date: 04/24/2022
ms.topic: reference
---

# OT network sensor VM (VMWare ESXi)

This article describes an OT sensor deployment on a virtual appliance using VMWare ESXi.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Performance** | 	 As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Physical specifications** | Virtual Machine |
|**Status** | Supported |

## Prerequisites

Before you begin the installation, make sure you have the following items:

- VMware (ESXi 5.5 or later) installed and operational

- Available hardware resources for the virtual machine. For more information, see [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

- The OT sensor software [downloaded from Defender for IoT in the Azure portal](../how-to-install-software.md#download-software-files-from-the-azure-portal).

Make sure the hypervisor is running.

## Create the virtual machine

This procedure describes how to create a virtual machine by using ESXi.

**To create the virtual machine using ESXi**:

1. Sign in to the ESXi, choose the relevant **datastore**, and select **Datastore Browser**.

1. Select **Upload**, to upload the image, and select **Close**.

1. Navigate to VM, and then select **Create/Register VM**.

1. Select **Create new virtual machine**, and then select **Next**.

1. Add a sensor name, and select the following options:

   - Compatibility: **&lt;latest ESXi version&gt;**

   - Guest OS family: **Linux**

   - Guest OS version: **Ubuntu Linux (64-bit)**

1. Select **Next**.

1. Choose the relevant datastore and select **Next**.

1. Change the virtual hardware parameters according to the required architecture.

1. For **CD/DVD Drive 1**, select **Datastore ISO file** and choose the ISO file that you uploaded earlier.

1. Select **Next** > **Finish**.

## Software installation

1. To start installing the OT sensor software, open the virtual machine console.

    The VM will start from the ISO image, and the language selection screen will appear.

1. Continue with the [generic procedure for installing sensor software](../how-to-install-software.md#install-ot-monitoring-software).


## Configure a monitoring interface (SPAN)

While a virtual switch doesn't have mirroring capabilities, you can use *Promiscuous mode* in a virtual switch environment as a workaround for configuring a SPAN port.

*Promiscuous mode* is a mode of operation and a security, monitoring, and administration technique that is defined at the virtual switch or portgroup level. When promiscuous mode is used, any of the virtual machine’s network interfaces that are in the same portgroup can view all network traffic that goes through that virtual switch. By default, promiscuous mode is turned off.

For more information, see [Purdue reference model and Defender for IoT](../best-practices/understand-network-architecture.md#purdue-reference-model-and-defender-for-iot).

**To configure a SPAN port with ESXi**:

1. Open vSwitch properties.

1. Select **Add**.

1. Select **Virtual Machine** > **Next**.

1. Insert a network label **SPAN Network**, select **VLAN ID** > **All**, and then select **Next**.

1. Select **Finish**.

1. Select **SPAN Network** > **Edit*.

1. Select **Security**, and verify that the **Promiscuous Mode** policy is set to **Accept** mode.

1. Select **OK**, and then select **Close** to close the vSwitch properties.

1. Open the **OT Sensor VM** properties.

1. For **Network Adapter 2**, select the **SPAN** network.

1. Select **OK**.

1. Connect to the sensor, and verify that mirroring works.

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) and [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](../onboard-sensors.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](../how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](../how-to-install-software.md)
