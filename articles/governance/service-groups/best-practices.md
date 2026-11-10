---
title: "Best practices for Azure Service Groups - Azure Governance"
description: "Learn recommended practices for adopting Azure Service Groups, including how to divide responsibilities between a central platform team and application teams, and the benefits of a shared service-centric model."
author: kenieva
ms.author: kenieva
ms.service: azure-policy
ms.topic: how-to
ms.date: 11/04/2026
---

# Best practices for Azure Service Groups

As your organization grows in Azure, you might find that your org chart, deployment hierarchy, cost model, and operational views don't align. You might spread mission-critical resources across subscriptions, resource groups, regions, and ownership boundaries. This distribution can make it difficult to answer simple questions like "what makes up this application?" or "who owns this service?"

This article shares recommended practices for adopting [Azure Service Groups](overview.md). It covers how to divide responsibilities between a central platform team and application teams and a recommended path for adopting Service Groups at scale. 

## Why a shared model matters

Different teams need different views of the same resources:

- A **platform or cloud operations team** needs a consistent hierarchy standard to keep inventory, security, and cost reporting accurate.
- A **security team** needs to understand boundaries and blast radius without being granted access to every resource.
- A **cost owner** needs an all-up view of spend for an application that might span dozens of subscriptions.
- An **application or workload team** needs to manage and monitor *their* service, regardless of how its resources are distributed across the resource hierarchy.

Azure Service Groups address this challenge by adding a flexible, service-centric lens on top of your existing hierarchy, without requiring you to redesign management groups, subscriptions, or resource groups. Because a resource can belong to **multiple service groups at the same time**, a central team's governance tree and an application team's "my service" tree can coexist over the same resources without conflict. This shared, non-exclusive membership model is the biggest difference from other Azure scopes where a resource can only have one parent.

## Define roles and responsibilities

Organizations that get the most value from Service Groups explicitly divide responsibilities between a central team and application teams, rather than leaving every team to model resources on its own.

### Central (platform) team responsibilities

The central, or platform, team owns the standards and automation that keep service groups consistent and trustworthy across the organization:

- **Define the standards.** Agree on a naming convention, a tiering model (for example, criticality tier), and the metadata every service group should carry, such as owner, environment, and cost center as tags.
- **Own the top of the hierarchy.** Manage the root and upper levels of the service group tree, and decide how broad or deep (up to 10 levels) the hierarchy should go.
- **Automate discovery and membership.** Use [Azure Policy to deploy service group membership automatically](manage-membership.md#using-azure-policy-for-automatic-membership) based on tags or naming conventions, and use [Azure Resource Graph queries](manage-membership.md#creating-memberships-based-on-a-resource-graph-query) to find and add resources in bulk, instead of relying on every team to tag and add members by hand.
- **Grant least-privilege access.** Use the [built-in roles](overview.md#role-based-access-controls) to give broad read access (Service Group Reader) for visibility, and reserve the Contributor or Administrator roles for teams that need to manage lifecycle or membership. Remember that access to a service group doesn't grant access to its members.
- **Report centrally, act locally.** Use the aggregated membership data in Azure Resource Graph to report such as Azure Policy compliance and operational readiness (such as zone resiliency, backup, and disaster recovery coverage).
- **Partner with application teams** to validate that ownership and tiering metadata reflects reality, and revisit the model as the organization changes.

### Application (workload) team responsibilities

Application teams get the most value when they treat their service group as the map of their own application, independent of how its resources happen to be deployed:

- **Model the application as it operates**, not as it's deployed. Create a service group, or a tree of service groups, that mirrors your components, tiers, and dependencies, even if the underlying resources span multiple subscriptions or resource groups.
- **Add resources as members** by following the central team's naming and tagging conventions so automated policies pick them up, or by [adding members directly](create-service-group-member-portal.md) when automation doesn't fit.
- **Keep membership current.** Update membership through code or CI/CD alongside deployments (see [Manage membership at scale](manage-membership.md)) instead of treating it as a one-time, manual exercise.
- **Use the service group as a single pane of glass** for [monitoring health, alerts, and dependencies](monitoring.md) across the application, rather than stitching together separate views per subscription.
- **Request only the access needed.** A Service Group Contributor role on the team's own group, plus the `Microsoft.Relationship/write` permission on its resources, is usually enough to manage membership — subscription-level access isn't required.

## Recommended adoption path

Instead of modeling every resource in the tenant on day one, organizations that successfully adopt Service Groups tend to follow a similar path:

1. **Start with a few critical services.** Choose one or two visible applications with known mission-critical resources and clear owners as a pilot.
2. **Standardize the tree.** Agree on a tiering model and naming convention with the pilot application teams before scaling further. Model tiers and membership without changing any existing deployment scopes.
3. **Automate membership.** Replace manual, one-off membership updates with [Azure Policy-based automation or Resource Graph-driven scripts](manage-membership.md) so new resources are enrolled automatically as teams tag or deploy them.
4. **Connect reporting and monitoring.** Layer in [Azure Resource Graph queries](resource-graph-samples.md) and [Azure Monitor](monitoring.md) so both the central team and application teams get value from the same membership data, instead of maintaining separate inventories.
5. **Review and expand.** Periodically review coverage, ownership, and access with application teams, then expand the model to more services once the pattern is proven.


## Related content

- [What are Azure Service Groups?](overview.md)
- [Manage Azure Service Groups and members](manage-service-groups.md)
- [Manage Azure Service Group membership at scale](manage-membership.md)
- [Monitoring Service Groups with Azure Monitor](monitoring.md)
- [Azure Resource Graph sample queries for Service Groups](resource-graph-samples.md)
