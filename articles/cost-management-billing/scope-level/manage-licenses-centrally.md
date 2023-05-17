---
title: How Azure applies centrally assigned SQL licenses to hourly usage
description: This article provides a detailed explanation about how Azure applies centrally assigned SQL licenses to hourly usage with Azure Hybrid Benefit.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 04/20/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: ahb
ms.reviewer: chrisrin
---

# How Azure applies centrally assigned SQL licenses to hourly usage

This article provides details about how centrally managing Azure Hybrid Benefit for SQL Server works. The process starts with an administrator assigning licenses to subscription or a billing account scope.

Each resource reports its usage once an hour using the appropriate full price or pay-as-you-go meters. Internally in Azure, the Usage Application engine evaluates the available normalized cores (NCs) and applies them for that hour. For a given hour of vCore resource consumption, the pay-as-you-go meters are switched to the corresponding Azure Hybrid Benefit meter with a zero ($0) price if there's enough unutilized NCs in the selected scope.

## License discount 

The following diagram shows the discounting process when there's enough unutilized NCs to discount the entire vCore consumption by all the SQL resources for the hour.

Prices shown in the following image are only examples.

:::image type="content" source="./media/manage-licenses-centrally/fully-discounted-consumption.svg" alt-text="Diagram showing fully discounted vCore consumption." border="false" lightbox="./media/manage-licenses-centrally/fully-discounted-consumption.svg":::


When the vCore consumption by the SQL resources in the scope exceeds the number of unutilized NCs, the excess vCore consumption is billed using the appropriate pay-as-you-go meter. The following diagram shows the discounting process when the vCore consumption exceeds the number of unutilized NCs.

Prices shown in the following image are only examples.

:::image type="content" source="./media/manage-licenses-centrally/partially-discounted-consumption.svg" alt-text="Diagram showing partially discounted consumption." border="false" lightbox="./media/manage-licenses-centrally/partially-discounted-consumption.svg":::

The Azure SQL resources covered by the assigned Core licenses can vary from hour to hour. The variance depends on what resources run and in what order the automated system processes their usage. However, the system ensures the maximum usage of the assigned SQL licenses in the selected scope. You can monitor the usage using Cost Management. For more information, see [How to track assigned license usage](create-sql-license-assignments.md#track-assigned-license-use).

The following diagram shows how the assigned SQL Server licenses apply over time to get the maximum Azure Hybrid Benefit discount.

:::image type="content" source="./media/manage-licenses-centrally/ncl-utilization-over-time.png" alt-text="Diagram showing NC use over time." border="false" lightbox="./media/manage-licenses-centrally/ncl-utilization-over-time.png":::

## Next steps

- Review the [Centrally managed Azure Hybrid Benefit FAQ](faq-azure-hybrid-benefit-scope.yml).
- Learn about how to [transition from existing Azure Hybrid Benefit experience](transition-existing.md).