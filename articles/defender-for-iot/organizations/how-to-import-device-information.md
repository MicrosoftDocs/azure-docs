---
title: Import device information
description: Defender for IoT sensors monitor and analyze mirrored traffic. In these cases, you might want to import data to enrich information on devices already detected.
ms.date: 02/01/2022
ms.topic: how-to
---

# Import device information to a sensor

Sensors monitor and analyze device traffic. In some cases, because of network policies, some information might not be transmitted. In this case, you can import data and add it to device information that's already detected. You have two options for import:

- **Import from the device map**: Import device names, type, group, or Purdue layer to the device map.
- **Import from import settings**: Import device IP address, operating system, patch level, or authorization status to the device map.

## Import from the device map

Before you start, note that:

- **Names**: Names can be up to 30 characters.
- **Device Group**: Create a new group of up to 30 characters. 
- **Type** or **Purdue Layer**: Use the options that appear in the device properties when you select a device. 
- To avoid conflicts, don't import the data that you exported from one sensor to another.

Import data as follows:

1. In Defender for IoT, select **Device map**.
2. Select **Export Devices**. An extensive range of information appears in the exported file. This information includes protocols that the device uses and the device authorization status.
4. In the CSV file, you should change only the device name, type, group, and Purdue layer. Use capitalization standards shown in the exported file. For example, for the Purdue layer, use all first-letter capitalization.
1. Save the file.
1. Select **Import Devices**. Then select the CSV file that you want to import. 

## Import from import settings

1. Download the [Devices settings file](https://download.microsoft.com/download/8/2/3/823c55c4-7659-4236-bfda-cc2427be2cee/CSS/devices_info_2.2.8%20and%20up.xlsx).
1. In the **Devices** sheet, enter the device IP address.
1. In **Device Type**, select the type from the dropdown list.
1. In **Last Update**, specify the data in YYYY-MM-DD format.
1. In **System settings**, under **Import settings**, select **Device Information** to import. Select **Add** and upload the CSV file that you prepared.


## Import authorization status

1. Download the [Authorization file](https://download.microsoft.com/download/8/2/3/823c55c4-7659-4236-bfda-cc2427be2cee/CSS/authorized_devices%20-%20example.csv)  and save as a CSV file.
1. In the authorized_devices sheet, specify the device IP address.
1. Specify the authorized device name. Make sure that names are accurate. Names given to the devices in the imported list overwrite names shown in the device map.
1. In **System settings**, under **Import settings**, select **Authorized devices** to import. Select **Add** and upload the CSV file that you prepared.

When the information is imported, you receive alerts about unauthorized devices for all the devices that don't appear on this list.


## Next steps

For more information, see:

- [Control what traffic is monitored](how-to-control-what-traffic-is-monitored.md)

- [Investigate sensor detections in a device inventory](how-to-investigate-sensor-detections-in-a-device-inventory.md)
