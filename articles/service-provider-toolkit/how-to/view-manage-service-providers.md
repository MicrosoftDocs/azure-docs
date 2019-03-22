---
title: View and manage service providers in the Azure portal
description: As a service provider using Azure Delegated Resource Management, your customers can view info about the resources they have delegated by going to My customers in the Azure portal. 
author: JnHs
ms.author: jenhayes
ms.service: service-provider-toolkit
ms.date: 04/03/2019
ms.topic: overview
manager: carmonm
---
# View and manage service providers

> [!IMPORTANT]
> Azure Delegated Resource Management is currently in limited public preview. The info in this topic may change before general availability.

In this article, you'll learn how, as a service provider using [Azure Delegated Resource Management](../concepts/azure-delegated-resource-management.md), your customers can view info about the resources they have delegated by going to **Service providers** in the [Azure portal](https://portal.azure.com).

To access the **Service providers** page in the Azure portal, the customer can select **All services**, then search for **Service providers** and select it. They can also find it by entering “Service providers” in the search box near the top of the Azure portal.

> [!NOTE]
> Service providers can view info about their customers by navigating to **My customers** in the Azure portal. For more info, see [View and manage customers and delegated resources](view-manage-customers.md).

## View service provider details

To view info about the service provider(s) that a customer is working with, they can select **Providers** on the left side of the **Service providers** page.

For each service provider, the customer will see the provider’s name and the offer associated with it, along with the description of that offer that the service provider included.

In the **Managed** column, the customer sees how many subscriptions have been delegated to the provider as part of that offer.

## Delegate resources for offers

Before a service provider can access and manage a customer’s resources, they must be delegated. If a customer has accepted an offer but has not yet delegated any resources, they’ll see a note at the top of the **Providers** section.

To delegate a resource for an offer:

1. Check the box for the row containing the offer, then select **Delegate resources** at the top of the screen.
2. In the **Delegate resources** page, review the details about the service provider and the access assignments (user roles and permissions) associated with the offer.
3. Select the **Assignments** tab and then select **Delegate subscriptions** or **Delegate resource groups**.
4. Choose the subscriptions and/or resource groups you’d like to delegate for this offer, then select **Add**.
5. Select the **Review terms** tab (or select **Review and create request** at the bottom of the screen).
6. Select the checkbox at the bottom of the page to confirm that you want to grant this provider access to the resources that you’ve selected, then select **Create request**.

## Add or remove service providers

A customer can add a new service provider from the **Providers** page by selecting **Add provider**. The service provider must have published an offer for this customer. The customer can then select that offer from the **Private offers** screen and then select **Create**.

If the customer wants to remove a provider, they can select the trash can icon in the row for that provider. After confirming that they want to delete the selected provider, that provider will no longer have access to the customer resources that were formerly delegated.

## View access assignments

Access assignments represent the permissions that the service provider has for the resources you’ve delegated. To view this info, select **Access assignments** on the left side of the **Service providers** page.

Filters at the top of the page let you sort and group your access assignment info or filter by specific customers, offers, or keywords.
