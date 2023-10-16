---
title: Azure reservation recommendations
description: Learn about Azure reservation recommendations.
author: bandersmsft
ms.author: banders
ms.reviewer: nitinarora
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 08/14/2023
---

# Reservation recommendations

Azure reserved instance (RI) purchase recommendations are provided through Azure Consumption [Reservation Recommendation API](/rest/api/consumption/reservationrecommendations), [Azure Advisor](../../advisor/advisor-reference-cost-recommendations.md), and through the reservation purchase experience in the Azure portal.

The savings that are presented as part of reservation recommendations are the savings that are calculated in addition to your negotiated, or discounted (if applicable) prices.

The following steps define how recommendations are calculated:

1. The recommendation engine evaluates the hourly usage for your resources in the given scope over the past 7, 30, and 60 days.
2. Based on the usage data, the engine simulates your costs with and without reservations.
3. The costs are simulated for different quantities, and the quantity that maximizes the savings is recommended.
4. If your resources are shut down regularly, the simulation can't find any savings, and no purchase recommendation is provided.
5. The recommendation calculations include any special discounts that you might have for your on-demand usage rates.

The recommendations account for existing reservations and savings plans. So, previously purchased reservations and savings plans are excluded when providing recommendations.

## Recommendations in the Azure portal

Reservation purchase recommendations are also shown in the Azure portal in the purchase experience. Recommendations are shown with the **Recommended Quantity**. When purchased, the quantity that Azure recommends gives the maximum savings possible. Although you can buy any quantity that you like, if you buy a different quantity your savings aren't optimal.

Let's look at some examples why.

In the following example image for the selected recommendation, Azure recommends a purchase quantity of 6.

:::image type="content" source="./media/reserved-instance-purchase-recommendations/recommended-quantity.png" alt-text="Example showing a reservation purchase recommendation" lightbox="./media/reserved-instance-purchase-recommendations/recommended-quantity.png" :::

More information about the recommendation appears when you select **See details**. The following image shows details about the recommendation. The quantity recommended is calculated for the highest possible usage and it's based on your historical usage. Your recommendation might not be for 100% utilization if you have inconsistent usage. In the example, notice that utilization fluctuated over time. The cost of the reservation, possible savings, and utilization percentage is shown.

:::image type="content" source="./media/reserved-instance-purchase-recommendations/recommended-quantity-details.png" alt-text="Example showing details for a reservation purchase recommendation " :::

The chart and estimated values change when you increase the recommended quantity. When you increase the reservation quantity, your savings are reduced because you end up with reduced reservation use. In other words, you pay for reservations that aren't fully used.

If you lower the reservation quantity, your savings are also reduced. Although utilization is increased, there might be periods when your reservations don't fully cover your use. Usage beyond your reservation quantity is used by more expensive pay-as-you-go resources. The following example image illustrates the point. We've manually reduced the reservation quantity to 4. The reservation utilization is increased, but the overall savings are reduced because pay-as-you-go costs are present.

:::image type="content" source="./media/reserved-instance-purchase-recommendations/recommended-quantity-details-changed.png" alt-text="Example showing changed reservation purchase recommendation details" :::

To maximize savings with reservations, try to purchase reservations as close to the recommendation as possible.

## Recommendations in Azure Advisor

Reservation purchase recommendations are available in Azure Advisor. Keep in mind the following points:

- Advisor has only single-subscription scope recommendations. If you want to see recommendations for the entire billing scope (Billing account or billing profile), then:
  -  In the Azure portal, navigate to **Reservations** > **Add** and then select the type that you want to see the recommendations for.
- The recommendations quantity and savings are for a three-year reservation, where available. If a three-year reservation isn't sold for the service, the recommendation is calculated using the one-year reservation price.
- The recommendation calculations include any special discounts that you might have on your on-demand usage rates.
- If you purchase a shared-scope reservation, Advisor reservation purchase recommendations can take up to five days to disappear.
- Azure classic compute resources such as classic VMs are explicitly excluded from reservation recommendations. Microsoft recommends that users avoid making long-term commitments to legacy services that are being deprecated.

## Other expected API behavior

- When using a look-back period of seven days, you might not get recommendations when VMs are shut down for more than a day.

## Next steps
- Get [Reservation recommendations using REST APIs](/rest/api/consumption/reservationrecommendations/list).
- Learn about [how the Azure reservation discount is applied to virtual machines](../manage/understand-vm-reservation-charges.md).
