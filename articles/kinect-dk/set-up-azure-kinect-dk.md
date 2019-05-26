---
title: Set up Azure Kinect
description: Instructions how to set up Azure Kinect DK hardware
author: joylital
ms.author: joylital
ms.prod: kinect-dk
ms.topic: quickstart
ms.date: 06/05/2019
keywords: azure, kinect, dev kit, azure dk, set up, hardware, quick, usb, power, viewer, sensor, streaming, setup, SDK, firmware
---

# Quickstart: Set up Azure Kinect DK

This page provides guidance about how to set up your Azure Kinect hardware, test sensor stream visualization, and use the Azure Kinect Viewer.

## System requirements

Check [System requirements](system-requirements.md) to verify that your host PC configuration meets all Azure Kinect DK minimum requirements.

## Set up hardware

1. Connect the power cable to your device and plug the power supply into a wall outlet or power strip.
2. Connect the USB data cable into your device and PC.
   >[!NOTE]
   >Use a direct cable from the PC to the back of the device, as this works better than connecting through adapters or extensions.

3. Verify the power indicator LED next to the USB cable is solid white.
4. Device power on takes a few seconds and is ready to use when the front-facing LED streaming indicator turns off.

    ![Full device features](./media/quickstarts/full-device-features.png)

## Download the SDK

1. Select the link to [Download the SDK](sensor-sdk-download.md).
2. Install the SDK on your PC.

## Verify device streams data

1. Launch `k4aviewer.exe` located under the installed tools directory (e.g. `C:\Program Files\Azure Kinect SDK\tools\k4aviewer.exe`). You can launch it from either the command line or by double-clicking the executable. Azure Kinect Viewer is also available as a link in the start menu.
2. Select **Open Device**, then **Start**.

    ![Azure Kinect Viewer](./media/quickstarts/viewer.png)

3. Verify that all device sensors stream data (Depth, RGB, IMU, and microphones) are visualized in the tool.

    ![Visualization Tool](./media/quickstarts/visualization-tool.png)

4. You're done with your Kinect setup.  Now you can start developing your application or integrating services.

If you have any issues, check Troubleshooting.

## Next steps

After the Azure Kinect device is ready and working, you can also learn how to
> [!div class="nextstepaction"]
>[Record sensor stream to a file](record-sensor-streams-file.md)

### See also

[Azure Kinect DK hardware information](hardware-specification.md)

[Update device firmware](azure-kinect-dk-update-device-firmware.md)

Learn more about [Kinect for Azure viewer](azure-kinect-sensor-viewer.md)
