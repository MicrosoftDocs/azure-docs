---
title: Known issues
titleSuffix: Azure Synapse Analytics
description: Learn about the currently known issues with Azure Synapse Analytics, and their possible workarounds or resolutions.
author: charithdilshan
ms.author: ccaldera
ms.date: 11/09/2022
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
---

# Azure Synapse Analytics Known Issues

This page lists the  known issues in [Azure Synapse Analytics](https://learn.microsoft.com/azure/synapse-analytics/overview-what-is), as well as their resolution date or possible workaround. 
Before submitting a Support request, please review this list to see if the issue that you are experiencing is already known and being addressed.

To learn more about Azure Synapse Analytics, see the [overview](https://learn.microsoft.com/azure/synapse-analytics/), and [what's new](https://learn.microsoft.com/azure/synapse-analytics/whats-new). 

## Active Known issues

|Issue  |Date discovered  |Status  |Synapse Component|
|---------|---------|---------|---------|
|[Queries using AAD authentication fails after 1 hour](#queries-using-aad-authentication-fails-after-1-hour)|January 2021|Has Workaround|Azure Synapse Serverless SQL Pool|
|[Query failures from Serverless SQL to Cosmos DB Analytical Store](#query-failures-from-serverless-sql-pool-to-cosmos-db-analytical-store)|June 2022|Has Workaround|Azure Synapse Serverless SQL Pool|
|[Query failures while reading Cosmos Data using OPENROWSET](#query-failures-while-reading-cosmos-data-using-openrowset)|September 2022|Has Workaround|Azure Synapse Serverless SQL Pool|
|[Queries failing with Data Exfiltration Error](#queries-failing-with-data-exfiltration-error)|October 2022|Has Workaround|Azure Synapse Dedicated SQL Pool|
|[Blob storage linked service with User Assigned Managed Identity (UAMI) is not getting listed](#blob-storage-linked-service-with-user-assigned-managed-identity-uami-is-not-getting-listed)|October 2022|Has Workaround|Azure Synapse Workspace|
|[Failed to delete Synapse workspace & Unable to delete virtual network](#failed-to-delete-synapse-workspace--unable-to-delete-virtual-network)|November 2022|Has Workaround|Azure Synapse Workspace|


## Azure Synapse Analytics Serverless SQL Pool Known Issues Summary

### Queries using AAD authentication fails after 1 hour

Starting from January 1st, 2021, SQL connections using Azure AD authentication that remain active for more than 1 hour will start to fail. This includes querying storage using Azure AD pass-through authentication and statements that interact with Azure AD, like CREATE EXTERNAL PROVIDER. This affects every tool that keeps connections active, like query editor in SSMS and ADS. Tools that open new connection to execute queries are not affected, like Synapse Studio.

**Workaround**: There are 2 mitigation steps can be taken.

1) It is recommended switching to Service Principal, Managed Identity or Shared Access Signature instead of using user identity for long running queries. 
2) Restarting client (SSMS/ADS) acquires new token to establish the connection.

### Query failures from Serverless SQL pool to Cosmos DB Analytical Store

Starting from June 29th, 2022, queries from serverless SQL to Cosmos DB Analytical store might fail with one of the following error messages:

_"Resolving CosmosDB path has failed with error 'This request is not authorized to perform this operation'"_
_"Resolving CosmosDB path has failed with error 'Key not found'"_

The following conditions must be true to confirm this issue:

1) The connection to Cosmos DB Analytical store uses a private endpoint. 
2) Retrying the query succeeds.

**Workaround**: The engineering team is aware of this behavior and following actions can be taken as quick mitigations.

1) Retry the failed query. It will automatically refresh the expired token. 
2) Disable the private endpoint. Before applying this change, confirm with your security team that it meets your company security policies.

### Query failures while reading Cosmos Data using OPENROWSET

Starting from September 29th, 2022, queries from serverless SQL pool to Cosmos DB Analytical Store using OPENROWSET fails with the following error message:

_"Resolving CosmosDB path has failed with error 'bad allocation'."_


**Workaround**: The engineering team is aware of this behavior and working on a fix. If you encounter this error engage Microsoft Support Team for assistance.

## Azure Synapse Analytics Dedicated SQL Pool Known Issues Summary

### Queries failing with Data Exfiltration Error

Synapse workspaces created from an existing dedicated SQL Pool report query failures related to [Data Exfiltration Protection](https://learn.microsoft.com/azure/synapse-analytics/security/workspace-data-exfiltration-protection) with generic error message while Data Exfiltration Protection is turned off in Synapse Analytics: 

_"Data exfiltration to '{****}' is blocked. Add destination to allowed list for data exfiltration and try again."_

**Workaround**: If you encountered a similar error, engage Microsoft Support Team for assistance.

## Azure Synapse Analytics Workspace Known Issues Summary

### Blob storage linked service with User Assigned Managed Identity (UAMI) is not getting listed

Starting from October 10th, 2022, The linked service may not be visible under the "Data Hub - Linked - Azure Blob Storage Tab" after configuring the Blob storage linked service to use "User Assigned Managed Identity" authentication in Azure Synapse Analytics.

**Workaround**: The engineering team is currently aware of this behavior and working on a fix. As an alternative, use "System Assigned Managed Identity" authentication method instead of "User Assigned Managed Identity".


### Failed to delete Synapse workspace & Unable to delete virtual network

Deleting a Synapse workspace fails with the error message:

_Failed to delete Synapse workspace '[Workspace Name]'._ <br>
_Unable to delete virtual network. The correlationId is ********-****-****-****-************;_

**Workaround**: The problem can be mitigated by retrying the delete operation. The engineering team is aware of this behavior and working on a fix.


## Next steps

- [Synapse Studio troubleshooting](https://learn.microsoft.com/azure/synapse-analytics/troubleshoot/troubleshoot-synapse-studio)
- [Troubleshoot serverless SQL pool in Azure Synapse Analytics](https://learn.microsoft.com/azure/synapse-analytics/sql/resources-self-help-sql-on-demand?tabs=x80070002)
- [Best practices for serverless SQL pool in Azure Synapse Analytics](https://learn.microsoft.com/azure/synapse-analytics/sql/best-practices-serverless-sql-pool)
- [Troubleshoot a slow query on a dedicated SQL Pool](https://learn.microsoft.com/troubleshoot/azure/synapse-analytics/dedicated-sql/troubleshoot-dsql-perf-slow-query)
