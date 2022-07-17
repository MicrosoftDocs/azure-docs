---
title: Manage your OT device inventory from a sensor console
description: Learn how to view and manage OT devices (assets) from the Device inventory page on a sensor console.
ms.date: 07/12/2022
ms.topic: how-to
---

# Manage your OT device inventory from a sensor console

Use the **Device inventory** page from a sensor console to manage all OT and IT devices detected by that console. Identify new devices detected, devices that might need troubleshooting, and more.

For more information, see [What is a Defender for IoT committed device?](architecture.md#what-is-a-defender-for-iot-committed-device).

> [!TIP]
> Alternately, view your device inventory from a [the Azure portal](how-to-manage-device-inventory-for-organizations.md), or from an [on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md).
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

For more information, see [Device inventory column reference](#device-inventory-column-reference).

## Edit device details

As you manage your network devices, you may need to update their details. For example, you may want to modify security value as assets change, or personalize the inventory to better identify devices, or if a device was classified incorrectly.

**To edit device details**:

1. Select one or more devices in the grid, and then select **View full details** in the pane on the right.

1. In the device details page, select **Edit Properties**.

1. In the **Edit** pane on the right, modify the device fields as needed, and then select **Save** when you're done.

Editable fields include:

:::row:::
   :::column span="":::
      - Authorized status
      - Device name
      - Device type
   :::column-end:::
   :::column span="":::
      - OS
      - Purdue layer
      - Description
   :::column-end:::
:::row-end:::

For more information, see [Device inventory column reference](#device-inventory-column-reference).

## Export the device inventory to CSV

Export your device inventory to a CSV file to manage or share data outside of the OT sensor.

To export device inventory data, on the **Device inventory** page, select **Export** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/export-button.png" border="false":::.

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

The following table describes the device properties shown in the **Device inventory** page on a sensor console.

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

## Next steps

For more information, see:

- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
- [Detect Windows workstations and servers with a local script](detect-windows-endpoints-script.md)
