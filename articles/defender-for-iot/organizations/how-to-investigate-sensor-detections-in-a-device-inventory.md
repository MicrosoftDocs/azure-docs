---
title: Manage your OT device inventory from a sensor console
description: Learn how to view and manage OT devices (assets) from the Device inventory page on a sensor console.
ms.date: 05/17/2023
ms.topic: how-to
---

# Manage your OT device inventory from a sensor console

Use the **Device inventory** page from a sensor console to manage all OT and IT devices detected by that console. Identify new devices detected, devices that might need troubleshooting, and more.

For more information, see [Devices monitored by Defender for IoT](architecture.md#devices-monitored-by-defender-for-iot).

> [!TIP]
> Alternately, view your device inventory from [the Azure portal](how-to-manage-device-inventory-for-organizations.md), or from an [on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md).
>

## View the device inventory

This procedure describes how to view detected devices in the **Device inventory** page in an OT sensor console.

1. Sign-in to your OT sensor console, and then select **Device inventory**.

    :::image type="content" source="media/how-to-work-with-asset-inventory-information/sensor-device-inventory.png" alt-text="Screenshot of the sensor console's Device inventory page." lightbox="media/how-to-work-with-asset-inventory-information/sensor-device-inventory.png":::

    Use any of the following options to modify or filter the devices shown:

    |Option  |Steps  |
    |---------|---------|
    | **Sort devices** | Select a column header to sort the devices by that column. |
    |**Filter devices shown**    |   Select **Add filter** to filter the devices shown. <br><br>In the **Add filter** box, define your filter by column name, operator, and filter value. Select **Apply** to apply your filter.<br><br>You can apply multiple filters at the same time. Search results and filters aren't saved when you refresh the **Device inventory** page. |
    | **Save a filter** | To save the current set of filters:<br><br>1. Select **+Save Filter**. <br>2. In the **Create New Device Inventory Filter** pane on the right, enter a name for your filter, and then select **Submit**. <br><br>Saved filters are also saved as **Device map** groups, and provides extra granularity when [viewing network devices](how-to-work-with-the-sensor-device-map.md) on the **Device map** page. |
    | **Load a saved filter** | If you have predefined filters saved, load them by selecting the **show side pane** :::image type="icon" source="media/how-to-inventory-sensor/show-side-pane.png" border="false"::: button, and then select the filter you want to load. |
    |**Modify columns shown**     | Select **Edit Columns** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/edit-columns-icon.png" border="false":::. In the **Edit columns** pane:<br><br>        - Select **Add Column** to add new columns to the grid<br>        - Drag and drop fields to change the columns order.<br>- To remove a column, select the **Delete** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/trashcan-icon.png" border="false"::: icon to the right.<br>- To reset the columns to their default settings, select **Reset** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/reset-icon.png" border="false":::.   <br><br>Select **Save** to save any changes made.  |

1. Select a device row to view more details about that device. Initial details are shown in a pane on the right, where you can also select **View full details** to drill down more.

    For example:

    :::image type="content" source="media/how-to-inventory-sensor/sensor-inventory-view-details.png" alt-text="Screenshot of the Device inventory page on an OT sensor console." lightbox="media/how-to-inventory-sensor/sensor-inventory-view-details.png":::

For more information, see [Device inventory column data](device-inventory.md#device-inventory-column-data).

## Edit device details

As you manage your network devices, you may need to update their details. For example, you may want to modify security value as assets change, or personalize the inventory to better identify devices, or if a device was classified incorrectly.

If you're working with a cloud-connected sensor, any edits you make in the sensor console are updated in the Azure portal.

**To edit device details**:

1. Select a device in the grid, and then select **Edit** in the toolbar at the top of the page.

1. In the **Edit** pane on the right, modify the device fields as needed, and then select **Save** when you're done.

You can also open the edit pane from the device details page:

1. Select a device in the grid, and then select **View full details** in the pane on the right.

1. In the device details page, select **Edit Properties**.

1. In the **Edit** pane on the right, modify the device fields as needed, and then select **Save** when you're done.

Editable fields include:

- Authorized status
- Device name
- Device type
- OS
- Purdue level
- Description
- Scanner or programming device

For more information, see [Device inventory column data](device-inventory.md#device-inventory-column-data).

## Export the device inventory to CSV

Export your device inventory to a CSV file to manage or share data outside of the OT sensor.

To export device inventory data, on the **Device inventory** page, select **Export** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/export-button.png" border="false":::.

The device inventory is exported with any filters currently applied, and you can save the file locally.

> [!NOTE]
> In the exported file, date values are based on the region settings for the machine you're using to access the OT sensor. We recommend exporting data only from a machine with the same region settings as your sensor. For more information, see [Synchronize time zones on an OT sensor](how-to-manage-individual-sensors.md#synchronize-time-zones-on-an-ot-sensor).
> 

## Merge devices

You may need to merge duplicate devices if the sensor has discovered separate network entities that are associated with a single, unique device.

Examples of this scenario might include a PLC with four network cards, a laptop with both WiFi and a physical network card, or a single workstation with multiple network cards.

> [!NOTE]
>
> - You can only merge authorized devices.
> - Device merges are irreversible. If you merge devices incorrectly, you'll have to delete the merged device and wait for the sensor to rediscover both devices.
> - Alternately, merge devices from the [Device map](how-to-work-with-the-sensor-device-map.md) page.
When merging, you instruct the sensor to combine the device properties of two devices into one. When you do this, the Device Properties window and sensor reports will be updated with the new device property details.

For example, if you merge two devices, each with an IP address, both IP addresses will appear as separate interfaces in the Device Properties window.

**To merge devices from the device inventory:**

1. In the **Device inventory** page, select the devices you want to merge, and then select **Merge** in the toolbar at the top of the page.

1. At the prompt, select **Confirm** to confirm that you want to merge the devices.

The devices are merged, and a confirmation message appears at the top right.

## View inactive devices

You may want to view devices in your network that have been inactive and delete them.

For example, devices may become inactive because of misconfigured SPAN ports, changes in network coverage, or by unplugging them from the network

**To view inactive devices**, filter the device inventory to display devices that have been inactive.

On the **Device inventory** page:

1. Select **Add filter**.
1. Select **Last Activity** in the column field.
1. Choose the time period in the **Filter** field. Filtering options include seven days or more, 14 days or more, 30 days or more, or 90 days or more.

> [!TIP]
> We recommend that you [delete](#delete-devices) inactive devices to display a more accurate representation of current network activity, better evaluate the number of [devices](architecture.md#devices-monitored-by-defender-for-iot) being monitored, and reduce clutter on your screen.

## Delete devices

You may want to delete devices from your device inventory, such as if they've been [merged incorrectly](#merge-devices), or are [inactive](#view-inactive-devices).

Deleted devices are removed from the **Device map** and the device inventories on the Azure portal and on-premises management console, and aren't calculated when generating reports, such as Data Mining, Risk Assessment, or Attack Vector reports.

**To delete one or more devices**:

You can delete a device when it's been inactive for more than 10 minutes.

1. In the **Device inventory** page, select the device or devices you want to delete, and then select **Delete** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/delete-device.png" border="false"::: in the toolbar at the top of the page.

1. At the prompt, select **Confirm** to confirm that you want to delete the device or devices from Defender for IoT.

The device or devices are deleted, and a confirmation message appears at the top right.

**To delete all inactive devices**:

This procedure is supported for the admin users only, including the *support* user. 

1. Select the **Last Activity** filter icon in the Inventory.
1. Select a filter option.
1. Select **Apply**.
1. Select **Delete Inactive Devices**. In the prompt displayed, enter the reason you're deleting the devices, and then select **Delete**.

All devices detected within the range of the filter will be deleted. If you delete a large number of devices, the delete process may take a few minutes.

## Next steps

For more information, see:

- [Defender for IoT device inventory](device-inventory.md)
- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
- [Detect Windows workstations and servers with a local script](detect-windows-endpoints-script.md)
- [Device data retention periods](references-data-retention.md#device-data-retention-periods)
