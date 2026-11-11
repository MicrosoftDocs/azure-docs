---
title: Connector extension for Azure Functions overview (preview)
description: Understand how to install and configure the Connector extension for Azure Functions.
ms.topic: reference
ms.date: 09/25/2026
ms.devlang: csharp
zone_pivot_groups: programming-languages-set-functions
ms.custom:
  - devx-track-csharp
  - devx-track-js
  - devx-track-python
  - devx-track-ts
  - ignite-2026
---

# Connector extension for Azure Functions overview (Preview)

The Connector extension lets an Azure Functions app receive events from managed connectors in [Azure Connector Namespace](../connector-namespace/connector-namespace-overview.md), providing prebuilt access to services such as Office 365 Outlook, SharePoint Online, Microsoft Teams, Dataverse, and many other Microsoft and third-party services. To explore the available managed connectors, see the [connectors reference](/connectors/connector-reference/).

> [!IMPORTANT]
> The Connector extension is currently in public preview. Features, configuration names, and supported connectors can change before general availability (GA). Use of this feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

::: zone pivot="programming-language-go,programming-language-java,programming-language-powershell"

> [!NOTE]
> The Connector trigger isn't currently supported for this language.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

| Action | Type |
| --- | --- |
| Run a function when an event occurs in a connected service | [Trigger](functions-bindings-connector-trigger.md) |

The Connector extension provides the inbound trigger binding that runs a function when an event occurs in a service connected through a managed connector. To call operations and take actions in these connected services from your function code, use an Azure Connectors SDK, which is currently available for .NET, Node.js, and Python. For more information about triggers, SDK actions, and when to use managed connectors, see [Use managed connectors in Azure Functions](functions-connectors-overview.md).

## How the extension works

A connector-triggered function uses these components:

| Component | Responsibility |
| --- | --- |
| Connector Namespace | Hosts managed connector connections and trigger configurations. |
| Managed connector connection | Authenticates to the external service and manages service-specific connectivity. |
| Trigger configuration | Selects the connector event and operation parameters, and maps the event to a destination function. |
| Connector extension | Registers the callback endpoint, validates the HTTP method, content type, and JSON body, dispatches the request to the selected function, and binds the event body to the function parameter. |
| Azure Connectors SDK | Provides optional strongly typed payload models and clients for invoking managed connector operations, such as sending an email or creating a SharePoint file. |

When a configured event occurs, the Connector Namespace sends the event to the extension's webhook endpoint. The extension uses the `functionName` query-string value to select the function and passes the JSON event body to the trigger parameter. The Functions host validates the system key before the extension processes the request, unless you configure another authentication layer as described in [Authenticate callbacks](#authenticate-callbacks).

::: zone-end

::: zone pivot="programming-language-csharp"

In a .NET isolated worker function, apply `[ConnectorTrigger]` to the parameter that receives the event body.

::: zone-end

::: zone pivot="programming-language-csharp"

## Install extension

The Connector trigger supports the .NET isolated worker model. For information on supported .NET versions across Azure Functions runtime versions, see [Languages by runtime version](supported-languages.md?tabs=isolated-process%2Cv4&pivots=programming-language-csharp#languages-by-runtime-version).

Add the preview [Connector extension package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Connector) to your project:

```dotnetcli
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Connector --prerelease
```

To use strongly typed payload models or call managed connector operations, also add the preview [Azure Connectors SDK](https://www.nuget.org/packages/Azure.Connectors.Sdk/0.14.0-preview.1):

```dotnetcli
dotnet add package Azure.Connectors.Sdk --prerelease
```

For current package versions and complete projects, see the [Azure Functions connector samples for .NET](https://github.com/Azure-Samples/functions-connectors-net).

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

## Install extension

Install the packages used by the Connector trigger:

```bash
npm install @azure/functions @azure/functions-extensions-connectors @azure/connectors
```

These packages provide the following functionality:

- [@azure/functions](https://www.npmjs.com/package/@azure/functions) provides the base `connectorTrigger` registration, which receives the trigger input as a generic type that defaults to `unknown`.
- [@azure/functions-extensions-connectors](https://www.npmjs.com/package/@azure/functions-extensions-connectors) wraps the input in a normalized connector trigger context and provides typed contexts for supported connector operations.
- [@azure/connectors](https://www.npmjs.com/package/@azure/connectors), the preview [Azure Connectors SDK for Node.js](https://github.com/Azure/Connectors-nodejs-sdk), provides the payload models used by those contexts and clients for calling connector operations.

Configure your app to use version 4.42.0 or later of the preview extension bundle in the *host.json* file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.42.*, 5.0.0)"
  }
}
```

::: zone-end

::: zone pivot="programming-language-typescript"

For current package versions and complete projects, see the [Azure Functions connector samples for TypeScript](https://github.com/Azure-Samples/functions-connectors-typescript).

::: zone-end

::: zone pivot="programming-language-python"

## Install extension

Use the Python v2 programming model and install the packages required by the Connector trigger:

```text
azure-functions>=2.2.0
azurefunctions-extensions-connectors
```

> [!NOTE]
> For Python versions earlier than 3.13, use `azure-functions>=1.26.0b3`.

The core [azure-functions](https://pypi.org/project/azure-functions/) Python library can bind the trigger payload to `str`, `dict`, or `bytes`. The [azurefunctions-extensions-connectors](https://pypi.org/project/azurefunctions-extensions-connectors/) package integrates the [Azure Connectors SDK for Python](https://github.com/Azure/Connectors-python-sdk) and registers additional converters for the operation-specific SDK annotations that it supports.

Configure your app to use version 4.42.0 or later of the preview extension bundle in the *host.json* file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.42.*, 5.0.0)"
  }
}
```

For current package versions and complete projects, see the [Azure Functions connector samples for Python](https://github.com/Azure-Samples/functions-connectors-python).

::: zone-end

::: zone pivot="programming-language-csharp"

## Binding types

The Connector trigger supports these parameter types for .NET isolated worker functions:

| Type | Description |
| --- | --- |
| `string` | Receives the event body as raw JSON. Use this type when a strongly typed SDK model isn't available or when you want to deserialize the payload yourself. |
| Connector SDK model | Deserializes the JSON event body into the operation-specific model from `Azure.Connectors.Sdk`, such as `Office365OnNewEmailTriggerPayload` or `SharePointOnlineOnNewFileItemsTriggerPayload`. |
| JSON-deserializable POCO | Deserializes the JSON event body into a .NET type whose shape matches the connector payload by using `System.Text.Json`. |

For code examples and operation-specific payload behavior, see the [Connector trigger reference](functions-bindings-connector-trigger.md).

To determine which connector operations have strongly typed .NET payload models, see [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md).

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

## Binding types

The base `connectorTrigger` registration passes the trigger input to a generic handler type that defaults to `unknown`. The `@azure/functions-extensions-connectors` package parses the raw input into a `ConnectorTriggerContext<T>` with the normalized `payload` and `items` properties, the original `rawPayload`, and operation-specific typed contexts when available. For operations without a typed registration, use the generic context and validate the `unknown` payload before accessing its contents.

To determine which connector operations have strongly typed TypeScript payload models, see [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md).

::: zone-end

::: zone pivot="programming-language-python"

## Binding types

The Connector trigger supports these Python parameter types:

| Type | Description |
| --- | --- |
| `str` | Receives the event body as a JSON string. |
| `dict` | Receives an event body that the worker has parsed as JSON. |
| `bytes` | Receives the event body as raw bytes. |
| Supported Connector SDK annotation | Uses a converter registered by `azurefunctions-extensions-connectors` to deserialize the event body into one or more operation-specific SDK models. |

To determine which connector operations have a registered typed Python converter and whether the annotation represents one item or a collection, see [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md). Use `str`, `dict`, or `bytes` for operations that don't have a supported SDK annotation.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

## Configure connector resources

Before the extension can receive an event, create these resources and configurations:

1. A Connector Namespace.
1. A managed connector connection authorized to access the external service.
1. A trigger configuration that selects the connector event and identifies the destination function.

The trigger configuration includes the managed connector connection, operation name, operation parameters, callback URL, and callback authentication. For the configuration values and instructions for creating a trigger by using Azure CLI or the Connector Namespace portal, see [Configure the trigger](functions-bindings-connector-trigger.md#configure-the-trigger).

## Authenticate callbacks

By default, the Connector extension creates a function app system key named `connector_extension`. Retrieve the key by running:

```azurecli
az functionapp keys list \
    --resource-group <RESOURCE_GROUP> \
    --name <FUNCTION_APP_NAME> \
    --query "systemKeys.connector_extension" \
    --output tsv
```

Configure the callback URL without the key:

```text
https://<FUNCTION_APP_HOSTNAME>/runtime/webhooks/connector?functionName=<FUNCTION_NAME>
```

Store the key separately in `notificationDetails.authentication`:

```json
{
  "notificationDetails": {
    "callbackUrl": "https://<FUNCTION_APP_HOSTNAME>/runtime/webhooks/connector?functionName=<FUNCTION_NAME>",
    "authentication": {
      "type": "QueryString",
      "name": "code",
      "value": "<CONNECTOR_EXTENSION_KEY>"
    }
  }
}
```

At callback time, the Connector Namespace adds the key as the `code` query-string parameter. Keeping the key separate from the saved callback URL lets the portal mask it as a secret.

For deployments that require identity-based callback authentication, use [App Service built-in authentication](../app-service/overview-authentication-authorization.md) with a managed identity instead of a shared system key. For the complete pattern, see [Authenticate your functions to a connector namespace](functions-connectors-overview.md#authenticate-your-functions-to-a-connector-namespace).

## host.json settings

The default system-key authentication doesn't require connector-specific settings in the *host.json* file.

When App Service built-in authentication validates callbacks from the connector namespace, you can disable the redundant system-key check:

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

```json
{
  "version": "2.0",
  "extensions": {
    "connector": {
      "system": {
        "webhookAuthorizationLevel": "Anonymous"
      }
    }
  }
}
```

Only use `Anonymous` when another authentication layer, such as App Service built-in authentication, validates requests before they reach the Functions host.

For a complete implementation of this language-independent app configuration, see the [built-in authentication sample](https://github.com/Azure-Samples/functions-connectors-net-builtinauth).

## Next steps

- [Managed connector trigger for Azure Function](functions-bindings-connector-trigger.md)
- [Use managed connectors in Azure Functions](functions-connectors-overview.md)
- [Azure Functions Connectors Samples](https://github.com/Azure-Samples/functions-connectors)
- [What is Azure Connector Namespace?](../connector-namespace/connector-namespace-overview.md)
- [Connectors reference](/connectors/connector-reference/)

::: zone-end
