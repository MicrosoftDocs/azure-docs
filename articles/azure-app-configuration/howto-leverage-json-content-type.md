---
title: Use JSON content-type for key-values
titleSuffix: Azure App Configuration
description: Learn how to use JSON content-type for key-values
services: azure-app-configuration
author: avanigupta
ms.service: azure-app-configuration
ms.devlang: azurecli
ms.topic: how-to
ms.date: 03/27/2023
ms.custom: devdivchpfy22, devx-track-azurecli
ms.author: avgupta
#Customer intent: I want to store JSON key-values in App Configuration store without losing the data type of each setting.
---

# Use content type to store JSON key-values in App Configuration

Data is stored in App Configuration as key-values, where values are treated as the string type by default. However, you can specify a custom type by using the content type property associated with each key-value. This process preserves the original type of your data or makes your application behave differently based on content type.

## Overview

In App Configuration, you can use the JSON media type as the content type of your key-values to avail the following benefits:

- **Simpler data management**: Managing key-values, like arrays, will become a lot easier in the Azure portal.
- **Enhanced data export**: Primitive types, arrays, and JSON objects will be preserved during data export.
- **Native support with App Configuration provider**: Key-values with JSON content type will work fine when consumed by App Configuration provider libraries in your applications.

### Valid JSON content type

Media types, as defined [here](https://www.iana.org/assignments/media-types/media-types.xhtml), can be assigned to the content type associated with each key-value.
A media type consists of a type and a subtype. If the type is `application` and the subtype (or suffix) is `json`, the media type will be considered a valid JSON content type.
Some examples of valid JSON content types are:

- `application/json`
- `application/activity+json`
- `application/vnd.foobar+json;charset=utf-8`

### Valid JSON values

When a key-value has a JSON content type, its value must be in valid JSON format for clients to process it correctly. Otherwise, clients might fail or fall back and treat it as string format.
Some examples of valid JSON values are:

- `"John Doe"`
- `723`
- `false`
- `null`
- `"2020-01-01T12:34:56.789Z"`
- `[1, 2, 3, 4]`
- `{"ObjectSetting":{"Targeting":{"Default":true,"Level":"Information"}}}`

> [!NOTE]
> For the rest of this article, any key-value in App Configuration that has a valid JSON content type and a valid JSON value will be referred to as **JSON key-value**.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> * Create JSON key-values in App Configuration.
> * Import JSON key-values from a JSON file.
> * Export JSON key-values to a JSON file.
> * Consume JSON key-values in your applications.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- This tutorial requires version 2.10.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create JSON key-values in App Configuration

JSON key-values can be created using Azure portal, Azure CLI, or by importing from a JSON file. In this section, you'll find instructions on creating the same JSON key-values using all three methods.

### Create JSON key-values using Azure portal

Add the following key-values to the App Configuration store. Leave **Label** with its default value. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                          | Value                                                   | Content Type       |
| ---------------------------- | ------------------------------------------------------- | ------------------ |
| *Settings:BackgroundColor*   | *"Green"*                                               | *application/json* |
| *Settings:FontSize*          | *24*                                                    | *application/json* |
| *Settings:UseDefaultRouting* | *false*                                                 | *application/json* |
| *Settings:BlockedUsers*      | *null*                                                  | *application/json* |
| *Settings:ReleaseDate*       | *"2020-08-04T12:34:56.789Z"*                            | *application/json* |
| *Settings:RolloutPercentage* | *[25,50,75,100]*                                        | *application/json* |
| *Settings:Logging*           | *{"Test":{"Level":"Debug"},"Prod":{"Level":"Warning"}}* | *application/json* |

1. Select **Apply**.

### Create JSON key-values using Azure CLI

The following commands will create JSON key-values in your App Configuration store. Replace `<appconfig_name>` with the name of your App Configuration store.

```azurecli-interactive
appConfigName=<appconfig_name>
az appconfig kv set -n $appConfigName --content-type application/json --key Settings:BackgroundColor --value \"Green\"
az appconfig kv set -n $appConfigName --content-type application/json --key Settings:FontSize --value 24
az appconfig kv set -n $appConfigName --content-type application/json --key Settings:UseDefaultRouting --value false
az appconfig kv set -n $appConfigName --content-type application/json --key Settings:BlockedUsers --value null
az appconfig kv set -n $appConfigName --content-type application/json --key Settings:ReleaseDate --value \"2020-08-04T12:34:56.789Z\"
az appconfig kv set -n $appConfigName --content-type application/json --key Settings:RolloutPercentage --value [25,50,75,100]
az appconfig kv set -n $appConfigName --content-type application/json --key Settings:Logging --value {\"Test\":{\"Level\":\"Debug\"},\"Prod\":{\"Level\":\"Warning\"}}
```

> [!IMPORTANT]
> If you're using Azure CLI or Azure Cloud Shell to create JSON key-values, the value provided must be an escaped JSON string.

### Import JSON key-values from a file

Create a JSON file called `Import.json` with the following content and import it as key-values into App Configuration:

```json
{
  "Settings": {
    "BackgroundColor": "Green",
    "BlockedUsers": null,
    "FontSize": 24,
    "Logging": {"Test":{"Level":"Debug"},"Prod":{"Level":"Warning"}},
    "ReleaseDate": "2020-08-04T12:34:56.789Z",
    "RolloutPercentage": [25,50,75,100],
    "UseDefaultRouting": false
  }
}
```

```azurecli-interactive
az appconfig kv import -s file --format json --path "~/Import.json" --content-type "application/json" --separator : --depth 2
```

> [!NOTE]
> The `--depth` argument is used for flattening hierarchical data from a file into key-values. In this tutorial, depth is specified for demonstrating that you can also store JSON objects as values in App Configuration. If depth isn't specified, JSON objects will be flattened to the deepest level by default.

The JSON key-values you created should look like this in App Configuration:

:::image type="content" source="./media/create-json-settings.png" alt-text="Screenshot that shows the Config store containing JSON key-values.":::

To check this, open your App Configuration resource in the Azure portal and go to **Configuration explorer**.

## Export JSON key-values to a file

One of the major benefits of using JSON key-values is the ability to preserve the original data type of your values while exporting. If a key-value in App Configuration doesn't have JSON content type, its value will be treated as a string.

Consider these key-values without JSON content type:

| Key | Value | Content Type |
|---|---|---|
| Settings:FontSize | 24 | |
| Settings:UseDefaultRouting | false | |

When you export these key-values to a JSON file, the values will be exported as strings:
```json
{
  "Settings": {
    "FontSize": "24",
    "UseDefaultRouting": "false"
  }
}
```

However, when you export JSON key-values to a file, all values will preserve their original data type. To verify this process, export key-values from your App Configuration to a JSON file. You'll see that the exported file has the same contents as the `Import.json` file you previously imported.

```azurecli-interactive
az appconfig kv export -d file --format json --path "~/Export.json" --separator :
```

> [!NOTE]
> If your App Configuration store has some key-values without JSON content type, they will also be exported to the same file in string format.

## Consuming JSON key-values in applications

The easiest way to consume JSON key-values in your application is through App Configuration provider libraries. With the provider libraries, you don't need to implement special handling of JSON key-values in your application. They'll be parsed and converted to match the native configuration of your application.

For example, if you have the following key-value in App Configuration:

| Key | Value | Content Type |
|---|---|---|
| Settings | {"FontSize":24,"UseDefaultRouting":false} | application/json |

Your .NET application configuration will have the following key-values:

| Key | Value |
|---|---|
| Settings:FontSize | 24 |
| Settings:UseDefaultRouting | false |

You might access the new keys directly or you might choose to [bind configuration values to instances of .NET objects](/aspnet/core/fundamentals/configuration/#bind-hierarchical-configuration-data-using-the-options-pattern).

> [!IMPORTANT]
> Native support for JSON key-values is available in .NET configuration provider version 4.0.0 (or later). For more information, go to [Next steps](#next-steps) section.

If you're using the SDK or REST API to read key-values from App Configuration, based on the content type, your application is responsible for parsing the value of a JSON key-value.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

Now that you know how to work with JSON key-values in your App Configuration store, create an application for consuming these key-values:

> [!div class="nextstepaction"]
> [ASP.NET Core quickstart](./quickstart-aspnet-core-app.md)

> [!div class="nextstepaction"]
> [.NET Core quickstart](./quickstart-dotnet-core-app.md)
