---
title: Container insights region mappings
description: Describes the region mappings supported between Container insights, Log Analytics Workspace, and custom metrics.
ms.topic: conceptual
ms.date: 05/27/2022
ms.custom: references_regions
ms.reviewer: aul
---

# Region mappings supported by Container insights

 When enabling Container insights, only certain regions are supported for linking a Log Analytics workspace and an AKS cluster, and collecting custom metrics submitted to Azure Monitor.

## Log Analytics workspace supported mappings
Supported AKS regions are listed in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service). The Log Analytics workspace must be in the same region except for the regions listed in the following table. Watch [AKS release notes](https://github.com/Azure/AKS/releases) for updates.


|**AKS Cluster region** | **Log Analytics Workspace region** |
|-----------------------|------------------------------------|
|**Africa** | |
|SouthAfricaNorth |WestEurope |
|SouthAfricaWest |WestEurope |
|**Australia** | |
|AustraliaCentral2 |AustraliaCentral |
|**Brazil** | |
|BrazilSouth | SouthCentralUS |
|**Canada** ||
|CanadaEast |CanadaCentral |
|**Europe** | |
|FranceSouth |FranceCentral |
|UKWest |UKSouth |
|**India** | |
|SouthIndia |CentralIndia |
|WestIndia |CentralIndia |
|**Japan** | |
|JapanWest |JapanEast |
|**Korea** | |
|KoreaSouth |KoreaCentral |
|**US** | |
|WestCentralUS<sup>1</sup>|EastUS |



## Custom metrics supported regions

Collecting metrics from Azure Kubernetes Services (AKS) clusters nodes and pods are supported for publishing as custom metrics only in the following [Azure regions](../essentials/metrics-custom-overview.md#supported-regions).

## Next steps

To begin monitoring your AKS cluster, review [How to enable the Container insights](container-insights-onboard.md) to understand the requirements and available methods to enable monitoring.  
