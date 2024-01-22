---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

IoT Plug and Play simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This tutorial shows you how to use Node.js to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

To complete this tutorial, you need Node.js on your development machine. You can download the latest recommended version for multiple platforms from [nodejs.org](https://nodejs.org).

You can verify the current version of Node.js on your development machine using the following command:

```cmd/sh
node --version
```

### Clone the SDK repository with the sample code

Clone the samples from a [the Node SDK repository](https://github.com/Azure/azure-iot-sdk-node). Open a terminal window in a folder of your choice. Run the following command to clone the [Microsoft Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-node
```

## Run the sample device

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-node/tree/main/device/samples#iot-plug-and-play-device-samples).

In this tutorial, you use a sample thermostat device that's written in Node.js as the IoT Plug and Play device. To run the sample device:

1. Open a terminal window and navigate to the local folder that contains the Microsoft Azure IoT SDK for Node.js repository you cloned from GitHub.

1. This terminal window is used as your **device** terminal. Go to the folder of your cloned repository, and navigate to the */azure-iot-sdk-node/device/samples/javascript* folder. Install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

1. Run the sample thermostat device with the following command:

    ```cmd/sh
    node pnp_simple_thermostat.js
    ```

1. You see messages saying that the device has sent some information and reported itself online. These messages indicate that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this terminal, you need it to confirm the service sample is working.

## Run the sample solution

In [Set up your environment for the IoT Plug and Play quickstarts and tutorials](../articles/iot-develop/set-up-environment.md) you created two environment variables to configure the sample to connect to your IoT hub:

* **IOTHUB_CONNECTION_STRING**: the IoT hub connection string you made a note of previously.
* **IOTHUB_DEVICE_ID**: `"my-pnp-device"`.

In this tutorial, you use a sample Node.js IoT solution to interact with the sample device you just set up and ran.

1. Open another terminal window to use as your **service** terminal.

1. In the cloned Node SDK repository, navigate to the *azure-iot-sdk-node/service/samples/javascript* folder. Install all the dependencies by running the following command:

    ```cmd/sh
    npm install
    ```

### Read a property

1. When you ran the sample thermostat device in the **device** terminal, you saw the following messages indicating its online status:

    ```cmd/sh
    properties have been reported for component
    sending telemetry message 0...
    ```

1. Go to the **service** terminal and use the following command to run the sample for reading device information:

    ```cmd/sh
    node twin.js
    ```

1. In the **service** terminal output, notice the response of the device twin. You see the device's model ID and associated properties reported:

    ```json
    Model Id: dtmi:com:example:Thermostat;1
    {
      "deviceId": "my-pnp-device",
      "etag": "AAAAAAAAAAE=",
      "deviceEtag": "Njc3MDMxNDcy",
      "status": "enabled",
      "statusUpdateTime": "0001-01-01T00:00:00Z",
      "connectionState": "Connected",
      "lastActivityTime": "0001-01-01T00:00:00Z",
      "cloudToDeviceMessageCount": 0,
      "authenticationType": "sas",
      "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
      },
      "modelId": "dtmi:com:example:Thermostat;1",
      "version": 4,
      "properties": {
        "desired": {
          "$metadata": {
            "$lastUpdated": "2020-10-05T11:35:19.4574755Z"
          },
          "$version": 1
        },
        "reported": {
          "maxTempSinceLastReboot": 31.343640523762232,
          "serialNumber": "123abc",
          "$metadata": {
            "$lastUpdated": "2020-10-05T11:35:23.7339042Z",
            "maxTempSinceLastReboot": {
              "$lastUpdated": "2020-10-05T11:35:23.7339042Z"
            },
            "serialNumber": {
              "$lastUpdated": "2020-10-05T11:35:23.7339042Z"
            }
          },
          "$version": 3
        }
      },
      "capabilities": {
        "iotEdge": false
      },
      "tags": {}
    }
    ```

1. The following snippet shows the code in *twin.js* that retrieves the device twin's model ID:

    ```javascript
    var registry = Registry.fromConnectionString(connectionString);
    registry.getTwin(deviceId, function(err, twin) {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Model Id: ' + twin.modelId);
        //...
      }
      //...
    }
    ```

In this scenario, it outputs `Model Id: dtmi:com:example:Thermostat;1`.

> [!NOTE]
> These service samples use the **Registry** class from the **IoT Hub service client**. To learn more about the APIs, including the digital twins API, see the [service developer guide](../articles/iot-develop/concepts-developer-guide-service.md).

### Update a writable property

1. Open the file *twin.js* in a code editor.

1. Review the sample code, it shows you two ways to update the device twin. To use the first way, modify the `twinPatch` variable as follows:

    ```javascript
    var twinPatch = {
      tags: {
        city: "Redmond"
      },
      properties: {
        desired: {
          targetTemperature: 42
        }
      }
    };
    ```

    The `targetTemperature` property is defined as a writable property in the Thermostat device model.

1. In the **service** terminal, use the following command to run the sample for updating the property:

    ```cmd/sh
    node twin.js
    ```

1. In your **device** terminal, you see the device has received the update:

    ```cmd/sh
    The following properties will be updated for the default component:
    {
      targetTemperature: {
        value: 42,
        ac: 200,
        ad: 'Successfully executed patch for targetTemperature',
        av: 2
      }
    }
    updated the property
    ```

1. In your **service** terminal, run the following command to confirm the property is updated:

    ```cmd/sh
    node twin.js
    ```

1. In the **service** terminal output, in the `reported` properties section, you see the updated target temperature reported. It might take a while for the device to finish the update. Repeat this step until the device has processed the property update:

    ```json
    "reported": {
      //...
      "targetTemperature": {
        "value": 42,
        "ac": 200,
        "ad": "Successfully executed patch for targetTemperature",
        "av": 4
      },
      //...
    }
    ```

### Invoke a command

1. Open the file *device_method.js* and review the code.

1. Go to the **service** terminal. Use the following command to run the sample for invoking the command:

    ```cmd/sh
    set IOTHUB_METHOD_NAME=getMaxMinReport
    set IOTHUB_METHOD_PAYLOAD=commandpayload
    node device_method.js
    ```

1. Output in the **service** terminal shows the following confirmation:

    ```cmd/sh
    getMaxMinReport on my-pnp-device:
    {
      "status": 200,
      "payload": {
        "maxTemp": 23.460596940801928,
        "minTemp": 23.460596940801928,
        "avgTemp": 23.460596940801928,
        "endTime": "2020-10-05T12:48:08.562Z",
        "startTime": "2020-10-05T12:47:54.450Z"
      }
    }
    ```

1. In the **device** terminal, you see the command is acknowledged:

    ```cmd/sh
    MaxMinReport commandpayload
    Response to method 'getMaxMinReport' sent successfully.
    ```
