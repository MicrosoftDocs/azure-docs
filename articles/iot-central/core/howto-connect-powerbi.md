---
title: Visualize your Azure IoT Central data in a Power BI dashboard | Microsoft Docs
description: Use the Power BI Solution for Azure IoT Central to visualize and analyze your IoT Central data.
ms.service: iot-central
services: iot-central
author: viv-liu
ms.author: viviali
ms.date: 10/4/2019
ms.topic: conceptual
---

# Visualize and analyze your Azure IoT Central data in a Power BI dashboard

*This topic applies to administrators and solution developers.*

:::image type="content" source="media/howto-connect-powerbi/iot-continuous-data-export.png" alt-text="Power BI solution pipeline":::

Use the Power BI Solution for Azure IoT Central to create a powerful Power BI dashboard to monitor the performance of your IoT devices. In your Power BI dashboard, you can:

- Track how much data your devices are sending over time
- Compare data volume between telemetry, states, and events
- Identify devices that are reporting lots of measurements
- Observe historical trends of device measurements
- Identify problematic devices that send lots of critical events

This solution sets up a pipeline that reads data from your [Continuous Data Export](howto-export-data-blob-storage.md) Azure Blob storage account. The pipeline uses Azure Functions, Azure Data Factory, and Azure SQL Database to process and transform the data. you can visualize and analyze the data in a Power BI report that you download as a PBIX file. All of the resources are created in your Azure subscription, so you can customize each component to suit your needs.

## Prerequisites

To complete the steps in this how-to guide, you need an active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Setting up the solution requires the following resources:

- IoT Central application. To learn more, see [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
- Continuous data export configured to export telemetry, devices, and device templates to Azure Blob storage. To learn more, see [How to export IoT data to destinations in Azure](howto-export-data.md).
- Power BI Desktop (latest version). See [Power BI downloads](https://powerbi.microsoft.com/downloads/).
- Power BI Pro (if you want to share the dashboard with others).

## Install

To set up the pipeline, navigate to the [Power BI solution for Azure IoT Central](https://appsource.microsoft.com/product/web-apps/iot-central.power-bi-solution-iot-central) page on the **Microsoft AppSource** site. Select **Get it now**, and follow the instructions.

When you open the PBIX file, be sure the read and follow the instructions on the cover page. These instructions describe how to connect your report to your SQL database.

## Reports

The PBIX file includes two reports:

The **Devices and Measurements** report shows a historical view of device telemetry, and provides a breakdown of the different telemetry types. It also shows the devices that have sent the highest number of messages.

:::image type="content" source="media/howto-connect-powerbi/template-page1-hasdata.png" alt-text="Power BI Devices and Measurements report":::

The **Events** report shows detailed information about device events and shows a historical view of reported errors and warnings. It also shows the devices reporting the highest number of events, and provides a breakdown of the number of error and warning events.

:::image type="content" source="media/howto-connect-powerbi/template-page2-hasdata.png" alt-text="Power BI Events report":::

## Pipeline resources

You can access all the Azure resources that make up the pipeline in the Azure portal. All the resources are in the resource group you created when you set up the pipeline.

:::image type="content" source="media/howto-connect-powerbi/azure-deployment.png" alt-text="Azure portal view of resource group":::

The following list describes the role of each resource in the pipeline:

### Azure Functions

The Azure Function app triggers each time IoT Central writes a new file to Blob storage. The functions extract data from the telemetry, devices, and device templates blobs to populate the intermediate SQL tables that Azure Data Factory uses.

### Azure Data Factory

Azure Data Factory connects to the SQL database as a linked service. It runs stored procedures to process the data and store it in the analysis tables.

### Azure SQL Database

Azure Data Factory generates these analysis tables for Power BI. You can explore these schemas in Power BI and build your own visualizations:

| Table name |
|------------|
|[analytics].[Measurements]|
|[analytics].[MeasurementDefinitions]|
|[analytics].[Messages]|
|[analytics].[Properties]|
|[analytics].[PropertyDefinitions]|
|[analytics].[Devices]|
|[analytics].[DeviceTemplates]|

## Estimated costs

The [Power BI solution for Azure IoT Central](https://appsource.microsoft.com/product/web-apps/iot-central.power-bi-solution-iot-central) page on the **Microsoft AppSource** site includes a link to a cost estimator for the resources you deploy.

## Next steps

Now that you've learned how to visualize your data in Power BI, the suggested next step is to learn [How to manage devices](howto-manage-devices.md).
