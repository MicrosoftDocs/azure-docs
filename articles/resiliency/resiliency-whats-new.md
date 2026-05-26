---
title: What's new in the Resiliency service
description: Learn about the new features in the Resiliency service.
ms.topic: release-notes
ms.date: 06/02/2026
ms.service: resiliency
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to stay informed about new features and enhancements in the Resiliency service, so that I can effectively manage data protection and ensure compliance within my organization's cloud infrastructure."
---

# What's new in Resiliency

Resiliency in Azure continues to evolve with new capabilities that help you strengthen your business continuity and disaster recovery (BCDR) readiness. These updates expand support across workloads and environments, enhance protection and security, and improve the availability and recoverability of your applications and data. The service also introduces new capabilities for unified management, monitoring, and automation across your resiliency estate.

Bookmark this page to learn more about the new releases.

## Updates summary

- June 2026

  - [Availability Zone Down Drills in Infrastructure Resiliency Manager (preview)](#availability-zone-down-drills-in-infrastructure-resiliency-manager-preview)
  - [Zonal resiliency goals and recommendations for Infrastructure Resiliency Manager (preview)](#zonal-resiliency-goals-and-recommendations-for-infrastructure-resiliency-manager-preview)
  - [Azure recovery orchestration plan for zonal failover (preview)](#azure-recovery-orchestration-plan-for-zonal-failover-preview)


## Availability Zone Down Drills in Infrastructure Resiliency Manager (preview)

Availability Zone Down Drills (preview) is now available in Infrastructure Resiliency Manager. You can simulate availability zone outages for Service Group resources and assess cross-zone resiliency before an actual outage.

Key capabilities include:

- **Availability zone fault simulation**: Simulates availability zone failures across supported Azure resource types by using Azure-recommended faults. This simulation automatically injects faults such as Virtual Machine shutdown, Virtual Machine Scale Set zone shutdown, Azure Kubernetes Service (AKS) node pool shutdown, forced database failovers, and more.

- **Custom fault definition**: Defines custom fault logic for unsupported resource by integrating with Azure Runbooks.

- **Recovery plan integration**: Integrates with Recovery Plans to perform failover and reprotection operations after fault injection and verify Service Group recoverability.

- **Real-time health monitoring**: Monitors Service Group resource health in real-time during drill execution through integrated metrics.

- **Drill tracking and audit**: Tracks drill execution history with notes, attestation, and run-level status.

For more information, see [Availability Zone Down Drills in Infrastructure Resiliency Manager (preview)](availability-zone-down-drills-about.md).

## Zonal resiliency goals and recommendations for Infrastructure Resiliency Manager (preview)

Infrastructure Resiliency Manager helps you define zonal resiliency goals, track adherence across resources, and assess overall resiliency posture across your environment.

It provides resource-level recommendations to close resiliency gaps, along with qualitative cost indicators (High, Medium, Low, or No cost impact) to support prioritization. You can monitor resiliency posture across all resources and service groups through a unified view, refine evaluations by excluding noncritical resources or attesting custom-protected resources, and keep assessments up to date through resource rediscovery.

Key capabilities include:

- **Zonal resiliency goals and tracking**: Sets goals for service groups and tracks adherence across resources.

- **Resiliency recommendations**: Identifies and closes resource-level resiliency gaps.

- **Cost impact indicators**: Evaluates recommendations with qualitative cost insights.

- **At-scale resiliency view**: Monitors posture across resources and service groups.

- **Resource exclusion and attestation**: Excludes noncritical resources or attests custom-protected resources.

- **Resiliency agent**: Generates recommendations, creates IaC templates, and validates templates.

- **Resource rediscovery**: Refreshes evaluation when service group membership changes.

For more information, see [Goals and recommendations in Infrastructure Resiliency Manager (preview)](goals-recommendations-about.md).

## Azure recovery orchestration plan for zonal failover (preview)

Azure Recovery Orchestration Plan enables you to orchestrate application recovery across multiple Azure resources for zonal resiliency. You can create and manage recovery plans to control and automate zonal failover.

Key benefits include:

- **Zonal failover orchestration**: Orchestrates failover across multiple Azure resource types and services, including Virtual Machines, Virtual Machine Scale Sets, SQL databases, Azure SQL Managed Instance (SQL - MI) Cosmos DB, PostgreSQL database, AKS, Storage accounts, and more. Resources configured with a Highly Available (HA) solution perform self-managed failover, and orchestration excludes these resources from its workflow.

- **Failover sequencing**: Defines recovery order by using customizable groups to control the execution sequence.

- **Automated readiness assessment**: Runs automated readiness checks every 24 hours to evaluate recovery posture and detect application drift.

- **Runbook integration**: Uses Azure Automation runbooks as prescripts and post-scripts for group-level failover actions.

- **Manual control during failover**: Adds manual action steps that pause execution until you complete required interventions.

For more information, see [Azure Recovery Orchestration Plan (preview)](recovery-orchestration-plan-about.md).

## Related content

- [About Resiliency in Azure](resiliency-overview.md).
- [Support matrix for Resiliency](resiliency-support-matrix.md).