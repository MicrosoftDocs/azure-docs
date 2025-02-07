---
title: Import or export data with Azure App Configuration
description: Learn how to import or export configuration data to or from Azure App Configuration. Exchange data between your App Configuration store and code project.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 08/26/2024
ms.author: malev
---

# Import or export configuration data

Azure App Configuration supports data import and export operations. Use these operations to work with configuration data in bulk and exchange data between your App Configuration store and code project. For example, you can set up one App Configuration store for testing and another one for production. You can copy application settings between them so that you don't have to enter data twice.

This article provides a guide for importing and exporting data using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-import.md). If you have adopted [Configuration as Code](./howto-best-practices.md#configuration-as-code) and manage your configurations in GitHub or Azure DevOps, you can set up ongoing configuration file import using [GitHub Actions](./push-kv-github-action.md) or use the [Azure Pipeline Import Task](./azure-pipeline-import-task.md).

## Import data

Import brings configuration data into an App Configuration store from an existing source. Use the import function to migrate data into an App Configuration store or aggregate data from multiple sources.

This guide shows how to import App Configuration data:

- [from a configuration file in Json, Yaml or Properties](#import-data-from-a-configuration-file)
- [from an App Configuration store](#import-data-from-an-app-configuration-store)
- [from Azure App Service](#import-data-from-azure-app-service)

### Import data from a configuration file

Follow the steps below to import key-values from a file.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Navigate to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/import-file.png" alt-text="Screenshot of the Azure portal, importing a file.":::

1. The **Import** radio button is selected by default. Under **Source type**, select **Configuration file**.

1. Fill out the form with the following parameters:

    | Parameter    | Description                                                                             | Example |
    |--------------|-----------------------------------------------------------------------------------------|----------|
    | File type    | Select the file type for import: YAML, Properties, or JSON. | *Json*   |

1. Click the **Browse** button, and select the file to import.


1. Fill out the next part of the form:

    | Parameter    | Description                                                                                                                                                                                                                             | Example                   |
    |--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | File content profile    | Select a content profile: Default or KVSet. The *Default* file content profile refers to the conventional configuration file schema widely adopted by existing programming frameworks or systems, supports JSON, Yaml, or Properties file formats. The *KVSet* file content profile refers to a file schema that contains all properties of an App Configuration key-value, including key, value, label, content type, and tags. | *Default*                       |
    | Import mode    | The import mode is used to determine whether to ignore identical key-values. With the *Ignore match* option, any key-values in the store that are the same as those in the configuration file are ignored. With the *All* option, all key-values in the configuration file are updated.   | *Ignore match*                       |
    | Exclude feature flag    | If checked, feature flags will not be imported. | *Unchecked*                       |
    | Strict    | If the box is checked, any key-values in the store with the specified prefix and label that are not included in the configuration file are deleted when the File content profile is set to Default. When the File content profile is set to KVSet, any key-values in the store that are not included in the configuration file are deleted. If the box is unchecked, no key-values in the store will be deleted.  | *Unchecked*                       |
    | Separator    | The separator is the delimiter used for flattening JSON or YAML files into key-value. It will be ignored for property files and feature flags. Supported values include no-separator, period (.), comma (,), semicolon (\;), hyphen (-), underscore (_), double underscore (__), slash (/), and colon (\:).           | *:*                       |
    | Depth    | Optional. The depth for flattening JSON or YAML files into key-value pairs. By default, files are flattened to the deepest level if a separator is selected. This setting is not applicable for property files or feature flags.           |                      |
    | Add prefix       | Optional. If specified, a prefix will be added to the key names of all imported key-values.               | *TestApp:*                |
    | Add label        | Optional. If specified, the provided label will be assigned to all imported key-values. | *prod*                    |
    | Add content type | Optional. If specified, the provided content type will be added to all imported key-values. | *JSON (application/json)* |
    | Add tags | Optional. If specified, the provided tags will be added to all imported key-values. | *{tag: tag1}* |

1. Select **Apply** to proceed with the import.

You have successfully imported key-values from a JSON file. The key names were flattened using the `:` separator and prefixed with `TestApp:`. All imported key-values are labeled as `prod`, with a content type of `application/json`, and tagged with `tag: tag1`.

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

1. Enter the import command `az appconfig kv import` and add the following parameters:

    | Parameter  | Description                                                                         | Example                             |
    |------------|-------------------------------------------------------------------------------------|-------------------------------------|
    | `--name`   | Enter the name of the App Configuration store you want to import data to.           | `my-app-config-store`               |
    | `--source` | Enter `file` to indicate that you're importing app configuration data from a file.  | `file`                              |
    | `--path`   | Enter the local path to the file containing the data you want to import.            | `C:/Users/john/Downloads/data.json` |
    | `--format` | Enter yaml, properties, or json to indicate the format of the file you're importing. | `json`                              |

1. Optionally also add the following parameters:

    | Parameter        | Description                                                                                                                                                                                                                                              | Example            |
    |------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
    | `--separator`    | Optional. The separator is the delimiter for flattening the key-values to Json/Yaml. It's required for exporting hierarchical structure and will be ignored for property files and feature flags. Select one of the following options: `.`, `,`, `:`, `;`, `/`, `-`, `_`, `—`. | `;`              |
    | `--prefix`       | Optional. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of key-values in a configuration store. This prefix will be appended to the front of the "key" property of each imported key-value.                                                               | `TestApp:`         |
    | `--label`        | Optional. Enter a label that will be assigned to your imported key-values.                                                                                                                                                                               | `prod`             |
    | `--content-type` | Optional. Enter `appconfig/kvset` or `application/json` to state that the imported content consists of a Key Vault reference or a JSON file.                                                                                                      | `application/json` |

    Example: import all key-values and feature flags from a JSON file, apply the label "prod", and append the prefix "TestApp". Add the "application/json" content type.

    ```azurecli
    az appconfig kv import --name my-app-config-store --source file --path D:/abc.json --format json --separator ; --prefix TestApp: --label prod --content-type application/json
    ```

1. The command line displays a list of the coming changes. Confirm the import by selecting `y`.

    :::image type="content" source="./media/import-export/continue-import-file-prompt.png" alt-text="Screenshot of the CLI. Import from file confirmation prompt.":::

You imported key-values from a JSON file, and assigned them the label "prod" and the prefix "TestApp:". The separator ";" is used and all key-values that you imported have content type set as "JSON".

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

### Import data from an App Configuration store

You can import values from one App Configuration store to another App Configuration store, or you can import values from one App Configuration store to the same App Configuration store in order to duplicate its values and apply different parameters, such as new label or content type.

Follow the steps below to import key-values and feature flags from an Azure App Configuration store.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Navigate to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/import-app-configuration.png" alt-text="Screenshot of the Azure portal, importing from an App Configuration store.":::

1. The **Import** radio button is selected by default. Under **Source type**, select **App Configuration**.

1. Select an App Configuration store to import data from, and fill out the form with the following parameters:

    | Parameter      | Description                                                                                     | Example               |
    |----------------|-------------------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Your current subscription is selected by default.                                               | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Configuration store with configuration to import. Your current resource group is selected by default. | *my-resource-group*   |
    | Resource       | Select the App Configuration store that contains the configuration you want to import.          | *my-other-app-config-store* |

1. Fill out the next part of the form:

    | Parameter                               | Description                                                                                                                                                                                                                                                             | Example                   |
    |-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | Selection mode   | Select whether to import from regular key-values, which is the default option, or from a snapshot.   | *Default*                    |
    | Key filter | Used to filter key-values based on the key name for import. If no keys are specified, all keys are eligible.    |      Starts with *test*              |
    | At a specific time                      |Optional. Fill out this field to import key-values from a specific point in time in the selected configuration store. If left empty, it defaults to the current point in time of the key-values.| *07/28/2022 12:00:00 AM*  |
    | From label                              | Select one or more labels to import key-values associated with those labels. If no label is selected, all labels are eligible. | *prod*                    |
    | Exclude feature flag    | If checked, feature flags will not be imported.    | *Unchecked*                       |
    | Add prefix  | Optional. If specified, a prefix will be added to the key names of all imported key-values. | *TestApp:*                    |
    | Override labels       | Optional. By default, the original labels of the source key-values are preserved. To override them, check the box and enter a new label for imported key-values. | *new*                     |
    | Override content types |  Optional. By default, the original content types of the source key-values are preserved. To override them, check the box and enter a new content type for imported key-values. Note that the content type of feature flags cannot be overridden.  | *JSON (application/json)* |

1. Select **Apply** to proceed with the import.

You imported key-values from an App Configuration store as of January 28, 2021, at 12 AM, with key names starting with `test` and the label `prod`. The key names were prefixed with `TestApp:`. All imported key-values were assigned the label `new` and the content type `application/json`.

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

1. Enter the import command `az appconfig kv import`  and enter the following parameters:

    | Parameter    | Description                                                                                                                                                                                                                         | Example                          |
    |--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
    | `--name`     | Enter the name of the App Configuration store you want to import data into                                                                                                                                                          | `my-app-config-store`            |
    | `--source`   | Enter `appconfig` to indicate that you're importing data from an App Configuration store.                                                                                                                                           | `appconfig`                      |
    | `--src-name` | Enter the name of the App Configuration store you want to import data from.                                                                                                                                                         | `my-source-app-config`           |
    | `--src-label`| Restrict your import to key-values with a specific label. If you don't use this parameter, only key-values with a null label will be imported. Supports star sign as filter: enter `*` for all labels; `abc*` for all labels with abc as prefix.| `prod`                           |

1. Optionally add the following parameters:

    | Parameter        | Description                                                                                                                                               | Example                      |
    |------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------|
    | `--label`        | Optional. Enter a label that will be assigned to your imported key-values.                                                                                | `new`                        |
    | `--content-type` | Optional. Enter `appconfig/kvset` or `application/json` to state that the imported content consists of a Key Vault reference or a JSON file. Content type can only be overridden for imported key-values. Default content type for feature flags is "application/vnd.microsoft.appconfig.ff+json;charset=utf-8' by default and isn't updated by this parameter.       | `application/json`           |

    Example: import key-values and feature flags with the label "prod" from another App Configuration, and assign them the label "new". Add the "application/json" content type.

    ```azurecli
    az appconfig kv import --name my-app-config-store --source appconfig --src-name my-source-app-config --src-label prod --label new --content-type application/json
    ```

1. The command line displays a list of the coming changes. Confirm the import by selecting `y`.

    :::image type="content" source="./media/import-export/continue-import-app-configuration-prompt.png" alt-text="Screenshot of the CLI. Import from App Configuration confirmation prompt.":::

You imported key-values with the label "prod" from an App Configuration store, and assigned them the label "new". All key-values that you imported have content type set as "JSON".

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

### Import data from Azure App Service

Follow the steps below to import key-values from Azure App Service.

> [!NOTE]
> App Service doesn't currently support feature flags. All feature flags imported to App Service are converted to key-values automatically. Your App Service resources can only contain key-values.

#### [Portal](#tab/azure-portal)

From the Azure portal:

1. Navigate to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/import-app-service.png" alt-text="Screenshot of the Azure portal, importing from App Service.":::

1. The **Import** radio button is selected by default. Under **Source type**, select **App Services**.

1. Select an App Configuration store to import data from, and fill out the form with the following parameters:

    | Parameter      | Description                                                                         | Example              |
    |----------------|-------------------------------------------------------------------------------------|----------------------|
    | Subscription   | Your current subscription is selected by default.                                   | *my-subscription*    |
    | Resource group | Select a resource group that contains the App Service with configuration to import. | *my-resource-group*  |
    | Resource       | Select the App Service that contains the configuration you want to import.          | *my-app-service*     |

1. Fill out the next part of the form:

    | Parameter    | Description                                                                                                                                                                                                                                          | Example                   |
    |--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | Update settings to reference      |  If checked, the app settings in App Service will be updated to App Configuration references for the imported key-values. This allows you to manage your app settings in App Configuration going forward. Your App Service will automatically pull the current value from App Configuration. To learn more, see [Use App Configuration references for App Service and Azure Functions](/azure/app-service/app-service-configuration-references).    | *Checked*                 |
    | Add prefix       | Optional. If specified, a prefix will be added to the key names of all imported key-values.             | *TestApp:*                 |
    | Add label        | Optional. If specified, the provided label will be assigned to all imported key-values.   | *prod*                    |
    | Add content type | Optional. If specified, the provided content type will be added to all imported key-values. | *JSON (application/json)* |

1. Select **Apply** to proceed with the import.

You imported all application settings from an App Service as key-values, and assigned them the label `prod` and the prefix `TestApp:`. All key-values that you imported have content type set as `application/json`.

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

1. Enter the import command `az appconfig kv import` and add the following parameters:

    | Parameter              | Description                                                                                                                                      | Example                                                                                                                |
    |------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
    | `--name`               | Enter the name of the App Configuration store you want to import data to.                                                                        | `my-app-config-store`                                                                                                  |
    | `--source`             | Enter `appservice` to indicate that you're importing app configuration data from Azure App Service.                                              | `appservice`                                                                                                           |
    | `--appservice-account` | Enter the App Service's ARM ID or use the name of the App Service, if it's in the same subscription and resource group as the App Configuration. | `/subscriptions/123/resourceGroups/my-resource-group/providers/Microsoft.Web/sites/my-app-service` or `my-app-service` |

1. Optionally also add the following parameters:

    | Parameter        | Description                                                                                                                                                                                       | Example                   |
    |------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | `--prefix`       | Optional. A key prefix is the beginning part of a key-value's "key" property. Prefixes can be used to manage groups of key-values in a configuration store. This prefix will be appended to the front of the "key" property of each imported key-value.        | `TestApp:`                 |
    | `--label`        | Optional. Enter a label that will be assigned to your imported key-values. If you don't specify a label, the null label will be assigned to your key-values.                                      | `prod`                    |
    | `--content-type` | Optional. Enter appconfig/kvset or application/json to state that the imported content consists of a Key Vault reference or a JSON file.                                                   | `application/json` |

    To get the value for `--appservice-account`, use the command `az webapp show --resource-group <resource-group> --name <resource-name>`.

    Example: import all application settings from your App Service as key-values with the label "prod", to your App Configuration store, and add a "TestApp:" prefix.

    ```azurecli
    az appconfig kv import --name my-app-config-store --source appservice --appservice-account /subscriptions/123/resourceGroups/my-resource-group/providers/Microsoft.Web/sites/my-app-service --label prod --prefix TestApp:
    ```

1. The command line displays a list of the coming changes. Confirm the import by selecting `y`.

    :::image type="content" source="./media/import-export/continue-import-app-service-prompt.png" alt-text="Screenshot of the CLI. Import from App Service confirmation prompt.":::

You imported all application settings from your App Service as key-values, assigned them the label "prod", and added a "TestApp:" prefix. All key-values that you have imported have content type set as "JSON".

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

## Export data

Export writes configuration data stored in App Configuration to another destination. Use the export function, for example, to save data from an App Configuration store to a file that can be embedded in your application code during deployment.

This guide shows how to export App Configuration data:

- [to a configuration file in Json, Yaml or Properties](#export-data-to-a-configuration-file)
- [to an App Configuration store](#export-data-to-an-app-configuration-store)
- [to an Azure App Service resource](#export-data-to-azure-app-service)

### Export data to a configuration file

Follow these steps to export configuration data from an App Configuration store to a JSON, YAML, or Properties file.


### [Portal](#tab/azure-portal)

From the [Azure portal](https://portal.azure.com), follow these steps:

1. Navigate to your App Configuration store, and select **Import/export**.

    :::image type="content" source="./media/import-export/export-file.png" alt-text="Screenshot of the Azure portal, exporting a file":::

1. Select the **Export** radio button and under **Target type**, select **Configuration file**.

1. Fill out the form with the following parameters:

    | Parameter          | Description  | Example                  |
    |--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
    | File type          | Select the file type for export: YAML, Properties, or JSON. | *JSON*                   | 
    | File content profile   | Select a content profile: Default or KVSet. The *Default* file content profile refers to the conventional configuration file schema widely adopted by existing programming frameworks or systems, supports JSON, Yaml, or Properties file formats. The *KVSet* file content profile refers to a file schema that contains all properties of an App Configuration key-value, including key, value, label, content type, and tags. | *Default*                   |
    | Selection mode          | Select whether to export from regular key-values, which is the default option, or from a snapshot.   | *Default*                   | 
    | Key filter | Used to filter key-values based on the key name for export. If no keys are specified, all keys are eligible.    |      Starts with *TestApp:*              |
    | At a specific time | Optional. Fill out this field to export key-values from a specific point in time in the selected configuration store. If left empty, it defaults to the current point in time of the key-values. | *07/28/2022 12:00:00 AM* |
    | From label         | Select the label to export key-values associated with those labels. If no label is selected, all labels are eligible. Note that you can only select one label when exporting with the `Default` file content profile. To export key-values with more than one label, use the `KVSet` file content profile. | *prod*                   |
    | Remove prefix             | Optional. If specified, the prefix will be removed from the key names of all exported key-values that contain it. | *TestApp:*               |
    | Separator          | The separator is the delimiter used for segmenting key names and reconstructing hierarchical configurations for JSON or YAML files from key-values. It will be ignored for property files and feature flags. Supported values include no separator, period (.), comma (,), semicolon (\;), hyphen (-), underscore (_), double underscore (__), slash (/), and colon (\:). | *:*                      |


1. Select **Export** to finish the export.

You exported key-values from an App Configuration store as of July 28, 2021, at 12 AM, with key names starting with `TestApp:` and the label `prod`, to a JSON file. The prefix `TestApp:` was trimmed from key names, and the separator `:` was used to segment the key names and reconstruct the hierarchical JSON format.

### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

1. Enter the export command `az appconfig kv export` and add the following parameters:

    | Parameter       | Description                                                                                                                                                          | Example                             |
    |-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
    | `--name`        | Enter the name of the App Configuration store that contains the key-values you want to export.                                                                       | `my-app-config-store`               |
    | `--destination` | Enter `file` to indicate that you're exporting data to a file.                                                                                                       | `file`                              |
    | `--path`        | Enter the path where you want to save the file.                                                                                                           | `C:/Users/john/Downloads/data.json` |
    | `--format`      | Enter `yaml`, `properties` or `json` to indicate the format of the file you want to export.                                                                                | `json`                              |
    | `--label`       | Enter a label to export key-values and feature flags with this label. If you don't specify a label, by default, you only export key-values and feature flags with no label. You can enter one label, enter several labels by separating them with `,`, or use `*` to take all of the labels into account. | `prod`                              |

    > [!IMPORTANT]
    > If you don't select a label, only key-values without labels will be exported. To export a key-value with a label, you must select its label.

1. Optionally also add the following parameters:

    | Parameter        | Description                                                                                                                                                                                                                                             | Example                   |
    |------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | `--separator`    | Optional. The separator is the delimiter for flattening the key-values to Json/Yaml. It's required for exporting hierarchical structure and will be ignored for property files and feature flags. Select one of the following options: `.`, `,`, `:`, `;`, `/`, `-`, `_`, `—`. | `;`                     |
    | `--prefix`       | Optional. Prefix to be trimmed from each key-value's "key" property. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of key-values in a configuration store. Prefix will be ignored for feature flags.                                                | `TestApp:`                |

    Example: export all key-values and feature flags with label "prod" to a JSON file.

    ```azurecli
    az appconfig kv export --name my-app-config-store --label prod --destination file --path D:/abc.json --format json --separator ; --prefix TestApp:
    ```

1. The command line displays a list of key-values getting exported to the file. Confirm the export by selecting `y`.

    :::image type="content" source="./media/import-export/continue-export-file-prompt.png" alt-text="Screenshot of the CLI. Export to a file confirmation prompt.":::

You've exported key-values and feature flags that have the "prod" label to a configuration file, and have trimmed the prefix "TestApp". Values are separated by ";" in the file.

For more optional parameters and examples, go to [az appconfig kv export](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-export&preserve-view=true).

---

### Export data to an App Configuration store

Follow the steps below to export key-values and feature flags to an Azure App Configuration store.

You can export values from one App Configuration store to another App Configuration store, or you can export values from one App Configuration store to the same App Configuration store in order to duplicate its values and apply different parameters, such as new label or content type.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Navigate to your App Configuration store that contains the data you want to export, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/export-app-configuration.png" alt-text="Screenshot of the Azure portal, exporting from an App Configuration store.":::

1. Select the **Export** radio button and under **Target type**, select **App Configuration**.

1. Fill out the form with the following parameters:

    | Parameter      | Description                                                                                     | Example               |
    |----------------|-------------------------------------------------------------------------------------------------|-----------------------|
    | Selection mode          | Select whether to export from regular key-values, which is the default option, or from a snapshot.    | *Default*                   | 
    | Key filter | Used to filter key-values based on the key name for export. If no keys are specified, all keys are eligible.    |      Starts with *TestApp:*               |
    | At a specific time | Optional. Fill out this field to export key-values from a specific point in time in the selected configuration store. If left empty, it defaults to the current point in time of the key-values. | *07/28/2022 12:00:00 AM* |
    | From label         | Select one or more labels to export key-values associated with those labels. If no label is selected, all labels are eligible.  | *prod*                   |
    | Exclude feature flag    | If checked, feature flags will not be exported.          | *Unchecked*                       |

1. Select destination store, fill out the form with the following parameters:

    | Parameter      | Description  | Example               |
    |----------------|-------------------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Your current subscription is selected by default.                                               | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Configuration store where you want to export the configuration. Your current resource group is selected by default. | *my-resource-group*   |
    | Resource       | Select the App Configuration store where you want to export the configuration.         | *my-other-app-config-store* |


1. Fill out the next part of the form:

    | Parameter   | Description  | Example                   |
    |-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | Remove prefix             | Optional. If specified, the prefix will be removed from the key names of all exported key-values that contain it.  | *TestApp:*               |
    | Override labels       | Optional. By default, the original labels of the source key-values are preserved. To override them, check the box and enter a new label for exported key-values. | *new*                     |
    | Override content types |  Optional. By default, the original content types of the source key-values are preserved. To override them, check the box and enter a new content type for exported key-values. Note that the content type of feature flags cannot be overridden.  | *JSON (application/json)* |

1. Select **Apply** to proceed with the export.

You exported key-values from an App Configuration store as of July 28, 2022, at 12 AM, with key names starting with `TestApp:` and the label `prod`, to another App Configuration store. All exported key-values were trimmed the key prefix `TestApp:`, and assigned the label `new` and the content type `application/json`.

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

1. Enter the export command `az appconfig kv export`  and enter the following parameters:

    | Parameter        | Description                                                                                                                                                        | Example               |
    |------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
    | `--name`         | Enter the name of the App Configuration store that contains the key-values you want to export.                                                                     | `my-app-config-store` |
    | `--destination`  | Enter `appconfig` to indicate that you're exporting data to an App Configuration store.                                                                            | `appconfig`           |
    | `--dest-name`    | Enter the name of the App Configuration store you want to export data to.                                                                                          | `my-other-app-config-store` |
    | `--label`        | Enter a label to export key-values and feature flags with this label. If you don't specify a label, by default, you will only export key-values and feature flags with no label. You can enter one label, enter several labels by separating them with `,`, or use `*` to take all of the labels in account. | `prod` |

    > [!IMPORTANT]
    > If the key-values you want to export have labels, you must use the command `--label` and enter the corresponding labels. If you don't select a label, only key-values without labels will be exported. Use a comma sign (`,`) to select several labels or use `*` to include all labels, including the null label (no label).

1. Optionally also add the following parameter:

    | Parameter        | Description                                                                                                                                               | Example                 |
    |------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
    | `--dest-label`   | Optional. Enter a destination label, to assign this label to exported key-values.                                                                         | `new`                    |

    Example: export key-values and feature flags with the label "prod" to another App Configuration store and add the destination label "new".

    ```azurecli
    az appconfig kv export --name my-app-config-store --destination appconfig --dest-name my-other-app-config-store --dest-label new --label prod
    ```

1. The command line displays a list of key-values getting exported to the files. Confirm the export by selecting `y`.

   :::image type="content" source="./media/import-export/continue-export-app-configuration-prompt.png" alt-text="Screenshot of the CLI. Export to App Configuration confirmation prompt.":::

You exported key-values and feature flags that have the label "prod" from an App Configuration store and assigned them the label "new".

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

### Export data to Azure App Service

Follow the steps below to export key-values to Azure App Service.

> [!NOTE]
> Exporting feature flags to App Service is not supported.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Navigate to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/export-app-service.png" alt-text="Screenshot of the Azure portal, exporting from App Service.":::

1. Select the **Export** radio button and under **Target type**, select **App Services**.

1. The **Export as reference** option is checked by default. When the box is checked, the application settings in App Service will be added as App Configuration references for the exported key-values. This allows you to manage your settings in App Configuration, with your App Service automatically pulling the current values from App Configuration. To learn more, see [Use App Configuration references for App Service and Azure Functions](/azure/app-service/app-service-configuration-references). If the box is unchecked, the key and value will be directly exported to App Service. Remember to export your data again whenever you make changes in App Configuration to ensure your application picks up the updates.

1. Fill out the form with the following parameters:

    | Parameter      | Description                                                                                     | Example               |
    |----------------|-------------------------------------------------------------------------------------------------|-----------------------|
    | Selection mode          | Select whether to export from regular key-values, which is the default option, or from a snapshot.    | *Default*                   | 
    | Key filter | Used to filter key-values based on the key name for export. If no keys are specified, all keys are eligible.  |      Starts with *TestApp:*              |
    | At a specific time | Optional. Fill out this field to export key-values from a specific point in time in the selected configuration store. If left empty, it defaults to the current point in time of the key-values.    | *07/28/2022 12:00:00 AM* |
    | From label         | Select one label to export key-values associated with this label. | *prod*                   |

1. Select a destination store and fill out the form with the following parameters:

    | Parameter      | Description                                                                         | Example               |
    |----------------|-------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Your current subscription is selected by default.                                   | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Service where you want to export the configuration. | *my-resource-group*   |
    | Resource       | Select the App Service where you want to export the configuration.        | *my-app-service* |


1. Optionally fill out the next part of the form:

    | Parameter          | Description                                                                                                                                                                                                                            | Example                   |
    |--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | Remove prefix             | Optional. If specified, the prefix will be removed from the key names of all exported key-values that contain it.  | *TestApp:*                 |

1. Select **Apply** to proceed with the export.

You exported key-values from an App Configuration store as of July 28, 2022, at 12 AM, with key names starting with `TestApp:` and the label `prod`, to the application settings of an App Service resource. The prefix `TestApp:` was trimmed from exported key names.

If you checked the box to export key-values as references, the exported key-values are indicated as App Configuration references in the "Source" column of your App Service resource configuration settings.

:::image type="content" source="./media/import-export/export-app-service-reference-value.png" alt-text="Screenshot of App Service configuration settings. Exported App Configuration reference in App Service(Portal)."::: 

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

1. Enter the export command `az appconfig kv export`  and enter the following parameters:

    | Parameter              | Description                                                                                                                                                        | Example                                                                                                                   |
    |------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
    | `--name`               | Enter the name of the App Configuration store that contains the key-values you want to export.                                                                     | `my-app-config-store`                                                                                                     |
    | `--destination`        | Enter `appservice` to indicate that you're exporting data to App Service.                                                                                          | `appservice`                                                                                                              |
    | `--appservice-account` | Enter the App Service's ARM ID or use the name of the App Service, if it's in the same subscription and resource group as the App Configuration.                   | `/subscriptions/123/resourceGroups/my-as-resource-group/providers/Microsoft.Web/sites/my-app-service` or `my-app-service` |
    | `--label`              | Optional. Enter a label to export key-values and feature flags with this label. If you don't specify a label, by default, you'll only export key-values and feature flags with no label. | `prod`                                                                                                                    |

    To get the value for `--appservice-account`, use the command `az webapp show --resource-group <resource-group> --name <resource-name>`.

1. Optionally also add a prefix:

    | Parameter  | Description                                                                                                                                                    | Example   |
    |------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
    | `--prefix` | Optional. Prefix to be trimmed from an exported key-value's "key" property. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of key-values in a configuration store. | `TestApp:` |

    Example: export all key-values with the label "prod" to an App Service application and trim the prefix "TestApp".

    ```azurecli
    az appconfig kv export --name my-app-config-store --destination appservice --appservice-account /subscriptions/123/resourceGroups/my-resource-group/providers/Microsoft.Web/sites/my-app-service/config/web --label prod --prefix TestApp:
    ```

    The command line displays a list of key-values getting exported to an App Service resource. Confirm the export by selecting `y`.

    :::image type="content" source="./media/import-export/continue-export-app-service-prompt.png" alt-text="Screenshot of the CLI. Export to App Service confirmation prompt.":::

    You exported all key-values with the label "prod" to an Azure App Service resource, and trimmed the prefix "TestApp:".

1. Optionally specify a flag to export as an App Configuration Reference.

    | Parameter  | Description                                                                                                                                                    |
    |------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | `--export-as-reference` `-r` | Optional. Specify whether key-values are exported to App Service as App Configuration references. [Learn more](../app-service/app-service-configuration-references.md). |

    Example: export all key-values with the label "prod" as app configuration references to an App Service application.

    ```azurecli
    az appconfig kv export --name my-app-config-store --destination appservice --appservice-account "/subscriptions/123/resourceGroups/my-resource-group/providers/Microsoft.Web/sites/my-app-service" --label prod --export-as-reference
    ```

    The command line displays a list of key-values getting exported as app configuration references to an App Service resource. Confirm the export by selecting `y`.

    :::image type="content" source="./media/import-export/export-app-service-reference-cli-preview.png" alt-text="Screenshot of the CLI. Export App Configuration reference to App Service confirmation prompt.":::

    You've exported all key-values with the label "prod" as app configuration references to an Azure App Service resource. In your App Service resource, the imported key-values will be indicated as App Configuration references in the "Source" column.

    :::image type="content" source="./media/import-export/export-app-service-reference-value.png" alt-text="Screenshot of App Service configuration settings. Exported App Configuration reference in App Service.":::

For more optional parameters and examples, go to [az appconfig kv export](/cli/azure/appconfig/kv#az-appconfig-kv-export).

---

## Error messages

You may encounter the following error messages when importing or exporting App Configuration key-values:

- **Public access is disabled for your store or you are accessing from a private endpoint that is not in the store’s private endpoint configurations**. If your App Configuration store has private endpoints enabled, you can only access it from within the configured virtual network by default. Ensure that the machine running the Azure portal or CLI is joined to the same virtual network as the private endpoint. If you have just enabled public network access to your App Configuration store, wait at least 5 minutes before retrying to allow the cache to refresh.

## Next steps

> [!div class="nextstepaction"]
> [Integrate with a CI/CD pipeline](./integrate-ci-cd-pipeline.md)
