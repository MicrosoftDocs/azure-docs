---
title: Visualize your Azure IoT Central data in a Power BI dashboard | Microsoft Docs
description: Use the Power BI Solution for Azure IoT Central to visualize and analyze your IoT Central data.
ms.service: iot-central
services: iot-central
author: viv-liu
ms.author: viviali
ms.date: 06/09/2019
ms.topic: conceptual
---

# Visualize and analyze your Azure IoT Central data in a Power BI dashboard

*This topic applies to administrators.*

![Power BI solution pipeline](media/howto-connect-powerbi/iot-continuous-data-export.png)

Use the Power BI Solution for Azure IoT Central to create a powerful Power BI dashboard to monitor the performance of your IoT devices. In your Power BI dashboard, you can:
- Track how much data your devices are sending over time
- Compare data volume between telemetry, states, and events
- Identify devices that are reporting lots of measurements
- Observe historical trends of device measurements
- Identify problematic devices that send lots of critical events

This solution sets up the pipeline that takes the data in your Azure Blob storage account from [Continuous Data Export](howto-export-data.md). This data flows through to Azure Functions, Azure Data Factory, and Azure SQL Database to process and transform the data. The output can be visualized and analyzed in a Power BI report that you can download as a PBIX file. All of these resources are created in your Azure subscription, so you can customize each component to suit your needs.

## Get the [Power BI Solution for Azure IoT Central](https://aka.ms/iotcentralpowerbisolutiontemplate) from Microsoft AppSource.

## Prerequisites
Setting up the solution requires the following:
- Access to an Azure subscription
- Exported data using [Continuous Data Export](howto-export-data.md) from your IoT Central app. We recommend you turn on measurements, devices, and device template streams to get the most out of the Power BI dashboard.
- Power BI Desktop (latest version)
- Power BI Pro (if you want to share the dashboard with others)

## Reports

Two reports are generated automatically. 

The first report shows a historical view of measurements reported by devices, and breaks down the different types of measurements and devices that have sent the highest number of measurements.

![Power BI report page 1](media/howto-connect-powerbi/template-page1-hasdata.PNG)

The second report dives deeper into events and shows a historical view of errors and warnings reported. It also shows which devices are reporting the highest number of events all up, as well as specifically error events and warning events.

![Power BI report page 2](media/howto-connect-powerbi/template-page2-hasdata.PNG)

## Architecture
All of the resources that have been created can be accessed in the Azure portal. Everything should be under one resource group.

![Azure Portal view of resource group](media/howto-connect-powerbi/azure-deployment.PNG)

The specifics of each resource and how it gets used is described below.

### Azure Functions
The Azure Function app gets triggered each time a new file is written to Blob storage. The functions extract the fields within each measurements, devices, and device templates file and populates several intermediate SQL tables to be used by Azure Data Factory.

### Azure Data Factory
Azure Data Factory connects to the SQL database as a linked service. It runs stored procedure activities which process the data and store it in the analysis tables.

### Azure SQL Database
These tables are automatically created to populate the default reports. Explore these schemas in Power BI and you can build your own visualizations on this data.

| Table name |
|------------|
|[analytics].[Measurements]|
|[analytics].[Messages]|
|[stage].[Measurements]|
|[analytics].[Properties]|
|[analytics].[PropertyDefinitions]|
|[analytics].[MeasurementDefinitions]|
|[analytics].[Devices]|
|[analytics].[DeviceTemplates]|
|[dbo].[date]|
|[dbo].[ChangeTracking]|

## Estimated costs

Here is an estimate of the Azure costs (Azure Function, Data Factory, Azure SQL) involved. All prices are in USD. Keep in mind that prices vary by region, so you should always look up the latest prices of the individual services to get the actual prices.
The following defaults are set for you in the template (you can modify any of these after things get set up):

- Azure Functions: App Service plan S1, $74.40/month
- Azure SQL S1, ~$30/month

We encourage you to familiarize yourself with the various pricing options and tweak things to suit your needs.

## Resources

Visit AppSource to get the [Power BI Solution for Azure IoT Central](https://aka.ms/iotcentralpowerbisolutiontemplate).

## Next steps

Now that you have learned how to visualize your data in Power BI, here is the suggested next step:

> [!div class="nextstepaction"]
> [How to manage devices](howto-manage-devices.md)