---
title: What is Azure IoT Central | Microsoft Docs
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions and helps to reduce the burden and cost of IoT management operations, and development. This article provides an overview of the features of Azure IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 12/10/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: timlt
---

# What is Azure IoT Central?

IoT Central is an IoT application platform that reduces the burden and cost of developing, managing, and maintaining enterprise-grade IoT solutions. Choosing to build with IoT Central gives you the opportunity to focus time, money, and energy on transforming your business with IoT data, rather than just maintaining and updating a complex and continually evolving IoT infrastructure.

The web UI lets you monitor device conditions, create rules, and manage millions of devices and their data throughout their life cycle. Furthermore, it enables you to act on device insights by extending IoT intelligence into line-of-business applications.

This article outlines, for IoT Central:

- The typical personas associated with a project.
- How to create your application.
- How to connect your devices to your application
- How to manage your application.
- Azure IoT Edge capabilities in IoT Central.
- How to connect your Azure IoT Edge runtime powered devices to your application.

## Known issues

- Continuous data export doesn't support the Avro format (incompatibility).
- GeoJSON isn't currently supported.
- Map tile isn't currently supported.
- Jobs don't support complex types.
- Array schema types aren't supported.
- Only the C device SDK and the Node.js device and service SDKs are supported.
- IoT Central is currently available in the United States, Europe, Asia Pacific, Australia, United Kingdom, and Japan locations.
- You cannot use the **Custom application (legacy)** application template in the United Kingdom and Japan locations.
- Device capability models must have all the interfaces defined inline in the same file.
- Support for [IoT Plug and Play](../../iot-pnp/overview-iot-plug-and-play.md) is in preview and is only supported only in selected regions.

## Personas

The IoT Central documentation refers to four personas who interact with an IoT Central application:

- A _solution builder_ is responsible for defining the types of devices that connect to the application and customizing the application for the operator.
- An _operator_ manages the devices connected to the application.
- An _administrator_ is responsible for administrative tasks such as managing [user roles and permissions](howto-administer.md) within the application.
- A _device developer_ creates the code that runs on a device or IoT Edge module connected to your application.

## Create your IoT Central application

As a solution builder, you use IoT Central to create a custom, cloud-hosted IoT solution for your organization. A custom IoT solution typically consists of:

- A cloud-based application that receives telemetry from your devices and enables you to manage those devices.
- Multiple devices running custom code connected to your cloud-based application.

You can quickly deploy a new IoT Central application and then customize it to your specific requirements in your browser. You can start with a generic _application template_ or with one of the industry-focused application templates for [Retail](../retail/overview-iot-central-retail-pnp.md), [Energy](../energy/overview-iot-central-energy.md), [Government](../government/overview-iot-central-government.md), or [Healthcare](../healthcare/overview-iot-central-healthcare.md).

As a solution builder, you use the web-based tools to create a _device template_ for the devices that connect to your application. A device template is the blueprint that defines the characteristics and behavior of a type of device such as the:

- Telemetry it sends.
- Business properties that an operator can modify.
- Device properties that are set by a device and are read-only in the application.
- Properties, that an operator sets, that determine the behavior of the device.

This device template includes:

- A _device capability model_ that describes the capabilities a device should implement such as the telemetry it sends and the properties it reports.
- Cloud properties that aren't stored on the device.
- Customizations, dashboards, and forms that are part of your IoT Central application.

### Pricing

You can create IoT Central application using a 7-day free trial, or use a standard pricing plan.

- Applications you create using the *free* plan are free for seven days and support up to five devices. You can convert them to use a standard pricing plan at any time before they expire.
- Applications you create using a *standard* plan are billed on a per device basis, you can choose either **Standard 1** or **Standard 2** pricing plan with the first two devices being free. Learn more about the free and standard pricing plans on the [Azure IoT Central pricing page](https://azure.microsoft.com/pricing/details/iot-central/).

### Create device templates

[IoT Plug and Play (preview)](../../iot-pnp/overview-iot-plug-and-play.md) enables IoT Central to integrate devices without you writing any embedded device code. At the core of IoT Plug and Play (preview), is a device capability model schema that describes device capabilities. In an IoT Central application, device templates use these IoT Plug and Play (preview) device capability models.

As a solution builder, you have several options for creating device templates:

- Import a device capability model from the [Azure Certified for IoT device catalog](https://aka.ms/iotdevcat) and then add any cloud properties, customizations, and dashboards your IoT Central application needs.
- Design the device template in IoT Central and then implement its device capability model in your device code.
- Create a device capability model using Visual Studio code and publish the model to a repository. Implement your device code from the model, and connect your device to your IoT Central application. IoT Central finds the device capability model from the repository and creates a simple device template for you.
- Create a device capability model using Visual Studio code. Implement your device code from the model. Manually import the device capability model into your IoT Central application and then add any cloud properties, customizations, and dashboards your IoT Central application needs.

As a solution builder, you can use IoT Central to generate code for test devices to validate your device templates.

### Customize the UI

As a solution builder, you can also customize the IoT Central application UI for the operators who are responsible for the day-to-day use of the application. Customizations that a solution builder can make include:

- Defining the layout of properties and settings on a device template.
- Configuring custom dashboards to help operators discover insights and resolve issues faster.
- Configuring custom analytics to explore time series data from your connected devices.

## Pricing

You can create IoT Central application using a 7-day free trial, or use a standard pricing plan.

- Applications you create using the *free* plan are free for seven days and support up to five devices. You can convert them to use a standard pricing plan at any time before they expire.
- Applications you create using the *standard* plan are billed on a per device basis, you can choose either **Standard 1** or **Standard 2** pricing plan with the first two devices being free. Learn more about [IoT Central pricing](https://aka.ms/iotcentral-pricing).

## Connect your devices

Azure IoT Central uses the [Azure IoT Hub Device Provisioning service (DPS)](../../iot-dps/about-iot-dps.md) to manage all device registration and connection.

Using DPS enables:

- IoT Central to support onboarding and connecting devices at scale.
- You to generate device credentials and configure the devices offline without registering the devices through IoT Central UI.
- Devices to connect using shared access signatures.
- Devices to connect using industry-standard X.509 certificates.
- You to use your own device IDs to register devices in IoT Central. Using your own device IDs simplifies integration with existing back-office systems.
- A single, consistent way to connect devices to IoT Central.

To learn more, see [Get connected to Azure IoT Central](./concepts-get-connected.md).

### Azure IoT Edge devices

As well as devices created using the [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks), you can also connect [Azure IoT Edge devices](../../iot-edge/about-iot-edge.md) to an IoT Central application. Azure IoT Edge lets you run cloud intelligence and custom logic directly on IoT devices managed by IoT Central. The IoT Edge runtime enables you to:

- Install and update workloads on the device.
- Maintain Azure IoT Edge security standards on the device.
- Ensure that IoT Edge modules are always running.
- Report module health to the cloud for remote monitoring.
- Manage communication between downstream leaf devices and an IoT Edge device, between modules on an IoT Edge device, and between an IoT Edge device and the cloud.

For more information, see [Azure IoT Edge devices and IoT Central](concepts-architecture.md#azure-iot-edge-devices).

## Stay connected

IoT Central applications are fully hosted by Microsoft, which reduces the administration overhead of managing your applications.

As an operator, you use the IoT Central application to manage the devices in your IoT Central solution. Operators do tasks such as:

- Monitoring the devices connected to the application.
- Troubleshooting and remediating issues with devices.
- Provisioning new devices.

As a solution builder, you can define custom rules and actions that operate over data streaming from connected devices. An operator can enable or disable these rules at the device level to control and automate tasks within the application.

Administrators manage access to your application with [user roles and permissions](howto-administer.md).

With any IoT solution designed to operate at scale, a structured approach to device management is important. It's not enough just to connect your devices to the cloud, you need to keep your devices connected and healthy. An operator can use the following IoT Central capabilities to manage your devices throughout the application life cycle:

### Dashboards 

Built-in [dashboards](./howto-set-up-template.md#generate-default-views) provide a customizable UI to monitor device health and telemetry. Start with a pre-built dashboard in an [application template](howto-use-app-templates.md) or create your own dashboards tailored to the needs of your operators. You can share dashboards with all users in your application, or keep them private.

### Rules and actions 

Build [custom rules](tutorial-create-telemetry-rules.md) based on device state and telemetry to identify devices in need of attention. Configure actions to notify the right people and ensure corrective measures are taken in a timely fashion.

### Jobs 

[Jobs](howto-run-a-job.md) let you apply single or bulk updates to devices by setting properties or calling commands. 

### User roles and permissions

[Roles and permissions](howto-manage-users-roles.md) let an administrator tailor each user's experience. An administrator uses the web UI to create roles and assign permissions.

## Transform your IoT data

As an application platform, IoT Central lets you transform your IoT data into the business insights that drive actionable outcomes. [Rules](./tutorial-create-telemetry-rules.md), [data export](./howto-export-data.md), and the [public REST API](https://docs.microsoft.com/learn/modules/manage-iot-central-apps-with-rest-api/) are examples of how you can integrate IoT Central with line-of-business applications:

![How IoT Central can transform your IoT data](media/overview-iot-central/transform.png)

### Monitor device health and operations using rules

When your devices are connected and sending data, rules can identify devices  experiencing problems or sending error messages so that you can fix them with minimal downtime. Build rules in your IoT Central application to monitor telemetry from your devices and alert an operator when a metric crosses a threshold or a device sends a specific message. Email actions and webhooks for your rules notify the right people and the right downstream systems.

### Run custom analytics and processing on your exported data

You can generate business insights, such as determining machine efficiency trends or predicting future energy usage on a factory floor, by building custom analytics pipelines to process telemetry from your devices and store the results. Configure data exports in your IoT Central application to export telemetry, device property changes, and device template changes to other services where you can analyze, store, and visualize the data with your preferred tools.

### Build custom IoT solutions and integrations with the REST APIs

Build IoT solutions such as:

- Mobile companion apps that can remotely set up and control devices.
- Custom integrations that enable existing line-of-business applications to interact with your IoT devices and data.
- Device management applications for device modeling, onboarding, management, and data access.

## Quotas

Each Azure subscription has default quotas that could impact the scope of your IoT solution. Currently, IoT Central limits the number of applications you can deploy in a subscription to 10. If you need to increase this limit, contact [Microsoft support](https://azure.microsoft.com/support/options/).

## Next steps

Now that you have an overview of IoT Central, here are suggested next steps:

- Understand the available [Azure technologies and services for creating IoT solutions](../../iot-fundamentals/iot-services-and-technologies.md).
- Familiarize yourself with the [Azure IoT Central UI](overview-iot-central-tour.md).
- Get started by [creating an Azure IoT Central application](quick-deploy-iot-central.md).
- Learn more about [IoT Plug and Play (preview)](../../iot-pnp/overview-iot-plug-and-play.md).
- Learn how to [Connect an Azure IoT Edge device](./tutorial-add-edge-as-leaf-device.md).
- Learn more about [Azure IoT technologies and services](../../iot-fundamentals/iot-services-and-technologies.md).
