---
title: Optimize your cloud investment with Azure Cost Management | Microsoft Docs
description: This article helps get the most value out of your cloud investments, reduce your costs, and evaluate where your money is being spent.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 05/21/2019
ms.topic: conceptual
ms.service: cost-management-billing
manager: vitavor
ms.custom: seodec18
---

# How to optimize your cloud investment with Azure Cost Management

Azure Cost Management gives you the tools to plan for, analyze and reduce your spending to maximize your cloud investment. This document provides you with a methodical approach to cost management and highlights the tools available to you as you address your organization’s cost challenges. Azure makes it easy to build and deploy cloud solutions. However, it's important that those solutions are optimized to minimize the cost to your organization. Following the principles outlined in this document and using our tools will help to make sure your organization is prepared for success.

## Methodology

Cost management is an organizational problem and should be an ongoing practice that begins before you spend money on cloud resources. To successfully implement cost management and optimize costs, your organization must:

- Be prepared with the proper tools for success
- Be accountable for costs
- Take appropriate action to optimize spending

Three key groups, outlined below, must be aligned in your organization to make sure that you successfully manage costs.

- **Finance** - People responsible for approving budget requests across the organization based on cloud spending forecasts. They pay the corresponding bill and assign costs to various teams to drive accountability.
- **Managers** - Business decision makers in an organization that need to understand cloud spending to find the best spending results.
- **App teams** - Engineers managing cloud resources on a day-to-day basis, developing services to meet the organization's needs. These teams need the flexibility to deliver the most value in their defined budgets.

### Key principles

Use the principles outlined below to position your organization for success in cloud cost management.

#### Planning

Comprehensive, up-front planning allows you to tailor cloud usage to your specific business requirements. Ask yourself:

- What business problem am I solving?
- What usage patterns do I expect from my resources?

Your answers will help you select the offerings that are right for you. They determine the infrastructure to use and how it's used to maximize your Azure efficiency.

#### Visibility

When structured well, Cost Management helps you to inform people about the Azure costs they're responsible for or for the money they spend. Azure has services designed to give you insight into *where* your money is spent. Take advantage of these tools. They can help you find resources that are underused, remove waste, and maximize cost-saving opportunities.

#### Accountability

Attribute costs in your organization to make sure that people responsible are accountable for their team's spending. To fully understand your organization's Azure spending, you should organize your resources to maximize insight into cost attribution. Good organization helps to manage and reduce costs and hold people accountable for efficient spending in your organization.

#### Optimization

Act to reduce your spending. Make the most of it based on the findings gathered through planning and increasing cost visibility. You might consider purchase and licensing optimizations along with infrastructure deployment changes that are discussed in detail later in this document.

#### Iteration

Everyone in your organization must engage in the cost management lifecycle. They need to stay involved on an ongoing basis to optimize costs. Be rigorous about this iterative process and make it a key tenet of responsible cloud governance in your organization.

![Key principles diagram showing visibility, accountability, and optimization](./media/cost-mgt-best-practices/principles.png)

## Plan with cost in mind

Before you deploy cloud resources, assess the following items:

- The Azure offer that best meets your needs
- The resources you plan to use
- How much they might cost

Azure provides tools to assist you in the assessment process. The tools can give you a good idea of the investment required to enable your workloads. Then you can select the best configuration for your situation.

### Azure onboarding options

The first step in maximizing your experience within Cost Management is to investigate and decide which Azure offer is best for you. Think about how you plan to use Azure in the future. Also consider how you want your billing model configured. Consider the following questions when making your decision:

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

Before you deploy any infrastructure, assess how much your solution will cost. The assessment will help you create a budget for your organization for the workload, up-front. Then you can use a budget over time to benchmark the validity of your initial estimation. And you can compare it with the actual cost of your deployed solution.

### Azure pricing calculator

The Azure pricing calculator allows you to mix and match different combinations of Azure services to see an estimate of the costs. You can implement your solution using different ways in Azure - each might influence your overall spending. Thinking early about all of the infrastructure needs of your cloud deployment helps you use the tool most effectively. It can help you get a solid estimate of your estimated spending in Azure.

For more information, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator).

### Azure Migrate

Azure Migrate is a service that assesses your organization's current workloads in on-premises datacenters. It gives you insight into what you might need from an Azure replacement solution. First, Migrate analyzes your on-premises machines to determine whether migration is feasible. Then, it recommends VM sizing in Azure to maximize performance. Finally, it also creates a cost estimate for an Azure-based solution.

For more information, see [Azure Migrate](../../site-recovery/migrate-overview.md).

## Analyze and manage your costs

Keep informed about how your organization's costs evolve over time. Use the following techniques to properly understand and manage your spending.

### Organize and tag your resources

Organize your resources with cost in mind. As you create subscriptions and resource groups, think about the teams that are responsible for associated costs. Make sure your reporting keeps your organization in mind. Subscriptions and resource groups provide good buckets to organize and attribute spending across your organization. Tags provide a good way to attribute cost. You can use tags as a filter. And you can use them to group by when you analyze data and investigate costs. Enterprise Agreement customers can also create departments and place subscriptions under them. Cost-based organization in Azure helps keep the relevant people in your organization accountable for reducing their team's spending.

### Use cost analysis

Cost analysis allows you to analyze your organizational costs in-depth by slicing and dicing your costs using standard resource properties. Consider the following common questions as a guide for your analysis. Answering these questions on a regular basis will help you stay more informed and enable more cost-conscious decisions.

- **Estimated costs for the current month** – How much have I incurred so far this month? Will I stay under my budget?
- **Investigate anomalies** – Do routine checks to make sure that costs stay within a reasonable range of normal usage. What are the trends? Are there any outliers?
- **Invoice reconciliation** - Is my latest invoiced cost more than the previous month? How did spending habits change month-over-month?
- **Internal chargeback** - Now that I know how much I'm being charged, how should those charges be broken down for my organization?

For more information, see [cost analysis](quick-acm-cost-analysis.md).

### Export billing data on a schedule

Do you need to import your billing data into an external system, like a dashboard or financial system? Set up automated exports to Azure Storage and avoid manually downloading files every month. You can then easily set up automatic integrations with other systems to keep your billing data in sync.

For more information about exporting billing data, see [Create and manage exported data](tutorial-export-acm-data.md).

### Create budgets

After you've identified and analyzed your spending patterns, it's important to begin setting limits for yourself and your teams. Azure budgets give you the ability to set either a cost or usage-based budget with many thresholds and alerts. Make sure to review the budgets that you create regularly to see your budget burn-down progress and make changes as needed. Azure budgets also allow you to configure an automation trigger when a given budget threshold is reached. For example, you can configure your service to shut down VMs. Or you can move your infrastructure to a different pricing tier in response to a budget trigger.

For more information, see [Azure Budgets](tutorial-acm-create-budgets.md).

For more information about budget-based automation, see [Budget Based Automation](../manage/cost-management-budget-scenario.md).

## Act to optimize
Use the following ways to optimize spending.

### Cut out waste

After you've deployed your infrastructure in Azure, it's important to make sure it is being used. The easiest way to start saving immediately is to review your resources and remove any that aren't being used. From there, you should determine if your resources are being used as efficiently as possible.

#### Azure Advisor

Azure Advisor is a service that, among other things, identifies virtual machines with low utilization from a CPU or network usage standpoint. From there, you can decide to either shut down or resize the machine based on the estimated cost to continue running the machines. Advisor also provides recommendations for reserved instance purchases. The recommendations are based on your last 30 days of virtual machine usage. When acted on, the recommendations can help you reduce your spending.

For more information, see [Azure Advisor](../../advisor/advisor-overview.md).

### Size your VMs properly

VM sizing has a significant impact on your overall Azure cost. The number of VMs needed in Azure might not equate to what you currently have deployed in an on-premises datacenter. Make sure your choose the right size for the workloads that you plan to run.

For more information, see [Azure IaaS: proper sizing and cost](https://azure.microsoft.com/resources/videos/azurecon-2015-azure-iaas-proper-sizing-and-cost/).

### Use purchase discounts

Azure has many discounts that your organization should take advantage of to save money.

#### Azure Reservations

Azure Reservations allow you to prepay for one-year or three-years of virtual machine or SQL Database compute capacity. Pre-paying will allow you to get a discount on the resources you use. Azure reservations can significantly reduce your virtual machine or SQL database compute costs — up to 72 percent on pay-as-you-go prices with one-year or three-year upfront commitment. Reservations provide a billing discount and don't affect the runtime state of your virtual machines or SQL databases.

For more information, see [What are Azure Reservations?](../reservations/save-compute-costs-reservations.md).

#### Use Azure Hybrid Benefit

If you already have Windows Server or SQL Server licenses in your on-premises deployments, you can use the Azure Hybrid Benefit program to save in Azure. With the Windows Server benefit, each license covers the cost of the OS (up to two virtual machines), and you only pay for base compute costs. You can use existing SQL Server licenses to save up to 55 percent on vCore-based SQL Database options. Options include SQL Server in Azure Virtual Machines and SQL Server Integration Services.

For more information, see [Azure Hybrid Benefit savings calculator](https://azure.microsoft.com/pricing/hybrid-benefit/).

### Other resources

Azure also has a service that allows you to build services that take advantage of surplus capacity in Azure for reduced rates. For more information, see [Use low priority VMs with Batch](../../batch/batch-low-pri-vms.md).

## Next steps
- If you're new to Cost Management, read [What is Azure Cost Management?](../cost-management-billing-overview.md) to learn how it helps monitor and control Azure spending and to optimize resource use.
