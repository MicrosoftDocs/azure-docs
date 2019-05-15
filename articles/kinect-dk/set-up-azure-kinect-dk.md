---
title: Set up Azure Kinect
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

Check System requirements to verify that your host PC configuration meets all Azure Kinect DK minimum requirements.

## Set up hardware

1. Connect the power cable to your device and plug the power supply into a wall outlet or power strip.
2. Connect the USB data cable into your device and PC. [!NOTE] Use connectors from the PC to the the back of device, as they work better than connectors such as a dongle.)
3. Verify the power indicator LED next to the USB cable is solid white.
4. Device power on takes a few seconds and is ready to use when the front-facing LED streaming indicator turns off.

## Download the SDK

1. Select the link to Download the SDK
2. Install the SDK on your PC.

## Update device firmware

1. The firmware version shipped with the SDK is newer than the hardware version. To ensure you have the latest version, perform a Firmware Update as Azure Kinect does not automatically update firmware. 

## Verify device streams data

1. Launch ```k4aviewer.exe``` located under tools -directory (e.g. ```C:\Program Files\Azure Kinect SDK\tools\k4aviewer.exe```). You can launch it from either the command line or by double-clicking the executable.
2. Select **Open Device**, then **Start**.
3. Verify that all device sensors stream data (Depth, RGB, IMU, and microphones) are visualized in the tool.
4. You're done with your Kinect setup.  Now you can start developing your application or integrating services.

See the index about what you can do next!

If you have any issues, check Troubleshooting. 

## Next steps

* See code samples in GitHub and develop your first application
* Try recording sensor streams to file  and open with the video player
* Azure Kinect Homepage
* Azure Kinect DK hardware information
* Update device firmware
* Learn more about Kinect for Azure viewer
