---
title: "Quickstart: Get insights from your processed data"
description: "Quickstart: Use a Real-Time Dashboard to capture insights from the OPC UA data you sent to Event Hubs."
author: baanders
ms.author: baanders
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 11/05/2024

#CustomerIntent: As an OT user, I want to create a visual report for my processed OPC UA data that I can use to analyze and derive insights from it.
---

# Quickstart: Get insights from your processed data

In this quickstart, you populate a [Real-Time Dashboard](/fabric/real-time-intelligence/dashboard-real-time-create) to capture insights from the OPC UA data that you sent to Event Hubs in the previous quickstart. Using Microsoft Fabric Real-Time Intelligence, you bring your data from Event Hubs into Microsoft Fabric, and map it into a KQL database that can be a source for Real-Time Dashboards. Then, you build a dashboard to display that data in visual tiles that capture insights and show the values over time.

These operations are the last steps in the sample end-to-end quickstart experience, which goes from deploying Azure IoT Operations at the edge through getting insights from that device data in the cloud.

## Prerequisites

Before you begin this quickstart, you must complete the previous Azure IoT Operations quickstarts.

You also need to meet the following Fabric requirements:
* Have a Microsoft Fabric subscription. In your subscription, you need access to a workspace with **Contributor** or above permissions.
* Your Fabric tenant must allow the creation of Real-Time Dashboards. This is a setting that can be enabled by your tenant administrator. For more information, see [Enable tenant settings in the admin portal](/fabric/real-time-intelligence/dashboard-real-time-create#enable-tenant-settings-in-the-admin-portal).

## What problem will we solve?

Once your OPC UA data has arrived in the cloud, you'll have a lot of information available to analyze. You might want to organize that data and create reports containing graphs and visualizations to derive insights from the data. The steps in this quickstart illustrate how you can connect that data to Real-Time Intelligence and create a Real-Time Dashboard.

## Ingest data into Real-Time Intelligence

In this section, you set up a Microsoft Fabric *eventstream* to connect your event hub to a KQL database in Real-Time Intelligence. This process includes setting up a data mapping to transform the payload data from its JSON format to columns in KQL.

### Create an eventstream

In this section, you create an eventstream that will be used to bring your data from Event Hubs into Microsoft Fabric Real-Time Intelligence, and eventually into a KQL database.

Start by navigating to the [Real-Time Intelligence experience in Microsoft Fabric](https://msit.powerbi.com/home?experience=kusto) and opening your Fabric workspace.

Follow the steps in [Create an eventstream in Microsoft Fabric](/fabric/real-time-intelligence/event-streams/create-manage-an-eventstream?pivots=standard-capabilities#create-an-eventstream-1) to create a new eventstream resource in your workspace.

After the eventstream is created, you'll see the main editor where you can start building the eventstream.

### Add event hub as a source

Next, add your event hub from the previous quickstart as a data source for the eventstream.

Follow the steps in [Add Azure Event Hubs source to an eventstream](/fabric/real-time-intelligence/event-streams/add-source-azure-event-hubs?pivots=standard-capabilities#add-an-azure-event-hub-as-a-source) to add the event source. Keep the following notes in mind:

- You'll be creating a new cloud connection with Shared Access Key authentication.
    - Make sure local authentication is enabled on your Event Hubs namespace. You can set this from its Overview page in the Azure portal.
- For **Consumer group**, use the default selection (*$Default*).
- For **Data format**, choose *Json* (it might be selected already by default).

After completing this flow, the Azure event hub is visible in the eventstream live view as a source.

:::image type="content" source="media/quickstart-get-insights/source-added.png" alt-text="Screenshot of the eventstream with an AzureEventHub source.":::

#### Verify dataflow

Follow these steps to check your work so far, and make sure data is flowing into the eventstream.

1. Start your cluster where you deployed Azure IoT Operations in earlier quickstarts. The OPC PLC simulator you deployed with your Azure IoT Operations instance should begin running and sending data. You can [verify that your event hub is receiving messages](quickstart-configure.md#verify-data-is-flowing-to-event-hubs) in the Azure portal. 

1. Wait a few minutes for data to propagate. Then, in the eventstream live view, select the Azure event hub source and refresh the **Data preview**. You should see JSON data from the simulator begin to appear in the table.

    :::image type="content" source="media/quickstart-get-insights/source-added-data.png" alt-text="Screenshot of the eventstream with data from the AzureEventHub source.":::

>[!TIP]
>If data has not arrived in your eventstream, you may want to check your event hub activity to This will help you isolate which section of the flow to debug.

### Prepare KQL resources

In this section, you create a KQL database in your Microsoft Fabric workspace to use as a destination for your data.

1. Follow the steps in [Create an eventhouse](/fabric/real-time-intelligence/create-eventhouse#create-an-eventhouse-1) to create a Real-Time Intelligence eventhouse with a child KQL database. You only need to complete the section entitled **Create an eventhouse**.

1. Next, create a table in your database. Call it *OPCUA* and use the following columns.

    | Column name | Data type |
    | --- | --- |
    | AssetId | string |
    | Spike | bool |
    | Temperature | decimal |
    | FillWeight | decimal |
    | EnergyUse | decimal |
    | Timestamp | datetime |

1. After the *OPCUA* table has been created, select it and use the **Explore your data** button to open a query window for the table.

    :::image type="content" source="media/quickstart-get-insights/explore-your-data.png" alt-text="Screenshot showing the Explore your data button.":::

1. Run the following KQL query to create a data mapping for your table. The data mapping will be called *opcua_mapping*.

    ```kql
    .create table ['OPCUA'] ingestion json mapping 'opcua_mapping' '[{"column":"AssetId", "Properties":{"Path":"$[\'AssetId\']"}},{"column":"Spike", "Properties":{"Path":"$.Spike"}},{"column":"Temperature", "Properties":{"Path":"$.TemperatureF"}},{"column":"FillWeight", "Properties":{"Path":"$.FillWeight.Value"}},{"column":"EnergyUse", "Properties":{"Path":"$.EnergyUse.Value"}},{"column":"Timestamp", "Properties":{"Path":"$[\'EventProcessedUtcTime\']"}}]'
    ```

### Add data table as a destination

Next, return to your eventstream view, where you can add your new KQL table as an eventstream destination.

Follow the steps in [Add a KQL Database destination to an eventstream](/fabric/real-time-intelligence/event-streams/add-destination-kql-database?pivots=standard-capabilities#direct-ingestion-mode) to add the destination. Keep the following notes in mind:

- Use direct ingestion mode.
- On the **Configure** step, select the *OPCUA* table that you created earlier.
- On the **Inspect** step, open the **Advanced** options. Under **Mapping**, select **Existing mapping** and choose *opcua_mapping*.

    :::image type="content" source="media/quickstart-get-insights/existing-mapping.png" alt-text="Screenshot adding an existing mapping.":::

    >[!TIP]
    >If no existing mappings are found, try refreshing the eventstream editor and restarting the steps to add the destination. Alternatively, you can initiate this same configuration process from the KQL table instead of from the eventstream, as described in [Get data from Eventstream](/fabric/real-time-intelligence/get-data-eventstream).

After completing this flow, the KQL table is visible in the eventstream live view as a destination.

Wait a few minutes for data to propagate. Then, select the KQL destination and refresh the **Data preview** to see the processed JSON data from the eventstream appearing in the table.

:::image type="content" source="media/quickstart-get-insights/destination-added-data.png" alt-text="Screenshot of the eventstream with data in the KQL database destination.":::

If you want, you can also view and query this data in your KQL database directly.

:::image type="content" source="media/quickstart-get-insights/query-kql.png" alt-text="Screenshot of the same data being queried from the KQL database.":::

## Create a Real-Time Dashboard

In this section, you'll create a new [Real-Time Dashboard](/fabric/real-time-intelligence/dashboard-real-time-create) to visualize your quickstart data, and import a set of tiles from a sample dashboard template. The dashboard will allow filtering by asset ID and timestamp, and will display visual summaries of temperature, spike frequency, and other data.

>[!NOTE]
>You can only create Real-Time Dashboards if your tenant admin has enabled the creation of Real-Time Dashboards in your Fabric tenant. For more information, see [Enable tenant settings in the admin portal](/fabric/real-time-intelligence/dashboard-real-time-create#enable-tenant-settings-in-the-admin-portal).

### Create dashboard

Follow the steps in the [Create a new dashboard](/fabric/real-time-intelligence/dashboard-real-time-create#create-a-new-dashboard) section to create a new Real-Time Dashboard from the Real-Time Intelligence capabilities.

### Upload template and connect data source

Download the sample dashboard template from this location in GitHub: [dashboard-AIOquickstart.json](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/dashboard/dashboard-AIOquickstart.json).

Then, follow the steps below to upload the dashboard template and connect it to your data.
1. In your Real-Time Dashboard, switch to the **Manage** tab and select **Replace with file**.
    :::image type="content" source="media/quickstart-get-insights/dashboard-upload-replace.png" alt-text="Screenshot of the buttons to upload a file template.":::
1. Select the template file that you downloaded to your machine.
1. The template file populates the dashboard with multiple tiles, although the tiles can't get data since you haven't yet connected your data source.
    :::image type="content" source="media/quickstart-get-insights/dashboard-upload-errors.png" alt-text="Screenshot of the dashboard with erroring visuals.":::
1. From the **Manage** tab, select **Data sources**. This opens the **Data sources** pane with a sample source for your AIO data. Select the pencil icon to edit the *AIOdata* data source.
    :::image type="content" source="media/quickstart-get-insights/dashboard-data-sources.png" alt-text="Screenshot of the buttons to connect a data source.":::
1. Choose your database (it will be under **OneLake data hub**). When you're finished selecting your data source, select **Apply** and close the **Data sources** pane.

The visuals should populate with the data from your KQL database.

:::image type="content" source="media/quickstart-get-insights/dashboard.png" alt-text="Screenshot of the dashboard.":::

### Explore dashboard

Now you have a dashboard that displays different types of visuals for the asset data in these quickstarts. Here are the visuals included with the template:
* Parameters for your dashboard that allow all visuals to be filtered by timestamp (included by default) and asset ID.
* A line chart tile showing temperature and its spikes over time.
* A stat tile showing a real-time spike indicator for temperature. The tile displays the most recent temperature value, and if that value is a spike, conditional formatting will display it as a warning.
* A stat tile showing max temperature.
* A stat tile showing the number of spikes in the selected time frame.
* A line chart tile showing temperature versus fill weight over time.
* A line chart tile showing temperature versus energy use over time.

From here, you can experiment with the filters and adding other tile types to see how a dashboard can enable you to do more with your data.

This completes the final step in the quickstart flow for using Azure IoT Operations to manage device data from deployment through analysis in the cloud.

## Clean up resources

Now that you're finished with the quickstart experience, this section contains instructions to delete your sample resources.

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

> [!NOTE]
> The resource group contains the Event Hubs namespace you created in this quickstart.

You can also delete your Microsoft Fabric workspace and/or all the resources within it associated with this quickstart, including the eventstream, eventhouse, and Real-Time Dashboard. Additionally, you may want to delete the dashboard template file that you downloaded to your computer.