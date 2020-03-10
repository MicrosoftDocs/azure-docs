---
title: Certify your IoT Plug and Play Preview device | Microsoft Docs
description: This tutorial describes how to add your product information to the Azure Certified for IoT device catalog, connect your device to the Azure IoT certification service, and then run the IoT Plug and Play certification tests.
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: tutorial
ms.author: koichih
author: konichi3
ms.date: 12/27/2019
# As a device builder, I want to certify my IoT Plug and Play device and add it to the Azure IoT device catalog so that customers can find it.
---

# Tutorial: Certify your IoT Plug and Play Preview device

To publish an IoT Plug and Play Preview device in the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat), it must pass a set of certification tests. Use the [Azure Certified for IoT](https://aka.ms/ACFI) portal to submit your device for certification. The [Azure IoT certification service](https://aka.ms/azure-iot-aics) runs the certification tests.

In this tutorial, you learn:

> [!div class="checklist"]
> * What are the IoT Plug and Play certification requirements.
> * How to add your product name and information to the portal.
> * How to connect and discover IoT Plug and Play interfaces.
> * How to review IoT Plug and Play interfaces and run certification tests.
> * How to publish the certified IoT Plug and Play device to the catalog.

## Prerequisites

To complete this tutorial, you need:

* A Microsoft Partner Center account.
* The Microsoft Partner Network ID.

For more information, see [How to onboard to the Azure Certified for IoT](howto-onboard-portal.md) portal.

## Certification requirements

To certify your IoT Plug and Play device, your device must meet the following requirements:

* Your IoT Plug and Play device code must be installed on your device.
* Your IoT Plug and Play device code are built with the Azure IoT SDK.
* Your device code must support the [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md).
* Your device code must implement the [Device Information Interface](concepts-common-interfaces.md).
* The capability model and device code work with IoT Central.

All the devices currently in the catalog are considered to be pre-certified IoT Plug and Play devices. It does not guarantee the quality and compliance of the final product of IoT Plug and Play software components such as SDK and the Digital Twin Definition Language.

All of the pre-certified IoT Plug and Play devices must recertify upon general availability of IoT Plug and Play based on the final version of certification requirements and software components provided by Microsoft.

## Add product name

**Product** is a friendly name for a product model that a customer can purchase. To add a product:

1. Sign in to the [Azure Certified for IoT](https://aka.ms/ACFI) portal.
1. Go to the **Products** page in the portal from the left menu and select **+ New**.
1. Enter your friendly product name and select **Create**. The name entered here is different from the name displayed in the device catalog.

## Add product information

After you've successfully created the product in the portal, the product is displayed in the **Products** page. To add the product information:

1. Select the created product link found on the **Product** page in the product column. The state should be in draft state.
1. Select the **Edit** link next to **Product information** heading. Enter information about your product in the product information page, and make sure you complete all the required fields.
1. Select **Save**. The **Save** button only appears when you complete all the required fields. If the fields are incomplete, the button says **Save and finish later**.
1. Review the content you entered. Complete all the required fields to publish the device to the device catalog. You can always go back to make edits to the product information in product detail page by clicking the **edit** link next to **Product information** heading.

## Connect and discover interfaces

To run the certification tests, connect your device to the [Azure IoT certification service](https://aka.ms/azure-iot-aics) (AICS) that is available in the portal.

These steps are one time step for running certification tests and it isn't necessary to change your product device code. To start, follow these steps to connect to AICS:

1. Sign in to the portal using your Partner Center account.
1. Click on **Connect + test** to start certification flow.
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

On the review page, you can review the discovered IoT Plug and Play interfaces. Use this page to check the primitives implemented in the interface display correctly. You can also check the location of the interface.

1. Make sure payload inputs are entered for the required fields. These fields include payload information for the command primitive for the specified interface.
1. When you've entered all the required information, select **Next**.
1. To run the tests for the implemented IoT Plug and Play interfaces, select **Run tests**.
1. All the tests run automatically. If any test fails, select **View logs** to view the error messages from AICS and the raw telemetry sent to Azure IoT Hub.
1. To complete the certification tests, select **Finish**.
1. Publish the certified IoT Plug and Play device to the catalog. To add the certified device to the catalog, select **Add to catalog** on the toolbar. If the **Add to catalog** is greyed out, it means either the product information is incomplete or the tests have failed. 
1. Select the "CERTIFIED AND IN THE CATALOG" link to view your published device on in the device catalog.

## Next steps

Now that you've learned about certifying IoT Plug and Play device, the suggested next step is to learn more about managing capability models:

> [!div class="nextstepaction"]
> [Manage models](./howto-manage-models.md)
