---
title: Customize port and VLAN names in Defender for IoT
description: Customize port and VLAN names on your sensors 
ms.date: 01/09/2023
ms.topic: how-to
---

# Customize port and VLAN names

Enrich device resolution by customizing port and VLAN names on your sensors.

For example, you might assign a name to a non-reserved port that shows unusually high activity, or assign a name to a VLAN number for better visibility in the device inventory reports.

## Prerequisites

To customize port and VLAN names, you must be able to access the sensor as an **Admin** user.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Customize names of detected ports

Customize the name of a port detected by Defender for IoT when you want to highlight it for some reason, such as because there's unusually high activity detected.

Port names are shown in Defender for IoT when viewing device groups from the OT sensor's device map, or when you create OT sensor reports that include port information. Defender for IoT automatically assigns names to most universally reserved ports, such as DHCP or HTTP.

**To customize a port name:**

1. Sign into your OT sensor as an **Admin** user.

1. Select **System settings** on the left and then, under **Network monitoring**, select **Port Naming**.

1. In the **Port naming** pane that appears, enter the port number you want to name, a protocol, and enter a meaningful name. Supported protocols include: **TCP**, **UDP**, and **BOTH**.

1. Select **+ Add port** to customize an additional port, and **Save** when you're done.

## Customize a VLAN name

Enrich device inventory data with device VLAN numbers and names.

VLANS are either discovered automatically by the sensor or added manually. Automatically discovered VLANs can't be edited or deleted, but manually added VLANs require a unique name. If not named, the number of the VLAN will appear in the reports instead.

VLANs support is based on 802.1q (up to VLAN ID 4094).

> [!NOTE]
> VLAN names aren't synchronized between the sensor and the management console. You need to [define the name](how-to-manage-the-on-premises-management-console.md#define-vlan-names) on the management console as well.

**To configure VLAN names:**

1. Sign in to your OT sensor as an **Admin** user.

1. Select **System Settings** on the left and then, under **Network monitoring**, select **VLAN Naming**.

1. In the **VLAN naming** pane that appears, enter a VLAN ID and unique VLAN name. VLAN names can contain up to 50 ASCII characters.

1. Select **+ Add VLAN** to customize an additional VLAN, and **Save** when you're done.

**For Cisco switches:**

Add the `monitor session 1 destination interface XX/XX encapsulation dot1q` command to the span configuration, where *XX/XX* is the name and number of the port.

## Next steps

View enriched device information in various reports:

- [Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)

- [Sensor trends and statistics reports](how-to-create-trends-and-statistics-reports.md)

- [Sensor data mining queries](how-to-create-data-mining-queries.md)
