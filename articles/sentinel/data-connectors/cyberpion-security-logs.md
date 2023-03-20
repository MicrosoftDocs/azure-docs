---
title: "Cyberpion Security Logs connector for Microsoft Sentinel"
description: "Learn how to install the connector Cyberpion Security Logs to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cyberpion Security Logs connector for Microsoft Sentinel

The Cyberpion Security Logs data connector, ingests logs from the Cyberpion system directly into Sentinel. The connector allows users to visualize their data, create alerts and incidents and improve security investigations.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CyberpionActionItems_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Cyberpion](https://www.cyberpion.com/contact/) |

## Query samples

**Fetch latest Action Items that are currently open**
   ```kusto
let lookbackTime = 14d;
let maxTimeGeneratedBucket = toscalar(
   CyberpionActionItems_CL 
   
   | where TimeGenerated > ago(lookbackTime)
   
   | summarize max(bin(TimeGenerated, 1h))
   );
CyberpionActionItems_CL
 
   | where TimeGenerated > ago(lookbackTime) and is_open_b == true
 
   | where bin(TimeGenerated, 1h) == maxTimeGeneratedBucket
 
   ```



## Prerequisites

To integrate with Cyberpion Security Logs make sure you have: 

- **Cyberpion Subscription**: a subscription and account is required for cyberpion logs. [One can be acquired here.](https://azuremarketplace.microsoft.com/en/marketplace/apps/cyberpion1597832716616.cyberpion)


## Vendor installation instructions


Follow the [instructions](https://www.cyberpion.com/resource-center/integrations/azure-sentinel/) to integrate Cyberpion Security Alerts into Sentinel.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cyberpion1597832716616.cyberpion_mss?tab=Overview) in the Azure Marketplace.
