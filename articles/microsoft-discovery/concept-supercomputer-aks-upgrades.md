---
title: Microsoft Discovery Supercomputer AKS upgrades
description: Learn how AKS upgrades affect Microsoft Discovery Supercomputer infrastructure, tools, and running workloads.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 10/09/2026

#CustomerIntent: As a tool author, I want to understand how Microsoft Discovery manages AKS upgrades so that I can prepare my tools and protect long-running work.
---

# Microsoft Discovery Supercomputer AKS upgrades

Microsoft Discovery runs containerized tools on supercomputer infrastructure powered by Azure Kubernetes Service (AKS). This article explains how AKS upgrades occur, how Microsoft Discovery protects active tool executions during an upgrade, and how tool authors can prepare their tools for upcoming Kubernetes versions.

> [!IMPORTANT]
> Microsoft Discovery manages AKS upgrades automatically to keep supercomputer clusters within the AKS support window. Customers can't initiate or schedule an upgrade.

## What to expect during an upgrade

AKS upgrades the control plane before it upgrades each node pool. During a node-pool upgrade, AKS replaces or reimages nodes in stages. The rolling-upgrade configuration controls how much capacity is available while this process occurs.

Rolling upgrades can create temporary surge nodes. These nodes require sufficient compute quota, regional capacity, and available IP addresses. Microsoft Discovery manages the upgrade configuration and required cluster capacity in a way that you don't need to configure or provide extra capacity.

## How Microsoft Discovery protects running tools

Microsoft Discovery uses a Kubernetes Pod Disruption Budget (PDB) to protect an active tool execution from voluntary disruption during an AKS node-pool upgrade. When AKS encounters a node that runs a protected tool, the PDB can block eviction instead of allowing the in-progress execution to move to another node.

If a protected execution prevents node drain:

- When AKS encounters a node that is running a protected Discovery tool, the tool PDB can block eviction rather than allowing the active execution to be rescheduled.
- If a running tool prevents node drain, AKS leaves the workload running on the node that's being upgraded and waits for the tool to complete its execution before continuing the upgrade process. - The upgrade process continues only after the tool completes its execution and the node is drained successfully. AKS can continue the automatic upgrade in a subsequent eligible maintenance window. The exact timing depends on the AKS upgrade policy, maintenance configuration, and cluster state.
- Long-running jobs across multiple node pools can extend the overall upgrade period because each protected execution can delay progress on the node pool being upgraded.


AKS first tries to preserve capacity with surge nodes. If all planned surge capacity isn't available, AKS upgrade continue with temporarily reduced capacity. As a result, newly submitted tools might experience reduced scheduling capacity while an upgrade is in progress.

> [!NOTE]
> A PDB protects against supported voluntary disruptions, such as an AKS node drain. It doesn't prevent involuntary disruptions such as hardware failure, node loss, or resource exhaustion, and it doesn't guarantee that a tool execution can never be interrupted.

## Prepare tools for Kubernetes upgrades

Most tools don't need to know the Kubernetes version used by Microsoft Discovery. The following guidance is especially important if a tool directly depends on a specific Kubernetes version, node operating system, or version-specific runtime behavior.

To keep a tool portable across platform upgrades:

- Package application libraries and runtime dependencies in the container image.
- Use an immutable image digest or a specific version tag for production tools.
- Declare CPU, memory, GPU, storage, networking, identity, and operating-system requirements.
- Use documented Microsoft Discovery inputs, outputs, environment variables, storage, and identity behavior.
- Make long-running operations restartable or checkpoint their progress when the tool design allows it.
- Retain the last-known-good image and tool definition so that you can recover from compatibility issues.

If your tool depends on a specific Kubernetes version, API, or runtime behavior, track the [AKS release calendar and supported-version policy](/azure/aks/supported-kubernetes-versions). Review the [AKS release tracker](/azure/aks/release-tracker) for release status and regional rollout information. Validate the tool against upcoming supported versions and update it before its current dependency reaches end of support.

## Test with an upcoming Kubernetes version

Before an AKS version becomes active in Microsoft Discovery, test the tool's container image in a nonproduction Kubernetes environment outside the Discovery platform. Use the upcoming Kubernetes version and reproduce the tool's relevant dependencies as closely as practical. These dependencies can include the operating system, processor architecture, GPU, storage, identity, and networking requirements.

In the external test environment (AKS cluster out of Microsoft Discovery deployment):

1. Deploy the same container image and tool configuration that you use with Microsoft Discovery.
1. Run representative inputs and verify that the tool starts, completes, and produces the expected output.
1. Validate GPU, storage, identity, and networking behavior when the tool depends on those capabilities.
1. Check for removed or deprecated Kubernetes APIs and version-specific runtime assumptions.
1. Update and retest the tool before its required Kubernetes version reaches end of support.

External Kubernetes testing can identify container-image, API, and runtime compatibility issues. However, an external environment can't fully reproduce Microsoft Discovery infrastructure, orchestration, policies, identity integration, or managed services. Successful external testing therefore doesn't guarantee identical behavior in Microsoft Discovery. After external validation, confirm that your tool continues to use documented Microsoft Discovery interfaces and meets supported tool requirements.

## Related content

- [Automatically upgrade an AKS cluster](/azure/aks/auto-upgrade-cluster)
- [How AKS cluster upgrades work](/azure/aks/upgrade-conceptual)
- [Supported Kubernetes versions in AKS](/azure/aks/supported-kubernetes-versions)
- [Configure rolling upgrades for AKS node pools](/azure/aks/upgrade-aks-node-pools-rolling)
- [Capacity and cost planning for AKS upgrades](/azure/aks/upgrade-capacity-cost-planning)
- [Disruptions and Pod Disruption Budgets](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
- [Plan tool requirements for Microsoft Discovery](how-to-plan-tool-requirements.md)
