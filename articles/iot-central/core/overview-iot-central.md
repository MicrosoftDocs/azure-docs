---
title: What is Azure IoT Central | Microsoft Docs
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions and helps to reduce the burden and cost of IoT management operations, and development. This article provides an overview of the features of Azure IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 04/19/2021
ms.topic: overview
ms.service: iot-central
services: iot-central
ms.custom: mvc, contperf-fy21q2
---

# What is Azure IoT Central?

IoT Central is an IoT application platform that reduces the burden and cost of developing, managing, and maintaining enterprise-grade IoT solutions. Choosing to build with IoT Central gives you the opportunity to focus time, money, and energy on transforming your business with IoT data, rather than just maintaining and updating a complex and continually evolving IoT infrastructure.

The web UI lets you quickly connect devices, monitor device conditions, create rules, and manage millions of devices and their data throughout their life cycle. Furthermore, it enables you to act on device insights by extending IoT intelligence into line-of-business applications.

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

You can quickly deploy a new IoT Central application and then customize it to your specific requirements. Start with a generic _application template_ or with one of the industry-focused application templates:

- [Retail](../retail/overview-iot-central-retail.md)
- [Energy](../energy/overview-iot-central-energy.md)
- [Government](../government/overview-iot-central-government.md)
- [Healthcare](../healthcare/overview-iot-central-healthcare.md).

See the [Create a new application](quick-deploy-iot-central.md) quickstart for a walk-through of how to create your first application.

## Connect devices

After creating your application, the first step is to create and connect devices. Every device connected to IoT Central uses a _device template_. A device template is the blueprint that defines the characteristics and behavior of a type of device such as the:

- Telemetry it sends. Examples include temperature and humidity. Telemetry is streaming data.
- Business properties that an operator can modify. Examples include a customer address and a last serviced date.
- Device properties that are set by a device and are read-only in the application. For example, the state of a valve as either open or shut.
- Properties, that an operator sets, that determine the behavior of the device. For example, a target temperature for the device.
- Commands, that an operator can call, that run on a device. For example, a command to remotely reboot a device.

Every [device template](howto-set-up-template.md) includes:

- A _device model_ describing the capabilities a device should implement. The device capabilities include:

  - The telemetry it streams to IoT Central.
  - The read-only properties it uses to report state to IoT Central.
  - The writable properties it receives from IoT Central to set device state.
  - The commands called from IoT Central.

- Cloud properties that aren't stored on the device.
- Customizations, dashboards, and forms that are part of your IoT Central application.

You have several options for creating device templates:

- Design the device template in IoT Central and then implement its device model in your device code.
- Create a device model using Visual Studio code and publish the model to a repository. Implement your device code from the model, and connect your device to your IoT Central application. IoT Central finds the device model from the repository and creates a simple device template for you.
- Create a device model using Visual Studio code. Implement your device code from the model. Manually import the device model into your IoT Central application and then add any cloud properties, customizations, and dashboards your IoT Central application needs.

See the [Add a simulated device](quick-create-simulated-device.md) quickstart for a walk-through of how to create and connect your first device.

### Customize the UI

You can also customize the IoT Central application UI for the operators who are responsible for the day-to-day use of the application. Customizations you can make include:

- Configuring custom dashboards to help operators discover insights and resolve issues faster.
- Configuring custom analytics to explore time series data from your connected devices.
- Defining the layout of properties and settings on a device template.

## Manage your devices

As an operator, you use the IoT Central application to [manage the devices](howto-manage-devices.md) in your IoT Central solution. Operators do tasks such as:

- Monitoring the devices connected to the application.
- Troubleshooting and remediating issues with devices.
- Provisioning new devices.

You can [define custom rules and actions](howto-configure-rules.md) that operate over data streaming from connected devices. An operator can enable or disable these rules at the device level to control and automate tasks within the application.

As with any IoT solution designed to operate at scale, a structured approach to device management is important. It's not enough just to connect your devices to the cloud, you need to keep your devices connected and healthy. Use the following IoT Central capabilities to manage your devices throughout the application life cycle:

### Dashboards

Built-in [dashboards](./howto-set-up-template.md#generate-default-views) provide a customizable UI to monitor device health and telemetry. Start with a pre-built dashboard in an [application template](howto-use-app-templates.md) or create your own dashboards tailored to the needs of your operators. You can share dashboards with all users in your application, or keep them private.

### Rules and actions

Build [custom rules](tutorial-create-telemetry-rules.md) based on device state and telemetry to identify devices in need of attention. Configure actions to notify the right people and ensure corrective measures are taken in a timely fashion.

### Jobs

[Jobs](howto-run-a-job.md) let you apply single or bulk updates to devices by setting properties or calling commands.

## Integrate with other services

As an application platform, IoT Central lets you transform your IoT data into the business insights that drive actionable outcomes. [Rules](./tutorial-create-telemetry-rules.md), [data export](./howto-export-data.md), and the [public REST API](/learn/modules/manage-iot-central-apps-with-rest-api/) are examples of how you can integrate IoT Central with line-of-business applications:

![How IoT Central can transform your IoT data](media/overview-iot-central/transform.png)

You can generate business insights, such as determining machine efficiency trends or predicting future energy usage on a factory floor, by building custom analytics pipelines to process telemetry from your devices and store the results. Configure data exports in your IoT Central application to export telemetry, device property changes, and device template changes to other services where you can analyze, store, and visualize the data with your preferred tools.

### Build custom IoT solutions and integrations with the REST APIs

Build IoT solutions such as:

- Mobile companion apps that can remotely set up and control devices.
- Custom integrations that enable existing line-of-business applications to interact with your IoT devices and data.
- Device management applications for device modeling, onboarding, management, and data access.

## Administer your application

IoT Central applications are fully hosted by Microsoft, which reduces the administration overhead of managing your applications. Administrators manage access to your application with [user roles and permissions](howto-administer.md).

## Pricing

You can create IoT Central application using a 7-day free trial, or use a standard pricing plan.

- Applications you create using the *free* plan are free for seven days and support up to five devices. You can convert them to use a standard pricing plan at any time before they expire.
- Applications you create using the *standard* plan are billed on a per device basis, you can choose either **Standard 0**, **Standard 1**, or **Standard 2** pricing plan with the first two devices being free. Learn more about [IoT Central pricing](https://aka.ms/iotcentral-pricing).

## Quotas

Each Azure subscription has default quotas that could impact the scope of your IoT solution. Currently, IoT Central limits the number of applications you can deploy in a subscription to 10. If you need to increase this limit, contact [Microsoft support](https://azure.microsoft.com/support/options/).

## Known issues

- Continuous data export doesn't support the Avro format (incompatibility).
- GeoJSON isn't currently supported.
- Map tile isn't currently supported.
- Array schema types aren't supported.
- Only the C device SDK and the Node.js device and service SDKs are supported.
- IoT Central is currently available in the United States, Europe, Asia Pacific, Australia, United Kingdom, and Japan locations.

## Next steps

Now that you have an overview of IoT Central, here are some suggested next steps:

- If you're a device developer and want to dive into some code, the suggested next step is to [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md).
- Familiarize yourself with the [Azure IoT Central UI](overview-iot-central-tour.md).
- Get started by [creating an Azure IoT Central application](quick-deploy-iot-central.md).
