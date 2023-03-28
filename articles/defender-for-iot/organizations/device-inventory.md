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

For example:

:::image type="content" source="media/device-inventory/azure-device-inventory.png" alt-text="Screenshot of the Defender for IoT Device inventory page in the Azure portal." lightbox="media/device-inventory/azure-device-inventory.png":::


## Supported devices

Defender for IoT's device inventory supports the following device classes:

|Devices  |For example ... |
|---------|---------|
|**Manufacturing**| Industrial and operational devices, such as pneumatic devices,  packaging systems, industrial packaging systems, industrial robots        |
|**Building**     | Access panels,  surveillance devices, HVAC systems, elevators, smart lighting systems    |
|**Health care**     |  Glucose meters, monitors       |
|**Transportation / Utilities**     |  Turnstiles, people counters, motion sensors, fire and safety systems, intercoms       |
|**Energy and resources**     |  DCS controllers, PLCs, historian devices, HMIs      |
|**Endpoint devices**     |  Workstations, servers, or mobile devices        |
| **Enterprise** | Smart devices, printers,  communication devices, or audio/video devices |
| **Retail** | Barcode scanners, humidity sensor, punch clocks | 

A *transient* device type indicates a device that was detected for only a short time. We recommend investigating these devices carefully to understand their impact on your network.

*Unclassified* devices are devices that don't otherwise have an out-of-the-box category defined.

## Device management options

The Defender for IoT device inventory is available in the Azure portal, OT network sensor consoles, and the on-premises management console.

While you can view device details from any of these locations, each location also offers extra device inventory support. The following table describes the device inventory support for each location and the extra actions available from that location only:

|Location  |Description   | Extra inventory support |
|---------|---------|---------|
|**Azure portal**     | Devices detected from all cloud-connected OT sensors and Enterprise IoT sensors. <br><br>      |     - If you have an [Enterprise IoT plan](eiot-defender-for-endpoint.md) on your Azure subscription, the device inventory also includes devices detected by Microsoft Defender for Endpoint agents.  <br><br>- If you also use [Microsoft Sentinel](iot-solution.md), incidents in Microsoft Sentinel are linked to related devices in Defender for IoT. <br><br>- Use Defender for IoT [workbooks](workbooks.md) for visibility into all cloud-connected device inventory, including related alerts and vulnerabilities.     |
|**OT network sensor consoles**     |   Devices detected by that OT sensor      |    - View all detected devices across a network device map<br><br>- View related events on the **Event timeline** |
|**An on-premises management console**     |  Devices detected across all connected OT sensors          | Enhance device data by importing data manually or via script  |

For more information, see:

- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

> [!NOTE]
> If you have an [Enterprise IoT plan](eiot-defender-for-endpoint.md) to [integrate with Microsoft Defender for Endpoint](concept-enterprise.md), devices detected by an Enterprise IoT sensor are also listed in Defender for Endpoint. For more information, see:
> 
> - [Defender for Endpoint device inventory](/microsoft-365/security/defender-endpoint/machines-view-overview)
> - [Defender for Endpoint device discovery](/microsoft-365/security/defender-endpoint/device-discovery)
>

## Automatically consolidated devices

When you've deployed Defender for IoT at scale, with several OT sensors, each sensor might detect different aspects of the same device. To prevent duplicated devices in your device inventory, Defender for IoT assumes that any devices found in the same zone, with a logical combination of similar characteristics, is the same device. Defender for IoT automatically consolidates these devices and lists them only once in the device inventory.

For example, any devices with the same IP and MAC address detected in the same zone are consolidated and identified as a single device in the device inventory. If you have separate devices from recurring IP addresses that are detected by multiple sensors, you'll want each of these devices to be identified separately. In such cases, [onboard your OT sensors](onboard-sensors.md) to different zones so that each device is identified as a separate and unique device, even if they have the same IP address. Devices that have the same MAC addresses, but different IP addresses are not merged, and continue to be listed as unique devices.

A *transient* device type indicates a device that was detected for only a short time. We recommend investigating these devices carefully to understand their impact on your network.

*Unclassified* devices are devices that don't otherwise have an out-of-the-box category defined.

> [!TIP]
> Define [sites and zones](best-practices/plan-corporate-monitoring.md#plan-ot-sites-and-zones) in Defender for IoT to harden overall network security, follow principles of [Zero Trust](/security/zero-trust/), and gain clarity in the data detected by your sensors.
>

## Unauthorized devices

When you're first working with Defender for IoT, during the learning period just after deploying a sensor, all devices detected are identified as *authorized* devices.

After the learning period is over, any new devices detected are considered to be  *unauthorized* and *new* devices. We recommend checking these devices carefully for risks and vulnerabilities. For example, in the Azure portal, filter the device inventory for `Authorization == **Unauthorized**`. On the device details page, drill down and check for related vulnerabilities, alerts, and recommendations.

The *new* status is removed as soon as you edit any of the device details or move the device on an OT sensor device map. In contrast, the *unauthorized* label remains until you manually edit the device details and mark it as *authorized*.

On an OT sensor, unauthorized devices are also included in the following reports:

- [Attack vector reports](how-to-create-attack-vector-reports.md): Devices marked as *unauthorized* are included in an attack vector simulation as suspected rogue devices that might be a threat to the network.

- [Risk assessment reports](how-to-create-risk-assessment-reports.md): Devices marked as *unauthorized* are listed in risk assessment reports as their risks to your network require investigation.

## Important OT devices

Mark OT devices as *important* to highlight them for extra tracking. On an OT sensor, important devices are included in the following reports:

- [Attack vector reports](how-to-create-attack-vector-reports.md): Devices marked as *important* are included in an attack vector simulation as possible attack targets.

- [Risk assessment reports](how-to-create-risk-assessment-reports.md): Devices marked as *important* are counted in risk assessment reports when calculating security scores.

## Device inventory column data

The following table lists the columns available in the Defender for IoT device inventory on the Azure portal. Starred items **(*)** are also available from the OT sensor.

|Name  |Description
|---------|---------|
|**Authorization** *   |Editable. Determines whether or not the device is marked as *authorized*. This value may need to change as the device security changes.  |
|**Business Function**     | Editable. Describes the device's business function. |
| **Class** | Editable. The device's class. <br>Default: `IoT` |
|**Data source** | The source of the data, such as a micro agent, OT sensor, or Microsoft Defender for Endpoint. <br>Default: `MicroAgent`|
|**Description** * | Editable. The device's description.  |
| **Device Id** | The device's Azure-assigned ID number. |
|  **Firmware model** |  The device's firmware model.|
| **Firmware vendor** | Editable. The vendor of the device's firmware. |
| **Firmware version** * |Editable.  The device's firmware version. |
|**First seen**  * | The date and time the device was first seen. Shown in `MM/DD/YYYY HH:MM:SS AM/PM` format. On the OT sensor, shown as **Discovered**.|
|**Importance** | Editable. The device's important level: `Low`, `Medium`, or `High`.   |
| **IPv4 Address** | The device's IPv4 address. |
|**IPv6 Address** | The device's IPv6 address.|
|**Last activity** * | The date and time the device last sent an event through to Azure or to the OT sensor, depending on where you're viewing the device inventory. Shown in `MM/DD/YYYY HH:MM:SS AM/PM` format. |
|**Location** | Editable. The device's physical location.  |
| **MAC Address** * | The device's MAC address.  |
|**Model**  *| Editable The device's hardware model. |
|**Name** * | Mandatory, and editable. The device's name as the sensor discovered it, or as entered by the user. |
|**OS architecture** | Editable. The device's operating system architecture.  |
|**OS distribution** | Editable. The device's operating system distribution, such as Android, Linux, and Haiku.   |
|**OS platform** * | Editable. The device's operating system, if detected.  On the OT sensor, shown as **Operating System**. |
|**OS version** | Editable. The device's operating system version, such as Windows 10 or Ubuntu 20.04.1. |
|**PLC mode**  * | The device's PLC operating mode, including both the *Key* state (physical / logical) and the *Run* state (logical). If both states are the same, then only one state is listed.<br><br>- Possible *Key* states include: `Run`, `Program`, `Remote`, `Stop`, `Invalid`, and `Programming Disabled`. <br><br>- Possible *Run* states are `Run`, `Program`, `Stop`, `Paused`, `Exception`, `Halted`, `Trapped`, `Idle`, or `Offline`.   |
|**Programming device**  *   | Editable.  Defines whether the device is defined as a *Programming Device*, performing programming activities for PLCs, RTUs, and controllers, which are relevant to engineering stations. |
|**Protocols**  *| The protocols that the device uses.  |
| **Purdue level** | Editable. The Purdue level in which the device exists.|
|**Scanner device**  * | Editable. Defines whether the device performs scanning-like activities in the network. |
|**Sensor**| The sensor the device is connected to. |
|**Serial number**  *| The device's serial number.  |
| **Site** | The device's site. <br><br>All Enterprise IoT sensors are automatically added to the **Enterprise network** site.  |
| **Slots** | The number of slots the device has.  |
| **Subtype** | Editable. The device's subtype, such as *Speaker* or *Smart TV*. <br>**Default**: `Managed Device` |
| **Tags** | Editable. The device's tags.  |
|**Type** * | Editable. The device type, such as *Communication* or *Industrial*. <br>**Default**: `Miscellaneous`  |
|**Vendor** *| The name of the device's vendor, as defined in the MAC address.  |
| **VLAN**  * | The device's VLAN.  |
|**Zone** | The device's zone.  |

The following columns are available on OT sensors only:

- The device's **DHCP Address**
- The device's **FQDN** address and **FQDN Last Lookup Time**
- The device **Groups** that include the device, as [defined on the OT sensor's device map](how-to-work-with-the-sensor-device-map.md#create-a-custom-device-group)
- The device's **Module address**
- The device's **Rack** and **Slot**
- The number of **Unacknowledged Alerts** alerts associated with the device

> [!NOTE]
> The additional **Agent type** and **Agent version** columns are used for by device builders. For more information, see [Microsoft Defender for IoT for device builders documentation](../device-builders/index.yml).

## Next steps

For more information, see:

- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)
- [Microsoft Defender for IoT - supported IoT, OT, ICS, and SCADA protocols](concept-supported-protocols.md)
- [Investigate devices on a device map](how-to-work-with-the-sensor-device-map.md)