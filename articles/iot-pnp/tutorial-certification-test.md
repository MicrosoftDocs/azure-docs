---
title: Connect and test your Azure IoT Plug and Play device | Microsoft Docs
description: This tutorial describes how to connect your device to the Azure IoT certification service and then run the Plug and Play certification tests.
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: tutorial
ms.author: koichih
author: konichi3
ms.date: 06/07/2019
# As a device builder, I want to certify my PnP device and add it to the Azure IoT device catalog so that customers can find it.
---

# Tutorial: Connect and test your IoT Plug and Play device

In the previous tutorial, you learned about IoT Plug and Play certification requirements and how to add your product name and information.

This tutorial shows you how to connect your IoT Plug and Play (PnP) device to the [Azure IoT certification service](https://aka.ms/azure-iot-aics). When you've connected your device, you can run the tests required to certify your device for PnP.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Connect a device
> * Discover IoT PnP interfaces
> * Review IoT PnP interfaces and run tests
> * Apply for certification

## Prerequisites

To complete this tutorial, you need:

* A Microsoft Partner Center account
* The Microsoft Partner Network ID associated with your company's AAD tenant

## Connect and discover IoT PnP interfaces

To run the PnP certification tests, connect your device to the [Azure IoT certification service](https://aka.ms/azure-iot-aics) (AICS).

These steps are one time step for running certification tests and it isn't necessary to change your product device code. To start, follow these steps to connect to AICS:

1. Sign in to the portal using your Partner Center credentials.
1. Choose the [authentication method](../iot-dps/concepts-security.md#attestation-mechanism) to provision your device to AICS using the [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps).
   * If you're using an [X.509 certificate](../iot-hub/iot-hub-security-x509-get-started#prerequisites), upload your generated X.509 certificate. You may want to review the sample code that shows how to use X.509 certificates: [C](https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/samples/iothub_ll_client_x509_sample/iothub_ll_client_x509_sample.c), [C#](../iot-hub/iot-hub-security-x509-get-started).
   * If you're using a [symmetric key](../iot-dps/concepts-symmetric-key-attestation), copy and paste the symmetric key into your device code.
   * TPM authentication method isn't supported at this time.
1. Copy and paste the following generated IDs into your device code.
   * [Registration ID](../iot-dps/use-hsm-with-sdk)
   * [DPS ID](../iot-dps/tutorial-set-up-device#create-the-device-registration-software)
   * [DPS endpoint](../iot-dps/tutorial-set-up-device#create-the-device-registration-software)
1. When your device code is built and deployed to the device, select **Connect** to discover the PnP interfaces.
1. When connection to AICS is successful, select **Next** to review discovered PnP interfaces.

## Review PnP interfaces and run tests

On the review page, review discovered PnP interfaces and make sure the PnP primitives implemented in the interface and its corresponding interface location are displayed correctly.

1. Make sure payload inputs are entered for required fields. These include payload information for the command primitive for specified interface.
1. When you've entered all the required information, select **Next**.
1. To run the tests for implemented PnP interfaces, select **Run tests**.
1. All the tests run automatically. If any tests fail, select **View logs** to view the error messages from AICS and the raw telemetry sent to Azure IoT Hub.
1. To complete the certification tests, select **Finish**.
1. To add the certified device to the device catalog, select **Add to Catalog** on the toolbar.

## Next Steps

In this tutorial, you learned how to:

> [!div class="nextstepaction"]
> * Connect a device
> * Discover IoT PnP interfaces
> * Review IoT PnP interfaces and run tests
> * Apply for certification

Now that you know now to certify your PnP device, the suggested next step is to ...
