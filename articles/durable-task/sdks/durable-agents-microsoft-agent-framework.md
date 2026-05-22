---
title: "Durable Task Extension for Microsoft Agent Framework"
description: Use the Durable Task extension for Microsoft Agent Framework to build fault-tolerant AI agents with persistent sessions and automatic checkpointing. Get started now.
author: greenie-msft
ms.topic: conceptual
ms.date: 05/04/2026
ms.author: nigreenf
zone_pivot_groups: agent-framework-approach
---

# Durable Task extension for Microsoft Agent Framework

The [Durable Task extension for Microsoft Agent Framework](/agent-framework/integrations/azure-functions) brings [durable execution](./durable-task-for-ai-agents.md) directly into the [Microsoft Agent Framework](/agent-framework/). You can register agents with the extension to make them automatically durable with persistent sessions, built-in API endpoints, and distributed scaling — without changes to your agent logic.

## When to use durable agents

Choose the Durable Task extension when you need:

- **Persistent conversation state** — Agent sessions survive process crashes, restarts, and scaling events without losing context.
- **Multi-agent orchestration** — Coordinate specialized agents in deterministic workflows with automatic checkpointing and failure recovery.
- **Long-running workflows** — Support human-in-the-loop approvals or timed waits that can last hours, days, or weeks without consuming compute resources.
- **Scalable, serverless hosting** — Scale to thousands of concurrent agent sessions (or to zero) on the Azure Functions Flex Consumption plan.

If you don't need durable state or multi-agent coordination, a standard [Microsoft Agent Framework](/agent-framework/) agent without the extension may be sufficient.

> [!TIP]
> For a step-by-step walkthrough including local setup, prerequisites, and deployment, see the [tutorial on Microsoft Learn](/agent-framework/integrations/azure-functions#tutorial-create-and-run-a-durable-agent).

## Architecture

The extension internally implements [entity-based agent loops](./durable-agents-patterns.md#entity-based-agent-loops), where each agent session is a durable entity that automatically manages conversation state and checkpointing.

The extension supports two hosting approaches:

- **Azure Functions** using the Azure Functions integration package.
- **Bring your own compute** using the base package.

## Agent hosting

Define your agent using the standard Microsoft Agent Framework pattern, then enhance it with the Durable Task extension. The extension handles session persistence, endpoint creation, and state management automatically.

::: zone pivot="azure-functions"

# [C#](#tab/csharp)

```csharp
var endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT")
    ?? throw new InvalidOperationException("AZURE_OPENAI_ENDPOINT is not set.");
var deploymentName = Environment.GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT")
    ?? "gpt-4o-mini";

// Create an AI agent using the Microsoft Agent Framework pattern
AIAgent agent = new AIProjectClient(new Uri(endpoint), new DefaultAzureCredential())
    .AsAIAgent(
        model: deploymentName,
        instructions: "You are a professional content writer who creates engaging, "
                    + "well-structured documents for any given topic.",
        name: "DocumentPublisher");

// One line to make the agent durable with serverless hosting
using IHost app = FunctionsApplication
    .CreateBuilder(args)
    .ConfigureFunctionsWebApplication()
    .ConfigureDurableAgents(options => options.AddAIAgent(agent))
    .Build();
app.Run();
```

# [Python](#tab/python)

```python
import os
from agent_framework.azure import FoundryChatClient, AgentFunctionApp
from azure.identity import DefaultAzureCredential

endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT") or "gpt-4o-mini"

client = FoundryChatClient(
    endpoint=endpoint,
    credential=DefaultAzureCredential()
)

agent = client.as_agent(
    model=deployment_name,
    instructions="You are a professional content writer who creates engaging, "
                 "well-structured documents for any given topic.",
    name="DocumentPublisher"
)

# One line to make the agent durable with serverless hosting
app = AgentFunctionApp(agents=[agent])
```

---

::: zone-end

::: zone pivot="other-compute"

# [C#](#tab/csharp)

```csharp
var endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT")
    ?? throw new InvalidOperationException("AZURE_OPENAI_ENDPOINT is not set.");
var deploymentName = Environment.GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT")
    ?? "gpt-4o-mini";

// Create an AI agent using the Microsoft Agent Framework pattern
AIAgent agent = new AIProjectClient(new Uri(endpoint), new DefaultAzureCredential())
    .AsAIAgent(
        model: deploymentName,
        instructions: "You are a professional content writer who creates engaging, "
                    + "well-structured documents for any given topic.",
        name: "DocumentPublisher");

// Host the agent with Durable Task Scheduler
string connectionString = "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None";

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.ConfigureDurableAgents(
            options => options.AddAIAgent(agent),
            workerBuilder: builder => builder.UseDurableTaskScheduler(connectionString),
            clientBuilder: builder => builder.UseDurableTaskScheduler(connectionString));
    })
    .Build();

await host.StartAsync();
```

# [Python](#tab/python)

```python
from agent_framework.azure import FoundryChatClient, DurableAIAgentWorker
from azure.identity import AzureCliCredential
from durabletask.azuremanaged.worker import DurableTaskSchedulerWorker

endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT") or "gpt-4o-mini"

client = FoundryChatClient(endpoint=endpoint, credential=AzureCliCredential())

agent = client.as_agent(
    model=deployment_name,
    name="DocumentPublisher",
    instructions="You are a professional content writer who creates engaging, "
                 "well-structured documents for any given topic.",
)

# Create a worker connected to the Durable Task Scheduler
worker = DurableTaskSchedulerWorker(
    host_address="http://localhost:8080",
    secure_channel=False,
    taskhub="default",
)

# Register the agent and start processing
agent_worker = DurableAIAgentWorker(worker)
agent_worker.add_agent(agent)
worker.start()
```

---

::: zone-end

> [!NOTE]
> The C# examples use `AIProjectClient` from the `Azure.AI.Projects` package, which is the recommended pattern for new projects. The Python examples use `FoundryChatClient` from `agent_framework.azure`. Both clients support the `.AsAIAgent()` / `.as_agent()` extension that integrates with the Durable Task extension. See the [samples on GitHub](#related-links) for the latest package references.

## Multi-agent orchestration with durable checkpointing

You can coordinate multiple specialized agents as steps in a durable orchestration. Each agent call is checkpointed, and the orchestration recovers automatically if any step fails. Completed agent calls aren't re-executed on recovery.

Use `context.GetAgent()` (C#) or `app.get_agent()` (Python) to retrieve registered agents inside an orchestration. The returned `DurableAIAgent` wrapper ensures calls are tracked and checkpointed by the framework.

The following example shows a sequential multi-agent workflow where a research agent gathers information and a writer agent produces a document.

::: zone pivot="azure-functions"

# [C#](#tab/csharp)

```csharp
[Function(nameof(DocumentPublishingOrchestration))]
public async Task<string> DocumentPublishingOrchestration(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var docRequest = context.GetInput<DocumentRequest>();

    DurableAIAgent researchAgent = context.GetAgent("ResearchAgent");
    DurableAIAgent writerAgent = context.GetAgent("DocumentPublisherAgent");

    // Step 1: Research the topic
    AgentResponse<ResearchResult> researchResult = await researchAgent
        .RunAsync<ResearchResult>(
            $"Research the following topic: {docRequest.Topic}");

    // Step 2: Write the document using the research findings
    AgentResponse<DocumentResponse> document = await writerAgent
        .RunAsync<DocumentResponse>(
            $"""Create a document about {docRequest.Topic}.
            Research findings: {researchResult.Result.Findings}""");

    // Step 3: Publish
    return await context.CallActivityAsync<string>(
        nameof(PublishDocument),
        new { docRequest.Topic, document.Result.Text });
}
```

# [Python](#tab/python)

```python
@app.orchestration_trigger(context_name="context")
def document_publishing_orchestration(context: DurableOrchestrationContext):
    doc_request = context.get_input()

    research_agent = app.get_agent(context, "ResearchAgent")
    writer_agent = app.get_agent(context, "DocumentPublisherAgent")

    research_session = research_agent.create_session()
    writer_session = writer_agent.create_session()

    # Step 1: Research the topic
    research_result = yield research_agent.run(
        messages=f"Research the following topic: {doc_request['topic']}",
        session=research_session,
    )

    # Step 2: Write the document using the research findings
    document = yield writer_agent.run(
        messages=f"""Create a document about {doc_request['topic']}.
        Research findings: {research_result.text}""",
        session=writer_session,
    )

    # Step 3: Publish
    return (yield context.call_activity("publish_document", {
        "title": doc_request["topic"],
        "content": document.text
    }))
```

---

::: zone-end

::: zone pivot="other-compute"

# [C#](#tab/csharp)

```csharp
static async Task<string> DocumentPublishingOrchestration(
    TaskOrchestrationContext context, DocumentRequest docRequest)
{
    DurableAIAgent researchAgent = context.GetAgent("ResearchAgent");
    DurableAIAgent writerAgent = context.GetAgent("DocumentPublisherAgent");

    // Step 1: Research the topic
    AgentResponse<ResearchResult> researchResult = await researchAgent
        .RunAsync<ResearchResult>(
            $"Research the following topic: {docRequest.Topic}");

    // Step 2: Write the document using the research findings
    AgentResponse<DocumentResponse> document = await writerAgent
        .RunAsync<DocumentResponse>(
            $"""Create a document about {docRequest.Topic}.
            Research findings: {researchResult.Result.Findings}""");

    // Step 3: Publish
    return await context.CallActivityAsync<string>(
        nameof(PublishDocument),
        new { docRequest.Topic, document.Result.Text });
}
```

# [Python](#tab/python)

```python
from agent_framework.azure import DurableAIAgentOrchestrationContext

def document_publishing_orchestration(ctx, doc_request: dict):
    agent_context = DurableAIAgentOrchestrationContext(ctx)

    research = agent_context.get_agent("ResearchAgent")
    writer = agent_context.get_agent("DocumentPublisherAgent")

    research_session = research.create_session()
    writer_session = writer.create_session()

    # Step 1: Research the topic
    research_result = yield research.run(
        messages=f"Research the following topic: {doc_request['topic']}",
        session=research_session,
    )

    # Step 2: Write the document using the research findings
    document = yield writer.run(
        messages=f"""Create a document about {doc_request['topic']}.
        Research findings: {research_result.text}""",
        session=writer_session,
    )

    # Step 3: Publish
    return (yield ctx.call_activity(publish_document, input={
        "title": doc_request["topic"],
        "content": document.text
    }))
```

---

::: zone-end

## Graph-based workflows with Microsoft Agent Framework

The Durable Task extension also supports [Microsoft Agent Framework workflows](/agent-framework/workflows), which use a declarative, graph-based programming model (`WorkflowBuilder`) to define multi-step pipelines of executors and agents. The extension automatically checkpoints each step in the graph and recovers from failures without changes to the workflow definition.

Workflows complement orchestrations: use orchestrations for imperative agent coordination with conditional logic, and workflows for fixed graph topologies with type-validated message routing.

### Sequential workflow

The following example chains three executors into an order cancellation workflow: look up the order, cancel it, then send a confirmation email.

::: zone pivot="azure-functions"

# [C#](#tab/csharp)

```csharp
OrderLookup orderLookup = new();
OrderCancel orderCancel = new();
SendEmail sendEmail = new();

Workflow cancelOrder = new WorkflowBuilder(orderLookup)
    .WithName("CancelOrder")
    .WithDescription("Cancel an order and notify the customer")
    .AddEdge(orderLookup, orderCancel)
    .AddEdge(orderCancel, sendEmail)
    .Build();

using IHost app = FunctionsApplication
    .CreateBuilder(args)
    .ConfigureFunctionsWebApplication()
    .ConfigureDurableWorkflows(workflows => workflows.AddWorkflows(cancelOrder))
    .Build();
app.Run();
```

The `OrderLookup`, `OrderCancel`, and `SendEmail` executors are standard [Microsoft Agent Framework executors](/agent-framework/workflows) with no Durable-specific code. For complete implementations, see the [samples on GitHub](#related-links).

# [Python](#tab/python)

```python
from agent_framework import Workflow, WorkflowBuilder, WorkflowContext, executor
from agent_framework.azure import AgentFunctionApp

@executor(id="store_email")
async def store_email(email_text: str, ctx: WorkflowContext) -> None:
    ctx.set_state("current_email", email_text)
    await ctx.send_message(email_text)

@executor(id="process_email")
async def process_email(email_text: str, ctx: WorkflowContext) -> None:
    result = f"Processed: {email_text[:50]}..."
    await ctx.send_message(result)

@executor(id="finalize")
async def finalize(result: str, ctx: WorkflowContext[None, str]) -> None:
    await ctx.yield_output(f"Complete: {result}")

workflow = (
    WorkflowBuilder(start_executor=store_email)
    .add_edge(store_email, process_email)
    .add_edge(process_email, finalize)
    .build()
)

app = AgentFunctionApp(workflow=workflow)
```

---

::: zone-end

::: zone pivot="other-compute"

```csharp
string dtsConnectionString = Environment.GetEnvironmentVariable("DURABLE_TASK_SCHEDULER_CONNECTION_STRING")
    ?? "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None";

OrderLookup orderLookup = new();
OrderCancel orderCancel = new();
SendEmail sendEmail = new();

Workflow cancelOrder = new WorkflowBuilder(orderLookup)
    .WithName("CancelOrder")
    .WithDescription("Cancel an order and notify the customer")
    .AddEdge(orderLookup, orderCancel)
    .AddEdge(orderCancel, sendEmail)
    .Build();

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.ConfigureDurableWorkflows(
            workflowOptions => workflowOptions.AddWorkflow(cancelOrder),
            workerBuilder: builder => builder.UseDurableTaskScheduler(dtsConnectionString),
            clientBuilder: builder => builder.UseDurableTaskScheduler(dtsConnectionString));
    })
    .Build();

await host.StartAsync();

IWorkflowClient workflowClient = host.Services.GetRequiredService<IWorkflowClient>();
IAwaitableWorkflowRun run = (IAwaitableWorkflowRun)await workflowClient.RunAsync(cancelOrder, "ORD-12345");
string? result = await run.WaitForCompletionAsync<string>();
```

The `OrderLookup`, `OrderCancel`, and `SendEmail` executors are standard [Microsoft Agent Framework executors](/agent-framework/workflows) with no Durable-specific code. For complete implementations, see the [samples on GitHub](#related-links).

::: zone-end

### Fan-out/fan-in (concurrent) workflow

You can fan out to multiple executors or agents that run in parallel, then fan in to aggregate the results. The following example sends a science question to a physicist and chemist agent in parallel, then aggregates their responses.

::: zone pivot="azure-functions"

# [C#](#tab/csharp)

```csharp
ChatClient chatClient = new AzureOpenAIClient(
    new Uri(endpoint), new DefaultAzureCredential()).GetChatClient(deploymentName);

AIAgent physicist = chatClient.AsAIAgent(
    "You are a physics expert. Be concise (2-3 sentences).", "Physicist");
AIAgent chemist = chatClient.AsAIAgent(
    "You are a chemistry expert. Be concise (2-3 sentences).", "Chemist");

ParseQuestionExecutor parseQuestion = new();
AggregatorExecutor aggregator = new();

Workflow workflow = new WorkflowBuilder(parseQuestion)
    .WithName("ExpertReview")
    .AddFanOutEdge(parseQuestion, [physicist, chemist])
    .AddFanInBarrierEdge([physicist, chemist], aggregator)
    .Build();

using IHost app = FunctionsApplication
    .CreateBuilder(args)
    .ConfigureFunctionsWebApplication()
    .ConfigureDurableWorkflows(workflows => workflows.AddWorkflows(workflow))
    .Build();
app.Run();
```

The `ParseQuestionExecutor` and `AggregatorExecutor` are standard [Microsoft Agent Framework executors](/agent-framework/workflows) with no Durable-specific code. For complete implementations, see the [samples on GitHub](#related-links).

# [Python](#tab/python)

```python
from agent_framework import (
    Agent, AgentExecutorResponse, Workflow,
    WorkflowBuilder, WorkflowContext, executor,
)
from agent_framework.azure import AgentFunctionApp

chat_client = ...  # OpenAIChatCompletionClient or FoundryChatClient

sentiment_agent = Agent(
    client=chat_client,
    name="SentimentAnalysisAgent",
    instructions="You are a sentiment analysis expert. Analyze the sentiment of the given text.",
)

keyword_agent = Agent(
    client=chat_client,
    name="KeywordExtractionAgent",
    instructions="You are a keyword extraction expert. Extract important keywords from the given text.",
)

@executor(id="input_router")
async def input_router(doc: str, ctx: WorkflowContext) -> None:
    await ctx.send_message(doc)

@executor(id="prepare_for_output")
async def prepare_for_output(
    analyses: list[AgentExecutorResponse], ctx: WorkflowContext[None, str]
) -> None:
    parts = [f"[{a.executor_id}]: {a.agent_response.text}" for a in analyses]
    await ctx.yield_output("\n\n".join(parts))

workflow = (
    WorkflowBuilder(start_executor=input_router)
    .add_fan_out_edges(source=input_router, targets=[sentiment_agent, keyword_agent])
    .add_fan_in_edges(sources=[sentiment_agent, keyword_agent], target=prepare_for_output)
    .build()
)

app = AgentFunctionApp(workflow=workflow)
```

---

::: zone-end

::: zone pivot="other-compute"

```csharp
string dtsConnectionString = Environment.GetEnvironmentVariable("DURABLE_TASK_SCHEDULER_CONNECTION_STRING")
    ?? "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None";

ChatClient chatClient = new AzureOpenAIClient(
    new Uri(endpoint), new DefaultAzureCredential()).GetChatClient(deploymentName);

ParseQuestionExecutor parseQuestion = new();
AIAgent physicist = chatClient.AsAIAgent(
    "You are a physics expert. Be concise (2-3 sentences).", "Physicist");
AIAgent chemist = chatClient.AsAIAgent(
    "You are a chemistry expert. Be concise (2-3 sentences).", "Chemist");
AggregatorExecutor aggregator = new();

Workflow workflow = new WorkflowBuilder(parseQuestion)
    .WithName("ExpertReview")
    .AddFanOutEdge(parseQuestion, [physicist, chemist])
    .AddFanInBarrierEdge([physicist, chemist], aggregator)
    .Build();

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.ConfigureDurableOptions(
            options => options.Workflows.AddWorkflow(workflow),
            workerBuilder: builder => builder.UseDurableTaskScheduler(dtsConnectionString),
            clientBuilder: builder => builder.UseDurableTaskScheduler(dtsConnectionString));
    })
    .Build();

await host.StartAsync();

IWorkflowClient workflowClient = host.Services.GetRequiredService<IWorkflowClient>();
IWorkflowRun run = await workflowClient.RunAsync(workflow, "Why is the sky blue?");

if (run is IAwaitableWorkflowRun awaitableRun)
{
    string? result = await awaitableRun.WaitForCompletionAsync<string>();
    Console.WriteLine(result);
}
```

The `ParseQuestionExecutor` and `AggregatorExecutor` are standard [Microsoft Agent Framework executors](/agent-framework/workflows) with no Durable-specific code. For complete implementations, see the [samples on GitHub](#related-links).

::: zone-end

### Conditional routing workflow

You can route execution to different branches based on runtime results. The following example uses a spam detection agent to classify incoming email, then routes to either a spam handler or an email assistant agent.

::: zone pivot="azure-functions"

# [C#](#tab/csharp)

```csharp
AIAgent spamDetector = chatClient.AsAIAgent(
    "You are a spam detection assistant. Return JSON with is_spam (bool) and reason (string).",
    "SpamDetectionAgent");
AIAgent emailAssistant = chatClient.AsAIAgent(
    "You are an email assistant. Draft a professional response.",
    "EmailAssistantAgent");

SpamHandlerExecutor spamHandler = new();
EmailSenderExecutor emailSender = new();

Workflow workflow = new WorkflowBuilder(spamDetector)
    .WithName("EmailClassification")
    .AddSwitchCaseEdgeGroup(spamDetector, [
        new Case(condition: IsSpamDetected, target: spamHandler),
        new Default(target: emailAssistant),
    ])
    .AddEdge(emailAssistant, emailSender)
    .Build();

using IHost app = FunctionsApplication
    .CreateBuilder(args)
    .ConfigureFunctionsWebApplication()
    .ConfigureDurableWorkflows(workflows => workflows.AddWorkflows(workflow))
    .Build();
app.Run();
```

The `SpamHandlerExecutor` and `EmailSenderExecutor` are standard [Microsoft Agent Framework executors](/agent-framework/workflows) with no Durable-specific code. For complete implementations, see the [samples on GitHub](#related-links).

# [Python](#tab/python)

```python
from agent_framework import (
    Agent, AgentExecutorResponse, Case, Default, Executor,
    Workflow, WorkflowBuilder, WorkflowContext, handler,
)
from agent_framework.azure import AgentFunctionApp
from pydantic import BaseModel

class SpamDetectionResult(BaseModel):
    is_spam: bool
    reason: str

chat_client = ...  # FoundryChatClient or OpenAIChatCompletionClient

spam_agent = Agent(
    client=chat_client,
    name="SpamDetectionAgent",
    instructions="You are a spam detection assistant. Return JSON with is_spam and reason.",
    default_options={"response_format": SpamDetectionResult},
)

email_agent = Agent(
    client=chat_client,
    name="EmailAssistantAgent",
    instructions="You are an email assistant that drafts professional responses.",
)

class SpamHandlerExecutor(Executor):
    @handler
    async def handle(self, response: AgentExecutorResponse, ctx: WorkflowContext[None, str]) -> None:
        text = response.agent_response.text
        result = SpamDetectionResult.model_validate_json(text)
        await ctx.yield_output(f"Email marked as spam: {result.reason}")

class EmailSenderExecutor(Executor):
    @handler
    async def handle(self, response: AgentExecutorResponse, ctx: WorkflowContext[None, str]) -> None:
        await ctx.yield_output(f"Email sent: {response.agent_response.text}")

def is_spam_detected(message) -> bool:
    if not isinstance(message, AgentExecutorResponse):
        return False
    result = SpamDetectionResult.model_validate_json(message.agent_response.text)
    return result.is_spam

spam_handler = SpamHandlerExecutor(id="spam_handler")
email_sender = EmailSenderExecutor(id="email_sender")

workflow = (
    WorkflowBuilder(start_executor=spam_agent)
    .add_switch_case_edge_group(spam_agent, [
        Case(condition=is_spam_detected, target=spam_handler),
        Default(target=email_agent),
    ])
    .add_edge(email_agent, email_sender)
    .build()
)

app = AgentFunctionApp(workflow=workflow)
```

---

::: zone-end

::: zone pivot="other-compute"

```csharp
string dtsConnectionString = Environment.GetEnvironmentVariable("DURABLE_TASK_SCHEDULER_CONNECTION_STRING")
    ?? "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None";

ChatClient chatClient = new AzureOpenAIClient(
    new Uri(endpoint), new DefaultAzureCredential()).GetChatClient(deploymentName);

AIAgent spamDetector = chatClient.AsAIAgent(
    "You are a spam detection assistant. Return JSON with is_spam (bool) and reason (string).",
    "SpamDetectionAgent");
AIAgent emailAssistant = chatClient.AsAIAgent(
    "You are an email assistant. Draft a professional response.",
    "EmailAssistantAgent");

SpamHandlerExecutor spamHandler = new();
EmailSenderExecutor emailSender = new();

Workflow workflow = new WorkflowBuilder(spamDetector)
    .WithName("EmailClassification")
    .AddSwitchCaseEdgeGroup(spamDetector, [
        new Case(condition: IsSpamDetected, target: spamHandler),
        new Default(target: emailAssistant),
    ])
    .AddEdge(emailAssistant, emailSender)
    .Build();

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.ConfigureDurableWorkflows(
            workflowOptions => workflowOptions.AddWorkflow(workflow),
            workerBuilder: builder => builder.UseDurableTaskScheduler(dtsConnectionString),
            clientBuilder: builder => builder.UseDurableTaskScheduler(dtsConnectionString));
    })
    .Build();

await host.StartAsync();

IWorkflowClient workflowClient = host.Services.GetRequiredService<IWorkflowClient>();
IAwaitableWorkflowRun run = (IAwaitableWorkflowRun)await workflowClient.RunAsync(workflow, "Check this email for spam");
string? result = await run.WaitForCompletionAsync<string>();
```

The `SpamHandlerExecutor` and `EmailSenderExecutor` are standard [Microsoft Agent Framework executors](/agent-framework/workflows) with no Durable-specific code. For complete implementations, see the [samples on GitHub](#related-links).

::: zone-end

### Human-in-the-loop (HITL) workflow

You can pause workflow execution at designated points to wait for external input before continuing. The Microsoft Agent Framework workflow model uses `RequestPort` nodes (in .NET) or `ctx.request_info()` (in Python) to define pause points. The following example implements an expense reimbursement workflow with a manager approval followed by parallel budget and compliance approvals.

::: zone pivot="azure-functions"

# [C#](#tab/csharp)

```csharp
CreateApprovalRequest createRequest = new();
RequestPort<ApprovalRequest, ApprovalResponse> managerApproval =
    RequestPort.Create<ApprovalRequest, ApprovalResponse>("ManagerApproval");
PrepareFinanceReview prepareFinanceReview = new();
RequestPort<ApprovalRequest, ApprovalResponse> budgetApproval =
    RequestPort.Create<ApprovalRequest, ApprovalResponse>("BudgetApproval");
RequestPort<ApprovalRequest, ApprovalResponse> complianceApproval =
    RequestPort.Create<ApprovalRequest, ApprovalResponse>("ComplianceApproval");
ExpenseReimburse reimburse = new();

Workflow expenseApproval = new WorkflowBuilder(createRequest)
    .WithName("ExpenseReimbursement")
    .WithDescription("Expense reimbursement with manager and parallel finance approvals")
    .AddEdge(createRequest, managerApproval)
    .AddEdge(managerApproval, prepareFinanceReview)
    .AddFanOutEdge(prepareFinanceReview, [budgetApproval, complianceApproval])
    .AddFanInBarrierEdge([budgetApproval, complianceApproval], reimburse)
    .Build();

using IHost app = FunctionsApplication
    .CreateBuilder(args)
    .ConfigureFunctionsWebApplication()
    .ConfigureDurableWorkflows(workflows =>
        workflows.AddWorkflow(expenseApproval, exposeStatusEndpoint: true))
    .Build();
app.Run();
```

The framework auto-generates three HTTP endpoints for HITL interaction.

- `POST /api/workflows/{name}/run` : Start the workflow
- `GET /api/workflows/{name}/status/{id}` : Check status and pending approvals
- `POST /api/workflows/{name}/respond/{id}` : Send approval response to resume

The following record types define the data flowing through the workflow:

```csharp
public record ApprovalRequest(string ExpenseId, decimal Amount, string EmployeeName);
public record ApprovalResponse(bool Approved, string? Comments);
```

The `CreateApprovalRequest`, `PrepareFinanceReview`, and `ExpenseReimburse` executors are standard [Microsoft Agent Framework executors](/agent-framework/workflows) with no Durable-specific code. For complete implementations, see the [samples on GitHub](#related-links).

# [Python](#tab/python)

```python
from agent_framework import (
    Agent, Executor, Workflow, WorkflowBuilder,
    WorkflowContext, handler, response_handler,
)
from agent_framework.azure import AgentFunctionApp
from pydantic import BaseModel

class HumanApprovalResponse(BaseModel):
    approved: bool
    reviewer_notes: str = ""

chat_client = ...  # FoundryChatClient or OpenAIChatCompletionClient

content_analyzer_agent = Agent(
    client=chat_client,
    name="ContentAnalyzerAgent",
    instructions="You are a content moderation assistant. Analyze content for policy compliance.",
)

class InputRouterExecutor(Executor):
    def __init__(self):
        super().__init__(id="input_router")

    @handler
    async def route_input(self, input_text: str, ctx: WorkflowContext) -> None:
        await ctx.send_message(input_text)

class HumanReviewExecutor(Executor):
    def __init__(self):
        super().__init__(id="human_review_executor")

    @handler
    async def request_review(self, data, ctx: WorkflowContext) -> None:
        approval_request = {
            "content": data,
            "prompt": "Please approve or reject this content.",
        }
        await ctx.request_info(
            request_data=approval_request,
            response_type=HumanApprovalResponse,
        )

    @response_handler
    async def handle_approval_response(self, original_request, response, ctx: WorkflowContext) -> None:
        status = "approved" if response.approved else "rejected"
        await ctx.send_message(f"Content {status}: {response.reviewer_notes}")

class PublishExecutor(Executor):
    def __init__(self):
        super().__init__(id="publish_executor")

    @handler
    async def handle_result(self, result: str, ctx: WorkflowContext[None, str]) -> None:
        await ctx.yield_output(result)

input_router = InputRouterExecutor()
human_review = HumanReviewExecutor()
publish = PublishExecutor()

workflow = (
    WorkflowBuilder(start_executor=input_router)
    .add_edge(input_router, content_analyzer_agent)
    .add_edge(content_analyzer_agent, human_review)
    .add_edge(human_review, publish)
    .build()
)

app = AgentFunctionApp(workflow=workflow)
```

---

::: zone-end

::: zone pivot="other-compute"

```csharp
string dtsConnectionString = Environment.GetEnvironmentVariable("DURABLE_TASK_SCHEDULER_CONNECTION_STRING")
    ?? "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None";

CreateApprovalRequest createRequest = new();
RequestPort<ApprovalRequest, ApprovalResponse> managerApproval =
    RequestPort.Create<ApprovalRequest, ApprovalResponse>("ManagerApproval");
PrepareFinanceReview prepareFinanceReview = new();
RequestPort<ApprovalRequest, ApprovalResponse> budgetApproval =
    RequestPort.Create<ApprovalRequest, ApprovalResponse>("BudgetApproval");
RequestPort<ApprovalRequest, ApprovalResponse> complianceApproval =
    RequestPort.Create<ApprovalRequest, ApprovalResponse>("ComplianceApproval");
ExpenseReimburse reimburse = new();

Workflow expenseApproval = new WorkflowBuilder(createRequest)
    .WithName("ExpenseReimbursement")
    .AddEdge(createRequest, managerApproval)
    .AddEdge(managerApproval, prepareFinanceReview)
    .AddFanOutEdge(prepareFinanceReview, [budgetApproval, complianceApproval])
    .AddFanInBarrierEdge([budgetApproval, complianceApproval], reimburse)
    .Build();

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.ConfigureDurableWorkflows(
            options => options.AddWorkflow(expenseApproval),
            workerBuilder: builder => builder.UseDurableTaskScheduler(dtsConnectionString),
            clientBuilder: builder => builder.UseDurableTaskScheduler(dtsConnectionString));
    })
    .Build();

await host.StartAsync();

IWorkflowClient workflowClient = host.Services.GetRequiredService<IWorkflowClient>();
IStreamingWorkflowRun run = await workflowClient.StreamAsync(expenseApproval, "EXP-2025-001");

await foreach (WorkflowEvent evt in run.WatchStreamAsync())
{
    switch (evt)
    {
        case DurableWorkflowWaitingForInputEvent requestEvent:
            Console.WriteLine($"Workflow paused at: {requestEvent.RequestPort.Id}");
            ApprovalResponse approval = new(Approved: true, Comments: "Approved.");
            await run.SendResponseAsync(requestEvent, approval);
            break;

        case DurableWorkflowCompletedEvent completedEvent:
            Console.WriteLine($"Workflow completed: {completedEvent.Result}");
            break;
    }
}
```

The following record types define the data flowing through the workflow:

```csharp
public record ApprovalRequest(string ExpenseId, decimal Amount, string EmployeeName);
public record ApprovalResponse(bool Approved, string? Comments);
```

The `CreateApprovalRequest`, `PrepareFinanceReview`, and `ExpenseReimburse` executors are standard [Microsoft Agent Framework executors](/agent-framework/workflows) with no Durable-specific code. For complete implementations, see the [samples on GitHub](#related-links).

::: zone-end


## Durable Task Scheduler dashboard

Use the [Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md) for full visibility into your durable agents, orchestrations, and graph-based workflows: 
- View conversation history for each agent session
- Inspect tool calls and structured outputs
- Trace orchestration and workflow execution flows
- Monitor performance metrics

Both local development (via the emulator) and production deployments surface the same dashboard experience.

The following screenshot shows an agent session with its conversation history and session details:

:::image type="content" source="media/durable-task-for-ai-agents/dashboard-agent.png" alt-text="Screenshot of the Durable Task Scheduler dashboard showing agent conversation history and session details." lightbox="media/durable-task-for-ai-agents/dashboard-agent.png":::

The following screenshot shows a deterministic orchestration with activity execution details:

:::image type="content" source="media/durable-task-for-ai-agents/dashboard-orchestration.png" alt-text="Screenshot of the Durable Task Scheduler dashboard showing a deterministic agentic orchestration view." lightbox="media/durable-task-for-ai-agents/dashboard-orchestration.png":::

## Session time-to-live (TTL) for durable agents

Durable agent sessions automatically maintain conversation history and state, which can accumulate indefinitely. The time-to-live (TTL) feature provides automatic cleanup of idle sessions, preventing storage resource consumption and increased costs. 

When an agent session is idle for longer than the configured TTL period, the session state is automatically deleted. Each new interaction resets the TTL timer, extending the session's lifetime.

### Default values

- **Default TTL**: 14 days
- **Minimum TTL deletion delay**: 5 minutes

### Configuration

TTL can be configured globally or per-agent. When an agent session expires, its entire state is deleted, including conversation history and any custom state data. If a message is sent to the same session after deletion, a new session is created with a fresh conversation history.

> [!NOTE]
> TTL configuration is currently available in .NET only.

```csharp
services.ConfigureDurableAgents(
    options =>
    {
        // Set global default TTL to 7 days
        options.DefaultTimeToLive = TimeSpan.FromDays(7);

        // Agent with custom TTL of 1 day
        options.AddAIAgent(shortLivedAgent, timeToLive: TimeSpan.FromDays(1));

        // Agent with custom TTL of 90 days
        options.AddAIAgent(longLivedAgent, timeToLive: TimeSpan.FromDays(90));

        // Agent using global default (7 days)
        options.AddAIAgent(defaultAgent);

        // Agent with no TTL (never expires)
        options.AddAIAgent(permanentAgent, timeToLive: null);
    });
```

## Known limitations

- **Maximum conversation size.**  
    Agent session state, including the full conversation history, is subject to the state-size limits of the durable backend. When using the [Durable Task Scheduler](../scheduler/durable-task-scheduler.md), the maximum entity state size is 1 MB. Long-running conversations with large tool call responses may reach this limit. Compaction of conversation history must be done manually, for example, by starting a new agent session and summarizing the prior context.

- **Latency.**  
   All agent interactions are routed through the Durable Task Scheduler, which adds latency compared to in-memory agent execution. This tradeoff provides durability and distributed scaling.

- **Streaming.**  
   Since durable agents are implemented on top of durable entities, the underlying communication model is request/response. Streaming is supported through response callbacks (for example, pushing tokens to a Redis Stream for client consumption), while the entity returns the complete response after the stream finishes.

- **TTL expiration.**  
   The TTL timer is based on wall-clock time since the last message, not cumulative activity time. Once a session is deleted (via TTL expiration or manual deletion), its conversation history can't be recovered.

## Additional capabilities

The following advanced patterns are available in the [samples on GitHub](#related-links) but aren't covered in detail in this article:

| Pattern | Description |
|---------|-------------|
| **Long-running tools** | Agents can start durable orchestrations from tool calls, enabling tools that run for extended periods with progress tracking. |
| **Agent as MCP tool** | Expose durable agents as [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) tools, allowing other agents or clients to invoke them through a standard interface. |
| **Reliable streaming** | Use Redis Streams (or similar transports) for resumable token streaming that survives client disconnects and reconnections. |

## Related links

::: zone pivot="azure-functions"

For complete code samples:
- [.NET Azure Functions](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/04-hosting/DurableAgents/AzureFunctions)
- [.NET Durable Workflows](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/04-hosting/DurableWorkflows)
- [Python Azure Functions (agents and workflows)](https://github.com/microsoft/agent-framework/tree/main/python/samples/04-hosting/azure_functions) 

::: zone-end

::: zone pivot="other-compute"

For complete code samples:
- [.NET any-host](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/04-hosting/DurableAgents/ConsoleApps)
- [.NET Durable Workflows](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/04-hosting/DurableWorkflows)
- [Python any-host (agents and workflows)](https://github.com/microsoft/agent-framework/tree/main/python/samples/04-hosting/durabletask)

::: zone-end

## Next steps

- [Durable Task for AI agents overview](./durable-task-for-ai-agents.md)
- [Agentic application patterns](./durable-agents-patterns.md)
- [Azure Functions (Durable)](/agent-framework/integrations/azure-functions)
- [Durable Task Scheduler overview](../scheduler/durable-task-scheduler.md)
