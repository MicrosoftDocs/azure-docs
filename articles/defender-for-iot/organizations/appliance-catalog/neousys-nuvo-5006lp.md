---
title: Neousys Nuvo-5006LP (SMB) - Microsoft Defender for IoT
description: Learn about the Neousys Nuvo-5006LP appliance for OT monitoring with Microsoft Defender for IoT.
ms.date: 04/04/2022
ms.topic: reference
---

# Neousys Nuvo-5006LP

This article describes the Neousys Nuvo-5006LP appliance for OT sensors.

| Appliance characteristic |Details |
|---------|---------|
|**Architecture** | [SMB] |
|**Performance** | 	Max bandwidth: 30 Mbp/s<br>Max devices: 400 |
|**Physical specifications** | Mounting: Mounting kit, Din Rail<br>Ports: 5x RJ45|
|**Status** | Supported, Not available pre-configured|

:::image type="content" source="media/ot-system-requirements/cyberx.png" alt-text="Photo of a Neousys Nuvo-5006LP.":::

## Specifications

|Component|Technical Specifications|
|:----|:----|
|Construction|Aluminum, Fanless & Dust-proof Design|
|Dimensions|240 mm (W) x 225 mm (D) x 77 mm (H)|
|Weight|3.1 kg (incl. CPU, memory and HDD)|
|CPU|Intel Core i5-6500TE (6M Cache, up to 3.30 GHz) S1151|
|Chipset|Intel® Q170 Platform Controller Hub|
|Memory|8 GB DDR4 2133 MHz Wide Temperature SODIMM|
|Storage|128 GB 3ME3 Wide Temperature mSATA SSD|
|Network controller|Six-Gigabit Ethernet ports by Intel® I219|
|Device access|Four USBs: Two in front, two in the rear, and 1 internal|
|Power Adapter|120/240VAC-20VDC/6A|
|Mounting|Mounting kit, Din Rail|
|Operating Temperature|-25°C -  70°C|
|Storage Temperature|-40°C ~ 85°C|
|Humidity|10%~90%, non-condensing|
|Vibration|Operating, 5 Grms, 5-500 Hz, three Axes <br>(w/ SSD, according to IEC60068-2-64)|
|Shock|Operating, 50 Grms, Half-sine 11 ms Duration <br>(w/ SSD, according to IEC60068-2-27)|
|EMC|CE/FCC Class A, according to EN 55022, EN 55024 & EN 55032|


## Nuvo 5006LP installation

This section provides the Nuvo 5006LP installation procedure. Before installing the software on the Nuvo 5006LP appliance, you need to adjust the appliance BIOS configuration.

### Nuvo 5006LP front panel

:::image type="content" source="media/tutorial-install-components/nuvo5006lp_frontpanel.png" alt-text="A view of the front panel of the Nuvo 5006LP device.":::

1. Power button, Power indicator
1. DVI video connectors
1. HDMI video connectors
1. VGA video connectors
1. Remote on/off Control, and status LED output
1. Reset button
1. Management network adapter
1. Ports to receive mirrored data

### Nuvo back panel

:::image type="content" source="media/tutorial-install-components/nuvo5006lp_backpanel.png" alt-text="A view of the back panel of the Nuvo 5006lp.":::

1. SIM card slot
1. Microphone, and speakers
1. COM ports
1. USB connectors
1. DC power port (DC IN)

### Configure the Nuvo 5006LP BIOS

The following procedure describes how to configure the Nuvo 5006LP BIOS. Make sure the operating system was previously installed on the appliance.

**To configure the BIOS**:

1. Power on the appliance.

1. Press **F2** to enter the BIOS configuration.

1. Navigate to **Power** and change Power On after Power Failure to S0-Power On.

    :::image type="content" source="media/tutorial-install-components/nuvo-power-on.png" alt-text="Change your Nuvo 5006 to power on after a power failure.":::

1. Navigate to **Boot** and ensure that **PXE Boot to LAN** is set to **Disabled**.

1. Press **F10** to save, and then select **Exit**.

### Software installation (Nuvo 5006LP)

The installation process takes approximately 20 minutes. After installation, the system is restarted several times.

**To install the software**:

1. Connect the external CD, or disk on key with the ISO image.

1. Boot the appliance.

1. Select **English**.

1. Select **XSENSE-RELEASE-\<version> Office...**.

    :::image type="content" source="media/tutorial-install-components/sensor-version-select-screen-v2.png" alt-text="Select the version of the sensor to install.":::

1. Define the appliance architecture, and network properties:

    :::image type="content" source="media/tutorial-install-components/nuvo-profile-appliance.png" alt-text="Define the Nuvo's architecture and network properties.":::

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

1. Accept the settings and continue by entering `Y`.

After approximately 10 minutes, sign-in credentials are automatically generated. Save the username and passwords, you'll need these credentials to access the platform the first time you use it.

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)
