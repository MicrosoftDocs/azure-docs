---
title: Create a water quality monitoring app with IoT Central | Microsoft Docs
description: Learn to build Create a water quality monitoring application using Azure IoT Central application templates.
author: miriambrus
ms.author: miriamb
ms.date: 09/24/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: aabjork
---


# Water quality monitoring reference architecture 

A water quality monitoring solution can be built with the **IoT Central Water quality monitoring app template** aas a kickstarter IoT application. This tutorial provides a high level reference architecture guidance on building an end to end solution. 


[!div class="mx-imgBorder"] 
![Water quality monitoring architecture](./media/concepts-waterqualitymonitoring-architecture/concepts-waterqualitymonitoring-architecture1.png)

Concepts:

1. Devices and connectivity  
1. IoT Central 
2. Extensibility and integrations
3. Business applications

Let's take a look at key components that generally play a part in a water quality monitoring solution.

## Devices and connectivity 
Devices used in smart water solutions will generally be connected through low power wide area networks (LPWAN), and throuhg a network operator third-party cloud. For these type of devices you can leverage the Azure IoT Central Device Bridge to send your device data to your IoT application in Azure IoT Central. 

## IoT Central 
Azure IoT Central is a hosted IoT App Platform that dramatically reduces your time-to-value, without having to compromise (you can brand, customize, and integrate with 3rd party services). 
After you connect your smart water devices to IoT Central,it provides out of the box device management, command and control of your devices, monitoring and alerting, and configurable dashboards. 

## Extensibility and integrations 
You can extend your IoT application in IoT Central and optionally:
* transform and integrate your IoT data for advanced analytics, for example training machine learning models, throuhg continous data export from IoT Central application
* automate workflows in other sytems by triggering actions via Microsoft Flow or webhooks from IoT Central application
* programatically access your IoT application in IoT Central through IoT Central APIs

## Business Applications 

The IoT data can be used to power a variety of business applications deployed within a water utility, to visualize business insights and take meaningful actions. To learn how to connecte your IoT Central water quality monitoring application with Dynamics 365 Field Services follow the tutorial on [how to integrate with Dynamics 365 Field Services](tba) 

## Next steps
* Learn how to [create a water quality monitoring](tba) IoT Central application
* Learn more about [IoT Central government templates](tba)
* To learn more about IoT Central, see [IoT Central overview](https://docs.microsoft.com/en-us/azure/iot-central/overview-iot-central)

