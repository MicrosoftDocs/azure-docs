---
title: Introduction to the Azure Internet of Things (IoT)
description: Overview of Azure IoT and the IoT services
author: robinsh
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: overview
ms.date: 10/11/2018
ms.author: robinsh
#Customer intent: As a newcomer to IoT, I want to understand what IoT is, and services are available, so I can figure out where to start.
---

# What is IoT?

The Azure Internet of Things (IoT) is a collection of Microsoft-managed cloud services that connect, monitor, and control billions of IoT assets. In simpler terms, an IoT solution is made up of one or more IoT devices and one or more back-end solutions that communicate with each other. 

This article discusses the basics of IoT, talks about use cases, and briefly explains the eight separate services available. By understanding what's available, you can figure out what you want to look at more closely to help designing your scenario.

## Introduction

The main parts of an IoT solution are as follows: devices, back-end services, the communication channel between the two. 

## IoT devices

Devices are generally made up of a circuit board with censors attached that connect to the internet. Many devices communicate via a Wi-Fi chip. For example, two such devices are the basic MX Chip IoT Devkit from Microsoft and Raspberry PI devices. The MX Chip Devkit has sensors built in for temperature, pressure, humidity, as wwell as a gyroscope and accelerometer, a magnetometer and a Wi-Fi chip. Raspberry PI is an IoT device to which you can attach many different kinds of sensors, so you can select exactly what you need for your scenario. 

## Communication

Your device can communicate with back-end services in both directions. Here are some examples of ways that the device can communicate with the back-end solution.

### Examples 

* Your device may send telemetry data (such as temperature) every 5 minutes to an IoT Hub. The hub in turn routes it to Blob storage for analysis at a later time with HD Insight.

* Changes to your device's configuration -- or specific data -- could be pushed to the device from your back-end service.

* Your device can send alerts based on the values read from its sensors. For example, if monitoring a batch reactor in a chemical plant, you may want to send an alert when the temperatures exceeds a certain value.

* Your device can send information to a dashboard for viewing by human operators. For example, a control room in a refinery may show the temperature and pressure of each pipe, as well as the volume flowing through that pipe, allowing the operators to watch it. 

### Connection Considerations

Connecting devices securely and reliably is often the biggest challenge in IoT solutions. This is because IoT devices have different characteristics when compared to other clients such as browsers and mobile apps. Specifically, IoT devices:

* Are often embedded systems with no human operator (unlike a phone).

* Can be deployed in remote locations, where physical access is expensive.

* May only be reachable through the solution back end. There is no other way to interact with the device.

* May have limited power and processing resources.

* May have intermittent, slow, or expensive network connectivity.

* May need to use proprietary, custom, or industry-specific application protocols.

## Back-end services 

Here are some of the functions a back-end service can provide.

* Receiving telemetry data at scale from your devices, and determining how to process and store that data.

* Analyzing the telemetry to provide insights, either in real time or after the fact.

* Sending commands from the cloud or a gateway device to a specific device. 

* Provisioning devices and control which devices can connect to your infrastructure.

* Control the state of your devices and monitor their activities.

For example, in a predictive maintenance scenario, the cloud back-end stores historical telemetry data. The solution uses this data to identify potential anomalous behavior on specific pumps before they cause a real problem. Using data analytics, it can identify that the preventative solution is to send a command back to the device to take a corrective action. This process generates an automated feedback loop between the device and the cloud that greatly increases the solution efficiency.

## An IoT example

Here is an example of how one company used IoT to save millions of dollars. 

There is a huge cattle ranch with hundreds of thousands of cows. It's a big deal to keep track of that many cows, and know how they're doing, and requires a lot of driving around. They attached sensors to every single cow, sending information such as the GPS coordinates and temperature to a back-end service to be written to a database.

Then they have an analytical service that scans the incoming data and analyzes the data for each cow to check questions like these:

* Is the cow running a temperature? How long has the cow been running a temperature? If it has been longer than a day, get the GPS coordinates and go find the cow, and if appropriate, treat it with antibiotics. 

* Is the cow in the same place for more than a day? If so, get the GPS coordinates and go find the cow. Has it fallen off of a cliff? Is it injured? Does it need help? 

Implementing this IoT solution made it possible for the company to check and treat the cows quickly, and cut down on the amount of time they had to spend driving around checking on their animals, saving them a lot of money. For more real-life examples of how companies use IoT, see [Microsoft Technical Case Studies for IoT](https://microsoft.github.io/techcasestudies/#technology=IoT&sortBy=featured). 

## IoT Services

There are several IoT-related services in Azure and it can be confusing to figure out which one you want to use. Some provide templates to help you create your own solution. You can also fully develop your own solutions using other services available -- it all depends on how much help you want, and how much control. Here is a list of the services available, as well as what you may use them for.

1. [**IoT Central**](../iot-central/overview-iot-central.md): This is a SaaS solution that helps you connect, monitor, and manage your ioT devices. To start, you select a template for your device type and create and test a basic IoT Central application that the operators of the device will use. The IoT Central application will also enable you to monitor the devices and provision new devices. This service is for straightforward solutions that don't require deep service customization. No coding skills are required to use this service.

2. [**IoT solution accelerators**](/azure/iot-suite): This service is a collection of PaaS solutions you can use to accelerate your development of an IoT solution. You start with a provided IoT solution and then fully customize that solution to your requirements. You need Java or .NET skills to customize the back-end, and JavaScript skills to customize the visualization. 

3. [**IoT Hub**](/azure/iot-hub/): This service allows you to connect from your devices to an IoT hub, and monitor and control billions of IoT devices. This is especially useful if you need bi-directional communication between your IoT devices and your back-end. This is the underlying service for IoT Central and IoT solution accelerators. 

4. [**IoT Hub Device Provisioning Service**](/azure/iot-dps/): This is a helper service for IoT Hub that you can use to provision devices to your IoT hub securely. With this service, you can easily provision millions of devices rapidly, rather than provisioning them one by one. 

5. [**IoT Edge**](/azure/iot-edge/): This service builds on top of IoT Hub. It can be used to analyze data on the IoT devices rather than in the cloud. By moving parts of your workload to the edge, your devices can spend less time sending messages to the cloud and react more quickly to changes in status.

6. [**Azure Digital Twins**](/azure/azure-digital-twins/): This service enables you to create comprehensive models of the physical environment. You can create spatial ingelligence graphs to model the relationships and interactions bewteen people, spaces, and devices. For example, you can predict maintenance needs for a factory, analyze real-time energy requirements for an electrical grid, or optimize the use of available space for an office.

7. [**Time Series Insights**](/azure/time-series-insights): This service enables you to store, visualize, and query large amounts of time series data generated by IoT devices. You can use this service with IoT Hub or Azure Event Hub. 

8. [**Azure Maps**](/azure/azure-maps): This service provides geographic information to web and mobile applications. There is a full set of REST APIs as well as a web-based JavaScript control that can be used to create flexible applications that work on desktop or mobile applications for both Apple and Windows devices.

## Next steps

For some actual business cases and the architecture used, see the [Microsoft Azure IoT Technical Case Studies](https://microsoft.github.io/techcasestudies/#technology=IoT&sortBy=featured).

For some sample projects that you can try out with an IoT DevKit, see the [IoT DevKit Project Catalog](https://microsoft.github.io/azure-iot-developer-kit/docs/projects/). 

For a more comprehensive explanation of the different services and how they are used, see [Azure IoT services and technologies](iot-services-and-technologies.md).

For an in-depth discussion of IoT architecture, see the [Microsoft Azure IoT Reference Architecture](https://aka.ms/iotrefarchitecture).