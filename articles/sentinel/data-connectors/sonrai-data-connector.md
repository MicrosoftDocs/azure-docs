---
title: "Sonrai Data connector for Microsoft Sentinel"
description: "Learn how to install the connector Sonrai Data to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Sonrai Data connector for Microsoft Sentinel

Use this data connector to integrate with Sonrai Security and get Sonrai tickets sent directly to Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Sonrai_Tickets_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Sonrai]() |

## Query samples

**Query for tickets with AWSS3ObjectFingerprint resource type.**
   ```kusto
Sonrai_Tickets_CL 

   | where digest_resourceType_s == "AWSS3ObjectFingerprint"

   | limit 10
   ```



## Vendor installation instructions

Sonrai Security Data Connector

1. Navigate to Sonrai Security dashboard.
2. On the bottom left panel, click on integrations.
3. Select Microsoft Sentinel from the list of available Integrations.
4. Fill in the form using the information provided below.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/sonraisecurityllc1584373214489.sonrai_sentinel_offer?tab=Overview) in the Azure Marketplace.
