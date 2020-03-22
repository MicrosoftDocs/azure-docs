---
title: Predictive Maintenance solution accelerator overview - Azure | Microsoft Docs
description: An overview of the Azure IoT Predictive Maintenance solution accelerator that predicts the point at which a failure is likely to occur for a business scenario.
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 03/08/2019
ms.author: dobett
---

# Predictive Maintenance solution accelerator overview

The Predictive Maintenance solution accelerator is an end-to-end solution for a business scenario that predicts the point at which a failure is likely to occur. You can use this solution accelerator proactively for activities such as optimizing maintenance. The solution combines key Azure IoT solution accelerators services, such as IoT Hub and an [Azure Machine Learning][lnk-machine-learning] workspace. This workspace contains a model, based on a public sample data set, to predict the Remaining Useful Life (RUL) of an aircraft engine. The solution fully implements the IoT business scenario as a starting point for you to plan and implement a solution that meets your own specific business requirements.

The Predictive Maintenance solution accelerator [code is available on GitHub](https://github.com/Azure/azure-iot-predictive-maintenance).

## Logical architecture

The following diagram outlines the logical components of the solution accelerator:

![Logical architecture][img-architecture]

The blue items are Azure services provisioned in the region where you deployed the solution accelerator. The list of regions where you can deploy the solution accelerator displays on the [provisioning page][lnk-azureiotsolutions].

The green item is a simulated aircraft engine. You can learn more about these simulated devices in the [Simulated devices](#simulated-devices) section.

The gray items are components that implement *device management* capabilities. The current release of the Predictive Maintenance solution accelerator does not provision these resources. To learn more about device management, refer to the [Remote Monitoring solution accelerator][lnk-remote-monitoring].

## Azure resources

In the Azure portal, navigate to the resource group with the solution name you chose to view your provisioned resources.

![Accelerator resources][img-resource-group]

When you provision the solution accelerator, you receive an email with a link to the Machine Learning workspace. You can also navigate to the Machine Learning workspace from the [Microsoft Azure IoT Solution Accelerators][lnk-azureiotsolutions] page. A tile is available on this page when the solution is in the **Ready** state.

![Machine learning model][img-machine-learning]

## Simulated devices

In the solution accelerator, a simulated device is an aircraft engine. The solution is provisioned with two engines that map to a single aircraft. Each engine emits four types of telemetry: Sensor 9, Sensor 11, Sensor 14, and Sensor 15 provide the data necessary for the Machine Learning model to calculate the RUL for the engine. Each simulated device sends the following telemetry messages to IoT Hub:

*Cycle count*. A cycle is a completed flight with a duration between two and ten hours. During the flight, telemetry data is captured every half hour.

*Telemetry*. There are four sensors that record engine attributes. The sensors are generically labeled Sensor 9, Sensor 11, Sensor 14, and Sensor 15. These four sensors send telemetry sufficient to get useful results from the RUL model. The model used in the solution accelerator is created from a public data set that includes real engine sensor data. For more information on how the model was created from the original data set, see the [Cortana Intelligence Gallery Predictive Maintenance Template][lnk-cortana-analytics].

The simulated devices can handle the following commands sent from the IoT hub in the solution:

| Command | Description |
| --- | --- |
| StartTelemetry |Controls the state of the simulation.<br/>Starts the device sending telemetry |
| StopTelemetry |Controls the state of the simulation.<br/>Stops the device sending telemetry |

IoT Hub provides device command acknowledgment.

## Azure Stream Analytics job

**Job: Telemetry** operates on the incoming device telemetry stream using two statements:

* The first selects all telemetry from the devices and sends this data to blob storage. From here, it's visualized in the web app.
* The second computes average sensor values over a two-minute sliding window and sends this data through the Event hub to an **event processor**.

## Event processor
The **event processor host** runs in an Azure Web Job. The **event processor** takes the average sensor values for a completed cycle. It then passes those values to a trained model that calculates the RUL for an engine. An API provides access to the model in a Machine Learning workspace that's part of the solution.

## Machine Learning
The Machine Learning component uses a model derived from data collected from real aircraft engines. You can navigate to the Machine Learning workspace from your solution's tile on the [azureiotsolutions.com][lnk-azureiotsolutions] page. The tile is available when the solution is in the **Ready** state.

The Machine Learning model is available as a template that shows how to work with telemetry collected through IoT solution accelerator services. Microsoft has built a [regression model][lnk_regression_model] of an aircraft engine based on publicly available data<sup>\[1\]</sup>, and step-by-step guidance on how to use the model.

The Azure IoT Predictive Maintenance solution accelerator uses the regression model created from this template. The model is deployed into your Azure subscription and made available through an automatically generated API. The solution includes a subset of the testing data for 4 (of 100 total) engines and the 4 (of 21 total) sensor data streams. This data is sufficient to provide an accurate result from the trained model.

*\[1\] A. Saxena and K. Goebel (2008). "Turbofan Engine Degradation Simulation Data Set", NASA Ames Prognostics Data Repository (https://c3.nasa.gov/dashlink/resources/139/), NASA Ames Research Center, Moffett Field, CA*

## Next steps
Now you've seen the key components of the Predictive Maintenance solution accelerator, you may want to customize it.

You can also explore some of the other features of the IoT solution accelerators:

* [Frequently asked questions for IoT solution accelerators][lnk-faq]
* [IoT security from the ground up][lnk-security-groundup]

[img-architecture]: media/iot-accelerators-predictive-walkthrough/architecture.png
[img-resource-group]: media/iot-accelerators-predictive-walkthrough/resource-group.png
[img-machine-learning]: media/iot-accelerators-predictive-walkthrough/machine-learning.png

[lnk-remote-monitoring]: quickstart-predictive-maintenance-deploy.md
[lnk-cortana-analytics]: https://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Template-3
[lnk-azureiotsolutions]: https://www.azureiotsolutions.com/
[lnk-faq]: iot-accelerators-faq.md
[lnk-security-groundup]:/azure/iot-fundamentals/iot-security-ground-up
[lnk-machine-learning]: https://azure.microsoft.com/services/machine-learning/
[lnk_regression_model]: https://gallery.cortanaanalytics.com/Collection/Predictive-Maintenance-Template-3
