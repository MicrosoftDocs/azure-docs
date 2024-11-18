---
title: Introduction to cost allocation
titleSuffix: Microsoft Cost Management
description: This article introduces you to different Azure tools and features to enable you to allocate costs effectively and efficiently.
author: bandersmsft
ms.author: banders
ms.date: 02/26/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: sadoulta
---

# Introduction to cost allocation

Cost allocation, as defined by the [FinOps Foundation](/cloud-computing/finops/capabilities-allocation), is the set of practices to divide up a consolidated invoice. Or, to bill the people responsible for its various component parts. It's the process of assigning costs to different groups within an organization based on their consumption of resources and application of benefits. By providing visibility into costs to groups who are responsible for it, cost allocation helps organizations track and optimize their spending, improve budgeting and forecasting, and increase accountability and transparency.

This article introduces you to different Azure tools and features to enable you to allocate costs effectively and efficiently.

- Azure resource hierarchy, including management groups, subscriptions, and resource groups
- Azure billing hierarchy
- Tags
- Cost allocation rules

Together, they can help to cover a considerable proportion of the expenses for the most complicated Azure infrastructure. They help organizations reach an elevated level of maturity as defined by the FinOps Foundation at [Cost Allocation (Metadata & Hierarchy)](https://www.finops.org/framework/capabilities/cost-allocation/).

## Azure resource hierarchy

Here's a diagram of the Azure resource hierarchy with management groups.

:::image type="content" source="./media/cost-allocation-introduction/resource-hierarchy.png" alt-text="Diagram showing the Azure resource hierarchy with management groups." border="false" lightbox="./media/cost-allocation-introduction/resource-hierarchy.png":::

### Management Groups

Management groups are logical containers that hold subscriptions and other management groups, forming a hierarchy that can be used to apply policies and access controls across multiple subscriptions. Management groups can also facilitate cost allocation by allowing organizations to group their subscriptions according to business units, departments, environments, or any other criteria that reflect their cost structure and reporting needs. For example, an organization can create a management group for each of its business divisions, and then assign budgets, tags, and cost alerts to each management group. This way, the organization can track and control the spending of each division and generate reports that show the breakdown of costs by management group.

For more information on management groups, see the following articles:
- [Azure management groups](https://azure.microsoft.com/get-started/azure-portal/management-groups)
- [Organize your resources with management groups](../../governance/management-groups/overview.md)
- [Organize subscriptions into management groups and assign roles to users](/azure/defender-for-cloud/management-groups-roles)

### Subscriptions

Subscriptions are a way of grouping Azure resources that might or might not share a common billing relationship. They can also be used to implement access control, governance, and cost allocation policies. For example, you can create subscriptions for different departments, projects, or environments within your organization. This increased flexibility comes with more management overhead.

You can view and manage your subscriptions in the Azure portal, PowerShell, CLI, or REST API. In the Azure portal, you can also use tools like Microsoft Cost Management and Advisor to monitor and optimize your subscription costs.

- [Best Practices - Subscriptions](/azure/cloud-adoption-framework/ready/azure-best-practices/initial-subscriptions) 
- [Organize Subscriptions](/azure/cloud-adoption-framework/ready/azure-best-practices/organize-subscriptions)

### Resource groups

A resource group is a logical container that holds related resources for an Azure solution. You can use resource groups to organize your resources by category, project, environment, or any other criteria that make sense for your organization. For example, you can create a resource group for each department, application, or stage of the development lifecycle.

Resource groups aren't only useful for managing your resources, but also for allocating costs. When you create a resource group, you can also specify a budget to control the costs.

Like subscriptions, you can view and manage your resource groups in the Azure portal, PowerShell, CLI, or REST API. You can also use tools like Microsoft Cost Management and Advisor to monitor and optimize your resource group spending.

- [Manage resource groups](../../azure-resource-manager/management/manage-resource-groups-portal.md)

## Azure billing hierarchies

The Azure billing hierarchy differs between Enterprise Agreements (EA) and Microsoft Customer Agreements (MCA). 

An EA consists of three levels for billing:

- Billing account (enrollment)
- Department
- Enrollment account

:::image type="content" source="./media/cost-allocation-introduction/billing-hierarchy-enterprise-agreement.png" alt-text="Diagram showing the EA billing hierarchy." border="false" lightbox="./media/cost-allocation-introduction/billing-hierarchy-enterprise-agreement.png":::

An MCA consists of three levels for billing:

- Billing account
- Billing profile
- Invoice section

:::image type="content" source="./media/cost-allocation-introduction/billing-hierarchy-microsoft-customer-agreement.png" alt-text="Diagram showing the MCA billing hierarchy." border="false" lightbox="./media/cost-allocation-introduction/billing-hierarchy-microsoft-customer-agreement.png":::

The billing hierarchy enables organizations to ensure that the right organizational units are paying for the services.

Knowing how Azure billing and resource hierarchies differ is essential for effective cost and resource management in the cloud. Azure billing hierarchy reflects the organizational structure of the account owner, while Azure resource hierarchy reflects the logical grouping of the resources used in Azure. The account owner can improve their cloud governance and cost management strategies by knowing the difference between billing and resource hierarchies. They can match the billing hierarchy with their organizational goals and preferences, and the resource hierarchy with their technical and operational needs.

For more information, watch the [Microsoft Cost Management setup, organization, and tagging](https://www.youtube.com/watch?time_continue=319&v=n3TLRaYJ1NY&embeds_referring_euri=https%3A%2F%2Flearn.microsoft.com%2F) video. The video refers to Azure Cost Management, but it has since been renamed Microsoft Cost Management.

## Tags

Tags are key-value pairs that you can apply to Azure resources to group and allocate costs based on business needs. They're a great way to augment the resources and usage data with business context. You can create [Azure policies](../../governance/policy/tutorials/create-and-manage.md) to ensure that all your resources are tagged in a certain way to comply with your tagging strategy.

However, even with a comprehensive tagging mechanism in place, you might find that some usage records are missing tags because not all Azure resources emit tags in their usage. To ensure all usage records are tagged, enable tag inheritance in Microsoft Cost Management to apply subscription and resource group tags to underlying child resources. You don't need to rely on resources emitting tags in their usage or tag every resource for your cost allocation needs.

MCA customers can also use tag inheritance to apply billing profile and invoice section tags to their usage records for cost reporting.

For more information about tag inheritance and billing tags, see [Apply billing tags](billing-tags.md) and [Group and allocate costs using tag inheritance](enable-tag-inheritance.md).

## Cost allocation rules

With cost allocation rules, you can split the costs of shared services by moving costs between subscriptions, resource groups, and tags. Splitting costs is especially useful in scenarios where you have central subscriptions hosting shared infrastructure services used by different teams within your organization. Creating the right cost allocation rules ensures that the teams consuming the shared services get visibility into their portion of the costs. And, they can also be accountable for those costs.

For more information about how to manage and allocate shared costs, see [Allocate costs](allocate-costs.md).

## Related content

To learn more about defining your tagging strategy, read the following articles:

- [Define your tagging strategy](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging)
- [Develop your naming and tagging strategy for Azure resources](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging)
- [Naming & Tracking Conventions Tagging Template](https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2Fmicrosoft%2FCloudAdoptionFramework%2Fmaster%2Fready%2Fnaming-and-tagging-conventions-tracking-template.xlsx)
- [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming-and-tagging-decision-guide)
- [Group and allocate costs using tag inheritance](enable-tag-inheritance.md)