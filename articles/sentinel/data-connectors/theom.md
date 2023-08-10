---
title: "Theom connector for Microsoft Sentinel"
description: "Learn how to install the connector Theom to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Theom connector for Microsoft Sentinel

Theom Data Connector enables organizations to connect their Theom environment to Microsoft Sentinel. This solution enables users to receive alerts on data security risks, create and enrich incidents, check statistics and trigger SOAR playbooks in Microsoft Sentinel

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | TheomAlerts_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Theom](https://www.theom.ai) |

## Query samples

**All alerts in the past 24 hour**
   ```kusto
TheomAlerts_CL
     
   | where TimeGenerated > ago(24h)
  
   | sort by TimeGenerated
  
   | limit 10
   ```



## Vendor installation instructions


1. In **Theom UI Console** click on **Manage -> Alerts** on the side bar.
2. Select  **Sentinel** tab.
3. Click on **Active** button to enable the configuration.
4. Enter `Primary` key as `Authorization Token`
5. Enter `Endpoint URL` as `https://<Workspace ID>.ods.opinsights.azure.com/api/logs?api-version=2016-04-01`
6. Click on `SAVE SETTINGS`






## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/theominc1667512729960.theom_sentinel?tab=Overview) in the Azure Marketplace.
