---
title: OT sensor VM (Microsoft Hyper-V) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT OT sensor as a virtual appliance using Microsoft Hyper-V.
ms.date: 04/24/2022
ms.topic: reference
---

# OT network sensor VM (Microsoft Hyper-V)

This article describes an OT sensor deployment on a virtual appliance using Microsoft Hyper-V.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** |  As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Performance** | 	 As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Physical specifications** | Virtual Machine |
|**Status** | Supported |

> [!IMPORTANT]
> Versions 22.2.x of the sensor are incompatible with Hyper-V. Until the issue has been resolved, we recommend using either version 22.3.x or 22.1.7.

## Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, make sure you have the following items:

- Microsoft Hyper-V hypervisor (Windows 10 Pro or Enterprise) installed and operational. For more information, see [Introduction to Hyper-V on Windows 10](/virtualization/hyper-v-on-windows/about).

- Available hardware resources for the virtual machine. For more information, see [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

- The OT sensor software [downloaded from Defender for IoT in the Azure portal](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal).

Make sure the hypervisor is running.

## Create the virtual machine

This procedure describes how to create a virtual machine by using Hyper-V.

**To create the virtual machine using Hyper-V**:

1. Create a virtual disk in Hyper-V Manager (Fixed size, as required by the hardware profile).

1. Select **format = VHDX**.

1. Enter the name and location for the VHD.

1. Enter the required size [according to your organization's needs](../ot-appliance-sizing.md) (select Fixed Size disk type).

1. Review the summary, and select **Finish**.

1. On the **Actions** menu, create a new virtual machine.

1. Enter a name for the virtual machine.

1. Select **Specify Generation** > **Generation 1** or **Generation 2**.

1. Specify the memory allocation [according to your organization's needs](../ot-appliance-sizing.md), in standard RAM denomination (eg. 8192, 16384, 32768). Do not enable **Dynamic Memory**.

1. Configure the network adaptor according to your server network topology. Under the "Hardware Acceleration" blade, disable "Virtual Machine Queue" for the monitoring (SPAN) network interface.

1. Connect the VHDX created previously to the virtual machine.

1. Review the summary, and select **Finish**.

1. Right-click on the new virtual machine, and select **Settings**.

1. Select **Add Hardware**, and add a new network adapter.

1. Select the virtual switch that will connect to the sensor management network.

1. Allocate CPU resources [according to your organization's needs](../ot-appliance-sizing.md).

1. Connect the management console's ISO image to a virtual DVD drive.

1. Start the virtual machine.

1. On the **Actions** menu, select **Connect** to continue the software installation.

## Software installation

1. To start installing the OT sensor software, open the virtual machine console.

    The VM will start from the ISO image, and the language selection screen will appear.

1. Continue with the [generic procedure for installing sensor software](../how-to-install-software.md).



## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) and [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../ot-deploy/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
