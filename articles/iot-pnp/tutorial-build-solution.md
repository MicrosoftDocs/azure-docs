---
title: Create an IoT Plug and Play Preview end-to-end solution | Microsoft Docs
description: Use C to create a sample IoT Plug and Play device that implements three interfaces. Connect the device to an Azure IoT Hub. Use Node.js and the Service SDK to connect to and interact with the device.
author: ericmitt
ms.author: ericmitt
ms.date: 05/13/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to understand how an IoT Plug and Play device can interact with a backend solution.
---

# Develop an IoT Plug and Play Preview end-to-end solution

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This tutorial shows you how to use a sample IoT Plug and Play Preview device written in C and interact with it using the Node.js service SDK.

## Prerequisites

**Installation for Bug Bash 5/13**

1. Create an IoT Hub in either the Central US region or the East US region, with the **IOTPNP_TEST_BY_MAIN** subscription. Create the IoT Hub under this subscription, within the resource group **BugBash** in one of the supported regions: **Central US (UAP)** or **East US (CBN)**.

1. Download and install the latest release of **Azure IoT explorer** from the tool's [repository](https://github.com/Azure/azure-iot-explorer/releases) page, by selecting the .msi file under "Assets" for the most recent update.

1. Complete the sections in the [C device quickstart](./quickstart-connect-device-c.md) to download and build the code in the Azure IoT Hub Device C SDK.

1. Complete the section in the [Node.js service quickstart](quickstart-service-node.md) to install the required dependencies.

## The device and the models

The sample device declares its model definition in the `azure-iot-sdk-c\digitaltwin_client\samples\SampleDevice.model.json` file:

```json
{
  "@id": "dtmi:com:example:SampleDevice;1",
  "@type": "Interface",
  "displayName": "My Sample Model",
  "contents": [
    {
      "@type": "Component",
      "schema": "dtmi:com:example:EnvironmentalSensor;1",
      "name": "sensor"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azure:DeviceManagement:DeviceInformation;1",
      "name": "deviceInformation"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azure:Client:SDKInformation;1",
      "name": "sdkInformation"
    }
  ],
  "@context": "dtmi:dtdl:context;2"
}
```

This model shows that the sample device implements three IoT Plug and Play interfaces:

1. EnvironmentalSensor: `"schema": "dtmi:com:example:EnvironmentalSensor;1"`
1. DeviceInformation: `"schema": "dtmi:azure:DeviceManagement:DeviceInformation;1"`
1. SDKInformation: `"schema": "dtmi:azure:Client:SDKInformation;1"`

The last two, are public interfaces and are published in the global repository:

- [DeviceInfo](https://devicemodels.azureiotsolutions.com/models/public/dtmi:azure:DeviceManagement:DeviceInformation;1?codeView=true)
- See definition for [SDKInfo](https://devicemodels.azureiotsolutions.com/models/public/dtmi:azure:Client:SDKInformation;1?codeView=true)

The EnvironmentalSensor interface, is [defined in the C solution sample](https://github.com/Azure/azure-iot-sdk-c/blob/public-preview-pnp/digitaltwin_client/samples/digitaltwin_sample_environmental_sensor/EnvironmentalSensor.interface.json) as follows:

```json
{
  "@id": "dtmi:com:example:EnvironmentalSensor;1",
  "@type": "Interface",
  "displayName": "Environmental Sensor",
  "description": "Provides functionality to report temperature, humidity. Provides telemetry, commands and read-write properties",
  "comment": "Requires temperature and humidity sensors.",
  "contents": [
    {
      "@type": "Property",
      "displayName": "Device State",
      "description": "The state of the device. Two states are available or not available.",
      "name": "state",
      "schema": "boolean"
    },
    {
      "@type": "Property",
      "displayName": "Customer Name",
      "description": "The name of the customer currently operating the device.",
      "name": "name",
      "schema": "string",
      "writable": true
    },
    {
      "@type": "Property",
      "displayName": "Brightness Level",
      "description": "The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)",
      "name": "brightness",
      "writable": true,
      "schema": "integer"
    },
    {
      "@type": [
        "Telemetry",
        "Temperature"
      ],
      "description": "Current temperature on the device",
      "displayName": "Temperature",
      "name": "temp",
      "schema": "double",
      "unit": "degreeCelsius"
    },
    {
      "@type": [
        "Telemetry",
        "RelativeHumidity"
      ],
      "description": "Current humidity on the device",
      "displayName": "Humidity",
      "name": "humidity",
      "schema": "double",
      "unit": "percent"
    },
    {
      "@type": "Command",
      "description": "This Command will begin blinking the LED for given time interval.",
      "name": "blink",
      "request": {
        "name": "interval",
        "schema": "integer"
      },
      "response": {
        "name": "blinkResponse",
        "schema": {
          "@type": "Object",
          "fields": [
            {
              "name": "description",
              "schema": "string"
            }
          ]
        }
      }
    },
    {
      "@type": "Command",
      "name": "turnOn",
      "comment": "This Command will turn on the LED light on the device."
    },
    {
      "@type": "Command",
      "name": "turnOff",
      "comment": "This Command will turn off the LED light on the device."
    }
  ],
  "@context": "dtmi:dtdl:context;2"
}
```

## Implement the device in C

To view the sample device code, navigate to the `azure-iot-sdk-c\digitaltwin_client\samples` folder. The files in this folder show how the interfaces are implemented and how to create a client application. To learn more about these files, see the [Connect a sample IoT Plug and Play Preview device application (C)](quickstart-connect-device-c.md) quickstart.

Use the following command to run the sample device:

``` cmd/sh
azure-iot-sdk-c\cmake\digitaltwin_client\samples\digitaltwin_sample_device\Debug\digitaltwin_sample_device.exe <YourDeviceConnectionString>
```

Leave the sample code running and use Azure IoT Explorer to verify that it connected to your IoT hub. In Azure IoT Explorer:

1. Open the IoT hub you created for this tutorial.
1. In the device list, select the device you created for this tutorial.
1. Navigate to the **IoT Plug and Play components** tab.

    > [!TIP]
    > Azure IoT Explorer can't display the private component and its properties, commands, and telemetry definitions. Copy the `SampleDevice.model.json` model file and the `EnvironmentalSensor.interface.json` interface file to a folder on your local machine. Then configure the Azure IoT Explorer tool to point to this folder.

1. Send commands such as **turnOn**, **turnOff**, and **blink**. The sample device shows messages similar to the following output:

    ```cmd/bash
    Info: DigitalTwin Client Core: Processing method callback for method $iotin:sensor*turnOff, payload=000001E15861FDE0, size=84
    Info: DigitalTwin Interface : Invoking callback to process command turnOff on interface name sensor
    Info: ENVIRONMENTAL_SENSOR_INTERFACE: Turn off light command invoked
    Info: ENVIRONMENTAL_SENSOR_INTERFACE: Turn off light data=<null>
    Info: DigitalTwin Interface: Callback to process command returned.  responseData=0000000000000000, responseLen=0, responseStatus=200
    Info: DigitalTwin Client Core: Processing telemetry callback.  confirmationResult=IOTHUB_CLIENT_CONFIRMATION_OK, userContextCallback=000001E1585FF0C0
    Info: DigitalTwin Interface: Invoking telemetry confirmation callback for component name=sensor, reportedStatus=DIGITALTWIN_CLIENT_OK, userContextCallback=0000000000000000
    ```

## Interact with sample device from code

To use the Node Service SDK to interact with sample device, navigate to the service node sample code in the `azure-iot-sdk-node\digitaltwins\samples\service\javascript` folder:

1. Run the `get_digital_twin.js` script to find the device model ID:

    ```cmd/bash
    npm install
    node get_digital_twin.js
    ```

    You see output similar to:

    ```text
    getting digital twin for device EM_Device01...
    device metadata:
    {
      "$model": "dtmi:com:example:SampleDevice;1"
    }
    ```

1. Run the `invoke_component_command.js` to call the `turnOn` command:

    ```cmd/bash
    node invoke_component_command.js
    ```

    You see output similar to:

    ```text
    invoking command turnOn on component instancesensor for device EM_Device01...
    null
    ```

    The sample device shows output similar to the output shown when you used the Azure IoT Explorer.

For more information, see the [Interact with an IoT Plug and Play Preview device that's connected to your solution](./quickstart-service-python.md) quickstart.

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how Azure IoT Plug and Play, see:

> [!div class="nextstepaction"]
> [Architecture](concepts-architecture.md)
