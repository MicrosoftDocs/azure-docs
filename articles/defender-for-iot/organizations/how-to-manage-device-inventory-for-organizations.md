---
title: Manage your IoT devices with the device inventory for organizations
description: Learn how to manage your IoT devices with the device inventory for organizations.
ms.date: 03/09/2022
ms.topic: how-to
---

# Manage your IoT devices with the device inventory for organizations

> [!NOTE]
> The **Device inventory** page in Defender for IoT on the Azure portal is in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

The device inventory can be used to view device systems, and network information. The search, filter, edit columns, and export tools can be used to manage this information.

:::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-inventory-screenshot.png" alt-text="A total overview of Defender for IoT's device inventory screen."  lightbox="media/how-to-manage-device-inventory-on-the-cloud/device-inventory-screenshot.png":::

Some of the benefits of the device inventory include:

- Identify all IT, IoT, and OT devices from different inputs. For example, to identify new devices detected in the last day or which devices aren't communicating and might require troubleshooting.

- Group, and filter devices by site, type, or vendor.

- Gain visibility into each device, and investigate the different threats, and alerts for each one.

- Export the entire device inventory to a CSV file for your reports.

## View the device inventory

1. Open the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for IoT** > **Device inventory**.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-inventory.png" alt-text="Select device inventory from the left side menu under Defender for IoT.":::


## Customize the device inventory table

In the device inventory table, you can add or remove columns. You can also change the column order by dragging and dropping a field.

**To customize the device inventory table**:

1. Select the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/edit-columns-icon.png" border="false"::: button.

1. In the Edit columns tab, select the drop-down menu to change the value of a column.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-drop-down-menu.png" alt-text="Select the drop-down menu to change the value of a given column.":::

1. Add a column by selecting the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/add-column-icon.png" border="false"::: button.

1. Reorder the columns by dragging a column parameter to a new location.

1. Delete a column by selecting the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/trashcan-icon.png" border="false"::: button.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/delete-a-column.png" alt-text="Select the trash can icon to delete a column.":::

1. Select **Save** to save any changes made.

If you want to reset the device inventory to the default settings, in the Edit columns window, select the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/reset-icon.png" border="false"::: button.

## Filter the device inventory

You can search, and filter the device inventory to define what information the table displays.

**To filter the device inventory**:

1. Select **Add filter**

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/add-filter.png" alt-text="Select  the add filter button to specify what you want to appear in the device inventory.":::

1. In the Add filter window, select the column drop-down menu to choose which column to filter.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/add-filter-window.png" alt-text="Select which column you want to filter in the device inventory.":::

1. Enter a value in the filter field to filter by.

1. Select the **Apply button**.

Multiple filters can be applied at one time. The filters aren't saved when you leave the Device inventory page.

## View device information

To view a specific devices information, select the device and the device information window appears.

:::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-information-window.png" alt-text="Select a device to see all of that device's information." lightbox="media/how-to-manage-device-inventory-on-the-cloud/device-information-window.png":::

## Edit device details

As you manage your devices, you may need to update their details, such as to modify security value as assets change, to personalize an inventory so that you can better identify specific devices, or if a device was classified incorrectly.

You can edit device details for each device, one at a time, or select multiple devices to edit details together.

**To edit details for a single device**:

1. In the **Device inventory** page, select the device you want to edit, and then select **Edit** :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/edit-device-details.png" border="false"::: in the toolbar at the top of the page.

    The **Edit** pane opens at the right.

1. Modify any of the field values as needed. For more information, see [Reference of editable fields](#reference-of-editable-fields).

1. Select **Save** when you're finished editing the device details.

**To edit details for multiple devices simultaneously**:

1. In the **Device inventory** page, select the devices you want to edit, and then select **Edit** :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/edit-device-details.png" border="false"::: in the toolbar at the top of the page.

    The **Edit** pane opens at the right.

1. Select **Add field type**, and then select one or more fields to edit.

1. Update your field definitions as needed, and then select **Save**. For more information, see [Reference of editable fields](#reference-of-editable-fields).

Your updates are saved for all selected devices.

### Reference of editable fields

The following device fields are supported for editing in the Device inventory page:

**General information**:

|Name  |Description  |
|---------|---------|
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


**Settings**:

|Name  |Description  |
|---------|---------|
|**Importance**     | Select **Low**, **Normal**, or **High** to modify the device's importance.        |
|**Programming device**     | Toggle the **Programming Device** option on or off as needed for your device.        |

## Export the device inventory to CSV

You can export your device inventory to a CSV file. Any filters that you apply to the device inventory table will be exported, when you export the table.

Select the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/export-button.png" border="false"::: button to export your current device inventory to a CSV file.

## How to identify devices that haven't recently communicated with the Azure cloud

If you are under the impression that certain devices aren't actively communicating, there's a way to check, and see which devices haven't communicated in a specified time period.

**To identify all devices that have not communicated recently**:

1. Open the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for IoT** > **Device inventory**.

1. Select **Edit columns** > **Add column** > **Last Activity** > **Save**.

1. On the main Device inventory page, select **Last activity** to sort the page by last activity.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/last-activity.png" alt-text="Screenshot of the device inventory organized by last activity." lightbox="media/how-to-manage-device-inventory-on-the-cloud/last-activity.png":::

1. Select **Add filter** to add a filter on the last activity column.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/last-activity-filter.png" alt-text="Screenshot of the add filter screen where you can select the time period to see the last activity.":::

1. Enter a time period, or a custom date range, and select **Apply**.

## Delete a device

If you have devices no longer in use, delete them from the device inventory so that they're no longer connected to Defender for IoT.

Devices must be inactive for 14 days or more in order for you to be able to delete them.

**To delete a device**:

In the **Device inventory** page, select the device you want to delete, and then select **Delete** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/delete-device.png" border="false"::: in the toolbar at the top of the page.

If your device has had activity in the past 14 days, it isn't considered inactive, and the **Delete** button will be grayed-out.

At the prompt, select **Yes** to confirm that you want to delete the device from Defender for IoT.

## Device inventory column reference

The following table describes the device properties shown in the device inventory table.

| Parameter | Description |
|--|--|
| **Application** | The application that exists on the device. |
| **Class** | The class of the device. <br>Default: `IoT`|
| **Data source** | The source of the data, such as a micro agent, OT sensor, or Microsoft Defender for Endpoint. <br>Default: `MicroAgent`|
| **Description** | The description of the device. |
| **Firmware vendor** | The vendor of the device's firmware. |
| **Firmware version** | The version of the firmware. |
| **First seen** | The date, and time the device was first seen. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
| **Importance** | The level of importance of the device. |
| **IPv4 Address** | The IPv4 address of the device. |
| **IPv6 Address** | The IPv6 address of the device. |
| **Last activity** | The date, and time the device last sent an event to the cloud. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
| **Last update time** | The date, and time the device last sent a system information event to the cloud. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. |
| **Location** | The physical location of the device. |
| **MAC Address** | The MAC address of the device. |
| **Model** | The device's model. |
| **Name** | The name of the device as the sensor discovered it, or as entered by the user. |
| **OS architecture** | The architecture of the operating system. |
| **OS distribution** | The distribution of the operating system, such as Android, Linux, and Haiku. |
| **OS platform** | The OS of the device, if detected. |
| **OS version** | The version of the operating system, such as Windows 10 and Ubuntu 20.04.1. |
| **PLC mode** | The PLC operating mode that includes the Key state (physical, or logical), and the Run state (logical). Possible Key states include, `Run`, `Program`, `Remote`, `Stop`, `Invalid`, and `Programming Disabled`. Possible Run states are `Run`, `Program`, `Stop`, `Paused`, `Exception`, `Halted`, `Trapped`, `Idle`, or `Offline`. If both states are the same, then only one state is presented. |
| **PLC secured** | Determines if the PLC mode is in a secure state. A possible secure state is `Run`. A possible unsecured state can be either `Program`, or `Remote`. |
| **Programming time** | The last time the device was programmed.  |
| **Protocols** | The protocols that the device uses. |
| **Purdue level** | The Purdue level in which the device exists. |
| **Scanner** | Whether the device performs scanning-like activities in the network. |
| **Sensor** | The sensor the device is connected to.  |
| **Site** | The site that contains this device. |
| **Slots** | The number of slots the device has.  |
| **Subtype** | The subtype of the device, such as speaker and smart tv. <br>**Default**: `Managed Device` |
| **Tags** | Tagging data for each device. |
| **Type** | The type of device, such as communication, and industrial. <br>**Default**: `Miscellaneous` |
| **Underlying devices** | Any relevant underlying devices for the device |
| **Underlying device region** | The region for an underlying device |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |
| **VLAN** | The VLAN of the device. |
| **Zone** | The zone that contains this device. |


## Next steps

For more information, see [Welcome to Microsoft Defender for IoT for device builders](overview.md).
