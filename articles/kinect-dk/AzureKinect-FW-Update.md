---
title: Azure Kinect DK Firmware Update
description: Instructions for updating Azure Kinect DK device firmware
author: joylital
ms.author: joylital
ms.date: 10/01/2018
keywords: kinect, firmware, update, recovery
---

# Azure Kinect DK Device Firmware Update

Azure Kinect DK does not update firmware automatically, you can use AzureKinectFirmwareTool to update firmware manually to the latest available version.

> [!NOTE]
> Firmware update from 1.x.40 including audio FW 1.4.7 to next one (audio FW 1.4.10) will cause firmware update fail on first try. After failure power cycle the device and try again. 

## Prepare for firmware update

1. Download SDK
2. Unzip all content, you should have under \tools\amd64\release\
    - AzureKinectFirmwareTool.exe and 
    - .bin file under firmware directory
3. Connect Device to host PC and power as well

> [!IMPORTANT]
> Keep USB and power supply connected during the firmware update. Removing connection during update may lead firmware to corrupt state.

## Update device firmware 

4. Open command prompt
5. Update Firmware using AzureKinectFirmwareTool

    `AzureKinectFirmwareTool.exe -u <device_firmware_file.bin>`

    Example:

    `AzureKinectFirmwareTool.exe -u firmware\Firmware_Composite_TestCert_Debug_TestSigned_1.4.705610_5006.27_6109.05_0112.bin`

6. Wait until firmware update finishes (takes about 60 seconds)

## Verify device firmware version

7. Verify firmware got updated 

    `AzureKinectFirmwareTool.exe -q`

    Example:

    ```
   >AzureKinectFirmwareTool.exe -q
    == Azure Kinect DK Firmware Tool ==
    Device Serial Number: 000096685112
    Current Firmware Versions:
     RGB camera firmware:      1.4.70
     Depth camera firmware:    1.4.56
     Depth config file:        6109.5
     Audio firmware:           1.4.10
     Build Config:             Debug
     Signature Type:           Test signed
    ```

8. Done!

After firmware update you can run [K4A Viewer](k4a-viewer.md) to verify all sensors are working as expected.

## Firmware update tool options

```
 == Azure Kinect DK Firmware Tool ==
* Usage Info *
    AzureKinectFirmwareTool.exe <Command> <Aguments>

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

## Troubleshooting

- Firmware fails to update

    This can happen e.g. if audio firmware is corrupted for example due interrupting firmware update
    1. Check firmware version using `AzureKinectFirmwareTool.exe -q`
    2. If it reports audio firmware version as `  Audio firmware:           255.255.65535`
    3. Use [recovery](azurekinect-fw-recovery.md) to restore older firmware and try updating again

- Firmware update from 1.x.40 fails
    -   This is known issue and can be worked around by power cycling device after update and doing update again

For any additional issues see also [troubleshooting](troubleshooting.md)