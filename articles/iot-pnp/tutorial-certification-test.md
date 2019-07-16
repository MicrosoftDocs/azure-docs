---
title: Connect and test your Azure IoT Plug and Play device | Microsoft Docs
description: This tutorial describes how to connect your device to the Azure IoT certification service and then run the Plug and Play certification tests.
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: tutorial
ms.author: koichih
author: konichi3
ms.date: 06/21/2019
# As a device builder, I want to certify my IoT Plug and Play device and add it to the Azure IoT device catalog so that customers can find it.
---

# Tutorial: Add product and certify your IoT Plug and Play device

This tutorial shows you how to add product, connect your IoT Plug and Play device to the [Azure IoT certification service](https://aka.ms/azure-iot-aics) for applyging certification. Upon the completion of certification, you can publish the certified IoT Plug and Play device to the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat) via the [Azure Certified for IoT](https://aka.ms/ACFI) portal.

In this tutorial, you learn:

> * IoT Plug and Play certification requirements
> * How to add your product name and information to the portal
> * How to connect and discover IoT Plug and Play interfaces
> * How to review IoT Plug and Play interfaces and run certification tests
> * How to publish the certified IoT Plug and Play device to the catalog

## Prerequisites

To complete this tutorial, you need:

* A Microsoft Partner Center account
* The Microsoft Partner Network ID

For more details, learn [how to onboard to the Azure Certified for IoT](howto-onboard-portal.md) portal

## Certification requirements

To certify your IoT Plug and Play device, your device must meet the following requirements:

* Your IoT Plug and Play device code must be installed on your device.
* Your IoT Plug and Play device code are built with Azure IoT SDK
* Your device code must support the [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md).
* Your device code must implement [Device Information Interface](concepts-common-interfaces.md)
* The capability model and device code work with IoT Central 

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


## Connect and discover interfaces

To run the certification tests, connect your device to the [Azure IoT certification service](https://aka.ms/azure-iot-aics) (AICS) that is available in the portal.

These steps are one time step for running certification tests and it isn't necessary to change your product device code. To start, follow these steps to connect to AICS:

1. Sign in to the portal using your Partner Center account.
1. Choose the [authentication method](../iot-dps/concepts-security.md#attestation-mechanism) to provision your device to AICS using the [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md).
   * If you're using an [X.509 certificate](../iot-hub/iot-hub-security-x509-get-started.md#prerequisites), upload your generated X.509 certificate. You may want to review the sample code that shows how to use X.509 certificates: [C](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/samples/iothub_ll_client_x509_sample/iothub_ll_client_x509_sample.c), [C#](../iot-hub/iot-hub-security-x509-get-started.md).
   * If you're using a [symmetric key](../iot-dps/concepts-symmetric-key-attestation.md), copy and paste the symmetric key into your device code.
   * TPM authentication method isn't supported at this time.
1. Copy and paste the following generated IDs into your device code.
   * [Registration ID](../iot-dps/use-hsm-with-sdk.md)
   * [DPS ID](../iot-dps/tutorial-set-up-device.md#create-the-device-registration-software)
   * [DPS endpoint](../iot-dps/tutorial-set-up-device.md#create-the-device-registration-software)
1. When your device code is built and deployed to the device, select **Connect** to discover the IoT Plug and Play interfaces.
1. When connection to AICS is successful, select **Next** to review discovered the IoT Plug and Play interfaces.

## Run tests and publish the device

On the review page, review discovered the IoT Plug and Play interfaces and make sure the primitives implemented in the interface and its corresponding interface location are displayed correctly.

1. Make sure payload inputs are entered for required fields. These include payload information for the command primitive for the specified interface.
1. When you've entered all the required information, select **Next**.
1. To run the tests for implemented IoT Plug and Play interfaces, select **Run tests**.
1. All the tests run automatically. If any tests fail, select **View logs** to view the error messages from AICS and the raw telemetry sent to Azure IoT Hub.
1. To complete the certification tests, select **Finish**.
1. Last step is to publish the certified IoT Plug and Play device to the catalog. To add the certified device to the catalog, select **Add to Catalog** on the toolbar.

## Next steps

Now that you've learned about certifying IoT Plug and Play device, here are some additional resources:

- [Digital Twin Definition Language (DTDL)](https://aka.ms/DTDL)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
