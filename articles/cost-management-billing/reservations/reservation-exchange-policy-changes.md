---
title: Changes to the Azure reservation exchange policy
description: Learn how changes to the Azure reservation exchange policy might affect you.
author: bandersmsft
ms.author: banders
ms.reviewer: nitinarora
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 02/14/2023
---

# Changes to the Azure reservation exchange policy

Exchanges will be unavailable for all compute reservations - Azure Reserved Virtual Machine Instances, Azure Dedicated Host reservations, and Azure App Services reservations - purchased on or after **January 1, 2024**. Compute reservations purchased **prior to January 1, 2024** will reserve the right to **exchange one more time** after the policy change goes into effect.

Microsoft launched Azure savings plan for compute and it's designed to help you save broadly on predictable compute usage. The savings plan provides more flexibility needed to accommodate changes such as virtual machine series and regions. With savings plans providing the flexibility automatically, we’re adjusting our reservations exchange policy.

You can continue to exchange VM sizes (with instance size flexibility). However, Microsoft is ending exchanges for regions and instance series for these Azure compute reservations.

The current cancellation policy for reserved instances isn't changing. The total canceled commitment can't exceed 50,000 USD in a 12-month rolling window for a billing profile or single enrollment.

You may [trade in](../savings-plan/reservation-trade-in.md) your Azure reserved instances for compute for a savings plan. You can continue to use and purchase reservations for those predictable, stable workloads where you know the specific configuration and need or want more savings.

Learn more about [Azure savings plan for compute](../savings-plan/index.yml) and how it works with reservations.

:::image type="content" source="./media/reservation-exchange-policy-changes/exchange-timeline-diagram.png" alt-text="Diagram showing the exchange policy timeline." border="false" lightbox="./media/reservation-exchange-policy-changes/exchange-timeline-diagram.png":::

## Example scenarios

The following examples describe scenarios that might represent your situation.

### Scenario 1

You purchase a one-year compute reservation between October 2022 and January 2024. The compute reservation can be exchanged one more time through the end of its term, even after January 2024. Before January 2024, you can exchange it under current policy. However, when the reservation is exchanged after January 2024, the reservation is no longer exchangeable because exchanges are processed as a cancellation and new purchase. You can still trade in the reservation for a savings plan.

### Scenario 2

You purchase a three-year compute reservation before January 2024. You exchange the compute reservation after January 2024. Because an exchange is processed as a cancellation and new purchase, the reservation is no longer exchangeable. However, you can still trade in the reservation for a savings plan.

### Scenario 3

You purchase a one-year compute reservation after January 2024. It can’t be exchanged. However, you can trade in the reservation for a savings plan.

### Scenario 4

You purchase a three-year compute reservation after January 2024. It can’t be exchanged. However, you can trade in the reservation for a savings plan.

## Next steps

- Learn more about [Self-service exchanges and refunds for Azure Reservations](exchange-and-refund-azure-reservations.md).
- Learn more about [Self-service trade-in for Azure savings plans](../savings-plan/reservation-trade-in.md).