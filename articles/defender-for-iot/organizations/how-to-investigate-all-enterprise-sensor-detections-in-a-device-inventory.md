---
title: Manage your OT device inventory from an on-premises management console
description: Learn how to view and manage OT devices (assets) from the Device Inventory page on an on-premises management console.
ms.topic: how-to
ms.date: 05/17/2023

---

# Manage your OT device inventory from an on-premises management console

Use the **Device inventory** page from an on-premises management console to manage all OT and IT devices detected by sensors connected to that console. Identify new devices detected, devices that might need troubleshooting, and more.

For more information, see [Devices monitored by Defender for IoT](architecture.md#devices-monitored-by-defender-for-iot).

> [!TIP]
> Alternately, view your device inventory from [the Azure portal](how-to-manage-device-inventory-for-organizations.md), or from an [OT sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md).
>

## Prerequisites

Before performing the procedures in this article, make sure that you have:

- An on-premises management console [installed](ot-deploy/install-software-on-premises-management-console.md), [activated, and configured](ot-deploy/activate-deploy-management.md). To view devices by zone, make sure that you've [configured sites and zones](ot-deploy/sites-and-zones-on-premises.md) on the on-premises management console.

- One or OT network sensors [installed](ot-deploy/install-software-ot-sensor.md), [configured, and activated](ot-deploy/activate-deploy-sensor.md), and [connected to your on-premises management console](ot-deploy/connect-sensors-to-management.md). To view devices per zone, make sure that each sensor is assigned to a specific zone.

- Access to the on-premises management console with one of the following [user roles](roles-on-premises.md):

    - **To view devices the on-premises management console**, sign in as an *Admin*, *Security Analyst*, or *Viewer* user.

    - **To export or import data**, sign in as an *Admin* or *Security Analyst* user.

    - **To use the CLI**, access the CLI via SSH/Telnet as a [privileged user](references-work-with-defender-for-iot-cli-commands.md).

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

For more information, see [Device inventory column data](device-inventory.md#device-inventory-column-data).

### View device inventory by zone

To view alerts from connected OT sensors for a specific zone, use the **Site Management** page on an on-premises management console.

1. Sign into your on-premises management console and select **Site Management**.

1. Locate the site and zone you want to view, using the filtering options at the top as needed:

    - **Connectivity**: Select to view only all OT sensors, or only connected / disconnected sensors only.
    - **Upgrade Status**: Select to view all OT sensors, or only those with a specific [software update status](update-ot-software.md#update-an-on-premises-management-console).
    - **Business Unit**: Select to view all OT sensors, or only those from a [specific business unit](best-practices/plan-corporate-monitoring.md#plan-ot-sites-and-zones).
    - **Region**: Select to view all OT sensors, or only those from a [specific region](best-practices/plan-corporate-monitoring.md#plan-ot-sites-and-zones).

1. Select **View device inventory** for a specific OT sensor to jump to the device inventory for that OT sensor.

## Export the device inventory to CSV

Export your device inventory to a CSV file to manage or share data outside of the OT sensor.

To export device inventory data, select the **Import/Export file** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon-device-inventory.png" border="false"::: button, and then select one of the following:

- **Export Device Inventory View**: Exports only the devices currently displayed, with the current filter applied
- **Export All Device Inventory**: Exports the entire device inventory, with no filtering

Save the exported file locally.

> [!NOTE]
> In the exported file, date values are based on the region settings for the machine you're using to access the OT sensor. We recommend exporting data only from a machine with the same region settings as the sensor that detected your data. For more information, see [Synchronize time zones on an OT sensor](how-to-manage-individual-sensors.md#synchronize-time-zones-on-an-ot-sensor).
>

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


## Next steps

For more information, see:

- [Defender for IoT device inventory](device-inventory.md)
- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
- [Detect Windows workstations and servers with a local script](detect-windows-endpoints-script.md)
- [Device data retention periods](references-data-retention.md#device-data-retention-periods).
