---
title: Simulated device behavior in remote monitoring solution - Azure | Microsoft Docs
description: This article describes how to use JavaScript to define the behavior of a simulated device in the remote monitoring solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 01/29/2018
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Implement the device model behavior

The article [Understand the device model schema](iot-suite-remote-monitoring-device-schema.md) described the schema that defines a simulated device model. That article referred to two types of JavaScript file that implement the behavior of a simulated device:

- **State** JavaScript files that run at fixed intervals to update the internal state of the device.
- **Method** JavaScript files that run when the solution invokes a method on the device.

In this article, you learn how to:

>[!div class="checklist"]
> * Control the state of a simulated device
> * Define how a simulated device reponds to a method call from the remote monitoring solution
> * Debug your scripts

## State behavior

The [Simulation](iot-suite-remote-monitoring-device-schema.md#simulation) section of the device model schema defines the internal state of a simulated device:

- `InitialState` defines initial values for all the properties of the device state object.
- `Script` identifies a JavaScript file that runs on a schedule to update the device state.

The following example shows the definition of the device state object for a simulated chiller device:

```json
"Simulation": {
  "InitialState": {
    "online": true,
    "temperature": 75.0,
    "temperature_unit": "F",
    "humidity": 70.0,
    "humidity_unit": "%",
    "pressure": 150.0,
    "pressure_unit": "psig",
    "simulation_state": "normal_pressure"
  },
  "Interval": "00:00:05",
  "Scripts": {
    "Type": "javascript",
    "Path": "chiller-01-state.js"
  }
}
```

The state of the simulated device, as defined in the `InitialState` section, is held in memory by the simulation service. The state information is passed as input to the `main` function defined in **chiller-01-state.js**. In this example, the simulation service runs the **chiller-01-state.js** file every five seconds. The script can modify the state of the simulated device.

The following shows the outline of a typical `main` function:

```javascript
function main(context, previousState) {

  // Use the previous device state to
  // generate the new device state
  // returned by the function.

  return state;
}
```

The `context` parameter has the following properties:

- `currentTime` as a string with format `yyyy-MM-dd'T'HH:mm:sszzz`
- `deviceId`, for example `Simulated.Chiller.123`
- `deviceModel`, for example `Chiller`

The `state` parameter contains the state of the device as maintained by the device simulation service. This value is the `state` object returned by the previous call to `main`.

The following example shows a typical implementation of the `main` method to handle the device state maintained by the simulation service:

```javascript
// Default state
var state = {
  online: true,
  temperature: 75.0,
  temperature_unit: "F",
  humidity: 70.0,
  humidity_unit: "%",
  pressure: 150.0,
  pressure_unit: "psig",
  simulation_state: "normal_pressure"
};

function restoreState(previousState) {
  // If the previous state is null, force a default state
  if (previousState !== undefined && previousState !== null) {
      state = previousState;
  } else {
      log("Using default state");
  }
}

function main(context, previousState) {

  restoreState(previousState);

  // Update state

  return state;
}
```

The following example shows how the `main` method can simulate telemetry values that vary over time:

```javascript
/**
 * Simple formula generating a random value
 * around the average and between min and max
 */
function vary(avg, percentage, min, max) {
  var value = avg * (1 + ((percentage / 100) * (2 * Math.random() - 1)));
  value = Math.max(value, min);
  value = Math.min(value, max);
  return value;
}


function main(context, previousState) {

    restoreState(previousState);

    // 75F +/- 5%,  Min 25F, Max 100F
    state.temperature = vary(75, 5, 25, 100);

    // 70% +/- 5%,  Min 2%, Max 99%
    state.humidity = vary(70, 5, 2, 99);

    log("Simulation state: " + state.simulation_state);
    if (state.simulation_state === "high_pressure") {
        // 250 psig +/- 25%,  Min 50 psig, Max 300 psig
        state.pressure = vary(250, 25, 50, 300);
    } else {
        // 150 psig +/- 10%,  Min 50 psig, Max 300 psig
        state.pressure = vary(150, 10, 50, 300);
    }

    return state;
}
```

You can view the complete [chiller-01-state.js](https://github.com/Azure/device-simulation-dotnet/blob/master/Services/data/devicemodels/scripts/chiller-01-state.js) on Github.

## Method behavior

The [CloudToDeviceMethods](iot-suite-remote-monitoring-device-schema.md#cloudtodevicemethods) section of the device model schema defines the methods a simulated device responds to.

The following example shows the list of methods supported by a simulated chiller device:

```json
"CloudToDeviceMethods": {
  "Reboot": {
    "Type": "javascript",
    "Path": "Reboot-method.js"
  },
  "FirmwareUpdate": {
    "Type": "javascript",
    "Path": "FirmwareUpdate-method.js"
  },
  "EmergencyValveRelease": {
    "Type": "javascript",
    "Path": "EmergencyValveRelease-method.js"
  },
  "IncreasePressure": {
    "Type": "javascript",
    "Path": "IncreasePressure-method.js"
  }
}
```

Each method has an associated JavaScript file that implements the behavior of the method.

The state of the simulated device, as defined in the `InitialState` section of the schema, is held in memory by the simulation service. The state information is passed as input to the `main` function defined in  the JavaScript file when the method is called. The script can modify the state of the simulated device.

The following shows the outline of a typical `main` function:

```javascript
function main(context, previousState) {

}
```

The `context` parameter has the following properties:

- `currentTime` as a string with format `yyyy-MM-dd'T'HH:mm:sszzz`
- `deviceId`, for example `Simulated.Chiller.123`
- `deviceModel`, for example `Chiller`

The `state` parameter contains the state of the device as maintained by the device simulation service.

There are two global functions you can use to help implement the behavior of the method:

- `updateState` to update the state held by the simulation service.
- `sleep` to pause execution to simulate a long-running task.

The following example shows an abbreviated version of the **IncreasePressure-method.js** script used by the simulated chiller devices:

```javascript
function main(context, previousState) {

    log("Starting 'Increase Pressure' method simulation (5 seconds)");

    // Pause the simulation and change the simulation mode so that the
    // temperature will fluctuate at ~250 when it resumes
    var state = {
        simulation_state: "high_pressure",
        CalculateRandomizedTelemetry: false
    };
    updateState(state);

    // Increase
    state.pressure = 210;
    updateState(state);
    log("Pressure increased to " + state.pressure);
    sleep(1000);

    // Increase
    state.pressure = 250;
    updateState(state);
    log("Pressure increased to " + state.pressure);
    sleep(1000);

    // Resume the simulation
    state.CalculateRandomizedTelemetry = true;
    updateState(state);

    log("'Increase Pressure' method simulation completed");
}
```

## Debugging script files

It's not possible to attach a debugger to the Javascript interpreter used by the device simulation service to run state and method scripts. However, you can log information in the service log. The built-in `log()` function enables you to save information to track and debug function execution.

If there is a syntax error the interpreter fails, and writes a `Jint.Runtime.JavaScriptException` entry to the service log.

The [Create a simulated device](iot-suite-remote-monitoring-test.md) article shows you how to run the device simulation service locally. Running the service locally makes it easier to debug your simulated devices before you deploy them to the cloud.

## Next steps

This article described how to define the behavior of your own custom simulated device model. This article showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Control the state of a simulated device
> * Define how a simulated device reponds to a method call from the remote monitoring solution
> * Debug your scripts

Now you have learned how to specify the behavior of a simulated device, the suggested next step is to learn how to [Create a simulated device](iot-suite-remote-monitoring-test.md).

For more developer information about the remote monitoring solution, see:

* [Developer Reference Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Reference-Guide)
* [Developer Troubleshooting Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Troubleshooting-Guide)

<!-- Next tutorials in the sequence -->