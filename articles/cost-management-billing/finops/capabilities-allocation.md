---
title: Cost allocation
description: This article helps you understand the cost allocation capability within the FinOps Framework and how to implement that in the Microsoft Cloud.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---

# Cost allocation

This article helps you understand the cost allocation capability within the FinOps Framework and how to implement that in the Microsoft Cloud.

## Definition

**Cost allocation refers to the process of attributing and assigning costs to specific departments, teams, and projects within an organization.**

Identify the most critical attributes to report against based on stakeholder needs. Consider the different reporting structures within the organization and how you'll handle change over time. Consider engineering practices that may introduce different types of cost that need to be analyzed independently.

Establish and maintain a mapping of cloud and on-premises costs to each attribute and apply governance policies to ensure data is appropriately tagged in advance. Define a process for how to handle tagging gaps and misses.

Cost allocation is the foundational element of cost accountability and enables organizations to gain visibility into the financial impact of their cloud solutions and related activities and initiatives.

## Getting started

When you first start managing cost in the cloud, you use the native "allocation" tools to organize subscriptions and resources to align to your primary organizational reporting structure. For anything beyond it, [tags](../../azure-resource-manager/management/tag-resources.md) can augment cloud resources and their usage to add business context, which is critical for any cost allocation strategy.

Cost allocation is usually an afterthought and requires some level of cleanup when introduced. You need a plan to implement your cost allocation strategy. We recommend outlining that plan first to get alignment and possibly prototyping on a small scale to demonstrate the value.

- Decide how you want to manage access to the cloud.
  - At what level in the organization do you want to centrally provision access to the cloud: Departments, teams, projects, or applications? High levels require more governance and low levels require more management.
  - What [cloud scope](../costs/understand-work-scopes.md) do you want to provision for this level?
    - Billing scopes are used for to organize costs between and within invoices.
    - [Management groups](../../governance/management-groups/overview.md) are used to organize costs for resource management. You can optimize management groups for policy assignment or organizational reporting.
    - Subscriptions provide engineers with the most flexibility to build the solutions they need but can also come with more management and governance requirements due to this freedom.
    - Resource groups enable engineers to deploy some solutions but may require more support when solutions require multiple resource groups or options to be enabled at the subscription level.
- How do you want to use management groups?
  - Organize subscriptions into environment-based management groups to optimize for policy assignment. Management groups allow policy admins to manage policies at the top level but blocks the ability to perform cross-subscription reporting without an external solution, which increases your data analysis and showback efforts.
  - Organize subscriptions into management groups based on the organizational hierarchy to optimize for organizational reporting. Management groups allow leaders within the organization to view costs more naturally from the portal but requires policy admins to use tag-based policies, which increases policy and governance efforts. Also keep in mind you may have multiple organizational hierarchies and management groups only support one.
- [Define a comprehensive tagging strategy](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging) that aligns with your organization's cost allocation objectives.
  - Consider the specific attributes that are relevant for cost attribution, such as:
    - How to map costs back to financial constructs, for example, cost center?
    - Can you map back to every level in the organizational hierarchy, for example, business unit, department, division, and team?
    - Who is accountable for the service, for example, business owner and engineering owner?
    - What effort does this map to, for example project and application?
    - What is the engineering purpose of this resource, for example, environment, component, and purpose?
  - Clearly communicate tagging guidelines to all stakeholders.
- Once defined, it's time to implement your cost allocation strategy.
  - Consider a top-down approach that prioritizes getting departmental costs in place before optimizing at the lowest project and environment level. You may want to implement it in phases, depending on how broad and deep your organization is.
  - Enable [tag inheritance in Cost Management](../costs/enable-tag-inheritance.md) to copy subscription and resource group tags in cost data only. It doesn't change tags on your resources.
  - Use Azure Policy to [enforce your tagging strategy](../../azure-resource-manager/management/tag-policies.md), automate the application of tags at scale, and track compliance status. Use compliance as a KPI for your tagging strategy.
  - If you need to move costs between subscriptions, resource groups, or add or change tags, [configure allocation rules in Cost Management](../costs/allocate-costs.md). For more information about cost allocation in Microsoft Cost Management, see [Introduction to cost allocation](../costs/cost-allocation-introduction.md). Cost allocation is covered in detail at [Managing shared costs](capabilities-shared-cost.md).
  - Consider [grouping related resources together with the “cm-resource-parent” tag](../costs/group-filter.md#group-related-resources-in-the-resources-view) to view costs together in Cost analysis.
  - Distribute responsibility for any remaining change to scale out and drive efficiencies.
-  Make note of any unallocated costs or costs that should be split but couldn't be. You cover it as part of [Managing shared costs](capabilities-shared-cost.md).

Once all resources are tagged and/or organized into the appropriate resource groups and subscriptions, you can report against that data as part of [Data analysis and showback](capabilities-analysis-showback.md).

Keep in mind that tagging takes time to apply, review, and clean up. Expect to go through multiple tagging cycles after everyone has visibility into the cost data. Many people don't realize there's a problem until they have visibility, which is why FinOps is so important.

## Building on the basics

At this point, you have a cost allocation strategy with detailed cloud management and tagging requirements. Tagging should be automatically enforced or at least tracked with compliance KPIs. As you move beyond the basics, consider the points:

- Fill any gaps unmet by native tools.
  - At a minimum, this gap requires reporting outside the portal, where tagging gaps can be merged with other data.
  - If tagging gaps need to be resolved directly in the data, you need to implement [Data ingestion and normalization](capabilities-ingestion-normalization.md).
- Consider other costs that aren't yet covered or might be tracked separately.
  - Strive to drive consistency across data sources to align tagging implementations. When not feasible, implement cleanup as part of [Data ingestion and normalization](capabilities-ingestion-normalization.md) or reallocate costs as part of your overarching cost allocation strategy.
- Regularly review and refine your cost allocation strategy.
  - Consider this process as part of your reporting feedback loop. If your cost allocation strategy is falling short, the feedback you get may not be directly associated with cost allocation or metadata. It may instead be related to reporting. Watch out for this feedback and ensure the feedback is addressed at the most appropriate layer.
  - Ensure naming, metadata, and hierarchy requirements are being used consistently and effectively throughout your environment.
  - Consider other KPIs to track and monitor success of your cost allocation strategy.

## Learn more at the FinOps Foundation

This capability is a part of the FinOps Framework by the FinOps Foundation, a non-profit organization dedicated to advancing cloud cost management and optimization. For more information about FinOps, including useful playbooks, training and certification programs, and more, see the [Cost allocation (metadata & hierarchy) capability](https://www.finops.org/framework/capabilities/cost-allocation/) article in the FinOps Framework documentation.

## Next steps

- [Data analysis and showback](capabilities-analysis-showback.md)
- [Managing shared costs](capabilities-shared-cost.md)