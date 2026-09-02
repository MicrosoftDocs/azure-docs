---
title: Auto Wave Planning in Azure Migrate
description: Discover how Azure Migrate automatic wave planning groups workloads, honors dependencies, and flags risk so you can migrate to the cloud with greater confidence.
author: shubhamJain1992
ms.author: shuj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 09/01/2026
monikerRange: migrate 
# Customer intent: how Azure Migrate automatically generates and prioritizes migration waves, and how the planning engine makes its recommendations.
---

# Automatic wave planning in Azure Migrate (preview)

This article explains the concepts and technical details of auto wave planning in Azure Migrate. Learn how the wave planning engine generates migration waves, evaluates planning conditions, and calculates confidence, risk, and priority scores. For information about creating, approving, and managing migration waves, see the [Azure Migrate wave planning](how-to-plan-create-waves.md).

- For step-by-step instructions to generate, review, export, import, and create waves, see [Create waves using auto wave planning](how-to-plan-create-waves.md). 
- For common questions, see [Auto wave planning: Common questions](common-questions-wave-planning.yml).
## What is wave planning?

Each wave contains workloads that you must migrate together. Auto-wave planning in Azure Migrate automatically evaluates planning conditions, such as keeping application components in the same wave and separating production and nonproduction environments. It also calculates a priority score for each workload group to determine the recommended migration order.

You can use wave planning for migration estates of any size. You can generate a plan by using inventory and assessment data, and then improve its accuracy by adding dependency mapping and application grouping data.

## Key concepts

| Term | Definition |
|------|------------|
| **Wave** | A group of workloads and applications that migrate together as a single batch. When you create a wave from the wave plan, it becomes an execution object in Azure Migrate that you use to track and manage the migration. |
| **Wave plan** | A recommendation that assigns every workload in the assessment scope to a wave, with priority scores and risk analysis. You can import changes,regenerate, export, and revise the plan as many times as needed before creating waves. |
| **Priority Score** | A composite number from 0 to 100 that indicates migration priority. Higher scores mean the wave is recommended for earlier migration. |
| **Confidence** | Completeness of the input data available when the plan was generated (High, Medium, or Low). |
| **Risk** | Degree to which the plan satisfies the defined planning conditions (High, Medium, or Low). |

## Planning conditions

Wave planning evaluates a set of conditions to validate that each wave is well-composed and safe to migrate. Conditions codify migration best practices - they check whether workloads are grouped correctly, whether dependencies are respected, and whether business constraints are honored.

### Why conditions matter

The planning engine evaluates multiple conditions, covering technical dependencies, business constraints, and operational logistics. 

#### Planning conditions 

Wave planning uses a prioritized set of conditions to generate migration waves. The engine evaluates conditions in the order listed below, with higher-priority conditions taking precedence when conflicts occur. The generated wave plan explains any tradeoffs or condition violations. 

1. Workloads with strong two-way dependencies stay in the same wave. If VM-App01 and VM-Cache01 constantly exchange data, they migrate together to avoid latency or connection failures. (Input: dependency mapping showing bidirectional traffic — *for example, VM-App01 ↔ VM-Cache01*). 
1. All workloads in the same application migrate together in a single wave. If your ERP system includes a web server (VM-Web01), an app server (VM-App01), and a database (VM-DB01), the engine places all three in the same wave so the application doesn't break mid-migration. (*Input: application mapping — for example, all three VMs mapped to Contoso ERP*). 
1. When one application depends on another, the dependency target migrates in the same wave or an earlier wave. If your web portal calls an internal API, the API workloads move first or together with the portal. *(Input: dependency mapping showing direction — for example, VM-Portal01 → VM-API01)* 
1. Development and test workloads migrate before production workloads. Your team builds confidence on lower-risk environments first, so production systems move in later waves after processes are validated. *(Input: environment classification — for example, VM-Dev01 tagged as **Dev**", VM-Prod01 tagged as **Production**)*. 
1. Production and dev or test workloads aren't placed in the same wave. Mixing environments in a single wave complicates rollback and increases risk. *(Input: environment classification — for example, VM-Dev01 tagged as **Dev**, VM-Prod01 tagged as **Production**)*. 
1. High-criticality applications don't appear in the earliest waves. Business-critical systems migrate after the team proves its migration processes on less critical workloads. *(Input: application criticality — for example, **Contoso ERP** rated as High criticality)*. 
1. High-complexity applications don't appear in the earliest waves. Simpler workloads go first so the team builds confidence before tackling multi-tier or heavily customized systems. *(Input: application complexity — for example, **Contoso ERP** rated as High complexity with 12 dependent services)*
1. Each wave stays within a workload count range so that no single wave is too large or too small to manage effectively. (*Input: workload count range — for example, maximum 50 workloads per wave*). 

## Wave planning engine overview

The wave planning engine uses your assessment and discovery data to create an optimized set of migration waves. The process is deterministic, so it generates the same plan when given the same inputs.

### Data inputs

Wave planning delivers useful results even without a complete dataset. Each additional data category enhances grouping precision and boosts confidence.

| Data | How it helps |
|------|-------------|
| **Workload inventory** | Provides the baseline list of workloads along with size and complexity details used for prioritization. |
| **Assessment results** | Adds migration effort estimates, projected savings, and recommended strategies for each workload. |
| **Dependency mapping** | Identifies which workloads communicate with each other, so you can group them together and sequence them correctly. |
| **Application mapping** | Groups workloads under their parent applications and enables criticality and complexity scoring. |

### The planning algorithm

When you trigger wave plan generation, the engine runs through five phases sequentially on the assessed workloads and applications.


#### Phase 1: Dependency analysis

The engine groups workloads that must migrate together.

- **Application grouping:** The engine places workloads mapped to the same application in a single group.
- **Dependency grouping:**  The engine places workloads with strong bidirectional dependencies together.

If no dependency or application data is available, each workload forms its own group.

#### Phase 2: Condition evaluation

The engine evaluates all planning conditions against the proposed wave compositions. Critical conditions that are violated cause the system to restructure wave assignments when possible. Advisory conditions are evaluated and flagged but don't force restructuring.

The reasoning panel flags conditions that can't be fully satisfied due to conflicting requirements and provides an explanation of the conflict.

#### Phase 3: Prioritization

The engine calculates a [Priority score](#priority-score) (0–100) for each workload group based on the scoring model. Higher scores mean earlier migration. The engine ranks groups by Priority score, and the ranking determines wave assignment and ordering.

#### Phase 4: Wave optimization

The engine assigns ranked workload groups to waves, optimizing for:

- **Wave size balance:** Waves are roughly similar in scope.
- **Cross-wave dependency minimization:** Groups with dependencies on each other are in the same or adjacent waves to reduce risk.
- **Parallel capacity:** The plan considers how many waves can run simultaneously based on team capacity.

#### Phase 5: Validation

The engine calculates final confidence and risk scores for each wave and the plan. The engine generates reasoning for each wave explaining the grouping logic, condition evaluation, and any data gaps.

## Scoring and data confidence

### Priority score

The priority score is a composite number on a 0–100 scale that indicates how early a workload group should migrate. Higher scores indicate higher priority (earlier waves).

The score is a weighted average of multiple factors across your assessment and inventory data. These factors include workload complexity, business criticality, migration readiness, estimated effort, and potential business value. Each factor is normalized to a common scale, weighted based on its relative importance, and combined to calculate the final score.

When a workload group contains multiple workloads (for example, all tiers of an application), the system aggregates their data. 

The system treats workloads without application mapping conservatively as medium criticality and production environment by default so that unknown workloads are placed in later waves rather than risking an early migration of something critical.

### Data confidence

The confidence score reflects how complete your input data was when the plan was generated. More complete data produces more accurate grouping and condition evaluation.

The planning engine assesses confidence across the data categories it uses - workload inventory, dependency data, and application mapping. When all categories have comprehensive data, confidence is High. When some data is partial or missing, confidence drops to Medium or Low depending on the gaps.

The wave plan improves as more data becomes available. You can generate a plan with only inventory and assessment data, review the results, then add dependency mapping or application grouping and regenerate for a more refined plan. Each additional data category enables the engine to evaluate more conditions and produce tighter workload groupings.

The confidence level is displayed for both the overall wave plan and individual waves. A low confidence level doesn't mean that the wave assignments are incorrect. Instead, it indicates that the planning engine had limited data available for some workloads. The accuracy of the recommendations improves as you provide additional data. The wave plan details page identifies the missing data categories and provides guidance on how to improve confidence.

## Related content

- [Create waves using auto wave planning](how-to-plan-create-waves.md).
- [Auto wave planning: Common questions](common-questions-wave-planning.yml).
- [Create waves in Azure Migrate](how-to-plan-create-waves.md).