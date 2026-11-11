---
title: Advanced shared session patterns in Microsoft Discovery
description: Learn patterns for structuring shared sessions with the Microsoft Discovery Engine, from predefined task plans to guided exploration and open-ended research.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: concept-article
ms.date: 11/10/2026

#CustomerIntent: As a researcher or scientist, I want to understand advanced ways to structure my shared sessions so that I can match the level of autonomy to the complexity of my research.
---

# Advanced shared session patterns

Use these patterns to decide which tasks, dependencies, and agent assignments to define before starting the Discovery Engine. For task creation and engine prerequisites, see [Build shared sessions with cognition](how-to-build-investigations-cognition.md).

The [trust and basic shared session patterns](concept-trust-basic-investigation-patterns.md) article introduces the spectrum from structured tasks to broad objectives. Cognition is goal-seeking: it plans and adapts as work progresses. These patterns help you choose how much of the research plan to define yourself.

## Choosing the right pattern

| Pattern | Use when | Define upfront | Leave to cognition |
| --- | --- | --- | --- |
| [Deterministic shared session](#pattern-1-deterministic-shared-session) | You have a known protocol and fixed methods | Tasks, agents, dependencies, and per-task validation requirements | Execution, validation, and retries |
| [Guided exploration](#pattern-2-guided-exploration) | You know the research phases, but not each method | Phase-level parent tasks, phase dependencies, and deliverables | Child tasks and agent selection within each phase |
| [Autonomous research](#pattern-3-autonomous-research) | You have an objective but no predetermined approach | A root task and outcome requirements | Task decomposition, agent selection, and sequencing |

You can mix patterns: define data preparation tasks explicitly, then leave analysis methods to cognition.

## Pattern 1: Deterministic shared session

Use this pattern for a known protocol with fixed methods and quality gates.

Here, *deterministic* describes the predefined task plan. It doesn't guarantee identical model outputs or execution timing.

### How to set it up

1. Create all tasks before starting the engine.
2. Assign an available agent with the required tools to each task.
3. Set dependencies wherever a task needs another task's output.
4. Specify the method in the description and the expected output in the validation requirements.

### Example

```text
Parent: "Compare molecular weight and predicted solubility for 5 candidates"

  Task 1: "Retrieve molecular structures from PubChem"
    Depends on: (none)
    Validation: "Structures retrieved for all 5 candidates as SMILES strings"

  Task 2: "Compute molecular weights"
    Depends on: Task 1
    Validation: "Molecular weight computed for each candidate"
               "Results include values in g/mol and the calculation method"

  Task 3: "Predict solubility"
    Depends on: Task 1
    Validation: "Solubility predicted for all 5 candidates"
               "Results identify the model, units, and relevant limitations"

  Task 4: "Compare candidates and generate report"
    Depends on: Task 2, Task 3
    Validation: "Report compares molecular weight and predicted solubility"
               "Report distinguishes computed values from predictions"
```

### What cognition does in this pattern

Cognition coordinates task execution and evaluates results against your validation requirements. Use the execution history and validation comments to review each step. A dependency controls execution order; it doesn't by itself establish the quality of an upstream result.

### Considerations

- This pattern requires more upfront work to set up.
- Review outcomes before relying on downstream conclusions, especially when an upstream task fails or needs user attention.
- Reuse a task structure as a starting point for similar work, but review its methods, inputs, agents, and tools for the new session.

## Pattern 2: Guided exploration

Use this pattern when you know the phases and deliverables, but the methods within each phase can vary.

### How to set it up

1. Create a parent task for each phase and define its deliverable.
2. Set dependencies between phases that share inputs and outputs.
3. Leave child-task creation and agent selection to cognition.
4. Review the child tasks. Add guidance to the parent task if the methods or scope need to change.

### Example

```text
Phase 1: "Identify promising candidate compounds for [disease]"
  Depends on: (none)
  Validation: "At least 3 candidate compounds identified"
             "Each candidate includes supporting evidence from literature"

Phase 2: "Characterize binding properties of top candidates"
  Depends on: Phase 1
  Validation: "Binding properties assessed for all candidates from Phase 1"
             "Analysis includes at least binding affinity and selectivity"

Phase 3: "Recommend lead candidates with rationale"
  Depends on: Phase 2
  Validation: "Recommendation narrows to 1-2 lead candidates"
             "Rationale references binding data and target relevance"
```

### What cognition does in this pattern

Cognition breaks down the phase goals into smaller tasks and chooses from the available agents. Review the task tree and validation comments to determine if the work supports the phase-level deliverable.

### Considerations

- Write phase-level requirements that are specific enough to evaluate, while allowing different methods to satisfy them.
- Review child tasks regularly to ensure exploration stays within your intended scope.
- Use comments on the parent task to explain a change in direction or a constraint that the child tasks need to follow.

## Pattern 3: Autonomous research

Use this pattern for an open-ended objective without predetermined phases or methods. The available agents and tools determine which approaches cognition can pursue.

### How to set it up

1. Create a root task that states the objective, scope, and constraints.
2. Define the required outcome without prescribing each step.
3. Start the engine and review its task hierarchy as work progresses.
4. Use task comments to redirect exploration or add a task for a missing research direction.

### Example

```text
Root task: "Investigate the viability of repurposing existing
           antiviral compounds for [new disease target], considering
           binding mechanism, selectivity, and preliminary toxicity"

Validation: "The shared session covers at least 3 existing antiviral compounds"
           "Analysis includes binding mechanism characterization for each"
           "Preliminary toxicity assessment covers top candidates"
           "Final recommendation identifies the most promising candidate with rationale"
```

### What cognition does in this pattern

Cognition uses the root objective, available agents and tools, and intermediate results to plan further work. A broad objective gives it more planning decisions to make; it doesn't add capabilities that aren't available in the project.

### Considerations

- A vague objective makes it harder to judge whether the research meets your needs. State the scope, constraints, and evidence you expect in the final result.
- Review the task hierarchy as it grows and redirect unproductive branches through task comments or additional tasks.
- Evaluate the scientific evidence and limitations yourself. A completed task or a successful validation result doesn't establish that a conclusion is scientifically correct.

## Related content

- [Trust relationship and basic shared session patterns](concept-trust-basic-investigation-patterns.md)
- [Discovery Engine](concept-discovery-engine.md)
- [Cognition overview](concept-cognition-overview.md)
- [Tasks and shared sessions](concept-tasks-investigations.md)
- [Build shared sessions with cognition](how-to-build-investigations-cognition.md)
