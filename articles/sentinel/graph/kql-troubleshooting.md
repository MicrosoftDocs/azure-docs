---  
title: Troubleshooting KQL queries for the data lake(Preview).
titleSuffix: Microsoft Security  
description:  Troubleshooting KQL queries for the Microsoft Sentinel data lake.
author: EdB-MSFT  
ms.service: sentinel  
ms.topic: how-to
ms.subservice: sentinel-graph
ms.date: 06/16/2025
ms.author: edbaynash  

ms.collection: ms-security  
---  


# Troubleshooting KQL queries for the Microsoft Sentinel data lake (Preview)


Use the following checklist to resolve common issues when working with KQL (Kusto Query Language) queries and jobs in Microsoft Sentinel data lake.

+ Check for prerequisites before running queries or jobs. For more information, see [Roles and permissions for the Microsoft Sentinel data lake (Preview)](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview).

+ Ensure that you selected correct workspace before executing KQL queries or jobs.
+ Confirm that all referenced tables and workspaces exist and are accessible.
+ Use only supported KQL operators and commands to avoid execution errors.
+ Adjust the query with filters such as time range to avoid query timeouts.

Job specific validation

+ Verify that you have the correct role for the target workspace when creating new custom tables via jobs. For more information, see [Roles and permissions for the Microsoft Sentinel data lake (Preview)](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview)
+ Test queries in a KQL editor to catch syntax and logic errors before submitting them as jobs.
+ Ensure job names are unique across all jobs in the tenant, including Notebooks jobs.

+ Validate that the query output schema aligns with the destination table in column names, and data types.
+ Verify job status and track progress.
+ Be aware that data promoted to the analytics tier may take some time to appear in Advanced Hunting depending on the data size and query complexity.
+ Refer to error tables below for specific error messages and resolution steps.

> [!NOTE]
>  Partial results may be promoted if the job's query exceeds the one hour limit.



## KQL query error messages
| Error message | Root cause | Suggested actions |
|---------------|------------|-------------------|
| Table could not be found or is empty. | The referenced table doesn't exist, is empty, or the user lacks the required permissions. | Verify table name, confirm data availability, and ensure the user has appropriate access. For more information, see [Roles and permissions for the Microsoft Sentinel data lake (Preview)](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview) |
| Cannot access a disposed object. | Internal service error in the backend service. | Retry. Open a support ticket if persistent. |
| Queries timing out at Gateway | Long-running queries without time filters | Enforce time filters, or apply extra filters. |
| No time range set. Add a time parameter to control query cost and avoid timeouts. | Queries with unrestricted lookback, risking timeouts | Enforce time filters, or apply additional filters. |
| Unsupported function. Modify your query to remove functions that are not supported in the data lake: ingestion_time(). | Queries on lake don't support ingestion_time() function | Remove ingestion_time() from query and try again. |
| Query execution took longer than the assigned timeout and has been aborted. | • The query may be overly complex or retrieving a large dataset, causing it to exceed the allowed execution time.<br>• Inefficient query structure, such as unnecessary joins or excessive filtering, could be contributing to slow performance. | Optimize your query and try again. |
| 401-Unauthorized: This normally represents a permanent error, and retrying is unlikely to help. Error details: DataSource={clusterUri}, DatabaseName={databaseName} | • The authentication token used to access the Lake may be invalid or expired.<br>• The user may lack the necessary permissions to query the specified database. | Reauthenticate and verify access permissions. |
| The query called an external URL. Calling an external URL is not supported for queries in Lake. | KQL queries executed in the Lake environment don't support calling external endpoints. | Remove calling external URL from the query. |
 Query execution has exceeded the allowed limits. | KQL interactive queries on Lake are limited to 30,000 rows. | Run query in a KQL job or use Notebooks. |
| Table(s) could not be found or may not have data. Please check if table(s) exists, has data, or user has permissions. | • The specified tables might not exist in the database.<br>• The user may not have permissions to access the tables.<br>• The tables might exist but have no data, which results in no meaningful output. | Confirm table existence, data availability, and user permissions. |
| The query text exceeded the maximum allowable length after internal expansion. This might occur when the `in()` operator is used with a variable that contains a large list of items. | • The `in()` operator may be used with a large list, leading to an expanded query that surpasses limits.<br>• The query could contain dynamically generated content that results in excessive length. | Reduce the size of the list or simplify the query. |
| Query execution has exceeded the allowed limits |  | Optimize your query and try again. |
| The arguments array exceeded the allowed limit (allowed=1,000,000) | The query contains more than 1,000,000 items in an array. | Reduce the number of items in the array. |

		
## KQL job error messages


| Error message | Root cause | Suggested actions |
|---------------|------------|-------------------|
| The specified target table does not exist in the destination workspace. | The table name is incorrect, deleted, or not yet created. | Verify the table name and ensure it exists in the target workspace before submitting the job. |
| The specified source table does not exist. | One or more source tables don't exist in the given workspaces or were recently deleted from your workspace. | Verify if source tables exist in the workspace. |
| The workspace or database name provided in the query is invalid or inaccessible. | The referenced database doesn't exist or the job lacks access permissions. | Confirm the database name is correct and accessible from the job context. |
| The specified target workspace does not exist in your Azure subscriptions. | The workspace ID or name is invalid or doesn't exist in any Azure subscription in your tenant. | Validate the workspace ID. |
| The query output schema does not match the schema of the destination table. | The number or names of columns in the query output differ from the destination table schema. | Update the query or table schema to ensure they're aligned. |
| The data types of one or more columns in the query output do not match the destination table schema. | Type mismatch between query output and table schema, for example string versus datetime. | Ensure that each column in the query output matches the expected data type in the table schema. |
| The KQL query failed to execute due to syntax or logic errors. | The query contains invalid syntax, unsupported functions, unsupported data types, or incorrect references. | Test the query in KQL queries or Azure Data Explorer before using the query in the KQL job. |
| KQL job name must be unique | The job name already exists in the tenant. | Provide a unique name to the job. |
| Invalid column name. It should start with a letter and contain only letters, numbers, and underscores (_), _ResourceId | Job has output columns including unsupported format. | Update the query and rename columns. |
