---
title: What is Azure IoT Central | Microsoft Docs 
description: Azure IoT Central is an end-to-end SaaS solution you can use to build and manage your custom IoT solution. This article provides an overview of the features of Azure IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 08/26/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: timlt
---

<!---
Purpose of an Overview article: 
1. To give a TECHNICAL overview of a service/product: What is it? Why should I use it? It's a "learn" topic that describes key benefits and our competitive advantage. It's not a "do" topic.
2. To help audiences who are new to service but who may be familiar with related concepts. 
3. To compare the service to another service/product that has some similar functionality, ex. SQL Database / SQL Data Warehouse, if appropriate. This info can be in a short list or table. 
-->

# What is Azure IoT Central?

[!INCLUDE [iot-central-original-pnp](../../includes/iot-central-original-pnp-note.md)]

Azure IoT Central is an IoT app platform that reduces the burden and cost associated with developing, managing, and maintaining enterprise-grade IoT solutions. Choosing to build with Azure IoT Central gives you the opportunity to focus your time, money, and energy on transforming your business with IoT data, rather than just maintaining and updating a complex and continually evolving IoT infrastructure. 

The easy-to-use interface makes it simple to monitor device conditions, create rules, and manage millions of devices and their data throughout their life-cycle. Furthermore, it enables you to act on device insights by extending IoT intelligence into line of business applications.

This article outlines, for Azure IoT Central:

- The typical personas associated with a project.
- How to create your application.

## Personas

The Azure IoT Central documentation refers to four personas who interact with an Azure IoT Central application:

- A _solution builder_ is responsible for defining the types of devices that connect to the application and customizing the application for the operator.
- An _operator_ manages the devices connected to the application.
- An _administrator_ is responsible for  tasks such as managing [user roles and permissions](howto-administer.md) within the application. 
- A _device developer_ creates the code that runs on a device connected to your application.

## Create your Azure IoT Central application

As a builder, you use Azure IoT Central to create a custom, cloud-hosted IoT solution for your organization. A custom IoT solution typically consists of:

- A cloud-based application that receives telemetry from your devices and enables you to manage those devices.
- Multiple devices running custom code connected to your cloud-based application.

You can quickly deploy a new Azure IoT Central application and then customize it to your specific requirements in your browser. As a builder, you use the web-based tools to create a _device template_ for the devices that connect to your application. A device template is the blueprint that defines the characteristics and behavior of a type of device such as the:

- Telemetry it sends.
- Business properties that an operator can modify.
- Device properties that are set by a device and are read-only in the application.
- Thresholds the application responds to.
- Settings that determine the behavior of the device.

You can immediately test your device templates and application with simulated data that Azure IoT Central generates for you.

As a builder, you can also customize the Azure IoT Central application UI for the operators who are responsible for the day-to-day use of the application. Customizations that a builder can make include:

- Defining the layout of properties and settings on a device template.
- Configuring custom dashboards to help operators discover insights and resolve issues faster.
- Configuring custom analytics to explore time series data from your connected devices.

## Next steps

Now that you have an overview of Azure IoT Central, here are suggested next steps:

- Understand the differences between [Azure IoT Central and Azure IoT solution accelerators](overview-iot-options.md).
- Familiarize yourself with the [Azure IoT Central UI](overview-iot-central-tour.md).
- Get started by [creating an Azure IoT Central application](quick-deploy-iot-central.md).
- Follow a sequence of tutorials that show you how to:
  - [As a builder, to create a device template](tutorial-define-device-type.md)
  - [As a builder, add rules to automate your solution](tutorial-configure-rules.md)
  - [As a builder, customize the application for your operators](tutorial-customize-operator.md)
  - [As an operator, monitor your devices](tutorial-monitor-devices.md)
  - [As an operator, add a real device to your solution](tutorial-add-device.md)
  - [As a device developer, create code for your devices](tutorial-add-device.md#prepare-the-client-code)
