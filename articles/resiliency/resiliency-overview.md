---
title: What is Resiliency?
description: Resiliency is a cloud-native unified business continuity and disaster recovery (BCDR) management platform in Azure that enables you to manage your protection estate across solutions and environments.
ms.topic: overview
ms.service: resiliency
ms.date: 10/20/2026
ms.custom:
  - mvc
  - ignite-2023
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
---
# What is Resiliency?
 
Resiliency in Azure is a unified cloud-native experience for resiliency posture management that helps you protect applications, infrastructure, and data across Azure and hybrid environments. It brings Infrastructure Resiliency, Data Resiliency, and Cyber Recovery into a single experience so that you can assess, monitor, and strengthen your resiliency posture from one location.

> [!TIP]
> Use Resiliency to identify protection gaps, improve your resiliency posture, manage backup and disaster recovery operations at scale, and coordinate recovery activities across environments.

## Resiliency at a glance

This section lists the key resiliency capabilities and how they help you protect, recover, monitor, and govern your workloads.

| Capability area | What it helps you do |
|---|---|
| Infrastructure Resiliency | Prepare for and recover from infrastructure outages using zone resiliency capabilities. |
| Data Resiliency | Meet backup, recovery, and disaster recovery objectives across workloads and environments. |
| Cyber Recovery | Protect backups from ransomware and recover business-critical applications at scale. |
| Unified Monitoring | Monitor jobs, alerts, reports, and protection status from a single experience. |
| Governance and Compliance | Assess resiliency posture and track compliance through Azure Policy integration. |

## Unified resiliency platform

Resiliency in Azure extends the capabilities previously available in Azure Business Continuity Center (ABCC) and provides a broader resiliency experience. It combines resiliency capabilities across infrastructure, data protection, and cyber recovery within a unified platform. 

A single table with Resiliency pillar, Purpose, and Key capabilities column provides an optimal balance of readability and scannability:

| Resiliency pillar | Purpose | Key capabilities |
|---|---|---|
| Infrastructure Resiliency | Protect applications from infrastructure outages and improve availability. | - [Availability Zone Down Drills](availability-zone-down-drills-about.md)<br>- [Zonal Resiliency Goals and Recommendations](goals-recommendations-about.md)<br>- [Azure Recovery Orchestration Plan](recovery-orchestration-plan-about.md) |
| Data Resiliency | Help ensure business continuity through centralized backup and disaster recovery management. | - Backup and replication<br>- Protection policy management<br>- Protection health and operations monitoring<br>- Resiliency configuration review across environments |
| Cyber Recovery | Strengthen protection against ransomware and other cyber threats. | - [Immutability](../backup/backup-azure-immutable-vault-concept.md)<br>- [Soft delete](../backup/secure-by-default.md)<br>- [Multiuser authorization](../backup/multi-user-authorization-concept.md)<br>- [Private endpoints](../backup/backup-azure-private-endpoints-concept.md)<br>- [Customer-managed keys (CMK)](../backup/azure-backup-data-protection-best-practices.md#encryption-of-backup-data)<br>- [Threat detection for Azure VMs](../backup/threat-detection-overview.md) |

## Why should I use Resiliency in Azure?

Some of the key benefits you get with Resiliency include:


| Benefit | Description |
|---|---|
| Single pane of glass for BCDR protection | Manage backup and replication across workload types, vaults, subscriptions, regions, and Azure Lighthouse tenants from a unified experience. Identify protection gaps across your protection estate and review protection settings across multiple policies. |
| Action center | View protection status at scale across Azure, hybrid, and edge environments. Perform core protection and recovery operations across supported solutions from a centralized experience. |
| At-scale unified monitoring | Monitor jobs, alerts, metrics, and reports across vaults. Use a centralized view to manage operations across subscriptions, resource groups, and regions. Resiliency also supports job filtering and detailed job views across Azure Backup and Azure Site Recovery. [Learn more about monitoring in Resiliency](tutorial-monitor-operate.md). |
| BCDR protection posture | Evaluate your current protection configuration and receive proactive notifications about security configuration gaps. Protection posture assessment is currently available for Azure Backup. |
| Governance and compliance | Use built-in Azure Policies to manage BCDR protection at scale and review compliance with assigned policies. You can also create custom Azure Policies and monitor their compliance status in Resiliency. |

## What can I manage with Resiliency? 

Resiliency in Azure allows you to manage data sources protected across the solutions. You can manage these resources from different environments, such as Azure and on-premises. Learn about the [supported scenarios and limitations](resiliency-support-matrix.md).


## Get started

To get started with using Resiliency, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for Resiliency in the search box and go to the Resiliency dashboard.

   :::image type="content" source="./media/business-continuity-center-overview/search-business-continuity-center-service.png" alt-text="Screenshot shows how to search for Business Continuity Center in the Azure portal." lightbox="./media/business-continuity-center-overview/search-business-continuity-center-service.png":::

## Next steps

To learn more about Resiliency and how it works, see:

- [Design BCDR capabilities](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management-business-continuity-disaster-recovery).
- [Review the protectable resources](tutorial-view-protectable-resources.md).
- [Review the protection summary](tutorial-monitor-protection-summary.md).
