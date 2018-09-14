---
title: Optimize your cloud investment with Azure Cost Management | Microsoft Docs
description: This article helps get the most value out of your cloud investments, reduce your costs, and evaluate where your money is being spent.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 09/10/2018
ms.topic: conceptual
ms.service: cost-management
manager: dougeby
ms.custom:
---

# How to optimize your cloud investment with Azure Cost Management

Azure Cost Management gives you the tools to plan for, analyze and reduce your spending to maximize your cloud investment. This document provides you with a methodical approach to cost management and highlights the tools available to you as you address your organization’s cost challenges. Azure makes it easy to build and deploy cloud solutions, but it is important that those solutions are optimized to minimize the cost to your organization. Following the principles outlined in this document and utilizing our tools will ensure your organization is set up for success.

## Methodology

Cost management is an organizational problem and should be an ongoing practice which begins before your first cloud purchase. To successfully implement cost management and optimization process, your organization must be primed with the proper tools for success, be accountable for those costs, and take corresponding action to optimize spending. Three key groups, outlined below, must be aligned within your organization to ensure successful cost management.

- **Finance** - Stakeholders responsible for approving budgetary needs across the organization based on cloud spending forecasts who then pay the corresponding bill and attribute costs to various teams to drive accountability.
- **Managers** - Business decision makers within an organization that need to understand cloud spending to ensure the best return on investment.
- **App teams** - Engineers managing cloud resources on a day-to-day basis, developing services to meet the organization's needs. These teams need the flexibility to deliver the most value within their defined budgets.

### Key principles

Use the principles outlined below to position your organization for success in cloud cost management.

#### Planning

Comprehensive, up-front planning allows you to tailor cloud usage to your specific business requirements. Ask yourself what business problem you are solving and what usage patterns you expect from your resources. This will help you to select the right offer for you, what infrastructure is utilized and how it is utilized to maximize your efficiency on the platform.

#### Visibility

When structured with well, Cost Management helps you to provide people with the information about the Azure costs they are responsible for or that they have incurred. Azure has services designed to give you insight into where your money is being spent. Take advantage of these tools so that you can identify underutilized resources, cut out waste and maximize your cost-saving opportunities on the platform.

#### Accountability

Attribute your costs across your organization to ensure that those responsible are held accountable for their team's spending. To fully understand your organization's presence on the platform you should group your resources in such a way to maximize your insight into cost attribution within your organization. This will allow you to better manage and reduce costs and hold individuals accountable for maximizing return on investment within your organization.

#### Optimization

Act to optimize and reduce your spending based on the findings gathered through planning and increasing cost visibility. Actions could include purchase and licensing optimizations along with infrastructure deployment changes and are discussed in detail later in this document.

#### Iteration

Each stakeholder in your organization must engage in the cost management lifecycle on an ongoing basis to best optimize costs. Be rigorous about this iterative process and make it a key tenant of responsible cloud governance for your organization.

![Key principles](./media/cost-mgt-best-practices/principles.png)

## Plan with cost in mind

Before you deploy cloud resources, perform an assessment of what Azure offer best meets your needs, the resources you plan to utilize, and how much they might cost. Azure provides tools to assist you in this process to give you a better idea of the investment required to enable your workloads. This will allow you to select the optimal configuration for your scenario.

### Azure onboarding options

The first step in maximizing your experience within Cost Management is to investigate and decide which Azure offer is best for you. Think about how you plan to use Azure in the future and how you want your billing model to be set up. Consider the following questions when making your decision:

- How long do I plan to use Azure? Am I testing, or do I plan to build longer-term infrastructure?
- How do I want to pay for Azure? Should I prepay for a reduced price or get invoiced at the end of the month?

To learn more about the various options, visit [How to buy Azure](https://azure.microsoft.com/pricing/purchase-options/). Several of the most common billing models are identified below.

#### [Free](https://azure.microsoft.com/free/)

- 12 months of popular free services
- $200 in credit to explore services for 30 days
- 25+ services are always free

#### [Pay as you go](https://azure.microsoft.com/offers/ms-azr-0003p)

- No minimums or commitments
- Competitive Pricing
- Pay only for what you use
- Cancel anytime

#### [Enterprise Agreement](https://azure.microsoft.com/pricing/enterprise-agreement/)

- Options for up-front monetary commitments
- Access to reduced Azure pricing

## Estimate the cost of your solution

Before any infrastructure is deployed, perform an assessment to determine how much your solution will cost. This will help you allocate a budget within your organization for the workload up-front and can be used over time to benchmark the validity of your initial estimation in comparison with the true cost of your deployed solution.

### Azure pricing calculator

The Azure pricing calculator allows you to mix and match different combinations of Azure services to see an estimate of the costs. You can implement your solution using different ways in Azure - each can might influence your overall spending. Thinking up-front about the end-to-end infrastructure needs of your cloud deployment helps you utilize the tool most effectively. It can help you get a holistic picture of your estimated spend on Azure.

For more information, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).

### Azure Migrate

Azure Migrate is a service that assesses your organization's current workloads in on-premises datacenters to give you insight into what you might need from a Azure replacement solution. First, Migrate analyzes your on-premises machines to determine whether migration is feasible. Then, it recommends VM sizing in Azure to maximize performance. Finally, it also creates a cost estimate for an Azure-based solution.

For more information, see [Azure Migrate](../migrate/migrate-overview.md).

## Analyze and manage your costs

Keep informed about how your organization's costs evolve over time. Use the following techniques to properly understand and manage your spending.

### Organize and tag your resources

Organize your resources with cost in mind. As you create subscriptions and resource groups, think about the teams that are responsible for associated costs. Ensure that your reporting keeps that organization in mind. Subscriptions and resource groups provide good buckets to organize and attribute spending across your organization. Tags also provide a good way to attribute cost. You can use tags as a filter or as a way to group by when you analyze data and investigate costs. Enterprise Agreement customers also can create departments and place subscriptions under them. Cost-based organization in Azure helps keep the relevant people in your organization accountable for reducing their team's spending.

### Use cost analysis

Cost analysis allows you to analyze your organizational costs in-depth by slicing and dicing your costs using standard resource properties. Consider the following common questions as a guide for your analysis. Answering these questions on a regular basis will help you stay more informed and enable more cost-conscious decisions.

- **Estimated costs for the current month** – How much have I incurred so far this month? Will I stay under my budget?
- **Investigate anomalies** – Perform routine checks to ensure costs remain within a reasonable range of normal usage. What are the trends? Are there any outliers?
- **Invoice reconciliation** - Is my latest invoiced cost more than the previous month? How did spending habits change month-over-month?
- **Internal chargeback** - Now that I know how much I'm being charged, how should those charges be broken down for my organization?

For more information, see [cost analysis](tutorial-acm-cost-analysis.md).

### Export billing data on a schedule

Do you need to import your billing data into an external system, like a dashboard or financial system? You can schedule automated reports on a regular basis to avoid manually downloading files every month. And you can export billing data to an Azure storage account and get notified using [action groups](../monitoring-and-diagnostics/monitoring-action-groups.md). Then you can use your Azure data to combine it with custom data that you can use in your own systems.

For more information about exporting billing data, see [Download cost analysis data](tutorial-acm-cost-analysis.md#download-cost-analysis-data).

### Create budgets

After you've identified and analyzed your spending patterns, it's important to begin setting limits for yourself and your teams. Azure budgets give you the ability to set either a cost or usage-based budget with multiple thresholds and alerts. Make sure to review the budgets that you create regularly to see your budget burn-down progress and make changes accordingly. Azure budgets also allows you to configure an automation trigger when a given budget threshold is reached. For example, you can configure your service to shut down VMs or move your infrastructure to a different pricing tier in response to a budget trigger.

For more information see [Azure Budgets](tutorial-acm-create-budgets.md).

For more information about budget-based automation, see [Budget Based Automation](../billing/billing-cost-management-budget-scenario.md).

## Act to optimize
Use the following ways to optimize spending.

### Cut out waste

After you've deployed your infrastructure in Azure, it's important to ensure that it is being utilized. The easiest way to start saving immediately is to review your resources and remove those that aren't being used. From there, you should determine that your resources are being utilized as efficiently as possible.

#### Azure Advisor

Azure Advisor is a service that, among other things, identifies virtual machines with low utilization from a CPU or network usage standpoint. From there, you can decide to either shut down or resize the machine based on the estimated cost to continue running the machine as-is. Advisor also provides recommendations for reserved instance purchases based on your last 30 days of virtual machine usage to further help you reduce your spending.

For more information, see [Azure Advisor](../advisor/advisor-overview.md).

### Size your VMs properly

VM sizing has a significant impact on your overall Azure cost. The number of VMs that you need in Azure might not equate to what you currently have deployed in an on-premises datacenter. It's important that the size you choose is appropriate for the workloads that you plan to run.

For more information, see [Azure IaaS: proper sizing and cost](https://azure.microsoft.com/resources/videos/azurecon-2015-azure-iaas-proper-sizing-and-cost/).

### Use purchase discounts

Azure has a variety of discounts that your organization should take advantage of to save money.

#### Azure Reservations

Azure Reservations allow you to you prepay for one-year or three-years of virtual machine or SQL Database compute capacity. Pre-paying will allow you to get a discount on the resources you use. Azure reservations can significantly reduce your virtual machine or SQL database compute costs — up to 72 percent on pay-as-you-go prices–with one-year or three-year upfront commitment. Reservations provide a billing discount and don't affect the runtime state of your virtual machines or SQL databases.

For more information, see [What are Azure Reservations?](../billing/billing-save-compute-costs-reservations.md).

#### Use Azure Hybrid Benefit

If you already have Windows Server or SQL Server licenses in your on-premises deployments, you can use the Azure Hybrid Benefit program to save in Azure. With the Windows Server benefit, each license covers the cost of the OS (up to two virtual machines), and you only pay for base compute costs. Existing SQL Server licenses can also be used to save up to 55 percent on vCore-based SQL Database options, SQL Server in Azure Virtual Machines, and SQL Server Integration Services.

For more information, see [Azure Hybrid Benefit savings calculator](https://azure.microsoft.com/pricing/hybrid-benefit/).

#### Monetary commitment

Customers who sign an Enterprise Agreement can create an up-front monetary commitment to Microsoft. Along with providing a simple way to allocate budgets to cloud resources, monetary commitments enable you to have reduced rates on Azure. Rate reductions can lead to significant cost savings for your organization.

### Other resources

Azure also has a service that allows you to build services that take advantage of surplus capacity in Azure for reduced rates. For more information, see [Use low priority VMs with Batch](../batch/batch-low-pri-vms.md).

## Next steps
- If you're new to Cost Management, [start using Azure Cost Management](quickstart-start-using-acm.md).
