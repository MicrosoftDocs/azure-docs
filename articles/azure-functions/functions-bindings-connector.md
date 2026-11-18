---
title: Connector extension for Azure Functions overview
description: Understand how to install and configure the Connector Extension for Azure Functions.
ms.topic: reference
ms.date: 10/29/2026
ms.devlang: csharp
zone_pivot_groups: programming-languages-set-functions
ms.custom:
  - devx-track-csharp
  - devx-track-js
  - devx-track-python
  - devx-track-ts
  - ignite-2026
---

# Connector Extension for Azure Functions overview

Azure Functions provides trigger and binding extensions that integrate with various services, primarily Azure services. The Connector Extension broadens these integrations through _managed connectors_ in [Azure Connector Namespace](../connector-namespace/connector-namespace-overview.md), letting your functions receive events from business systems and data platforms such as Office 365 Outlook, SharePoint Online, Microsoft Teams, and Dataverse.

For available Microsoft and third-party managed connectors, see the [connectors reference](/connectors/connector-reference/).

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

> [!NOTE]
> Managed connectors support the Flex Consumption, Dedicated, and Elastic Premium hosting plans for Linux Function apps in all regions. Availability for Windows apps is limited today.
>
> Flex Consumption is the recommended hosting plan for connector-triggered functions.

::: zone-end

::: zone pivot="programming-language-go,programming-language-java,programming-language-powershell"

> [!NOTE]
> The Connector Trigger isn't currently supported for this language.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

| To | Use |
| --- | --- |
| Run a function in response to an event in a connected service | [Connector Trigger](./functions-bindings-connector-trigger.md), provided by the Connector Extension |
| Perform an action in a connected service from function code | [Azure Connectors SDK](#using-connector-sdks-in-your-code), available for .NET, Node.js, and Python |

You can use both together: the Connector Trigger starts your function, and the SDK performs actions in connected services. If you only need to perform actions, use the SDK without the Connector Extension.

For more information about managed connectors, when to use them, and feature availability, see [Use managed connectors in Azure Functions](functions-connectors-overview.md).

## Connector Trigger in Azure Functions

A connector-triggered function uses these components:

| Component | Responsibility |
| --- | --- |
| Connector Namespace | Hosts managed connector connections and trigger configurations. |
| Managed connector connection | Authenticates to the external service and manages service-specific connectivity. |
| Trigger configuration | Selects the connector event, operation parameters, and [delivery mode](#choose-a-delivery-mode). |
| Azure Functions Connector Extension | Receives events from the Connector Namespace, invokes the function, and binds the event body to the function parameter. |
| Azure Connectors SDK (optional) | Provides optional strongly typed payload models and clients for invoking managed connector operations, such as sending an email or creating a SharePoint file. |

A managed connector can support multiple events, and each event you want to monitor needs its own trigger configuration. For example, the Office 365 Outlook connector supports events such as a new email arriving, an email being flagged, a calendar event being created, or a calendar event being modified. Create a separate trigger configuration for each event you want to use to run a function.

For code examples, see [Connector Trigger examples](functions-bindings-connector-trigger.md#examples) and [Using Connector SDKs in your code](#using-connector-sdks-in-your-code).

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

## Choose a delivery mode

Managed connectors support webhook and polling delivery. Choose a mode based on your scenario's latency, processing capacity, networking, and authentication needs:

| Feature | Polling | Webhook |
| --- | --- | --- |
| Event delivery and latency | The Functions host retrieves events through outbound polling requests. Events wait until the host polls for them. | The Connector Namespace pushes events to the function app's callback endpoint as soon as it picks them up from the source service, without waiting for the app to poll. This reduces delivery latency for time-sensitive processing. |
| Processing capacity and downstream protection | The host retrieves more events as processing capacity becomes available. Combine app scale-out limits with [polling concurrency settings](#polling-mode) to bound simultaneous processing and protect downstream databases or APIs. Pending events remain queued in the Connector Namespace, subject to its event-retention limits. | Events arrive independently of the app's available processing capacity. Scale-out limits can lead to throttled or failed callbacks when demand exceeds capacity; events can be lost if delivery doesn't succeed within the service's retry limits. |
| Inbound networking | No inbound callback endpoint is required. You can restrict inbound access to the function app while allowing outbound requests to the Connector Namespace's polling endpoint. | The Connector Namespace must be able to reach the app's callback endpoint. Inbound restrictions must allow those requests. |
| Managed identity authentication | The Functions host can use the function app's system-assigned or user-assigned managed identity to receive and acknowledge events. Grant that identity an [access policy on the managed connector connection](functions-bindings-connector-trigger.md#polling-authentication). | For callbacks authenticated with Microsoft Entra ID, the Connector Namespace uses its managed identity. Configure [App Service built-in authentication](functions-bindings-connector-trigger.md#built-in-authentication) on the receiving function app to validate the tokens. Default webhook authentication instead uses the Connector extension system key. |

Depending on your hosting plan, you can restrict inbound access to the function app using [private endpoints or inbound access restrictions](functions-networking-options.md#inbound-networking-features), including IP-based or service-endpoint restrictions, without preventing polling. The app must still be able to make outbound HTTPS requests to the Connector Namespace's polling endpoint. Separately, the function app's configured managed identity must have an access policy on the managed connector connection.

The event delivery mode controls how events reach the Functions host from the Connector Namespace, **not** how the managed connector detects changes in the source service.

Webhook delivery scales like HTTP triggers, while polling delivery uses target-based scaling. The polling scaling target is independent of listener concurrency and batch size. For details about both modes, see [Connector Trigger scaling and concurrency](functions-bindings-connector-trigger.md#scaling-and-concurrency). For the polling scaling equation and tuning settings, see [Managed connectors target-based scaling](functions-target-based-scaling.md#managed-connectors).

::: zone-end

::: zone pivot="programming-language-csharp"

Both modes use `[ConnectorTrigger]` on the function parameter that receives the event body and can use the same payload models. For examples of both delivery modes, see the [Connector Trigger examples](functions-bindings-connector-trigger.md?pivots=programming-language-csharp#examples).

## Install packages

### Connector extension

The Connector Trigger supports the .NET isolated worker model. For information on supported .NET versions across Azure Functions runtime versions, see [Languages by runtime version](supported-languages.md?tabs=isolated-process%2Cv4&pivots=programming-language-csharp#languages-by-runtime-version).

Add **version 1.0.0** or later of the [Connector extension package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Connector) to your project.

```dotnetcli
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Connector
```

### Azure Connectors SDKs

If your function only needs to perform actions on external services and doesn't need to be triggered by events, use only the Azure Connectors SDK. You don't need the Connector extension package.

Add the [Azure Connectors SDK](https://www.nuget.org/packages/Azure.Connectors.Sdk):

```dotnetcli
dotnet add package Azure.Connectors.Sdk
```

For popular connectors, the SDK provides strongly typed clients for invoking connector actions from your functions; see the [Azure Connectors SDK for .NET API reference](/dotnet/api/azure.connectors.sdk?view=azure-dotnet).

::: zone-end

::: zone pivot="programming-language-javascript,programming-language-typescript"

## Install extension

Use Node.js 24 or later. Both delivery modes use the same named or generic trigger registration helpers.

Install the packages used by the Connector trigger:

```bash
npm install "@azure/functions@latest" "@azure/functions-extensions-connectors@latest" "@azure/connectors@latest"
```

These packages provide the following functionality:

- [@azure/functions](https://www.npmjs.com/package/@azure/functions) provides the base `connectorTrigger` registration, which receives the trigger input as a generic type that defaults to `unknown`.
- [@azure/functions-extensions-connectors](https://www.npmjs.com/package/@azure/functions-extensions-connectors) wraps the input in a normalized connector trigger context and provides typed contexts for supported connector operations.
- [@azure/connectors](https://www.npmjs.com/package/@azure/connectors), the [Azure Connectors SDK for Node.js](https://github.com/Azure/Connectors-nodejs-sdk), provides the payload models used by those contexts and clients for calling connector operations.

Configure the extension bundle in the *host.json* file. The bundle supplies the Connector host extension for both delivery modes:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.41.2, 5.0.0)"
  }
}
```

### Azure Connectors SDK

If your function only needs to perform actions on external services and doesn't need to be triggered by events, install only the [Azure Connectors SDK for Node.js](https://github.com/Azure/Connectors-NodeJS-SDK). You don't need the Connector trigger packages.

```bash
npm install "@azure/connectors@latest"
```

For popular connectors, the SDK provides strongly typed clients for invoking connector actions from your functions; see the [Azure Connectors SDK for Node.js API reference](https://azure.github.io/Connectors-NodeJS-SDK/).

::: zone-end

::: zone pivot="programming-language-typescript"

For current package versions and complete projects, see the [Azure Functions connector samples for TypeScript](https://github.com/Azure-Samples/functions-connectors-typescript).

::: zone-end

::: zone pivot="programming-language-python"

Both delivery modes use the `@app.connector_trigger` decorator. For examples, see [Connector Trigger examples](functions-bindings-connector-trigger.md?pivots=programming-language-python#examples).

## Install extension

Add the following packages to *requirements.txt*:

```text
azure-functions>=2.4.0
azurefunctions-extensions-connectors>=1.0.0
```

> [!NOTE]
> For Python versions earlier than 3.13, use `azure-functions>=1.27.0b1` instead.

- The core [azure-functions](https://pypi.org/project/azure-functions/) Python library provides the decorator and can bind raw single events to `str` or `bytes`, or polling batches to `typing.List[str]` or `typing.List[bytes]`.
- The [azurefunctions-extensions-connectors](https://pypi.org/project/azurefunctions-extensions-connectors/) package integrates the [Azure Connectors SDK for Python](https://github.com/Azure/Connectors-python-sdk) and registers converters for supported operation-specific SDK annotations. For example, `emails: list[office365.GraphClientReceiveMessage]`, where `office365` is imported from `azurefunctions.extensions.connectors`, receives email model objects for the Office 365 Outlook `OnNewEmailV3` operation.

Configure the extension bundle in the *host.json* file. The bundle supplies the Connector host extension for both delivery modes:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.41.2, 5.0.0)"
  }
}
```

### Azure Connectors SDK

If your function only needs to perform actions on external services and doesn't need to be triggered by events, install only the [Azure Connectors SDK for Python](https://github.com/Azure/Connectors-python-sdk). You don't need the Connector trigger packages.

```bash
python -m pip install "azure-connectors>=1.0.0"
```

For popular connectors, the SDK provides strongly typed clients for invoking connector actions from your functions; see the [Azure Connectors SDK for Python API reference](https://azure.github.io/connectors-python-sdk/).

For current package versions and complete projects, see the [Azure Functions connector samples for Python](https://github.com/Azure-Samples/functions-connectors-python).

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

## host.json settings

The Connector extension doesn't require connector-specific settings in the *host.json* file when you use the defaults.

The following sections show the optional settings for each delivery mode.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

<a name="polling-hostjson-settings"></a>

### Polling mode

Configure optional polling settings under `extensions.connector` in the *host.json* file. For example, the following configuration limits the delay between polls when no events are available to one second:

```json
{
  "version": "2.0",
  "extensions": {
    "connector": {
      "maxPollingInterval": "00:00:01"
    }
  }
}
```

| Property | Default | Description |
| --- | --- | --- |
| `defaultMaxBatchSize` | `1` | Maximum events per invocation when the function doesn't specify a positive batch-size override. Valid values are 1 through 32. Values greater than 1 require batching to be enabled. |
| `defaultMaxConcurrentCalls` | `16` | Maximum concurrent single-event processing tasks per listener on one instance, including preparation, invocation, and acknowledgement. Must be positive. Doesn't apply to batched invocations. |
| `defaultTargetPendingEventThreshold` | `16` | Target pending events per instance for target-based scaling when the runtime doesn't supply a concurrency target. Must be positive. Independent of batch size and invocation concurrency. |
| `maxPollingInterval` | `"00:00:30"` | Maximum delay between polls when no events are available. Must be at least one second. Doesn't control how often the connector checks the source service. |
| `maxLinkedOutputSizeInBytes` | `104857600` (100 MiB) | Maximum downloaded bytes per linked event output. Must be positive. Doesn't apply to inline polling responses. This is a download guardrail, not a supported payload-size guarantee. |

Positive per-function overrides take precedence over the corresponding host defaults. The runtime can override the scaling target without changing batch size or listener concurrency. Batches are processed one at a time per listener. For the language-specific options, see [Polling mode](functions-bindings-connector-trigger.md#polling-trigger).

Linked-output events are downloaded by the host and normalized to the ordinary payload shape. They are invoked one event at a time behind a host-wide limiter, even when the binding enables batching.

Increasing `maxLinkedOutputSizeInBytes` can exhaust host or worker memory. Validate the workload on your hosting size before raising it; the default doesn't establish a supported payload-size limit.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

<a name="webhook-hostjson-settings"></a>

### Webhook mode

Default system-key authentication doesn't require connector-specific settings in *host.json*. If App Service built-in authentication validates callbacks, you can set `extensions.connector.system.webhookAuthorizationLevel` to `Anonymous` to disable the redundant system-key check.

Only use `Anonymous` when another authentication layer validates requests before they reach the Functions host. For configuration details and a complete sample, see [Built-in authentication](functions-bindings-connector-trigger.md#built-in-authentication).

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

## Using Connector SDKs in your code

The Connector SDK enables your function to call connector operations as outbound actions. The client surface uses the same underlying managed connector in the Connector Namespace that triggers use, so a single managed connector can power both inbound triggers and outbound calls for the same service account.

Authenticating inbound webhook callbacks doesn't grant the function app permission to make outbound SDK calls. For a webhook-triggered function that also makes SDK calls, grant the function app's managed identity (deployed) or developer identity (local) an access policy on each managed connector connection used by those calls.

For polling, the function app's managed identity or developer identity already needs a connection access policy. If the SDK client uses that same identity and connection, the existing policy also permits SDK calls; no additional access-policy assignment is needed.

Both polling and webhook functions must pass a credential to the SDK client, as shown below.

::: zone-end

::: zone pivot="programming-language-csharp"

In .NET, each connector ships a typed client (for example, `Office365Client`, `Office365UsersClient`, `TeamsClient`) in `Azure.Connectors.Sdk.{Service}`. The client constructor takes the connection's runtime URL and a credential.

The following pattern is from the [end-to-end email user lookup Teams sample](https://github.com/Azure-Samples/functions-connectors-net-e2e-email-users-teams):

```csharp
using Azure.Core;
using Azure.Identity;
using Azure.Connectors.Sdk.Office365;
using Azure.Connectors.Sdk.Office365Users;
using Azure.Connectors.Sdk.Teams;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions
{
    ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_CLIENT_ID")
});

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.AddSingleton<TokenCredential>(credential);

        services.AddSingleton(sp => new Office365Client(
            new Uri(Environment.GetEnvironmentVariable("OFFICE365_CONNECTION_RUNTIME_URL")!),
            sp.GetRequiredService<TokenCredential>()));

        services.AddSingleton(sp => new Office365UsersClient(
            new Uri(Environment.GetEnvironmentVariable("OFFICE365USERS_CONNECTION_RUNTIME_URL")!),
            sp.GetRequiredService<TokenCredential>()));

        services.AddSingleton(sp => new TeamsClient(
            new Uri(Environment.GetEnvironmentVariable("TEAMS_CONNECTION_RUNTIME_URL")!),
            sp.GetRequiredService<TokenCredential>()));
    })
    .Build();

host.Run();
```

This example creates a `DefaultAzureCredential`, registers it as a `TokenCredential`, and passes it to each SDK client's constructor through `sp.GetRequiredService<TokenCredential>()`. Locally, the credential can use your developer sign-in; in Azure, it can use the function app's managed identity. Set `AZURE_CLIENT_ID` to the client ID of a user-assigned managed identity attached to the function app. Leave it unset for a system-assigned identity or local developer sign-in.

The `*_CONNECTION_RUNTIME_URL` settings point to the per-connection runtime endpoint on the connector namespace. Inject the clients into your function and call typed methods such as `UserProfileAsync`, `GetEmailsAsync`, or `FlagAsync`. You can also call SDK clients from non-connector triggers (for example, an HTTP trigger that posts to Teams).

The following simplified excerpt from the [email-to-Teams sample](https://github.com/Azure-Samples/functions-connectors-net-e2e-email-users-teams/blob/main/function-app/ProcessEmail.cs) uses the injected `Office365Client` to flag an email for follow-up. Call this helper from your function's processing code with the email's message ID:

```csharp
using Azure.Connectors.Sdk.Office365;
using Azure.Connectors.Sdk.Office365.Models;

public class ProcessEmail(Office365Client office365Client)
{
    public async Task FlagEmailAsync(string messageId)
    {
        await office365Client.FlagAsync(
            messageId: messageId,
            input: new UpdateEmailFlag { Flag = new { flagStatus = "flagged" } },
            originalMailboxAddress: null,
            cancellationToken: default);
    }
}
```

::: zone-end

::: zone pivot="programming-language-python"

In Python, `azure-connectors` provides typed clients such as `Office365Client` and `TeamsClient`. Pass the per-connection runtime URL and a credential to the client constructor. For Microsoft Entra ID authentication, use an asynchronous credential such as `azure.identity.aio.DefaultAzureCredential`. Await SDK operations.

::: zone-end

::: zone pivot="programming-language-typescript,programming-language-javascript"

In Node.js, `@azure/connectors` provides typed clients such as `Office365Client` and `TeamsClient`. Pass the per-connection runtime URL and a credential, such as `DefaultAzureCredential` from `@azure/identity`, to the client constructor. Await SDK operations.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

## Next steps

- [Managed connector trigger for Azure Function](functions-bindings-connector-trigger.md)
- [Use managed connectors in Azure Functions](functions-connectors-overview.md)
- [Azure Functions Connectors Samples](https://github.com/Azure-Samples/functions-connectors)
- [What is Azure Connector Namespace?](../connector-namespace/connector-namespace-overview.md)
- [Connectors reference](/connectors/connector-reference/)

::: zone-end
