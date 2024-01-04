---
title: "Quickstart: get insights from your processed data"
description: "Quickstart: Use a Power BI report to capture insights from your OPC UA data you sent to the Microsoft Fabric OneLake lakehouse."
author: baanders
ms.author: baanders
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 11/15/2023

#CustomerIntent: As an OT user, I want to create a visual report for my processed OPC UA data that I can use to analyze and derive insights from it.
---

# Quickstart: Get insights from Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you populate a Power BI report to capture insights from your OPC UA data that you sent to a Microsoft Fabric lakehouse in the previous quickstart. You'll prepare your data to be a source for Power BI, import a report template into Power BI, and connect your data sources to Power BI so that the report displays visual graphs of your data over time.

These operations are the last steps in the sample end-to-end quickstart experience, which goes from deploying Azure IoT Operations at the edge through getting insights from that device data. 

## Prerequisites

Before you begin this quickstart, you must complete the following quickstarts:

- [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](quickstart-deploy.md)
- [Quickstart: Add OPC UA assets to your Azure IoT Operations cluster](quickstart-add-assets.md)
- [Quickstart: Use Data Processor pipelines to process data from your OPC UA assets](quickstart-process-telemetry.md)

You'll also need either a **Power BI Pro** or **Power BI Premium Per User** license. If you don't have one of these licenses, you can try Power BI Pro for free at [Power BI Pro](https://powerbi.microsoft.com/power-bi-pro/).

Using this license, download and sign into [Power BI Desktop](/power-bi/fundamentals/desktop-what-is-desktop), a free version of Power BI that runs on your local computer. You can download it from here: [Power BI Desktop](https://www.microsoft.com/download/details.aspx?id=58494).

## What problem will we solve?

Once your OPC UA data has been processed and enriched in the cloud, you'll have a lot of information available to analyze. You might want to create reports containing graphs and visualizations to help you organize and derive insights from this data. The template and steps in this quickstart illustrate how you can connect that data to Power BI to build such reports.

## Create a new dataset in the lakehouse

This section prepares your lakehouse data to be a source for Power BI. You'll create a new dataset in your lakehouse that contains the contextualized telemetry table you created in the [previous quickstart](quickstart-process-telemetry.md).

1. In the lakehouse menu, select **New semantic model**.

    :::image type="content" source="media/quickstart-get-insights/new-semantic-model.png" alt-text="Screenshot of a Fabric lakehouse showing the New Semantic Model button.":::

1. Select *OPCUA*, the contextualized telemetry table from the previous quickstart, and confirm. This action creates a new dataset and opens a new page.

1. In this new page, create four measures. **Measures** in Power BI are custom calculators that perform math or summarize data from your table, to help you find answers from your data. To learn more, see [Create measures for data analysis in Power BI Desktop](/power-bi/transform-model/desktop-measures).

    To create a measure, select **New measure** from the menu, enter one line of measure text from the following code block, and select **Commit**. Complete this process four times, once for each line of measure text:
    
    ```power-bi
    MinTemperature = CALCULATE(MINX(OPCUA, OPCUA[CurrentTemperature]))
    MaxTemperature = CALCULATE(MAXX(OPCUA, OPCUA[CurrentTemperature]))
    MinPressure = CALCULATE(MINX(OPCUA, OPCUA[Pressure]))
    MaxPressure = CALCULATE(MAXX(OPCUA, OPCUA[Pressure]))
    ```

    Make sure you're selecting **New measure** each time, so the measures are not overwriting each other.
    
    :::image type="content" source="media/quickstart-get-insights/power-bi-new-measure.png" alt-text="Screenshot of Power BI showing the creation of a new measure.":::

1. Select the name of the dataset in the top left, and rename it to something memorable. You will use this dataset in the next section:

    :::image type="content" source="media/quickstart-get-insights/power-bi-name-dataset.png" alt-text="Screenshot of Power BI showing a dataset being renamed.":::

## Configure Power BI report

In this section, you'll import a Power BI report template and configure it to pull data from your data sources. 

These steps are for Power BI Desktop, so open that application now.

### Import template and load Asset Registry data

1. Download the following Power BI template: [insightsTemplate.pbit](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/dashboard/insightsTemplate.pbit).
1. Open a new instance of Power BI Desktop.
1. Exit the startup screen and select **File** > **Import** > **Power BI template**. Select the file you downloaded to import it.
1. A dialog box pops up asking you to input an Azure subscription and resource group. Enter the Azure subscription ID and resource group where you've created your assets and select **Load**. This loads your sample asset data into Power BI using a custom [Power Query M](/powerquery-m/) script.

    You may see an error pop up for **DirectQuery to AS**. This is normal, and will be resolved later by configuring the data source. Close the error.

    :::image type="content" source="media/quickstart-get-insights/power-bi-import-error.png" alt-text="Screenshot of Power BI showing an error labeled DirectQuery to AS - quickStartDataset.":::

1. The template has now been imported, although it still needs some configuration to be able to display the data. If you see an option to **Apply changes** that are pending for your queries, select it and let the dashboard reload.

    :::image type="content" source="media/quickstart-get-insights/power-bi-initial-report.png" alt-text="Screenshot of Power BI Desktop showing a blank report." lightbox="media/quickstart-get-insights/power-bi-initial-report.png":::

1. Optional: To view the script that imports the asset data, right select **Asset** from the Data panel on the right side of the screen, and choose **Edit query**.

    :::image type="content" source="media/quickstart-get-insights/power-bi-edit-query.png" alt-text="Screenshot of Power BI showing the Edit query button." lightbox="media/quickstart-get-insights/power-bi-edit-query.png":::
    
    You'll see a few queries in the Power Query Editor window that comes up. Go through each of them and select **Advanced Editor** in the top menu to view the details of the queries. The most important query is **GetAssetData**.
    
    :::image type="content" source="media/quickstart-get-insights/power-bi-advanced-editor.png" alt-text="Screenshot of Power BI showing the advanced editor.":::
    
    When you're finished, exit the Power Query Editor window.

### Configure remaining report visuals

At this point, the visuals in the Power BI report still display errors. That's because you need to get the telemetry data.

1. Select **File** > **Options and Settings** > **Data source settings**.  
1. Select **Change Source**. 

    :::image type="content" source="media/quickstart-get-insights/power-bi-change-data-source.png" alt-text="Screenshot of Power BI showing the Data source settings.":::

    This displays a list of data source options. Select the dataset you created in the previous section and select **Create**.

1. In the **Connect to your data** box that opens, expand your dataset and select the *OPCUA* contextualized telemetry table. Select **Submit**.

    :::image type="content" source="media/quickstart-get-insights/power-bi-connect-to-your-data.png" alt-text="Screenshot of Power BI showing the Connect to your data options.":::

    Close the data source settings. The dashboard should now load visual data.

1. In the left pane menu, select the icon for **Model view**.

    :::image type="content" source="media/quickstart-get-insights/power-bi-model-view.png" alt-text="Screenshot of Power BI showing the Model View button." lightbox="media/quickstart-get-insights/power-bi-model-view.png":::

1. Drag **assetName** in the **Asset** box to **AssetName** in the **OPCUA** box, to create a relationship between the tables.

1. In the **Create relationship** box, set **Cardinality** to _One to many (1:*)_, and set **Cross filter direction** to *Both*. Select **OK**.

    :::image type="content" source="media/quickstart-get-insights/power-bi-create-relationship.png" alt-text="Screenshot of Power BI Create relationship options." lightbox="media/quickstart-get-insights/power-bi-create-relationship.png":::

1. Return to the **Report view** using the left pane menu. All the visuals should display data now without error.

    :::image type="content" source="media/quickstart-get-insights/power-bi-page-1.png" alt-text="Screenshot of Power BI showing the report view." lightbox="media/quickstart-get-insights/power-bi-page-1.png":::

## View insights

In this section, you'll review the report that was created and consider how such reports can be used in your business.

The report is split into two pages, each offering a different view of the asset and telemetry data. On Page 1, you can view each asset and their associated telemetry. Page 2 allows you to view multiple assets and their associated telemetry simultaneously, to compare data points at a specified time period.

:::image type="content" source="media/quickstart-get-insights/power-bi-page-2.png" alt-text="Screenshot of Power BI showing page 2 of the report view." lightbox="media/quickstart-get-insights/power-bi-page-2.png":::

For this quickstart, you only created one asset. However, if you experiment with adding other assets, you'll be able to select them independently on this report page by using *CTRL+Select*. Take some time to explore the various filters for each visual to explore and do more with your data.

With data connected from various sources at the edge being related to one another in Power BI, the visualizations and interactive features in the report allow you to gain deeper insights into asset health, utilization, and operational trends. This can empower you to enhance productivity, improve asset performance, and drive informed decision-making for better business outcomes.

## How did we solve the problem?

In this quickstart, you prepared your lakehouse data to be a source for Power BI, imported a report template into Power BI, and configured the report to display your lakehouse data in report graphs that visually track their changing values over time. This represents the final step in the quickstart flow for using Azure IoT Operations to manage device data from deployment through analysis in the cloud.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster that you deployed Azure IoT Operations to and remove the Azure resource group that contains the cluster.

You can delete your Microsoft Fabric workspace and your Power BI report.

You might also want to remove Power BI Desktop from your local machine.
