---
title: Snapshots and state management for Azure Container Apps Sandboxes (preview)
description: Azure Container Apps Sandboxes snapshots let you pause and resume workloads without losing state. Learn how autosuspend and snapshots preserve memory and disk.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 05/21/2026
ms.topic: concept-article
ms.service: azure-container-apps
---

# Snapshots and state management for Azure Container Apps Sandboxes (preview)

Azure Container Apps Sandboxes are isolated, lightweight virtual machines designed for short interactive sessions and long-running agentic workloads. Both types need a way to pause and resume work without losing in-memory progress. This article explains the state model, how snapshots fit in, and how to choose between autosuspend and snapshot paths for preserving state.

## What "state" means in a sandbox

A running sandbox has three layers of state:

- **In-memory state**: process memory, open file descriptors, established network connections, and anything else the kernel and your processes hold in RAM.

- **Local disk state**: the sandbox's root filesystem, including any files written under `/tmp`, `/home`, or the working directory.

- **External state**: anything written to attached volumes, object storage, databases, or upstream services.

External state is naturally durable. Local disk and in-memory state are tied to the sandbox's lifetime, so the platform provides two mechanisms to preserve them across pauses and restarts.

## Sandbox lifecycle

A sandbox transitions through four primary states:

| State | Meaning |
|---|---|
| **Running** | Actively executing your workload. |
| **Idle** | The sandbox is running but didn't receive traffic or exec calls within the configured idle window. |
| **Suspended** | The sandbox is suspended either automatically (lifecycle policy) or explicitly. Compute is released. |
| **Resuming** | The platform is reactivating a suspended sandbox. Resume is sub-second when memory state is preserved. |

The lifecycle policy on the sandbox group controls automatic transitions. Snapshots are an orthogonal mechanism that captures full state independent of the lifecycle.

## How to reserve state

The platform offers two complementary mechanisms for preserving state: implicit preservation through lifecycle policies and explicit preservation through snapshots.

### Implicit: lifecycle policy and autosuspend

Every sandbox group has a lifecycle policy that controls autosuspend behavior:

- **Idle timeout**: how long the sandbox can sit idle before suspending. Common values are 60, 120, 300, 600, 1800, and 3600 seconds.
- **Suspend mode**: what to preserve when suspending.
- **Auto-delete**: whether to delete suspended sandboxes after a configurable retention window.

Autosuspend keeps your sandboxes available for a fast resume without you having to write any snapshot code. It's the right choice when most of your sandboxes follow a predictable idle-then-resume pattern (interactive sessions, agent reasoning loops with pauses).

### Explicit: the snapshot action

A snapshot is a captured copy of a sandbox's full state at a point in time. Unlike autosuspend, snapshots persist independently of the source sandbox. You can:

- Create a snapshot, delete the source sandbox, and create a new sandbox from the snapshot later.

- Capture multiple snapshots from the same sandbox over time as checkpoints.

- Use snapshots to move a workload from one sandbox to another after you delete the original.

## Choosing between Memory and Disk suspend modes

When autosuspend fires (or you call suspend explicitly), the platform preserves state according to the configured suspend mode:

| Mode | What's preserved | Resume latency | Storage footprint | Best for |
|---|---|---|---|---|
| **Memory** | Full memory image plus disk | Sub-second | Larger (memory + disk) | Interactive sessions, agent state, long-running workloads with expensive warm-up. |
| **Disk** | Disk only; VM restarts fresh | Cold start (process restart) | Smaller (disk only) | Workloads that boot quickly from disk and don't depend on in-memory state. |

If you're not sure, start with **Memory**. It's the default and the choice that gives you the sub-second resume sandboxes are designed for. Switch to **Disk** when storage cost or memory size becomes a concern.

## Resume and restore semantics

When you restore a sandbox from a snapshot or resume it from a memory suspend, several constraints apply:

- **Resource tier is inherited.** A restored sandbox uses the CPU, memory, and disk allocation captured in the snapshot. You can't change the resource tier on the restore call. To run the workload at a different size, capture a new snapshot from a sandbox sized appropriately.

- **Entrypoint, command, and environment aren't configurable.** When a sandbox's source is a snapshot, the entrypoint, command, and environment variables come from the snapshot. To change them, create a sandbox from the original disk image instead.

- **Region pinning.** Snapshots are scoped to the region of the sandbox group that owns them. Restoring in another region requires recreating the workload in a sandbox group in that region.

## Operational guidance

These patterns make snapshots easier to operate at scale:

- **Label every snapshot.** Labels are the primary way for filtering and discovery in the snapshot list. Encode the workload, owner, and purpose in labels at capture time.

- **Build deletion into your workflow.** Snapshots aren't garbage collected. Pair every long-lived snapshot with a retention policy enforced by your application or scheduled cleanup job.

- **Audit snapshot count.** Periodically list snapshots and report on count and label distribution. Storage costs grow with snapshot count.

- **Treat snapshots as immutable.** A snapshot is a point-in-time capture. To update a snapshot, capture a new one and delete the old one once consumers are moved over.

## Related content

- [Sandboxes overview](sandboxes-overview.md)
- [Sandboxes egress policies](sandboxes-egress-policies.md)
