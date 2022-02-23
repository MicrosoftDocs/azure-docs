---
title: Protect your static web app with a password
description: Prevent unauthorized access to your static web app with a password.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 02/23/2022
ms.author: cshoe
---

# Configure password protection

You can use a password to protect your app's pre-production environments or all environments. Scenarios when password protection is useful include:

- Limiting access to your static web app to people who you've given the password to
- Protecting your static web app's staging environments

Password protection is a lightweight feature that offers a limited level of security. To secure your app using an identity provider, use the integrated [Static Web Apps authentication](authentication-authorization.md). You can also restrict access to your app using [IP restrictions](configuration.md#networking) or a [private endpoint](private-endpoint.md).

## Prerequisites

- An existing static web app in the Standard plan

## Enable password protection

1. Open your static web app in the Azure portal.

1. Under _Settings_ menu, select **Configuration**.

1. Select the **General settings** tab.

1. In the _Password protection_ section, select **Protect staging environments only** to protect only your app's pre-production environments or select **Protect both production and staging environments** to protect all environments.

    :::image type="content" source="media/password-protection/portal-enable.png" alt-text="Enable password protection":::

1. Enter a password in **Visitor password**. Passwords must be at least eight characters long and contain a capital letter, a lowercase letter, a number, and a symbol.

1. Enter the same password in **Confirm visitor password**.

1. Select the **Save** button.

When visitors first navigate to a protected environment, they're prompted to enter the password before they can view the site.

:::image type="content" source="media/password-protection/password-prompt.png" alt-text="Password prompt":::

## Next Steps

> [!div class="nextstepaction"]
> [Authentication and authorization](./authentication-authorization.md)
