---
title: Using tagging for AVD cost management
---

# Tag Azure Virtual Desktop resources to manage costs

Tagging is a tool available across Azure services that helps you organize resources inside their Azure subscription. Organizing resources makes it easier to track costs across multiple services. Tags can also help you understand how much each grouping of Azure resources costs per billing cycle. If you'd like to learn more about tagging in general, see [Use tags to organize your Azure resources and management hierarchy](../azure-resource-manager/management/tag-resources.md). You can also watch a [quick video](https://www.youtube.com/watch?v=dUft4FZ40O8) about some additional uses of Azure tags.

## How tagging works in Azure Virtual Desktop

You can tag Azure services you manage in the Azure portal or PowerShell. The tags will appear as key-value pairs of text. As you use Azure resources, your settings will group resources with the same tags together, as well as their associated costs.

Once your deployment reports tagged usage information to [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md), you can use your tagging structure to filter cost data. To learn how to filter by tags in Azure Cost Management, see [Quickstart: Explore and analyze costs with cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md).

### Add, edit, or delete tags

When you apply a new tag to a resource, it won't be visible in Azure Cost Management until its associated Azure resource reports activity. If you apply an existing tag to your resources, this change also won't be visible in Azure Cost management until the Azure resources report activity.

If you edit a tag name, the associated resources will now associate costs with its new key-value pair. You can still filter data with the old tag, but all new data from after the change will be reported with the new tag.

If you delete a tag, Azure Virtual Desktop will no longer report data associated with the deleted tag to Azure Cost Manager. You can still filter with deleted tags for data reported before you deleted the tag.

>[!IMPORTANT]
>Azure resources that have tags applied, but have not been active since those new or updated tags have been applied, will not report any associated activity to Azure Cost Management. Filtering by a specific tag will not be available until its associated activity is surfaced.

### View all your existing tags

By navigating to the [Tags blade in the Azure portal](https://ms.portal.azure.com/#blade/HubsExtension/TagsBlade), you can see all the key value pairs assigned to the objects you have access to. They can be sorted by the keys or values and it’s straightforward to quickly update tags in bulk there.

## What tagging can and can't do

Tags reflect usage and costs of Azure resources to which they are directly assigned. Tags cannot necessarily surface usage or costs of nested Azure resources (if they are applied to parent resource groups). For instance, tagged Resource Groups cannot see some resources underneath them, so those resources must be directly tagged.

To understand the bounds of Azure Cost Management tag support, see [How tags are used in cost and usage data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data#how-tags-are-used-in-cost-and-usage-data).

For known Azure tag limitations, see the Limitations section of [Use tags to organize your Azure resources and management hierarchy](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources?tabs=json#limitations).

## How Azure Virtual Desktop can use tagging

Now that you understand the basics of Azure tags, let’s go over how they can be used in context of Azure Virtual Desktop.

Azure Virtual Desktop customers can use Azure tags to organize costs associated with creating, managing, and providing virtualized experiences for customers’ end users. Tagging can help customers keep track of resources they buy both directly through the Azure Virtual Desktop service as well as resources purchased elsewhere through other Azure services that often work together to power their Azure Virtual Desktop deployments.

## Recommended tags for deployments

Because Azure Virtual Desktop is a service that can leverage many other Azure services for its purposes and no two customer deployments are the same, there is no one-size-fits-all recommended approach you can use to tag your deployment resources.

If you are new or unfamiliar with Azure tags and want to get started with them, we recommend you consider the following approaches but ultimately follow the pattern or strategy that makes the most sense for your organization.

## Best practices for Azure Virtual Desktop tagging

The following recommendations are applicable to all types of Azure Virtual Desktop deployment configurations, both simple and complex:

- Understand the group of Azure services you purchase to power your Azure Virtual Desktop deployment(s) so you know the extent of the things you want to tag. Create a list and familiarize yourself with navigating their Azure portal experiences to see if and where you can apply tags. Some of the resources you can tag to capture AVD costs include Resource Groups, Virtual Machines, Disks, and NiCs. If you’d like to learn more about common Azure Virtual Desktop related components that generate costs, see [Understanding total Azure Virtual Desktop deployment costs](https://docs.microsoft.com/en-us/azure/virtual-desktop/remote-app-streaming/total-costs).

- Decide what kind of cost reporting aggregation you want to see. To enable it, you can [follow a common tagging pattern](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging) or create a new one that best matches your organization’s needs.

- Make sure your tags are consistent wherever you choose to apply them. Even one distinct character between tag applications will impact data reporting, so take care to ensure you are setting up the exact key-value pair you want to look up later.

- Keep a record of updated or edited tags so you can combine their historic data as needed. If you ever edit or update a tag somewhere, be sure to also apply those changes across all the resources that you want to reflect this change as well.

## Tag Azure Virtual Desktop host pools

The virtual machines powering Azure Virtual Desktop host pools create the single cost-producing construct every Azure Virtual Desktop deployment has in common. Host pools are the fundamental mechanism that powers the virtualized end user experience and the session hosts (virtual machines) they are composed of are usually the main portion of Azure Virtual Desktop related costs. Because of these reasons, we recommend that customers who want to tag their Azure Virtual Desktop costs start by tagging their host pools. Tagging your host pools will allow you to see inside the Azure Cost Management (via filtering results) which of your Azure subscriptions costs were a direct result of your host pools.

- Adding Azure tags during host pool creation is optional, but the perfect time to ensure you are capturing all tagged usage from the beginning of end user activity on those resources. These tags will follow all cost-generating pieces of the session hosts you create for your host pool. For more details about session host specific costs, see [Understanding total Azure Virtual Desktop deployment costs](https://docs.microsoft.com/en-us/azure/virtual-desktop/remote-app-streaming/total-costs).

- If you choose to use the Azure portal to create a new host pool, then as part of the process it will offer you the ability to add tags. Those tags will be propagated to all resources that are created during that process. Tags will also be propagated when using the Azure portal to add session hosts to an existing host pool, but you will need to enter the tags again each time you add a session host.

- Due to the fact there are many supporting services that work with Azure Virtual Desktop host pools, it is unlikely you will capture the complete cost of your deployment just by tagging those host pools. Because of this, you must decide how closely you want to track the costs across Azure associated with your deployment. The more closely you track these costs (through tags), the more complete your monthly Azure Virtual Desktop cost (inclusive of all its auxiliary optional or tangentially related features) will become.

- If you start your Azure tag journey with your Azure Virtual Desktop host pool (or elsewhere), be mindful about the key-value pairs you create and their shared purpose with other Azure services that you might choose to include under the same tag later.

## Tag other Azure Virtual Desktop resources

Most Azure Virtual Desktop customers also choose to deploy additional Azure services for the purpose of their deployments. Customers that want to include the cost of these additional Azure services in their Azure Virtual Desktop cost reporting should also consider the following guidance.

- If you have already purchased an Azure service or resources for a different purpose, but you want to share it with your AVD deployments, you must choose to either separate the purchase of the Azure services through different Azure subscriptions or associate the single cost of the whole service on the same subscription with your Azure Virtual Desktop tag(s). The first option will offer better cost clarity but could possibly be more expensive since you might have to purchase excess storage capabilites to ensure its capacity is only being used by Azure Virtual Desktop. The second option could be less expensive, but it will likely inflate your tagged Azure Virtual Desktop costs since some shared resources can’t show the difference in usage by Azure service. You can also add multiple tags to your resources so you can see shared costs through different perspectives or filter that make sense to your organization.

- If you start your Azure tag journey with your Azure Virtual Desktop with a different Azure service, be mindful about the key-value pairs you create and their shared purpose with other Azure services (including Azure Virtual Desktop host pools) that you might choose to include under the same tag later.

## Next steps

If you’d like to learn more about common Azure Virtual Desktop related costs, check out [Understanding total Azure Virtual Desktop deployment costs](https://docs.microsoft.com/en-us/azure/virtual-desktop/remote-app-streaming/total-costs)

If you’d like to learn more about Azure tags, check out the following resources:

- [Use tags to organize your Azure resources and management hierarchy](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources?tabs=json)

- [A video explaining the value of using Azure tags](https://www.youtube.com/watch?v=dUft4FZ40O8)

- [How tags are used in cost and usage data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data#how-tags-are-used-in-cost-and-usage-data)

- [Develop your naming and tagging strategy for Azure resources](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging)

- [Define your tagging strategy](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging)

- [Resource naming and tagging decision guide](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/decision-guides/resource-tagging/)

If you’d like to learn more about Azure Cost Management, check out the following
articles:

- [What is Azure Cost Management + Billing?](https://docs.microsoft.com/en-us/azure/cost-management-billing/cost-management-billing-overview)

- [Quickstart: Explore and analyze costs with cost analysis](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/quick-acm-cost-analysis)
