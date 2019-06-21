---
title: Add your Azure IoT Plug and Play product information | Microsoft Docs
description: This tutorial describes how to add your product information to the Azure Certified for IoT device catalog
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: tutorial
ms.author: koichih
author: konichi3
ms.date: 06/07/2019
# As a device builder, I want to certify my PnP device and add it to the Azure IoT device catalog so that customers can find it.
---

# Tutorial: Add your product information

In the how-to article, you learned about how to register your company to the portal, create Plug and Play models and implement your device code to be certified.

This tutorial shows you how to add the product information that's shown in the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat) for your Plug and Play (PnP) device.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Understand the certification requirements
> * Add your product name
> * Add your product information

## Prerequisites

To complete this tutorial, you need:
* A Microsoft Partner Center account

## Certification requirements

To certify your IoT Plug and Play device, your device must meet following requirements:

* Your IoT Plug and Play device code must be installed on your device.
* Your device code must support the [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md).
* Your device code must implement [Device Information Interface](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/src/provisioningscripts/samples/interfaces/DeviceInformation.interface.json)

Use the [IoT Plug and Play SDK](https://github.com/Azure/Azure-IoT-PnP-Preview) for writing your device code. The SDK makes it easy to add PnP support to your device

## Add product name

**Product** is a friendly name for a product model that a customer can purchase. To add a product:

1. Sign in to the portal.
1. Go to the **Overview** page in the portal and select **+ Add your product**.
1. Enter your friendly product name and select **Create**. The name entered here is different from the name displayed in the device catalog.

## Add product information

After you've successfully created the product in the portal, the product is displayed in the **Overview** page. To add the product information:

1. Select **Add information** link found on the **Overview** page in the portal. The link is in the **Next action** column.
1. Enter information about your product in the product information page, making sure you complete all the required fields.
1. Select **Save**.
1. Review the content you entered.

## Next steps

In this tutorial, you learned how to:

> [!div class="nextstepaction"]
> * Understand the certification requirements
> * Add your product name
> * Add your product information

Now that you know now to add your PnP device information to the portal, the suggested next step is to ...
