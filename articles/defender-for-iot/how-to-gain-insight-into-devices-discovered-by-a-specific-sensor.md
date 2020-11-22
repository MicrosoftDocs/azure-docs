---
title: Gain insight into devices discovered by a specific sensor
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/22/2020
ms.topic: article
ms.service: azure
ms.topic: how-to
---

# Gain insight into assets discovered by a specific sensor 

## Overview

The Asset Inventory displays an extensive range asset attributes detected by the sensor. Options are available to:

  - Easily filter the information. See [Working with Asset Inventory Filters](./working-with-asset-inventory-filters.md).

  - Export information to a CSV file. See [Export Asset Inventory Information](./export-asset-inventory-information.md) for details.

  - Import Windows Registry details. See [Learning Windows Registry Details](./working-with-asset-inventory-filters.md#learning-windows-registry-details).

  - Create Groups for display in the Asset Map. See [Save Inventory Filters](./working-with-asset-inventory-filters.md#save-inventory-filters) for details.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/image143.png" alt-text="Asset Inventory":::

The following Asset Inventory attributes are displayed in the table.

| Parameter | Description  |
|---|---|
| Name  | The name of the asset as it was discovered by the sensor.  |
| Type   |  The type of asset. |
| Vendor   | The name of the asset’s vendor, as defined in the MAC.  |
| Operating System   |  The Operating System of the asset. |
|  Firmware  | Asset’s firmware.  |
|  IP Address  | The IP address of the asset.  |
| VLAN   | The VLAN of the asset. See <a href="./configure-vlan-names.md">Configure VLAN</a> Names for details about instructing the sensor to discover VLANs.  |
| MAC Address   | The MAC address of the asset.  |
| Protocols   | The protocols used by the asset.  |
| Unacknowledged Alerts   | The number of unacknowledged alerts associated with this asset.  |
|  Is Authorized  | Displays the authorization status defined by the user:<br />- True: The asset has been authorized.<br />- False: The asset has not been authorized. |
| Is Known as Scanner  | Defined as a scanning asset by the user.  |
| Is Programming Asset   | Defined as an authorized programming asset by the user <br />- *True**: The asset performs programming activities for PLCs/RTU/Controllers, which is usually relevant to engineering stations. <br />- False:The asset is not a programming asset.|
| Groups | In which groups this asset participates.  |
| Last Activity | The last activity performed by the asset.  |
| Discovered | When this asset was first seen in the network. |

To switch to the Asset Inventory view:

1. In the Navigation pane, select **Assets**. The **Assets** pane opens on the right.

2. In the **Assets** pane, select :::image type="content" source="media/how-to-work-with-asset-inventory-information/image144.png" alt-text="Asset pane":::.

To hide and display columns, customize the Asset Inventory table:

1.  On the Asset Inventory top-right menu, select :::image type="content" source="media/how-to-work-with-asset-inventory-information/image145.png" alt-text="Setting":::.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/image146.png" alt-text="Asset Inventory Setting":::

2. In the Asset Inventory Settings window, select the columns that you want to display in the Asset Inventory table

3. Change the location of the columns in the table using arrows.

4. Select **Save**. The Asset Inventory Settings window closes, and the new settings appear in the table.

## Working with asset inventory filters

### Create temporary inventory filters

For each column in the Asset Inventory table you can set a filter that defines what information is displayed in the table. For example, you can decide that you want to view only the PLC assets information.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/image147.png" alt-text="Assets - Learning":::

The filter is not saved when you leave the window.

### Save inventory filters

You can save a filter or a combination of filters that you need and reapply them in the Asset Inventory. Create broader filters based on a certain asset type, or more narrow filters based on a specific type and a specific protocol.

The filters you save are also saved as Asset Map groups. This provided an additional level of granularity in viewing network assets on the map.

To create filters:

1. In the column that you want to filter, select :::image type="content" source="media/how-to-work-with-asset-inventory-information/image148.png" alt-text="Filter":::.

2. In the Filter dialog box, select the filter type, as follows:

  - **Equals:** The exact value according to which you want to filter the column, for example, if you filter the Protocol column according to Equals and value=ICMP, the column will present assets that use the ICMP protocol only.

  - **Contains:** The value that is contained among other values in the column. For example, if you filter the Protocol column according to Contains and the value=ICMP, the column will present assets that use the ICMP protocol as a part of the list of protocols that the asset uses.

3. To organize the column info according to the alphabetical order, select :::image type="content" source="media/how-to-work-with-asset-inventory-information/image151.png" alt-text="Select](media/how-to-work-with-asset-inventory-information/image149.png) and arrange the order by selecting the ![Up](media/how-to-work-with-asset-inventory-information/image150.png) and ![Down":::arrows.

4. To save a new filter, define the filter and select **Save As**.

5. To change the filter definitions, change the definitions and select **Save Changes**.

To view filters:

1. Open a left pane and view the filter(s) that you have saved:

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/image152.png" alt-text="Left Pane":::

### View filtered information as a map group

When switching to the map view, the filtered assets are highlighted/filtered and the filter group that you saved appears in the side menu under the Asset Inventory Filters group.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/image153.png" alt-text="Map Group":::

## Learning windows registry details 

In addition to learning OT assets, you can discovers IT assets, including Microsoft Windows® Workstations and Servers. These assets are also displayed in Asset Inventory. Once learned, you can enrich the Asset inventory with detailed Windows information, for example:

  - Windows version installed

  - Applications installed

  - Patch level information

  - Open ports

  - More robust information on OS versions

Two options are available for retrieving this information:

  - Active polling by using scheduled WMI scans. See [Configuring Windows Endpoint Monitoring](./configuring-windows-endpoint-monitoring.md) for details.

  - Local surveying by distributing and running a script on the asset. Working with local scripts bypasses the risks encountered when running WMI polling on an endpoint. It is also useful for regulated networks with waterfalls and one-way elements

This section describes how to locally survey the Windows endpoint registry with a script.

This information will be used when generating alerts, notifications, Data Mining reports, Risk Assessments, and Attack Vectors.

:::image type="content" source="media/how-to-work-with-asset-inventory-information/image154.png" alt-text="Data mining":::

The following Windows OS can be surveyed:

  - Windows XP

  - Windows 2000

  - Windows NT

  - Windows 7

  - Windows 10

  - Windows Server 2003/2008/2012/2016

### Before you begin 

The following is required to work with the script.

  - Admin permissions are required to run the script on the asset.

  - The Windows asset should already be learned by the sensor. This means that if the asset already exists, its information will be retrieved by the script.

  - A sensor is monitoring the network the Windows PC is connected to.

### Acquiring the script 

To receive the script, contact customer support at [support.microsoft.com](mailto:support.microsoft.com).

### Deploying the script

You can deploy the script once or schedule on-going queries using standard automated deployment methods and tools.

### About the script

- The script is run as a utility and not an installed program. Running the script does not impact the endpoint.

- The files generated by the script remain on the local drive until you delete them.

- The files generated by the script are located next to each other.  Do not separate them.

- If you run the script again in the same location these files are overwritten.

To run the script:  

1. Copy the script to a local drive and unzip it. The following files appear.

   - start.bat

   - settings.json

   - data.bin

   - run.bat

     :::image type="content" source="media/how-to-work-with-asset-inventory-information/image155.png" alt-text="run bat":::

2. Run the run.bat file.

3. After the registry is probed, the CX-snapshot file appears with the registry information.

4. The file name indicates the system name and date and time of the snapshot. For example: CX-snaphot_SystemName_Month_Year_Time

### Import asset details

Information learned on each endpoint should be imported to the sensor.

Files generated from the queries can be placed in one folder that is accessible from sensors. Use standard, automated methods, and tools to move the files from each Windows endpoint to the location you will be importing them to the sensor.

Do not update file names.

To import:

1. Select **Import Settings** from the **Import Windows Configuration** dialog box.

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/image156.png" alt-text="Import Windows Configuration":::

2. Select **Add**, and then select all the files (Ctrl=A).

3. Select **Close.** The asset registry information will be imported. if there is a problem uploading one of the files you will be informed which file upload failed.

   :::image type="content" source="media/how-to-work-with-asset-inventory-information/image157.png" alt-text="Ad new file":::

## Export asset inventory information

You can Export Asset Inventory Information to an Excel file. IM ported information overwrites current information.

To export a CSV file:

1.  On the Asset Inventory top-right menu, select :::image type="content" source="media/how-to-work-with-asset-inventory-information/image158.png" alt-text="CSV":::. The CSV report is generated and downloaded.