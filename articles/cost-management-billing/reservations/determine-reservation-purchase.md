---
title: Determine what Azure reservation you should purchase
description: This article helps you determine which reservation you should purchase.
author: bandersmsft
ms.reviewer: yashar
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: banders
---

# Determine what reservation to purchase

All reservations, except Azure Databricks, are applied on an hourly basis. You should purchase reservations based on consistent base usage. There are multiple ways to determine what to purchase and this article helps you determine which reservation you should purchase.

Purchasing more capacity than your historical usage results in an underutilized reservation. You should avoid underutilization whenever possible. Unused reserved capacity doesn't carry over from one hour to next. Usage exceeding the reserved quantity is charged using more expensive pay-as-you-go rates.

## Analyze usage data

Use the following sections to help analyze your daily usage data to determine your baseline usage and what reservation to purchase.

### Analyze usage for a VM reserved instance purchase

Identify the right VM size for your purchase. For example, a reservation purchased for ES series VMs don't apply to E series VMs, and vice-versa.

Promo series VMs don't get a reservation discount, so remove them from your analysis.

To narrow down to eligible VM usage, apply the following filters on your usage data:

- Filter **MeterCategory** to **Virtual Machines**.
- Get **ServiceType** information from **AdditionalInfo**. The information suggests the right VM size. For example, Standard E32.
- Use the **ResourceLocation** field to determine the usage data center.

Ignore resources that have less than 24 hours of usage in a day.

If you want to analyze at the instance size family level, you can get the instance size flexibility values from [https://isfratio.blob.core.windows.net/isfratio/ISFRatio.csv](https://isfratio.blob.core.windows.net/isfratio/ISFRatio.csv). Combine the values with your data to do the analysis. For more information about instance size flexibility, see [Virtual machine size flexibility with Reserved VM Instances](../../virtual-machines/windows/reserved-vm-instance-size-flexibility.md).

### Analyze usage for an Azure Synapse Analytics reserved instance purchase

Reserved capacity applies to Azure Synapse Analytics DWU pricing. It doesn't apply to Azure Synapse Analytics license cost or any costs other than compute.

To narrow eligible usage, apply follow filters on your usage data:


- Filter **MeterCategory** for **SQL Database**.
- Filter **MeterName** for **vCore**.
- Filter **MeterSubCategory** for all usage records that have _Compute_ in the name.

From **AdditionalInfo** , get the **vCores** value. It tells you how many vCores were used. The quantity is **vCores** multiplied by the number of hours the database was used.

The data informs you about the consistent usage for:

- Combination of database type. For example, managed instance or elastic pool per single database.
- Service tier. For example, general purpose or business critical.
- Generation. For example, Gen 5.
- Resource Location

### Analysis for Azure Synapse Analytics

Reserved capacity applies to Azure Synapse Analytics DWU usage and is purchased in increments on 100 DWU. To narrow eligible  usage, apply the follow filters on your usage data:

- Filter **MeterName** for **100 DWUs**.
- Filter **Meter Sub-Category** for **Compute Optimized Gen2**.

Use the **Resource Location** field to determine the usage for Azure Synapse Analytics in a region.

Azure Synapse Analytics usage can scale up and down throughout the day. Talk to the team that managed the Azure Synapse Analytics instance to learn about the base usage.

Go to Reservations in the Azure portal and purchase Azure Synapse Analytics reserved capacity in multiples of 100 DWUs.

## Reservation purchase recommendations

Reservation purchase recommendations are calculated by analyzing your hourly usage data over last 7, 30, and 60 days. Azure calculates what your costs would have been if you had a reservation and compares it with your actual pay-as-you-go costs incurred over the time duration. The calculation is performed for every quantity that you used during the time frame. The quantity that maximizes your savings is recommended.

For example, you might use 500 VMs most of the time, but sometimes usage spikes to 700 VMs. In this example, Azure calculates your savings for both the 500 and 700 VM quantities. Since the 700 VM usage is sporadic, the recommendation calculation determines that savings are maximized for a 500 VM reservation purchase and the recommendation is provided for the 500 quantity.

Note the following points:

- Reservation recommendations are calculated using the on-demand usage rates that apply to you.
- Recommendations are calculated for individual sizes, not for the instance size family.
- The recommended quantity for a scope is reduced on the same day that you purchase reservations for the scope.
    - However, an update for the reservation quantity recommendation across scopes can take up to 25 days. For example, if you purchase based on shared scope recommendations, the single subscription scope recommendations can take up to 25 days to adjust down.

## Recommendations in the Azure portal

Reservation purchases calculated by the recommendations engine are shown on the **Recommended** tab in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Reservations/CreateBlade/referrer/docs). Here's an example image.

![Image showing recommendations](./media/determine-reservation-purchase/select-product-ri.png)

## Recommendations in the Cost Management Power BI app

Enterprise Agreement and Microsoft Customer Agreement customers can use the VM RI Coverage reports for VMs and purchase recommendations. The coverage reports show you total usage and the usage that's covered by reserved instances.

1. Get the [Cost Management App](https://appsource.microsoft.com/product/power-bi/costmanagement.azurecostmanagementapp).
2. Go to the VM RI Coverage report – Shared or Single scope, depending on which scope you want to purchase at.
3. Select the region, instance size family to see the usage, RI coverage, and the purchase recommendation for the selected filter.

## Recommendations in Azure Advisor

Reservation purchase recommendations are available in [Azure Advisor](https://portal.azure.com/#blade/Microsoft_Azure_Expert/AdvisorMenuBlade/overview).

- Advisor has only single-subscription scope recommendations.
- Advisor recommendations are calculated using 30-day look-back period. The projected savings are for a 3-year reservation term.
- If you purchase a shared-scope reservation, Advisor reservation purchase recommendations can take up to 30 days to disappear.

## Recommendations using APIs

Use the [Reservation Recommendations](/rest/api/consumption/reservationrecommendations/list) REST API to view recommendations programmatically.

## Next steps

- [Manage Azure Reservations](manage-reserved-vm-instance.md)
- [Understand reservation usage for your subscription with pay-as-you-go rates](understand-reserved-instance-usage.md)
- [Understand reservation usage for your Enterprise enrollment](understand-reserved-instance-usage-ea.md)
- [Windows software costs not included with reservations](reserved-instance-windows-software-costs.md)