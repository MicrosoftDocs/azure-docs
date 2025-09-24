---
title: Reliability in Microsoft Purview for governance experiences
description: Learn how Microsoft Purview ensures reliability with zone redundancy, disaster recovery, and business continuity for resilient data governance.
author: chvukosw
ms.author: chvukosw
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

- Microsoft Purview governance experience currently provides partial availability-zone support in [a limited number of regions](#supported-regions). This partial availability-zone support covers experiences (and/or certain functionalities within an experience).
- Zone availability might or might not be available for Microsoft Purview governance experiences or features/functionalities that are in preview.

### Supported regions

Microsoft Purview makes commercially reasonable efforts to provide availability zone support in various regions as follows:

| Region | Data Map  | Scan | Policy | Insights |
| ---     | ---      | ---  | ---    | ---     |
|Southeast Asia||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|East US||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|Australia East|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg"::: |:::image type="icon" source="media/icon-checkmark.svg":::|
|West US 2||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|Canada Central|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg"::: |:::image type="icon" source="media/icon-checkmark.svg":::|
|Central India||:::image type="icon" source="media/icon-checkmark.svg":::||:::image type="icon" source="media/icon-checkmark.svg":::|
|East US 2||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|France Central||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|Germany West Central||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|Japan East||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|Korea Central||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|West US 3||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|North Europe||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|South Africa North||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|Sweden Central||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg"::: |
|Switzerland North||:::image type="icon" source="media/icon-checkmark.svg":::|||
|USGov Virginia|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg"::: |:::image type="icon" source="media/icon-checkmark.svg":::|
|South Central US||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|Brazil South||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|UK South|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg"::: |:::image type="icon" source="media/icon-checkmark.svg":::|
|Qatar Central||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|
|China North 3|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg"::: |:::image type="icon" source="media/icon-checkmark.svg":::|
|West Europe||:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|:::image type="icon" source="media/icon-checkmark.svg":::|

## Disaster recovery and business continuity

[!INCLUDE [next step](includes/reliability-disaster-recovery-description-include.md)]

>[!IMPORTANT]
>Today, Microsoft Purview doesn't support automated disaster recovery. Until that support is added, you're responsible to take care of backup and restore activities. You can manually create a secondary Microsoft Purview account as a warm standby instance in another region. Note that this standby instance in another region would not support Microsoft Purview Data Governance Solution. Today, it only supports Azure Purview solution. We are working on adding DR support for Microsoft Purview Data Governance Solution.

To implement disaster recovery for Microsoft Purview, see the [Microsoft Purview disaster recovery documentation.](/purview/disaster-recovery)

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/well-architected/reliability/)
