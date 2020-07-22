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

The AKS cluster resources or Log Analytics workspace can reside in other regions, and the following table shows our mappings.

|**AKS Cluster region** | **Log Analytics Workspace region** |
|-----------------------|------------------------------------|
|**Africa** | |
|SouthAfricaNorth |WestEurope |
|SouthAfricaWest |WestEurope |
|**Australia** | |
|AustraliaEast |AustraliaEast |
|AustraliaCentral |AustraliaCentral |
|AustraliaCentral2 |AustraliaCentral |
|AustraliaEast |AustraliaEast |
|**Asia Pacific** | |
|EastAsia |EastAsia |
|SoutheastAsia |SoutheastAsia |
|**Brazil** | |
|BrazilSouth | SouthCentralUS |
|**Canada** ||
|CanadaCentral |CanadaCentral |
|CanadaEast |CanadaCentral |
|**Europe** | |
|FranceCentral |FranceCentral |
|FranceSouth |FranceCentral |
|NorthEurope |NorthEurope |
|UKSouth |UKSouth |
|UKWest |UKSouth |
|WestEurope |WestEurope |
|**India** | |
|CentralIndia |CentralIndia |
|SouthIndia |CentralIndia |
|WestIndia |CentralIndia |
|**Japan** | |
|JapanEast |JapanEast |
|JapanWest |JapanEast |
|**Korea** | |
|KoreaCentral |KoreaCentral |
|KoreaSouth |KoreaCentral |
|**US** | |
|CentralUS |CentralUS|
|EastUS |EastUS |
|EastUS2 |EastUS2 |
|WestUS |WestUS |
|WestUS2 |WestUS2 |
|WestCentralUS<sup>1</sup>|EastUS<sup>1</sup>|
|US Gov Virginia |US Gov Virginia |

<sup>1</sup> Due to capacity restraints, the region isn't available when creating new resources. This includes a Log Analytics workspace. However, preexisting linked resources in the region should continue to work.

## Custom metrics supported regions

Collecting metrics from Azure Kubernetes Services (AKS) clusters nodes and pods are supported for publishing as custom metrics only in the following [Azure regions](../platform/metrics-custom-overview.md#supported-regions).

## Next steps

To begin monitoring your AKS cluster, review [How to enable the Azure Monitor for containers](container-insights-onboard.md) to understand the requirements and available methods to enable monitoring.  
