---
title: "Quickstart: Get insights from your processed data"
description: "Quickstart: Use a Real-Time Dashboard to capture insights from the OPC UA data you sent to Event Hubs."
author: baanders
ms.author: baanders
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 11/04/2024

#CustomerIntent: As an OT user, I want to create a visual report for my processed OPC UA data that I can use to analyze and derive insights from it.
---

# Quickstart: Get insights from your processed data

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you populate a [Real-Time Dashboard](/fabric/real-time-intelligence/dashboard-real-time-create) to capture insights from the OPC UA data that you sent to Event Hubs in the previous quickstart. Using Microsoft Fabric Real-Time Intelligence, you bring your data from Event Hubs into Microsoft Fabric, and map it into a KQL database that can be a source for Real-Time Dashboards. Then, you build a dashboard to display that data in visual tiles that capture insights and show the values over time.

These operations are the last steps in the sample end-to-end quickstart experience, which goes from deploying Azure IoT Operations Preview at the edge through getting insights from that device data in the cloud.

## Prerequisites

Before you begin this quickstart, you must complete the previous Azure IoT Operations quickstarts.

You also need a Microsoft Fabric subscription. In your subscription, you need access to a workspace with **Contributor** or above permissions.

Additionally, your Fabric tenant must allow the creation of Real-Time Dashboards. This is a setting that can be enabled by your tenant administrator. For more information, see [Enable tenant settings in the admin portal](/fabric/real-time-intelligence/dashboard-real-time-create#enable-tenant-settings-in-the-admin-portal).

## What problem will we solve?

Once your OPC UA data has arrived in the cloud, you'll have a lot of information available to analyze. You might want to organize that data and create reports containing graphs and visualizations to derive insights from the data. The steps in this quickstart illustrate how you can connect that data to Real-Time Intelligence and build a Real-Time Dashboard.

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

1. Start your cluster where you deployed Azure IoT Operations in earlier quickstarts. The OPC PLC simulator you deployed with your Azure IoT Operations instance should begin running and sending data to the MQTT broker. You can verify this part of the flow using mqttui as described in [Verify data is flowing](quickstart-add-assets.md#verify-data-is-flowing).

1. Wait a few minutes for data to propagate. Then, in the eventstream live view, select the *AzureEventHub* source and refresh the **Data preview**. You should see JSON data from the simulator begin to appear in the table.

    :::image type="content" source="media/quickstart-get-insights/source-added-data.png" alt-text="Screenshot of the eventstream with data from the AzureEventHub source.":::

>[!TIP]
>If data has not arrived in your eventstream, you may want to check your event hub activity to [verify that it's receiving messages](quickstart-configure.md#verify-data-is-flowing-to-event-hubs). This will help you isolate which section of the flow to debug.

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

In this section, you'll create a new [Real-Time Dashboard](/fabric/real-time-intelligence/dashboard-real-time-create) to visualize your quickstart data. The dashboard will allow filtering by asset ID and timestamp, and will display visual summaries of temperature and other data.

>[!NOTE]
>You can only create Real-Time Dashboards if your tenant admin has enabled the creation of Real-Time Dashboards in your Fabric tenant. For more information, see [Enable tenant settings in the admin portal](/fabric/real-time-intelligence/dashboard-real-time-create#enable-tenant-settings-in-the-admin-portal).

### Create dashboard and connect data source

Follow the steps in the [Create a new dashboard](/fabric/real-time-intelligence/dashboard-real-time-create#create-a-new-dashboard) section to create a new Real-Time Dashboard from the Real-Time Intelligence capabilities.

Then, follow the steps in the [Add data source](/fabric/real-time-intelligence/dashboard-real-time-create#add-data-source) section to add your database as a data source. Keep the following note in mind:

- In the **Data sources** pane, your database will be under **OneLake data hub**.

### Configure parameters

Next, configure some parameters for your dashboard so that the visuals can be filtered by asset ID and timestamp. The dashboard comes with a default parameter to filter by time range, so you only need to create one that can filter by asset ID.

1. Switch to the **Manage** tab, and select **Parameters**. Select **+ Add** to add a new parameter.

    :::image type="content" source="media/quickstart-get-insights/add-parameter.png" alt-text="Screenshot of adding a parameter to a dashboard.":::

1. Create a new parameter with the following characteristics:
    * **Label**: *Asset*
    * **Parameter type**: *Single selection* (already selected by default)
    * **Variable name**: *_asset*
    * **Data type**: *string* (already selected by default)
    * **Source**: *Query*
        * **Data source**: Your database (already selected by default)
        * Select **Edit query** and add the following KQL query.

            ```kql
            OPCUA
            | summarize by AssetId
            ```
    * **Value column**: *AssetId (string)*
    * **Default value**: *Select first value of query*

1. Select **Done** to save your parameter.

### Create line chart tile

Next, add a tile to your dashboard to show a line chart of temperature and its spikes over time for the selected asset and time range.

1. Select either **+ Add tile** or **New tile** to add a new tile.

    :::image type="content" source="media/quickstart-get-insights/add-tile.png" alt-text="Screenshot of adding a tile to a dashboard.":::

1. Enter the following KQL query for the tile. This query applies filter parameters from the dashboard selectors for time range and asset, and pulls the timestamp, temperature and spike value from the resulting records with their timestamp. It then adds a column for a spike marker that will be added to the line chart. 

    ```kql
    OPCUA 
    | where Timestamp between (_startTime .. _endTime)
    | where AssetId == _asset
    | project Timestamp, Temperature, Spike
    | extend SpikeMarker = iff(Spike == true, Temperature, decimal(null))
    ```

    **Run** the query to verify that data can be found.

    :::image type="content" source="media/quickstart-get-insights/chart-query.png" alt-text="Screenshot of adding a tile query.":::

1. Select **+ Add visual** next to the query results to add a visual for this data. Create a visual with the following characteristics:

    - **Tile name**: *Temperature with spikes over time*
    - **Visual type**: *Line chart*
    - **Data**:
        - **Y columns**: *Temperature (decimal)*, *Spike (boolean)* (already inferred by default)
        - **X columns**: *Timestamp (datetime)* (already inferred by default)
        - **Series columns**: Leave the default inferred value.
    - **Y Axis**:
        - **Label**: *Temperature (°F)*
    - **X Axis**:
        - **Label**: *Timestamp*

    Select **Apply changes** to create the tile.

    :::image type="content" source="media/quickstart-get-insights/chart-visual.png" alt-text="Screenshot of adding a tile visual.":::

View the finished tile on your dashboard.

:::image type="content" source="media/quickstart-get-insights/dashboard-1.png" alt-text="Screenshot of the dashboard with the line chart tile.":::

### Create max value tile

Next, create a tile to display a real-time spike indicator for temperature.

1. Select **New tile** to create a new tile.

1. Enter the following KQL query for the tile. This query applies filter parameters from the dashboard selectors for time range and asset, and takes the timestamp, temperature, and spike value from the resulting records.

    ```kql
    OPCUA
    | where Timestamp between (_startTime .. _endTime)
    | where AssetId == _asset
    | project Timestamp, Temperature, Spike
    ```

    **Run** the query to verify that data can be found.

1. Select **+ Add visual** to add a visual for this data. Create a visual with the following characteristics:
    - **Tile name**: *Spike indicator*
    - **Visual type**: *Stat*
    - **Data**:
        - **Value column**: *Temperature (decimal)* (already inferred by default)
    - **Conditional formatting**: Select **+ Add rule** and select the pencil icon to edit the rule.
        - **Conditions**: Use the entry form to enter the condition *Spike == true*.
        - **Color**: Select *Red* and choose the warning icon.

        :::image type="content" source="media/quickstart-get-insights/conditional-formatting.png" alt-text="Screenshot of the conditional formatting options.":::
        
        **Save** the conditional formatting.

    Select **Apply changes** to create the tile.

1. View the finished tile on your dashboard (you may want to resize the tile so the full text is visible). The tile will always display the most recent temperature value, but the conditional formatting will only be triggered if that value is a spike.

    :::image type="content" source="media/quickstart-get-insights/dashboard-2.png" alt-text="Screenshot of the dashboard with the stat tile.":::

1. **Save** your completed dashboard.

Now you have a dashboard that displays different types of visuals for the asset data in these quickstarts. From here, you can experiment with the filters and adding other tile types to see how a dashboard can enable you to do more with your data.

### Experiment with dashboard queries

Below are some more queries that you can use to add additional tiles to your dashboard and visualize your data differently. Try using them to create your own tiles.

* Query for a line chart tile, *Temperature (F) vs. Fill Weight*:
    ```kql
    OPCUA 
    | where Timestamp between (_startTime.._endTime)
    | where AssetId == _asset
    | project Timestamp, Temperature, FillWeight
    ```
* Query for a line chart tile, *Temperature (F) vs. Energy Use*:
    ```kql
    OPCUA 
    | where Timestamp between (_startTime.._endTime)
    | where AssetId == _asset
    | project Timestamp, Temperature, EnergyUse
    ```
* Query for a stat tile, *Max temperature*:
    ```kql
    OPCUA
    | where Timestamp between (_startTime.._endTime)
    | where AssetId == _asset
    | top 1 by Temperature desc
    | summarize by Temperature
    ```
* Query for a stat tile, *Number of spikes in time frame*:
    ```kql
    OPCUA
    | where Timestamp between (_startTime .. _endTime)
    | where AssetId == _asset
    | where Spike == true
    | summarize SpikeCount = count()
    ```

## How did we solve the problem?

In this quickstart, you used an eventstream to ingest your Event Hubs data into a KQL database in Microsoft Fabric Real-Time Intelligence. Then, you created a Real-Time Dashboard powered by that data, which visually tracks changing values over time. By relating edge data from various sources together in Microsoft Fabric, you can create reports with visualizations and interactive features that offer deeper insights into asset health, utilization, and operational trends. This can empower you to enhance productivity, improve asset performance, and drive informed decision-making for better business outcomes.

This completes the final step in the quickstart flow for using Azure IoT Operations to manage device data from deployment through analysis in the cloud.

## Clean up resources

If you're continuing on to the next quickstart, keep all of your resources.

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

> [!NOTE]
> The resource group contains the Event Hubs namespace you created in this quickstart.

You can also delete your Microsoft Fabric workspace and/or all the resources within it associated with this quickstart, including the eventstream, eventhouse, and Real-Time Dashboard.
