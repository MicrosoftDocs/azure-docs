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

When you set up Microsoft Sentinel or prepare for compliance checks, you need the ability to validate and prove who has access to what data in your environment. In this article, you learn where Microsoft Sentinel data is stored so you can meet compliance requirements.

## Why geographical availability and data residency is important

After your data is collected, stored, and processed, compliance can become an important design requirement, with a significant impact on your Microsoft Sentinel architecture. Having the ability to validate and prove who has access to what data under all conditions is a critical data sovereignty requirement in many countries and regions, and assessing risks and getting insights in Microsoft Sentinel workflows is a priority for many customers.

Learn more about [compliance considerations](/azure/azure-monitor/logs/workspace-design#azure-regions?toc=/azure/sentinel/TOC.json&bc=/azure/sentinel/breadcrumb/toc.json).

## Where Microsoft Sentinel data is stored

Microsoft Sentinel is a [non-regional service](https://azure.microsoft.com/explore/global-infrastructure/data-residency/#overview). However, Microsoft Sentinel is built on top of Azure Monitor Logs, which is a regional service. Note that:

- Microsoft Sentinel can run on workspaces in these [supported regions](#supported-regions).
- Regions where Log Analytics is newly available may take some time to onboard the Microsoft Sentinel service.
- Microsoft Sentinel stores customer data in the same geography as the Log Analytics workspace associated with Microsoft Sentinel.
- Microsoft Sentinel processes customer data in one of two locations:
    - If the Log Analytics workspace is located in Europe, customer data is processed in Europe.
    - For all other locations, customer data is processed in the US
- While Microsoft Sentinel is accessible in both the [Microsoft Defender and Azure portals](microsoft-sentinel-defender-portal.md), Microsoft Sentinel data is stored in Azure regions.

### Supported regions

Microsoft Sentinel can run on workspaces in the following regions:

|Continent | Country | Region |
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
