---  
title: Compare Microsoft Sentinel analytics rules and Microsoft Defender custom detections
titleSuffix: Microsoft Security  
description: Compare the different features supported by Microsoft Sentinel analytics rules and Microsoft Defender custom detections. 
author: poliveria 
ms.service: microsoft-sentinel  
ms.topic: conceptual
ms.date: 10/27/2025
ms.author: pauloliveria  

ms.collection: ms-security

#Customer intent: As a Microsoft Sentinel user, I want to understand the diffence between analytics rules and custom detections features as the latter becomes the unified feature for creating rules across Microsoft Sentinel SIEM and Microsoft Defender XDR.
---
# Feature comparison: Microsoft Sentinel analytics rules and Microsoft Defender custom detections

This article lists and compares the different features supported by Microsoft Sentinel [analytics rules](threat-detection.md) and Microsoft Defender [custom detections](/defender-xdr/custom-detections-overview?toc=/azure/sentinel/TOC.json&bc=/azure/sentinel/breadcrumb/toc.json). It also provides additional information, such as plans to support any analytics rules capabilities that aren't available in custom detections, if applicable. 

>[!IMPORTANT]
> **Custom detections** is now the best way to create new rules across Microsoft Sentinel SIEM Microsoft Defender XDR. With custom detections, you can reduce ingestion costs, get unlimited real-time detections, and benefit from seamless integration with Defender XDR data, functions, and remediation actions with automatic entity mapping. For more information, read [this blog](https://techcommunity.microsoft.com/blog/microsoftthreatprotectionblog/custom-detections-are-now-the-unified-experience-for-creating-detections-in-micr/4463875).

## Compare analytics rules and custom detections features

| **Feature** | **Capability** | **Analytics rules** | **Custom detections** |
|---|---|---|---|
| **Alert enrichment** | Flexible entity mapping over Sentinel data | Supported | Supported |
| | Link multiple MITRE tactics | Supported | Planned |
| | Support full list of MITRE techniques and subtechniques | Supported | Planned |
| | Enrich alerts with custom details | Supported | Supported |
| | Define alert title and description dynamically - Integrate query results in runtime | Supported | Supported |
| | Define all alerts properties dynamically - Integrate query results in runtime | Supported | Planned |
| **Rule frequency** | Support flexible and high frequency for Sentinel data | Supported | Supported |
| | Near-real-time (NRT) rules on Sentinel data | Supported | Planned |
| | NRT streaming technology - Test events as they stream, not sensitive to ingestion delays | Not supported. Analytics NRT rules test events after they're ingested. | Supported |
| | Determine rule's first run | Supported | Not supported |
| **Rule lookback** | Lookback support | Lookback is flexible:<ul><li>Up to 48 hours for frequency higher than one hour<li>Up to 14 days for frequency of one hour and less</ul> | Lookback is statically determined by the frequency: Equals four times the frequency or 30 days for a frequency of 24 hours or less.<br><br>**Parity with analytics rules is planned** |
| **Rule data** | Defender XDR data | Not supported | Supported |
| | Sentinel analytics tier | Supported | Supported |
| **Automated actions** | Native Defender XDR remediation actions | Not supported | Supported |
| | Sentinel automation rules with incident trigger | Supported | Planned |
| | Sentinel automation rules with alert trigger | Supported | Planned |
| **Audit and health visibility** | Rules audit logs available in advanced hunting | Supported (in the `SentinelAudit` table) | Exposed in the `CloudAppEvents` table for Microsoft Defender for Cloud Apps users.<br><br>This capability will be available for all custom detections users in the future. |
| | Rules health logs available in advanced hunting | Supported (in the `SentinelHealth` table) | Planned |
| **Control alerts and events grouping** | Customize alert grouping logic | Supported | Not supported. In the SIEM and XDR solutions, the correlation engine takes care of the alerts' grouping logic and can address the need to configure the grouping logic. |
| | Choose between all events under one alert and one alert per event | Supported | Not supported |
| | Group events to one alert when custom details, alert dynamic details, and entities are identical | Not supported | Supported |
| **Control incidents and alerts creation** | Exclude incidents from correlation engine - Ensure that incidents from different rules remain separated | Planned | Planned |
| | Create alerts without incidents | Supported | Not supported |
| | Alerts suppression - Define alert suppression after the rule runs | Supported | Not supported |
| **Rules management** | Rerun rule on demand on a previous time window | Supported | Planned |
| | Run rule on demand | Not supported | Supported |
| | Health and quality workbooks | Supported | Planned |
| | Integration with Sentinel repositories | Supported | Planned |
| | Manage rules from API | Supported | Supported |
| | Bicep support | Supported | Planned |
| **Content hub** | Create rules from content hub | Supported | Planned |
| **Multi workspace** | Create custom detections on any workspaces onboarded to Defender | Supported | Planned |
| | Cross workspaces detection using the workspace operator | Supported | Planned |
| **Testing and validations** | Rule simulation from the rule's wizard | Supported | Planned |


## Related content
- [Threat detection in Microsoft Sentinel](threat-detection.md)
- [Advanced hunting with Microsoft Sentinel data in Microsoft Defender portal](/defender-xdr/advanced-hunting-microsoft-defender?toc=%2Fazure%2Fsentinel%2FTOC.json&bc=%2Fazure%2Fsentinel%2Fbreadcrumb%2Ftoc.json)
- [Custom detections overview](/defender-xdr/custom-detections-overview)
- [Create custom detection rules](/defender-xdr/custom-detection-rules)