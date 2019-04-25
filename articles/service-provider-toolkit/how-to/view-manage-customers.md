---
title: View and manage customers and delegated resources in the Azure portal
description: As a service provider using Azure Delegated Resource Management, you can view all of your delegated customer resources and subscriptions by going to My customers in the Azure portal. 
author: JnHs
ms.author: jenhayes
ms.service: service-provider-toolkit
ms.date: 04/03/2019
ms.topic: overview
manager: carmonm
---

# View and manage customers and delegated resources

> [!IMPORTANT]
> Azure Delegated Resource Management is currently in limited public preview. The info in this topic may change before general availability.

In this article, you'll learn how, as a service provider using [Azure Delegated Resource Management](../concepts/azure-delegated-resource-management.md), you can view all of your delegated customer resources and subscriptions by going to **My customers** in the [Azure portal](https://portal.azure.com). While we'll refer to service providers and customers here, enterprises managing multiple tenants can use the same process to consolidate their management experience.

To access the **My customers** page in the Azure portal, select **All services**, then search for **My customers** and select it. You can also find it by entering “Service providers” in the search box near the top of the Azure portal.

> [!NOTE]
> Your customers can view info about service providers by navigating to **Service providers** in the Azure portal. For more info, see [View and manage service providers](view-manage-service-providers.md).

## View and manage customer details

To view customer details, select **Customers** on the left side of the **My customers** page.

For each customer, you'll see the customer's name, tenant ID, and the name of the offer associated with the engagement. In the **Role assignments** column, you'll see the name of their delegated subscription (or the number of subscriptions that they've delegated) and/or the name of any delegated resource groups (or the number of delegated resource groups).

Filters at the top of the page let you sort and group your customer info or filter by specific customers, offers, or keywords.

You can view the following info from this page:

- To see all of the subscriptions, offers, and access assignments associated with a customer, select the customer's name.
- To see more details about an offer and the access assignments that are associated with it, select the offer name.
- To view more details about access assignments for delegated subscriptions or resource groups, select its name (or the count number, in the case of multiple delegated subscriptions and/or resource groups).

## View access assignments

Access assignments represent the users and permissions that have access to delegated subscriptions. To view this info, select **Access assignments** on the left side of the **My customers** page.

Filters at the top of the page let you sort and group your access assignment info or filter by specific customers, offers, or keywords.

The access assignments associated with each delegated subscription appear in the **Role assignments** column. You can select each entry to view the full list of users, groups, and service principals that have been granted access to a subscription. From there, you can select a particular user, group, or service principal name to get more details.

## Work in the context of a delegated subscription

You can work directly in the context of a delegated subscription within the Azure portal, without switching the directory you're working in. To do so:

1. Select the **Directory + Subscription** icon near the top of the Azure portal.
1. In the **Global subscription** filter, ensure that only the box for that delegated subscription is selected. (Do not change your working directory.)

If you then access a service which supports [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md), the service will default to the context of the delegated subscription that you selected. You can change this by following the steps above and checking the **Select all** box (or choosing one or more subscriptions to work in instead).

> [!NOTE]
> If you have been granted access to one or more resource groups, rather than access to an entire subscription, you can select the subscription to which that resource group belongs. You'll then work in the context of that subscription, but will only be able to access the designated resource groups(s).

You can also access functionality related to delegated subscriptions or resource groups from within services that support cross-tenant management experiences by selecting the subscription or resource group from within that service.

## Next steps
- Learn about the [cross-tenant management experience](../concepts/cross-tenant-management-experience.md).
- Learn how your customers can [view and manage service providers](view-manage-service-providers.md) by going to **Service providers** in the Azure portal.