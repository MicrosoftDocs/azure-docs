---
title: On-premises management console (VMWare ESXi) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT on-premises management console as a virtual appliance using VMWare ESXi.
ms.date: 04/24/2022
ms.topic: reference
---

# On-premises management console (VMWare ESXi)

This article describes an on-premises management console deployment on a virtual appliance using VMWare ESXi.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md). |
|**Performance** | 	 As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md). |
|**Physical specifications** | Virtual Machine |
|**Status** | Supported |

### Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, make sure you have the following items:

- VMware (ESXi 5.5 or later) installed and operational

- Available hardware resources for the virtual machine

- ISO installation file for the Microsoft Defender for IoT sensor

Make sure the hypervisor is running.

### Create the virtual machine (ESXi)

To create a virtual machine (ESXi):

1. Sign in to the ESXi, choose the relevant **datastore**, and select **Datastore Browser**.

1. Upload the image and select **Close**.

1. Go to **Virtual Machines**.

1. Select **Create/Register VM**.

1. Select **Create new virtual machine** and select **Next**.

1. Add a sensor name and choose:

   - Compatibility: \<latest ESXi version>

   - Guest OS family: Linux

   - Guest OS version: Ubuntu Linux (64-bit)

1. Select **Next**.

1. Choose relevant datastore and select **Next**.

1. Change the virtual hardware parameters according to the required architecture.

1. For **CD/DVD Drive 1**, select **Datastore ISO file** and choose the ISO file that you uploaded earlier.

1. Select **Next** > **Finish**.


### Software installation

This section describes the ESXi software installation.

To install:

1. Open the virtual machine console.

1. The VM will start from the ISO image, and the language selection screen will appear.

1. Continue by installing OT sensor or on-premises management software. For more information, see [Install the software](#install-defender-for-iot-software).

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

During the installation process, you can add a secondary NIC. If you choose not to install the secondary NIC during installation, you can [add a secondary NIC](../how-to-install-software.md#add-a-secondary-nic) at a later time.


## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) and [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](../how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](../how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](../how-to-install-software.md)
