---
title: Reliability in Microsoft Purview for governance experiences
description: Find out about reliability in Microsoft Purview for governance experiences
author: whhender
ms.author: whhender
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: purview
ms.date: 01/24/2024
---

# Reliability in Microsoft Purview

This article describes reliability support in Microsoft Purview for governance experiences, and covers both regional resiliency with [availability zones](#availability-zone-support) and [disaster recovery and business continuity](#disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/well-architected/reliability/).

## Availability zone support

[!INCLUDE [next step](includes/reliability-availability-zone-description-include.md)]

Microsoft Purview makes commercially reasonable efforts to support zone-redundant availability zones, where resources automatically replicate across zones, without any need for you to set up or configure.

### Prerequisites

- Microsoft Purview governance experience currently provides partial availablility-zone support in [a limited number of regions](#supported-regions). This partial availability-zone support covers experiences (and/or certain functionalities within an experience).
- Zone availability might or might not be available for Microsoft Purview governance experiences or features/functionalities that are in preview.

### Supported regions

Microsoft Purview makes commercially reasonable efforts to provide availability zone support in various regions as follows:

| Region | Data Map | Scan | Policy | Insights |
| ---    | ---      | ---  | ---    | ---      |
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
|USGov Virginia|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|South Central US||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|Brazil South||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|UK South|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|Qatar Central||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|
|China North 3|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg"::: |:::image type="icon" source="media/yes-icon.svg":::|
|West Europe||:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|:::image type="icon" source="media/yes-icon.svg":::|

## Disaster recovery and business continuity

[!INCLUDE [next step](includes/reliability-disaster-recovery-description-include.md)]

>[!IMPORTANT]
>Today, Microsoft Purview doesn't support automated disaster recovery. Until that support is added, you're responsible to take care of backup and restore activities. You can manually create a secondary Microsoft Purview account as a warm standby instance in another region.

To implement disaster recovery for Microsoft Purview, see the [Microsoft Purview disaster recovery documentation.](/purview/disaster-recovery)

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/well-architected/reliability/)
