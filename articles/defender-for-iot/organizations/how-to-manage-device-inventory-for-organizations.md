---
title: Manage your device inventory from the Azure portal
description: Learn how to view and manage OT and IoT devices (assets) from the Device inventory page in the Azure portal.
ms.date: 06/27/2022
ms.topic: how-to
---

# Manage your device inventory from the Azure portal

Use the **Device inventory** page in the Azure portal to manage all network devices detected by cloud-connected sensors, including OT, IoT, and IT. Identify new devices detected, devices that might need troubleshooting, and more.

For more information, see [What is a Defender for IoT committed device?](architecture.md#what-is-a-defender-for-iot-committed-device).

> [!NOTE]
> The **Device inventory** page in Defender for IoT on the Azure portal is in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> Alternately, view device inventory from a [specific sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md), or from an [on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md).

## View the device inventory

This procedure describes how to view detected devices in the **Device inventory** page in the Azure portal.

1. In Defender for IoT in the Azure portal, select **Device inventory**.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-inventory.png" alt-text="Screenshot of the Device inventory page in the Azure portal." lightbox="media/how-to-manage-device-inventory-on-the-cloud/device-inventory.png":::

    Use any of the following options to modify or filter the devices shown:

    |Option  |Steps  |
    |---------|---------|
    | **Sort devices** | Select a column header to sort the devices by that column. Select it again to change the sort direction. |
    |**Filter devices shown**    |   Either use the **Search** box to search for specific device details, or select **Add filter** to filter the devices shown. <br><br>In the **Add filter** box, define your filter by column name, operator, and value. Select **Apply** to apply your filter.<br><br>You can apply multiple filters at the same time. Search results and filters aren't saved when you refresh the **Device inventory** page.|
    |**Modify columns shown**     |   Select **Edit columns** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/edit-columns-icon.png" border="false":::. In the **Edit columns** pane:<br><br>        - Select the **+ Add Column** button to add new columns to the grid.<br>        - Drag and drop fields to change the columns order.<br>- To remove a column, select the **Delete** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/trashcan-icon.png" border="false"::: icon to the right.<br>- To reset the columns to their default settings, select **Reset** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/reset-icon.png" border="false":::.   <br><br>Select **Save** to save any changes made.  |
    | **Group devices** | From the **Group by** above the gird, select either **Type** or **Class** to group the devices shown. Inside each group, devices retain the same column sorting. To remove the grouping, select **No grouping**. |

    For more information, see [Device inventory column reference](#device-inventory-column-reference).

1. Select a device row to view more details about that device. Initial details are shown in a pane on the right, where you can also select **View full details** to drill down more.

    For example:

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-information-window.png" alt-text="Screenshot of a device details pane and the View full details button in the Azure portal." lightbox="media/how-to-manage-device-inventory-on-the-cloud/device-information-window.png":::


### Identify devices that aren't connecting successfully

If you suspect that certain devices aren't actively communicating with Azure, we recommend that you verify whether those devices have communicated with Azure recently at all. For example:

1. In the **Device inventory** page, make sure that the **Last activity** column is shown.

    Select **Edit columns** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/edit-columns-icon.png" border="false"::: > **Add column** > **Last Activity** > **Save**.

1. Select the **Last activity** column to sort the grid by that column.

1. Filter the grid to show active devices during a specific time period:

    1. Select **Add filter**.
    1. In the **Column** field, select **Last activity**.
    1. Select a predefined time range, or define a custom range to filter for.
    1. Select **Apply**.

1. Search for the devices you're verifying in the filtered list of devices.

## Edit device details

As you manage your network devices, you may need to update their details. For example, you may want to modify security value as assets change, or personalize the inventory to better identify devices, or if a device was classified incorrectly.

**To edit device details**:

1. Select one or more devices in the grid, and then select **Edit** :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/edit-device-details.png" border="false":::.

1. If you've selected multiple devices, select **Add field type** and add the fields you want to edit, for all selected devices.

1. Modify the device fields as needed, and then select **Save** when you're done.

Your updates are saved for all selected devices.

For more information, see [Device inventory column reference](#device-inventory-column-reference).

### Reference of editable fields

The following device fields are supported for editing in the **Device inventory** page:

|Name  |Description  |
|---------|---------|
| **General information** | |
|**Name** | Mandatory. Supported for editing only when editing a single device. |
|**Authorized Device**     |Toggle on or off as needed as device security changes.         |
|**Description**     |  Enter a meaningful description for the device.       |
|**Location**     |   Enter a meaningful location for the device.      |
|**Category**     | Use the **Class**, **Type**, and **Subtype** options to categorize the device.         |
|**Business Function**     | Enter a meaningful description of the device's business function.        |
|**Hardware Model**     |   Select the device's hardware model from the dropdown menu.      |
|**Hardware Vendor**     | Select the device's hardware vendor from the dropdown menu.        |
|**Firmware**      |   Device the device's firmware name and version. You can either select the **delete** button to delete an existing firmware definition, or select **+ Add** to add a new one.  |
|**Tags**     | Enter meaningful tags for the device. Select the **delete**  button to delete an existing tag, or select **+ Add** to add a new one.         |
| **Settings** |
|**Importance**     | Select **Low**, **Normal**, or **High** to modify the device's importance.        |
|**Programming device**     | Toggle the **Programming Device** option on or off as needed for your device.        |

For more information, see [Device inventory column reference](#device-inventory-column-reference).

## Export the device inventory to CSV

Export your device inventory to a CSV file to manage or share data outside of the Azure portal. You can export a maximum of 30,000 devices at a time.

**To export device inventory data**:

On the **Device inventory page**, select **Export** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/export-button.png" border="false":::.

The device inventory is exported with any filters currently applied, and you can save the file locally.


## Delete a device

If you have devices no longer in use, delete them from the device inventory so that they're no longer connected to Defender for IoT.

Devices might be inactive because of misconfigured SPAN ports, changes in network coverage, or because the device was unplugged from the network.

Delete inactive devices to maintain a correct representation of current network activity, better understand your committed devices when managing your Defender for IoT plans, and to reduce clutter on your screen.

**To delete a device**:

In the **Device inventory** page, select the device you want to delete, and then select **Delete** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/delete-device.png" border="false"::: in the toolbar at the top of the page.

At the prompt, select **Yes** to confirm that you want to delete the device from Defender for IoT.

## Device inventory column reference

The following table describes the device properties shown in the **Device inventory** page on the Azure portal.

| Parameter | Description |
|--|--|
| **Application** | The application that exists on the device. |
|**Authorized Device**     |Editable. Determines whether or not the device is *authorized*. This value may change as device security changes.         |
|**Business Function**     | Editable. Describes the device's business function.        |
| **Class** | Editable. The class of the device. <br>Default: `IoT`|
| **Data source** | The source of the data, such as a micro agent, OT sensor, or Microsoft Defender for Endpoint. <br>Default: `MicroAgent`|
| **Description** | Editable. The description of the device. |
| **Firmware vendor** | Editable. The vendor of the device's firmware. |
| **Firmware version** |Editable.  The version of the firmware. |
| **First seen** | The date, and time the device was first seen. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
|**Hardware Model**     |  Editable.  Determines the device's hardware model.     |
|**Hardware Vendor**     |Editable.  Determines the device's hardware vendor.        |
| **Importance** | Editable. The level of importance of the device. |
| **IPv4 Address** | The IPv4 address of the device. |
| **IPv6 Address** | The IPv6 address of the device. |
| **Last activity** | The date, and time the device last sent an event to the cloud. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
| **Last update time** | The date, and time the device last sent a system information event to the cloud. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
| **Location** | Editable. The physical location of the device. |
| **MAC Address** | The MAC address of the device. |
| **Model** | The device's model. |
| **Name** | Mandatory, and editable. The name of the device as the sensor discovered it, or as entered by the user. |
| **OS architecture** | Editable. The architecture of the operating system. |
| **OS distribution** | Editable. The distribution of the operating system, such as Android, Linux, and Haiku. |
| **OS platform** | Editable. The OS of the device, if detected. |
| **OS version** | Editable. The version of the operating system, such as Windows 10 and Ubuntu 20.04.1. |
| **PLC mode** | The PLC operating mode that includes the Key state (physical, or logical), and the Run state (logical). Possible Key states include, `Run`, `Program`, `Remote`, `Stop`, `Invalid`, and `Programming Disabled`. Possible Run states are `Run`, `Program`, `Stop`, `Paused`, `Exception`, `Halted`, `Trapped`, `Idle`, or `Offline`. If both states are the same, then only one state is presented. |
| **PLC secured** | Determines if the PLC mode is in a secure state. A possible secure state is `Run`. A possible unsecured state can be either `Program`, or `Remote`. |
|**Programming device**     | Editable.  Determines whether the device is a *Programming Device*. |
| **Programming time** | The last time the device was programmed.  |
| **Protocols** | The protocols that the device uses. |
| **Purdue level** | Editable. The Purdue level in which the device exists. |
| **Scanner** | Whether the device performs scanning-like activities in the network. |
| **Sensor** | The sensor the device is connected to.  |
| **Site** | The site that contains this device. <br><br>All Enterprise IoT sensors are automatically added to the **Enterprise network** site.|
| **Slots** | The number of slots the device has.  |
| **Subtype** | Editable. The subtype of the device, such as speaker and smart tv. <br>**Default**: `Managed Device` |
| **Tags** | Editable. Tagging data for each device. |
| **Type** | Editable. The type of device, such as communication, and industrial. <br>**Default**: `Miscellaneous` |
| **Underlying devices** | Any relevant underlying devices for the device |
| **Underlying device region** | The region for an underlying device |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |
| **VLAN** | The VLAN of the device. |
| **Zone** | The zone that contains this device. |

## Next steps

For more information, see:

- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
- [Detect Windows workstations and servers with a local script](detect-windows-endpoints-script.md)
