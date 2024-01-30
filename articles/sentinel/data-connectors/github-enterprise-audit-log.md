---
title: "GitHub Enterprise Audit Log connector for Microsoft Sentinel"
description: "Learn how to install the connector GitHub Enterprise Audit Log to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# GitHub Enterprise Audit Log connector for Microsoft Sentinel

The GitHub audit log connector provides the capability to ingest GitHub logs into Microsoft Sentinel. By connecting GitHub audit logs into Microsoft Sentinel, you can view this data in workbooks, use it to create custom alerts, and improve your investigation process. 

 **Note:** If you are intended to ingest GitHub subscribed events into Microsoft Sentinel , Please refer to GitHub (using Webhooks) Connector from "**Data Connectors**" gallery.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | GitHubAuditData<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto
{{graphQueriesTableName}}
 
   | take 10
   ```



## Prerequisites

To integrate with GitHub Enterprise Audit Log make sure you have: 

- **GitHub API personal token Key**: You need access to GitHub personal token, the key should have 'admin:org' scope


## Vendor installation instructions

Connect GitHub Enterprise Audit Log to Microsoft Sentinel

Enable GitHub audit Logs. 
 Follow [this](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) to create or find your personal key




## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoftcorporation1622712991604.sentinel4github?tab=Overview) in the Azure Marketplace.
