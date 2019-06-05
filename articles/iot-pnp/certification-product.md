---
title: Add your product information 
description: This tutorial describes how to add your product information
services: 
ms.service: 
ms.subservice: 
ms.topic: tutorial
ms.reviewer: 
ms.author: koichih
author: konichi3
ms.date: 06/5/2019
---

# Tutorial: Add your product information

In the how-to article, you learned about how to register your company to the portal, create Plug and Play models and implement your device code to be certified.

This tutorial provides the steps to add your product name and information to be certified and added to the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat).

In this tutorial, you use learn how to:

 * Understand the certification requirements
 * Add your product name
 * Add your product information

## Prerequisites

To complete this tutorial, you need:
* A Microsoft Partner Center account
* Log in to the portal using the Partner Center credential


## Certification requirements

To certify your IoT Plug and Play device, your device need to comply following requirements:

1. Your device code that implements IoT Plug and Play needs to installed on your device
2. Supports [Azure IoT Hub Device Provisioning Service](https://docs.microsoft.com/en-us/azure/iot-dps/about-iot-dps)
3. Implements [Device Information Interface](https://github.com/Azure/Azure-IoT-PnP-Preview/blob/master/src/provisioningscripts/samples/interfaces/DeviceInformation.interface.json)

It is highly recommended to use the [IoT Plug and Play SDK](https://github.com/Azure/Azure-IoT-PnP-Preview) for writing your device code.

## Add your product
 
Product is a friendly name for product model that a customer can purchase. Follow these steps to add a product:

1. Click the **+ Add your product**  button found on overview page of the portal.
2. Enter your friendly product name and click the **Create** button. The name entered here is different from the name display in the device catalog.

## Add your product information
After you successfully created the product entity in the portal, your newly created product will be displayed in the overview page. Follow these steps to add the product information:

1. Click the **Add information** link found on overview page of the portal. The link is located in the next action column.
2. Enter information about your product in the product information page.
3. Make sure to enter required fields that are red asterisk marked
4. Click **Save** button once complete
5. Review the content you just entered


## Next Steps
In the review page, click **Connect + test** link to start your certification tests.
