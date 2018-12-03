---
title: Device simulation overview - Azure | Microsoft Docs
description: A description of the Device Simulation solution accelerator and its capabilities.
author: dominicbetts
manager: philmea
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.custom: mvc
ms.date: 12/03/2018
ms.author: dobett

# As a developer or IT Pro, I want to understand what the Device Simulation solution accelerator is so that I can understand if it can help me test my IoT solution.
---

# Device Simulation solution accelerator overview

In a cloud-based IoT solution, your devices connect to a cloud endpoint to send telemetry such as temperature. In some solutions, your cloud back-end controls devices by sending messages such as an instruction to open a valve.

When you develop or test an IoT solution, you may want to:

* Experiment with or debug the message formats your devices use without repeatedly deploying code to a physical device.
* Test the scalability of your solution without deploying a large number of physical devices.

You can use Device Simulation to create device models that specify the message formats and behaviors of your physical devices and run simulations of thousands of devices.

When you create a simulation, you specify the IoT hub to connect to, the device models to use, and the number of devices to simulate.

The Device Simulation solution accelerator runs in your Azure subscription in the cloud.

## Scenarios

You can use Device Simulation to test your solutions in a wide range of scenarios, such as:

### Integrated with other solution accelerators

When you deploy the [Remote Monitoring solution accelerator](iot-accelerators-remote-monitoring-sample-walkthrough.md), it uses the Device Simulation solution accelerator to simulate devices. Simulated devices include chillers, elevators, and delivery trucks. The following screenshot shows the Remote Monitoring dashboard with telemetry from two simulated delivery trucks:

[![Solution dashboard](./media/iot-accelerators-device-simulation-overview/solutiondashboard-inline.png)](./media/iot-accelerators-device-simulation-overview/solutiondashboard-expanded.png#lightbox)

### Simple simulations

When you deploy the Device Simulation solution accelerator, you can run a [sample simulation that simulates 10 truck devices](quickstart-device-simulation-deploy.md). Use this sample to learn how to use Device Simulation:

![Simulation configuration](./media/iot-accelerators-device-simulation-overview/SampleSimulation.png)

You can [create your own simulations using the built-in device models such as chillers or elevators](iot-accelerators-device-simulation-create-simulation.md):

![New simulation](media/iot-accelerators-device-simulation-overview/newsimulation.png)

### Use custom simulated devices

You can use the Device Simulation dashboard to [create custom device models](iot-accelerators-device-simulation-create-custom-device.md) to use in your simulations. For example, you could define a new Refrigerator device model that sends temperature and humidity telemetry:

![Create device model](media/iot-accelerators-device-simulation-overview/adddevicemodel.png)

### Use advanced simulated devices

To customize the behavior of a device, you can [create and upload your own device model files
](iot-accelerators-device-simulation-advanced-device.md) that define:

* The telemetry types the device sends.
* Custom algorithms to generate the telemetry.
* How the device responds to commands sent from the cloud. to make it respond to commands or use a 

The device model files use JSON and JavaScript to define a model.

## Next steps

In this article, you learned about the Device Simulation solution accelerator and its capabilities. To get started using the solution accelerator, continue to the quickstart:

> [!div class="nextstepaction"]
> [Deploy and run an IoT device simulation in Azure](quickstart-device-simulation-deploy.md)
