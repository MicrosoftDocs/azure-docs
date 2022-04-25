---
title: OT sensor VM (VMWare ESXi) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT OT sensor as a virtual appliance using VMWare ESXi.
ms.date: 04/24/2022
ms.topic: reference
---

# OT sensor VM (VMWare ESXi)

This article describes an OT sensor deployment on a virtual appliance using VMWare ESXi.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | As required, refer to [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Performance** | 	As required, refer to [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Physical specifications** | Virtual Machine |
|**Status** | Supported |

## Sensor installation for the virtual appliance

You can deploy the virtual machine for the Defender for IoT sensor in the following architectures:

| Architecture | Specifications | Usage | Comments |
|---|---|---|---|
| **Enterprise** | CPU: 8<br/>Memory: 32G RAM<br/>HDD: 1800 GB | Production environment | Default and most common |
| **Small Business** | CPU: 4 <br/>Memory: 8G RAM<br/>HDD: 500 GB | Test or small production environments | -  |
| **Office** | CPU: 4<br/>Memory: 8G RAM<br/>HDD: 100 GB | Small test environments | -  |

### Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, make sure you have the following items:

- VMware (ESXi 5.5 or later) or Hyper-V hypervisor (Windows 10 Pro or Enterprise) installed and operational

- Available hardware resources for the virtual machine

- ISO installation file for the Microsoft Defender for IoT sensor

Make sure the hypervisor is running.

### Create the virtual machine (ESXi)

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

### Software installation

This section describes the ESXi software installation.

To install:

1. Open the virtual machine console.

1. The VM will start from the ISO image, and the language selection screen will appear.

1. Continue by installing OT sensor or on-premises management software. For more information, see [Install the software](#install-defender-for-iot-software).

## Install Defender for IoT software

Ensure you followed the installation instruction for your device prior to starting the software installation, and have downloaded the containerized sensor version ISO file.

Mount the ISO file using one of the following options;

- Physical media – burn the ISO file to a DVD, or USB, and boot from the media.  

- Virtual mount – use iLO for HPE, or iDRAC for Dell to boot the iso file.

> [!Note]
> At the end of this process you will be presented with the usernames, and passwords for your device. Make sure to copy these down as these passwords will not be presented again.
**To install the sensor's software**:

1. Select the installation language.

    :::image type="content" source="../media/tutorial-install-components/language-select.png" alt-text="Screenshot of the sensor's language select screen.":::

1. Select the sensor's architecture.

    :::image type="content" source="../media/tutorial-install-components/sensor-architecture.png" alt-text="Screenshot of the sensor's architecture select screen.":::

1. The Sensor will reboot, and the Package configuration screen will appear. Press the up, or down arrows to navigate, and the Space bar to select an option. Press the Enter key to advance to the next screen.  

1. Select the monitor interface, and press the **Enter** key.

    :::image type="content" source="../media/tutorial-install-components/monitor-interface.png" alt-text="Screenshot of the select monitor interface screen.":::

1. If one of the monitoring ports is for ERSPAN, select it, and press the **Enter** key.

    :::image type="content" source="../media/tutorial-install-components/erspan-monitor.png" alt-text="Screenshot of the select erspan monitor screen.":::

1. Select the interface to be used as the management interface, and press the **Enter** key.

    :::image type="content" source="../media/tutorial-install-components/management-interface.png" alt-text="Screenshot of the management interface select screen.":::

1. Enter the sensor's IP address, and press the **Enter** key.

    :::image type="content" source="../media/tutorial-install-components/sensor-ip-address.png" alt-text="Screenshot of the sensor IP address screen.":::

1. Enter the path of the mounted logs folder. We recommend using the default path, and press the **Enter** key.

    :::image type="content" source="../media/tutorial-install-components/mounted-backups-path.png" alt-text="Screenshot of the mounted backup path screen.":::

1. Enter the Subnet Mask IP address, and press the **Enter** key.

1. Enter the default gateway IP address, and press the **Enter** key.

1. Enter the DNS Server IP address, and press the **Enter** key.

1. Enter the sensor hostname, and press the **Enter** key.

    :::image type="content" source="../media/tutorial-install-components/sensor-hostname.png" alt-text="Screenshot of the screen where you enter a hostname for your sensor.":::

1. The installation process runs.

1. When the installation process completes, save the appliance ID, and passwords. Copy these credentials to a safe place as you'll need them to access the platform the first time you use it.

    :::image type="content" source="../media/tutorial-install-components/login-information.png" alt-text="Screenshot of the final screen of the installation with usernames, and passwords.":::
    
## Configure a SPAN port

A virtual switch does not have mirroring capabilities. However, you can use promiscuous mode in a virtual switch environment. Promiscuous mode  is a mode of operation, and a security, monitoring and administration technique, that is defined at the virtual switch, or portgroup level. By default, Promiscuous mode is disabled. When Promiscuous mode is enabled the virtual machine’s network interfaces that are in the same portgroup will use the Promiscuous mode to view all network traffic that goes through that virtual switch. You can implement a workaround with either ESXi, or Hyper-V.

:::image type="content" source="../media/tutorial-install-components/purdue-model.png" alt-text="A screenshot of where in your architecture the sensor should be placed.":::

### Configure a SPAN port with ESXi

**To configure a SPAN port with ESXi**:

1. Open vSwitch properties.

1. Select **Add**.

1. Select **Virtual Machine** > **Next**.

1. Insert a network label **SPAN Network**, select **VLAN ID** > **All**, and then select **Next**.

1. Select **Finish**.

1. Select **SPAN Network** > **Edit*.

1. Select **Security**, and verify that the **Promiscuous Mode** policy is set to **Accept** mode.

1. Select **OK**, and then select **Close** to close the vSwitch properties.

1. Open the **XSense VM** properties.

1. For **Network Adapter 2**, select the **SPAN** network.

1. Select **OK**.

1. Connect to the sensor, and verify that mirroring works.

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) and [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](../how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](../how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](../how-to-install-software.md)
