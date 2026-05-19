---
title: Associate Azure App Configuration with a network security perimeter
description: Learn how to associate a network security perimeter with your Azure App Configuration store using the Azure portal or Azure CLI.
services: azure-app-configuration
author: austintolani
ms.author: austintolani
ms.service: azure-app-configuration
ms.topic: how-to
ms.date: 05/18/2026
ms.custom: template-how-to, devx-track-azurecli
---

# Associate Azure App Configuration with a network security perimeter

In this article, you learn how to associate your Azure App Configuration store with a [network security perimeter](../private-link/network-security-perimeter-concepts.md). For more information, see [Network security perimeter for Azure App Configuration](./concept-network-security-perimeter.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An App Configuration store. If you need to create one, see [Create an App Configuration store](quickstart-aspnet-core-app.md).
- An existing network security perimeter. If you need to create one, see [Create a network security perimeter in the Azure portal](../private-link/create-network-security-perimeter-portal.md).

## Sign in to Azure

You need to sign in to Azure to access the App Configuration service.

### [Portal](#tab/azure-portal)

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

### [Azure CLI](#tab/azure-cli)

Sign in to Azure using the `az login` command in the [Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
az login
```

This command will prompt your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign-in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Associate your configuration store with a network security perimeter

Use the portal or Azure CLI to create an association between your configuration store and an existing network security perimeter.

### [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/), navigate to your App Configuration store. Under **Settings**, select **Networking**.

1. Under **Network security perimeter (preview)**, select **Associate**.

1. In the **Associate a network security perimeter** pane, select a network security perimeter and a profile from the dropdown, then select **Associate**.

   :::image type="content" source="./media/network-security-perimeter/associate-nsp.png" alt-text="Screenshot of the Azure portal, showing the Associate a network security perimeter pane for an App Configuration store." lightbox="./media/network-security-perimeter/associate-nsp.png":::

### [Azure CLI](#tab/azure-cli)

1. Run the following command to get the resource ID of your App Configuration store. Replace `<app-config-store-name>` and `<resource-group>` with the name of your store and resource group.

    ```azurecli-interactive
    az appconfig show --name <app-config-store-name> --resource-group <resource-group> --query id --output tsv
    ```

    Note down the resource ID from the output. For example: `/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MyResourceGroup/providers/Microsoft.AppConfiguration/configurationStores/MyAppConfigStore`.

1. Run the following command to associate your configuration store with the network security perimeter. Replace the placeholder values with your own information.

    ```azurecli-interactive
    az network perimeter association create --name <association-name> --perimeter-name <nsp-name> -g <nsp-resource-group> --access-mode Enforced --private-link-resource "{id:<app-config-resource-id>}" --profile "{id:<nsp-profile-resource-id>}"
    ```

    > [!div class="mx-tdBreakAll"]
    > | Placeholder | Description | Example |
    > |---|---|---|
    > | `<association-name>` | A name for the new association resource. | `app-config-association` |
    > | `<nsp-name>` | The name of your network security perimeter. | `MyNSP` |
    > | `<nsp-resource-group>` | The resource group of your network security perimeter. | `MyNSPResourceGroup` |
    > | `<app-config-resource-id>` | The resource ID of your App Configuration store from the previous step. | `/subscriptions/.../MyAppConfigStore` |
    > | `<nsp-profile-resource-id>` | The resource ID of the network security perimeter profile to associate with. | `/subscriptions/.../profiles/defaultProfile` |

    > [!TIP]
    > The `--access-mode` parameter can be set to `Learning` or `Enforced`. Start with `Learning` mode to validate your access rules before switching to `Enforced` mode. For more information, see [Transitioning to a network security perimeter](./concept-network-security-perimeter.md#transitioning-to-a-network-security-perimeter).

---

> [!NOTE]
> Allow up to 15 minutes for any changes to network security perimeter configuration to take effect.

If you encounter errors while associating your configuration store with a network security perimeter, see [Troubleshooting](./concept-network-security-perimeter.md#troubleshooting) for guidance on resolving common issues.

## Verify the association

After associating the configuration store with the network security perimeter, you can verify the association by checking the **Networking** settings of your App Configuration store.

### [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/), navigate to your App Configuration store. Under **Settings**, select **Networking**.

1. Under **Network security perimeter**, select **Manage**.

1. Review the network security perimeter configuration to confirm that your configuration store is associated with the expected perimeter and profile.

### [Azure CLI](#tab/azure-cli)

Run the following command to view the network security perimeter configuration for your configuration store.

```azurecli-interactive
az appconfig network-security-perimeter-configuration list --name <app-config-store-name> --resource-group <resource-group>
```

---

## Related content

- [Network security perimeter for Azure App Configuration](./concept-network-security-perimeter.md)
- [Network security overview for Azure App Configuration](./concept-network-security.md)
- [What is Azure network security perimeter?](../private-link/network-security-perimeter-concepts.md)
