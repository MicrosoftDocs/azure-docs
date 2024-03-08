---
title: "NXLog LinuxAudit connector for Microsoft Sentinel"
description: "Learn how to install the connector NXLog LinuxAudit to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 06/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# NXLog LinuxAudit connector for Microsoft Sentinel

The [NXLog LinuxAudit](https://docs.nxlog.co/refman/current/im/linuxaudit.html) data connector supports custom audit rules and collects logs without auditd or any other user-space software. IP addresses and group/user IDs are resolved to their respective names making [Linux audit](https://docs.nxlog.co/userguide/integrate/linux-audit.html) logs more intelligible to security analysts. This REST API connector can efficiently export Linux security events to Microsoft Sentinel in real-time.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | LinuxAudit_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [NXLog](https://nxlog.co/support-tickets/add/support-ticket) |

## Query samples

**Most frequent type**
   ```kusto
LinuxAudit_CL

   | summarize EventCount = count() by type_s 

   | where strlen(type_s) > 1 

   | render barchart
   ```

**Most frequent comm**
   ```kusto
LinuxAudit_CL

   | summarize EventCount = count() by comm_s

   | where strlen(comm_s) > 1

   | render barchart
   ```

**Most frequent name**
   ```kusto
LinuxAudit_CL

   | summarize EventCount = count() by name_s

   | where strlen(name_s) > 1

   | render barchart
   ```



## Vendor installation instructions


Follow the step-by-step instructions in the *NXLog User Guide* Integration Topic [Microsoft Sentinel](https://docs.nxlog.co/userguide/integrate/microsoft-azure-sentinel.html) to configure this connector.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/nxlogltd1589381969261.nxlog_linuxaudit_mss?tab=Overview) in the Azure Marketplace.
