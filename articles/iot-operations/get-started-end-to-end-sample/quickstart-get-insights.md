---
title: "Quickstart: get insights from your processed data"
description: "Quickstart: Use a Power BI report to capture insights from your OPC UA data you sent to the Microsoft Fabric OneLake lakehouse."
author: baanders
ms.author: baanders
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 04/25/2024

#CustomerIntent: As an OT user, I want to create a visual report for my processed OPC UA data that I can use to analyze and derive insights from it.
---

# Quickstart: Get insights from your processed data

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you populate a Power BI report to capture insights from your OPC UA data that you sent to a Microsoft Fabric lakehouse in the previous quickstart. You'll prepare your data to be a source for Power BI, import a report template into Power BI, and connect your data sources to Power BI so that the report displays visual graphs of your data over time.

These operations are the last steps in the sample end-to-end quickstart experience, which goes from deploying Azure IoT Operations Preview at the edge through getting insights from that device data. 

## Prerequisites

Before you begin this quickstart, you must complete the following quickstarts:

- [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](quickstart-deploy.md)
- [Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster](quickstart-add-assets.md)
- [Quickstart: Send asset telemetry to the cloud using the data lake connector for Azure IoT MQ](quickstart-upload-telemetry-to-cloud.md)

You'll also need either a **Power BI Pro** or **Power BI Premium Per User** license. If you don't have one of these licenses, you can try Power BI Pro for free at [Power BI Pro](https://powerbi.microsoft.com/power-bi-pro/).

Using this license, download and sign into [Power BI Desktop](/power-bi/fundamentals/desktop-what-is-desktop), a free version of Power BI that runs on your local computer. You can download it from here: [Power BI Desktop](https://www.microsoft.com/download/details.aspx?id=58494).

## What problem will we solve?

Once your OPC UA data has been processed and enriched in the cloud, you'll have a lot of information available to analyze. You might want to create reports containing graphs and visualizations to help you organize and derive insights from this data. The template and steps in this quickstart illustrate how you can connect that data to Power BI to build such reports.

## Update lakehouse semantic model

This section prepares your lakehouse data to be a source for Power BI. You'll update the default semantic model for your lakehouse to include the telemetry from the *OPCUA* table you created in the [previous quickstart](quickstart-upload-telemetry-to-cloud.md).

1. Select **Lakehouse** in the top right corner and change it to **SQL analytics endpoint**.

    :::image type="content" source="media/quickstart-get-insights/sql-analytics-endpoint.png" alt-text="Screenshot of a Fabric lakehouse showing the SQL analytics endpoint option.":::

1. Switch to the **Reporting** tab. Verify that the *OPCUA* table is open, and select **Automatically update semantic model**.

    :::image type="content" source="media/quickstart-get-insights/automatically-update-semantic-model.png" alt-text="Screenshot of a Fabric lakehouse showing the Add to default semantic model option.":::

    After a short wait, you'll see a notification confirming that Fabric has successfully updated the semantic model. The default semantic model's name is *aiomqdestination*, named after the lakehouse.

## Configure Power BI report

In this section, you'll import a Power BI report template and configure it to pull data from your data sources.

These steps are for Power BI Desktop, so open that application now.

### Import template and load Asset Registry data

1. Download the following Power BI template: [quickstartInsightsTemplate.pbit](https://github.com/Azure-Samples/explore-iot-operations/raw/main/samples/dashboard/quickstartInsightsTemplate.pbit).
1. Open a new instance of Power BI Desktop. Close any startup screens and open a new blank report.
1. Select **File** > **Import** > **Power BI template**. Select the file you downloaded to import it.
1. A dialog box pops up asking you to input an Azure subscription and resource group. Enter the Azure subscription ID and resource group where you created your assets and select **Load**. This imports a template that uses a custom [Power Query M](/powerquery-m/) script to display visuals of the sample asset data. You may be prompted to sign in to your Azure account to access the data.

    >[!NOTE]
    >As the file imports, you see an error for **DirectQuery to AS**. This is normal, and will be resolved later by configuring the data source. Close the error.
    >:::image type="content" source="media/quickstart-get-insights/power-bi-import-error.png" alt-text="Screenshot of Power BI showing an error labeled DirectQuery to AS - quickStartDataset.":::

1. The template has now been imported, although the visuals are missing, because it still needs some configuration to connect to your data. If you see an option to **Apply changes** that are pending for your queries, select it and let the dashboard reload.

    :::image type="content" source="media/quickstart-get-insights/power-bi-initial-report.png" alt-text="Screenshot of Power BI Desktop showing a blank report." lightbox="media/quickstart-get-insights/power-bi-initial-report.png":::

1. Optional: To view the script that imports the asset data from the Azure Device Registry, right-select **Asset** from the Data panel on the right side of the screen, and choose **Edit query**.

    :::image type="content" source="media/quickstart-get-insights/power-bi-edit-query.png" alt-text="Screenshot of Power BI showing the Edit query button." lightbox="media/quickstart-get-insights/power-bi-edit-query.png":::
    
    You'll see a few queries in the Power Query Editor window that comes up. Go through each of them and select **Advanced Editor** in the top menu to view the details of the queries. The most important query is **GetAssetData**. These queries retrieve the custom property values from the thermostat asset that you created in a previous quickstart. These custom property values provide contextual information such as the batch number and asset location.
    
    :::image type="content" source="media/quickstart-get-insights/power-bi-advanced-editor.png" alt-text="Screenshot of Power BI showing the advanced editor.":::
    
    When you're finished, exit the Power Query Editor window.

### Connect data source

At this point, the visuals in the Power BI report display errors. That's because you need to connect your telemetry data source.

1. Select **File** > **Options and Settings** > **Data source settings**.  
1. Select **Change Source**. 

    :::image type="content" source="media/quickstart-get-insights/power-bi-change-data-source.png" alt-text="Screenshot of Power BI showing the Data source settings.":::

    This displays a list of data source options. Select *aiomqdestination* (the default dataset you updated in the previous section) and select **Create**.

1. In the **Connect to your data** box that opens, expand your dataset and select the *OPCUA* telemetry table. Select **Submit**.

    :::image type="content" source="media/quickstart-get-insights/power-bi-connect-to-your-data.png" alt-text="Screenshot of Power BI showing the Connect to your data options.":::

    Close the data source settings.

The dashboard now loads visual data.

:::image type="content" source="media/quickstart-get-insights/power-bi-complete.png" alt-text="Screenshot of Power BI showing the report view." lightbox="media/quickstart-get-insights/power-bi-complete.png":::

## View insights

In this section, you'll review the report that was created and consider how such reports can be used in your business.

This report offers a view of your asset and telemetry data. You can use the asset checkboxes to view multiple assets and their associated telemetry simultaneously, to compare data points at a specified time period.

Take some time to explore the filters for each visual to explore and do more with your data.

By relating edge data from various sources together in Power BI, this report uses visualizations and interactive features to offer deeper insights into asset health, utilization, and operational trends. This can empower you to enhance productivity, improve asset performance, and drive informed decision-making for better business outcomes.

## How did we solve the problem?

In this quickstart, you prepared your lakehouse data to be a source for Power BI, imported a report template into Power BI, and configured the report to display your lakehouse data in report graphs that visually track their changing values over time. This represents the final step in the quickstart flow for using Azure IoT Operations to manage device data from deployment through analysis in the cloud.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster where you deployed Azure IoT Operations and remove the Azure resource group that contains the cluster.

You can delete your Microsoft Fabric workspace and your Power BI report.

You might also want to remove Power BI Desktop from your local machine.
