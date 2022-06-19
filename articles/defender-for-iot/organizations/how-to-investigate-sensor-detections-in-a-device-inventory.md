---
title: View detected devices from an OT sensor console - Microsoft Defender for IoT
description: Learn about how to view detected devices on an OT sensor console.
ms.date: 06/12/2022
ms.topic: how-to
zone_pivot_groups: on-prem-exp-d4iot
---

# View detected devices on-premises

Use the **Device inventory** page on a sensor to new network devices detected by that sensor, or on an on-premises management console to view network devices detected by connected sensors.

The **Device inventory** page displays all detected OT devices in your network, and allows you to identify new devices detected, devices that might need troubleshooting, and more.

The sensor and on-premises management console each provide different options for viewing and managing devices. Select one of the following options, depending on where you're viewing your network devices:

::: zone pivot="experience-sensor"

For more information, see [Devices monitored by Defender for IoT](architecture.md#devices-monitored-by-defender-for-iot).

## View the device inventory

This procedure describes how to view detected devices in the **Device inventory** page in an OT sensor console.

1. Sign-in to your OT sensor console, and then select **Device inventory**.

    :::image type="content" source="media/how-to-inventory-sensor/inventory-sensor.png" alt-text="Screenshot that shows the Device inventory main screen.":::

    Use any of the following options to modify or filter the devices shown:

    |Option  |Steps  |
    |---------|---------|
    | **Sort devices** | Select a column header to sort the devices by that column. |
    |**Filter devices shown**    |   Select **Add filter** to filter the devices shown. <br><br>In the **Add filter** box, define your filter by column name, operator, and filter value. Select **Apply** to apply your filter.<br><br>You can apply multiple filters at the same time. Search results and filters aren't saved when you refresh the **Device inventory** page. For more information, see [Save device inventory filters](#save-device-inventory-filters).|
    | **Save a filter** | To save the current set of filters<br><br>1. Select **+Save Filter**. <br>2. In the **Create New Device Inventory Filter** pane on the right, enter a name for your filter, and then select **Submit**. <br><br>Saved filters are also saved as **Device map** groups, and provides extra granularity when [viewing network devices](how-to-work-with-the-sensor-device-map.md) on the **Device map** page. |
    | **Load a saved filter** | If you have predefined filters saved, load them by selecting the **show side pane** :::image type="icon" source="media/how-to-inventory-sensor/show-side-pane.png" border="false"::: button, and then select the filter you want to load. |
    |**Modify columns shown**     |    **Edit Columns**. In the **Edit columns** pane:<br><br>        - Select **Add Column** to add new columns to the grid<br>        - Drag and drop fields to change the columns order.<br>- To remove a column, select the **Delete** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/trashcan-icon.png" border="false"::: icon to the right.<br>- To reset the columns to their default settings, select **Reset** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/reset-icon.png" border="false":::.   <br><br>Select **Save** to save any changes made.  |

    For more information, see [Device inventory column reference](#device-inventory-column-reference).

1. Select a device row to view more details about that device. Initial details are shown in a pane on the right, where you can also select **View full details** to drill down more.

    For example:

    :::image type="content" source="media/how-to-inventory-sensor/inventory-sensor.png" alt-text="Screenshot of the Device inventory page on an OT sensor console.":::

## Edit device details

As you manage your network devices, you may need to update their details. For example, you may want to modify security value as assets change, or personalize the inventory to better identify devices, or if a device was classified incorrectly.

**To edit device details**:

1. Select one or more devices in the grid, and then select **View full details** in the pane on the right.

1. In the device details page, select **Edit Properties**.

1. In the **Edit** pane on the right, modify the device fields as needed, and then select **Save** when you're done.

Editable fields include:

- Authorized status
- Device name
- Device type
- OS
- Purdue layer
- Description

## Export the device inventory to CSV

Export your device inventory to a CSV file to manage or share data outside of the OT sensor.

To export device inventory data, select **Export** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/export-button.png" border="false":::.

The device inventory is exported with any filters currently applied, and you can save the file locally.

## Delete a device

If you have devices no longer in use, delete them from the device inventory so that they're no longer connected to Defender for IoT.

Devices might be inactive because of misconfigured SPAN ports, changes in network coverage, or because the device was unplugged from the network.

Delete inactive devices to maintain a correct representation of current network activity, better understand your committed devices when managing your Defender for IoT plans, and to reduce clutter on your screen.

Devices you delete from the Inventory are removed from the map and won't be calculated when generating Defender for IoT reports, for example Data Mining, Risk Assessment, and Attack Vector reports.

> [!NOTE]
> Devices must be inactive for 7 days or more in order for you to be able to delete them.
>

**To delete inactive devices**:

1. On the **Device inventory** page, filter the grid by the **Last Activity** field. In the **Filter** field, select one of the following time periods:

    - for seven days or more
    - for 14 days or more
    - 30 days or more
    - 90 days or more

1. Select **Delete Inactive Devices**. In the prompt displayed, enter the reason you're deleting the devices, and then select **Delete**. 

    All devices detected within the range of the selected filter are deleted. If there are a large number of devices to delete, the process may take a few minutes.



## Device inventory column reference

The following columns are available for each device.

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

::: zone-end

::: zone pivot="experience-cm"

## View the device inventory

To view detected devices in the **Device Inventory** page in an on-premises management console, sign-in to your on-premises management console, and then select **Device Inventory**. 

For example:

:::image type="content" source="media/how-to-work-with-asset-inventory-information/device-inventory-data-table.png" alt-text="Screenshot of the on-premises management console Device Inventory page.":::

Use any of the following options to modify or filter the devices shown:

|Option  |Steps  |
|---------|---------|
| **Sort devices** | To sort the grid by a specific column, select the **Sort** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-order-icon.png" border="false"::: button in the column youwant to sort by. Use the arrow buttons that appear to sort ascending or descending. |
|**Filter devices shown**    |   In the column that you want to filter, select the **Filter** button :::image type="icon" source="media/how-to-work-with-asset-inventory-information/filter-a-column-icon.png" border="false":::.<br><br>In the **Filter** box, define your filter value.  <br><br>Filters aren't saved when you refresh the **Device Inventory** page. |
| **Save a filter** | To save the current set of filters, select the **Save As** button that appears in the filter row.|
| **Load a saved filter** | Saved filters are listed on the left, in the **Groups** pane. <br><br>1. Select the **Options** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/options-menu.png"border="false"::: button in the toolbar to display the **Groups** pane. <br>2. In the **Device Inventory Filters** list, select the saved filter you want to load.  |
For more information, see [Device inventory column reference](#device-inventory-column-reference).

## Device inventory column reference

The following columns are available for each device.

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

## Enhance device inventory data

Enhance the data in your device inventory with information from other sources, such as CMDBs, DNS, firewalls, and Web APIs. Use enhanced data to learn things such as:

- Device purchase dates and end-of-warranty dates
- Users responsible for each device
- Opened tickets for devices
- The last date when the firmware was upgraded
- Devices allowed access to the internet
- Devices running active antivirus applications
- Users signed in to devices

Enhancement data is shown as extra columns in the on-premises management console **Device inventory** page.

Enhance data by adding it manually or by running customized scripts from Defender for IoT. You can also work with Defender for IoT support to set up your system to receive Web API queries.

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

1. Contact [Microsoft Support](https://support.serviceshub.microsoft.com/supportforbusiness/create?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099) to obtain the relevant scripts.

1. Sign in to your on-premises management console, and select **Device inventory**.

1. On the side, select the **Settings** :::image type="icon" source="media/how-to-work-with-asset-inventory-information/menu-icon.png" border="false"::: button to open the **Device Inventory Settings** dialog.

1. In the **Device Inventory Settings** dialog box, select **ADD CUSTOM COLUMN**.

1. In the **Add Custom Column** dialog box, add the new column name using up to 250 UTF characters.

1. Select **Automatic**. When the **UPLOAD SCRIPT** and **TEST SCRIPT** buttons appear, upload and then test the script you'd received from [Microsoft Support](https://support.serviceshub.microsoft.com/supportforbusiness/create?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

The new data appears in the **Device Inventory** grid.

---


## Retrieve device inventory data via API

You can retrieve an extensive range of device information detected by managed sensors and integrate that information with partner systems.

For example, retrieve sensor, zone, site ID, IP address, MAC address, firmware, protocol, and vendor information, and then filter that information based on any of the following:

- Authorized and unauthorized devices.

- Devices associated with specific sites.

- Devices associated with specific zones.

- Devices associated with specific sensors.

For more information, see [Defender for IoT sensor and management console APIs](references-work-with-defender-for-iot-apis.md).

::: zone-end




## Next steps

For more information, see:

- [View devices from the Azure portal for organizations](how-to-manage-device-inventory-for-organizations.md).
- [View devices from the Azure portal for device builders](../device-builders/how-to-manage-device-inventory-on-the-cloud.md#manage-your-iot-devices-with-the-device-inventory)
- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
- [Detect Windows workstations and servers with a local script](detect-windows-endpoints-script.md)