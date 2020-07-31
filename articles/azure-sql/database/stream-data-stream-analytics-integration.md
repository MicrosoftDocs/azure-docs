---
title: Stream data using Azure Stream Analytics integration (preview)
description: Use Azure Stream Analytics integration to stream data into Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: ajetasin
ms.author: ajetasi
ms.reviewer: sstein
ms.date: 11/04/2019
---

# Stream data into Azure SQL Database using Azure Stream Analytics integration (preview)

Users can now ingest, process, view, and analyze real-time streaming data into a table directly from a database in Azure SQL Database. They do so in the Azure portal using [Azure Stream Analytics](../../stream-analytics/stream-analytics-introduction.md). This experience enables a wide variety of scenarios such as connected car, remote monitoring, fraud detection, and many more. In the Azure portal, you can select an events source (Event Hub/IoT Hub), view incoming real-time events, and select a table to store events. You can also write Azure Stream Analytics Query Language queries in the portal to transform incoming events and store them in the selected table. This new entry point is in addition to the creation and configuration experiences that already exist in Stream Analytics. This experience starts from the context of your database, enabling you to quickly set up a Stream Analytics job and navigate seamlessly between the database in Azure SQL Database and Stream Analytics experiences.

![Stream Analytics flow](./media/stream-data-stream-analytics-integration/stream-analytics-flow.png)

## Key benefits

- Minimum context switching: You can start from a database in Azure SQL Database in the portal and start ingesting real-time data into a table without switching to any other service.
- Reduced number of steps: The context of your database and table is used to pre-configure a Stream Analytics job.
- Additional ease of use with preview data: Preview incoming data from the events source (Event Hub/IoT Hub) in the context of selected table

> [!IMPORTANT]
> An Azure Stream Analytics job can output to Azure SQL Database, Azure SQL Managed Instance, or Azure Synapse Analytics (formerly Azure SQL Data Warehouse). For more information, see [Outputs](../../stream-analytics/stream-analytics-define-outputs.md#sql-database).

## Prerequisites

To complete the steps in this article, you need the following resources:

- An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
- A database in Azure SQL Database. For details, see [Create a single database in Azure SQL Database](single-database-create-quickstart.md).
- A firewall rule allowing your computer to connect to the server. For details, see [Create a server-level firewall rule](firewall-create-server-level-portal-quickstart.md).

## Configure Stream analytics integration

1. Sign in to the Azure portal.
2. Navigate to the database where you want to ingest your streaming data. Select **Stream analytics (preview)**.

    ![Stream Analytics](./media/stream-data-stream-analytics-integration/stream-analytics.png)

3. To start ingesting your streaming data into this database, select **Create** and give a name to your streaming job, and then select **Next: Input**.

    ![create Stream Analytics job](./media/stream-data-stream-analytics-integration/create-job.png)

4. Enter your events source details, and then select **Next: Output**.

   - **Input type**: Event Hub/IoT Hub
   - **Input alias**: Enter a name to identify your events source
   - **Subscription**: Same as Azure SQL Database subscription
   - **Event Hub namespace**: Name for namespace
   - **Event Hub name**: Name of event hub within selected namespace
   - **Event Hub policy name** (Default to create new): Give a policy name
   - **Event Hub consumer group** (Default to create new): Give a consumer group name  

      We recommend that you create a consumer group and a policy for each new Azure Stream Analytics job that you create from here. Consumer groups allow only five concurrent readers, so providing a dedicated consumer group for each job will avoid any errors that might arise from exceeding that limit. A dedicated policy allows you to rotate your key or revoke permissions without impacting other resources.

     ![create Stream Analytics job](./media/stream-data-stream-analytics-integration/create-job-output.png)

5. Select which table you want to ingest your streaming data into. Once done, select **Create**.

   - **Username**, **Password**: Enter your credentials for SQL server authentication. Select **Validate**.
   - **Table**: Select **Create new** or **Use existing**. In this flow, let’s select **Create**. This will create a new table when you start the stream Analytics job.

     ![create Stream Analytics job](./media/stream-data-stream-analytics-integration/create.png)

6. A query page opens with following details:

   - Your **Input** (input events source) from which you'll ingest data  
   - Your **Output** (output table) which will store transformed data
   - Sample [SAQL query](../../stream-analytics/stream-analytics-stream-analytics-query-patterns.md) with SELECT statement.
   - **Input preview**: Shows snapshot of latest incoming data from input events source.
     - The serialization type in your data is automatically detected (JSON/CSV). You can manually change it as well to JSON/CSV/AVRO.
     - You can preview incoming data in the Table format or Raw format.
     - If your data shown isn't current, select **Refresh** to see the latest events.
     - Select **Select time range** to test your query against a specific time range of incoming events.
     - Select **Upload sample input** to test your query by uploading a sample JSON/CSV file. For more information about testing a SAQL query, see [Test an Azure Stream Analytics job with sample data](../../stream-analytics/stream-analytics-test-query.md).

     ![test query](./media/stream-data-stream-analytics-integration/test-query.png)

   - **Test results**: Select **Test query** and you can see the results of your streaming query

     ![test results](./media/stream-data-stream-analytics-integration/test-results.png)

   - **Test results schema**: Shows the schema of the results of your streaming query after testing. Make sure the test results schema matches with your output schema.

     ![test results schema](./media/stream-data-stream-analytics-integration/test-results-schema.png)

   - **Output schema**: This contains schema of the table you selected in step 5 (new or existing).

      - Create new: If you selected this option in step 5, you won’t see the schema yet until you start the streaming job. When creating a new table, select the appropriate table index. For more information about table indexing, see [Clustered and Nonclustered Indexes Described](/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described/).
      - Use existing: If you selected this option in step 5, you'll see the schema of selected table.

7. After you're done authoring & testing the query, select **Save query**. Select **Start Stream Analytics job** to start ingesting transformed data into the SQL table. Once you finalize the following fields, **start** the job.
   - **Output start time**: This defines the time of the first output of the job.  
     - Now: The job will start now and process new incoming data.
     - Custom: The job will start now but will process data from a specific point in time (that can be in the past or the future). For more information, see [How to start an Azure Stream Analytics job](../../stream-analytics/start-job.md).
   - **Streaming units**: Azure Stream Analytics is priced by the number of streaming units required to process the data into the service. For more information, see [Azure Stream Analytics pricing](https://azure.microsoft.com/pricing/details/stream-analytics/).
   - **Output data error handling**:  
     - Retry: When an error occurs, Azure Stream Analytics retries writing the event indefinitely until the write succeeds. There's no timeout for retries. Eventually all subsequent events are blocked from processing by the event that is retrying. This option is the default output error handling policy.
     - Drop: Azure Stream Analytics will drop any output event that results in a data conversion error. The dropped events can't be recovered for reprocessing later. All transient errors (for example, network errors) are retried regardless of the output error handling policy configuration.
   - **SQL Database output settings**: An option for inheriting the partitioning scheme of your previous query step, to enable fully parallel topology with multiple writers to the table. For more information, see [Azure Stream Analytics output to Azure SQL Database](../../stream-analytics/stream-analytics-sql-output-perf.md).
   - **Max batch count**: The recommended upper limit on the number of records sent with every bulk insert transaction.  
    For more information about output error handling, see [Output error policies in Azure Stream Analytics](../../stream-analytics/stream-analytics-output-error-policy.md).  

     ![start job](./media/stream-data-stream-analytics-integration/start-job.png)

8. Once you start the job, you'll see the Running job in the list, and you can take following actions:
   - **Start/stop the job**: If the job is running, you can stop the job. If the job is stopped, you can start the job.
   - **Edit job**: You can edit the query. If you want to do more changes to the job ex, add more inputs/outputs, then open the job in Stream Analytics. Edit option is disabled when the job is running.
   - **Preview output table**: You can preview the table in the SQL query editor.
   - **Open in Stream Analytics**: Open the job in Stream Analytics to view monitoring, debugging details of the job.

     ![stream analytics jobs](./media/stream-data-stream-analytics-integration/jobs.png)

## Next steps

- [Azure Stream Analytics documentation](https://docs.microsoft.com/azure/stream-analytics/)
- [Azure Stream Analytics solution patterns](../../stream-analytics/stream-analytics-solution-patterns.md)
 