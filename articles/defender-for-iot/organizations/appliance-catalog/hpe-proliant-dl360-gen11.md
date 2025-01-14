---
title: HPE ProLiant DL360 Gen 11 OT monitoring - Microsoft Defender for IoT
description: Learn about the HPE ProLiant DL360 Gen 11 appliance when used for OT monitoring with Microsoft Defender for IoT.
ms.date: 03/14/2024
ms.topic: reference
---

# HPE ProLiant DL360 Gen 11

This article describes the **HPE ProLiant DL360 Gen 11** appliance for OT sensors, customized for use with Microsoft Defender for IoT.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | C5600  |
|**Performance** | Max bandwidth: 3 Gbps <br> Max devices: 12,000 |
|**Physical specifications** | Mounting: 1U|
|**Status** | Supported, available preconfigured|

The following image displays the hardware elements on the HPE ProLiant DL360 Gen11 that are used by Defender for IoT:

:::image type="content" source="media/hpe-proliant-dl360-gen11/hpe-proliant-dl360-gen11.png" alt-text="Photo of the HPE ProLiant DL360 gen11." border="false":::

## Specifications

|Component  |Specifications|
|---------|---------|
|**Chassis**    |1U rack server         |
|**Physical Characteristics** | HPE DL360 Gen11 8SFF  |
|**Processor** | INT Xeon-S 4510 CPU for HPE OEM  |
|**Chipset** | Intel C262|
|**Memory** | 4 HPE 32GB (1x32GB) Dual Rank x8 DDR5-5600 CAS-46-45-45 EC8 Registered Smart Memory Kit |
|**Storage**| 6 HPE 2.4TB SAS 12G Mission Critical 10K SFF BC 3-year Warranty 512e Multi Vendor HDD |
|**Network controller**| On-board: 8 x 1 Gb |
|**Management**     | HPE iLO Advanced         |
|**Power**            |HPE 800W Flex Slot Titanium Hot Plug Low Halogen Power Supply Kit |
|**Rack support**     | HPE 1U Rail 3 kit        |

## HPE DL360 Gen 11 Plus (NHP 4SFF) - Bill of materials

|PN |Description |Quantity|
|-------------- | --------------| --------- |
|**P55428-B21** | HPE OEM ProLiant DL360 Gen11 SFF NC Configure-to-order Server |1|
|**P55428-B21#B19** | HPE OEM ProLiant DL360 Gen11 SFF NC Configure-to-order Server |1|
|**P67824-B21** | INT Xeon-S 4510 CPU for HPE OEM |2|
|**P64706-B21** | HPE 32GB (1x32GB) Dual Rank x8 DDR5-5600 CAS-46-45-45 EC8 Registered Smart Memory Kit |4|
|**P48896-B21** | HPE ProLiant DL360 Gen11 8SFF x4 U.3 Tri-Mode Backplane Kit |1|
|**P28352-B21** | HPE 2.4TB SAS 12G Mission Critical 10K SFF BC 3-year Warranty 512e Multi Vendor HDD |6|
|**P48901-B21** | HPE ProLiant DL360 Gen11 x16 Full Height Riser Kit |1|
|**P51178-B21** | Broadcom BCM5719 Ethernet 1Gb 4-port BASE-T Adapter for HPE |1|
|**P47789-B21** | HPE MR216i-o Gen11 x16 Lanes without Cache OCP SPDM Storage Controller |1|
|**P10097-B21** | Broadcom BCM57416 Ethernet 10Gb 2-port BASE-T OCP3 Adapter for HPE |1|
|**P48907-B21** | HPE ProLiant DL3X0 Gen11 1U Standard Fan Kit |1|
|**P54697-B21** | HPE ProLiant DL3X0 Gen11 1U 2P Standard Fan Kit |1|
|**865438-B21** | HPE 800W Flex Slot Titanium Hot Plug Low Halogen Power Supply Kit |2|
|**AF573A** | HPE C13 - C14 WW 250V 10Amp Flint Gray 2.0m Jumper Cord |2|
|**P48830-B21** | HPE ProLiant DL3XX Gen11 CPU2 to OCP2 x8 Enablement Kit  |1|
|**P52416-B21** | HPE ProLiant DL360 Gen11 OROC Tri-Mode Cable Kit |1|
|**BD505A** | HPE iLO Advanced 1-server License with 3yr Support on iLO Licensed Features |1|
|**P48904-B21** | HPE ProLiant DL3X0 Gen11 1U Standard Heat Sink Kit |2|
|**P52341-B21** | HPE ProLiant DL3XX Gen11 Easy Install Rail 3 Kit |1|

## HPE ProLiant DL360 Gen 11 installation

This section describes how to install OT sensor software on the HPE ProLiant DL360 Gen 11 appliance and includes adjusting the appliance's BIOS configuration.

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
