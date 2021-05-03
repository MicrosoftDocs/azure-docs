---
title: Gain insight into devices discovered by a specific sensor
description: The device inventory displays an extensive range of device attributes that a sensor detects. 
ms.date: 12/06/2020
ms.topic: how-to
---

# Investigate sensor detections in a device inventory

The device inventory displays an extensive range of device attributes that a sensor detects. Options are available to:

 - Easily filter the information.

 - Export information to a CSV file.

 - Import Windows registry details.

 - Create groups for display in the device map.

## View device attributes in the device inventory

The following attributes appear in the device inventory table.

| Parameter | Description |
|--|--|
| Name | The name of the device as the sensor discovered it, or as entered by the user. |
| Type | The type of device as determined by the sensor, or as entered by the user. |
| Vendor | The name of the device's vendor, as defined in the MAC address. |
| Operating System | The OS of the device, if detected. |
| Firmware version | The device's firmware, if detected. |
| IP Address | The IP address of the device where defined. |
| VLAN | The VLAN of the device. For details about instructing the sensor to discover VLANs, see [Define VLAN names](how-to-manage-the-on-premises-management-console.md#define-vlan-names).(how-to-define-management-console-network-settings.md#define-vlan-names). |
| MAC Address | The MAC address of the device. |
| Protocols | The protocols that the device uses. |
| Unacknowledged Alerts | The number of unacknowledged alerts associated with this device. |
| Is Authorized | The authorization status defined by the user:<br />- **True**: The device has been authorized.<br />- **False**: The device has not been authorized. |
| Is Known as Scanner | Defined as a network scanning device by the user. |
| Is Programming device | Defined as an authorized programming device by the user. <br />- **True**: The device performs programming activities for PLCs, RTUs, and controllers, which are relevant to engineering stations. <br />- **False**: The device is not a programming device. |
| Groups | The groups that this device participates in. |
| Last Activity | The last activity that the device performed. |
| Discovered | When this device was first seen in the network. |

To view the device inventory:

1. In the left pane, select **Devices**. The **Devices** pane opens on the right.

2. In the **Devices** pane, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/device-pane-icon.png" border="false":::.

To hide and display columns, customize the device inventory table:

1. On the upper-right menu of the device inventory, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/settings-icon.png" border="false":::.

    :::image type="content" source="media/how-to-work-with-asset-inventory-information/device-inventory-settings-screens-v2.png" alt-text="Device inventory settings screen.":::

2. In the **Device Inventory Settings** window, select the columns that you want to display in the device inventory table.

3. Change the location of the columns in the table by using arrows.

4. Select **Save**. The **Device Inventory Settings** window closes, and the new settings appear in the table.

### Create temporary device inventory filters

You can set a filter that defines what information the table displays. For example, you can decide that you want to view only the PLC device's information.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/devices-learning-v2.png" alt-text="Devices learning.":::

The filter is not saved when you leave the inventory.

### Save device inventory filters

You can save a filter or a combination of filters that you need and reapply them in the device inventory. Create broader filters based on a certain device type, or more narrow filters based on a specific type and a specific protocol.

The filters that you save are also saved as device map groups. This feature provides an additional level of granularity in viewing network devices on the map.

To create filters:

1. In the column that you want to filter, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/filter-icon.png" border="false":::.

2. In the **Filter** dialog box, select the filter type:

   - **Equals**: The exact value according to which you want to filter the column. For example, if you filter the protocol column according to **Equals** and `value=ICMP`, the column will present devices that use the ICMP protocol only.

   - **Contains**: The value that's contained among other values in the column. For example, if you filter the protocol column according to **Contains** and `value=ICMP`, the column will present devices that use the ICMP protocol as a part of the list of protocols that the device uses.

3. To organize the column information according to alphabetical order, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-order-icon.png" border="false":::. Arrange the order by selecting the :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-a-z-order-icon.png" border="false"::: and :::image type="icon" source="media/how-to-work-with-asset-inventory-information/alphabetical-z-a-order-icon.png" border="false"::: arrows.

4. To save a new filter, define the filter and select **Save As**.

5. To change the filter definitions, change the definitions and select **Save Changes**.

To view filters:

- Open the left pane and view the filters that you've saved:

  :::image type="content" source="media/how-to-work-with-asset-inventory-information/filters-from-left-pane-v2.png" alt-text="View the filters from the left-side pane.":::

### View filtered information as a map group

When you switch to the map view, the filtered devices are highlighted and filtered. The filter group that you saved appears in the side menu under the **Device Inventory Filters** group.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/filters-in-the-map-view-v2.png" alt-text="View filters when in the map view.":::

## Learn Windows registry details

In addition to learning OT devices, you can discover Microsoft Windows workstations, and servers. These devices are also displayed in Device Inventory. After you learn devices, you can enrich the Device Inventory with detailed Windows information, such as:

- Windows version installed

- Applications installed

- Patch-level information

- Open ports

- More robust information on OS versions

Two options are available for retrieving this information:

- Active polling by using scheduled WMI scans. 

- Local surveying by distributing and running a script on the device. Working with local scripts bypasses the risks of running WMI polling on an endpoint. It's also useful for regulated networks with waterfalls and one-way elements.

This article describes how to locally survey the Windows endpoint registry with a script. This information will be used for generating alerts, notifications, data mining reports, risk assessments, and attack vector reports.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/data-mining-screen.png" alt-text="Data mining screenshot.":::

You can survey the following Windows operating systems:

- Windows XP

- Windows 2000

- Windows NT

- Windows 7

- Windows 10

- Windows Server 2003/2008/2012/2016

### Before you begin

To work with the script, you need to meet the following requirements:

- Administrator permissions are required to run the script on the device.

- The sensor should have already learned the Windows device. This means that if the device already exists, the script will retrieve its information.

- A sensor is monitoring the network that the Windows PC is connected to.

### Acquire the script

To receive the script, [contact customer support](mailto:support.microsoft.com).

### Deploy the script

You can deploy the script once or schedule ongoing queries by using standard automated deployment methods and tools.

### About the script

- The script is run as a utility and not an installed program. Running the script does not affect the endpoint.

- The files that the script generates remain on the local drive until you delete them.

- The files that the script generates are located next to each other. Don't separate them.

- If you run the script again in the same location, these files are overwritten.

To run the script:  

1. Copy the script to a local drive and unzip it. The following files appear:

    - start.bat

    - settings.json

    - data.bin

    - run.bat

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/files-in-file-explorer.png" alt-text="View of the files in File Explorer.":::

2. Run the `run.bat` file.

3. After the registry is probed, the CX-snapshot file appears with the registry information.

4. The file name indicates the system name and date and time of the snapshot. An example file name is `CX-snaphot_SystemName_Month_Year_Time`.

### Import device details

Information learned on each endpoint should be imported to the sensor.

Files generated from the queries can be placed in one folder that you can access from sensors. Use standard, automated methods and tools to move the files from each Windows endpoint to the location where you'll be importing them to the sensor.

Don't update file names.

To import:

1. Select **Import Settings** from the **Import Windows Configuration** dialog box.

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/import-windows-configuration-v2.png" alt-text="Import your Windows configurations.":::

2. Select **Add**, and then select all the files (Ctrl+A).

3. Select **Close**. The device registry information is imported. If there's a problem uploading one of the files, you'll be informed which file upload failed.

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/add-new-file.png" alt-text="Upload of added files was successful.":::

## Export device inventory information

You can export device inventory information to an Excel file.

To export a CSV file:

- On the upper-right menu of the device inventory, select :::image type="icon" source="media/how-to-work-with-asset-inventory-information/csv-excel-export-icon.png" border="false":::. The CSV report is generated and downloaded.

## See also

[Investigate all enterprise sensor detections in a device inventory](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

[Work with site map views](how-to-gain-insight-into-global-regional-and-local-threats.md#work-with-site-map-views)
