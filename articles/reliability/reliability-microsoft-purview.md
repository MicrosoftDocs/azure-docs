---
title: Reliability in Microsoft Purview
description: Find out about reliability in Microsoft Purview
author: whhender
ms.author: whhender
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.prod: non-product-specific
ms.service: purview
ms.date: 01/08/2024
---

# Reliability in Microsoft Purview

This article describes reliability support in Microsoft Purview, and covers  both regional resiliency with [availability zones](#availability-zone-support) and  and [disaster recovery and business continuity](#disaster-recovery-and-business-continuity). For a more detailed overview of a reliability principles in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

## Reliability recommendations

[!INCLUDE [Reliability recommendations](includes/reliability-recommendations-include.md)]

## Availability zone support

[!INCLUDE [next step](includes/reliability-availability-zone-description-include.md)]

### Prerequisites

- Microsoft Purview governance experience currently provides partial availablility-zone support in [a limited number of regions](#supported-regions). This partial availability-zone support covers experiences (and/or certain functionalities within an experience).
- Zone availability may or may not be available for Microsoft Purview governance experiences or features/functionalities that are in preview.

### Supported regions

Microsoft Purview makes commercially reasonable efforts to provide availability zone support in various regions as follows:

| Region | Data Map | Scan | Policy | Insights |
| ---    | ---      | ---  | ---    | ---      |
|Norway East|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|East US 2 EUAP||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Central US||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|West Central US|||||
|Southeast Asia||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|East US||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Australia East|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|West US 2||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Canada Central|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|Central India||:::image type="icon" source="media/yes-icon.svg":::|||
|East US 2||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|France Central||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Germany West Central||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Japan East||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Korea Central||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|West US 3||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|North Europe||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|South Africa North||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Sweden Central|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|Switzerland North||:::image type="icon" source="media/yes-icon.svg":::|||
|UAE North|||||
|USGov Virginia|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|South Central US||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Brazil South||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|UK South|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|Canada East|||||
|Qatar Central||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|China North 3|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|West Europe||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)