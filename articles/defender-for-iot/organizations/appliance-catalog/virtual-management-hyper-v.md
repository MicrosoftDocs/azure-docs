---
title: On-premises management console (Microsoft Hyper-V) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT on-premises management console as a virtual appliance using  Microsoft Hyper-V.
ms.date: 04/24/2022
ms.topic: reference
---

# On-premises management console as a virtual appliance with Microsoft Hyper-V

This article describes an on-premises management console deployment on a virtual appliance using Microsoft Hyper-V.

# On-premises management console (Microsoft Hyper-V hypervisor)

This article describes an on-premises management console deployment on a virtual appliance using the Microsoft Hyper-V hypervisor (Windows 10 Pro or Enterprise)

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | As required, refer to [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Performance** | 	As required, refer to [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Physical specifications** | Virtual Machine |
|**Status** | Supported |

### Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, make sure you have the following items:

- Microsoft Hyper-V hypervisor (Windows 10 Pro or Enterprise) installed and operational

- Available hardware resources for the virtual machine

- ISO installation file for the Microsoft Defender for IoT sensor

Make sure the hypervisor is running.

### Create the virtual machine (Hyper-V)

To create a virtual machine by using Hyper-V:

1. Create a virtual disk in Hyper-V Manager.

1. Select the format **VHDX**.

1. Select **Next**.

1. Select the type **Dynamic expanding**.

1. Select **Next**.

1. Enter the name and location for the VHD.

1. Select **Next**.

1. Enter the required size (according to the architecture).

1. Select **Next**.

1. Review the summary and select **Finish**.

1. On the **Actions** menu, create a new virtual machine.

1. Select **Next**.

1. Enter a name for the virtual machine.

1. Select **Next**.

1. Select **Generation** and set it to **Generation 1**.

1. Select **Next**.

1. Specify the memory allocation (according to the architecture) and select the check box for dynamic memory.

1. Select **Next**.

1. Configure the network adaptor according to your server network topology.

1. Select **Next**.

1. Connect the VHDX created previously to the virtual machine.

1. Select **Next**.

1. Review the summary and select **Finish**.

1. Right-click the new virtual machine, and then select **Settings**.

1. Select **Add Hardware** and add a new adapter for **Network Adapter**.

1. For **Virtual Switch**, select the switch that will connect to the sensor management network.

1. Allocate CPU resources (according to the architecture).

1. Connect the management console's ISO image to a virtual DVD drive.

1. Start the virtual machine.

1. On the **Actions** menu, select **Connect** to continue the software installation.

### Software installation

This section describes the ESXi software installation.

To install:

1. Open the virtual machine console.

1. The VM will start from the ISO image, and the language selection screen will appear.

1. Continue by installing OT sensor or on-premises management software. For more information, see [Defender for IoT software installation](../how-to-install-software.md).

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

During the installation process, you can add a secondary NIC. If you choose not to install the secondary NIC during installation, you can [add a secondary NIC](../how-to-install-software.md#add-a-secondary-nic) at a later time.



## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) and [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](../how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](../how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](../how-to-install-software.md)
