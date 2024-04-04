---
title: YS-techsystems YS-FIT2 for OT monitoring - Microsoft Defender for IoT
description: Learn about the YS-techsystems YS-FIT2 appliance when used for OT monitoring with Microsoft Defender for IoT.
ms.date: 04/24/2022
ms.topic: reference
---

# YS-techsystems YS-FIT2 (Rugged)

This article describes the **YS-techsystems YS-FIT2** appliance deployment and installation for OT sensors.

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | L100|
|**Performance** |  Max bandwidth: 10 Mbps<br>Max devices: 100|
|**Physical specifications** | Mounting: DIN/VESA<br>Ports: 2x RJ45|
|**Status** | Supported; Available as pre-configured |

The following image shows a view of the YS-FIT2 front panel:

:::image type="content" source="../media/tutorial-install-components/fitlet-front-panel.png" alt-text="A photo of the front panel of the YS-FIT2." border="false":::

The following image shows a view of the YS-FIT2 back panel:

:::image type="content" source="../media/tutorial-install-components/fitlet2-back-panel.png" alt-text="A photo of the back panel of the YS-FIT2." border="false":::

## Specifications

|Components|Technical specifications|
|:----|-----|
|Construction |Aluminum or zinc die-cast parts, fanless and dust-proof design
| Dimensions |112 mm (W) x 112 mm (D) x 25 mm (H)4.41in (W) x 4.41in (D) x 0.98 in (H)|
|Weight |0.35 kg |
| CPU |Intel Atom® x7-E3950 Processor |
| Memory |8 GB SODIMM 1 x 204-pin DDR3L non-ECC 1866 (1.35 V) |
| Storage |128 GB M.2 M-key 2260* or 2242 (SATA 3 6 Gbps) PLP|
|Network controller |Two 1 GbE LAN Ports |
| Device access |Two USB 2.0, Two USB 3.0 |
| Power Adapter |7V-20V (Optional 9V-36V) DC / 5W-15W Power AdapterVehicle DC cable for YS-FIT2 (Optional)|
|UPS|Fit-uptime Miniature 12 V UPS for miniPCs (Optional)|
|Mounting |VESA / wall or Din Rail mounting kit |
| Temperature |0°C ~ 60°C |
| Humidity |5% ~ 95%, non-condensing |
| Vibration  |IEC TR 60721-4-7:2001+A1:03, Class 7M1, test method IEC 60068-2-64 (up to 2 KHz, 3 axis)|
|Shock|IEC TR 60721-4-7:2001+A1:03, Class 7M1, test method IEC 60068-2-27 (15 g , 6 directions)|
|EMC |CE/FCC Class B|

## YS-FIT2 installation

This section describes how to install OT sensor software on the YS-FIT2 appliance. Before you install the OT sensor software, you must adjust the appliance's BIOS configuration.

> [!NOTE]
> Installation procedures are only relevant if you need to re-install software on a pre-configured device, or if you buy your own hardware and configure the appliance yourself.
>

### Configure the YS-FIT2 BIOS

This procedure describes how to update the YS-FIT2 BIOS configuration for your OT sensor deployment.

**To configure the YS-FIT2 BIOS**:

1. Power on the appliance and go to **Main** > **OS Selection**.

1. Press **+/-** to select **Linux**.

    :::image type="content" source="../media/tutorial-install-components/fitlet-linux.png" alt-text="Screenshot of setting the OS to Linux on your YS-FIT2.":::

1. Verify that the system date and time are updated with the installation date and time.

1. Go to **Advanced**, and select **ACPI Settings**.

1. Select **Enable Hibernation**, and press **+/-** to select **Disabled**.

    :::image type="content" source="../media/tutorial-install-components/disable-hibernation.png" alt-text="Screenshot of turning off the hibernation mode on your YS-FIT2.":::

1. Press **Esc**.

1. Go to **Advanced** > **TPM Configuration**.

1. Select **fTPM**, and press **+/-** to select **Disabled**.

1. Press **Esc**.

1. Go to **CPU Configuration** > **VT-d**.

1. Press **+/-** to select **Enabled**.

1. Go to **CSM Configuration** > **CSM Support**.

1. Press **+/-** to select **Enabled**.

1. Go to **Advanced** > **CSM Configuration** and change the setting in the following fields to **Legacy**:

    - Network
    - Storage
    - Video
    - Other PCI

    :::image type="content" source="../media/tutorial-install-components/legacy-only.png" alt-text="Screenshot of setting all fields to Legacy.":::

1. Press **Esc**.

1. Go to **Security** > **Secure Boot Customization**.

1. Press **+/-** to select **Disabled**.

1. Press **Esc**.

1. Go to **Boot** > **Boot mode** select, and select **UEFI**.

1. Select **Boot Option #1 – [USB CD/DVD]**.

1. Select **Save & Exit**.

### Install OT sensor software on the YS-FIT2

This procedure describes how to install OT sensor software on the YS-FIT2.

The installation takes approximately 20 minutes. After the installation is complete, the system restarts several times.

**To install OT sensor software**:

1. Connect an external CD or disk-on-key that contains the sensor software you downloaded from the Azure portal.

1. Boot the appliance.

1. Select **English**.

1. Select **XSENSE-RELEASE-\<version> Office...**.

1. Define the appliance architecture, and network properties:

    | Parameter | Configuration |
    | ----------| ------------- |
    | **Hardware profile** | Select **office**. |
    | **Management interface** | **em1** |
    | **Management network IP address** | **IP address provided by the customer** |
    | **Management subnet mask** | **IP address provided by the customer** |
    | **DNS** | **IP address provided by the customer** |
    | **Default gateway IP address** | **0.0.0.0** |
    | **Input interface** | The list of input interfaces is generated for you by the system. <br> To mirror the input interfaces, copy all the items presented in the list with a comma separator. |
    | **Bridge interface** | - |

    For more information, see [Install OT monitoring software](../how-to-install-software.md#install-ot-monitoring-software).

1. Accept the settings and continue by entering `Y`.

After approximately 10 minutes, sign-in credentials are automatically generated. Save the username and passwords, you'll need these credentials to access the platform the first time you use it.

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../legacy-central-management/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
