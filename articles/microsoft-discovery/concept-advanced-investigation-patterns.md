---
title: Advanced investigation patterns in Microsoft Discovery
description: Learn advanced patterns for structuring investigations with the Discovery Engine, including fully deterministic investigations, guided exploration, and fully autonomous research.
author: hectoralinares
ms.author: hectorl
ms.service: azure
ms.topic: concept-article
ms.date: 03/30/2026

#CustomerIntent: As a researcher or scientist, I want to understand advanced ways to structure my investigations so that I can match the level of autonomy to the complexity of my research.
---

# Advanced investigation patterns

The [trust and basic investigation patterns](concept-trust-basic-investigation-patterns.md) article introduced the spectrum from structured tasks to broad objectives. This article goes deeper into three advanced patterns that represent distinct approaches to working with the [Discovery Engine](concept-discovery-engine.md). Cognition is goal-seeking, it continuously plans, executes, and adapts to drive an investigation toward its research objective, each pattern represents a different way to balance your control against cognition's autonomy. The right pattern depends on how well you understand the problem upfront.

## Pattern 1: Deterministic investigation

In a deterministic investigation, you define every task, assign specific agents, set up all dependencies, and write detailed validation requirements. Cognition's role is execution, validation, and retry management. You control the *what* and *how*. Cognition handles the *when* and *whether it's good enough*.

### When to use this pattern

- You have a known, repeatable protocol (for example, a molecular screening pipeline)
- You want consistent, reproducible results across investigations
- The agents and tools for each step are well understood
- Quality gates between steps are critical

### How to set it up

1. **Create all tasks upfront** with titles, descriptions, and validation requirements.
2. **Set dependencies** so tasks execute in the correct order. Tasks without dependencies can run in parallel.
3. **Guide agent selection** for each task by adding a comment that specifies which agent to use and why. Cognition reads comments when selecting agents. If you leave no guidance, cognition selects the agent based on its assessment of capabilities.
4. **Write detailed validation requirements** for each task. In a deterministic investigation, validation requirements are your quality gates. Be specific about what each step should produce.

### Example

```
Parent: "Screen 5 candidate molecules for drug target Y"

  Task 1: "Retrieve molecular structures from PubChem"
    Agent: blastAgent
    Depends on: (none)
    Validation: "Structures retrieved for all 5 candidates in FASTA format"

  Task 2: "Compute binding affinity predictions"
    Agent: graphormerAgent
    Depends on: Task 1
    Validation: "Binding affinity predicted for each candidate with target Y"
               "Results include predicted energy values in kcal/mol"

  Task 3: "Compute ADMET properties"
    Agent: rdkbasicAgent
    Depends on: Task 1
    Validation: "ADMET profile computed for all 5 candidates"
               "Properties include solubility, toxicity risk, and bioavailability"

  Task 4: "Rank candidates and generate report"
    Agent: wordAgent
    Depends on: Task 2, Task 3
    Validation: "Ranking considers both binding affinity and ADMET properties"
               "Report includes a recommendation with supporting rationale"
```

### What cognition does in this pattern

Even though you defined the full investigation, cognition still adds value:

- **Validation at each step**: If Task 2 produces results that don't meet your requirements, cognition retries before allowing Task 4 to start. This quality feedback loop is something you wouldn't get from running the same agents manually in sequence.
- **Error recovery**: If a tool times out or returns an error, cognition can handle retries automatically.
- **Parallel execution**: Tasks 2 and 3 both depend only on Task 1, so cognition runs them in parallel.
- **Progress tracking**: You see the full execution history, validation comments, and results for each step.

### Considerations

- This pattern requires more upfront work to set up.
- If you need to change the investigation mid-run, you modify individual tasks rather than having cognition adapt on its own.
- You can reuse the same task structure across investigations using the same pattern. Consider building templates for investigations you run regularly.

## Pattern 2: Guided exploration

In guided exploration, you define the major phases of your research but leave the details to cognition. You create parent tasks for each phase with broad validation requirements. Cognition decomposes each phase into child tasks, selects agents, and manages execution within the boundaries you set.

### When to use this pattern

- You know the general approach but not the exact steps
- Different phases of the work require different levels of detail
- You want cognition to make tactical decisions while you control strategic direction
- The problem is understood that you can define phases, but the specific methods within each phase should be flexible

### How to set it up

1. **Create parent tasks** for each major phase of your research.
2. **Write validation requirements at the phase level**, describing what each phase should produce rather than how it should get there.
3. **Set dependencies between phases** where one phase needs results from another.
4. **Leave agent selection to cognition** for most tasks. If you have a strong preference for a specific phase, add a comment to the task specifying which agent to use.
5. **Enable Discovery Mode** and let cognition create child tasks within each phase.

### Example

```
Phase 1: "Identify promising molecular targets for [disease]"
  Depends on: (none)
  Validation: "At least 3 candidate targets identified"
             "Each target includes supporting evidence from literature"

Phase 2: "Characterize binding properties of top candidates"
  Depends on: Phase 1
  Validation: "Binding properties computed for all candidates from Phase 1"
             "Analysis includes at least binding affinity and selectivity"

Phase 3: "Recommend lead candidates with rationale"
  Depends on: Phase 2
  Validation: "Recommendation narrows to 1-2 lead candidates"
             "Rationale references binding data and target relevance"
```

### What cognition does in this pattern

Cognition takes ownership of the tactical decisions within each phase:

- **Decomposes phases into child tasks** based on what it determines is needed
- **Selects agents and tools** for each child task
- **Creates dependencies** between child tasks within a phase when results from one inform another
- **Validates child task results** against the phase-level requirements you defined
- **Synthesizes child task results** into the phase-level deliverable

### Considerations

- You see child tasks appear that you didn't explicitly create. Review them periodically to verify cognition is headed in the right direction.
- Phase-level validation requirements need to be specific enough that cognition can evaluate results, but broad enough that different approaches can satisfy them.
- If cognition's decomposition doesn't match your expectations, add comments to the parent task with guidance. Cognition reads comments and adjusts its approach.

## Pattern 3: Autonomous research

In autonomous research, you provide a single high-level objective and let cognition handle everything. Cognition decomposes the objective, creates the full task hierarchy, selects agents, manages execution, and synthesizes results. You check in periodically to review progress and provide strategic feedback.

### When to use this pattern

- You're exploring a new problem space without a predetermined approach
- The research question is broad and could be addressed from multiple angles
- You want to see what the engine discovers without constraining the approach
- You're willing to invest time upfront (hours to days) while cognition explores

### How to set it up

1. **Create a single root task** with a clear but broad objective.
2. **Write validation requirements** that describe what a successful outcome looks like at the highest level.
3. **Enable Discovery Mode** and step away.
4. **Check in periodically** (every few hours) to review the task tree cognition built and the results from completed tasks.
5. **Provide feedback** through comments on tasks. Add new tasks if you want to steer cognition toward a specific direction.

### Example

```
Root task: "Investigate the viability of repurposing existing
           antiviral compounds for [new disease target], considering
           binding mechanism, selectivity, and preliminary toxicity"

Validation: "Investigation covers at least 3 existing antiviral compounds"
           "Analysis includes binding mechanism characterization for each"
           "Preliminary toxicity assessment covers top candidates"
           "Final recommendation identifies the most promising candidate with rationale"
```

### What cognition does in this pattern

This is where cognition operates with the most autonomy:

- **Plans the research strategy** by decomposing the objective into phases and tasks
- **Identifies what data and tools you need** and creates tasks to acquire or run them
- **Makes scientific judgment calls** about which approaches to pursue based on intermediate results
- **Iterates** when early results suggest a different direction
- **Aggregates findings** across multiple tasks into a coherent result for the root task

### Considerations

- This pattern requires the most patience. Cognition might explore approaches you wouldn't choose.
- Results can be surprising. Cognition sometimes identifies connections or approaches that aren't obvious from a human planning perspective.
- The quality of the root task description and validation requirements strongly influences the quality of the outcome. A vague objective produces vague results.
- For broad investigations, expect cognition to create a significant number of child tasks. This is normal. Review the task tree periodically to remove subtasks that aren't useful.
- Cognition's reasoning is influenced by the agents and tools available in your project. If the project only has one agent, cognition's options are limited regardless of the objective's breadth.

## Choosing the right pattern

> [!NOTE]
> All patterns require that your project has agents with the right capabilities for the work. The Discovery Engine orchestrates agents, it doesn't replace them. Without specialized agents and tools, the engine has no more capability than a standalone reasoning model. The patterns differ in who decides which agent handles which task: you or cognition.

| Factor | Deterministic | Guided exploration | Autonomous |
|--------|--------------|-------------------|------------|
| **You know the exact steps** | Yes | Partially | No |
| **Who selects agents** | You guide selection (via comments) | You guide phases, cognition selects within them | Cognition selects for all tasks |
| **Upfront setup effort** | High | Medium | Low |
| **Cognition autonomy** | Low (execute and validate) | Medium (decompose within phases) | High (plan and execute everything) |
| **Reproducibility** | High | Medium | Lower |
| **Time to first results** | Depends on investigation length | Moderate | Longer (exploration takes time) |
| **Best for** | Known protocols, repeatable pipelines | Phased research with known direction | Exploratory, open-ended research |

You can also mix patterns within a single investigation. For example, use a deterministic investigation for a well-understood data preparation phase, then switch to guided exploration for the analysis phase where the best approach isn't clear.

## Related content

- [Trust relationship and basic investigation patterns](concept-trust-basic-investigation-patterns.md)
- [Discovery Engine](concept-discovery-engine.md)
- [Cognition overview](concept-cognition-overview.md)
- [Tasks and investigations](concept-tasks-investigations.md)
- [Build investigations with cognition](how-to-build-investigations-cognition.md)
