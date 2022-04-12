---
title: HPE ProLiant DL20 Plus for OT monitoring in enterprise deployments- Microsoft Defender for IoT
description: Learn about the HPE ProLiant DL20 Plus appliance when used for OT monitoring with Microsoft Defender for IoT in enterprise deployments.
ms.date: 04/04/2022
ms.topic: reference
---


# HPE ProLiant DL20/DL20 Plus

This article describes the **HPE ProLiant DL20 Plus** appliance for OT monitoring.

|Summary  | |
|---------|---------|
|**Architecture** | [Enterprise] |
|**Performance** | 	Max bandwidth: 1 Gbp/s <br>Max devices: 10,000 |
|**Physical Specifications** | Mounting: 1U <br> Ports: 8x RJ45 or 6x SFP (OPT)|
|**Status** | Supported, Available |

:::image type="content" source="media/ot-system-requirements/hpe-proliant-dl20-plus.png" alt-text="Photo of the DL20 Plus panel." border="false":::

### Specifications

|Component  |Specifications|
|---------|---------|
|Chassis     |1U rack server         |
|Dimensions   |Four 3.5" chassis: 4.29 x 43.46 x 38.22 cm  /  1.70 x 17.11 x 15.05 in         |
|Weight    | Max 7.9 kg / 17.41 lb        |

DL20 BOM
| PN | Description: high end | Quantity |
|--|--|--|
|1| P06963-B21 | HPE DL20 Gen10 4SFF CTO Server | 1 |
|1| P06963-B21 | HPE DL20 Gen10 4SFF CTO Server | 1 |
|1| P17104-L21 | HPE DL20 Gen10 E-2234 FIO Kit | 1 |
|2| 879507-B21 | HPE 16-GB 2Rx8 PC4-2666V-E STND Kit | 2 |
|3| 655710-B21 | HPE 1-TB SATA 7.2 K SFF SC DS HDD | 3 |
|1| P06667-B21 | HPE DL20 Gen10 x8x16 FLOM Riser Kit | 1 |
|1| 665240-B21 | HPE Ethernet 1-Gb 4-port 366FLR Adapter | 1 |
|1| 782961-B21 | HPE 12-W Smart Storage Battery | 1 |
|1| 869081-B21 | HPE Smart Array P408i-a SR G10 LH Controller | 1 |
|2| 865408-B21 | HPE 500-W FS Plat Hot Plug LH Power Supply Kit | 2 |
|1| 512485-B21 | HPE iLO Adv 1-Server License 1 Year Support | 1 |
|1| P06722-B21 | HPE DL20 Gen10 RPS Enablement FIO Kit | 1 |
|1| 775612-B21 | HPE 1U Short Friction Rail Kit | 1 |

DL20 Plus BOM
|Quantity|PN|Description|
|----|---|----|
|1|	P44111-B21|	HPE DL20 Gen10+ 4SFF CTO Svr|
|1|	P45252-B21|	Intel Xeon E-2334 FIO CPU for HPE|
|1|	869081-B21|	HPE Smart Array P408i-a SR G10 LH Ctrlr|
|1|	782961-B21|	HPE 12W Smart Storage Battery|
|1|	P45948-B21|	HPE DL20 Gen10+ RPS FIO Enable Kit|
|2|	865408-B21|	HPE 500W FS Plat Ht Plg LH Pwr Sply Kit|
|1|	775612-B21|	HPE 1U Short Friction Rail Kit|
|1|	512485-B21|	HPE iLO Adv 1-svr Lic 1yr Support|
|1|	P46114-B21|	HPE DL20 Gen10+ 2x8 LP FIO Riser Kit|
|1|	P21106-B21|	INT I350 1GbE 4p BASE-T Adptr|
|3|	P28610-B21|	HPE 1TB SATA 7.2K SFF BC HDD|
|2|	P43019-B21|	HPE 16GB 1Rx8 PC4-3200AA-E STND Kit|

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

:::image type="content" source="media/ot-system-requirements/dl20-profile-back-view.png" alt-text="Profile view of back of DL20." border="false":::

## HPE ProLiant DL20 installation

This section describes the HPE ProLiant DL20 installation process, which includes the following steps:

- Enable remote access and update the default administrator password.
- Configure BIOS and RAID settings.
- Install the software.

### About the installation

- Enterprise and SMB appliances can be installed. The installation process is identical for both appliance types, except for the array configuration.
- A default administrative user is provided. We recommend that you change the password during the network configuration process.
- During the network configuration process, you'll configure the iLO port on network port 1.
- The installation process takes about 20 minutes. After the installation, the system is restarted several times.

### HPE ProLiant DL20 front panel

:::image type="content" source="media/tutorial-install-components/hpe-proliant-dl20-front-panel-v2.png" alt-text="HPE ProLiant DL20 front panel.":::

### HPE ProLiant DL20 back panel

:::image type="content" source="media/tutorial-install-components/hpe-proliant-dl20-back-panel-v2.png" alt-text="The back panel of the HPE ProLiant DL20.":::

### Enable remote access and update the password

Use the following procedure to set up network options and update the default password.

**To enable, and update the password**:

1. Connect a screen, and a keyboard to the HP appliance, turn on the appliance, and press **F9**.

    :::image type="content" source="media/tutorial-install-components/hpe-proliant-screen-v2.png" alt-text="Screenshot that shows the HPE ProLiant window.":::

1. Go to **System Utilities** > **System Configuration** > **iLO 5 Configuration Utility** > **Network Options**.

    :::image type="content" source="media/tutorial-install-components/system-configuration-window-v2.png" alt-text="Screenshot that shows the System Configuration window.":::

    1. Select **Shared Network Port-LOM** from the **Network Interface Adapter** field.

    1. Disable DHCP.

    1. Enter the IP address, subnet mask, and gateway IP address.

1. Select **F10: Save**.

1. Select **Esc** to get back to the **iLO 5 Configuration Utility**, and then select **User Management**.

1. Select **Edit/Remove User**. The administrator is the only default user defined.

1. Change the default password and select **F10: Save**.

### Configure the HPE BIOS

The following procedure describes how to configure the HPE BIOS for the enterprise, and SMB appliances.

**To configure the HPE BIOS**:

1. Select **System Utilities** > **System Configuration** > **BIOS/Platform Configuration (RBSU)**.

1. In the **BIOS/Platform Configuration (RBSU)** form, select **Boot Options**.

1. Change **Boot Mode** to **Legacy BIOS Mode**, and then select **F10: Save**.

1. Select **Esc** twice to close the **System Configuration** form.

#### For the enterprise appliance

1. Select **Embedded RAID 1: HPE Smart Array P408i-a SR Gen 10** > **Array Configuration** > **Create Array**.

1. In the **Create Array** form, select all the options. Three options are available for the **Enterprise** appliance.

#### For the SMB appliance

1. Select **Embedded RAID 1: HPE Smart Array P208i-a SR Gen 10** > **Array Configuration** > **Create Array**.

1. Select **Proceed to Next Form**.

1. In the **Set RAID Level** form, set the level to **RAID 5** for enterprise deployments and **RAID 1** for SMB deployments.

1. Select **Proceed to Next Form**.

1. In the **Logical Drive Label** form, enter **Logical Drive 1**.

1. Select **Submit Changes**.

1. In the **Submit** form, select **Back to Main Menu**.

1. Select **F10: Save** and then press **Esc** twice.

1. In the **System Utilities** window, select **One-Time Boot Menu**.

1. In the **One-Time Boot Menu** form, select **Legacy BIOS One-Time Boot Menu**.

1. The **Booting in Legacy** and **Boot Override** windows appear. Choose a boot override option; for example, to a CD-ROM, USB, HDD, or UEFI shell.

    :::image type="content" source="media/tutorial-install-components/boot-override-window-one-v2.png" alt-text="Screenshot that shows the first Boot Override window.":::

    :::image type="content" source="media/tutorial-install-components/boot-override-window-two-v2.png" alt-text="Screenshot that shows the second Boot Override window.":::

### Software installation (HPE ProLiant DL20 appliance)

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

To install the software:

1. Connect the screen and keyboard to the appliance, and then connect to the CLI.

1. Connect an external CD or disk on the key with the ISO image that you downloaded from the **Updates** page of Defender for IoT in the Azure portal.

1. Start the appliance.

1. Follow the software installation instructions located [here](#install-the-software).
