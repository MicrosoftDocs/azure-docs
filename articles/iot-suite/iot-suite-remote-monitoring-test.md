---
title: Device simulation in remote monitoring solution - Azure | Microsoft Docs
description: This tutorial shows you how to use the device simulator with the remote monitoring preconfigured solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 09/07/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Test your solution with simulated devices

Contoso wants to test a new smart lightbulb device. To perform the tests, you create a new simulated device with the following characteristics:

*Properties*

| Name                     | Values                      |
| ------------------------ | --------------------------- |
| Color                    | White, Red, Blue            |
| Brightness               | 0 to 100                    |
| Estimated remaining life | Countdown from 10,000 hours |

*Telemetry*

| Name   | Values      |
| ------ | ----------- |
| Status | 1=On, 0=Off |

*Methods*

| Name        |
| ----------- |
| Turn on-off |

*Behavior*

| Name                     | Values |
| ------------------------ | -------|
| Initial color            | White  |
| Initial brightness       | 75     |
| Initial remaining life   | 10,000 |
| Initial telemetry status | 1      |
| Always on                | 1      |

This tutorial shows you how to use the device simulator with the remote monitoring preconfigured solution:

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Create a new device type
> * Simulate custom device behavior
> * Add a new device type to the dashboard
> * Send custom telemetry from an existing device type

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

<!-- Dominic please this use as your reference https://github.com/Azure/device-simulation-dotnet/wiki/Device-Models -->

## The device simulation service

The device simulation service in the preconfigured solution enables you to make changes to the built-in device types and create new device types. You can use custom device types to test the behavior of the remote monitoring solution before you connect your physical devices to the solution.

<!-- Provide detailed steps here -->

## Create a simulated device type

The easiest way to create a new device type in the simulation microservice is to copy and modify an existing type. The following steps show you how to copy the built-in **Chiller** device to create a new **Lightbulb** device:

1. Use the following command to clone the **device-simulation** GitHub repository to your local machine:

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet.git
    ```

1. Each device type has a JSON model file and associated scripts in the `data/devicemodels` folder. Copy the **Chiller** files to create the **Lightbulb** files as shown in the following table:

    | Source                      | Destination                   |
    | --------------------------- | ----------------------------- |
    | chiller-01.json             | lightbulb-01.json             |
    | scripts/chiller-01-state.js | scripts/lightbulb-01-state.js |

### Define the characteristics of the new device type

The `lightbulb-01.json` file defines the characteristics of the type, such as the telemetry it generates and the methods it supports. The following steps update the `lightbulb-01.json` file to define the **Lightbulb** device:

1. In the `lightbulb-01.json` file, update the device metadata as shown in the following snippet:

    ```json
    "SchemaVersion": "1.0.0",
    "Id": "lightbulb-01",
    "Version": "0.0.1",
    "Name": "Lightbulb",
    "Description": "Smart lightbulb device.",
    "Protocol": "MQTT",
    ```
    <!-- TODO update the above snippet -->

1. In the `lightbulb-01.json` file, update the simulation definition as shown in the following snippet:

    ```json
    "Simulation": {
      "InitialState": {
        "online": true,
        "status": 1
      },
      "Script": {
        "Type": "javascript",
        "Path": "lightbulb-01-state.js",
        "Interval": "00:00:20"
      }
    },
    ```
    <!-- TODO update the above snippet -->

1. In the `lightbulb-01.json` file, update the device type properties as shown in the following snippet:

    ```json
    "Properties": {
      "Type": "Lightbulb",
      "Color": "White",
      "Brightness": 75,
      "EstimatedRemainingLife": 10000
    },
    ```
    <!-- TODO update the above snippet -->

1. In the `lightbulb-01.json` file, update the device type telemetry definitions as shown in the following snippet:

    ```json
    "Telemetry": [
      {
        "Interval": "00:00:15",
        "MessageTemplate": "{\"status\":${status},\"}",
        "MessageSchema": {
          "Name": "lightbulb-statuse;v1",
          "Format": "JSON",
          "Fields": {
            "status": "integer"
          }
        }
      }
    ],
    ```
    <!-- TODO update the above snippet -->

1. In the `lightbulb-01.json` file, update the device type methods as shown in the following snippet:

    ```json
    "CloudToDeviceMethods": {
      "Toggle": {
        "Type": "javascript",
        "Path": "TBD.js"
      }
    }
    ```
    <!-- TODO update the above snippet -->

1. Save the `lightbulb-01.json` file.

### Simulate custom device behavior

The `scripts/scripts/lightbulb-01-state.js` file defines the simulated behavior of the type. The following steps update the `scripts/scripts/lightbulb-01-state.js` file to define the behavior of the **Lightbulb** device:

1. Edit the state definition in the `scripts/scripts/lightbulb-01-state.js` file as shown in the following snippet:

    ```js
    // Default state
    var state = {
        online: true,
        status: 1,
        color: White,
        brightness: 75,
        remaining_life: 10000
    };
    ```

1. Edit the **main** function to implement the behavior as shown in the following snippet:

    ```js
    function main(context, previousState) {

        // Restore the global state before generating the new telemetry, so that
        // the telemetry can apply changes using the previous function state.
        restoreState(previousState);

        // TODO - Make this flip every so often
        state.status = 1;

        // 75 +/- 5%,  Min 25, Max 100
        state.brightness = vary(75, 5, 0, 100);

        // TODO - modify this to change color.
        state.color = "White";

        // TODO - fix the countdown!
        state.remaining_life = state.remaining_life--;

        return state;
    }
    ```
    <!-- TODO update the above snippet -->

1. Save the `scripts/scripts/lightbulb-01-state.js` file.

### Test the Lightbulb device type

To test the **Lightbulb** device type, you:

1. Update the **device-simulation** service to include the new model.
1. Create one or more instances of the new simulated device type.

The following steps describe how to add new simulated instances to the solution:

<!-- What will be the recomended way to do this when the REST API exists? Postman, Node.js script, other? -->

## Create a physical device type

To define a new physical device type, you upload a model definition to the **Devices** page in the solution.

<!-- TODO Expand on this -->

## Add a new telemetry type

This section describes how to modify an existing simulated device type to support a new telemetry type.

### Locate the Chiller device type files

The following steps show you how to find the files that define the built-in **Chiller** device:

1. If you have not already done so, use the following command to clone the **device-simulation** GitHub repository to your local machine:

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet.git
    ```

1. Each device type has a JSON model file and associated scripts in the `data/devicemodels` folder. The files that define the simulated **Chiller** device type are:
    * `data/devicemodels/chiller-01.json`
    * `data/devicemodels/scripts/chiller-01-state.js`

### Specify the new telemetry type

The following steps show you how to add a new **Internal Temperature** type to the **Chiller** device type:

1. Open the `chiller-01.json` file.

1. In the **InitialState** section, add the follwing two definitions:

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

1. Save the `chiller-01.json` file.

1. Open the `scripts/chiller-01-state.js` file.

1. Add the following fields to the **state** variable:

    ```js
    internal_temperature: 65.0,
    internal_temperature_unit: "F",
    ```

1. Add the following line to the **main** function:

    ```js
    state.internal_temperature = vary(65, 2, 15, 125);
    ```

1. Save the `scripts/chiller-01-state.js` file.

### Test the Chiller device type

To test the updated **Chiller** device type, you:

1. Update the **device-simulation** service with the updated model.
1. Create one or more instances of the new simulated device type.

The following steps describe how to add new simulated instances to the solution:

<!-- What will be the recomended way to do this when the REST API exists? Postman, Node.js script, other? -->

## Next steps

This tutorial, showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Create a new device type
> * Simulate custom device behavior
> * Add a new device type to the dashboard
> * Send custom telemetry from an existing device type

Now you have learned how to use the device simulation service, the suggested next step is to learn how to [connect a physical device to your remote monitoring solution](iot-suite-connecting-devices-node.md).

<!-- Next tutorials in the sequence -->