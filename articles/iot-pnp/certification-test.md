---
title: Connect and test your IoT Plug and Play device 
description: This tutorial describes how to connect to AICS (Azure IoT certification service) and run certification tests.
services: 
ms.service: 
ms.subservice: 
ms.topic: tutorial
ms.reviewer: 
ms.author: koichih
author: konichi3
ms.date: 06/5/2019
---

# Tutorial: Connect and test your IoT Plug and Play device

In the previous tutorial, you learned about IoT Plug and Play certification requirements and how to add your product name and information.

This tutorial provides the steps to connect your IoT Plug and Play (PnP)device to [Azure IoT certification service](http://aka.ms/azure-iot-aics) and test your device for Plug and Play certification.

In this tutorial, you use learn how to:

 * Connect and discover IoT PnP interfaces
 * Review IoT PnP interfaces and run tests
 * Apply for certification

## Prerequisites

To complete this tutorial, you need:
* A Microsoft Partner Center account
* Log in to the portal using the Partner Center credential
* Microsoft Partner Network ID associated with your company's AAD tenant


## Connect and discover IoT PnP interfaces

To start your certification tests, you need to connect your device to the [Azure IoT certification service](http://aka.ms/azure-iot-aics) (AICS). This is a certification service your IoT PnP device needs to connect to start the tests.

These steps are one time step for running certification tests and it is not necessary to change your product device code. To start, follow these steps to connect to AICS:

1. Choose your [authentication method](https://docs.microsoft.com/en-us/azure/iot-dps/concepts-security#attestation-mechanism) to provision your device to AICS via [Azure IoT Hub Device Provisioning Service](https://docs.microsoft.com/en-us/azure/iot-dps/about-iot-dps)
   *  If [X.509 certificate](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-security-x509-get-started#prerequisites) is chosen, you need to upload your generated X.509 certificate. We have C and C# samples available for X.509 certficate based authentication.
   *  If [Symmetric Key](https://docs.microsoft.com/en-us/azure/iot-dps/concepts-symmetric-key-attestation) is chosen, you need to copy and paste the symmetric key into your device code.
   *  TPM authentication method is not supported at this time.
2. Copy and paste the following IDs that are generated into your device code.
   * [Registration ID](https://docs.microsoft.com/en-us/azure/iot-dps/use-hsm-with-sdk)
   * [DPS ID](https://docs.microsoft.com/en-us/azure/iot-dps/tutorial-set-up-device#create-the-device-registration-software)
   * [DPS endpoint](https://docs.microsoft.com/en-us/azure/iot-dps/tutorial-set-up-device#create-the-device-registration-software)
3. Once your device code is built and deployed to the device, click **Connect** button to discover PnP interfaces.
4. When connection to AICS is successful, click **Next** button to review discovered PnP interfaces

## Review PnP interfaces and run tests
 
In review page, review discovered PnP interfaces and make sure the PnP primitives implemented in the interface and its corresponding interface location are displayed correctly.

1. Make sure payload inputs are entered for required fields. These include payload information for the command primitive for specified interface.
2. When all the information are entered, press **Next** button to start running the tests.
3. Click the **Run tests** button to start running tests for implemented PnP interfaces.
4. All tests are run automatically. If the tests fail, you can click **View logs** link to see the error messages from AICS and raw telemetry data sent to Azure IoT Hub.
5. Click **Finish** button to complete the certification tests
6. Click **Add to Catalog** button on upper toolbar to add certified device to the device catalog

## Next Steps
Confirm your certified IoT Plug and Play device is displayed in the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat).
