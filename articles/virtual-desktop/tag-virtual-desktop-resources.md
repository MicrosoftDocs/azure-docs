---
title: Tag Azure Virtual Desktop resources - Azure
description: What tagging is, and how you can use it to manage Azure service costs in Azure Virtual Desktop.
author: heidilohr

ms.topic: conceptual
ms.date: 11/12/2021
ms.author: helohr
manager: femila
---

# Tag Azure Virtual Desktop resources to manage costs

Tagging is a tool available across Azure services that helps you organize resources inside their Azure subscription. Organizing resources makes it easier to track costs across multiple services. Tags also help you understand how much each grouping of Azure resources costs per billing cycle. If you'd like to learn more about tagging in general, see [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md). You can also watch a [quick video](https://www.youtube.com/watch?v=dUft4FZ40O8) about some other ways to use Azure tags.

## How tagging works

You can tag Azure services you manage in the Azure portal or through PowerShell. The tags will appear as key-value pairs of text. As you use tagged Azure resources, the associated tag key-value pair will be attached to the resource usage.

Once your deployment reports tagged usage information to [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md), you can use your tagging structure to filter cost data. To learn how to filter by tags in Azure Cost Management, see [Quickstart: Explore and analyze costs with cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md).

### Add, edit, or delete tags

When you apply a new tag to a resource, it won't be visible in Azure Cost Management until its associated Azure resource reports activity. If you apply an existing tag to your resources, this change also won't be visible in Azure Cost Management until the Azure resources report activity.

If you edit a tag name, the associated resources will now associate costs with its new key-value pair. You can still filter data with the old tag, but all new data from after the change will be reported with the new tag.

If you delete a tag, Azure Virtual Desktop will no longer report data associated with the deleted tag to Azure Cost Management. You can still filter with deleted tags for data reported before you deleted the tag.

>[!IMPORTANT]
>Tagged Azure resources that haven't been active since you applied new or updated tags to them won't report any activity associated with the changed tags to Azure Cost Management. You won't be able to filter for specific tags until their associated activity is reported to Azure Cost Management by the service.

### View all existing tags

You can view all existing tags for your Azure services by going to the Azure portal, then opening [the **Tags** tab](https://portal.azure.com/#blade/HubsExtension/TagsBlade). The Tags tab will show you all tags in objects you have access to. You can also sort tags by their keys or values whenever you need to quickly update a large number of tags at the same time.

### What tags can and can't do

Tags only report usage and cost data for Azure resources they're directly assigned to. If you've tagged a resource without tagging the other resources in it, then Azure Virtual Desktop will only report activity related to the top-level tagged resource. You'll also need to tag every resource under that top-level resource if you want your billing data to be accurate.

To learn more about how tags work in Azure Cost Management, see [How tags are used in cost and usage data](../cost-management-billing/costs/understand-cost-mgt-data.md#how-tags-are-used-in-cost-and-usage-data).

For a list of known Azure tag limitations, see [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md#limitations).

## Using tags in Azure Virtual Desktop

Now that you understand the basics of Azure tags, let’s go over how you can use them in Azure Virtual Desktop.

You can use Azure tags to organize costs for creating, managing, and deploying virtualized experiences for your customers and users. Tagging can also help you track resources you buy directly through Azure Virtual Desktop and other Azure services connected to Azure Virtual Desktop deployments.

## Suggested tags for Azure Virtual Desktop

Because Azure Virtual Desktop can work with other Azure services to support its deployments, there isn't a universal system for tagging deployment resources. What's most important is that you develop a strategy that works for you and your organization. However, we do have some suggestions that might help you, especially if you're new to using Azure. 

The following suggestions apply to all Azure Virtual Desktop deployments:

- Become familiar with your purchased Azure services so you understand the extent of what you want to tag. As you learn how to use the Azure portal, keep a list of service groups and objects where you can apply tags. Some resources that you should keep track of include resource groups, virtual machines, disks, and network interface cards (NICs). For a more comprehensive list of cost generating service components you can tag, see [Understanding total Azure Virtual Desktop deployment costs](./remote-app-streaming/total-costs.md).

- Create a cost reporting aggregation to organize your tags. You can either  [follow a common tagging pattern](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging) or create a new pattern that meets your organization’s needs.

- Keep your tags consistent wherever you apply them. Even the smallest typo can impact data reporting, so make sure you're adding the exact key-value pair you want to look up later.

- Keep a record of any tags you update or edit. This record will let you combine each tag's historic data as needed. When you edit or update a tag, you should also apply those changes across all resources that include the changed tag.

## Suggested tags for Azure Virtual Desktop host pools

Every virtual machine in an Azure Virtual Desktop host pool creates a cost-producing construct. Because host pools are the foundation of an Azure Virtual Desktop deployment, their VMs are typically the main source of costs for Azure Virtual Desktop deployments. If you want to set up a tagging system, we recommend that you start with tagging all the host pools in your deployment to track VM compute costs. Tagging your host pools can help you use filtering in Azure Cost Management to identify these VM costs.

Like with the [general suggestions](#suggested-tags-for-azure-virtual-desktop), there's no universal system for tagging host pools. However, we do have a few suggestions to help you organize your host pool tags:

- Tagging host pools while you're creating them is optional, but tagging during the creation process will make it easier for you to view all tagged usage in Azure Cost Management later. Your host pool tags will follow all cost-generating components of the session hosts within your host pool. Learn more about session host-specific costs at [Understanding total Azure Virtual Desktop deployment costs](./remote-app-streaming/total-costs.md).

- If you use the Azure portal to create a new host pool, the creation workflow will give you the chance to add existing tags. These tags will be passed along to all resources you create during the host pool creation process. Tags will also be applied to any session hosts you add to an existing host pool in the Azure portal. However, you'll need to enter the tags manually every time you add a new session host.

- It's unlikely you'll ever get a complete cost report of every supporting Azure service working with your host pools, since configuration options are both limitless and unique to each customer. It's up to you to decide how closely you want to track costs across any Azure services associated with your Azure Virtual Desktop deployment. The more thoroughly you track these costs by tagging, the more accurate your monthly Azure Virtual Desktop cost report will become.

- If you build your tagging system around your host pools, make sure to use key-value pairs that make sense to add to other Azure services later.

### Use the cm-resource-parent tag to automatically group costs by host pool

You can group costs by host pool by using the cm-resource-parent tag. This tag won't impact billing but will let you review tagged costs in Microsoft Cost Management without having to use filters. The key for this tag is **cm-resource-parent** and its value is the resource ID of the Azure resource you want to group costs by. For example, you can group costs by host pool by entering the host pool resource ID as the value. To learn more about how to use this tag, see [Group related resources in the cost analysis (preview)](../cost-management-billing/costs/group-filter.md#group-related-resources-in-the-resources-view).

## Suggested tags for other Azure Virtual Desktop resources

Most Azure Virtual Desktop customers deploy other Azure services to support their deployments. If you want to include the cost of these extra services in your cost report, you should consider the following suggestions:

- If you've already purchased an Azure service or resources that you want to integrate into your Azure Virtual Desktop deployments, you have two options:
   
   - Separate your purchased Azure services between different Azure subscriptions.
   - Combine all purchased Azure services in the same subscription with your Azure Virtual Desktop tags.

   Separating your services will give you a clearer idea of costs for each service, but may end up being more expensive in the end. You may need to purchase extra storage for these services to make sure your Azure Virtual Desktop has its own designated storage. 

   Combining your purchased services is less expensive, but may inflate your cost report because the usage data for shared resources won't be as accurate. To make up for the lack of accuracy, you can add multiple tags to your resources to see shared costs through filters that track different factors.

- If you started building your tagging system with a different Azure service, make sure the key-value pairs you create can be applied to your Azure Virtual Desktop deployment or other services later.

## Next steps

If you’d like to learn more about common Azure Virtual Desktop related costs, check out [Understanding total Azure Virtual Desktop deployment costs](./remote-app-streaming/total-costs.md).

If you’d like to learn more about Azure tags, check out the following resources:

- [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md)

- [A video explaining the value of using Azure tags](https://www.youtube.com/watch?v=dUft4FZ40O8)

- [How tags are used in cost and usage data](../cost-management-billing/costs/understand-cost-mgt-data.md#how-tags-are-used-in-cost-and-usage-data)

- [Develop your naming and tagging strategy for Azure resources](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging)

- [Define your tagging strategy](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging)

- [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging)

If you’d like to learn more about Azure Cost Management, check out the following
articles:

- [What is Azure Cost Management + Billing?](../cost-management-billing/cost-management-billing-overview.md)

- [Quickstart: Explore and analyze costs with cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md)
