---
title: "BETTER Mobile Threat Defense (MTD) connector for Microsoft Sentinel"
description: "Learn how to install the connector BETTER Mobile Threat Defense (MTD) to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# BETTER Mobile Threat Defense (MTD) connector for Microsoft Sentinel

The BETTER MTD Connector allows Enterprises to connect their Better MTD instances with Microsoft Sentinel, to view their data in Dashboards, create custom alerts, use it to trigger playbooks and expands threat hunting capabilities. This gives users more insight into their organization's mobile devices and ability to quickly analyze current mobile security posture which improves their overall SecOps capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | BetterMTDIncidentLog_CL<br/> BetterMTDDeviceLog_CL<br/> BetterMTDAppLog_CL<br/> BetterMTDNetflowLog_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Better Mobile Security Inc.](https://www.better.mobi/about#contact-us) |

## Query samples

**All threats in the past 24 hour**
   ```kusto
BetterMTDIncidentLog_CL
            
   | where TimeGenerated > ago(24h)
            
   | sort by TimeGenerated
            
   | limit 100
   ```

**Enrolled Devices in the past 24 hour**
   ```kusto
BetterMTDDeviceLog_CL
            
   | where TimeGenerated > ago(24h)
            
   | sort by TimeGenerated
            
   | limit 100
   ```

**Installed applications in the last 24 hour**
   ```kusto
BetterMTDAppLog_CL
            
   | where TimeGenerated > ago(24h)  and  AppStatus_s  == "installed" 
            
   | sort by TimeGenerated            

   | limit 100
   ```

**Blocked Network traffics in the last 24 hour**
   ```kusto
BetterMTDNetflowLog_CL
            
   | where TimeGenerated > ago(24h)  and  Status_s == "blocked"
            
   | sort by TimeGenerated
            
   | limit 100
   ```



## Vendor installation instructions


1. In **Better MTD Console**, click on **Integration** on the side bar.
2. Select  **Others** tab.
3. Click the **ADD ACCOUNT** button and Select **Microsoft Sentinel** from the available integrations.
4. Create the Integration:
  - set `ACCOUNT NAME` to a descriptive name that identifies the integration then click **Next**
  - Enter your `WORKSPACE ID` and `PRIMARY KEY` from the fields below, click **Save**
  - Click **Done**
5.  Threat Policy setup (Which Incidents should be reported to `Microsoft Sentinel`):
  - In **Better MTD Console**, click on **Policies** on the side bar
  - Click on the **Edit** button of the Policy that you are using.
  - For each Incident types that you want to be logged go to **Send to Integrations** field and select **Sentinel**
6. For additional information, please refer to our [Documentation](https://mtd-docs.bmobi.net/integrations/how-to-setup-azure-sentinel-integration#mtd-integration-configuration).





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/bettermobilesecurityinc.better_mtd_mss?tab=Overview) in the Azure Marketplace.
