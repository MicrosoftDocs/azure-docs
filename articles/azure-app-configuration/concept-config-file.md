---
title: Azure App Configuration support for configuration files
description: Tooling support for using configuration files with Azure App Configuration
author: zhenlan
ms.author: zhenlwa
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 10/28/2022
---

# Azure App Configuration support for configuration files

Files are one of the most common ways to store configuration data. To help you start quickly, App Configuration has tools to assist you in [importing your configuration files](./howto-import-export-data.md), so you don't have to type in your data manually. This operation is a one-time data migration if you plan to manage your data in App Configuration after importing them. In some other cases, for example, where you adopt [configuration as code](./howto-best-practices.md#configuration-as-code), you may continue managing your configuration data in files and importing them as part of your CI/CD process recurrently. You may find one of these two scenarios applies to you:

- You keep the configuration file in the format you had before. This format is helpful if you want to use the file as the fallback configuration for your application or the local configuration during development. When you import the configuration file, specify how you want the data transformed to App Configuration key-values. This option is the [**default file content profile**](#file-content-profile-default) in App Configuration importing tools such as portal, Azure CLI, Azure Pipeline Push task, GitHub Actions, etc.
- You keep the configuration file in the format that contains all App Configuration key-value properties. When you import the file, you don't need to specify any transformation rules because all properties of a key-value is already in the file. This option is called [**KVSet file content profile**](#file-content-profile-kvset) in App Configuration importing tools. It's helpful if you want to manage all your App Configuration data, including regular key-values, Key Vault references, and feature flags, in one file and import them in one shot.

The rest of this document will discuss both file content profiles in detail and use Azure CLI as an example. The same concept applies to other App Configuration importing tools too.

## File content profile: default

The default file content profile in App Configuration tools refers to the conventional configuration file schema widely adopted by existing programming frameworks or systems. App Configuration supports JSON, Yaml, or Properties file formats.

The following example is a configuration file named `appsettings.json` containing one configuration setting and one feature flag.

```json
{
    "Logging": {
        "LogLevel": {
            "Default": "Warning"
        }
    },
    "FeatureManagement": {
        "Beta": false
    }
}
```

Run the following CLI command to import it to App Configuration with the `dev` label and use the colon (`:`) as the separator to flatten the key name. You can optionally add parameter "**--profile appconfig/default**". It's skipped in the example as it's the default value.

```azurecli-interactive
az appconfig kv import --label dev --separator : --name <your store name> --source file --path appsettings.json --format json
```

Key Vault references require a particular content type during importing, so you keep them in a separate file. The following example is a file named `keyvault-refs.json`.

```json
{
    "Database:ConnectionString": {
        "uri": "https://<your-vault-name>.vault.azure.net/secrets/db-secret"
    }  
}
```

Run the following CLI command to import it with the `test` label and the Key Vault reference content type.

```azurecli-interactive
az appconfig kv import --label test --content-type "application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8" --name <your store name> --source file --path keyvault-refs.json --format json
```

The following table shows all the imported data in your App Configuration store.

| Key | Value | Label | Content type |
|---------|---------|---------|---------|
| .appconfig.featureflag/Beta | {"id":"Beta","description":"","enabled":false,"conditions":{"client_filters":[]}} | dev | application/vnd.microsoft.appconfig.ff+json;charset=utf-8 |
| Logging:LogLevel:Default | Warning | dev |  |
| Database:ConnectionString | {\"uri\":\"https://\<your-vault-name\>.vault.azure.net/secrets/db-secret\"} | test | application/vnd.microsoft.appconfig.keyvaultref+json;charset=utf-8 |

## File content profile: KVSet

The KVSet file content profile in App Configuration tools refers to a file schema that contains all properties of an App Configuration key-value, including key, value, label, content type, and tags. The file is in JSON format. See [KVSet file schema](https://aka.ms/latest-kvset-schema) for the schema specification.

The following example is a file based upon the KVSet file content profile, named `appconfigdata.json`, containing a feature flag, a Key Vault reference, and a regular key-value.

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
> If you followed the example in the previous section and have the data in your App Configuration store, you can export it to a file using the CLI command:
> ```azurecli-interactive
> az appconfig kv export --profile appconfig/kvset --label * --name <your store name> --destination file --path appconfigdata.json --format json 
> ```
> After the file is exported, update the `Beta` feature flag `enabled` property to `true` and change the `Logging:LogLevel:Default` to `Debug`.

Run the following CLI command with the parameter "**--profile appconfig/kvset**" to import the file to your App Configuration store. You don't need to specify any data transformation rules such as separator, label, or content type like you did in the default file content profile section because all information is already in the file.

```azurecli-interactive
az appconfig kv import --profile appconfig/kvset --name <your store name> --source file --path appconfigdata.json --format json
```

> [!NOTE]
> The KVSet file content profile is currently supported in
> - Azure CLI version 2.30.0 or later
> - [Azure App Configuration Push Task](./push-kv-devops-pipeline.md) version 3.3.0 or later

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
