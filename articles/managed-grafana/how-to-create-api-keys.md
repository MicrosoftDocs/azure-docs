---
title: Create and manage Grafana API keys in Azure Managed Grafana
description: Learn how to generate and manage Grafana API keys, and start making API calls for Azure Managed Grafana.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.custom: engagement-fy23, devx-track-azurecli
ms.topic: how-to 
ms.date: 10/04/2023
---

# Create and manage Grafana API keys in Azure Managed Grafana (Deprecated)

> [!IMPORTANT]
> This document is deprecated as the API keys feature has been replaced by [service accounts](./how-to-service-accounts.md) in Grafana 9.1. To switch to using service accounts, in Grafana instances created before the release of Grafana 9.1, go to **Configuration > API keys and select Migrate to service accounts now**.  Select **Yes, migrate now**. Each existing API keys will be automatically migrated into a service account with a token. The service account will be created with the same permission as the API Key and current API keys will continue to work as before.

> [!CAUTION]
> Each API key is treated by Azure Managed Grafana as a single active user. Generating new API keys will therefore increase your monthly Azure invoice. Pricing per active user can be found at [Pricing Details](https://azure.microsoft.com/pricing/details/managed-grafana/#pricing).

In this guide, learn how to generate and manage API keys, and start making API calls to the Grafana server. Grafana API keys will enable you to create integrations between Azure Managed Grafana and other services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).

## Enable API keys

API keys are disabled by default in Azure Managed Grafana. You can enable this feature during the creation of the instance in the Azure portal, or you can activate it on an existing instance, using the Azure portal or the CLI.

### Create an Azure Managed Grafana workspace with API key creation enabled

During the creation of the Azure Managed Grafana workspace, enable the creation of API keys in the **Advanced** tab, by setting **Enable API key creation** to **Enabled**. For more information about creating a new instance using the Azure portal, go to [Quickstart: Create an Azure Managed Grafana instance](quickstart-managed-grafana-portal.md).

### Enable API key creation on an existing Azure Managed Grafana instance

#### [Portal](#tab/azure-portal)

  1. In the Azure portal, under **Settings**, select **Configuration**, and then under **API keys**, select **Enable**.

      :::image type="content" source="media/create-api-keys/enable-api-keys.png" alt-text="Screenshot of the Azure platform. Enable API keys.":::
  1. Select **Save** to confirm that you want to activate the creation of API keys in Azure Managed Grafana.

#### [Azure CLI](#tab/azure-cli)

Run the [az grafana update](/cli/azure/grafana#az-grafana-update) command to enable the creation of API keys in an existing Azure Managed Grafana instance. In the command below, replace `<azure-managed-grafana-name>` with the name of the Azure Managed Grafana instance to update.

```azurecli-interactive
az grafana update --name <azure-managed-grafana-name> --api-keys Enabled
```

---

## Generate an API key

### [Portal](#tab/azure-portal)

1. Open your Azure Managed Grafana instance and from the left menu, select **Configuration >  API keys**.
    :::image type="content" source="media/create-api-keys/access-page.png" alt-text="Screenshot of the Grafana dashboard. Access API keys page.":::
1. Select **New API key**.
1. Fill out the form, and select **Add** to generate the new API key.

    | Parameter                | Description                                                                                                                                                | Example     |
    |--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
    | **Key name**             | Enter a name for your new Grafana API key.                                                                                                                 | *api-key-1* |
    | **Managed Grafana role** | Choose a Managed Grafana role: Viewer, Editor or Admin.                                                                                                    | *Editor*    |
    | **Time to live**         | Enter a time before your API key expires. Use *s* for seconds, *m* for minutes, *h* for hours, *d* for days, *w* for weeks, *M* for months, *y* for years. | 7d          |

   :::image type="content" source="media/create-api-keys/form.png" alt-text="Screenshot of the Grafana dashboard. API creation form is filled out.":::

1. Once the key has been generated, a message pops up with the new key and a curl command including your key. Copy this information and save it in your records now, as it will be hidden once you leave this page. If you close this page without save the new API key, you'll need to generate a new one.

   :::image type="content" source="media/create-api-keys/api-key-created.png" alt-text="Screenshot of the Grafana dashboard. API key is displayed.":::

You can now use this Grafana API key to call the Grafana server.

### [Azure CLI](#tab/azure-cli)

1. Run the [az grafana api-key create](/cli/azure/grafana/api-key#az-grafana-api-key-create) command to create an API key for Azure Managed Grafana. Replace `<azure-managed-grafana-name>` and `<key>` with the name of the Azure Managed Grafana instance to update and a name for the new API key.

   Optionally also add more parameters, such as `--role` and `--time-to-live`.

   | Parameter        | Description                                                                                                                                                                             | Example  |
   |------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
   | `--role`         | Select an Azure Managed Grafana role by entering `Admin`, `Editor` or `Viewer`. The default value is `Viewer`.                                                                          | *Editor* |
   | `--time-to-live` | Enter a time before your API key expires. Use `s` for seconds, `m` for minutes, `h` for hours, `d` for days, `w` for weeks, `M` for months or `y` for years. The default value is `1d`. | 7d       |

   ```azurecli-interactive
   az grafana api-key create --name <azure-managed-grafana-name> --key <key>
   ```

1. The terminal returns a key ID, a key and a key name. Copy this information and save it in your records now, as you'll only be able to view this key once.

---

## Test the API key

Run the [az grafana dashboard list](/cli/azure/grafana/dashboard#az-grafana-dashboard-list) command below to check if your API key is working. Replace the placeholders `<azure-managed-grafana-name>`  and `<api-key>` with the name of your Azure Managed Grafana instance and your API key.

```azurecli-interactive
az grafana dashboard list --name <azure-managed-grafana-name> --api-key <api-key>
```

The terminal's output lists all the dashboards your API key can access in the specified Azure Managed Grafana instance.

## Manage API keys

### [Portal](#tab/azure-portal)

Existing API keys are listed in **Configuration >  API keys**. By default, only active API keys are displayed. Select **Include expired keys** to view all created keys, and select **X** (Delete) to delete the API key.

:::image type="content" source="media/create-api-keys/manage.png" alt-text="Screenshot of the Grafana dashboard. API keys are listed under Configuration > API keys.":::

### [Azure CLI](#tab/azure-cli)

#### List API keys

Run the [az grafana api-key list](/cli/azure/grafana/api-key#az-grafana-api-key-list) command to list the API keys in an existing Azure Managed Grafana instance. In the command below, replace `<azure-managed-grafana-name>` with the name of the Azure Managed Grafana instance.

```azurecli-interactive
az grafana api-key list --name <azure-managed-grafana-name> --output table
```

Example of output:

```Output
Name   Role    Expiration
-----  ------  --------------------
key01  Viewer
key02  Viewer  2022-08-31T17:14:44Z
```

#### Delete API keys

Run the [az grafana api-key delete](/cli/azure/grafana/api-key#az-grafana-api-key-delete) command to delete API keys. In the command below, replace `<azure-managed-grafana-name>` and `<key>`with the name of the Azure Managed Grafana instance and the ID or the name of the API key to delete.

```azurecli-interactive
az grafana api-key delete --name <azure-managed-grafana-name> --key <key>
```

---

## Next steps

In this how-to guide, you learned how to create an API key for Azure Managed Grafana. When you're ready, start using service accounts as the new way to authenticate applications that interact with Grafana:

> [!div class="nextstepaction"]
> [User service accounts](how-to-service-accounts.md)
