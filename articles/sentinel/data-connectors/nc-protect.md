---
title: "NC Protect connector for Microsoft Sentinel"
description: "Learn how to install the connector NC Protect to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# NC Protect connector for Microsoft Sentinel

[NC Protect Data Connector (archtis.com)](https://info.archtis.com/get-started-with-nc-protect-sentinel-data-connector) provides the capability to ingest user activity logs and events into Microsoft Sentinel. The connector provides visibility into NC Protect user activity logs and events in Microsoft Sentinel to improve monitoring and investigation capabilities

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | NCProtectUAL_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [archTIS](https://www.archtis.com/nc-protect-support/) |

## Query samples

**Get last 7 days records**
   ```kusto

NCProtectUAL_CL
 
   | where TimeGenerated > ago(7d)
 
   | order by TimeGenerated desc
   ```

**Login failed consecutively for more than 3 times in an hour by user**
   ```kusto

NCProtectUAL_CL
 
   | where TimeGenerated > ago(1h) and Type_s == 'LoginFailure'
 
   | summarize FailedRequestCount = count() by bin(TimeGenerated, 1h), UserDisplayName_s, UserEmail_s, UserLoginName_s, Type_s, JSONExtra_s
 
   | where  FailedRequestCount > 3
   ```

**Download failed consecutively for more than 3 times in an hour by user**
   ```kusto

NCProtectUAL_CL
 
   | where TimeGenerated > ago(1h) and Type_s == 'Open' and Status_s == 'Fail'
 
   | summarize FailedRequestCount = count() by bin(TimeGenerated, 1h), UserDisplayName_s, UserEmail_s, UserLoginName_s, Type_s, JSONExtra_s, DocumentUrl_s
 
   | where  FailedRequestCount > 3
   ```

**Get logs for rule created or modified or deleted records in last 7 days**
   ```kusto

NCProtectUAL_CL
 
   | where TimeGenerated > ago(7d) and (Type_s == 'Create' or Type_s == 'Modify' or Type_s == 'Delete') and isnotempty(RuleName_s)
 
   | order by TimeGenerated desc
   ```



## Prerequisites

To integrate with NC Protect make sure you have: 

- **NC Protect**: You must have a running instance of NC Protect for O365. Please [contact us](https://www.archtis.com/data-discovery-classification-protection-software-secure-collaboration/).


## Vendor installation instructions


1. Install NC Protect into your Azure Tenancy
2. Log into the NC Protect Administration site
3. From the left hand navigation menu, select General -> User Activity Monitoring
4. Tick the checkbox to Enable SIEM and click the Configure button
5. Select Microsoft Sentinel as the Application and complete the configuration using the information below
6. Click Save to activate the connection






## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/nucleuscyber.nc-protect-azure-sentinel-data-connector?tab=Overview) in the Azure Marketplace.
