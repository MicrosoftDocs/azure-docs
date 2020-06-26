---
title: Common cost analysis uses in Azure Cost Management
description: This article explains how you can get results for common cost analysis tasks in Azure Cost Management.
author: bandersmsft
ms.author: banders
ms.date: 05/27/2020
ms.topic: conceptual
ms.service: cost-management-billing
ms.reviewer: adwise
---

# Common cost analysis uses

Azure Cost Management users often want answers to questions that many others ask. This article walks you through getting results for common cost analysis tasks in Cost Management.

## View forecasted costs

Forecasted costs are shown in cost analysis areas for area and stacked column views. The forecast is based on your historical resource use. Changes to your resource use affect forecasted costs.

In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.

In the default view, the top chart has the Actual/Amortized cost and forecasted cost sections. The solid color of the chart shows your Actual/Amortized cost. The shaded color shows the forecast cost.

[![Forecasted cost](./media/cost-analysis-common-uses/enrollment-forecast.png)](./media/cost-analysis-common-uses/enrollment-forecast.png#lightbox)

## View forecasted costs grouped by service

The default view doesn't show forecasted costs group by a service, so you have to add a group by selection.

In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.

Select **Group by** > **Service name**.

The view shows your costs grouped for each service. The forecasted cost isn't calculated for each service. It's projected for the **Total** of all your services.

[![Grouped forecasted cost](./media/cost-analysis-common-uses/forecast-group-by-service.png)](./media/cost-analysis-common-uses/forecast-group-by-service.png#lightbox)

## View forecasted costs for a service

You can view forecasted costs narrowed to a single service. For example, you might want to see forecasted costs for just virtual machines.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Add filter** and then select **Service name**.
1. In the **choose** list, select a service. For example select, **virtual machines**.

Review the actual cost for selection and the forecasted cost.

You can add more customizations to the view.

1. Add a second filter for **Meter** and select a value to filter for an individual type of meter under your selected service name.
1. Group by **Resource** to see the specific resources that are accruing cost. The forecasted cost isn't calculated for each service. It's projected for the **Total** of all your resources.

[![Forecasted cost for a service](./media/cost-analysis-common-uses/forecast-by-service.png)](./media/cost-analysis-common-uses/forecast-by-service.png#lightbox)

## View your Azure and AWS costs together  

To view Azure and AWS costs together, you use management group scopes in Azure.

1. Create a management group or select an existing one.
1. Assign the existing Azure subscriptions that you need to the management group.
1. Assign the *same* management group to the linked account of the connector.
1. Go to cost analysis and select **Accumulated costs**.
1. Select **Group by** - **Provider**.

## View cost breakdown by Azure service

Viewing costs by an Azure service can help you to better understand the parts of your infrastructure that cost the most. For example, VM compute costs might be small. Yet you might accrue significant networking costs because of the amount of information emitting from the VMs. Understanding the primary cost drivers of your Azure services is essential so that you can adjust service usage, as needed.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Cost by service** and then group by **Service tier**.
1. Change the view to **Table**.

[![Cost breakdown by Azure service](./media/cost-analysis-common-uses/breakdown-by-service.png)](./media/cost-analysis-common-uses/breakdown-by-service.png#lightbox)

## Review invoiced charges in Cost analysis

To view your invoice details in the Azure portal, navigate to Cost analysis for the scope associated with the invoice that you're analyzing. Select the **Invoice details** view. Invoice details show you the charges as seen on the invoice.

[![Example showing invoice details](./media/cost-analysis-common-uses/invoice-details.png)](./media/cost-analysis-common-uses/invoice-details.png#lightbox)

Viewing invoice details, you can identify the service that has unexpected costs and determine which resources are directly associated with the resource in Cost analysis. For example, if you want to analyze charges for the Virtual Machines service, navigate to the **Accumulated cost** view. Then, set the granularity to **Daily** and filter charges **Service name: Virtual machines** and group charges by **Resource**.

[![Example showing accumulated costs for virtual machines](./media/cost-analysis-common-uses/virtual-machines.png)](./media/cost-analysis-common-uses/virtual-machines.png#lightbox)

## View cost breakdown by Azure resource

Your services are built with Azure resources. Reviewing costs based on resources can help you quickly identify your primary cost contributors. If a service has resources that are too expensive, consider making changes to reduce your costs.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Cost by resource**.
1. Change the view to **Table**.

[![View cost breakdown by Azure resource](./media/cost-analysis-common-uses/cost-by-resource.png)](./media/cost-analysis-common-uses/cost-by-resource.png#lightbox)

## View cost breakdown by selected dimensions

Dimensions allow you to organize your costs based on various metadata values shown in your charges. For example, you could group your costs by location.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select the **Group by** filter.  
    [![Select a Group by item](./media/cost-analysis-common-uses/group-by.png)](./media/cost-analysis-common-uses/group-by.png#lightbox)
1. Optionally, you save the view for later use.
1. Click a pie chart below the graph to view more detailed data.  
    [![View cost breakdown by selected dimensions](./media/cost-analysis-common-uses/drill-down.png)](./media/cost-analysis-common-uses/drill-down.png#lightbox)

## View costs per day or by month

Looking at daily and monthly costs can help you to better understand if there's a time of the week or year where your costs are higher. If you have more customer traffic in a holiday period, does that lead to a corresponding increase in your Azure costs? Is Friday a more costly day than Monday?

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Set the **Granularity** to **Monthly** or **Daily**.

[![View costs per day](./media/cost-analysis-common-uses/daily-granularity.png)](./media/cost-analysis-common-uses/daily-granularity.png#lightbox)


## View your Spot VM charges

Spot VMs can provide large cost savings for workloads that can handle interruptions. Workloads are run on unused Azure capacity. Since they can be evicted at any time, Spot VMs get a significant discount. Use the following steps to view your Spot VM charges.

1. In the Azure portal, navigate to cost analysis for your scope. For example, **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
2. Add a filter for **Pricing Model: Spot**.

![Example showing Spot VM filter](./media/cost-analysis-common-uses/spot-vm-filter.png)

The Pricing Model dimension is also used to view on demand and reservation charges.

## View your reservation charges

Reserved instances provide a way for you to save money with Azure. With reservations, you spend money up front for a given number of resources over time. Cost analysis shows the charges as they appear on your bill. The charges are shown as actual costs or amortized over the course of your reservation period.

1. In the Azure portal, navigate to cost analysis for your scope. For example, **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Add a filter for **Pricing Model: Reservation**.
1. Under **Scope** and next to the cost shown, click the down arrow symbol, select either **Actual cost** or **Amortized cost** metric.

![Select a cost metric](./media/cost-analysis-common-uses/metric-cost.png)

Each metric affects how data is shown for your reservation charges.

**Actual cost** - Shows the purchase as it appears on your bill. For example, if you bought a one-year reservation for $1200 in January, cost analysis shows a $1200 cost in the month of January for the reservation. It doesn't show a reservation cost for other months of the year. If you group your actual costs by VM, then a VM that received the reservation benefit for a given month would have zero cost for the month.

**Amortized cost** - Shows a reservation purchase split as an amortized cost over the duration of the reservation term. Using the same example above, cost analysis shows a $100 cost for each month throughout the year, if you purchased a one-year reservation for $1200 in January. If you group costs by VM in this example, you'd see cost attributed to each VM that received the reservation benefit.

## View your reservation utilization

After you buy a reservation, it's important to track its utilization so that you get what you paid for. For example, if you bought 10 VMs for a year and only use five of them, then essentially half of the purchase is wasted. There are two different ways to assess your utilization:

### View unused RI costs in cost analysis

To identify how much cost is currently being wasted each month for your reservation purchase, follow the steps below.

1. In the Azure portal, navigate to cost analysis for the scope where your reservation is applied. For example, **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Add a filter for **Pricing Model: Reservation**.
1. Select the **Amortized Cost** view.
1. Set the granularity to **Monthly**.
1. Set the time period to the current year or your reservation term.
1. Set the chart type to **Column (stacked)**.
1. Group charges by **Charge Type**.
1. Review the results for `unusedreservation` values.

[![Example showing reservation use](./media/cost-analysis-common-uses/view-reservation-cost.png)](./media/cost-analysis-common-uses/view-reservation-cost.png#lightbox)

### View utilization in Reservations

For detailed instructions, see [Optimize reservation use](../reservations/manage-reserved-vm-instance.md#optimize-reservation-use).

## View costs for a specific tag

Many Azure users apply tags to their resources such as a cost center or development environment (production and test) to better categorize charges. Tags appear as a dimension in cost analysis. You can use the dimension to gain insights into your custom tagging categorizations.

Support for tags applies to usage reported *after* the tag was applied to the resource. Tags aren't applied retroactively for cost rollups.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Group by** for your tag.

[![View costs for a specific tag](./media/cost-analysis-common-uses/tag.png)](./media/cost-analysis-common-uses/tag.png#lightbox)

## Download your usage details

Your usage details report file, in CSV format, provides a breakdown of all the charges that accrued towards an invoice. You can use the report to compare it to, and better understand, your invoice. Each billed charge on your invoice corresponds to broken-down charges in the usage report.

1. In the Azure portal, navigate to the **Usage and Charges** tab for a billing account or subscription. For example: **Cost Management + Billing** > **Billing** > **Usage + charges**.
1. Select the line item to download from and then click the download symbol.  
    [![Download usage and charges](./media/cost-analysis-common-uses/download1.png)](./media/cost-analysis-common-uses/download1.png#lightbox)
1.  Select the usage file to download.  
    ![Choose a usage file to download](./media/cost-analysis-common-uses/download2.png)

## View monthly EA cost breakdown

Your EA enrollment accrues costs for your entire organization. Understanding how costs accrue and are invoiced over time helps you to engage the appropriate stakeholders to ensure that costs are managed responsibly.

Costs are only shown for your active enrollment. If you transferred an enrollment (inactive) to a new one (active), costs for the previous enrollment aren't shown in Cost Management.


1. In the Azure portal, navigate to **Cost Management + Billing** > **Overview**.
1. Click **Breakdown** for the current month and view your monetary commitment burn down.  
    [![EA costs overview - breakdown summary](./media/cost-analysis-common-uses/breakdown1.png)](./media/cost-analysis-common-uses/breakdown1.png#lightbox)
1.  Click the **Usage and Charges** tab and view the prior month's breakdown in the chosen timespan.  
    [![Usage and charges tab](./media/cost-analysis-common-uses/breakdown2.png)](./media/cost-analysis-common-uses/breakdown2.png#lightbox)

## View enrollment monthly cost by term

Use a graphical view of your enrollment's monthly costs to understand the cost trends and invoiced amounts for a given period.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select your enrollment and set the enrollment term.
1. Set the granularity to monthly and then set the view to **Column     (stacked)**.

You can group by and filter your data for a more detailed analysis.

[![Monthly enrollment cost by term](./media/cost-analysis-common-uses/enrollment-term1.png)](./media/cost-analysis-common-uses/enrollment-term1.png#lightbox)

## View EA enrollment accumulated costs

View the net accumulated charges over time to understand overall expenditures for your organization for a given period.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select your enrollment and then view your current accumulated costs.

[![Enrollment accumulated costs](./media/cost-analysis-common-uses/cost-analysis-enrollment.png)](./media/cost-analysis-common-uses/cost-analysis-enrollment.png#lightbox)

## Next steps
- If you haven't already completed the first quickstart for Cost Management, read it at [Start analyzing costs](quick-acm-cost-analysis.md).
- Read the [Cost Management documentation](../index.yml).
