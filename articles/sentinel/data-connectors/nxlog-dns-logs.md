---
title: "NXLog DNS Logs connector for Microsoft Sentinel"
description: "Learn how to install the connector NXLog DNS Logs to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# NXLog DNS Logs connector for Microsoft Sentinel

The NXLog DNS Logs data connector uses Event Tracing for Windows ([ETW](/windows/apps/trace-processing/overview)) for collecting both Audit and Analytical DNS Server events. The [NXLog *im_etw* module](https://docs.nxlog.co/refman/current/im/etw.html) reads event tracing data directly for maximum efficiency, without the need to capture the event trace into an .etl file. This REST API connector can forward DNS Server events to Microsoft Sentinel in real time.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | NXLog_DNS_Server_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [NXLog](https://nxlog.co/support-tickets/add/support-ticket) |

## Query samples

**DNS Server top 5 hostlookups**
   ```kusto
ASimDnsMicrosoftNXLog 

   | summarize count() by Domain

   | take 5

   | render piechart title='Top 5 host lookups'
   ```

**DNS Server Top 5 EventOriginalTypes (Event IDs)**
   ```kusto
ASimDnsMicrosoftNXLog 

   | extend EventID=strcat('Event ID ',trim_end('.0',tostring(EventOriginalType)))

   | summarize CountByEventID=count() by EventID

   | sort by CountByEventID

   | take 5

   | render piechart title='Top 5 EventOriginalTypes (Event IDs)'
   ```

**DNS Server analytical events per second (EPS)**
   ```kusto
ASimDnsMicrosoftNXLog 

   | where EventEndTime >= todatetime('2021-09-17 03:07')

   | where EventEndTime <  todatetime('2021-09-18 03:14')

   | summarize EPS=count() by bin(EventEndTime, 1s)

   | render timechart title='DNS analytical events per second (EPS) - All event types'
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on parsers based on Kusto functions deployed with the Microsoft Sentinel Solution to work as expected. The [**ASimDnsMicrosoftNXLog **](https://aka.ms/sentinel-nxlogdnslogs-parser) is designed to leverage Microsoft Sentinel's built-in DNS-related analytics capabilities.


Follow the step-by-step instructions in the *NXLog User Guide* Integration Topic [Microsoft Sentinel](https://docs.nxlog.co/userguide/integrate/microsoft-azure-sentinel.html) to configure this connector.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/nxlogltd1589381969261.nxlog_dns_logs?tab=Overview) in the Azure Marketplace.
