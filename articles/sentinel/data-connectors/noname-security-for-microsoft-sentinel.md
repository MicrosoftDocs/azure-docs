---
title: "Noname Security connector for Microsoft Sentinel"
description: "Learn how to install the connector Noname Security to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Noname Security connector for Microsoft Sentinel

Noname Security solution to POST data into a Microsoft Sentinel SIEM workspace via the Azure Monitor REST API

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | NonameAPISecurityAlert_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Noname Security](https://nonamesecurity.com/) |

## Query samples

**Noname API Security Alerts**
   ```kusto
NonameAPISecurityAlert_CL

   | where TimeGenerated >= ago(1d)

   ```



## Vendor installation instructions

Configure the Noname Sentinel integration.

Configure the Sentinel workflow in the Noname integrations settings.  Find documentation at https://docs.nonamesecurity.com





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/nonamegate.nonamesecurity_sentinelsolution?tab=Overview) in the Azure Marketplace.
