---
title: Predictive maintenance preconfigured solution | Microsoft Docs
description: A description of the Azure IoT Suite predictive maintenance preconfigured solution.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: b370b3d7-2ce5-4906-9818-3aeedd471ee3
ms.service: iot-suite
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/25/2017
ms.author: dobett

---
# Predictive maintenance preconfigured solution overview

The *predictive maintenance* [preconfigured solution][lnk_preconfigured_solutions] is one of the [Microsoft Azure IoT Suite][lnk_iot_suite] preconfigured solutions. This solution integrates real-time device telemetry collection with a predictive model created using [Azure Machine Learning][lnk-machine-learning].

With Azure IoT Suite, an enterprise can quickly and easily connect to and monitor assets, and analyze data in real time. The predictive maintenance preconfigured solution takes that data and uses rich dashboards and visualizations to provide you with new intelligence that can drive efficiencies and enhance revenue streams.

## The Scenario
Fabrikam is a regional airline that focuses on great customer experience at competitive prices. One cause of flight delays is maintenance issues and aircraft engine maintenance is particularly challenging. Engine failure during flight must be avoided at all costs, so Fabrikam inspects its engines regularly and adheres to a scheduled maintenance program. However, aircraft engines don’t always wear the same. Some unnecessary maintenance is performed on engines. More importantly, issues arise which can ground an aircraft until maintenance is performed. These issues cause costly delays, especially if an aircraft is at a location where the right technicians or spare parts are not available.

The engines of Fabrikam’s aircraft are instrumented with sensors that monitor engine conditions during flight. Fabrikam uses the predictive maintenance preconfigured solution to collect the sensor data collected during the flight. After accumulating years of engine operational and failure data, Fabrikam’s data scientists have modeled a way to predict the Remaining Useful Life (RUL) of an aircraft engine. What they have identified is a correlation between the data from four of the engine sensors with the engine wear that leads to eventual failure. While Fabrikam continues to perform regular inspections to ensure safety, it can now use the models to compute the RUL for each engine after every flight. The model uses the telemetry collected from the engines during the flight. Fabrikam can now predict future points of failure and plan for maintenance and repair in advance.

> [!NOTE]
> The solution model uses actual engine wear data.

By predicting the point when maintenance is required, Fabrikam can optimize its operations to reduce costs. Maintenance coordinators work with schedulers:

- To plan maintenance to coincide with an aircraft stopping at a particular location.
- To ensure there is sufficient time for the aircraft to be out of service without causing schedule disruption.
- To schedule technicians to ensure that aircraft are serviced efficiently without wait time.

Inventory control managers receive maintenance plans, so they can optimize their ordering process and spare parts inventory. All these factors enable Fabrikam to minimize aircraft ground time and to reduce operating costs while ensuring the safety of passengers and crew.

To understand how [Azure IoT Suite][lnk_iot_suite] provides the capabilities customers need to realize the potential of predictive maintenance, review this [infographic][lnk_infographic].

## How the predictive maintenance solution is built

The solution uses an existing Azure Machine Learning model available as a template to show these capabilities working from device telemetry collected through IoT Suite services. Microsoft has built a [regression model][lnk_regression_model] of an aircraft engine based on publically available data<sup>\[1\]</sup>, and step-by-step guidance on how to use the model.

The Azure IoT predictive maintenance preconfigured solution uses the regression model created from this template. The model is deployed into your Azure subscription and exposed through an automatically generated API. The solution includes a subset of the testing data representing 4 (of 100 total) engines and the 4 (of 21 total) sensor data streams. This data is sufficient to provide an accurate result from the trained model.

*\[1\] A. Saxena and K. Goebel (2008). "Turbofan Engine Degradation Simulation Data Set", NASA Ames Prognostics Data Repository (http://ti.arc.nasa.gov/tech/dash/pcoe/prognostic-data-repository/), NASA Ames Research Center, Moffett Field, CA*

## Get started with predictive maintenance

This tutorial shows you how to provision the predictive maintenance solution. It also walks you through the basic features of the predictive maintenance solution. You can access many of these features through the solution dashboard that deploys along with the preconfigured solution.

To complete this tutorial, you need an active Azure subscription.

> [!NOTE]
> If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk_free_trial].

1. Log on to [azureiotsuite.com][lnk-azureiotsuite] using your Azure account credentials, and click **+** to create a solution.
1. Click **Select** the **Predictive maintenance** tile.
1. Enter a **Solution name** for your predictive maintenance preconfigured solution.
1. Select the **Region** and **Subscription** you want to use to provision the solution.
1. Click **Create Solution** to begin the provisioning process. This process typically takes several minutes to run.

### Wait for the provisioning process to complete

1. Click the tile for your solution with **Provisioning** status.
1. Notice the **Provisioning states** as Azure services are deployed in your Azure subscription.
1. Once provisioning completes, the status changes to **Ready**.
1. Click the tile to see the details of your solution in the right-hand pane. From this pane, you can launch the solution dashboard and access the Machine Learning workspace.

> [!NOTE]
> If you encounter issues deploying the preconfigured solution, review [Permissions on the azureiotsuite.com site][lnk-permissions] and the [FAQ][lnk-faq]. If the issues persist, create a service ticket on the [portal][lnk-portal].

Are there details you'd expect to see that aren't listed for your solution? Give us feature suggestions on [User Voice](https://feedback.azure.com/forums/321918-azure-iot).

## View the solution

This section guides you through the solution UI.

### Predictive Maintenance Dashboard
This page in the web application uses PowerBI JavaScript controls (see the [PowerBI-visuals repository][lnk-powerbi]) to visualize:

* The output data from the Stream Analytics jobs in blob storage.
* The RUL and cycle count per aircraft engine.

### Observing the behavior of the cloud solution
In the Azure portal, navigate to the resource group with the solution name you chose to view your provisioned resources.

![][img-resource-group]

When you provision the preconfigured solution, you receive an email with a link to the Machine Learning workspace. You can also navigate to the Machine Learning workspace from the tile on the [azureiotsuite.com][lnk-azureiotsuite] page for your provisioned solution when the solution is in the **Ready** state.

![][img-machine-learning]

In the solution portal, you can see that the sample is provisioned with four simulated devices to represent two aircraft with two engines per aircraft, each with four sensors. When you first navigate to the solution portal, the simulation is stopped.

![][img-simulation-stopped]

Click **Start simulation** to begin the simulation in which you see the sensor history, RUL, Cycles, and RUL history populate the dashboard.

![][img-simulation-running]

When RUL is less than 160 (an arbitrary threshold chosen for demonstration purposes), the solution portal displays a warning symbol next to the RUL display and highlights the aircraft engine in yellow. Notice how the RUL values have a general downward trend overall, but tend to bounce up and down. This behavior results from the varying cycle lengths and the model accuracy.

![][img-simulation-warning]

The full simulation takes around 35 minutes to complete 148 cycles. The 160 RUL threshold is met for the first time at around 5 minutes and both engines hit the threshold at around 8 minutes.

The simulation runs through the complete dataset for 148 cycles and settles on final RUL and cycle values.

You can stop the simulation at any point, but clicking **Start Simulation** replays the simulation from the start of the dataset.

## Next steps

To learn more about how Azure IoT enables predictive maintenance scenarios, read [Capture value from the Internet of Things][lnk_capture_value].

Take a [walkthrough][lnk-predictive-walkthrough] of the predictive maintenance preconfigured solution.

You can also explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

* [Frequently asked questions for IoT Suite][lnk-faq]
* [IoT security from the ground up][lnk-security-groundup]

[img-resource-group]: media/iot-suite-predictive-overview/resource-group.png
[img-simulation-stopped]: media/iot-suite-predictive-overview/simulation-stopped.png
[img-simulation-running]: media/iot-suite-predictive-overview/simulation-running.png
[img-simulation-warning]: media/iot-suite-predictive-overview/simulation-warning.png
[img-machine-learning]: media/iot-suite-predictive-overview/machine-learning.png

[lnk-powerbi]: https://www.github.com/Microsoft/PowerBI-visuals
[lnk-predictive-walkthrough]: iot-suite-predictive-walkthrough.md
[lnk_preconfigured_solutions]: iot-suite-what-are-preconfigured-solutions.md
[lnk_iot_suite]: iot-suite-overview.md
[lnk_infographic]: https://www.microsoft.com/server-cloud/predictivemaintenance/Index.html
[lnk_regression_model]: http://gallery.cortanaanalytics.com/Collection/Predictive-Maintenance-Template-3

[lnk_capture_value]: http://download.microsoft.com/download/0/7/D/07D394CE-185D-4B96-AC3C-9B61179F7080/Capture_value_from_the_Internet%20of%20Things_with_Predictive_Maintenance.PDF
[lnk-faq]: iot-suite-faq.md
[lnk-security-groundup]: securing-iot-ground-up.md
[lnk-azureiotsuite]: https://www.azureiotsuite.com/
[lnk_free_trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-azureiotsuite]: https://www.azureiotsuite.com
[lnk-permissions]: iot-suite-permissions.md
[lnk-portal]: http://portal.azure.com/
[lnk-machine-learning]: https://azure.microsoft.com/services/machine-learning/