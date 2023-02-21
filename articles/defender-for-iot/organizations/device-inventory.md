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

## Device management options

The Defender for IoT device inventory is available in the Azure portal, OT network sensor consoles, and the on-premises management console.

While you can view device details from any of these locations, each location also offers extra device inventory support. The following table describes the device inventory visible supported for each location and the extra actions available from that location only:

|Location  |Description   | Extra inventory support |
|---------|---------|---------|
|**Azure portal**     | Devices detected from all cloud-connected OT sensors and Enterprise IoT sensors. <br><br>      |     - If you have an [Enterprise IoT plan](eiot-defender-for-endpoint.md) on your Azure subscription, the device inventory also includes devices detected by Microsoft Defender for Endpoint agents.  <br><br>- If you also use [Microsoft Sentinel](iot-solution.md), incidents in Microsoft Sentinel are linked to related devices in Defender for IoT. <br><br>- Use Defender for IoT [workbooks](workbooks.md) for visibility into all cloud-connected device inventory, including related alerts and vulnerabilities.     |
|**OT network sensor consoles**     |   Devices detected by that OT sensor      |    - View all detected devices across a network device map<br>- View related events on the **Event timeline** |
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

## Supported device categories

Defender for IoT's device inventories support the following categories of device types, across the Azure portal, OT network sensor, and on-premises management console.

<!--what about EIoT?-->

|Name  |Examples  |
|---------|---------|
|**Network devices**     |  Switches, routers, controllers, or access points       |
|**Endpoint devices**     |  Workstations, servers, or mobile devices       |
|**OT/IoT devices**     |  |
|Printing devices         |   Scanners, all-in-one printers, or printer servers       |
|Audio and video devices     |   Smart TVs, speakers, digital signage, or headsets      |
|Surveillance devices     |    DVRs, cameras, or video encoders / decoders     |
|Communication devices     |   VoIP phones, intercoms, analog telephone adapters      |
|Smart appliance devices     |  Smart lights, smart switches, clocks, barcode scanners        |
|Smart facility devices     |  Doors, fire alarms, elevators, turnstiles, HVAC systems       |
|Miscellaneous devices     | Smart watches, ebook readers, Arduino devices, oscilloscopes     |
|Industrial devices     |  PLCs, historian devices, HMIs, robot controllers, slots, programmable boards       |
|Operational equipment    | Industrial printers, scales, pneumatic devices, packaging systems        |

*Unclassified* devices are devices that don't have an out-of-the-box category defined.

## Unauthorized devices

When you're first working with Defender for IoT, during the learning period just after deploying a sensor, all devices detected are identified as *authorized* devices.

After the learning period is over, any new devices detected are considered to be  *unauthorized* and *new* devices. We recommend checking these devices carefully for risks and vulnerabilities. For example, in the Azure portal, filter the device inventory for `Authorization == **Unauthorized**`. On the device details page, drill down and check for related vulnerabilities, alerts, and recommendations.

The *new* status is removed as soon as you edit any of the device details move the device on an OT sensor device map. In contrast, the *unauthorized* label remains until you manually edit the device details and mark it as *authorized*.

On an OT sensor, unauthorized devices are also included in the following reports:

- [Attack vector reports](how-to-create-attack-vector-reports.md): Devices marked as *unauthorized* are included in an attack vector simulation as suspected rogue devices that might be a threat to the network.

- [Risk assessment reports](how-to-create-risk-assessment-reports.md): Devices marked as *unauthorized* are listed in risk assessment reports as their risks to your network require investigation.

## Important OT devices

Mark OT devices as *important* to highlight them for extra tracking. On an OT sensor, important devices are included in the following reports:

- [Attack vector reports](how-to-create-attack-vector-reports.md): Devices marked as *important* are included in an attack vector simulation as possible attack targets.

- [Risk assessment reports](how-to-create-risk-assessment-reports.md): Devices marked as *important* are counted in risk assessment reports when calculating security scores

## Device inventory column data

The following table lists the columns available in the Defender for IoT device inventory pages, across the Azure portal, OT sensor, and on-premises management console.

> [!NOTE]
> Individual device values are read-only on the on-premises management console, even for columns marked as *Editable*. Update individual device data on the Azure portal or the OT sensor UI only.

|Name  |Description  |Azure portal  | OT sensor | On-premises management console|
|---------|---------|---------|---------|---------|
| **Agent type** | | ✔ |-  |- |
| **Agent version** | | ✔ | -| -|
| **Application** | The application installed on the device. | ✔ | - | - |
|**Authorization** / **Is Authorized**    |Editable. Determines whether or not the device is marked as *authorized*. This value may need to change as the device security changes.         |✔ | ✔ | ✔ |
|**Business Function**     | Editable. Describes the device's business function.        |✔ | - | - |
| **Business Unit** | The device's business unit, as [defined on the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#create-enterprise-zones). |- | - | ✔ |
| **Class** | Editable. The device's class. <br>Default: `IoT`|✔ | - | - |
| **Data source** | The source of the data, such as a micro agent, OT sensor, or Microsoft Defender for Endpoint. <br>Default: `MicroAgent`|✔ | - | - |
| **DHCP Address** | The device's DHCP address. | - | ✔ | - |
| **Description** | Editable. The device's description. |✔ | ✔ | - |
| **Device Id** | The device's Azure-assigned ID number | ✔ | -| -|
| **Firmware** | The device's firmware description. | - | - | ✔ |
| **Firmware model** |  The device's firmware model. |✔ | - | - |
| **Firmware vendor** | Editable. The vendor of the device's firmware. |✔ | - | - |
| **Firmware version** |Editable.  The device's firmware version. |✔ | ✔ |  ✔ |
| **First seen** / **Discovered** | The date and time the device was first seen. Shown in `MM/DD/YYYY HH:MM:SS AM/PM` format. | ✔ | ✔ | ✔ |
| **FQDN** | The device's FQDN value |- | ✔ | - |
| **FQDN Last Lookup Time** | The device's FQDN lookup time |- | ✔ | - |
| **Groups** | The device groups that include the device, as [defined on the OT sensor's device map](how-to-work-with-the-sensor-device-map.md#create-a-custom-device-group-from-an-ot-sensor-device-map). |- | ✔ | ✔ |
|**Hardware Vendor**     | <!--missing from columns--> Editable.  The device's hardware vendor.        |✔ | - | - |
| **Importance** | Editable. The device's important level: `Low`, `Medium`, or `High`.  |✔ | - | - |
| **IP Address** | The device's IP address. |- | ✔ | ✔ |
| **IPv4 Address** | The device's IPv4 address. |✔ | - | - |
| **IPv6 Address** | The device's IPv6 address. |✔ | - | - |
| **Last activity** | The date and time the device last sent an event through to Azure or to the OT sensor, depending on where you're viewing the device inventory. Shown in `MM/DD/YYYY HH:MM:SS AM/PM` format. | ✔ | ✔ | ✔ |
| **Location** | Editable. The device's physical location. |✔ | - | - |
| **MAC Address** | The device's MAC address. |✔ | ✔ | ✔ |
| **Model** / **Hardware model**| Editable The device's hardware model. |✔ | ✔ | ✔ |
| Module address | - | ✔ |✔ |
| **Name** | Mandatory, and editable. The device's name as the sensor discovered it, or as entered by the user. |✔ | ✔ | ✔ |
| **OS architecture** | Editable. The device's operating system architecture. |✔ | - | - |
| **OS distribution** | Editable. The device's operating system distribution, such as Android, Linux, and Haiku. |✔ | - | - |
| **OS platform** / **Operating System** | Editable. The device's operating system, if detected. |✔ |  ✔ | ✔ |
| **OS version** | Editable. The device's operating system version, such as Windows 10 or Ubuntu 20.04.1. |✔ | - | - |
| **PLC mode** | The device's PLC operating mode, including both the *Key* state (physical / logical) and the *Run* state (logical). Possible *Key* states include: `Run`, `Program`, `Remote`, `Stop`, `Invalid`, and `Programming Disabled`. Possible *Run* states are `Run`, `Program`, `Stop`, `Paused`, `Exception`, `Halted`, `Trapped`, `Idle`, or `Offline`. If both states are the same, then only one state is listed. |✔ | ✔ | ✔ |
|**Programming device** / **Is Programming device**     | Editable.  Defines whether the device is defined as a *Programming Device*, performing programming activities for PLCs, RTUs, and controllers, which are relevant to engineering stations. |✔ | ✔ | ✔ |
| **Protocols** | The protocols that the device uses. |✔ | ✔ | ✔ |
| **Purdue level** | Editable. The Purdue level in which the device exists. |✔ | - | - |
| **Rack** | The number of device racks. <!--unclear--> | - | ✔ | ✔|
|**Region**| The device's region, as [defined on the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#set-up-a-site) |  - | - | ✔ |
| **Scanner device** / **Is Known as Scanner** | Editable. Defines whether the device performs scanning-like activities in the network. |✔ | ✔ | ✔ |
| **Sensor** / **Appliance** | The sensor the device is connected to.  |✔ | - | ✔ |
| **Serial number**  / **Serial**| The device's serial number. | ✔ | ✔|✔ |
| **Site** | The device's site. <br><br>All Enterprise IoT sensors are automatically added to the **Enterprise network** site.|✔ | - | ✔ |
| **Slots** / **Slot** | The number of slots the device has.  <!--unclear for slot on sensor/cm-->|✔ |✔|✔ |
| **Subtype** | Editable. The device's subtype, such as *Speaker* or *Smart TV*. <br>**Default**: `Managed Device` |✔ | - | - |
| **Tags** | Editable. The device's tags. |✔ | - | - |
| **Type** | Editable. The device type, such as *Communication* or *Industrial*. <br>**Default**: `Miscellaneous` |✔ | ✔ | ✔ |
| **Unacknowledged Alerts** | The number of unacknowledged alerts associated with the device. |- | ✔ | ✔ |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |✔ | ✔ | ✔ |
| **VLAN** / **VLAN Ids** | The device's VLAN. |✔ | ✔ | ✔ |
| **Zone** | The device's zone. |✔ | - | ✔ |

<!--missing
| **PLC secured** | Defines whether the PLC mode is in a secure state. For example, a secure state might be `Run`, and an unsecured state might be `Program`, or `Remote`. |✔ | - | - |
| **Programming time** | The last time the device was programmed.  |✔ | - | - |
| **Underlying devices** | Any relevant underlying devices for the device. |✔ | - | - |
| **Underlying device region** | The region for an underlying device |✔ | - | - |
-->



## Next steps

For more information, see:

- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)
- [Microsoft Defender for IoT - supported IoT, OT, ICS, and SCADA protocols](concept-supported-protocols.md)
- [Investigate devices on a device map](how-to-work-with-the-sensor-device-map.md)