---
title: Charge back Azure Reservation costs
description: Learn how to view Azure Reservation costs for chargeback
author: bandersmsft
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 02/14/2024
ms.author: banders
---

# Charge back Azure Reservation costs

Enterprise Agreement and Microsoft Customer Agreement billing readers can view amortized cost data for reservations. They can use the cost data to charge back the monetary value for a subscription, resource group, resource, or a tag to their partners. In amortized data, the effective price is the prorated hourly reservation cost. The cost is the total cost of reservation usage by the resource on that day.

Users with an individual subscription can get the amortized cost data from their usage file. When a resource gets a reservation discount, the *AdditionalInfo* section in the usage file contains the reservation details. For more information, see [View and download your Azure usage and charges](../understand/download-azure-daily-usage.md).

## See reservation usage data for show back and charge back

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to **Cost Management + Billing**.
3. Select **Cost analysis** from left navigation.
4. Under **Actual Cost**, select the **Amortized Cost** metric.
5. To see which resources were used by a reservation, apply a filter for **Reservation** and then select reservations.
6. Set the **Granularity** to **Monthly** or **Daily**.
7. Set the chart type to **Table**.
8. Set the **Group by** option to **Resource**.

:::image type="content" border="true" source="./media/charge-back-usage/amortized-reservation-costs.png" lightbox="./media/charge-back-usage/amortized-reservation-costs.png" alt-text="Screenshot showing reservation resource costs that you can use for chargeback.":::

Here's a video showing how to view reservation usage costs at subscription, resource group and resource level in the Azure portal.

 > [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4sQOw] 

## Get the data for show back and charge back

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to **Cost Management + Billing**.
3. Select **Export** from left navigation.
4. Select **Add**.
5. Select Amortized cost as the metric button and setup your export.

The EffectivePrice for the usage that gets reservation discount is the prorated cost of the reservation (instead of being zero). This helps you know the monetary value of reservation consumption by a subscription, resource group or a resource, and can help you charge back for the reservation utilization internally. The dataset also has unused reservation hours. 

## Get Azure consumption and reservation usage data using API

You can get the data using the API or download it from Azure portal.

You call the [Usage Details API](/rest/api/consumption/usagedetails/list) to get the new data. For details about terminology, see [usage terms](../understand/understand-usage.md).

Here's an example call to the Usage Details API:

```
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{enrollmentId}/providers/Microsoft.Billing/billingPeriods/{billingPeriodId}/providers/Microsoft.Consumption/usagedetails?metric={metric}&amp;api-version=2019-05-01&amp;$filter={filter}
```

For more information about {enrollmentId} and {billingPeriodId}, see the [Usage Details – List](/rest/api/consumption/usagedetails/list) API article.

Information in the following table about metric and filter can help solve for common reservation problems.

| **Type of API data** | API call action |
| --- | --- |
| **All Charges (usage and purchases)** | Replace {metric} with ActualCost |
| **Usage that got reservation discount** | Replace {metric} with ActualCost<br><br>Replace {filter} with: properties/reservationId%20ne%20 |
| **Usage that didn't get reservation discount** | Replace {metric} with ActualCost<br><br>Replace {filter} with: properties/reservationId%20eq%20 |
| **Amortized charges (usage and purchases)** | Replace {metric} with AmortizedCost |
| **Unused reservation report** | Replace {metric} with AmortizedCost<br><br>Replace {filter} with: properties/ChargeType%20eq%20'UnusedReservation' |
| **Reservation purchases** | Replace {metric} with ActualCost<br><br>Replace {filter} with: properties/ChargeType%20eq%20'Purchase'  |
| **Refunds** | Replace {metric} with ActualCost<br><br>Replace {filter} with: properties/ChargeType%20eq%20'Refund' |

## Download the usage CSV file with new data

If you're an EA admin, you can download the CSV file that contains new usage data from Azure portal.

In the Azure portal, navigate to [Cost management + billing](https://portal.azure.com/#blade/Microsoft_Azure_Billing/ModernBillingMenuBlade/BillingAccounts).

1. Select the billing account.
2. Select **Usage + charges**.
3. Select **Download**.  
:::image type="content" border="true" source="./media/understand-reserved-instance-usage-ea/portal-download-csv.png" alt-text="Screenshot showing where to Download the CSV usage data file in the Azure portal.":::
4. In **Usage Details**, select **Amortized usage data**.

The CSV files that you download contain actual costs and amortized costs.

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps
- To learn more about Azure Reservations usage data, see the following articles:
  - [Enterprise Agreement and Microsoft Customer Agreement reservation costs and usage](understand-reserved-instance-usage-ea.md)
 
