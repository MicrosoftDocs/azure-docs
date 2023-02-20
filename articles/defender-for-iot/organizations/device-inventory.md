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
|**Azure portal**     | Devices detected from all cloud-connected OT sensors and Enterprise IoT sensors. <br><br>      |     - If you have an [Enterprise IoT plan](eiot-defender-for-endpoint.md) on your Azure subscription, the device inventory also includes devices detected by Defender for Endpoint agents.  <br><br>- If you also use [Microsoft Sentinel](iot-solution.md), incidents in Microsoft Sentinel are linked to related devices in Defender for IoT. <br><br>- Use Defender for IoT [workbooks](workbooks.md) for visibility into all cloud-connected device inventory, including related alerts and vulnerabilities.     |
|**OT network sensor consoles**     |   Devices detected by that OT sensor      |    - View all detected devices across a network device map<br>- View related events on the **Event timeline** |
|**An on-premises management console**     |  Devices detected across all connected OT sensors          | Enhance device data by importing data manually or via script  |

For more information, see:

- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

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
|Operational equiptment    | Industrial printers, scales, pneumatic devices, packaging systems        |

Devices that don't have built-in categories and types are listed as *Unclassified* devices.

## Unauthorized devices

When you're first working with Defender for IoT, during the learning period just after deploying a sensor, all devices detected are identified as *authorized* devices.

After the learning period is over, any new devices detected are identified as *unauthorized* and *new* devices. We recommend checking these devices carefully for risks and vulnerabilities. For example, in the Azure portal, filter the device inventory for `Authorization == **Unauthorized**`. On the device details page, drill down and check for related vulnerabilities, alerts, and recommendations.

While the *new* status is removed if you edit the device details or move the device on an OT sensor device map, the *unauthorized* label remains until you manually edit the device details and mark it as *authorized*.

On an OT sensor, unauthorized devices are also included in the following reports:

- [Attack vector reports](how-to-create-attack-vector-reports.md): Devices marked as *unauthorized* are included in an attack vector simulation as suspected rogue devices that might be a threat to the network.

- [Risk assessment reports](how-to-create-risk-assessment-reports.md): Devices marked as *unauthorized* are listed in risk assessment reports as their risks to your network require investigation.

## Important OT devices

Mark OT devices as *important* to highlight them for extra tracking. On an OT sensor, important devices are included in the following reports:

- [Attack vector reports](how-to-create-attack-vector-reports.md): Devices marked as *important* are specifically included in an attack vector simulation as possible attack targets.

- [Risk assessment reports](how-to-create-risk-assessment-reports.md): Devices marked as *important* are counted in risk assessment reports when calculating security scores

## Built-in device groups

Defender for IoT's device inventories can be viewed and grouped by *device* group, including a series of out-of-the-box groups and [custom groups](how-to-work-with-the-sensor-device-map.md#create-a-custom-device-group-from-an-ot-sensor-device-map) created on your OT sensor's device map.

Defender for IoT provides the following device groups out-of-the-box:

| Group name | Description |
|--|--|
| **Attack vector simulations** | Vulnerable devices detected in attack vector reports, where the **Show in Device Map** option is [toggled on](how-to-create-attack-vector-reports.md).|
| **Authorization** | Devices that were either discovered during an initial learning period or were later manually marked as *authorized* devices.|
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

The following table lists the columns available in the Defender for IoT device inventory pages, across the Azure portal, OT sensor, and on-premises management console:

|Name  |Description  |Azure portal  | OT sensor | On-premises management console|
|---------|---------|---------|---------|---------|
| **Appliance** | The OT sensor monitoring the device | - | - | ✔ |
| **Application** | The application that exists on the device. | ✔ | - | - |
|**Authorization** / **Is Authorized**    |Editable. Determines whether or not the device is *authorized*. This value may change as device security changes.         |✔ | ✔ | ✔ |
|**Business Function**     | Editable. Describes the device's business function.        |✔ | - | - |
| **Business Unit** | The device's business unit, as defined on the on-premises management console. |- | - | ✔ |
| **Class** | Editable. The class of the device. <br>Default: `IoT`|✔ | - | - |
| **Data source** | The source of the data, such as a micro agent, OT sensor, or Microsoft Defender for Endpoint. <br>Default: `MicroAgent`|✔ | - | - |
| **Description** | Editable. The description of the device. |✔ | ✔ | - |
| **Firmware** | The device's firmware description. | - | - | ✔ |
| **Firmware vendor** | Editable. The vendor of the device's firmware. |✔ | - | - |
| **Firmware version** |Editable.  The version of the firmware. |✔ | ✔ | - |
| **First seen** / **Discovered** | The date, and time the device was first seen. Presented in format `MM/DD/YYYY HH:MM:SS AM/PM`. | ✔ | ✔ | ✔ |
| **FQDN** | The device's FQDN value |- | ✔ | - |
| **FQDN lookup time** | The device's FQDN lookup time |- | ✔ | - |
| **Groups** | The device groups that include the device, as [defined on the OT sensor's device map](how-to-work-with-the-sensor-device-map.md#create-a-custom-device-group-from-an-ot-sensor-device-map). |- | ✔ | ✔ |
|**Hardware Model**     |  Editable.  Determines the device's hardware model.     |✔ | - | - |
|**Hardware Vendor**     |Editable.  Determines the device's hardware vendor.        |✔ | - | - |
| **Importance** | Editable. The level of importance of the device. |✔ | - | - |
| **IP Address** | The IP address of the device. |- | ✔ | ✔ |
| **IPv4 Address** | The IPv4 address of the device. |✔ | - | - |
| **IPv6 Address** | The IPv6 address of the device. |✔ | - | - |
| **Last activity** | The date, and time the device last sent an event through to Azure or to the OT sensor, depending on where it's being viewed. Presented in format `MM/DD/YYYY HH:MM:SS AM/PM`. | ✔ | ✔ | ✔ |
| **Location** | Editable. The physical location of the device. |✔ | - | - |
| **MAC Address** | The MAC address of the device. |✔ | ✔ | ✔ |
| **Model** | The device's model. |✔ | - | - |
| **Name** | Mandatory, and editable. The name of the device as the sensor discovered it, or as entered by the user. |✔ | ✔ | ✔ |
| **Operating System** | The device's operating system, if detected. |- | ✔ | ✔ |
| **OS architecture** | Editable. The architecture of the operating system. |✔ | - | - |
| **OS distribution** | Editable. The distribution of the operating system, such as Android, Linux, and Haiku. |✔ | - | - |
| **OS platform** | Editable. The OS of the device, if detected. |✔ | - | - |
| **OS version** | Editable. The version of the operating system, such as Windows 10 and Ubuntu 20.04.1. |✔ | - | - |
| **PLC mode** | The PLC operating mode that includes the Key state (physical, or logical), and the Run state (logical). Possible Key states include, `Run`, `Program`, `Remote`, `Stop`, `Invalid`, and `Programming Disabled`. Possible Run states are `Run`, `Program`, `Stop`, `Paused`, `Exception`, `Halted`, `Trapped`, `Idle`, or `Offline`. If both states are the same, then only one state is presented. |✔ | ✔ | ✔ |
| **PLC secured** | Determines if the PLC mode is in a secure state. A possible secure state is `Run`. A possible unsecured state can be either `Program`, or `Remote`. |✔ | - | - |
|**Programming device** / **Is Programming device**     | Editable.  Determines whether the device is defined as a *Programming Device* and performs programming activities for PLCs, RTUs, and controllers, which are relevant to engineering stations. |✔ | ✔ | ✔ |
| **Programming time** | The last time the device was programmed.  |✔ | - | - |
| **Protocols** | The protocols that the device uses. |✔ | ✔ | ✔ |
| **Purdue level** | Editable. The Purdue level in which the device exists. |✔ | - | - |
|**Region**| The device's region, as defined on the on-premises management console |  - | - | ✔ |
| **Scanner device** / **Is Known as Scanner** | Whether the device performs scanning-like activities in the network. |✔ | ✔ | ✔ |
| **Sensor** | The sensor the device is connected to.  |✔ | - | - |
| **Site** | The device's site <br><br>All Enterprise IoT sensors are automatically added to the **Enterprise network** site.|✔ | - | ✔ |
| **Slots** | The number of slots the device has.  |✔ | - | - |
| **Subtype** | Editable. The subtype of the device, such as speaker and smart TV. <br>**Default**: `Managed Device` |✔ | - | - |
| **Tags** | Editable. Tagging data for each device. |✔ | - | - |
| **Type** | Editable. The type of device, such as communication, and industrial. <br>**Default**: `Miscellaneous` |✔ | ✔ | ✔ |
| **Unacknowledged Alerts** | The number of unacknowledged alerts associated with this device. |- | ✔ | ✔ |
| **Underlying devices** | Any relevant underlying devices for the device |✔ | - | - |
| **Underlying device region** | The region for an underlying device |✔ | - | - |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |✔ | ✔ | ✔ |
| **VLAN** | The device's [VLAN](how-to-manage-the-on-premises-management-console.md#define-vlan-names). |✔ | ✔ | ✔ |
| **Zone** | The device's zone. |✔ | - | ✔ |



## Next steps