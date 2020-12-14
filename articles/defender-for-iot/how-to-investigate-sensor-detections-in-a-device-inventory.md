---
title: Gain insight into devices discovered by a specific sensor
description: The Device Inventory displays an extensive range device attributes detected by a sensor. 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/06/2020
ms.topic: how-to
ms.service: azure
---

# Investigate sensor detections in a Device Inventory

The Device Inventory displays an extensive range device attributes detected by a sensor. Options are available to:

 - Easily filter the information.

 - Export information to a CSV file.

 - Import Windows registry details.

 - Create groups for display in the Device Map.

## View device attributes in the Device Inventory

The following Device Inventory attributes are displayed in the table.

| Parameter | Description |
|--|--|
| Name | The name of the device as it was discovered by the sensor. |
| Type | The type of device. |
| Vendor | The name of the device’s vendor, as defined in the MAC address. |
| Operating System | The OS of the device. |
| Firmware | The device’s firmware. |
| IP Address | The IP address of the device. |
| VLAN | The VLAN of the device. For more information, see [Define VLAN names](how-to-manage-the-on-premises-management-console.md#define-vlan-names).(how-to-define-management-console-network-settings.md#define-vlan-names) for details about instructing the sensor to discover VLANs. |
| MAC Address | The MAC address of the device. |
| Protocols | The protocols used by the device. |
| Unacknowledged Alerts | The number of unacknowledged alerts associated with this device. |
| Is Authorized | Displays the authorization status defined by the user:<br />- **True**: The device has been authorized.<br />- **False**: The device has not been authorized. |
| Is Known as Scanner | Defined as a scanning device by the user. |
| Is Programming device | Defined as an authorized programming device by the user <br />- **True**: The device performs programming activities for PLCs, RTU, and controllers, which are relevant to engineering stations. <br />- **False**: The device is not a programming device. |
| Groups | In which groups this device participates. |
| Last Activity | The last activity performed by the device. |
| Discovered | When this device was first seen in the network. |

To view the Device Inventory view:

1. In the Navigation pane, select **Devices**. The **Devices** pane opens on the right.

2. In the **Devices** pane, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/device-pane-icon.png" border="false":::.

To hide and display columns, customize the Device Inventory table:

1. On the Device Inventory top-right menu, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/settings-icon.png" border="false":::.

    :::image type="content" source="media/how-to-work-with-asset-inventory-information/device-inventory-settings-screens-v2.png" alt-text="Device inventory settings screen.":::

2. In the Device Inventory Settings window, select the columns that you want to display in the Device Inventory table

3. Change the location of the columns in the table using arrows.

4. Select **Save**. The Device Inventory Settings window closes, and the new settings appear in the table.

### Create temporary device inventory filters

You can set a filter that define what information is displayed in the table. For example, you can decide that you want to view only the PLC devices information.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/devices-learning-v2.png" alt-text="Devices learning.":::

The filter is not saved when you leave the Inventory.

### Save device inventory filters

You can save a filter or a combination of filters that you need and reapply them in the Device Inventory. Create broader filters based on a certain device type, or more narrow filters based on a specific type and a specific protocol.

The filters you save are also saved as Device Map groups. This provides an additional level of granularity in viewing network devices on the map.

To create filters:

1. In the column that you want to filter, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/filter-icon.png" border="false":::.

2. In the Filter dialog box, select the filter type, as follows:

 - **Equals:** The exact value according to which you want to filter the column, for example, if you filter the protocol column according to equals and `value=ICMP`, the column will present devices that use the ICMP protocol only.

 - **Contains:** The value that is contained among other values in the column. For example, if you filter the protocol column according to contains and the `value=ICMP`, the column will present devices that use the ICMP protocol as a part of the list of protocols that the device uses.

3. To organize the column info according to the alphabetical order, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-order-icon.png" border="false"::: and arrange the order in alphabetical order by clicking the :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-a-z-order-icon.png" border="false"::: order by alphabetical reverse order by selecting the :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-z-a-order-icon.png" border="false"::: icon.

4. To save a new filter, define the filter and select **Save As**.

5. To change the filter definitions, change the definitions and select **Save Changes**.

To view filters:

1. Open a left pane and view the filter(s) that you have saved:

    :::image type="content" source="media/how-to-work-with-asset-inventory-information/filters-from-left-pane-v2.png" alt-text="View the filters from the left side pane.":::

### View filtered information as a map group

When switching to the map view, the filtered devices are highlighted and filtered and the filter group that you saved appears in the side menu under the Device Inventory Filters group.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/filters-in-the-map-view-v2.png" alt-text="View filters when in the map view.":::

## Learn Windows registry details

In addition to learning OT devices, you can discovers IT devices, including Microsoft Windows® workstations and servers. These devices are also displayed in Device Inventory. Once learned, you can enrich the Device Inventory with detailed Windows information, for example:

 - Windows version installed

 - Applications installed

 - Patch level information

 - Open ports

 - More robust information on OS versions

Two options are available for retrieving this information:

 - Active polling by using scheduled WMI scans. 

 - Local surveying by distributing and running a script on the device. Working with local scripts bypasses the risks encountered when running WMI polling on an endpoint. It is also useful for regulated networks with waterfalls and one-way elements

This article describes how to locally survey the Windows endpoint registry with a script.

This information will be used when generating alerts, notifications, data mining reports, risk assessments, and attack vectors.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/data-mining-screen.png" alt-text="Data mining screenshot.":::

The following Windows OS can be surveyed:

 - Windows XP

 - Windows 2000

 - Windows NT

 - Windows 7

 - Windows 10

 - Windows Server 2003/2008/2012/2016

### Before you begin

The following is required to work with the script.

 - Administrator permissions are required to run the script on the device.

 - The Windows device should already be learned by the sensor. This means that if the device already exists, its information will be retrieved by the script.

 - A sensor is monitoring the network the Windows PC is connected to.

### Acquire the script

To receive the script, contact customer support at [support.microsoft.com](mailto:support.microsoft.com).

### Deploying the script

You can deploy the script once or schedule on-going queries using standard automated deployment methods and tools.

### About the script

- The script is run as a utility and not an installed program. Running the script does not impact the endpoint.

- The files generated by the script remain on the local drive until you delete them.

- The files generated by the script are located next to each other.  Do not separate them.

- If you run the script again in the same location, these files are overwritten.

To run the script:  

1. Copy the script to a local drive and unzip it. The following files appear.

    - start.bat

    - settings.json

    - data.bin

    - run.bat

 :::image type="content" source="media/how-to-work-with-asset-inventory-information/files-in-file-explorer.png" alt-text="View of the files in file explorer.":::

2. Run the `run.bat` file.

3. After the registry is probed, the CX-snapshot file appears with the registry information.

4. The file name indicates the system name and date and time of the snapshot. For example, `CX-snaphot_SystemName_Month_Year_Time`.

### Import device details

Information learned on each endpoint should be imported to the sensor.

Files generated from the queries can be placed in one folder that is accessible from sensors. Use standard, automated methods, and tools to move the files from each Windows endpoint to the location you will be importing them to the sensor.

Do not update file names.

To import:

1. Select **Import Settings** from the **Import Windows Configuration** dialog box.

 :::image type="content" source="media/how-to-work-with-asset-inventory-information/import-windows-configuration.png" alt-text="Import your Windows configurations.":::

2. Select **Add**, and then select all the files (Ctrl=A).

3. Select **Close.** The device registry information will be imported. if there is a problem uploading one of the files you will be informed which file upload failed.

 :::image type="content" source="media/how-to-work-with-asset-inventory-information/add-new-file.png" alt-text="Add new files upload successful.":::

## Export Device Inventory Information

You can export device inventory information to an Excel file. Imported information overwrites current information.

To export a CSV file:

1. On the Device Inventory top-right menu, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/csv-excel-export-icon.png" border="false":::. The CSV report is generated and downloaded.

## See also

[Investigate all enterprise sensor detections in a Device Inventory](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

[Work with site map views](how-to-gain-insight-into-global-regional-and-local-threats.md#work-with-site-map-views)
