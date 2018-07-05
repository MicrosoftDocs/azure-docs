---
title: Deploy and run a device simulation solution on Azure | Microsoft Docs
description: In this quickstart, you deploy the Device Simulation Azure IoT solution accelerator. You sign use the solution dashboard to create a simulation.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: quickstart
ms.custom: mvc
ms.date: 07/05/2018
ms.author: dobett

# As an IT Pro, I need to create simulated devices to test my IoT solution.
---

# Quickstart: Deploy and run a cloud-based device simulation solution

This quickstart shows you how to deploy the Azure IoT Device Simulation solution accelerator to use to test your IoT solution. After you've deployed the solution accelerator, you use the **Simulation** page to create and run a simulation.

## Prerequisites

To complete this quickstart, you need an active Azure subscription.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Deploy the solution

When you deploy the solution accelerator to your Azure subscription, you must set some configuration options.

Sign in to [azureiotsolutions.com](https://www.azureiotsolutions.com/Accelerators) using your Azure account credentials.

Click **Try Now** on the **Device Simulation** tile.

![Choose Device Simulation](./media/quickstart-device-simulation-deploy/devicesimulation.png)

On the **Create Device Simulation solution** page, enter a unique **Solution name**. Make a note of your solution name, it's the name of the Azure resource group that that contains all the solution's resources.

Select the **Subscription** and **Region** you want to use to deploy the solution accelerator. Typically, you choose the region closest to you. You must be a [global administrator or user](iot-accelerators-permissions.md) in the subscription.

Check the box to deploy an IoT hub to use with your Device Simulation solution. You can always change the IoT hub your simulation uses later.

Click **Create Solution** to begin provisioning your solution. This process takes at least five minutes to run:

![Device Simulation solution details](./media/quickstart-device-simulation-deploy/createform.png)

## Sign in to the solution

When the provisioning process is complete, you can sign in to your Device Simulation solution accelerator dashboard.

On the **Provisioned solutions** page, click your new Device Simulation solution accelerator:

![Choose new solution](./media/quickstart-device-simulation-deploy/choosenew.png)

You can view information about your Device Simulation solution accelerator in the panel that appears. Choose **Solution dashboard** to view your Device Simulation solution accelerator:

![Solution panel](./media/quickstart-device-simulation-deploy/solutionpanel.png)

Click **Accept** to accept the permissions request, the Device Simulation solution dashboard displays in your browser:

[![Solution dashboard](./media/quickstart-device-simulation-deploy/solutiondashboard-inline.png)](./media/quickstart-device-simulation-deploy/solutiondashboard-expanded.png#lightbox)

## Configure the simulation

You configure and run a simulation from the dashboard. Use the values in the following table to configure your simulation:

| Setting             | Value                       |
| ------------------- | --------------------------- |
| Target IoT Hub      | Use pre-provisioned IoT Hub |
| Device model        | Chiller                     |
| Number of devices   | 10                          |
| Telemetry frequency | 10 seconds                  |
| Simulation duration | 5 minutes                   |

[![Simulation configuration](./media/quickstart-device-simulation-deploy/simulationconfig-inline.png)](./media/quickstart-device-simulation-deploy/simulationconfig-expanded.png#lightbox)

## Run the simulation

Click **Start Simulation**. The simulation runs for the duration you chose. You can stop the simulation at any time by clicking **Stop Simulation**. The simulation shows statistics for the current run. Click on **View IoT Hub metrics in the Azure portal** to see the metrics reported by the IoT hub:

[![Simulation run](./media/quickstart-device-simulation-deploy/simulationrun-inline.png)](./media/quickstart-device-simulation-deploy/simulationrun-expanded.png#lightbox)



<!--

Do we need this, and if so where should it go?
### Number of devices

Device Simulation currently enables you to simulate up to 20,000 devices.

![Number of devices](./media/quickstart-device-simulation-deploy/numberofdevices.png)

### Telemetry frequency

Telemetry frequency enables you to specify how often your simulated devices should send data to the IoT hub. You can send data as frequently as every 10 seconds or as infrequently every as 99 hours, 59 minutes, and 59 seconds.

![Telemetry frequency](./media/quickstart-device-simulation-deploy/frequency.png)

> [!NOTE]
> If you are using an IoT hub other than the pre-provisioned IoT hub, then you should consider message limits for your target IoT hub. For example, if you have 1,000 simulated devices sending telemetry every 10 seconds to an S1 hub you reach the telemetry limit for the hub in just over an hour.

### Simulation duration

You can choose to run your simulation for a specific length of time or to run until you explicitly stop it. When you choose a specific length of time, you can choose any duration from 10 minutes up to 99 hours, 59 minutes, and 59 seconds.

![Simulation duration](./media/quickstart-device-simulation-deploy/duration.png)

### Start and stop the simulation

When you have added all the necessary configuration data to the form, the **Start Simulation** button is enabled. To start the simulation, click this button.

![Start simulation](./media/quickstart-device-simulation-deploy/start.png)

If you specified a specific duration for your simulation, then it stops automatically when the time has been reached. You can always stop the simulation early by clicking **Stop Simulation.**

If you chose to run your simulation indefinitely, then it runs until you click **Stop Simulation**. You can close your browser and come back to the Device Simulation page to stop your simulation at any time.

![Stop simulation](./media/quickstart-device-simulation-deploy/stop.png)

> [!NOTE]
> Only one simulation can be run at a time. You must stop the currently running simulation before you start a new simulation.

-->

## Clean up resources

If you plan to explore further, leave the Device Simulation solution accelerator deployed.

If you no longer need the solution accelerator, delete it from the [Provisioned solutions](https://www.azureiotsolutions.com/Accelerators#dashboard) page:

![Delete solution](media/quickstart-device-simulation-deploy/deletesolution.png)

## Next steps

In this quickstart, you've deployed the Device Simulation solution accelerator and run an IoT device simulation.

To learn how to use an existing IoT Hub in a simulation, see the How-to guide:

> [!div class="nextstepaction"]
> [Use an existing IoT hub with the Device Simulation solution accelerator](iot-accelerators-device-simulation-choose-hub.md)