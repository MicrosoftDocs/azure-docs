---
title: How to disable public access in Azure App Configuration
description: How to disable public access to your Azure App Configuration store.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: how-to 
ms.date: 03/24/2025
ms.custom: template-how-to
---

# Disable public access in Azure App Configuration

In this article, you'll learn how to disable public access for your Azure App Configuration store. Setting up private access can offer better security for your configuration store.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- We assume you already have an App Configuration store. If you want to create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

## Sign in to Azure

You will need to sign in to Azure first to access the App Configuration service.

### [Portal](#tab/azure-portal)

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

### [Azure CLI](#tab/azure-cli)

Sign in to Azure using the `az login` command in the [Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
az login
```

This command will prompt your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Disable public access to a store

Azure App Configuration offers four public access options:

- **Automatic**: Inbound public network access is enabled until you create a private endpoint for the store. Once a private endpoint exists, inbound public network access is automatically disabled. Outbound public network access is allowed. This option can only be selected when creating a store.
- **Enabled**: All networks can access the store over the public internet. Outbound public network access is allowed.
- **Disabled**: Inbound public network access is disabled. The store can only be reached through a private endpoint. Outbound public network access is allowed.
- **Secured by perimeter**: Inbound public network access is disabled. Only traffic from a private endpoint or traffic allowed by an associated network security perimeter can access the store. Outbound public network access is governed by the associated network security perimeter, or denied if no perimeter is associated. 

To disable access to the App Configuration store from public network, follow the process below.

### [Portal](#tab/azure-portal)

1. In your App Configuration store, under **Settings**, select **Networking**.
1. Under **Public Access**, select **Disabled** to disable public access to the App Configuration store and only allow access through private endpoints. If you already had public access disabled and instead wanted to enable public access to your configuration store, you would select **Enabled**.

   > [!NOTE]
   > Once you've switched **Public Access** to **Disabled** or **Enabled**, you won't be able to select **Public Access: Automatic** anymore, as this option can only be selected when creating the store.

1. Select **Apply**.

:::image type="content" source="media/disable-public-access.png" alt-text="Screenshot of the Azure portal disabling public access.":::

### [Azure CLI](#tab/azure-cli)

In the CLI, run the following code:

```azurecli-interactive
az appconfig update --name <name-of-the-appconfig-store> --public-network-access disabled
```

> [!NOTE]
> When you create an App Config store without specifying if you want public access to be enabled or disabled, public access is set to automatic by default. After you've modified the value using the `--public-network-access` flag, you won't be able to switch back to automatic public access anymore.

---

## Next steps

> [!div class="nextstepaction"]
> [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md)

> [!div class="nextstepaction"]
> [Set up private access to an Azure App Configuration store](howto-set-up-private-access.md)
