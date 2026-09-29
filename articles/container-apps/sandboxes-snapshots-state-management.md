---
title: Sandbox lifecycle in Azure Container Apps Sandboxes (preview)
description: Learn how lifecycle policies, suspend modes, auto-delete, and snapshots preserve state in Azure Container Apps Sandboxes (preview).
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 09/22/2026
ms.topic: concept-article
ms.service: azure-container-apps
---

# Sandbox lifecycle in Azure Container Apps Sandboxes (preview)

Azure Container Apps Sandboxes are currently in preview. Sandboxes are isolated, lightweight virtual machines for interactive sessions, agentic workloads, and controlled code execution. A sandbox can run work, pause when it's idle, preserve local state, resume later, and be removed when it's no longer needed.

This article covers the lifecycle of Azure Container Apps Sandboxes. [Dynamic sessions](sessions.md#dynamic-sessions-in-azure-container-apps) are a separate Azure Container Apps feature for request-scoped code execution and don't provide the same direct control over an individual sandbox lifecycle.

## How sandbox lifecycle works

The sandbox lifecycle controls how long an individual sandbox remains available and what local state is preserved when active work pauses. A running sandbox can hold three kinds of state:

- **In-memory state**: Process memory, open file handles, terminal sessions, and other state held by the operating system and running processes.
- **Local disk state**: Files written inside the sandbox root filesystem, including files under paths such as `/tmp`, `/home`, or the working directory.
- **External state**: Data written outside the sandbox, such as attached volumes, object storage, databases, queues, or upstream services.

External state follows the behavior of the external service that stores it. In-memory state and local disk state are tied to the sandbox lifecycle, so Azure Container Apps Sandboxes provides automatic lifecycle policy and explicit snapshots to help preserve or restore that state.

Lifecycle policy is best for routine idle-and-resume behavior. Snapshots are best for deliberate checkpoints, branching from a prepared environment, or keeping a reusable point-in-time copy independent of the source sandbox.

## Lifecycle states

A sandbox reports its lifecycle state as it moves through provisioning, active work, idle periods, state preservation, resume, and deletion. Use the state reported by the portal, CLI, SDK, or API to decide whether your workflow should run commands, wait, resume the sandbox, capture a snapshot, or clean up the resource.

Azure Container Apps Sandboxes use these lifecycle states:

| State | Description |
|---|---|
| **Running** | The sandbox is active and can run workload commands. |
| **Stopped** | The sandbox is stopped. This state is distinct from **Suspended**. Resume the sandbox and wait until it returns to **Running** before running workload commands. |

## Preserve state automatically

A lifecycle policy lets a sandbox pause after inactivity and clean up after a retention period. Use a lifecycle policy when most sandboxes follow a predictable pattern, such as an agent that waits between turns or an interactive workspace that users resume later.

### Auto-suspend

Auto-suspend can be enabled with an inactivity interval and a suspend mode. The inactivity interval controls how long a sandbox can remain idle before the policy acts. The suspend mode controls whether the platform captures memory state or preserves disk state only.

Use auto-suspend when the workload can tolerate being paused after inactivity and resumed before the next command or session.

### Suspend mode: memory and disk

Auto-suspend supports two suspend modes:

| Suspend mode | What it preserves |
|---|---|
| **Memory** | Full sandbox state, including memory. |
| **Disk** | Disk state only. The VM restarts fresh on resume. |

If you attach data disk volumes to a sandbox, only **Disk** mode is supported. Memory snapshots aren't available with data disk volumes.

Choose **Memory** when the workload needs in-memory process state. Choose **Disk** when local disk state is enough and the workload can restart on resume.

### Auto-delete

You can enable auto-delete with a delete interval. The delete interval controls how long an inactive sandbox remains available before the policy removes it.

Before you enable auto-delete, decide where durable data belongs. Store long-lived data in external services, mounted volumes, or snapshots rather than relying on an inactive sandbox to remain available indefinitely.

## Capture state explicitly with snapshots

A snapshot is a point-in-time capture of sandbox state. Use a snapshot as a source to create a new sandbox from that captured state.

Snapshots are scoped to the sandbox group that contains them. Because a sandbox group is regional, snapshots are also tied to that group's region.

Common snapshot scenarios include:

- Capturing a prepared environment after installing dependencies, cloning a repository, or warming a model.
- Creating checkpoints before a risky operation so you can create a new sandbox from a known state.
- Fanning out multiple sandboxes from one prepared snapshot instead of repeating setup in each one.
- Preserving local state before deleting a sandbox.

Snapshots capture sandbox-local state. They don't coordinate writes to databases, queues, object storage, APIs, or other external systems. If a workload changes external state, design the workflow so new sandboxes created from snapshots don't repeat non-idempotent operations unintentionally.

## Choose lifecycle policy or snapshots

Lifecycle policy and snapshots solve different state-preservation problems. A workflow can use both.

| Use lifecycle policy when... | Use snapshots when... |
|---|---|
| A sandbox should pause automatically after idle time. | You need an explicit checkpoint before a known workflow step. |
| The same sandbox is expected to resume and continue work. | A new sandbox should be created from a prepared state. |
| You want a default policy for routine interactive or agent sessions. | You want to keep state after deleting the source sandbox. |
| Cleanup can follow a standard retention period. | You need named, labeled, or separately managed sources for new sandboxes. |

Use lifecycle policy as the default safety net for idle sandboxes. Add snapshots where the workflow needs intentional checkpoints or reproducible starts.

## Create-from-snapshot and resume considerations

Resuming a sandbox and creating a sandbox from a snapshot both bring local state forward, but they fit different workflow shapes. Resume continues work in an existing sandbox. A snapshot creates a new sandbox from a captured point-in-time state.

Creating a sandbox from a snapshot uses the CPU, memory, and disk resources captured in that snapshot. You can't change CPU, memory, or disk on the create-from-snapshot flow. Resuming a sandbox resumes the existing sandbox and doesn't change its resources.

Plan for these considerations:

- **Reconnect clients.** Terminal sessions, SDK clients, open network connections, and application-level sessions might need to reconnect after a pause or after you create a new sandbox from a snapshot.
- **Resume before running commands.** Resume the sandbox and wait until it returns to **Running** before running workload commands.
- **Validate external dependencies.** Tokens, leases, locks, and external service state can expire or change while a sandbox is inactive.
- **Make repeated work safe.** New sandboxes created from snapshots can replay local commands or scripts from a previous point. Design setup and teardown steps to be idempotent.
- **Keep shared data outside the sandbox.** Use volumes or external stores for data that must be shared across sandboxes or retained beyond sandbox cleanup.
- **Use disk images for reusable filesystem baselines.** If you need a standard starting filesystem for many sandboxes, use a disk image for the baseline and snapshots for point-in-time runtime checkpoints.

## Operational checklist

Use this checklist when you design a sandbox lifecycle strategy:

- Define the expected lifecycle for each workload: short-lived execution, interactive workspace, agent session, or reusable prepared environment.
- Choose a suspend mode based on whether the workload needs in-memory process state or only local disk state.
- Enable auto-suspend for sandboxes that can pause after inactivity.
- Configure auto-delete for sandboxes that shouldn't remain available after a retention period.
- Create snapshots before risky operations, expensive setup handoffs, or deletion of sandboxes with useful local state.
- Label sandboxes and snapshots with owner, workload, purpose, and retention information.
- Store long-lived or shared data in volumes or external services instead of relying on sandbox-local files.
- Test resume and create-from-snapshot paths as part of the workload, not only during incident recovery.
- Clean up stale snapshots and sandboxes on a schedule.

## Related content

- [Azure Container Apps Sandboxes overview](sandboxes-overview.md)
- [Egress policies in Azure Container Apps Sandboxes](sandboxes-egress-policies.md)
- [Dynamic sessions in Azure Container Apps](sessions.md)
