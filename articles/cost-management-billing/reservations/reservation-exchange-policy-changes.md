---
title: Changes to the Azure reservation exchange policy
description: Learn how changes to the Azure reservation exchange policy might affect you.
author: bandersmsft
ms.author: banders
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 05/14/2024
---

# Changes to the Azure reservation exchange policy

Initially planned to end on January 1, 2024, the availability of Azure compute reservation exchanges for Azure Virtual Machine, Azure Dedicated Host and Azure App Service is extended **until further notice**.

The [Azure savings plan for compute](https://azure.microsoft.com/pricing/offers/savings-plan-compute) was launched in October 2022 and it aims at providing savings on consistent spend, across different compute services, regardless of region. With savings plan's automatic flexibility, we updated our reservations exchange policy. While [instance size flexibility for VMs](../../virtual-machines/reserved-vm-instance-size-flexibility.md) remains post-grace period, exchanges of instance series or regions for Azure Virtual Machine, Azure Dedicated Host and Azure App Service reservations will no longer be supported.

You can continue exchanging your compute reservations for different instance series and regions until we notify you again, **which will be at least six months in advance**. In addition, any compute reservations purchased during this extended grace period will retain the right to one more exchange after the grace period ends. The extended grace period allows you to better assess your cost savings commitment needs and plan effectively.

For more information, see [Azure savings plan for compute and how it works with reservations](../savings-plan/decide-between-savings-plan-reservation.md).

>[!NOTE]
> Exchanges are changing only for Azure Virtual Machine, Azure Dedicated Host and Azure App Service reservations. The policy change does not affect any other types of reservations. For example, if you have a reservation for Azure VMware Solution, then the policy change doesn't affect it. Any Azure Virtual Machine, Azure Dedicated Host and Azure App Service reservation acquired after the grace period ends (either through a new reservation purchase or reservation exchange), will have a no-exchange policy.

The reserved instance cancellation policy isn't changing - the total canceled commitment can't exceed 50,000 USD in a 12-month rolling window for a billing profile or single enrollment.

A compute reservation exchange converts existing reservations to new compute reservations. A reservation [trade-in](../savings-plan/reservation-trade-in.md) converts existing reservations to a new savings plan. While exchanges You can always trade in your Azure reserved instances for compute for a savings plan. There's no time limit for trade-ins.

You can [trade-in](../savings-plan/reservation-trade-in.md) your Azure Virtual Machine, Azure Dedicated Host and Azure App Service reservations that are used to cover dynamic/evolving workloads for a savings plan. Or, you can continue to use and purchase reservations for stable workloads where the specific configuration needs are known.

Learn more about [Azure savings plan for compute](../savings-plan/index.yml) and how it works with reservations.

:::image type="content" source="./media/reservation-exchange-policy-changes/exchange-timeline-diagram.png" alt-text="Diagram showing the exchange policy timeline." border="false" lightbox="./media/reservation-exchange-policy-changes/exchange-timeline-diagram.png":::

## Example scenarios

The following examples describe scenarios that might represent your situation with the grace period.

### Scenario 1

You purchase a one-year compute reservation sometime between the month of October 2022 and the end of grace period. Before the end of grace period, you can exchange it as many times as you like. After the grace period, you can exchange the compute reservation one more time through the end of its term. However, if the reservation is exchanged after the grace period, the reservation is no longer exchangeable because exchanges are processed as a cancellation, refund, and a new purchase. You can always trade in the reservation for a savings plan. There's no time limit for trade-ins.

### Scenario 2

You purchase a three-year compute reservation during grace period. Before the end of grace period, you can exchange it as many times as you like. You exchange the compute reservation after the grace period. Because an exchange is processed as a cancellation, refund, and new purchase, the reservation is no longer exchangeable. You can always trade in the reservation for a savings plan. There's no time limit for trade-ins.

### Scenario 3

You purchase a one-year compute reservation after the grace period. It can’t be exchanged. You can always trade in the reservation for a savings plan. There's no time limit for trade-ins.

### Scenario 4

You purchase a three-year compute reservation after the grace period. It can’t be exchanged. You can always trade in the reservation for a savings plan. There's no time limit for trade-ins

### Scenario 5

You purchase a three-year compute reservation of 10 quantities before the grace period. You exchange 2 quantities of the compute reservation after the grace period. You can still exchange eight leftover quantities on the original reservation after the grace period. You can always trade in the reservation for a savings plan. There's no time limit for trade-ins.

## Related content

- Learn more about [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).
- Learn more about [Self-service trade-in for Azure savings plans](../savings-plan/reservation-trade-in.md).
