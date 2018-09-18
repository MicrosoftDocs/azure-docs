---
title: Overview of Cloudyn in Azure | Microsoft Docs
description: Cloudyn is a multi-cloud cost management solution that helps you use Azure and other cloud resources.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 09/18/2018
ms.topic: overview
ms.service: cost-management
manager: dougeby
ms.custom:
---

# What is Cloudyn?

Cloudyn, a Microsoft subsidiary, allows you to track cloud usage and expenditures for your Azure resources and other cloud providers including AWS and Google. Easy-to-understand dashboard reports help with cost allocation and showbacks/chargebacks as well. Cloudyn helps optimize your cloud spending by identifying underutilized resources that you can then manage and adjust.

To watch an introductory video, see [Introduction to Azure Cloudyn](https://azure.microsoft.com/resources/videos/azure-cost-management-overview-and-demo).

Azure Cost Management offers similar functionality to Cloudyn. Azure Cost Management is a native Azure cost management solution. It helps you analyze costs, create and manage budgets, export data, and review and act on optimization recommendations to save money. For more information, see [Azure Cost Management](overview-cost-mgt.md).

## Monitor usage and spending

Monitoring your usage and spending is critically important for cloud infrastructures because organizations pay for the resources they consume over time. When usage exceeds agreement thresholds, unexpected cost overages can quickly occur. A few important factors can make ad-hoc monitoring difficult. First, projecting costs based on average usage assumes that your consumption remains consistent over a given billing period. Second, when costs are near or exceed your budget, it's important you get notifications proactively to adjust your spending. And, cloud service providers might not offer cost projection vs. thresholds or period to period comparison reports.

Reports help you monitor spending to analyze and track cloud usage, costs, and trends. Using Over Time reports, you can detect anomalies that differ from normal trends. Inefficiencies in your cloud deployment are visible in optimization reports. You can also notice inefficiencies in cost analysis reports.

## Manage costs

Historical data can help manage costs when you analyze usage and costs over time to identify trends. Trends are then used to forecast future spending. Cloudyn also includes useful projected cost reports.

Cost allocation manages costs by analyzing your costs based on your tagging policy. You can use tags on your custom accounts, resources, and entities to refine cost allocation. Category Manager organizes your tags to help provide additional governance. And, you use cost allocation for showback/chargeback to show resource utilization and associated costs to influence consumption behaviors or charge tenant customers.

Access control helps manage costs by ensuring that users and teams access only the cost management data that they needed. You use entity structure, user management, and scheduled reports with recipient lists to assign access.

Alerting helps manage costs by notifying you automatically when unusual spending or overspending occurs. Alerts can also notify other stakeholders automatically for spending anomalies and overspending risks. Various reports support alerts based on budget and cost thresholds. However, alerts are not currently supported for CSP partner accounts or subscriptions.

## Improve efficiency

You can determine optimal VM usage and identify idle VMs or remove idle VMs and unattached disks with Cloudyn. Using information in Sizing Optimization and Inefficiency reports, you can create a plan to down-size or remove idle VMs. However, optimization reports are not currently supported for CSP partner accounts or subscriptions.

If you provisioned AWS Reserved Instances, you can improve your reserved instances utilization with Optimization reports where you can view buying recommendations, modify unused reservations, and plan provisioning.

## Next steps

Now that you’re familiar with Cloudyn, the next step is to register your cloud environment and start exploring your data.

- [Register an individual Azure subscription](quick-register-azure-sub.md)
