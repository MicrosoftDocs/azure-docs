---
title: Get started with the device simulation solution - Azure | Microsoft Docs 
description: The IoT Suite simulation solution is a tool that can be used to assist in the development and testing of an IoT solution. The simulation service is a standalone offering that can be used in conjunction with other preconfigured solutions or used with your own custom solutions.
services: ''
suite: iot-suite
author: troyhopwood
manager: corywink
ms.author: troyhop
ms.service: iot-suite
ms.date: 11/21/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Device Simulation walkthrough

Azure IoT Device Simulation is a tool that can be used to assist in the development and testing of an IoT solution. Device Simulation is a standalone offering that can be used in conjunction with other preconfigured solutions or used with your own custom solutions.

This tutorial walks you through some of the features of Device Simulation. It covers how it works enabling you to use it to test your own IoT solutions.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Configure a simulation
> * Starting and stopping a simulation
> * View telemetry metrics


## Prerequisites

To complete this tutorial, you need a deployed instance of Azure IoT Device Simulation in your Azure subscription.

If you haven't deployed Device Simulation yet, you should complete the [Deploy Azure IoT Device Simulation](./iot-suite-device-simulation-explore.md) tutorial.

## Configuring Device Simulation
Device Simulation can be configured and run completely from within the dashboard. You can open the dashboard on the **Provisioned solutions** page in IoT Suite. Click **Launch** under your new Device simulation deployment 

### Target IoT Hub
Device Simulation can be used with a pre-provisioned IoT hub or with any other Azure IoT Hub.

![Target IoT Hub](media/iot-suite-device-simulation-explore/targethub.png)

> [!NOTE]
> The option to use a pre-provisioned IoT Hub is only available if you chose to have a new IoT Hub created when deploying Device Simulation. If you don't have an IoT Hub, you can always create a new one from the [Azure portal](https://portal.azure.com).

To target a specific IoT Hub, you can provide the **iothubowner** connection string. You can get this connection string from the [Azure portal](https://portal.azure.com).

1. On the IoT Hub blades in Azure portal, click **Shared Access policies**.
1. Click **iothubowner**
1. copy either the primary or secondary key
1. Paste this value into the text box under Target IoT Hub.

![Target IoT Hub](media/iot-suite-device-simulation-explore/connectionstring.png)

### Device model
The device model allows you to choose what type of device to simulate. You can choose one of the pre-configured device models or define a list of sensors for a custom device model.

![Target IoT Hub](media/iot-suite-device-simulation-explore/devicemodel.png)

#### Pre-Configured device models
Device Simulation provides three pre-configured device models. Device models for Chillers, Elevators, and Trucks are available.

Pre-configured device models include multiple sensors along with a pre-determined telemetry frequency. This telemetry frequency is not customizable for these devices.

The following table shows a list of the configuration for each pre-configured device model.

| Device model | Sensor | Unit | Telemetry frequency
| -------------| ------ | -----| --------------------|
| Chiller | humidity | % | 5 seconds |
| | pressure | psig | 5 seconds |
| | temperature | F | 5 seconds |
| Elevator | Floor | | 5 seconds |
| | Vibration | mm | 5 seconds |
| | Temperature | F | 5 seconds |
| Truck | Latitude | | 3 seconds |
| | Longitude | | 3 seconds |
| | speed | mph | 5 seconds |
| | cargotemperature | F | 5 seconds |

#### Custom device model
Custom device models allow you to model sensors that more closely represent your own devices. Custom devices can have up to 10 custom sensors.

When the custom device model type is selected, new sensors can be added by clicking the **+Add sensor** button.

![Target IoT Hub](media/iot-suite-device-simulation-explore/customsensors.png)

Custom sensors include the following properties:

| Field | Description |
| ----- | ----------- |
| Sensor Name | A friendly name for the sensor (for example, temperature or speed) |
| Behavior | Behaviors allow telemetry data to vary from one message to the next to simulate real-world data. Increment increases the value by one in each message sent starting at the min value. Once the max value is met, then it starts over again at the min value. Decrement behaves in the same way as increment but counts down. THe random behavior generates a random value between the min value and max value  |
| Min Value | The lowest number representing your acceptable range |
| Max Value | The largest number representing your acceptable range |
| Unit | The unit of measurement for the sensor (for example, °F or MPH) |

### Number of devices
Device Simulation allows you to simulate up to 1,000 devices. Support for more devices is coming soon.

![Target IoT Hub](media/iot-suite-device-simulation-explore/numberofdevices.png)

### Telemetry frequency
Telemetry frequency allows you to specify how often your simulated devices should send data to the IoT Hub. You can send data as frequently as every 10 seconds or as slowly as 99 hours, 59 minutes, and 59 seconds.

![Target IoT Hub](media/iot-suite-device-simulation-explore/frequency.png)

> [!NOTE]
> If you are using an IoT Hub other than the pre-provisioned IoT Hub, then you should consider message limits for your target IoT Hub. For example, if you have 1,000 simulated devices sending telemetry every 10 seconds to an S1 Hub you will reach the telemetry limit in just over an hour.

### Simulation duration
You can choose to run your simulation for a specific length of time or to have your simulation continue to run until you explicitly stop it. When choosing a specific length of time, you can choose any duration from 10 minutes up to 99 hours, 59 minutes, and 59 seconds.

![Target IoT Hub](media/iot-suite-device-simulation-explore/duration.png)

### Starting and stopping the simulation
Once the form has been filled out, the **Start Simulation** button is enabled. Clicking this button starts the simulation.

![Target IoT Hub](media/iot-suite-device-simulation-explore/start.png)

If you specified a specific duration for your simulation, then it stops automatically when the time has been reached. You can always stop the simulation early by clicking **Stop Simulation.**

If you chose to run your simulation indefinitely, then it runs until you click **Stop Simulation.** You can close your browser and come back to the Device Simulation page to stop your simulation at any time.

![Target IoT Hub](media/iot-suite-device-simulation-explore/stop.png)

> [!NOTE]
> Only one simulation can be run at a time. You must stop the currently running simulation to start a new simulation.