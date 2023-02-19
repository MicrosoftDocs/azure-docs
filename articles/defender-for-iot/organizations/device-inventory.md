---
title: Device inventory - Microsoft Defender for IoT
description: Learn about the Defender for IoT device inventory features available from the Azure portal, OT sensor console, and the on-premises management console.
ms.date: 02/19/2023
ms.topic: conceptual
---

# Defender for IoT device inventory

Defender for IoT's device inventory helps you identify details about specific devices, such as manufacturer, type, serial number, firmware, and more. Gathering details about your devices helps your teams proactively investigate vulnerabilities that can compromise your most critical assets.

- **Manage all your IoT/OT devices** by building up-to-date inventory that includes all your managed and unmanaged devices

- **Protect devices with risk-based approach** to identify risks such as missing patches, vulnerabilities and prioritize fixes based on risk scoring and automated threat modeling

- **Update your inventory** by deleting irrelevant devices and adding organization-specific information to emphasize your organization preferences

For example: <!--add image from Azure-->

## Device management options

The Defender for IoT device inventory is available in the Azure portal, OT network sensor consoles, and the on-premises management console.

While you can view device details from any of these locations, each location also offers extra device inventory support. The following table describes the device inventory visible supported for each location and the extra actions available from that location only:

|Location  |Description   | Extra alert actions |
|---------|---------|---------|
|**Azure portal**     | Devices detected from all cloud-connected OT sensors and Enterprise IoT sensors. <br><br>If you have an [Enterprise IoT plan](eiot-defender-for-endpoint.md) on your Azure subscription, the device inventory also includes devices detected by Defender for Endpoint agents.  <br><br>If you also use [Microsoft Sentinel](iot-solution.md), incidents in Microsoft Sentinel are linked to related devices in Defender for IoT.       |     Use out-of-the-box workbooks for visibility into all cloud-connected device inventory, including related alerts and vulnerabilities     |
|**OT network sensor consoles**     |   Devices detected by that OT sensor      |    - View all detected devices across a network device map<br>- View related events on the **Event timeline**  <!--what else?--> |
|**An on-premises management console**     |  Devices detected across all connected OT sensors          |  <!--what else?-->  |

## Supported device categories

Defender for IoT's device inventories support the following categories of device types, across the Azure portal, OT network sensor, and on-premises management console.

<!--what about EIoT?-->

|Name  |Examples  |
|---------|---------|
|**Network devices**     |  Switches, routers, controllers, or access points       |
|**Endpoint devices**     |  Workstations, servers, or mobile devices       |
|**IoT devices**     |  |
|Printing devices         |   Scanners, all-in-one printers, or printer servers       |
|Audio and video devices     |   Smart TVs, speakers, digital signage, or headsets      |
|Surveillance devices     |    DVRs, cameras, or video encoders / decoders     |
|Communication devices     |   VoIP phones, intercoms, analog telephone adapters      |
|Smart appliance devices     |  Smart lights, smart switches, clocks, barcode scanners        |
|Smart facility devices     |  Doors, fire alarms, elevators, turnstiles, HVAC systems       |
|Miscellaneous devices     | Smart watches, ebook readers, Arduino devices, oscilloscopes     |
|**OT devices**     |         |
|Industrial devices     |  PLCs, historian devices, HMIs, robot controllers, slots, programmable boards       |
|Operational equiptment    | Industrial printers, scales, pneumatic devices, packaging systems        |

Devices that don't have built-in categories and types are listed as *Unclassified* devices.

## Unauthorized devices

When you're first working with Defender for IoT, during the learning period just after deploying a sensor, all devices detected are identified as *authorized* devices.

After the learning period is over, any new devices detected are identified as *unauthorized* and *new* devices. We recommend checking these devices carefully for risks and vulnerabilities. For example, in the Azure portal, filter the device inventory for `Authorization == **Unauthorized**`. On the device details page, drill down and check for related vulnerabilities, alerts, and recommendations.

While the *new* status is removed if you edit the device details or move the device on an OT sensor device map, the *unauthorized* label remains until you manually mark the device as *authorized*. <!--how do you do this? only on a sensor maybe?-->

On an OT sensor, authorized devices are also included in the following reports:

- [Attack vector reports](how-to-create-attack-vector-reports.md): Devices marked as *unauthorized* are included in an attack vector simulation as suspected rogue devices that might be a threat to the network.

- [Risk assessment reports](how-to-create-risk-assessment-reports.md): Devices marked as *unauthorized* are listed in risk assesment reports as their risks to your network require investigation.

## Important OT devices

Mark OT devices as *important* on an OT network sensor, in the **Device map** page.  Devices you mark as important on your sensor are also marked as important in the Device inventory on the Defender for IoT portal on Azure. For example: <!--fix image does this really need to be here?-->

:::image type="content" source="media/how-to-work-with-maps/important-devices-on-cloud.png" alt-text="Screenshot of the Device inventory page in the Azure portal showing important devices." lightbox="media/how-to-work-with-maps/important-devices-on-cloud.png":::

Important devices are also listed on an OT sensor's [Risk assessment](how-to-create-risk-assessment-reports.md) and [Attack vector ](how-to-create-attack-vector-reports.md)reports:

- In risk assessment reports, *important* devices are considered when calculating security scores
- In attack vector reports, *important* devices are resolved as *attack targets*.

## Built-in device groups

The following device groups are available by default, depending on the devices detected by your OT sensor.

| Group name | Description |
|--|--|
| **Attack vector simulations** | Vulnerable devices detected in attack vector reports, where the **Show in Device Map** option is [toggled on](how-to-create-attack-vector-reports.md).|
| **Authorization** | Devices that were discovered in the network during the learning process or were officially authorized on the network. |
| **Cross subnet connections** | Devices that communicate from one subnet to another subnet. |
| **Device inventory filters** | Any devices based on a [filter](how-to-investigate-sensor-detections-in-a-device-inventory.md) created in the OT sensor's **Device inventory** page. |
| **Known applications** | Devices that use reserved ports, such as TCP.  |
| **Last activity** | Devices grouped by the time frame they were last active, for example: One hour, six hours, one day, or seven days. |
| **Non-standard ports** | Devices that use non-standard ports or ports that haven't been assigned an alias. |
| **Not In Active Directory** | All non-PLC devices that aren't communicating with the Active Directory. |
| **OT protocols** | Devices that handle known OT traffic. |
| **Polling intervals** | Devices grouped by polling intervals. The polling intervals are generated automatically according to cyclic channels or periods. For example, 15.0 seconds, 3.0 seconds, 1.5 seconds, or any other interval. Reviewing this information helps you learn if systems are polling too quickly or slowly. |
| **Programming** | Engineering stations, and programming machines. |
| **Subnets** | Devices that belong to a specific subnet. |
| **VLAN** | Devices associated with a specific VLAN ID. |

## Device inventory column data

TBD
## Next steps