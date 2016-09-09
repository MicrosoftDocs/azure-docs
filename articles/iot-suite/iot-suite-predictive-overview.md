<properties
 pageTitle="Predictive maintenance preconfigured solution | Microsoft Azure"
 description="A description of the Azure IoT predictive maintenance preconfigured solution."
 services=""
 suite="iot-suite"
 documentationCenter=""
 authors="stevehob"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-suite"
 ms.devlang="na"
 ms.topic="get-started-article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="05/24/2016"
 ms.author="stevehob"/>

# Predictive maintenance preconfigured solution overview

The *predictive maintenance* preconfigured solution is one of the [preconfigured solutions][lnk_preconfigured_solutions] released as part of [Microsoft Azure IoT Suite][lnk_iot_suite]. This solution integrates real-time device telemetry collection with a predictive model created using [Azure Machine Learning][lnk_machine_learning].


With Azure IoT Suite, enterprises can quickly and easily connect to and monitor assets, and analyze data in real time. The predictive maintenance preconfigured solution takes that data and uses rich dashboards and visualizations to provide businesses with new intelligence that can drive efficiencies and enhance revenue streams.

## The Scenario

Fabrikam is a regional airline that focuses on great customer experience at competitive prices. One cause of flight delays is maintenance issues and aircraft engine maintenance is particularly challenging. Engine failure during flight must be avoided at all costs, so Fabrikam inspects its engines regularly and adheres to a scheduled maintenance program. However, aircraft engines don’t always wear the same. Some unnecessary maintenance is performed on engines. More importantly, issues arise which can ground an aircraft until maintenance is performed. This causes costly delays, especially if an aircraft is at a location where the right technicians or spare parts are not available.

The engines of Fabrikam’s aircraft are instrumented with sensors which monitor engine conditions during flight. Fabrikam use Azure IoT Suite to collect the sensor data collected during the flight. After accumulating years of engine operational and failure data, Fabrikam’s data scientists have modeled a way to predict the Remaining Useful Life (RUL) of an aircraft engine. What they have identified is a correlation between the data from four of the engine sensors with the engine wear that leads to eventual failure. While Fabrikam continues to perform regular inspections to ensure safety, it can now use the models to compute the RUL for each engine after every flight using the telemetry collected from the engines during the flight. Fabrikam can now predict future points of failure and plan for maintenance and repair in advance.

> [AZURE.NOTE] The solution model uses actual engine wear data.

By predicting the point when maintenance is required, Fabrikam can optimize its operations to reduce costs. Maintenance coordinators work with schedulers to plan maintenance coinciding with an aircraft stopping at a particular location and ensuring sufficient time for the aircraft to be out of service without causing schedule disruption. Fabrikam can schedule technicians accordingly; ensuring aircraft are serviced efficiently without wait time. Inventory control managers receive maintenance plans, so they can optimize their ordering process and spare parts inventory. All of this enables Fabrikam to minimize aircraft ground time and to reduce operating costs while ensuring the safety of passengers and crew.

To understand how [Azure IoT Suite][lnk_iot_suite] provides the capabilities customers need to realize the potential of predictive maintenance, please review this [infographic][lnk_infographic].

## How the predictive maintenance solution is built

The solution leverages an existing Azure Machine Learning model available as a template to show these capabilities working from device telemetry collected through IoT Suite services. Microsoft has built a [regression model][lnk_regression_model] of an aircraft engine and published the complete template, data<sup>\[1\]</sup>, and step-by-step guidance on how to use the model.

The Azure IoT predictive maintenance preconfigured solution uses the regression model created from this template; it is deployed into your Azure subscription and exposed through an automatically generated API. The solution includes a subset of the testing data representing 4 (of 100 total) engines and the 4 (of 21 total) sensor data streams which provide an accurate result from the trained model.

*\[1\] A. Saxena and K. Goebel (2008). "Turbofan Engine Degradation Simulation Data Set", NASA Ames Prognostics Data Repository (http://ti.arc.nasa.gov/tech/dash/pcoe/prognostic-data-repository/), NASA Ames Research Center, Moffett Field, CA*

## Next steps

To learn more about how Azure IoT enables predictive maintenance scenarios, read [Capture value from the Internet of Things][lnk_capture_value].

Take a [walkthrough][lnk-predictive-walkthrough] of the predictive maintenance preconfigured solution.

[lnk-predictive-walkthrough]: iot-suite-predictive-walkthrough.md
[lnk_preconfigured_solutions]: iot-suite-what-are-preconfigured-solutions.md
[lnk_iot_suite]: iot-suite-overview.md
[lnk_machine_learning]: https://azure.microsoft.com/services/machine-learning/
[lnk_infographic]: https://www.microsoft.com/server-cloud/predictivemaintenance/Index.html
[lnk_regression_model]: http://gallery.cortanaanalytics.com/Collection/Predictive-Maintenance-Template-3
[lnk_capture_value]: http://download.microsoft.com/download/0/7/D/07D394CE-185D-4B96-AC3C-9B61179F7080/Capture_value_from_the_Internet%20of%20Things_with_Predictive_Maintenance.PDF

You can also explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

- [Frequently asked questions for IoT Suite][lnk-faq]
- [IoT security from the ground up][lnk-security-groundup]

[lnk-faq]: iot-suite-faq.md
[lnk-security-groundup]: securing-iot-ground-up.md