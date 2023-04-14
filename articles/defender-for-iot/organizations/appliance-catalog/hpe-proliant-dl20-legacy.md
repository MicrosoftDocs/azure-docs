---
title: HPE ProLiant DL20 for OT monitoring in enterprise deployments - Microsoft Defender for IoT
description: Learn about the HPE ProLiant DL20 appliance when used for OT monitoring with Microsoft Defender for IoT in enterprise deployments.
ms.date: 10/30/2022
ms.topic: reference
---

# HPE ProLiant DL20 Gen10

This article describes the **HPE ProLiant DL20 Gen10** appliance for OT sensors in an enterprise deployment.

> [!NOTE]
> Legacy appliances are certified but aren't currently offered as pre-configured appliances.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | E1800 |
|**Performance** | Max bandwidth: 1 Gbps <br>Max devices: 10,000 |
|**Physical specifications** | Mounting: 1U <br> Ports: 8x RJ45 or 6x SFP (OPT)|
|**Status** | Supported, not available pre-configured |

The following image shows a sample of the HPE ProLiant DL20 front panel:

:::image type="content" source="../media/tutorial-install-components/hpe-proliant-dl20-front-panel-v2.png" alt-text="Photo of the HPE ProLiant DL20 front panel." border="false":::

The following image shows a sample of the HPE ProLiant DL20 back panel:

:::image type="content" source="../media/tutorial-install-components/hpe-proliant-dl20-back-panel-v2.png" alt-text="Photo of the back panel of the HPE ProLiant DL20." border="false":::

## Specifications

|Component  |Specifications|
|---------|---------|
|Chassis     |1U rack server         |
|Dimensions   |Four 3.5" chassis: 4.29 x 43.46 x 38.22 cm  /  1.70 x 17.11 x 15.05 in         |
|Weight    | Max 7.9 kg / 17.41 lb        |

## DL20 Gen10 BOM

| Quantity | PN| Description: high end |
|--|--|--|
|1| P06963-B21 | HPE DL20 Gen10 4SFF CTO Server |
|1| P17104-L21 | HPE DL20 Gen10 E-2234 FIO Kit |
|2| 879507-B21 | HPE 16-GB 2Rx8 PC4-2666V-E STND Kit |
|3| 655710-B21 | HPE 1-TB SATA 7.2 K SFF SC DS HDD |
|1| P06667-B21 | HPE DL20 Gen10 x8x16 FLOM Riser Kit |
|1| 665240-B21 | HPE Ethernet 1-Gb 4-port 366FLR Adapter |
|1| 782961-B21 | HPE 12-W Smart Storage Battery |
|1| 869081-B21 | HPE Smart Array P408i-a SR G10 LH Controller |
|2| 865408-B21 | HPE 500-W FS Plat Hot Plug LH Power Supply Kit |
|1| 512485-B21 | HPE iLO Adv 1-Server License 1 Year Support |
|1| P06722-B21 | HPE DL20 Gen10 RPS Enablement FIO Kit |
|1| 775612-B21 | HPE 1U Short Friction Rail Kit |

## Port expansion

Optional modules for port expansion include:

|Location |Type|Specifications|
|-------------- | --------------| --------- |
| PCI Slot 1 (Low profile)| Quad Port Ethernet NIC| 811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI |
| PCI Slot 1 (Low profile)  | DP F/O NIC|727054-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter|
| PCI Slot 2 (High profile)| Quad Port Ethernet NIC|811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI|
| PCI Slot 2 (High profile)|DP F/O NIC| 727054-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter|
| PCI Slot 2 (High profile)|Quad Port F/O NIC| 869585-B21 - HPE 10 GbE 4p SFP+ X710 Adapter SI|
| SFPs for Fiber Optic NICs|MultiMode, Short Range|455883-B21 - HPE BLc 10G SFP+ SR Transceiver|
| SFPs for Fiber Optic NICs|SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver|

## HPE ProLiant DL20 Gen10 installation

This section describes how to install Defender for IoT software on the HPE ProLiant DL20 Gen10 appliance.

Installation includes:

- Enabling remote access and updating the default administrator password
- Configuring iLO port on network port 1
- Configuring BIOS and RAID settings
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

### Configure the HPE BIOS

This procedure describes how to update the HPE BIOS configuration for your OT deployment.

**To configure the HPE BIOS**:

1. Select **System Utilities** > **System Configuration** > **BIOS/Platform Configuration (RBSU)**.

1. In the **BIOS/Platform Configuration (RBSU)** form, select **Boot Options**.

1. Change **Boot Mode** to **Legacy BIOS Mode**, and then select **F10: Save**.

1. Select **Esc** twice to close the **System Configuration** form.

1. Select **Embedded RAID 1: HPE Smart Array P408i-a SR Gen 10** > **Array Configuration** > **Create Array**.

1. In the **Create Array** form, select all four disk options, and on the next page select **RAID10**.

> [!NOTE]
> For **Data-at-Rest** encryption, see the HPE guidance for activating RAID Secure Encryption or using Self-Encrypting-Drives (SED).
>

### Install Defender for IoT software on the HPE ProLiant DL20 Gen10

This procedure describes how to install Defender for IoT software on the HPE ProLiant DL20 Gen10

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
- [Download software files for an on-premises management console](../ot-deploy/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
