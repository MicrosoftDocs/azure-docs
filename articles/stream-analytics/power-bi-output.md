---
title: Power BI output from Azure Stream Analytics
description: This article describes how to output data from Azure Stream Analytics to Power BI.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 08/25/2020
---

# Power BI output from Azure Stream Analytics

You can use [Power BI](https://powerbi.microsoft.com/) as an output for a Stream Analytics job to provide for a rich visualization experience of analysis results. You can use this capability for operational dashboards, report generation, and metric-driven reporting.

Power BI output from Stream Analytics is currently not available in the Azure China 21Vianet and Azure Germany (T-Systems International) regions.

## Output configuration

The following table lists property names and their descriptions to configure your Power BI output.

| Property name | Description |
| --- | --- |
| Output alias |Provide a friendly name that's used in queries to direct the query output to this Power BI output. |
| Group workspace |To enable sharing data with other Power BI users, you can select groups inside your Power BI account or choose **My Workspace** if you don't want to write to a group. Updating an existing group requires renewing the Power BI authentication. |
| Dataset name |Provide a dataset name that you want the Power BI output to use. |
| Table name |Provide a table name under the dataset of the Power BI output. Currently, Power BI output from Stream Analytics jobs can have only one table in a dataset. |
| Authorize connection | You need to authorize with Power BI to configure your output settings. Once you grant this output access to your Power BI dashboard, you can revoke access by changing the user account password, deleting the job output, or deleting the Stream Analytics job. | 

For a walkthrough of configuring a Power BI output and dashboard, see the [Azure Stream Analytics and Power BI](stream-analytics-power-bi-dashboard.md) tutorial.

> [!NOTE]
> Don't explicitly create the dataset and table in the Power BI dashboard. The dataset and table are automatically populated when the job is started and the job starts pumping output into Power BI. If the job query doesn't generate any results, the dataset and table aren't created. If Power BI already had a dataset and table with the same name as the one provided in this Stream Analytics job, the existing data is overwritten.
>

### Create a schema

Azure Stream Analytics creates a Power BI dataset and table schema for the user if they don't already exist. In all other cases, the table is updated with new values. Currently, only one table can exist within a dataset. 

Power BI uses the first-in, first-out (FIFO) retention policy. Data will collect in a table until it hits 200,000 rows.

> [!NOTE]
> We do not recommend using multiple outputs to write to the same dataset because it can cause several issues. Each output tries to create the Power BI dataset independently which can result in multiple datasets with the same name. Additionally, if the outputs don't have consistent schemas, the dataset changes the schema on each write, which leads to too many schema change requests. Even if these issues are avoided, multiple outputs will be less performant than a single merged output.

### Convert a data type from Stream Analytics to Power BI

Azure Stream Analytics updates the data model dynamically at runtime if the output schema changes. Column name changes, column type changes, and the addition or removal of columns are all tracked.

This table covers the data type conversions from [Stream Analytics data types](https://docs.microsoft.com/stream-analytics-query/data-types-azure-stream-analytics) to Power BI [Entity Data Model (EDM) types](https://docs.microsoft.com/dotnet/framework/data/adonet/entity-data-model), if a Power BI dataset and table don't exist.

From Stream Analytics | To Power BI
-----|-----
bigint | Int64
nvarchar(max) | String
datetime | Datetime
float | Double
Record array | String type, constant value "IRecord" or "IArray"

### Update the schema

Stream Analytics infers the data model schema based on the first set of events in the output. Later, if necessary, the data model schema is updated to accommodate incoming events that might not fit into the original schema.

Avoid the `SELECT *` query to prevent dynamic schema update across rows. In addition to potential performance implications, it might result in uncertainty of the time taken for the results. Select the exact fields that need to be shown on the Power BI dashboard. Additionally, the data values should be compliant with the chosen data type.

Previous/current | Int64 | String | Datetime | Double
-----------------|-------|--------|----------|-------
Int64 | Int64 | String | String | Double
Double | Double | String | String | Double
String | String | String | String | String 
Datetime | String | String |  Datetime | String

## Output batch size

For output batch size, see [Power BI Rest API limits](https://msdn.microsoft.com/library/dn950053.aspx).

## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Quickstart: Create an Azure Stream Analytics job using the Azure CLI](quick-create-azure-cli.md)
* [Quickstart: Create an Azure Stream Analytics job by using an ARM template](quick-create-azure-resource-manager.md)
* [Quickstart: Create a Stream Analytics job using Azure PowerShell](stream-analytics-quick-create-powershell.md)
* [Quickstart: Create an Azure Stream Analytics job by using Visual Studio](stream-analytics-quick-create-vs.md)
* [Quickstart: Create an Azure Stream Analytics job in Visual Studio Code](quick-create-visual-studio-code.md)
