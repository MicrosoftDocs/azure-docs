---
title: Move Azure resources across resource groups, subscriptions, or regions.
description: Overview of Azure resource types that can be moved across resource groups, subscriptions, or regions.
ms.topic: conceptual
ms.date: 01/30/2023
---

# Move Azure resources across resource groups, subscriptions, or regions

Azure resources can be moved to a new resource group or subscription, or across regions.

## Move resources across resource groups or subscriptions

You can move Azure resources to either another Azure subscription or another resource group under the same subscription. You can use the Azure portal, Azure PowerShell, Azure CLI, or the REST API to move resources. To learn more, see [Move resources to a new resource group or subscription](move-resource-group-and-subscription.md).

The move operation doesn't support moving resources to new [Azure Active Directory tenant](../../active-directory/develop/quickstart-create-new-tenant.md). If the tenant IDs for the source and destination subscriptions aren't the same, use the following methods to reconcile the tenant IDs:

* [Transfer ownership of an Azure subscription to another account](../../cost-management-billing/manage/billing-subscription-transfer.md)
* [How to associate or add an Azure subscription to Azure Active Directory](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)

### Upgrade a subscription

If you actually want to upgrade your Azure subscription (such as switching from free to pay-as-you-go), you need to convert your subscription.

- To upgrade a free trial, see [Upgrade your Free Trial or Microsoft Imagine Azure subscription to Pay-As-You-Go](../../cost-management-billing/manage/upgrade-azure-subscription.md).
- To change a pay-as-you-go account, see [Change your Azure Pay-As-You-Go subscription to a different offer](../../cost-management-billing/manage/switch-azure-offer.md).

If you can't convert the subscription, [create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md). Select **Subscription Management** for the issue type.

## Move resources across regions

Azure geographies, regions, and availability zones form the foundation of the Azure global infrastructure. Azure [geographies](https://azure.microsoft.com/global-infrastructure/geographies/) typically contain two or more [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/). A region is an area within a geography, containing Availability Zones, and multiple data centers.

After you deploy resources to a specific Azure region, there are many reasons that you might want to move resources to a different region.

- **Align to a region launch**: Move your resources to a newly introduced Azure region that wasn't previously available.
- **Align for services/features**: Move resources to take advantage of services or features that are available in a specific region.
- **Respond to business developments**: Move resources to a region in response to business changes, such as mergers or acquisitions.
- **Align for proximity**: Move resources to a region local to your business.
- **Meet data requirements**: Move resources to align with data residency requirements, or data classification needs. [Learn more](https://azure.microsoft.com/mediahandler/files/resourcefiles/achieving-compliant-data-residency-and-security-with-azure/Achieving_Compliant_Data_Residency_and_Security_with_Azure.pdf).
- **Respond to deployment requirements**: Move resources that were deployed in error, or move in response to capacity needs.
- **Respond to decommissioning**: Move resources because of decommissioned regions.

### Move resources with Resource Mover

You can move resources to a different region with [Azure Resource Mover](../../resource-mover/overview.md). Resource Mover provides:

- A single hub for moving resources across regions.
- Reduced move time and complexity. Everything you need is in a single location.
- A simple and consistent experience for moving different types of Azure resources.
- An easy way to identify dependencies across resources you want to move. This identification helps you to move related resources together, so that everything works as expected in the target region, after the move.
- Automatic cleanup of resources in the source region, if you want to delete them after the move.
- Testing. You can try out a move, and then discard it if you don't want to do a full move.

You can move resources to another region using a couple of different methods:

- **Start moving resources from a resource group**: With this method, you kick off the region move from within a resource group. After selecting the resources you want to move, the process continues in the Resource Mover hub, to check resource dependencies, and orchestrate the move process. [Learn more](../../resource-mover/move-region-within-resource-group.md).
- **Start moving resources directly from the Resource Mover hub**: With this method, you kick off the region move process directly in the hub. [Learn more](../../resource-mover/tutorial-move-region-virtual-machines.md).

## Next steps

- To check if a resource type supports being moved, see [Move operation support for resources](move-support-resources.md).
- To learn more about the region move process, see [About the move process](../../resource-mover/about-move-process.md).
