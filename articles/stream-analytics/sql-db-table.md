---
title: Write to Azure SQL Database table from your Azure Stream Analytics jobs
description: This article describes how to add a new or existing SQL DB table as output for an Azure Stream Analytics job in Azure portal.
author: ajetasi
ms.service: stream-analytics
ms.topic: how-to
ms.date: 07/20/2022
---
# Write to Azure SQL Database table from your Azure Stream Analytics jobs

Azure Stream Analytics supports Azure SQL Database as an output for your streaming query. This article explains how to use SQL Database as an output for your Stream Analytics job in the Azure portal.

## Prerequisites

1. Create a Stream Analytics job.

2. Create an Azure SQL Database to which your Stream Analytics job will write output.

## Write to a new table in SQL Database

This section describes how you can configure your job to write to a table in your Azure SQL Database that hasn't yet been created.

1. In your Stream Analytics job, select **Outputs** under **Job topology**. Click **Add** and choose **SQL Database**.

   :::image type="content" source="./media/sql-db-output-managed-identity/sql-database-output.png" alt-text="Screenshot showing SQL DB output in Stream Analytics." lightbox="./media/sql-db-output-managed-identity/sql-database-output.png":::

2. Select an output alias that will be used in your job’s query. Provide your database name and authentication mode. You can learn more about [SQL output configuration options](sql-database-output.md).

3. Enter a **table name** that you want to create in your Azure SQL Database. Click **Save**. Note: Saving this output doesn’t create the table in your SQL Database. Next steps provide more details on when the table gets created.

   :::image type="content" source="./media/sql-db-output-managed-identity/new-table-name.png" alt-text="Screenshot showing SQL DB output configuration in Stream Analytics." lightbox="./media/sql-db-output-managed-identity/new-table-name.png":::

4. Select **Query** under **Job Topology** and use the alias in your query to write the output in the table name you provided in previous step. Click **Test query** to test the query logic and view **Test results** which shows schema of the output that will be produced by the job. 
Note: To test your query, you need to have either incoming streaming data in your input source, or you can upload sample data to test query. You can learn more about [Test Stream Analytics query](stream-analytics-test-query.md).

   :::image type="content" source="./media/sql-db-output-managed-identity/input-preview.png" alt-text="Screenshot showing query testing in Stream Analytics." lightbox="./media/sql-db-output-managed-identity/input-preview.png":::

   :::image type="content" source="./media/sql-db-output-managed-identity/output-preview.png" alt-text="Screenshot showing query tests results in Stream Analytics." lightbox="./media/sql-db-output-managed-identity/output-preview.png":::

5. Click **SQL table schema** to view the column name and type. Click **Create table** and your table will be created in the SQL database.

   :::image type="content" source="./media/sql-db-output-managed-identity/create-table-popup.png" alt-text="Screenshot showing creating a table in SQL database from Stream Analytics." lightbox="./media/sql-db-output-managed-identity/create-table-popup.png":::

   If your Stream Analytics query is modified to produce different schema, you'll need to alter your table definition in your SQL Database. This ensures that the Stream Analytics job doesn’t encounter data conversion errors while trying to write to the sink.

6. Once your query is final, select **Overview** and **Start** the job. You can then navigate to the SQL Database table to see your streaming query output.

## Select an existing table from SQL Database

This section describes how you can configure your job to write to a table that already exists in your Azure SQL Database.

1. In your Stream Analytics job, select **Outputs** under **Job topology**. Click **Add** and choose **SQL Database**.

   :::image type="content" source="./media/sql-db-output-managed-identity/sql-database-output.png" alt-text="Screenshot showing SQL DB output in Stream Analytics." lightbox="./media/sql-db-output-managed-identity/sql-database-output.png":::

2. Select an output alias that will be used in your job’s query. Provide your database name and authentication mode. You can learn more about [SQL output configuration options](sql-database-output.md).

3. You can pick an existing table from the selected SQL Database by entering your SQL Authentication details. This will load a list of table names from your Database. Select the table name from the list or manually enter table name and **Save**.

   :::image type="content" source="./media/sql-db-output-managed-identity/existing-table.png" alt-text="Screenshot showing existing table in SQL database." lightbox="./media/sql-db-output-managed-identity/existing-table.png":::

4. Select **Query** under **Job Topology** and use the alias name in your query to write the output in the selected table. Click **Test query** to test the query logic and view **Test results**. 
Note: To test your query, you need to have either incoming streaming data in Event Hub/IoT Hub, or you can upload sample data to test query. You can learn more about [Test Stream Analytics query](stream-analytics-test-query.md).

   :::image type="content" source="./media/sql-db-output-managed-identity/input-preview.png" alt-text="Screenshot showing query testing in Stream Analytics." lightbox="./media/sql-db-output-managed-identity/input-preview.png":::

   :::image type="content" source="./media/sql-db-output-managed-identity/output-preview.png" alt-text="Screenshot showing query tests results in Stream Analytics." lightbox="./media/sql-db-output-managed-identity/output-preview.png":::

5. In **SQL table schema** tab, you can see a column name and its type from incoming data and in the selected table. You can see the status whether the incoming data type and selected SQL table match or not. If it's not a match, you'll be prompted to update your query to match table schema. 

   :::image type="content" source="./media/sql-db-output-managed-identity/schema-match.png" alt-text="Screenshot showing schema comparison in Stream Analytics." lightbox="./media/sql-db-output-managed-identity/schema-match.png":::

6. Once your query is final, select **Overview** and **Start** the job. You can then navigate to the SQL Database table to see your streaming query output.

## Common data type mismatch reasons

It's important to ensure that the output of your Stream Analytics job matches the column names and data types expected by your SQL Database table. If there's a mismatch, your job will run into data conversion errors, and continuously retry until the SQL table definition is changed. You can [change your job’s behavior](stream-analytics-output-error-policy.md) to drop such output that cause data conversion errors and proceed to the next one. The most common schema mismatch reasons are described below.

* **Type mismatch**: The query and target types aren't compatible. Rows won't be inserted in the destination. Use a [conversion function](/stream-analytics-query/data-types-azure-stream-analytics) such as TRY_CAST() to align types in the query. The alternate option is to alter the destination table in your SQL database.
* **Range**: The target type range is considerably smaller than the one used in the query. Rows with out-of-range values [may not be inserted](/stream-analytics-query/data-types-azure-stream-analytics) in the destination table, or truncated. Consider altering the destination column to a larger type range.
* **Implicit**: The query and target types are different but compatible. The data will be implicitly converted, but this could result in data loss or failures. Use a [conversion function](/stream-analytics-query/data-types-azure-stream-analytics) such as TRY_CAST() to align types in the query, or alter the destination table.
* **Record**: This type isn't yet supported for this output. The value will be replaced by the string ‘record’. Consider [parsing](./stream-analytics-parsing-json.md) the data, or using an UDF to [convert to string](./stream-analytics-javascript-user-defined-functions.md).
* **Array**: This type isn't yet supported natively in Azure SQL Database. The value will be replaced by the string ‘record’. Consider [parsing](./stream-analytics-parsing-json.md) the data, or using an UDF to [convert to string](./stream-analytics-javascript-user-defined-functions.md).
* **Column missing from destination table**: This column is missing from the destination table. The data won't be inserted. Add this column to your destination table if needed.

## Next steps

* [Use SQL reference data as input source](./sql-reference-data.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Query examples for common Stream Analytics usage patterns](stream-analytics-stream-analytics-query-patterns.md)
* [Understand inputs for Azure Stream Analytics](stream-analytics-add-inputs.md)
* [Understand outputs from Azure Stream Analytics](stream-analytics-define-outputs.md)