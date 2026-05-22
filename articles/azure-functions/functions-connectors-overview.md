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
#Customer intent: As a developer, I want to understand how Azure Functions uses managed connectors so that I can choose connector-based triggers and SDK actions instead of writing my own webhook plumbing and SaaS API clients.
---

# Use connectors in Azure Functions

Azure Functions integrates with the managed connectors platform that backs Logic Apps and Power Platform, giving your functions first-class access to more than 1,400 connectors for SaaS and line-of-business systems. Functions adds a connector-based trigger model and a connector SDK so you receive external events and call connector operations from function code in the same app. You write the business logic; the connector platform handles webhook registration, OAuth flows, token refresh, and retry.

> [!NOTE]
> Connectors in Azure Functions are in public preview. Use of this feature is subject to the [supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Overview

Connectors extend the Azure Functions programming model with two capabilities that target external services:

- **Connector triggers** — A function runs when an event occurs in an external service, such as a new email in Office 365, a file added to SharePoint or OneDrive, or a message posted to Microsoft Teams. The trigger uses a generic `ConnectorTrigger` binding and resolves to a trigger configuration that lives in a Connector Namespace resource.
- **Connector SDK actions** — Function code calls connector operations through strongly-typed clients for the curated SDK connectors (Office 365 Outlook, Office 365 Users, Teams, SharePoint, OneDrive, Microsoft Graph). Other connectors are reachable through a dynamic payload model.

A single function app combines connector triggers and actions with the bindings you already use, including HTTP, timer, queue, Service Bus, Event Grid, and Durable Functions.

> [!IMPORTANT]
> The Connector Namespace is a separate Azure resource owned by the connectors platform. It hosts connector trigger configurations and outbound connections, and it manages authentication to SaaS systems. This article describes how Functions consumes that resource. For the resource model itself, see [Azure connectors overview](/azure/connectors/overview) and [Connector Namespace](/azure/connectors/connector-namespace).

The preview has the following availability:

- **Region for the Connector Namespace** — West Central US (`westcentralus`). Your function app can be deployed in any region that supports the chosen hosting plan.
- **Languages** — .NET 10 and .NET 8 isolated worker, Python 3.13+, and Node.js 22+. Java, PowerShell, and Go are not yet supported.
- **Hosting plans** — Flex Consumption (recommended), Premium, Dedicated (App Service plan), and Azure Container Apps.
- **Pricing** — Standard Azure Functions pricing applies. There is no additional charge for the connector trigger or SDK during preview. The Connector Namespace resource has its own billing.

## When to use connectors

Use connectors when the integration shape, not raw code, dominates the workload. The following statements describe scenarios where connectors in Functions are the right fit:

- You react to events in SaaS systems — new emails, calendar invites, files, list items, Teams activity — and you want to skip writing webhook registration, validation handshakes, and OAuth refresh.
- Your function code already calls Microsoft 365 or third-party SaaS APIs through hand-rolled HTTP clients, and the connection sprawl (secrets, scopes, retry policy) is becoming a maintenance burden.
- You are extending an event-driven app that already runs on Functions and you want SaaS triggers in the same project, deployment pipeline, and observability stack.
- You are building agentic workflows where a function receives an event, reasons with an AI model, and then acts back into a SaaS system through a connector operation.
- You need code-first control over the orchestration — branching, custom auth between steps, reuse of existing .NET, Python, or Node.js libraries — but want connectors to own the inbound and outbound integration.

If the workload is pure orchestration across connectors with no custom code, Logic Apps Standard remains the more direct choice. See [Relationship to other Azure integration options](#relationship-to-other-azure-integration-options).

## Connector-based triggers

A connector-based trigger fires your function when an event occurs in an external service. Functions exposes a single `ConnectorTrigger` binding that targets any connector; the binding resolves to a trigger configuration in your Connector Namespace, and the platform delivers the event to your function app over HTTPS.

> [!TIP]
> Use the Flex Consumption plan for connector-triggered functions during preview. Flex Consumption provides per-instance scale and managed identity support that aligns with the connector platform's authentication model.

A request from the Connector Namespace to your function app carries the event payload and a set of `x-ms-*` headers that identify the trigger configuration, the connection, the event type, and a correlation ID. When the connector has SDK support, the runtime deserializes the payload into a strongly-typed model from the connector extension package. Other connectors deliver the payload as a dynamic object that your code reads by property name.

The platform authenticates each callback to your function app in one of two ways:

- **System key** — The Connector Namespace stores the system key issued by the function app's connector extension and presents it in the callback URL. This mode is the default and requires no identity configuration.
- **Managed identity** — A user-assigned managed identity on the Connector Namespace trigger configuration mints an Entra ID bearer token. App Service built-in authentication validates the token's signature, issuer, audience, and `allowedPrincipals.identities` claim before the request reaches your function. This mode produces a secret-free path from the Connector Namespace to your function app.

The following example shows a .NET isolated function that runs when a new email arrives in an Office 365 Outlook mailbox. The `ConnectorTrigger` attribute, payload model, and result types come from the `Microsoft.Azure.Functions.Worker.Extensions.Connector` package.

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.Connector;
using Microsoft.Extensions.Logging;

public class NewEmailFunction
{
    private readonly ILogger<NewEmailFunction> _logger;

    public NewEmailFunction(ILogger<NewEmailFunction> logger) => _logger = logger;

    [Function(nameof(NewEmailFunction))]
    public ConnectorTriggerResult Run(
        [ConnectorTrigger(
            connectorNamespace: "%ConnectorNamespace%",
            triggerConfig: "%NewEmailTriggerConfig%")]
        NewEmailPayload email)
    {
        _logger.LogInformation(
            "Received email {Id} from {From} with subject '{Subject}'.",
            email.MessageId, email.From, email.Subject);

        return ConnectorTriggerResult.Acknowledged();
    }
}
```

The `ConnectorNamespace` and `NewEmailTriggerConfig` application settings point the binding at the trigger configuration created in the Connector Namespace. You create the trigger configuration once per deployment using the `az connector-namespace trigger-config create` command or the corresponding Bicep resource; this is part of the connector platform surface and is documented in the connectors content set.

Local development uses [Microsoft Dev Tunnels](/azure/developer/dev-tunnels/overview) so the Connector Namespace can reach your function over HTTPS while the function host runs on your machine. Dev Tunnels produces a stable public URL that you register as the callback during local trigger configuration.

For trigger run history, use `az connector-namespace trigger-config run list` and `az connector-namespace trigger-config run show`. For function-app-level telemetry, the Functions runtime emits OpenTelemetry traces and metrics to Application Insights as it does for any other binding.

## Using connectors in your code

The connector SDK exposes strongly-typed clients you call directly from function code. The curated SDK set covers Office 365 Outlook, Office 365 Users, Microsoft Teams, SharePoint, OneDrive, and Microsoft Graph, and ships in `Azure.Connectors.Sdk.*` packages (one package per connector). The clients resolve connection metadata from the Connector Namespace, so your code never handles tokens, refresh, or per-call retry.

Register the clients in `Program.cs` so the worker can inject them into your functions:

```csharp
builder.Services
    .AddTeamsConnectorClient()
    .AddOffice365UsersConnectorClient()
    .AddOffice365ConnectorClient();
```

Each `Add*ConnectorClient` extension reads the namespace and connection from configuration and registers a typed client as a singleton. The function then takes the clients as constructor parameters or method parameters; the example below extends the previous trigger to enrich the sender with a user profile lookup and post a notification to Teams.

```csharp
public class NotifyOnEmail(
    ILogger<NotifyOnEmail> log,
    IOffice365UsersClient officeUsersClient,
    ITeamsClient teamsClient)
{
    [Function(nameof(NotifyOnEmail))]
    public async Task<ConnectorTriggerResult> Run(
        [ConnectorTrigger(
            connectorNamespace: "%ConnectorNamespace%",
            triggerConfig: "%NewEmailTriggerConfig%")]
        NewEmailPayload email,
        CancellationToken cancellationToken)
    {
        var profile = await officeUsersClient.UserProfileAsync(
            email.From, cancellationToken);

        await teamsClient.PostMessageAsync(
            channelId: Environment.GetEnvironmentVariable("TeamsChannelId"),
            message: $"New email from {profile.DisplayName} ({profile.JobTitle}): {email.Subject}",
            cancellationToken);

        log.LogInformation("Notified Teams for email {Id}.", email.MessageId);
        return ConnectorTriggerResult.Acknowledged();
    }
}
```

You can also call SDK clients from non-connector triggers — for example, an HTTP trigger that posts to Teams, or a timer trigger that scans a SharePoint library. The client surface is identical in both cases.

## Key scenarios

### Email-triggered processing

A function fires on each new email in a watched Office 365 Outlook folder. It classifies the message, calls the Office 365 connector to read recent messages from the same sender for enrichment, and then takes an action such as flagging the email, moving it to a folder, or notifying a Teams channel. The function never holds a refresh token; the connection in the Connector Namespace does.

### Microsoft Teams and Microsoft Graph interaction

A function reacts to Teams activity or posts cards into a channel through the Teams connector, and it looks up users with the Office 365 Users connector for in-organization checks and manager lookups. Combine the two connectors with Microsoft Graph to gate operational actions on group membership or licensing before a code path runs.

### Agentic workflows

The connector trigger model and SDK plug into the Azure Functions [serverless agents runtime](functions-serverless-agents-runtime.md). An agent function receives a SaaS event, reasons over it with a model, and uses connector SDK clients as tools to take action back in the source system or in another SaaS service. This article does not detail the agent programming model itself; see the serverless agents article for the full pattern.

## Relationship to other Azure integration options

Connectors in Azure Functions are additive. The right choice depends on how much custom code the workload needs and what authoring surface the team prefers.

**Logic Apps Standard.** If the workload is mostly orchestration across connectors and the team prefers a visual designer, use Logic Apps Standard. Logic Apps owns the low-code authoring experience for the same connector ecosystem and remains the reference product for designer-driven workflows. Choose Logic Apps when the code between steps is minimal and the value is in the orchestration.

**Azure Functions with connectors.** If the workload is code-first — custom branching, in-process libraries, integration with other Functions bindings, or AI model calls between trigger and action — use Functions with connectors. You author in .NET, Python, or Node.js, you keep the Functions deployment model and observability stack, and you avoid writing webhook plumbing and OAuth handling for the SaaS edge.

**HTTP triggers with service SDKs.** If no managed connector exists for the target system, or you need protocol-level control that the connector abstraction hides, stay on an HTTP-triggered function that calls the service SDK directly. This path keeps you responsible for auth, retry, and webhook validation, but it has no dependency on the Connector Namespace.

A single function app can combine all three patterns. You can add a connector trigger to an existing HTTP-trigger app and adopt SDK clients incrementally.

## Next steps

- [Azure Functions connectors samples (canonical index)](https://aka.ms/functions-connectors-samples)
- [End-to-end .NET sample: email → user lookup → Teams](https://github.com/Azure-Samples/functions-connectors-net-e2e-email-users-teams)
- [.NET sample: built-in authentication with managed identity](https://github.com/Azure-Samples/functions-connectors-net-builtinauth)
- [Azure connectors overview](/azure/connectors/overview)
- [Connector Namespace](/azure/connectors/connector-namespace)
- [Serverless agents runtime in Azure Functions](functions-serverless-agents-runtime.md)
