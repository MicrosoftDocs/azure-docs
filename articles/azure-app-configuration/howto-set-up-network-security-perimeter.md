---
title: Associate Azure App Configuration with a network security perimeter
description: Learn how to associate a network security perimeter with your Azure App Configuration store using the Azure CLI.
services: azure-app-configuration
author: austintolani
ms.author: austintolani
ms.service: azure-app-configuration
ms.topic: how-to
ms.date: 05/18/2026
ms.custom: template-how-to, devx-track-azurecli
---

# Associate Azure App Configuration with a network security perimeter (private preview)

In this article, you learn how to associate your Azure App Configuration store with a [network security perimeter](../private-link/network-security-perimeter-concepts.md). For more information, see [Network security perimeter for Azure App Configuration](./concept-network-security-perimeter.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An App Configuration store. If you need to create one, see [Create an App Configuration store](quickstart-aspnet-core-app.md).
- An existing network security perimeter. If you need to create one, see [Create a network security perimeter in the Azure portal](../private-link/create-network-security-perimeter-portal.md).

## Sign in to Azure

### [Azure CLI](#tab/azure-cli)

Sign in to Azure using the `az login` command in the [Azure CLI](/cli/azure/install-azure-cli).

```azurecli-interactive
az login
```

This command prompts your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign-in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Associate your App Configuration store with a network security perimeter

Use the Azure CLI to create an association between your App Configuration store and an existing network security perimeter.

### [Azure CLI](#tab/azure-cli)

1. Run the following command to get the resource ID of your App Configuration store. Replace _`<AppConfigurationStoreName>`_ and _`<ResourceGroupName>`_ with the name of your store and resource group.

    ```azurecli-interactive
    az appconfig show --name <AppConfigurationStoreName> --resource-group <ResourceGroupName> --query id --output tsv
    ```

    Note down the resource ID from the output. For example: `/subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.AppConfiguration/configurationStores/<AppConfigurationStoreName>`.

1. Run the following command to associate your App Configuration store with the network security perimeter. Replace the placeholder values with your own information.

    ```azurecli-interactive
    az network perimeter association create --name <AssociationName> --perimeter-name <NspName> -g <NspResourceGroupName> --access-mode Enforced --private-link-resource "{id:<AppConfigurationResourceId>}" --profile "{id:<NspProfileResourceId>}"
    ```

    > [!div class="mx-tdBreakAll"]
    > | Placeholder | Description | Example |
    > |---|---|---|
    > | _`<AssociationName>`_ | A name for the new association resource. | `app-config-association` |
    > | _`<NspName>`_ | The name of your network security perimeter. | `MyNSP` |
    > | _`<NspResourceGroupName>`_ | The resource group of your network security perimeter. | `MyNSPResourceGroup` |
    > | _`<AppConfigurationResourceId>`_ | The resource ID of your App Configuration store from the previous step. | `/subscriptions/.../MyAppConfigStore` |
    > | _`<NspProfileResourceId>`_ | The resource ID of the network security perimeter profile to associate with. | `/subscriptions/.../profiles/defaultProfile` |

    > [!TIP]
    > The `--access-mode` parameter can be set to `Learning` (called **Transition** mode in the Azure portal and elsewhere in this documentation) or `Enforced`. Start in Transition (`Learning`) mode to validate your access rules before switching to `Enforced` mode. For more information, see [Transitioning to a network security perimeter](./concept-network-security-perimeter.md#transitioning-to-a-network-security-perimeter).

---

> [!NOTE]
> Allow up to 15 minutes for any changes to network security perimeter configuration to take effect.

If you encounter errors while associating your App Configuration store with a network security perimeter, see [Troubleshooting](./concept-network-security-perimeter.md#troubleshooting) for guidance on resolving common issues.

## Verify the association

After associating the App Configuration store with the network security perimeter, you can verify the association by checking the network security perimeter configuration of your App Configuration store.

### [Azure CLI](#tab/azure-cli)

Run the following command to view the network security perimeter configuration for your App Configuration store.

```azurecli-interactive
az appconfig network-security-perimeter-configuration list --name <AppConfigurationStoreName> --resource-group <ResourceGroupName>
```

---

## Dissociate your App Configuration store from a network security perimeter

Use the Azure CLI to remove an existing association between your App Configuration store and a network security perimeter.

### [Azure CLI](#tab/azure-cli)

- Run the following command to dissociate your App Configuration store from the network security perimeter. Replace the placeholder values with your own information.

    ```azurecli-interactive
    az network perimeter association delete --name <AssociationName> --perimeter-name <NspName> --resource-group <NspResourceGroupName>
    ```

    > [!div class="mx-tdBreakAll"]
    > | Placeholder | Description | Example |
    > |---|---|---|
    > | _`<AssociationName>`_ | The name of the association resource to delete. | `my-association-name` |
    > | _`<NspName>`_ | The name of your network security perimeter. | `my-nsp` |
    > | _`<NspResourceGroupName>`_ | The resource group of your network security perimeter. | `my-resource-group` |

---

## Related content

- [Network security perimeter for Azure App Configuration](./concept-network-security-perimeter.md)
- [Network security overview for Azure App Configuration](./concept-network-security.md)
- [What is Azure network security perimeter?](../private-link/network-security-perimeter-concepts.md)
