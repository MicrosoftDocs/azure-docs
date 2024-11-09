---
title: Dell Edge Gateway 3200 for operational technology (OT) monitoring - Microsoft Defender for IoT
description: Learn about the Dell Edge Gateway 3200 appliance's configuration when used for OT monitoring with Microsoft Defender for IoT in enterprise deployments.
ms.date: 07/14/2024
ms.topic: reference
---

# Dell Edge Gateway 3200

This article describes the Dell Edge Gateway 3200 appliance for operational technology (OT) sensors monitoring production lines. The Dell Edge Gateway 3200 is also available for the on-premises management console.

|Appliance characteristic  | Description|
|---------|---------|
|**Hardware profile** | L100|
|**Performance** | Max bandwidth: 10 Mbp/s<br>Max devices: 100 |
|**Physical Specifications** | Mounting: 1U with rail kit<br>Ports: 6x RJ45 1 GbE|
|**Status** | Supported, available as a preconfigured appliance|

The following image shows a view of the Dell Edge Gateway 3200 front panel:

:::image type="content" source="../media/tutorial-install-components/dell-3200-front.png" alt-text="Photograph of the Dell Edge Gateway 3200 front panel." border="false":::

The following image shows a view of the Dell Edge Gateway 3200 back panel:

:::image type="content" source="../media/tutorial-install-components/dell-3200-back.png" alt-text="Photograph of the Dell Edge Gateway 3200 back panel." border="false":::

## Specifications

|Component| Technical specifications|
|----|----|
|Chassis| 1U rack server |
|Dimensions| Height: 60 mm <br>Width: 162 cm<br>Depth: 108 mm |
|Processor| Intel Atom x6425RE |
|Memory|16 GB |
|Storage| 512 GB Hard Drive |
|Network controller| Ports: 2* 1 GbE RJ45 |
|Management|iDRAC Group Manager, Disabled |
|Rack support| Wall mount/ DIN rail support |

## Dell Edge Gateway 3200 - Bill of materials

|type|Description|
|----|----|
| Processor | Intel Atom® x6425RE |
|TDP | 12 W |
|# of Cores | 4 |
|Base Freq. | 1.9 Ghz |
|Max. Turbo Freq.| - |
|PCH | Elkhart Lake SoC   |
|Memory | 16 GB |
|Display | 2x DP++ |
|Ethernet | 1x 2.5 GbE, 1x GbE (1 GHz) |
|Serial ports| COM1/2: RS-232/422/485   |
|DI/O | 6-ch DI and 6-ch DO |
|USB | 4x external USB 3.1 Gen1 |
|Audio | Line-out, mic-in  |
|Mini PCIe   | 1x full size 3050 |
|M.2 | Socket 1: for module with A/A+E key<br>Socket 2: for module with B/B+M key <br>Socket 3: for module with M key   |
|Sensor Suite  | Accelerometer, humidity, pressure, temperature |
|Wafer | 1x (signal: 2x I2C, 1x USB 2.0) |
|USIM   | 2x nanoSIM slot |
|TPM   | TPM 2.0 |
|Disk| 1x M.2 SSD on M.2 Socket 3 |
|Dimensions   | 162 mm (W) x 108 mm (D) x 60 mm (H) |
|Weight   | Net: 1.2 kg; gross: 1.7 kg  |
|Mounting | Wall mount / DIN rail supported |
|DC Input | 9–36 V (±10% tolerance)   |
|AC Input | Optional: 120 W, 60 W (for PoE) AC-to-DC adapter |
|Operating temperature | –20°C to 60°C (with airflow 0.6 m/s) |
|Storage temperature | –40°C to 85°C (excluding storage devices) |
|Altitude | Operational (maximum, unpressurized): -15.20 m to 5,000 m<br> Note: The maximum temperature is derated 1C/305m above sea level altitude  |
|Humidity| ~95% at 40C (non-condensing) |
|Vibration| MIL-STD-810G METHOD 514.6 category 4 - common carrier (US highway truck vibration exposure) |
|Shock| 1. IEC 60068-2-27, half-sine pulse test parameters<br>2. 20G, MIL-STD-810G 516.6 Table 516.6-II, sawtooth pulse test parameters |
|IP rating | IP40 |
|EMC | CE, FCC, and EN61000-6-4/-6-2 |
| Safety | UL, CB by UL  |

>[!Important]
>
>When ordering hardware from a vendor, check that the bill of materials is unchanged from the details listed here, as vendors might change parts which can affect sensor performance.

## Install Defender for IoT software on the Dell Edge Gateway 3200

This procedure describes how to install Defender for IoT software on the Dell Edge Gateway 3200.

The installation process takes about 20 minutes. During the installation, the system restarts several times.

To install Defender for IoT software:

1. Connect the screen and keyboard to the appliance, and then connect to the CLI.

1. Connect an external CD or disk-on-key that contains the software you downloaded from the Azure portal.

1. Start the appliance.

1. Continue with the generic procedure for installing Defender for IoT software. For more information, see [Defender for IoT software installation](../how-to-install-software.md).

## Next steps

Continue learning about the system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md).

Then, use any of the following procedures to continue:

- [Download software for an OT sensor](../ot-deploy/install-software-ot-sensor.md#download-software-files-from-the-azure-portal)
- [Download software files for an on-premises management console](../legacy-central-management/install-software-on-premises-management-console.md#download-software-files-from-the-azure-portal)
