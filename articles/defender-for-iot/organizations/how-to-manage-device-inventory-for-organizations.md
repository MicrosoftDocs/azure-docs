---
title: Manage your IoT devices with the device inventory for organizations
description: Learn how to manage your IoT devices with the device inventory for organizations.
ms.date: 11/11/2021
ms.topic: how-to
---

# Manage your IoT devices with the device inventory for organizations

The device inventory can be used to view device systems, and network information. The search, filter, edit columns, and export tools can be used to manage this information.

:::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-inventory-screenshot.png" alt-text="A total overview of Defender for IoT's device inventory screen."  lightbox="media/how-to-manage-device-inventory-on-the-cloud/device-inventory-screenshot.png":::

Some of the benefits of the device inventory include:

- Identify all IOT, and OT devices from different inputs. For example, allowing you to understand which devices in your environment are not communicating, and will require troubleshooting.

- Group, and filter devices by site, type, or vendor.

- Gain visibility into each device, and investigate the different threats, and alerts for each one.

- Export the entire device inventory to a CSV file for your reports.

## Device inventory overview

The Device inventory gives you an overview of all devices within your environment. Here you can see the individual details of each device and filter, and order your search by various options.

The following table describes the different device properties in the device inventory.

| Parameter | Description | Default value |
|--|--|--|
| **Application** | The application the exists on the device. | - |
| **Class** | The class of the device. | IoT |
| **Data source** | The source of the data, such as Micro Agent, OtSensor, and Mde. | MicroAgent |
| **Description** | The description of the device. | - |
| **Firmware vendor** | The vendor of the device's firmware. | - |
| **Firmware version** | The version of the firmware. | - |
| **First seen** | The date, and time the device was first seen. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. | - |
| **Importance** | The level of importance of the device. | - |
| **IPv4 Address** | The IPv4 address of the device. | - |
| **IPv6 Address** | The IPv6 address of the device. | - |
| **Last activity** | The date, and time the device last sent an event to the cloud. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. | - |
| **Last update time** | The date, and time the device last sent a system information event to the cloud. Presented in format MM/DD/YYYY HH:MM:SS AM/PM. | - |
| **Location** | The physical location of the device. | - |
| **MAC Address** | The MAC address of the device. | - |
| **Model** | The device's model. | - |
| **Name** | The name of the device as the sensor discovered it, or as entered by the user. | - |
| **OS architecture** | The architecture of the operating system. | - |
| **OS distribution** | The distribution of the operating system, such as Android, Linux, and Haiku. | - |
| **OS platform** | The OS of the device, if detected. | - |
| **OS version** | The version of the operating system, such as Windows 10 and Ubuntu 20.04.1. | - |
| **PLC mode** | The PLC operating mode which includes the Key state (physical, or logical), and the Run state (logical). Possible Key states include, `Run`, `Program`, `Remote`, `Stop`, `Invalid`, and `Programming Disabled`. Possible Run states are `Run`, `Program`, `Stop`, `Paused`, `Exception`, `Halted`, `Trapped`, `Idle`, or `Offline`. If both states are the same, then only one state is presented. | - |
| **PLC secured** | Determines if the PLC mode is in a secure state. A possible secure state is `Run`. A possible unsecured state cab be either `Program`, or `Remote`. | - |
| **Programming time** | The last time the device was programmed.  | - |
| **Protocols** | The protocols that the device uses. | - |
| **Purdue level** | The Purdue level in which the device exists. | - |
| **Scanner** | Whether the device performs scanning-like activities in the network. | - |
| **Sensor** | The sensor the device is connected to.  | - |
| **Site** | The site that contains this device. | - |
| **Slots** | The number of slots the device has.  | - |
| **Subtype** | The subtype of the device, such as speaker and smart tv. | Managed Device |
| **Type** | The type of device, such as communication, and industrial. | Miscellaneous |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. | - |
| **VLAN** | The VLAN of the device. | - |
| **Zone** | The zone that contains this device. | - |

**To view the device inventory**:

1. Open the [Azure portal](https://ms.portal.azure.com).

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

For a list of filters that can be applied to the device inventory table, see the [Device inventory overview](#device-inventory-overview).

**To filter the device inventory**:

1. Select **Add filter**

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/add-filter.png" alt-text="Select  the add filter button to specify what you want to appear in the device inventory.":::

1. In the Add filter window, select the column drop-down menu to choose which column to filter.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/add-filter-window.png" alt-text="Select which column you want to filter in the device inventory.":::

1. Enter a value in the filter field to filter by.

1. Select the **Apply button**.

Multiple filters can be applied at one time. The filters are not saved when you leave the Device inventory page.

## View device information

To view a specific devices information, select the device and the device information window appears.

:::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-information-window.png" alt-text="Select a device to see all of that device's information." lightbox="media/how-to-manage-device-inventory-on-the-cloud/device-information-window.png":::

## Export the device inventory to CSV

You can export your device inventory to a CSV file. Any filters that you apply to the device inventory table will be exported, when you export the table.

Select the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/export-button.png" border="false"::: button to export your current device inventory to a CSV file.

## How to identify devices that have not recently communicated with the Azure cloud

If you are under the impression that certain devices are not actively communicating, there is a way to check, and see which devices have not communicated in a specified time period.

**To identify all devices that have not communicated recently**:

1. Open the [Azure portal](https://ms.portal.azure.com).

1. Navigate to **Defender for IoT** > **Device inventory**.

1. Select the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/edit-columns-icon.png" border="false"::: button.

1. Add a column by selecting the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/add-column-icon.png" border="false"::: button.

1. Select **Last Activity**.

1. Select **Save**

1. On the main Device inventory page, select **Last activity** to sort the page by last activity.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/last-activity.png" alt-text="Screenshot of the device inventory organized by last activity." lightbox="media/how-to-manage-device-inventory-on-the-cloud/last-activity.png":::

1. Select the :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/add-filter-icon.png" border="false"::: to add a filter on the last activity column.

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/last-activity-filter.png" alt-text="Screenshot of the add filter screen where you can select the time period to see the last activity.":::

1. Enter a time period, or a custom date range, and select **Apply**.

## See next

- [Welcome to Microsoft Defender for IoT for device builders](overview.md)
