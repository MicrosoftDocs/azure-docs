---
title: How to disable public access in Azure App Configuration
description: How to disable public access to your Azure App Configuration store.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: how-to 
ms.date: 06/22/2026
ms.custom: template-how-to
---

# Disable public access in Azure App Configuration

In this article, you'll learn how to disable public access for your Azure App Configuration store. Setting up private access can offer better security for your configuration store.

## Prerequisites

- An existing Azure App Configuration store.

## Disable public access to a store

Azure App Configuration offers four public access options:

- **Automatic**: Inbound public network access is enabled until you create a private endpoint for the store. Once a private endpoint exists, inbound public network access is automatically disabled. Outbound public network access is allowed. This option can only be selected when creating a store.
- **Enabled**: All networks can access the store over the public internet. Outbound public network access is allowed.
- **Disabled**: Inbound public network access is disabled. The store can only be reached through a private endpoint. Outbound public network access is allowed.
- **Secured by perimeter**: Inbound public network access is disabled. Only traffic from a private endpoint or traffic allowed by an associated network security perimeter can access the store. Outbound public network access is governed by the associated network security perimeter, or denied if no perimeter is associated. 

To disable access to the App Configuration store from public network, follow the process below.

### [Portal](#tab/azure-portal)

1. In your App Configuration store, under **Settings**, select **Networking**.
1. Under **Public Access**, select **Manage**.
1. Under **Public network access**, select **Disabled** to disable public access to the App Configuration store and only allow access through private endpoints. If you already had public access disabled and instead wanted to enable public access to your configuration store, you would select **Enabled**.

   > [!NOTE]
   > Once you've switched **Public Access** to **Disabled** or **Enabled**, you won't be able to select **Public Access: Automatic** anymore, as this option can only be selected when creating the store.

1. Select **Apply**.

:::image type="content" source="media/disable-public-access.png" alt-text="Screenshot of the Azure portal disabling public access.":::

### [Azure CLI](#tab/azure-cli)

If needed, sign in first by using `az login`.

Run the following command:

```azurecli-interactive
az appconfig update --name <AppConfigurationStoreName> --public-network-access disabled
```

> [!NOTE]
> When you create an App Config store without specifying if you want public access to be enabled or disabled, public access is set to automatic by default. After you've modified the value using the `--public-network-access` flag, you won't be able to switch back to automatic public access anymore.

---

## Next steps

> [!div class="nextstepaction"]
> [Use private endpoints for Azure App Configuration](./concept-private-endpoint.md)

> [!div class="nextstepaction"]
> [Set up private access to an Azure App Configuration store](howto-set-up-private-access.md)
