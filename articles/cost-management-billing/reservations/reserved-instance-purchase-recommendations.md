---
title: How Azure reservation recommendations are created
description: Learn how Azure reservation recommendations are created for virtual machines.
author: banders
ms.reviewer: yashar
ms.service: cost-management-billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/28/2020
ms.author: banders
---

# How reservation recommendations are created
Azure reserved instance (RI) purchase recommendations are provided through Azure Consumption [Reservation Recommendation API](/rest/api/consumption/reservationrecommendations), [Azure Advisor](../..//advisor/advisor-cost-recommendations.md#buy-reserved-virtual-machine-instances-to-save-money-over-pay-as-you-go-costs) and through reservation purchase experience whithin Azure portal.
Following steps define how recommendations are calculated: 
- Recommendation engine evaluates hourly usage for your resources in the given scope over past 7, 30, and 60 days.
- Based on the usage data, it simulates your costs with and without reservations.
- These cost are simulated for different quantities, and the quantity that maximizes the savings is recommended.
- If your resources are shut down regularly then the simulation will not find any savings and no purchase recommendation will be provided.

## Recommendations in Azure Advisor
Reservation purchase recommendations for virtual machines are available in Azure Advisor. Please note following: 
- Advisor only has single subscription scope recommendations.
- Recommendations calculated with 30 day look back period are available in Advisor.
- If you purchase a shared scope reservation, then Advisor reservation purchase recommendation might take up to 30 days to disappear.

## Other expected API behavior
- When using a look back period of seven days, you might not get recommendations when VMs are shut down for more than a day.

## Next steps
- Learn about [how the Azure reservation discount is applied to virtual machines](../manage/understand-vm-reservation-charges.md).
