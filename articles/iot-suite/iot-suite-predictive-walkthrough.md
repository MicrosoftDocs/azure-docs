<properties
 pageTitle="Predictive maintenance walkthrough | Microsoft Azure"
 description="A walkthrough of the Azure IoT predictive maintenance preconfigured solution."
 services=""
 suite="iot-suite"
 documentationCenter=""
 authors="aguilaaj"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-suite"
 ms.devlang="na"
 ms.topic="get-started-article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="05/16/2016"
 ms.author="araguila"/>

# Predictive maintenance preconfigured solution walkthrough

## Introduction

The IoT Suite predictive maintenance preconfigured solution is an end-to-end solution for a business scenario that predicts the point when failure is likely to occur. You can leverage this preconfigured solution proactively for activities such as optimizing maintenance. The solution combines key Azure IoT Suite services, including an [Azure Machine Learning][lnk_machine_learning] workspace complete with experiments for predicting the Remaining Useful Life (RUL) of an aircraft engine based on a public sample data set. The solution provides a full implementation of the business scenario as a starting point for you to plan and implement this type of IoT solution to meet your own specific business requirements.

## Logical architecture

The following diagram outlines the logical components of the preconfigured solution:

![][img-architecture]

The blue items are Azure services that are provisioned in the location you select when you provision the preconfigured solution. You can provision the preconfigured solution in either the East US, North Europe, or East Asia region.

Some resources are not available in the regions where you provision the preconfigured solution. The orange items in the diagram represent the Azure services provisioned in the closest available region (South Central US, Europe West, or SouthEast Asia) given the selected region.

The green item is a simulated device that represents an aircraft engine. You can learn more about these simulated devices below.

The gray items represent components that implement *device administration* capabilities. The current release of the predictive maintenance preconfigured solution does not provision these resources. To learn more about device administration, refer to the [remote monitoring pre-configured solution][lnk-remote-monitoring].

## Simulated devices

In the preconfigured solution, a simulated device represents an aircraft engine. The solution is provisioned with 2 engines that map to a single aircraft. Each engine emits 4 types of telemetry: Sensor 9, Sensor 11, Sensor 14, and Sensor 15 that provide the data necessary for the Machine Learning model to calculate the Remaining Useful Life (RUL) for that engine. Each simulated device sends the following telemetry messages to IoT Hub:

*Cycle count*. A cycle represents a completed flight of variable length between 2-10 hours in which telemetry data is captured every half hour for the duration of the flight.

*Telemetry*. There are 4 sensors that represent engine attributes. The sensors are generically labeled Sensor 9, Sensor 11, Sensor 14, and Sensor 15. These 4 sensors represent telemetry sufficient to get useful results from the Machine Learning model for RUL. This model is created from a public data set that includes real engine sensor data. For more information on how the model was created from the original data set, see the [Cortana Intelligence Gallery Predictive Maintenance Template][lnk-cortana-analytics].

The simulated devices can handle the following commands sent from an IoT hub:

| Command | Description |
|---------|-------------|
| StartTelemetry | Controls the state of the simulation.<br/>Starts the device sending telemetry     |
| StopTelemetry  | Controls the state of the simulation.<br/>Stops the device sending telemetry |

IoT Hub provides device command acknowledgment.

## Azure Stream Analytics job

**Job: Telemetry** operates on the incoming device telemetry stream using two statements. The first selects all telemetry from the devices and sends this data to blob storage from where it is visualized in the web app. The second statement computes average sensor values over a two-minute sliding window and sends this data through the Event hub to an **event processor**.

## Event processor

The **event processor** takes the average sensor values for a completed cycle and passes those values to an API that exposes the Machine Learning trained model to calculate the RUL for an engine.

## Azure Machine Learning

For more information on how the model was created from the original data set, see the [Cortana Intelligence Gallery Predictive Maintenance Template][lnk-cortana-analytics].

## Let's start walking

This section walks you through the components of the solution, describes the intended use case, and provides examples.

### Predictive Maintenance Dashboard

This page in the web application uses PowerBI JavaScript controls (see the [PowerBI-visuals repository][lnk-powerbi]) to visualize:

- The output data from the Stream Analytics jobs in blob storage.
- The RUL and cycle count per aircraft engine.

### Observing the behavior of the cloud solution

You can view your provisioned resources by browsing to the Azure portal and then navigating to the resource group with the solution name you chose.

![][img-resource-group]

When you provision the preconfigured solution, you receive an email with a link to the Machine Learning workspace. You can also navigate to this Machine Learning workspace from the[azureiotsuite.com][lnk-azureiotsuite] page for your provisioned solution when it’s in the **Ready** state.

![][img-machine-learning]

In the solution portal, you can see that the sample is provisioned with four simulated devices to represent 2 aircraft with 2 engines per aircraft and with 4 sensors per engine. When you first navigate to the solution portal, the simulation is stopped.

![][img-simulation-stopped]

Click **Start simulation** to begin the simulation in which you’ll see the sensor history, RUL, Cycles, and RUL history populate the dashboard.

![][img-simulation-running]

When RUL is less than 160 (an arbitrary threshold chosen for demonstration purposes), the solution portal displays a warning symbol next to the RUL display and colors the aircraft engine in the picture yellow. You’ll notice the RUL values have a general downward trend overall, but tend to bounce up and down. This results from the varying cycle lengths and the model accuracy.

![][img-simulation-warning]

The full simulation takes around 35 minutes to complete 148 cycles. The 160 RUL threshold is met for the first time at around 5 minutes and both engines hit the threshold at around 8 minutes.

The simulation runs through the complete dataset for 148 cycles and settles on final RUL and cycle values.

You can stop the simulation at any point, but clicking **Start Simulation** replays the simulation from the start of the dataset.

## Next steps

Now you've run the predictive maintenance preconfigured solution you may want to modify it, see [Guidance on customizing preconfigured solutions][lnk-customize].

The [IoT Suite - Under The Hood - Predictive Maintenance](http://social.technet.microsoft.com/wiki/contents/articles/33527.iot-suite-under-the-hood-predictive-maintenance.aspx) TechNet blog post provides additional detail about the predictive maintenance preconfigured solution.

You can also explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

- [Frequently asked questions for IoT Suite][lnk-faq]
- [IoT security from the ground up][lnk-security-groundup]


[img-architecture]: media/iot-suite-predictive-walkthrough/architecture.png
[img-resource-group]: media/iot-suite-predictive-walkthrough/resource-group.png
[img-machine-learning]: media/iot-suite-predictive-walkthrough/machine-learning.png
[img-simulation-stopped]: media/iot-suite-predictive-walkthrough/simulation-stopped.png
[img-simulation-running]: media/iot-suite-predictive-walkthrough/simulation-running.png
[img-simulation-warning]: media/iot-suite-predictive-walkthrough/simulation-warning.png

[lnk-powerbi]: https://www.github.com/Microsoft/PowerBI-visuals
[lnk_machine_learning]: https://azure.microsoft.com/services/machine-learning/
[lnk-remote-monitoring]: iot-suite-remote-monitoring-sample-walkthrough.md
[lnk-cortana-analytics]: http://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Template-3
[lnk-azureiotsuite]: https://www.azureiotsuite.com/
[lnk-customize]: iot-suite-guidance-on-customizing-preconfigured-solutions.md
[lnk-faq]: iot-suite-faq.md
[lnk-security-groundup]: securing-iot-ground-up.md