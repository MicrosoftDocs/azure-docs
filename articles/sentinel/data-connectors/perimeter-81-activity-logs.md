---
title: "Perimeter 81 Activity Logs connector for Microsoft Sentinel"
description: "Learn how to install the connector Perimeter 81 Activity Logs to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Perimeter 81 Activity Logs connector for Microsoft Sentinel

The Perimeter 81 Activity Logs connector allows you to easily connect your Perimeter 81 activity logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Perimeter81_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Perimeter 81](https://support.perimeter81.com/docs) |

## Query samples

**User login failures**
   ```kusto
Perimeter81_CL 
   | where eventName_s == "api.activity.login.fail"
   ```

**Application authorization failures**
   ```kusto
Perimeter81_CL 
   | where eventName_s == "api.activity.application.auth.fail"
   ```

**Application session start**
   ```kusto
Perimeter81_CL 
   | where eventName_s == "api.activity.application.session.start"
   ```

**Authentication failures by IP & email (last 24 hours)**
   ```kusto
Perimeter81_CL

   | where TimeGenerated > ago(24h) and eventName_s in ("api.activity.login.fail", "api.activity.vpn.auth.fail", "api.activity.application.auth.fail")

   | summarize count(releasedBy_email_s) by ip_s, releasedBy_email_s

   | where count_releasedBy_email_s > 1
   ```

**Resource deletions by IP & email (last 24 hours)**
   ```kusto
Perimeter81_CL

   | where TimeGenerated > ago(24h) and eventName_s matches regex "api.activity.*.remove*
   |api.activity.*.delete*
   |api.activity.*.destroy*"  

   | summarize count(releasedBy_email_s) by ip_s, releasedBy_email_s

   | where count_releasedBy_email_s > 1
   ```



## Vendor installation instructions


Please note the values below and follow the instructions <a href='https://support.perimeter81.com/hc/en-us/articles/360012680780'>here</a> to connect your Perimeter 81 activity logs with Microsoft Sentinel.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/perimeter811605117499319.perimeter_81___mss?tab=Overview) in the Azure Marketplace.
