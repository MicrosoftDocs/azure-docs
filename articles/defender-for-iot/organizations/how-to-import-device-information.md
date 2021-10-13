---
title: Import device information
description: Defender for IoT sensors monitor and analyze mirrored traffic. In these cases, you might want to import data to enrich information on devices already detected.
ms.date: 12/06/2020
ms.topic: how-to
---

# Import device information to a sensor

An Azure Defender for IoT sensor monitors and analyzes mirrored traffic. In some cases, because of organization-specific network configuration policies, some information might not be transmitted.

In these cases, you might want to import data to enrich information on devices that are already detected. Two options are available for importing information to sensors:

- **Import from the Map**: Update the device name, type, group, or Purdue layer to the map.

- **Import from Import Settings**: Import device OS, IP address, patch level, or authorization status.

## Import from the map

This section describes how to import device names, types, groups, or Purdue layers to the device map. You do this from the map.

Here are the import requirements:

- **Names**: Can be up to 30 characters.

- **Type** or **Purdue Layer**: Use the options that appear in the **Device Properties** dialog box. (Right-click the device and select **View Properties**.)

- **Device Group**: Create a new group of up to 30 characters. 

> [!NOTE]
> To avoid conflicts, don't import the data that you exported from one sensor to another sensor.

To import:

1. On the side menu, select **Devices**.

2. In the upper-right corner of the **Devices** window, select :::image type="icon" source="media/how-to-import-device-information/file-icon.png" border="false":::.

   :::image type="content" source="media/how-to-import-device-information/device-window-v2.png" alt-text="Screenshot of the device window.":::

3. Select **Export Devices**. An extensive range of information appears in the exported file. This information includes protocols that the device uses and the device authorization status.

   :::image type="content" source="media/how-to-import-device-information/sample-exported-file.png" alt-text="The information in the exported file.":::

4. In the CSV file, change only the device name, type, group, and Purdue layer. Then save the file. 

   Use capitalization standards shown in the exported file. For example, for the Purdue layer, use all first-letter capitalization.

5. From the **Import/Export** drop-down menu in the **Device** window, select **Import Devices**.

   :::image type="content" source="media/how-to-import-device-information/import-assets-v2.png" alt-text="Import devices through the device window.":::

6. Select **Import Devices** and select the CSV file that you want to import. The import status messages appear on the screen until the **Import Devices** dialog box closes.

## Import from import settings

This section describes how to import the device IP address, OS, patch level, or authorization status to the device map. You do this from the **Import Settings** dialog box.

To import the IP address, OS, and patch level:

1. Download the [devices_info_2.2.8 and up.csv](https://cyberx-labs.zendesk.com/hc/en-us/articles/360008658272-How-To-Import-Data) file from the [Help Center](https://cyberx-labs.zendesk.com/hc/en-us) and enter the information as follows:

   - **IP Address**: Enter the device IP address.

   - **Operating System**: Select from the drop-down list.

   - **Last Update**: Use the YYYY-MM-DD format.

     :::image type="content" source="media/how-to-import-device-information/last-update-screen.png" alt-text="The options screen.":::

2. On the side menu, select **Import Settings**.

   :::image type="content" source="media/how-to-import-device-information/import-settings-screen-v2.png" alt-text="Import your settings.":::

3. To upload the required configuration, in the **Device Info** section, select **Add** and upload the CSV file that you prepared.

To import the authorization status:

1. Download and save the [authorized_devices.csv](https://cyberx-labs.zendesk.com/hc/en-us/articles/360008658272-How-To-Import-Data) file from the  Defender for IoT help center. Verify that you saved the file as a CSV.

2. Enter the information as:

   - **IP Address**: The device IP address.

   - **Name**: The authorized device name. Make sure that names are accurate. Names given to the devices in the imported list overwrite names shown in the device map.

     :::image type="content" source="media/how-to-import-device-information/device-map-file.png" alt-text="Excel files with imported device list.":::

3. On the side menu, select **Import Settings**.

4. In the **Authorized Devices** section, select **Add** and upload the CSV file that you saved.

When the information is imported, you receive alerts about unauthorized devices for all the devices that don't appear on this list.

## Import device information to the sensor

The sensor monitors and analyzes mirrored traffic. In some cases, because of organization-specific network configuration policies, some information might not be transmitted.

In these cases, you might want to import data to enrich device information on devices that are already detected. Two options are available for importing information to sensors:

- **Import from the Map**: Update the device name, type, group, or Purdue layer to the map.

- **Import from Import Settings**: Import device OS, IP address, patch level, or authorization status.

### Import from the map

This section describes how to import device names, types, groups, or Purdue layers to the device map. You do this from the map.

Here are the import requirements:

- **Names**: Can be up to 30 characters.

- **Type** or **Purdue Layer**: Use the options that appear in the **Device Properties** dialog box. (Right-click the device and select **View Properties**.)

- **Device Group**: Create a new group of up to 30 characters. 

> [!NOTE]
> To avoid conflicts, don't import the data that you exported from one sensor to another sensor.

To import:

1. On the side menu, select **Devices**.

2. In the upper-right corner of the **Devices** window, select :::image type="icon" source="media/how-to-import-device-information/file-icon.png" border="false":::.

   :::image type="content" source="media/how-to-import-device-information/device-window-v2.png" alt-text="The window to pick your device from.":::

3. Select **Export Devices**. An extensive range of information appears in the exported file. Examples include protocols that the device uses and the device authorization status.

   :::image type="content" source="media/how-to-import-device-information/sample-exported-file.png" alt-text="The information in the exported file.":::

4. In the CSV file, only change the device name, type, group, and Purdue layer. Then save the file. 

   Use capitalization standards shown in the exported file. For example, for the Purdue layer, use all first-letter capitalization.

5. From the **Import/Export** drop-down menu in the **device** window, select **Import Devices**.

   :::image type="content" source="media/how-to-import-device-information/import-assets-v2.png" alt-text="Import your devices.":::

6. Select **Import Devices** and select the CSV file that you want to import. The import status messages appear on the screen until the **Import Devices** dialog box closes.

### Import from import settings 

This section describes how to import the device IP address, OS, patch level, or authorization status to the device map. You do this from the **Import Settings** dialog box.

To import the IP address, OS, and patch level:

1. Download the [devices_info_2.2.8 and up.csv](https://cyberx-labs.zendesk.com/hc/en-us/articles/360008658272-How-To-Import-Data) file from the [Help Center](https://cyberx-labs.zendesk.com/hc/en-us) and enter the information as follows:

   - **IP Address**: The device IP address.

   - **Operating System**: Select from the drop-down list.

   - **Date of Last Update**: Use the YYYY-MM-DD format.

    :::image type="content" source="media/how-to-import-device-information/last-update-screen.png" alt-text="The content on the screen.":::

2. On the side menu, select **Import Settings**.

   :::image type="content" source="media/how-to-import-device-information/import-settings-screen-v2.png" alt-text="Fill out the import settings screen.":::

3. To upload the required configuration, in the **Device Info** section, select **Add** and upload the CSV file that you've prepared.

To import the authorization status:

1. Download and save the [authorized_devices - examples.csv](https://cyberx-labs.zendesk.com/hc/en-us/articles/360008658272-How-To-Import-Data) file from the  Defender for IoT help center. Verify that you saved the file as a CSV.

2. Enter the information as:

   - **IP Address**: The device IP address.

   - **Name**: The authorized device name. Verify that names are accurate. Names given to the devices in the imported list overwrite names shown in the device map.

     :::image type="content" source="media/how-to-import-device-information/device-map-file.png" alt-text="The import list to the device map.":::

3. On the side menu, select **Import Settings**.

4. In the **Authorized Devices** section, select **Add** and upload the CSV file that you saved.

When the information is imported, you receive alerts about unauthorized devices for all the devices that don't appear on this list.

## See also

[Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)

[Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
