---
title: "Jamf Protect connector for Microsoft Sentinel"
description: "Learn how to install the connector Jamf Protect to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Jamf Protect connector for Microsoft Sentinel

The [Jamf Protect](https://www.jamf.com/products/jamf-protect/) connector provides the capability to read raw event data from Jamf Protect in Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | jamfprotect_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Jamf Software, LLC](https://www.jamf.com/support/) |

## Query samples

**Jamf Protect - All events.**
   ```kusto
jamfprotect_CL
 
   | sort by TimeGenerated desc
   ```

**Jamf Protect - All active endpoints.**
   ```kusto
jamfprotect_CL
 
   | where notempty(input_host_hostname_s) 
   | summarize Event = count() by input_host_hostname_s
 
   | project-rename HostName = input_host_hostname_s
 
   | sort by Event desc
   ```

**Jamf Protect - Top 10 endpoints with Alerts**
   ```kusto
jamfprotect_CL
 
   | where topicType_s == 'alert' and notempty(input_eventType_s) and notempty(input_host_hostname_s)
 
   | summarize Event = count() by input_host_hostname_s
 
   | project-rename HostName = input_host_hostname_s
 
   | top 10 by Event
   ```



## Vendor installation instructions


This connector reads data from the jamfprotect_CL table created by Jamf Protect in a Microsoft Analytics Workspace, if the [data forwarding](https://docs.jamf.com/jamf-protect/documentation/Data_Forwarding_to_a_Third_Party_Storage_Solution.html?hl=sentinel#task-4227) option is enabled in Jamf Protect then raw event data is sent to the Microsoft Sentinel Ingestion API.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/jamfsoftwareaustraliaptyltd1620360395539.jamf_protect?tab=Overview) in the Azure Marketplace.
