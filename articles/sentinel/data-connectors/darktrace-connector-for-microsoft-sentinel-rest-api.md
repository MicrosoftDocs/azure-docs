---
title: "Darktrace Connector REST API connector for Microsoft Sentinel"
description: "Learn how to install the connector Darktrace Connector REST API to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Darktrace Connector REST API connector for Microsoft Sentinel

The Darktrace REST API connector pushes real-time events from Darktrace to Microsoft Sentinel and is designed to be used with the Darktrace Solution for Sentinel. The connector writes logs to a custom log table titled "darktrace_model_alerts_CL"; Model Breaches, AI Analyst Incidents, System Alerts and Email Alerts can be ingested - additional filters can be set up on the Darktrace System Configuration page. Data is pushed to Sentinel from Darktrace masters.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | darktrace_model_alerts_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Darktrace](https://www.darktrace.com/en/contact/) |

## Query samples

**Look for Test Alerts**
   ```kusto
darktrace_model_alerts_CL
            
   | where modelName_s == "Unrestricted Test Model"
   ```

**Return Top Scoring Darktrace Model Breaches**
   ```kusto
darktrace_model_alerts_CL
            
   | where dtProduct_s =="Policy Breach"
            
   | project-rename SrcIpAddr=SourceIP
            
   | project-rename SrcHostname=hostname_s
            
   | project-rename DarktraceLink=breachUrl_s
           
   | project-rename ThreatRiskLevel=score_d
            
   | project-rename NetworkRuleName=modelName_s
            
   | project TimeGenerated, NetworkRuleName, SrcHostname, SrcIpAddr, ThreatRiskLevel
            
   | top 10 by ThreatRiskLevel desc
   ```

**Return AI Analyst Incidents**
   ```kusto
darktrace_model_alerts_CL
            
   | where dtProduct_s == "AI Analyst"
            
   | project-rename  EventStartTime=startTime_s
            
   | project-rename EventEndTime = endTime_s
            
   | project-rename NetworkRuleName=title_s
            
   | project-rename CurrentGroup=externalId_g //externalId is the Current Group ID from Darktrace
            
   | project-rename ThreatCategory=dtProduct_s
            
   | extend ThreatRiskLevel=score_d //This is the event score, which is different from the GroupScore
            
   | project-rename SrcHostname=hostname_s
            
   | project-rename DarktraceLink=url_s
            
   | project-rename Summary=summary_s
            
   | project-rename GroupScore=groupScore_d
            
   | project-rename GroupCategory=groupCategory_s
            
   | project-rename SrcDeviceName=bestDeviceName_s
   ```

**Return System Health Alerts**
   ```kusto
  darktrace_model_alerts_CL
            
   | where dtProduct_s == "System Alert"
   ```

**Return email Logs for a specific external sender (example@test.com)**
   ```kusto
darktrace_model_alerts_CL
             
   | where dtProduct_s == 'Antigena Email'
        
   | where from_s == 'example@test.com'
   ```



## Prerequisites

To integrate with Darktrace Connector for Microsoft Sentinel REST API make sure you have: 

- **Darktrace Prerequisites**: To use this Data Connector a Darktrace master running v5.2+ is required.
 Data is sent to the [Azure Monitor HTTP Data Collector API](/azure/azure-monitor/logs/data-collector-api) over HTTPs from Darktrace masters, therefore outbound connectivity from the Darktrace master to Microsoft Sentinel REST API is required.
- **Filter Darktrace Data**: During configuration it is possible to set up additional filtering on the Darktrace System Configuration page to constrain the amount or types of data sent.
- **Try the Darktrace Sentinel Solution**: You can get the most out of this connector by installing the Darktrace Solution for Microsoft Sentinel. This will provide workbooks to visualise alert data and analytics rules to automatically create alerts and incidents from Darktrace Model Breaches and AI Analyst incidents.


## Vendor installation instructions


1. Detailed setup instructions can be found on the Darktrace Customer Portal: https://customerportal.darktrace.com/product-guides/main/microsoft-sentinel-introduction
 2. Take note of the Workspace ID and the Primary key. You will need to enter these details on your Darktrace System Configuration page.
 



Darktrace Configuration

1. Perform the following steps on the Darktrace System Configuration page:
 2. Navigate to the System Configuration Page (Main Menu > Admin > System Config)
 3. Go into Modules configuration and click on the "Microsoft Sentinel" configuration card
 4. Select "HTTPS (JSON)" and hit "New"
 5. Fill in the required details and select appropriate filters
 6. Click "Verify Alert Settings" to attempt authentication and send out a test alert
 7. Run a "Look for Test Alerts" sample query to validate that the test alert has been received



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/darktrace1655286944672.darktrace_for_sentinel?tab=Overview) in the Azure Marketplace.
