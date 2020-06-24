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
- Compare data volumes between different telemetry streams
- Filter down to data sent by specific devices
- View the most recent telemetry data in a table

This solution sets up a pipeline that reads data from your [Continuous Data Export](howto-export-data-blob-storage.md) Azure Blob storage account. The pipeline uses Azure Functions, Azure Data Factory, and Azure SQL Database to process and transform the data. you can visualize and analyze the data in a Power BI report that you download as a PBIX file. All of the resources are created in your Azure subscription, so you can customize each component to suit your needs.

## Prerequisites

To complete the steps in this how-to guide, you need an active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Setting up the solution requires the following resources:

- IoT Central application. To learn more, see [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
- Continuous data export configured to export telemetry, devices, and device templates to Azure Blob storage. To learn more, see [How to export IoT data to destinations in Azure](howto-export-data.md).
  - Make sure that only your IoT Central application is exporting data to the blob container.
  - Your [devices must send JSON encoded messages](../../iot-hub/iot-hub-devguide-messages-d2c.md). Devices must specify `contentType:application/JSON` and `contentEncoding:utf-8` or `contentEncoding:utf-16` or `contentEncoding:utf-32` in the message system properties.
- Power BI Desktop (latest version). See [Power BI downloads](https://powerbi.microsoft.com/downloads/).
- Power BI Pro (if you want to share the dashboard with others).

## Install

To set up the pipeline, navigate to the [Power BI solution for Azure IoT Central](https://appsource.microsoft.com/product/web-apps/iot-central.power-bi-solution-iot-central) page on the **Microsoft AppSource** site. Select **Get it now**, and follow the instructions.

When you open the PBIX file, be sure the read and follow the instructions on the cover page. These instructions describe how to connect your report to your SQL database.

## Report

The PBIX file contains the **Devices and Telemetry** report shows a historical view of the telemetry that has been sent by devices. It provides a breakdown of the different types of telemetry, and also shows the most recent telemetry sent by devices.

:::image type="content" source="media/howto-connect-powerbi/report.png" alt-text="Power BI Devices and Telemetry report":::

## Pipeline resources

You can access all the Azure resources that make up the pipeline in the Azure portal. All the resources are in the resource group you created when you set up the pipeline.

:::image type="content" source="media/howto-connect-powerbi/azure-deployment.png" alt-text="Azure portal view of resource group":::

The following list describes the role of each resource in the pipeline:

### Azure Functions

The Azure Function app triggers each time IoT Central writes a new file to Blob storage. The functions extract data from the telemetry, devices, and device templates blobs to populate the intermediate SQL tables that Azure Data Factory uses.

### Azure Data Factory

Azure Data Factory connects to SQL Database as a linked service. It runs stored procedures to process the data and store it in the analysis tables.

Azure Data Factory runs every 15 minutes to transform the latest batch of data to load into the SQL tables (which is the current minimal number for the **Tumbling Window Trigger**).

### Azure SQL Database

Azure Data Factory generates a set of analysis tables for Power BI. You can explore these schemas in Power BI and use them to build your own visualizations.

## Estimated costs

The [Power BI solution for Azure IoT Central](https://appsource.microsoft.com/product/web-apps/iot-central.power-bi-solution-iot-central) page on the Microsoft AppSource site includes a link to a cost estimator for the resources you deploy.

## Next steps

Now that you've learned how to visualize your data in Power BI, the suggested next step is to learn [How to manage devices](howto-manage-devices.md).
