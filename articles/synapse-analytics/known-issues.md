---
title: Known issues
titleSuffix: Azure Synapse Analytics
description: Learn about the currently known issues with Azure Synapse Analytics, and their possible workarounds or resolutions.
author: charithdilshan
ms.author: ccaldera
ms.date: 3/9/2023
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
ms.reviewer: wiassaf
---

# Azure Synapse Analytics known issues

This page lists the known issues in [Azure Synapse Analytics](overview-what-is.md), and their resolution date or possible workaround. 
Before submitting a Support request, please review this list to see if the issue that you're experiencing is already known and being addressed.

To learn more about Azure Synapse Analytics, see the [Azure Synapse Analytics Overview](index.yml), and [What's new in Azure Synapse Analytics?](whats-new.md). 

## Active Known issues

|Azure Synapse Component|Status|Issue|
|---------|---------|---------|
|Azure Synapse serverless SQL pool|[Query failures from serverless SQL pool to Azure Cosmos DB analytical store](#query-failures-from-serverless-sql-pool-to-azure-cosmos-db-analytical-store)|Has Workaround|
|Azure Synapse serverless SQL pool|[Azure Cosmos DB analytical store view propagates wrong attributes in the column](#azure-cosmos-db-analytical-store-view-propagates-wrong-attributes-in-the-column)|Has Workaround|
|Azure Synapse dedicated SQL pool|[Queries failing with Data Exfiltration Error](#queries-failing-with-data-exfiltration-error)|Has Workaround|
|Azure Synapse Workspace|[Blob storage linked service with User Assigned Managed Identity (UAMI) is not getting listed](#blob-storage-linked-service-with-user-assigned-managed-identity-uami-is-not-getting-listed)|Has Workaround|
|Azure Synapse Workspace|[Failed to delete Synapse workspace & Unable to delete virtual network](#failed-to-delete-synapse-workspace--unable-to-delete-virtual-network)|Has Workaround|
|Azure Synapse Apache Spark pool|[Certain spark job or task fails too early with Error Code 503 due to storage account throttling](#certain-spark-job-or-task-fails-too-early-with-error-code-503-due-to-storage-account-throttling)|Has Workaround|

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

While using views in Azure Synapse serverless pool over Cosmos DB analytical store, If there is a change on files in the Cosmos DB analytical store, the change does not get propagated correctly to the SELECT statements, the customer is using on the view. As a result of that, the attributes get incorrectly mapped to a different column in the results.

**Workaround**: The engineering team is aware of this behavior and following actions can be taken as quick mitigation:

1) Recreate the view by renaming the columns.
2) Avoid using views if possible.

### Alter database-scoped credential fails if credential has been used

Sometimes you may not be able to execute the ALTER DATABASE SCOPED CREDENTIAL query. The root cause of this issue is the credential was cached after its first use making it inaccessible for alteration. The error returned in such case is following "Failed to modify the identity field of the credential '{credential_name}' because the credential is used by an active database file.".

**Workaround**: The engineering team is currently aware of this behavior and is working on a fix. As a workaround you can DROP and CREATE the credentials, which would also mean recreating external tables using the credentials. Alternatively, you can engage Microsoft Support Team for assistance.

## Azure Synapse Analytics Dedicated SQL pool active known issues summary

### Queries failing with Data Exfiltration Error

Synapse workspaces created from an existing dedicated SQL Pool report query failure related to [Data Exfiltration Protection](security/workspace-data-exfiltration-protection.md) with generic error message while Data Exfiltration Protection is turned off in Synapse Analytics: 

`Data exfiltration to '{****}' is blocked. Add destination to allowed list for data exfiltration and try again.`

**Workaround**: If you encountered a similar error, engage Microsoft Support Team for assistance.

### Tag updates appear to fail

When making a change to the [tags](../azure-resource-manager/management/tag-resources-portal.md) of a dedicated SQL pool through Azure portal or other methods, an error message may appear even though the change is made successfully.

**Workaround**: You can confirm that the change to the tags was successful and ignore/suppress the error message as needed.

## Azure Synapse workspace active known issues summary

The following are known issues with the Synapse workspace.

### Blob storage linked service with User Assigned Managed Identity (UAMI) is not getting listed

The linked service may not be visible under the **Data Hub** -> **Linked** -> **Azure Blob Storage** after configuring the blob storage linked service to use "User Assigned Managed Identity" authentication in Azure Synapse Analytics.

**Workaround**: The engineering team is currently aware of this behavior and working on a fix. As an alternative, use "System Assigned Managed Identity" authentication method instead of "User Assigned Managed Identity".

### Failed to delete Synapse workspace & Unable to delete virtual network

Deleting a Synapse workspace fails with the error message:

`Failed to delete Synapse workspace '[Workspace Name]'. Unable to delete virtual network. The correlationId is ********-****-****-****-************;`

**Workaround**: The problem can be mitigated by retrying the delete operation. The engineering team is aware of this behavior and working on a fix.

### REST API PUT operations or ARM/Bicep templates to update network settings fail

When using an ARM template, Bicep template, or direct REST API PUT operation to change the public network access settings and/or firewall rules for a Synapse workspace, the operation can fail.

**Workaround**: The problem can be mitigated by using a REST API PATCH operation or the Azure Portal UI to reverse and retry the desired configuration changes. The engineering team is aware of this behavior and working on a fix.

## Azure Synapse Analytics Apache Spark pool active known issues summary

The following are known issues with the Synapse Spark.

### Certain spark job or task fails too early with Error Code 503 due to storage account throttling

Starting at 00:00 UTC on October 3, 2023, few Azure Synapse Analytics Apache Spark pools might experience spark job/task failures due to storage API limit threshold being exceeded.

**Workaround**: The engineering team is currently aware of this behavior and working on a fix. We recommend setting the following spark config at [pool level](spark/apache-spark-azure-create-spark-configuration.md#create-an-apache-spark-configuration)

`spark.hadoop.fs.azure.io.retry.max.retries      19`


## Recently Closed Known issues

|Synapse Component|Issue|Status|Date Resolved
|---------|---------|---------|---------|
|Azure Synapse serverless SQL pool|[Queries using Microsoft Entra authentication fails after 1 hour](#queries-using-azure-ad-authentication-fails-after-1-hour)|Resolved|August 2023
|Azure Synapse serverless SQL pool|[Query failures while reading Cosmos DB data using OPENROWSET](#query-failures-while-reading-azure-cosmos-db-data-using-openrowset)|Resolved|March 2023
|Azure Synapse Apache Spark pool|[Failed to write to SQL Dedicated Pool from Synapse Spark using Azure Synapse Dedicated SQL Pool Connector for Apache Spark when using notebooks in pipelines](#failed-to-write-to-sql-dedicated-pool-from-synapse-spark-using-azure-synapse-dedicated-sql-pool-connector-for-apache-spark-when-using-notebooks-in-pipelines)|Resolved|June 2023

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

## Next steps

- [Synapse Studio troubleshooting](troubleshoot/troubleshoot-synapse-studio.md)
- [Troubleshoot serverless SQL pool in Azure Synapse Analytics](sql/resources-self-help-sql-on-demand.md)
- [Best practices for serverless SQL pool in Azure Synapse Analytics](sql/best-practices-serverless-sql-pool.md)
- [Troubleshoot a slow query on a dedicated SQL Pool](/troubleshoot/azure/synapse-analytics/dedicated-sql/troubleshoot-dsql-perf-slow-query)
