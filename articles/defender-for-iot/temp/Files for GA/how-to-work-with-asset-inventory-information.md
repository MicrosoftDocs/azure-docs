---
title: Work with device inventory information
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/04/2020
ms.topic: article
ms.service: azure
---

# Overview

## Gain insight into assests discovered by all enterprise sensors

### View enterprise asset inventory

Asset information from connected Sensors can be viewed from the Central Manager in the Asset Inventory. This gives Central Manager users a comprehensive view of all network information. Use import, export, and filtering tools to manage this information. The status information about the connected Sensor versions is also displayed.

:::image type="content" source="media/image46.png" alt-text="Screenshot of Asset Inventory data table":::

The following table describes the Asset Inventory table columns.

| Parameter             | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| **Unacknowledged Alerts** | The number of unhandled alerts associated with this asset. |
| **Business Unit** | The business unit that contains this asset. |
| **Region** | The region that contains this asset. |
| **Site** | The site that contains this asset. |
| **Zone** | The zone that contains this asset. |
| **Appliance** | The CyberX Sensor that protects this asset. |
| **Name** | The name of this asset as it was discovered by CyberX. |
| **Type** | The type of asset, such as PLC, HMI. |
| **Vendor** | The name of the asset's vendor, as defined in the MAC. |
| **Operating System** | The Operating System of the asset. |
| **Firmware** | Asset's firmware. |
| **IP Address** | The IP address of the asset. |
| **VLAN** | The VLAN of the asset. |
| **MAC Address** | The MAC address of the asset. |
| **Protocols** | The protocols used by the asset. |
| **Unacknowledged Alerts** | The number of unhandled alerts associated with this asset. |
| **Is Authorized** | The authorization status of the asset:<br />- **True:** The asset has been authorized.<br />- **False:** The asset has not been authorized. |
| **Is Known as Scanner** | Is this asset performs scanning-like activities in the network. |
| **Is Programming Asset** | Is this a programming asset:<br />- **True:** The asset performs programming activities for PLCs/RTU/Controllers, which is usually relevant to engineering stations.<br />- **False:** The asset is not a programming asset. |
| **Groups** | In which groups this asset participates. |
| **Last Activity** | The last activity performed by the asset. |
| **Discovered** | When this asset was first seen in the network. |

### Integrate data to the enterprise asset inventory

Asset Inventory data integration capabilities let you enhance the data in the Asset Inventory with information from other enterprise resources. For example, from: CMDBs, DNS, Firewalls, Web APIs and so on.

You can use this information to learn, for example:

- The asset purchase dates and end of warranty dates.

- The users responsible for each asset.

- Opened tickets for assets.

- The last date firmware was upgraded.

- Assets allowed access to the internet.

- Assets running active Antivirus applications.

- Users logged into assets.

:::image type="content" source="media/image47.png" alt-text="Screenshot of Asset Inventory table data view":::

You can integrate data by:

- Adding it manually,

Or

- Running customized scripts provided by CyberX.

:::image type="content" source="media/image48.png" alt-text="Diagram of Enterprise Data Integrator":::

You can work with CyberX Technical Support to set up your system to receive Web API queries.

**To add data manually:**

1. In the side menu, select **Asset Inventory** and then select :::image type="content" source="media/image49.png" alt-text="Screenshot of Menu Icon":::.

:::image type="content" source="media/image50.png" alt-text="Screenshot of Asset Inventory Setting view":::

2. In the **Asset Inventory Settings** dialog box, select **ADD CUSTOM COLUMN**.

:::image type="content" source="media/image51.png" alt-text="Screenshot Add Custom Column view":::

3. In the **Add Custom Column** dialog box, add the new column name (up to 250 characters UTF), select **Manual** and select **SAVE**. The new item appears in the **Asset Inventory Settings** dialog box.

4. In the top right corner of the **Asset Inventory** window, select :::image type="content" source="media/image52.png" alt-text="Screenshot of Menu Icon"::: and select **Export All Asset Inventory**. The CSV file is generated.

:::image type="content" source="media/image53.png" alt-text="Screenshot of tabular data view":::

5. Manually add the information to the new column and save the file.

6. In the top right corner of the **Asset Inventory** window, select :::image type="content" source="media/image52.png" alt-text="Screenshot of Menu Icon":::, select **Import Manual Input Columns** and browse to the CSV file. The new data appears in the **Asset Inventory** table.

**To integrate data from other enterprise entities:**

1.  In the top right corner of the **Asset Inventory** window, select :::image type="content" source="media/image52.png" alt-text="Screenshot of Menu Icon"::: and select **Export All Asset Inventory**.

2. In the **Asset Inventory Settings** dialog box, select **ADD CUSTOM COLUMN**.

:::image type="content" source="media/image51.png" alt-text="Screenshot Add Custom Column view":::

3. In the **Add Custom Column** dialog box, add the new column name (up to 250 characters UTF), select **Automatic**. The **UPLOAD SCRIPT** and **TEST SCRIPT** options appear.

:::image type="content" source="media/image54.png" alt-text="Screenshot Add Custom Column view":::

4. Upload and test the script that you received from the [support.microsoft.com](https://support.serviceshub.microsoft.com/supportforbusiness/create?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

### Retrieve Information from the Asset Inventory

You can retrieve an extensive range of asset information detected by managed Sensors and integrate that information with 3rd party systems. For example, sensor, zone, and site IDs; IP and MAC addresses; firmware, protocol and vendor information is retrieved. Filter information you retrieve based on:

- authorized /unauthorized assets.

- assets associated with specific sites.

- assets associated with specific zones.

- assets associated with specific sensors.

Work with CyberX API commands to retrieve and integrate this information. See *the CyberX API Guide for version 3.0* for details.

### Add Filters to the Asset Inventory Table Columns

For each column in the Asset Inventory table you can set a filter that defines what information is displayed in the table. For example, you can decide that you want to view only the PLC assets info:

:::image type="content" source="media/image55.png" alt-text="Screenshot Asset Inventory view":::

The filter disappears when you leave the window.

To use the same filter, again and again, you can save a filter or a combination of filters that you need. You can open a left pane and view the filter(s) that you have saved:

:::image type="content" source="media/image56.png" alt-text="Screenshot Asset Inventory view":::

**To filter the Asset Inventory table information:**

1.  In the column that you want to filter, select :::image type="content" source="media/image57.png" alt-text="Screenshot of Menu Icon":::.

2. In the Filter dialog box, select the filter type, as follows:

  - **Equals:** The exact value according to which you want to filter the column, for example, if you filter the Protocol column according to Equals and value=ICMP, the column will present assets that use the ICMP protocol only.

  - **Contains:** The value that is contained among other values in the column. For example, if you filter the Protocol column according to Contains and value=ICMP, the column will present assets that use the ICMP protocol as a part of the list of protocols that the asset uses.

3. To organize the column info according to the alphabetical order, select :::image type="content" source="media/image60.png" alt-text="Screenshot of Menu Icon](media/image58.png) and arrange the order by selecting the ![Screenshot of Menu Icon](media/image59.png) and ![Screenshot of Menu Icon":::arrows.

4. To save a new filter, define the filter and select **Save As**.

5. To change the filter definitions, change the definitions and select **Save Changes**.

### View Asset Information per Zone

The following information can be learned about assets in a Zone

- **View a Zone Asset Map**

- **View Alerts Associated with a Zone**

- **View an Asst Inventory of the Zone**

- **Additional Zone Information**

#### View a Zone Asset Map

This section describes how to access the Sensor Asset Map for the zone selected.

**To view a zone map:**

1. In the **Site Management** window, select **View Zone Map** from the bar that contains the zone name.

:::image type="content" source="media/image37.png" alt-text="Screenshot of Default Region -> Default Business Unit":::

The Asset Map window displays, showing all the network elements related to the selected zone, including the Sensors, the assets connected to them and other information.

:::image type="content" source="media/image38.png" alt-text="Screenshot of Zone Map view":::

#### Map Views and Asset Information

The following tools are available for viewing assets and asset information from the map. Refer to *The Asset Map* chapter in the *CyberX Platform User Guide* for details about each of these features.

- **Map Zoom Views**: Simplified View, Connections View and Detailed View

The map view displayed varies depending on the map zoom-level. Switching between map views is done by adjusting the zoom levels.

:::image type="content" source="media/image39.png" alt-text="Icons for Zoom buttons":::

- **Map Search and Layout Tools**: Tools used to display varies network segments, assets. Asset groups or layers.

:::image type="content" source="media/image40.png" alt-text="Screeshot of Search and Layout Tools view":::

- **Labels and indicators on assets:** for example, the number of assets grouped in a subnet in an IT network. In this example 8.

:::image type="content" source="media/image41.png" alt-text="Screenshot of Labels and Indicators":::

- **View Asset Properties**: For example, the Sensor monitoring the asset and basic asset properties. Right-click the asset to view asset Properties.

:::image type="content" source="media/image42.png" alt-text="Screenshot of Asset Properties view":::

- **Alert associated with an Asset:** Right-click the asset to view related alerts.

:::image type="content" source="media/image43.png" alt-text="Screenshot of Show Alerts view":::

#### View Alerts Associated with a Zone

View all alerts associated with a specific zone.

**To view alerts:**

1. Select the Alerts icon form the Zone window. See ***Alerts*** for details about alert management in the Central Manager.

:::image type="content" source="media/image44.png" alt-text="Screenshot of Default Business Unit view with Example":::

#### View an Asst Inventory of the Zone

View the Asset Inventory associated with a specific zone.

**To view the inventory:**

1. Select the View **Asset Inventory** form the Zone window. See ***View Asset Inventory*** for details about working in the Asset Inventory.

:::image type="content" source="media/image45.png" alt-text="Screenshot of Default Business Unit view with Example":::

#### Additional Zone Information

The following additional Zone information is available:

- **Zone details:** Number of Assets, and alerts and Sensors associated with the Zone.

- **Sensor details:** Name, IP address, and version of each Sensor assigned to the zone.

- **Connectivity status:** If disconnected, connect from the Sensor. See ***Make Initial Connection between Sensors and the Central Manager*** for details.

- **Upgrade Progress:** If the connected Sensor is being upgraded, upgrade statuses will appear. During upgrade, the Central Manager does not receive asset information from the Sensor.

## Gain insight into assets discovered by a specific sensor 

### Overview

The Asset Inventory displays an extensive range asset attributes detected by the sensor. Options are available to:

  - Easily filter the information. See [Working with Asset Inventory Filters](./working-with-asset-inventory-filters.md).

  - Export information to a CSV file. See [Export Asset Inventory Information](./export-asset-inventory-information.md) for details.

  - Import Windows Registry details. See [Learning Windows Registry Details](./working-with-asset-inventory-filters.md#learning-windows-registry-details).

  - Create Groups for display in the Asset Map. See [Save Inventory Filters](./working-with-asset-inventory-filters.md#save-inventory-filters) for details.

:::image type="content" source="media/image143.png" alt-text="Asset Inventory":::

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

2. In the **Assets** pane, select :::image type="content" source="media/image144.png" alt-text="Asset pane":::.

To hide and display columns, customize the Asset Inventory table:

1.  On the Asset Inventory top-right menu, select :::image type="content" source="media/image145.png" alt-text="Setting":::.

:::image type="content" source="media/image146.png" alt-text="Asset Inventory Setting":::

2. In the Asset Inventory Settings window, select the columns that you want to display in the Asset Inventory table

3. Change the location of the columns in the table using arrows.

4. Select **Save**. The Asset Inventory Settings window closes, and the new settings appear in the table.

### Working with asset inventory filters

#### Create temporary inventory filters

For each column in the Asset Inventory table you can set a filter that defines what information is displayed in the table. For example, you can decide that you want to view only the PLC assets information.

:::image type="content" source="media/image147.png" alt-text="Assets - Learning":::

The filter is not saved when you leave the window.

#### Save inventory filters

You can save a filter or a combination of filters that you need and reapply them in the Asset Inventory. Create broader filters based on a certain asset type, or more narrow filters based on a specific type and a specific protocol.

The filters you save are also saved as Asset Map groups. This provided an additional level of granularity in viewing network assets on the map.

To create filters:

1. In the column that you want to filter, select :::image type="content" source="media/image148.png" alt-text="Filter":::.

2. In the Filter dialog box, select the filter type, as follows:

  - **Equals:** The exact value according to which you want to filter the column, for example, if you filter the Protocol column according to Equals and value=ICMP, the column will present assets that use the ICMP protocol only.

  - **Contains:** The value that is contained among other values in the column. For example, if you filter the Protocol column according to Contains and the value=ICMP, the column will present assets that use the ICMP protocol as a part of the list of protocols that the asset uses.

3. To organize the column info according to the alphabetical order, select :::image type="content" source="media/image151.png" alt-text="Select](media/image149.png) and arrange the order by selecting the ![Up](media/image150.png) and ![Down":::arrows.

4. To save a new filter, define the filter and select **Save As**.

5. To change the filter definitions, change the definitions and select **Save Changes**.

To view filters:

1. Open a left pane and view the filter(s) that you have saved:

   :::image type="content" source="media/image152.png" alt-text="Left Pane":::

#### View filtered information as a map group

When switching to the map view, the filtered assets are highlighted/filtered and the filter group that you saved appears in the side menu under the Asset Inventory Filters group.

:::image type="content" source="media/image153.png" alt-text="Map Group":::

### Learning windows registry details 

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

:::image type="content" source="media/image154.png" alt-text="Data mining":::

The following Windows OS can be surveyed:

  - Windows XP

  - Windows 2000

  - Windows NT

  - Windows 7

  - Windows 10

  - Windows Server 2003/2008/2012/2016

#### Before you begin 

The following is required to work with the script.

  - Admin permissions are required to run the script on the asset.

  - The Windows asset should already be learned by the sensor. This means that if the asset already exists, its information will be retrieved by the script.

  - A sensor is monitoring the network the Windows PC is connected to.

#### Acquiring the script 

To receive the script, contact customer support at [support.microsoft.com](mailto:support.microsoft.com).

#### Deploying the script

You can deploy the script once or schedule on-going queries using standard automated deployment methods and tools.

#### About the script

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

     :::image type="content" source="media/image155.png" alt-text="run bat":::

2. Run the run.bat file.

3. After the registry is probed, the CX-snapshot file appears with the registry information.

4. The file name indicates the system name and date and time of the snapshot. For example: CX-snaphot_SystemName_Month_Year_Time

#### Import asset details

Information learned on each endpoint should be imported to the sensor.

Files generated from the queries can be placed in one folder that is accessible from sensors. Use standard, automated methods, and tools to move the files from each Windows endpoint to the location you will be importing them to the sensor.

Do not update file names.

To import:

1. Select **Import Settings** from the **Import Windows Configuration** dialog box.

   :::image type="content" source="media/image156.png" alt-text="Import Windows Configuration":::

2. Select **Add**, and then select all the files (Ctrl=A).

3. Select **Close.** The asset registry information will be imported. if there is a problem uploading one of the files you will be informed which file upload failed.

   :::image type="content" source="media/image157.png" alt-text="Ad new file":::

### Export asset inventory information

You can Export Asset Inventory Information to an Excel file. IM ported information overwrites current information.

To export a CSV file:

1.  On the Asset Inventory top-right menu, select :::image type="content" source="media/image158.png" alt-text="CSV":::. The CSV report is generated and downloaded.