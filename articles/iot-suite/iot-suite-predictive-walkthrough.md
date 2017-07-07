---
title: Predictive maintenance walkthrough | Microsoft Docs
description: A walkthrough of the Azure IoT predictive maintenance preconfigured solution.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 3c48a716-b805-4c99-8177-414cc4bec3de
ms.service: iot-suite
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/25/2017
ms.author: dobett

---
# Predictive maintenance preconfigured solution walkthrough

## Introduction

The IoT Suite predictive maintenance preconfigured solution is an end-to-end solution for a business scenario that predicts the point at which a failure is likely to occur. You can use this preconfigured solution proactively for activities such as optimizing maintenance. The solution combines key Azure IoT Suite services, such as IoT Hub, Stream analytics, and an [Azure Machine Learning][lnk-machine-learning] workspace. This workspace contains a model, based on a public sample data set, to predict the Remaining Useful Life (RUL) of an aircraft engine. The solution fully implements the IoT business scenario as a starting point for you to plan and implement a solution that meets your own specific business requirements.

## Logical architecture

The following diagram outlines the logical components of the preconfigured solution:

![][img-architecture]

The blue items are Azure services that are provisioned in the region you select when you provision the preconfigured solution. The list of regions where you can deploy the preconfigured solution displays on the [provisioning page][lnk-azureiotsuite].

The green item is a simulated device that represents an aircraft engine. You can learn more about these simulated devices in the following section.

The gray items represent components that implement *device management* capabilities. The current release of the predictive maintenance preconfigured solution does not provision these resources. To learn more about device management, refer to the [remote monitoring pre-configured solution][lnk-remote-monitoring].

## Simulated devices

In the preconfigured solution, a simulated device represents an aircraft engine. The solution is provisioned with two engines that map to a single aircraft. Each engine emits four types of telemetry: Sensor 9, Sensor 11, Sensor 14, and Sensor 15 provide the data necessary for the Machine Learning model to calculate the RUL for the engine. Each simulated device sends the following telemetry messages to IoT Hub:

*Cycle count*. A cycle represents a completed flight with a duration between two and ten hours. During the flight, telemetry data is captured every half hour.

*Telemetry*. There are four sensors that represent engine attributes. The sensors are generically labeled Sensor 9, Sensor 11, Sensor 14, and Sensor 15. These four sensors represent telemetry sufficient to obtain useful results from the RUL model. The model used in the preconfigured solution is created from a public data set that includes real engine sensor data. For more information on how the model was created from the original data set, see the [Cortana Intelligence Gallery Predictive Maintenance Template][lnk-cortana-analytics].

The simulated devices can handle the following commands sent from the IoT hub in the solution:

| Command | Description |
| --- | --- |
| StartTelemetry |Controls the state of the simulation.<br/>Starts the device sending telemetry |
| StopTelemetry |Controls the state of the simulation.<br/>Stops the device sending telemetry |

IoT Hub provides device command acknowledgment.

## Azure Stream Analytics job
**Job: Telemetry** operates on the incoming device telemetry stream using two statements. The first selects all telemetry from the devices and sends this data to blob storage from where it is visualized in the web app. The second statement computes average sensor values over a two-minute sliding window and sends this data through the Event hub to an **event processor**.

## Event processor
The **event processor host** runs in an Azure Web Job. The **event processor** takes the average sensor values for a completed cycle. It then passes those values to an API that exposes trained model to calculate the RUL for an engine. The API is exposed by a Machine Learning workspace that is provisioned as part of the solution.

## Machine Learning
The Machine Learning component uses a model derived from data collected from real aircraft engines. You can navigate to the Machine Learning workspace from the tile on the [azureiotsuite.com][lnk-azureiotsuite] page for your provisioned solution when the solution is in the **Ready** state.


## Next steps
Now you've seen the key components of the predictive maintenance preconfigured solution, you may want to customize it. See [Guidance on customizing preconfigured solutions][lnk-customize].

You can also explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

* [Frequently asked questions for IoT Suite][lnk-faq]
* [IoT security from the ground up][lnk-security-groundup]

[img-architecture]: media/iot-suite-predictive-walkthrough/architecture.png

[lnk-remote-monitoring]: iot-suite-remote-monitoring-sample-walkthrough.md
[lnk-cortana-analytics]: http://gallery.cortanaintelligence.com/Collection/Predictive-Maintenance-Template-3
[lnk-azureiotsuite]: https://www.azureiotsuite.com/
[lnk-customize]: iot-suite-guidance-on-customizing-preconfigured-solutions.md
[lnk-faq]: iot-suite-faq.md
[lnk-security-groundup]: securing-iot-ground-up.md
[lnk-machine-learning]: https://azure.microsoft.com/services/machine-learning/