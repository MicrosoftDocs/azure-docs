---
title: Learn about devices discovered by all enterprise sensors
description: Use the device inventory in the on-premises management console to get a comprehensive view of device information from connected sensors. Use import, export, and filtering tools to manage this information. 
ms.date: 12/02/2020
ms.topic: how-to
---

# Investigate all enterprise sensor detections in the device inventory

You can view device information from connected sensors by using the *device inventory* in the on-premises management console. This feature gives you a comprehensive view of all network information. Use import, export, and filtering tools to manage this information. The status information about the connected sensor versions also appears.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/device-inventory-data-table.png" alt-text="Screenshot of the device inventory data table.":::

The following table describes the table columns in the device inventory.

| Parameter | Description |
|--|--|
| **Unacknowledged Alerts** | The number of unhandled alerts associated with this device. |
| **Business Unit** | The business unit that contains this device. |
| **Region** | The region that contains this device. |
| **Site** | The site that contains this device. |
| **Zone** | The zone that contains this device. |
| **Appliance** | The Azure Defender for IoT sensor that protects this device. |
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
| **Is Authorized** | The authorization status of the device:<br />- **True**: The device has been authorized.<br />- **False**: The device has not been authorized. |
| **Is Known as Scanner** | Whether this device performs scanning-like activities in the network. |
| **Is Programming Device** | Whether this is a programming device:<br />- **True**: The device performs programming activities for PLCs, RTUs, and controllers, which are relevant to engineering stations.<br />- **False**: The device is not a programming device. |
| **Groups** | Groups in which this device participates. |
| **Last Activity** | The last activity that the device performed. |
| **Discovered** | When this device was first seen in the network. |

## Integrate data into the enterprise device inventory

Data integration capabilities let you enhance the data in the device inventory with information from other enterprise resources. These sources include CMDBs, DNS, firewalls, and Web APIs.

You can use this information to learn. For example:

- Device purchase dates and end-of-warranty dates

- Users responsible for each device

- Opened tickets for devices

- The last date when firmware was upgraded

- Devices allowed access to the internet

- Devices running active antivirus applications

- Users signed in to devices

:::image type="content" source="media/how-to-work-with-asset-inventory-information/asset-inventory-screen-with-items-highlighted-v2.png" alt-text="Data table on the device inventory screen.":::

You can integrate data by either:

- Adding it manually

- Running customized scripts that Defender for IoT provides

:::image type="content" source="media/how-to-work-with-asset-inventory-information/enterprise-data-integrator-graph.png" alt-text="Diagram of the enterprise data integrator.":::

You can work with Defender for IoT technical support to set up your system to receive Web API queries.

To add data manually:

1. On the side menu, select **Device Inventory** and then select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon.png" border="false":::.

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/asset-inventory-settings-v2.png" alt-text="Edit your device's inventory settings.":::

2. In the **Device Inventory Settings** dialog box, select **ADD CUSTOM COLUMN**.

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/add-custom-column.png" alt-text="Add a custom column to your inventory.":::

3. In the **Add Custom Column** dialog box, add the new column name (up to 250 characters UTF), select **Manual**, and select **SAVE**. The new item appears in the **Device Inventory Settings** dialog box.

4. In the upper-right corner of the **Device Inventory** window, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false"::: and select **Export All Device Inventory**. The CSV file is generated.

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/sample-exported-csv-file.png" alt-text="The exported CSV file.":::

5. Manually add the information to the new column and save the file.

6. In the upper-right corner of the **Device Inventory** window, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false":::, select **Import Manual Input Columns**, and browse to the CSV file. The new data appears in the **Device Inventory** table.

To integrate data from other enterprise entities:

1. In the upper-right corner of the **Device Inventory** window, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false"::: and select **Export All Device Inventory**.

2. In the **Device Inventory Settings** dialog box, select **ADD CUSTOM COLUMN**.

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/add-custom-column.png" alt-text="Add a custom column to your inventory.":::

3. In the **Add Custom Column** dialog box, add the new column name (up to 250 characters UTF), and then select **Automatic**. The **UPLOAD SCRIPT** and **TEST SCRIPT** options appear.

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/add-custom-column-automatic.png" alt-text="Automatically add custom columns.":::

4. Upload and test the script that you received from [Microsoft Support](https://support.serviceshub.microsoft.com/supportforbusiness/create?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Retrieve information from the device inventory

You can retrieve an extensive range of device information detected by managed sensors and integrate that information with partner systems. For example, you can retrieve sensor, zone, site ID, IP address, MAC address, firmware, protocol, and vendor information. Filter information that you retrieve based on:

- Authorized and unauthorized devices.

- Devices associated with specific sites.

- Devices associated with specific zones.

- Devices associated with specific sensors.

Work with Defender for IoT API commands to retrieve and integrate this information. For more information, see [Defender for IoT API sensor and management console APIs](references-work-with-defender-for-iot-apis.md).

## Filter the device inventory

You can filter the device inventory to show columns of interest. For example, you can view PLC device information.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/asset-inventory-view-v2.png" alt-text="Screenshot of the device inventory.":::

The filter is cleared when you leave the window.

To use the same filter multiple times, you can save a filter or a combination of filters that you need. You can open a left pane and view the filters that you've saved:

:::image type="content" source="media/how-to-work-with-asset-inventory-information/view-your-asset-inventories-v2.png" alt-text="Device inventories screen.":::

To filter the device inventory:

1. In the column that you want to filter, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/filter-a-column-icon.png" border="false":::.

2. In the **Filter** dialog box, select the filter type:

   - **Equals**: The exact value according to which you want to filter the column. For example, if you filter the protocol column according to **Equals** and `value=ICMP`, the column will present devices that use the ICMP protocol only.

   - **Contains**: The value that's contained among other values in the column. For example, if you filter the protocol column according to **Contains** and `value=ICMP`, the column will present devices that use the ICMP protocol as a part of the list of protocols that the device uses.

3. To organize the column information according to alphabetical order, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-order-icon.png" border="false":::. Arrange the order by selecting the :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-a-z-order-icon.png" border="false"::: and :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-z-a-order-icon.png" border="false"::: arrows.

4. To save a new filter, define the filter and select **Save As**.

5. To change the filter definitions, change the definitions and select **Save Changes**.

## View device information per zone

You can learn the following information about devices in a zone.

### View a device map

To view a sensor device map for a selected zone:

- In the **Site Management** window, select **View Zone Map** from the bar that contains the zone name.

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/default-region-to-default-business-unit-v2.png" alt-text="Default region to default business unit.":::

The **Device Map** window appears. It shows all the network elements related to the selected zone, including the sensors, the devices connected to them, and other information.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/zone-map-screenshot.png" alt-text="Screenshot of the zone map.":::

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

### View alerts associated with a zone

To view alerts associated with a specific zone:

- Select the alert icon form the **Zone** window. 

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/business-unit-view-v2.png" alt-text="The default Business Unit view with examples.":::

For more information, see [Overview: Working with alerts](how-to-work-with-alerts-on-premises-management-console.md).

### View the device inventory of a zone

To view the device inventory associated with a specific zone:

- Select **View Device Inventory** from the **Zone** window.

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/default-business-unit.png" alt-text="The device inventory screen will appear.":::

For more information, see [Investigate all enterprise sensor detections in a device inventory](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md).

### View additional zone information

The following additional zone information is available:

- **Zone details**: View the number of devices, alerts, and sensors associated with the zone.

- **Sensor details**: View the name, IP address, and version of each sensor assigned to the zone.

- **Connectivity status**: If a sensor is disconnected, connect from the sensor. See [Connect sensors to the on-premises management console](how-to-activate-and-set-up-your-on-premises-management-console.md#connect-sensors-to-the-on-premises-management-console). 

- **Update progress**: If the connected sensor is being upgraded, upgrade statuses will appear. During upgrade, the on-premises management console does not receive device information from the sensor.

## See also

[Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
