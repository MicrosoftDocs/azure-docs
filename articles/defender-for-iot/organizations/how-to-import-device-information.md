---
title: Import extra data for detected OT devices - Microsoft Defender for IoT
description: Learn how to manually enhance the device data automatically detected by your Microsoft Defender for IoT OT sensor with extra, imported data.
ms.date: 11/26/2025
ms.topic: how-to
---

# Import extra data for detected OT devices

OT network sensors automatically monitor and analyze detected device traffic. In some cases, your organization's network policies might prevent some device data from being ingested to Microsoft Defender for IoT.

This article describes how you can manually import the missing data to your OT sensor and add it to the device data already detected.

## Prerequisites

Before performing the procedures in this article, you must have:

- An OT network sensor [installed](ot-deploy/install-software-ot-sensor.md), [configured, and activated](ot-deploy/activate-deploy-sensor.md).

- Access to your OT network sensor as an **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

- An understanding of the extra device data you want to import. Use that understanding to choose one of the following import methods:

    - **Import data from the device map** to import device names, operating systems, groups, or Purdue layer
    - **Import data from system settings** to import device IP addresses, operating systems, patch levels, or authorization statuses

> [!TIP]
> A device's authorization status affects the alerts that are triggered by the OT sensor for the selected device. You'll receive alerts for any devices *not* listed as authorized devices, as they'll be considered to be unauthorized.

## Import data from the OT sensor device map

**To import device names, types, groups, or Purdue layers**:

1. Sign into your OT sensor and select **Device map** > **Export Devices** to export the device data already detected by your OT sensor.

1. Open the downloaded .CSV file for editing and modify *only* the following data, as needed:

    - **Name**. Maximum length: 30 characters
    - **Device type**. The device’s functional role (for example, printer, surveillance camera, or smart appliance).
    - **Group**. Maximum length: 30 characters
    - **Purdue layer**. Enter one of the following: **Enterprise**, **Supervisory**, or **Process Control**

    Make sure to use capitalization standards already in use in the downloaded file. For example, in the **Purdue Layer** column, use *Title Caps*.

    > [!IMPORTANT]
    > Make sure that you don't import data to your OT sensor that you've exported from a different sensor.

1. When you're done, save your file to a location accessible from your OT sensor.

1. On your OT sensor, in the **Device map** page, select **Import Devices** and select your modified .csv file.

Your device data is updated.

## Import data from the OT sensor system settings

**To import device IP addresses, operating systems, or patch levels**:

1. In Excel, open a blank workbook and select **Save As** to save it in `.csv` format.

1. In your .csv file, type the following details for each device:

    - **IP Address**. Enter the device's IP address.
    - **Device OS**. Enter one of the device operating systems listed in the [supported values for the Device OS table](#supported-values-for-device-operating-system).
    - **Last Update**. Enter the date that the device was last updated, in `YYYY-MM-DD` format.

The following sections include information to help you fill in the Device OS column: The [device information example](#device-information-example) includes sample device details, and the [supported values table](#supported-values-for-device-operating-system) includes the supported operating system values.

### Device information example

|**IP Address**  |**Device OS**|**Last Update**  |
|---------|---------|---------|
|192.168.19.200   |  Windows 7  |  2017-11-01  |


### Supported values for Device operating system

| Windows | Windows Server | Other OS |
|---|---|---|
| Windows | Windows Server | macOS |
| Windows 11 | Windows Server 2003 | macOS X |
| Windows 10 | Windows Server 2003 R2 | Linux |
| Windows 10 32 | Windows Server 2008 | HP UX |
| Windows 10 64 | Windows Server 2008 32 | QNX |
| Windows 7 | Windows Server 2008 64 |  |
| Windows 7 32 | Windows Server 2008 R2 |  |
| Windows 7 64 | Windows Server 2012 |  |
| Windows 8 | Windows Server 2012 R2 |  |
| Windows 8 32 | Windows Server 2016 |  |
| Windows 8 64 | Windows Server 2019 |  |
| Windows 8.1 | Windows Server 2022 |  |
| Windows 8.1 32 |  |  |
| Windows 8.1 64 |  |  |
| Windows NT |  |  |
| Windows 2000 |  |  |
| Windows Vista |  |  |
| Windows Vista 32 |  |  |
| Windows Vista 64 |  |  |
| Windows XP |  |  |


3. Sign into your OT sensor and select **System settings > Import settings > Device information**.

4. In the **Device information** pane, select **+ Import file** and then select your edited .csv file.

5. Select **Close** to save your changes.

### Import device authorization status:

After importing device authorization status, any devices *not* included in the import list are newly defined as not-authorized, and you'll start to receive new alerts about any traffic on each of these devices.

1. Download the Defender for IoT [device authorization file](https://download.microsoft.com/download/8/2/3/823c55c4-7659-4236-bfda-cc2427be2cee/CSS/authorized_devices%20-%20example.csv) and open it for editing.

1. In the downloaded file, list IP addresses and names for any devices you want to list as authorized devices. 

    Make sure that your names are accurate. Names imported from a .CSV file overwrite any names already shown in the OT sensor's device map.

1. Sign into your OT sensor and select **System settings > Import settings > Authorized devices**.

1. In the **Authorized devices** pane, select **+ Import File** and then select your edited .CSV file.

1. Select **Close** to save your changes.

## Next steps

- [Detect Windows workstations and servers with a local script](detect-windows-endpoints-script.md) 
- [Manage your OT device inventory from a sensor console](how-to-investigate-sensor-detections-in-a-device-inventory.md).
