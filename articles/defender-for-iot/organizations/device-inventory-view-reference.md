---
title: Device inventory view options - Microsoft Defender for IoT
description: Learn about the various options for viewing your network device inventory with Microsoft Defender for IoT.
ms.date: 06/27/2022
ms.topic: reference
---

# Defender for Iot device inventory views

Use the various **Device inventory** pages in Defender for IoT to view detected OT, IoT, and IT devices in your network. Identify new devices detected, devices that might need troubleshooting, and more.

View **Device inventory** pages in the following locations:

- **Use the Azure portal** to view all devices detected by cloud-connected sensors, including OT, IoT, and IT.
- **Use a sensor console** to view all OT and IT devices detected by that console.
- **Use an on-premises management console** to view all OT and IT devices detected by sensors connected to that console.

Each location provides, similar but different options for viewing and managing devices.

> [!NOTE]
> The **Device inventory** page in Defender for IoT on the Azure portal is in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## What is a device?

[!INCLUDE [devices-inventoried](includes/devices-inventoried.md)]

## Data visible from the Azure portal

The following table describes the device properties shown in the **Device inventory** page on the Azure portal.

For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

| Parameter | Description |
|--|--|
| **Application** | The application that exists on the device. |
|**Authorized Device**     |Editable. Determines whether or not the device is *authorized*. This value may change as device security changes.         |
|**Business Function**     | Editable. Describes the device's business function.        |
| **Class** | Editable. The class of the device. <br>Default: `IoT`|
| **Data source** | The source of the data, such as a micro agent, OT sensor, or Microsoft Defender for Endpoint. <br>Default: `MicroAgent`|
| **Description** | Editable. The description of the device. |
| **Firmware vendor** | Editable. The vendor of the device's firmware. |
| **Firmware version** |Editable.  The version of the firmware. |
| **First seen** | The date, and time the device was first seen. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
|**Hardware Model**     |  Editable.  Determines the device's hardware model.     |
|**Hardware Vendor**     |Editable.  Determines the device's hardware vendor.        |
| **Importance** | Editable. The level of importance of the device. |
| **IPv4 Address** | The IPv4 address of the device. |
| **IPv6 Address** | The IPv6 address of the device. |
| **Last activity** | The date, and time the device last sent an event to the cloud. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
| **Last update time** | The date, and time the device last sent a system information event to the cloud. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
| **Location** | Editable. The physical location of the device. |
| **MAC Address** | The MAC address of the device. |
| **Model** | The device's model. |
| **Name** | Mandatory, and editable. The name of the device as the sensor discovered it, or as entered by the user. |
| **OS architecture** | Editable. The architecture of the operating system. |
| **OS distribution** | Editable. The distribution of the operating system, such as Android, Linux, and Haiku. |
| **OS platform** | Editable. The OS of the device, if detected. |
| **OS version** | Editable. The version of the operating system, such as Windows 10 and Ubuntu 20.04.1. |
| **PLC mode** | The PLC operating mode that includes the Key state (physical, or logical), and the Run state (logical). Possible Key states include, `Run`, `Program`, `Remote`, `Stop`, `Invalid`, and `Programming Disabled`. Possible Run states are `Run`, `Program`, `Stop`, `Paused`, `Exception`, `Halted`, `Trapped`, `Idle`, or `Offline`. If both states are the same, then only one state is presented. |
| **PLC secured** | Determines if the PLC mode is in a secure state. A possible secure state is `Run`. A possible unsecured state can be either `Program`, or `Remote`. |
|**Programming device**     | Editable.  Determines whether the device is a *Programming Device*. |
| **Programming time** | The last time the device was programmed.  |
| **Protocols** | The protocols that the device uses. |
| **Purdue level** | Editable. The Purdue level in which the device exists. |
| **Scanner** | Whether the device performs scanning-like activities in the network. |
| **Sensor** | The sensor the device is connected to.  |
| **Site** | The site that contains this device. <br><br>All Enterprise IoT sensors are automatically added to the **Enterprise network** site.|
| **Slots** | The number of slots the device has.  |
| **Subtype** | Editable. The subtype of the device, such as speaker and smart tv. <br>**Default**: `Managed Device` |
| **Tags** | Editable. Tagging data for each device. |
| **Type** | Editable. The type of device, such as communication, and industrial. <br>**Default**: `Miscellaneous` |
| **Underlying devices** | Any relevant underlying devices for the device |
| **Underlying device region** | The region for an underlying device |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |
| **VLAN** | The VLAN of the device. |
| **Zone** | The zone that contains this device. |



## Data visible from a sensor console

The following table describes the device properties shown in the **Device inventory** page on a sensor console.

For more information, see [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md).

| Name | Description |
|--|--|
| **Description** | A description of the device |
| **Discovered** | When this device was first seen in the network. |
| **Firmware version** | The device's firmware, if detected. |
| **FQDN** | The device's FQDN value |
| **FQDN lookup time** | The device's FQDN lookup time |
| **Groups** | The groups that this device participates in. |
| **IP Address** | The IP address of the device. |
| **Is Authorized** | The authorization status defined by the user:<br />- **True**: The device has been authorized.<br />- **False**: The device hasn't been |
| **Is Known as Scanner** | Defined as a network scanning device by the user. |
| **Is Programming device** | Defined as an authorized programming device by the user. <br />- **True**: The device performs programming activities for PLCs, RTUs, and controllers, which are relevant to engineering stations. <br />- **False**: The device isn't a programming device. |
| **Last Activity** | The last activity that the device performed. |
| **MAC Address** | The MAC address of the device. |
| **Name** | The name of the device as the sensor discovered it, or as entered by the user. |
| **Operating System** | The OS of the device, if detected. |
| **PLC mode** (preview) | The PLC operating mode includes the Key state (physical) and run state (logical). Possible **Key** states include, Run, Program, Remote, Stop, Invalid, Programming Disabled.Possible Run. The possible **Run** states are Run, Program, Stop, Paused, Exception, Halted, Trapped, Idle, Offline. If both states are the same, only one state is presented. |
| **Protocols** | The protocols that the device uses. |
| **Type** | The type of device as determined by the sensor, or as entered by the user. |
| **Unacknowledged Alerts** | The number of unacknowledged alerts associated with this device. |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |
| **VLAN** | The VLAN of the device. For more information, see [Define VLAN names](how-to-manage-the-on-premises-management-console.md#define-vlan-names). |


## Data visible from the on-premises management console

The following table describes the device properties shown in the **Device inventory** page on an on-premises management console.

For more information, see [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md).

| Name | Description |
|--|--|
| **Unacknowledged Alerts** | The number of unhandled alerts associated with this device. |
| **Business Unit** | The business unit that contains this device. |
| **Region** | The region that contains this device. |
| **Site** | The site that contains this device. |
| **Zone** | The zone that contains this device. |
| **Appliance** | The Microsoft Defender for IoT sensor that protects this device. |
| **Name** | The name of this device as Defender for IoT discovered it. |
| **Type** | The type of device, such as PLC or HMI. |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |
| **Operating System** | The OS of the device. |
| **Firmware** | The device's firmware. |
| **IP Address** | The IP address of the device. |
| **VLAN** | The VLAN of the device. |
| **MAC Address** | The MAC address of the device. |
| **Protocols** | The protocols that the device uses. |
| **Unacknowledged Alerts** | The number of unhandled alerts associated with this device. |
| **Is Authorized** | The authorization status of the device:<br />- **True**: The device has been authorized.<br />- **False**: The device hasn't been authorized. |
| **Is Known as Scanner** | Whether this device performs scanning-like activities in the network. |
| **Is Programming Device** | Whether this is a programming device:<br />- **True**: The device performs programming activities for PLCs, RTUs, and controllers, which are relevant to engineering stations.<br />- **False**: The device isn't a programming device. |
| **Groups** | Groups in which this device participates. |
| **Last Activity** | The last activity that the device performed. |
| **Discovered** | When this device was first seen in the network. |
| **PLC mode (preview)** | The PLC operating mode includes the Key state (physical) and run state (logical). Possible **Key** states include, Run, Program, Remote, Stop, Invalid, Programming Disabled.Possible Run. The possible **Run** states are Run, Program, Stop, Paused, Exception, Halted, Trapped, Idle, Offline. if both states are the same, only one state is presented. |

## Next steps

For more information, see:

- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)