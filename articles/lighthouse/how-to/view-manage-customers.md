---
title: View and manage customers and delegated resources
description: As a service provider using Azure delegated resource management, you can view all of your delegated customer resources and subscriptions by going to My customers in the Azure portal. 
ms.date: 01/22/2020
ms.topic: conceptual
---

# View and manage customers and delegated resources

Service providers using [Azure delegated resource management](../concepts/azure-delegated-resource-management.md) can use the **My customers** page in the [Azure portal](https://portal.azure.com) to view delegated customer resources and subscriptions. While we'll refer to service providers and customers here, enterprises managing multiple tenants can use the same process to consolidate their management experience.

To access the **My customers** page in the Azure portal, select **All services**, then search for **My customers** and select it. You can also find it by entering “My customers” in the search box near the top of the Azure portal.

Keep in mind that the top **Customers** section of the **My customers** page only shows info about customers who have delegated subscriptions or resource groups. If you work with other customers (such as through the [Cloud Solution Provider program](https://docs.microsoft.com/partner-center/csp-overview), you won’t see info about those customers in the **Customers** section unless you have onboarded their resources for Azure delegated resource management.

Lower on the page, a separate section called **Cloud Solution Provider (Preview)** shows billing info and resources for your CSP customers who have [signed the Microsoft Customer Agreement (MCA)](https://docs.microsoft.com/partner-center/confirm-customer-agreement) and are [under the Azure plan](https://docs.microsoft.com/partner-center/azure-plan-get-started). For more info, see [Get started with your Microsoft Partner Agreement billing account](../../billing/mpa-overview.md). Note that such CSP customers appear in this section whether or not you have also onboarded them for Azure delegated resource management. Similarly, a CSP customer does not have to appear in the **Cloud Solution Provider (Preview)** section of **My customers** in order for you to onboard them for Azure delegated resource management.

> [!NOTE]
> Your customers can view info about service providers by navigating to **Service providers** in the Azure portal. For more info, see [View and manage service providers](view-manage-service-providers.md).

## View and manage customer details

To view customer details, select **Customers** on the left side of the **My customers** page.

For each customer, you'll see the customer's name, customer ID (tenant ID), and the offer associated with the engagement. In the **Delegations** column, you'll see the number of delegated subscriptions and/or the number of delegated resource groups.

> [!IMPORTANT]
> In order to see a delegation, users must have been granted the [Reader](../../role-based-access-control/built-in-roles.md#reader) role (or another built-in role which includes Reader access) in the onboarding process.

Filters at the top of the page let you sort and group your customer info or filter by specific customers, offers, or keywords.

You can view the following info from this page:

- To see all of the subscriptions, offers, and delegations associated with a customer, select the customer's name.
- To see more details about an offer and its delegations, select the offer name.
- To view more details about role assignments for delegated subscriptions or resource groups, select the entry in the **Delegations** column.

## View and manage delegations

Delegations show the subscription/resource group that has been delegated , along with the users and permissions that have access to it. To view this info, select **Delegations** on the left side of the **My customers** page.

Filters at the top of the page let you sort and group your access assignment info or filter by specific customers, offers, or keywords.

### View role assignments

The users and permissions associated with each delegation appear in the **Role assignments** column. You can select each entry to view the full list of users, groups, and service principals that have been granted access to the subscription or resource group. From there, you can select a particular user, group, or service principal name to get more details.

### Remove delegations

If you included users with the [Managed Services Registration Assignment Delete Role](../../role-based-access-control/built-in-roles.md#managed-services-registration-assignment-delete-role) when onboarding a customer for Azure delegated resource management, those users can remove a delegation by selecting the trash can icon that appears in the row for that delegation. When they do so, no users in the service provider's tenant will be able to access the resources that had been previously delegated.


## Work in the context of a delegated subscription

You can work directly in the context of a delegated subscription within the Azure portal, without switching the directory you're working in. To do so:

1. Select the **Directory + Subscription** icon near the top of the Azure portal.
2. In the **Global subscription** filter, ensure that only the box for that delegated subscription is selected. You can use the **Current + delegated directories** drop-down box to show only subscriptions within a specific directory. (Do not use the **Switch directory** option, since that changes the directory to which you're signed in.)

If you then access a service which supports [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md), the service will default to the context of the delegated subscription that you selected. You can change this by following the steps above and checking the **Select all** box (or choosing one or more subscriptions to work in instead).

> [!NOTE]
> If you have been granted access to one or more resource groups, rather than access to an entire subscription, you can select the subscription to which that resource group belongs. You'll then work in the context of that subscription, but will only be able to access the designated resource groups.

You can also access functionality related to delegated subscriptions or resource groups from within services that support cross-tenant management experiences by selecting the subscription or resource group from within that service.

## Next steps

- Learn about [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).
- Learn how your customers can [view and manage service providers](view-manage-service-providers.md) by going to **Service providers** in the Azure portal.
