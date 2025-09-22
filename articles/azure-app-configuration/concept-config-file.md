---
title: Azure App Configuration Support for Configuration Files
description: Become familiar with configuration file use in Azure App Configuration. Find out about import tooling and the KVSet and default file content profiles.
author: zhenlan
ms.author: zhenlwa
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 08/05/2025
ms.custom: sfi-ropc-nochange
# customer intent: As a developer, I want to become familiar with import tooling for Azure App Configuration and with the KVSet and default file content profiles so that I can work with configuration data in bulk and exchange data between my App Configuration store and code projects.
---

# Azure App Configuration support for configuration files

A common way to store configuration data is to use files. If you want to use Azure App Configuration to manage your configuration data but you currently use files, you don't have to enter your data manually. You can use tools to [import your configuration files](./howto-import-export-data.md).

If you plan to manage your data in App Configuration, the import operation is a one-time data migration. Another option is to continue managing your configuration data in files and to import the files recurrently as part of your continuous integration and continuous delivery (CI/CD) process. This case comes up when you adopt [configuration as code](./howto-best-practices.md#configuration-as-code).

Two file content profiles are available when you use configuration files:

- The **default file content profile**: The conventional configuration file schema
- The **KVSet file content profile**: A schema that contains all App Configuration key-value properties

This article discusses both file content profiles. It also provides examples of importing and exporting configuration files. The examples use the Azure CLI, but the concepts in this article also apply to other App Configuration import methods.

## File content profile: default

In App Configuration tools, the default file content profile is the conventional configuration file schema that's widely adopted by existing programming frameworks and systems. This profile is used in App Configuration importing tools such as the Azure portal, the Azure CLI, the Azure App Configuration Import task in Azure Pipelines, and GitHub Actions. App Configuration supports JSON, YAML, and Properties file formats.

This profile is helpful if you want to use a file as the fallback configuration for your application or the local configuration during development. When you import the configuration file, you specify how you want the data transformed to App Configuration key-values and feature flags.

The following configuration file, *appsettings.json*, provides an example of the default file content profile. This file contains one configuration setting and one feature flag.

```json
{
    "Logging": {
        "LogLevel": {
            "Default": "Warning"
        }
    },
    "feature_management": {
        "feature_flags": [
            {
                "id": "Beta",
                "enabled": false
            }
        ]
    }
}
```

To import this file into App Configuration, run the following Azure CLI command. It applies a `dev` label to the setting and the feature flag, and it uses a colon (`:`) as the separator to flatten the key name.

```azurecli-interactive
az appconfig kv import --label dev --separator : --name <App-Configuration-store-name> --source file --path appsettings.json --format json
```

You can optionally add the following parameter to the preceding command: `--profile appconfig/default`. The parameter is optional, because the default profile is `appconfig/default`.

Azure Key Vault references require a particular content type during importing. As a result, you keep them in a separate file, as shown in the following file, *keyvault-refs.json*:

```json
{
    "Database:ConnectionString": {
        "uri": "https://<Key-Vault-name>.vault.azure.net/secrets/db-secret"
    }  
}
```

To import this file, run the following Azure CLI command. It applies a `test` label to the Key Vault reference, and it uses the Key Vault reference content type.

```azurecli-interactive
az appconfig kv import --label test --content-type "application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8" --name <App-Configuration-store-name> --source file --path keyvault-refs.json --format json
```

The following table shows all the imported data in your App Configuration store:

| Key | Value | Label | Content type |
|---------|---------|---------|---------|
| .appconfig.featureflag/Beta | {"id":"Beta","description":"","enabled": false,"conditions":{"client_filters":[]}} | dev | application/vnd.microsoft.appconfig.ff+json;charset=utf-8 |
| Logging:LogLevel:Default | Warning | dev |  |
| Database:ConnectionString | {\"uri\":\"https://\<Key-Vault-name\>.vault.azure.net/secrets/db-secret\"} | test | application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8 |

## File content profile: KVSet

In App Configuration tools, the KVSet file content profile is a file schema that contains all properties of an App Configuration key-value. Included are the key name, its value, its label, its content type, and its tags. Because all properties of a key-value are in the file, you don't need to specify transformation rules when you import the file. 

When you use the KVSet profile, you can define regular key-values, Key Vault references, and feature flags in one file. As a result, this profile is helpful if you want to manage all your App Configuration data in one file and import it in one step.

Files that use this profile are in JSON format. For the schema specification, see the [KVSet file schema](https://aka.ms/latest-kvset-schema).

The following file, *appconfigdata.json*, is based on the KVSet file content profile. This file contains a feature flag, a Key Vault reference, and a standard key-value.

```json
{
  "items": [
    {
      "key": ".appconfig.featureflag/Beta",
      "value": "{\"id\":\"Beta\",\"description\":\"Beta feature\",\"enabled\":true,\"conditions\":{\"client_filters\":[]}}",
      "label": "dev",
      "content_type": "application/vnd.microsoft.appconfig.ff+json;charset=utf-8",
      "tags": {}
    },
    {
      "key": "Database:ConnectionString",
      "value": "{\"uri\":\"https://<Key-Vault-name>.vault.azure.net/secrets/db-secret\"}",
      "label": "test",
      "content_type": "application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8",
      "tags": {}
    },
    {
      "key": "Logging:LogLevel:Default",
      "value": "Debug",
      "label": "dev",
      "content_type": null,
      "tags": {}
    }
  ]
}
```

In the previous section, an example shows how to import data into your App Configuration store. You can export that data to a file by using the following Azure CLI command:

```azurecli-interactive
az appconfig kv export --profile appconfig/kvset --label * --name <App-Configuration-store-name> --destination file --path appconfigdata.json --format json 
```

After you export the file, open it in a text editor and make the following changes:

- Set the `Beta` feature flag `enabled` property to `true`.
- Set the `Logging:LogLevel:Default` property to `Debug`.

To import the updated file into your App Configuration store, run the following CLI command, which includes the `--profile appconfig/kvset` parameter. You don't need to specify data transformation rules such as a separator, label, or content type like you did for the default file content profile. All needed information is already in the file.

```azurecli-interactive
az appconfig kv import --profile appconfig/kvset --name <App-Configuration-store-name> --source file --path appconfigdata.json --format json
```

> [!NOTE]
> The KVSet file content profile is currently supported in:
> 
> - The Azure CLI version 2.30.0 and later.
> - The [Azure App Configuration Import task](./azure-pipeline-import-task.md) version 10.0.0 and later.
> - The Azure portal.

The following table shows all the imported data in your App Configuration store:

| Key | Value | Label | Content type |
|---------|---------|---------|---------|
| .appconfig.featureflag/Beta | {"id":"Beta","description":"Beta feature","enabled":**true**,"conditions":{"client_filters":[]}} | dev | application/vnd.microsoft.appconfig.ff+json;charset=utf-8 |
| Logging:LogLevel:Default | **Debug** | dev |  |
| Database:ConnectionString | {\"uri\":\"https://\<Key-Vault-name\>.vault.azure.net/secrets/db-secret\"} | test | application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8 |

## Next steps

> [!div class="nextstepaction"]
> [Configuration as code](./howto-best-practices.md#configuration-as-code)

> [!div class="nextstepaction"]
> [Import and export configuration data](./howto-import-export-data.md)
