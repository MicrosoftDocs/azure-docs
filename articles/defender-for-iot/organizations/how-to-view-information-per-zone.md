---
title: Learn about devices on specific zones
description: Use the on-premises management console to get a comprehensive view information per specific zone 
author: rkarlin
manager: rkarlin
ms.author: rkarlin
ms.date: 06/12/2022 
ms.topic: how-to
---


# View information per zone


## View a device map for a zone

View a Device map for a selected zone on a sensor. This view displays all network elements related to the selected zone, including the sensors, the devices connected to them, and other information.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/zone-map-screenshot.png" alt-text="Screenshot of the zone map.":::


- In the **Site Management** window, select **View Zone Map** from the bar that contains the zone name.

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/default-region-to-default-business-unit-v2.png" alt-text="Default region to default business unit.":::

The **Device Map** window appears. 
The following tools are available for viewing devices and device information from the map. For details about each of these features, see the *Defender for IoT platform user guide*.

- **Map zoom views**: Simplified View, Connections View, and Detailed View. The displayed map view varies depending on the map's zoom level. You switch between map views by adjusting the zoom levels.

  :::image type="icon" source="media/how-to-work-with-asset-inventory-information/zoom-icon.png" border="false":::

- **Map search and layout tools**: Tools used to display varied network segments, devices, device groups, or layers.

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/search-and-layout-tools.png" alt-text="Screenshot of the Search and Layout Tools view.":::

- **Labels and indicators on devices:** For example, the number of devices grouped in a subnet in an IT network. In this example, it's 8.

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/labels-and-indicators.png" alt-text="Screenshot of labels and indicators.":::

- **View device properties**: For example, the sensor that's monitoring the device and basic device properties. Right-click the device to view the device properties.

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/asset-properties-v2.png" alt-text="Screenshot of the Device Properties view.":::

- **Alert associated with a device:** Right-click the device to view related alerts.

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/show-alerts.png" alt-text="Screenshot of the Show Alerts view.":::

## View alerts associated with a zone

To view alerts associated with a specific zone:

- Select the alert icon from the **Zone** window. 

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/business-unit-view-v2.png" alt-text="The default Business Unit view with examples.":::

For more information, see [Overview: Working with alerts](how-to-work-with-alerts-on-premises-management-console.md).

### View the device inventory of a zone

To view the device inventory associated with a specific zone:

- Select **View Device Inventory** from the **Zone** window.

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/default-business-unit.png" alt-text="The device inventory screen will appear.":::

For more information, see:

- [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Manage your OT device inventory from an on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

## View additional zone information

The following additional zone information is available:

- **Zone details**: View the number of devices, alerts, and sensors associated with the zone.

- **Sensor details**: View the name, IP address, and version of each sensor assigned to the zone.

- **Connectivity status**: If a sensor is disconnected, connect from the sensor. See [Connect sensors to the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#connect-sensors-to-the-on-premises-management-console). 

- **Update progress**: If the connected sensor is being upgraded, upgrade statuses will appear. During the upgrade, the on-premises management console doesn't receive device information from the sensor.

## Next steps

[Gain insight into global, regional, and local threats](how-to-gain-insight-into-global-regional-and-local-threats.md)
