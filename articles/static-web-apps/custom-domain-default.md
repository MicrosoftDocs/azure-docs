---
title: Manage the default domain in Azure Static Web Apps
description: Learn to set and unset a default domain in Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 02/10/2022
ms.author: cshoe
---

# Manage the default domain in Azure Static Web Apps

Your static web app can be accessed using its automatically generated domain and any custom domains that you've configured. Optionally, you can configure your app to redirect all traffic to a default domain.

## Set a default domain

When you designate a custom domain as your app's default domain, requests to other domains are automatically redirected to the default domain. Only one custom domain can be set as the default.

Follow the below steps to set a custom domain as default.

1. With your static web app opened in the Azure portal, select **Custom domains** in the menu.

1. Select the custom domain you want to configure as the default domain.

1. Select **Set default**.

   :::image type="content" source="media/custom-domain/set-default.png" alt-text="Set a custom domain as the default":::

1. After the operation completes, refresh the table to confirm your domain is marked as "default".

## Unset a default domain

To stop domains redirecting to a default domain, follow the below steps.

1. With your static web app opened in the Azure portal, select **Custom domains** in the menu.

1. Select the custom domain you configured as the default.

1. Select **Unset default**.

1. After the operation completes, refresh the table to confirm that no domains are marked as "default".

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](authentication-authorization.md)
