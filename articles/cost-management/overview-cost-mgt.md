---
title: Overview of Azure Cost Management | Microsoft Docs
description: Azure Cost Management is a cost management solution that helps monitor and control Azure spending and optimize resource use.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 05/14/2019
ms.topic: overview
ms.service: cost-management
manager: benshy
ms.custom:
---

# What is Azure Cost Management?

Cost management is the process of effectively planning and controlling costs involved in your business. Cost management tasks are normally performed by finance, management, and app teams. Azure Cost Management helps organizations plan with cost in mind. It also helps to analyze costs effectively and take action to optimize cloud spending. To learn more about how to approach cost management as an organization, take a look at the [Azure Cost Management best practices](cost-mgt-best-practices.md) article.

Watch the [Azure Cost Management overview video](https://www.youtube.com/watch?v=el4yN5cHsJ0) for a quick overview about how Azure Cost Management can help you save money in Azure.

>[!VIDEO https://www.youtube.com/embed/el4yN5cHsJ0]

Although related, billing differs from cost management. Billing is the process of invoicing customers for goods or services and managing the commercial relationship.  Procurement and finance teams usually conduct billing tasks.

Cost Management shows organizational cost and usage patterns with advanced analytics. Reports in Cost Management show the usage-based costs consumed by Azure services and third-party Marketplace offerings. Costs are based on negotiated prices and factor in reservation and Azure Hybrid Benefit discounts. Collectively, the reports show your internal and external costs for usage and Azure Marketplace charges. Other charges, such as reservation purchases, support, and taxes are not yet shown in reports. The reports help you understand your spending and resource use and can help find spending anomalies. Predictive analytics are also available. Cost Management uses Azure management groups, budgets, and recommendations to show clearly how your expenses are organized and how you might reduce costs.

You can use the Azure portal or various APIs for export automation to integrate cost data with external systems and processes. Automated billing data export and scheduled reports are also available.

## Plan and control expenses

The ways that Cost Management help you plan for and control your costs include: Cost analysis, budgets,  recommendations, and exporting cost management data.

You use cost analysis to explore and analyze your organizational costs. You can view aggregated costs by organization to understand where costs are accrued and to identify spending trends. And you can see accumulated costs over time to estimate monthly, quarterly, or even yearly cost trends against a budget.

Budgets help you plan for and meet financial accountability in your organization. They help prevent cost thresholds or limits from being surpassed. Budgets can also help you inform others about their spending to proactively manage costs. And with them, you can see how spending progresses over time.

Recommendations show how you can optimize and improve efficiency by identifying idle and underutilized resources. Or, they can show less expensive resource options. When you act on the recommendations, you change the way you use your resources to save money. To act, you first view cost optimization recommendations to view potential usage inefficiencies. Next, you act on a recommendation to modify your Azure resource use to a more cost-effective option. Then you verify the action to make sure that the change you make is successful.

If you use external systems to access or review cost management data, you can easily export the data from Azure. And you can set a daily scheduled export in CSV format and store the data files in Azure storage. Then, you can access the data from your external system.

## Consider Cloudyn

[Cloudyn](overview.md) is an Azure service related to Cost Management. With Cloudyn, you can track cloud usage and expenditures for your Azure resources. It also supports other cloud providers including AWS and Google. Easy-to-understand dashboard reports help with cost allocation and showbacks/chargebacks as well. Currently, Cost Management doesn't support showback/chargeback or other cloud service providers. However, Cloudyn is an option that _does_ support them. Currently, Cost Management doesn't support Microsoft Cloud Service Provider (CSP) accounts but Cloudyn does. If you have CSP accounts or if you want to use showback/chargeback, you can use Cloudyn to help manage your costs.

Watch the [Azure Cost Management and Cloudyn video](https://www.youtube.com/watch?v=PmwFWwSluh8) to see recommendations when you should use either Azure Cost Management or Cloudyn, based on your business needs.

>[!VIDEO https://www.youtube.com/embed/PmwFWwSluh8]

## Additional Azure tools

Azure has other tools that aren't a part of the Azure Cost Management feature set. However, they play an important role in the cost management process. To learn more about these tools, see the following links.

- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) - Use this tool to estimate your up-front cloud costs.
- [Azure Migrate](../migrate/migrate-overview.md) - Assess your current datacenter workload for insights about what's needed from an Azure replacement solution.
- [Azure Advisor](../advisor/advisor-overview.md) - Identify unused VMs and receive recommendations about Azure reserved instance purchases.
- [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) - Use your current on-premises Windows Server or SQL Server licenses for VMs in Azure to save.


## Next steps

Now that you're familiar with Cost Management, the next step is to start using the service.

- Start using Azure Cost Management to [analyze costs](quick-acm-cost-analysis.md).
- You can also read more about [Azure Cost Management best practices](cost-mgt-best-practices.md).
