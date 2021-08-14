---
title: What are application templates in Azure IoT Central | Microsoft Docs
description: Azure IoT Central application templates allow you to jump in to IoT solution development.
author: ankitscribbles
ms.author: ankitgup
ms.date: 12/19/2020
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---
# What are application templates?

Application templates in Azure IoT Central are a tool to help you kickstart your IoT solution development. You can use app templates for everything from getting a feel for what is possible, to fully customizing your application to resell to your customers.

Application templates consist of:

- Sample dashboards
- Sample device templates
- Simulated devices producing real-time data
- Pre-configured rules and jobs
- Rich documentation including tutorials and how-tos

You choose the application template when you create your application. You can't change the template after the application is created.

## Custom templates

If you want to create your application from scratch, choose the **Custom application** template. The custom application template ID is `iotc-pnp-preview`.

## Industry focused templates

Azure IoT Central is an industry agnostic application platform. Application templates are industry focused examples available for these industries today:

[!INCLUDE [iot-central-template-list](../../../includes/iot-central-template-list.md)]

## Connected logistics

Global logistics spending is expected to reach $10.6 trillion in 2020. Transportation of goods accounts for the majority of this spending and shipping providers are under intense competitive pressure and constraints.

You can use IoT sensors to collect and monitor ambient conditions such as temperature, humidity, tilt, shock, light, and the location of a shipment. You can combine telemetry gathered from IoT sensors and devices with other data sources such as weather and traffic information in cloud-based business intelligence systems.

The benefits of a connected logistics solution include:

* Shipment monitoring with real-time tracing and tracking. 
* Shipment integrity with real-time ambient condition monitoring.
* Security from theft, loss, or damage of shipments.
* Geo-fencing, route optimization, fleet management, and vehicle analytics.
* Forecasting for predictable departure and arrival of shipments.

The following screenshots show the out-of-the-box dashboard in the application template. The dashboard is fully customizable to meet your specific solution requirements:

:::image type="content" source="media/concepts-app-templates/connected-logistics-dashboard-1.png" alt-text="Screenshot that shows the top half of the connected logistics operations dashboard.":::

:::image type="content" source="media/concepts-app-templates/connected-logistics-dashboard-2.png" alt-text="Screenshot that shows the bottom half of the connected logistics operations dashboard.":::

To learn more, see the [Deploy and walk through a connected logistics application template](../retail/tutorial-iot-central-connected-logistics.md) tutorial.

## Digital distribution center

As manufacturers and retailers establish worldwide presences, their supply chains branch out and become more complex. Consumers now expect large selections of products to be available, and for those goods to arrive within one or two days of purchase. Distribution centers must adapt to these trends while overcoming existing inefficiencies.

Today, reliance on manual labor means that picking and packing accounts for 55-65% of distribution center costs. Manual picking and packing are also typically slower than automated systems, and rapidly fluctuating staffing needs make it even harder to meet shipping volumes. This seasonal fluctuation results in high staff turnover and increase the likelihood of costly errors.

Solutions based on IoT enabled cameras can deliver transformational benefits by enabling a digital feedback loop. Data from across the distribution center leads to actionable insights that, in turn, results in better data.

The benefits of a digital distribution center include:

* Cameras monitor goods as they arrive and move through the conveyor system.
* Automatic identification of faulty goods.
* Efficient order tracking.
* Reduced costs, improved productivity, and optimized usage.

The following screenshot shows the out-of-the-box dashboard in the application template. The dashboard is fully customizable to meet your specific solution requirements: 

:::image type="content" source="media/concepts-app-templates/digital-distribution-center-dashboard.png" alt-text="Digital Distribution Center Dashboard":::

To learn more, see the [Deploy and walk through a digital distribution center application template](../retail/tutorial-iot-central-digital-distribution-center.md) tutorial.

## In-store analytics - condition monitoring

For many retailers, environmental conditions within their stores are a key differentiator from their competitors. Retailers want to maintain pleasant conditions within their stores for the benefit of their customers.  

You can use the IoT Central in-store analytics condition monitoring application template to build an end-to-end solution. The application template lets you digitally connect to and monitor a retail store environment using of  different kinds of sensor devices. These sensor devices generate telemetry that you can convert into business insights helping the retailer to reduce operating costs and create a great experience for their customers.

Use the application template to:

* Connect different kinds of IoT sensors to an IoT Central application instance.
* Monitor and manage the health of the sensor network and any gateway devices in the environment.
* Create custom rules around the environmental conditions within a store to trigger  alerts for store managers.
* Transform the environmental conditions within your store into insights that the retail store team can use to improve the customer experience.
* Export the aggregated insights into existing or new business applications to provide useful and timely information to retail staff.

The application template comes with a set of device templates and uses a set of simulated devices to populate the dashboard. 

The following screenshot shows the out-of-the-box dashboard in the application template. The dashboard is fully customizable to meet your specific solution requirements: 

:::image type="content" source="media/concepts-app-templates/in-store-analytics-condition-dashboard.png" alt-text="In-Store Analytics Condition Monitoring":::

To learn more, see the [Create an in-store analytics application in Azure IoT Central](../retail/tutorial-in-store-analytics-create-app.md) tutorial.

## In-store analytics - checkout

For some retailers, the checkout experience within their stores is a key differentiator from their competitors. Retailers want to deliver a smooth checkout experience within their stores to encourage customers to return.  

You can use the IoT Central in-store analytics checkout application template to build a solution that delivers insights from around the checkout zone of a store to retail staff. For example, sensors can provide information about queue lengths and average wait times for each checkout lane.

Use the application template to:

* Connect different kinds of IoT sensors to an IoT Central application instance.
* Monitor and manage the health of the sensor network and any gateway devices in the environment.
* Create custom rules around the checkout condition within a store to trigger alerts for retail staff.
* Transform the checkout conditions within the store into insights that the retail store team can use to improve the customer experience.
* Export the aggregated insights into existing or new business applications to provide useful and timely information to retail staff.

The application template comes with a set of device templates and uses a set of simulated devices to populate the dashboard with lane occupancy data. 

The following screenshot shows the out-of-the-box dashboard in the application template. The dashboard is fully customizable to meet your specific solution requirements: 

:::image type="content" source="media/concepts-app-templates/In-Store-Analytics-Checkout-Dashboard.png" alt-text="In-Store Analytics Checkout":::

To learn more, see the [Create an in-store analytics application in Azure IoT Central](../retail/tutorial-in-store-analytics-create-app.md) tutorial.

## Smart inventory management

Inventory is the stock of goods a retailer holds. Inventory management is critical to ensure the right product is in the right place at the right time. A retailer must balance the costs of storing too much inventory against the costs of not having sufficient items in stock to meet demand.

IoT data generated from radio-frequency identification (RFID) tags, beacons, and cameras provide opportunities to improve inventory management processes. You can combine telemetry gathered from IoT sensors and devices with other data sources such as weather and traffic information in cloud-based business intelligence systems.

The benefits of smart inventory management include:

* Reducing the risk of items being out of stock and ensuring the desired customer service level. 
* In-depth analysis and insights into inventory accuracy in near real time.
* Tools to help decide on the right amount of inventory to hold to meet customer orders.

This application template focuses on device connectivity, and the configuration and management of RFID and Bluetooth low energy (BLE) reader devices.

The following screenshot shows the out-of-the-box dashboard in the application template. The dashboard is fully customizable to meet your specific solution requirements:

:::image type="content" source="media/concepts-app-templates/smart-inventory-management-dashboard.png" alt-text="Smart Inventory Management Dashboard":::

To learn more, see the [Deploy and walk through a smart inventory management application template](../retail/tutorial-iot-central-smart-inventory-management.md) tutorial.

## Micro-fulfillment center

In the increasingly competitive retail landscape, retailers constantly face pressure to close the gap between demand and fulfillment. A new trend that has emerged to address the growing consumer demand is to house inventory near the end customers and the stores they visit.

The IoT Central micro-fulfillment center application template enables you to monitor and manage all aspects of your fully automated fulfillment centers. The template includes a set of simulated condition monitoring sensors and robotic carriers to accelerate the solution development process. These sensor devices capture meaningful signals that can be converted into business insights allowing retailers to reduce their operating costs and create experiences for their customers.

The application template enables you to: 

- Seamlessly connect different kinds of IoT sensors such as robots or condition monitoring sensors to an IoT Central application instance.
- Monitor and manage the health of the sensor network, and any gateway devices in the environment.
- Create custom rules around the environmental conditions within a fulfillment center to trigger appropriate alerts.
- Transform the environmental conditions within your fulfillment center into insights that can be leveraged by the retail warehouse team.
- Export the aggregated insights into existing or new business applications for the benefit of the retail staff members.

The following screenshot shows the out-of-the-box dashboard in the application template. The dashboard is fully customizable to meet your specific solution requirements:

:::image type="content" source="media/concepts-app-templates/MFC-Dashboard.png" alt-text="Micro-fulfillment Center":::

To learn more, see the [Deploy and walk through the micro-fulfillment center application template](../retail/tutorial-micro-fulfillment-center.md) tutorial.

## Video analytics - object and motion detection

The *IoT Central video analytics - object and motion detection* application template lets you quickly experience how to deploy, manage, and monitor a solution that uses intelligent edge cameras to detect objects and motion.

The video analytics application uses a [live video analytics (LVA)](#live-video-analytics) module running in IoT Edge. The LVA module provides a platform for you to build intelligent video applications that span the edge and the cloud. You can use the platform to enhance IoT solutions, such as the video analytics application, with object and motion detection.

The application template includes four application dashboards:

* **Getting Started** provides links to resources to help you get started using the application template.

- **Demo Dashboard** provides an illustration of the types of information you can display from your connected cameras.
- **(Sample) Real Camera Management** uses simulated cameras to show how you can manage your cameras from the application.
- **(Sample) Real Camera Monitor** uses simulated cameras to show how you can monitor your cameras from the application.

:::image type="content" source="media/concepts-app-templates/live-video-analytics.png" alt-text="Video analytics - object and motion detection":::

To learn how to deploy the solution, see the [Create a video analytics application in Azure IoT Central](../retail/tutorial-video-analytics-deploy.md) tutorial.

### Live video analytics

[Live video analytics](https://github.com/Azure/live-video-analytics) provides a platform for you to build intelligent video applications that span the edge and the cloud. The platform offers the capability to capture, record, analyze live video, and publish the results, which could be video or video analytics, to Azure services. The Azure services could be running in the cloud or the edge. You can use the platform to enhance IoT solutions with video analytics.

## Smart meter monitoring

 The smart meters not only enable automated billing, but also advanced metering use cases such as real-time readings and bi-directional communication. The smart meter app template enables utilities and partners to monitor smart meters status and data, define alarms and notifications. It provides sample commands, such as disconnect meter and update software. The meter data can be set up to egress to other business applications and to develop custom solutions. 

App's key functionalities:

- Meter sample device model
- Meter info and live status
- Meter readings such as energy, power, and voltages
- Meter command samples 
- Built-in visualization and dashboards
- Extensibility for custom solution development

You can try the [smart meter monitoring app for free](https://apps.azureiotcentral.com/build/new/smart-meter-monitoring) without an Azure subscription, and any commitments.

After you deploy the app, you'll see the simulated meter data on the dashboard, as shown in the figure below. This template is a sample app that you can easily extend and customize for your specific use cases.

:::image type="content" source="media/concepts-app-templates/smart-meter-app-dashboard.png" alt-text="Smart Meter App Dashboard":::

## Solar panel monitoring

The solar panel monitoring app enables utilities and partners to monitor solar panels, such as their energy generation and connection status in near real time. It can send notifications based on defined threshold criteria. It provides sample commands, such as update firmware and other properties. The solar panel data can be set up to egress to other business applications and to develop custom solutions. 

App's key functionalities: 

- Solar panel sample device model 
- Solar Panel info and live status
- Solar energy generation and other readings
- Command and control samples
- Built-in visualization and dashboards
- Extensibility for custom solution development

You can try the [solar panel monitoring app for free](https://apps.azureiotcentral.com/build/new/solar-panel-monitoring) without an Azure subscription and any commitments.

After you deploy the app, you'll see the simulated solar panel data within 1-2 minutes, as shown in the dashboard below. This template is a sample app that you can easily extend and customize for your specific use cases. 

:::image type="content" source="media/concepts-app-templates/solar-panel-app-dashboard.png" alt-text="Solar Panel App Dashboard":::

## Water Quality Monitoring

Traditional water quality monitoring relies on manual sampling techniques and field laboratory analysis, which is time consuming and costly. By remotely monitoring water quality in real-time, water quality issues can be managed before citizens are affected. Moreover, with advanced analytics, water utilities, and environmental agencies can act on early warnings on potential water quality issues and plan on water treatment in advance.  

Water Quality Monitoring app is an IoT Central app template to help you kickstart your IoT solution development and enable water utilities to digitally monitor water quality in smart cities.

:::image type="content" source="media/concepts-app-templates/water-quality-monitoring-dashboard-full.png" alt-text="Water Quality Monitoring App template":::

The App template consists of:

- Sample dashboards
- Sample water quality monitor device templates
- Simulated water quality monitor devices
- Pre-configured rules and jobs
- Branding using white labeling 

Get started with the [Water Quality Monitoring application tutorial](../government/tutorial-water-quality-monitoring.md).

## Water Consumption Monitoring

Traditional water consumption tracking relies on water operators manually reading water consumption meters at the meter sites. More and more cities are replacing traditional meters with advanced smart meters enabling remote monitoring of consumption and remotely controlling valves to control water flow. Water consumption monitoring coupled with digital feedback message to the citizen can increase awareness and reduce water consumption. 

Water Consumption Monitoring app is an IoT Central app template to help you kickstart your IoT solution development to enable water utilities and cities to remotely monitor and control water flow to reduce consumption. 

:::image type="content" source="media/concepts-app-templates/water-consumption-monitoring-dashboard-full.png" alt-text="Water Consumption Monitoring App template":::

The Water Consumption Monitoring app template consists of pre-configured:

- Sample dashboards
- Sample water quality monitor device templates
- Simulated water quality monitor devices
- Pre-configured rules and jobs
- Branding using white labeling

 Get started with the [Water Consumption Monitoring application tutorial](../government/tutorial-water-consumption-monitoring.md).

## Connected Waste Management 

Connected Waste Management app is an IoT Central app template to help you kickstart your IoT solution development to enable smart cities to remotely monitor to maximize efficient waste collection. 

:::image type="content" source="media/concepts-app-templates/connected-waste-management-dashboard.png" alt-text="Connected Waste Management App template":::

The Connected Waste Management app template consist of pre-configured:

- Sample dashboards
- Sample connected waste bin device templates
- Simulated connected waste bin devices
- Pre-configured rules and jobs
- Branding using white labeling 

Get started with the [Connected Waste Management application tutorial](../government/tutorial-connected-waste-management.md).

## Continuous patient monitoring 

In the healthcare IoT space, Continuous Patient Monitoring is one of the key enablers of reducing the risk of readmissions, managing chronic diseases more effectively, and improving patient outcomes. Continuous Patient Monitoring can be split into two major categories:

1. **In-patient monitoring**: Using medical wearables and other devices in the hospital, care teams can monitor patient vital signs and medical conditions without having to send a nurse to check up on a patient multiple times a day. Care teams can understand the moment that a patient needs critical attention through notifications and prioritizes their time effectively.
1. **Remote patient monitoring**: By using medical wearables and patient reported outcomes (PROs) to monitor patients outside of the hospital, the risk of readmission can be lowered. Data from chronic disease patients and rehabilitation patients can be collected to ensure that patients are adhering to care plans and that alerts of patient deterioration can be surfaced to care teams before they become critical.

This application template can be used to build solutions for both categories of Continuous Patient Monitoring. The benefits include:

- Seamlessly connect different kinds of medical wearables to an IoT Central instance.
- Monitor and manage the devices to ensure they remain healthy.
- Create custom rules around device data to trigger appropriate alerts.
- Export your patient health data to the Azure API for FHIR, a compliant data store.
- Export the aggregated insights into existing or new business applications.

:::image type="content" source="media/concepts-app-templates/in-patient-dashboard.png" alt-text="CPM-dashboard":::


## Next steps

Now that you know what IoT Central application templates are, get started by [creating an IoT Central Application](quick-deploy-iot-central.md).
