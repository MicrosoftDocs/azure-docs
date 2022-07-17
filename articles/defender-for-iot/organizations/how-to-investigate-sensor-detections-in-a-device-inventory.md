---
title: View your device inventory from a sensor console
description: The device inventory displays an extensive range of device attributes that a sensor detects.
ms.date: 07/17/2022
ms.topic: how-to
---

# View your device inventory from a sensor console

The device inventory displays an extensive range of device attributes that your sensor detects. Use the inventory to gain insight and full visibility of the devices on your network.

:::image type="content" source="media/how-to-inventory-sensor/inventory-sensor.png" alt-text="Screenshot that shows the Device inventory main screen.":::

Options are available to:

 - Customize and filter the inventory.

 - Export information to a CSV file.

 - Import Windows registry details.

 - Create groups for display in the device map.

For more information, see [What is a Defender for IoT committed device?](architecture.md#what-is-a-defender-for-iot-committed-device)

## View device attributes in the inventory

This section describes device details available from the inventory, how to work with inventory filters, and how to view contextual information about each device.

**To view the device inventory:**

In the console left pane, select **Device inventory**.

The following columns are available for each device.

| Name | Description |
|--|--|
| **Description** | A description of the device |
| **Discovered** | When this device was first seen on the network. |
| **Firmware version** | The device's firmware, if detected. |
| **FQDN** | The device's FQDN value |
| **FQDN lookup time** | The device's FQDN lookup time |
| **Groups** | The groups that this device participates in. |
| **IP Address** | The IP address of the device. |
| **Is Authorized** | The authorization status defined by the user:<br />- **True**: The device has been authorized.<br />- **False**: The device hasn't been authorized. |
| **Is Known as Scanner** | Defined as a network scanning device by the user. |
| **Is Programming device** | Defined as an authorized programming device by the user. <br />- **True**: The device performs programming activities for PLCs, RTUs, and controllers, which are relevant to engineering stations. <br />- **False**: The device isn't a programming device. |
| **Last Activity** | The last activity that the device performed. |
| **MAC Address** | The MAC address of the device. |
| **Name** | The name of the device as the sensor discovered it, or as entered by the user. |
| **Operating System** | The OS of the device, if detected. |
| **PLC mode** (preview) | The PLC operating mode includes the Key state (physical) and run state (logical). Possible **Key** states include, Run, Program, Remote, Stop, Invalid, Programming Disabled.Possible Run. The possible **Run** states are Run, Program, Stop, Paused, Exception, Halted, Trapped, Idle, Offline. If both states are the same, only one state is presented. |
| **Protocols** | The protocols that the device uses. |
| **Type** | The type of device as determined by the sensor, or as entered by the user. |
| **Unacknowledged Alerts** | The number of unacknowledged alerts associated with this device. |
| **Vendor** | The name of the device's vendor, as defined in the MAC address. |
| **VLAN** | The VLAN of the device. For more information, see [Define VLAN names](how-to-manage-the-on-premises-management-console.md#define-vlan-names). |

**To hide and display columns:**

1. Select **Edit Columns** and select a column you need or delete a column.
1. Select **Save**.

**To view additional details:**

1. Select an alert from the inventory and the select **View full details** in the dialog box that opens.
1. Navigate to additional information such as firmware details, view contextual information such as alerts related to the device, or a timeline of events associated with the device.

## Filter the inventory

Customize the inventory to view devices important to you. An option is also available to save inventory filters for quick access to device information you need.

**To create filters:**

1. Select **Add filter** from the Device inventory page.
1. Select a category from the **Column** field.
1. Select an **Operator**.
   - **Equals**: The exact value according to which you want to filter the column. For example, if you filter the protocol column according to **Equals** and `value=ICMP`, the column will present devices that use the ICMP protocol only.

   - **Contains**: The value that's contained among other values in the column. For example, if you filter the protocol column according to **Contains** and `value=ICMP`, the column will present devices that use the ICMP protocol as a part of the list of protocols that the device uses.

1. Select a filter value.

### Save device inventory filters

You can save a filter or a combination of filters that you need and view them in the device inventory when needed. Create broader filters based on a certain device type, or more narrow filters based on a specific protocol.

The filters that you save are also saved as Device map groups. This feature provides an additional level of granularity in viewing network devices on the map.

**To save and view filters:**

1. Use the **Add filter** option to filter the table.
1. Select **Save Filter**.
1. Add a filter name in the dialog box that opens and select **Submit**.
1. Select the double arrow >> on the left side of the page.
The filters you create appear in the **Saved Views** pane.

    :::image type="content" source="media/how-to-inventory-sensor/save-views.png" alt-text="Screenshot that shows the saved Device inventory filter.":::


### View filtered information as a map group

You can display devices from saved filters in the Device map.

**To view devices in the map:**

1. After creating and saving an Inventory filter, navigate to the Device map.
1. In the map page, open the Groups pane on the left.
1. Scroll down to the **Asset Inventory Filters** group.  The groups you saved from the Inventory appear.


### Update device properties

Certain device properties can be updated manually. Information manually entered will override information discovered by Defender for IoT.

**To update properties:**

1. Select a device from the inventory. 
1. Select **View full details**.
1. Select **Edit properties.**
1. Update any of the following:

    - Authorized status
    - Device name
    - Device type
    - OS
    - Purdue layer
    - Description
1. Select **Save**.

## Merge devices

You may need to merge duplicate devices if the sensor has discovered separate network entities that are associated with a single, unique device.

Examples of this scenario might include a PLC with four network cards, a laptop with both WiFi and a physical network card, or a single workstation with multiple network cards.

> [!NOTE]
> - You can only merge authorized devices.
> - Device merges are irreversible. If you merge devices incorrectly, you'll have to delete the merged device and wait for the sensor to rediscover both devices.
> - Alternately, merge devices from the [Device map](how-to-work-with-the-sensor-device-map.md) page.

When merging, you instruct the sensor to combine the device properties of two devices into one. When you do this, the Device Properties window and sensor reports will be updated with the new device property details.

For example, if you merge two devices, each with an IP address, both IP addresses will appear as separate interfaces in the Device Properties window. 

**To merge devices from the device inventory:**

1. Use the SHIFT key to select two devices from the inventory, and then right-click one of them.

1. Select **Merge** to merge the devices. This can take up to 2 minutes to complete.

1. When the **Set merge device attributes** dialog appears, enter a meaningful name for your merged device, and then select **Save**.


## View inactive devices

You may want to view devices in your network that have been inactive and delete them. 

For example, devices may become inactive because of misconfigured SPAN ports, changes in network coverage, or by unplugging them from the network

**To view inactive devices**, filter the device inventory to display devices that have been inactive.

On the **Device inventory** page:

1. Select **Add filter**.
1. Select **Last Activity** in the column field.
1. Choose the time period in the **Filter** field.

    :::image type="content" source="media/how-to-inventory-sensor/save-filter.png" alt-text="Screenshot that shows the last activity filter in Inventory.":::

    Filtering options include seven days or more, 14 days or more, 30 days or more, or 90 days or more.

> [!TIP]
> We recommend that you [delete](#delete-devices) inactive devices to display a more accurate representation of current network activity, better evaluate [committed devices](architecture.md#what-is-a-defender-for-iot-committed-device), and reduce clutter on your screen.

## Delete devices

You may want to delete devices from your device inventory, such as if they've been [merged incorrectly](#merge-devices), or are [inactive](#view-inactive-devices).

Deleted devices are removed from the **Device map**, and aren't calculated when generating reports, such as Data Mining, Risk Assessment, or Attack Vector reports.<!--is this also synched w the portal? hope so-->

**To delete a single device**:

In the **Device inventory** page, select the device you want to delete, and then select **Delete** :::image type="icon" source="media/how-to-manage-device-inventory-on-the-cloud/delete-device.png" border="false"::: in the toolbar at the top of the page.

At the prompt, select **Yes** to confirm that you want to delete the device from Defender for IoT.

**To delete all inactive devices**

1. Select the **Last Seen** filter icon in the Inventory.
1. Select a filter option.
1. Select **Apply**.
1. Select **Delete Devices**.
1. In the confirmation dialog box that opens, enter the reason for the deletion and select **Delete**.

All devices detected within the range of the filter will be deleted. If you delete a large number of devices, the delete process may take a few minutes.

## Export device inventory information

You can export device inventory information to a .csv file.

**To export:**

- Select **Export file** from the Device Inventory page. The report is generated and downloaded.

## Learn Windows registry details

In addition to learning OT devices, you can discover Microsoft Windows workstations and servers. These devices are also displayed in the Device Inventory. After you learn devices, you can enrich the Device Inventory with detailed Windows information, such as:

- Windows version installed

- Applications installed

- Patch-level information

- Open ports

- More robust information on OS versions

Two options are available for retrieving this information:

- Active polling with scheduled WMI scans. For more information, see [Configure Windows Endpoint monitoring](configure-windows-endpoint-monitoring.md).

- Local surveying by distributing and running a script on the device. Working with local scripts bypasses the risks of running WMI polling on an endpoint. It's also useful for regulated networks with waterfalls and one-way elements.

This section describes how to locally survey the Windows endpoint registry with a script. This information will be used for generating alerts, notifications, data mining reports, risk assessments, and attack vector reports.

You can survey the following Windows operating systems:

- Windows XP

- Windows 2000

- Windows NT

- Windows 7

- Windows 10

- Windows 11

- Windows Server 2003/2008/2012/2016/2019

### Before you begin

To work with the script, you need to meet the following requirements:

- Administrator permissions are required to run the script on the device.

- The sensor should have already learned the Windows device. This means that if the device already exists, the script will retrieve its information.

- A sensor is monitoring the network that the Windows PC is connected to.

### Acquire the script

To receive the script, [contact customer support](mailto:support.microsoft.com).

### Deploy the script

You can deploy the script once or schedule ongoing queries using standard automated deployment methods and tools.

### About the script

- The script is run as a utility and not an installed program. Running the script doesn't affect the endpoint.

- The files that the script generates remain on the local drive until you delete them.

- The files that the script generates are located next to each other. Don't separate them.

- If you run the script again in the same location, these files are overwritten.

**To run the script:** 

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

Files generated from the queries can be placed in one folder that you can access from the sensors. Use standard, automated methods and tools to move the files from each Windows endpoint to the location where you'll be importing them to the sensor.

Don't update file names.

**To import:**

1. Select **System Settings** > **Import Settings** > **Windows Information**.

2. Select **Import File**, and then select all the files (Ctrl+A).

3. Select **Close**. The device registry information is imported. If there's a problem uploading one of the files, you'll be informed which file upload failed.

    :::image type="content" source="media/how-to-work-with-asset-inventory-information/add-new-file.png" alt-text="Upload of added files was successful.":::

## Next steps

For more information, see:

- [Investigate all enterprise sensor detections in a device inventory](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

- [Manage your IoT devices with the device inventory](../device-builders/how-to-manage-device-inventory-on-the-cloud.md#manage-your-iot-devices-with-the-device-inventory)
