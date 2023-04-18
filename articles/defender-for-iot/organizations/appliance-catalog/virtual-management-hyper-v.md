---
title: On-premises management console (Microsoft Hyper-V) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT on-premises management console as a virtual appliance using  Microsoft Hyper-V.
ms.date: 04/24/2022
ms.topic: reference
---

# On-premises management console (Microsoft Hyper-V hypervisor)

This article describes an on-premises management console deployment on a virtual appliance using the Microsoft Hyper-V hypervisor (Windows 10 Pro or Enterprise).

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Performance** |  As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Physical specifications** | Virtual Machine |
|**Status** | Supported |

## Prerequisites

Before you begin the installation, make sure you have the following items:

- Microsoft Hyper-V hypervisor (Windows 10 Pro or Enterprise) installed and operational. For more information, see [Introduction to Hyper-V on Windows 10](/virtualization/hyper-v-on-windows/about).

- Available hardware resources for the virtual machine. For more information, see [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

- The on-premises management console software [downloaded from Defender for IoT in the Azure portal](../ot-deploy/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal).

Make sure the hypervisor is running.

## Create the virtual machine

This procedure describes how to create a virtual machine for your on-premises management console using Microsoft Hyper-V.

**To create a virtual machine**:

1. Create a virtual disk in Hyper-V Manager.

1. Select the format **VHDX** > **Next**.

1. Select the type **Dynamic expanding** > **Next**.

1. Enter the name and location for the VHD and then select **Next**.

1. Enter the [required size for your organization's needs](../ot-appliance-sizing.md), and then select **Next**.

1. Review the summary and select **Finish**.

1. On the **Actions** menu, create a new virtual machine and select **Next**.

1. Enter a name for the virtual machine and select **Next**.

1. Select **Generation** and set it to **Generation 1** or **Generation 2**, and then select **Next**.

1. Specify the [memory allocation for your organization's needs](../ot-appliance-sizing.md), and then select **Next**.

1. Configure the network adaptor according to your server network topology and then select **Next**.

1. Connect the VHDX created previously to the virtual machine, and then select **Next**.

1. Review the summary and select **Finish**.

1. Right-click the new virtual machine, and then select **Settings**.

1. Select **Add Hardware** and add a new adapter for **Network Adapter**.

1. For **Virtual Switch**, select the switch that will connect to the sensor management network.

1. Allocate [CPU resources for your organization's needs](../ot-appliance-sizing.md), and then select **Next**. 

1. Connect the management console's ISO image to a virtual DVD drive and start the virtual machine.

1. On the **Actions** menu, select **Connect** to continue the software installation.

## Software installation

1. To start installing the on-premises management console software, open the virtual machine console.

    The VM will start from the ISO image, and the language selection screen will appear.

1. Continue with the [generic procedure for installing on-premises management console software](../ot-deploy/install-software-on-premises-management-console.md).

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) and [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../ot-deploy/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
