---
title: Provide technical details for your SaaS offer 
description: How to provide technical details for your software  as a service (SaaS) offer in Microsoft Partner Center. 
author: mingshen-ms
ms.author: mingshen
ms.reviewer: dannyevers
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 07/31/2020
---

# Provide technical details for your SaaS offer

This article describes how to enter technical details that help the Microsoft commercial marketplace connect to your solution.

On the **Technical configuration** tab, you'll define the technical details that the commercial marketplace uses to communicate to your SaaS application or solution. This connection enables us to provision your offer for the end customer if they choose to acquire and manage it.

> [!NOTE]
> This tab is not visible if you choose to process transactions independently instead of selling your offer through Microsoft. If so, go to [Marketing options](create-new-saas-offer-marketing.md).

For details about these settings, see [Technical configuration](plan-saas-offer.md#gather-information-for-the-technical-configuration-tab).

- **Landing page URL** (required) – Define the SaaS website URL (for example: `https://contoso.com/signup`) that customers will land on after acquiring your offer from the marketplace and triggering the configuration process from the newly created SaaS subscription.

  > [!IMPORTANT]
  > The landing page you configure here should be up and running 24/7. This is the only way you will be notified about new purchases of your SaaS offers made in the marketplace, or configuration requests of an active subscription of an offer.

- **Connection webhook** (required) – For all asynchronous events that Microsoft needs to send to you (for example, SaaS subscription has been cancelled), we require you to provide a connection webhook URL. We will call this URL to notify you of the event.

  > [!IMPORTANT]
  > The webhook you provide should be up and running 24/7 as this is the only way you will be notified about updates about your customers' SaaS subscriptions that are purchased via the marketplace.

- **Azure Active Directory tenant ID** (required) – To find the tenant ID for your Azure Active Directory (Azure AD) app, go to the [App registrations](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) blade in Azure Active Directory. In the **Display name** column, select the app. Then look for the **Directory (tenant) ID** number listed (for example, `50c464d3-4930-494c-963c-1e951d15360e`).

- **Azure Active Directory application ID** (required) – You also need your [application ID](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in). To get its value, go to your Azure Active Directory and select **App registrations**, then look for the Application ID number listed (for example, `50c464d3-4930-494c-963c-1e951d15360e`).

Select **Save draft** before continuing to the next tab: **Plan overview**.

## Next steps

- If you are selling your SaaS offer through Microsoft, continue to [Create plans for your SaaS offer](create-new-saas-offer-plans.md).
- If you are managing your own commerce transactions, go to [Marketing options for your Saas offer](create-new-saas-offer-marketing.md).
