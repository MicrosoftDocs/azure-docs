---
title: Choose a remote visualization deployment model for Azure HPC
description: Compare standalone, cluster-integrated, and alternative approaches for remote visualization in Azure HPC environments.
ai-usage: ai-generated
author: padmalathas
ms.author: padmalathas
ms.date: 08/24/2026
ms.topic: concept-article
ms.service: azure-virtual-machines
ms.subservice: hpc
# Customer intent: "As an HPC architect, I want to choose a remote visualization deployment model so that the solution matches user workflows, operations, security, and scale requirements."
---

# Choose a remote visualization deployment model for Azure HPC

Remote visualization can use a persistent standalone virtual machine (VM), integrate interactive sessions with an HPC cluster, or be replaced by a simpler access pattern. Choose the model based on how users work, where data resides, and whether sessions need scheduler-managed compute resources.

For the components and design principles common to each model, see [Remote visualization for high-performance computing on Azure](remote-visualization-overview.md).

## Compare deployment models

| Requirement | Standalone visualization | Scheduled cluster visualization | Alternative access pattern |
| --- | --- | --- | --- |
| Typical workflow | Persistent workstation or application session | Interactive work associated with scheduled HPC jobs | Notebook, web application, local visualization, or noninteractive rendering |
| Compute allocation | Fixed to the session-host VM | Requested from an HPC scheduler | Depends on the application or batch workflow |
| Scale pattern | Resize hosts or add independently managed hosts | Add or remove interactive resources through cluster scaling | Scale the web service, notebook platform, or batch jobs |
| User entry point | Native remote-display client or web access | HPC portal or remote-display entry point integrated with the cluster | Browser, command line, or local application |
| Data access | Managed disks or mounted shared storage | Cluster home directories and shared project storage | Application-specific storage access |
| Cost pattern | Session hosts accrue compute charges while running | Interactive nodes accrue compute charges while allocated; shared cluster services and storage can remain | Depends on the selected service and workflow |
| Operations | VM images, sessions, capacity, and licenses | Portal, scheduler integration, cluster images, sessions, and licenses | Application or service operations |
| Best fit | Individuals, small teams, and persistent environments | Shared HPC environments and interactive jobs | Workloads that don't require a full remote Linux desktop |

## Choose standalone visualization

Use standalone visualization when:

- Users need a persistent Linux workstation that isn't tied to a scheduler.
- The application runs entirely on one VM.
- A small number of users need predictable, dedicated capacity.
- Administrators can manage VM images, user access, storage mounts, and software licenses for each host or host pool.

A standalone design can start with one session host and expand to multiple hosts. Decide whether each user receives a dedicated VM or whether concurrent users share a larger VM. Validate session density with the actual workload because CPU, memory, graphics memory, and storage requirements vary significantly among applications.

Standalone visualization is operationally separate from an HPC cluster. Users can still access shared project storage or submit jobs to a cluster, but administrators must design and maintain those connections.

### Standalone planning considerations

- **Users and concurrency:** A single VM can be appropriate for a pilot or a few dedicated users. Larger deployments need a host-allocation, session-brokering, or host-pool design. Product licensing and measured application demand determine the supported number of sessions, not a general user-count range.
- **Availability:** A single VM is a single point of failure unless you add another host and a way to reconnect or reassign users.
- **Cost:** Stopping a VM from inside the guest operating system doesn't release its Azure compute allocation. Deallocate hosts when they aren't required, if the session and application lifecycle permits it. Disks and other retained resources continue to incur charges.
- **Data location:** Mount shared project storage when the workstation must use cluster data. Confirm identity mapping, permissions, and file-system performance.
- **Skills:** The operations team needs Linux VM, image, GPU driver, networking, storage, remote-display, and application-license expertise.

## Choose scheduled cluster visualization

Use scheduled cluster visualization when:

- Interactive work is part of a larger scheduled HPC workflow.
- Sessions need the same identities, home directories, and project storage as batch jobs.
- Users need to request different compute or GPU resources for each session.
- Administrators want scheduler policies to control interactive capacity and resource use.

In this model, an access portal or service requests an interactive job from the scheduler. The scheduler places the session on an appropriate compute resource, and the user connects through the configured remote-display path. The design must account for session startup time, idle-session policies, job limits, resource cleanup, and reconnect behavior.

[Azure CycleCloud Workspace for Slurm](/azure/cyclecloud/overview) includes Open OnDemand as a web entry point. The CycleCloud Workspace for Slurm 2026.03.10 release notes identify ThinLinc integration with Open OnDemand. Verify the feature, configuration, and support path in the specific workspace release that you deploy before making it part of a production design. For the current authentication guidance, see [Configure Open OnDemand with CycleCloud](/azure/cyclecloud/how-to/ccws/configure-open-ondemand).

### Scheduled-cluster planning considerations

- **Users and concurrency:** Scheduler policies, available capacity, application profiles, and portal limits determine concurrency. This model can serve a shared user community, but no fixed user count applies to every cluster.
- **Startup time:** A session can wait for an existing node or for a new node to provision. Set expectations for queue and provisioning time.
- **Cost:** Dynamically provisioned interactive nodes can deallocate after jobs complete, which reduces idle compute charges. Access nodes, scheduler nodes, storage, networking, and other retained resources can continue to incur charges. A scheduled design doesn't make all idle time free.
- **Data location:** Sessions normally use the cluster's identity and shared file systems, which reduces duplicate data paths. Validate permissions and performance from every interactive partition.
- **Skills:** The operations team also needs Slurm, autoscaling, Open OnDemand or the selected portal, cluster images, and interactive-app integration expertise.

## Use data location as a deciding factor

Choose the model that offers the simplest supported path to the authoritative data:

- Choose standalone visualization when the application can use managed disks or a supported shared mount without requiring cluster context.
- Choose scheduled cluster visualization when sessions must use the same identities, home directories, software environment, and project storage as batch jobs.
- Choose an alternative pattern when the application can present reduced results through a browser or transfer a governed, smaller dataset for local use.

Avoid copying complete datasets between the cluster and separate visualization hosts as a routine workflow. Repeated copies increase storage, transfer, synchronization, and data-governance work.

## Choose an alternative access pattern

A full remote desktop adds software, security, capacity, and licensing responsibilities. Choose another pattern when it meets the user need with less operational complexity.

Consider:

- An application-specific web interface for workflows that already run in a browser.
- JupyterHub or another notebook environment for interactive analysis and visualization.
- Noninteractive rendering jobs that write images, animations, or reduced datasets to shared storage.
- Local visualization of reduced results when data size and governance requirements allow transfer.
- SSH and command-line tools when users don't need graphical interaction.

## Make the decision

Use these questions in order:

1. **Does the workload require an interactive graphical session?** If not, use a command-line, web-native, notebook, or batch-rendering pattern.
1. **Does the session need scheduler-allocated cluster resources?** If yes, evaluate scheduled cluster visualization.
1. **Does the user need a persistent environment with fixed capacity?** If yes, evaluate standalone visualization.
1. **Can the selected product support the required operating system, GPU, application, and identity configuration?** If not, select a different product or deployment model.
1. **Can the network deliver acceptable interaction from each user location?** If not, change the region, access path, display settings, or workflow.
1. **Can the team operate the design securely at the expected concurrency?** Include image maintenance, monitoring, recovery, licensing, and user support in the decision.

## Start with a pilot and plan for growth

Use a pilot to establish application compatibility, session resource use, and user experience before you select a production scale model.

A typical growth path is:

1. Test one representative application and dataset on one VM.
1. Measure CPU, system memory, GPU memory, storage, network latency, and reconnect behavior.
1. Add representative concurrent users and identify the resource that reaches its limit first.
1. If users need persistent dedicated environments, standardize the standalone image and host-allocation process.
1. If users need shared scheduler resources, reproduce the workflow through a portal and an interactive partition.
1. Define image updates, monitoring, support ownership, capacity limits, and recovery before production rollout.

Don't assume that a successful standalone pilot can be copied unchanged to scheduled nodes. Scheduler integration changes session startup, cleanup, identity, storage, and reconnect behavior.

## Validate before production

Build a limited proof of concept for the selected model. Test representative applications and data from expected user locations. Record the VM size, driver, operating system, remote-display software version, network latency, session concurrency, and test results so that you can reproduce the production configuration.

Don't publish or standardize a vendor-specific deployment procedure until you reproduce the complete path and identify its support owner.

## Next steps

- [Review remote visualization architecture and security considerations](remote-visualization-overview.md).
- [Plan your CycleCloud Workspace for Slurm deployment](/azure/cyclecloud/how-to/ccws/plan-your-deployment).
- [Review NV-family GPU-accelerated VM sizes](/azure/virtual-machines/sizes/gpu-accelerated/nv-family).
