---
title: Learn about devices discovered by all enterprise sensors
description: Device information from connected sensors can be viewed from the on-premises management console Device Inventory. This gives a comprehensive view of all network information. Use import, export, and filtering tools to manage this information. 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/02/2020
ms.topic: how-to
ms.service: azure
---

# Investigate all enterprise sensor detections in a Device Inventory

Device information from connected sensors can be viewed from the on-premises management console in the Device Inventory. This gives on-premises management console users a comprehensive view of all network information. Use import, export, and filtering tools to manage this information. The status information about the connected sensor versions is also displayed.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/asset-inventory-data-table.png" alt-text="Screenshot of the device inventory data table.":::

The following table describes the Device Inventory table columns.

| Parameter | Description |
|--|--|
| **Unacknowledged Alerts** | The number of unhandled alerts associated with this device. |
| **Business Unit** | The business unit that contains this device. |
| **Region** | The region that contains this device. |
| **Site** | The site that contains this device. |
| **Zone** | The zone that contains this device. |
| **Appliance** | The Defender for IoT sensor that protects this device. |
| **Name** | The name of this device as it was discovered by Defender for IoT. |
| **Type** | The type of device, such as PLC, or HMI. |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |
| **Operating System** | The OS of the device. |
| **Firmware** | The device's firmware. |
| **IP Address** | The IP address of the device. |
| **VLAN** | The VLAN of the device. |
| **MAC Address** | The MAC address of the device. |
| **Protocols** | The protocols used by the device. |
| **Unacknowledged Alerts** | The number of unhandled alerts associated with this device. |
| **Is Authorized** | The authorization status of the device:<br />- **True:** The device has been authorized.<br />- **False:** The device has not been authorized. |
| **Is Known as Scanner** | Is this device performs scanning-like activities in the network. |
| **Is Programming Device** | Is this a programming device:<br />- **True:** The device performs programming activities for PLCs, RTU, and Controllers, which are relevant to engineering stations.<br />- **False:** The device is not a programming device. |
| **Groups** | In which groups this device participates. |
| **Last Activity** | The last activity performed by the device. |
| **Discovered** | When this device was first seen in the network. |

## Integrate data to the enterprise Device Inventory

Device inventory data integration capabilities let you enhance the data in the Device Inventory with information from other enterprise resources. For example, from CMDBs, DNS, Firewalls, and Web APIs.

You can use this information to learn. For example,

- The device purchase dates and end of warranty dates.

- The users responsible for each device.

- Opened tickets for devices.

- The last date firmware was upgraded.

- Devices allowed access to the internet.

- Devices running active Antivirus applications.

- Users logged into devices.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/asset-inventory-screen-with-itens-highlighted.png" alt-text="Asset inventory screen data table.":::

You can integrate data by:

- Adding it manually,

Or

- Running customized scripts provided by Defender for IoT.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/enterprise-data-integrator-graph.png" alt-text="Diagram of enterprise data integrator.":::

You can work with Defender for IoT technical support to set up your system to receive Web API queries.

To add data manually:

1. In the side menu, select **Device Inventory** and then select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon.png" border="false":::.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/asset-inventory-settings-v2.png" alt-text="Edit your device's inventory settings.":::

2. In the **Device Inventory Settings** dialog box, select **ADD CUSTOM COLUMN**.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/add-custom-column.png" alt-text="Add a custom column to your inventory.":::

3. In the **Add Custom Column** dialog box, add the new column name (up to 250 characters UTF), select **Manual** and select **SAVE**. The new item appears in the **Device Inventory Settings** dialog box.

4. In the top-right corner of the **Device Inventory** window, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false"::: and select **Export All Device Inventory**. The CSV file is generated.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/sample-exported-csv-file.png" alt-text="The exported CSV file.":::

5. Manually add the information to the new column and save the file.

6. In the top-right corner of the **Device Inventory** window, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false":::, select **Import Manual Input Columns** and browse to the CSV file. The new data appears in the **Device Inventory** table.

To integrate data from other enterprise entities:

1. In the top-right corner of the **Device Inventory** window, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false"::: and select **Export All Device Inventory**.

2. In the **Device Inventory Settings** dialog box, select **ADD CUSTOM COLUMN**.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/add-custom-column.png" alt-text="Add a custom column to your inventory.":::

3. In the **Add Custom Column** dialog box, add the new column name (up to 250 characters UTF), select **Automatic**. The **UPLOAD SCRIPT** and **TEST SCRIPT** options appear.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/add-custom-column-automatic.png" alt-text="Automatically add custom columns.":::

4. Upload and test the script that you received from the [support.microsoft.com](https://support.serviceshub.microsoft.com/supportforbusiness/create?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Retrieve information from the Device Inventory

You can retrieve an extensive range of device information detected by managed sensors and integrate that information with partner systems. For example, sensor, zone, and site IDs IP address, MAC addresses, firmware, protocol, and vendor information is retrieved. Filter information you retrieve based on:

- authorized and unauthorized devices.

- devices associated with specific sites.

- devices associated with specific zones.

- devices associated with specific sensors.

Work with Defender for IoT API commands to retrieve and integrate this information.

## Filter the Device Inventory

You can filter Device Inventory to show columns of interest. For example, view PLC devices information.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/asset-inventory-view-v2.png" alt-text="Screenshot of the asset inventory.":::

The filter is cleared when you leave the window.

To use the same filter multiple times, you can save a filter or a combination of filters that you need. You can open a left pane and view the filter(s) that you have saved:

:::image type="content" source="media/how-to-work-with-asset-inventory-information/view-your-asset-inventories-v2.png" alt-text="Asset inventories screen":::

**To filter the Device Inventory:**

1. In the column that you want to filter, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/filter-a-column-icon.png" border="false":::.

2. In the Filter dialog box, select the filter type, as follows:

 - **Equals:** The exact value according to which you want to filter the column. For example, if you filter the Protocol column according to equals and `value=ICMP`, the column will present devices that use the ICMP protocol only.

 - **Contains:** The value that is contained among other values in the column. For example, if you filter the Protocol column according to Contains and `value=ICMP`, the column will present devices that use the ICMP protocol as a part of the list of protocols that the device uses.

3. To organize the column info according to the alphabetical order, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-order-icon.png" border="false"::: and arrange the order by selecting the :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-a-z-order-icon.png" border="false"::: and :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-z-a-order-icon.png" border="false"::: arrows.

4. To save a new filter, define the filter and select **Save As**.

5. To change the filter definitions, change the definitions and select **Save Changes**.

## View device information per zone

The following information can be learned about devices in a Zone

- **View a zone device map**

- **View alerts associated with a zone**

- **View a Device Inventory of the zone**

- **Additional zone information**

#### View a zone Device Map

This article describes how to access the sensor Device Map for the zone selected.

To view a zone map:

1. In the **Site Management** window, select **View Zone Map** from the bar that contains the zone name.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/default-region-to-default-business-unit.png" alt-text="Default region to default business unit.":::

The Device Map window displays, showing all the network elements related to the selected zone, including the sensors, the devices connected to them and other information.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/zone-map-screenshot.png" alt-text="Screenshot of the zone map.":::

### Map views and device information

The following tools are available for viewing devices and device information from the map. Refer to *The Device Map* chapter in the *Defender for IoT Platform User Guide* for details about each of these features.

- **Map zoom views**: Simplified View, Connections View and Detailed View

The map view displayed varies depending on the map zoom-level. Switching between map views is done by adjusting the zoom levels.

:::image type="icon" source="media/how-to-work-with-asset-inventory-information/zoom-icon.png" border="false":::

- **Map search and layout tools**: Tools used to display varied network segments, devices. Device groups or layers.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/search-and-layout-tools.png" alt-text="Screeshot of search and layout tools view.":::

- **Labels and indicators on devices:** For example, the number of devices grouped in a subnet in an IT network. In this example 8.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/labels-and-indicators.png" alt-text="Screenshot of labels and indicators.":::

- **View device properties**: For example, the sensor monitoring the device and basic device properties. Right-click the device to view the device properties.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/asset-properties.png" alt-text="Screenshot of asset properties view.":::

- **Alert associated with a device:** Right-click the device to view related alerts.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/show-alerts.png" alt-text="Screenshot of show alerts view.":::

### View alerts associated with a zone

View all alerts associated with a specific zone. 

To view alerts:

1. Select the alerts icon form the Zone window. 

:::image type="content" source="media/how-to-work-with-asset-inventory-information/business-unit-view.png" alt-text="Screenshot of default business unit view with examples.":::

See [Overview - Working with Alerts](how-to-work-with-alerts-on-premises-management-console.md)

### View the Device Inventory of the zone

View the Device Inventory associated with a specific zone. 

To view the inventory:

1. Select the **View Device Inventory** form the Zone window.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/default-business-unit.png" alt-text="Screenshot of default business unit view with example.":::

See [Investigate all enterprise sensor detections in a Device Inventory](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

#### Additional zone information

The following additional zone information is available:

- **Zone details:** Number of devices, alerts, and sensors associated with the zone.

- **Sensor details:** Name, IP address, and version of each sensor assigned to the zone.

- **Connectivity status:** If disconnected, connect from the sensor. See [Connect sensors to the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#connect-sensors-to-the-on-premises-management-console). 

- **Update progress:** If the connected sensor is being upgraded, upgrade statuses will appear. During upgrade, the on-premises management console does not receive device information from the sensor.

## See also

[Investigate sensor detections in a Device Inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
