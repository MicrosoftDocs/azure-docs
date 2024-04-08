---
title: Common cost analysis uses in Cost Management
titleSuffix: Microsoft Cost Management
description: This article explains how you can get results for common cost analysis tasks in Cost Management.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Common cost analysis uses

Cost Management users often want answers to questions that many others ask. This article walks you through getting results for common cost analysis tasks in Cost Management.

## View forecast costs

Forecast costs are shown in cost analysis areas for area and stacked column views. The forecast is based on your historical resource use. Changes to your resource use affect forecast costs.

In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.

In the default view, the top chart has the Actual/Amortized cost and forecast cost sections. The solid color of the chart shows your Actual/Amortized cost. The shaded color shows the forecast cost.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/enrollment-forecast.png" lightbox="./media/cost-analysis-common-uses/enrollment-forecast.png" alt-text="Screenshot showing Forecast cost in cost analysis.":::

## View forecast costs grouped by service

The default view doesn't show forecast costs group by a service, so you have to add a group by selection.

In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.

Select **Group by** > **Service name**.

The view shows your costs grouped for each service. The forecast cost isn't calculated for each service. It's projected for the **Total** of all your services.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/forecast-group-by-service.png" lightbox="./media/cost-analysis-common-uses/forecast-group-by-service.png" alt-text="Screenshot showing Grouped and forecast cost.":::

## View forecast costs for a service

You can view forecast costs narrowed to a single service. For example, you might want to see forecast costs for just virtual machines.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Add filter** and then select **Service name**.
1. In the **choose** list, select a service. For example select, **virtual machines**.

Review the actual cost for selection and the forecast cost.

You can add more customizations to the view.

1. Add a second filter for **Meter** and select a value to filter for an individual type of meter under your selected service name.
1. Group by **Resource** to see the specific resources that are accruing cost. The forecast cost isn't calculated for each service. It's projected for the **Total** of all your resources.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/forecast-by-service.png" lightbox="./media/cost-analysis-common-uses/forecast-by-service.png" alt-text="Screenshot showing Forecast and resource cost.":::

## View your Azure and AWS costs together

> [!NOTE]
> The Connector for AWS in the Cost Management service retires on March 31, 2025. Users should consider alternative solutions for AWS cost management reporting. On March 31, 2024, Azure will disable the ability to add new Connectors for AWS for all customers. For more information, see [Retire your Amazon Web Services (AWS) connector](retire-aws-connector.md).

To view Azure and AWS costs together, you use management group scopes in Azure.

1. Create a management group or select an existing one.
1. Assign the existing Azure subscriptions that you need to the management group.
1. Assign the *same* management group to the linked account of the connector.
1. Go to cost analysis and select **Accumulated costs**.
1. Select **Group by** - **Provider**.

## View New Commerce license and consumption costs

You can view your New Commerce license and consumption products along with your Azure charges in Cost analysis. Select the filter list, then select **Provider**, and then choose from the list of options. For example, Microsoft 365 and Dynamics 365.

:::image type="content" source="./media/cost-analysis-common-uses/filter-select-provider.png" alt-text="Screenshot showing Provider filter selection." lightbox="./media/cost-analysis-common-uses/filter-select-provider.png" :::

You can narrow to specific seat-based or consumption charges by using the **Charge type** filter and selecting values of **Purchase** or **Usage**.

:::image type="content" source="./media/cost-analysis-common-uses/filter-charge-type.png" alt-text="Screenshot showing Charge type filter selection." lightbox="./media/cost-analysis-common-uses/filter-charge-type.png" :::

Currently, purchasing New Commerce products is only available for Partners.

## View cost breakdown by Azure service

Viewing costs by an Azure service can help you to better understand the parts of your infrastructure that cost the most. For example, VM compute costs might be small. Yet you might accrue significant networking costs because of the amount of information emitting from the VMs. Understanding the primary cost drivers of your Azure services is essential so that you can adjust service usage, as needed.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Cost by service** and then group by **Service tier**.
1. Change the view to **Table**.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/breakdown-by-service.png" lightbox="./media/cost-analysis-common-uses/breakdown-by-service.png" alt-text="Screenshot showing cost breakdown by Azure service in a table.":::

## Review invoiced charges in Cost analysis

To view your invoice details in the Azure portal, navigate to Cost analysis for the scope associated with the invoice that you're analyzing. Select the **Invoice details** view. Invoice details show you the charges as seen on the invoice.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/invoice-details.png" lightbox="./media/cost-analysis-common-uses/invoice-details.png" alt-text="Screenshot showing invoice detail cost.":::

Viewing invoice details, you can identify the service that has unexpected costs and determine which resources are directly associated with the resource in Cost analysis. For example, if you want to analyze charges for the Virtual Machines service, navigate to the **Accumulated cost** view. Then, set the granularity to **Daily** and filter charges **Service name: Virtual machines** and group charges by **Resource**.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/virtual-machines.png" lightbox="./media/cost-analysis-common-uses/virtual-machines.png" alt-text="Screenshot showing accumulated costs for virtual machines by resource.":::

## View cost breakdown by Azure resource

Your services are built with Azure resources. Reviewing costs based on resources can help you quickly identify your primary cost contributors. If a service has resources that are too expensive, consider making changes to reduce your costs.

The view is only available for subscription and resource group scopes.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Cost by resource**.
1. Change the view to **Table**.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/cost-by-resource.png" lightbox="./media/cost-analysis-common-uses/cost-by-resource.png" alt-text="Screenshot showing a cost breakdown by Azure resource in a table view.":::

## View cost breakdown by selected dimensions

Dimensions allow you to organize your costs based on various metadata values shown in your charges. For example, you could group your costs by location.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select the **Group by** filter.  
    :::image type="content" border="true" source="./media/cost-analysis-common-uses/group-by.png" lightbox="./media/cost-analysis-common-uses/group-by.png" alt-text="Screenshot that shows selecting a Group by item.":::
1. Optionally, you save the view for later use.
1. Select a pie chart below the graph to view more detailed data.  
    :::image type="content" border="true" source="./media/cost-analysis-common-uses/drill-down.png" lightbox="./media/cost-analysis-common-uses/drill-down.png" alt-text="Screenshot showing cost breakdown by selected dimensions in cost analysis.":::

## View costs per day or by month

Looking at daily and monthly costs can help you to better understand if there's a time of the week or year where your costs are higher. If you have more customer traffic in a holiday period, does that lead to a corresponding increase in your Azure costs? Is Friday a more costly day than Monday?

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Set the **Granularity** to **Monthly** or **Daily**.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/daily-granularity.png" lightbox="./media/cost-analysis-common-uses/daily-granularity.png" alt-text="Screenshot showing view costs per day.":::


## View your Spot VM charges

Spot VMs can provide large cost savings for workloads that can handle interruptions. Workloads are run on unused Azure capacity. Since they can be evicted at any time, Spot VMs get a significant discount. Use the following steps to view your Spot VM charges.

1. In the Azure portal, navigate to cost analysis for your scope. For example, **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
2. Add a filter for **Pricing Model: Spot**.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/spot-vm-filter.png" alt-text="Screenshot showing the Spot VM filter.":::

The Pricing Model dimension is also used to view on demand and reservation charges.

## View your reservation charges

Reserved instances provide a way for you to save money with Azure. With reservations, you spend money up front for a given number of resources over time. Cost analysis shows the charges as they appear on your bill. The charges are shown as actual costs or amortized over the course of your reservation period.

> [!NOTE]
> Although you can buy a reservation with a pay-as-you-go (MS-AZR-0003P) subscription, Cost Analysis doesn't support viewing amortized reservation costs. If you try to view costs with the **Amortized cost** metric, you'll see the same results as **Actual Cost**.

1. In the Azure portal, navigate to cost analysis for your scope. For example, **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Add a filter for **Pricing Model: Reservation**.
1. Under **Scope** and next to the cost shown, select the down arrow symbol, select either **Actual cost** or **Amortized cost** metric.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/metric-cost.png" alt-text="Screenshot that shows selecting a cost metric.":::

Each metric affects how data is shown for your reservation charges.

**Actual cost** - Shows the purchase as it appears on your bill. For example, if you bought a one-year reservation for $1200 in January, cost analysis shows a $1200 cost in the month of January for the reservation. It doesn't show a reservation cost for other months of the year. If you group your actual costs by VM, then a VM that received the reservation benefit for a given month would have zero cost for the month.

**Amortized cost** - Shows a reservation purchase split as an amortized cost over the duration of the reservation term. Using the same example above, cost analysis shows a varying cost for each month throughout the year, because of the varying number of days in a month. If you group costs by VM in this example, you'd see cost attributed to each VM that received the reservation benefit.

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

:::image type="content" border="true" source="./media/cost-analysis-common-uses/view-reservation-cost.png" lightbox="./media/cost-analysis-common-uses/view-reservation-cost.png" alt-text="Screenshot showing underused reservations.":::

### View utilization in Reservations

For detailed instructions, see [Optimize reservation use](../reservations/manage-reserved-vm-instance.md#optimize-reservation-use).

## View costs for a specific tag

Many Azure users apply tags to their resources such as a cost center or development environment (production and test) to better categorize charges. Tags appear as a dimension in cost analysis. You can use the dimension to gain insights into your custom tagging categorizations.

Support for tags applies to usage reported *after* the tag was applied to the resource. Tags aren't applied retroactively for cost rollups.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Group by** for your tag.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/tag.png" lightbox="./media/cost-analysis-common-uses/tag.png" alt-text="Screenshot that shows viewing costs for a specific tag.":::

## Download your usage details

Your usage details report file, in CSV format, provides a breakdown of all the charges that accrued towards an invoice. You can use the report to compare it to, and better understand, your invoice. Each billed charge on your invoice corresponds to broken-down charges in the usage report.

1. In the Azure portal, navigate to the **Usage and Charges** tab for a billing account or subscription. For example: **Cost Management + Billing** > **Billing** > **Usage + charges**.
1. Select the line item to download from and then select the download symbol.  
    :::image type="content" border="true" source="./media/cost-analysis-common-uses/download1.png" lightbox="./media/cost-analysis-common-uses/download1.png" alt-text="Screenshot showing the Usage + charges page were start a download.":::
1.  Select the usage file to download.  
    :::image type="content" border="true" source="./media/cost-analysis-common-uses/download2.png" alt-text="Screenshot showing the Download Usage + charges page to select a file to download.":::

## View monthly EA cost breakdown

Your EA enrollment accrues costs for your entire organization. Understanding how costs accrue and are invoiced over time helps you to engage the appropriate stakeholders to ensure that costs are managed responsibly.

Costs are only shown for your active enrollment. If you transferred an enrollment (inactive) to a new one (active), costs for the previous enrollment aren't shown in Cost Management.


1. In the Azure portal, navigate to **Cost Management + Billing** > **Overview**.
1. Select **Breakdown** for the current month and view your Azure Prepayment (previously called monetary commitment) burn down.  
    :::image type="content" border="true" source="./media/cost-analysis-common-uses/breakdown1.png" lightbox="./media/cost-analysis-common-uses/breakdown1.png" alt-text="Screenshot showing an EA costs overview - breakdown summary.":::
1.  Select the **Usage and Charges** tab and view the prior month's breakdown in the chosen timespan.  
    :::image type="content" border="true" source="./media/cost-analysis-common-uses/breakdown2.png" lightbox="./media/cost-analysis-common-uses/breakdown2.png" alt-text="Screenshot showing the Usage + charges page where you choose a time span to view.":::

## View enrollment monthly cost by term

Use a graphical view of your enrollment's monthly costs to understand the cost trends and invoiced amounts for a given period.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select your enrollment and set the enrollment term.
1. Set the granularity to monthly and then set the view to **Column     (stacked)**.

You can group by and filter your data for a more detailed analysis.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/enrollment-term1.png" lightbox="./media/cost-analysis-common-uses/enrollment-term1.png" alt-text="Screenshot showing monthly enrollment cost by term.":::

## View EA enrollment accumulated costs

View the net accumulated charges over time to understand overall expenditures for your organization for a given period.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select your enrollment and then view your current accumulated costs.

:::image type="content" border="true" source="./media/cost-analysis-common-uses/cost-analysis-enrollment.png" lightbox="./media/cost-analysis-common-uses/cost-analysis-enrollment.png" alt-text="Screenshot showing accumulated costs for an enrollment.":::

## Next steps
- If you haven't already completed the first quickstart for Cost Management, read it at [Start analyzing costs](quick-acm-cost-analysis.md).
- Read the [Cost Management documentation](../index.yml).
