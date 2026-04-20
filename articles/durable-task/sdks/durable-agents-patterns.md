---
title: Agentic application patterns - Azure
description: Learn how to implement deterministic agentic workflows and agent loops using the Durable Task programming model with Durable Functions or the Durable Task SDKs.
author: cgillum
ms.topic: conceptual
ms.date: 04/07/2026
ms.author: cgillum
zone_pivot_groups: azure-durable-approach
---

# Agentic application patterns

There are two general approaches to building agentic applications with AI:

- [**Deterministic workflows**](#deterministic-workflow-patterns) — Your code defines the control flow. You write the sequence of steps, branching, parallelism, and error handling using standard programming constructs. The LLM performs work inside each step but doesn't control the overall flow.
- [**Agent-directed workflows (agent loops)**](#agent-loops) — The LLM drives the control flow. The agent decides which tools to call, in what order, and when the task is complete. You provide tools and instructions, but the agent determines the execution path at runtime.

Both approaches benefit from [durable execution](./durable-task-for-ai-agents.md) and can be implemented using the [Durable Task programming model](../common/programming-model-overview.md). This article shows how to build each pattern using code examples.

> [!TIP]
> These patterns align with the agentic workflow designs described in Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents). The Durable Task programming model maps naturally to these patterns: **orchestrations** define the workflow control flow and are automatically checkpointed, while **activities** wrap non-deterministic operations like LLM calls, tool invocations, and API requests.

## Choose an approach

The following table helps you decide when to use each approach.

| Use deterministic workflows when... | Use agent loops when... |
| ----------------------------------- | ----------------------- |
| The sequence of steps is known ahead of time. | The task is open-ended and the steps can't be predicted. |
| You need explicit guardrails over agent behavior. | You want the LLM to decide which tools to use and when. |
| Compliance or auditability requires reviewable control flow. | The agent needs to adapt its approach based on intermediate results. |
| You want to combine multiple AI frameworks in a single workflow. | You're building a conversational agent with tool-calling capabilities. |

Both approaches provide automatic checkpointing, retry policies, distributed scaling, and human-in-the-loop support through durable execution.

## Deterministic workflow patterns

In a deterministic workflow, your code controls the execution path. The LLM is called as a step within the workflow but doesn't decide what happens next. The Durable Task programming model maps naturally to this approach:

- **Orchestrations** define the workflow control flow (sequence, branching, parallelism, error handling) and are automatically checkpointed.
- **Activities** wrap non-deterministic operations like LLM calls, tool invocations, and API requests. Activities can run on any available compute instance.

::: zone pivot="durable-functions"

The following examples use [Durable Functions](../../azure-functions/durable-functions/durable-functions-overview.md), which runs on Azure Functions with serverless hosting.

::: zone-end

::: zone pivot="durable-task-sdks"

The following examples use the portable [Durable Task SDKs](./durable-task-overview.md), which run on any host compute including Azure Container Apps, Kubernetes, virtual machines, or locally.

::: zone-end

### Prompt chaining

Prompt chaining is the simplest agentic pattern. You break a complex task into a series of sequential LLM interactions, where each step's output feeds into the next step's input. Because each activity call is automatically checkpointed, a crash midway through the pipeline doesn't force you to restart from scratch and re-consume expensive LLM tokens — execution resumes from the last completed step.

You can also insert programmatic validation gates between steps. For example, after generating an outline you can verify it meets a length or topic constraint before passing it to the drafting step.

This pattern maps directly to the [function chaining](../common/durable-task-sequence.md) pattern in the Durable Task programming model.

**When to use:** Content-generation pipelines, multi-step document processing, sequential data enrichment, workflows that require intermediate validation gates.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[Function(nameof(PromptChainingOrchestration))]
public async Task<string> PromptChainingOrchestration(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var topic = context.GetInput<string>();

    // Step 1: Generate research outline
    string outline = await context.CallActivityAsync<string>(
        nameof(GenerateOutlineAgent), topic);

    // Step 2: Write first draft from outline
    string draft = await context.CallActivityAsync<string>(
        nameof(WriteDraftAgent), outline);

    // Step 3: Refine and polish the draft
    string finalContent = await context.CallActivityAsync<string>(
        nameof(RefineDraftAgent), draft);

    return finalContent;
}
```

> [!NOTE]
> The state of the orchestration is automatically checkpointed at each `await` statement. If the host process crashes or the VM recycles, the orchestration will automatically resume from the last completed step rather than starting over.

# [Python](#tab/python)

```python
@app.orchestration_trigger(context_name="context")
def prompt_chaining_orchestration(context: df.DurableOrchestrationContext):
    topic = context.get_input()

    # Step 1: Generate research outline
    outline = yield context.call_activity("generate_outline_agent", topic)

    # Step 2: Write first draft from outline
    draft = yield context.call_activity("write_draft_agent", outline)

    # Step 3: Refine and polish the draft
    final_content = yield context.call_activity("refine_draft_agent", draft)

    return final_content
```

> [!NOTE]
> The state of the orchestration is automatically checkpointed at each `yield` statement. If the host process crashes or the VM recycles, the orchestration will automatically resume from the last completed step rather than starting over.

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestration("promptChainingOrchestration", function* (context) {
    const topic = context.df.getInput();

    // Step 1: Generate research outline
    const outline = yield context.df.callActivity("generateOutlineAgent", topic);

    // Step 2: Write first draft from outline
    const draft = yield context.df.callActivity("writeDraftAgent", outline);

    // Step 3: Refine and polish the draft
    const finalContent = yield context.df.callActivity("refineDraftAgent", draft);

    return finalContent;
});
```

> [!NOTE]
> The state of the orchestration is automatically checkpointed at each `yield` statement. If the host process crashes or the VM recycles, the orchestration will automatically resume from the last completed step rather than starting over.

# [Java](#tab/java)

```java
@FunctionName("PromptChainingOrchestration")
public String promptChainingOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    String topic = ctx.getInput(String.class);

    // Step 1: Generate research outline
    String outline = ctx.callActivity(
        "GenerateOutlineAgent", topic, String.class).await();

    // Step 2: Write first draft from outline
    String draft = ctx.callActivity(
        "WriteDraftAgent", outline, String.class).await();

    // Step 3: Refine and polish the draft
    String finalContent = ctx.callActivity(
        "RefineDraftAgent", draft, String.class).await();

    return finalContent;
}
```

> [!NOTE]
> The state of the orchestration is automatically checkpointed at each `await()` invocation. If the host process crashes or the VM recycles, the orchestration will automatically resume from the last completed step rather than starting over.

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
[DurableTask]
public class PromptChainingOrchestration : TaskOrchestrator<string, string>
{
    public override async Task<string> RunAsync(
        TaskOrchestrationContext context, string topic)
    {
        // Step 1: Generate research outline
        string outline = await context.CallActivityAsync<string>(
            nameof(GenerateOutlineAgent), topic);

        // Step 2: Write first draft from outline
        string draft = await context.CallActivityAsync<string>(
            nameof(WriteDraftAgent), outline);

        // Step 3: Refine and polish the draft
        string finalContent = await context.CallActivityAsync<string>(
            nameof(RefineDraftAgent), draft);

        return finalContent;
    }
}
```

> [!NOTE]
> The state of the orchestration is automatically checkpointed at each `await` statement. If the host process crashes or the VM recycles, the orchestration will automatically resume from the last completed step rather than starting over.

# [Python](#tab/python)

```python
def prompt_chaining_orchestration(ctx: task.OrchestrationContext, topic: str) -> str:
    # Step 1: Generate research outline
    outline = yield ctx.call_activity(generate_outline_agent, input=topic)

    # Step 2: Write first draft from outline
    draft = yield ctx.call_activity(write_draft_agent, input=outline)

    # Step 3: Refine and polish the draft
    final_content = yield ctx.call_activity(refine_draft_agent, input=draft)

    return final_content
```

> [!NOTE]
> The state of the orchestration is automatically checkpointed at each `yield` statement. If the host process crashes or the VM recycles, the orchestration will automatically resume from the last completed step rather than starting over.

# [JavaScript](#tab/javascript)

```typescript
const promptChainingOrchestration: TOrchestrator = async function* (
    ctx: OrchestrationContext, topic: string): any {

    // Step 1: Generate research outline
    const outline: string = yield ctx.callActivity(generateOutlineAgent, topic);

    // Step 2: Write first draft from outline
    const draft: string = yield ctx.callActivity(writeDraftAgent, outline);

    // Step 3: Refine and polish the draft
    const finalContent: string = yield ctx.callActivity(refineDraftAgent, draft);

    return finalContent;
};
```

> [!NOTE]
> The state of the orchestration is automatically checkpointed at each `yield` statement. If the host process crashes or the VM recycles, the orchestration will automatically resume from the last completed step rather than starting over.

# [Java](#tab/java)

```java
ctx -> {
    String topic = ctx.getInput(String.class);

    // Step 1: Generate research outline
    String outline = ctx.callActivity(
        "GenerateOutlineAgent", topic, String.class).await();

    // Step 2: Write first draft from outline
    String draft = ctx.callActivity(
        "WriteDraftAgent", outline, String.class).await();

    // Step 3: Refine and polish the draft
    String finalContent = ctx.callActivity(
        "RefineDraftAgent", draft, String.class).await();

    ctx.complete(finalContent);
}
```

> [!NOTE]
> The state of the orchestration is automatically checkpointed at each `await()` invocation. If the host process crashes or the VM recycles, the orchestration will automatically resume from the last completed step rather than starting over.

---

::: zone-end

### Routing

Routing uses a classification step to determine which downstream agent or model should handle a request. The orchestration calls a classifier activity first, then branches to the appropriate handler based on the result. This approach lets you tailor each handler's prompt, model, and toolset independently — for example, directing billing questions to a specialized agent with access to payment APIs while sending general questions to a lighter-weight model.

**When to use:** Customer support triage, intent classification to specialized agents, dynamic model selection based on task complexity.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[Function(nameof(RoutingOrchestration))]
public async Task<string> RoutingOrchestration(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var request = context.GetInput<SupportRequest>();

    // Classify the request type
    string category = await context.CallActivityAsync<string>(
        nameof(ClassifyRequestAgent), request.Message);

    // Route to the appropriate specialized agent
    return category switch
    {
        "billing" => await context.CallActivityAsync<string>(
            nameof(BillingAgent), request),
        "technical" => await context.CallActivityAsync<string>(
            nameof(TechnicalSupportAgent), request),
        "general" => await context.CallActivityAsync<string>(
            nameof(GeneralInquiryAgent), request),
        _ => await context.CallActivityAsync<string>(
            nameof(GeneralInquiryAgent), request),
    };
}
```

# [Python](#tab/python)

```python
@app.orchestration_trigger(context_name="context")
def routing_orchestration(context: df.DurableOrchestrationContext):
    request = context.get_input()

    # Classify the request type
    category = yield context.call_activity("classify_request_agent", request["message"])

    # Route to the appropriate specialized agent
    if category == "billing":
        return (yield context.call_activity("billing_agent", request))
    elif category == "technical":
        return (yield context.call_activity("technical_support_agent", request))
    else:
        return (yield context.call_activity("general_inquiry_agent", request))
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestration("routingOrchestration", function* (context) {
    const request = context.df.getInput();

    // Classify the request type
    const category = yield context.df.callActivity("classifyRequestAgent", request.message);

    // Route to the appropriate specialized agent
    switch (category) {
        case "billing":
            return yield context.df.callActivity("billingAgent", request);
        case "technical":
            return yield context.df.callActivity("technicalSupportAgent", request);
        default:
            return yield context.df.callActivity("generalInquiryAgent", request);
    }
});
```

# [Java](#tab/java)

```java
@FunctionName("RoutingOrchestration")
public String routingOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    SupportRequest request = ctx.getInput(SupportRequest.class);

    // Classify the request type
    String category = ctx.callActivity(
        "ClassifyRequestAgent", request.getMessage(), String.class).await();

    // Route to the appropriate specialized agent
    return switch (category) {
        case "billing" -> ctx.callActivity(
            "BillingAgent", request, String.class).await();
        case "technical" -> ctx.callActivity(
            "TechnicalSupportAgent", request, String.class).await();
        default -> ctx.callActivity(
            "GeneralInquiryAgent", request, String.class).await();
    };
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
[DurableTask]
public class RoutingOrchestration : TaskOrchestrator<SupportRequest, string>
{
    public override async Task<string> RunAsync(
        TaskOrchestrationContext context, SupportRequest request)
    {
        // Classify the request type
        string category = await context.CallActivityAsync<string>(
            nameof(ClassifyRequestAgent), request.Message);

        // Route to the appropriate specialized agent
        return category switch
        {
            "billing" => await context.CallActivityAsync<string>(
                nameof(BillingAgent), request),
            "technical" => await context.CallActivityAsync<string>(
                nameof(TechnicalSupportAgent), request),
            _ => await context.CallActivityAsync<string>(
                nameof(GeneralInquiryAgent), request),
        };
    }
}
```

# [Python](#tab/python)

```python
def routing_orchestration(ctx: task.OrchestrationContext, request: dict) -> str:
    # Classify the request type
    category = yield ctx.call_activity(classify_request_agent, input=request["message"])

    # Route to the appropriate specialized agent
    if category == "billing":
        return (yield ctx.call_activity(billing_agent, input=request))
    elif category == "technical":
        return (yield ctx.call_activity(technical_support_agent, input=request))
    else:
        return (yield ctx.call_activity(general_inquiry_agent, input=request))
```

# [JavaScript](#tab/javascript)

```typescript
const routingOrchestration: TOrchestrator = async function* (
    ctx: OrchestrationContext, request: SupportRequest): any {

    // Classify the request type
    const category: string = yield ctx.callActivity(classifyRequestAgent, request.message);

    // Route to the appropriate specialized agent
    switch (category) {
        case "billing":
            return yield ctx.callActivity(billingAgent, request);
        case "technical":
            return yield ctx.callActivity(technicalSupportAgent, request);
        default:
            return yield ctx.callActivity(generalInquiryAgent, request);
    }
};
```

# [Java](#tab/java)

```java
ctx -> {
    SupportRequest request = ctx.getInput(SupportRequest.class);

    // Classify the request type
    String category = ctx.callActivity(
        "ClassifyRequestAgent", request.getMessage(), String.class).await();

    // Route to the appropriate specialized agent
    String result = switch (category) {
        case "billing" -> ctx.callActivity(
            "BillingAgent", request, String.class).await();
        case "technical" -> ctx.callActivity(
            "TechnicalSupportAgent", request, String.class).await();
        default -> ctx.callActivity(
            "GeneralInquiryAgent", request, String.class).await();
    };

    ctx.complete(result);
}
```

---

::: zone-end

### Parallelization

When you have multiple independent subtasks, you can dispatch them as parallel activity calls and wait for all results before proceeding. The Durable Task Scheduler distributes these activities across all available compute instances automatically, which means adding more workers directly reduces total wall-clock time.

A common variant is multi-model voting: you send the same prompt to several models (or the same model with different temperatures) in parallel, then aggregate or select from the responses. Because each parallel branch is independently checkpointed, a transient failure in one branch doesn't affect the others.

This pattern maps directly to the [fan-out/fan-in](../common/durable-task-fan-in-fan-out.md) pattern in Durable Task.

**When to use:** Batch analysis of documents, parallel tool calls, multi-model evaluation, content moderation with multiple reviewers.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[Function(nameof(ParallelResearchOrchestration))]
public async Task<string> ParallelResearchOrchestration(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var request = context.GetInput<ResearchRequest>();

    // Fan-out: research multiple subtopics in parallel
    var researchTasks = request.Subtopics
        .Select(subtopic => context.CallActivityAsync<string>(
            nameof(ResearchSubtopicAgent), subtopic))
        .ToList();
    string[] researchResults = await Task.WhenAll(researchTasks);

    // Aggregate: synthesize all research into a single summary
    string summary = await context.CallActivityAsync<string>(
        nameof(SynthesizeAgent),
        new { request.Topic, Research = researchResults });

    return summary;
}
```

# [Python](#tab/python)

```python
@app.orchestration_trigger(context_name="context")
def parallel_research_orchestration(context: df.DurableOrchestrationContext):
    request = context.get_input()

    # Fan-out: research multiple subtopics in parallel
    research_tasks = []
    for subtopic in request["subtopics"]:
        research_tasks.append(
            context.call_activity("research_subtopic_agent", subtopic)
        )
    research_results = yield context.task_all(research_tasks)

    # Aggregate: synthesize all research into a single summary
    summary = yield context.call_activity("synthesize_agent", {
        "topic": request["topic"],
        "research": research_results
    })

    return summary
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestration("parallelResearchOrchestration", function* (context) {
    const request = context.df.getInput();

    // Fan-out: research multiple subtopics in parallel
    const tasks = request.subtopics.map((subtopic) =>
        context.df.callActivity("researchSubtopicAgent", subtopic)
    );
    const researchResults = yield context.df.Task.all(tasks);

    // Aggregate: synthesize all research into a single summary
    const summary = yield context.df.callActivity("synthesizeAgent", {
        topic: request.topic,
        research: researchResults,
    });

    return summary;
});
```

# [Java](#tab/java)

```java
@FunctionName("ParallelResearchOrchestration")
public String parallelResearchOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    ResearchRequest request = ctx.getInput(ResearchRequest.class);

    // Fan-out: research multiple subtopics in parallel
    List<Task<String>> tasks = request.getSubtopics().stream()
        .map(subtopic -> ctx.callActivity(
            "ResearchSubtopicAgent", subtopic, String.class))
        .collect(Collectors.toList());
    List<String> researchResults = ctx.allOf(tasks).await();

    // Aggregate: synthesize all research into a single summary
    String summary = ctx.callActivity(
        "SynthesizeAgent", researchResults, String.class).await();

    return summary;
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
[DurableTask]
public class ParallelResearchOrchestration : TaskOrchestrator<ResearchRequest, string>
{
    public override async Task<string> RunAsync(
        TaskOrchestrationContext context, ResearchRequest request)
    {
        // Fan-out: research multiple subtopics in parallel
        var researchTasks = request.Subtopics
            .Select(subtopic => context.CallActivityAsync<string>(
                nameof(ResearchSubtopicAgent), subtopic))
            .ToList();
        string[] researchResults = await Task.WhenAll(researchTasks);

        // Aggregate: synthesize all research into a single summary
        string summary = await context.CallActivityAsync<string>(
            nameof(SynthesizeAgent),
            new { request.Topic, Research = researchResults });

        return summary;
    }
}
```

# [Python](#tab/python)

```python
def parallel_research_orchestration(ctx: task.OrchestrationContext, request: dict) -> str:
    # Fan-out: research multiple subtopics in parallel
    research_tasks = []
    for subtopic in request["subtopics"]:
        research_tasks.append(
            ctx.call_activity(research_subtopic_agent, input=subtopic)
        )
    research_results = yield task.when_all(research_tasks)

    # Aggregate: synthesize all research into a single summary
    summary = yield ctx.call_activity(synthesize_agent, input={
        "topic": request["topic"],
        "research": research_results
    })

    return summary
```

# [JavaScript](#tab/javascript)

```typescript
const parallelResearchOrchestration: TOrchestrator = async function* (
    ctx: OrchestrationContext,
    request: { topic: string; subtopics: string[] }): any {

    // Fan-out: research multiple subtopics in parallel
    const tasks = request.subtopics.map((subtopic) =>
        ctx.callActivity(researchSubtopicAgent, subtopic)
    );
    const researchResults: string[] = yield whenAll(tasks);

    // Aggregate: synthesize all research into a single summary
    const summary: string = yield ctx.callActivity(synthesizeAgent, {
        topic: request.topic,
        research: researchResults,
    });

    return summary;
};
```

# [Java](#tab/java)

```java
ctx -> {
    ResearchRequest request = ctx.getInput(ResearchRequest.class);

    // Fan-out: research multiple subtopics in parallel
    List<Task<String>> tasks = request.getSubtopics().stream()
        .map(subtopic -> ctx.callActivity(
            "ResearchSubtopicAgent", subtopic, String.class))
        .collect(Collectors.toList());
    List<String> researchResults = ctx.allOf(tasks).await();

    // Aggregate: synthesize all research into a single summary
    String summary = ctx.callActivity(
        "SynthesizeAgent", researchResults, String.class).await();

    ctx.complete(summary);
}
```

---

::: zone-end

### Orchestrator-workers

In this pattern, a central orchestrator first calls an LLM (via an activity) to plan the work. Based on the LLM's output, the orchestrator then determines what subtasks are needed. The orchestrator then dispatches those subtasks to specialized worker orchestrations. The key difference from parallelization is that the set of subtasks isn't fixed at design time; the orchestrator determines them dynamically at runtime.

This pattern uses [sub-orchestrations](../common/durable-task-sub-orchestrations.md), which are independently checkpointed child workflows. Each worker orchestration can itself contain multiple steps, retries, and nested parallelism.

**When to use:** Deep research pipelines, coding agent workflows that modify multiple files, multi-agent collaboration where each agent has a distinct role.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[Function(nameof(OrchestratorWorkersOrchestration))]
public async Task<string> OrchestratorWorkersOrchestration(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var request = context.GetInput<ResearchRequest>();

    // Central orchestrator: determine what research is needed
    string[] subtasks = await context.CallActivityAsync<string[]>(
        nameof(PlanResearchAgent), request.Topic);

    // Delegate to worker orchestrations in parallel
    var workerTasks = subtasks
        .Select(subtask => context.CallSubOrchestratorAsync<string>(
            nameof(ResearchWorkerOrchestration), subtask))
        .ToList();
    string[] results = await Task.WhenAll(workerTasks);

    // Synthesize results
    string finalReport = await context.CallActivityAsync<string>(
        nameof(SynthesizeAgent),
        new { request.Topic, Research = results });

    return finalReport;
}
```

# [Python](#tab/python)

```python
@app.orchestration_trigger(context_name="context")
def orchestrator_workers_orchestration(context: df.DurableOrchestrationContext):
    request = context.get_input()

    # Central orchestrator: determine what research is needed
    subtasks = yield context.call_activity("plan_research_agent", request["topic"])

    # Delegate to worker orchestrations in parallel
    worker_tasks = []
    for subtask in subtasks:
        worker_tasks.append(
            context.call_sub_orchestrator("research_worker_orchestration", subtask)
        )
    results = yield context.task_all(worker_tasks)

    # Synthesize results
    final_report = yield context.call_activity("synthesize_agent", {
        "topic": request["topic"],
        "research": results
    })

    return final_report
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestration("orchestratorWorkersOrchestration", function* (context) {
    const request = context.df.getInput();

    // Central orchestrator: determine what research is needed
    const subtasks = yield context.df.callActivity("planResearchAgent", request.topic);

    // Delegate to worker orchestrations in parallel
    const workerTasks = subtasks.map((subtask) =>
        context.df.callSubOrchestrator("researchWorkerOrchestration", subtask)
    );
    const results = yield context.df.Task.all(workerTasks);

    // Synthesize results
    const finalReport = yield context.df.callActivity("synthesizeAgent", {
        topic: request.topic,
        research: results,
    });

    return finalReport;
});
```

# [Java](#tab/java)

```java
@FunctionName("OrchestratorWorkersOrchestration")
public String orchestratorWorkersOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    ResearchRequest request = ctx.getInput(ResearchRequest.class);

    // Central orchestrator: determine what research is needed
    List<String> subtasks = ctx.callActivity(
        "PlanResearchAgent", request.getTopic(), List.class).await();

    // Delegate to worker orchestrations in parallel
    List<Task<String>> workerTasks = subtasks.stream()
        .map(subtask -> ctx.callSubOrchestrator(
            "ResearchWorkerOrchestration", subtask, String.class))
        .collect(Collectors.toList());
    List<String> results = ctx.allOf(workerTasks).await();

    // Synthesize results
    String finalReport = ctx.callActivity(
        "SynthesizeAgent", results, String.class).await();

    return finalReport;
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
[DurableTask]
public class OrchestratorWorkersOrchestration : TaskOrchestrator<ResearchRequest, string>
{
    public override async Task<string> RunAsync(
        TaskOrchestrationContext context, ResearchRequest request)
    {
        // Central orchestrator: determine what research is needed
        string[] subtasks = await context.CallActivityAsync<string[]>(
            nameof(PlanResearchAgent), request.Topic);

        // Delegate to worker orchestrations in parallel
        var workerTasks = subtasks
            .Select(subtask => context.CallSubOrchestratorAsync<string>(
                nameof(ResearchWorkerOrchestration), subtask))
            .ToList();
        string[] results = await Task.WhenAll(workerTasks);

        // Synthesize results
        string finalReport = await context.CallActivityAsync<string>(
            nameof(SynthesizeAgent),
            new { request.Topic, Research = results });

        return finalReport;
    }
}
```

# [Python](#tab/python)

```python
def orchestrator_workers_orchestration(ctx: task.OrchestrationContext, request: dict) -> str:
    # Central orchestrator: determine what research is needed
    subtasks = yield ctx.call_activity(plan_research_agent, input=request["topic"])

    # Delegate to worker orchestrations in parallel
    worker_tasks = []
    for subtask in subtasks:
        worker_tasks.append(
            ctx.call_sub_orchestrator(research_worker_orchestration, input=subtask)
        )
    results = yield task.when_all(worker_tasks)

    # Synthesize results
    final_report = yield ctx.call_activity(synthesize_agent, input={
        "topic": request["topic"],
        "research": results
    })

    return final_report
```

# [JavaScript](#tab/javascript)

```typescript
const orchestratorWorkersOrchestration: TOrchestrator = async function* (
    ctx: OrchestrationContext, request: ResearchRequest): any {

    // Central orchestrator: determine what research is needed
    const subtasks: string[] = yield ctx.callActivity(planResearchAgent, request.topic);

    // Delegate to worker orchestrations in parallel
    const workerTasks = subtasks.map((subtask) =>
        ctx.callSubOrchestrator(researchWorkerOrchestration, subtask)
    );
    const results: string[] = yield whenAll(workerTasks);

    // Synthesize results
    const finalReport: string = yield ctx.callActivity(synthesizeAgent, {
        topic: request.topic,
        research: results,
    });

    return finalReport;
};
```

# [Java](#tab/java)

```java
ctx -> {
    ResearchRequest request = ctx.getInput(ResearchRequest.class);

    // Central orchestrator: determine what research is needed
    List<String> subtasks = ctx.callActivity(
        "PlanResearchAgent", request.getTopic(), List.class).await();

    // Delegate to worker orchestrations in parallel
    List<Task<String>> workerTasks = subtasks.stream()
        .map(subtask -> ctx.callSubOrchestrator(
            "ResearchWorkerOrchestration", subtask, String.class))
        .collect(Collectors.toList());
    List<String> results = ctx.allOf(workerTasks).await();

    // Synthesize results
    String finalReport = ctx.callActivity(
        "SynthesizeAgent", results, String.class).await();

    ctx.complete(finalReport);
}
```

---

::: zone-end

### Evaluator-optimizer

The _evaluator-optimizer_ pattern pairs a generator agent with an evaluator agent in a refinement loop. The generator produces output, the evaluator scores it against quality criteria and provides feedback, and the loop repeats until the output passes or a maximum iteration count is reached. Because each loop iteration is checkpointed, a crash after three successful rounds of refinement won't lose that progress.

This pattern is especially useful when quality can be measured programmatically — for example, validating that generated code compiles, or that a translation preserves named entities.

**When to use:** Code generation with automated review, literary translation, iterative content refinement, complex search tasks requiring multiple rounds of analysis.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[Function(nameof(EvaluatorOptimizerOrchestration))]
public async Task<string> EvaluatorOptimizerOrchestration(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var request = context.GetInput<ContentRequest>();
    int maxIterations = 5;
    string content = "";
    string feedback = "";

    for (int i = 0; i < maxIterations; i++)
    {
        // Generate or refine content
        content = await context.CallActivityAsync<string>(
            nameof(GenerateContentAgent),
            new { request.Prompt, PreviousContent = content, Feedback = feedback });

        // Evaluate quality
        var evaluation = await context.CallActivityAsync<EvaluationResult>(
            nameof(EvaluateContentAgent), content);

        if (evaluation.MeetsQualityBar)
            return content;

        feedback = evaluation.Feedback;
    }

    return content; // Return best effort after max iterations
}
```

# [Python](#tab/python)

```python
@app.orchestration_trigger(context_name="context")
def evaluator_optimizer_orchestration(context: df.DurableOrchestrationContext):
    request = context.get_input()
    max_iterations = 5
    content = ""
    feedback = ""

    for i in range(max_iterations):
        # Generate or refine content
        content = yield context.call_activity("generate_content_agent", {
            "prompt": request["prompt"],
            "previous_content": content,
            "feedback": feedback
        })

        # Evaluate quality
        evaluation = yield context.call_activity("evaluate_content_agent", content)

        if evaluation["meets_quality_bar"]:
            return content

        feedback = evaluation["feedback"]

    return content  # Return best effort after max iterations
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestration("evaluatorOptimizerOrchestration", function* (context) {
    const request = context.df.getInput();
    const maxIterations = 5;
    let content = "";
    let feedback = "";

    for (let i = 0; i < maxIterations; i++) {
        // Generate or refine content
        content = yield context.df.callActivity("generateContentAgent", {
            prompt: request.prompt,
            previousContent: content,
            feedback: feedback,
        });

        // Evaluate quality
        const evaluation = yield context.df.callActivity("evaluateContentAgent", content);

        if (evaluation.meetsQualityBar) {
            return content;
        }

        feedback = evaluation.feedback;
    }

    return content; // Return best effort after max iterations
});
```

# [Java](#tab/java)

```java
@FunctionName("EvaluatorOptimizerOrchestration")
public String evaluatorOptimizerOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    ContentRequest request = ctx.getInput(ContentRequest.class);
    int maxIterations = 5;
    String content = "";
    String feedback = "";

    for (int i = 0; i < maxIterations; i++) {
        // Generate or refine content
        content = ctx.callActivity("GenerateContentAgent",
            new GenerateInput(request.getPrompt(), content, feedback),
            String.class).await();

        // Evaluate quality
        EvaluationResult evaluation = ctx.callActivity(
            "EvaluateContentAgent", content, EvaluationResult.class).await();

        if (evaluation.meetsQualityBar()) {
            return content;
        }

        feedback = evaluation.getFeedback();
    }

    return content; // Return best effort after max iterations
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
[DurableTask]
public class EvaluatorOptimizerOrchestration : TaskOrchestrator<ContentRequest, string>
{
    public override async Task<string> RunAsync(
        TaskOrchestrationContext context, ContentRequest request)
    {
        int maxIterations = 5;
        string content = "";
        string feedback = "";

        for (int i = 0; i < maxIterations; i++)
        {
            // Generate or refine content
            content = await context.CallActivityAsync<string>(
                nameof(GenerateContentAgent),
                new { request.Prompt, PreviousContent = content, Feedback = feedback });

            // Evaluate quality
            var evaluation = await context.CallActivityAsync<EvaluationResult>(
                nameof(EvaluateContentAgent), content);

            if (evaluation.MeetsQualityBar)
                return content;

            feedback = evaluation.Feedback;
        }

        return content; // Return best effort after max iterations
    }
}
```

# [Python](#tab/python)

```python
def evaluator_optimizer_orchestration(ctx: task.OrchestrationContext, request: dict) -> str:
    max_iterations = 5
    content = ""
    feedback = ""

    for i in range(max_iterations):
        # Generate or refine content
        content = yield ctx.call_activity(generate_content_agent, input={
            "prompt": request["prompt"],
            "previous_content": content,
            "feedback": feedback
        })

        # Evaluate quality
        evaluation = yield ctx.call_activity(evaluate_content_agent, input=content)

        if evaluation["meets_quality_bar"]:
            return content

        feedback = evaluation["feedback"]

    return content  # Return best effort after max iterations
```

# [JavaScript](#tab/javascript)

```typescript
const evaluatorOptimizerOrchestration: TOrchestrator = async function* (
    ctx: OrchestrationContext, request: ContentRequest): any {

    const maxIterations = 5;
    let content = "";
    let feedback = "";

    for (let i = 0; i < maxIterations; i++) {
        // Generate or refine content
        content = yield ctx.callActivity(generateContentAgent, {
            prompt: request.prompt,
            previousContent: content,
            feedback: feedback,
        });

        // Evaluate quality
        const evaluation = yield ctx.callActivity(evaluateContentAgent, content);

        if (evaluation.meetsQualityBar) {
            return content;
        }

        feedback = evaluation.feedback;
    }

    return content; // Return best effort after max iterations
};
```

# [Java](#tab/java)

```java
ctx -> {
    ContentRequest request = ctx.getInput(ContentRequest.class);
    int maxIterations = 5;
    String content = "";
    String feedback = "";

    for (int i = 0; i < maxIterations; i++) {
        // Generate or refine content
        content = ctx.callActivity("GenerateContentAgent",
            new GenerateInput(request.getPrompt(), content, feedback),
            String.class).await();

        // Evaluate quality
        EvaluationResult evaluation = ctx.callActivity(
            "EvaluateContentAgent", content, EvaluationResult.class).await();

        if (evaluation.meetsQualityBar()) {
            ctx.complete(content);
            return;
        }

        feedback = evaluation.getFeedback();
    }

    ctx.complete(content); // Return best effort after max iterations
}
```

---

::: zone-end

## Agent loops

In a typical AI agent implementation, an LLM is invoked in a loop, calling tools and making decisions until the task is complete or a stopping condition is reached. Unlike deterministic workflows, the execution path isn't predefined. The agent determines what to do at each step based on results from previous steps.

Agent loops are well suited for tasks where the number or order of steps can't be predicted. Common examples include open-ended coding agents, autonomous research, and conversational bots with tool-calling capabilities.

There are two recommended approaches to implementing agent loops with the Durable Task programming model:

| Approach | Description | When to use |
| -------- | ----------- | ----------- |
| **Orchestration-based** | Write the agent loop as a durable orchestration. Tool calls are implemented as activities, and human input uses external events. The orchestration controls the loop structure while the LLM controls the decisions within it. | You need fine-grained control over the loop, per-tool retry policies, distributed load balancing of tool calls, or the ability to debug the loop in your IDE with breakpoints. |
| **Entity-based** | Each agent instance is a durable entity. The agent framework manages the loop internally, and the entity provides durable state and session persistence. | You're using an agent framework (like [Microsoft Agent Framework](/agent-framework/overview)) that already implements the agent loop and you want to add durability with minimal code changes. |

### Orchestration-based agent loops

An orchestration-based agent loop combines several Durable Task capabilities: [eternal orchestrations](../common/durable-task-eternal-orchestrations.md) (continue-as-new) to keep memory bounded, [fan-out/fan-in](../common/durable-task-fan-in-fan-out.md) for parallel tool execution, and [external events](../common/durable-task-external-events.md) for human-in-the-loop interactions. Each iteration of the loop:

1. Sends the current conversation context to the LLM via an activity or [stateful entity](../common/durable-task-entities.md).
1. Receives the LLM's response, which may include tool calls.
1. Executes any tool calls as activities (distributed across available compute).
1. Optionally waits for human input using external events.
1. Continues the loop with updated state, or completes when the agent signals it's done.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[Function(nameof(AgentLoopOrchestration))]
public async Task<string> AgentLoopOrchestration(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    // Get state from input (supports continue-as-new)
    var state = context.GetInput<AgentState>() ?? new AgentState();

    int maxIterations = 100;
    while (state.Iteration < maxIterations)
    {
        // Send conversation history to the LLM
        var llmResponse = await context.CallActivityAsync<LlmResponse>(
            nameof(CallLlmAgent), state.Messages);

        state.Messages.Add(llmResponse.Message);

        // If the LLM returned tool calls, execute them in parallel
        if (llmResponse.ToolCalls is { Count: > 0 })
        {
            var toolTasks = llmResponse.ToolCalls
                .Select(tc => context.CallActivityAsync<ToolResult>(
                    nameof(ExecuteTool), tc))
                .ToList();
            ToolResult[] toolResults = await Task.WhenAll(toolTasks);

            foreach (var result in toolResults)
                state.Messages.Add(result.ToMessage());
        }
        // If the LLM needs human input, wait for it
        else if (llmResponse.NeedsHumanInput)
        {
            string humanInput = await context.WaitForExternalEvent<string>("HumanInput");
            state.Messages.Add(new Message("user", humanInput));
        }
        // LLM is done
        else
        {
            return llmResponse.FinalAnswer;
        }

        state.Iteration++;

        // Periodically continue-as-new to keep the history bounded
        if (state.Iteration % 10 == 0)
        {
            context.ContinueAsNew(state);
            return null!; // Orchestration will restart with updated state
        }
    }

    return "Max iterations reached.";
}
```

# [Python](#tab/python)

```python
@app.orchestration_trigger(context_name="context")
def agent_loop_orchestration(context: df.DurableOrchestrationContext):
    # Get state from input (supports continue-as-new)
    state = context.get_input() or {"messages": [], "iteration": 0}

    max_iterations = 100
    while state["iteration"] < max_iterations:
        # Send conversation history to the LLM
        llm_response = yield context.call_activity("call_llm_agent", state["messages"])

        state["messages"].append(llm_response["message"])

        # If the LLM returned tool calls, execute them
        if llm_response.get("tool_calls"):
            tool_tasks = [
                context.call_activity("execute_tool", tc)
                for tc in llm_response["tool_calls"]
            ]
            tool_results = yield context.task_all(tool_tasks)

            for result in tool_results:
                state["messages"].append(result)

        # If the LLM needs human input, wait for it
        elif llm_response.get("needs_human_input"):
            human_input = yield context.wait_for_external_event("HumanInput")
            state["messages"].append({"role": "user", "content": human_input})

        # LLM is done
        else:
            return llm_response["final_answer"]

        state["iteration"] += 1

        # Periodically continue-as-new to keep the history bounded
        if state["iteration"] % 10 == 0:
            context.continue_as_new(state)
            return

    return "Max iterations reached."
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestration("agentLoopOrchestration", function* (context) {
    // Get state from input (supports continue-as-new)
    const state = context.df.getInput() || { messages: [], iteration: 0 };

    const maxIterations = 100;
    while (state.iteration < maxIterations) {
        // Send conversation history to the LLM
        const llmResponse = yield context.df.callActivity("callLlmAgent", state.messages);

        state.messages.push(llmResponse.message);

        // If the LLM returned tool calls, execute them
        if (llmResponse.toolCalls && llmResponse.toolCalls.length > 0) {
            const toolTasks = llmResponse.toolCalls.map((tc) =>
                context.df.callActivity("executeTool", tc)
            );
            const toolResults = yield context.df.Task.all(toolTasks);

            for (const result of toolResults) {
                state.messages.push(result);
            }
        // If the LLM needs human input, wait for it
        } else if (llmResponse.needsHumanInput) {
            const humanInput = yield context.df.waitForExternalEvent("HumanInput");
            state.messages.push({ role: "user", content: humanInput });
        // LLM is done
        } else {
            return llmResponse.finalAnswer;
        }

        state.iteration++;

        // Periodically continue-as-new to keep the history bounded
        if (state.iteration % 10 === 0) {
            context.df.continueAsNew(state);
            return;
        }
    }

    return "Max iterations reached.";
});
```

# [Java](#tab/java)

```java
@FunctionName("AgentLoopOrchestration")
public String agentLoopOrchestration(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    // Get state from input (supports continue-as-new)
    AgentState state = ctx.getInput(AgentState.class);
    if (state == null) state = new AgentState();

    int maxIterations = 100;
    while (state.getIteration() < maxIterations) {
        // Send conversation history to the LLM
        LlmResponse llmResponse = ctx.callActivity(
            "CallLlmAgent", state.getMessages(), LlmResponse.class).await();

        state.getMessages().add(llmResponse.getMessage());

        // If the LLM returned tool calls, execute them
        if (llmResponse.getToolCalls() != null && !llmResponse.getToolCalls().isEmpty()) {
            List<Task<ToolResult>> toolTasks = llmResponse.getToolCalls().stream()
                .map(tc -> ctx.callActivity("ExecuteTool", tc, ToolResult.class))
                .collect(Collectors.toList());
            List<ToolResult> toolResults = ctx.allOf(toolTasks).await();

            for (ToolResult result : toolResults) {
                state.getMessages().add(result.toMessage());
            }
        // If the LLM needs human input, wait for it
        } else if (llmResponse.needsHumanInput()) {
            String humanInput = ctx.waitForExternalEvent("HumanInput", String.class).await();
            state.getMessages().add(new Message("user", humanInput));
        // LLM is done
        } else {
            return llmResponse.getFinalAnswer();
        }

        state.incrementIteration();

        // Periodically continue-as-new to keep the history bounded
        if (state.getIteration() % 10 == 0) {
            ctx.continueAsNew(state);
            return null;
        }
    }

    return "Max iterations reached.";
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
[DurableTask]
public class AgentLoopOrchestration : TaskOrchestrator<AgentState, string>
{
    public override async Task<string> RunAsync(
        TaskOrchestrationContext context, AgentState? state)
    {
        state ??= new AgentState();

        int maxIterations = 100;
        while (state.Iteration < maxIterations)
        {
            // Send conversation history to the LLM
            var llmResponse = await context.CallActivityAsync<LlmResponse>(
                nameof(CallLlmAgent), state.Messages);

            state.Messages.Add(llmResponse.Message);

            // If the LLM returned tool calls, execute them
            if (llmResponse.ToolCalls is { Count: > 0 })
            {
                var toolTasks = llmResponse.ToolCalls
                    .Select(tc => context.CallActivityAsync<ToolResult>(
                        nameof(ExecuteTool), tc))
                    .ToList();
                ToolResult[] toolResults = await Task.WhenAll(toolTasks);

                foreach (var result in toolResults)
                    state.Messages.Add(result.ToMessage());
            }
            // If the LLM needs human input, wait for it
            else if (llmResponse.NeedsHumanInput)
            {
                string humanInput = await context.WaitForExternalEvent<string>("HumanInput");
                state.Messages.Add(new Message("user", humanInput));
            }
            // LLM is done
            else
            {
                return llmResponse.FinalAnswer;
            }

            state.Iteration++;

            // Periodically continue-as-new to keep the history bounded
            if (state.Iteration % 10 == 0)
            {
                context.ContinueAsNew(state);
                return null!;
            }
        }

        return "Max iterations reached.";
    }
}
```

# [Python](#tab/python)

```python
def agent_loop_orchestration(ctx: task.OrchestrationContext, state: dict | None) -> str:
    if state is None:
        state = {"messages": [], "iteration": 0}

    max_iterations = 100
    while state["iteration"] < max_iterations:
        # Send conversation history to the LLM
        llm_response = yield ctx.call_activity(call_llm_agent, input=state["messages"])

        state["messages"].append(llm_response["message"])

        # If the LLM returned tool calls, execute them
        if llm_response.get("tool_calls"):
            tool_tasks = [
                ctx.call_activity(execute_tool, input=tc)
                for tc in llm_response["tool_calls"]
            ]
            tool_results = yield task.when_all(tool_tasks)

            for result in tool_results:
                state["messages"].append(result)

        # If the LLM needs human input, wait for it
        elif llm_response.get("needs_human_input"):
            human_input = yield ctx.wait_for_external_event("HumanInput")
            state["messages"].append({"role": "user", "content": human_input})

        # LLM is done
        else:
            return llm_response["final_answer"]

        state["iteration"] += 1

        # Periodically continue-as-new to keep the history bounded
        if state["iteration"] % 10 == 0:
            ctx.continue_as_new(state)
            return

    return "Max iterations reached."
```

# [JavaScript](#tab/javascript)

```typescript
const agentLoopOrchestration: TOrchestrator = async function* (
    ctx: OrchestrationContext, state: AgentState | null): any {

    if (!state) state = { messages: [], iteration: 0 };

    const maxIterations = 100;
    while (state.iteration < maxIterations) {
        // Send conversation history to the LLM
        const llmResponse = yield ctx.callActivity(callLlmAgent, state.messages);

        state.messages.push(llmResponse.message);

        // If the LLM returned tool calls, execute them
        if (llmResponse.toolCalls && llmResponse.toolCalls.length > 0) {
            const toolTasks = llmResponse.toolCalls.map((tc: any) =>
                ctx.callActivity(executeTool, tc)
            );
            const toolResults = yield whenAll(toolTasks);

            for (const result of toolResults) {
                state.messages.push(result);
            }
        // If the LLM needs human input, wait for it
        } else if (llmResponse.needsHumanInput) {
            const humanInput: string = yield ctx.waitForExternalEvent("HumanInput");
            state.messages.push({ role: "user", content: humanInput });
        // LLM is done
        } else {
            return llmResponse.finalAnswer;
        }

        state.iteration++;

        // Periodically continue-as-new to keep the history bounded
        if (state.iteration % 10 === 0) {
            ctx.continueAsNew(state);
            return;
        }
    }

    return "Max iterations reached.";
};
```

# [Java](#tab/java)

```java
ctx -> {
    AgentState state = ctx.getInput(AgentState.class);
    if (state == null) state = new AgentState();

    int maxIterations = 100;
    while (state.getIteration() < maxIterations) {
        // Send conversation history to the LLM
        LlmResponse llmResponse = ctx.callActivity(
            "CallLlmAgent", state.getMessages(), LlmResponse.class).await();

        state.getMessages().add(llmResponse.getMessage());

        // If the LLM returned tool calls, execute them
        if (llmResponse.getToolCalls() != null && !llmResponse.getToolCalls().isEmpty()) {
            List<Task<ToolResult>> toolTasks = llmResponse.getToolCalls().stream()
                .map(tc -> ctx.callActivity("ExecuteTool", tc, ToolResult.class))
                .collect(Collectors.toList());
            List<ToolResult> toolResults = ctx.allOf(toolTasks).await();

            for (ToolResult result : toolResults) {
                state.getMessages().add(result.toMessage());
            }
        // If the LLM needs human input, wait for it
        } else if (llmResponse.needsHumanInput()) {
            String humanInput = ctx.waitForExternalEvent("HumanInput", String.class).await();
            state.getMessages().add(new Message("user", humanInput));
        // LLM is done
        } else {
            ctx.complete(llmResponse.getFinalAnswer());
            return;
        }

        state.incrementIteration();

        // Periodically continue-as-new to keep the history bounded
        if (state.getIteration() % 10 == 0) {
            ctx.continueAsNew(state);
            return;
        }
    }

    ctx.complete("Max iterations reached.");
}
```

---

::: zone-end

### Entity-based agent loops

If you're using an agent framework that already implements its own agent loop, you can wrap it in a [durable entity](../common/durable-task-entities.md) to add durability without rewriting the loop logic. Each entity instance represents a single agent session. The entity receives messages, delegates to the agent framework internally, and persists conversation state across interactions.

The key advantage of this approach is simplicity: you write your agent using your preferred framework and add durability as a hosting concern rather than redesigning the agent's control flow. The entity acts as a durable wrapper, handling session persistence and recovery automatically.

The following examples show how to wrap an existing agent SDK as a durable entity. The entity exposes a `message` operation that clients call to send user input. Internally, the entity delegates to the agent framework, which manages its own tool-calling loop.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
// Define the entity that wraps an existing agent SDK
public class ChatAgentEntity : TaskEntity<ChatAgentState>
{
    private readonly IChatClient _chatClient;

    public ChatAgentEntity(IChatClient chatClient)
    {
        _chatClient = chatClient;
    }

    // Called by clients to send a message to the agent
    public async Task<string> Message(string userMessage)
    {
        // Add the user message to the conversation history
        State.Messages.Add(new ChatMessage(ChatRole.User, userMessage));

        // Delegate to the agent SDK for the LLM call (with tool loop)
        ChatResponse response = await _chatClient.GetResponseAsync(
            State.Messages, State.Options);

        // Persist the response in the entity state
        State.Messages.AddRange(response.Messages);

        return response.Text;
    }

    // Azure Functions entry point for the entity
    [Function(nameof(ChatAgentEntity))]
    public Task RunEntityAsync([EntityTrigger] TaskEntityDispatcher dispatcher)
    {
        return dispatcher.DispatchAsync<ChatAgentEntity>();
    }
}
```

# [Python](#tab/python)

```python
# Define the entity that wraps an existing agent SDK
@app.entity_trigger(context_name="context")
def chat_agent_entity(context):
    # Load persisted conversation state
    state = context.get_state(lambda: {"messages": []})

    if context.operation_name == "message":
        user_message = context.get_input()

        # Add the user message to the conversation history
        state["messages"].append({"role": "user", "content": user_message})

        # Delegate to the agent SDK for the LLM call (with tool loop)
        response = call_agent_sdk(state["messages"])

        # Persist the response in the entity state
        state["messages"].append({"role": "assistant", "content": response})
        context.set_state(state)

        context.set_result(response)
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

// Define the entity that wraps an existing agent SDK
const chatAgentEntity = async function (context) {
    // Load persisted conversation state
    let state = context.df.getState(() => ({ messages: [] }));

    switch (context.df.operationName) {
        case "message":
            const userMessage = context.df.getInput();

            // Add the user message to the conversation history
            state.messages.push({ role: "user", content: userMessage });

            // Delegate to the agent SDK for the LLM call (with tool loop)
            const response = await callAgentSdk(state.messages);

            // Persist the response in the entity state
            state.messages.push({ role: "assistant", content: response });
            context.df.setState(state);

            context.df.return(response);
            break;
    }
};
df.app.entity("ChatAgent", chatAgentEntity);
```

# [Java](#tab/java)

> [!NOTE]
> Durable entities in Java require version 1.9.0 or later of the `durabletask-azure-functions` and `durabletask-client` packages.

```java
// Define the entity that wraps an existing agent SDK
public class ChatAgentEntity extends AbstractTaskEntity<ChatAgentState> {

    // Called by clients to send a message to the agent
    public String message(String userMessage) {
        // Add the user message to the conversation history
        this.state.getMessages().add(new ChatMessage("user", userMessage));

        // Delegate to the agent SDK for the LLM call (with tool loop)
        String response = callAgentSdk(this.state.getMessages());

        // Persist the response in the entity state
        this.state.getMessages().add(new ChatMessage("assistant", response));

        return response;
    }

    @Override
    protected ChatAgentState initializeState(TaskEntityOperation operation) {
        return new ChatAgentState();
    }
}

// Register the entity with Azure Functions
@FunctionName("ChatAgent")
public String chatAgentEntity(
        @DurableEntityTrigger(name = "req") String req) {
    return EntityRunner.loadAndRun(req, ChatAgentEntity::new);
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
// Define the entity that wraps an existing agent SDK
[DurableTask(Name = "ChatAgent")]
public class ChatAgentEntity : TaskEntity<ChatAgentState>
{
    private readonly IChatClient _chatClient;

    public ChatAgentEntity(IChatClient chatClient)
    {
        _chatClient = chatClient;
    }

    // Called by clients to send a message to the agent
    public async Task<string> Message(string userMessage)
    {
        // Add the user message to the conversation history
        State.Messages.Add(new ChatMessage(ChatRole.User, userMessage));

        // Delegate to the agent SDK for the LLM call (with tool loop)
        ChatResponse response = await _chatClient.GetResponseAsync(
            State.Messages, State.Options);

        // Persist the response in the entity state
        State.Messages.AddRange(response.Messages);

        return response.Text;
    }
}
```

# [Python](#tab/python)

```python
from durabletask.entities.durable_entity import DurableEntity

# Define the entity that wraps an existing agent SDK
class ChatAgentEntity(DurableEntity):
    """Durable entity wrapping an agent SDK."""

    def message(self, user_message: str) -> str:
        # Load persisted conversation state
        state = self.get_state(default={"messages": []})

        # Add the user message to the conversation history
        state["messages"].append({"role": "user", "content": user_message})

        # Delegate to the agent SDK for the LLM call (with tool loop)
        response = call_agent_sdk(state["messages"])

        # Persist the response in the entity state
        state["messages"].append({"role": "assistant", "content": response})
        self.set_state(state)

        return response
```

# [JavaScript](#tab/javascript)

```typescript
import { TaskEntity } from "@microsoft/durabletask-js";

// Define the entity that wraps an existing agent SDK
class ChatAgentEntity extends TaskEntity<ChatAgentState> {

    // Called by clients to send a message to the agent
    async message(userMessage: string): Promise<string> {
        // Add the user message to the conversation history
        this.state.messages.push({ role: "user", content: userMessage });

        // Delegate to the agent SDK for the LLM call (with tool loop)
        const response = await callAgentSdk(this.state.messages);

        // Persist the response in the entity state
        this.state.messages.push({ role: "assistant", content: response });

        return response;
    }

    initializeState(): ChatAgentState {
        return { messages: [] };
    }
}
```

# [Java](#tab/java)

> [!NOTE]
> Durable entities in Java require version 1.9.0 or later of the `durabletask-client` package.

```java
// Define the entity that wraps an existing agent SDK
public class ChatAgentEntity extends AbstractTaskEntity<ChatAgentState> {

    // Called by clients to send a message to the agent
    public String message(String userMessage) {
        // Add the user message to the conversation history
        this.state.getMessages().add(new ChatMessage("user", userMessage));

        // Delegate to the agent SDK for the LLM call (with tool loop)
        String response = callAgentSdk(this.state.getMessages());

        // Persist the response in the entity state
        this.state.getMessages().add(new ChatMessage("assistant", response));

        return response;
    }

    @Override
    protected ChatAgentState initializeState(TaskEntityOperation operation) {
        return new ChatAgentState();
    }
}
```

---

::: zone-end

The [Durable Task extension for Microsoft Agent Framework](./durable-agents-microsoft-agent-framework.md) uses this approach. It wraps Microsoft Agent Framework agents as durable entities, providing persistent sessions, automatic checkpointing, and built-in API endpoints with a single line of configuration.

## Next steps

- [Durable Task extension for Microsoft Agent Framework (Preview)](./durable-agents-microsoft-agent-framework.md)
- [Durable Task for AI agents](./durable-task-for-ai-agents.md)
- [Choose your hosting model](../common/choose-orchestration-framework.md)
- [Durable Task Scheduler overview](../scheduler/durable-task-scheduler.md)
