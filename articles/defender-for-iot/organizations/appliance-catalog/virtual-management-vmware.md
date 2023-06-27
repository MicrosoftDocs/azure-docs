---
title: On-premises management console (VMware ESXi) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT on-premises management console as a virtual appliance using VMware ESXi.
ms.date: 04/24/2022
ms.topic: reference
---

# On-premises management console (VMware ESXi)

This article describes an on-premises management console deployment on a virtual appliance using VMware ESXi.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Performance** | As required for your organization. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Physical specifications** | Virtual Machine |
|**Status** | Supported |

## Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, make sure you have the following items:

- VMware (ESXi 5.5 or later) installed and operational

- Available hardware resources for the virtual machine. For more information, see [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

- The on-premises management console software [downloaded from Defender for IoT in the Azure portal](../ot-deploy/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal).

Make sure the hypervisor is running.

> [!NOTE]
> There is no need to pre-install an operating system on the VM, the sensor installation includes the operating system image.

## Create the virtual machine

This procedure describes how to create a virtual machine for your on-premises management console using VMware ESXi.

**To create the virtual machine**:

1. Sign in to the ESXi, choose the relevant **datastore**, and select **Datastore Browser**.

1. Upload the image and select **Close**.

1. Go to **Virtual Machines** > **Create/Register VM** > **Create new virtual machine** > **Next**.

1. Add a sensor name and select:

   - **Compatibility**: \<latest ESXi version>

   - **Guest OS family**: Linux

   - **Guest OS version**: Ubuntu Linux (64-bit)

    When you're done, select **Next**.

1. Select the relevant datastore > **Next**.

1. Change the virtual hardware parameters [according to your organization's needs](../ot-appliance-sizing.md).

1. For **CD/DVD Drive 1**, select **Datastore ISO file** and then select the ISO file that you uploaded earlier.

1. Select **Next** > **Finish**.

## Software installation

1. To start installing the on-premises management console software, open the virtual machine console.

    The VM will start from the ISO image, and the language selection screen will appear.

1. Continue with the [generic procedure for installing on-premises management console software](../ot-deploy/install-software-on-premises-management-console.md).

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) and [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../ot-deploy/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
