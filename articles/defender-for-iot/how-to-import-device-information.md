---
title: Import device information
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 11/08/2020
ms.topic: article
ms.service: azure
---

# Import asset information

The sensor monitors and analyzes mirrored traffic. In some cases, because of organization-specific network configuration policies, some information may not be transmitted.

In these cases, you may want to import data to enrich asset information on assets already detected. Two options are available for importing information to sensors.

  - **Import from the Map:** Update the asset Name, Type, Group, or Purdue Layer to the map.

  - **Import from Import Settings.** Import asset OS, IP address, patch level or authorization status

## Import from the map

This section describes how to import asset Names, Types, Groups, or Purdue Layers to the Asset Map. This is done from the map.

**Import requirements**

  - **Names:** Can be up to 30 characters.

  - **Type** or the **Purdue Layer**: use the options that appear in the Asset Properties dialog box (right-click the asset and select **View Properties**).

  - **Device Group** name: Create a new group of up to 30 characters. See ***Define Custom Groups*** for details about this feature.

> [!NOTE]
> To avoid conflicts, do not import the data that you exported from one sensor to another sensor.

To import:

1. On the side menu, select **Assets**.

2. In the right top corner of the **Assets** window, select :::image type="content" source="media/how-to-import-device-information/image124.png" alt-text="file":::.

   :::image type="content" source="media/how-to-import-device-information/image125.png" alt-text="Assets window":::

3. Select Export Assets. An extensive range of information appears in the exported file, for example: protocols used by the asset, the asset authorization status.

   :::image type="content" source="media/how-to-import-device-information/image126.png" alt-text="Information":::

4. In the CSV file, only change the asset Name, Type, Group, Purdue Layer and save the file. Use capitalization standards shown in the exported file. For example, for Purdue Layer use all first letter capitalization.

5. From the **Import/Export** drop-down menu in the **Asset** window, select **Import Assets**.

   :::image type="content" source="media/how-to-import-device-information/image127.png" alt-text="Import Assets":::

6. Select **Import Assets** and select the CSV file that you want to import. The import status messages appear on screen until the **Import Assets** box closes.

## Import from import settings 

This section describes how to import asset IP address, OS, patch level or authorization statuses to the asset map. This is done from the Import Settings Dialog Box.

To import the IP address, OS, patch level:

1. Download the [assets_info_2.2.8 and up.csv](https://cyberx-labs.zendesk.com/hc/en-us/articles/360008658272-How-To-Import-Data) file from the [CyberX Help Center](https://cyberx-labs.zendesk.com/hc/en-us) and enter the information as follows:

   - **IP Address:** The asset IP address

   - **Operating System:** Select from the drop-down list

   - **Last Update:** Use the YYYY-MM-DD format

     :::image type="content" source="media/how-to-import-device-information/image128.png" alt-text="Last update":::

2. On the side menu, select **Import Settings**.

   :::image type="content" source="media/how-to-import-device-information/image129.png" alt-text="Import setting":::

3. To upload the required configuration, in the Asset Info section select Add and upload the CSV file that you have prepared.

To import the authorization status:

1. Download and save the [authorized_assets.csv](https://cyberx-labs.zendesk.com/hc/en-us/articles/360008658272-How-To-Import-Data) file from the CyberX Help Center. Verify that you saved the file as a csv.

2. Enter the information as:

   - **IP Address:** The asset IP address

   - **Name:** The authorized asset name. Make sure that names are accurate. Names given to the assets in the imported list overwrite names shown in the asset map.

     :::image type="content" source="media/how-to-import-device-information/image130.png" alt-text="Asset map":::

3. On the side menu, select **Import Settings**.

4. In the **Authorized** **Assets** section, select **Add** and upload the CSV file that you saved.

When the information is imported, you receive alerts about unauthorized assets for all the assets that do not appear on this list.