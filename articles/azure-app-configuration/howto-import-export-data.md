---
title: Import or export data with Azure App Configuration
description: Learn how to import or export configuration data to or from Azure App Configuration. Exchange data between your App Configuration store and code project.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 02/25/2022
ms.author: malev
---

# Import or export configuration data

Azure App Configuration supports data import and export operations. Use these operations to work with configuration data in bulk and exchange data between your App Configuration store and code project. For example, you can set up one App Configuration store for testing and another one for production. You can copy application settings between them so that you don't have to enter data twice.

This article provides a guide for importing and exporting data with App Configuration. If you’d like to set up an ongoing sync with your GitHub repo, take a look at [GitHub Actions](./concept-github-action.md) and [Azure Pipeline tasks](./pull-key-value-devops-pipeline.md).

You can import or export data using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-import.md).

## Import data

Import brings configuration data into an App Configuration store from an existing source. Use the import function to migrate data into an App Configuration store or aggregate data from multiple sources. App Configuration supports importing from another App Configuration store, an App Service resource or a configuration file in JSON, YAML or .properties.

# [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

1. On the **Import** tab, select **Configuration file** under **Source service**. Other options are **App Configuration** and **File services**.

1. Select **For language** : .NET or Java (Spring) or other, and select your desired input type—JSON, YAML or .properties.

1. Select the **Folder** icon, and browse to the file to import.

    :::image type="content" source="./media/import-file.png" alt-text="Screenshot of the Azure portal, importing a file.":::

1. Select a **Separator**, and optionally enter a **Prefix** to use for imported key names.

   * A separator is a character used to separate values in a file to distribute them in a table. Select a period (.), a comma (,), a colon (:), a semicolon (;), a forward slash (/) or a dash (-).
   * A key prefix is the beginning part of a key.

1. Optionally, select a **Label** to assign to your imported key-value pairs.
1. Select **Apply** to proceed with the import.

    :::image type="content" source="./media/import-file-complete.png" alt-text="Screenshot of the Azure portal, file import completed":::

# [Azure CLI](#tab/azure-cli)

Use the Azure CLI as explained below to import App Configuration data. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](/azure/cloud-shell/overview). Specify the source of the data: `appconfig`, `appservice` or `file`. Optionally specify a source label with `--src-label` and a label to apply with `--label`.

Import all keys and feature flags from a file and apply test label.

```python
az appconfig kv import --name <your-app-config-store-name> --label test --source file --path D:/abc.json --format json
```

Import all keys with label test and apply test2 label.

```python
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

Export writes configuration data stored in App Configuration to another destination. Use the export function, for example, to save data in an App Configuration store to a file that's embedded with your application code during deployment. You can export data from an App Configuration store, an App Service resource or a configuration in JSON, YAML or .properties.

# [Portal](#tab/azure-portal)

From the [Azure portal](https://portal.azure.com), follow these steps:

1. Browse to your App Configuration store, and select **Import/export**.

1. On the **Export** tab, select **Target service** > **Configuration file**.

1. Optionally enter a **Prefix** select a **label** and a point-in-time for keys to be exported.
    * Prefix: it's the beginning part of a key. Leave blank or fill out to restrict data to export.
    * Label: Labels can be assigned to keys to define different values for the same key. Leave blank to select all keys without a label, or select a label in the dropdown box. [Learn more about labels](howto-labels-aspnet-core.md).
    * Specific time: leave blank or fill out to export key data as from a specific point in time.
    > [!IMPORTANT]
    > If the keys you want to export have labels, do select the corresponding labels. If you don't select a label, only keys without labels will be exported. You may need create several exports to get all the desired data, according to the labels you need.
1. Select a **File type** > **Separator**.

1. Select **Export** to finish the export.

    :::image type="content" source="./media/export-file-complete.png" alt-text="Screenshot of the Azure portal, exporting a file":::

# [Azure CLI](#tab/azure-cli)

Use the Azure CLI as explained below to export configurations from App Configuration to another place. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](/azure/cloud-shell/overview). Specify the destination of the data: `appconfig`, `appservice` or `file`. Specify a label for the data you want to export with `--label` or export data with no label by not entering a label.

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
