---
title: Manage an Astro resource through the Azure portal
description: This article describes management functions for Astro on the Azure portal.

ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 02/07/2025
---

# Manage your Astro  integration through the portal

## Single sign-on

Single sign-on (SSO) is already enabled when you created your Astro  resource. To access Astro through SSO, follow these steps:

1. Navigate to the Overview for your instance of the Astro resource. Select on the SSO Url.

   :::image type="content" source="media/astronomer-manage/astronomer-sso-overview.png" alt-text="Screenshot showing the Single Sign-on url in the  Overview pane of the Astro resource.":::

1. The first time you access this Url, depending on your Azure tenant settings, you might see a request to grant permissions and User consent. This step is only needed the first time you access the SSO Url.

   > [!NOTE]
   > If you are also seeing Admin consent screen then please check your [tenant consent settings](/azure/active-directory/manage-apps/configure-user-consent).
   >

1. Choose a Microsoft Entra account for the Single Sign-on. Once consent is provided, you're redirected to the Astro portal.

## Delete an Astro resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

## Next steps

[Troubleshoot Astro](troubleshoot.md)
