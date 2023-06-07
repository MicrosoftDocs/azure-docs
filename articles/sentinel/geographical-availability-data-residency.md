---
title: Geographical availability and data residency in Microsoft Sentinel
description: In this article, you learn about geographical availability and data residency in Microsoft Sentinel.
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 11/22/2022
#Customer intent: As a security operator setting up Microsoft Sentinel, I want to understand where data is stored, so I can meet compliance guidelines.
---

# Geographical availability and data residency in Microsoft Sentinel

When you set up Microsoft Sentinel or prepare for compliance checks, you need the ability to validate and prove who has access to what data in your environment. In this article, you learn where Microsoft Sentinel data is stored so you can meet compliance requirements.

## Why geographical availability and data residency is important

After your data is collected, stored, and processed, compliance can become an important design requirement, with a significant impact on your Microsoft Sentinel architecture. Having the ability to validate and prove who has access to what data under all conditions is a critical data sovereignty requirement in many countries and regions, and assessing risks and getting insights in Microsoft Sentinel workflows is a priority for many customers.

Learn more about [compliance considerations](best-practices-workspace-architecture.md#compliance-considerations).

## Where Microsoft Sentinel data is stored

Microsoft Sentinel is a [non-regional service](https://azure.microsoft.com/explore/global-infrastructure/data-residency/#overview). However, Microsoft Sentinel is built on top of Azure Monitor Logs, which is a regional service. Note that:

- Microsoft Sentinel can run on workspaces in these [supported regions](#supported-regions).
- Regions where Log Analytics is newly available may take some time to onboard the Microsoft Sentinel service.
- Microsoft Sentinel stores customer data in the same geography as the Log Analytics workspace associated with Microsoft Sentinel.
- Microsoft Sentinel processes customer data in one of two locations:
    - If the Log Analytics workspace is located in Europe, customer data is processed in Europe.
    - For all other locations, customer data is processed in the US

### Supported regions

Microsoft Sentinel can run on workspaces in the following regions:

|North America  |South America |Asia  |Europe  |Australia  |Africa |
|---------|---------|---------|---------|---------|---------|
|- West US 2<br>- South Central US<br>- East US<br>- East US 2<br>- West US 3<br>- Central US<br>- North Central US<br>- West US<br>- USGov Virginia<br>- USGov Arizona<br>- USSec East<br>- USNat West<br>- Canada Central<br>- West Central US<br>- Canada East<br>- USGov Texas<br>- Central US EUAP<br>- East US 2 EUAP<br>- USSec West<br>- USNat East     |- Brazil South<br>- Brazil Southeast |- Southeast Asia<br>- Japan East<br>- China East 2<br>- East Asia<br>- Central India<br>- Korea Central<br>- UAE North<br>- Jio India West<br>- Jio India Central<br>- China North 3<br>- South India<br>- Korea South<br>- China North 2<br>- West India<br>- UAE Central<br>- Japan West<br>- China East 3<br>- Malaysia South         |- West Europe<br>- North Europe<br>- UK South<br>- Norway East<br>- Switzerland North<br>- France Central<br>- Germany West Central<br>- Norway West<br>- Germany North<br>- UK West<br>- France South<br>- Switzerland West	         |- Australia East<br>- Australia Central 2<br>- Australia Southeast<br>- Australia Central	         |- South Africa North<br>- South Africa West	 |

#### North America

- West US 2
- South Central US
- East US
- East US 2
- West US 3
- Central US
- North Central US
- West US
- USGov Virginia
- USGov Arizona
- USSec East
- USNat West
- Canada Central
- West Central US
- Canada East
- USGov Texas
- Central US EUAP
- East US 2 EUAP
- USSec West
- USNat East