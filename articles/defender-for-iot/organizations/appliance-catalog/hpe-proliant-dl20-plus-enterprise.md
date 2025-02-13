---
title: HPE ProLiant DL20 Gen10 Plus for OT monitoring in enterprise deployments - Microsoft Defender for IoT
description: Learn about the HPE ProLiant DL20 Gen10 Plus appliance when used for OT monitoring with Microsoft Defender for IoT in enterprise deployments.
ms.date: 04/24/2022
ms.topic: reference
---

# HPE ProLiant DL20 Gen10 Plus (4SFF)

This article describes the **HPE ProLiant DL20 Gen10 Plus** appliance for OT sensors in an enterprise deployment.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | E1800 |
|**Performance** | 	Max bandwidth: 1 Gbps <br>Max devices: 10,000<br> Up to 8x RJ45 monitoring ports or 6x SFP (OPT) |
|**Physical specifications** | Mounting: 1U <br> Minimum dimensions (H x W x D) 1.70 x 17.11 x 15.05 in<br>Minimum dimensions (H x W x D) 4.32 x 43.46 x 38.22 cm|
|**Status** | Supported, available pre-configured |

The following image shows a sample of the HPE ProLiant DL20 front panel:

:::image type="content" source="../media/tutorial-install-components/hpe-proliant-dl20-front-panel-v2.png" alt-text="Photo of the HPE ProLiant DL20 front panel." border="false":::

The following image shows a sample of the HPE ProLiant DL20 back panel:

:::image type="content" source="../media/tutorial-install-components/hpe-proliant-dl20-back-panel-v2.png" alt-text="Photo of the back panel of the HPE ProLiant DL20." border="false":::

## Specifications

|Component|Technical specifications|
|----|----|
|Chassis|1U rack server|
|Physical Characteristics  | HPE DL20 Gen10+ NHP 4SFF CTO Server |
|Processor| Intel Xeon E-2334 <br> 3.4 GHz 4C 65 W|
|Chipset|Intel C256 |
|Memory|2x 16-GB Dual Rank x8 DDR4-3200|
|Storage|4x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 10 |
|Network controller|On-board: 2x 1 Gb|
|External| 1 x HPE Ethernet 1-Gb 4-port 366FLR Adapter|
|On-board| iLO Port Card 1 Gb|
|Management|HPE iLO Advanced|
|Device access| Front: One USB 3.0 1 x USB iLO Service Port<br> Rear: Two USBs 3.0|
|Internal| One USB 3.0|
|Power|2x Hot Plug Power Supply 290 W|
|Rack support|HPE 1U Short Friction Rail Kit|

## DL20 Gen10 Plus (4SFF) - Bill of materials

|Quantity|PN|Description|
|----|---|----|
|1|	P44111-B21 | HPE DL20 Gen10+ 4SFF CTO Server|
|1|	P45252-B21 | Intel Xeon E-2334 FIO CPU for HPE|
|4|	P28610-B21 | HPE 1-TB SATA 7.2K SFF BC HDD|
|2|	P43019-B21 | HPE 16 GB 1Rx8 PC4-3200AA-E Standard Kit|
|1|	869079-B21 | HPE Smart Array E208i-a SR G10 LH Ctrlr (RAID10)|
|1|	P21106-B21 | INT I350 1 GbE 4p BASE-T Adapter|
|1|	P45948-B21 | HPE DL20 Gen10+ RPS FIO Enable Kit|
|2|	865408-B21 | HPE 500 W FS Plat Hot Plug LH Power Supply Kit|
|1|	775612-B21 | HPE 1U Short Friction Rail Kit|
|1|	512485-B21 | HPE iLO Adv 1 Server License 1 year support|
|1|	P46114-B21 | HPE DL20 Gen10+ 2x8 LP FIO Riser Kit|

## Optional Storage Controllers
Multi-disk RAID arrays combine multiple physical drives into one logical drive for increased redundancy and performance. The optional modules below were tested in our lab for compatibility and sustained performance:

|Quantity|PN|Description|
|----|---|----|
|1| 869079-B21 | HPE Smart Array E208i-a SR G10 LH Ctrlr (RAID10) |
|1| P26325-B21 | Broadcom MegaRAID MR216i-a x16 Lanes without Cache NVMe/SAS 12G Controller (RAID5)<br><br>**Note**: This RAID controller occupies the PCIe expansion slot and doesn't allow expansion of networking port expansion |

## Optional port expansion
Optional modules for port expansion include:

|Location |Type|Specifications|
|--------------|--------------|---------|
| PCI Slot 1 (Low profile)  | DP F/O NIC |P26262-B21 - Broadcom BCM57414 Ethernet 10/25Gb 2-port SFP28 Adapter for HPE |
| PCI Slot 1 (Low profile)  | DP F/O NIC |P28787-B21 - Intel X710-DA2 Ethernet 10-Gb 2-port SFP+ Adapter for HPE |
| PCI Slot 2 (High profile) | Quad Port Ethernet NIC| P21106-B21 - Intel I350-T4 Ethernet 1-Gb 4-port BASE-T Adapter for HPE |
| PCI Slot 2 (High profile) | DP F/O NIC |P26262-B21 - Broadcom BCM57414 Ethernet 10/25 Gb 2-port SFP28 Adapter for HPE |
| PCI Slot 2 (High profile) | DP F/O NIC |P28787-B21 - Intel X710-DA2 Ethernet 10-Gb 2-port SFP+ Adapter for HPE |
| SFPs for Fiber Optic NICs|MultiMode, Short Range|455883-B21 - HPE BLc 10G SFP+ SR Transceiver|
| SFPs for Fiber Optic NICs|SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver|

## HPE ProLiant DL20 Gen10 Plus installation

This section describes how to install Defender for IoT software on the HPE ProLiant DL20 Gen10 Plus appliance.

Installation includes:

- Enabling remote access and updating the default administrator password
- Configuring iLO port on network port 1
- Configuring BIOS and RAID10 settings
- Installing Defender for IoT software

> [!NOTE]
> Installation procedures are only relevant if you need to re-install software on a pre-configured device, or if you buy your own hardware and configure the appliance yourself.
> 

### Enable remote access and update the password

Use the following procedure to set up network options and update the default password.

**To enable, and update the password**:

1. Connect a screen and a keyboard to the HPE appliance, turn on the appliance, and press **F9**.

    :::image type="content" source="../media/tutorial-install-components/hpe-proliant-screen-v2.png" alt-text="Screenshot that shows the HPE ProLiant window.":::

1. Go to **System Utilities** > **System Configuration** > **iLO 5 Configuration Utility** > **Network Options**.

    :::image type="content" source="../media/tutorial-install-components/system-configuration-window-v2.png" alt-text="Screenshot that shows the System Configuration window.":::

    1. Select **Shared Network Port-LOM** from the **Network Interface Adapter** field.

    1. Set **Enable DHCP** to **Off**.

    1. Enter the IP address, subnet mask, and gateway IP address.

1. Select **F10: Save**.

1. Select **Esc** to get back to the **iLO 5 Configuration Utility**, and then select **User Management**.

1. Select **Edit/Remove User**. The administrator is the only default user defined.

1. Change the default password and select **F10: Save**.

### Set up the BIOS and RAID array

This procedure describes how to configure the BIOS configuration for an unconfigured sensor appliance.
If any of the steps below are missing in the BIOS make sure that the hardware matches the specifications above.

HPE BIOS iLO is a system management software designed to give administrators control of HPE hardware remotely. It allows administrators to monitor system performance, configure settings, and troubleshoot hardware issues from a web browser. It can also be used to update system BIOS and firmware. The BIOS can be set up locally or remotely. To set up the BIOS remotely from a management computer, you need to define the HPE IP address and the management computer's IP address on the same subnet.


**To configure the HPE BIOS**:

1. Select **System Utilities** > **System Configuration** > **BIOS/Platform Configuration (RBSU)**.

1. In the **BIOS/Platform Configuration (RBSU)** form, select **Boot Options**.

1. Change **Boot Mode** to **UEFI BIOS Mode**, and then select **F10: Save**.

1. Select **Esc** twice to close the **System Configuration** form.

1. Select **Embedded RAID 1: HPE Smart Array E208i-a SR Gen 10** > **Array Configuration** > **Create Array**.

1. In the **Create Array** form, select all four disk options, and on the next page select **RAID10**.

> [!NOTE]
> For **Data-at-Rest** encryption, see HPE guidance for activating RAID SR Secure Encryption or using Self-Encrypting-Drives (SED).
>

[!INCLUDE [install iLO remotely from virtual drive and change timeout settings](../includes/ilo-remote-install-hpe.md)]

### Install Defender for IoT software on the HPE ProLiant DL20 Gen10 Plus

This procedure describes how to install Defender for IoT software on the HPE ProLiant DL20 Gen10 Plus.

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

**To install Defender for IoT software**:

1. Connect the screen and keyboard to the appliance, and then connect to the CLI.

1. Connect an external CD or disk-on-key that contains the software you downloaded from the Azure portal.

1. Start the appliance.

1. Continue with the generic procedure for installing Defender for IoT software. For more information, see [Defender for IoT software installation](../how-to-install-software.md).

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
