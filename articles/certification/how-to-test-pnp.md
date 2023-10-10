---
title: Test your IoT Plug and Play device with Azure CLI
description: A guide on how to test IoT Plug and Play device with the Azure CLI in preparation for certification.
author: cbroad
ms.author: cbroad
ms.service: certification
ms.topic: how-to 
ms.date: 01/28/2022
ms.custom: template-how-to, devx-track-azurecli
---

# How to test IoT Plug and Play devices

The IoT Plug and Play device certification program includes tools to check that a device meets the IoT Plug and Play certification requirements. The tools also help organizations to drive awareness of the availability of their IoT Plug and Play devices. These certified devices are tailored for IoT solutions and help to reduce time to market.

This article shows you how to:

- Install the Azure IoT command-line tool extension for the Azure CLI
- Run the IoT Plug and Play tests to validate your device application while in-development phase  

> [!Note]
> A full walk through the certification process can be found in the [Azure Certified Device certification tutorial](tutorial-00-selecting-your-certification.md).

## Prepare your device

The application code that runs on your IoT Plug and Play must:

- Connect to Azure IoT Hub using the [Device Provisioning Service (DPS)](../iot-dps/about-iot-dps.md).
- Follow the [IoT Plug an Play conventions](../iot-develop/concepts-developer-guide-device.md) to implement of telemetry, properties, and commands.

The application is software that's installed separately from the operating system or is bundled with the operating system in a firmware image that's flashed to the device.

Prior to certifying your device through the certification process for IoT Plug and Play, you will want to validate that the device implementation matches the telemetry, properties and commands defined in the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) device model locally prior to submitting to the [Azure IoT Public Model Repository](../iot-develop/concepts-model-repository.md).

To meet the certification requirements, your device must:

- Connects to Azure IoT Hub using the [DPS](../iot-dps/about-iot-dps.md).
- Implement of telemetry, properties, or commands following the IoT Plug and Play convention.
- Describe the device interactions with a [DTDL v2](https://aka.ms/dtdl) model.
- Send the model ID during [DPS registration](../iot-develop/concepts-developer-guide-device.md#dps-payload) in the DPS provisioning payload.
- Announce the model ID during the [MQTT connection](../iot-develop/concepts-developer-guide-device.md#model-id-announcement).

## Test with the Azure IoT Extension CLI

The [Azure IoT CLI extension](/cli/azure/iot/product?view=azure-cli-latest&preserve-view=true) lets you validate that the device implementation matches the model before you submit the device for certification through the Azure Certified Device portal.

The following steps show you how to prepare for and run the certification tests using the CLI:

### Install the Azure IoT extension for the Azure CLI
Install the [Azure CLI](/cli/azure/install-azure-cli) and review the installation instructions to set up the [Azure CLI](/cli/azure/iot?view=azure-cli-latest&preserve-view=true) in your environment.

To install the Azure IoT Extension, run the following command:

```azurecli
az extension add --name azure-iot
```

To learn more, see [Azure CLI for Azure IoT](/cli/azure/iot/product?view=azure-cli-latest&preserve-view=true).

### Create a new product test

The following command creates a test using DPS with a symmetric key attestation method:

- Creates a new product to test, and generates a test configuration. The output displays the DPS information that the device must use for provisioning:  the primary key, device ID, and ID Scope.
- Specifies the folder with the DTDL files describing your model.

```azurecli
az iot product test create --badge-type Pnp --at SymmetricKey --device-type FinishedProduct --models {local folder name}
```

The JSON output from the command contains the `primaryKey`, `registrationId`, and `scopeID` to use when you connect your device.

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

When the device is connected and ready to interact with the IoT hub, generate a product test configuration file. To create the file:

- Use the test `id` from the output of the previous command.
- Use the `--wait` parameter to get the test case.

```azurecli
az iot product test task create --type GenerateTestCases --test-id [YourTestId] --wait
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

After you generate the test configuration, the next step is to run the tests. Use the same `devicetestId` from the previous commands as parameter to run the tests. Check the test results to make sure that all tests have a status `Passed`.

```azurecli
az iot product test task create --type QueueTestRun --test-id [YourTestId] --wait
```

Example test run output

```json
"validationTasks": [
  {
    "componentName": "Default component",
    "endTime": "2020-08-25T05:18:49.5224772+00:00",
    "interfaceId": "dtmi:com:example:TemperatureController;1",
    "logs": [
      {
        "message": "Waiting for telemetry from the device",
        "time": "2020-08-25T05:18:37.3862586+00:00"
      },
      {
        "message": "Validating PnP properties",
        "time": "2020-08-25T05:18:37.3875168+00:00"
      },
      {
        "message": "Validating PnP commands",
        "time": "2020-08-25T05:18:37.3894343+00:00"
      },
      {
        "message": "{\"propertyName\":\"serialNumber\",\"expectedSchemaType\":null,\"actualSchemaType\":null,\"message\":\"Property is successfully validated\",\"passed\":true,\"time\":\"2020-08-25T05:18:37.4205985+00:00\"}",
        "time": "2020-08-25T05:18:37.4205985+00:00"
      },
      {
        "message": "PnP interface properties validation passed",
        "time": "2020-08-25T05:18:37.4206964+00:00"
      },
      ...
    ]
  }
]
```

## Test using the Azure Certified Device portal

The following steps show you how to use the [Azure Certified Device portal](https://certify.azure.com) to onboard, register product details, submit a getting started guide, and run the certification tests.

### Onboarding

To use the [certification portal](https://certify.azure.com), you must use an Azure Active Directory from your work or school tenant.

To publish the models to the Azure IoT Public Model Repository, your account must be a member of the [Microsoft Partner Network](https://partner.microsoft.com). The system checks that the Microsoft Partner Network ID exists and the account is fully vetted before publishing to the device catalog.

### Company profile

You can manage your company profile from the left navigation menu. The company profile includes the company URL, email address, and company logo. The program agreement must be accepted on this page before you run any certification operations.

The company profile information is used in the device description showcased in the device catalog.

### Create new project

To certify a device, you must first create a new project.

Navigate to the [certification portal](https://certify.azure.com). On the **Projects** page, select *+ Create new project*. Then enter a name for the project, the device name, and select a device class.

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

### Submit and publish

The final required stage is to submit the project for review. This step notifies an Azure Certified Device team member to review your project for completeness, including the device and marketing details, and the get started guide. A team member may contact you at the company email address previously provided with questions or edit requests before approval.

If your device requires further manual validation as part of certification, you'll receive a notice at this time.

When a device is certified, you can choose to publish your product details to the Azure Certified Device Catalog using the **Publish to catalog** feature in the product summary page.

## Next steps

Now the device submission is completed, you can contact the device certification team at [iotcert@microsoft.com](mailto:iotcert@microsoft.com) to continue to the next steps, which include Microsoft Partner Network membership validation and a review of the getting started guides. When all the requirements are satisfied, you can choose to have your device included in the [Certified for Azure IoT device catalog](https://devicecatalog.azure.com).
