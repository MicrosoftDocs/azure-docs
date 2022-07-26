---
title: Import or export data with Azure App Configuration
description: Learn how to import or export configuration data to or from Azure App Configuration. Exchange data between your App Configuration store and code project.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.topic: how-to
ms.date: 07/25/2022
ms.author: malev
---

# Import or export configuration data

Azure App Configuration supports data import and export operations. Use these operations to work with configuration data in bulk and exchange data between your App Configuration store and code project. For example, you can set up one App Configuration store for testing and another one for production. You can copy application settings between them so that you don't have to enter data twice.

This article provides a guide for importing and exporting data with App Configuration. If you’d like to set up an ongoing sync with your GitHub repo, take a look at [GitHub Actions](./concept-github-action.md) and [Azure Pipeline tasks](./pull-key-value-devops-pipeline.md).

You can import or export data using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-import.md).

## Import data

Import brings configuration data into an App Configuration store from an existing source. Use the import function to migrate data into an App Configuration store or aggregate data from multiple sources.

This guide shows how to import App Configuration data:

- [from a configuration file in JSON, YAML or .properties](#import-data-from-a-configuration-file)
- [from an App Configuration store](#import-data-from-an-app-configuration-store)
- [from an Azure App Service resource](#import-data-from-azure-app-service)

### Import data from a configuration file

Follow the steps below to import key-values and feature flags from a file.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/import-file.png" alt-text="Screenshot of the Azure portal, importing a file.":::

1. On the **Import** tab, select **Configuration file** under **Source service**.

1. Fill out the form with the following parameters:

    | Parameter    | Description                                                                             | Examples |
    |--------------|-----------------------------------------------------------------------------------------|----------|
    | For language | Choose the language of the file you're importing between .NET, Java (Spring) and Other. | *.NET*  |
    | File type    | Select the type of file you're importing between YAML, properties or JSON.              | *JSON*   |

1. Select the **Folder** icon, and browse to the file to import.

1. Fill out the next part of the form:

| Parameter    | Description                                                                                                                                                                                                                                   | Example                   |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| Separator    | The separator is the character parsed in your imported configuration file to separate key-values that will be added to your configuration store. Select one of the following options: *.*, *,*, *:*, *;*, */*, *-*, *_*, *—*                 | *:*                       |
| Prefix       | Optional. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of keys in a configuration store. The entered prefix will be appended to the beginning of every key you import in this file. Prefix will be ignored for feature flags.          | *TestApp*                 |
| Label        | Optional. Select an existing label or enter a new label that will be assigned to your imported key-values.                                                                                                                                    | *prod*                    |
| Content type | Optional. Indicate if you're importing a JSON file or a file containing Key Vault references. For more information about Key Vault references, go to [Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md). | *JSON (application/json)* |

1. Select **Apply** to proceed with the import.

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

Enter the import command `az appconfig kv import` and add the following parameters:

| Parameter  | Description                                                                         | Examples                            |
|------------|-------------------------------------------------------------------------------------|-------------------------------------|
| `--name`   | Enter the name of the App Configuration store you want to import data to.           | `my-app-config-store`               |
| `--source` | Enter `file` to indicate that you're importing app configuration data from a file.  | `file`                              |
| `--path`   | Enter the local path to the file containing the data you want to import.            | `C:/Users/john/Downloads/data.json` |
| `--format` | Enter yaml, properties or json to indicate the format of the file you're importing. | `json`                              |

Optionally also add the following parameters:

| Parameter        | Description                                                                                                                                                                                                                                              | Example                   |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| `--separator`    | Optional. The separator is the character parsed in your imported configuration file to separate key-values which will be added to your configuration store. Select one of the following options: `'.'`, `','`, `':'`, `';'`, `'/'`, `'-'`, `'_'`, `'—'`. | `':'`                     |
| `--prefix`       | Optional. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of keys in a configuration store. This prefix will be appended to the front of imported keys. Prefix will be ignored for feature flags.                     | `TestApp`                 |
| `--label`        | Optional. Enter a label that will be assigned to your imported key-values.                                                                                                                                                                               | `prod`                    |
| `--content-type` | Optional. Enter `appconfig/kvset` or `application/json` to state that the imported content consists of a Key Vault reference or a JSON file.                                                                                                             | `JSON (application/json)` |

Example: import all keys and feature flags from a file and apply the label "prod".

```azurecli
az appconfig kv import --name <your-app-config-store-name> --label prod --source file --path D:/abc.json --format json
```

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

> [!NOTE]
> Importing feature flags from a properties file is not supported. If a properties file contains feature flags, they will be imported as regular key-values.

### Import data from an App Configuration store

You can import values from one App Configuration store to another App Configuration store, or you can import values from one App Configuration store to the same App Configuration store in order to duplicate its values and apply some parameters, such as new labels.

Follow the steps below to import key-values and feature flags from an Azure App Configuration store.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/import-app-configuration.png" alt-text="Screenshot of the Azure portal, importing from an App Configuration store.":::

1. On the **Import** tab, select **App Configuration** under **Source service**.

1. Select **Select resource**, fill out the form with the following parameters, and select **Apply**:

    | Parameter      | Description                                                                                     | Examples              |
    |----------------|-------------------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Your current subscription is selected by default.                                               | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Configuration store with configuration to import. Your current resource group is selected by default. | *my-resource-group*   |
    | Resource       | Select the App Configuration store that contains the configuration you want to import.          | *my-other-app-config* |

    > [!NOTE]
    > The message "Access keys fetched successfully" confirms that the keys were successfully fetched from the source App Configuration store.

1. The page now displays the selected **Source service** and resource ID. The **Select resource** action lets you switch to another source App Configuration store.

1. Fill out the next part of the form:

    | Parameter          | Description                                                                                                                                                                                                                     | Example                   |
    |--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | From label         | Select an existing label to restrict your import to key-values with that specific label. If you don't select a label, by default only key-values with the "No Label" label will be imported.                                    | *prod*                    |
    | At a specific time | Optional. Fill out to import key-values from a specific point in time. This is the point in time of the resource you selected in the previous step.                                                                             | *01/28/2021 12:00:00 AM*  |
    | Label              | Optional. Select an existing label or enter a new label that will be assigned to your imported key-values.                                                                                                                      | *new*                    |
    | Content type       | Optional. Check the box **Override default key-value content types** and select **Key Vault Reference** or **JSON (application/json)** under **Content type** to state that the imported content consists of a Key Vault reference or a JSON file. | *JSON (application/json)* |

    > [!IMPORTANT]
    > If you don't select a label, only keys without labels will be imported. To export a key-value with a label, you must select its label. Note that you can only select one label per export so to export keys with multiple labels, you may need to export multiple times, once per label you select.

1. Select **Apply** to proceed with the import. You have imported key-values with the "prod" label from an App Configuration store, at their state from 01/28/2021 12:00:00 AM, and have assigned them the label "new". You have indicated that values are from a JSON file.

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

Enter the import command `az appconfig kv import`  and enter the following parameters:

| Parameter    | Description                                                                               | Examples              |
|--------------|-------------------------------------------------------------------------------------------|-----------------------|
| `--name`     | Enter the name of the App Configuration store you want to import data into                | `my-app-config-store` |
| `--source`   | Enter `appconfig` to indicate that you're importing data from an App Configuration store. | `appconfig`           |
| `--src-name` | Enter the name of the App Configuration store you want to import data from.               | `my-other-app-config` |

Also add the following parameters:

| Parameter        | Description                                                                                                                                                                                                                                                                  | Examples                                                           |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| `--src-label`    | Restrict your import to keys with a specific label. If you don't use this parameter, only keys with the "No label" label will be imported. Supports star sign as filter.                                                                                                     | Enter `*` for all labels; `abc*`for all labels with abc as prefix. |
| `--src-key`,     | Optional. Restrict your import to data containing a specific key prefix. If no key specified, return all keys by default. Supports star sign as filter. Key filtering not applicable for feature flags. By default, all feature flags with specified label will be imported. | Enter `abc*` to get keys with abc as prefix.                       |
| `--datetime`     | Optional. Export key-values from a specific point in time. Format: "YYYY-MM-DDThh:mm:ssZ". If you don't specify a time zone, UTC will be used by default.                                                                                                                    | `"2021-01-28T13:00:00Z"`                                           |
| `--label`        | Optional. Enter a label that will be assigned to your imported key-values.                                                                                                                                                                                                   | `prod`                                                             |
| `--content-type` | Optional. Enter `appconfig/kvset` or `application/json` to state that the imported content consists of a Key Vault reference or a JSON file.                                                                                                                                 | `JSON (application/json)`                                          |

Example: import all keys and feature flags with null label and apply new label from an App Configuration store.

```azurecli
az appconfig kv import -n <your-app-config-store-name> -s appconfig --src-name <source-app-config-store-name> --label ImportedKeys
```

Example: import all keys and feature flags with all labels to another App Configuration.

```azurecli
az appconfig kv import -n <your-app-config-store-name> -s appconfig --src-name <source-app-config-store-name> --src-key * --src-label * --preserve-labels
```

The command line displays a list of the coming changes. Confirm the import by selecting `y`.

:::image type="content" source="./media/import-export/continue-import-prompt.png" alt-text="Screenshot of CLI. Importation confirmation prompt.":::

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

### Import data from Azure App Service

Follow the steps below to import key-values and feature flags from Azure App Service.

#### [Portal](#tab/azure-portal)

From the Azure portal:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/import-app-service.png" alt-text="Screenshot of the Azure portal, importing from App Service.":::

1. On the **Import** tab, select **App Services** under **Source service**.

1. Select **Select resource**, fill out the form with the following parameters, and select **Apply**:

    | Parameter      | Description                                                                         | Examples              |
    |----------------|-------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Select your Azure subscription.                                                     | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Service with configuration to import. | *my-resource-group*   |
    | Resource       | Select the App Service that contains the configuration you want to import.          | *my-other-app-config* |

    > [!NOTE]
    > The message "Access keys fetched successfully" confirms that the keys were successfully fetched from the source App Configuration store.

1. The page now displays the selected **Source service** and resource id. The **Select resource** action lets you switch to another source App Service.

1. Fill out the next part of the form:

    | Parameter    | Description                                                                                                                                                                                                                                   | Example                   |
    |--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | Prefix       | Optional. A key prefix is the beginning part of a key. This prefix will be appended to the front of imported keys. Prefix will be ignored for feature flags.                                                                                  | *TestApp*                 |
    | Label        | Optional. Select an existing label or enter a new label that will be assigned to your imported key-values.                                                                                                                                    | *prod*                    |
    | Content type | Optional. Indicate if the file you're importing is a Key Vault reference or a JSON file. For more information about Key Vault references, go to [Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md). | *JSON (application/json)* |

1. Select **Apply** to proceed with the import. You have imported key-values that start with *TestApp* from an Azure App Services resource, and have assigned them the label *prod*. You have indicated that values are from a JSON file.

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

> [!NOTE]
> Importing feature flags from App Service using the CLI is not supported.

Enter the import command `az appconfig kv import` and add the following parameters:

Enter the following parameters:

| Parameter              | Description                                                                                                                                     | Examples                                                                                                                  |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `--name`               | Enter the name of the App Configuration store you want to import data to.                                                                       | `my-app-config-store`                                                                                                     |
| `--source`             | Enter `appservice` to indicate that you're importing app configuration data from Azure App Service.                                             | `appservice`                                                                                                              |
| `--appservice-account` | Enter the App Service's ARM ID or use the name of the AppService, if it's in the same subscription and resource group as the App Configuration. | `/subscriptions/123/resourceGroups/my-as-resource-group/providers/Microsoft.Web/sites/my-app-service` or `my-app-service` |
| `--src-label`          | Only keys with this label in source AppConfig will be imported. If no value specified, import keys with "No label" label by default. Support star sign as filters, for instance * means all labels, abc* means labels with abc as prefix.                                                   | `JSON (application/json)` |

Optionally also add the following parameters:

| Parameter        | Description                                                                                                                                                                                | Example                   |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| `--prefix`       | Optional. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of keys in a configuration store. This prefix will be appended to the front of imported keys. | `TestApp`                 |
| `--label`        | Optional. Enter a label that will be assigned to your imported key-values. If you don't specify a label, the null label will be assigned to your key-values.                               | `prod`                    |
| `--content-type` | Optional. Enter appconfig/kvset or application/json to state that the imported content consists of a Key Vault reference or a JSON file.                                                   | `JSON (application/json)` |

To get the value for `--appservice-account`, use the command `az webapp show --resource-group <resource-group> --name <resource-name>`.

Example: import all application settings from your App Service as key-values with no-label to the your App Configuration store.

```azurecli
az appconfig kv import --name MyAppConfiguration --source appservice --appservice-account MyAppService
```

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

## Export data

Export writes configuration data stored in App Configuration to another destination. Use the export function, for example, to save data from an App Configuration store to a file that can be embedded in your application code during deployment.

This guide shows how to export App Configuration data:

- [to a configuration file in JSON, YAML or .properties](#export-data-to-a-configuration-file)
- [to an App Configuration store](#export-data-to-an-app-configuration-store)
- [to an Azure App Service resource](#export-data-to-azure-app-service)

### Export data to a configuration file

Follow the steps below to export key-values and feature flags to a file.

### [Portal](#tab/azure-portal)

From the [Azure portal](https://portal.azure.com), follow these steps:

1. Browse to your App Configuration store, and select **Import/export**.

    :::image type="content" source="./media/import-export/export-file.png" alt-text="Screenshot of the Azure portal, exporting a file":::

1. On the **Export** tab, select **Configuration file** under **Target service**.

1. Fill out the form with the following parameters:

    | Parameter          | Description                                                                                                                                                                                                                       | Example                  |
    |--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
    | Prefix             | Optional. A key prefix is the beginning part of a key. Enter a prefix to restrict your export to key-values with the specified prefix.                                                                                            | *TestApp*                |
    | From label         | Select an existing label to restrict your export to key-values with a specific label. If you don't select a label, by default only key-values with the "No Label" label will be exported. See note below.                         | *prod*                   |
    | At a specific time | Optional. Fill out to export key-values and feature flags from a specific point in time.                                                                                                                                          | *01/28/2021 12:00:00 AM* |
    | File type          | Select the type of file you're importing between YAML, properties or JSON.                                                                                                                                                        | *JSON*                   |
    | Separator          | The separator is the character that will be used in the configuration file to separate the exported key-values from one another. Select one of the following options: *.*, *,*, *:*, *;*, */*, *-*, *_*, *—*,  or *No separator*. | *;*                      |

    > [!IMPORTANT]
    > If you don't select a label, only keys without labels will be exported. To export a key-value with a label, you must select its label. Note that you can only select one label per export, so to export keys with multiple labels, you may need to export multiple times, once per label you select.

1. Select **Export** to finish the export. You have exported key-values starting with the prefix "TestApp" that have the "prod" label from a configuration file, at their state from 01/28/2021 12:00:00 AM, and have assigned them the label "new". You have indicated that values are from a JSON file and that the ";" separator is used in the file.

### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

Enter the import command `az appconfig kv export` and add the following parameters:

| Parameter       | Description                                                                                    | Examples                            |
|-----------------|------------------------------------------------------------------------------------------------|-------------------------------------|
| `--name`        | Enter the name of the App Configuration store that contains the key-values you want to export. | `my-app-config-store`               |
| `--destination` | Enter `file` to indicate that you're exporting data to a file.                                 | `file`                              |
| `--path`        | Enter the path where you to save the file on your machine.                                     | `C:/Users/john/Downloads/data.json` |
| `--format`      | Enter yaml, properties or json to indicate the format of the file you're exporting.            | `json`                              |

Optionally also add the following parameters:

| Parameter        | Description                                                                                                                                                                                                                                              | Example                   |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| `--separator`    | Optional. The separator is the character parsed in your imported configuration file to separate key-values that will be added to your configuration store. Select one of the following options: `'.'`, `','`, `':'`, `';'`, `'/'`, `'-'`, `'_'`, `'—'`. | `':'`                     |
| `--prefix`       | Optional. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of keys in a configuration store. Prefix to be trimmed from keys. Prefix will be ignored for feature flags.                                                 | `TestApp`                 |
| `--label`        | Optional. Enter a label that will be assigned to your imported key-values.                                                                                                                                                                               | `prod`                    |
| `--content-type` | Optional. Enter `appconfig/kvset` or `application/json` to state that the imported content consists of a Key Vault reference or a JSON file.                                                                                                             | `JSON (application/json)` |

> [!IMPORTANT]
> If you don't specify a label, only keys and feature flags without labels will be exported. If your export destination is a file with appconfig/kvset profile, use a comma sign (`,`) to select several labels or use `*` to include all labels, including the null label (no label). In other cases, to export keys and feature flags with several labels, you will need to export several times to get all your of required data, once per label you select.

Example: export all keys and feature flags with label test to a json file.

```azurecli
az appconfig kv export --name <your-app-config-store-name> --label test --destination file --path D:/abc.json --format json
```

For more optional parameters and examples, go to [az appconfig kv export](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-export&preserve-view=true).

---

### Export data to an App Configuration store

Follow the steps below to export key-values and feature flags to an Azure App Configuration store.

You can export values from one App Configuration store to another App Configuration store, or you can export values from one App Configuration store to the same App Configuration store in order to duplicate its values and apply some parameters, such as new labels.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/export-app-configuration.png" alt-text="Screenshot of the Azure portal, exporting from an App Configuration store.":::

1. On the **Export** tab, select **App Configuration** under **Target service**.

1. Select **Select resource**, fill out the form with the following parameters, and select **Apply**:

    | Parameter      | Description                                                                                     | Examples              |
    |----------------|-------------------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Select your Azure subscription.                                                                 | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Configuration store with configuration to import. | *my-resource-group*   |
    | Resource       | Select the App Configuration store that contains the configuration you want to import.          | *my-other-app-config* |

1. The page now displays the selected **Target service** and resource ID. The **Select resource** action lets you switch to another source App Configuration store.

1. Fill out the next part of the form:

    | Parameter          | Description                                                                                                                                                                                                                     | Example                   |
    |--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | From label         | Select a label to restrict your export to key-values and feature flags with a specific label. If you don't select a label, only key-values without a label will be added to the store.                                          | *prod*                    |
    | At a specific time | Optional. Fill out to export key-values from a specific point in time.                                                                                                                                                          | *01/28/2021 12:00:00 AM*  |
    | Label              | Optional. Select a label to add to your exported key-values and feature flags.                                                                                                                                                  | *new*                     |
    | Content type       | Optional. Check the box **Override default key-value content types** and select **Key Vault Reference** or **JSON** under **Content type** to state that the imported data consists of a Key Vault reference or a JSON file.    | *JSON (application/json)* |

    > [!IMPORTANT]
    > If the keys you want to export have labels, do select the corresponding labels. If you don't select a label, only keys without labels will be exported. To export keys and feature flags with several labels, you will need to do several exports to get all your of required data.

1. Select **Apply** to proceed with the export. You have exported key-values that have the "prod" label from an App Configuration store, at their state from 01/28/2021 12:00:00 AM, and have assigned them the label "new". You have indicated that values are from a JSON file.

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

Enter the export command `az appconfig kv export`  and enter the following parameters:

| Parameter       | Description                                                                                    | Examples              |
|-----------------|------------------------------------------------------------------------------------------------|-----------------------|
| `--name`        | Enter the name of the App Configuration store that contains the key-values you want to export. | `my-app-config-store` |
| `--destination` | Enter `appconfig` to indicate that you're exporting data to an App Configuration store.        | `appconfig`           |
| `--dest-name`   | Enter the name of the App Configuration store you want to export data to.                      | `my-other-app-config` |

Optionally also add the following parameters:

| Parameter      | Description                                                                                                                                                                                                                                        | Examples                                    |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| `--datetime`   | Optional. Export key-values from a specific point in time. Format: "YYYY-MM-DDThh:mm:ssZ". If you don't specify a time zone, UTC will be used by default.                                                                                          | `"2021-01-28T13:00:00Z"`                    |
| `--label`      | Optional. Enter a label to restrict export to keys and feature flags with this label. If you don't specify a label, you'll only export keys and feature flags with no label.                                                                     | `prod`                                      |
| `--dest-label` | Optional. Enter a destination label to label exported key-values with this label.                                                                                                                                                                | `new`                                       |
| `--key`        | Optional. Enter a key to filter keys to export. If no key specified, return all keys by default. Support star sign as filter. Key filtering not applicable for feature flags. By default, all feature flags with specified label will be exported. | `abc*` exports all keys with abc as prefix. |

> [!IMPORTANT]
> If the keys you want to export have labels, do enter the corresponding labels. If you don't select a label, only keys without labels will be exported. Use a comma sign (`,`) to select several labels or use `*` to include all labels, including the null label (no label).

Example: export all keys and feature flags with all labels to another App Configuration.

```azurecli
az appconfig kv export -n <your-app-config-store-name> -d appconfig --dest-name <your-destination-app-config-store-name> --key <key> --label <restrictive-label>* --dest-label <destination-label>
```

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

### Export data to Azure App Service

Follow the steps below to export key-values and feature flags to Azure App Service.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/export-app-service.png" alt-text="Screenshot of the Azure portal, exporting from App Service.":::

1. On the **Export** tab, select **App Services** under **Target service**.

1. Select **Select resource**, fill out the form with the following parameters, and select **Apply**:

    | Parameter      | Description                                                                         | Examples              |
    |----------------|-------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Select your Azure subscription.                                                     | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Service with configuration to export. | *my-resource-group*   |
    | Resource       | Select the App Service that contains the configuration you want to export.          | *my-other-app-config* |

1. The page now displays the selected **Target service** and resource ID. The **Select resource** action lets you switch to another source App Service.

1. Optionally fill out the next part of the form:

    | Parameter          | Description                                                                                                                                                                                                                     | Example                   |
    |--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | Prefix             | Optional. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of keys in a configuration store. This prefix will be trimmed from the imported keys. Prefix will be ignored for feature flags.    | *TestApp*                 |
    | From label         | Select an existing label to restrict your export to key-values with a specific label. If you don't select a label, only key-values with the "No label" label will be exported. See note below.                                  | *prod*                    |
    | At a specific time | Optional. Fill out to export key-values from a specific point in time.                                                                                                                                                          | *01/28/2021 12:00:00 AM*  |
    | Content type       | Optional. Check the box **Override default key-value content types** and select **Key Vault Reference** or **JSON** under **Content type** to state that the imported content consists of a Key Vault reference or a JSON file. | *JSON (application/json)* |

    > [!IMPORTANT]
    > If the keys you want to export have labels, do select the corresponding labels. If you don't select a label, only keys without labels will be exported. To export keys with several labels, you will need to do several exports to get all your of required data.

1. Select **Apply** to proceed with the export. You have exported key-values that have the prefix "TestApp" and the "prod" label from an App Service resource, at their state from 01/28/2021 12:00:00 AM. You have indicated that values are from a JSON file.

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

Enter the export command `az appconfig kv export`  and enter the following parameters:

| Parameter              | Description                                                                                                                                     | Examples                                                                                                                  |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `--name`               | Enter the name of the App Configuration store that contains the key-values you want to export.                                                  | `my-app-config-store`                                                                                                     |
| `--destination`        | Enter `appservice` to indicate that you're exporting data to App Service.                                                                       | `appservice`                                                                                                              |
| `--appservice-account` | Enter the App Service's ARM ID or use the name of the AppService, if it's in the same subscription and resource group as the App Configuration. | `/subscriptions/123/resourceGroups/my-as-resource-group/providers/Microsoft.Web/sites/my-app-service` or `my-app-service` |

To get the value for `--appservice-account`, use the command `az webapp show --resource-group <resource-group> --name <resource-name>`.

Optionally also add the following parameters:

| Parameter      | Description                                                                                                                                                                                                                                        | Examples                                    |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| `--datetime`   | Optional. Export key-values from a specific point in time. Format: "YYYY-MM-DDThh:mm:ssZ". If you don't specify a time zone, UTC will be used by default.                                                                                          | `"2021-01-28T13:00:00Z"`                    |
| `--label`      | Optional. Enter a label to restrict export to keys and feature flags with this label. If you don't specify a label, you'll only export keys and feature flags with no label.                                                                     | `prod`                                      |
| `--dest-label` | Optional. Enter a destination label to label exported key-values with this label.                                                                                                                                                                  | `new`                                       |
| `--key`        | Optional. Enter a key to filter keys to export. If no key specified, return all keys by default. Support star sign as filter. Key filtering not applicable for feature flags. By default, all feature flags with specified label will be exported. | `abc*` exports all keys with abc as prefix. |

> [!IMPORTANT]
> If the keys you want to export have labels, do enter the corresponding labels. If you don't select a label, only keys without labels will be exported. Use a comma sign (`,`) to select several labels or use `*` to include all labels, including the null label (no label).

> [!NOTE]
> Importing feature flags from a properties file is not supported.

Example: export all keys with null label to an App Service application.

```azurecli
az appconfig kv export --name <your-app-config-store-name> --destination appconfig --appservice-account <your-app-service> 
```

For more optional parameters and examples, go to [az appconfig kv export](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-export&preserve-view=true).

---

## Error messages

You may encounter some error messages when importing or exporting App Configuration keys:

- **Public access is disabled for your store or you are accessing from a private endpoint that is not in the store’s private endpoint configurations**. To import keys from an App Configuration store, you need to have access to that store. If necessary, enable public access for the source store or access it from an approved private endpoint. If you just enabled public access, wait up to 5 minutes for the cache to refresh.

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core web app](./quickstart-aspnet-core-app.md)
