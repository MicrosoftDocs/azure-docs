---
title: Preconfigured appliances for OT network monitoring
description: Learn about the appliances available for use with Microsoft Defender for IoT OT sensors and on-premises management consoles.
ms.date: 07/11/2022
ms.topic: limits-and-quotas
---

# Pre-configured physical appliances for OT monitoring

This article is one in a series of articles describing the [deployment path](ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and lists the catalog of the pre-configured appliances available for Microsoft Defender for IoT OT appliances. Use the links in the tables below to jump to articles with more details about each appliance.

:::image type="content" source="media/deployment-paths/progress-plan-and-prepare.png" alt-text="Diagram of a progress bar with Plan and prepare highlighted." border="false" lightbox="media/deployment-paths/progress-plan-and-prepare.png":::

Microsoft has partnered with [Arrow Electronics](https://www.arrow.com/) to provide pre-configured appliances. To purchase a pre-configured appliance, contact Arrow at: [hardware.sales@arrow.com](mailto:hardware.sales@arrow.com?cc=DIoTHardwarePurchase@microsoft.com&subject=Information%20about%20Microsoft%20Defender%20for%20IoT%20pre-configured%20appliances&body=Dear%20Arrow%20Representative,%0D%0DOur%20organization%20is%20interested%20in%20receiving%20quotes%20for%20Microsoft%20Defender%20for%20IoT%20appliances%20as%20well%20as%20fulfillment%20options.%0D%0DThe%20purpose%20of%20this%20communication%20is%20to%20inform%20you%20of%20a%20project%20which%20involves%20[NUMBER]%20sites%20and%20[NUMBER]%20sensors%20for%20[ORGANIZATION%20NAME].%20Having%20reviewed%20potential%20appliances%20suitable%20for%20our%20project,%20we%20would%20like%20to%20obtain%20more%20information%20about:%20___________%0D%0D%0DI%20would%20appreciate%20being%20contacted%20by%20an%20Arrow%20representative%20to%20receive%20a%20quote%20for%20the%20items%20mentioned%20above.%0DI%20understand%20the%20quote%20and%20appliance%20delivery%20shall%20be%20in%20accordance%20with%20the%20relevant%20Arrow%20terms%20and%20conditions%20for%20Microsoft%20Defender%20for%20IoT%20pre-configured%20appliances.%0D%0D%0DBest%20Regards,%0D%0D%0D%0D%0D%0D//////////////////////////////%20%0D/////////%20Replace%20[NUMBER]%20with%20appropriate%20values%20related%20to%20your%20request.%0D/////////%20Replace%20[ORGANIZATION%20NAME]%20with%20the%20name%20of%20the%20organization%20you%20represent.%0D//////////////////////////////%0D%0D).

> [!NOTE]
> This article also includes information relevant for on-premises management consoles. For more information, see the [Air-gapped OT sensor management deployment path](ot-deploy/air-gapped-deploy.md).
> 
## Advantages of pre-configured appliances

Pre-configured physical appliances have been validated for Defender for IoT OT system monitoring, and have the following advantages over installing your own software:

- **Performance** over the total assets monitored
- **Compatibility** with new Defender for IoT releases, with validations for upgrades and driver support
- **Stability**, validated physical appliances undergo traffic monitoring and packet loss tests
- **In-lab experience**, Microsoft support teams train using validated physical appliances and have a working knowledge of the hardware
- **Availability**, components are selected to offer long-term worldwide availability

## Appliances for OT network sensors

You can [order](mailto:hardware.sales@arrow.com?cc=DIoTHardwarePurchase@microsoft.com&subject=Information%20about%20Microsoft%20Defender%20for%20IoT%20pre-configured%20appliances&body=Dear%20Arrow%20Representative,%0D%0DOur%20organization%20is%20interested%20in%20receiving%20quotes%20for%20Microsoft%20Defender%20for%20IoT%20appliances%20as%20well%20as%20fulfillment%20options.%0D%0DThe%20purpose%20of%20this%20communication%20is%20to%20inform%20you%20of%20a%20project%20which%20involves%20[NUMBER]%20sites%20and%20[NUMBER]%20sensors%20for%20[ORGANIZATION%20NAME].%20Having%20reviewed%20potential%20appliances%20suitable%20for%20our%20project,%20we%20would%20like%20to%20obtain%20more%20information%20about:%20___________%0D%0D%0DI%20would%20appreciate%20being%20contacted%20by%20an%20Arrow%20representative%20to%20receive%20a%20quote%20for%20the%20items%20mentioned%20above.%0DI%20understand%20the%20quote%20and%20appliance%20delivery%20shall%20be%20in%20accordance%20with%20the%20relevant%20Arrow%20terms%20and%20conditions%20for%20Microsoft%20Defender%20for%20IoT%20pre-configured%20appliances.%0D%0D%0DBest%20Regards,%0D%0D%0D%0D%0D%0D//////////////////////////////%20%0D/////////%20Replace%20[NUMBER]%20with%20appropriate%20values%20related%20to%20your%20request.%0D/////////%20Replace%20[ORGANIZATION%20NAME]%20with%20the%20name%20of%20the%20organization%20you%20represent.%0D//////////////////////////////%0D%0D) any of the following pre-configured appliances for monitoring your OT networks:

|Hardware profile  |Appliance  |SPAN/TAP throughput  |Physical specifications  |
|---------|---------|---------|---------|
|**C5600**   | [HPE ProLiant DL360](appliance-catalog/hpe-proliant-dl360.md)         |   **Max bandwidth**: Up to 3 Gbps <br>**Max devices**: 12K    <br> 32 Cores/32G RAM/5.6TB     |  **Mounting**: 1U <br>**Ports**: 15x RJ45 or 8x SFP (OPT)     |
|**E1800**    | [HPE ProLiant DL20 Gen10 Plus](appliance-catalog/hpe-proliant-dl20-plus-enterprise.md) (4SFF) <br><br> [Dell PowerEdge R350](appliance-catalog/dell-poweredge-r350-e1800.md)   |  **Max bandwidth**: Up to 1 Gbps<br>**Max devices**: 10K <br> 8 Cores/32G RAM/1.8TB     |  **Mounting**: 1U <br>**Ports**: 8x RJ45 or 6x SFP (OPT)         |
|**E500**    |  [Dell Edge 5200](appliance-catalog/dell-edge-5200.md)  <br> (Rugged MIL-STD-810G)    |      **Max bandwidth**: Up to 1 Gbps<br>**Max devices**:  10K   <br> 8 Cores/32G RAM/512GB     |  **Mounting**: Wall Mount<br>**Ports**: 3x RJ45         |
|**L500**    |  [HPE ProLiant DL20 Gen10 Plus](appliance-catalog/hpe-proliant-dl20-plus-smb.md)  <br> (NHP 2LFF)    |      **Max bandwidth**: Up to 200 Mbps<br>**Max devices**:  1,000  <br> 4 Cores/8G RAM/500GB       |  **Mounting**: 1U<br>**Ports**: 4x RJ45         |
|**L100**     |  [YS-Techsystems YS-FIT2](appliance-catalog/ys-techsystems-ys-fit2.md) <br>(Rugged MIL-STD-810G)       |      **Max bandwidth**: Up to 10 Mbps <br>**Max devices**: 100   <br> 4 Cores/8G RAM/128GB      |  **Mounting**: DIN/VESA<br>**Ports**: 2x RJ45          |

> [!NOTE]
> The performance, capacity, and activity of an OT/IoT network may vary depending on its size, capacity, protocols distribution, and overall activity. For deployments, it is important to factor in raw network speed, the size of the network to monitor, and application configuration. The selection of processors, memory, and network cards is heavily influenced by these deployment configurations. The amount of space needed on your disk will differ depending on how long you store data, and the amount and type of data you store. <br><br>
> *Performance values are presented as upper thresholds under the assumption of intermittent traffic profiles, such as those found in OT/IoT systems and machine-to-machine communication networks.*

## Appliances for on-premises management consoles

You can purchase any of the following appliances for your OT on-premises management consoles:

|Hardware profile |Appliance  |Max sensors  |Physical specifications  |
|---------|---------|---------|---------|
|**E1800**    | [HPE ProLiant DL20 Gen10 Plus](appliance-catalog/hpe-proliant-dl20-plus-enterprise.md) (4SFF) <br><br> [Dell PowerEdge R350](appliance-catalog/dell-poweredge-r350-e1800.md)       | 300     |  **Mounting**: 1U <br>**Ports**: 8x RJ45 or 6x SFP (OPT)         |

For information about previously supported legacy appliances, see the [appliance catalog](./appliance-catalog/index.yml).

## Next steps

> [!div class="step-by-step"]
> [« Prepare an OT site deployment](best-practices/plan-prepare-deploy.md)