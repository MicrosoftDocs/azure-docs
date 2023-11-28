---
title: Azure AI Extension in Azure Database for PostgreSQL - Flexible Server
description: Azure AI Extension in Azure Database for PostgreSQL - Flexible Server
author: mulander
ms.author: adamwolk
ms.date: 11/01/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: conceptual
---

# Azure Database for PostgreSQL Flexible Server Azure AI Extension (Preview)

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL extension for Azure AI enables you to use large language models (LLMS) and build rich generative AI applications within the database.  The Azure AI extension enables the database to call into various Azure AI services including [Azure OpenAI](../../ai-services/openai/overview.md) and [Azure Cognitive Services](https://azure.microsoft.com/products/ai-services/cognitive-search/) simplifying the development process allowing seamless integration into those services. 

## Enable the `azure_ai` extension

Before you can enable `azure_ai` on your Flexible Server, you need to add it to your allowlist as described in [how to use PostgreSQL extensions](./concepts-extensions.md#how-to-use-postgresql-extensions) and check if correctly added by running `SHOW azure.extensions;`.

> [!TIP]
> You might also want to enable the [`pgvector` extension](./how-to-use-pgvector.md) as it is commonly used with `azure_ai`.

Then you can install the extension, by connecting to your target database and running the [CREATE EXTENSION](https://www.postgresql.org/docs/current/static/sql-createextension.html) command. You need to repeat the command separately for every database you want the extension to be available in.

```postgresql
CREATE EXTENSION azure_ai;
```

> [!NOTE]
> To remove the extension from the currently connected database use `DROP EXTENSION azure_ai;`.

Installing the extension `azure_ai` creates the following three schemas:

* `azure_ai`: principal schema where the configuration table resides and functions to interact with it. 
* `azure_openai`: functions and composite types related to OpenAI. 
* `azure_cognitive`: functions and composite types related to Cognitive Services. 

The extension also allows calling Azure OpenAI and Azure Cognitive Services.

## Configure the `azure_ai` extension

Configuring the extension requires you to provide the endpoints to connect to the Azure AI services and the API keys required for authentication. Service settings are stored using following functions:

### `azure_ai.set_setting`

Used to set configuration options.

```postgresql
azure_ai.set_setting(key TEXT, value TEXT)
```

#### Arguments
##### `key`

Name of a configuration option. Valid values for the `key` are:
* `azure_openai.endpoint`: Supported OpenAI endpoint (for example, `https://example.openai.azure.com`).
* `azure_openai.subscription_key`: A subscription key for an OpenAI resource. 
* `azure_cognitive.endpoint`: Supported Cognitive Services endpoint (for example, `https://example.cognitiveservices.azure.com`).
* `azure_cognitive.subscription_key`: A subscription key for a Cognitive Services resource.

##### `value`

`TEXT` representing the desired value of the selected setting.


### `azure_ai.get_setting`

Used to obtain current values of configuration options.

```postgresql
azure_ai.get_setting(key TEXT)
```

#### Arguments

##### Key

Name of a configuration option. Valid values for the `key` are:
* `azure_openai.endpoint`: Supported OpenAI endpoint (for example, `https://example.openai.azure.com`).
* `azure_openai.subscription_key`: A subscription key for an OpenAI resource. 
* `azure_cognitive.endpoint`: Supported Cognitive Services endpoint (for example, `https://example.cognitiveservices.azure.com`).
* `azure_cognitive.subscription_key`: A subscription key for a Cognitive Services resource.


#### Return type
`TEXT` representing the current value of the selected setting.

### `azure_ai.version`

```postgresql
azure_ai.version()
```

#### Return type

`TEXT` representing the current version of the Azure AI extension.

### Examples

#### Set the Endpoint and an API Key for Azure Open AI

```postgresql
select azure_ai.set_setting('azure_openai.endpoint','https://<endpoint>.openai.azure.com'); 
select azure_ai.set_setting('azure_openai.subscription_key', '<API Key>'); 
```

#### Get the Endpoint and API Key for Azure Open AI

```postgresql
select azure_ai.get_setting('azure_openai.endpoint');
select azure_ai.get_setting('azure_openai. subscription_key');
```

#### Check the Azure AI extension version

```postgresql
select azure_ai.version();
```

## Permissions

The `azure_ai` extension defines a role called `azure_ai_settings_manager`, which enables reading and writing of settings related to the extension.  Only superusers and members of the `azure_ai_settings_manager` role can invoke the `azure_ai.get_settings` and `azure_ai.set_settings` functions. In PostgreSQL Flexible Server, all admin users have the `azure_ai_settings_manager` role assigned.

## Next steps

> [!div class="nextstepaction"]
> [Generate vector embeddings with Azure OpenAI](./generative-ai-azure-openai.md)
