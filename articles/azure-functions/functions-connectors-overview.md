---
title: Use connectors in Azure Functions
description: Learn how Azure Functions integrates with the managed connectors platform for event-driven triggers and SDK-based actions against SaaS services like Office 365, Teams, and SharePoint.
ms.topic: concept-article
ms.date: 05/21/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
  - references_regions
zone_pivot_groups: programming-languages-set-functions-no-go
#Customer intent: As a developer, I want to understand how Azure Functions uses managed connectors so that I can choose connector-based triggers and SDK actions instead of writing my own webhook plumbing and SaaS API clients.
---

# Use connectors in Azure Functions

Azure Functions integrates with the managed connectors platform that backs Logic Apps and Power Platform, giving your functions access to connectors to systems such as Office 365, Microsoft Teams, and many third-party services. Functions add a connector-based trigger model and a connector SDK so you receive external events and call connector operations from function code in the same app. You write the business logic; the connector platform handles webhook registration, OAuth flows, token refresh, and retry.

> [!NOTE]
> Connectors in Azure Functions are in public preview. Features, configuration names, and supported connectors can change before general availability. Use of this feature is subject to the [supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Overview

Connectors extend the Azure Functions programming model with two capabilities that target external services:

- **Connector triggers** - A function runs when an event occurs in an external service, such as a new email in Office 365, a file added to SharePoint or OneDrive, or a message posted to Microsoft Teams. The runtime exposes a `connectorTrigger` binding that receives webhook callbacks from the Connector Namespace.
- **Connector SDK actions** - Function code calls connector operations through clients from the Connector SDK. The SDK covers curated connectors (such as Office 365 Outlook, Office 365 Users, Microsoft Teams, SharePoint, and OneDrive) with strongly typed models. Other connectors are reachable through dynamic payload models.

A single function app combines connector triggers and actions with the bindings you already use, including HTTP, timer, queue, Service Bus, Event Grid, and Durable Functions.

> [!IMPORTANT]
> The Connector Namespace is a separate Azure resource owned by the connectors platform. It hosts connector trigger configurations and outbound connections, and it manages authentication to SaaS systems. This article describes how Functions consume that resource. For more information, see [What is Azure Connector Namespace?](/azure/logic-apps/connector-namespace/connector-namespace-overview).

The preview has the following availability:

- **Region for the Connector Namespace** - West Central US (`westcentralus`). Your function app can be deployed in any region that supports the chosen hosting plan.
- **Languages** - .NET 10 and .NET 8 isolated worker, Python 3.13+, and Node.js 22+ (JavaScript and TypeScript). Java, PowerShell, and Go aren't currently supported.
- **Hosting plans** - Flex Consumption (recommended), Premium, Dedicated (App Service plan), and Azure Container Apps.
- **Pricing** - Standard Azure Functions pricing applies. There's no extra charge for the connector trigger or SDK during preview. The Connector Namespace resource has its own billing.

## When to use connectors

Use connectors when the integration shape, not raw code, dominates the workload. The following statements describe scenarios where connectors in Functions are the right fit:

- You react to events in SaaS systems (new emails, calendar invites, files, list items, Teams activity) and you want to skip writing webhook registration, validation handshakes, and OAuth refresh.
- Your function code already calls Microsoft 365 or third-party SaaS APIs through hand-rolled HTTP clients, and the connection sprawl (secrets, scopes, retry policy) is becoming a maintenance burden.
- You're extending an event-driven app that already runs on Functions and you want SaaS triggers in the same project, deployment pipeline, and observability stack.
- You're building agentic workflows where a function receives an event, reasons with an AI model, and then acts back into a SaaS system through a connector operation.
- You need code-first control over the orchestration (branching, custom auth between steps, reuse of existing .NET, Python, or Node.js libraries) but you want connectors to own the inbound and outbound integration.

If the workload is pure orchestration across connectors with no custom code, Logic Apps Standard remains the more direct choice. See [Relationship to other Azure integration options](#relationship-to-other-azure-integration-options).

## Packages and prerequisites

Each supported language has a small set of packages that bring in the trigger binding and the typed connector clients.

::: zone pivot="programming-language-csharp"

The connector trigger binding ships in the worker extension package; typed payloads and SDK clients ship in `Azure.Connectors.Sdk.*` packages (one per connector).

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

The `@app.connector_trigger` decorator works for all connector types. Typed payload models are being actively developed and added through the `azurefunctions-extensions-connectors` package. For connectors without typed models, the payload should be treated as a string.

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

Use the typed entry points in `@azure/functions-extensions-connectors` (for example, `connectors.office365.onNewEmail`) when typed models exist; use `app.connectorTrigger` from `@azure/functions` for any connector when you want the raw payload.

::: zone-end

::: zone pivot="programming-language-java,programming-language-powershell"

Java and PowerShell aren't supported in the public preview. See [Languages](#overview) for the current list of supported runtimes.

::: zone-end

## Connector-based triggers

A connector-based trigger fires your function when an event occurs in an external service. The Connector Namespace delivers the event to your function app over HTTPS through the connector extension's webhook endpoint:

```http
POST /runtime/webhooks/connector?functionName={FunctionName}&code={connector_extension_key}
```

`{FunctionName}` matches the name in your `[Function]` attribute (.NET), `@app.function_name` (Python), or trigger registration (Node.js). `{connector_extension_key}` is the value of a system key named `connector_extension` that the extension provisions on first start. You retrieve the key with the Azure CLI:

```azurecli
az functionapp keys list \
    --resource-group <resource-group> \
    --name <function-app> \
    --query "systemKeys.connector_extension" \
    --output tsv
```

The trigger configuration in your Connector Namespace stores that callback URL and presents the system key on each callback. The Functions runtime validates the key before invoking your function. For a secret-free topology, you can put App Service built-in authentication in front of the function app and validate a managed identity token from the Connector Namespace; see [.NET sample: built-in authentication with managed identity](https://github.com/Azure-Samples/functions-connectors-net-builtinauth) for the full pattern.

> [!TIP]
> Use the Flex Consumption plan for connector-triggered functions during preview. Flex Consumption provides per-instance scale and managed identity support that aligns with the connector platform's authentication model.

Request payloads carry the event body plus a set of `x-ms-*` headers that identify the trigger configuration, the connection, the event type, and a correlation ID. When the connector has a typed SDK model, the runtime can deserialize the payload directly into that model; for connectors without typed models, your function receives the raw JSON body.

The following example shows a function that fires when a new email arrives in an Office 365 Outlook mailbox. The trigger registration is per-language; the trigger configuration in the Connector Namespace is the same in all cases.

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

The `Office365OnNewEmailTriggerPayload` model and other operation payload types come from `Azure.Connectors.Sdk.Office365.Models`. For the full operation-to-payload mapping, see [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md) in the extension repository.

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

You create the trigger configuration in the Connector Namespace using the Azure CLI, ARM, or Bicep. That step is part of the connector platform surface and is documented in the connectors content set. Functions doesn't ship its own configuration commands for trigger registration.

## Authentication between Azure Functions and the Connector Namespace

> [!TIP]
> End-to-end working example: [functions-connectors-net-builtinauth](https://github.com/Azure-Samples/functions-connectors-net-builtinauth)

The default authentication model uses a shared system key (`connector_extension`) that the Connector Namespace presents on each callback. For production workloads that require secret-free topologies, you can configure the Connector Namespace to authenticate to your function app using a managed identity and enforce that authentication at the function app edge using [App Service built-in authentication](../app-service/overview-authentication-authorization.md) (also called Easy Auth).

In this pattern, the Connector Namespace uses its own system-assigned or [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) to mint an Entra ID token for every callback. The function app validates that token including its audience, issuer, and the caller's object ID before any request reaches the Functions host. No shared keys, no client secrets, anywhere.

### Function app configuration

Built-in authentication runs at the App Service worker edge, before the Functions runtime sees the request. You configure it through the [`authsettingsV2` ARM property](../app-service/configure-authentication-file-based.md) (or equivalent in Bicep):

| Setting | Purpose |
|---|---|
| **`requireAuthentication: true`** | Rejects any request without a valid token (returns 401). |
| **`identityProviders.azureActiveDirectory.enabled: true`** | [Validates Entra ID tokens](../app-service/configure-authentication-provider-aad.md). |
| **`registration.clientId`** | The app (client) ID of the Entra app registration that built-in authentication validates tokens against. |
| **`registration.openIdIssuer`** | The issuer URL for your tenant: `https://login.microsoftonline.com/{tenantId}/v2.0`. |
| **`validation.allowedAudiences`** | The Entra app's client ID and identifier URI. Tokens must carry one of these audiences in the `aud` claim. |
| **`validation.defaultAuthorizationPolicy.allowedPrincipals.identities`** | The object (principal) IDs of the managed identities allowed to call the function. Only the Connector Namespace's managed identity should be listed here. Any token with a different `oid` claim gets a 403. |

The function app also needs a user-assigned managed identity [federated to the Entra app registration](/entra/workload-id/workload-identity-federation). Built-in authentication uses that [federated identity credential](/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity) (FIC) to mint client assertions for the Entra app without storing a client secret. The bicep pattern sets `clientSecretSettingName` to an app setting that holds the user-assigned MI's client ID, telling built-in auth to use FIC instead of a secret.

You can also disable the system-key check for the connector webhook endpoint by setting `"extensions": { "connector": { "system": { "webhookAuthorizationLevel": "Anonymous" } } }` in `host.json`, as the Entra token check is now in place.

### Connector Namespace configuration

The Connector Namespace must have a system-assigned or user-assigned managed identity enabled and attached. When you create the trigger configuration, you specify `authentication.type = ManagedServiceIdentity` and `authentication.identity = <resource-id-of-managed-identity>` (for user-assigned) or omit `identity` (for system-assigned). You also specify `authentication.audience = <entra-app-client-id>` so the connector runtime knows which audience to request in the token.

The connector runtime then uses that managed identity to mint an Entra ID token on every callback. The token's `iss` (issuer) is your tenant, `aud` (audience) is the Entra app client ID, and `oid` (object ID) is the managed identity's principal ID. Built-in authentication validates all three.

The Connector Namespace resource itself also needs access to the connection (for example, the `office365` connection). You grant this access through an access policy that lists the managed identity's principal ID. The sample bicep shows the full wiring for both the namespace identity and the connection access policy.

### What's enforced

Built-in authentication validates tokens in order:

1. **Token presence** - Missing or expired token → **401**
2. **Signature** - Verified against the issuer's JWKS for your tenant
3. **`iss` (issuer)** - Must match `openIdIssuer`
4. **`aud` (audience)** - Must be in `allowedAudiences`
5. **`oid` (object/principal ID)** - Must match one of the identities in `allowedPrincipals.identities`. Any other identity → **403**

Because this check runs at the App Service edge, your function code never sees a request that didn't come from the Connector Namespace's managed identity. No application code is needed for the access check.

### Authentication flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Connector Namespace  (westcentralus)                           │
│  • System-assigned or user-assigned managed identity enabled    │
│  • Trigger config: authentication.type = ManagedServiceIdentity |
│                    authentication.audience = <Entra app ID>     │
│                    callbackUrl = https://<func>/runtime/…       │
└────────────────────────┬────────────────────────────────────────┘
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

> [!IMPORTANT]
> This section covers authentication between the Connector Namespace and your function app and how the connector runtime proves its identity when calling the function. Authentication from the Connector Namespace to the upstream service (for example, Microsoft 365, Teams, or SharePoint) is owned by the connectors team and managed through the connection resource on the Connector Namespace. That authentication flow is out of scope for this article. See [Azure connectors overview](/connectors/overview) for the connector-to-SaaS authentication model.

### Related content

- [Authentication and authorization in Azure App Service and Azure Functions](../app-service/overview-authentication-authorization.md)
- [Configure your App Service or Azure Functions app to use Microsoft Entra sign-in](../app-service/configure-authentication-provider-aad.md)
- [File-based configuration in Azure App Service authentication](../app-service/configure-authentication-file-based.md)
- [Workload identity federation in Microsoft Entra ID](/entra/workload-id/workload-identity-federation)
- [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)

## Using connectors in your code

The connector SDK lets your function call connector operations as outbound actions. The client surface uses the same underlying Connector Namespace connection that triggers use, so a single connection can power both inbound triggers and outbound calls for the same SaaS account.

::: zone pivot="programming-language-csharp"

In .NET, each connector ships a typed client (for example, `Office365Client`, `Office365UsersClient`, `TeamsClient`) in `Azure.Connectors.Sdk.{Service}`. The client constructor takes the connection's runtime URL and a `TokenCredential` that authenticates to the connection. Register clients in `Program.cs` and inject them into your functions.

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

The `*_CONNECTION_RUNTIME_URL` settings point at the per-connection runtime endpoint on the Connector Namespace. Inject the clients into your function and call typed methods such as `UserProfileAsync`, `GetEmailsAsync`, or `FlagAsync`. You can also call SDK clients from non-connector triggers (for example, an HTTP trigger that posts to Teams).

::: zone-end

::: zone pivot="programming-language-python"

In Python, install `azure-connectors` for typed clients (for example, `office365`, `teams`, `office365Users`). The clients accept the per-connection runtime URL and a credential. SDK action coverage is expanding during preview; check the [Connectors Python SDK repository](https://github.com/Azure/Connectors-python-sdk) for the current list.

::: zone-end

::: zone pivot="programming-language-typescript,programming-language-javascript"

In Node.js, install `@azure/connectors` for typed clients (for example, `office365`, `teams`, `office365Users`). The clients accept the per-connection runtime URL and a credential. SDK action coverage is expanding during preview; check the [Connectors Node.js SDK repository](https://github.com/Azure/Connectors-nodejs-sdk) for the current list.

::: zone-end

::: zone pivot="programming-language-java,programming-language-powershell"

The connector SDK isn't available in this language for the public preview.

::: zone-end

## Key scenarios

### Email-triggered processing

A function fires on each new email in a watched Office 365 Outlook folder. It classifies the message, calls the Office 365 connector to read recent messages from the same sender for enrichment, and then takes an action such as flagging the email, moving it to a folder, or notifying a Teams channel. The function never holds a refresh token; the connection in the Connector Namespace does.

### Microsoft Teams and Microsoft Graph interaction

A function reacts to Teams activity or posts cards into a channel through the Teams connector, and it looks up users with the Office 365 Users connector for in-organization checks and manager lookups. Combine the two connectors with Microsoft Graph to gate operational actions on group membership or licensing before a code path runs.

### Agentic workflows

The connector trigger model and SDK plug into the Azure Functions [serverless agents runtime](functions-serverless-agents-runtime.md). An agent function receives a SaaS event, reasons over it with a model, and uses connector SDK clients as tools to take action back in the source system or in another SaaS service. This article doesn't detail the agent programming model itself; see the serverless agents article for the full pattern.

## Relationship to other Azure integration options

Connectors in Azure Functions are additive. The right choice depends on how much custom code the workload needs and what authoring surface the team prefers.

**Logic Apps Standard.** If the workload is mostly orchestration across connectors and the team prefers a visual designer, use Logic Apps Standard. Logic Apps owns the low-code authoring experience for the same connector ecosystem and remains the reference product for designer-driven workflows. Choose Logic Apps when the code between steps is minimal and the value is in the orchestration.

**Azure Functions with connectors.** If the workload is code-first (custom branching, in-process libraries, integration with other Functions bindings, or AI model calls between trigger and action) use Functions with connectors. You author in .NET, Python, or Node.js, you keep the Functions deployment model and observability stack, and you avoid writing webhook plumbing and OAuth handling for the SaaS edge.

**HTTP triggers with service SDKs.** If no managed connector exists for the target system, or you need protocol-level control that the connector abstraction hides, stay on an HTTP-triggered function that calls the service SDK directly. This path keeps you responsible for auth, retry, and webhook validation, but it has no dependency on the Connector Namespace.

A single function app can combine all three patterns. You can add a connector trigger to an existing HTTP-trigger app and adopt SDK clients incrementally.

## Next steps

- [Azure Functions connectors samples (canonical index)](https://aka.ms/functions-connectors-samples)
- [End-to-end .NET sample: email → user lookup → Teams](https://github.com/Azure-Samples/functions-connectors-net-e2e-email-users-teams)
- [.NET sample: built-in authentication with managed identity](https://github.com/Azure-Samples/functions-connectors-net-builtinauth)
- [Azure Functions Connector Extension repository](https://github.com/Azure/azure-functions-connector-extension)
- [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md)
- [Azure connectors overview](/connectors/overview)
- [What is Azure Connector Namespace?](/azure/logic-apps/connector-namespace/connector-namespace-overview)
- [Serverless agents runtime in Azure Functions](functions-serverless-agents-runtime.md)
