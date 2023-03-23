---
title: "InfoSecGlobal Data connector for Microsoft Sentinel"
description: "Learn how to install the connector InfoSecGlobal Data to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# InfoSecGlobal Data connector for Microsoft Sentinel

Use this data connector to integrate with InfoSec Crypto Analytics and get data sent directly to Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | InfoSecAnalytics_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [InfoSecGlobal](https://www.infosecglobal.com/) |

## Query samples

**List all artifacts**
   ```kusto
InfoSecAnalytics_CL
   ```



## Vendor installation instructions

InfoSecGlobal Crypto Analytics Data Connector

1. Data is sent to Microsoft Sentinel through Logstash
 2. Required Logstash configuration is included with Crypto Analytics installation
 3. Documentation provided with the Crypto Analytics installation explains how to enable sending data to Microsoft Sentinel






## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/infosecglobal1632846037582.agilesec-analytics-connector?tab=Overview) in the Azure Marketplace.
