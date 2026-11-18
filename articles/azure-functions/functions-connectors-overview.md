---
title: Use managed connectors in Azure Functions
description: Learn how Azure Functions integrates with Azure Connector Namespace so that you can create managed connectors to interact with services like Office 365, Teams, and SharePoint and respond to events in these services.
ms.topic: concept-article
ms.date: 09/24/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
  - references_regions
zone_pivot_groups: programming-languages-set-functions
#Customer intent: As a developer, I want to understand how Azure Functions uses managed connectors in a connector namespace to enable connector-based triggers and SDK actions instead of writing my own webhook code and having to use service-native client SDKs.
---

# Use managed connectors in Azure Functions

By using managed connectors, your functions can react to events and call operations in services like Microsoft 365, Microsoft Teams, SharePoint, and many third-party systems without writing webhook setup code or managing OAuth tokens. Azure Functions integrates with Azure Connector Namespace to provide a trigger and an SDK that lets you focus on business logic while the connector namespace handles webhooks, authentication, and retries.

::: zone pivot="programming-language-go,programming-language-java,programming-language-powershell"

> [!NOTE]
> The Connector Trigger isn't currently supported for this language.

::: zone-end

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-typescript,programming-language-python"

<a name="connector-based-triggers"></a>

## How connectors enhance Functions

A connector namespace adds two capabilities to the Functions programming model:

- **Connector triggers**  
  A function runs when an event occurs in an external service, such as a new email in Microsoft 365, a file added to SharePoint, or a message posted to Teams. The [Connector Trigger binding](functions-bindings-connector-trigger.md) receives events from the connector namespace. For .NET isolated worker, Python, JavaScript, and TypeScript functions, you can choose polling or webhook delivery.
- **Connector SDK actions**  
  Your function code calls connector operations through [SDK clients](functions-bindings-connector.md#using-connector-sdks-in-your-code). The SDK covers managed connectors such as Microsoft 365 Outlook, Microsoft 365 Users, Teams, SharePoint, and OneDrive. Managed connectors that don't yet have SDK models are callable as HTTP endpoints.

You can use managed connectors alongside classic Functions triggers and bindings such as HTTP, timer, queue, Service Bus, Event Grid, and Durable Functions.

## Support

| Dimension | Availability |
|---|---|
| **Connector Namespace region** | Any region where [Connector Namespace](../connector-namespace/connector-namespace-overview.md) is supported. |
| **Languages** | .NET 10 and .NET 11 isolated, Python 3.13+, Node.js 24+ (JS/TS). Java, PowerShell, and Go aren't supported. |
| **Hosting plans** | [Flex Consumption](./flex-consumption-plan.md) (recommended), [Premium](./functions-premium-plan.md), [Dedicated](./dedicated-plan.md), and [Container Apps](./functions-container-apps-hosting.md). |
| **OS** | Linux-hosted function apps are supported in all regions. |
| **Pricing** | [Standard Functions pricing](https://azure.microsoft.com/pricing/details/functions/) and charges for related resources, such as Azure Storage and Application Insights, apply. Connector Namespace has separate [consumption-based pricing](../connector-namespace/connector-namespace-overview.md#pricing). |

## When to use connectors

Use connectors when your functions mainly need to interact with external services rather than run complex custom logic. Consider these ways to use managed connectors in your function apps:

- **React to external events**  
  Your app must handle events raised by externally connected services (new emails, calendar invites, files, list items, Teams activity), but you don't want to spend the effort coding webhook registrations, handshake validation, and OAuth refreshes. Consider a case where your function runs to process new emails delivered in a monitored Office 365 Outlook folder, classifies the email, calls the Office 365 connector for enrichment, and flags or moves the email. Your app performs this processing while the connector namespace manages OAuth token refreshes.

- **Replace custom service clients**   
  Your function code already calls Microsoft 365 or third-party APIs through custom HTTP clients. Managing secrets, scopes, and retry policies across many connections can quickly become a maintenance burden. Use typed connector SDK clients instead, and let managed connectors manage the connections.

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
| [Azure App Service with managed connectors](../app-service/overview-managed-connectors.md) | Adding connector events and actions to an existing web app or API. | Authenticated HTTP callbacks through your app's routes and the same connector SDK clients for outbound actions; receiving-app authentication configured separately from the trigger. |
| [HTTP triggers](./functions-bindings-http-webhook-trigger.md) with service SDKs | Cases where no managed connector exists for the targeted service or you need protocol-level controls that aren't provided by the connector. | Full control over auth, retry, and webhook validation; no requirements for a connector namespace. |

A function app can use connector triggers and direct service SDKs, and participate in Logic Apps workflows. You can add a connector trigger to an existing HTTP-trigger app and adopt SDK clients incrementally.

## Get started with managed connectors

For installation and implementation guidance, use the following references:

| Task | Reference |
| --- | --- |
| Install packages, choose a delivery mode, and configure host settings | [Connector extension overview](functions-bindings-connector.md) |
| Write a connector-triggered function and configure trigger resources, connection settings, and authentication | [Connector Trigger examples and reference](functions-bindings-connector-trigger.md) |
| Call connector operations from function code | [Using Connector SDKs in your code](functions-bindings-connector.md#using-connector-sdks-in-your-code) |

## Related articles

- [Connector extension in Azure Functions overview](functions-bindings-connector.md)
- [Connector Trigger in Azure Functions](functions-bindings-connector-trigger.md)
- [Use managed connectors in Azure App Service](../app-service/overview-managed-connectors.md)
- [Azure Functions connectors samples (canonical index)](https://aka.ms/functions-connectors-samples)
- [End-to-end .NET sample: email → user lookup → Teams](https://github.com/Azure-Samples/functions-connectors-net-e2e-email-users-teams)
- [.NET sample: built-in authentication with managed identity](https://github.com/Azure-Samples/functions-connectors-net-builtinauth)
- [Azure Functions Connector Extension repository](https://github.com/Azure/azure-functions-connector-extension)
- [Operations to Azure Functions signature mapping](https://github.com/Azure/azure-functions-connector-extension/blob/main/docs/operations-functions-match.md)
- [Azure connectors overview](/connectors/overview)
- [What is Azure Connector Namespace?](/azure/logic-apps/connector-namespace/connector-namespace-overview)
- [Azure Functions hosted skills in Azure Functions](functions-hosted-skills.md)

::: zone-end
