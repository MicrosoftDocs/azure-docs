---
title: How to add technical details for your SaaS offer 
description: Learn how to provide technical details for your software as a service (SaaS) offer in Microsoft Partner Center. 
author: mingshen-ms
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 08/30/2020
---

# How to add technical details for your SaaS offer

This article describes how to enter technical details that help the Microsoft commercial marketplace connect to your solution.

## Technical configuration

On the **Technical configuration** tab, you'll define the technical details that the commercial marketplace uses to communicate to your SaaS application or solution. This connection enables us to provision your offer for the end customer if they choose to acquire and manage it.

> [!NOTE]
> This tab is not visible if you choose to process transactions independently instead of selling your offer through Microsoft. If so, go to [Marketing options](create-new-saas-offer-marketing.md).

For more details about these settings, see [Technical configuration](plan-saas-offer.md#technical-information).

- **Landing page URL** (required) – Define the SaaS website URL (for example: `https://contoso.com/signup`) that customers will land on after acquiring your offer from the commercial marketplace and triggering the configuration process from the newly created SaaS subscription.

  > [!IMPORTANT]
  > The landing page you configure here should be up and running 24/7. This is the only way you will be notified about new purchases of your SaaS offers made in the commercial marketplace, or configuration requests of an active subscription of an offer.

- **Connection webhook** (required) – For all asynchronous events that Microsoft needs to send to you (for example, SaaS subscription has been canceled), we require you to provide a connection webhook URL. We will call this URL to notify you of the event.

  > [!IMPORTANT]
  > The webhook you provide should be up and running 24/7 as this is the only way you will be notified about updates about your customers' SaaS subscriptions that are purchased via the comercial marketplace.

- **Azure Active Directory tenant ID** (required) – To find the tenant ID for your Azure Active Directory (Azure AD) app, go to the [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) blade in Azure Active Directory. In the **Display name** column, select the app. Then look for the **Directory (tenant) ID** number listed (for example, `50c464d3-4930-494c-963c-1e951d15360e`).

- **Azure Active Directory application ID** (required) – To find your [application ID](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in), go to the [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) blade in Azure Active Directory. In the **Display name** column, select the app. Then look for the Application (client) ID number listed (for example, `50c464d3-4930-494c-963c-1e951d15360e`).

Select **Save draft** before continuing to the next tab: Plan overview.

## Next steps

- To configure one or more plans, see [How to create plans for your SaaS offer](create-new-saas-offer-plans.md).
