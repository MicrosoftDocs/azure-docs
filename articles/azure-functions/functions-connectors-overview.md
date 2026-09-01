---
title: Use managed connectors in Azure Functions
description: Learn how Azure Functions integrates with Azure Connector Namespace so that you can create managed connectors to interact with services like Office 365, Teams, and SharePoint and respond to events in these services.
ms.topic: concept-article
ms.date: 08/18/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
  - references_regions
zone_pivot_groups: programming-languages-set-functions-no-go
#Customer intent: As a developer, I want to understand how Azure Functions uses managed connectors in a connector namespace to enable connector-based triggers and SDK actions instead of writing my own webhook code and having to use service-native client SDKs.
---

# Use managed connectors in Azure Functions

By using managed connectors, your functions can react to events and call operations in services like Microsoft 365, Microsoft Teams, SharePoint, and many third-party systems without writing webhook setup code or managing OAuth tokens. Azure Functions integrates with Azure Connector Namespace to provide a trigger and an SDK that lets you focus on business logic while the connector namespace handles webhooks, authentication, and retries.

> [!NOTE]
> Azure Connector Namespace integration for Azure Functions is currently in public preview. Features, configuration names, and support for specific managed connectors can change before general availability (GA). Use of this feature is subject to the [supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> Only C#, Node.js, and Python language stacks are currently supported. 

## How connectors enhance Functions

A connector namespace adds two capabilities to the Functions programming model:

- **Connector triggers**  
  A function runs when an event occurs in an external service, such as a new email in Microsoft 365, a file added to SharePoint, or a message posted to Teams. The runtime exposes a `connectorTrigger` binding that receives webhook callbacks from the connector namespace.
- **Connector SDK actions**  
  Your function code calls connector operations through SDK clients. The SDK covers managed connectors such as Microsoft 365 Outlook, Microsoft 365 Users, Teams, SharePoint, and OneDrive. Managed connectors that don't yet have SDK models are callable as HTTP endpoints.

You can use managed connectors alongside classic Functions triggers and bindings such as HTTP, timer, queue, Service Bus, Event Grid, and Durable Functions.

## Preview availability

| Dimension | Availability |
|---|---|
| **Connector Namespace region** | West Central US (`westcentralus`).<br/>Function app can be in any supported region. |
| **Languages** | .NET 10/.NET 8 isolated, Python 3.13+, Node.js 22+ (JS/TS). Java, PowerShell, and Go aren't supported. |
| **Hosting plans** | [Flex Consumption](./flex-consumption-plan.md) (recommended), [Premium](./functions-premium-plan.md), [Dedicated](./dedicated-plan.md), and [Container Apps](./functions-container-apps-hosting.md). |
| **Pricing** | [Standard Functions pricing](https://azure.microsoft.com/pricing/details/functions/): No extra charge for connector trigger/SDK during preview.<br/>*Connector Namespace has separate billing.* |

## When to use connectors

Use connectors when your functions mainly need to interact with external services rather than run complex custom logic. Consider these ways to use managed connectors in your function apps:

- **React to external events**  
  Your app must handle events raised by externally connected services (new emails, calendar invites, files, list items, Teams activity), but you don't want to spend the effort coding  webhook registrations, handshake validation, and OAuth refreshes. Consider a case where your function runs to process new emails delivered in a monitored Office 365 Outlook folder, classifies the message, calls the Office 365 connector for enrichment, and flags or moves the email. All of this distributed work is done by your app without ever having to worry about refresh tokens, which is handled by your connector namespace.

- **Replace custom service clients**   
  Your function code already calls Microsoft 365 or third-party APIs by using custom HTTP clients, which requires you to manage secrets, scopes, and retry policies across many connections, which can quickly become a maintenance burden. You can instead use the typed clients in connector SDKs directly in your function code and let managed connectors handle the connections themselves.

- **Leverage an existing app deployment**  
  You already built an event-driven function app project with a deployment pipeline and monitoring tools. You can use managed connectors to add a new external service trigger-based function in the same project and take advantage of the existing infrastructure. For example, a function app that used to rely on message queues or Logic Apps can now react directly to Teams activity and connect to Office 365 for in-organization checks and manager lookups.

- **Agentic workflows**  
  You're building workflows where a function receives an event, reasons with an AI model, and then acts back into an external service through a connector operation. You can leverage the [Azure Functions hosted skills](functions-hosted-skills.md) to program your agentic workflow while still taking advantage of managed connector-based triggers and managed connector SDKs.

- **Code-first control with managed integration**  
  You want managed connectors to simplify inbound and outbound communication with external service, but you prefer a code-first programming model and full control over the orchestration, including branching, managing authentication between steps, and reusing your existing libraries.

    > [!TIP]  
    > When the workload is pure orchestration across connectors with no custom code, Logic Apps Standard remains the simplest choice. For more information, see [Relationship to other Azure integration options](#relationship-to-other-azure-integration-options).

## Relationship to other Azure integration options

Managed connectors in Azure Functions are additive. The right choice depends on how much custom code the workload needs and whether the team prefers a visual designer or code.

| Option | Best for... | You get... |
| --- | --- | --- |
| [Logic Apps Standard](../logic-apps/logic-apps-overview.md) | Orchestrating a workflow across connectors; team prefers a visual designer; little custom code between steps. | Low-code designer for the same connector ecosystem. |
| [Azure Functions with managed connectors](#how-connectors-enhance-functions) | Code-first experiences including custom branching, in-process libraries, other bindings, and AI model calls between trigger and action. | .NET, Python, or Node.js authoring; Functions deployment and monitoring; no webhook or OAuth code for external services. |
| [HTTP triggers](./functions-bindings-http-webhook-trigger.md) with service SDKs | Cases where no managed connector exists for the targeted service or you need protocol-level controls that aren't provided by the connector. | Full control over auth, retry, and webhook validation; no requirements for a connector namespace. |

A single function app can combine all three patterns. You can add a connector trigger to an existing HTTP-trigger app and adopt SDK clients incrementally.

## Packages and prerequisites

Each supported language has a small set of packages that bring in the trigger binding and the connector SDK clients.

::: zone pivot="programming-language-csharp"

The worker extension package ships the connector trigger binding. The `Azure.Connectors.Sdk.*` packages (one per connector) ship typed payloads and SDK clients.

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Connector --prerelease
dotnet add package Azure.Connectors.Sdk --prerelease
```

For the .NET isolated worker, target `net8.0` or `net10.0` and the latest Functions worker.

::: zone-end

::: zone pivot="programming-language-python"

Python uses the preview extension bundle to load the trigger binding and the `azurefunctions-extensions-connectors` package for typed Office 365 models. Add the bundle to `host.json`:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
        "version": "[4.42.0, 5.0.0)"
    }
}
```

Install the runtime and extension packages:

```bash
pip install "azure-functions>=2.2.0b4"
pip install azurefunctions-extensions-connectors
```

The `@app.connector_trigger` decorator works for all managed connector types. Typed payload models are being actively developed and added through the `azurefunctions-extensions-connectors` package. For managed connectors without typed models, treat the payload as a string.

::: zone-end

::: zone pivot="programming-language-typescript,programming-language-javascript"

Node.js uses the experimental extension bundle to load the trigger binding. Add the bundle to `host.json`:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
        "version": "[4.42.0, 5.0.0)"
    }
}
```

Install the Functions library and the connector packages:

```bash
npm install @azure/functions
npm install @azure/functions-extensions-connectors
npm install @azure/connectors
```

Use the typed entry points in `@azure/functions-extensions-connectors` (for example, `connectors.office365.onNewEmail`) when typed models exist. Use `app.connectorTrigger` from `@azure/functions` for any managed connector when you want the raw payload.

::: zone-end

::: zone pivot="programming-language-java,programming-language-powershell"

Java and PowerShell aren't supported in the public preview. See [Preview availability](#preview-availability) for the current list of supported runtimes.

::: zone-end

## Connector-based triggers

A managed connector-based trigger runs your function when an event occurs in the connected service. The connector namespace delivers the event to your function app over HTTPS by using the connector extension's webhook endpoint:

```http
POST /runtime/webhooks/connector?functionName={FunctionName}&code={connector_extension_key}
```

::: zone pivot="programming-language-csharp"  
`{FunctionName}` matches the name in your `[Function]` attribute. `{connector_extension_key}` is the value of a system key that you retrieve by running:
::: zone-end

::: zone pivot="programming-language-python"  
`{FunctionName}` matches the name in your `@app.function_name` decorator. `{connector_extension_key}` is the value of a system key that you retrieve by running:
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript"  
`{FunctionName}` matches the name in your trigger registration. `{connector_extension_key}` is the value of a system key that you retrieve by running:
::: zone-end  

```azurecli
az functionapp keys list \
    --resource-group <resource-group> \
    --name <function-app> \
    --query "systemKeys.connector_extension" \
    --output tsv
```

The trigger configuration in your connector namespace stores that callback URL and presents the system key on each callback. The Functions runtime validates the key before running your function. For a setup without shared secrets, you can put App Service built-in authentication in front of the function app and validate a managed identity token from the connector namespace. See [.NET sample: built-in authentication with managed identity](https://github.com/Azure-Samples/functions-connectors-net-builtinauth) for the full pattern.

> [!TIP]
> Use the Flex Consumption plan for connector-triggered functions during preview. Flex Consumption provides per-instance scale and managed identity support that aligns with the connector platform's authentication model.

Request payloads carry the event body plus a set of `x-ms-*` headers that identify the trigger configuration, the connection, the event type, and a correlation ID. When the managed connector has an SDK model, the runtime deserializes the payload directly into that model. For managed connectors without client SDKs, your function receives the raw JSON body.

The following example shows a function that fires when a new email arrives in an Office 365 Outlook mailbox. The trigger registration is per-language; the trigger configuration in the connector namespace is the same in all cases.

::: zone pivot="programming-language-csharp"

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Azure.Connectors.Sdk.Office365.Models;
using Microsoft.Extensions.Logging;

public class OnNewEmail
{
    private readonly ILogger<OnNewEmail> _logger;

    public OnNewEmail(ILogger<OnNewEmail> logger) => _logger = logger;

    [Function("OnNewEmail")]
    public IActionResult Run(
        [ConnectorTrigger()] Office365OnNewEmailTriggerPayload payload)
    {
        var emails = payload?.Body?.Value ?? [];
        foreach (var email in emails)
        {
            _logger.LogInformation(
                "Received email from {From} with subject '{Subject}'.",
                email.From, email.Subject);
        }

        return new OkResult();
    }
}
```

The `Office365OnNewEmailTriggerPayload` model and other operation payload types come from `Azure.Connectors.Sdk.Office365.Models`. For the full operation-to-payload mapping, see [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md).

::: zone-end

::: zone pivot="programming-language-python"

```python
import azure.functions as func
import json
import logging

app = func.FunctionApp()

@app.function_name(name="OnNewEmail")
@app.connector_trigger(arg_name="payload")
def on_new_email(payload: str) -> None:
    data = json.loads(payload)
    emails = data.get("body", {}).get("value", [])
    for email in emails:
        logging.info(
            "Received email from %s with subject '%s'.",
            email.get("from"), email.get("subject"))
```

For the Office 365 `OnNewEmailV3` operation specifically, you can use the typed decorator from `azurefunctions-extensions-connectors`:

```python
import azure.functions as func
import azurefunctions.extensions.connectors.office365 as office365
import logging

app = func.FunctionApp()

@app.function_name(name="OnNewEmail")
@app.connector_trigger(arg_name="email")
def on_new_email(email: office365.ClientReceiveMessage) -> None:
    logging.info(
        "Received email from %s with subject '%s'.",
        email.from_, email.subject)
```

::: zone-end

::: zone pivot="programming-language-typescript,programming-language-javascript"

```typescript
import { InvocationContext } from '@azure/functions';
import {
    connectors,
    EmailTriggerContext,
} from '@azure/functions-extensions-connectors';

connectors.office365.onNewEmail('OnNewEmail', {
    handler: async (
        context: EmailTriggerContext,
        invocationContext: InvocationContext,
    ) => {
        for (const email of context.emails) {
            invocationContext.log(
                `Received email from '${email.from}' with subject '${email.subject}'.`,
            );
        }
    },
});
```

For any connector that doesn't have a typed entry point yet, use the generic `app.connectorTrigger` from `@azure/functions`:

```typescript
import { app, InvocationContext } from '@azure/functions';

app.connectorTrigger('OnNewItem', {
    handler: async (payload: unknown, context: InvocationContext) => {
        const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
        const items: Record<string, unknown>[] = (data as any)?.body?.value ?? [];
        for (const item of items) {
            context.log(`Item ID: ${item.Id}`);
        }
    },
});
```

::: zone-end

::: zone pivot="programming-language-java,programming-language-powershell"

The connector trigger isn't available in this language for the public preview.

::: zone-end

You create the trigger configuration in the connector namespace by using the Azure CLI, ARM, or Bicep. That step is part of the connector platform and is documented in the connectors content set. Functions doesn't ship its own configuration commands for trigger registration.

## Authenticate your functions to a connector namespace

> [!NOTE]
> This section covers authentication between the connector namespace and your function app. For how the connector namespace authenticates to upstream services (Microsoft 365, Teams, SharePoint), see [Azure connectors overview](/connectors/overview).

The default authentication model uses a shared system key (`connector_extension`) that the connector namespace presents on each callback. However, shared keys can't be scoped per-trigger and require coordinated rotation between the function app and connector namespace. For production workloads, instead use [App Service built-in authentication](../app-service/overview-authentication-authorization.md) (also called Easy Auth) with a managed identity.

In this pattern, the connector namespace uses its own system-assigned or [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) to request an Entra ID token for every callback. The function app validates that token including its audience, issuer, and the caller's object ID before any request reaches the Functions host. No shared keys, no client secrets, anywhere.

For an end-to-end working example, see this repository: [functions-connectors-net-builtinauth](https://github.com/Azure-Samples/functions-connectors-net-builtinauth).

### Function app configuration

Built-in authentication runs at the App Service worker boundary, before the Functions runtime gets the request. You configure it through the [`authsettingsV2` ARM property](../app-service/configure-authentication-file-based.md) or its equivalent in Bicep.

| Setting | Purpose |
| --- | --- |
| **`requireAuthentication: true`** | Rejects any request without a valid token (returns 401). |
| **`identityProviders.azureActiveDirectory.enabled: true`** | [Validates Entra ID tokens](../app-service/configure-authentication-provider-aad.md). |
| **`registration.clientId`** | The app (client) ID of the Entra app registration that built-in authentication validates tokens against. |
| **`registration.openIdIssuer`** | The issuer URL for your tenant: `https://login.microsoftonline.com/{tenantId}/v2.0`. |
| **`validation.allowedAudiences`** | The Entra app's client ID and identifier URI. Tokens must carry one of these audiences in the `aud` claim. |
| **`validation.defaultAuthorizationPolicy.allowedPrincipals.identities`** | The object (principal) IDs of the managed identities allowed to call the function. Only the connector namespace's managed identity should be listed here. Any token with a different `oid` claim gets a 403. |

The function app also needs a user-assigned managed identity [federated to the Entra app registration](/entra/workload-id/workload-identity-federation). Built-in authentication uses that [federated identity credential](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity) (FIC) to mint client assertions for the Entra app without storing a client secret. The bicep pattern sets `clientSecretSettingName` to an app setting that holds the user-assigned MI's client ID, telling built-in auth to use FIC instead of a secret.

Since built-in authentication already validates every request, you can disable the redundant system-key check in `host.json`, which would look like this JSON fragment:

```json
{
    ...
    "extensions": {
        "connector": {
            "system": {
                "webhookAuthorizationLevel": "Anonymous"
            }
        }
    }
}
```

### Connector namespace configuration

Your connector namespace must have a system-assigned or user-assigned managed identity enabled and attached. When you create the trigger configuration, specify `authentication.type = ManagedServiceIdentity` and `authentication.identity = <resource-id-of-managed-identity>` for a user-assigned identity or omit `identity` for a system-assigned identity. Also specify `authentication.audience = <entra-app-client-id>` so the connector runtime knows which audience to request in the token.

The connector runtime uses that managed identity to generate an Entra ID token on every callback. In this token, `iss` (issuer) is your tenant, `aud` (audience) is the Entra app client ID, and `oid` (object ID) is the principal ID of the identity. Built-in authentication validates all three.

The connector namespace resource also needs access to the connection, such as an `office365` connection. Grant this access through an access policy that lists the managed identity's principal ID. The sample bicep file shows the full configuration for both the namespace identity and the connection access policy.

### What's enforced

Built-in authentication validates tokens in order:

1. **Token presence** - Missing or expired token → **401**
1. **Signature** - Verified against the issuer's JWKS for your tenant
1. **`iss` (issuer)** - Must match `openIdIssuer`
1. **`aud` (audience)** - Must be in `allowedAudiences`
1. **`oid` (object/principal ID)** - Must match one of the identities in `allowedPrincipals.identities`. Any other identity → **403**

Because this check runs at the App Service edge, your function code never sees a request that didn't come from the connector namespace's managed identity. You don't need any application code for the access check.

### Authentication flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Connector namespace  (westcentralus)                           │
│  • System-assigned or user-assigned managed identity enabled    │
│  • Trigger config: authentication.type = ManagedServiceIdentity │
│                    authentication.audience = <Entra app ID>     │
│                    callbackUrl = https://<func>/runtime/…       │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         │  POST callbackUrl
                         │  Authorization: Bearer <AAD token>
                         │     iss = your tenant
                         │     aud = Entra app clientId
                         │     oid = managed identity principalId
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  Function App  (any region)                                  │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐   │
│   │ Built-in authentication  (App Service edge)          │   │
│   │   • Validates signature, iss, aud, exp               │   │
│   │   • Checks oid ∈ allowedPrincipals.identities        │   │
│   │   → No token  → 401                                  │   │
│   │   → Wrong oid → 403                                  │   │
│   └────────────────────┬─────────────────────────────────┘   │
│                        │ pass                                │
│                        ▼                                     │
│   ┌──────────────────────────────────────────────────────┐   │
│   │ /runtime/webhooks/connector                          │   │
│   │   (webhookAuthorizationLevel = Anonymous)            │   │
│   └────────────────────┬─────────────────────────────────┘   │
│                        ▼                                     │
│   ┌──────────────────────────────────────────────────────┐   │
│   │ Your function(payload)                               │   │
│   └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                         ▲
                         │ FIC (federated identity credential)
         ┌───────────────┴────────────────┐
         │  Entra app registration         │
         │  (federated to function-app MI) │
         └─────────────────────────────────┘
```

### Related content

- [Authentication and authorization in Azure App Service and Azure Functions](../app-service/overview-authentication-authorization.md)
- [Configure your App Service or Azure Functions app to use Microsoft Entra sign-in](../app-service/configure-authentication-provider-aad.md)
- [File-based configuration in Azure App Service authentication](../app-service/configure-authentication-file-based.md)
- [Workload identity federation in Microsoft Entra ID](/entra/workload-id/workload-identity-federation)
- [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)

## Using connectors in your code

The connector SDK enables your function to call connector operations as outbound actions. The client surface uses the same underlying managed connector in the connector namespace that triggers use, so a single managed connector can power both inbound triggers and outbound calls for the same service account.

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

The `*_CONNECTION_RUNTIME_URL` settings point to the per-connection runtime endpoint on the connector namespace. Inject the clients into your function and call typed methods such as `UserProfileAsync`, `GetEmailsAsync`, or `FlagAsync`. You can also call SDK clients from non-connector triggers (for example, an HTTP trigger that posts to Teams).

::: zone-end

::: zone pivot="programming-language-python"

In Python, install `azure-connectors` for typed clients (for example, `office365`, `teams`, `office365Users`). The clients accept the per-connection runtime URL and a credential. SDK action coverage is expanding.

::: zone-end

::: zone pivot="programming-language-typescript,programming-language-javascript"

In Node.js, install `@azure/connectors` for typed clients (for example, `office365`, `teams`, `office365Users`). The clients accept the per-connection runtime URL and a credential. SDK action coverage is expanding.

::: zone-end

::: zone pivot="programming-language-java,programming-language-powershell"

The connector SDK isn't available in these languages for the public preview.

::: zone-end

## Related articles

- [Azure Functions connectors samples (canonical index)](https://aka.ms/functions-connectors-samples)
- [End-to-end .NET sample: email → user lookup → Teams](https://github.com/Azure-Samples/functions-connectors-net-e2e-email-users-teams)
- [.NET sample: built-in authentication with managed identity](https://github.com/Azure-Samples/functions-connectors-net-builtinauth)
- [Azure Functions Connector Extension repository](https://github.com/Azure/azure-functions-connector-extension)
- [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md)
- [Azure connectors overview](/connectors/overview)
- [What is Azure Connector Namespace?](/azure/logic-apps/connector-namespace/connector-namespace-overview)
- [Azure Functions hosted skills in Azure Functions](functions-hosted-skills.md)
