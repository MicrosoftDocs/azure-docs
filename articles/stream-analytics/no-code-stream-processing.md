---
title: No code stream processing using Azure Stream Analytics
description: Learn about processing your real time data streams in Azure Event Hubs using the Azure Stream Analytics no code editor.
author: sidramadoss
ms.author: sidram
ms.service: stream-analytics
ms.topic: how-to
ms.custom: mvc, event-tier1-build-2022
ms.date: 05/08/2022
---

# No code stream processing using Azure Stream Analytics (Preview)

You can process your real time data streams in Azure Event Hubs using Azure Stream Analytics. The no code editor allows you to easily develop a Stream Analytics job without writing a single line of code. Within minutes, you can develop and run a job that tackles many scenarios, including:

- Filtering and ingesting to Azure Synapse SQL
- Capturing your Event Hubs data in Parquet format in Azure Data Lake Storage Gen2
- Materializing data in Azure Cosmos DB

The experience provides a canvas that allows you to connect to input sources to quickly see your streaming data. Then you can transform it before writing to your destination of choice in Azure.

You can:

- Modify input schema
- Perform data preparation operations like joins and filters
- Tackle advanced scenarios such as time-window aggregations (tumbling, hopping, and session windows) for group-by operations

After you create and run your Stream Analytics jobs, you can easily operationalize production workloads. Use the right set of [built-in metrics](stream-analytics-monitoring.md) for monitoring and troubleshooting purposes. Stream Analytics jobs are billed according to the [pricing model](https://azure.microsoft.com/pricing/details/stream-analytics/) when they're running.

## Prerequisites

Before you develop your Stream Analytics jobs using the no code editor, you must meet these requirements.

- The Azure Event Hubs namespace and any target destination resource where you want to write must be publicly accessible and can't be in an Azure Virtual Network.
- You must have the required permissions to access the streaming input and output resources.
- You must maintain permissions to create and modify Azure Stream Analytics resources.

## Azure Stream Analytics job

A Stream Analytics job is built on three main components: _streaming inputs_, _transformations_, and _outputs_. You can have as many components as you want, including multiple inputs, parallel branches with multiple transformations, and multiple outputs. For more information, see [Azure Stream Analytics documentation](index.yml).

To use the no code editor to easily create a Stream Analytics job, open an Event Hubs instance. Select Process Data and then select any template.

:::image type="content" source="./media/no-code-stream-processing/new-stream-analytics-job.png" alt-text="Screenshot showing navigation to create a new Stream Analytics job." lightbox="./media/no-code-stream-processing/new-stream-analytics-job.png" :::

The following screenshot shows a finished Stream Analytics job. It highlights all the sections available to you while you author.

:::image type="content" source="./media/no-code-stream-processing/created-stream-analytics-job.png" alt-text="Screenshot showing the authoring interface sections." lightbox="./media/no-code-stream-processing/created-stream-analytics-job.png" :::

1. **Ribbon** - On the ribbon, sections follow the order of a classic/ analytics process: Event Hubs as input (also known as data source), transformations (streaming ETL operations), outputs, a button to save your progress and a button to start the job.
2. **Diagram view** - A graphical representation of your Stream Analytics job, from input to operations to outputs.
3. **Side pane** -  Depending on which component you selected in the diagram view, you'll have settings to modify input, transformation, or output.
4. **Tabs for data preview, authoring errors, and runtime errors** - For each tile shown, the data preview will show you results for that step (live for inputs and on-demand for transformations and outputs). This section also summarizes any authoring errors or warnings that you might have in your job when it's being developed. Selecting each error or warning will select that transform.

## Event Hubs as the streaming input

Azure Event Hubs is a big-data streaming platform and event ingestion service. It can receive and process millions of events per second. Data sent to an event hub can be transformed and stored by using any real-time analytics provider or batching/storage adapters.

To configure an event hub as an input for your job, select the **Event Hub** symbol. A tile appears in the diagram view, including a side pane for its configuration and connection.

After you set up your Event Hubs credentials and select **Connect**, you can add fields manually by using **+ Add field** if you know the field names. To instead detect fields and data types automatically based on a sample of the incoming messages, select **Autodetect fields**. Selecting the gear symbol allows you to edit the credentials if needed. When Stream Analytics job detect the fields, you'll see them in the list. You'll also see a live preview of the incoming messages in the **Data Preview** table under the diagram view.

You can always edit the field names, or remove or change the data type, by selecting the three dot symbol next to each field. You can also expand, select, and edit any nested fields from the incoming messages, as shown in the following image.

:::image type="content" source="./media/no-code-stream-processing/event-hub-schema.png" alt-text="Screenshot showing Event Hub fields where you add, remove, and edit the fields." lightbox="./media/no-code-stream-processing/event-hub-schema.png" :::

The available data types are:

- **DateTime** - Date and time field in ISO format
- **Float** - Decimal number
- **Int** - Integer number
- **Record** - Nested object with multiple records
- **String** - Text

## Transformations

Streaming data transformations are inherently different from batch data transformations. Almost all streaming data has a time component, which affects any data preparation tasks involved.

To add a streaming data transformation to your job, select the transformation symbol on the ribbon for that transformation. The respective tile will be dropped in the diagram view. After you select it, you'll see the side pane for that transformation to configure it.

### Filter

Use the **Filter** transformation to filter events based on the value of a field in the input. Depending on the data type (number or text), the transformation will keep the values that match the selected condition.

:::image type="content" source="./media/no-code-stream-processing/filter-transformation.png" alt-text="Screenshot showing the Filter event fields view." lightbox="./media/no-code-stream-processing/filter-transformation.png" :::

> [!NOTE]
> Inside every tile, you'll see information about what else is needed for the transformation to be ready. For example, when you're adding a new tile, you'll see a `Set-up required` message. If you're missing a node connector, you'll see either an *Error* or a *Warning* message.

### Manage fields

The **Manage fields** transformation allows you to add, remove, or rename fields coming in from an input or another transformation. The settings on the side pane give you the option of adding a new one by selecting **Add field** or adding all fields at once.

:::image type="content" source="./media/no-code-stream-processing/manage-field-transformation.png" alt-text="Screenshot showing the Manage fields view." lightbox="./media/no-code-stream-processing/manage-field-transformation.png" :::

> [!TIP]
> After you configure a tile, the diagram view gives you a glimpse of the settings within the tile itself. For example, in the **Manage fields** area of the preceding image, you can see the first three fields being managed and the new names assigned to them. Each tile has information relevant to it.

### Aggregate

You can use the **Aggregate** transformation to calculate an aggregation (**Sum**, **Minimum**, **Maximum**, or **Average**) every time a new event occurs over a period of time. This operation also allows you to filter or slice the aggregation based on other dimensions in your data. You can have one or more aggregations in the same transformation.

To add an aggregation, select the transformation symbol. Then connect an input, select the aggregation, add any filter or slice dimensions, and select the period of time over which the aggregation will be calculated. In this example, we're calculating the sum of the toll value by the state where the vehicle is from over the last 10 seconds.

:::image type="content" source="./media/no-code-stream-processing/aggregate-transformation.png" alt-text="Screenshot showing the Aggregate view." lightbox="./media/no-code-stream-processing/aggregate-transformation.png" :::

To add another aggregation to the same transformation, select **Add aggregate function**. Keep in mind that the filter or slice will apply to all aggregations in the transformation.

### Join

Use the **Join** transformation to combine events from two inputs based on the field pairs that you select. If you don't select a field pair, the join will be based on time by default. The default is what makes this transformation different from a batch one.

As with regular joins, you have different options for your join logic:

- **Inner join** - Include only records from both tables where the pair matches. In this example, that's where the license plate matches both inputs.
- **Left outer join** - Include all records from the left (first) table and only the records from the second one that match the pair of fields. If there's no match, the fields from the second input will be blank.

To select the type of join, select the symbol for the preferred type on the side pane.

Finally, select over what period you want the join to be calculated. In this example, the join looks at the last 10 seconds. Keep in mind that the longer the period is, the less frequent the output is&mdash;and the more processing resources you'll use for the transformation.

By default, all fields from both tables are included. Prefixes left (first node) and right (second node) in the output help you differentiate the source.

:::image type="content" source="./media/no-code-stream-processing/join-transformation.png" alt-text="Screenshot showing the Join view." lightbox="./media/no-code-stream-processing/join-transformation.png" :::

### Group by

Use the **Group by** transformation to calculate aggregations across all events within a certain time window. You can group by the values in one or more fields. It's like the **Aggregate** transformation but provides more options for aggregations. It also includes more complex time-window options. Also like **Aggregate**, you can add more than one aggregation per transformation.

The aggregations available in the transformation are:

- **Average**
- **Count**
- **Maximum**
- **Minimum**
- **Percentile** (continuous and discrete)
- **Standard Deviation**
- **Sum**
- **Variance**

To configure the transformation:

1. Select your preferred aggregation.
2. Select the field that you want to aggregate on.
3. Select an optional group-by field if you want to get the aggregate calculation over another dimension or category. For example, **State**.
4. Select your function for time windows.

To add another aggregation to the same transformation, select **Add aggregate function**. Keep in mind that the **Group by** field and the windowing function will apply to all aggregations in the transformation.

:::image type="content" source="./media/no-code-stream-processing/group-by-transformation.png" alt-text="Screenshot showing the Group by view." lightbox="./media/no-code-stream-processing/group-by-transformation.png" :::

A time stamp for the end of the time window is provided as part of the transformation output for reference. For more information about time windows supported by Stream Analytics jobs, see [Windowing functions (Azure Stream Analytics)](/stream-analytics-query/windowing-azure-stream-analytics).

### Union

Use the **Union** transformation to connect two or more inputs to add events with shared fields (with the same name and data type) into one table. Fields that don't match will be dropped and not included in the output.

### Expand

Expand array is to create a new row for each value within an array.

:::image type="content" source="./media/no-code-stream-processing/expand-transformation.png" alt-text="Screenshot showing the Expand view." lightbox="./media/no-code-stream-processing/expand-transformation.png" :::

## Streaming outputs

The no-code drag-and-drop experience currently supports three outputs to store your processed real time data.

:::image type="content" source="./media/no-code-stream-processing/outputs.png" alt-text="Screenshot showing Streaming output options." lightbox="./media/no-code-stream-processing/outputs.png" :::

### Azure Data Lake Storage Gen2

Data Lake Storage Gen2 makes Azure Storage the foundation for building enterprise data lakes on Azure. It's designed from the start to service multiple petabytes of information while sustaining hundreds of gigabits of throughput. It allows you to easily manage massive amounts of data. Azure Blob storage offers a cost-effective and scalable solution for storing large amounts of unstructured data in the cloud.

Select **ADLS Gen2** as output for your Stream Analytics job and select the container where you want to send the output of the job. For more information about Azure Data Lake Gen2 output for a Stream Analytics job, see [Blob storage and Azure Data Lake Gen2 output from Azure Stream Analytics](blob-storage-azure-data-lake-gen2-output.md).

### Azure Synapse Analytics

Azure Stream Analytics jobs can output to a dedicated SQL pool table in Azure Synapse Analytics and can process throughput rates up to 200MB/sec. It supports the most demanding real-time analytics and hot-path data processing needs for workloads such as reporting and dashboarding.

> [!IMPORTANT]
> The dedicated SQL pool table must exist before you can add it as output to your Stream Analytics job. The table's schema must match the fields and their types in your job's output.

Select **Synapse** as output for your Stream Analytics job and select the SQL pool table where you want to send the output of the job. For more information about Synapse output for a Stream Analytics job, see [Azure Synapse Analytics output from Azure Stream Analytics](azure-synapse-analytics-output.md).

### Azure Cosmos DB

Azure Cosmos DB is a globally distributed database service that offers limitless elastic scale around the globe, rich query, and automatic indexing over schema-agnostic data models.

Select **CosmosDB** as output for your Stream Analytics job. For more information about Cosmos DB output for a Stream Analytics job, see [Azure Cosmos DB output from Azure Stream Analytics](azure-cosmos-db-output.md).

## Data preview and errors

The no code drag-and-drop experience provides tools to help you author, troubleshoot, and evaluate the performance of your analytics pipeline for streaming data.

### Live data preview for inputs

When you're connecting to an event hub and selecting its tile in the diagram view (the **Data Preview** tab), you'll get a live preview of data coming in if all the following are true:

- Data is being pushed.
- The input is configured correctly.
- Fields have been added.

As shown in the following screenshot, if you want to see or drill down into something specific, you can pause the preview (1). Or you can start it again if you're done.

You can also see the details of a specific record, a _cell_ in the table, by selecting it and then selecting **Show/Hide details** (2). The screenshot shows the detailed view of a nested object in a record.

:::image type="content" source="./media/no-code-stream-processing/data-preview.png" alt-text="Screenshot showing the Data Preview tab where you can pause the streaming preview and show/hide details." lightbox="./media/no-code-stream-processing/data-preview.png" :::

### Static preview for transformations and outputs

After you add and set up any steps in the diagram view, you can test their behavior by selecting **Get static preview**.

:::image type="content" source="./media/no-code-stream-processing/get-static-preview.png" alt-text="Screenshot showing the Get static preview option." lightbox="./media/no-code-stream-processing/get-static-preview.png" :::

After you do, the Stream Analytics job evaluates all transformations and outputs to make sure they're configured correctly. Stream Analytics then displays the results in the static data preview, as shown in the following image.

:::image type="content" source="./media/no-code-stream-processing/refresh-static-preview.png" alt-text="Screenshot showing the Data Preview tab where you can refresh the static preview." lightbox="./media/no-code-stream-processing/refresh-static-preview.png" :::

You can refresh the preview by selecting **Refresh static preview** (1). When you refresh the preview, the Stream Analytics job takes new data from the input and evaluates all transformations. Then it outputs again with any updates that you might have performed. The **Show/Hide details** option is also available (2).

### Authoring errors

If you have any authoring errors or warnings, the Authoring errors tab will list them, as shown in the following screenshot. The list includes details about the error or warning, the type of card (input, transformation, or output), the error level, and a description of the error or warning. 

:::image type="content" source="./media/no-code-stream-processing/authoring-errors.png" alt-text="Screenshot showing the Authoring errors tab that shows a list of example errors." lightbox="./media/no-code-stream-processing/authoring-errors.png" :::

### Runtime errors

Runtime errors are warning/Error/Critical level errors. These errors are helpful when you want to edit your Stream Analytics job topology/configuration for troubleshooting. In the following screenshot example, the user has configured Synapse output with an incorrect table name. The user started the job, but there's a Runtime error stating that the schema definition for the output table can't be found.

:::image type="content" source="./media/no-code-stream-processing/runtime-errors.png" alt-text="Screenshot showing the Runtime errors tab where you can select a timespan to filter error events." lightbox="./media/no-code-stream-processing/runtime-errors.png" :::

## Start a Stream Analytics job

Once you have configured Event Hubs, operations and Streaming outputs for the job, you Save and Start the job.

:::image type="content" source="./media/no-code-stream-processing/no-code-save-start.png" alt-text="Screenshot showing the Save and Start options." lightbox="./media/no-code-stream-processing/no-code-save-start.png" :::

- Output start time - When you start a job, you select a time for the job to start creating output.
    - Now - Makes the starting point of the output event stream the same as when the job is started.
    - Custom - You can choose the starting point of the output.
    - When last stopped - This option is available when the job was previously started but was stopped manually or failed. When you choose this option, the last output time will be used to restart the job, so no data is lost.
- Streaming units - Streaming Units represent the amount of compute and memory assigned to the job while running. If you're unsure how many SUs to choose, we recommend that you start with three and adjust as needed.
- Output data error handling – Output data error handling policies only apply when the output event produced by a Stream Analytics job doesn't conform to the schema of the target sink. You can configure the policy by choosing either **Retry** or **Drop**. For more information, see [Azure Stream Analytics output error policy](stream-analytics-output-error-policy.md).
- Start – Starts the Stream Analytics job.

:::image type="content" source="./media/no-code-stream-processing/start-job.png" alt-text="Screenshot showing the Start Stream Analytics job window where you review the job configuration and start the job." lightbox="./media/no-code-stream-processing/start-job.png" :::

## Stream Analytics jobs list

You can see the list of all Stream Analytics jobs created by no-code drag and drop under **Process data** > **Stream Analytics jobs**.

:::image type="content" source="./media/no-code-stream-processing/jobs-list.png" alt-text="Screenshot showing the Stream Analytics job list where you review job status." lightbox="./media/no-code-stream-processing/jobs-list.png" :::

- Filter – You can filter the list by job name.
- Refresh – The list doesn't auto-refresh currently. Use the option to refresh the list and see the latest status.
- Job name – The name you provided in the first step of job creation. You can't edit it. Select the job name to open the job in the no-code drag and drop experience where you can Stop the job, edit it, and Start it again.
- Status – The status of the job. Select Refresh on top of the list to see the latest status.
- Streaming units – The number of Streaming units selected when you started the job.
- Output watermark - An indicator of liveliness for the data produced by the job. All events before the timestamp are already computed.
- Job monitoring – Select **Open metrics** to see the metrics related to this Stream Analytics job. For more information about the metrics you can use to monitor your Stream Analytics job, see [Metrics available for Stream Analytics](stream-analytics-monitoring.md#metrics-available-for-stream-analytics).
- Operations – Start, stop, or delete the job.

## Next steps

Learn how to use the no code editor to address common scenarios using predefined templates:

- [Capture Event Hubs data in Parquet format](capture-event-hub-data-parquet.md)
- [Filter and ingest to Azure Synapse SQL](filter-ingest-synapse-sql.md)
- [Filter and ingest to Azure Data Lake Storage Gen2](filter-ingest-data-lake-storage-gen2.md)
- [Materialize data to Azure Cosmos DB](no-code-materialize-cosmos-db.md)
