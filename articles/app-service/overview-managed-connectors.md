---
title: Use Managed Connectors in Azure App Service
description: Learn how App Service apps receive events and call operations through managed connectors, with managed identity authentication and C#, JavaScript, TypeScript, and Python examples.
author: seligj95
ms.author: jordanselig
ms.topic: concept-article
ms.date: 09/23/2026
ms.service: azure-app-service
ms.custom: AppServiceConnectivity
zone_pivot_groups: programming-languages-set-app-service-connectors
ai-usage: ai-assisted
#customer intent: As a developer, I want to use managed connectors in my App Service app so that I can receive events and call external services without managing their OAuth tokens or writing service-specific integration code.
---

# Use managed connectors in Azure App Service

Managed connectors let your Azure App Service app react to events and call operations in services such as Microsoft 365, Microsoft Teams, SharePoint, and third-party systems. Your app handles the business logic, while [Azure Connector Namespace](../connector-namespace/connector-namespace-overview.md) manages connections to those services, including authentication, token refresh, and event subscriptions.

You can select **App Service** as a trigger destination in the [Managed Connectors portal](https://connectors.azure.com). Events arrive as authenticated HTTP requests at a route in your existing web app or API. Your application can also use connector SDK clients to take actions through the same connections.

> [!NOTE]
> Managed Connectors, including the App Service trigger destination, is in public preview. This capability doesn't introduce a separate App Service preview. Features and supported connector operations can change before general availability. Use of this feature is subject to the [supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How connectors work with App Service

Managed connectors support two integration patterns:

- **Connector triggers** deliver events to your app, such as a new Outlook email or a file added to SharePoint. Your app receives an HTTPS POST request and processes the event by using its normal framework and routing.
- **Connector actions** let your application call external-service operations, such as posting a Teams message or flagging an email. Your code uses a connector SDK or HTTP endpoint instead of managing a separate service-specific client and OAuth flow.

A connector namespace is a separate Azure resource that hosts the connections and trigger configurations. Your App Service app remains responsible for request handling, application logic, and any processing or downstream actions it performs.

Unlike [managed connectors in Azure Functions](../azure-functions/functions-connectors-overview.md), App Service doesn't require a Functions trigger binding or worker extension. An ASP.NET Core, Java, Node.js, or Python application can receive the callback through an ordinary HTTP route. SDK availability for outbound actions is separate from the language used to receive callbacks.

## When to use managed connectors

Use managed connectors when you want to:

- Add event-driven integrations to an existing web app or API without moving its business logic to another hosting service.
- Respond to changes in external services without implementing their webhook registration, polling, or OAuth token refresh.
- Replace custom service clients with connector operations and centrally managed connections.
- Enrich an incoming event with information from another service before taking an action.
- Build workflows that combine application code, document processing, or AI services with operations in external systems.

If your workload mainly orchestrates connector operations and would benefit from a visual designer, consider Azure Logic Apps. See [Relationship to other integration options](#relationship-to-other-integration-options).

## Availability and prerequisites

To use a managed connector with an App Service app, you need:

- An App Service app with an HTTPS route that can receive requests from your connector namespace.
- A [connector namespace](../connector-namespace/create-connector-namespace.md) and an [authenticated connection](../connector-namespace/create-connector-namespace-connection.md) to the source or destination service.
- A supported trigger or action for that connection.
- Authentication and authorization configured for the receiving app and for any outbound connector calls. See [Authentication](#authentication).

For current platform availability and preview limitations, see [Connector Namespace considerations and limitations](../connector-namespace/connector-namespace-overview.md#considerations-and-limitations). Don't infer connector availability from the region or language of your App Service app.

The following examples use ASP.NET Core on .NET 10, Express on Node.js 24, or FastAPI on Python 3.14.

### Connector SDK packages

You don't need a connector-specific trigger package to receive an HTTP callback in App Service. For typed payloads and outbound operations, use the appropriate connector SDK:

| Language | Package | Reference |
|---|---|---|
| .NET | `Azure.Connectors.Sdk` | [.NET connector SDK](https://github.com/Azure/Connectors-NET-SDK) |
| JavaScript and TypeScript | `@azure/connectors` | [Node.js connector SDK](https://github.com/Azure/Connectors-nodejs-sdk) |
| Python | `azure-connectors` | [Python connector SDK](https://github.com/Azure/Connectors-python-sdk) |

SDK and operation coverage can change during preview. If a typed SDK isn't available for your language or operation, see the [Connector Namespace programming model](../connector-namespace/connector-namespace-overview.md#key-concepts) for HTTP access.

The examples use the following preview SDK versions. Pin the versions when reproducing them: API names and credential types can differ between a released package and the SDK repository's latest examples.

::: zone pivot="programming-language-csharp"

For a runnable example with deployment infrastructure and authentication, use the [C# managed connectors sample](https://github.com/Azure-Samples/app-service-managed-connectors/tree/main/src/dotnet).

Add these packages to an ASP.NET Core project:

```bash
dotnet add package Azure.Connectors.Sdk --version 0.11.0-preview.1
dotnet add package Azure.Identity --version 1.21.0
```

::: zone-end

::: zone pivot="programming-language-javascript"

For a runnable example with deployment infrastructure and authentication, use the [JavaScript managed connectors sample](https://github.com/Azure-Samples/app-service-managed-connectors/tree/main/src/javascript).

Use an ES module project (`"type": "module"` in `package.json`) and install:

```bash
npm install express@5.2.1 @azure/connectors@0.2.0-preview
```

::: zone-end

::: zone pivot="programming-language-typescript"

For a runnable example with deployment infrastructure and authentication, use the [TypeScript managed connectors sample](https://github.com/Azure-Samples/app-service-managed-connectors/tree/main/src/typescript).

Use an ES module project (`"type": "module"` in `package.json`) and install:

```bash
npm install express@5.2.1 @azure/connectors@0.2.0-preview
npm install --save-dev typescript@7.0.2 @types/express@5 @types/node@24
```

Compile with `module` and `moduleResolution` set to `NodeNext`, `target` set to `ES2022`, and `strict` enabled.

::: zone-end

::: zone pivot="programming-language-python"

For a runnable example with deployment infrastructure and authentication, use the [Python managed connectors sample](https://github.com/Azure-Samples/app-service-managed-connectors/tree/main/src/python).

Install the connector SDK and web framework:

```bash
python -m pip install azure-connectors==0.5.0b1 fastapi==0.141.1 uvicorn==0.53.0
```

::: zone-end

## Connector-based triggers

A connector trigger delivers an event to your app's HTTP endpoint. For example, the Office 365 Outlook **When a new email arrives (V3)** trigger can deliver a notification to:

```http
POST https://<app-hostname>/api/webhook
```

The connector namespace requests a Microsoft Entra token by using its configured managed identity and includes the token with the callback. [App Service built-in authentication](overview-authentication-authorization.md) can validate that token before the request reaches your application.

### Configure the App Service destination

First, implement the receiving route and [configure receiving-app authentication](#authenticate-callbacks-to-your-app). Then, in the [Managed Connectors portal](https://connectors.azure.com):

1. Open your connector namespace and select **Create trigger**.
1. Choose a connector and trigger operation, and select the authenticated connection.
1. Configure the event filters. For these Outlook examples, set **Subject Filter** to `[connector-pivots]` and turn off **Split messages into individual messages** under **Batch Settings**. The code expects a batch in `body.value`.
1. For **Destination type**, select **App Service**, and select your existing web app.
1. Set **Route path** to `/api/webhook`, or to the route implemented by your app.
1. Configure the connector namespace managed identity for the callback and enter the Microsoft Entra **Audience** expected by your app. This value must match an allowed audience in the receiving app's authentication configuration.
1. Create the trigger.

The trigger configuration records the App Service destination, route, identity, and audience. You don't need to choose a generic HTTP destination and manually assemble the callback URL.

> [!IMPORTANT]
> The trigger wizard configures the connector side of the callback. It doesn't create or update the receiving app's authentication settings. Configure and verify that trust separately before accepting connector events.

### Receive an event in your app

The following example receives an Outlook trigger payload and logs only the number of messages received. It doesn't log email subjects, bodies, or sender addresses.

> [!IMPORTANT]
> This code relies on built-in authentication to validate the caller. The route isn't protected by the code itself. Complete the [authentication configuration](#authenticate-callbacks-to-your-app) before exposing it in Azure.

::: zone pivot="programming-language-csharp"

In `Program.cs`, deserialize the typed Outlook payload:

```csharp
using System.Text.Json;
using Azure.Connectors.Sdk.Office365.Models;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPost("/api/webhook", async (
    HttpRequest request,
    ILoggerFactory loggerFactory,
    CancellationToken cancellationToken) =>
{
    var logger = loggerFactory.CreateLogger("ConnectorWebhook");
    Office365OnNewEmailTriggerPayload? payload;

    try
    {
        payload = await request.ReadFromJsonAsync<Office365OnNewEmailTriggerPayload>(
            new JsonSerializerOptions(JsonSerializerDefaults.Web),
            cancellationToken);
    }
    catch (JsonException ex)
    {
        logger.LogWarning(ex, "Unable to deserialize the connector payload.");
        return Results.BadRequest();
    }

    if (payload?.Body?.Value is not { } emails)
    {
        logger.LogWarning("The connector payload doesn't contain an email collection.");
        return Results.BadRequest();
    }

    logger.LogInformation("Received {Count} email events.", emails.Count);
    return Results.Ok();
});

app.Run();
```

::: zone-end

::: zone pivot="programming-language-javascript"

In `server.js`, receive the callback with Express:

```javascript
import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.post("/api/webhook", async (request, response) => {
  const emails = request.body?.body?.value;
  if (!Array.isArray(emails) || emails.some(email =>
    !email || typeof email.id !== "string" || !email.id.trim() ||
    typeof email.subject !== "string")) {
    console.warn("Invalid connector payload.");
    return response.status(400).json({ error: "Invalid connector payload" });
  }
  console.info(`Received ${emails.length} email events.`);
  return response.json({ received: emails.length });
});

app.use((error, _request, response, _next) => {
  console.error("Request failed:", error.name);
  const status = error.type === "entity.parse.failed" ? 400 :
    error.type === "entity.too.large" ? 413 : 502;
  response.status(status).json({ error: "Request processing failed" });
});

app.listen(Number(process.env.PORT || 8080), "0.0.0.0");
```

Start the app with `node server.js`.

::: zone-end

::: zone pivot="programming-language-typescript"

In `server.ts`, validate the incoming JSON before using it:

```typescript
import express, { type ErrorRequestHandler } from "express";

type Email = { id: string; subject: string };
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function isEmail(value: unknown): value is Email {
  return isRecord(value) && typeof value.id === "string" &&
    value.id.trim().length > 0 && typeof value.subject === "string";
}

const app = express();
app.use(express.json({ limit: "1mb" }));
app.post("/api/webhook", async (request, response) => {
  const payload: unknown = request.body;
  const emails = isRecord(payload) && isRecord(payload.body)
    ? payload.body.value : undefined;
  if (!Array.isArray(emails) || !emails.every(isEmail)) {
    console.warn("Invalid connector payload.");
    return response.status(400).json({ error: "Invalid connector payload" });
  }
  console.info(`Received ${emails.length} email events.`);
  return response.json({ received: emails.length });
});

const onError: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  const type = isRecord(error) ? error.type : undefined;
  console.error("Request failed:", error instanceof Error ? error.name : "UnknownError");
  response.status(type === "entity.parse.failed" ? 400 :
    type === "entity.too.large" ? 413 : 502)
    .json({ error: "Request processing failed" });
};
app.use(onError);
app.listen(Number(process.env.PORT || 8080), "0.0.0.0");
```

Compile the app and run the generated `server.js` file with Node.js.

::: zone-end

::: zone pivot="programming-language-python"

In `main.py`, receive the callback with FastAPI:

```python
import json
import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("connector")
app = FastAPI()


@app.post("/api/webhook")
async def webhook(request: Request):
    try:
        payload = await request.json()
    except json.JSONDecodeError:
        logger.warning("Invalid connector JSON.")
        return JSONResponse(status_code=400, content={"error": "Invalid JSON"})
    body = payload.get("body") if isinstance(payload, dict) else None
    emails = body.get("value") if isinstance(body, dict) else None
    if not isinstance(emails, list) or any(
        not isinstance(email, dict)
        or not isinstance(email.get("id"), str)
        or not email["id"].strip()
        or not isinstance(email.get("subject"), str)
        for email in emails
    ):
        logger.warning("Invalid connector payload.")
        return JSONResponse(status_code=400, content={"error": "Invalid connector payload"})
    logger.info("Received %s email events.", len(emails))
    return {"received": len(emails)}
```

Use `python -m uvicorn main:app --host 0.0.0.0 --port 8000` as the App Service startup command.

::: zone-end

Use the payload model for the operation you configured; different triggers have different payloads. The connector runtime expects a timely successful HTTP response to acknowledge delivery. In a processing application, acknowledge only after processing succeeds or the event is durably accepted for later processing. Design side effects to tolerate repeated delivery rather than assuming each event arrives only once.

## Authentication

Keep the three authentication relationships separate:

| Connection | Authentication responsibility |
|---|---|
| Connector namespace to App Service callback | The namespace presents a managed-identity token. The receiving app validates and authorizes that identity. |
| App Service app to connector actions | The app uses its own identity to access the connection runtime endpoint. Grant that identity access to each connection it calls. |
| Connector namespace to the external service | The connection stores and manages the service-specific authentication, such as an OAuth connection to a Microsoft 365 account. |

Managed identity on the first two connections doesn't mean that the external service itself uses managed identity.

### Authenticate callbacks to your app

To authenticate connector callbacks, configure App Service built-in authentication with a Microsoft Entra app registration. The following `authsettingsV2` settings require authenticated requests and restrict access to the connector namespace identity:

| Setting | Purpose |
|---|---|
| `platform.enabled` | Enable built-in authentication. |
| `globalValidation.requireAuthentication` | Require authentication before a request reaches the app. |
| `globalValidation.unauthenticatedClientAction` | Set to `Return401` so unauthenticated callbacks receive HTTP 401 instead of a sign-in redirect. |
| `identityProviders.azureActiveDirectory.enabled` | Enable Microsoft Entra token validation. |
| `registration.clientId` | Identify the receiving app's Microsoft Entra app registration. |
| `registration.openIdIssuer` | Specify the Microsoft Entra issuer for your tenant. |
| `validation.allowedAudiences` | Accept the app registration's client ID and identifier URI, matching the audience requested by the connector. |
| `validation.defaultAuthorizationPolicy.allowedPrincipals.identities` | Allow the object (principal) ID of the connector namespace's managed identity. This check restricts callers by the token's `oid` claim. |

The `registration` and `validation` settings in this table are under `identityProviders.azureActiveDirectory`.

Built-in authentication validates the token's signature, issuer, audience, and expiration. The allowed-principal policy then limits access to the configured namespace identity. With this configuration, unauthenticated requests receive HTTP 401, and an otherwise valid token from a principal outside the allow list receives HTTP 403.

For configuration details, see [Configure Microsoft Entra authentication](configure-authentication-provider-aad.md) and [Use a built-in authorization policy](configure-authentication-provider-aad.md#use-a-built-in-authorization-policy).

To let built-in authentication use a client assertion instead of a stored client secret, configure a federated identity credential between the web app's user-assigned managed identity and the app registration. This web app identity is distinct from the namespace identity authorized to send callbacks. See [Use a managed identity instead of a secret](configure-authentication-provider-aad.md#use-a-managed-identity-instead-of-a-secret).

> [!IMPORTANT]
> This configuration requires authentication across the entire web app, not just `/api/webhook`, and restricts access to the connector identity. Review the effect on existing users, API clients, and health endpoints before applying this configuration to an existing app. Don't copy it unchanged into an app that must also accept other callers.

### Authorize access to connections

For outbound actions, [assign a managed identity to your App Service app](overview-managed-identity.md) and grant its principal access through a connection access policy on each connection it calls. For example, an app that flags Outlook email and posts Teams messages needs access to both connections.

The namespace's trigger identity also needs an access policy on the connection used by the trigger. Granting the web app access doesn't grant access to the trigger identity, or vice versa.

Configure the external account's authentication on the connection itself. For example, an Outlook connection requires OAuth sign-in to the mailbox account. See [Create reusable connections](../connector-namespace/create-connector-namespace-connection.md).

## Use connector actions in your code

Connector SDK clients use the runtime URL of a connection and an identity authorized to access it. These clients are the same clients used by Functions, but they don't use a Functions binding.

Set `OFFICE365_CONNECTION_RUNTIME_URL` to the Outlook connection's HTTPS runtime URL, not the callback URL or the namespace's Azure resource ID. Set `AZURE_CLIENT_ID` to the web app's user-assigned managed identity client ID and `TEST_SUBJECT_PREFIX` to `[connector-pivots]`. Supply these values as [App Service app settings](configure-common.md#configure-app-settings).

The following examples flag only messages whose subjects start with the test prefix. The trigger's subject filter reduces delivered events. The additional application check prevents an unrelated message in a batch from being modified. Use a test mailbox.

::: zone pivot="programming-language-csharp"

For example, add the following namespaces and registrations to the preceding ASP.NET Core example. Place the `using` directives at the top of `Program.cs` and the registrations before `builder.Build()`:

```csharp
using Azure.Core;
using Azure.Identity;
using Azure.Connectors.Sdk.Office365;

var runtimeUrl = builder.Configuration["OFFICE365_CONNECTION_RUNTIME_URL"];
if (!Uri.TryCreate(runtimeUrl, UriKind.Absolute, out var connectionUri) ||
    connectionUri.Scheme != Uri.UriSchemeHttps)
{
    throw new InvalidOperationException(
        "Set OFFICE365_CONNECTION_RUNTIME_URL to the connection's HTTPS runtime URL.");
}

var clientId = builder.Configuration["AZURE_CLIENT_ID"];
var prefix = builder.Configuration["TEST_SUBJECT_PREFIX"];
if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(prefix))
{
    throw new InvalidOperationException("Set AZURE_CLIENT_ID and TEST_SUBJECT_PREFIX.");
}
var credential = new ManagedIdentityCredential(
    ManagedIdentityId.FromUserAssignedClientId(clientId));

builder.Services.AddSingleton<TokenCredential>(credential);
builder.Services.AddSingleton(sp => new Office365Client(
    connectionUri,
    sp.GetRequiredService<TokenCredential>()));
```

Add an `Office365Client office365Client` parameter to the callback handler and replace its final log-and-return statements with:

```csharp
if (emails.Any(email => string.IsNullOrWhiteSpace(email?.MessageId) || email.Subject is null))
{
    logger.LogWarning("Invalid email ID or subject.");
    return Results.BadRequest();
}

var flagged = 0;
foreach (var email in emails)
{
    if (!email.Subject.StartsWith(prefix, StringComparison.Ordinal))
        continue;
    await office365Client.FlagAsync(
        messageId: email.MessageId,
        input: new UpdateEmailFlag { Flag = new { flagStatus = "flagged" } },
        originalMailboxAddress: null,
        cancellationToken: cancellationToken);
    flagged++;
}

logger.LogInformation("connector_processed received={Received} flagged={Flagged}", emails.Count, flagged);
return Results.Ok(new { received = emails.Count, flagged });
```

::: zone-end

::: zone pivot="programming-language-javascript"

Add these imports and initialize a client before registering the callback route:

```javascript
import { ManagedIdentityTokenProvider } from "@azure/connectors";
import { Office365Client } from "@azure/connectors/generated/Office365Extensions";

function required(name) {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`Missing required setting: ${name}`);
  return value;
}
const runtimeUrl = new URL(required("OFFICE365_CONNECTION_RUNTIME_URL"));
if (runtimeUrl.protocol !== "https:") throw new Error("Connection URL must use HTTPS.");
const prefix = required("TEST_SUBJECT_PREFIX");
const client = new Office365Client(
  runtimeUrl.href, new ManagedIdentityTokenProvider(required("AZURE_CLIENT_ID")),
);
```

Replace the callback's final log-and-return statements with:

```javascript
let flagged = 0;
for (const email of emails) {
  if (!email.subject.startsWith(prefix)) continue;
  await client.flagAsync({ flag: { flagStatus: "flagged" } }, email.id);
  flagged++;
}
console.info(JSON.stringify({ event: "connector_processed", received: emails.length, flagged }));
return response.json({ received: emails.length, flagged });
```

::: zone-end

::: zone pivot="programming-language-typescript"

Add these imports and initialize a client before registering the callback route:

```typescript
import { ManagedIdentityTokenProvider } from "@azure/connectors";
import { Office365Client } from "@azure/connectors/generated/Office365Extensions";

function required(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) throw new Error(`Missing required setting: ${name}`);
  return value;
}
const runtimeUrl = new URL(required("OFFICE365_CONNECTION_RUNTIME_URL"));
if (runtimeUrl.protocol !== "https:") throw new Error("Connection URL must use HTTPS.");
const prefix = required("TEST_SUBJECT_PREFIX");
const client = new Office365Client(
  runtimeUrl.href, new ManagedIdentityTokenProvider(required("AZURE_CLIENT_ID")),
);
```

Replace the callback's final log-and-return statements with:

```typescript
let flagged = 0;
for (const email of emails) {
  if (!email.subject.startsWith(prefix)) continue;
  await client.flagAsync({ flag: { flagStatus: "flagged" } }, email.id);
  flagged++;
}
console.info(JSON.stringify({ event: "connector_processed", received: emails.length, flagged }));
return response.json({ received: emails.length, flagged });
```

::: zone-end

::: zone pivot="programming-language-python"

Add these imports and replace `app = FastAPI()` with a lifespan that manages the connector client:

```python
import os
from contextlib import asynccontextmanager
from urllib.parse import urlparse

from azure.connectors.office365 import Office365Client, UpdateEmailFlag
from azure.connectors.sdk import ManagedIdentityTokenProvider


def required(name: str) -> str:
    value = os.environ.get(name)
    if not value or not value.strip():
        raise ValueError(f"Missing required setting: {name}")
    return value


@asynccontextmanager
async def lifespan(app: FastAPI):
    runtime_url = required("OFFICE365_CONNECTION_RUNTIME_URL")
    parsed = urlparse(runtime_url)
    if parsed.scheme != "https" or not parsed.hostname:
        raise ValueError("Connection URL must use HTTPS.")
    app.state.prefix = required("TEST_SUBJECT_PREFIX")
    provider = ManagedIdentityTokenProvider(client_id=required("AZURE_CLIENT_ID"))
    async with Office365Client(runtime_url, provider) as client:
        app.state.client = client
        yield


app = FastAPI(lifespan=lifespan)
```

Replace the callback's final log-and-return statements with:

```python
flagged = 0
for email in emails:
    if not email["subject"].startswith(request.app.state.prefix):
        continue
    await request.app.state.client.flag_async(
        input=UpdateEmailFlag(flag={"flagStatus": "flagged"}),
        message_id=email["id"],
    )
    flagged += 1
logger.info("connector_processed received=%s flagged=%s", len(emails), flagged)
return {"received": len(emails), "flagged": flagged}
```

Keep this code indented inside the callback. An unhandled connector failure produces a server error rather than acknowledging successful processing.

::: zone-end

Don't catch connector failures and return successful delivery. Choose an explicit retry and error-handling strategy, including how to handle a batch in which earlier actions succeeded. Setting the same Outlook flag again is idempotent. Other actions might require deduplication.

SDK actions aren't limited to connector callbacks: your app can also call them from other application logic.

## Key scenarios

| Pattern | Example |
|---|---|
| Event to action | Receive an event from one service and use a connector action to update another. |
| Event to enrichment to action | Receive an email, look up the sender, and post a Teams notification with the additional context. |
| Event to document processing to action | Receive a file event, retrieve the file with a connector action, analyze its contents in your application, and notify a team. |
| Event to AI to action | Send event data to an AI service, apply your application's decision rules, and write the result back through a connector. |

For an example that combines these patterns, see the [.NET email-triage sample](https://github.com/Azure-Samples/app-service-connectors-net-e2e-email-users-teams), which enriches incoming Outlook email with sender information and posts a Teams notification.

## Relationship to other integration options

| Option | When to choose it |
|---|---|
| App Service with managed connectors | Add SaaS event processing and connector actions to an existing web app or API while retaining its framework, routes, deployment, and monitoring. |
| [Azure Functions with managed connectors](../azure-functions/functions-connectors-overview.md) | Use the Functions connector-trigger binding alongside other Functions triggers, bindings, and event-driven hosting options. |
| [Azure Logic Apps](../logic-apps/logic-apps-overview.md) | Orchestrate connector operations in a workflow designer, with little custom code between steps. |
| Direct service APIs and SDKs | Use operations that a connector doesn't expose, or retain protocol-level control and manage service authentication and event subscriptions yourself. |

Connectors complement existing [App Service connectivity options](tutorial-connect-overview.md). You can continue to use direct service SDKs and managed identities for other parts of your app.

## Limitations and development considerations

- Create triggers and manage connections in the Managed Connectors portal, not the App Service portal.
- Configure receiving-app authentication separately. Selecting App Service as a destination doesn't establish trust on the web app.
- Verify that the selected connector and operation support your scenario. The Outlook examples in this article don't imply support for every connector or trigger type.
- Built-in authentication runs in Azure, not in your local web server. Local HTTP requests don't test the deployed authentication policy. The managed-identity action examples require Azure hosting; local action calls need a separately configured developer credential authorized for the connection.
- Verify authentication and processing separately after deployment. An unauthenticated POST to the callback should receive HTTP 401 with the authentication configuration described in this article. Then generate a real source event and check the trigger result, application logs, and downstream effects.

## Next steps

- [Deploy the C#, JavaScript, TypeScript, and Python managed connectors samples](https://github.com/Azure-Samples/app-service-managed-connectors).
- [Deploy the App Service email-triage sample](https://github.com/Azure-Samples/app-service-connectors-net-e2e-email-users-teams).
- [Create a connector namespace](../connector-namespace/create-connector-namespace.md).
- [Create a reusable connection](../connector-namespace/create-connector-namespace-connection.md).
- [Configure Microsoft Entra authentication for App Service](configure-authentication-provider-aad.md).
- [Use managed connectors in Azure Functions](../azure-functions/functions-connectors-overview.md).
