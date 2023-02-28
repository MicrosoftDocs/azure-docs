---
title: "Atlassian Jira connector for Microsoft Sentinel"
description: "Learn how to install the connector Atlassian Jira to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Atlassian Jira connector for Microsoft Sentinel

The Atlassian Jira data connector provides the capability to ingest [Atlassian Jira audit logs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-audit-records/) into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | {{graphQueriesTableName}}<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All Atlassian Jira audit logs**
   ```kusto
{{graphQueriesTableName}}

   | sort by TimeGenerated desc
   ```



## Prerequisites

To integrate with Atlassian Jira make sure you have: 

- **Atlassian Jira API credentials**: Jira Username and Jira Access Token are required. [See the documentation to learn more about Atlassian Jira API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#about). Jira domain must be provided as well.


## Vendor installation instructions

Connect Atlassian Jira

Please insert your credentials




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-atlassianjiraaudit?tab=Overview) in the Azure Marketplace.
