---
title: Changes to the Azure reservation exchange policy
description: Learn how changes to the Azure reservation exchange policy might affect you.
ms.author: primittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: concept-article
ms.date: 08/27/2026
author: onwokolo
---

# Changes to the Azure reservation exchange policy

Starting February 1, 2027, reservations purchased after this date aren't eligible for exchange if the corresponding service is supported by savings plans. This restriction applies to Azure Virtual Machines, Azure App Service, Azure SQL Database, and similar services. Reservations purchased before February 1, 2027, keep the right to one final exchange.

Any compute or database products that become eligible for savings plans after February 1, 2027, are also subject to the preceding change. This change means that the corresponding previously purchased reservations are exchangeable one final time. This change excludes the following reservations:

- Reservations for products or services that are deprecated and approaching end of life.
- Reservations for products and services that aren't covered by savings plans, such as Azure VMware Solution. If you have a reservation for Azure VMware Solution, this policy change doesn't affect it.
- Cloud environments that don't currently support savings plans.

If you need flexibility across services and regions, consider [savings plans](../savings-plan/index.yml) as a commitment-based option for dynamic workloads. Savings plans are based on a dollar-per-hour spend commitment and automatically apply discounts across eligible compute or database services and regions, making them a good option for evolving or dynamic workloads.

Alternatively, reservations remain the appropriate option for predictable, stable workloads, and you can continue to purchase them. [Instance size flexibility](instance-size-flexibility.md) for virtual machines isn't affected by the change in exchange policy.

The reservation [cancellation policy](exchange-and-refund-azure-reservations.md) isn't changing. The total canceled commitment can't exceed $50,000 USD in a 12-month rolling window for a billing profile or single enrollment.

You can [trade in](../savings-plan/reservation-trade-in.md) existing reservations that cover dynamic or evolving workloads for a savings plan. There's no change to the trade-in policy. To compare your options, see [decide between a savings plan and a reservation](../savings-plan/decide-between-savings-plan-reservation.md).

Learn more about [Azure savings plan for compute](../savings-plan/index.yml) and how it works with reservations.

## Example scenarios

The following examples describe scenarios that might represent your situation with this change. Use these scenarios to understand how the final exchange rule applies based on when the reservation was purchased and whether it was exchanged before or after February 1, 2027.

### Scenario 1

You purchase a one-year or three-year compute or database reservation **before** February 1, 2027. You can exchange it as many times as you like before February 1, 2027. If you exchange the reservation after February 1, 2027, the new reservation isn't exchangeable because exchanges are processed as a cancellation, refund, and new purchase (which are governed by the February 1, 2027, terms). You can always trade in the reservation for a savings plan at any time.

### Scenario 2

You purchase a one-year or three-year compute or database reservation **after** February 1, 2027. You can't exchange this reservation. However, you can always trade in the reservation for a savings plan.

### Scenario 3

You purchase a one-year or three-year compute or database reservation with 10 quantities **before** February 1, 2027. After February 1, 2027, you exchange 2 quantities of the compute reservation. You can still exchange each of the remaining 8 quantities on the original reservation one more time. You can always trade in the reservation for a savings plan.

### Scenario 4

You purchase a one-year or three-year compute or database reservation **before** February 1, 2027, and enable automatic renewal (or manually renew it). The renewal occurs after February 1, 2027. Because a renewal is processed as a cancellation of the original reservation and a new reservation purchase, the new reservation is governed by the February 1, 2027 terms and isn't exchangeable. You can always trade in the reservation for a savings plan.

## Related content

- Learn more about [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).
- Learn more about [Self-service trade-in for Azure savings plans](../savings-plan/reservation-trade-in.md).
