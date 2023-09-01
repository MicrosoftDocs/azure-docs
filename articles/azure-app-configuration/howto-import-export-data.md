---
title: Import or export data with Azure App Configuration
description: Learn how to import or export configuration data to or from Azure App Configuration. Exchange data between your App Configuration store and code project.
services: azure-app-configuration
author: mcleanbyron
ms.service: azure-app-configuration
ms.topic: how-to
ms.date: 08/24/2022
ms.author: mcleans
---

# Import or export configuration data

Azure App Configuration supports data import and export operations. Use these operations to work with configuration data in bulk and exchange data between your App Configuration store and code project. For example, you can set up one App Configuration store for testing and another one for production. You can copy application settings between them so that you don't have to enter data twice.

This article provides a guide for importing and exporting data with App Configuration. If you’d like to set up an ongoing sync with your GitHub repo, take a look at [GitHub Actions](./concept-github-action.md) and [Azure Pipelines tasks](./pull-key-value-devops-pipeline.md).

You can import or export data using either the [Azure portal](https://portal.azure.com) or the [Azure CLI](./scripts/cli-import.md).

## Import data

Import brings configuration data into an App Configuration store from an existing source. Use the import function to migrate data into an App Configuration store or aggregate data from multiple sources.

This guide shows how to import App Configuration data:

- [from a configuration file in Json, Yaml or Properties](#import-data-from-a-configuration-file)
- [from an App Configuration store](#import-data-from-an-app-configuration-store)
- [from Azure App Service](#import-data-from-azure-app-service)

### Import data from a configuration file

Follow the steps below to import key-values from a file.

> [!NOTE]
> Importing feature flags from a file is not supported. If a configuration file contains feature flags, they will be imported as regular key-values automatically.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/import-file.png" alt-text="Screenshot of the Azure portal, importing a file.":::

1. On the **Import** tab, select **Configuration file** under **Source service**.

1. Fill out the form with the following parameters:

    | Parameter    | Description                                                                             | Example |
    |--------------|-----------------------------------------------------------------------------------------|----------|
    | For language | Choose the language of the file you're importing between .NET, Java (Spring) and Other. | *.NET*   |
    | File type    | Select the type of file you're importing between Yaml, Properties and Json.             | *Json*   |

1. Select the **Folder** icon, and browse to the file to import.

    > [!NOTE]
    > A message is displayed on screen, indicating that the file was fetched successfully.

1. Fill out the next part of the form:

    | Parameter    | Description                                                                                                                                                                                                                             | Example                   |
    |--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | Separator    | The separator is the character parsed in your imported configuration file to separate key-values that will be added to your configuration store. Select one of the following options: *.*, *,*, *:*, *;*, */*, *-*, *_*, *—*.           | *;*                       |
    | Prefix       | Optional. A key prefix is the beginning part of a key-value's "key" property. Prefixes can be used to manage groups of key-values in a configuration store. The entered prefix will be appended to the front of the "key" property of every key-value you import from this file.               | *TestApp:*                |
    | Label        | Optional. Select an existing label or enter a new label that will be assigned to your imported key-values.                                                                                                                              | *prod*                    |
    | Content type | Optional. Indicate if you're importing a JSON file or Key Vault references. For more information about Key Vault references, go to [Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md). | *JSON (application/json)* |

1. Select **Apply** to proceed with the import.

You've imported key-values from a JSON file, have assigned them the label "prod" and the prefix "TestApp". The separator ":" is used and all the key-values you've imported have content type set as "JSON".

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

1. Enter the import command `az appconfig kv import` and add the following parameters:

    | Parameter  | Description                                                                         | Example                             |
    |------------|-------------------------------------------------------------------------------------|-------------------------------------|
    | `--name`   | Enter the name of the App Configuration store you want to import data to.           | `my-app-config-store`               |
    | `--source` | Enter `file` to indicate that you're importing app configuration data from a file.  | `file`                              |
    | `--path`   | Enter the local path to the file containing the data you want to import.            | `C:/Users/john/Downloads/data.json` |
    | `--format` | Enter yaml, properties or json to indicate the format of the file you're importing. | `json`                              |

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

You've imported key-values from a JSON file, have assigned them the label "prod" and the prefix "TestApp:". The separator ";" is used and all key-values that you have imported have content type set as "JSON".

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

### Import data from an App Configuration store

You can import values from one App Configuration store to another App Configuration store, or you can import values from one App Configuration store to the same App Configuration store in order to duplicate its values and apply different parameters, such as new label or content type.

Follow the steps below to import key-values and feature flags from an Azure App Configuration store.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/import-app-configuration.png" alt-text="Screenshot of the Azure portal, importing from an App Configuration store.":::

1. On the **Import** tab, select **App Configuration** under **Source service**.

1. Select **Select resource**, fill out the form with the following parameters, and select **Apply**:

    | Parameter      | Description                                                                                     | Example               |
    |----------------|-------------------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Your current subscription is selected by default.                                               | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Configuration store with configuration to import. Your current resource group is selected by default. | *my-resource-group*   |
    | Resource       | Select the App Configuration store that contains the configuration you want to import.          | *my-other-app-config-store* |

    > [!NOTE]
    > The message "Access keys fetched successfully" indicates that the connection with the App Configuration store was successful."

1. Fill out the next part of the form:

    | Parameter                               | Description                                                                                                                                                                                                                                                             | Example                   |
    |-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | From label                              | Select at least one label to import values with the corresponding labels. **Select all** will import key-values with any label, and **(No label)** will restrict the import to key-values with no label.                                                                            | *prod*                    |
    | At a specific time                      | Optional. Fill out to import key-values from a specific point in time. This is the point in time of the key-values in the selected configuration store. Format: "YYYY-MM-DDThh:mm:ssZ". This field defaults to the current point in time of the key-values when left empty.                                                                                     | *07/28/2022 12:00:00 AM*  |
    | Override default key-value labels       | Optional. By default, imported items use their current label. Check the box and enter a label to override these defaults with a custom label.                                                                                                                           | *new*                     |
    | Override default key-value content type | Optional. By default, imported items use their current content type. Check the box and select **Key Vault Reference** or **JSON (application/json)** under **Content type** to state that the imported content consists of a Key Vault reference or a JSON file. Content type can only be overridden for imported key-values. Default content type for feature flags is "application/vnd.microsoft.appconfig.ff+json;charset=utf-8' and isn't updated by this parameter.| *JSON (application/json)* |

1. Select **Apply** to proceed with the import.

You've imported key-values and feature flags with the "prod" label from an App Configuration store on January 28, 2021 at 12 AM, and have assigned them the label "new". All key-values that you have imported have content type set as "JSON".

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

You've imported key-values with the label "prod" from an App Configuration store and have assigned them the label "new". All key-values that you have imported have content type set as "JSON".

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

### Import data from Azure App Service

Follow the steps below to import key-values from Azure App Service.

> [!NOTE]
> App Service doesn't currently support feature flags. All feature flags imported to App Service are converted to key-values automatically. Your App Service resources can only contain key-values.

#### [Portal](#tab/azure-portal)

From the Azure portal:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/import-app-service.png" alt-text="Screenshot of the Azure portal, importing from App Service.":::

1. On the **Import** tab, select **App Services** under **Source service**.

1. Select **Select resource**, fill out the form with the following parameters, and select **Apply**:

    | Parameter      | Description                                                                         | Example              |
    |----------------|-------------------------------------------------------------------------------------|----------------------|
    | Subscription   | Your current subscription is selected by default.                                   | *my-subscription*    |
    | Resource group | Select a resource group that contains the App Service with configuration to import. | *my-resource-group*  |
    | Resource       | Select the App Service that contains the configuration you want to import.          | *my-app-service*     |

    > [!NOTE]
    > A message is displayed, indicating the number of key-values that were successfully fetched from the source App Service resource.

1. Fill out the next part of the form:

    | Parameter    | Description                                                                                                                                                                                                                                          | Example                   |
    |--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | Prefix       | Optional. A key prefix is the beginning part of a key-values's "key" property. Prefixes can be used to manage groups of key-values in a configuration store. This prefix will be appended to the front of the "key" property of each imported key-value.                                                           | *TestApp:*                 |
    | Label        | Optional. Select an existing label or enter a new label that will be assigned to your imported key-values.                                                                                                                                           | *prod*                    |
    | Content type | Optional. Indicate if the file you're importing is a Key Vault reference or a JSON file. For more information about Key Vault references, go to [Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md). | *JSON (application/json)* |

1. Select **Apply** to proceed with the import.

You've imported all application settings from an App Service as key-values and assigned them the label "prod" and the prefix "TestApp". All key-values that you have imported have content type set as "JSON".

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

You've imported all application settings from your App Service as key-values, have assigned them the label "prod", and have added a "TestApp:" prefix. All key-values that you have imported have content type set as "JSON".

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

## Export data

Export writes configuration data stored in App Configuration to another destination. Use the export function, for example, to save data from an App Configuration store to a file that can be embedded in your application code during deployment.

This guide shows how to export App Configuration data:

- [to a configuration file in Json, Yaml or Properties](#export-data-to-a-configuration-file)
- [to an App Configuration store](#export-data-to-an-app-configuration-store)
- [to an Azure App Service resource](#export-data-to-azure-app-service)

### Export data to a configuration file

Follow the steps below to export configuration data from an app configuration store to a Json, Yaml or Properties file.

> [!NOTE]
> Exporting feature flags from an App Configuration store to a configuration file is currently only supported in the CLI.

### [Portal](#tab/azure-portal)

From the [Azure portal](https://portal.azure.com), follow these steps:

1. Browse to your App Configuration store, and select **Import/export**.

    :::image type="content" source="./media/import-export/export-file.png" alt-text="Screenshot of the Azure portal, exporting a file":::

1. On the **Export** tab, select **Configuration file** under **Target service**.

1. Fill out the form with the following parameters:

    | Parameter          | Description                                                                                                                                                                                                                       | Example                  |
    |--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------|
    | Prefix             | Optional. This prefix will be trimmed from each key-value's "key" property. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of key-values in a configuration store.                                                         | *TestApp:*               |
    | From label         | Select an existing label to restrict your export to key-values with a specific label. If you don't select a label, by default only key-values with the "No Label" label will be exported. See note below.                         | *prod*                   |
    | At a specific time | Optional. Fill out to import key-values from a specific point in time. This is the point in time of the key-values in the selected configuration store. Format: "YYYY-MM-DDThh:mm:ssZ". This field defaults to the current point in time of the key-values when left empty.                                               | *07/28/2022 12:00:00 AM* |
    | File type          | Select the type of file you're exporting between Yaml, Properties or Json.                                                                                                                                                        | *JSON*                   |
    | Separator          | The separator is the delimiter for flattening the key-values to Json/Yaml. It supports the configuration's hierarchical structure and doesn't apply to property files and feature flags. Select one of the following options: *.*, *,*, *:*, *;*, */*, *-*, *_*, *—*,  or *(No separator)*. | *;*                      |

    > [!IMPORTANT]
    > If you don't select a *From label*, only key-values without labels will be exported. To export a key-value with a label, you must select its label. Note that you can only select one label per export in portal, in case you want to export the key-values with all labels specified please use CLI.

1. Select **Export** to finish the export.

You've exported key-values that have the "prod" label from a configuration file, at their state from 07/28/2021 12:00:00 AM, and have trimmed the prefix "TestApp". Values are separated by ";" in the file.

### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

1. Enter the export command `az appconfig kv export` and add the following parameters:

    | Parameter       | Description                                                                                                                                                          | Example                             |
    |-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
    | `--name`        | Enter the name of the App Configuration store that contains the key-values you want to export.                                                                       | `my-app-config-store`               |
    | `--destination` | Enter `file` to indicate that you're exporting data to a file.                                                                                                       | `file`                              |
    | `--path`        | Enter the path where you want to save the file.                                                                                                           | `C:/Users/john/Downloads/data.json` |
    | `--format`      | Enter `yaml`, `properties` or `json` to indicate the format of the file you want to export.                                                                                | `json`                              |
    | `--label`       | Enter a label to export key-values and feature flags with this label. If you don't specify a label, by default, you will only export key-values and feature flags with no label. You can enter one label, enter several labels by separating them with `,`, or use `*` to take all of the labels in account. | `prod`                              |

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

1. Browse to the App Configuration store that contains the data you want to export, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/export-app-configuration.png" alt-text="Screenshot of the Azure portal, exporting from an App Configuration store.":::

1. On the **Export** tab, select **App Configuration** under **Target service**.

1. Select **Select resource**, fill out the form with the following parameters, and select **Apply**:

    | Parameter      | Description                                                                                     | Example               |
    |----------------|-------------------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Your current subscription is selected by default.                                               | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Configuration store with configuration to import. | *my-resource-group*   |
    | Resource       | Select the App Configuration store that contains the configuration you want to import.          | *my-app-config-store* |

1. The page now displays the selected **Target service** and resource ID. The **Select resource** action lets you switch to another source App Configuration store.

    > [!NOTE]
    > A message is displayed on screen, indicating that the key-values were fetched successfully.

1. Fill out the next part of the form:

    | Parameter                               | Description                                                                                                                                                                                                                                                             | Example                   |
    |-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | From label                              | Select at least one label to export values with the corresponding labels. **Select all** will export key-values with any label, and **(No label)** will restrict the export to key-values with no label.                                                                            | *prod*                    |
    | At a specific time                      | Optional. Fill out to import key-values from a specific point in time. This is the point in time of the key-values in the selected configuration store. Format: "YYYY-MM-DDThh:mm:ssZ". This field defaults to the current point in time of the key-values when left empty.                                                                                     | *07/28/2022 12:00:00 AM*  |
    | Override default key-value labels       | Optional. By default, imported items use their current label. Check the box and enter a label to override these defaults with a custom label.                                                                                                                           | *new*                     |

1. Select **Apply** to proceed with the export.

You've exported key-values and feature flags that have the label "prod" from an App Configuration store, at their state from 07/28/2022 12:00:00 AM, and have assigned them the label "new".

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

You've exported key-values and feature flags that have the label "prod" from an App Configuration store and have assigned them the label "new".

For more optional parameters and examples, go to [az appconfig kv import](/cli/azure/appconfig/kv?view=azure-cli-latest#az-appconfig-kv-import&preserve-view=true).

---

### Export data to Azure App Service

Follow the steps below to export key-values to Azure App Service.

> [!NOTE]
> Exporting feature flags to App Service is currently not supported.

#### [Portal](#tab/azure-portal)

From the Azure portal, follow these steps:

1. Browse to your App Configuration store, and select **Import/export** from the **Operations** menu.

    :::image type="content" source="./media/import-export/export-app-service.png" alt-text="Screenshot of the Azure portal, exporting from App Service.":::

1. On the **Export** tab, select **App Services** under **Target service**.

1. Select **Select resource**, fill out the form with the following parameters, and select **Apply**:

    | Parameter      | Description                                                                         | Example               |
    |----------------|-------------------------------------------------------------------------------------|-----------------------|
    | Subscription   | Your current subscription is selected by default.                                   | *my-subscription*     |
    | Resource group | Select a resource group that contains the App Service with configuration to export. | *my-resource-group*   |
    | Resource       | Select the App Service that contains the configuration you want to export.          | *my-app-service* |

1. The page now displays the selected **Target service** and resource ID. The **Select resource** action lets you switch to another target App Service resource.

1. Optionally fill out the next part of the form:

    | Parameter          | Description                                                                                                                                                                                                                            | Example                   |
    |--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
    | Prefix             | Optional. This prefix will be trimmed from each exported key-value's "key" property. A key prefix is the beginning part of a key. Prefixes can be used to manage groups of key-values in a configuration store. Prefix will be ignored for feature flags.           | *TestApp:*                 |
    | Export as reference | Optional. Check to export key-values to App Service as App Configuration references. [Learn more](../app-service/app-service-configuration-references.md) |
    | At a specific time | Optional. Fill out to export key-values from a specific point in time. This is the point in time of the key-values in the selected configuration store. Format: "YYYY-MM-DDThh:mm:ssZ". This field defaults to the current point in time of the key-values when left empty.                                                  | *07/28/2022 12:00:00 AM*  |
    | From label         | Optional. Select an existing label to restrict your export to key-values with a specific label. If you don't select a label, only key-values with the "No label" label will be exported.                                    | *prod*                    |

1. Select **Apply** to proceed with the export.

You've exported key-values that have the "prod" label from an App Service resource, at their state from 07/28/2021 12:00:00 AM, and have trimmed the prefix "TestApp". The key-values have been exported with a content type in JSON format.

If you checked the box to export key-values as references, the exported key-values will be indicated as App Configuration references in the "Source" column of your App Service resource configuration settings.

:::image type="content" source="./media/import-export/export-app-service-reference-value.png" alt-text="Screenshot of App Service configuration settings. Exported App Configuration reference in App Service(Portal)."::: 

#### [Azure CLI](#tab/azure-cli)

From the Azure CLI, follow the steps below. If you don't have the Azure CLI installed locally, you can optionally use [Azure Cloud Shell](../cloud-shell/overview.md).

1. Enter the export command `az appconfig kv export`  and enter the following parameters:

    | Parameter              | Description                                                                                                                                                        | Example                                                                                                                   |
    |------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
    | `--name`               | Enter the name of the App Configuration store that contains the key-values you want to export.                                                                     | `my-app-config-store`                                                                                                     |
    | `--destination`        | Enter `appservice` to indicate that you're exporting data to App Service.                                                                                          | `appservice`                                                                                                              |
    | `--appservice-account` | Enter the App Service's ARM ID or use the name of the App Service, if it's in the same subscription and resource group as the App Configuration.                   | `/subscriptions/123/resourceGroups/my-as-resource-group/providers/Microsoft.Web/sites/my-app-service` or `my-app-service` |
    | `--label`              | Optional. Enter a label to export key-values and feature flags with this label. If you don't specify a label, by default, you will only export key-values and feature flags with no label. | `prod`                                                                                                                    |

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

    You've exported all key-values with the label "prod" to an Azure App Service resource and have trimmed the prefix "TestApp:".


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

- **Selected file must be between 1 and 2097152 bytes.**: your file is too large. Select a smaller file.
- **Public access is disabled for your store or you are accessing from a private endpoint that is not in the store’s private endpoint configurations**. To import key-values from an App Configuration store, you need to have access to that store. If necessary, enable public access for the source store or access it from an approved private endpoint. If you just enabled public access, wait up to 5 minutes for the cache to refresh.

## Next steps

> [!div class="nextstepaction"]
> [Integrate with a CI/CD pipeline](./integrate-ci-cd-pipeline.md)
