---
title: Get started with Cost Management + Billing reporting - Azure
description: This article helps you to get started with Cost Management + Billing to understand, report on, and analyze your invoiced Microsoft Cloud and AWS costs.
author: bandersmsft
ms.author: banders
ms.date: 10/18/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: micflan
---

# Get started with Cost Management + Billing reporting

Cost Management + Billing includes several tools to help you understand, report on, and analyze your invoiced Microsoft Cloud and AWS costs. The following sections describe the major reporting components.

## Cost analysis

Cost analysis should be your first stop in the Azure portal when it comes to understanding what you're spending and where you're spending. Cost analysis helps you:

- Visualize and analyze your organizational costs
- Share cost views with others using custom alerts
- View aggregated costs by organization to understand where costs occur over time and identify spending trends
- View accumulated costs over time to estimate monthly, quarterly, or even yearly cost trends against a budget
- Create budgets to provide adherence to financial constraints
- Use budgets to view daily or monthly costs and help isolate spending irregularities

Cost analysis is available from every resource group, subscription, management group, and billing account in the Azure portal. If you manage one of these scopes, you can start there and select **Cost analysis** from the menu. If you manage multiple scopes, you may want to start directly within Cost Management:

Sign in to the Azure portal > select **Home** in the menu > scroll down under **Tools** and select **Cost Management** > select a scope at the top of the page > in the left menu, select **Cost analysis**.

:::image type="content" source="./media/reporting-get-started/cost-analysis.png" alt-text="Screenshot showing the Cost analysis page." lightbox="./media/reporting-get-started/cost-analysis.png" :::

For more information about cost analysis, see [Explore and analyze costs with cost analysis](quick-acm-cost-analysis.md).

## Power BI

While cost analysis offers a rich, interactive experience for analyzing and surfacing insights about your costs, there are times when you need to build more extensive dashboards and complex reports or combine costs with internal data. The Cost Management template app for Power BI is a great way to get up and running with Power BI quickly. For more information about the template app, see [Analyze Azure costs with the Power BI App](analyze-cost-data-azure-cost-management-power-bi-template-app.md).

:::image type="content" source="./media/reporting-get-started/azure-hybrid-benefits-report-full.png" alt-text="Screenshot showing the Power BI template app." lightbox="./media/reporting-get-started/azure-hybrid-benefits-report-full.png" :::

Need to go beyond the basics with Power BI? The Cost Management connector for Power BI lets you choose the data you need to help you seamlessly integrate costs with your own datasets or easily build out more complete dashboards and reports to meet your organization's needs. For more information about the connector, see [Connect to Cost Management data in Power BI Desktop](/power-bi/connect-data/desktop-connect-azure-cost-management).

## Cost details and exports

If you're looking for raw data to automate business processes or integrate with other systems, start by exporting data to a storage account. Scheduled exports allow you to automatically publish your raw cost data to a storage account on a daily, weekly, or monthly basis. With special handling for large datasets, scheduled exports are the most scalable option for building first-class cost data integration. For more information, see [Create and manage exported data](tutorial-export-acm-data.md).

:::image type="content" source="./media/reporting-get-started/exports.png" alt-text="Screenshot showing the list of exports." lightbox="./media/reporting-get-started/exports.png" :::

If you need more fine-grained control over your data requests, the Cost Details API offers a bit more flexibility to pull raw data the way you need it. For more information, see [Cost Details API](../automate/usage-details-best-practices.md#cost-details-api).

## Invoices and credits

Cost analysis is a great tool for reviewing estimated, unbilled charges or for tracking historical cost trends, but it may not show your total billed amount because credits, taxes, and other refunds and charges not available in Cost Management. To estimate your projected bill at the end of the month, start in cost analysis to understand your forecasted costs, then review any available credit or prepaid commitment balance from **Credits** or **Payment methods** for your billing account or billing profile within the Azure portal. To review your final billed charges after the invoice is available, see **Invoices** for your billing account or billing profile.

Here's an example that shows credits on the Credits tab on the Credits + Commitments page.

:::image type="content" source="./media/reporting-get-started/credits.png" alt-text="Screenshot showing the Credits page." lightbox="./media/reporting-get-started/credits.png" :::

For more information about your invoice, see [View and download your Microsoft Azure invoice](../understand/download-azure-invoice.md)

For more information about credits, see [Track Microsoft Customer Agreement Azure credit balance](../manage/mca-check-azure-credits-balance.md).

## Microsoft Azure mobile app

With the Azure app, you can keep track of the status of your Azure resources, such as virtual machines (VMs) and web apps, from your mobile device. The app also sends alerts about your environment.

You can also use the Azure app to track the status of subscription or resource group cost. You can see your current cost, last month’s cost, forecasted cost, and view your budget usage.

The app is available for [iOS](https://itunes.apple.com/us/app/microsoft-azure/id1219013620?ls=1&mt=8) and [Android](https://play.google.com/store/apps/details?id=com.microsoft.azure).

:::image type="content" source="./media/reporting-get-started/azure-app-screenshot.png" alt-text="Example screenshot showing the iOS version of the Azure app with Cost Management subscription information." lightbox="./media//reporting-get-started/azure-app-screenshot.png" :::

## Next steps

- [Explore and analyze costs with cost analysis](quick-acm-cost-analysis.md).
- [Analyze Azure costs with the Power BI App](analyze-cost-data-azure-cost-management-power-bi-template-app.md).
- [Connect to Microsoft Cost Management data in Power BI Desktop](/power-bi/connect-data/desktop-connect-azure-cost-management).
- [Create and manage exported data](tutorial-export-acm-data.md).