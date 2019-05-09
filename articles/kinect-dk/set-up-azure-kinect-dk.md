---
title: Set Up Azure Kinect
description: Set up Azure Kinect DK hardware
author: joylital
ms.author: joylital
ms.prod: kinect-dk
ms.topic: quickstart
ms.date: 4/5/2019
keywords: azure, kinect, dev kit, azure dk, set up, hardware, quick, usb, power, viewer, sensor, streaming, setup, SDK, firmware
---

# Quickstart: Set up Azure Kinect DK

This page provides guidance about how to set up your Azure Kinect DK setup, test sensor stream visualization, and use the Azure Kinect Viewer.

## System requirements

Check [system requirements](system-requirements.md) to verify that your host PC configuration meets all Azure Kinect DK minimum requirements.

## Set up hardware

1. Connect the power cable to your device and plug the power supply into a wall outlet or power strip.
2. Connect the USB data cable into your device and PC. (**Note!** Use connectors from the PC to the the back of device, as they work better than connectors such as a dongle.)
3. Verify the power indicator LED next to the USB cable is solid white.
4. Device power on takes a few seconds and is ready to use when the front-facing LED streaming indicator turns off.

![AzureKinect DK connected](images/azurekinectdk-connected2.png)

## Download the SDK

5. Select the link to [Download the SDK](download-sdk.md).
6. Install the SDK on your PC.

## Update device firmware

7. The firmware version shipped with the SDK is newer than the hardware version. To ensure you have the latest version, perform a [Firmware Update](azurekinect-fw-update.md) as Azure Kinect does not automatically update firmware. 

## Verify device streams data

8. Launch ```k4aviewer.exe``` located under tools -directory (e.g. ```C:\Program Files\Azure Kinect SDK\tools\k4aviewer.exe```). You can launch it from either the command line or by double-clicking the executable.

9. Select **Open Device**, then **Start**.

    ![Viewer Configuration](images/AzureKinectViewer-Configuration.png)

10. Verify that all device sensors stream data (Depth, RGB, IMU, and microphones) are visualized in the tool.

    ![K4AViewer Screenshot](images/k4aViewer-ExampleScreenshot.png)

11. Your are done with your Kinect setup.  Now you can start developing your application or integrating services.

See [here](index.md) about what you can do next!

If you have any issues, check [troubleshooting](troubleshooting.md).

## Next steps

* See [code samples](https://github.com/Microsoft/Azure-Kinect-Sensor-SDK/tree/develop/examples) and develop your first application. (**Coming soon!**)
* Try [recording a sensor stream to file](k4a-recordplayback.md) and open with the video player.

## See also

* [Azure Kinect Homepage](index.md)
* [Azure Kinect DK hardware information](azure-kinect-devkit.md)
* [Update device firmware](azurekinect-fw-update.md)
* Learn more about [Kinect for Azure viewer](k4a-viewer.md)
