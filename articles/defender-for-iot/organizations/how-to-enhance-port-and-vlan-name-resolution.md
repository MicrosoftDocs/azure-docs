---
title: Enhance port and VLAN name resolution in Defender for IoT
description: Customize port and VLAN names on your sensors 
ms.date: 01/02/2022
ms.topic: how-to
---

# Customize port and VLAN names

You can customize port and VLAN names on your sensors to enrich device resolution.

## Customize a port name

Microsoft Defender for IoT automatically assigns names to most universally reserved ports, such as DHCP or HTTP. You can customize port names for other ports that Defender for IoT detects. For example, you might assign a name to a non-reserved port because that port shows unusually high activity. Names appear when you view device groups from the device map, or when you create reports that provide port information.

Customize a name as follows:

1. Select **System Settings**. Under **Network monitoring**, select **Port Naming**.
2. Select **Add port**.
3. Enter the port number, select the protocol (TCP, UDP, both) and type in a name.
4. Select **Save**.

## Customize a VLAN name

You can enrich device inventory data with device VLAN numbers and tags. 

- VLANs support is based on 802.1q (up to VLAN ID 4094). VLANS can be discovered automatically by the sensor or added manually.
- Automatically discovered VLANs can't be edited or deleted. You should add a name to each VLAN, if you don't add a name, the VLAN number will appear when VLAN information is reported.
- When you add a manual VLN, you must add a unique name. These VLANs can be edited and deleted.
- VLAN names can contain up to 50 ASCII characters.

## Before you start
> [!NOTE]
> VLAN names are not synchronized between the sensor and the management console. You need to define the name on the management console as well.  
For Cisco switches, add the following line to the span configuration: `monitor session 1 destination interface XX/XX encapsulation dot1q`. In that command, *XX/XX* is the name and number of the port.

To configure VLAN names:

1. On the side menu, select **System Settings**.

2. In the **System Settings** window, select **VLAN**.

    :::image type="content" source="media/how-to-enrich-asset-information/edit-vlan.png" alt-text="Use the system settings to edit your VLANs.":::

3. Add a unique name next to each VLAN ID.


## Next steps

View enriched device information in various reports:

- [Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Sensor trends and statistics reports](how-to-create-trends-and-statistics-reports.md)
- [Sensor data mining queries](how-to-create-data-mining-queries.md)
