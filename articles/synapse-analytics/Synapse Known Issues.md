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

To learn more about Azure Synapse Analytics, see the [overview](https://learn.microsoft.com/azure/synapse-analytics/), and [what's new](https://learn.microsoft.com/azure/synapse-analytics/overview-what-is). 

## Active Known issues

|Issue  |Date discovered  |Status  |Synapse Component|
|---------|---------|---------|---------|
|[Queries using AAD authentication fails after 1 hour](#queries-using-aad-authentication-fails-after-1-hour)|January 2021|Has Workaround|Azure Synapse Serverless SQL Pool|
|[Query failures from Serverless SQL to Cosmos DB Analytical Store](#query-failures-from-serverless-sql-to-cosmos-db-analytical-store)|June 2022|Has Workaround|Azure Synapse Serverless SQL Pool|
|[Query failures while reading Cosmos Data using OPENROWSET](#query-failures-while-reading-cosmos-data-using-openrowset)|September 2022|Has Workaround|Azure Synapse Serverless SQL Pool|
|[Queries failing with Data Exfiltration Error](#queries-failing-with-data-exfiltration-error)|October 2022|Has Workaround|Azure Synapse Workspace|
|[Blob storage linked service with User Assigned Managed Identity (UAMI) is not getting listed](#blob-storage-linked-service-with-user-assigned-managed-identity-uami-is-not-getting-listed)|October 2022|Has Workaround|Azure Synapse Workspace|
|[Unable to find data in Synapse Snapshots](#unable-to-find-data-in-synapse-snapshots)|October 2022|Has Workaround|Azure Synapse Workspace|
|[Failed to delete Synapse workspace & Unable to delete virtual network](#failed-to-delete-synapse-workspace--unable-to-delete-virtual-network)|November 2022|Has Workaround|Azure Synapse Workspace|


## Azure Synapse Analytics Serverless SQL Pool Known Issues Summary

### Queries using AAD authentication fails after 1 hour

Starting from January 01st, 2021, The customers use AAD (Azure Active Directory) authentication in queries & when AAD (Azure Active Directory) login has connection open for more than 1 hour at time of query execution, any query that relies on AAD (Azure Active Directory) will fail. 
This includes querying storage using AAD pass-through and statements that interact with AAD (like CREATE EXTERNAL PROVIDER). This affects every tool that keeps connection open, like in query editor in SSMS and ADS. Tools that open new connection to execute query are not affected, like Synapse Studio.

**Workaround**: There are 2 mitigation steps can be taken.

1) It is recommended switching to Service Principal, Managed identity or Shared access signature instead of using user identity for long running queries. 
2) Restarting client (SSMS/ADS) acquires new token to establish the connection.

### Query failures from Serverless SQL to Cosmos DB Analytical Store

Starting from June 29th, 2022, The customers who send queries from serverless SQL to Cosmos DB Analytical store might fail with one of the following error messages:

_"Resolving CosmosDB path has failed with error 'This request is not authorized to perform this operation'"_
_"Resolving CosmosDB path has failed with error 'Key not found'"_

The following conditions must be true to confirm this issue:

1) The connection to Cosmos DB Analytical store uses a private endpoint. 
2) Retrying the query succeeds.

**Workaround**: The engineering team is aware of this behavior & following actions can be taken as quick mitigations 

1) Retry the failed query. It will automatically refresh the expired token. 
2) Disable the private endpoint. Before applying this change, confirm with your security team that it meets your company security policies.

### Query failures while reading Cosmos Data using OPENROWSET

Starting from September 29th, 2022, The customers may face following error while reading Cosmos data using Synapse Serverless OPENROWSET command.

_"Resolving CosmosDB path has failed with error 'bad allocation'."_


**Workaround**: The current workaround requires a restart of Synapse Serverless SQL Pool and can take up to 60 minutes to complete. If you encountered a similar error, please engage Microsoft Support Team for assistance. 

## Azure Synapse Analytics Workspace Known Issues Summary

### Queries failing with Data Exfiltration Error

Starting from October 7th, 2022, The customers who created their Synapse workspace from an existing Dedicated SQL Pools reported multiple query failures related to the [Data Exfiltration Protection](https://learn.microsoft.com/en-us/azure/synapse-analytics/security/workspace-data-exfiltration-protection) with generic error "_Data exfiltration to '{****}' is blocked. Add destination to allowed list for data exfiltration and try again._" while Data Exfiltration Protection is turned off in Synapse Analytics.  

**Workaround**: If you encountered a similar error, please engage Microsoft Support Team for assistance. 


### Blob storage linked service with User Assigned Managed Identity (UAMI) is not getting listed

Starting from October 10th, 2022, The linked service may not be visible under the "Data Hub - Linked - Azure Blob Storage Tab" after configuring the Blob storage linked service to use the "User Assigned Managed Identity" in Azure Synapse Analytics. 

**Workaround**: The engineering team is currently aware of this behavior and please use the "System Assigned Managed Identity" as an alternative method to authenticate and explore the Blob Storage Accounts. 

### Unable to find data in Synapse Snapshots

Starting from October 10th, 2022, We have identified a issue while  querying the partitioned tables in Synapse Analytics Workspace (SynapseLink from Dynamics),there is no data that has been synced from the main tables

**Workaround**: it is important to check the last date that the view definition was updated using the "_sys.views_" and Dataverse should recreate the SQL view every hour as the current mitigation. 


### Failed to delete Synapse workspace & Unable to delete virtual network

Starting from November 02th, 2022, We have identified an error while customers attempting to delete the existing Synapse workspaces & the attempt fails with below error message. 

_Failed to delete Synapse workspace '[Workspace Name]'._ <br>
_Unable to delete virtual network. The correlationId is ********-****-****-****-************;_

**Workaround**: The problem will be auto mitigated after next attempts & currently, the engineering team is aware of this behavior. 



## Next steps

- [Get started with Azure Synapse Analytics](https://learn.microsoft.com/en-us/azure/synapse-analytics/get-started)
- [Azure Synapse Analytics in Microsoft Q&A](https://learn.microsoft.com/en-us/answers/topics/azure-synapse-analytics.html)
- [Azure Synapse Analytics Blog](https://aka.ms/SynapseMonthlyUpdate)
- [Become an Azure Synapse Influencer](https://aka.ms/synapseinfluencers)
- [Azure Synapse Analytics terminology](https://learn.microsoft.com/en-us/azure/synapse-analytics/overview-terminology)
- [Azure Synapse Analytics frequently asked questions](https://learn.microsoft.com/en-us/azure/synapse-analytics/overview-faq) 
