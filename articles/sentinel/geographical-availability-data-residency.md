---
title: Geographical availability and data residency in Microsoft Sentinel
description: In this article, you learn about geographical availability and data residency in Microsoft Sentinel.
author: batamig
ms.author: bagol
ms.topic: conceptual
ms.date: 08/29/2024
ms.custom: references_regions


#Customer intent: As a compliance officer or a security operator setting up Microsoft Sentinel, I want to understand the geographical availability and data residency of Microsoft Sentinel so that I can ensure our data meets regional compliance requirements.

---

# Geographical availability and data residency in Microsoft Sentinel

After your data is collected, stored, and processed, compliance can become an important design requirement, with a significant impact on your Microsoft Sentinel architecture. Having the ability to validate and prove who has access to what data under all conditions is a critical data sovereignty requirement in many countries and regions, and assessing risks and getting insights in Microsoft Sentinel workflows is a priority for many customers.

This article can help you meet compliance requirements by describing where Microsoft Sentinel data is stored.

## Collected data

Microsoft Sentinel collects the following types of data:

- **Raw data**, such as event data collected from connected Microsoft services and partner systems. Data from multiple clouds and sources are streamed to the customer’s Azure Log Analytics workspace associated with Microsoft Sentinel, under the customer’s tenant’s subscription. This approach gives the customer the ability to choose region and retention and deletion policies.
- **Processed data**, such as incidents, alerts, and so on.
- **Configuration data**, such as connector settings, rules, and so on.

## Data storage location

Data used by the service, including customer data, might be stored and processed in the following locations:

|Data type  |Location  |
|---------|---------|
|**Raw data**     |  Stored in the same region as the Azure Log Analytics workspace associated with Microsoft Sentinel. For more information, see [Supported regions](#supported-regions).  <br><br>Raw data is processed in one of the following locations: <br>- For Log Analytics workspaces located in Europe, customer data is processed in Europe. <br>- For Log Analytics workspaces located in Israel, customer data is processed in Israel. <br>- For Log Analytics workspaces located in any of the China 21Vianet regions, customer data is processed in China 21Vianet. <br>- For workspaces located in any other location, customer data is processed in a US region.     |
|**Processed data and configuration data**     |   - For workspaces onboarded to Microsoft's unified security operation's platform, processed data and configuration data might be stored and processed in Microsoft Defender XDR regions. For more information, see [Data security and retention in Microsoft Defender XDR](/defender-xdr/data-privacy).   <br><br>- For workspaces not onboarded to Microsoft's unified security operations platform, processed data and configuration data is stored and processed using the same methodology as raw data.    |
 
### Supported regions

Regions supported for Microsoft Sentinel raw data, and for processed and configuration data in workspaces not onboarded to Microsoft's unified security operations platform, include:

|Continent | Country/Region | Azure Region |
|---------|---------|---------|
| **North America**| **Canada** | • Canada Central<br>• Canada East |
| |   **United States** | • Central US<br>• East US<br>• East US 2<br>• East US 2 EUAP<br>• North Central US<br>• South Central US<br>• West US<br>• West US 2<br>• West US 3<br>• West Central US<br><br>**Azure government** <br>• USGov Arizona<br>• USGov Virginia<br>• USNat East<br>• USNat West<br>• USSec East<br>• USSec West|
|**South America** | **Brazil** | • Brazil South<br>• Brazil Southeast |
|**Asia and Middle East** | |• East Asia<br>• Southeast Asia |
| | **China 21Vianet**| • China East 2<br>• China North 3|
| | **India**| • Central India<br>• Jio India West<br>• Jio India Central|
| | **Israel** | • Israel Central |
| | **Japan** | • Japan East<br>• Japan West|
| | **Korea**| • Korea Central<br>• Korea South| 
| | **Quatar** | • Qatar Central|
| | **UAE**| • UAE Central<br>• UAE North        |
|**Europe**| | • North Europe<br>• West Europe|
| |**France**| • France Central<br>• France South|
| |**Germany**| • Germany West Central|
| | **Italy** |• Italy North|
| | **Norway**|• Norway East<br>• Norway West|
| |**Sweden**| • Sweden Central | 
| | **Switzerland**| • Switzerland North<br>• Switzerland West| 
| | **UK**| • UK South<br>• UK West |
|**Australia** | **Australia**| • Australia Central<br>Australia Central 2<br>• Australia East<br>• Australia Southeast	|
|**Africa** | **South Africa**| • South Africa North |

## Data retention

Data from Microsoft Sentinel is retained until the earliest of the following dates:

- The customer [removes Microsoft Sentinel from their workspace](offboard.md)
- As per a retention policy set by the customer

Until that time, customers can always delete their data.

Customer data is kept and is available while the license is under a grace period or in suspended mode. At the end of this period, and no later than 90 days from contract termination or expiration, the data is erased from Microsoft's systems to make it unrecoverable.

## Data sharing for Microsoft Sentinel

Microsoft Sentinel may share data, including customer data, among the following Microsoft products:

- Microsoft Defender XDR / Microsoft's unified security operations platform
- Azure Log Analytics
## Related content

For more information, see details about [Azure regions](/azure/azure-monitor/logs/workspace-design#azure-regions?toc=/azure/sentinel/TOC.json&bc=/azure/sentinel/breadcrumb/toc.json) when designing your workspace architecture.
