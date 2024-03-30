---
title: View Azure Reservation purchase and refund transactions
description: Learn how view Azure Reservation purchase and refund transactions.
author: bandersmsft
ms.reviwer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 08/21/2023
ms.author: banders
---

# View reservation purchase and refund transactions

There are a few different ways to view reservation purchase and refund transactions. You can use the Azure portal, Power BI, and REST APIs. You can view an exchanged reservation as refund and purchase in the transactions.

## View reservation purchases in the Azure portal

Enterprise Agreement and Microsoft Customer Agreement billing readers can view accumulated purchases for reservations in Cost Analysis.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Cost Management + Billing**.
1. Select Cost analysis in the left menu.
1. Apply a filter for **Pricing Model** and then select **reservation**.
1. To view purchases for reservations, apply a filter for **Charge Type** and then select **purchase**.
1. Set the **Granularity** to **Monthly**.
1. Set the chart type to **Column (Stacked)**.

:::image type="content" source="./media/view-purchase-refunds/reservation-purchase-cost-analysis.png" alt-text="Screenshot showing reservation purchases in cost analysis." lightbox="./media/view-purchase-refunds/reservation-purchase-cost-analysis.png" :::

## View reservation transactions in the Azure portal

A Microsoft Customer Agreement billing administrator can view reservation transactions in Cost Management and Billing. For EA enrollments, EA Admins, Indirect Admins, and Partner Admins can view reservation transactions in Cost Management and Billing.

To view the corresponding refunds for reservation transactions, select a **Timespan** that includes the purchase refund dates. You might have to select **Custom** under the **Timespan** list option.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing** and select it.
1. Select a billing scope.
1. Select **Reservation transactions**.  
  The Reservation transactions left menu item only appears if you have a billing scope selected.
1. To filter the results, select **Timespan**, **Type**, or **Description**.
1. Select **Apply**.

:::image type="content" border="true" source="./media/view-purchase-refunds/azure-portal-reservation-transactions.png" lightbox="./media/view-purchase-refunds/azure-portal-reservation-transactions.png" alt-text="Screenshot showing reservation transactions in the Azure portal.":::

## View reservation transactions in Power BI

An Enterprise enrollment administrator can view reservation transactions with the Cost Management Power BI app.

1. Get the [Cost Management Power BI App](https://appsource.microsoft.com/product/power-bi/costmanagement.azurecostmanagementapp).
1. Navigate to the RI Purchases report.

:::image type="content" border="true" source="./media/view-purchase-refunds/power-bi-reservation-transactions.png" lightbox="./media/view-purchase-refunds/power-bi-reservation-transactions.png" alt-text="Screenshot showing reservation transactions.":::

To learn more, see [Cost Management Power BI App for Enterprise Agreements](../costs/analyze-cost-data-azure-cost-management-power-bi-template-app.md).

## Use APIs to get reservation transactions

Enterprise Agreement (EA) and Microsoft Customer Agreement users can get reservation transactions data using [Reservation Transactions - List API](/rest/api/consumption/reservationtransactions/list).

## Need help? Contact us.

If you have questions or need help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- To learn how to manage a reservation, see [Manage Azure Reservations](manage-reserved-vm-instance.md).
- To learn more about Azure Reservations, see the following articles:
  - [What are Azure Reservations?](save-compute-costs-reservations.md)
  - [Manage Reservations in Azure](manage-reserved-vm-instance.md)
