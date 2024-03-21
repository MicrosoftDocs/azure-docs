---
title: OT sensor VM (VMware ESXi) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT OT sensor as a virtual appliance using VMware ESXi.
ms.date: 08/20/2023
ms.topic: reference
---

# OT network sensor VM (VMware ESXi)

This article describes an OT sensor deployment on a virtual appliance using VMware ESXi.

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

- The OT sensor software [downloaded from Defender for IoT in the Azure portal](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal).

- Traffic mirroring configured on your vSwitch. For more information, see [Configure traffic mirroring with a ESXi vSwitch](../traffic-mirroring/configure-mirror-esxi.md).

Make sure the hypervisor is running.

> [!NOTE]
> There is no need to pre-install an operating system on the VM, the sensor installation includes the operating system image.

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

1. In your VM options, change your boot options from **Firmware** to **BIOS**. Make sure that you're not booting from EFI.

1. Select **Next** > **Finish**.

## Software installation

1. To start installing the OT sensor software, open the virtual machine console.

    The VM will start from the ISO image, and the language selection screen will appear.

1. Continue with the [generic procedure for installing sensor software](../ot-deploy/install-software-ot-sensor.md).


## Next steps

For more information, see:

- [Which appliances do I need?](../ot-appliance-sizing.md)
- [OT monitoring with virtual appliances](../ot-virtual-appliances.md)
- [On-premises management console (VMware ESXi)](virtual-management-vmware.md)
- [OT network sensor VM (Microsoft Hyper-V)](virtual-sensor-hyper-v.md)
- [On-premises management console (Microsoft Hyper-V hypervisor)](virtual-management-hyper-v.md)