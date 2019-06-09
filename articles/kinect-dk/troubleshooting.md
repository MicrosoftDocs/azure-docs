---
title: Azure Kinect known issues and troubleshooting
description: Known issues and troubleshooting Azure Kinect device
author: tesych
ms.author: tesych
ms.prod: kinect-dk
ms.date: 06/13/2019
ms.topic: article
keywords: troubleshooting, update, bug, kinect, feedback, recovery, logging, tips
---
# Known Issues and Troubleshooting

This page contains known issues and troubleshooting tips when using Sensor SDK with Azure Kinect DK. See also [product support pages](http://aka.ms/kinectsupport) for product hardware- specific issues.

## Known issues (v1.0.0)

- Compatibility issues with ASMedia USB host controllers (for example, ASM1142 chipset)
  - Some cases using Microsoft USB driver can unblock
  - Many PCs have also alternative host controllers and changing the USB3 port may help

- External Sync: Subordinate device outputs two frames before master starts to output frames
  - Recording needs post-processing to get number of frames to match, use timestamps with [offset](record-playback-api.md) to align frames in your tool.

- External Sync: Master is one frame faster than subordinates
  - Use higher framerate to minimize impact, under investigation.

- Compute shader produces incorrect results on AMD graphics card
  - Known to happen with latest AMD graphics drivers and when using NFOV 2x2 binned mode
  - Work around to use driver 18.12.1.1 or older OR avoid using NFOV 2x2 binned mode with latest driver

More more issues check [GitHub Issues](https://github.com/Microsoft/Azure-Kinect-Sensor-SDK/issues)

## Collecting logs

Logging for K4A.dll is enabled through environment variables. By default logging is sent to stdout and only errors and critical messages are generated. These settings can be altered
so that logging goes to a file. The verbosity can also be adjusted as needed. Below is an example, for Windows, of enabling logging to a file, named k4a.log, and will capture warning
and higher-level messages.

1. `set K4A_ENABLE_LOG_TO_A_FILE=k4a.log`
2. `set K4A_LOG_LEVEL=w`
3. Run scenario from command prompt (for example, launch viewer)
4. Navigate to k4a.log and share file.

For more information, see below clip from header file:

```
/**
* environment variables
* K4A_ENABLE_LOG_TO_A_FILE =
*    0    - completely disable logging to a file
*    log\custom.log - log all messages to the path and file specified - must end in '.log' to
*                     be considered a valid entry
*    ** When enabled this takes precedence over the value of K4A_ENABLE_LOG_TO_STDOUT
*
* K4A_ENABLE_LOG_TO_STDOUT =
*    0    - disable logging to stdout
*    all else  - log all messages to stdout
*
* K4A_LOG_LEVEL =
*    'c'  - log all messages of level 'critical' criticality
*    'e'  - log all messages of level 'error' or higher criticality
*    'w'  - log all messages of level 'warning' or higher criticality
*    'i'  - log all messages of level 'info' or higher criticality
*    't'  - log all messages of level 'trace' or higher criticality
*    DEFAULT - log all message of level 'error' or higher criticality
*/
```

## Device doesn't enumerate in device manager

- Check the status LED behind the device, if it's blinking amber you have USB connectivity issue and it doesn't get enough power. The power supply cable should be plugged into the
provided power adapter. While the power cable has a USB type A connected, the device requires more power than a PC USB port can supply. So, don't connect to it to a PC port or USB hub.
- Check that you have power cable connected and using USB3 port for data.
- Try changing USB3 port for the data connection (recommendation to use USB port close to motherboard, for example, in back of the PC).
- Check your cable, damaged or lower quality cables may cause unreliable enumeration (device keeps "blinking" in device manager).
- If you have connected to laptop and running on battery, it may be throttling the power to the port.
- Reboot host PC.
- If problem persists, there may be compatibility issue.
- If failure happened during firmware update and device has not recovered by itself, perform [factory reset](https://support.microsoft.com/help/4494277/reset-azure-kinect-dk).

## Azure Kinect Viewer fails to open

- Check first that your device enumerates in Windows Device Manager.

    ![Azure Kinect cameras in Windows device manager](./media/resources/viewer-fails.png)

- Check if you have any other application using the device (for example, Windows camera application). Only one application at a time can access the device.
- Check k4aviewer.err log for error messages.
- Open Windows camera application and check of that works.
- Power cycle device, wait streaming LED to power off before using the device.
- Reboot host PC.
- Make sure you are using latest graphics drivers on your PC.
- If you are using your own build of SDK, try using officially released version if that fixes the issue.
- If problem persists, [collect logs](troubleshooting.md#collecting-logs) and file feedback.

## Cannot find microphone

- Check first that microphone array is enumerated in Device Manager.
- If a device is enumerated and works otherwise correctly in Windows, the issue may be that after firmware update Windows has assigned different container ID to Depth Camera.
- You can try to reset it by going to Device Manager, right-clicking on "Azure Kinect Microphone Array",  and select "Uninstall device". Once that is complete, detach and reattach the sensor.

    ![Azure Kinect Mic Array](./media/resources/mic-not-found.png)

- After that restart Azure Kinect Viewer and try again.

## Device Firmware update issues

- If correct version number is not reported after update, you may need to power cycle the device.
- If firmware update is interrupted, it may get into bad state and fail to enumerate. Detach and reattach the device and wait 60 seconds to see if it can recover.
If not then perform a [factory reset](https://support.microsoft.com/help/4494277/reset-azure-kinect-dk)

## Image quality issues

- Start [Azure Kinect Viewer](azure-kinect-sensor-viewer.md) and check positioning of the device for interference or if sensor is blocked or lens is dirty.
- Try different operating modes to narrow down if issue is happening in specific mode.
- For sharing image quality issues with the team you can:

1) Take pause view on [Azure Kinect Viewer](azure-kinect-sensor-viewer.md) and take a screenshot or
2) Take recording using [Azure Kinect Recorder](azure-kinect-sensor-viewer.md), for example, `k4arecorder.exe -l 5 -r 5 output.mkv`

## USB3 host controller compatibility

If the device is not enumerating under device manager, it may be because it's plugged into an unsupported USB3 controller. For best results,
ensure the USB3 driver is a Microsoft driver, it's indicated in Device Manager with a '(Microsoft)' after the name. To remove a third-party driver,
right-click the device in Device Manager and click "Uninstall Device". Select the checkbox to delete the driver, and then hit the button 'Uninstall'

## Next steps

>[!div class="nextstepaction"]
>[More support information](kinect-support.md)