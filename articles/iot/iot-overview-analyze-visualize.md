---
title: Analyze and visualize your IoT data
description: An overview of the available options to analyze and visualize data in an IoT solution.
ms.service: iot
services: iot
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 04/11/2023
ms.custom: template-overview

# As a solution builder, I want a high-level overview of the options for analyzing and visualizing device data in an IoT solution.
---

# Analyze and visualize your IoT data

This overview introduces the key concepts around the options to analyze and visualize your IoT data. Each section includes links to content that provides further detail and guidance.

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the areas relevant to analyzing and visualizing your IoT data.

:::image type="content" source="media/iot-overview-analyze-visualize/iot-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture highlighting analysis and visualization areas." border="false":::

In Azure IoT, analysis and visualization services are used to identify and display business insights derived from your IoT data. For example, you can use a machine learning model to analyze device telemetry and predict when maintenance should be carried out on an industrial asset. You can also use a visualization tool to display a map of the location of your devices.

## Azure Digital Twins

The [Azure Digital Twins](../digital-twins/overview.md) service lets you build and maintain models that are live, up-to-date representations of the real world. You can query, analyze, and generate visualizations from these models to extract business insights. An example model might be a representation of a building that includes information about the rooms, the devices in the rooms, and the relationships between the rooms and devices. The real-world data that populates these models is typically collected from IoT devices and sent through an IoT hub.

## External services

There are many services you can use to analyze and visualize your IoT data. Some services are designed to work with streaming IoT data, while others are more general-purpose. The following services are some of the most common ones used for analysis and visualization in IoT solutions:

### Azure Data Explorer

[Azure Data Explorer](/azure/data-explorer/data-explorer-overview/) is a fully managed, high-performance, big-data analytics platform that makes it easy to analyze high volumes of data in near real time. The following articles and tutorials show some examples of how to use Azure Data Explorer to analyze and visualize IoT data:

- [IoT Hub data connection (Azure Data Explorer)](/azure/data-explorer/ingest-data-iot-hub-overview)
- [Explore an Azure IoT Central industrial scenario](../iot-central/core/tutorial-industrial-end-to-end.md)
- [Export IoT data to Azure Data Explorer (IoT Central)](../iot-central/core/howto-export-to-azure-data-explorer.md)
- [Azure Digital Twins query plugin for Azure Data Explorer](../digital-twins/concepts-data-explorer-plugin.md)

### Databricks

Use [Azure Databricks](/azure/databricks/introduction/) to process, store, clean, share, analyze, model, and monetize datasets with solutions from BI to machine learning. Use the Azure Databricks platform to build and deploy data engineering workflows, machine learning models, analytics dashboards, and more.

- [Use structured streaming with Azure Event Hubs and Azure Databricks clusters](/azure/databricks/structured-streaming/streaming-event-hubs/). You can connect a Databricks workspace to the Event Hubs-compatible endpoint on an IoT hub to read data from IoT devices.
- [Extend Azure IoT Central with custom analytics](../iot-central/core/howto-create-custom-analytics.md)

### Azure Stream Analytics

Azure Stream Analytics is a fully managed stream processing engine that is designed to analyze and process large volumes of streaming data with low latency. Patterns and relationships can be identified in data that originates from various input sources including applications, devices, and sensors. You can use these patterns to trigger actions and initiate workflows such as creating alerts or feeding information to a reporting tool. Stream Analytics is also available on the Azure IoT Edge runtime, enabling data processing directly on the edge.

- [Build an IoT solution by using Stream Analytics](../stream-analytics/stream-analytics-build-an-iot-solution-using-stream-analytics.md)
- [Real-time data visualization of data from Azure IoT Hub](../iot-hub/iot-hub-live-data-visualization-in-power-bi.md)
- [Extend Azure IoT Central with custom rules and notifications](../iot-central/core/howto-create-custom-rules.md)
- [Deploy Azure Stream Analytics as an IoT Edge module](../iot-edge/tutorial-deploy-stream-analytics.md)

### Power BI

[Power BI](/power-bi/fundamentals/power-bi-overview) is a collection of software services, apps, and connectors that work together to turn your unrelated sources of data into coherent, visually immersive, and interactive insights. Power BI lets you easily connect to your data sources, visualize and discover what's important, and share that with anyone or everyone you want.

- [Visualize real-time sensor data from Azure IoT Hub using Power BI](../iot-hub/iot-hub-live-data-visualization-in-power-bi.md)
- [Export data from Azure IoT Central and visualize insights in Power BI](../iot-central/retail/tutorial-in-store-analytics-export-data-visualize-insights.md)

### Azure Maps

[Azure Maps](../azure-maps/about-azure-maps.md) is a collection of geospatial services and SDKs that use fresh mapping data to provide geographic context to web and mobile applications. For an IoT example, see [Integrate with Azure Maps (Azure Digital Twins)](../digital-twins/how-to-integrate-maps.md)

### Grafana

[Grafana](https://grafana.com/) is visualization and analytics software. It allows you to query, visualize, alert on, and explore your metrics, logs, and traces no matter where they're stored. It provides you with tools to turn your time-series database data into insightful graphs and visualizations. [Azure Managed Grafana](https://azure.microsoft.com/products/managed-grafana) is a fully managed service for analytics and monitoring solutions. To learn more about using Grafana in your IoT solution, see [Cloud IoT dashboards using Grafana with Azure IoT](https://sandervandevelde.wordpress.com/2021/06/15/cloud-iot-dashboards-using-grafana-with-azure-iot/).

## IoT Central

IoT Central provides a rich set of features that you can use to analyze and visualize your IoT data. The following articles and tutorials show some examples of how to use IoT Central to analyze and visualize IoT data:

- [How to use IoT Central data explorer to analyze device data](../iot-central/core/howto-create-analytics.md)
- [Create and manage IoT Central dashboards](../iot-central/core/howto-manage-dashboards.md)

## Next steps

Now that you've seen an overview of the analysis and visualization options available to your IoT solution, some suggested next steps include:

- [Manage your IoT solution](./iot-overview-solution-management.md)
- [IoT solution options](iot-introduction.md#solution-options)
