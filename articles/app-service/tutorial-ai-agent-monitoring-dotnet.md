---
title: Monitor a multi-agent app with OpenTelemetry and Application Insights (.NET)
description: Learn how to instrument a .NET multi-agent app on Azure App Service and apply the same OpenTelemetry GenAI monitoring pattern to an existing app in any language.
ms.service: azure-app-service
author: cephalin
ms.author: cephalin
ms.devlang: csharp
ms.topic: tutorial
ms.date: 08/26/2026
ms.custom:
  - devx-track-dotnet
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Tutorial: Monitor a multi-agent app on App Service with OpenTelemetry and Application Insights (.NET)

In this tutorial, you deploy a multi-agent travel-planner app to Azure App Service, instrument it with OpenTelemetry and the [OpenTelemetry generative AI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/), and then use the **AI** blade in App Service plus the **Agents** view in Application Insights to monitor per-agent metrics.

The sample is built with [Microsoft Agent Framework](/agent-framework/overview/agent-framework-overview) and uses [Azure OpenAI](/azure/ai-services/openai/) as the model backend. A *Coordinator* agent delegates to five specialist agents (weather, currency, budget, local knowledge, and itinerary). After you deploy and exercise the app, the per-agent telemetry rolls up automatically in the portal:

:::image type="content" source="media/tutorial-agent-monitoring-dotnet/app-service-agents-tab.png" alt-text="Screenshot of the App Service AI Agents tab showing agent names, calls, tokens, and error rate for each agent." lightbox="media/tutorial-agent-monitoring-dotnet/app-service-agents-tab.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy a multi-agent ASP.NET Core app along with an Application Insights resource and an Azure OpenAI deployment.
> * Wire up Microsoft OpenTelemetry in your app.
> * Assign stable, configuration-driven IDs to your agents.
> * Enable the OpenTelemetry GenAI semantic conventions on Microsoft Agent Framework so per-agent attributes are emitted.
> * Apply the same agent and telemetry pattern to an existing app in another language or framework.
> * View per-agent metrics in the App Service **AI** → **Agents** tab.
> * Drill into the **Agents** view in Application Insights for tool calls, token consumption, and traces.
> * Troubleshoot common reasons the Agents tab is empty.

## Prerequisites

- An Azure subscription with permissions to create App Service, Application Insights, and Azure OpenAI resources. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Quota for the `gpt-4o` model in your chosen Azure region. See [Azure OpenAI quotas and limits](/azure/ai-services/openai/quotas-limits).
- The [.NET 9 SDK](https://dotnet.microsoft.com/download).
- The [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd) version 1.10 or later.
- (Optional) The [Azure CLI](/cli/azure/install-azure-cli) for inspecting resources.

## 1. Get the sample

```bash
git clone https://github.com/Azure-Samples/multi-agent-travel-planner-dotnet.git
cd multi-agent-travel-planner-dotnet
```

The repository is laid out so the OpenTelemetry wiring and the agent definitions are easy to find:

```
.
├── azure.yaml                        # azd config (App Service host)
├── infra/                            # Bicep: App Service plan, Web App, App Insights, Azure OpenAI
└── src/MultiAgentTravelPlanner/
    ├── Program.cs                    # Microsoft OpenTelemetry configuration
    ├── Agents/AgentCatalog.cs        # Coordinator + 5 specialist agents and their IDs
    ├── Agents/ConversationStore.cs   # Per-session AgentSession storage
    ├── Tools/TravelTools.cs          # Function tools the agents call
    └── wwwroot/index.html            # Minimal chat UI
```

## 2. Deploy with azd

```bash
azd auth login
azd up
```

`azd up` prompts for an environment name, an Azure subscription, and a region. It then provisions:

- A Linux App Service plan (P0v3) and a .NET 9 web app with a system-assigned managed identity.
- A Log Analytics workspace and a workspace-based Application Insights resource. The connection string is set on the web app as `APPLICATIONINSIGHTS_CONNECTION_STRING`.
- An Azure OpenAI account with a `gpt-4o` deployment. The web app's managed identity is granted **Cognitive Services OpenAI User** on the account so the app can call the model without keys.

When deployment finishes, `azd` prints the web app URL. Open it and send 3–5 messages so there's telemetry to look at. For example:

> *Plan a 4-day trip to Lisbon in July for two people on a midrange budget. Include weather and currency notes.*

## 3. Look at the OpenTelemetry wiring

The sample wires three things to make the Agents tab work:

**a. Give each agent a stable, configurable ID.**

Use a stable logical name as the default ID, and read the effective ID from configuration. This approach keeps the ID consistent across restarts while allowing an App Service application setting to override it without a source-code change. See `Agents/AgentCatalog.cs`:

```csharp
private static AIAgent CreateAgent(
    ChatClient chat,
    IConfiguration configuration,
    string logicalName,
    string description,
    string instructions,
    IList<AITool>? tools = null)
    => chat.AsAIAgent(new ChatClientAgentOptions
    {
        Id = AgentIdConfiguration.Resolve(configuration, logicalName),
        Name = logicalName,
        Description = description,
        ChatOptions = new ChatOptions
        {
            Instructions = instructions,
            Tools = tools,
        },
    });
```

For .NET apps, double underscores in App Service application settings map to nested configuration keys. The sample uses the following convention:

| Agent | App Service application setting | Default value |
| --- | --- | --- |
| Coordinator | `Agents__Coordinator__Id` | `Coordinator` |
| WeatherAdvisor | `Agents__WeatherAdvisor__Id` | `WeatherAdvisor` |
| CurrencyConverter | `Agents__CurrencyConverter__Id` | `CurrencyConverter` |
| BudgetOptimizer | `Agents__BudgetOptimizer__Id` | `BudgetOptimizer` |
| LocalKnowledge | `Agents__LocalKnowledge__Id` | `LocalKnowledge` |
| ItineraryPlanner | `Agents__ItineraryPlanner__Id` | `ItineraryPlanner` |

Use a unique value for every agent. Don't generate a new ID each time the
application starts. The sample validates at startup that every configured ID is
nonempty and unique.

**b. Wrap each agent with `UseOpenTelemetry`.**

Microsoft Agent Framework emits `gen_ai.*` spans only when you wrap an agent with the `OpenTelemetryAgent` delegating wrapper. The easiest way is through `AsBuilder().UseOpenTelemetry(sourceName)`. See `Agents/AgentCatalog.cs`:

```csharp
private static AIAgent WithTelemetry(AIAgent agent) =>
    agent.AsBuilder()
        .UseOpenTelemetry(TelemetrySourceName, otel => otel.EnableSensitiveData = true)
        .Build();

AIAgent weather = WithTelemetry(CreateAgent(
    chat,
    configuration,
    logicalName: "WeatherAdvisor",
    description: "...",
    instructions: "...",
    tools: [AIFunctionFactory.Create(tools.GetWeatherForecast)]));
```

The agent's name ends up in the `gen_ai.agent.name` attribute and is what the Agents tab displays. Its configured ID is emitted as `gen_ai.agent.id`. `EnableSensitiveData = true` opts in to including message content in spans (off by default - set to `false` in production, or control it with the `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT` environment variable).

**c. Send telemetry to Application Insights with Microsoft OpenTelemetry and subscribe to the agent activity source.**

The `Microsoft.OpenTelemetry` package provides one configuration API for OpenTelemetry instrumentation and exporters. This tutorial enables its Azure Monitor exporter:

```bash
dotnet add package Microsoft.OpenTelemetry
```

```csharp
using Microsoft.OpenTelemetry;
using OpenTelemetry.Resources;

var appInsightsConnectionString =
    builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"];

builder.Services.AddOpenTelemetry()
    .WithTracing(t => t
        .ConfigureResource(r => r.AddService("multi-agent-travel-planner"))
        .AddSource(AgentCatalog.TelemetrySourceName)
        .AddSource("Microsoft.Extensions.AI*")
        .AddSource("OpenAI*")
        .AddSource("Experimental.OpenAI*")
        .AddSource("Azure.AI.OpenAI*"))
    .WithMetrics(m => m
        .ConfigureResource(r => r.AddService("multi-agent-travel-planner"))
        .AddMeter(AgentCatalog.TelemetrySourceName)
        .AddMeter("Microsoft.Extensions.AI*")
        .AddMeter("OpenAI*"));

builder.UseMicrosoftOpenTelemetry(options =>
{
    options.Exporters = ExportTarget.AzureMonitor;
    options.AzureMonitor.ConnectionString = appInsightsConnectionString;
});
```

The `AddSource` and `AddMeter` calls register the activity sources and meters that Microsoft Agent Framework and the underlying OpenAI SDK emit. Exporter selection is separate from agent instrumentation, so you can change or add supported telemetry destinations without redefining your agents.

Each agent's name and ID are emitted on every span as `gen_ai.agent.name` / `gen_ai.agent.id`, token usage flows through `gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens`, and tool invocations and model calls show up as `execute_tool` and chat-completion child spans.

> [!IMPORTANT]
> The Bicep template in this sample sets `ApplicationInsightsAgent_EXTENSION_VERSION=disabled` on the web app. This setting disables the App Service codeless attach for .NET so that in-process OpenTelemetry isn't competing for the same activity sources. For a .NET app that you instrument in code, disable the codeless agent.

## 4. Apply the pattern to an existing app

Adding an agent and monitoring it are two separate changes. First, connect an agent to the business functions that your application already uses. Then, instrument that agent so its activity appears in Application Insights and the App Service **Agents** tab. You don't need to replace your application or adopt the sample's multi-agent architecture.

This section combines patterns from two official Azure Samples. The [multi-agent travel-planner sample](https://github.com/Azure-Samples/multi-agent-travel-planner-dotnet) provides the stable agent identity, per-session state, and OpenTelemetry wiring used throughout this tutorial. The [App Service agentic CRUD sample](https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-ai-foundry-agent) and its [companion tutorial](tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet.md?tabs=agentframework) show how to expose existing service methods as agent tools and invoke the agent from an existing web UI. The language tabs apply those same patterns to other framework-native APIs.

1. Choose an agent framework that works with your existing model client and language stack.
1. Keep authorization and business rules in your existing service layer. Expose narrow wrappers around those functions as agent tools instead of reimplementing the rules in a prompt.
1. Register the agent through your application's startup or dependency-injection path. Give it instructions, the tools that it can use, and a stable, low-cardinality name.
1. Keep conversation state scoped to the user or session. Call the agent from an existing route, controller, background job, or user-interface action, and pass that state when the framework supports it.
1. Configure OpenTelemetry once at startup and export to the Application Insights resource connected to the App Service app.

The application structure is the same in any language:

```text
findOrder = existing application function

supportAgent = create agent(
        name = "SupportAgent",
        id = "support-agent",
        instructions = "Help customers with their orders.",
        tools = [findOrder]
)

POST /api/support:
        return supportAgent.invoke(message, existingConversationId)
```

The following tabs show both parts of the change in common App Service language stacks. The examples assume that the application already has a configured model client, an `orderService`, and a web entry point. Adapt those names to your application. The **Add the agent** block provides the application behavior; the **Add telemetry** block makes that behavior observable.

### [.NET](#tab/existing-dotnet)

#### Add the agent

Microsoft Agent Framework can turn an existing .NET method into a tool. Pass that tool to a named agent, and call the agent from an existing ASP.NET Core route:

```csharp
const string agentSource = "MyApp.Agents";

AIAgent supportAgent = chatClient.AsAIAgent(new ChatClientAgentOptions
{
        Id = "support-agent",
        Name = "SupportAgent",
        Description = "Answers customer questions about orders.",
        ChatOptions = new ChatOptions
        {
                Instructions = "Help customers understand their orders.",
                Tools = [AIFunctionFactory.Create(orderService.FindOrderAsync)],
        },
});

app.MapPost("/api/support", async (
    SupportRequest request,
    ConversationStore conversationStore,
    CancellationToken cancellationToken) =>
{
    AgentSession session = await conversationStore.GetOrCreateAsync(
        request.SessionId,
        supportAgent,
        cancellationToken);

    return await supportAgent.RunAsync(
        request.Message,
        session,
        cancellationToken: cancellationToken);
});
```

The framework generates the tool schema from `FindOrderAsync`. Keep authorization and input validation inside `orderService`, where the rest of the application can use the same rules. `ConversationStore` represents the application's per-user or per-session state store; the travel-planner sample includes a simple in-memory implementation. Use durable external storage when the application must preserve conversations across restarts or scale-out instances.

#### Add telemetry

Fold the provider registration into the existing startup code before `builder.Build()`. Wrap the agent before `app.Run()`, using the same source name in both places. Configure the Azure Monitor exporter as shown in [Look at the OpenTelemetry wiring](#3-look-at-the-opentelemetry-wiring):

```csharp
supportAgent = supportAgent.AsBuilder()
        .UseOpenTelemetry(agentSource, options => options.EnableSensitiveData = false)
        .Build();

builder.Services.AddOpenTelemetry()
        .WithTracing(tracing => tracing.AddSource(agentSource))
        .WithMetrics(metrics => metrics.AddMeter(agentSource));
```

Microsoft Agent Framework emits the agent, model, tool, token, and error telemetry.

### [Python](#tab/existing-python)

#### Add the agent

Microsoft Agent Framework for Python can use a typed Python function as a tool. The function can delegate to an existing service object:

```python
from agent_framework import Agent
from agent_framework.openai import OpenAIChatClient

async def find_order(order_id: str) -> dict:
    """Find an order by its ID."""
    return await order_service.find_order(order_id)

support_agent = Agent(
        client=OpenAIChatClient(),
        name="SupportAgent",
        id="support-agent",
        instructions="Help customers understand their orders.",
        tools=[find_order],
)

async def answer_support_question(message: str) -> str:
    response = await support_agent.run(message)
    return response.text
```

Call `answer_support_question` from the app's existing Flask, Django, FastAPI, or background-job entry point.

#### Add telemetry

Run the telemetry setup during application startup, before creating or invoking the agent:

```python
from agent_framework.observability import create_resource, enable_instrumentation
from azure.monitor.opentelemetry import configure_azure_monitor

configure_azure_monitor(resource=create_resource())
enable_instrumentation(enable_sensitive_data=False)
```

`configure_azure_monitor()` reads `APPLICATIONINSIGHTS_CONNECTION_STRING` from the App Service environment. Agent Framework emits the `invoke_agent`, model, tool, token, and error telemetry.

### [Node.js](#tab/existing-node)

#### Add the agent

The OpenAI Agents SDK can wrap an existing TypeScript or JavaScript function as a tool. Create the agent once, then call it from the app's existing request handler or job:

```typescript
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const findOrder = tool({
    name: "find_order",
    description: "Find an order by its ID.",
    parameters: z.object({ orderId: z.string() }),
    execute: async ({ orderId }) => orderService.findOrder(orderId),
});

const supportAgent = new Agent({
    name: "SupportAgent",
    instructions: "Help customers understand their orders.",
    tools: [findOrder],
});

export async function answerSupportQuestion(message: string) {
    const result = await run(supportAgent, message);
    return result.finalOutput;
}
```

#### Add telemetry

For Node.js 22 or later, Microsoft OpenTelemetry can instrument the OpenAI Agents SDK and LangChain-based frameworks. Load telemetry before importing the agent framework. For an ECMAScript module app, create a *telemetry.mjs* bootstrap file:

```javascript
import "@microsoft/opentelemetry/loader";
import { useMicrosoftOpenTelemetry } from "@microsoft/opentelemetry";

useMicrosoftOpenTelemetry({
    azureMonitor: {
        azureMonitorExporterOptions: {
            connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
        },
    },
    enableSensitiveData: false,
    instrumentationOptions: {
        langchain: { enabled: true },
        openaiAgents: { enabled: true },
    },
});
```

Preload the file in the App Service startup command so instrumentation is registered before the application and agent modules load:

```bash
node --import ./telemetry.mjs ./app.mjs
```

The `openaiAgents` instrumentation emits agent, model, tool, token, and error telemetry without changing the agent code.

### [Java](#tab/existing-java)

#### Add the agent

For example, a LangChain4j AI Service can expose an existing Java service through a narrow tool adapter. Build the AI Service once with the application's existing `ChatModel`:

```java
interface SupportAgent {
    @SystemMessage("Help customers understand their orders.")
    String answer(String message);
}

final class OrderTools {
    private final OrderService orderService;

    OrderTools(OrderService orderService) {
        this.orderService = orderService;
    }

    @Tool("Find an order by its ID.")
    Order findOrder(@P("The order ID.") String orderId) {
        return orderService.findOrder(orderId);
    }
}

SupportAgent supportAgent = AiServices.builder(SupportAgent.class)
    .chatModel(chatModel)
    .tools(new OrderTools(orderService))
    .build();

public String answerSupportQuestion(String message) {
    return supportAgent.answer(message);
}
```

Call `answerSupportQuestion` from an existing Spring controller, Jakarta REST resource, or background job.

#### Add telemetry

Configure the [Application Insights Java agent](/azure/azure-monitor/app/opentelemetry-enable?tabs=java) to export telemetry. If the selected agent framework doesn't emit GenAI spans, replace the preceding `answerSupportQuestion` method with a traced version:

```java
private static final Tracer tracer =
        GlobalOpenTelemetry.getTracer("com.contoso.myapp.agents");

public String answerSupportQuestion(String message) {
        Span span = tracer.spanBuilder("invoke_agent SupportAgent")
                .setSpanKind(SpanKind.INTERNAL)
                .setAttribute("gen_ai.operation.name", "invoke_agent")
                .setAttribute("gen_ai.agent.name", "SupportAgent")
                .setAttribute("gen_ai.agent.id", "support-agent")
                .startSpan();

        try (Scope ignored = span.makeCurrent()) {
                return supportAgent.answer(message);
            } catch (RuntimeException error) {
                span.setAttribute("error.type", error.getClass().getName());
                span.setStatus(StatusCode.ERROR);
                span.recordException(error);
                throw error;
        } finally {
                span.end();
        }
}
```

If the framework returns token usage or a conversation ID, add those values to the span before it ends. Don't estimate token counts.

-----

For another language or agent SDK, follow the same application pattern: turn existing business methods into tools, create a long-lived agent with instructions and a stable name, and call it from an existing entry point. Prefer the framework's OpenTelemetry integration if it emits the [GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md).

### Emit the telemetry contract

For the **Agents** tab, an in-process agent invocation produces an `INTERNAL` span. Use a `CLIENT` span instead when your code calls an agent hosted in a remote service. The useful minimum is:

| Span field or attribute | Value |
| --- | --- |
| Span name | `invoke_agent SupportAgent` |
| `gen_ai.operation.name` | `invoke_agent` |
| `gen_ai.agent.name` | A stable display name, such as `SupportAgent` |
| `gen_ai.agent.id` | A stable application or provider-assigned ID, such as `support-agent`, when available |
| `gen_ai.provider.name` | The convention-defined provider name, such as `azure.ai.openai`, for a remote agent `CLIENT` span |
| `gen_ai.conversation.id` | Your existing session ID, when one is available |
| `gen_ai.usage.input_tokens` | Input tokens reported by the model or agent framework |
| `gen_ai.usage.output_tokens` | Output tokens reported by the model or agent framework |
| `error.type` | A low-cardinality exception or provider error type when the call fails |

Set the operation and agent name, plus the provider name for remote calls, when the span starts so sampling decisions can use them. Add any available stable agent ID and token counts from the actual response before the span ends. Don't use a transient in-memory object ID, estimate token usage, or create a conversation ID only for telemetry.

> [!CAUTION]
> Prompt text, model responses, tool arguments, and tool results can contain personal data, credentials, or other sensitive values. The examples keep sensitive-data capture off. Enable it only when your data-handling, access, and retention policies allow it.

## 5. View per-agent metrics in App Service

1. In the [Azure portal](https://portal.azure.com), open your web app.
2. In the left navigation, select **AI**.
3. Select the **Agents** tab.

You see one row per instrumented agent (Coordinator, WeatherAdvisor, CurrencyConverter, BudgetOptimizer, LocalKnowledge, ItineraryPlanner) with calls, tokens, and error rate over the selected date range. Use the search box, agent-name, and agent-ID filters to narrow the list. Select **View logs** on any row to open Application Insights with a query scoped to that agent.

:::image type="content" source="media/tutorial-agent-monitoring-dotnet/app-service-agents-tab.png" alt-text="Screenshot of the App Service AI Agents tab populated with the six agents from this tutorial." lightbox="media/tutorial-agent-monitoring-dotnet/app-service-agents-tab.png":::

## 6. Drill into Application Insights

Select **View in Application Insights** at the top of the **Agents** tab. The **Agents** view opens in the Application Insights resource that's connected to your web app:

:::image type="content" source="media/tutorial-agent-monitoring-dotnet/app-insights-agents-view.png" alt-text="Screenshot of the Application Insights Agents view showing agent operational metrics, tool calls, models, and token consumption." lightbox="media/tutorial-agent-monitoring-dotnet/app-insights-agents-view.png":::

From here you can:

- Compare agent runs over time and see which agent has the highest error rate.
- See per-tool call counts and average durations.
- Break down token consumption by model and by input vs. output.
- Use **View Traces with Agent Runs** or **View Traces with Gen AI Errors** to jump to the underlying distributed traces.

For more information about this view, see [Agents in Application Insights](/azure/azure-monitor/app/agents-view).

## 7. Troubleshoot

If the **Agents** tab is empty or incomplete, check the following.

**No agents listed at all.**

- Confirm the web app's **Application Insights** resource is connected. Open the web app's **Application Insights** blade (under **Settings**) and verify the connection.
- Confirm `APPLICATIONINSIGHTS_CONNECTION_STRING` is present as an App Service application setting. The `azd` template sets it automatically; if you adapted the Bicep, double-check.
- Confirm the app calls `UseMicrosoftOpenTelemetry()`, enables `ExportTarget.AzureMonitor`, and registers the agent and `Microsoft.Extensions.AI` activity sources. If any are missing, agent spans aren't exported.

**Agents appear with missing, duplicate, or unexpected IDs.**

- Confirm each agent has a nonempty, unique ID.
- Check whether an `Agents__<agent-name>__Id` App Service application setting overrides the default value.
- Keep the setting name stable when you change its value so operational configuration doesn't require a source-code change.

**Agents appear but tokens or calls are zero.**

- Make sure each agent is wrapped with `UseOpenTelemetry` on its builder:

  ```csharp
  AIAgent agent = chat.AsAIAgent(...)
      .AsBuilder()
      .UseOpenTelemetry("MyAgentSource", o => o.EnableSensitiveData = true)
      .Build();
  ```

  And that the same source name is registered in the OpenTelemetry pipeline with `.WithTracing(t => t.AddSource("MyAgentSource"))`.
- The Agents tab relies on `gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens` attributes. Verify by running this query in **Logs**:

  ```kusto
  dependencies
  | where timestamp > ago(1h)
  | where customDimensions has "gen_ai.agent.name"
  | project timestamp, name, customDimensions
  | take 20
  ```

  You should see `gen_ai.agent.name`, `gen_ai.agent.id`, and `gen_ai.usage.*` keys in `customDimensions`.

**Errors say `AuthenticationFailed` against Azure OpenAI.**

- The web app's system-assigned managed identity needs the **Cognitive Services OpenAI User** role on the Azure OpenAI account. The Bicep in `infra/modules/roles.bicep` assigns it. If you deployed elsewhere, assign the role manually.

**Sampling is dropping data.**

- The Azure Monitor exporter applies adaptive sampling by default. If you're testing with low volume and rows are missing, temporarily configure its sampling ratio to `1.0`.

## 8. Clean up resources

```bash
azd down --purge
```

This deletes the resource group, the App Service, the Application Insights resource, and the Azure OpenAI account (including soft-deleted Azure OpenAI accounts, which is why `--purge` is recommended).

## Related content

- [Build agentic web applications](scenario-ai-agentic-web-apps.md)
- [Add agentic capabilities to an existing App Service app (.NET)](tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet.md?tabs=agentframework)
- [Multi-agent travel-planner sample](https://github.com/Azure-Samples/multi-agent-travel-planner-dotnet)
- [App Service agentic CRUD sample](https://github.com/Azure-Samples/app-service-agentic-semantic-kernel-ai-foundry-agent)
- [Microsoft Agent Framework documentation](/agent-framework/overview/agent-framework-overview)
- [Microsoft OpenTelemetry for .NET](https://github.com/microsoft/opentelemetry-distro-dotnet)
- [OpenTelemetry generative AI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Agents in Application Insights](/azure/azure-monitor/app/agents-view)
