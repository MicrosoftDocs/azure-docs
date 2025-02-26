---
title: Manage an Astro resource through the Azure portal
description: This article describes management functions for Astro on the Azure portal.

ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 02/07/2025
---

# Manage an Astro resource

This article describes how to manage the settings for Astro resources.

## Resource overview 

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of an Astro resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

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

Select the **Go to Astro** button to create and manage your Airflow Deployments.

Select the **Getting Started Docs** link to read [Astronomer's documentation](https://www.astronomer.io/docs/astro/run-first-dag/) for more information on how to get started.

## Single sign-on

Single sign-on (SSO) is already enabled when you created your Astro  resource.

To access Astro using single sign-on, select the SSO Url link in the *Essentials* details from the Resource overview.

> [!NOTE]
> 
> - The first time you access this Url you might see a request to grant permissions and User consent. This step is only needed the first time you access the SSO Url.
> - If you're also seeing Admin consent screen, check your [tenant consent settings](/azure/active-directory/manage-apps/configure-user-consent).

Choose a Microsoft Entra account for the single sign-on. Once consent is provided, you're redirected to the Astro portal.

## Delete an Astro resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

## Next steps

[Troubleshoot Astro](troubleshoot.md)
