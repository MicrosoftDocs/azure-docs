---
title: Common cost analysis uses in Azure Cost Management
description: This article explains how you can get results for common cost analysis tasks in Azure Cost Management.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 12/04/2019
ms.topic: conceptual
ms.service: cost-management-billing
manager: adwise
ms.custom:
---

# Common cost analysis uses

Azure Cost Management users often want answers to questions that many others ask. This article walks you through getting results for common cost analysis tasks in Cost Management.

## View cost breakdown by Azure service

Viewing costs by an Azure service can help you to better understand the parts of your infrastructure that cost the most. For example, VM compute costs might be small. Yet you might accrue significant networking costs because of the amount of information emitting from the VMs. Understanding the primary cost drivers of your Azure services is essential so that you can adjust service usage, as needed.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Cost by service** and then group by **Service tier**.
1. Change the view to **Table**.

![Cost breakdown by Azure service](./media/cost-analysis-common-uses/breakdown-by-service.png)

## View cost breakdown by Azure resource

Your services are built with Azure resources. Reviewing costs based on resources can help you quickly identify your primary cost contributors. If a service has resources that are too expensive, consider making changes to reduce your costs.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Cost by resource**.
1. Change the view to **Table**.

![View cost breakdown by Azure resource](./media/cost-analysis-common-uses/cost-by-resource.png)

## View cost breakdown by selected dimensions

Dimensions allow you to organize your costs based on various metadata values shown in your charges. For example, you could group your costs by location.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select the **Group by** filter.  
    ![Select a Group by item](./media/cost-analysis-common-uses/group-by.png)
1. Optionally, you save the view for later use.
1. Click a pie chart below the graph to view more detailed data.  
    ![View cost breakdown by selected dimensions](./media/cost-analysis-common-uses/drill-down.png)

## View costs per day or by month

Looking at daily and monthly costs can help you to better understand if there’s a time of the week or year where your costs are higher. If you have more customer traffic in a holiday period, does that lead to a corresponding increase in your Azure costs? Is Friday a more costly day than Monday?

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Set the **Granularity** to **Monthly** or **Daily**.

![View costs per day](./media/cost-analysis-common-uses/daily-granularity.png)

## View costs for a specific tag

Many Azure users apply tags to their resources such as a cost center or development environment (production and test) to better categorize charges. Tags appear as a dimension in cost analysis. You can use the dimension to gain insights into your custom tagging categorizations.

Support for tags applies to usage reported *after* the tag was applied to the resource. Tags aren't applied retroactively for cost rollups.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select **Group by** for your tag.

![View costs for a specific tag](./media/cost-analysis-common-uses/tag.png)

## Download your usage details

Your usage details report file, in CSV format, provides a breakdown of all the charges that accrued towards an invoice. You can use the report to compare it to, and better understand, your invoice. Each billed charge on your invoice corresponds to broken-down charges in the usage report.

1. In the Azure portal, navigate to the **Usage and Charges** tab for a billing account or subscription. For example: **Cost Management + Billing** > **Billing** > **Usage + charges**.
1. Select the line item to download from and then click the download symbol.  
    ![Download usage and charges](./media/cost-analysis-common-uses/download1.png)
1.  Select the usage file to download.  
    ![Choose a usage file to download](./media/cost-analysis-common-uses/download2.png)

## View monthly EA cost breakdown

Your EA enrollment accrues costs for your entire organization. Understanding how costs accrue and are invoiced over time helps you to engage the appropriate stakeholders to ensure that costs are managed responsibly.

1. In the Azure portal, navigate to **Cost Management + Billing** > **Overview**.
1. Click **Breakdown** for the current month and view your monetary commitment burn down.  
    ![EA costs overview - breakdown summary](./media/cost-analysis-common-uses/breakdown1.png)
1.  Click the **Usage and Charges** tab and view the prior month’s breakdown in the chosen timespan.  
    ![Usage and charges tab](./media/cost-analysis-common-uses/breakdown2.png)

## View enrollment monthly cost by term

Use a graphical view of your enrollment’s monthly costs to understand the cost trends and invoiced amounts for a given period.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select your enrollment and set the enrollment term.
1. Set the granularity to monthly and then set the view to **Column     (stacked)**.

You can group by and filter your data for a more detailed analysis.

![Monthly enrollment cost by term](./media/cost-analysis-common-uses/enrollment-term1.png)

## View EA enrollment accumulated costs

View the net accumulated charges over time to understand overall expenditures for your organization for a given period.

1. In the Azure portal, navigate to cost analysis for your scope. For example: **Cost Management + Billing** > **Cost Management** > **Cost analysis**.
1. Select your enrollment and then view your current accumulated costs.

![Enrollment accumulated costs](./media/cost-analysis-common-uses/cost-analysis-enrollment.png)

## Next steps
- If you haven't already completed the first quickstart for Cost Management, read it at [Start analyzing costs](quick-acm-cost-analysis.md).
- Read the [Cost Management documentation](../index.yml).
