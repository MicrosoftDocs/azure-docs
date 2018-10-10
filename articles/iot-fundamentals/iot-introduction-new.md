---
title: Introduction to the Azure Internet of Things (IoT)
description: Overview of Azure IoT and the IoT services
author: robinsh
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: overview
ms.date: 10/11/2018
ms.author: robinsh
---

# Introduction to Azure Internet of Things (IoT)

The Azure Internet of Things (IoT) is a collection of Microsoft-managed cloud services that connect, monitor, and control billions of IoT assets. More specifically, it is comprised of one or more IoT devices and one or more back-end solutions that communicate with each other. Devices are generally made up of a circuit board with censors attached that connect to the internet to communicate via a Wi-Fi chip. The basic MX Chip IoT Devkit has sensors for temperature, pressure, humidity, [fill in the rest], among others. The Raspberry PI is a basic IoT device to which you can attach many different kinds of sensors.

## IoT device task examples

* Query for information. An example of this would be asking an Azure Maps back-end for directions.

* Send analytic information that will later be reviewed with a Big Data application such as HD Insight. 

* Retrieve data from a piece of equipment with the intention of providing alerts or triggering behaviors when specific conditions are met.

* Provide data to other line-of-business applications.

* Provide information to human operators through a dashboard.

## Examples of IoT solutions

>[!NOTE]
> I made these up. I'm not married to them, so if you have a better idea, please let me know. 
> --Robin
>

* Register the temperature in a room and turn the heat or air conditioning on or off based on that temperature. You might have one of these in your house -- a thermostat that you can set from a website using your mobile device. In this case, a back-end solution regularly queries the device for the current temperature and acts accordingly. The back-end solution also takes commands given through the website to change the temperature.

* In a manufacturing plant, watch the temperature of a mix batch tank and provide alerts via text or e-mail when the temperature is outside of an allowable range. In this case, the device could be queried from the back-end to get the current temperature and pressure. If the parameters are out of range, the back-end sends an e-mail notification, or sends message to an alert system.

* Host a website featuring a map of your facility, and provide directions from the customer's location to your main office. In this case, a mobile app could be used to let the customer navigate the map of your facility.

* Keep track of when a door is opened or closed, locked or unlocked. For example, an electronic door lock could be triggered from your mobile phone. Another example is in managing an office building, the back-end keeps track of the current state of the doors for the purpose of security. In these cases, the devices query the door state and, if applicable, send a message to unlock or lock the door.

* Send biometric information on a regular basis from the device to the back-end and act on the data as needed. For example, a rancher who has a million cows finds it difficult and time consuming to check on the cows on a regular basis and make sure they aren't ill or stuck in one place for longer than a half day, etc. He attaches to each cow an IoT biometric device that provides GPS, temperature, and other data. This data is sent to the back-end every 5 minutes and stored in a data repository. Another back-end solution performs analysis services regularly on the data and sends notifications to a dashboard that shows possible problems. For example, if a cow is running a temperature, the rancher uses the GPS coordinates to locate the cow and check on it, maybe treating the cow with antibiotics.

## IoT Services

There are several IoT-related services in Azure and it can be confusing to figure out which one you want to use. Some provide templates to help you create your own solution. You can also fully develop your own solutions using other services available -- it all depends on how much help you want, and how much control. Here is a list of the services available, as well as what you may use them for.

1. [**IoT Central**](../iot-central/overview-iot-central.md): This is a SaaS solution that helps you connect, monitor, and manage your ioT devices. To start, you select a template for your device type and create and test a basic IoT Central application that the operators of the device will use. The IoT Central application will also enable you to monitor the devices and provision new devices. This service is for straightforward solutions that don't require deep service customization. No coding skills are required to use this service.

2. [**IoT solution accelerators**](/azure/iot-suite): This service is a collection of PaaS solutions you can use to accelerate your development of an IoT solution. You start with a provided IoT solution and then fully customize that solution to your requirements. You need Java or .NET skills to customize the back-end, and JavaScript skills to customize the visualization. 

3. [**IoT Hub**](/azure/iot-hub/): This service allows you to connect from your devices to an IoT hub, and monitor and control billions of IoT devices. This is especially useful if you have bi-directional communication between your IoT devices and your back-end. This is the underlying service for IoT Central and IoT solution accelerators. 

4. [**IoT Hub Device Provisioning Service**](/azure/iot-dps/): This is a helper service for IoT Hub that you can use to provision devices to your IoT hub securely. With this service, you can easily provision millions of devices rapidly, rather than provisioning them one by one. 

5. [**IoT Edge**](/azure/iot-edge/): This service builds on top of IoT Hub. It can be used to analyze data on the IoT devices rather than in the cloud. By moving parts of your workload to the edge, your devices can spend less time sending messages to the cloud and react more quickly to changes in status.

6. [**Time Series Insights**](/azure/time-series-insights): This service enables you to store, visualize, and query large amounts of time series data generated by IoT devices. You can use this service with IoT Hub or Azure Event Hub. 

7. [**Azure Maps**](/azure/azure-maps): This service provides geographic information to web and mobile applications. There is a full set of REST APIs as well as a web-based JavaScript control that can be used to create flexible applications that work on desktop or mobile applications for both Apple and Windows devices.

## Next steps

For some actual business cases and the architecture used, see the [Microsoft Azure IoT Technical Case Studies](https://microsoft.github.io/techcasestudies/#technology=IoT&sortBy=featured).

For some sample projects that you can try out with an IoT DevKit, see the [IoT DevKit Project Catalog](https://microsoft.github.io/azure-iot-developer-kit/docs/projects/). 

For a more comprehensive explanation of the different services and how they are used, see [Azure IoT services and technologies](iot-services-and-technologies.md).

For an in-depth discussion of IoT architecture, see the [Microsoft Azure IoT Reference Architecture](https://aka.ms/iotrefarchitecture).

