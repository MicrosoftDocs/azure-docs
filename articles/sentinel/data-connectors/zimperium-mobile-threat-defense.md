---
title: "Zimperium Mobile Threat Defense connector for Microsoft Sentinel"
description: "Learn how to install the connector Zimperium Mobile Threat Defense to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Zimperium Mobile Threat Defense connector for Microsoft Sentinel

Zimperium Mobile Threat Defense connector gives you the ability to connect the Zimperium threat log with Microsoft Sentinel to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's mobile threat landscape and enhances your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ZimperiumThreatLog_CL<br/> ZimperiumMitigationLog_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Zimperium](https://www.zimperium.com/support/) |

## Query samples

**All threats with threat vector equal to Device**
   ```kusto
ZimperiumThreatLog_CL 
 
   | where threat_vector_s  == "Device" 
 
   | limit 100
   ```

**All threats for devices running iOS**
   ```kusto
ZimperiumThreatLog_CL 
 
   | where device_os_s == "ios" 
 
   | order by event_timestamp_s  desc nulls last
   ```

**View latest mitigations**
   ```kusto
ZimperiumMitigationLog_CL 
 
   | order by event_timestamp_s  desc nulls last
   ```



## Vendor installation instructions

Configure and connect Zimperium MTD

1. In zConsole, click **Manage** on the navigation bar.
2. Click the **Integrations** tab.
3. Click the **Threat Reporting** button and then the **Add Integrations** button.
4. Create the Integration:
  - From the available integrations, select Microsoft Sentinel.
  - Enter your workspace id and primary key from the fields below, click **Next**.
  - Fill in a name for your Microsoft Sentinel integration.
  - Select a Filter Level for the threat data you wish to push to Microsoft Sentinel.
  - Click **Finish**
5. For additional instructions, please refer to the [Zimperium customer support portal](https://support.zimperium.com).





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/zimperiuminc.zimperium_mobile_threat_defense_mss?tab=Overview) in the Azure Marketplace.
