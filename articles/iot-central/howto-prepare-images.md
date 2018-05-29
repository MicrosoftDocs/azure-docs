---
title: Upload images to your Azure IoT Central application | Microsoft Docs
description: As a builder, learn how to prepare and upload images to your Azure IoT Central application.
author: tbhagwat3
ms.author: tanmayb
ms.date: 04/16/2018
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpr
---

# Prepare and upload images to your Azure IoT Central application

This article describes how, as a builder, you can customize your Microsoft Azure IoT Central application by uploading custom images. For example, you can customize a device dashboard with a picture of the device.

## Before you begin

To complete the steps in this article, you need the following:

1. An Azure IoT Central application. For more information, see [Create your Azure IoT Central Application](howto-create-application.md).
1. A tool for scaling and resizing images files.

## Choose where to use custom images

You can add custom images to the following locations in an Azure IoT Central application:

* The **Application Manager** page

    ![Image on application manager page](media/howto-prepare-images/applicationmanager.png)

* The home page

    ![Image on home page](media/howto-prepare-images/homepage.png)

* A device template

    ![Image on device template](media/howto-prepare-images/devicetemplate.png)

* A tile on a device dashboard

    ![Image on device tile](media/howto-prepare-images/devicetile.png)

* A tile on a device set dashboard

    ![Image on device set tile](media/howto-prepare-images/devicesettile.png)

## Prepare the images

In all four locations, you can use either PNG, GIF, or JPEG images.

The following table summarizes the image sizes you can use:

| Location | Sizes |
| -------- | ------ |
| **Application Manager** | 268x160 px |
| Device template | 64x64 px |
| Home page and dashboard tiles | The smallest sized tile is 200x200 px, larger tiles can be either square or rectangular multiples of small tiles. For example 200x400 px, 400x200 px, or 400x400 px |

For the best display in the application, you should create images that match the dimensions shown in the previous table.

## Upload the images

The following sections describe how to upload the images to use in the different locations:

### Application manager

To upload an image to use on the **Application Manager**, navigate to the **Application Settings** page in the **Administration** section. You must be an administrator to complete this task:

![Upload application image](media/howto-prepare-images/uploadapplicationmanager.png)

Click the upload image and then choose the file to upload from your local machine.

### Home page

To upload an image to use on the home page, navigate to the **Homepage** of your application and switch design mode on. You must be a builder to complete this task:

![Upload home page image](media/howto-prepare-images/uploadhomepage.png)

Click the upload image and then choose the file to upload from your local machine.

After the image uploads, you can resize it while design mode is switched on.

### Device template

To upload an image to use on a device template, navigate to **Device Explorer**, choose the device template and then a device, and switch design mode on. You must be a builder to complete this task:

![Upload device template image](media/howto-prepare-images/uploaddevicetemplate.png)

Click the upload image and then choose the file to upload from your local machine.

### Device dashboard

To upload an image to use on a device dashboard, navigate to **Device Explorer**, choose the device template, and then a device. Then choose the **Dashboard** page and switch design mode on. You must be a builder to complete this task:

![Upload device dashboard image](media/howto-prepare-images/uploaddevicedashboard.png)

Click the upload image and then choose the file to upload from your local machine.

After the image uploads, you can resize and reposition it while **Design Mode** is switched on.

### Device set dashboard

To upload an image to use on a device set dashboard, navigate to **Device Sets** and choose the device set, and then a device. Then choose the **Dashboard** page and switch **Design Mode** on:

![Upload device set dashboard image](media/howto-prepare-images/uploaddevicesetdashboard.png)

Click the upload image and then choose the file to upload from your local machine.

After the image uploads, you can resize and reposition it while design mode is switched on.

## Next steps

Now that you have learned how to prepare and upload images to your Azure IoT Central application, here is the suggested next step:

> [!div class="nextstepaction"]
> [Manage devices in your Azure IoT Central application](howto-manage-devices.md)