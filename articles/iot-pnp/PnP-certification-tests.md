---
title: How to certify IoT Plug and Play devices | Microsoft Docs
description: As a device builder, learn how to run tests and submit a device for certification
author: Koichi Hirao
ms.author:koichih
ms.date: 08/21/2020
ms.topic: how-to
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# How to certify IoT Plug and Play devices

As part of the IoT Plug and Play device certification program, tools are available for you to check the fulfillment of the IoT Plug and Play certification requirements. The tools are for companies to certify and drive awareness of their devices tailored for solutions while also reducing time to market.

This article shows you how to:

-	Install the CLI (Command line tool) and  run tests
-	Use the Azure Certified Device portal to test your device

## Prepare your device for IoT Plug and Play

Your IoT Plug and Play enabled device must consist of device application in way that their telemetry, properties, and commands follow the IoT Plug and Play conventions. The device application can be a software pre-installed separately from the operating system or can be bundled with the operating system as flash-able firmware image.

The certification process will ensure your device application implements correctly and the device model(s) are defined correctly following the Digital Twin Definition Language (DTDL).

Your device must fulfill requirements below:

- Telemetry, Properties and Commands follow the IoT Plug and Play convention
- Support [Device Provisioning Service (DPS)](https://docs.microsoft.com/en-us/azure/iot-dps/)
- Model the device interactions with the [DTDL v2](https://aka.ms/dtdl)
- Make the model(s) available in the [Public Model Repository](https://devicemodels.azureiotsolutions.com/)
- Announce the Model ID during the DPS registration
- Announce the Model ID during the MQTT connection

## Prepare the certification tests using the CLI

This section includes step by step instruction on how to create a new product, upload the device model(s) from local storage, and run certification test using the CLI.

The [certification CLI](https://docs.microsoft.com/en-us/cli/azure/ext/azure-iot/iot/product?view=azure-cli-latest) allows to validate the device implementation matches the model before submitting the device for certification through the Azure Certified Device portal.

### Install the Azure IoT extension for the Azure CLI

Follow the installation instructions to set up the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest) in your environment. 

### Create a new product test

Device supports DPS and use attestation method of Symmetric Key.

-	Create a new product entity and generate test configuration. The output displays the DPS scope information that the device is required to provisioned to: Primary Key, Registration Id and ID Scope.
-	The device models need to be specified by specifying a folder as a parameter. Be sure to replace the {foldername} with the local folder name that contains the device models.

```azurecli
az iot product test create --bt Pnp --at SymmetricKey --dt FinishedProduct -m {foldername}
```

### Connect your device

Using the DPS information in the output, connect your device to the IoT Hub instance via the DPS. The output would contains the following values in JSON format and look for PrimaryKey, registrationID and scopeID to be embedded in the device application.

Expected output:

"deviceType": "FinishedProduct",
  "id": "d45d53d9-656d-4be7-9bbf-140bc87e98dc",
"symmetricKeyEnrollmentInformation": {
      "primaryKey":"Ci/Ghpqp0n4m8FD5PTicr6dEikIfM3AtVWzAhObU7yc=",
"registrationId": "38c07b93-b5cb-437b-a75f-e0ce14b9ce2e",
"scopeId": "0ne000FFA42"
}


### Manage and configure the product tests

After the device is connected, generate product test configuration file. 

-	Use the test id as a parameter obtained from the output of the previous command
-	Product test configuration file is configurable to modify the tests
-	Check the status to be completed

```azurecli
az iot product test task create --type GenerateTestCases --test-id d45d53d9-656d-4be7-9bbf-140bc87e98dc --wait
```

Expected output:

{
  "deviceTestId": "d45d53d9-656d-4be7-9bbf-140bc87e98dc",
  "error": null,
  "id": "526da38e-91fc-4e20-a761-4f04b392c42b",
  "resultLink": "/deviceTests/d45d53d9-656d-4be7-9bbf-140bc87e98dc/TestCases",
  "status": "Completed",
  "type": "GenerateTestCases"
}

### Run the tests

After the test configuration is generated, next step is run the tests. Use the same test ID obtained in the previous command as parameter to run the test. Check the test results to make sure all test status is marked as “Passed”.

```azurecli
az iot product test task create --type QueueTestRun --test-id d45d53d9-656d-4be7-9bbf-140bc87e98dc --wait
```

## Prepare the certification tests using the Azure Certified Device portal

This section includes step by step instruction on how to onboard, register product details, submit getting started guide, and running the certification tests.

The portal does not support publishing to the [Certified for Azure IoT device catalog](https://aka.ms/devicecatalog) at the time of authoring.


### Onboarding

Sign-in to the portal requires membership of [Microsoft Partner Network](https://partner.microsoft.com/en-US/) and use AAD work or school account. The system will check whether the Microsoft Partner Network ID exists and the account is fully vetted before publishing to the device catalog. 

### Company Profile

Company profile is available in the left navigation menu for the company to enter its company URL, email address and upload company logo. Program agreement must be accepted before running any operations.

The information captured will be used for the device description showcased in the device catalog.

### Create new project and device details

Click *+Create new project* button to create a new project with project name, device name and select device class.

The product information provided during the certification process falls into four distinct categories:
1)	Device information. Collects information about the device such as device descriptions, processor, operating system etc.
2)	‘Get started’ guide. The guide must be submitted via PDF file format and uploaded to be approved by the system administrator before publishing the device.
3)	Marketing details. Provide customer-ready marketing information for you device. A new field 'distibutor' was added to provide list of distributor and URL for the marketplace for device to be purchased.
4)	Additional industry certifications (optional). Promote your device by providing additional information on industrial certification.

### Connect and test

Connect and test involves testing your device for adherence to IoT Plug and Play certification requirements.

There are three distinct steps that need to be completed:

1) Connect and discover interfaces. The device needs to be connected to the Azure IoT certification service via DPS. Choose the authentication method (X.509 certificate, Symmetric keys, and Trusted platform module) and update the device application with the DPS information.
2) Review interfaces. Review the interface and make sure each one has payload inputs that make sense for testing.
3) Test. The system will test each of the device model to check telemetry, property, and commands described are following IoT Plug and Play conventions. Upon completion, check *view logs* link to see the telemetry from the device and raw data sent to IoT Hub device twin properties.

## Next steps

Now that the device submission is completed, contact iotcert@microsoft.com for next steps to publish the device to the device catalog.
