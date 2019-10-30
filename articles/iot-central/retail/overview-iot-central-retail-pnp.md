---
title: Building retail solutions with Azure IoT Central | Microsoft Docs
description: Learn to build connected logistics, digital distribution center, in-store analytics condition monitoring, checkout, and smart inventory management, retail solutions with Azure IoT Central using application templates.
author: KishorIoT
ms.author: nandab
ms.date: 10/22/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
ms.custom: [iot-p0-scenario]
---

# Building retail solutions with Azure IoT Central

[!INCLUDE [iot-central-pnp-original](../../../includes/iot-central-pnp-original-note.md)]

Azure IoT Central is an Internet of Things (IoT) app platform for solution builders that simplifies the challenges of building & managing scalable applications. In this article, we will highlight several retail-specific application templates within IoT Central. Solution builders can leverage published templates to build IoT solutions to optimize supply chain, improve in-store experience for customers, and track inventory more efficiently.

> [!div class="mx-imgBorder"]
> ![Azure IoT Retail Overview](./media/overview-iot-central-retail/retail-app-templates.png)


## What is connected logistics solution?
Global logistics spending is expected to reach $10.6trn in 2020, the largest GDP by industry. Transportation of goods is the majority (70%) of total logistics expenses. Shipping providers are under intense competitive pressure and constraints. 3PL providers are dealing with ever-decreasing time frames and rising compensation costs. Logistics is further strained by the risks posed by geopolitical, extreme climatic events, and crime. 

With the help of IoT sensors, we can collect & monitor ambient conditions i.e., Temperature, Humidity, Tilt, Shock, Light, and shipment’s location via GPS across multi-modal transformation i.e., Air, Water, Ground. Data gathered from sensors, devices, weather, & events can be integrated with cloud-based Business Intelligence systems. 
Connected logistics solution benefits are,
* Shipment transference with real-time tracing & tracking 
* Shipment integrity with real-time ambient conditions monitoring & cold chain
* Security from theft, loss, or damage of shipment
* Geo-Fencing, Route Optimization, Fleet management. Vehicle analytics
* Forecasting & predictability with the departure & arrivals 

### Out of box experience
Partners can leverage template to develop end to end Connected Logistics solutions & outlined benefits. This published template is focused on device connectivity, configuration & management of devices in IoT Central. 

> [!div class="mx-imgBorder"]
> ![Connected Logistics Dashboard](./media/overview-iot-central-retail/connected-logistics-dashboard1.png)

> [!div class="mx-imgBorder"]
> ![Connected Logistics Dashboard](./media/overview-iot-central-retail/connected-logistics-dashboard2.png)

Please note that the above dashboard is a sample experience and you can completely customize this application to fit your desired use case.

Get started with [end to end tutorial](./tutorial-iot-central-connected-logistics-pnp.md) that walks you through how to build a solution leveraging one of the connected logistics solution templates.



## What is digital distribution center solution?
As more manufacturers and retailers establish worldwide presences, their supply chains have branched out to become more complex than ever before. Distribution centers are becoming a primary challenge. Distribution Center/Warehouses are feeling the brunt of the pressure from e-commerce. Consumers now expect vast selections of products to be available, and for those goods to arrive within one to two days of purchase. Distribution centers must adapt to these trends while overcoming existing inefficiencies. 

Today, an overreliance on manual labor means picking and packing accounts for 55-65% of distribution center costs. While it is bad that manual labor slows down distribution center, rapidly fluctuating staffing needs (holiday staffing go up by 10X) make it even harder to meet shipping volumes. This seasonal fluctuation results in high turnover and the likelihood of errors and the need for costly rework increases as well.
Solutions based on IoT enabled cameras can deliver transformational benefits by enabling a digital feedback loop. This influx of data from across the distribution center leads to actionable insights that, in turn, result in better data.

Benefits are, 
* Cameras monitor goods as they arrive and move through the conveyor system
* Identify faulty goods and send them for repair
* Efficiently keep track of orders
* Reduce cost, improved productivity & Maximize utilization

### Out of box experience
Partners can leverage this application template to build Digital Distribution Center to gain actionable insights & above outlined benefits. The published template is focused on device connectivity configuration & management of camera and edge devices in IoT Central. 

> [!div class="mx-imgBorder"]
> ![Digital Distribution Center Dashboard](./media/overview-iot-central-retail/digital-distribution-center-dashboard.png)

Please note that the above dashboard is a sample experience and you can completely customize this application to fit your desired use case.

Get started with [end to end tutorial](./tutorial-iot-central-digital-distribution-center-pnp.md) that walks you through how to build a solution leveraging one of the digital distribution center templates.



## What is in-store analytics condition monitoring?
In today's competitive landscape, retailers are looking for new ways to offer customers something unique or special in order to drive traffic through their physical stores. Many retailers acknowledge the importance of environmental conditions within their store as a tool to differentiate with their competitors. Retailers want to ensure that they maintain pleasant conditions within their stores at all times to deliver a comfortable experience to their customers.  

The In-Store Analytics Condition Monitoring application template within IoT Central provides the solution builder with a canvas that can be utilized to build an end to end solution. The application template allows them to digitally connect and monitor a retail store environment using a variety of sensor devices. These sensor devices capture meaningful signals that can be converted into business insights allowing retailers to reduce their operating costs and create experiences that their customers love.

The application template allows you to:

*  Seamlessly connect a variety of IoT sensors to an IoT Central application instance.
*  Monitor and manage the health of the sensor network as well as gateway devices in the environment.
*  Create custom rules around the environmental conditions within a store to trigger appropriate alerts.
*  Transform the environment conditions within your store into insights that can be leveraged by the retail store team.
* Export the aggregated insights into existing or new business applications empowering the retail staff members.

### Out of box experience
The application template comes with a set of device templates and an operator experience out of the box. It leverages a set of simulated devices to populate the dashboard elements. Once you deploy an IoT Central application using the [In-Store Analytics Condition Monitoring](https://aka.ms/conditiontemplate) app template, you will land on the default application dashboard as shown below. 

> [!div class="mx-imgBorder"]
> ![In-Store Analytics Condition Monitoring](./media/overview-iot-central-retail/in-store-analytics-condition-dashboard.png)

Please note that the above dashboard is a sample experience and you can completely customize this application to fit your desired use case. 

Get started with [end to end tutorial](./tutorial-in-store-analytics-create-app-pnp.md) that walks you through how to build a solution leveraging one of the in-store analytics condition monitoring templates.



## What is in-store analytics checkout?
In the increasingly competitive landscape, modern retailers constantly face growing pressure to deliver an in-store experience that exceeds customer expectations and keeps them coming back. While several retailers have started deploying technology to meet this need, an area that goes largely unnoticed is the checkout experience.

The In-Store Analytics Checkout application template within IoT Central enables solution builders to build experiences that empower retail staff with meaningful insights around the checkout zone of their store. It leverages a set of simulated devices to determine the occupancy status for each of the checkout lanes within a retail store. The sensors allow you to capture the people count as well as the average wait time for each of the checkout lanes.

The template helps the solution builder accelerate their go-to-market plans by providing a baseline IoT solution that enables them to: 

* Seamlessly connect a variety of IoT sensors to an IoT Central application instance.
* Monitor and manage the health of the sensor network as well as gateway devices in the environment.
* Create custom rules around the checkout condition within a store to trigger appropriate alerts.
* Transform the checkout conditions within your store into insights that can be leveraged by the retail store team.
* Export the aggregated insights into existing or new business applications empowering the retail staff members.

### Out of box experience
The application template comes with a set of device templates and an operator experience out of the box. It leverages a set of simulated devices to populate the dashboard elements. Once you deploy an IoT Central application using the [In-Store Analytics Checkout](https://aka.ms/checkouttemplate) app template, you will land on the default application dashboard as shown below. 

> [!div class="mx-imgBorder"]
> ![In-Store Analytics Checkout](./media/overview-iot-central-retail/In-Store-Analytics-Checkout-Dashboard.png)

Please note that the above dashboard is a sample experience and you can completely customize this application to fit your desired use case. 


Get started with [end to end tutorial](./tutorial-in-store-analytics-create-app-pnp.md) that walks you through how to build a solution leveraging one of the in-store analytics checkout templates.


## What is smart inventory management solution?
"Inventory" is the stock of goods held by a retailer. Every retailer needs inventory to take care of supply and logistics lead time. Inventory is arguably the most valuable resource that every retailer needs to trade. In today's omnichannel world, inventory management is a critical requirement to ensure the right product is in the right place at the right time. Storing too much or too little inventory could hurt the retailer's business. Every year retailers are losing 8-10% of the revenue due to lack of inventory management capabilities.

IoT data enabled by Radio-frequency identification(RFID), Beacons & Camera is the opportunity to tackle this massive challenge in scale. The connectivity and real-time analytics inherent in IoT signals have become 
the game-changer for the retailer's inventory woes.  Data gathered from sensors, devices, weather, & events can be integrated with cloud-based Business Intelligence systems.  
Smart Inventory management benefits are, 
* Safeguards the organization against stock-outs and ensures the desired customer service level. 
* In-depth analysis & insights into inventory accuracy in near real time
* Decide on the right amount of inventory that suffices the customer orders

### Out of box experience
Partners can leverage template to develop end to end Smart inventory management solutions & outlined benefits. This published template is focused on device connectivity, configuration & management of RFID & Bluetooth low energy (BLE) readers in IoT Central. 

> [!div class="mx-imgBorder"]
> ![Smart Inventory Management Dashboard](./media/overview-iot-central-retail/smart-inventory-management-dashboard.png)

Please note that the above dashboard is a sample experience and you can completely customize this application to fit your desired use case. 

Get started with [end to end tutorial](./tutorial-iot-central-smart-inventory-management-pnp.md) that walks you through how to build a solution leveraging one of the smart inventory management templates.


## Next steps
To get started building a retail solution:
* Get started with the [end to end tutorial](./tutorial-in-store-analytics-create-app-pnp.md) that walks you through how to build a solution leveraging one of the In-Store Analytics application templates.
* Learn how to deploy [connected logistics solution template](./tutorial-iot-central-connected-logistics-pnp.md)
* Learn how to deploy [digital distribution center template](./tutorial-iot-central-digital-distribution-center-pnp.md)
* Learn how to deploy [smart inventory management template](./tutorial-iot-central-smart-inventory-management-pnp.md)
* Learn more about IoT Central refer to [IoT Central overview](../core/overview-iot-central-pnp.md)
