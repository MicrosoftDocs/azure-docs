---
title: HPE ProLiant DL360 OT monitoring - Microsoft Defender for IoT
description: Learn about the HPE ProLiant DL360 appliance when used for OT monitoring with Microsoft Defender for IoT.
ms.date: 03/14/2024
ms.topic: reference
---

# HPE ProLiant DL360

This article describes the **HPE ProLiant DL360** appliance for OT sensors, customized for use with Microsoft Defender for IoT.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | C5600  |
|**Performance** | Max bandwidth: 3 Gbps <br> Max devices: 12,000 |
|**Physical specifications** | Mounting: 1U<br>Ports: 15x RJ45 or 8x SFP (OPT)|
|**Status** | Supported, available preconfigured|

The following image describes the hardware elements on the HPE ProLiant DL360 back panel that are used by Defender for IoT:

:::image type="content" source="../media/tutorial-install-components/hpe-proliant-dl360-back-panel.png" alt-text="Photo of the HPE ProLiant DL360 back panel." border="false":::

## Specifications

|Component  |Specifications|
|---------|---------|
|**Chassis**    |1U rack server         |
|**Dimensions**   |Four 3.5" chassis: 4.29 x 43.46 x 70.7 cm /  1.69 x 17.11 x 27.83 in         |
|**Weight**    | Max 16.72 kg / 35.86 lb        |
|**Chassis** |1U rack server|
|**Dimensions**| 42.9 x 43.46 x 70.7 cm / 1.69" x 17.11" x 27.83" in|
|**Weight**| Max 16.27 kg  / 35.86 lb |
|**Processor** | 2x Intel Xeon Silver 4215 R 3.2 GHz 11M cache 8c/16T 130 W|
|**Chipset**	| Intel C621|
|**Memory**	| 32 GB = Two 16-GB 2666MT/s DDR4 ECC UDIMM|
|**Storage**|	Six 1.2-TB SAS 12G Enterprise 10K SFF (2.5 in) in hot-plug hard drive - RAID 5|
|**Network controller**|	On-board: Two  1 Gb <br> On-board: iLO Port Card 1 Gb <br>External: One HPE Ethernet 1-Gb 4-port 366FLR adapter|
|**Management**     |HPE iLO Advanced         |
|**Device access**     | Two rear USB 3.0        |
|**One front**    | USB 2.0        |
|**One internal**    |USB 3.0         |
|**Power**            |Two HPE 500-W flex slot platinum hot plug low halogen power supply kit
|**Rack support**     | HPE 1U Gen10 SFF easy install rail kit        |


## HPE DL360 BOM

|PN	|Description	|Quantity|
|-------------- | --------------| --------- |
|**P19766-B21** 	| HPE DL360 Gen10 8SFF NC CTO Server	|1|
|**P19766-B21** 	| Europe - Multilingual Localization	|1|
|**P24479-L21** 	| Intel Xeon-S 4215 R FIO Kit for DL360 G10	|1|
|**P24479-B21** 	| Intel Xeon-S 4215 R Kit for DL360 Gen10	|1|
|**P00922-B21** 	| HPE 16-GB 2Rx8 PC4-2933Y-R Smart Kit	|2|
|**872479-B21** 	| HPE 1.2-TB SAS 10K SFF SC DS HDD	|6|
|**811546-B21** 	| HPE 1-GbE 4-p BASE-T I350 Adapter	|1|
|**P02377-B21** 	| HPE Smart Hybrid Capacitor w_ 145 mm Cable	|1|
|**804331-B21** 	| HPE Smart Array P408i-a SR Gen10 Controller	|1|
|**665240-B21** 	| HPE 1-GbE 4-p FLR-T I350 Adapter	|1|
|**871244-B21** 	| HPE DL360 Gen10 High Performance Fan Kit	|1|
|**865408-B21** 	| HPE 500-W FS Plat Hot Plug LH Power Supply Kit	|2|
|**512485-B21** 	| HPE iLO Adv 1-Server License 1 Year Support	|1|
|**874543-B21** 	| HPE 1U Gen10 SFF Easy Install Rail Kit	|1|

## Optional Storage Controllers
Multi-disk RAID arrays combine multiple physical drives into one logical drive for increased redundancy and performance. The optional modules below are tested in our lab for compatibility and sustained performance:

|Quantity|PN|Description|
|----|---|----|
|1| 804331-B21 | HPE Smart Array P408i-a SR Gen10 Controller (RAID10) |


## Optional port expansion
Optional modules for port expansion include:

|Location |Type|Specifications|
|-------------- | --------------| --------- |
| **PCI Slot 1 (Low profile)**| Quad Port Ethernet NIC| 811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI (FW 1.52)|
| **PCI Slot 1 (Low profile)**  | DP F/O NIC|727054-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter (FW 10.57.3)|
|**PCI Slot 2 (High profile)**| Quad Port Ethernet NIC|811546-B21 - HPE 1 GbE 4p BASE-T I350 Adapter SI (FW 1.52)|
|**PCI Slot 2 (High profile)**| Quad Port Ethernet NIC|647594-B21 - HPE 1 GbE 4p BASE-T BCM5719 Adapter (FW 5719-v1.45 NCSI v1.3.12.0)|
| **PCI Slot 2 (High profile)**|DP F/O NIC| 727055-B21 - HPE 10 GbE 2p FLR-SFP+ X710 Adapter (FW 10.57.3)|
| **PCI Slot 2 (High profile)**|DP F/O NIC| P08421-B21 - HPE Ethernet 10 Gb 2-port SFP+ BCM57414 Adapter (FW 214.4.9.6/pkg 214.0.286012)|
| **PCI Slot 2 (High profile)**|Quad Port F/O NIC| 869585-B21 - HPE 10 GbE 4p SFP+ X710 Adapter SI (FW 10.57.3)|
| **SFPs for Fiber Optic NICs**|MultiMode, Short Range| 455883-B21 - HPE BLc 10G SFP+ SR Transceiver|
|**SFPs for Fiber Optic NICs**|SingleMode, Long Range | 455886-B21 -  HPE BLc 10G SFP+ LR Transceiver|

> [!IMPORTANT]
> Verify NIC cards run with the firmware version described above or later.
> As described in the procedure below, it is also recommended to disable the LLDP Agent in the BIOS for each installed NIC.

## HPE ProLiant DL360 installation

This section describes how to install OT sensor software on the HPE ProLiant DL360 appliance and includes adjusting the appliance's BIOS configuration.

During this procedure, you configure the iLO port. We recommend that you also change the default password provided for the administrative user.

> [!NOTE]
> Installation procedures are only relevant if you need to re-install software on a pre-configured device, or if you buy your own hardware and configure the appliance yourself.
>

### Enable remote access and update the password

Use the following procedure to set up network options and update the default password.

**To enable and update the password**:

1. Connect a screen and a keyboard to the HP appliance, turn on the appliance, and press **F9**.

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
If any of the steps below are missing in the BIOS, make sure that the hardware matches the specifications above.

HPE BIOS iLO is a system management software designed to give administrators control of HPE hardware remotely. It allows administrators to monitor system performance, configure settings, and troubleshoot hardware issues from a web browser. It can also be used to update system BIOS and firmware. The BIOS can be set up locally or remotely. To set up the BIOS remotely from a management computer, you need to define the HPE IP address and the management computer's IP address on the same subnet.

**To configure the HPE BIOS**:
> [!IMPORTANT]
> Please make sure your server is using the HPE SPP 2022.03.1 (BIOS version U32 v2.6.2) or later.

1. Select **System Utilities** > **System Configuration** > **BIOS/Platform Configuration (RBSU)**.

1. In the **BIOS/Ethernet Adapter/NIC Configuration**, disable LLDP Agent for all NIC cards.

1. In the **BIOS/Platform Configuration (RBSU)** form, select **Boot Options**.

1. Change **Boot Mode** to **UEFI BIOS Mode**, and then select **F10: Save**.

1. Select **Esc** twice to close the **System Configuration** form.

1. Select **Embedded RAID1: HPE Smart Array P408i-a SR Gen 10** > **Array Configuration** > **Create Array**.

1. In the **Create Array** form, select all the drives, and enable RAID Level 5.

> [!NOTE]
> For **Data-at-Rest** encryption, see the HPE guidance for activating RAID Secure Encryption or using Self-Encrypting-Drives (SED).
>

[!INCLUDE [install iLO remotely from virtual drive and change timeout settings](../includes/ilo-remote-install-hpe.md)]

### Install OT sensor software on the HPE DL360

This procedure describes how to install OT sensor software on the HPE DL360. 

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

**To install OT sensor software**:

1. Connect a screen and keyboard to the appliance, and then connect to the CLI.

1. Connect an external CD or disk-on-key that contains the sensor software you downloaded from the Azure portal.

1. Continue with the generic procedure for installing OT sensor software. For more information, see [Defender for IoT software installation](../how-to-install-software.md).

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../legacy-central-management/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
