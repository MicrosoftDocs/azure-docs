---
title: Known issues
titleSuffix: Azure Synapse Analytics
description: Learn about the currently known issues with Azure Synapse Analytics and their possible workarounds or resolutions.
author: charithdilshan
ms.author: ccaldera
ms.reviewer: wiassaf, joanpo
ms.date: 03/14/2024
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
---

# Azure Synapse Analytics known issues

This page lists the known issues in [Azure Synapse Analytics](overview-what-is.md), and their resolution date or possible workaround. Before submitting [an Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest), review this list to see if the issue that you're experiencing is already known and being addressed.

To learn more about Azure Synapse Analytics, see the [Azure Synapse Analytics Overview](index.yml), and [What's new in Azure Synapse Analytics?](whats-new.md)

## Active known issues

|Azure Synapse Component|Status|Issue|
|:---------|:---------|:---------|
|Azure Synapse dedicated SQL pool|[Customers are unable to monitor their usage of Dedicated SQL Pool by using metrics](#customers-are-unable-to-monitor-their-usage-of-dedicated-sql-pool-by-using-metrics)|Has Workaround|
|Azure Synapse dedicated SQL pool|[Query failure when ingesting a parquet file into a table with AUTO_CREATE_TABLE='ON'](#query-failure-when-ingesting-a-parquet-file-into-a-table-with-auto_create_tableon)|Has Workaround|
|Azure Synapse dedicated SQL pool|[Queries failing with Data Exfiltration Error](#queries-failing-with-data-exfiltration-error)|Has Workaround|
|Azure Synapse dedicated SQL pool|[UPDATE STATISTICS statement fails with error: "The provided statistics stream is corrupt."](#update-statistics-failure)|Has Workaround|
|Azure Synapse serverless SQL pool|[Query failures from serverless SQL pool to Azure Cosmos DB analytical store](#query-failures-from-serverless-sql-pool-to-azure-cosmos-db-analytical-store)|Has Workaround|
|Azure Synapse serverless SQL pool|[Azure Cosmos DB analytical store view propagates wrong attributes in the column](#azure-cosmos-db-analytical-store-view-propagates-wrong-attributes-in-the-column)|Has Workaround|
|Azure Synapse serverless SQL pool|[Query failures in serverless SQL pools](#query-failures-in-serverless-sql-pools)|Has Workaround|
|Azure Synapse Workspace|[Blob storage linked service with User Assigned Managed Identity (UAMI) is not getting listed](#blob-storage-linked-service-with-user-assigned-managed-identity-uami-is-not-getting-listed)|Has Workaround|
|Azure Synapse Workspace|[Failed to delete Synapse workspace & Unable to delete virtual network](#failed-to-delete-synapse-workspace--unable-to-delete-virtual-network)|Has Workaround|
|Azure Synapse Workspace|[REST API PUT operations or ARM/Bicep templates to update network settings fail](#rest-api-put-operations-or-armbicep-templates-to-update-network-settings-fail)|Has Workaround|
|Azure Synapse Workspace|[Known issue incorporating square brackets [] in the value of Tags](#known-issue-incorporating-square-brackets--in-the-value-of-tags)|Has Workaround|
|Azure Synapse Workspace|[Deployment Failures in Synapse Workspace using Synapse-workspace-deployment v1.8.0 in GitHub actions with ARM templates](#deployment-failures-in-synapse-workspace-using-synapse-workspace-deployment-v180-in-github-actions-with-arm-templates)|Has Workaround|


## Azure Synapse Analytics dedicated SQL pool active known issues summary

### Customers are unable to monitor their usage of Dedicated SQL Pool by using metrics

An internal upgrade of our telemetry emission logic, which was meant to enhance the performance and reliability of our telemetry data, caused an unexpected issue that affected some customers' ability to monitor their Dedicated SQL Pool, `tempdb`, and DW Data IO metrics.

**Workaround**: Upon identifying the issue, our team took action to identify the root cause and update the configuration in our system. Customers can fix the issue by pausing and resuming their instance, which will restore the normal state of the instance and the telemetry data flow.

### Query failure when ingesting a parquet file into a table with AUTO_CREATE_TABLE='ON'

Customers who try to ingest a parquet file into a hash distributed table with `AUTO_CREATE_TABLE='ON'` may receive the following error:

`COPY statement using Parquet and auto create table enabled currently cannot load into hash-distributed tables`

[Ingestion into an auto-created hash-distributed table using AUTO_CREATE_TABLE is unsupported](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest&preserve-view=true#auto_create_table---on--off-). Customers that have previously loaded using this unsupported scenario should CTAS their data into a new table and use it in place of the old table.

### Queries failing with Data Exfiltration Error

Synapse workspaces created from an existing dedicated SQL Pool report query failure related to [Data Exfiltration Protection](security/workspace-data-exfiltration-protection.md) with generic error message while Data Exfiltration Protection is turned off in Synapse Analytics: 

`Data exfiltration to '{****}' is blocked. Add destination to allowed list for data exfiltration and try again.`

**Workaround**: If you encountered a similar error, engage Microsoft Support Team for assistance.

### UPDATE STATISTICS failure

Some dedicated SQL Pools can encounter an exception when executing an `UPDATE STATISTICS` statement. The command results in the message "The provided statistics stream is corrupt" and fails to update your statistics.
 
When a new constraint is added to a table, a related statistic is created in the distributions. If a clustered index is also created on the table, it must include the same columns (in the same order) as the constraint, otherwise `UPDATE STATISTICS` commands on those columns might fail.

**Workaround**: Identify if a constraint and clustered index exist on the table. If so, DROP both the constraint and clustered index. After that, recreate the clustered index and then the constraint *ensuring that both include the same columns in the same order.* If the table does not have a constraint and clustered index, or if the above step results in the same error, contact the Microsoft Support Team for assistance.

### Tag updates appear to fail

When making a change to the [tags](../azure-resource-manager/management/tag-resources-portal.md) of a dedicated SQL pool through Azure portal or other methods, an error message can appear even though the change is made successfully.

**Workaround**: You can confirm that the change to the tags was successful and ignore/suppress the error message as needed.

## Azure Synapse workspace active known issues summary

The following are known issues with the Synapse workspace.

### Blob storage linked service with User Assigned Managed Identity (UAMI) is not getting listed

The linked service might not be visible under the **Data Hub** -> **Linked** -> **Azure Blob Storage** after configuring the blob storage linked service to use "User Assigned Managed Identity" authentication in Azure Synapse Analytics.

**Workaround**: The engineering team is currently aware of this behavior and working on a fix. As an alternative, use "System Assigned Managed Identity" authentication method instead of "User Assigned Managed Identity".

### Failed to delete Synapse workspace & Unable to delete virtual network

Deleting a Synapse workspace fails with the error message:

`Failed to delete Synapse workspace '[Workspace Name]'. Unable to delete virtual network. The correlationId is ********-****-****-****-************;`

**Workaround**: The problem can be mitigated by retrying the delete operation. The engineering team is aware of this behavior and working on a fix.

### REST API PUT operations or ARM/Bicep templates to update network settings fail

When using an ARM template, Bicep template, or direct REST API PUT operation to change the public network access settings and/or firewall rules for a Synapse workspace, the operation can fail.

**Workaround**: The problem can be mitigated by using a REST API PATCH operation or the Azure portal UI to reverse and retry the desired configuration changes. The engineering team is aware of this behavior and working on a fix.

### Known issue incorporating square brackets [] in the value of Tags

In the context of updating tag values within an Azure Synapse workspace, the inclusion of square brackets (`[]`) will result in an unsuccessful update operation.

**Workaround**: The current workaround is to abstain from using the square brackets (`[]`) in Azure Synapse workspace tag values.

### Deployment failures in Synapse Workspace using Synapse-workspace-deployment v1.8.0 in GitHub actions with ARM templates

The failure occurs during the deployment to production and is related to a trigger that contains a host name with a double backslash. 

The error message displayed is "Action failed - Error: Orchestrate failed - SyntaxError: Unexpected token in JSON at position 2057".

**Workaround**: Following actions can be taken as quick mitigation:

- **Remove escape characters:** Manually remove any escape characters (`\`) from the parameters file before deployment. This means editing the file to eliminate these characters that could be causing issues during the parsing or processing stage of the deployment.
- **Replace escape characters with Forward Slashes:** Replace the escape characters (`\`) with forward slashes (`/`). This can be particularly useful in file paths, where many systems accept forward slashes as valid path separators. This replacement might help in bypassing the problem with escape characters, allowing the deployment process to succeed.

After applying either of these workarounds and successfully deploying, manually update the necessary configurations within the workspace to ensure everything is set up correctly. This might involve editing configuration files, adjusting settings, or performing other tasks relevant to the specific environment or application being deployed.

## Azure Synapse Analytics serverless SQL pool active known issues summary

### Query failures from serverless SQL pool to Azure Cosmos DB analytical store

Queries from a serverless SQL pool to Azure Cosmos DB analytical store might fail with one of the following error messages:

- `Resolving CosmosDB path has failed with error 'This request is not authorized to perform this operation'`
- `Resolving CosmosDB path has failed with error 'Key not found'`

The following conditions must be true to confirm this issue:

1) The connection to Azure Cosmos DB analytical store uses a private endpoint. 
2) Retrying the query succeeds.

**Workaround**: The engineering team is aware of this behavior and following actions can be taken as quick mitigation:

1) Retry the failed query. It will automatically refresh the expired token.
2) Disable the private endpoint. Before applying this change, confirm with your security team that it meets your company security policies.

### Azure Cosmos DB analytical store view propagates wrong attributes in the column

While using views in Azure Synapse serverless pool over Cosmos DB analytical store, if there is a change on files in the Cosmos DB analytical store, the change does not get propagated correctly to the SELECT statements, the customer is using on the view. As a result, the attributes get incorrectly mapped to a different column in the results.

**Workaround**: The engineering team is aware of this behavior and following actions can be taken as quick mitigation:

1) Recreate the view by renaming the columns.
2) Avoid using views if possible.

### Alter database-scoped credential fails if credential has been used

Sometimes you might not be able to execute the `ALTER DATABASE SCOPED CREDENTIAL` query. The root cause of this issue is the credential was cached after its first use making it inaccessible for alteration. The error returned in such case is following:

- "Failed to modify the identity field of the credential '{credential_name}' because the credential is used by an active database file.".

**Workaround**: The engineering team is currently aware of this behavior and is working on a fix. As a workaround you can DROP and CREATE the credentials, which would also mean recreating external tables using the credentials. Alternatively, you can engage Microsoft Support Team for assistance.

### Query failures in serverless SQL pools

Token expiration can lead to errors during their query execution, despite having the necessary permissions for the user over the storage. These error messages can also occur due to common user errors, such as when role-based access control (RBAC) roles are not assigned to the storage account.

Example error messages:

- WaitIOCompletion call failed. HRESULT = 0x80070005'. File/External table name: {path}

- Unable to resolve path '%' Error number 13807, Level 16, State 1, Message "Content of directory on path '%' cannot be listed.

- Error 16561: "External table '<table_name>' is not accessible because content of directory cannot be listed."

- Error number 13822: File {path} cannot be opened because it does not exist or it is used by another process.

- Error number 16536:  Cannot bulk load because the file "%ls" could not be opened.

**Workaround**: 

The resolution is different depending on the authentication, [Microsoft Entra (formerly Azure Active Directory)](security/synapse-workspace-access-control-overview.md) or [managed service identity (MSI)](synapse-service-identity.md):

For Microsoft Entra token expiration:

- For long-running queries, switch to service principal, managed identity, or shared access signature (SAS) instead of using a user identity. For more information, see [Control storage account access for serverless SQL pool in Azure Synapse Analytics](sql/develop-storage-files-storage-access-control.md?tabs=service-principal#supported-storage-authorization-types).

- Restart client (SSMS/ADS) to acquire a new token to establish the connection.

For MSI token expiration:

- Deactivate then activate the pool in order to clear the token cache. Engage Microsoft Support Team for assistance.

## Recently closed known issues

|Synapse Component|Issue|Status|Date Resolved|
|---------|---------|---------|---------|
|Azure Synapse serverless SQL pool|[Queries using Microsoft Entra authentication fails after 1 hour](#queries-using-azure-ad-authentication-fails-after-1-hour)|Resolved|August 2023|
|Azure Synapse serverless SQL pool|[Query failures while reading Cosmos DB data using OPENROWSET](#query-failures-while-reading-azure-cosmos-db-data-using-openrowset)|Resolved|March 2023|
|Azure Synapse Apache Spark pool|[Failed to write to SQL Dedicated Pool from Synapse Spark using Azure Synapse Dedicated SQL Pool Connector for Apache Spark when using notebooks in pipelines](#failed-to-write-to-sql-dedicated-pool-from-synapse-spark-using-azure-synapse-dedicated-sql-pool-connector-for-apache-spark-when-using-notebooks-in-pipelines)|Resolved|June 2023|
|Azure Synapse Apache Spark pool|[Certain spark job or task fails too early with Error Code 503 due to storage account throttling](#certain-spark-job-or-task-fails-too-early-with-error-code-503-due-to-storage-account-throttling)|Resolved|November 2023|

## Azure Synapse Analytics serverless SQL pool recently closed known issues summary

<a name='queries-using-azure-ad-authentication-fails-after-1-hour'></a>

### Queries using Microsoft Entra authentication fails after 1 hour

SQL connections using Microsoft Entra authentication that remain active for more than 1 hour starts to fail. This includes querying storage using Microsoft Entra pass-through authentication and statements that interact with Microsoft Entra ID, like CREATE EXTERNAL PROVIDER. This affects every tool that keeps connections active, like query editor in SSMS and ADS. Tools that open new connection to execute queries aren't affected, like Synapse Studio.

**Status**: Resolved

### Query failures while reading Azure Cosmos DB data using OPENROWSET

Queries from serverless SQL pool to Cosmos DB Analytical Store using OPENROWSET fails with the following error message:

`Resolving CosmosDB path has failed with error 'bad allocation'.`

**Status**: Resolved

## Azure Synapse Analytics Apache Spark pool recently closed known issues summary

### Failed to write to SQL Dedicated Pool from Synapse Spark using Azure Synapse Dedicated SQL Pool Connector for Apache Spark when using notebooks in pipelines

While using Azure Synapse Dedicated SQL Pool Connector for Apache Spark to write Azure Synapse Dedicated pool using Notebooks in pipelines, we would see an error message:

`com.microsoft.spark.sqlanalytics.SQLAnalyticsConnectorException: COPY statement input file schema discovery failed: Cannot bulk load. The file does not exist or you don't have file access rights.`

**Status**: Resolved

### Certain spark job or task fails too early with Error Code 503 due to storage account throttling

Between October 3, 2023 and November 16, 2023, few Azure Synapse Analytics Apache Spark pools could have experienced spark job/task failures due to storage API limit threshold being exceeded.

**Status**: Resolved

## Related content

- [Synapse Studio troubleshooting](troubleshoot/troubleshoot-synapse-studio.md)
- [Troubleshoot serverless SQL pool in Azure Synapse Analytics](sql/resources-self-help-sql-on-demand.md)
- [Best practices for serverless SQL pool in Azure Synapse Analytics](sql/best-practices-serverless-sql-pool.md)
- [Troubleshoot a slow query on a dedicated SQL Pool](/troubleshoot/azure/synapse-analytics/dedicated-sql/troubleshoot-dsql-perf-slow-query)
