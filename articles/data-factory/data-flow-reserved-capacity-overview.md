---
title: Save compute costs with reserved capacity
description: Learn how to buy Azure Data Factory data flow reserved capacity to save on your compute costs.
ms.topic: conceptual
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.date: 07/17/2023
---
# Save costs for resources with reserved capacity - Azure Data Factory data flows

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Save money with Azure Data Factory data flow costs by committing to a reservation for compute resources compared to pay-as-you-go prices. With reserved capacity, you make a commitment for ADF data flow usage for a period of one or three years to get a significant discount on the compute costs. To purchase reserved capacity, you need to specify the Azure region, compute type, core count quantity, and term.

You do not need to assign the reservation to a specific factory or integration runtime. Existing factories or newly deployed factories automatically get the benefit. By purchasing a reservation, you commit to usage for the data flow compute costs for a period of one or three years. As soon as you buy a reservation, the compute charges that match the reservation attributes are no longer charged at the pay-as-you go rates. 

You can buy [reserved capacity](https://portal.azure.com) by choosing reservations [up front or with monthly payments](../cost-management-billing/reservations/prepare-buy-reservation.md). To buy reserved capacity:

- You must be in the owner role for at least one Enterprise or individual subscription with pay-as-you-go rates.
- For Enterprise subscriptions, **Add Reserved Instances** must be enabled in the [EA portal](https://ea.azure.com). Or, if that setting is disabled, you must be an EA Admin on the subscription. Reserved capacity.

For more information about how enterprise customers and Pay-As-You-Go customers are charged for reservation purchases, see [Understand Azure reservation usage for your Enterprise enrollment](../cost-management-billing/reservations/understand-reserved-instance-usage-ea.md) and [Understand Azure reservation usage for your Pay-As-You-Go subscription](../cost-management-billing/reservations/understand-reserved-instance-usage.md).

> [!NOTE]
> Purchasing reserved capacity does not pre-allocate or reserve specific infrastructure resources (virtual machines or clusters) for your use.

## Determine proper Azure IR sizes needed before purchase

The size of reservation should be based on the total amount of compute used by the existing or soon-to-be-deployed data flows using the same compute tier.

For example, let's suppose that you are executing a pipeline hourly using memory optimized with 32 cores. Further, let's supposed that you plan to deploy within the next month an additional pipeline that uses general purpose 64 cores. Also, let's suppose that you know that you will need these resources for at least 1 year. In this case, enter the number of cores needed for each compute type for 1 hour. In the Azure Portal, search for Reservations. Choose Data Factory > Data Flows, then enter 32 for memory optimized and 64 for general purpose.

## Buy reserved capacity

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **All services** > **Reservations**.
3. Select **Add** and then in the **Purchase Reservations** pane, select **ADF Data Flows** to purchase a new reservation for ADF data flows.
4. Fill in the required fields and attributes you select qualify to get the reserved capacity discount. The actual number of data flows that get the discount depends on the scope and quantity selected.
5. Review the cost of the capacity reservation in the **Costs** section.
6. Select **Purchase**.
7. Select **View this Reservation** to see the status of your purchase.

## Cancel, exchange, or refund reservations

You can cancel, exchange, or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Need help? Contact us

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

To learn more about Azure Reservations, see the following articles:

- [Understand Azure Reservations discount](data-flow-understand-reservation-charges.md)
