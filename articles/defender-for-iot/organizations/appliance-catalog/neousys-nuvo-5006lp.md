---
title: Neousys Nuvo-5006LP (SMB) - Microsoft Defender for IoT
description: Learn about the Neousys Nuvo-5006LP appliance for OT monitoring with Microsoft Defender for IoT.
ms.date: 04/24/2022
ms.topic: reference
---

# Neousys Nuvo-5006LP

This article describes the Neousys Nuvo-5006LP appliance for OT sensors.

> [!NOTE]
> Neousys Nuvo-5006LP is a legacy appliance, and is supported for Defender for IoT software up to the latest patch for versions [22.2.x](../release-notes.md#versions-222x). We recommend that you replace these appliances with newer certified models, such as the [YS-FIT2](ys-techsystems-ys-fit2.md) or [HPE DL20 (NHP 2LFF)](hpe-proliant-dl20-plus-smb.md).

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | L100 |
|**Performance** | Max bandwidth: 30 Mbps<br>Max devices: 400 |
|**Physical specifications** | Mounting: Mounting kit, Din Rail<br>Ports: 5x RJ45|
|**Status** | Supported up to the latest Defender for IoT software patch for versions [22.2.x](../release-notes.md#versions-222x)|

:::image type="content" source="../media/ot-system-requirements/cyberx.png" alt-text="Photo of a Neousys Nuvo-5006LP." border="false":::

The following image shows a view of the Nuvo 5006LP front panel:

:::image type="content" source="../media/tutorial-install-components/nuvo5006lp_frontpanel.png" alt-text="A photo of the front panel of the Nuvo 5006LP device." border="false":::

In this image, numbers indicate the following components:

1. Power button, Power indicator
1. DVI video connectors
1. HDMI video connectors
1. VGA video connectors
1. Remote on/off Control, and status LED output
1. Reset button
1. Management network adapter
1. Ports to receive mirrored data

The following image shows a view of the Nuvo 5006LP back panel:

:::image type="content" source="../media/tutorial-install-components/nuvo5006lp_backpanel.png" alt-text="A photo of the back panel of the Nuvo 5006lp." border="false":::

In this image, numbers indicate the following components:

1. SIM card slot
1. Microphone, and speakers
1. COM ports
1. USB connectors
1. DC power port (DC IN)

## Specifications

|Component|Technical Specifications|
|:----|:----|
|**Construction**|Aluminum, fanless and dust-proof design|
|**Dimensions**|240 mm (W) x 225 mm (D) x 77 mm (H)|
|**Weight**|3.1 kg (including CPU, memory, and HDD)|
|**CPU**|Intel Core i5-6500TE (6M Cache, up to 3.30 GHz) S1151|
|**Chipset**|Intel® Q170 Platform Controller Hub|
|**Memory**|8 GB DDR4 2133 MHz Wide Temperature SODIMM|
|**Storage**|128 GB 3ME3 Wide Temperature mSATA SSD|
|**Network controller**|Six-Gigabit Ethernet ports by Intel® I219|
|**Device access**|Four USBs: Two in front, two in the rear, and 1 internal|
|**Power Adapter**|120/240VAC-20VDC/6A|
|**Mounting**|Mounting kit, Din Rail|
|**Operating Temperature**|-25°C -  70°C|
|**Storage Temperature**|-40°C ~ 85°C|
|**Humidity**|10%~90%, non-condensing|
|**Vibration**|Operating, 5 Grms, 5-500 Hz, three Axes <br>(w/ SSD, according to IEC60068-2-64)|
|**Shock**|Operating, 50 Grms, Half-sine 11 ms Duration <br>(w/ SSD, according to IEC60068-2-27)|
|**EMC**|CE/FCC Class A, according to EN 55022, EN 55024 & EN 55032|


## Nuvo 5006LP sensor installation

This section describes how to install OT sensor software on the Nuvo 5006LP appliance. Before installing the OT sensor software, you must adjust the appliance's BIOS configuration.

> [!NOTE]
> Installation procedures are only relevant if you need to re-install software on a preconfigured device, or if you buy your own hardware and configure the appliance yourself.
>

### Prerequisites

Before installing OT sensor software, or updating the BIOS configuration, make sure that the operating system is installed on the appliance.

### Configure the Nuvo 5006LP BIOS

This procedure describes how to update the Nuvo 5006LP BIOS configuration for your OT sensor deployment.

**To configure the Nuvo 5006LP BIOS**:

1. Power on the appliance.

1. Press **F2** to enter the BIOS configuration.

1. Go to **Power** and change the **Power On after Power Failure** setting to **S0-Power On**.

    :::image type="content" source="../media/tutorial-install-components/nuvo-power-on.png" alt-text="Screenshot of setting your Nuvo 5006 to power on after a power failure.":::

1. Go to **Boot** and ensure that **PXE Boot to LAN** is set to **Disabled**.

1. Press **F10** to save, and then select **Exit**.

### Install OT sensor software on the Nuvo 5006LP

This procedure describes how to install OT sensor software on the Nuvo 5006LP. The installation takes approximately 20 minutes. After the installation is complete, the system restarts several times.

**To install OT sensor software**:

1. Connect an external CD or disk-on-key that contains the sensor software you downloaded from the Azure portal.

1. Boot the appliance.

1. Select **English**.

1. Select **XSENSE-RELEASE-\<version> Office...**.

1. Define the appliance architecture, and network properties as follows:

    | Parameter | Configuration |
    | ----------| ------------- |
    | **Hardware profile** | Select **office**. |
    | **Management interface** | **eth0** |
    | **Management network IP address** | **IP address provided by the customer** |
    | **Management subnet mask** | **IP address provided by the customer** |
    | **DNS** | **IP address provided by the customer** |
    | **Default gateway IP address** | **0.0.0.0** |
    | **Input interface** | The list of input interfaces is generated for you by the system. <br />To mirror the input interfaces, copy all the items presented in the list with a comma separator. |
    | **Bridge interface** | - |

    For example:

    :::image type="content" source="../media/tutorial-install-components/nuvo-profile-appliance.png" alt-text="Screenshot of the Nuvo's architecture and network properties.":::


1. Accept the settings and continue by entering `Y`.

After approximately 10 minutes, sign-in credentials are automatically generated. Save the username and passwords; you'll need these credentials to access the platform the first time you use it.

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../ot-deploy/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
