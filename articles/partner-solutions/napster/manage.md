---
title: Manage a Napster Companion API resource in Azure (preview)
description: Learn how to manage your Napster Companion API resource in the Azure portal, including resource overview, single sign-on setup, and deletion steps.
author: shijoy
ms.author: shijoy
ms.topic: how-to
ms.custom:
  - ignite-2026
ms.date: 05/20/2026
#customer intent: As an Azure administrator, I want to manage the lifecycle of my Napster Companion API resource so that I can configure access, monitor it, and delete it when no longer needed.
---

# Manage a Napster Companion API resource (preview)

This article describes how to manage the settings for your Napster Companion API resource in the Azure portal. You learn how to navigate the resource overview, use single sign-on to access the Companion API Dashboard, and delete a resource.

## Resource overview

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of a Napster Companion API resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

The *Essentials* details include:

- Resource group
- Location
- Subscription
- Subscription ID
- Tags
- Plan
- Status
- SSO Url

To manage your resource, select the links next to corresponding details.

Below the essentials, you can navigate to other details about your resource.

Select the **Go to Napster Companion API** button to create and manage your AI Omniagents.

Select the **Getting Started Docs** link to read [Napster's documentation](https://developers.napster.com) for more information on how to get started.

## Single sign-on

Single sign-on (SSO) is already enabled when you created your Napster Companion API resource.

To access Napster Companion API using single sign-on, select the SSO Url link in the *Essentials* details from the Resource overview.

> [!NOTE]
>
> - The first time you access this URL, you might see a request to grant permissions and user consent. This step is only needed the first time you access the SSO URL.
> - If you're also seeing the Admin consent screen, check your [tenant consent settings](/entra/identity/enterprise-apps/configure-user-consent).

Choose a Microsoft Entra account for the single sign-on. Once consent is provided, you're redirected to the Napster Companion API Dashboard.

## Delete a Napster Companion API resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

## Get support

To contact support about Napster Companion API, select **Help + support** in the left pane of the Azure portal and select the Napster Companion API service.

Then on the left side of the Napster Companion API service find the **Help** button, then select **Support + Troubleshooting**.

Next, select the **Contact Napster Companion API - An Azure Native ISV Service Support** button.

Alternatively, reach out directly to the Napster help center at [help.napster.com](https://help.napster.com).

## Next steps

[Napster Companion API resources and developer tools](tools.md)
