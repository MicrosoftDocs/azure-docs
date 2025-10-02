---  
title: Troubleshoot KQL queries for the data lake
titleSuffix: Microsoft Security   
description:  Troubleshoot KQL queries for the Microsoft Sentinel data lake.
author: EdB-MSFT  
ms.service: microsoft-sentinel  
ms.subservice: sentinel-graph 
ms.topic: how-to
ms.author: edbaynash  
ms.date: 08/27/2025

ms.collection: ms-security  

# Customer intent: As a security engineer, I want to troubleshoot KQL queries in the Microsoft Sentinel data lake so that I can resolve common issues and ensure successful query execution.

---  


# Troubleshoot KQL queries for the Microsoft Sentinel data lake


Use the following checklist to resolve common issues when working with KQL (Kusto Query Language) queries and jobs in Microsoft Sentinel data lake.

+ Check for prerequisites before running queries or jobs. For more information, see [Roles and permissions for the Microsoft Sentinel data lake](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake).

+ Ensure that you selected the correct workspaces before executing KQL queries or jobs.
+ Confirm that all referenced tables and workspaces exist and are accessible.
+ Use only supported KQL operators and commands to avoid execution errors.
+ Adjust the query with filters such as time range to avoid query timeouts.

Job-specific validation:

+ Verify that you have the correct role for the target workspace when creating new custom tables via jobs. For more information, see [Roles and permissions for the Microsoft Sentinel data lake](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake).
+ Test queries in a KQL editor to catch syntax and logic errors before submitting them as jobs.
+ Ensure job names are unique across all jobs in the tenant, including Notebooks jobs.
+ Validate that the query output schema aligns with the destination table in column names, and data types.
+ Verify job status and track progress.

+ Refer to the following error tables for specific error messages and resolution steps.

> [!NOTE]
> Data promoted to the analytics tier may take 15-30 minutes to appear in Advanced Hunting depending on the data size and query complexity.
> Partial results may be promoted if the job's query exceeds the one-hour limit.



## KQL query error messages
| Error message | Root cause | Suggested actions |
|-------------------|------------|-------------------|
| **Table could not be found or is empty.** | The referenced table doesn't exist, is empty, or the user doesn't have the required permissions. | Verify the table name, confirm data availability, and ensure the user has appropriate access. For more information, see [Roles and permissions for the Microsoft Sentinel data lake](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake). |
| **Cannot access a disposed object.** | An internal service error occurred in the backend service. | Retry. Open a support ticket if the issue persists. |
| **Queries timing out at Gateway.** | Long-running queries without time filters. | Enforce time filters or apply extra filters. |
| **No time range set. Add a time parameter to control query cost and avoid timeouts.** | Queries that have unrestricted lookback, can cause timeouts. | Enforce time filters or apply extra filters. |
| **Unsupported function. Modify your query to remove functions that are not supported in the data lake: ingestion_time().** | Queries on the data lake don't support the `ingestion_time()` function. | Remove `ingestion_time()` from your query and try again. |
| **Query execution took longer than the assigned timeout and has been aborted.** | • The query may be overly complex or retrieving a large dataset, causing it to exceed the allowed execution time.<br>• Inefficient query structure, such as unnecessary joins or excessive filtering may contribute to slow performance. | Optimize your query and try again. |
| **401-Unauthorized: This normally represents a permanent error, and retrying is unlikely to help. Error details: DataSource={clusterUri}, DatabaseName={databaseName}.** | • The authentication token used to access the data lake may be invalid or expired.<br>• You don't have the necessary permissions to query the specified database. | Reauthenticate and verify access permissions. |
| **The query called an external URL. Calling an external URL is not supported for queries in Lake.** | KQL queries executed in the data lake environment don't support calling external endpoints. | Remove the external URL call from the query. |
| **Query execution has exceeded the allowed limits.** | KQL interactive queries in the data lake are limited to 500,000 rows. | Run the query in a KQL job or use Notebooks. |
| **Table(s) could not be found or may not have data. Please check if table(s) exists, has data, or user has permissions.** | • The specified tables might not exist in the database.<br>• You may not have permissions to access the tables.<br>• The tables might exist but have no data, resulting in no meaningful output. | Confirm table existence, data availability, and user permissions. |
| **The query text exceeded the maximum allowable length after internal expansion. This might occur when the `in()` operator is used with a variable that contains a large list of items.** | • The `in()` operator might be used with a large list, causing the expanded query to exceed query limits.<br>• The query may contain dynamically generated content that results in excessive length. | Reduce the size of the list or simplify the query. |
| **Query execution has exceeded the allowed limits.** |  | Optimize your query and try again. |
| Semantic and syntax errors, for example:<br><ul><li>**Semantic error: 'project' operator: Failed to resolve scalar expression named 'Timestamp'**<li>**Semantic error: 'where' operator: Failed to resolve scalar expression named 'Type'**<li>**Syntax error: The operator cannot be the first operator in a query.**<li>**Syntax error: Missing expression**<li>**Failed to execute KQL query with validation errors: The incomplete fragment is unexpected.**</ul>| The query is malformed and is referencing tables or columns that don’t exist, or it's using invalid scalar functions. | Check your query and try again. |
| **Client does not have access to any workspaces or client provided invalid workspace(s) in the scope.** | The query uses an invalid workspace ID. | Enter the correct workspace ID and try again. |
| **Unexpected control command** | Using control commands (for example, `show`) isn't allowed. | No action needed. |



## KQL job error messages

| Error message | Root cause | Suggested actions |
|-------------------|------------|-------------------|
| **The specified target table does not exist in the destination workspace.** | The table name is incorrect, has been deleted, or hasn't been created yet. | Verify the table name and ensure it exists in the target workspace before submitting the job. |
| **The specified source table does not exist.** | One or more source tables don't exist in the specified workspaces, or were recently deleted from your workspace. | Verify that source tables exist in the specified workspace. |
| **The workspace or database name provided in the query is invalid or inaccessible.** | The referenced database doesn't exist or the job lacks access permissions. | Confirm the database name is correct and accessible from the job context. |
| **The specified target workspace does not exist in your Azure subscriptions.** | The workspace ID or name is invalid or doesn't exist in any Azure subscription in your tenant. | Validate the workspace ID. |
| **The query output schema does not match the schema of the destination table.** | The number or names of columns in the query output differ from the destination table schema. | Update the query or table schema to ensure they're aligned. |
| **The data types of one or more columns in the query output do not match the destination table schema.** | Type mismatch between query output and table schema, for example string versus datetime. | Ensure that each column in the query output matches the expected data type in the table schema. |
| **The KQL query failed to execute due to syntax or logic errors.** | The query contains invalid syntax, unsupported functions, unsupported data types, or incorrect references. | Test the query in KQL queries or Azure Data Explorer before using the query in the KQL job. |
| **KQL job name must be unique.** | The job name already exists in the tenant. | Provide a unique name for the job. |
| **Invalid column name. It should start with a letter and contain only letters, numbers, and underscores (_), _ResourceId.** | Job has output columns contain an unsupported format. | Update the query and rename columns. |
