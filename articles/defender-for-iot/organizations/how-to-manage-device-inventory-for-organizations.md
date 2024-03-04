---
title: Manage your device inventory from the Azure portal
description: Learn how to view and manage OT and IoT devices (assets) from the Device inventory page in the Azure portal.
ms.date: 05/17/2023
ms.topic: how-to
ms.custom: enterprise-iot
---

# Manage your device inventory from the Azure portal

Use the **Device inventory** page in [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal to manage all network devices detected by cloud-connected sensors, including OT, IoT, and IT. Identify new devices detected, devices that might need troubleshooting, and more.

For more information, see [Devices monitored by Defender for IoT](architecture.md#devices-monitored-by-defender-for-iot).

## View the device inventory

To view detected devices in the **Device inventory** page in the Azure portal, go to **Defender for IoT** > **Device inventory**.

:::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-inventory-page.png" alt-text="Screenshot of the Device inventory page in the Azure portal." lightbox="media/how-to-manage-device-inventory-on-the-cloud/device-inventory-page.png":::

Use any of the following options to modify or filter the devices shown:

|Option  |Steps  |
|---------|---------|
| **Sort devices** | Select a column header to sort the devices by that column. Select it again to change the sort direction. |
|**Filter devices shown**    |   Either use the **Search** box to search for specific device details, or select **Add filter** to filter the devices shown. <br><br> In the **Add filter** box, define your filter by column name, operator, and value. Select **Apply** to apply your filter.<br><br> You can apply multiple filters at the same time. Search results and filters aren't saved when you refresh the **Device inventory** page. <br><br> The **Network location (Preview)** filter is on by default. |
|**Modify columns shown**     |   Select **Edit columns** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/edit-columns-icon.png" border="false":::. In the **Edit columns** pane:<br><br>        - Select the **+ Add Column** button to add new columns to the grid.<br>        - Drag and drop fields to change the columns order.<br>- To remove a column, select the **Delete** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/trashcan-icon.png" border="false"::: icon to the right.<br>- To reset the columns to their default settings, select **Reset** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/reset-icon.png" border="false":::.   <br><br>Select **Save** to save any changes made.  |
| **Group devices** | From the **Group by** above the gird, select a category, such as **Class**, **Data source**, **Location**, **Purdue level**, **Site**, **Type**, **Vendor**, or **Zone**, to group the devices shown. Inside each group, devices retain the same column sorting. To remove the grouping, select **No grouping**. |

For more information, see [Device inventory column data](device-inventory.md#device-inventory-column-data).


> [!NOTE]
> If your OT sensors detect multiple devices in the same zone with the same IP or MAC address, those devices are automatically merged and identified as a single, unique device. Devices that have different IP addresses, but the same MAC address, are not merged, and continue to be listed as unique devices.
>
> Merged devices are listed only once in the **Device inventory** page. For more information, see [Separating zones for recurring IP ranges](best-practices/plan-corporate-monitoring.md#separating-zones-for-recurring-ip-ranges).

### View full device details

To view full details about a specific device, select the device row. Initial details are shown in a pane on the right, where you can also select **View full details** to open the device details page and drill down more.

For example:

:::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-information-window.png" alt-text="Screenshot of a device details pane and the View full details button in the Azure portal." lightbox="media/how-to-manage-device-inventory-on-the-cloud/device-information-window.png":::

The device details page displays comprehensive device information, including the following tabs:

|Section  |Description  |
|---------|---------|
| **Attributes** | Displays full device details such as class, data source, firmware details, activity, type, protocols, Purdue level, sensor, site, zone, and more. |
| **Backplane** | Displays the backplane hardware configuration, including slot and rack information. Select a slot in the backplane view to see the details of the underlying devices. The backplane tab is usually visible for Purdue level 1 devices that have slots in use, such as PLC, RTU, and DCS devices. |
|**Vulnerabilities** | Displays current vulnerabilities specific to the device. Defender for IoT provides vulnerability coverage for [supported OT vendors](resources-manage-proprietary-protocols.md) where Defender for IoT can detect firmware models and firmware versions.<br><br>Vulnerability data is based on the repository of standards-based vulnerability data documented in the US government National Vulnerability Database (NVD). Select the CVE name to see the CVE details and description. <br><br>**Tip**: View vulnerability data across your network with the [Defender for IoT Vulnerability workbook](workbooks.md#view-workbooks).|
|**Alerts** | Displays current open alerts related to the device. Select any alert to view more details, and then select **View full details** to open the alert page to view the full alert information and take action. For more information on the alerts page, see [View alerts on the Azure portal](how-to-manage-cloud-alerts.md#view-alerts-on-the-azure-portal). |
|**Recommendations** | Displays current recommendations for the device, such as Review PLC operating mode and Review unauthorized devices. For more information on recommendations, see [Enhance security posture with security recommendations](recommendations.md). |

For example:

:::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/device-details-page.png" alt-text="Screenshot of the backplane tab in on the full device details page. " lightbox="media/how-to-manage-device-inventory-on-the-cloud/device-details-page.png":::

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

For more information, see [Device inventory column data](device-inventory.md#device-inventory-column-data).

### Reference of editable fields

The following device fields are supported for editing in the **Device inventory** page:

|Name  |Description  |
|---------|---------|
| **General information** | |
|**Name** | Mandatory. Supported for editing only when editing a single device. |
|**Authorized device**     |Toggle on or off as needed as device security changes.         |
|**Description**     |  Enter a meaningful description for the device.       |
|**Location**     |   Enter a meaningful location for the device.      |
|**Category**     | Use the **Class**, **Type**, and **Subtype** options to categorize the device.         |
|**Business function**     | Enter a meaningful description of the device's business function.        |
|**Hardware model**     |   Select the device's hardware model from the dropdown menu.      |
|**Hardware vendor**     | Select the device's hardware vendor from the dropdown menu.        |
|**Firmware**      |   Device the device's firmware name and version. You can either select the **delete** button to delete an existing firmware definition, or select **+ Add** to add a new one.  |
| **Purdue level** | The Purdue level in which the device exists. |
|**Tags**     | Enter meaningful tags for the device. Select the **delete**  button to delete an existing tag, or select **+ Add** to add a new one.         |
| **Settings** |
|**Importance**     | Select **Low**, **Normal**, or **High** to modify the device's importance.        |
|**Programming device**     | Toggle the **Programming Device** option on or off as needed for your device.        |

For more information, see [Device inventory column data](device-inventory.md#device-inventory-column-data).

## Export the device inventory to CSV

Export your device inventory to a CSV file to manage or share data outside of the Azure portal. You can export a maximum of 30,000 devices at a time.

**To export device inventory data**:

On the **Device inventory page**, select **Export** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/export-button.png" border="false":::.

The device inventory is exported with any filters currently applied, and you can save the file locally.

## Delete a device

If you have devices no longer in use, delete them from the device inventory so that they're no longer connected to Defender for IoT.

Devices might be inactive because of misconfigured SPAN ports, changes in network coverage, or because the device was unplugged from the network.

Delete inactive devices to maintain a correct representation of current network activity, better understand the number of devices that you're monitoring when managing your Defender for IoT [licenses and plans](billing.md), and to reduce clutter on your screen.

**To delete a device**:

In the **Device inventory** page, select the device you want to delete, and then select **Delete** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/delete-device.png" border="false"::: in the toolbar at the top of the page.

At the prompt, select **Yes** to confirm that you want to delete the device from Defender for IoT.

## Merge duplicate devices

You may need to merge duplicate devices if the sensor has discovered separate network entities that are associated with a single, unique device.

Examples of this scenario might include a laptop with both WiFi and a physical network card, a switch with multiple interfaces, an HMI with four network cards, or a single workstation with multiple network cards.

> [!NOTE]
> Once the devices are merged, they cannot be unmerged. To unmerge devices, you'll need to delete the merged device and wait for it to be rediscovered by the sensors as it was originally.

**To manually merge devices**:

1. In the **Device inventory** page, select two or more devices you would like to merge, and then select **Merge** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/merge-devices-icon.png" border="false"::: in the toolbar at the top of the page.
You can merge up to 10 devices at a time, if all selected devices are in the same zone or site.

    OT devices can only be merged with other OT devices. Enterprise IoT devices and devices detected by Microsoft Defender for Endpoint agents can be merged with other Enterprise IoT or Defender for Endpoint devices.

1. In the **Merge** pane, select one of the following:

    - Select **Merge** to merge the selected devices and return to the device inventory page.

    - Select **Merge & View** to merge the devices and open the merged device details.

    For example:

    :::image type="content" source="media/how-to-manage-device-inventory-on-the-cloud/merge-devices-pane.png" alt-text="Screenshot of merging devices screen in the device inventory." lightbox="media/how-to-manage-device-inventory-on-the-cloud/merge-devices-pane.png":::

A success message appears at the top right confirming that the devices have been merged into a single, unique device.

The merged device that is now listed in the grid retains the details of the device with the most recent activity or an update to its identifying details.

## Next steps

For more information, see:

- [Defender for IoT device inventory](device-inventory.md)
- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)
- [Detect Windows workstations and servers with a local script](detect-windows-endpoints-script.md)
- [Device data retention periods](references-data-retention.md#device-data-retention-periods).
