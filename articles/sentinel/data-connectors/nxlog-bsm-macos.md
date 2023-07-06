---
title: "NXLog BSM macOS connector for Microsoft Sentinel"
description: "Learn how to install the connector NXLog BSM macOS to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 06/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# NXLog BSM macOS connector for Microsoft Sentinel

The [NXLog BSM](https://docs.nxlog.co/refman/current/im/bsm.html) macOS data connector uses Sun's Basic Security Module (BSM) Auditing API to read events directly from the kernel for capturing audit events on the macOS platform. This REST API connector can efficiently export macOS audit events to Microsoft Sentinel in real-time.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | BSMmacOS_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [NXLog](https://nxlog.co/support-tickets/add/support-ticket) |


## Query samples

**Most frequent event types**
   ```kusto
BSMmacOS_CL

   | summarize EventCount = count() by EventType_s

   | where strlen(EventType_s) > 1

   | project Eventype = EventType_s, EventCount

   | order by EventCount desc

   | render barchart
   ```

**Most frequent event names**
   ```kusto
BSMmacOS_CL

   | summarize EventCount = count() by EventName_s

   | project EventCount, EventName = EventName_s

   | where strlen(EventName) > 1

   | order by EventCount desc

   | render barchart
   ```

**Distribution of (notification) texts**
   ```kusto
BSMmacOS_CL

   | summarize EventCount = count() by Text_s

   | where strlen(Text_s) > 1

   | order by EventCount

   | render piechart
   ```



## Vendor installation instructions


Follow the step-by-step instructions in the *NXLog User Guide* Integration Topic [Microsoft Sentinel](https://docs.nxlog.co/userguide/integrate/microsoft-azure-sentinel.html) to configure this connector.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/nxlogltd1589381969261.nxlog_bsm_macos_mss?tab=Overview) in the Azure Marketplace.
