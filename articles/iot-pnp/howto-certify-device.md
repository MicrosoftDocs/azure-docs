---
title: How to certify IoT Plug and Play devices | Microsoft Docs
description: As a device builder, learn how to run tests and submit a device for certification
author: konichi3
ms.author: koichih
ms.date: 08/21/2020
ms.topic: how-to
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
---

# How to certify IoT Plug and Play devices

The IoT Plug and Play device certification program includes tools to check that a device meets the IoT Plug and Play certification requirements. The tools also help organizations to drive awareness of the availability of their IoT Plug and Play devices. These certified devices are tailored for IoT solutions and help to reduce time to market.

This article shows you how to:

- Install the command-line tool (CLI) and run the tests
- Use the Azure Certified Device portal to test your device

## Prepare your device

The application code that runs on your IoT Plug and Play must follow the [IoT Plug an Play conventions](concepts-convention.md) to implement of telemetry, properties, and commands. The application might be software that's installed separately from the operating system or be bundled with the operating system in a flashable firmware image.

The certification process ensures your device application implements the IoT Plug and Play conventions correctly and that the device model or models are defined correctly using the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) schema.

To meet the certification requirements, your device must:

- Implement of telemetry, properties, and commands following the IoT Plug and Play convention.
- Support the [Device Provisioning Service (DPS)](https://docs.microsoft.com/azure/iot-dps/).
- Model the device interactions with a [DTDL v2](https://aka.ms/dtdl) schema.
- Make the model or models available in the [public model repository](https://devicemodels.azureiotsolutions.com/)
- Announce the model ID during DPS registration.
- Announce the model ID during the MQTT connection.

## Test with the CLI

The following steps show you how to prepare for and run the certification tests using the CLI:

### Install the Azure IoT extension for the Azure CLI

See the installation instructions to set up the [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) in your environment.

To install the Azure IoT Extension, run the following command:

```azurecli
az extension add --name azure-iot
```

To learn more, see [Azure CLI for Azure IoT](https://docs.microsoft.com/cli/azure/azure-cli-reference-for-iot?view=azure-cli-latest).

### Create a new product test

The [product certification CLI](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/product?view=azure-cli-latest) lets you validate that the device implementation matches the model before you submit the device for certification through the Azure Certified Device portal.

The following test assumes the device supports DPS and uses the symmetric key attestation method. The command:

- Creates a new product entity and generates a test configuration. The output displays the DPS scope information that the device must use for provisioning:  the primary key, registration ID, and ID Scope.
- Specifies the device models to use by identifying the local folder that contains the DTDL files.

```azurecli
az iot product test create --badge-type Pnp --at SymmetricKey --device-type FinishedProduct --models {local folder name}
```

The JSON output from the command contains the `primaryKey`, `registrationID`, and `scopeID` to use when you connect your device.

Expected output:

```json
"deviceType": "FinishedProduct",
"id": "d45d53d9-656d-4be7-9bbf-140bc87e98dc",
"provisioningConfiguration": {
  "symmetricKeyEnrollmentInformation": {
    "primaryKey":"Ci/Ghpqp0n4m8FD5PTicr6dEikIfM3AtVWzAhObU7yc=",
    "registrationId": "d45d53d9-656d-4be7-9bbf-140bc87e98dc",
    "scopeId": "0ne000FFA42"
  }
}
```

### Connect your device

Use the DPS information output by the previous command to connect your device to the test IoT Hub instance.

### Manage and configure the product tests

After the device connects, generate a product test configuration file. To create the file:

- Use the test ID from the output of the previous command.
- Use the `--wait` parameter to get the test case.

```azurecli
az iot product test task create --type GenerateTestCases --test-id d45d53d9-656d-4be7-9bbf-140bc87e98dc --wait
```

Expected output:

```json
{
  "deviceTestId": "d45d53d9-656d-4be7-9bbf-140bc87e98dc",
  "error": null,
  "id": "526da38e-91fc-4e20-a761-4f04b392c42b",
  "resultLink": "/deviceTests/d45d53d9-656d-4be7-9bbf-140bc87e98dc/TestCases",
  "status": "Completed",
  "type": "GenerateTestCases"
}
```

You can use the `az iot product test case update` command to modify the test configuration file.

### Run the tests

After you generate the test configuration, the next step is to run the tests. Use the same test ID from the previous commands as parameter to run the tests. Check the test results to make sure that all tests have a status `Passed`.

```azurecli
az iot product test task create --type QueueTestRun --test-id d45d53d9-656d-4be7-9bbf-140bc87e98dc --wait
```

## Test using the Azure Certified Device portal

The following steps show you how to onboard, register product details, submit a getting started guide, and run the certification tests using the Azure Certified Device portal.

At the time of writing, the portal doesn't support publishing to the [Certified for Azure IoT device catalog](https://aka.ms/devicecatalog).

### Onboarding

To sign in to the portal, you must be a member of the [Microsoft Partner Network](https://partner.microsoft.com) and use Azure Active Directory work or school account. The system checks that the Microsoft Partner Network ID exists and the account is fully vetted before publishing to the device catalog.

### Company profile

You can manage your company profile from the left navigation menu. The company profile includes the company URL, email address, and company logo. The program agreement must be accepted on this page before you run any certification operations.

The company profile information is used in the device description showcased in the device catalog.

### Create new project

To certify a device, you must first create a new project.

On the **Projects** page, select *+ Create new project*. Then enter a name for the project, the device name, and select a device class.

The product information you provide during the certification process falls into four categories:

- Device information. Collects information about the device such as its name, description, certifications, and operating system.
- The **Get started** guide. You must submit the guide as a PDF document to be approved by the system administrator before publishing the device.
- Marketing details. Provide customer-ready marketing information for your device. The marketing information includes as description, a photo, and distributors.
- Additional industry certifications. This optional section lets you provide additional information about any other certifications the device has got.

### Connect and test

The connect and test step checks that your device meets the IoT Plug and Play certification requirements.

There are three steps to be completed:

1. Connect and discover interfaces. The device must connect to the Azure IoT certification service through DPS. Choose the authentication method (X.509 certificate, symmetric keys, or trusted platform module) to use and update the device application with the DPS information.
1. Review interfaces. Review the interface and make sure each one has payload inputs that make sense for testing.
1. Test. The system tests each device model to check that the telemetry, properties, and commands described in the model follow the IoT Plug and Play conventions. When the test is complete, select the **view logs** link to see the telemetry from the device and the raw data sent to IoT Hub device twin properties.

## Next steps

Now that the device submission is completed, contact iotcert@microsoft.com for next steps to publish the device to the device catalog.
