---
title: "Microsoft Defender for Office 365 connector for Microsoft Sentinel (preview)"
description: "Learn how to install the connector Microsoft Defender for Office 365 to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Microsoft Defender for Office 365 connector for Microsoft Sentinel (preview)

Microsoft Defender for Office 365 safeguards your organization against malicious threats posed by email messages, links (URLs) and collaboration tools. By ingesting Microsoft Defender for Office 365 alerts into Microsoft Sentinel, you can incorporate information about email- and URL-based threats into your broader risk analysis and build response scenarios accordingly.
 
The following types of alerts will be imported:

-   A potentially malicious URL click was detected 
-   Email messages containing malware removed after delivery
-   Email messages containing phish URLs removed after delivery
-   Email reported by user as malware or phish 
-   Suspicious email sending patterns detected 
-   User restricted from sending email 

These alerts can be seen by Office customers in the ** Office Security and Compliance Center**.

For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2219942&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SecurityAlert (OATP)<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |
