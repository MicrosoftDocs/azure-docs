---
title: Import or export data with Azure App Configuration
description: Learn how to import or export configuration data to or from Azure App Configuration. Exchange data between your App Configuration store and code project.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 04/06/2022
ms.author: malev
---

# Import or export configuration data

Azure App Configuration supports data import and export operations. Use these operations to work with configuration data in bulk and exchange data between your App Configuration store and code project. For example, you can set up one App Configuration store for testing and another one for production. You can copy application settings between them so that you don't have to enter data twice.

This article provides a guide for importing and exporting data with App Configuration. If you’d like to set up an ongoing sync with your GitHub repo, take a look at [GitHub Actions](./concept-github-action.md) and [Azure Pipeline tasks](./pull-key-value-devops-pipeline.md).

You can import or export data using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-import.md).

## Import data

Import brings configuration data into an App Configuration store from an existing source. Use the import function to migrate data into an App Configuration store or aggregate data from multiple sources. App Configuration supports importing from another App Configuration store, an App Service resource or a configuration file in JSON, YAML or .properties.

### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-file.png" alt-text="Screenshot of the Azure portal, importing a file.":::

1. On the **Import** tab, select **Configuration file** under **Source service**. Other options are **App Configuration** and **App Services**.

1. Fill out the form with the following parameters:

    | Parameter    | Description                                                                              | Examples |
    |--------------|------------------------------------------------------------------------------------------|---------|
    | For language | Choose the language of the file you're importing between .NET, Java (Spring) and Other. | .NET    |
    | File type    | Select the type of file you're importing between YAML, properties or JSON.              | JSON    |

1. Select the **Folder** icon, and browse to the file to import.

1. Fill out the next part of the form:

    | Parameter | Description                                                                                                                                                                                                                 | Example                          |
    |-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
    | Separator | The separator is the character parsed in your imported configuration file to separate key-values which will be added to your configuration store. Select one of the following options: `.`, `,`,`:`, `;`, `/`, `-`. | :                                |
    | Prefix    | Optional. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of keys in a configuration store.                                                                                              | TestApp:Settings:Backgroundcolor |
    | Label     | Optional. Select an existing label or enter a new label that will be assigned to your imported key-values.                                                                                                                  | prod                             |
    |  Content type         |                    Optional. Indicate if the file you're importing is a Key Vault reference or a JSON file. For more information about Key Vault references, go to [Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md).                                                                                                                                                                                                          |      JSON (application/json)                            |

1. Select **Apply** to proceed with the import.

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI as explained below to import App Configuration data. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md). Specify the source of the data: `appconfig`, `appservice` or `file`. Optionally specify a source label with `--src-label` and a label to apply with `--label`.

Import all keys and feature flags from a file and apply test label.

```azurecli
az appconfig kv import --name <your-app-config-store-name> --label test --source file --path D:/abc.json --format json
```

Import all keys with label test and apply test2 label.

```azurecli
az appconfig kv import --name <your-app-config-store-name> --source appconfig --src-label test --label test2 --src-name <another-app-config-store-name>
```

Import all keys and apply null label from an App Service application.

For `--appservice-account` use the ARM ID for AppService or use the name of the AppService, assuming it's in the same subscription and resource group as the App Configuration.

```python
az appconfig kv import --name <your-app-config-store-name> --source appservice --appservice-account <your-app-service>
```

For more details and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

## Export data

Export writes configuration data stored in App Configuration to another destination. Use the export function, for example, to save data from an App Configuration store to a file that can be embedded in your application code during deployment. You can export data from an App Configuration store, an App Service resource or a configuration file in JSON, YAML or .properties.

### [Portal](#tab/azure-portal)

From the [Azure portal](https://portal.azure.com), follow these steps:

1. Browse to your App Configuration store, and select **Import/export**.

1. On the **Export** tab, select **Target service** > **Configuration file**.

1. Fill out the form with the following parameters:

    | Parameter  | Description                                                                                                                                                                                                                 | Example                          |
    |------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
    | Prefix     | Optional. A key prefix is the beginning part of a key. Enter a prefix to restrict your export to key-values with the specified prefix.                                                                                      | TestApp:Settings:Backgroundcolor |
    | From label | Optional. Select an existing label to restrict your export to key-values with a specific label. If you don't select a label, only key-values without a label will be exported. See note below.                                                   | prod                             |
    |  At a specific time          |                     Optional. Fill out to export key-values from a specific point in time.       |           01/28/2021 12:00:00 AM                       |
    | File type    | Select the type of file you're importing between YAML, properties or JSON.              | JSON    |
    | Separator  | The separator is the character that will be used in the configuration file to separate the exported key-values from one another. Select one of the following options: `.`, `,`,`:`, `;`, `/`, `-`. | ;                                |

    > [!IMPORTANT]
    > If you don't select a label, only keys without labels will be exported. To export a key-value with a label, you must select its label. Note that you can only select one label per export, so to export keys with multiple labels, you may need to export multiple times, once per label you select.

1. Select **Export** to finish the export.

    :::image type="content" source="./media/export-file-complete.png" alt-text="Screenshot of the Azure portal, exporting a file":::

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI as explained below to export configurations from App Configuration to another place. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md). Specify the destination of the data: `appconfig`, `appservice` or `file`. Specify a label for the data you want to export with `--label` or export data with no label by not entering a label.

> [!IMPORTANT]
> If the keys you want to export have labels, do select the corresponding labels. If you don't select a label, only keys without labels will be exported.

Export all keys and feature flags with label test to a json file.

```python
az appconfig kv export --name <your-app-config-store-name> --label test --destination file --path D:/abc.json --format json
```

Export all keys with null label excluding feature flags to a json file.

```python
az appconfig kv export --name <your-app-config-store-name> --destination file --path D:/abc.json --format json --skip-features
```

Export all keys and feature flags with all labels to another App Configuration.

```python
az appconfig kv export --name <your-app-config-store-name> --destination appconfig --dest-name <another-app-config-store-name> --key * --label * --preserve-labels
```

Export all keys and feature flags with all labels to another App Configuration and overwrite destination labels.

```python
az appconfig kv export --name <your-app-config-store-name> --destination appconfig --dest-name <another-app-config-store-name> --key * --label * --dest-label ExportedKeys
```

For more details and examples, go to [az appconfig kv export](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-export&preserve-view=true).

---

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core web app](./quickstart-aspnet-core-app.md)