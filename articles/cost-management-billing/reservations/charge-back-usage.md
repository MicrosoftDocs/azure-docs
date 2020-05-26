---
title: Charge back Azure Reservation costs
description: Learn how to view Azure Reservation costs for chargeback.
author: yashesvi
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 05/14/2020
ms.author: banders
---

# Charge back Azure Reservation costs

Enterprise Agreement and Microsoft Customer Agreement billing readers can view amortized cost data for reservations. They can use the cost data to charge back the monetary value for a subscription, resource group, resource, or a tag to their partners. In amortized data, the effective price is the prorated hourly reservation cost. The cost is the total cost of reservation usage by the resource on that day.

Users with an individual subscription can get the amortized cost data from their usage file. When a resource gets a reservation discount, the *AdditionalInfo* section in the usage file contains the reservation details. For more information, see [Download usage from the Azure portal](https://docs.microsoft.com/azure/cost-management-billing/understand/download-azure-daily-usage#download-usage-from-the-azure-portal-csv).

## Get reservation charge back data for chargeback

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Cost Management + Billing**.
1. Under **Actual Cost**, select the **Amortized Cost** metric.
1. To see which resources were used by a reservation, apply a filter for **Reservation** and then select reservations.
1. Set the **Granularity** to **Monthly** or **Daily**.
1. Set the chart type to **Table**.
1. Set the **Group by** option to **Resource**.

[![Example showing reservation resource costs that you can use for chargeback](./media/charge-back-usage/amortized-reservation-costs.png)](./media/charge-back-usage/amortized-reservation-costs.png#lightbox)

Here's a video showing how to view reservation utilization costs in the Azure portal.

 > [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4sQOw] 

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- To learn how to manage a reservation, see [Manage Azure Reservations](manage-reserved-vm-instance.md).
- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Reservations in Azure](manage-reserved-vm-instance.md)
