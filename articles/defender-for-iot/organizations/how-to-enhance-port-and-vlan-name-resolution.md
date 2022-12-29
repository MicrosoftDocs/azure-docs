---
title: Enhance port and VLAN name resolution in Defender for IoT
description: Customize port and VLAN names on your sensors 
ms.date: 01/02/2022
ms.topic: how-to
---

# Customize port and VLAN names

Enrich device resolution by customizing port and VLAN names on your sensors.

## Prerequisites

To customize port and VLAN names, you must be able to access the sensor as an **Admin** user.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Customize a port name

Customize port names for ports that Defender for IoT detects.

Port names appear when you view device groups from the device map, or when you create reports that provide port information. Microsoft Defender for IoT automatically assigns names to most universally reserved ports, such as DHCP or HTTP.

**To customize a port name:**

1. Sign in to your network sensor as an **Admin** user and select **System Settings**.

1. Under **Network monitoring**, select **Port Naming**.

1. In the **Port naming** pane, select **Add port**.

1. Enter the port number, select the protocol (**TCP**, **UDP**, or **BOTH**), and type in a name. For example:

    :::image type="content" source="media/how-to-enrich-asset-information/edit-port.png" alt-text="Screenshot of the port naming pane.":::

1. Select **Save**.

## Customize a VLAN name

Enrich device inventory data with device VLAN numbers and names.

VLANS are either discovered automatically by the sensor or added manually. When you add a manual VLAN, you must add a unique name. Once named, the name of the VLAN will appear in reports instead of the VLAN number.

Before you start, note that:

- Manual VLANs can be edited and deleted, but automatically discovered VLANs can’t.
- VLAN names aren't synchronized between the sensor and the management console. You need to define the name on the management console as well.
- VLANs support is based on 802.1q (up to VLAN ID 4094).

**To configure VLAN names:**

1. Sign in to your network sensor and select **System Settings**.

1. Under **Network monitoring**, select **VLAN Naming**.

1. In **VLAN naming** pane, select **Add VLAN**.

1. Add a VLAN ID and unique VLAN name. For example:

    :::image type="content" source="media/how-to-enrich-asset-information/edit-vlan.png" alt-text="Screenshot of the VLAN naming pane." lightbox="media/how-to-enrich-asset-information/edit-vlan.png":::

1. Select **Save**.

**For Cisco switches:**

Add the following line to the span configuration: `monitor session 1 destination interface XX/XX encapsulation dot1q`.

In that command, *XX/XX* is the name and number of the port.

## Next steps

View enriched device information in various reports:

- [Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)

- [Sensor trends and statistics reports](how-to-create-trends-and-statistics-reports.md)

- [Sensor data mining queries](how-to-create-data-mining-queries.md)
