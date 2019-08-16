---
title: Device simulation with IoT remote monitoring - Azure | Microsoft Docs
description: This how-to guide shows you how to use the device simulator with the remote monitoring solution accelerator.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 03/08/2019
ms.topic: conceptual

# As a developer, I want to know how to create and test a new simulated device before I deploy it to the cloud.
---

# Create and test a new simulated device

The Remote Monitoring solution accelerator lets you define your own simulated devices. This article shows you how to define a new simulated lightbulb device and then test it locally. The solution accelerator includes simulated devices such as chillers and trucks. However, you can define your own simulated devices to test your IoT solutions before you deploy real devices.

> [!NOTE]
> This article describes how to use simulated devices hosted in the device simulation service. If you want to create a real device, see [Connect your device to the Remote Monitoring solution accelerator](iot-accelerators-connecting-devices.md).

This how-to guide shows you how to customize the device simulation microservice. This microservice is part of the Remote Monitoring solution accelerator. To show the device simulation capabilities, this how-to guide uses two scenarios in the Contoso IoT application:

In the first scenario, you add a new telemetry type to Contoso's existing **Chiller** device type.

In the second scenario, Contoso wants to test a new smart lightbulb device. To run the tests, you create a new simulated device with the following characteristics:

*Properties*

| Name                     | Values                      |
| ------------------------ | --------------------------- |
| Color                    | White, Red, Blue            |
| Brightness               | 0 to 100                    |
| Estimated remaining life | Countdown from 10,000 hours |

*Telemetry*

The following table shows the data the lightbulb reports to the cloud as a data stream:

| Name   | Values      |
| ------ | ----------- |
| Status | "on", "off" |
| Temperature | Degrees F |
| online | true, false |

> [!NOTE]
> The **online** telemetry value is mandatory for all simulated types.

*Methods*

The following table shows the actions the new device supports:

| Name        |
| ----------- |
| Switch on   |
| Switch off  |

*Initial state*

The following table shows the initial status of the device:

| Name                     | Values |
| ------------------------ | -------|
| Initial color            | White  |
| Initial brightness       | 75     |
| Initial remaining life   | 10,000 |
| Initial telemetry status | "on"   |
| Initial telemetry temperature | 200   |

To complete the steps in this how-to guide, you need an active Azure subscription.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To follow this how-to guide, you need:

* Visual Studio Code. You can [download Visual Studio Code for Mac, Linux, and Windows](https://code.visualstudio.com/download).
* .NET Core. You can download [.NET Core for Mac, Linux, and Windows](https://www.microsoft.com/net/download).
* [C# for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)
* Postman. You can download [Postman for Mac, Windows, or Linux](https://www.getpostman.com/apps).
* An [IoT hub deployed to your Azure subscription](../../articles/iot-hub/iot-hub-create-through-portal.md). You need the IoT hub's connection string to complete the steps in this guide. You can get the connection string from the Azure portal.
* A Cosmos DB database that uses the SQL API and that is configured for [strong consistency](../../articles/cosmos-db/how-to-manage-database-account.md). You need the Cosmos DB database's connection string to complete the steps in this guide. You can get the connection string from the Azure portal.

## Prepare your development environment

Complete the following tasks to prepare your development environment:

* Download the source for the device simulation microservice.
* Download the source for the storage adapter microservice.
* Run the storage adapter microservice locally.

The instructions in this article assume you're using Windows. If you're using another operating system, you may need to adjust some of the file paths and commands to suit your environment.

### Download the microservices

Download and unzip the [remote monitoring microservices](https://github.com/Azure/remote-monitoring-services-dotnet/archive/master.zip) from GitHub to a suitable location on your local machine. The article assumes the name of this folder is **remote-monitoring-services-dotnet-master**.

Download and unzip the [device simulation microservice](https://github.com/Azure/device-simulation-dotnet/archive/master.zip) from GitHub to a suitable location on your local machine. The article assumes the name of this folder is **device-simulation-dotnet-master**.

### Run the storage adapter microservice

Open the **remote-monitoring-services-dotnet-master\storage-adapter** folder in Visual Studio Code. Click any **Restore** buttons to fix any unresolved dependencies.

Open the **storage-adapter/WebService/appsettings.ini** file and assign your Cosmos DB connection string to the **documentDBConnectionString**  variable.

To run the microservice locally, click **Debug > Start Debugging**.

The **Terminal** window in Visual Studio Code shows output from the running microservice including a URL for the web service health check: [http://127.0.0.1:9022/v1/status](http://127.0.0.1:9022/v1/status). When you navigate to this address, the status should be "OK: Alive and well".

Leave the storage adapter microservice running in this instance of Visual Studio Code while you complete the next steps.

## Modify the chiller

In this section, you add a new **Internal Temperature** telemetry type to the existing **Chiller** device type:

1. Create a new folder **C:\temp\devicemodels** on your local machine.

1. Copy the following files to your new folder from the downloaded copy of the device simulation microservice:

    | Source | Destination |
    | ------ | ----------- |
    | Services\data\devicemodels\chiller-01.json | C:\temp\devicemodels\chiller-01.json |
    | Services\data\devicemodels\scripts\chiller-01-state.js | C:\temp\devicemodels\scripts\chiller-01-state.js |
    | Services\data\devicemodels\scripts\Reboot-method.js | C:\temp\devicemodels\scripts\Reboot-method.js |
    | Services\data\devicemodels\scripts\FirmwareUpdate-method.js | C:\temp\devicemodels\scripts\FirmwareUpdate-method.js |
    | Services\data\devicemodels\scripts\EmergencyValveRelease-method.js | C:\temp\devicemodels\scripts\EmergencyValveRelease-method.js |
    | Services\data\devicemodels\scripts\IncreasePressure-method.js | C:\temp\devicemodels\scripts\IncreasePressure-method.js |

1. Open the **C:\temp\devicemodels\chiller-01.json** file.

1. In the **InitialState** section, add the following two definitions:

    ```json
    "internal_temperature": 65.0,
    "internal_temperature_unit": "F",
    ```

1. In the **Telemetry** array, add the following definition:

    ```json
    {
      "Interval": "00:00:05",
      "MessageTemplate": "{\"internal_temperature\":${internal_temperature},\"internal_temperature_unit\":\"${internal_temperature_unit}\"}",
      "MessageSchema": {
        "Name": "chiller-internal-temperature;v1",
        "Format": "JSON",
        "Fields": {
          "temperature": "double",
          "temperature_unit": "text"
        }
      }
    },
    ```

1. Save the **C:\temp\devicemodels\chiller-01.json** file.

1. Open the **C:\temp\devicemodels\scripts\chiller-01-state.js** file.

1. Add the following fields to the **state** variable:

    ```js
    internal_temperature: 65.0,
    internal_temperature_unit: "F",
    ```

1. Update the **main** function as follows:

    ```js
    function main(context, previousState, previousProperties) {

        // Restore the global state before generating the new telemetry, so that
        // the telemetry can apply changes using the previous function state.
        restoreSimulation(previousState, previousProperties);

        // 75F +/- 5%,  Min 25F, Max 100F
        state.temperature = vary(75, 5, 25, 100);

        // 70% +/- 5%,  Min 2%, Max 99%
        state.humidity = vary(70, 5, 2, 99);

        // 65F +/- 2%,  Min 15F, Max 125F
        state.internal_temperature = vary(65, 2, 15, 125);

        log("Simulation state: " + state.simulation_state);
        if (state.simulation_state === "high_pressure") {
            // 250 psig +/- 25%,  Min 50 psig, Max 300 psig
            state.pressure = vary(250, 25, 50, 300);
        } else {
            // 150 psig +/- 10%,  Min 50 psig, Max 300 psig
            state.pressure = vary(150, 10, 50, 300);
        }

        updateState(state);
        return state;
    }
    ```

1. Save the **C:\temp\devicemodels\scripts\chiller-01-state.js** file.

## Create the lightbulb

In this section, you define a new **Lightbulb** device type:

1. Create a file **C:\temp\devicemodels\lightbulb-01.json** and add the following content:

    ```json
    {
      "SchemaVersion": "1.0.0",
      "Id": "lightbulb-01",
      "Version": "0.0.1",
      "Name": "Lightbulb",
      "Description": "Smart lightbulb device.",
      "Protocol": "MQTT",
      "Simulation": {
        "InitialState": {
          "online": true,
          "temperature": 200.0,
          "temperature_unit": "F",
          "status": "on"
        },
        "Interval": "00:00:20",
        "Scripts": [
          {
            "Type": "javascript",
            "Path": "lightbulb-01-state.js"
          }
        ]
      },
      "Properties": {
        "Type": "Lightbulb",
        "Color": "White",
        "Brightness": 75,
        "EstimatedRemainingLife": 10000
      },
      "Tags": {
        "Location": "Building 2",
        "Floor": "2",
        "Campus": "Redmond"
      },
      "Telemetry": [
        {
          "Interval": "00:00:20",
          "MessageTemplate": "{\"temperature\":${temperature},\"temperature_unit\":\"${temperature_unit}\",\"status\":\"${status}\"}",
          "MessageSchema": {
            "Name": "lightbulb-status;v1",
            "Format": "JSON",
            "Fields": {
              "temperature": "double",
              "temperature_unit": "text",
              "status": "text"
            }
          }
        }
      ],
      "CloudToDeviceMethods": {
        "SwitchOn": {
          "Type": "javascript",
          "Path": "SwitchOn-method.js"
        },
        "SwitchOff": {
          "Type": "javascript",
          "Path": "SwitchOff-method.js"
        }
      }
    }
    ```

    Save the changes to **C:\temp\devicemodels\lightbulb-01.json**.

1. Create a file **C:\temp\devicemodels\scripts\lightbulb-01-state.js** and add the following content:

    ```javascript
    "use strict";

    // Default state
    var state = {
      online: true,
      temperature: 200.0,
      temperature_unit: "F",
      status: "on"
    };

    // Default device properties
    var properties = {};

    /**
     * Restore the global state using data from the previous iteration.
     *
     * @param previousState device state from the previous iteration
     * @param previousProperties device properties from the previous iteration
     */
    function restoreSimulation(previousState, previousProperties) {
      // If the previous state is null, force a default state
      if (previousState) {
        state = previousState;
      } else {
        log("Using default state");
      }

      if (previousProperties) {
        properties = previousProperties;
      } else {
        log("Using default properties");
      }
    }

    /**
     * Simple formula generating a random value around the average
     * in between min and max
     *
     * @returns random value with given parameters
     */
    function vary(avg, percentage, min, max) {
      var value = avg * (1 + ((percentage / 100) * (2 * Math.random() - 1)));
      value = Math.max(value, min);
      value = Math.min(value, max);
      return value;
    }

    /**
     * Simple formula that sometimes flips the status of the lightbulb
     */
    function flip(value) {
      if (Math.random() < 0.2) {
        return (value == "on") ? "off" : "on"
      }
      return value;
    }

    /**
     * Entry point function called by the simulation engine.
     * Returns updated simulation state.
     * Device property updates must call updateProperties() to persist.
     *
     * @param context             The context contains current time, device model and id
     * @param previousState       The device state since the last iteration
     * @param previousProperties  The device properties since the last iteration
     */
    function main(context, previousState, previousProperties) {

      // Restore the global device properties and the global state before
      // generating the new telemetry, so that the telemetry can apply changes
      // using the previous function state.
      restoreSimulation(previousState, previousProperties);

      state.temperature = vary(200, 5, 150, 250);

      // Make this flip every so often
      state.status = flip(state.status);

      updateState(state);

      return state;
    }
    ```

    Save the changes to **C:\temp\devicemodels\scripts\lightbulb-01-state.js**.

1. Create a file **C:\temp\devicemodels\scripts\SwitchOn-method.js** and add the following content:

    ```javascript
    "use strict";

    // Default state
    var state = {
      status: "on"
    };

    /**
     * Entry point function called by the method.
     *
     * @param context        The context contains current time, device model and id
     * @param previousState  The device state since the last iteration
     * @param previousProperties  The device properties since the last iteration
     */
    function main(context, previousState) {
      log("Executing lightbulb Switch On method.");
      state.status = "on";
      updateState(state);
    }
    ```

    Save the changes to **C:\temp\devicemodels\scripts\SwitchOn-method.js**.

1. Create a file **C:\temp\devicemodels\scripts\SwitchOff-method.js** and add the following content:

    ```javascript
    "use strict";

    // Default state
    var state = {
      status: "on"
    };

    /**
     * Entry point function called by the method.
     *
     * @param context        The context contains current time, device model and id
     * @param previousState  The device state since the last iteration
     * @param previousProperties  The device properties since the last iteration
     */
    function main(context, previousState) {
      log("Executing lightbulb Switch Off method.");
      state.status = "off";
      updateState(state);
    }
    ```

    Save the changes to **C:\temp\devicemodels\scripts\SwitchOff-method.js**.

You've now created a customized version of the **Chiller** device type and created a new **Lightbulb** device type.

## Test the devices

In this section, you test the device types you created in the previous sections locally.

### Run the device simulation microservice

Open the **device-simulation-dotnet-master** folder you downloaded from GitHub in a new instance of Visual Studio Code. Click any **Restore** buttons to fix any unresolved dependencies.

Open the **WebService/appsettings.ini** file and assign your Cosmos DB connection string to the **documentdb_connstring** variable and also modify the settings as follows:

```ini
device_models_folder = C:\temp\devicemodels\

device_models_scripts_folder = C:\temp\devicemodels\scripts\
```

To run the microservice locally, click **Debug > Start Debugging**.

The **Terminal** window in Visual Studio Code shows output from the running microservice.

Leave the device simulation microservice running in this instance of Visual Studio Code while you complete the next steps.

### Set up a monitor for device events

In this section, you use the Azure CLI to set up an event monitor to view the telemetry sent from the devices connected to your IoT hub.

The following script assumes that the name of your IoT hub is **device-simulation-test**.

```azurecli-interactive
# Install the IoT extension if it's not already installed
az extension add --name azure-cli-iot-ext

# Monitor telemetry sent to your hub
az iot hub monitor-events --hub-name device-simulation-test
```

Leave the event monitor running while you test the simulated devices.

### Create a simulation with the updated chiller device type

In this section, you use the Postman tool to request the device simulation microservice to run a simulation using the updated chiller device type. Postman is a tool that lets you send REST requests to a web service. The Postman configuration files you need are in your local copy of the **device-simulation-dotnet** repository.

To set up Postman:

1. Open Postman on your local machine.

1. Click **File > Import**. Then click **Choose Files**.

1. Navigate to the **device-simulation-dotnet-master/docs/postman** folder. Select **Azure IoT Device Simulation solution accelerator.postman_collection** and **Azure IoT Device Simulation solution accelerator.postman_environment** and click **Open**.

1. Expand the **Azure IoT Device Simulation solution accelerator** to the requests you can send.

1. Click **No Environment** and select **Azure IoT Device Simulation solution accelerator**.

You now have a collection and environment loaded in your Postman workspace that you can use to interact with the device simulation microservice.

To configure and run the simulation:

1. In the Postman collection, select **Create modified chiller simulation** and click **Send**. This request creates four instances of the simulated chiller device type.

1. The event monitor output in the Azure CLI window shows the telemetry from the simulated devices, including the new **internal_temperature** values.

To stop the simulation, select the **Stop simulation** request in Postman and click **Send**.

### Create a simulation with the lightbulb device type

In this section, you use the Postman tool to request the device simulation microservice to run a simulation using the lightbulb device type. Postman is a tool that lets you send REST requests to a web service.

To configure and run the simulation:

1. In the Postman collection, select **Create lightbulb simulation** and click **Send**. This request creates two instances of the simulated lightbulb device type.

1. The event monitor output in the Azure CLI window shows the telemetry from the simulated lightbulbs.

To stop the simulation, select the **Stop simulation** request in Postman and click **Send**.

## Clean up resources

You can stop the two locally running microservices in their Visual Studio Code instances (**Debug > Stop Debugging**).

If you no longer require the IoT Hub and Cosmos DB instances, delete them from your Azure subscription to avoid any unnecessary charges.

## Next steps

This guide showed you how to create a custom simulated device types and test them by running the device simulation microservice locally.

The suggested next step is to learn how to deploy your custom simulated device types to the [Remote Monitoring solution accelerator](iot-accelerators-remote-monitoring-deploy-simulated-device.md).
