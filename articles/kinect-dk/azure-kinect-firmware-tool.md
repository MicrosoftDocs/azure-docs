---
title: Azure Kinect firmware tool
description:  Azure Kinect Firmware Tool usage
author: tesych
ms.author: tesych
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: conceptual
keywords: kinect, firmware, update
---

# Azure Kinect DK firmware tool

The Azure Kinect Firmware Tool can be used to query and update the device firmware of the Azure Kinect DK.

## List connected devices

You can get a list of connected devices by using the -l option.  `AzureKinectFirmwareTool.exe -l`

```console
 == Azure Kinect DK Firmware Tool ==
Found 2 connected devices:
0: Device "000036590812"
1: Device "000274185112"
```

## Check device firmware version

You can check the current firmware versions of the first attached device by using -q option, for example, `AzureKinectFirmwareTool.exe -q`.

```console
 == Azure Kinect DK Firmware Tool ==
Device Serial Number: 000036590812
Current Firmware Versions:
    RGB camera firmware:      1.5.92
    Depth camera firmware:    1.5.66
    Depth config file:        6109.7
    Audio firmware:           1.5.14
    Build Config:             Production
    Certificate Type:         Microsoft
```

If there's more than one device attached, you can specify which device you want to query by adding the full serial number to the command, such as:

`AzureKinectFirmwareTool.exe -q 000036590812`

## Update device firmware

The most common use of this tool is to update device firmware. Do the update by calling the tool using the `-u` option. A firmware update can take few minutes, depending on which firmware files must be updated.

For step-by-step firmware update instruction, see [Azure Kinect firmware update](update-device-firmware.md).  

`AzureKinectFirmwareTool.exe -u firmware\AzureKinectDK_Fw_1.5.926614.bin`

If there's more than one device attached, you can specify which device you want to query by adding the full serial number to the command.

`AzureKinectFirmwareTool.exe -u firmware\AzureKinectDK_Fw_1.5.926614.bin 000036590812`

## Reset device

An attached Azure Kinect DK can be reset using -r option, if you must get the device into a known state.

If there's more than one device attached, you can specify which device you want to query by adding the full serial number to the command.

`AzureKinectFirmwareTool.exe -r 000036590812`

## Inspect firmware

Inspecting firmware allows you to get the version information from a firmware bin file before updating an actual device.

`AzureKinectFirmwareTool.exe -i firmware\AzureKinectDK_Fw_1.5.926614.bin`

```console
 == Azure Kinect DK Firmware Tool ==
Loading firmware package ..\tools\updater\firmware\AzureKinectDK_Fw_1.5.926614.bin.
File size: 1228844 bytes
This package contains:
  RGB camera firmware:      1.5.92
  Depth camera firmware:    1.5.66
  Depth config files: 6109.7 5006.27
  Audio firmware:           1.5.14
  Build Config:             Production
  Certificate Type:         Microsoft
  Signature Type:           Microsoft
```

## Firmware update tool options

```console
 == Azure Kinect DK Firmware Tool ==
* Usage Info *
    AzureKinectFirmwareTool.exe <Command> <Arguments>

Commands:
    List Devices: -List, -l
    Query Device: -Query, -q
        Arguments: [Serial Number]
    Update Device: -Update, -u
        Arguments: <Firmware Package Path and FileName> [Serial Number]
    Reset Device: -Reset, -r
        Arguments: [Serial Number]
    Inspect Firmware: -Inspect, -i
        Arguments: <Firmware Package Path and FileName>

    If no Serial Number is provided, the tool will just connect to the first device.

Examples:
    AzureKinectFirmwareTool.exe -List
    AzureKinectFirmwareTool.exe -Update c:\data\firmware.bin 0123456
```

## Next steps

> [!div class="nextstepaction"]
>[Step-by-step instructions to update device firmware](update-device-firmware.md)
