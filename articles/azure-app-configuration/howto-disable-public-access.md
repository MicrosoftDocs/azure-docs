---
title: How to disable public access in Azure App Configuration
description: How to disable public access and create a private endpoint for an Azure App Configuration store.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: how-to 
ms.date: 05/18/2022
ms.custom: template-how-to
---

# Disable public access in Azure App Configuration

In this article, you'll learn how to disable public access for your Azure App Configuration store. Setting up private access can offer a better security for your configuration store. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- We assume you already have an App Configuration store. If you want to create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

## Disable public access to an App Configurations store

To disable access to the App Configuration store from public network, follow the process below.

1. In your App Configuration store, under **Settings**, select **Networking**. Azure App Configuration offers three public access options:
   - Automatic public access: public network access is enabled, as long as you don't have a private endpoint present. Once you create a private endpoint, App Configuration disables public network access and enables private access. This option can only be selected when creating the store.
   - Disabled: public access is disabled and no traffic can access this resource unless it's through a private endpoint.
   - Enabled: all networks can access this resource.
1. Under **Public Access**, select **Disabled** to disable public access to the App Configuration store and only allow access through private endpoints. If you already had public access disabled and instead wanted to enable public access to your configuration store, you would select **Enabled**. 

   > [!NOTE]
   > Once you've switched **Public Access** to **Disabled** or **Enabled**, you won't be able to select **Public Access: Automatic** anymore, as this option can only be selected when creating the store.

1. Select **Apply**.

:::image type="content" source="media/disable-public-access.png" alt-text="Screenshot of the Azure portal disabling public access":::

## Next steps

Now that you have disabled public access, it's time to set up a private access endpoint.

> [!div class="nextstepaction"]
>[Using private endpoints for Azure App Configuration](./concept-private-endpoint.md)
