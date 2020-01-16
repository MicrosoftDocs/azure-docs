---
title: View and manage service providers
description: Customers can use the Service providers page in the Azure portal to view info about service providers, service provider offers, and delegated resources.
ms.date: 01/15/2020
ms.topic: conceptual
---
# View and manage service providers

Customers can use the **Service providers** page in the [Azure portal](https://portal.azure.com) to view info about service providers and service provider offers, delegate specific resources through [Azure delegated resource management](../concepts/azure-delegated-resource-management.md), and shop for additional service provider offers. While we'll refer to service providers and customers here, enterprises managing multiple tenants can use the same process to consolidate their management experience.

To access the **Service providers** page in the Azure portal, the customer can select **All services**, then search for **Service providers** and select it. They can also find it by entering “Service providers” in the search box near the top of the Azure portal.

Keep in mind that the **Service providers** page only shows info about the service providers which have access to the customer's subscriptions or resource groups through Azure delegated resource management. If a customer works with additional service providers who don't use Azure delegated resource management to access the customer's resources, info about those service providers is not shown here.

> [!NOTE]
> Service providers can view info about their customers by navigating to **My customers** in the Azure portal. For more info, see [View and manage customers and delegated resources](view-manage-customers.md).

## View service provider details

To view info about the service provider(s) that a customer is working with, they can select **Provider offers** on the left side of the **Service providers** page.

For each service provider offer, the customer will see the service provider's name and the offer associated with it, along with the name that the customer entered during the onboarding process.

In the **Delegations** column, the customer sees how many subscriptions and/or resource groups have been delegated to the service provider for that offer. The service provider will be able to access and manage these subscriptions and/or resource groups according to the access levels specified in the offer.

## Delegate resources

Before a service provider can access and manage a customer's resources, they must be delegated. If a customer has accepted an offer but has not yet delegated any resources, they'll see a note at the top of the **Provider offers** section. This lets the customer know that they need to take action before the service provider can access any of the customer's resources.

To delegate subscriptions or resource groups:

1. Check the box for the row containing the service provider, offer, and name. Then select **Delegate resources** at the top of the screen.
1. In the **Offer details** section of the **Delegate resources** page, review the details about the service provider and offer. To review role assignments for the offer, select **Click here to see the details of the selected offer**.
1. In the **Delegate** section, select **Delegate subscriptions** or **Delegate resource groups**.
1. Choose the subscriptions and/or resource groups you'd like to delegate for this offer, then select **Add**.
1. Select the checkbox at the bottom of the page to confirm that you want to grant this service provider access to the resources that you've selected, then select **Delegate**.

## Add or remove service provider offers

A customer can add a new service provider offer from the **Provider offers** page by selecting **Add offer**. The service provider must have published an offer for this customer. The customer can then select that offer from the **Private offers** screen and then select **Create**.

If the customer wants to remove a service provider offer, they can select the trash can icon in the row for that offer. After confirming the deletion, that service provider will no longer have access to the customer resources that were formerly delegated for that offer.

## Update service provider offers

After a customer has added an offer, a service provider may publish an updated version of the same offer to Azure Marketplace. For example, they may want to add a new role definition. If a new version of the offer has been published, the **Provider offers** page will show an "update" icon in the row for that offer. The customer can select this icon to see the differences between the current version of the offer and the new one.

 ![Update offer icon](../media/update-offer.jpg)

After reviewing the changes, the customer can choose to update to the new version. Once they do, the authorizations and other settings specified in the new version will apply to any subscriptions and/or resource groups that have been delegated for that offer.

## View delegations

Delegations represent the role assignments that grant permissions to the service provider for the resources a customer has delegated. To view this info, select **Delegations** on the left side of the **Service providers** page.

Filters at the top of the page let you sort and group your delegation info or filter by specific customers, offers, or keywords.

> [!NOTE]
> Customers will not see these role assignments, or any users from the service provider tenant who have been granted these roles, when [viewing role assignment info for the delegated scope in the Azure portal](../../role-based-access-control/role-assignments-list-portal.md#list-role-assignments-at-a-scope) or via APIs.

## Next steps

- Learn more about [Azure Lighthouse](../overview.md).
- Learn how service providers can [view and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.