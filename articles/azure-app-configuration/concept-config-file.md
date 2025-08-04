---
title: Azure App Configuration support for configuration files
description: Tooling support for using configuration files with Azure App Configuration
author: zhenlan
ms.author: zhenlwa
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 05/30/2024
---

# Azure App Configuration support for configuration files

Files provide a common way of storing configuration data. If you use a file but want to store your configuration data in Azure App Configuration, you don't have to enter your data manually. You can use tools to [import your configuration file](./howto-import-export-data.md).

If you plan to manage your data in App Configuration, the import operation is a one-time data migration. Another option is to continue managing your configuration data in a file and to import the file recurrently as part of your CI/CD process. This case comes up when you adopt [configuration as code](./howto-best-practices.md#configuration-as-code). When you continue to use a configuration file, one of the following scenarios might apply to you:

- You keep the configuration file in its current format. This format is helpful if you want to use the file as the fallback configuration for your application or the local configuration during development. When you import the configuration file, specify how you want the data transformed to App Configuration key-values and feature flags. This option is the [**default file content profile**](#file-content-profile-default) in App Configuration importing tools such as portal, Azure CLI, Azure Pipeline Import task, GitHub Actions, etc.
- You keep the configuration file in a format that contains all App Configuration key-value properties. When you import the file, you don't need to specify any transformation rules because all properties of a key-value are already in the file. This option is called [**KVSet file content profile**](#file-content-profile-kvset) in App Configuration importing tools. It's helpful if you want to manage all your App Configuration data, including regular key-values, Key Vault references, and feature flags, in one file and import them in one shot.

This article discusses both file content profiles in detail and uses the Azure CLI as an example. The same concept applies to other App Configuration importing tools too.

## File content profile: default

The default file content profile in App Configuration tools refers to the conventional configuration file schema that's widely adopted by existing programming frameworks or systems. App Configuration supports JSON, YAML, or Properties file formats.

The following configuration file, *appsettings.json*, contains one configuration setting and one feature flag:

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

You can optionally add the following parameter to the preceding command: `--profile appconfig/default`. In this case, that parameter is omitted, because the default profile is `appconfig/default`.

Key Vault references require a particular content type during importing. As a result, you keep them in a separate file, as shown in the following file, *keyvault-refs.json*:

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

The following table shows all the imported data in your App Configuration store.

| Key | Value | Label | Content type |
|---------|---------|---------|---------|
| .appconfig.featureflag/Beta | {"id":"Beta","description":"","enabled": false,"conditions":{"client_filters":[]}} | dev | application/vnd.microsoft.appconfig.ff+json;charset=utf-8 |
| Logging:LogLevel:Default | Warning | dev |  |
| Database:ConnectionString | {\"uri\":\"https://\<your-vault-name\>.vault.azure.net/secrets/db-secret\"} | test | application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8 |

## File content profile: KVSet

The KVSet file content profile in App Configuration tools refers to a file schema that contains all properties of an App Configuration key-value. Included are the key name, its value, its label, its content type, and its tags. The file is in JSON format. For the schema specification, see [KVSet file schema](https://aka.ms/latest-kvset-schema).

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
      "value": "{\"uri\":\"https://<your-vault-name>.vault.azure.net/secrets/db-secret\"}",
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

> [!TIP]
> If you follow the example in the previous section and have the data in your App Configuration store, you can export it to a file by using the following Azure CLI command:

> ```azurecli-interactive
> az appconfig kv export --profile appconfig/kvset --label * --name <App-Configuration-store-name> --destination file --path appconfigdata.json --format json 
> ```

> After the file is exported, update the `Beta` feature flag `enabled` property to `true` and change the `Logging:LogLevel:Default` to `Debug`.

Run the following CLI command with the parameter "**--profile appconfig/kvset**" to import the file to your App Configuration store. You don't need to specify any data transformation rules such as separator, label, or content type like you did in the default file content profile section because all information is already in the file.

```azurecli-interactive
az appconfig kv import --profile appconfig/kvset --name <App-Configuration-store-name> --source file --path appconfigdata.json --format json
```

> [!NOTE]
> The KVSet file content profile is currently supported in
> - Azure CLI version 2.30.0 or later
> - [Azure App Configuration Import Task](./azure-pipeline-import-task.md) version 10.0.0 or later
> - Azure portal

The following table shows all the imported data in your App Configuration store.

| Key | Value | Label | Content type |
|---------|---------|---------|---------|
| .appconfig.featureflag/Beta | {"id":"Beta","description":"Beta feature","enabled":**true**,"conditions":{"client_filters":[]}} | dev | application/vnd.microsoft.appconfig.ff+json;charset=utf-8 |
| Logging:LogLevel:Default | **Debug** | dev |  |
| Database:ConnectionString | {\"uri\":\"https://\<your-vault-name\>.vault.azure.net/secrets/db-secret\"} | test | application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8 |

## Next steps

> [!div class="nextstepaction"]
> [Configuration as code](./howto-best-practices.md#configuration-as-code)

> [!div class="nextstepaction"]
> [Import and export configuration data](./howto-import-export-data.md)
