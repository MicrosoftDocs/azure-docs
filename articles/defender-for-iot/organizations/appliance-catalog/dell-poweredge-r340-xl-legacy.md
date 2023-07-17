---
title: Dell PowerEdge R340 XL for OT monitoring (legacy) - Microsoft Defender for IoT
description: Learn about the Dell PowerEdge R340 XL appliance's legacy configuration when used for OT monitoring with Microsoft Defender for IoT in enterprise deployments.
ms.date: 03/02/2023
ms.topic: reference
---

# Dell PowerEdge R340 XL

This article describes the Dell PowerEdge R340 XL appliance, supported for OT sensors and on-premises management consoles.

> [!NOTE]
> Legacy appliances are certified but aren't currently offered as pre-configured appliances.

|Appliance characteristic  | Description|
|---------|---------|
|**Hardware profile** | E1800|
|**Performance** | Max bandwidth: 1 Gbps<br>Max devices: 10,000 |
|**Physical Specifications** | Mounting: 1U<br>Ports: 8x RJ45 or 6x SFP (OPT)|
|**Status** | Supported, not available as a preconfigured appliance|

The following image shows a view of the Dell PowerEdge R340 front panel:

:::image type="content" source="../media/tutorial-install-components/view-of-dell-poweredge-r340-front-panel.jpg" alt-text="Photo of the Dell PowerEdge R340 front panel." border="false":::

In this image, numbers refer to the following components:

 1. Left control panel
 1. Optical drive (optional)
 1. Right control panel
 1. Information tag
 1. Drives

The following image shows a view of the Dell PowerEdge R340 back panel:

:::image type="content" source="../media/tutorial-install-components/view-of-dell-poweredge-r340-back-panel.jpg" alt-text="Photo of the Dell PowerEdge R340 back panel." border="false":::

In this image, numbers refer to the following components:

1. Serial port
1. NIC port (Gb 1)
1. NIC port (Gb 1)
1. Half-height PCIe
1. Full-height PCIe expansion card slot
1. Power supply unit 1
1. Power supply unit 2
1. System identification
1. System status indicator cable port (CMA) button
1. USB 3.0 port (2)
1. iDRAC9 dedicated network port
1. VGA port

## Specifications

|Component| Technical specifications|
|:----|:----|
|Chassis| 1U rack server|
|Dimensions| 42.8 x 434.0 x 596 (mm) /1.67” x 17.09” x 23.5” (in)|
|Weight| Max 29.98 lb/13.6 Kg|
|Processor| Intel Xeon E-2144G 3.6 GHz <br>8M cache <br> 4C/8T <br> turbo (71 W|
|Chipset|Intel C246|
|Memory|32 GB = Two 16 GB 2666MT/s DDR4 ECC UDIMM|
|Storage| Three 2 TB 7.2 K RPM SATA 6 Gbps 512n 3.5in Hot-plug Hard Drive - RAID 5|
|Network controller|On-board: Two 1 Gb Broadcom BCM5720 <br>On-board LOM: iDRAC Port Card 1 Gb Broadcom BCM5720 <br>External: One Intel Ethernet i350 QP 1 Gb Server Adapter Low Profile|
|Management|iDRAC nine Enterprise|
|Device access| Two rear USB 3.0|
|One front| USB 3.0|
|Power| Dual Hot Plug Power Supplies 350 W|
|Rack support| ReadyRails™ II sliding rails for tool-less mounting in four-post racks with square or unthreaded round holes. Or tooled mounting in four-post threaded hole racks with support for optional tool-less cable management arm.|

## Dell PowerEdgeR340XL installation

This section describes how to install Defender for IoT software on the Dell PowerEdgeR340XL appliance.

Before installing the software on the Dell appliance, you need to adjust the appliance's BIOS configuration.

> [!NOTE]
> Installation procedures are only relevant if you need to re-install software on a preconfigured device, or if you buy your own hardware and configure the appliance yourself.
>

### Prerequisites

To install the Dell PowerEdge R340XL appliance, you need:

- An Enterprise license for Dell Remote Access Controller (iDrac)

- A BIOS configuration XML

- One of the following server firmware versions:

  - BIOS version 2.1.6 or later
  - iDrac version 3.23.23.23 or later

### Configure the Dell BIOS

An integrated iDRAC manages the Dell appliance with Lifecycle Controller (LC). The LC is embedded in every Dell PowerEdge server and provides functionality that helps you deploy, update, monitor, and maintain your Dell PowerEdge appliances. 

To establish the communication between the Dell appliance and the management computer, you need to define the iDRAC IP address and the management computer's IP address on the same subnet.

When the connection is established, the BIOS is configurable.

**To configure the iDRAC IP address**:

1. Power up the sensor.

1. If the OS is already installed, select the F2 key to enter the BIOS configuration.

1. Select **iDRAC Settings**.

1. Select **Network**.

   > [!NOTE]
   > During the installation, you must configure the default iDRAC IP address and password mentioned in the following steps. After the installation, you change these definitions.

1. Change the static IPv4 address to **10.100.100.250**.

1. Change the static subnet mask to **255.255.255.0**.

   :::image type="content" source="../media/tutorial-install-components/idrac-network-settings-screen-v2.png" alt-text="Screenshot that shows the static subnet mask.":::

1. Select **Back** > **Finish**.

**To configure the Dell BIOS**:

This procedure describes how to update the Dell PowerEdge R340 XL configuration for your OT deployment.

Configure the appliance BIOS only if you didn't purchase your appliance from Arrow or if you have an appliance, but don't have access to the XML configuration file.

1. Access the appliance's BIOS directly by using a keyboard and screen, or use iDRAC.

   - If the appliance isn't a Defender for IoT appliance, open a browser and go to the IP address configured beforehand. Sign in with the Dell default administrator privileges. Use **root** for the username and **calvin** for the password.

   - If the appliance is a Defender for IoT appliance, sign in by using **XXX** for the username and **XXX** for the password.

1. After you access the BIOS, go to **Device Settings**.

1. Choose the RAID-controlled configuration by selecting **Integrated RAID controller 1: Dell PERC\<PERC H330 Adapter\> Configuration Utility**.

1. Select **Configuration Management**.

1. Select **Create Virtual Disk**.

1. In the **Select RAID Level** field, select **RAID5**. In the **Virtual Disk Name** field, enter **ROOT** and select **Physical Disks**.

1. Select **Check All** and then select **Apply Changes**

1. Select **Ok**.

1. Scroll down and select **Create Virtual Disk**.

1. Select the **Confirm** check box and select **Yes**.

1. Select **OK**.

1. Return to the main screen and select **System BIOS**.

1. Select **Boot Settings**.

1. For the **Boot Mode** option, select **BIOS**.

1. Select **Back**, and then select **Finish** to exit the BIOS settings.

### Install Defender for IoT software on the Dell R340

This procedure describes how to install Defender for IoT software on the HPE DL360.

The installation process takes about 20 minutes. After the installation, the system restarts several times.

**To install the software**:

1. Verify that the version media is mounted to the appliance in one of the following ways:

   - Connect an external CD or disk-on-key that contains the sensor software you downloaded from the Azure portal.

   - Mount the ISO image by using iDRAC. After signing in to iDRAC, select the virtual console, and then select **Virtual Media**.

1. In the **Map CD/DVD** section, select **Choose File**.

1. Choose the version ISO image file for this version from the dialog box that opens.

1. Select the **Map Device** button.

   :::image type="content" source="../media/tutorial-install-components/mapped-device-on-virtual-media-screen-v2.png" alt-text="Screenshot that shows a mapped device.":::

1. The media is mounted. Select **Close**.

1. Start the appliance. When you're using iDRAC, you can restart the servers by selecting the **Consul Control** button. Then, on the **Keyboard Macros**, select the **Apply** button, which will start the Ctrl+Alt+Delete sequence.

1. Continue by installing OT sensor or on-premises management software. For more information, see [Defender for IoT software installation](../how-to-install-software.md).

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../ot-deploy/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
