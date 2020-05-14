---
title: Create an end to end application  with an IoT Plug and Play Preview | Microsoft Docs
description: Use C to create a SampleDevice implementing 3 Interfaces and connect it to an Azure IoT Hub.Use Node.js and Service SDK to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: ericmitt
ms.author: ericmitt
ms.date: 05/13/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Develop and end to end solution with an IoT Plug and Play Preview device

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This tutorial shows you how to use a sample Plug and Play Preview device written in C and interact with it with the Node service SDK.

## Prerequisites 
** For the 5/13 BugBash**
1. Create an IoT Hub in Central US region, with the **IOTPNP_TEST_BY_MAIN** subscription. Create the IoT Hub under this subscription, within the resource group **BugBash** in the supported region: **Central US** 

1. Install Azure IoT Explorer [see this article to get the latest](howto-install-iot-explorer.md)

1. Install and build the C SDK Plug and Play preview with the samples [see this article to build the SDK withthe samples](Quickstart-connect-device-C.md)

1. Install the Node service SDK [see this article for installing the right package for the bugbash](quikstart-service-node.md)

## The device and the models
Our device declares its own model definition in the json file azure-iot-sdk-c\digitaltwin_client\samples\SampleDevice.model.json:
``` json
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
As declared in this model, the sample device  implements 3 Plug and Play Interfaces:
1. DeviceInfo ("schema": "dtmi:azure:DeviceManagement:DeviceInformation;1")
1. SDKInfo ("schema": "dtmi:azure:Client:SDKInformation;1")
1. EnvironmentalSensor ("schema": "dtmi:com:example:EnvironmentalSensor;1")

The first two, are public interfaces and are published in the global repository:
https://devicemodels.azureiotsolutions.com/models/public

1. See definition of [DeviceInfo](https://devicemodels.azureiotsolutions.com/models/public/dtmi:azure:DeviceManagement:DeviceInformation;1?codeView=true)
1. See definition for [SDKInfo](https://devicemodels.azureiotsolutions.com/models/public/dtmi:azure:Client:SDKInformation;1?codeView=true)

The third one, the EnvironmentalSensor interface, is [defined in the C solution sample](https://github.com/Azure/azure-iot-sdk-c/blob/public-preview-pnp/digitaltwin_client/samples/digitaltwin_sample_environmental_sensor/EnvironmentalSensor.interface.json) as follow:

``` json
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

## Implementing the device in C
Navigate to the C Sample (azure-iot-sdk-c\digitaltwin_client\samples), explore the 3 interfaces code and the sample code itself:
1. digitaltwin_sample_device_info
1. digitaltwin_sample_sdk_info
1. digitaltwin_sample_environmental_sensor
1. digitaltwin_sample_device.
See in the [quickstart C more explanation of the code structure](quickstart-connect-device-c.md)

Once built, run the sample with:

``` cmd/sh
azure-iot-sdk-c\cmake\digitaltwin_client\samples\digitaltwin_sample_device\Debug\digitaltwin_sample_device.exe <YourDeviceConnectionString>
```

Keep this sample running and observe the device via the Azure IoT Explorer.
1. Open the IoTHub you created for this tutorial. 
1. On the device list, select the device you created for this tutorial.
1. Looks the different tabs, and focus on the last one: **IoT Plug and Play components**

 [!TIP] The explorer is not able to display the private component and its properties, commands etc, you need to copy the two models in a folder on your machine (private repo) and point the IoT Explorer to this folder. (Sample_Device.json and EnvironmentalSensor.interface.json should be present in the folder).

Try send command like:turnOn, turnOff and blink, you should see the running device sample reacting like:

```cmd/bash
Info: DigitalTwin Client Core: Processing method callback for method $iotin:sensor*turnOff, payload=000001E15861FDE0, size=84
Info: DigitalTwin Interface : Invoking callback to process command turnOff on interface name sensor
Info: ENVIRONMENTAL_SENSOR_INTERFACE: Turn off light command invoked
Info: ENVIRONMENTAL_SENSOR_INTERFACE: Turn off light data=<null>
Info: DigitalTwin Interface: Callback to process command returned.  responseData=0000000000000000, responseLen=0, responseStatus=200
Info: DigitalTwin Client Core: Processing telemetry callback.  confirmationResult=IOTHUB_CLIENT_CONFIRMATION_OK, userContextCallback=000001E1585FF0C0
Info: DigitalTwin Interface: Invoking telemetry confirmation callback for component name=sensor, reportedStatus=DIGITALTWIN_CLIENT_OK, userContextCallback=0000000000000000
``` 
## Interacting with Node Service SDK
Navigate to the service node sample: azure-iot-sdk-node\digitaltwins\samples\service\javascript
run the get_digital_twin.js script, you should see the device reacting like 

```cmd/bash
...azure-iot-sdk-node\digitaltwins\samples\service>node get_digital_twin.js
getting digital twin for device EM_Device01...
device metadata:
{
  "$model": "dtmi:com:example:SampleDevice;1"
}
```
run the  invoke_component_command.js (edit the code to change the command, by default it is the command turnOn)

```cmd/bash
azure-iot-sdk-node\digitaltwins\samples\service\javascript>node invoke_component_command.js
invoking command turnOn on component instancesensor for device EM_Device01...
null
```
You should see the device reacting to the command as previously.

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]
