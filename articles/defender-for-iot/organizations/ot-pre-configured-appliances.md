---
title: Preconfigured appliances for OT network monitoring
description: Learn about the appliances available for use with Microsoft Defender for IoT OT sensors and on-premises management consoles.
ms.date: 07/11/2022
ms.topic: conceptual
---

# Pre-configured physical appliances for OT monitoring

This article provides a catalog of the pre-configured appliances available for Microsoft Defender for IoT OT sensors and on-premises management consoles.

Use the links in the tables below to jump to articles with more details about each appliance.

Microsoft has partnered with [Arrow Electronics](https://www.arrow.com/) to provide pre-configured sensors. To purchase a pre-configured sensor, contact Arrow at: [hardware.sales@arrow.com](mailto:hardware.sales@arrow.com?cc=DIoTHardwarePurchase@microsoft.com&subject=Information%20about%20MD4IoT%20pre-configured%20appliances).

For more information, see [Purchase sensors or download software for sensors](onboard-sensors.md#purchase-sensors-or-download-software-for-sensors).


## Advantages of preconfigured appliances

Pre-configured physical appliances have been validated for Defender for IoT OT system monitoring, and have the following advantages over installing your own software:

- **Performance** over the total assets monitored
- **Compatibility** with new Defender for IoT releases, with validations for upgrades and driver support
- **Stability**, validated physical appliances undergo traffic monitoring and packet loss tests
- **In-lab experience**, Microsoft support teams train using validated physical appliances and have a working knowledge of the hardware
- **Availability**, components are selected to offer long-term worldwide availability

## Appliances for OT network sensors

You can [order](mailto:hardware.sales@arrow.com?cc=DIoTHardwarePurchase@microsoft.com&subject=Information%20about%20MD4IoT%20pre-configured%20appliances). any of the following preconfigured appliances for monitoring your OT networks:

|Hardware profile  |Appliance  |Performance / Monitoring  |Physical specifications  |
|---------|---------|---------|---------|
|**C5600**   | [HPE ProLiant DL360](appliance-catalog/hpe-proliant-dl360.md)         |   **Max bandwidth**: 3Gbp/s <br>**Max devices**: 12,000    <br> 32 Cores/32G RAM/5.6TB     |  **Mounting**: 1U <br>**Ports**: 15x RJ45 or 8x SFP (OPT)     |
|**E1800**    | [HPE ProLiant DL20/DL20 Plus](appliance-catalog/hpe-proliant-dl20-plus-enterprise.md)  <br> (4SFF)     |  **Max bandwidth**: 1 Gbp/s<br>**Max devices**: 10,000 <br> 8 Cores/32G RAM/1.8TB     |  **Mounting**: 1U <br>**Ports**: 8x RJ45 or 6x SFP (OPT)         |
|**E500**    |  [Dell Edge 5200](appliance-catalog/dell-edge-5200.md)  <br> (Rugged MIL-STD-810G)    |      **Max bandwidth**: 1 Gbp/s<br>**Max devices**:  10,000   <br> 8 Cores/32G RAM/512GB     |  **Mounting**: Wall Mount<br>**Ports**: 3x RJ45         |
|**L500**    |  [HPE ProLiant DL20/DL20 Plus](appliance-catalog/hpe-proliant-dl20-plus-smb.md)  <br> (NHP 2LFF)    |      **Max bandwidth**: 200Mbp/s<br>**Max devices**:  1,000  <br> 4 Cores/8G RAM/500GB       |  **Mounting**: 1U<br>**Ports**: 4x RJ45         |
|**L100**     |  [YS-Techsystems YS-FIT2](appliance-catalog/ys-techsystems-ys-fit2.md) <br>(Rugged MIL-STD-810G)       |      **Max bandwidth**: 10Mbp/s <br>**Max devices**: 100   <br> 4 Cores/8G RAM/128GB      |  **Mounting**: DIN/VESA<br>**Ports**: 2x RJ45          |



> [!NOTE]
> Bandwidth performance may vary depending on protocol distribution.

## Appliances for on-premises management consoles

You can purchase any of the following appliances for your OT on-premises management consoles:

|Hardware profile |Appliance  |Max sensors  |Physical specifications  |
|---------|---------|---------|---------|
|**E1800**    | [HPE ProLiant DL20/DL20 Plus](appliance-catalog/hpe-proliant-dl20-plus-enterprise.md) <br> (4SFF)       | 300     |  **Mounting**: 1U <br>**Ports**: 8x RJ45 or 6x SFP (OPT)         |

## Next steps

Continue understanding system requirements for physical or virtual appliances. 

For more information, see [Which appliances do I need?](ot-appliance-sizing.md) and [OT monitoring with virtual appliances](ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](onboard-sensors.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)

Our OT monitoring appliance reference articles also include extra installation procedures in case you need to install software on your own appliances, or reinstall software on preconfigured appliances. For more information, see [OT monitoring appliance reference](appliance-catalog/index.yml).
