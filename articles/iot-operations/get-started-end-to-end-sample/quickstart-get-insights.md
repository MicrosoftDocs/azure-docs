---
title: "Quickstart: get insights from your processed data"
description: "Quickstart: Use a Real-Time Dashboard to capture insights from your OPC UA data you sent to Event Hubs."
author: baanders
ms.author: baanders
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 07/19/2024

#CustomerIntent: As an OT user, I want to create a visual report for my processed OPC UA data that I can use to analyze and derive insights from it.
---

# Quickstart: Get insights from your processed data

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you populate a [Real-Time Dashboard](/fabric/real-time-intelligence/dashboard-real-time-create) to capture insights from your OPC UA data that you sent to Event Hubs in the previous quickstart. Using Microsoft Fabric Real-Time Intelligence, you bring your data from Event Hubs into Microsoft Fabric, and organize it into a KQL database that can be a source for Real-Time Dashboards. Then, you'll import a dashboard template and connect your data sources to that dashboard so that it displays visual graphs of your data over time.

These operations are the last steps in the sample end-to-end quickstart experience, which goes from deploying Azure IoT Operations Preview at the edge through getting insights from that device data. 

## Prerequisites

Before you begin this quickstart, you must complete the following quickstarts:

- [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](quickstart-deploy.md)
- [Quickstart: Add OPC UA assets to your Azure IoT Operations Preview cluster](quickstart-add-assets.md)
- [Quickstart: Send asset telemetry to the cloud using the data lake connector for Azure IoT MQ](quickstart-upload-telemetry-to-cloud.md)

You also need a Microsoft Fabric subscription. In your subscription, you need access to a **premium workspace** with **Contributor** or above permissions.

## What problem will we solve?

Once your OPC UA data has been processed and enriched in the cloud, you'll have a lot of information available to analyze. You might want to create reports containing graphs and visualizations to help you organize and derive insights from this data. The template and steps in this quickstart illustrate how you can connect that data to Real-Time Dashboards to build such reports.

## Get data into a KQL database

In this section, you set up a Microsoft Fabric eventstream to connect your event hub to a KQL database in Real-Time Intelligence. As part of this process, you'll also set up a data mapping to transform the data from its JSON format to readable columns in KQL.

### Create a Microsoft Fabric eventstream

https://learn.microsoft.com/en-us/fabric/real-time-intelligence/event-streams/create-manage-an-eventstream?pivots=enhanced-capabilities

In this section, you create a Microsoft Fabric eventstream that will be used to bring your data from Event Hubs into Microsoft Fabric, and eventually into a KQL database.

1. Start by navigating to the [Microsoft Fabric Real-Time Intelligence experience](https://msit.powerbi.com/home?experience=kusto).
1. On the **Real-Time Intelligence** homepage, select the **Eventstream** tile:
    :::image type="content" source="media/quickstart-get-insights/eventstream.png" alt-text="Screenshot of the Eventstream tile in Microsoft Fabric.":::
1. Enter a **Name** for the new eventstream and check the box for **Enhanced Capabilities (preview)**, then select Create.

Creation of the new eventstream in your workspace can take a few seconds. After the eventstream is created, you're directed to the main editor where you can start with adding sources to the eventstream.

    :::image type="content" source="media/quickstart-get-insights/eventstream-editor.png" alt-text="Screenshot of the Eventstream editor in Microsoft Fabric.":::

### Add event hub as a source

Next, add your event hub from the previous quickstart as a data source for the eventstream.

Follow the steps in [Add Azure Event Hubs source to an eventstream](/fabric/real-time-intelligence/event-streams/add-source-azure-event-hubs?pivots=enhanced-capabilities) to add the event source. Keep the following notes in mind:
* When it's time to select a **Data format**, choose *Json*.
* Make sure to complete all the steps in the article through selecting **Publish** on the ribbon.

After completing this flow, the Azure event hub is visible in the eventstream live view as a source.

:::image type="content" source="media/quickstart-get-insights/source-added.png" alt-text="Screenshot of the eventstream with an AzureEventHub source.":::

#### Verify data flow

Follow these steps to check your work so far, and make sure data is flowing into the eventstream.

1. Start your cluster from earlier quickstarts. The OPC PLC simulator you deployed with your Azure IoT Operations instance should begin running and sending data to the MQ broker. You can verify this part of the flow using mqttui as described in [Verify data is flowing](quickstart-add-assets.md#verify-data-is-flowing).

1. Wait a few minutes for data to propagate. Then, in the eventstream live view, refresh the **Data preview**. You should see JSON data from the simulator begin to appear in the table.

    :::image type="content" source="media/quickstart-get-insights/source-added-data.png" alt-text="Screenshot of the eventstream with data from the AzureEventHub source.":::

>[!TIP]
>If data has not arrived in your eventstream, you may want to check your event hub to verify that it's receiving messages. This will help you isolate which section of the flow to debug.

### Prepare KQL resources

In this section, you create a KQL database in your Microsoft Fabric workspace to use as a destination for your data.

1. Follow the steps in [Create an eventhouse](/fabric/real-time-intelligence/create-eventhouse#create-an-eventhouse-1) to create a Real-Time Intelligence eventhouse with a child KQL database. You only need to complete the section entitled **Create an eventhouse**.

1. Next, create KQL table in your database. Call it *OPCUA* and use the following columns.

    | Column name | Data type |
    | --- | --- |
    | SequenceNumber | int |
    | assetName | string |
    | Temperature | decimal | 
    | Pressure | decimal | 
    | Timestamp | datetime |
    
    :::image type="content" source="media/quickstart-get-insights/columns.png" alt-text="Screenshot of columns while creating a KQL table.":::

1. Select the *OPCUA* table, and select **Explore your data** to open the query window for your table.

    :::image type="content" source="media/quickstart-get-insights/explore-your-data.png" alt-text="Screenshot showing the Explore your data button.":::

1. Run the following command to create a data mapping for your table. The data mapping will be called *opcua_mapping*.

    ```kql
    .create table ['OPCUA'] ingestion json mapping 'opcua_mapping' '[{"column":"SequenceNumber", "Properties":{"Path":"$[\'SequenceNumber\']"}},{"column":"assetName", "Properties":{"Path":"$[\'DataSetWriterName\']"}},{"column":"Temperature", "Properties":{"Path":"$.Payload.temperature.Value"}},{"column":"Pressure", "Properties":{"Path":"$.Payload.[\'Tag 10\'].Value"}},{"column":"Timestamp", "Properties":{"Path":"$[\'Timestamp\']"}}]'
    ``` 

#### Add the destination

Next, return to your eventstream view, where you can add your new KQL database as an eventstream destination.

Follow the steps in [Add a KQL Database destination to an eventstream](/fabric/real-time-intelligence/event-streams/add-destination-kql-database?pivots=enhanced-capabilities#direct-ingestion-mode) to add the destination. Keep the following notes in mind:
* Use direct ingestion mode.
* On the **Configure** tab, select the *OPCUA* table that you created earlier.
* On the **Inspect** tab, open the **Advanced** options. Under **Mapping**, select **Existing mapping** and choose *opcua_mapping*.

    :::image type="content" source="media/quickstart-get-insights/existing-mapping.png" alt-text="Screenshot adding an existing mapping.":::
    
    >[!TIP]
    >If no existing mappings are found, try refreshing the event stream editor and restarting the steps to add the destination. Alternatively, you can initiate this same configuration process from the KQL table instead of from the eventstream, as described in [Get data from Eventstream](/fabric/real-time-intelligence/get-data-eventstream).

After completing this flow, the KQL database is visible in the eventstream live view as a destination.

Wait a few minutes for data to propagate. Then, select the KQL destination and refresh the **Data preview** to see the processed JSON data from the eventstream appearing in the table.

:::image type="content" source="media/quickstart-get-insights/destination-added-data.png" alt-text="Screenshot of the eventstream with data in the KQL database destination.":::

If you want, you can also view and query this data in your KQL database directly.

:::image type="content" source="media/quickstart-get-insights/query-kql.png" alt-text="Screenshot of the same data being queried from the KQL database.":::

## Create Real-Time Dashboard

https://learn.microsoft.com/en-us/fabric/real-time-intelligence/dashboard-real-time-create

<!--TO-DO-->

## How did we solve the problem?

In this quickstart, you prepared your lakehouse data to be a source for Power BI, imported a dashboard template into Power BI, and configured the dashboard to display your lakehouse data in dashboard graphs that visually track their changing values over time. This represents the final step in the quickstart flow for using Azure IoT Operations to manage device data from deployment through analysis in the cloud.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster where you deployed Azure IoT Operations and remove the Azure resource group that contains the cluster.

You can delete your Microsoft Fabric workspace and your Power BI dashboard.

You might also want to remove Power BI Desktop from your local machine.