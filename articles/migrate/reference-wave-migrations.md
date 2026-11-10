---
title: Wave migration reference for Azure Migrate
description: Look up migration step properties, dependency scopes, statuses, execution controls, and limits for Azure Migrate waves.
author: snehithm
ms.author: snmuvva
ms.service: azure-migrate
ms.topic: reference
ms.date: 10/28/2026

#CustomerIntent: As a migration engineer, I want to look up wave migration properties, statuses, and limits so that I can configure and troubleshoot an execution plan.
---
# Wave migration reference for Azure Migrate (preview)

Use this reference to look up execution artifacts, step properties, dependency scopes, statuses, controls, permissions, and limits for migration waves.

## Glossary

| Term | Definition |
| --- | --- |
| **Approval step** | A workflow step requiring a human decision to proceed. |
| **Application** | A logical grouping of workloads that can span waves. Each wave has an application step group for that application's workloads in the wave. |
| **Custom script step** | A user-added step that runs supplied automation. |
| **Execution plan (wave execution plan)** | A workflow for migrating one wave, generated from that wave's resources and configuration. |
| **Execution spec** | The JSON definition of a wave's execution plan, including its steps, dependencies, and workload references. |
| **Finalization** | The step group for end-of-wave activities. |
| **Initialization** | The step group for shared setup and validation across applications and workloads. |
| **Manual step** | A step that records completion of work performed outside the system. |
| **Migration method** | How a workload migrates, such as Azure Migrate Server Migration, Azure Database Migration Service in offline mode, Azure Storage Mover, or redeploy and data copy. A workload property that determines its step sequence. |
| **Optional step** | A step that can be deleted from the wave's workflow before execution. |
| **Parameters file** | The separate file containing step input values; input changes don't modify the execution spec. |
| **Prerequisite** | A system-owned ordering constraint from the step library. |
| **Run (execution)** | One execution record of a wave. |
| **Step** | The smallest unit of execution in the workflow: an activity or gate. |
| **Step group** | A grouping of related steps within a wave. |
| **Step library** | Microsoft's maintained collection of reusable migration steps and their input requirements, including common steps such as approvals and scripts. |
| **Ungrouped-workload step group** | The catch-all step group for workloads not attached to an application. |
| **User dependency** | A user-editable ordering constraint between steps. |
| **Wave** | A group of resources that you want to migrate together. |
| **Wave plan** | A planning-phase artifact that groups workloads into waves and sequences those waves. |
| **Workload** | An individual resource to migrate, such as a virtual machine, SQL Server database, or file share. It belongs to one wave but can belong to multiple applications; Azure Migrate places its migration steps in only one application's group to avoid duplicate migration. |
| **Workload-scoped step** | A step that fans out into one execution per workload. |

Relationships are explained in [Waves, applications, and workloads](wave-migrations.md#waves-applications-and-workloads). Execution limits are listed in [Limits, defaults, and timeouts](#limits-defaults-and-timeouts).

---

## Execution artifacts

The *execution spec* is the versioned JSON definition of the wave's execution plan, including steps and dependencies. It references workloads and application groups in the Azure Migrate project rather than defining those resources.

A separate *parameters file* stores all input values. Changing inputs, including during retry, updates that file without changing the execution spec.

In **Execution runs**, **Download** provides a ZIP containing `spec.json`, `parameters.json`, and `status.json` for the run being viewed, including historical runs. **Download** on **Execution plan** provides the latest artifacts. The `status.json` file contains execution information for the associated run, including step attempts, which the portal doesn't currently show. Use **Execution runs** for portal status views; there's no separate audit-log surface. Completed-wave execution views remain available while the wave and its Azure Migrate project exist.

For preparation and execution tasks, see [Configure and customize a wave](configure-customize-wave.md) and [Execute your wave migration](execute-wave-migration.md).

---

## Step types and properties

### Step types and scope

Each step in the step library defines its own type. Migration and tool activities aren't a single generic step type. The following categories describe their purpose, scope, and retry granularity.

| Category | Created by | Scope | Retry granularity |
| --- | --- | --- | --- |
| **Migration/tool activity from the step library** | Azure Migrate; each library step has its own type | Workload-scoped or not, depending on the step | Failed workloads only (workload-scoped); whole job (otherwise) |
| **Manual step** | Azure Migrate and user | Non-workload-scoped gate | Not applicable; waits for a person to complete the work |
| **Approval step** | Azure Migrate and user | Gates a workload set; approval is per workload | Not applicable |
| **Custom script step** | User | Once, or once per workload | Failed workloads only (workload-scoped); whole job (otherwise) |

For editing restrictions, see the [customization capability matrix](#customization-capability-matrix). For procedures, see [Add steps](configure-customize-wave.md#add-steps-if-needed).

### Approval step properties

| Property | Values | Notes |
| --- | --- | --- |
| Step name | Free text | Identifies the approval step |
| Description | Free text | Explains the decision to the approver |
| Workloads | The gated workloads | Approval is granted per workload |
| Depends on | Predecessor steps, when needed | Determines when workloads become ready for approval |
| Step group | The group containing the step | Organizes the approval within the execution plan |

Approval notifications aren't currently available. Monitor pending approvals in **Execution runs**.

Every gate permits approval of any subset of ready workloads, as often as needed. Operators decide whether to release workloads as they become ready or wait and approve the full set together.

### Custom script step properties

| Property | Values | Notes |
| --- | --- | --- |
| Type | Custom | An independent workflow step |
| Script name | Relative script path within the script store | Scripts can be in the store's root directory or subfolders; content isn't stored in the execution spec |
| Script languages | PowerShell or Bash | You don't need to specify a script type |
| Execution location | Host, source workload, or target VM | Target-VM execution is supported when Once per workload is selected; the host is the appliance or Execution Agent |
| Script timeout | Configurable input | Only custom script steps have a configurable timeout |
| Execution result | Script exit code | `0` means success; every other exit code means failure |
| Ordering | Step dependencies | Predecessors are dependencies of this step; successors must separately depend on this step |
| Status | [Step status values](#step-status-values) | Independent of neighboring steps |

The portal requests **Relative script path**; provide the script path relative to the host's script store. Script settings are input values stored in the parameters file; script content isn't embedded in the execution spec. For portal settings, see [Configure a custom script step](configure-customize-wave.md#configure-a-custom-script-step).

Scripts run as provided. You don't need to modify them to implement status-file reporting; Azure Migrate captures the execution result.

Default script store directories:

| Host operating system | Script store directory |
| --- | --- |
| Windows | `%ProgramData%\Microsoft Azure\ScriptStore\` |
| Linux | `/var/opt/microsoft/azuremigrate/scriptstore` |

On Windows, the `AZMIGRATE_SCRIPT_STORE` registry value can override the default script store directory.

Place scripts directly in these directories or in subfolders. For example, reference a script in a validation subfolder as `validation\check.ps1` on Windows or `validation/check.sh` on Linux.

### Placement patterns

Express placement through the [dependency settings](#dependency-settings). Predecessors are optional: without them, a new step can run first or alongside the group's initial steps when the group can start. Adding a predecessor doesn't automatically make a successor wait. A step is non-gating when no other step depends on it. See [Placement concepts](wave-migrations.md#customization) for the behavior and the [script procedure](configure-customize-wave.md#configure-a-custom-script-step) for the edits.

### Step execution modes

A step's execution is either **automated** or **manual**.

---

## Dependency scopes

### The two tiers

| Tier | Source | Editable | Resolution / scope requirement |
| --- | --- | --- | --- |
| **Prerequisites** | Step library (method-inherent ordering) | No; locked | System-determined: same-workload when both steps are workload-scoped; whole-step otherwise |
| **User dependencies** | User, Azure Migrate, or user edits | Yes | Required when the predecessor is workload-scoped and the dependency mode is same-workload or mapped-workloads |

Both must be satisfied before dependent work can start.

### Resolution scopes

| Scope | What must complete in the predecessor | How your workloads unblock |
| --- | --- | --- |
| **Same workload** | The matching workload | **Independently**: each workload proceeds when its match completes |
| **Whole step** | Every workload in the predecessor | **Together**: a barrier |
| **Mapped workloads** | Only the specified predecessor workloads for each dependent workload | **Independently**: each workload proceeds when its mapped predecessors complete; no shared barrier |

Mapped-workload dependencies are available only through Azure CLI and API, not the portal.

Workloads that don't appear in the predecessor step aren't blocked by a same-workload dependency at all.

### Dependency settings

| Field | Required | Description |
| --- | --- | --- |
| Predecessor step | Yes | The ID of the step to wait for, including references across groups |
| Scope | When the predecessor is workload-scoped and the dependency mode is same-workload or mapped-workloads | Resolves the workload-specific dependency |
| Workloads | When scope is mapped-workloads | The specific workloads in the predecessor that must complete |

### Execution plan structure and step readiness

See [Step groups and execution order](wave-migrations.md#step-groups) for group eligibility and [Dependencies and readiness](wave-migrations.md#dependencies-and-parallelism) for how step dependencies affect scheduling.

---

## Migration tools and methods

The migration method you select for a workload determines which tool performs its migration work. For the release-supported source, target, and method combinations, see [Supported migrations](wave-migrations-overview.md#supported-migrations).

Preparation requirements depend on the selected migration method.

---

## Status values

This section describes status labels, identifiers, and their meanings. Wave, run, step, and workload status are distinct. For aggregation, see [Rollup](wave-migrations.md#runs-and-execution-controls); for portal navigation, see [Track migration status](track-wave-migrations.md).

### Portal status labels

| Surface | Labels or fields |
| --- | --- |
| **Execution plan**, **Configuration Status** | **Not configured** or **Fully configured**; distinct from execution status |
| Wave **Execution status** | **Pending configuration**, **Not Started**, **In progress**, **Needs action**, **Completed** |
| **Execution runs**, step **Execution status** | **Not Started**, **In progress**, **Needs action**, **Failed**, **Succeeded**, **Partially succeeded**, **Skipped** |
| Execution **Step details** | **Status**, **Start time**, **End time** |
| Execution step's **Workloads** | **Status** and **Application** per workload |
| Execution step's **Errors** | **Issue**, **Affected workloads**, **Details** |
| Wave **Overview** and project **Migrations** | Overall **Execution status** for applications and workloads |

The **Action** column provides **Approve**, **Mark as complete**, or **Retry** for eligible steps. Approval steps waiting for a decision and manual steps waiting for external work show **Needs action**; there's no separate awaiting-approval display status. Manual steps use the same label in both the table and step details.

### Execution status applicability

Execution status is distinct from execution-plan **Configuration Status**, which is **Not configured** or **Fully configured**.

| Execution status | Wave | Workload | Application | Step |
| --- | --- | --- | --- | --- |
| Pending configuration | Yes | Yes | No | No |
| Not Started | Yes | Yes | Yes | Yes |
| In progress | Yes | Yes | Yes | Yes |
| Needs action | Yes | Yes | Yes | Yes |
| Completed | Yes | Yes | Yes | No |
| Failed | No | Yes | No | Yes |
| Succeeded | No | No | No | Yes |
| Partially succeeded | No | No | No | Yes |
| Skipped | No | No | No | Yes |

Pause and cancellation are execution controls, not execution-status values. A wave or workload requiring action because execution was paused or canceled shows **Needs action**.

### Wave execution status

| Execution status | Meaning |
| --- | --- |
| Pending configuration | Workload target services or migration methods are incomplete, or required execution inputs aren't configured |
| Not Started | The wave is fully configured and ready, but execution hasn't started |
| In progress | Execution is proceeding without issues requiring user action |
| Needs action | Execution is paused or canceled, a step failed, or approval or manual work is waiting |
| Completed | Execution succeeded and the wave's workloads migrated successfully |

The wave has a single **Execution status** field, distinct from run and step status. A canceled run leaves the wave in **Needs action**, not **Completed**. An out-of-date execution plan must be regenerated; this condition isn't an additional wave execution status. Execution-plan **Configuration Status** is separately **Not configured** or **Fully configured**.

### Step status values

| Status | Meaning |
| --- | --- |
| Not Started | The step hasn't started in the current execution. It might be waiting for dependencies or scheduling capacity. |
| In progress | The step is running and doesn't need user action. |
| Needs action | The step needs approval or manual work. |
| Failed | The step failed for all its workloads. Fix the issue and retry. |
| Succeeded | The step succeeded for all its workloads. |
| Partially succeeded | The step finished with some workloads successful and others failed. Retry runs for all failed workloads, not a user-selected subset. |
| Skipped | The step was skipped because wave execution was canceled. |

**Partially succeeded** is a terminal result for that step attempt, but you can still retry failed workloads.

### Workload status fields

Workload execution status shows migration progress and the current step's state.

| Workload status | Meaning |
| --- | --- |
| **Pending configuration** | Target Azure service or migration method isn't configured. |
| **Not Started** | Workload execution hasn't started. |
| **In progress** | Work is running without an issue that needs intervention. |
| **Needs action** | Approval or manual work is required, or wave execution was paused or canceled. |
| **Failed** | The workload's current step failed. Progress waits until you fix the issue and retry the step. |
| **Completed** | All steps for the workload are complete and migration is finished. |

### Application execution status

Application execution uses **Not Started**, **In progress**, **Needs action**, and **Completed**. An application is **Not Started** when execution hasn't started for any of its workloads. It's **In progress** when execution is ongoing without requiring user action and all its workloads are either **Not Started** or **In progress**. Use workload details to investigate pending action or failures; **Failed** isn't a separate application execution status.

---

## Execution controls and capability matrix

| Scope | Start | Pause | Resume | Cancel | Retry |
| --- | :--: | :--: | :--: | :--: | :--: |
| **Wave** | Yes | Yes | Yes | Yes | Not applicable |
| **Step group** | Not applicable | No | No | No | Not applicable |
| **Step** | Not applicable | No | No | Not applicable | Yes, on failure |

### Semantics

| Control | Behavior |
| --- | --- |
| **Start execution** | Available on **Execution plan** and wave **Overview**, or through Azure CLI. Starts the whole wave, not an individual group or step. Requires complete required inputs, valid supplied values, and an up-to-date execution plan. Starting approves the current version |
| **Pause execution** | Available on **Execution runs**. Applies to the whole wave. No new work is scheduled; work in progress continues until it reaches a logical stopping point. Doesn't immediately terminate underlying tool operations |
| **Resume execution** | Available on **Execution runs**. Resumes scheduling for a paused wave |
| **Cancel execution** | Available on **Execution runs**. Stops scheduling new work; work in progress continues until it reaches a logical stopping point. Ends the run; remaining steps, including pending approvals, are marked skipped. Doesn't immediately terminate underlying tool operations. No cleanup or rollback |
| **Retry** / **Retry step** | Operator-initiated on a failed step in an active, nonpaused run. Choose the same or different parameters. Workload-scoped steps retry all failed workloads without workload selection; non-workload-scoped steps retry as a whole job. Successful work isn't retried. Input edits update only the retried step's values in the parameters file, not the execution spec |

### Not supported

| Capability | Status |
| --- | --- |
| Rollback | Not available; execution is forward-only, and cutover is the point of no return |
| Scheduled execution | Not available; a person starts each run |
| Continue-on-failure | Not available; a step failure stops that workload's workflow |

Control scope is listed in the preceding matrix. Step-editing restrictions, including skipping, are listed in the [customization capability matrix](#customization-capability-matrix).

---

## Limits, defaults, and timeouts

| Item | Value | Notes |
| --- | --- | --- |
| **Concurrent runs per wave** | 1 | Multiple runs over time; one in progress |
| **Successful runs per wave** | 1 | After a successful run, the wave is locked: no workload or configuration changes, execution plan edits, or further runs |
| **Minimum steps per step group** | 1 | Hard rule |
| **Overall wave execution timeout** | **90 days** | Execution times out if it doesn't complete within this window; not an inactivity timer |
| **Approval step timeout** | No individual timeout | Approvals can wait until approved within the overall 90-day execution window |
| **Custom script timeout** | Configurable input | Other step types don't expose a configurable timeout |
| **Concurrency limits** | System-managed; vary by step type | Shared across the wave for steps of the same type. Each workload execution counts separately; a non-workload-scoped invocation counts as one. Migration tools impose additional limits |

For how concurrency is applied, see [Concurrency and parallelism](wave-migrations.md#dependencies-and-parallelism). Input readiness is explained under [Required inputs before execution](wave-migrations.md#input-parameters); editing support is listed in the next section.

---

## Permissions

| Action | Requirement |
| --- | --- |
| **Execution actions** | Azure Migrate Owner or Azure Migrate Execute Expert role on the Azure Migrate project for start, pause/resume, cancel, retry, approval, and manual completion |
| **Project managed identity** | Both Azure Migrate Execute Expert and Contributor on the Azure Migrate resource group and on every target subscription used by the wave |
| **Which gates you can approve** | Any gate in the project if you hold one of these roles; gates don't have individually assigned approvers |
| **Access model** | Azure role-based access control (Azure RBAC) |

For preparation prerequisites, see [Configure and customize a wave](configure-customize-wave.md#prerequisites). For approval prerequisites, see [Execute your wave migration](execute-wave-migration.md#prerequisites).

---

## Customization capability matrix

| Customization | Supported |
| --- | :--: |
| Add manual steps | Yes |
| Add approval steps | Yes |
| Add custom script steps (PowerShell, Bash) | Yes |
| Edit step name and description | Yes |
| Edit user dependencies | Yes |
| Update step parameters | Yes |
| Configure a custom script timeout | Yes; custom script steps only |
| Split a step group | Azure CLI and API only |
| Merge step groups | Azure CLI and API only |
| Delete optional steps before execution | Yes |
| Edit system-owned prerequisites | No |
| Delete required steps | No |
| Skip any step during execution | No |
| Split a step by workload scope | No |
| Structural edits during an active run | No |
| Input edits during a run, outside a failed step being retried | No |
| Workload, configuration, or execution plan edits after successful completion | No |
| Edit concurrency limits | No |

### Guardrails applied to edits

Edits can't introduce circular dependencies, reference workloads outside the wave, or use unsupported steps. Required steps and system-owned prerequisites remain protected. For available edits, see the [customization capability matrix](#customization-capability-matrix).

Splitting or merging groups relocates whole steps, not subsets of a step's workloads. Azure Migrate preserves dependencies and keeps groups nonempty. Resulting application or ungrouped-workload groups can run in parallel with their peers after initialization, subject to step dependencies; regrouping doesn't increase the wave's concurrency limits.

### Versioning rules

- Workflow edits create a new execution plan version, with diffs against the previous one.
- The parameters file stores input values. Input changes and retry parameter updates don't change the execution spec.
- Each run uses a specific execution plan version.
- Successful completion locks the wave against further changes or runs.

The [customization capability matrix](#customization-capability-matrix) governs edit timing. [Locking and regeneration](wave-migrations.md#wave-changes) explains regeneration behavior. The [regeneration procedure](configure-customize-wave.md#regenerate-the-execution-plan) includes the required loss warning.

---

## Related content

- [Understand how wave migrations work](wave-migrations.md)
- [Configure and customize your wave](configure-customize-wave.md)
- [Execute your wave migration](execute-wave-migration.md)
- [Track and troubleshoot wave migrations](track-wave-migrations.md)

