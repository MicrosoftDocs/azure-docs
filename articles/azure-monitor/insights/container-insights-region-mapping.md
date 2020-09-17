---
title: Azure Monitor for containers region mappings
description: This article describes the region mappings supported between Azure Monitor for containers, Log Analytics Workspace, and custom metrics.
ms.topic: conceptual
ms.date: 06/26/2019
ms.custom: references_regions
---

# Region mappings supported by Azure Monitor for containers

 When enabling Azure Monitor for containers, only certain regions are supported for linking a Log Analytics workspace and an AKS cluster, and collecting custom metrics submitted to Azure Monitor.

## Log Analytics workspace supported mappings

Supported AKS regions are listed in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service). The Log Analytics workspace must be in the same region except for the regions listed in the following table.


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
|WestCentralUS<sup>1</sup>|EastUS<sup>1</sup>|


<sup>1</sup> Due to capacity restraints, the region isn't available when creating new resources. This includes a Log Analytics workspace. However, preexisting linked resources in the region should continue to work.

## Custom metrics supported regions

Collecting metrics from Azure Kubernetes Services (AKS) clusters nodes and pods are supported for publishing as custom metrics only in the following [Azure regions](../platform/metrics-custom-overview.md#supported-regions).

## Next steps

To begin monitoring your AKS cluster, review [How to enable the Azure Monitor for containers](container-insights-onboard.md) to understand the requirements and available methods to enable monitoring.  
