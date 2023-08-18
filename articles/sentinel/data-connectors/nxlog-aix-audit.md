---
title: "NXLog AIX Audit connector for Microsoft Sentinel"
description: "Learn how to install the connector NXLog AIX Audit to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 06/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# NXLog AIX Audit connector for Microsoft Sentinel

The [NXLog AIX Audit](https://docs.nxlog.co/refman/current/im/aixaudit.html) data connector uses the AIX Audit subsystem to read events directly from the kernel for capturing audit events on the AIX platform. This REST API connector can efficiently export AIX Audit events to Microsoft Sentinel in real time.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | AIX_Audit_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [NXLog](https://nxlog.co/support-tickets/add/support-ticket) |

## Query samples

**AIX Audit event type distribution**
   ```kusto
NXLog_parsed_AIX_Audit_view

   | summarize count() by EventType

   | render piechart title="AIX Audit event type distributon"
   ```

**Highest event per second (EPS) AIX Audit event types**
   ```kusto
NXLog_parsed_AIX_Audit_view

   | where EventEndTime >  todatetime('2021-09-09')

   | summarize EPS=count() by bin(EventEndTime, 1s), EventType

   | sort by EPS, EventType, EventEndTime

   | take 5

   | render columnchart title="Highest event per second (EPS) event types"
   ```

**Time chart of AIX Audit events per day**
   ```kusto
NXLog_parsed_AIX_Audit_view

   | where EventEndTime >= todatetime('2021-09-06')

   | where EventEndTime <  todatetime('2021-09-10')

   | summarize Count=count() by bin(EventEndTime, 1d)

   | render timechart title="AIX Audit events per day"
   ```

**Time chart of AIX Audit events per hour**
   ```kusto
NXLog_parsed_AIX_Audit_view

   | where EventEndTime >= todatetime('2021-09-07')

   | where EventEndTime <  todatetime('2021-09-08')

   | summarize Count=count() by bin(EventEndTime, 1h)

   | render timechart title="AIX Audit events per hour"
   ```

**AIX Audit events per second (EPS) time chart**
   ```kusto
NXLog_parsed_AIX_Audit_view

   | where EventEndTime >= todatetime('2021-09-07 18:29')

   | where EventEndTime <  todatetime('2021-09-07 23:55')

   | summarize EPS=count() by bin(EventEndTime, 1s)

   | render timechart title="AIX Audit events per second (EPS)"
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**NXLog_parsed_AIX_Audit_view**](https://aka.ms/sentinel-nxlogaixaudit-parser) which is deployed with the Microsoft Sentinel Solution.


Follow the step-by-step instructions in the *NXLog User Guide* Integration Guide [Microsoft Sentinel](https://docs.nxlog.co/userguide/integrate/microsoft-azure-sentinel.html) to configure this connector.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/nxlogltd1589381969261.nxlog_aix_audit?tab=Overview) in the Azure Marketplace.
