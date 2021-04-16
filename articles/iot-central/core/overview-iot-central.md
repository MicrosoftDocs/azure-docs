---
title: What is Azure IoT Central | Microsoft Docs
description: IoT Central is a hosted IoT app platform that's secure, scales with you as your business grows, and integrates with your existing business apps. This article provides an overview of the features of Azure IoT Central.
author: vishwam
ms.author: vishwams
ms.date: 04/16/2021
ms.topic: overview
ms.service: iot-central
services: iot-central
ms.custom: mvc, contperf-fy21q2
---

# What is Azure IoT Central?

IoT Central is a hosted IoT app platform that's secure, scales with you as your business grows, and integrates with your existing business apps. Choosing to build with IoT Central gives you the opportunity to focus time, money, and energy on transforming your business with IoT data, rather than just maintaining and updating a complex and continually evolving IoT infrastructure.

IoT Central lets you monitor device conditions, create rules, and manage millions of devices and their data throughout their lifecycle. Furthermore, it enables you to act on device insights by extending IoT intelligence into line-of-business applications.

This article outlines, for IoT Central:

- The typical user roles associated with a project.
- How to create your application.
- How to connect your devices to your application
- How to manage your application.
- Azure IoT Edge capabilities in IoT Central.
- How to connect your Azure IoT Edge runtime powered devices to your application.

## User roles

The IoT Central documentation refers to four user roles that interact with an IoT Central application:

- A _solution builder_ is responsible for [creating an application](quick-deploy-iot-central.md), [configuring rules and actions](quick-configure-rules.md), [defining integrations with other services](howto-export-data.md), and further customizing the application for operators and device developers.
- An _operator_ [manages the devices](howto-manage-devices.md) connected to the application.
- An _administrator_ is responsible for administrative tasks such as managing [user roles and permissions](howto-administer.md) within the application.
- A _device developer_ [creates the code that runs on a device](concepts-telemetry-properties-commands.md) or [IoT Edge module](concepts-iot-edge.md) connected to your application.

## Create your IoT Central application

As a solution builder, you can use IoT Central to create a custom, cloud-hosted IoT solution for your organization. A custom IoT solution typically consists of:

- A cloud-based application that receives telemetry from your devices and enables you to manage those devices.
- Multiple devices connected to your cloud-based application.

You can quickly create a new IoT Central application and then customize it to your unique requirements. You can either start with a generic _application template_ or with one of the industry-focused application templates for [Retail](../retail/overview-iot-central-retail.md), [Energy](../energy/overview-iot-central-energy.md), [Government](../government/overview-iot-central-government.md), or [Healthcare](../healthcare/overview-iot-central-healthcare.md).

### Create device templates

Once your application is created, you can then [create a _device template_](howto-set-up-template.md). A device template is like a blueprint. It defines the characteristics and behaviors of devices that connect to your application, such as:

- Telemetries, which represent measurements from sensors, for example temperature or humidity.
- Properties, which represent the durable state of a device. Examples include state of a coolant pump or target temperature for a device. You can declare properties as read-only or writable. Only devices can update the value of a read-only property. An operator can set the value of a writable property to send to a device.
- Commands, operations that can be triggered on a device, for example, a command to remotely reboot a device.
- Cloud properties, which are device metadata to store in the IoT Central application, for example customer address or last serviced date.

### Customize the UI

You can customize the IoT Central application for the operators who are responsible for the day-to-day use of the application, for example:

- Defining the layout of properties and settings on a device template.
- Configuring custom dashboards to help operators discover insights and resolve issues faster.


## Connect your devices

See the [device development overview](./overview-iot-central-developer.md) for an introduction to connecting devices to your IoT Central application.

## Manage your devices


With any IoT solution designed to operate at scale, a structured approach to device management is important. It's not enough just to connect your devices to the cloud, you need to keep your devices connected and healthy.

You can [manage the devices](howto-manage-devices.md) using your IoT Central application to do tasks such as:

- Monitoring the devices.
- Troubleshooting and remediating issues with devices.
- Perform bulk updates on devices.

### Dashboards

Built-in [dashboards](./howto-set-up-template.md#generate-default-views) provide a customizable UI to monitor device health and telemetry. Start with a pre-built dashboard in an [application template](howto-use-app-templates.md) or create your own dashboards tailored to the needs of your operators. You can share dashboards with all users in your application, or keep them private.

### Rules and actions

Build [custom rules](tutorial-create-telemetry-rules.md) based on device state and telemetry to identify devices in need of attention. Configure actions to notify the right people and ensure corrective measures are taken in a timely fashion.

### Jobs

[Jobs](howto-run-a-job.md) let you apply single or bulk updates to devices by setting properties or calling commands.

### Analytics
[Analytics](howto-create-analytics.md) exposes rich capabilities to analyze historical trends and correlate various telemetries from your devices.

## Integrate with other services

As an application platform, IoT Central lets you transform your IoT data into the business insights that drive actionable outcomes. [Rules](./tutorial-create-telemetry-rules.md), [data export](./howto-export-data.md), and the [public REST API](/learn/modules/manage-iot-central-apps-with-rest-api/) are examples of how you can integrate IoT Central with line-of-business applications:

![How IoT Central can transform your IoT data](media/overview-iot-central/transform.png)

You can generate business insights, such as determining machine efficiency trends or predicting future energy usage on a factory floor, by building custom analytics pipelines to process telemetry from your devices and store the results. Configure data exports in your IoT Central application to export your data to other services where you can analyze, store, and visualize it with your preferred tools.

### Build custom IoT solutions and integrations with the REST APIs

Build IoT solutions such as:

- Mobile companion apps that can remotely set up and control devices.
- Custom integrations that enable existing line-of-business applications to interact with your IoT devices and data.
- Device management applications for device modeling, onboarding, management, and data access.

## Administer your application

IoT Central applications are fully hosted by Microsoft, which reduces the administration overhead of managing your applications. Administrators manage access to your application with [user roles and permissions](howto-administer.md).

## Pricing

You can create an IoT Central application using a 7-day free trial, or use a standard pricing plan.

- Applications you create using the *free* plan are free for seven days and support up to five devices. You can convert them to use a standard pricing plan at any time before they expire.
- Applications you create using the *standard* plan are billed on a per device basis. You can choose either the **Standard 0**, **Standard 1**, or **Standard 2** pricing plan with the first two devices being free. Learn more about [IoT Central pricing](https://aka.ms/iotcentral-pricing).

## Next steps

Now that you have an overview of IoT Central, here are some suggested next steps:

- Get started by [creating an Azure IoT Central application](quick-deploy-iot-central.md).
- Familiarize yourself with the [Azure IoT Central UI](overview-iot-central-tour.md).
- If you're a device developer and want to dive into some code, [create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md).
