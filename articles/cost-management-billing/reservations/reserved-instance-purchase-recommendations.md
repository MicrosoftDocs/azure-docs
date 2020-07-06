---
title: How Azure reservation recommendations are created
description: Learn how Azure reservation recommendations are created for virtual machines.
author: banders
ms.author: banders
ms.reviewer: yashar
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 01/28/2020
---

# How reservation recommendations are created

Azure reserved instance (RI) purchase recommendations are provided through Azure Consumption [Reservation Recommendation API](/rest/api/consumption/reservationrecommendations), [Azure Advisor](../../advisor/advisor-cost-recommendations.md#buy-reserved-virtual-machine-instances-to-save-money-over-pay-as-you-go-costs), and through the reservation purchase experience in the Azure portal.

The following steps define how recommendations are calculated:

1. The recommendation engine evaluates the hourly usage for your resources in the given scope over the past 7, 30, and 60 days.
2. Based on the usage data, the engine simulates your costs with and without reservations.
3. The costs are simulated for different quantities, and the quantity that maximizes the savings is recommended.
4. If your resources are shut down regularly, the simulation won't find any savings, and no purchase recommendation is provided.

## Recommendations in Azure Advisor

Reservation purchase recommendations for virtual machines are available in Azure Advisor. Keep in mind the following points:

- Advisor has only single-subscription scope recommendations.
- Recommendations that are calculated with a 30-day look-back period are available in Advisor.
- If you purchase a shared-scope reservation, Advisor reservation purchase recommendations can take up to 30 days to disappear.

## Other expected API behavior

- When using a look-back period of seven days, you might not get recommendations when VMs are shut down for more than a day.

## Next steps

- Learn about [how the Azure reservation discount is applied to virtual machines](../manage/understand-vm-reservation-charges.md).
