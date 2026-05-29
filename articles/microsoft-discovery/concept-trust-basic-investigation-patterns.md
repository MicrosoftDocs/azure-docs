---
title: Trust relationship and basic investigation patterns in Microsoft Discovery
description: Learn how to calibrate the level of autonomy you give the Discovery Engine, how validation requirements shape cognition's behavior, and basic investigation patterns for getting started.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: concept-article
ms.date: 03/30/2026

#CustomerIntent: As a researcher or scientist, I want to understand how to set up tasks and validation requirements so that the Discovery Engine produces results I can trust.
---

# Trust relationship and basic investigation patterns

Working with the [Discovery Engine](concept-discovery-engine.md) is a collaboration. You set direction and define what success looks like. [Cognition](concept-cognition-overview.md) handles the execution. The quality of this collaboration depends on how clearly you express your expectations and how much structure you provide.

This article covers how validation requirements shape cognition's behavior, how to calibrate the level of detail in your tasks, and the basic investigation patterns for getting started.

## The role of validation requirements

Validation requirements are the single most important lever you have for guiding cognition's behavior. They tell cognition how to judge whether a task's result is good enough. Without them, cognition has no objective standard. With well-written requirements, cognition can evaluate quality, reject insufficient results, and retry until the work meets your criteria.

### What happens when validation requirements are too loose

If your validation requirements are vague or absent, cognition tends to accept the first result an agent produces. The task moves to Complete quickly, but the result might not meet your actual expectations.

Example of a loose requirement:

> "Provide a good answer."

Cognition has no way to evaluate what "good" means in your context. The agent's response passes validation because there's nothing concrete to fail against. You end up reviewing results manually to determine quality, which defeats the purpose of autonomous execution.

### What happens when validation requirements are too strict

If your validation requirements are overly specific or demand precision that the agent can't reliably deliver, cognition retries the task repeatedly. Each attempt produces a result that doesn't quite pass, leading to multiple execution cycles. Eventually, cognition flags the task as Needs User Attention because it can't produce a result that satisfies all requirements.

Example of an overly strict requirement:

> "Results must include binding affinity values accurate to 0.01 kcal/mol with experimental validation references for each prediction."

If the available tools or models can't produce that level of precision, every attempt fails validation. Cognition keeps trying different approaches, consuming time, and compute resources without progress.

### Finding the right balance

Effective validation requirements are specific enough to distinguish good work from bad, but flexible enough that a capable agent can meet them.

Guidelines for writing validation requirements:

- **State what the result should contain**, not how the agent should produce it. "Results include solubility predictions for all five candidate molecules" is better than "Use the Graphormer tool to predict solubility."
- **Focus on verifiable criteria**. "Analysis covers at least three molecular properties" is verifiable. "Analysis is thorough" isn't.
- **Match the precision to what's achievable**. If you're using predictive models, don't require experimental-grade accuracy in the validation criteria.
- **Use multiple requirements for complex tasks**. Break quality criteria into separate requirements so cognition can report which passed and which failed. This helps you understand what's working and what needs adjustment.
- **Iterate based on results**. After reviewing a completed task, refine the validation requirements for similar future tasks. Your understanding of what "good enough" means evolves as the investigation progresses.

### Example: well-calibrated validation requirements

Task: "Predict solubility and reduction potential for three candidate molecules using Graphormer"

Validation requirements:
1. "The result includes predictions for all three candidate molecules."
2. "Each prediction includes both solubility (logS) and reduction potential values."
3. "Results are presented in a structured format with molecule identifiers."

These requirements are specific (all three molecules, both properties, structured format) but achievable (they don't demand specific accuracy thresholds that the model might not support).

## Levels of structure

How much structure you put into your tasks determines how much cognition needs to figure out on its own. Think of this as a spectrum from high autonomy (you provide broad goals, cognition handles everything) to high structure (you define each step, cognition executes and validates).

There's no explicit setting to choose a trust level or autonomy mode. You express your choice through how you set up your investigation. If you create a single broad task, cognition takes ownership of planning and decomposition. If you create multiple tasks and dependencies, cognition follows your structure. You can also start structured and loosen control as you gain confidence, or tighten control if cognition isn't heading in the right direction.

### Broad objectives with minimal structure

You provide a single high-level task with general validation requirements. Cognition decomposes it into subtasks, selects agents, and manages the entire investigation.

**When to use this approach:**
- You're exploring a new problem area and don't know the right steps yet
- You want to see what approaches cognition discovers
- The problem is broad enough that multiple valid paths exist

**What to expect:**
- Cognition creates subtasks that you didn't explicitly define
- The decomposition might not match how you would have broken down the work
- Results from early tasks inform what cognition tries next
- You want to review periodically and redirect if cognition goes in an unhelpful direction

**Example:**
> Task: "Investigate the binding mechanism of compound X with target protein Y and identify structural modifications that could improve binding affinity."
>
> Validation: "Analysis identifies at least 3 key interactions in the binding mechanism" and "At least 2 structural modifications are proposed with rationale."

### Structured tasks with dependencies

You create the task hierarchy yourself: parent tasks for major phases, child tasks for specific steps, dependencies to control execution order, and detailed validation requirements for each task.

**When to use this approach:**
- You know the steps required and want to ensure they're followed
- The investigation has clear phases that depend on each other
- You want to assign specific agents to specific tasks
- Quality at each step matters and you want validation checkpoints throughout

**What to expect:**
- Cognition follows the structure you've defined
- Tasks execute in the order you've specified through dependencies
- Validation happens at each step, not just at the end
- Cognition still handles agent execution, error recovery, and retries within the structure you've set
- If a task fails validation, cognition retries it before moving to dependent tasks

**Example:**
```
Parent: "Characterize target molecule and identify improved analogs"
  Task 1: "Retrieve molecular structure from PubChem" (no dependencies)
  Task 2: "Compute molecular properties using RDKit" (depends on Task 1)
  Task 3: "Predict solubility using Graphormer" (depends on Task 1)
  Task 4: "Rank candidates by combined criteria" (depends on Tasks 2 and 3)
```

Each task has its own validation requirements. Tasks 2 and 3 run in parallel after Task 1 completes. Task 4 waits for both.

### Hybrid approach

In practice, most investigations use a mix. You might structure the major phases yourself but let cognition decompose specific phases into subtasks. Or you might start broad, review the subtasks cognition creates, and add structure where needed.

This is often the most effective approach. You bring domain knowledge about the right overall investigation structure, and cognition handles the tactical execution within each phase.

## Getting started: your first investigation

If you're using the Discovery Engine for the first time, start with a simple, structured investigation to build familiarity with how cognition works before moving to broader objectives.

### Step 1: Create a small investigation

Start with a focused objective that has 2-4 clear steps. This lets you see the full task lifecycle (New, Executing, Validating, Complete) without waiting hours for results.

### Step 2: Write specific validation requirements

For your first investigation, err on the side of specific rather than broad. You want to see cognition evaluate results against your criteria so you understand how validation works.

### Step 3: Enable Discovery Mode and observe

Watch how cognition selects agents, sequences tasks, and handles validation. Don't intervene unless something is clearly wrong. This builds your intuition for how much guidance cognition needs.

### Step 4: Review and adjust

After the investigation completes, review:
- Did cognition follow the task structure you set?
- Were the validation requirements effective, or did they cause unnecessary retries?
- Were the right agents assigned to each task?

Use what you learn to calibrate your next investigation.

## Adjusting trust over time

As you gain experience with the Discovery Engine, you develop a sense for how much structure different types of work need. Some patterns to keep in mind:

- **Well-understood investigations** with known steps benefit from more structure. You know the path, so define it. Let cognition handle execution and validation.
- **Exploratory research** with open-ended objectives benefits from less structure. Give cognition room to explore and check in periodically.
- **Mixed investigations** where some phases are well-understood and others are exploratory benefit from the hybrid approach. Structure what you know, delegate what you don't.
- **Validation requirements** should get more precise as you learn what the agents and tools can deliver. Start general, refine based on results.

## Related content

- [Discovery Engine](concept-discovery-engine.md)
- [Cognition overview](concept-cognition-overview.md)
- [Tasks and investigations](concept-tasks-investigations.md)
- [Advanced investigation patterns](concept-advanced-investigation-patterns.md)
- [Build investigations with cognition](how-to-build-investigations-cognition.md)
