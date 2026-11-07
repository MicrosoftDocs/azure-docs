---
title: Wave planning overview in Azure Migrate
description: Understand migration wave plans in Azure Migrate, including wave composition, sequencing, dependencies, risks, and the planning engine.
author: shubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 11/02/2026
ms.update-cycle: 365-days
monikerRange: migrate
# Customer intent: As a migration lead, I want to understand the recommended wave plan and its reasoning so that I can review and configure proposed waves before committing them.
---

# Wave planning overview in Azure Migrate (preview)

Wave planning in Azure Migrate organizes applications and their workloads into manageable migration and modernization batches. Each wave is a group of workloads that you plan to move together. A wave plan recommends the **grouping and sequence** of these workloads.

Wave planning helps cloud architects and migration and modernization leads:

- **Accelerate migration and modernization** by focusing on smaller, achievable batches and sequencing them logically.
- **Reduce uncertainty** by breaking large migration and modernization initiatives into manageable phases and refining the plan before commitment.
- **Minimize risks** and disruptions by grouping dependent application components and enabling iterative planning.
- Support **business continuity** through review of dependencies and risks, stakeholder feedback, and updates to the proposed plan.

For general migration planning guidance, see [Migration wave planning in the Cloud Adoption Framework](/azure/cloud-adoption-framework/migrate/migration-wave-planning).

## Key features

Azure Migrate automatically generates wave plans using discovery data, application mappings, dependency analysis, and assessments. You can refine and commit proposed waves before proceeding with migration and modernization. Key features include:

- **Application-centric grouping and sequence.** Use dependency-aware grouping to account for relationships across application components. Plan simpler applications before more complex ones, subject to dependencies and business requirements, to reduce risk.
- **Explainable plans for review and reporting.** Review grouping and sequence rationale, dependencies, and risks. Download the AI-friendly Markdown (.md) reports for offline review and stakeholder approval. AI tools can use the reports to support review and suggest updates.
- **Configurable wave assignments.** Review proposed assignments with application teams and update them through the inventory-to-wave mapping CSV file to reflect business requirements.
- **Iterative planning.** Regenerate recommendations as migration and modernization proceed so the proposal reflects the latest project state.

## Understand the wave plan

The wave plan is generated for the workloads and applications in the **assessment scope** and selected migration path.
The wave plan report summarizes the waves, dependencies across waves, and identified risks. It explains the overall grouping and sequence and includes a per-wave report with applications, workloads, reasoning, dependencies, and recommendations.

### Waves

The **Waves** table shows both committed and proposed waves for the workloads in the assessment scope. Workloads that are already committed appear in their existing committed waves. The remaining workloads are distributed into proposed waves and sequenced based on application groupings, dependencies, and other planning conditions.

| Data | Details |
|---|---|
| **Sequence** | The recommended order of the wave within the plan, based on dependencies and planning conditions. |
| **Waves** | The wave name. |
| **Wave status** | Whether the wave is **Proposed** or **Committed**. Proposed waves are still being reviewed and configured. Committed waves have been accepted for execution. The workloads shown for these waves include only those in the wave plan's scope. |
| **Applications** | The number of applications identified from the workloads in the wave, including applications not directly selected in the assessment. |
| **Workloads** | The number of workloads included in the wave. |
| **Risks** | The number of identified migration risks due to planning conditions that couldn't be satisfied or missing data. |
| **Est. Azure cost** | The estimated Azure cost associated with the wave based on the assessment report. |

Committing a wave **doesn't start migration** or mean that its workloads have migrated. The status distinguishes accepted waves from recommendations that you can still configure.

### Wave plan reasoning

**Wave plan reasoning** explains why workloads are grouped together and how dependencies and planning conditions influence the sequence across the plan. A recommendation might involve a tradeoff when not all conditions can be satisfied. The reasoning explains these tradeoffs alongside the dependencies and risks.

- **Cross wave dependencies** lists relationships between waves. **Wave** identifies the wave that has a dependency, **Depends on** identifies the wave containing the required application or service, and **Details** explains the relationship and its effect on sequencing.
- **Risks and recommendations** explains identified issues, affected applications or workloads, and recommended actions. Risks can result from unsatisfied planning conditions, dependency conflicts, or missing input data. The recommendations describe possible changes to proposed assignments, source data, or the approach to handling dependencies. These findings don't indicate execution progress.

### Individual wave details

Each wave name in the **Waves** table links to a per-wave report containing:

- **Reasoning**: Why the applications and workloads are grouped, how the wave fits in the sequence, and the assumptions behind its estimates.
- **Applications**: Application names, types, workload counts, business criticality, complexity, and estimated Azure costs. An application can be split across multiple waves.
- **Dependencies**: Required waves and the reasons for those dependencies.
- **Risks and recommendations**: Issues specific to the selected wave and suggested mitigations.

Workload counts reflect the assessment scope represented in the wave plan. Application counts also include applications identified from those workloads, even if the applications weren't directly selected in the assessment. A wave can therefore represent only **part of an application**.

Application cost estimates separate workload costs from peripheral costs. Peripherals are Azure resources that accompany the migrating workloads. Peripheral costs apply when the application is fully covered by the plan. The wave's cost explanation describes the assessment-based estimate.

## Wave planning engine overview

The wave planning engine uses your assessment and discovery data to create an optimized set of migration waves. The process is **deterministic**: the same inputs and planning configuration produce the same recommendations.

### Data inputs

The engine combines workload inventory, assessment results, dependency data, and application information for the selected assessment and migration path. The available details depend on the workload type and the data collected in your project. Wave planning can produce recommendations with incomplete data, but additional inputs help it evaluate more planning conditions.

| Data | Details |
|---|---|
| **Workload inventory and size** | Workload identities, types, configuration, size, and counts. Server size includes allocated CPU cores, memory, and storage. For example, greater size and scale increase inferred complexity and reduce migration priority, favoring simpler workloads for earlier waves. |
| **Lifecycle and support status** | Available end-of-life and end-of-support information for workloads. For example, a workload that reached end of support receives higher migration priority to account for lifecycle risk. |
| **Assessment results** | Migration readiness, recommended Azure target services and configurations, migration strategies, and cost impact, including estimated Azure costs and projected savings where available. For example, cost estimates support per-wave cost summaries. |
| **Dependency mapping** | Network connections between source and destination servers, including connection direction and available process and port information. For example, significant two-way dependencies identified after noise filtering and thresholding help determine which workloads should migrate together. |
| **Application mapping and properties** | Workload-to-application mappings, application workload counts, business criticality, and complexity. For example, criticality helps sequence less critical applications before business-critical applications. |
| **Business metadata** | Workload environment classifications, such as development, test, and production, captured through inventory tags. For example, environment classifications help separate production from nonproduction workloads and place development and test workloads earlier. |
| **Existing wave assignments** | Committed wave membership and proposed assignments supplied through an imported mapping file. For example, saving a configuration preserves imported proposed assignments and reassesses risks without changing committed waves. |

For details about importing assignments and resetting proposed waves, see [Configure a wave plan](how-to-configure-wave-plan.md).

### Planning conditions

Planning conditions capture technical dependencies, business constraints, and operational requirements. The engine evaluates applicable conditions in the priority order shown in the following table. When conditions conflict, higher-priority conditions take precedence.

| Priority | Condition | Purpose |
|---|---|---|
| 1 | **Keep strongly dependent workloads together** | Workloads with strong two-way dependencies stay in the same wave to reduce connection and latency issues. |
| 2 | **Keep application components together** | Group the workloads of an application so that its tiers can migrate as a unit. |
| 3 | **Respect dependency order** | Place a dependency target in the same wave or an earlier wave than the application that requires it. |
| 4 | **Migrate development and test before production** | Migrate lower-risk environments before production workloads so that you can validate the migration approach first. |
| 5 | **Separate production from development and test** | Place environments with different migration and rollback requirements in separate waves. |
| 6 | **Move high-criticality applications later** | Migrate less critical applications before business-critical applications so that you can establish the migration approach first. |
| 7 | **Move high-complexity applications later** | Migrate simpler workloads before complex applications. |

Automatically generated waves have a fixed target size of **50 workloads per wave**. The actual size can differ to account for dependencies and planning conditions. You can't override this target.

The engine might not satisfy every condition when requirements conflict or data is missing. The reasoning, dependencies, and risks and recommendations in the plan and individual wave reports explain these cases.

### The planning algorithm

The engine processes the assessed workloads and applications in five phases, then generates the overall plan report and individual wave reports.

#### Phase 1: Gather information

The engine gathers the available information from your Azure Migrate project for the selected assessment and migration path. Inputs include workload inventory, size and lifecycle details, assessment readiness and cost recommendations, dependency mappings, application groupings and properties, environment classifications, and existing wave assignments. These inputs define the planning scope and provide the context for grouping and sequencing workloads. For details, see [Data inputs](#data-inputs).

#### Phase 2: Identify groups

The engine filters network dependency data to remove noise, such as connections to DNS services, so that common infrastructure connections don't create unnecessary workload groups. It then applies thresholding to distinguish significant server-to-server dependencies from incidental connections. A recorded connection alone doesn't mean that two servers must migrate together.

The retained dependencies define the workload groups. Workloads with strong two-way dependencies are grouped together, while dependency direction informs later sequencing between groups. If network dependency data isn't available, each workload initially forms its own group. Application mappings are considered when applying planning conditions.

#### Phase 3: Prioritize groups

The engine prioritizes workload groups using lifecycle and support status, size and scale, complexity, business criticality, migration readiness, and cost impact. These factors come from application properties, assessment results, or workload details. Where application properties aren't available, relevant factors are inferred from workload details. The initial sequence is then refined by planning conditions and dependency requirements.

#### Phase 4: Apply planning conditions

The engine uses constraint optimization to find a grouping and sequence that satisfy as many applicable [planning conditions](#planning-conditions) as possible. It uses the CP-SAT algorithm and gives precedence to conditions in the table's priority order.

The algorithm can adjust proposed wave membership and ordering to reconcile dependencies, application boundaries, environment separation, and application risk. For example, if keeping application components together conflicts with separating environments, the higher-priority application grouping condition takes precedence.

Constraint optimization doesn't guarantee that every condition can be met. Conflicting requirements or missing data can leave conditions unsatisfied. The plan reasoning explains these tradeoffs, and the risks and recommendations identify issues for review before commitment.

#### Phase 5: Validate and optimize

The engine validates and optimizes the proposed waves to reduce cross-wave dependencies, account for required ordering, and work toward the target size of the wave. Dependencies and planning conditions can result in larger or smaller waves. It checks for unsatisfied conditions, dependency issues, and data gaps, and provides recommendations for review before commitment.

**Committed wave assignments remain unchanged.** The remaining workloads are assigned to proposed waves, with dependencies on committed waves taken into account.

After these phases, the engine generates the overall wave plan report and a report for each wave. The reports explain the grouping and sequence, dependencies, risks, and recommendations so that you can review the plan before commitment.

When you import and save proposed assignments instead of generating new recommendations, the engine preserves those assignments and reassesses risks. Committed waves remain unchanged.

## Next steps

- [Configure a wave plan](how-to-configure-wave-plan.md).
- [Wave planning frequently asked questions](common-questions-wave-planning.md).
