---
title: What is Azure IoT Central | Microsoft Docs
description: Azure IoT Central is a end-to-end SaaS solution you can use to build and manage your custom IoT solution. This article provides an overview of the features of Azure IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 11/30/2017
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

Microsoft Azure IoT Central is a fully managed IoT Software-as-a-Service solution that makes it easy to create products that connect the physical and digital worlds. You can bring your connected product vision to life by:

- Deriving new insights from connected devices to enable better products and experiences for your customers.
- Creating new business opportunities for your organization.

Azure IoT Central, as compared to a typical IoT project, takes the hassle out of managing an IoT solution by:

- Reducing the management burden.
- Reducing operational costs and overheads.
- Making it easy to customize your application, while leveraging:
  - Industry-leading technologies such as [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) and [Azure Time Series Insights](https://azure.microsoft.com/services/time-series-insights/).
  - Enterprise-grade security features such as end-to-end encryption.

The following video presents an overview of Azure IoT Central:

>[!VIDEO https://channel9.msdn.com/Shows/Internet-of-Things-Show/Microsoft-IoT-Central-intro-walkthrough/Player]

The remainder of this article outlines for Azure IoT Central:

- The typical personas associated with a project.
- How to create your application.
- How to connect your devices to your application
- How to manage your application.

## Personas

The Azure IoT Central documentation refers to four typical personas who interact with an Azure IoT Central application:

- A _builder_ is responsible for defining the types of devices that connect to the application and customizing the application for the operator.
- An _operator_ manages the devices connected to the application.
- An _administrator_ is responsible for administrative tasks such as managing users and roles within the application.
- A _device developer_ creates the code that runs on a device connected to your application.

## Create your Azure IoT Central application

As a builder, you use Azure IoT Central to create a custom, cloud-hosted IoT solution for your organization. A custom IoT solution typically consists of:

- A cloud-based application that receives telemetry from your devices and enables you to manage those devices.
- Multiple devices running custom code connected to your cloud-based application.

You can quickly deploy a new Azure IoT Central application and then customize it to your specific requirements right in your browser. As an Azure IoT Central builder, you can use the web-based tools to create a _device template_ for the devices that connect to your application. A device template is the blueprint of a device model that all devices created from the device template share. A device template defines the characteristics and behavior of a type of device such as:

- The telemetry it sends.
- Business properties that an operator can modify.
- Device properties that are set by a device and that are read-only in the application.
- The thresholds the application responds to.
- Settings that determine the behavior of the device.

You can immediately test your device templates and application with simulated data that Azure IoT Central generates for you.

As a builder, you can also customize the Azure IoT Central application UI for the operators who are responsible for the day-to-day use of the application. Customizations that a builder can make include:

- Defining the layout of properties and settings on a device template.
- Configuring custom dashboards to help operators discover insights and resolve issues faster.
- Configuring custom analytics to explore time series data from your connected devices.

## Connect your devices

After the builder defines the types of devices that can connect to the application, a device developer creates the code to run on the devices. As a device developer, you use Microsoft's open-source [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks) to create your device code. These SDKs have broad language, platform, and protocol support to meet your needs to connect your devices to your Azure IoT Central application. The SDKs help you to perform the following tasks on the device  connected to Azure IoT Central:

- Create a secure connection.
- Send telemetry.
- Report status.
- Receive configuration updates.

For more information, see the blog post [Benefits of using the Azure IoT SDKs, and pitfalls to avoid if you don't](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/).

## Manage your application

Azure IoT Central applications are fully hosted by Microsoft, which reduces the administration overhead of managing your applications.

As an operator, you use the Azure IoT Central application to manage the devices in your Azure IoT Central solution. Operators can perform tasks such as:

- Monitoring the devices connected to the application.
- Troubleshooting and remediating issues with devices.
- Provisioning new devices.

A builder can define custom rules and actions that operate over streaming data at the device template level. An operator can enable or disable these rules at the device level to control and automate tasks within the application.

Administrators can manage access to your application with [user roles and permissions](howto-administer.md).

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
