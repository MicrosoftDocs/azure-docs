---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution | Microsoft Docs
description: Use Node.js to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: dominicbetts
ms.author: dobett
ms.date: 03/17/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Interact with an IoT Plug and Play Preview device that's connected to your solution

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This how-to guide shows you how to use the samples in the Node service SDK that show you how your IoT Solution can interact with IoT Plug and Play Preview devices.

## Prerequisites

To complete the steps in this article, you need Node.js on your development machine. You can download the latest recommended version for multiple platforms from [nodejs.org](https://nodejs.org). The steps in this article assume that you're using a Windows development machine, but you can run the Node.js apps on other platforms.

You can verify the current version of Node.js on your development machine using the following command:

```cmd
node --version
```

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub. You use this value later in this article:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Run the sample device

In this article, you use a sample environmental sensor written in Node.js to simulate the IoT Plug and Play device. The following instructions show you how to install and run the device:

1. Open a local command-prompt window and navigate to a folder of your choice. Execute the following command to clone the [Azure IoT Samples for Node.js](https://github.com/azure-samples/azure-iot-samples-node) GitHub repository into this location:

    ```cmd
    git clone https://github.com/azure-samples/azure-iot-samples-node
    ```

1. This terminal window is your _device_ terminal. Navigate to the **/azure-iot-samples-node/digital-twins/Quickstarts/Device** folder in the cloned repository. Install all the dependencies by running the following command:

    ```cmd
    npm install
    ```

1. Configure the _device connection string_:

    ```cmd
    set DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
    ```

1. Run the sample app with the following command:

    ```cmd
    node sample_device.js
    ```

1. The terminal displays messages saying that the device has sent some information and reported itself online. These messages indicate that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this terminal, you need it later to confirm the service sample is working.

## Run the sample solution

In this article, you use a sample IoT solution written in Node.js to interact with the sample device.

1. Open another local command-prompt window to use as your _service_ terminal. Navigate to the **/azure-iot-samples-node/digital-twins/Quickstarts/Service** folder in the cloned repository.

1. Install all the dependencies by running the following command:

    ```cmd
    npm install
    ```

1. Configure the _IoT hub connection string_ to allow the service to connect to it:

    ```cmd
    set IOTHUB_CONNECTION_STRING=<YourIoTHubConnectionString>
    ```

    > [!NOTE]
    > The device connection string and IoT Hub connection string are different.

### Read a property

1. When you connected the _device_ in its terminal, you saw the following message indicating its online status:

    ```cmd
    reported state property as online
    ```

1. In the **/azure-iot-samples-node/digital-twins/Quickstarts/Service** folder, open the file **get_digital_twin.js** in a text editor. Replace the `<DEVICE_ID_GOES_HERE>` placeholder with your device ID and save the file.

1. Go to the _service_ terminal and use the following command to run the sample that reads device information:

    ```cmd
    node get_digital_twin.js
    ```

1. In the _service_ terminal output, scroll to the `environmentalSensor` component. The `state` property is reported as _online_:

    ```JSON
    "environmentalSensor": {
      "name": "environmentalSensor",
      "properties": {
        "state": {
          "reported": {
            "value": "online"
          }
        }
      }
    }
    ```

### Update a writable property

1. Open the file **update_digital_twin_property.js**.

1. At the beginning of the file, there's a set of constants defined with uppercase placeholders. Replace the `<DEVICE_ID_GOES_HERE>` placeholder with your device ID, update the remaining constants with the following values, and save the file:

    ```javascript
    const interfaceInstanceName = 'environmentalSensor';
    const propertyName = 'brightness';
    const propertyValue = 42;
    ```

1. Go to the _service_ terminal and use the following command to run the sample that updates the property:

    ```cmd
    node update_digital_twin_property.js
    ```

1. The _service_ terminal output shows the updated device information sent to the device. Scroll to the `environmentalSensor` component to see the new brightness value of 42.

    ```json
    "environmentalSensor": {
      "name": "environmentalSensor",
      "properties": {
        "brightness": {
          "desired": {
            "value": "42"
          }
        },
        "state": {
          "reported": {
            "value": "online"
          }
        }
      }
    }
    ```

1. In your _device_ terminal, you can see the device has received the update:

    ```cmd
    Received an update for brightness: 42
    updated the property
    ```

1. Go back to your _service_ terminal and run the following command to get the device information again:

    ```cmd
    node get_digital_twin.js
    ```

1. In the _service_ terminal output, under the `environmentalSensor` component, you see the device has reported the updated brightness value. It might take a while for the device to finish the update - you can repeat the previous step until the device has processed the property update:

    ```json
    "environmentalSensor": {
      "name": "environmentalSensor",
      "properties": {
        "brightness": {
          "reported": {
            "value": "42",
            "desiredState": {
              "code": 200,
              "version": 2,
              "description": "helpful descriptive text"
            }
          },
          "desired": {
            "value": "42"
          }
        },
        "state": {
          "reported": {
            "value": "online"
          }
        }
      }
    }
    ```

### Invoke a command

1. Open the file **invoke_command.js** in a text editor.

1. At the beginning of the file, replace the `<DEVICE_ID_GOES_HERE>` placeholder with your device ID. Update the remaining constants with the following values, and then save the file:

    ```javascript
    const interfaceInstanceName = 'environmentalSensor';
    const commandName = 'blink';
    const commandArgument = '<For the environmental sensor, this value does not matter. Any string will do.>'; 
    ```

1. Go to the _service_ terminal. Use the following command to run the sample that invokes the command:

    ```cmd
    node invoke_command.js
    ```

1. Output in the _service_ terminal shows the following confirmation:

    ```cmd
    invoking command blink on interface instanceenvironmentalSensor for device <device ID>...
    {
      "result": "helpful response text",
      "statusCode": 200,
      "requestId": "<some ID value>",
      "_response": "helpful response text"
    }
    ```

1. Go to the _device_ terminal, you see the command has been acknowledged:

    ```cmd
    received command: blink for interfaceInstance: environmentalSensor
    acknowledgement succeeded.
    ```

## Description of service samples

The previous sections show you how to run a selection of the service samples. The following sections list all the samples in the **digitaltwins/quickstarts/service** folder:

### Retrieve a digital twin and list the interfaces

**get_digital_twin.js** gets the digital twin associated with your device and prints its component in the command line. It doesn't require a running device sample to succeed.

**get_digital_twin_interface_instance.js** gets a single interface instance of digital twin associated with your device and prints it in the command line. It doesn't require the device sample to run.

### Get and set properties using the Node service SDK

**update_digital_twin.js** updates a writable property on your device digital twin using a full patch. You can update multiple properties on multiple interfaces if you want to. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about updating a property the service sample printing an updated digital twin in the terminal.

### Send a command and retrieve the response using the Node service SDK

**invoke_command.js** invokes a synchronous command on your device digital twin. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about acknowledging a command, and the service client printing the result of the command in the terminal.

### Connect to the public repository and retrieve a model definition using the Node service SDK

Using the same instructions as for the service and device samples, you need to set the following environment variable:

`AZURE_IOT_MODEL_REPOSITORY_CONNECTION_STRING`

The connection string looks like the following example:

```text
HostName={repo host name};RepositoryId={repo ID};SharedAccessKeyName={repo key ID};SharedAccessKey={repo key secret}
```

After you've set these four environment variables, run the sample the same way you ran the other samples:

```cmd/sh
node model_repo.js
```

This sample downloads the **ModelDiscovery** interface and prints this model in the terminal.

### Creating digital twin routes

Your solution can receive notifications of digital twin change events. To subscribe to these notifications, use the [IoT Hub routing feature](../iot-hub/iot-hub-devguide-endpoints.md) to send the notifications to an endpoint such as blob storage, Event Hubs, or a Service Bus queue.

To create a digital twin route:

1. In the Azure portal, go to your IoT Hub resource.
1. Select **Message routing**.
1. On the **Routes** tab, select **Add**.
1. Enter a value in the **Name** field and choose an **Endpoint**. If you haven't configured an endpoint, select **Add endpoint**.
1. In the **Data source** drop-down, select **Digital Twin Change Events**.
1. Select **Save**.

The following JSON shows an example of a digital twin change event:

```json
{
  "interfaces": {
    "urn_azureiot_ModelDiscovery_DigitalTwin": {
      "name": "urn_azureiot_ModelDiscovery_DigitalTwin",
      "properties": {
        "modelInformation": {
          "reported": {
            "value": {
              "modelId": "urn:domain:capabilitymodel:TestCapability:1",
              "interfaces": {
                "MyInterfaceFoo": "urn:domain:interfaces:FooInterface:1",
                "urn_azureiot_ModelDiscovery_DigitalTwin": "urn:azureiot:ModelDiscovery:DigitalTwin:1"
              }
            }
          }
        }
      }
    },
    "MyInterfaceFoo": {
      "name": "MyInterfaceFoo",
      "properties": {
        "property_1": { "desired": { "value": "value_1" } },
        "property_2": {
          "desired": { "value": 20 },
          "reported": {
            "value": 10,
            "desiredState": {
              "code": 200,
              "version": 22,
              "subCode": 400,
              "description": ""
            }
          }
        },
        "property_3": { "reported": { "value": "value_3" } }
      }
    }
  },
  "version": 4
}
```

## Next steps

In this article, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see [How-to: Connect to and interact with a device](howto-develop-solution.md)
