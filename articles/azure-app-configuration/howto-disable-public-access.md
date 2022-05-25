---
title: How to disable public access in Azure App Configuration
description: How to disable public access to your Azure App Configuration store.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: how-to 
ms.date: 05/25/2022
ms.custom: template-how-to
---

# Disable public access in Azure App Configuration

In this article, you'll learn how to disable public access for your Azure App Configuration store. Setting up private access can offer a better security for your configuration store.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- We assume you already have an App Configuration store. If you want to create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

## Sign in to Azure

First, sign in to the Azure portal.

### [Portal](#tab/azure-portal)

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

### [Azure CLI](#tab/azure-cli)

Sign in to the Azure portal using the `az login` command in the [Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
az login
```

This command will prompt your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Disable public access to a store

Azure App Configuration offers three public access options:

- Automatic public access: public network access is enabled, as long as you don't have a private endpoint present. Once you create a private endpoint, App Configuration disables public network access and enables private access. This option can only be selected when creating the store.
- Disabled: public access is disabled and no traffic can access this resource unless it's through a private endpoint.
- Enabled: all networks can access this resource.

To disable access to the App Configuration store from public network, follow the process below.

### [Portal](#tab/azure-portal)

1. In your App Configuration store, under **Settings**, select **Networking**.
1. Under **Public Access**, select **Disabled** to disable public access to the App Configuration store and only allow access through private endpoints. If you already had public access disabled and instead wanted to enable public access to your configuration store, you would select **Enabled**.

   > [!NOTE]
   > Once you've switched **Public Access** to **Disabled** or **Enabled**, you won't be able to select **Public Access: Automatic** anymore, as this option can only be selected when creating the store.

1. Select **Apply**.

:::image type="content" source="media/disable-public-access.png" alt-text="Screenshot of the Azure portal disabling public access":::

### [Azure CLI](#tab/azure-cli)

In the CLI, run the following code:

```azurecli-interactive
az appconfig update --name "<name-of-the-appconfig-store>" --enable-public-network false
```

> [!NOTE]
> Once you've run the `--enable-public-network` command and switched the public network to `true` or `false`, you won't be able to switch to an automatic public access anymore, as this option can only be selected when creating the store.

---

## Next steps

> [!div class="nextstepaction"]
>[Using private endpoints for Azure App Configuration](./concept-private-endpoint.md)
