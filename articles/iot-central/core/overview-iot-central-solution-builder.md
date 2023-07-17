---
title: Azure IoT Central data integration guide
description: This guide describes how to integrate your IoT Central application with other services to extend its capabilities.
author: dominicbetts
ms.author: dobett
ms.date: 06/12/2023
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: [mvc, iot-central-frontdoor]

# This article applies to solution builders.
---

# IoT Central data integration guide

Azure IoT Central is an application platform that:

- Includes rich functionality such as device monitoring and management at scale.
- Provides many built-in features that help you to reduce the burden and cost of developing an IoT solution.
- Has extensibility and integration points that let you use its features and capabilities in your wider solution.

A typical IoT solution:

- Enables IoT devices to connect to your solution and send it data.
- Manages and secures the connected devices and their data.
- Extracts business value from your device data.
- Is composed of multiple services and applications.

:::image type="content" source="media/overview-iot-central-solution-builder/architecture.png" alt-text="Diagram of IoT Central solution architecture including integration areas." border="false":::

When you use IoT Central to create an IoT solution, tasks include:

- Configure data transformations to make it easier to extract business value from your data.
- Configure dashboards and views in the IoT Central web UI.
- Use the built-in rules and analytics tools to derive business insights from the connected devices.
- Use the data export feature, rules capabilities, and APIs to integrate IoT Central with other services and applications.

## Data export

Many integration scenarios build on the IoT Central data export feature. An IoT Central application can continuously export filtered and enriched IoT data. Data export pushes changes in near real time to other parts of your cloud solution for warm-path insights, analytics, and storage.

For example, you can:

- Continuously export telemetry, property changes, device connectivity, device lifecycle, and device template lifecycle data in JSON format in near real time.
- Filter the data streams to export data that matches custom conditions.
- Enrich the data streams with custom values and property values from the device.
- [Transform the data](howto-transform-data-internally.md) streams to modify their shape and content.

Currently, IoT Central can export data to:

- [Azure Data Explorer](howto-export-to-azure-data-explorer.md)
- [Blob Storage](howto-export-to-blob-storage.md)
- [Event Hubs](howto-export-to-event-hubs.md)
- [Service Bus](howto-export-to-service-bus.md)
- [Webhook](howto-export-to-webhook.md)

## Transform data at ingress

Devices may send complex telemetry that needs to be simplified before it's used in IoT Central or exported. In some scenarios, you need to normalize the telemetry from different devices so that you can display and process the telemetry consistently. To learn more, see [Map telemetry on ingress to IoT Central](howto-map-data.md).

## Extract business value

IoT Central provides a rich platform to help you extract business value from your IoT data. IoT Central has many built-in features that you can use to gain insights and take action on your IoT data. However, some IoT solution scenarios need more specialized business processes outside of IoT Central to extract value from your IoT data.

Built-in features of IoT Central you can use to extract business value include:

- Dashboards and views:

  An IoT Central application can have one or more dashboards that operators use to view and interact with the application. You can customize the default dashboard and create specialized dashboards:

  - To view some examples of customized dashboards, see [Industry focused templates](../retail/tutorial-in-store-analytics-create-app.md).
  
  - To learn more about dashboards, see [Create and manage multiple dashboards](howto-manage-dashboards.md) and [Configure the application dashboard](howto-manage-dashboards.md).
  
  - When a device connects to an IoT Central, the device is assigned to a device template for the device type. A device template has customizable views that an operator uses to manage individual devices. You can create and customize the available views for each device type. To learn more, see [Add views](howto-set-up-template.md#views).

- Built-in rules and analytics:

  You can add rules to an IoT Central application that run customizable actions. Rules evaluate conditions, based on data coming from a device, to determine when to run an action. To learn more about rules, see:
  
  - [Tutorial: Create a rule and set up notifications in your Azure IoT Central application](tutorial-create-telemetry-rules.md)
  - [Configure rules](howto-configure-rules.md)
  
  IoT Central has built-in analytics capabilities that an operator can use to analyze the data flowing from the connected devices. To learn more, see [How to use data explorer to analyze device data](howto-create-analytics.md).

Scenarios that process IoT data outside of IoT Central to extract business value include:

- Compute, enrich, and transform:
  
  IoT Central lets you capture, transform, manage, and visualize IoT data. Sometimes, it's useful to enrich or transform your IoT data using external data sources. You can then feed the enriched data back into IoT Central.

  For example, use the IoT Central continuous data export feature to trigger an Azure function. The function enriches captured device telemetry and pushes the enriched data back into IoT Central while preserving timestamps.

- Extract business metrics and use artificial intelligence (AI) and machine learning (ML):
  
  Use IoT data to calculate common business metrics such as *overall equipment effectiveness* (OEE)  and *overall process effectiveness* (OPE). You can also use IoT data to enrich your existing AI and ML assets. For example, IoT Central can help to capture the data you need to build, train, and deploy your models.

  Use the IoT Central continuous data export feature to publish captured IoT data into an Azure data lake. Then use a connected to Azure Databricks workspace to compute OEE and OPE. Pipe the same data to Azure Machine Learning or Azure Synapse to use their machine learning capabilities.

- Streaming computation, monitoring, and diagnostics

  IoT Central provides a scalable and reliable infrastructure to capture streaming data from millions of connected devices. Sometimes, you need to run stream computations over the hot or warm data paths to meet business requirements. You can also merge IoT data with data in external stores such as Azure Data explorer to provide enhanced diagnostics.

- Analyze and visualize IoT data alongside business data

  IoT Central provides feature-rich dashboards and visualizations. However, business-specific reports may require you to merge IoT data with existing business data sourced from external systems. Use the IoT Central integration features to extract IoT data from IoT Central. Then merge the IoT data with existing business data to deliver a centralized solution for analyzing and visualizing your business processes.

  For example, use the IoT Central continuous data export feature to continuously ingest your IoT data into an Azure Synapse store. Then use Azure Data Factory to bring data from external systems into the Azure Synapse store. Use the Azure Synapse store with Power BI to generate your business reports.

To learn more, see [Transform data for IoT Central](howto-transform-data.md). For a complete, end-to-end sample, see the [IoT Central Compute](https://github.com/Azure/iot-central-compute) GitHub repository.

## Integrate with other services

You can use the data export and rules capabilities in IoT Central to integrate with other service. To learn more, see:

- [Export IoT data to cloud destinations using Blob Storage](howto-export-to-blob-storage.md).
- [Transform data for IoT Central](howto-transform-data.md)
- [Use workflows to integrate your Azure IoT Central application with other cloud services](howto-configure-rules-advanced.md)
- [Extend Azure IoT Central with custom rules using Stream Analytics, Azure Functions, and SendGrid](howto-create-custom-rules.md)
- [Extend Azure IoT Central with custom analytics using Azure Databricks](howto-create-custom-analytics.md)

## Integrate with companion applications

IoT Central provides rich operator dashboards and visualizations. However, some IoT solutions must integrate with existing applications, or require new companion applications to expand their capabilities. To integrate with other applications, use IoT Central extensibility points such as the REST API and the continuous data export feature.

You use data plane REST APIs to access the entities in and the capabilities of your IoT Central application. For example, managing devices, device templates, users, and roles. The IoT Central REST API operations are *data plane* operations. To learn more, see [How to use the IoT Central REST API to manage users and roles](howto-manage-users-roles-with-rest-api.md).

You use the *control plane* to manage IoT Central-related resources in your Azure subscription. You can use the Azure CLI and Resource Manager templates for control plane operations. For example, you can use the Azure CLI to create an IoT Central application. To learn more, see [Manage IoT Central from Azure CLI](howto-manage-iot-central-from-cli.md).

## Next steps

If you want to learn more about using IoT Central, the suggested next steps are to try the quickstarts, beginning with [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
