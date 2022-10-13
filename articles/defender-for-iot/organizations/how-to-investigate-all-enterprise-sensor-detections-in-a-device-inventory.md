---
title: Manage your OT device inventory from an on-premises management console
description: Learn how to view and manage OT devices (assets) from the Device inventory page on an on-premises management console.
ms.topic: how-to
ms.date: 07/12/2022

---

# Manage your OT device inventory from an on-premises management console

Use the **Device inventory** page from an on-premises management console to manage all OT and IT devices detected by sensors connected to that console. Identify new devices detected, devices that might need troubleshooting, and more.

For more information, see [What is a Defender for IoT committed device?](architecture.md#what-is-a-defender-for-iot-committed-device).


> [!TIP]
> Alternately, view your device inventory from a [the Azure portal](how-to-manage-device-inventory-for-organizations.md), or from an [OT sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md).
>

## View the device inventory

To view detected devices in the **Device Inventory** page in an on-premises management console, sign-in to your on-premises management console, and then select **Device Inventory**. 

For example:

:::image type="content" source="media/how-to-work-with-asset-inventory-information/device-inventory-data-table.png" alt-text="Screenshot of the on-premises management console Device Inventory page." lightbox="media/how-to-work-with-asset-inventory-information/device-inventory-data-table.png":::

Use any of the following options to modify or filter the devices shown:

|Option  |Steps  |
|---------|---------|
| **Sort devices** | To sort the grid by a specific column, select the **Sort** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-order-icon.png" border="false"::: button in the column you want to sort by. Use the arrow buttons that appear to sort ascending or descending. |
|**Filter devices shown**    |  1. In the column that you want to filter, select the **Filter** button :::image type="icon" source="media/how-to-work-with-asset-inventory-information/filter-a-column-icon.png" border="false":::.<br>2. In the **Filter** box, define your filter value.  <br><br>Filters aren't saved when you refresh the **Device Inventory** page. |
| **Save a filter** | To save the current set of filters, select the **Save As** button that appears in the filter row.|
| **Load a saved filter** | Saved filters are listed on the left, in the **Groups** pane. <br><br>1. Select the **Options** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/options-menu.png"border="false"::: button in the toolbar to display the **Groups** pane. <br>2. In the **Device Inventory Filters** list, select the saved filter you want to load.  |

For more information, see [Device inventory column reference](#device-inventory-column-reference).

## Export the device inventory to CSV

Export your device inventory to a CSV file to manage or share data outside of the OT sensor.

To export device inventory data, select the **Import/Export file** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false"::: button, and then select one of the following:

- **Export Device Inventory View**: Exports only the devices currently displayed, with the current filter applied
- **Export All Device Inventory**: Exports the entire device inventory, with no filtering

Save the exported file locally.

## Add to and enhance device inventory data

Use information from other sources, such as CMDBs, DNS, firewalls, and Web APIs, to enhance the data shown in your device inventory. For example, use enhanced data to present information about the following items:

- Device purchase dates and end-of-warranty dates
- Users responsible for each device
- Opened tickets for devices
- The last date when the firmware was upgraded
- Devices allowed access to the internet
- Devices running active antivirus applications
- Users signed in to devices

Added and enhancement data is shown as extra columns, in addition to the existing columns available in the on-premises management console **Device inventory** page.

Enhance data by adding it manually or by running a customized version of our [automation script sample](custom-columns-sample-script.md). You can also open a support ticket to set up your system to receive Web API queries.

For example, the following image shows an example of how you might use enhanced data in the device inventory:

:::image type="content" source="media/how-to-work-with-asset-inventory-information/enterprise-data-integrator-graph.png" alt-text="Diagram of the data integrator.":::

# [Add data manually](#tab/manually)

To enhance your data manually:

1. Sign in to your on-premises management console, and select **Device inventory**.

1. On the top-right, select the **Settings** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon.png" border="false"::: button to open the **Device Inventory Settings** dialog.

1. In the **Device Inventory Settings** dialog box, select **ADD CUSTOM COLUMN**.

1. In the **Add Custom Column** dialog box, add the new column name using up to 250 UTF characters.

1. Select **Manual** > **SAVE**. The new item appears in the **Device Inventory Settings** dialog box.

1. In the upper-right corner of the **Device Inventory** window, select the **Import/Export file** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false"::: button > **Export All Device Inventory**.

    A CSV file is generated with the data displayed.

1. Download and open the CSV file for editing, and manually add your information to the new column.

1. Back in the **Device inventory** page, at the top-right, select the **Import/Export file** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false"::: button again > **Import Manual Input Columns**. Browse to and select your edited CSV file.

The new data appears in the **Device Inventory** grid.

# [Add data using automation](#tab/automation)

To enhance your data using automation scripts:

1. Copy the [sample automation script](custom-columns-sample-script.md) to a local file and modify it as needed.

1. Sign in to your on-premises management console, and select **Device inventory**.

1. On the side, select the **Settings** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon.png" border="false"::: button to open the **Device Inventory Settings** dialog.

1. In the **Device Inventory Settings** dialog box, select **ADD CUSTOM COLUMN**.

1. In the **Add Custom Column** dialog box, add the new column name using up to 250 UTF characters.

1. Select **Automatic**. When the **UPLOAD SCRIPT** and **TEST SCRIPT** buttons appear, upload and then test the script you'd customized earlier and saved locally.

The new data appears in the **Device Inventory** grid.

---

## Retrieve device inventory data via API

You can retrieve an extensive range of device information detected by managed sensors and integrate that information with partner systems.

For example:

1. Retrieve sensor, zone, site ID, IP address, MAC address, firmware, protocol, and vendor information.

1. Filter that information based on any of the following values:

    - Authorized and unauthorized devices.

    - Devices associated with specific sites.

    - Devices associated with specific zones.

    - Devices associated with specific sensors.

For more information, see [Defender for IoT sensor and management console APIs](references-work-with-defender-for-iot-apis.md).

## Device inventory column reference

The following table describes the device properties shown in the **Device inventory** page on an on-premises management console.

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
| **Is Programming Device** | Whether the device is a programming device:<br />- **True**: The device performs programming activities for PLCs, RTUs, and controllers, which are relevant to engineering stations.<br />- **False**: The device isn't a programming device. |
| **Groups** | Groups in which this device participates. |
| **Last Activity** | The last activity that the device performed. |
| **Discovered** | When this device was first seen in the network. |
| **PLC mode (preview)** | The PLC operating mode includes the Key state (physical) and run state (logical). Possible **Key** states include, Run, Program, Remote, Stop, Invalid, Programming Disabled.Possible Run. The possible **Run** states are Run, Program, Stop, Paused, Exception, Halted, Trapped, Idle, Offline. if both states are the same, only one state is presented. |
## Next steps

For more information, see:

- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
- [Detect Windows workstations and servers with a local script](detect-windows-endpoints-script.md)
