---
title: Import or export data with Azure App Configuration
description: Learn how to import or export configuration data to or from Azure App Configuration. Exchange data between your App Configuration store and code project.
services: azure-app-configuration
author: AlexandraKemperMS
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/04/2022
ms.author: alkemper
---

# Import or export configuration data

Azure App Configuration supports data import and export operations. Use these operations to work with configuration data in bulk and exchange data between your App Configuration store and code project. For example, you can set up one App Configuration store for testing and another for production. You can copy application settings between them so that you don't have to enter data twice.

This article provides a guide for importing and exporting data with App Configuration. If you’d like to set up an ongoing sync with your GitHub repo, take a look at our [GitHub Action](./concept-github-action.md).

You can import or export data by using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-import.md).

## Import data

Import brings configuration data into an App Configuration store from an existing source. Use the import function to migrate data into an App Configuration store or aggregate data from multiple sources. App Configuration supports importing from a JSON, YAML, or properties file.

# [Azure portal](#tab/import-data/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

1. On the **Import** tab, select **Source service** > **Configuration File**.

1. Select **For language** and select your desired input type.

1. Select the **Folder** icon, and browse to the file to import.

    :::image type="content" source="./media/import-file.png" alt-text="Screenshot of the Azure portal, importing a file.":::

1. Select a **Separator**, and optionally enter a **Prefix** to use for imported key names.

1. Optionally, select a **Label**.

1. Select **Apply** to finish the import.

    :::image type="content" source="./media/import-file-complete.png" alt-text="Screenshot of the Azure portal, file import completed":::

# [Azure CLI](#tab/import-data/azure-cli)

From the [Azure CLI](./scripts/cli-import.md), use the following code to import configurations into App Configuration from another place.

```python
az appconfig kv import --source {appconfig, appservice, file}
                       [--appservice-account]
                       [--auth-mode {key, login}]
                       [--connection-string]
                       [--content-type]
                       [--depth]
                       [--endpoint]
                       [--format {json, properties, yaml}]
                       [--label]
                       [--name]
                       [--path]
                       [--prefix]
                       [--preserve-labels {false, true}]
                       [--profile {appconfig/default, appconfig/kvset}]
                       [--separator]
                       [--skip-features {false, true}]
                       [--src-auth-mode {key, login}]
                       [--src-connection-string]
                       [--src-endpoint]
                       [--src-key]
                       [--src-label]
                       [--src-name]
                       [--subscription]
                       [--yes]
```

For more details and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

## Export data

Export writes configuration data stored in App Configuration to another destination. Use the export function, for example, to save data in an App Configuration store to a file that's embedded with your application code during deployment.

# [Azure portal](#tab/export-data/azure-portal)

From the [Azure portal](https://portal.azure.com), follow these steps:

1. Browse to your App Configuration store, and select **Import/export**.

1. On the **Export** tab, select **Target service** > **Configuration file**.

1. Optionally enter a **Prefix** select a **label** and a point-in-time for keys to be exported.

1. Select a **File type** > **Separator**.

1. Select **Export** to finish the export.

    :::image type="content" source="./media/export-file-complete.png" alt-text="Screenshot of the Azure portal, exporting a file":::

# [Azure CLI](#tab/export-data/azure-cli)

From the [Azure CLI](./scripts/cli-export.md), use the following code to export configurations from App Configuration to another place.

```python
az appconfig kv export --destination {appconfig, appservice, file}
                       [--appservice-account]
                       [--auth-mode {key, login}]
                       [--connection-string]
                       [--dest-auth-mode {key, login}]
                       [--dest-connection-string]
                       [--dest-endpoint]
                       [--dest-label]
                       [--dest-name]
                       [--endpoint]
                       [--format {json, properties, yaml}]
                       [--key]
                       [--label]
                       [--name]
                       [--naming-convention {camel, hyphen, pascal, underscore}]
                       [--path]
                       [--prefix]
                       [--preserve-labels {false, true}]
                       [--profile {appconfig/default, appconfig/kvset}]
                       [--resolve-keyvault {false, true}]
                       [--separator]
                       [--skip-features {false, true}]
                       [--skip-keyvault {false, true}]
                       [--subscription]
                       [--yes]
```

For more details and examples, go to [az appconfig kv export](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-export&preserve-view=true).

---

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core web app](./quickstart-aspnet-core-app.md)
