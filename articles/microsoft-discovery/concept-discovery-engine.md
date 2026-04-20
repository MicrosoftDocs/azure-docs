---
title: Discovery Engine overview in Microsoft Discovery
description: Learn about the Discovery Engine, the cognitive backbone of Microsoft Discovery that autonomously plans, executes, and manages complex scientific research through tasks and continuous reasoning.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: concept-article
ms.date: 03/30/2026

#CustomerIntent: As a researcher or scientist, I want to understand what the Discovery Engine is so that I can use it to delegate and manage long-running scientific research.
---

# Discovery Engine

The Discovery Engine is the cognitive backbone of Microsoft Discovery. It operates as an autonomous research partner that plans work, delegates to specialized agents, monitors progress, and adapts when results come back differently than expected. Instead of responding to individual prompts in a chat window, the engine runs continuously in the background while you focus on the scientific decisions that matter most.

Traditional AI assistants work in a question-and-answer cycle. You ask, they respond, and the conversation ends. The Discovery Engine works differently. You describe an objective, whether that's a single sentence or a detailed research plan. The engine takes responsibility for breaking it down, executing it, and reporting back. This process unfolds over hours and days, not seconds, and minutes.

## How the engine is structured

The Discovery Engine is organized around two components that work together: **cognition** and **tasks**.

### Cognition

Cognition is the reasoning process that runs continuously while the engine is active. It maintains awareness of your overall objectives and decides what to work on next. It selects the right agents and tools for each piece of work, and responds to your feedback as you review progress.

When you enable Discovery Mode, the Discovery Engine begins a continuous cycle:

1. Reviews the current state of all tasks in your investigation
1. Identifies which tasks are ready to start based on their dependencies
1. Selects the best available agent for each task
1. Starts task execution and monitors the results
1. Validates completed work against the success criteria you defined
1. Creates new tasks when it identifies gaps or opportunities
1. Incorporates your comments and modifications into its ongoing planning

Cognition doesn't just execute a fixed plan. It adapts. If a tool returns unexpected results, cognition reconsiders its approach. If you add a comment to a task with more context, cognition factors that into its next decision. After multiple failed attempts, cognition escalates the task for your review.

For a deeper look at how cognition works, see [Cognition overview](concept-cognition-overview.md).

### Tasks

Tasks are how you define the work you want the Discovery Engine to carry out. Each task captures what needs to be accomplished, why it matters, and how to measure success. Tasks provide the structure that cognition uses to organize and sequence work.

A task includes:

- **Title and description**: What needs to be done, with enough context for an agent to understand the objective.
- **Validation requirements**: Specific criteria that define what a successful result looks like. Cognition uses these criteria to judge whether a completed task actually meets your expectations. Without them, cognition has no objective standard for evaluating results.
- **Dependencies**: Relationships to other tasks that must complete first. Cognition uses these relationships to sequence work intelligently.
- **Status**: The current state of the task as it moves through its lifecycle. See [Task status lifecycle](concept-tasks-investigations.md#task-status-lifecycle) for the full set of task statuses and their meanings.
- **Result**: The output produced when the task is done. The result becomes available to dependent tasks.

Every task should have at minimum a title, a description, and at least one validation requirement. The title and description tell cognition *what* to do. The validation requirements tell it *when the work meets your standard*. Without validation requirements, cognition still executes the task but has no way to objectively assess the result. Missing requirements can lead to tasks that pass without meaningful quality checks, or tasks that cycle through repeated execution.

For task structure details and best practices, see [Tasks and investigations](concept-tasks-investigations.md).

## How the engine works in practice

Working with the Discovery Engine follows a collaborative cycle. You set direction, the engine executes, and you check in periodically to review and redirect.

### 1. Define your objective

Start by creating one or more tasks in your investigation. Tasks can be high-level objectives that cognition breaks down further, or specific steps you already decomposed. For example:

> "Identify existing drugs that treat [disease] and their activation pathways. Use each active compound to explore variants with higher protein binding affinity and lower projected immune response. For the most promising candidates, plan a retrosynthesis pathway for lab formulation."

This single objective involves multiple knowledge domains, requires coordinating several tools, and produces intermediate results that inform later steps. It's a natural fit for the engine.

### 2. Enable Discovery Mode

> [!IMPORTANT]
> Before enabling Discovery Mode, ensure your workspace has a chat model deployment named `gpt-5-2` (model: `gpt-5.2`). The Discovery Engine requires this model for task validation. Without it, the engine doesn't start. See [Create Chat Model Deployment](quickstart-infrastructure-portal.md#5-create-chat-model-deployment) for setup instructions.

When you turn on Discovery Mode, the Discovery Engine begins a continuous cycle:

### 3. Let it run

Step away. Check back in a few hours. The engine works without your constant presence. Cognition handles agent selection, tool execution, error recovery, and task sequencing. Much like delegating to a capable colleague, the engine finds and follows paths of opportunity on your behalf.

### 4. Review and redirect

When you return, check the investigation dashboard. You see:

- Completed tasks with their results and validation outcomes
- Tasks currently executing and which agents are working on them
- Any tasks that were flagged for your attention because cognition couldn't resolve them

Add comments to steer work in a new direction. Modify validation requirements if results are close but not right. Create new tasks based on what you learn from completed work.

### 5. Iterate

The cycle continues until your objectives are met. Cognition doesn't just run a fixed sequence. It responds to the evolving state of the investigation, including your feedback and any new tasks you add along the way.

## Choosing when to use the engine

The Discovery Engine is purpose-built for problems that are complex, open-ended, and long-running. Not every research question calls for it.

### Good fit for the engine

Problems that work well with the engine share several characteristics:

- **Multi-step with dependencies**: The work naturally breaks into pieces where later steps depend on earlier results.
- **Open-ended exploration**: You know the goal but not the exact path. Multiple approaches might work, and the engine can explore them.
- **Long duration**: The work takes hours or days, not minutes. You benefit from delegating rather than staying engaged the entire time.
- **Multiple tools and knowledge domains**: The work requires coordinating databases, simulations, analysis tools, and different types of expertise.

### Better suited for direct interaction

Some questions are better handled through direct chat with an agent or through Ask Mode:

- Single, specific questions with known answers ("What is the reduction potential of compound X?")
- Tasks where you need an immediate response
- Work where you want to control every step interactively
- Simple lookups or calculations that complete in one exchange

## Resource orchestration

When cognition executes tasks, it draws on the full Microsoft Discovery platform:

- **[Agents](concept-discovery-agent.md)**: Specialized AI systems that execute specific types of work. Cognition selects the agent whose capabilities best match each task. An agent is associated to the best model for the type of work required. 
- **Tools**: Containerized executables that run on the [supercomputer](how-to-manage-supercomputers.md) for computation, data processing, and analysis. Tools handle work that requires specialized software or significant compute resources.
- **[Bookshelf](concept-bookshelf-knowledge-bases.md)**: Knowledge bases built from your documents and scientific literature. Agents query bookshelves to ground their reasoning in relevant context.

You configure these resources when you set up your workspace and project. Cognition then orchestrates them automatically based on what each task requires.

## Collaboration patterns

The engine supports different levels of autonomy depending on how much structure you provide:

**Full delegation**: You describe a broad objective and let cognition handle decomposition and execution. Best for exploratory work where you want to see what the engine discovers. You review results periodically and provide strategic guidance.

**Structured delegation**: You break work into specific tasks with assigned agents, defined dependencies, and validation requirements. Cognition handles execution and sequencing but follows the structure you define. Best when you know the approach and want reliable execution.

**Parallel work**: You work on some tasks while cognition handles others. When you complete a task manually or add intermediate results, cognition sees your contributions and incorporates them into its planning.

For practical guidance on setting up each pattern, see [Build investigations with cognition](how-to-build-investigations-cognition.md).

## Best practices

**Do:**

- Start with clear objectives that describe outcomes, not procedures. Let cognition figure out how to get there.
- Add validation requirements to your tasks. Without them, cognition has no way to judge when work meets your standards.
- Check in periodically, every few hours for active investigations. Your feedback keeps the work on track.
- Trust autonomous exploration. Cognition might try approaches you wouldn't consider.

**Avoid:**

- Specifying every step in advance *and* expecting the engine to just run them sequentially. Even when you know the steps, the engine adds value through validation and quality feedback loops. What you want to avoid is treating the engine as a simple task runner. Its strength is adapting when intermediate results don't meet your validation requirements, retrying with a different approach, or flagging work for your review. If your investigation is purely sequential with no need for quality gates or iteration, direct agent interaction might be faster.
- Watching task execution in real time. The engine supports asynchronous collaboration, not interactive monitoring.
- Creating tasks that are too broad ("solve cancer") or too narrow ("look up PubChem ID 12345"). Find the middle ground where tasks are specific enough to validate but broad enough for cognition to plan execution.

## Related content

- [Cognition overview](concept-cognition-overview.md)
- [Tasks and investigations](concept-tasks-investigations.md)
- [Build investigations with cognition](how-to-build-investigations-cognition.md)
- [Debug task execution](how-to-debug-task-execution.md)
