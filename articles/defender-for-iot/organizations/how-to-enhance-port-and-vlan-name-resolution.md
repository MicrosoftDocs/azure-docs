---
title: Customize port and VLAN names on OT network sensors - Microsoft Defender for IoT
description: Learn how to customize port and VLAN names on Microsoft Defender for IoT OT network sensors.
ms.date: 01/12/2023
ms.topic: how-to
---

# Customize port and VLAN names on OT network sensors

Enrich device data shown in Defender for IoT by customizing port and VLAN names on your OT network sensors.

For example, you might want to assign a name to a non-reserved port that shows unusually high activity in order to call it out, or assign a name to a VLAN number to identify it quicker.

## Prerequisites

To customize port and VLAN names, you must be able to access the OT network sensor as an **Admin** user.

For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Customize names of detected ports

Defender for IoT automatically assigns names to most universally reserved ports, such as DHCP or HTTP. However, you might want to customize the name of a specific port to highlight it, such as when you're watching a port with unusually high detected activity.

Port names are shown in Defender for IoT when [viewing device groups from the OT sensor's device map](how-to-work-with-the-sensor-device-map.md#group-highlight-and-filters-tools), or when you create OT sensor reports that include port information.

**To customize a port name:**

1. Sign into your OT sensor as an **Admin** user.

1. Select **System settings** on the left and then, under **Network monitoring**, select **Port Naming**.

1. In the **Port naming** pane that appears, enter the port number you want to name, the port's protocol, and a meaningful name. Supported protocol values include: **TCP**, **UDP**, and **BOTH**.

1. Select **+ Add port** to customize an additional port, and **Save** when you're done.

## Customize a VLAN name

VLANs are either discovered automatically by the OT network sensor or added manually. Automatically discovered VLANs can't be edited or deleted, but manually added VLANs require a unique name. If a VLAN isn't explicitly named, the VLAN's number is shown instead.

VLAN's support is based on 802.1q (up to VLAN ID 4094).

VLAN names aren't synchronized between the OT network sensor and the on-premises management console. If you want to view customized VLAN names on the on-premises management console, [define the VLAN names](how-to-manage-the-on-premises-management-console.md#define-vlan-names) there as well.

**To configure VLAN names on an OT network sensor:**

1. Sign in to your OT sensor as an **Admin** user.

1. Select **System Settings** on the left and then, under **Network monitoring**, select **VLAN Naming**.

1. In the **VLAN naming** pane that appears, enter a VLAN ID and unique VLAN name. VLAN names can contain up to 50 ASCII characters.

1. Select **+ Add VLAN** to customize an additional VLAN, and **Save** when you're done.

1. **For Cisco switches**: Add the `monitor session 1 destination interface XX/XX encapsulation dot1q` command to the SPAN port configuration, where *XX/XX* is the name and number of the port.

## Next steps

> [!div class="nextstepaction"]
> [Investigate detected devices from the OT sensor device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)

> [!div class="nextstepaction"]
> [Create sensor trends and statistics reports](how-to-create-trends-and-statistics-reports.md)

> [!div class="nextstepaction"]
> [Create sensor data mining queries](how-to-create-data-mining-queries.md)
