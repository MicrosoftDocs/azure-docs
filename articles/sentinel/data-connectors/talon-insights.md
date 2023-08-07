---
title: "Talon Insights connector for Microsoft Sentinel"
description: "Learn how to install the connector Talon Insights to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 03/25/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Talon Insights connector for Microsoft Sentinel

The Talon Security Logs connector allows you to easily connect your Talon events and audit logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Talon_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Talon Security](https://docs.console.talon-sec.com/) |

## Query samples

**Blocked user activities**
   ```kusto
Talon_CL 
   | where action_s != "blocked"
   ```

**Failed login user **
   ```kusto
Talon_CL 
   | where  eventType_s == "loginFailed"
   ```

**Audit logs changes **
   ```kusto
    Talon_CL 
   | where  type_s == "audit"
   ```



## Vendor installation instructions


Please note the values below and follow the instructions <a href='https://docs.console.talon-sec.com/en/articles/254-microsoft-sentinel-integration'>here</a> to connect your Talon Security events and audit logs with Microsoft Sentinel.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/taloncybersecurityltd1654088115170.talonconnector?tab=Overview) in the Azure Marketplace.
