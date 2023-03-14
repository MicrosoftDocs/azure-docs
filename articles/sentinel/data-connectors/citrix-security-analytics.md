---
title: "CITRIX SECURITY ANALYTICS connector for Microsoft Sentinel"
description: "Learn how to install the connector CITRIX SECURITY ANALYTICS to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# CITRIX SECURITY ANALYTICS connector for Microsoft Sentinel

Citrix Analytics (Security) integration with Microsoft Sentinel helps you to export data analyzed for risky events from Citrix Analytics (Security) into Microsoft Sentinel environment. You can create custom dashboards, analyze data from other sources along with that from Citrix Analytics (Security) and create custom workflows using Logic Apps to monitor and mitigate security events.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CitrixAnalytics_indicatorSummary_CL<br/> CitrixAnalytics_indicatorEventDetails_CL<br/> CitrixAnalytics_riskScoreChange_CL<br/> CitrixAnalytics_userProfile_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Citrix Systems](https://www.citrix.com/support/) |

## Query samples

**High Risk Users**
   ```kusto
CitrixAnalytics_userProfile_CL
  
   | where cur_riskscore_d > 64
 
   | where cur_riskscore_d < 100
 
   | summarize arg_max(TimeGenerated, cur_riskscore_d) by entity_id_s
 
   | count 
   ```

**Medium Risk Users**
   ```kusto
CitrixAnalytics_userProfile_CL
  
   | where cur_riskscore_d > 34
 
   | where cur_riskscore_d < 63
 
   | summarize arg_max(TimeGenerated, cur_riskscore_d) by entity_id_s
 
   | count 
   ```

**Low Risk Users**
   ```kusto
CitrixAnalytics_userProfile_CL
  
   | where cur_riskscore_d > 1
 
   | where cur_riskscore_d < 33
 
   | summarize arg_max(TimeGenerated, cur_riskscore_d) by entity_id_s
 
   | count 
   ```



## Prerequisites

To integrate with CITRIX SECURITY ANALYTICS make sure you have: 

- **Licensing**: Entitlements to Citrix Security Analytics in Citrix Cloud. Please review [Citrix Tool License Agreement.](https://aka.ms/sentinel-citrixanalyticslicense-readme)


## Vendor installation instructions


To get access to this capability and the configuration steps on Citrix Analytics, please visit: [Connect Citrix to Microsoft Sentinel.](https://aka.ms/Sentinel-Citrix-Connector)​






## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/citrix.citrix_analytics_for_security_mss?tab=Overview) in the Azure Marketplace.
