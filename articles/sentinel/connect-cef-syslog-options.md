---
title: Options for streaming logs in the CEF and Syslog format to Microsoft Sentinel 
description: Find the relevant option for streaming and filtering logs in the CEF and Syslog format to your Microsoft Sentinel workspace.
author: limwainstein
ms.topic: how-to
ms.date: 02/09/2023
ms.author: lwainstein
#Customer intent: As a security operator, I want to understand what my options are for streaming CEF and Syslog-based logs from my organization to my Microsoft Sentinel workspace.   
---

# Options for streaming logs in the CEF and Syslog format to Microsoft Sentinel

In this article, you can find the relevant option for streaming and filtering logs in the CEF and Syslog format to your Microsoft Sentinel workspace.

## Stream logs in the CEF and Syslog format to Microsoft Sentinel 

|Scenario  |Options  |
|---------|---------|
|Are your logs in raw Syslog, in Common Event Format (CEF), or both?   |• **[CEF (with CEF AMA connector)](connect-cef-ama.md)**<br><br>• **Syslog**: To ingest logs over Syslog with the AMA, [create a DCR](../azure-monitor/essentials/data-collection-rule-structure.md), or for the full procedure, see [forward syslog data to Log Analytics using the AMA](forward-syslog-monitor-agent.md).<br><br>• **[CEF and Syslog](connect-cef-syslog.md)** |
|Are you sending logs to Microsoft Sentinel directly from your device/appliance, or via a log forwarder?   |• To **[Send logs directly via CEF](connect-cef-ama.md)**, skip the Configure a log forwarder step.<br><br>• **[Send logs directly via Syslog](connect-syslog.md)**<br><br>• **[Configure a log forwarder](connect-log-forwarder.md)** |

## Next steps

In this article, we reviewed the available options for streaming logs in the CEF and Syslog format to your Microsoft Sentinel workspace. 
- [Stream CEF logs with the AMA connector](connect-cef-ama.md)
- [Collect data from Linux-based sources using Syslog](connect-syslog.md)
- [Stream logs in both the CEF and Syslog format](connect-cef-syslog.md)