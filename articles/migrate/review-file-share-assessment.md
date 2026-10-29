---
title: Review a file share assessment - Azure Migrate
description: Learn how to review a file share assessment in Azure Migrate to evaluate readiness, migration paths, recommended target configurations, and cost estimates for discovered file shares.
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: concept-article
ms.reviewer: v-gajeronika
ms.date: 11/05/2024
ms.custom: subject-cost-optimization
ms.update-cycle: 1825-days
# Customer intent: As a migration planner, I want to conduct an Azure Files assessment for my file shares, so that I can determine the best migration strategies and prepare for a successful transition to Azure.
---

# Review a file share assessment

This article describes the components of a file share assessment and how to read the results, from the estate-level summary down to an individual share. Each discovered SMB, NFS, or S3 file share is evaluated against Azure storage services and receives a readiness verdict, a recommended target configuration, and a cost estimate.

## Overview

An Azure Migrate assessment evaluates on‑premises workloads or workloads hosted in other public clouds for migration to Azure by analyzing readiness, right‑sizing, and cost. A file share assessment helps you evaluate discovered file shares and identify a strategy to migrate them to Azure Files, Azure Blob Storage, Azure NetApp Files, or Azure virtual machines.

Results are organized as migration paths. Each path represents one way to move the assessed estate: everything to a single service, or a mixed recommendation that sends each share to its best-fit target. You can compare readiness and cost across paths before committing to a plan.

> [!NOTE]
> Azure Migrate doesn’t support file share discovery and TCO assessment on Windows Server 2008 R2. This limitation exists because the operating system lacks the required PowerShell capabilities and system APIs needed to discover file shares and collect assessment data.  
 

## Review an assessment

To review a file share assessment, follow these steps: 

1. On the Azure Migrate project **Overview** page, under **Decide and Plan**, select **Assessments**.
   :::image type="content" source="./media/review-application-assessment/overview.png" alt-text="The screenshot that shows where the user can select assessments." lightbox="./media/review-application-assessment/overview.png":::
   
1. Use the **Workloads** filter to search for the assessment, and then select it.
   :::image type="content" source="./media/review-application-assessment/assessments.png" alt-text="The screenshot that shows where the user can start with application assessment review." lightbox="./media/review-application-assessment/assessments.png":::
   

1. Review the **Overview** page to view a summary of the assessed file shares and available migration paths. The recommended migration path is automatically selected based on your migration preferences. 
      :::image type="content" source="./media/review-nas-assessment/assessment-overview.png" alt-text="Screenshot that shows the assessment Overview page with assessed workloads, migration preference, and the available migration paths." lightbox="./media/review-nas-assessment/assessment-overview.png":::

   > [!NOTE]
   > All costs shown are examples and might differ from your results.

### Toolbar actions

The toolbar on the results page provides these actions:

Action | Description
--- | ---
**View settings** | Review the settings the assessment ran with, such as target location, sizing criteria, and storage configuration.
**Recalculate** | Rerun the assessment against the latest discovery data, or after you change the settings.
**Download** | Download the assessment report for offline review and stakeholder sharing.
**Columns** | Add or remove columns from the list views.
**Refresh** | Reload the current view.

### Assessment summary

The top of the **Overview** page summarizes what was assessed and when.

Element | Description
--- | ---
**Assessed workloads** | The number of servers and file shares included in the assessment. Select **View details** to list them.
**Last calculated on** | The date and time the results were produced. Recalculate the assessment if the source environment has changed since then.
**Migration preference** | The preference used to select the recommended path, for example Modernize (AI ready).

:::image type="content" source="./media/review-nas-assessment/assessment-overview.png" alt-text="Screenshot that shows the assessment Overview page with assessed workloads, migration preference, and the available migration paths." lightbox="./media/review-nas-assessment/assessment-overview.png":::

> [!NOTE]
>  All costs shown are examples and might differ from your results.

## Migration scenarios
   Migration scenarios represent the available migration paths for the assessed file shares. Each path is shown as a card, and the recommended path is marked with a star and selected based on your migration preference. For each path, you can review readiness for the target deployment type and cost estimates for shares that are marked as **Ready** or **Ready with conditions**.

Path | What it represents
--- | ---
**File shares to optimal Azure targets** | A mixed recommendation that routes each share to its most suitable service. This is the recommended path when the migration preference prioritizes PaaS targets.
**File shares to Azure Files** | Every assessed share evaluated against Azure Files.
**File shares to Azure Blob** | Every assessed share evaluated against Azure Blob Storage.
**File shares to Azure NetApp Files** | Shares evaluated against Azure NetApp Files. Only NetApp-origin shares are eligible, so this path can cover fewer workloads than the others.
**Lift and shift to Azure VM** | Shares rehosted on Azure virtual machines rather than a storage service. Only on-premises SMB and NFS shares hosted on Windows and Linux systems are eligible, and they're categorized here when they aren't suitable for other paths.

Each card reports the same set of measures, so you can compare the paths directly:

Measure | Description
--- | ---
**Strategy distribution for workloads** | How the workloads break down across Rehost, Replatform, Refactor, Retain, and Retire.
**Azure readiness for workloads** | The readiness percentage and the number of workloads it covers.
**Monthly cost estimate (USD)** | The total, broken down into compute, storage, security, and network.
**Monthly emissions estimate** | Estimated emissions in KgCO2e, broken down the same way.
**Performance coverage (%)** | How much of the sizing was backed by discovered performance data. Use this to judge how much confidence to place in the recommendation.

> [!NOTE]
> A path that shows a lower cost isn't automatically the better choice. Check **Azure readiness for workloads** and the workload count on each card first; a cheaper path might simply cover fewer shares.

:::image type="content" source="./media/review-nas-assessment/compare-paths.png" alt-text="Screenshot that shows migration path cards compared side by side, with strategy distribution, readiness, monthly cost estimate, and emissions." lightbox="./media/review-nas-assessment/compare-paths.png":::

> [!NOTE]
>  All costs shown are examples and might differ from your results.

### Recommended path

A Microsoft‑recommended target minimizes migration effort. When a share qualifies for more than one target, Azure Migrate recommends the most cost‑effective and migration‑ready path. The recommendation includes readiness checks and monthly cost estimates for shares marked **Ready** or **Ready with conditions**. By default, the **Modernize** option is recommended to prioritize PaaS targets.

You can use this path to: 

- Review the best recommended path, readiness states, cost estimates, and suggested configurations for Azure Files or Azure VMs or a combination of both. 

- Understand migration issues and warnings that must be remediated before migrating to Azure Files.  

> [!Note]
> - The recommended deployment strategy is Azure Files when file shares are assessed successfully and meet readiness requirements with cost benefits.
> - Azure Migrate attempts to provide a successful migration path for all selected file shares.
> - If an error occurs during assessment, such as volume or size estimation issues, the affected file share and all collocated shares on the server are recommended for an Azure virtual machine migration path.

### Migrate all files shares to Azure Files

This strategy shows readiness and cost estimates for migrating file shares to Azure Files. Review individual share details, source information, target recommendations, and estimated monthly costs.

Select **View details** to see the following information on each file share: 
- Various readiness states of each of the file shares 
- Source servers hosting such instances 
- Monthly cost 
- Target Azure service SKU 
- Top file shares by used capacity and  

A drill-down view provides details on readiness states, source properties, and target recommendations.

### Migrate all shares to Azure Blob

This strategy shows readiness and cost estimates for migrating file shares and buckets to Azure Blob Storage. Blob recommendations are based on capacity and access frequency inputs; there's no scale, performance, or IOPS/throughput validation in this release.

### Migrate all shares to Azure NetApp Files

This strategy shows readiness and cost estimates for shares evaluated against Azure NetApp Files. Only NetApp-origin shares are eligible, so this path can cover fewer shares than the others.

### Migrate all shares to Azure VM

This strategy lets you rehost all file shares on Azure virtual machines. You can review readiness and cost estimates, using the same readiness and sizing logic as Azure virtual machine assessments. 

This assessment accounts for all the shares on a server to a suitable size Azure VM. It includes: 
- Server readiness state 
- VM SKU 
- Total monthly cost (compute, storage, security) 

:::image type="content" source="./media/review-fileshare-assessment/files-vm-details.jpg" alt-text="A screenshot that shows where the user can check the VM path details." lightbox="./media/review-fileshare-assessment/files-vm-details.jpg":::


### Migration issues

- File share size is 0: If the file share size is reported as 0, a target recommendation isn’t generated. Verify that the file share still exists on the on-premises server.

- File share size exceeds maximum size: If the on-premises file share size exceeds the maximum supported size for Azure Files, the share can’t be migrated to Azure Files. Consider splitting the data across multiple file shares before migration.

## Review path details

Select **View path details** on any card to see the source-to-target combinations behind that path. The page reports the estimated Azure TCO and estimated carbon savings for the path, and lists each workload-to-service mapping.

Column | Description
--- | ---
**Workload to Azure Service mapping** | The source-and-target combination, for example file shares to Azure Files. Select it to drill in.
**Source** | The source workload type.
**Source (#)** | The number of source workloads in this mapping.
**Target** | The recommended Azure service.
**Target (#)** | The number of target resources.
**Migration strategy** | Rehost or Replatform.
**Readiness** | A readiness bar for the mapping.

:::image type="content" source="./media/review-nas-assessment/path-details.png" alt-text="Screenshot that shows the path details page with estimated Azure TCO, carbon savings, and the source-to-target mappings for the recommended path." lightbox="./media/review-nas-assessment/path-details.png":::

> [!NOTE]
> All costs shown are examples and might differ from your results.

## Review a target service in detail

Select a mapping to open the detail page for that target service. The page shows how many shares you evaluated, the readiness breakdown, the cost breakdown, and a per-share list.

### Readiness

The readiness chart groups the assessed shares into four states:

State | Meaning
--- | ---
**Ready** | The share can move to the target service as configured.
**Ready with conditions** | The share can move, but you must review warnings or conditions first.
**Not ready** | The share can't move to this target as assessed.
**Unknown** | Readiness couldn't be determined, usually because required metadata was missing.

### Cost and capacity

- **Monthly cost estimate (USD)** shows the total for the target service, broken down by the recommended configurations, for example Azure Files Standard (HDD) against Azure Files Premium (SSD).
- **Top file shares by used capacity** ranks the largest shares so you can see what drives the estimate. Select **View all** to see the full list.
- **Top migration issues/warnings** groups the most common warnings and the number of shares affected.

### Per-share list

Column | Description
--- | ---
**File share instance** | The share name. Select it to open the share drill-down.
**Host** | The NAS cluster or server that hosts the share.
**Readiness** | The readiness verdict for this share against this target.
**Total monthly cost (USD)** | The estimated monthly cost for this share.
**Recommended configuration** | The recommended Azure configuration, for example Azure Files (SSD) (ZRS).
**Issues (#)** | The number of issues or warnings raised for this share. Select the count to see them.
**Tags** | Tags applied to the share in inventory.

:::image type="content" source="./media/review-nas-assessment/target-detail.png" alt-text="Screenshot that shows the target service detail page with the readiness chart, monthly cost estimate, top shares by capacity, top warnings, and the per-share list." lightbox="./media/review-nas-assessment/target-detail.png":::

> [!NOTE]
> All costs shown are examples and might differ from your results.

## Review an individual share

Select a share to open its drill-down. The page has four tabs:

Tab | What it shows
--- | ---
**Summary** | The readiness verdict, key source properties, the recommended target, and tags.
**Readiness** | The readiness assessment for the share, including any warnings that must be remediated.
**Source properties** | The discovered properties of the share, such as host, operating system, protocol, and protocol version.
**Target recommendations** | The recommended Azure configuration, sizing, cost, and migration tool.

:::image type="content" source="./media/review-nas-assessment/share-summary.png" alt-text="Screenshot that shows the Summary tab for an assessed file share, with readiness, source properties, target recommendation, and tags." lightbox="./media/review-nas-assessment/share-summary.png":::

### Target recommendations

The **Target recommendations** tab contains the details you need to plan the move for a single share:

Field | Description
--- | ---
**Target deployment type** | The recommended Azure service.
**Azure configuration** | The recommended SKU and redundancy, for example Azure Files (SSD) (ZRS) or Azure NetApp Files (Standard).
**Protocol** | The protocol used by the source share.
**Billing model** | The billing model behind the estimate, for example provisioned v2 (Pv2).
**Saving option applied** | Any reservation or savings plan applied to the estimate. In the current release, no reserved-instance pricing is applied for any target.
**Total provisioned size** | The provisioned capacity recommended for the target.
**Provisioned IOPS** | The IOPS recommended for the target.
**Provisioned throughput** | The throughput recommended for the target.
**Estimated monthly cost** | The estimated monthly cost for this share.
**Migration tool** | A suitable tool for moving the data, for example Azure Storage Mover.

> [!NOTE]
> The preceding table details a file share. Similar details exist for Azure Blob and Azure NetApp Files, with their corresponding applicable values.

The page also explains why the recommendation was made. Azure Migrate determines the SKU and access tier by evaluating target region, source protocol, media tier, used size, redundancy type, IOPS, estimated provisioned size, throughput, and workload type suitability against the supported values of each target storage service.

Two further sections help you act on the recommendation:

- **Additional factors for you to consider** - guidance such as using Azure Files Standard (HDD) for cost-sensitive general-use workloads and Azure Files Premium (SSD) for latency-sensitive, mission-critical workloads, plus considerations such as encryption and supported authentication models.
- **Select the right migration tool** - links to the Azure NetApp Files migration assistant for on-premises ONTAP volumes, Azure Storage Mover for Azure Files and Azure Blob lift-and-shift and repeated cloud migrations, and Azure File Sync for active sync and hybrid storage with Windows file servers.

> [!NOTE]
> Migration tool guidance is static in this release. Azure Migrate links to the appropriate tool for the recommended target, but it doesn't select a tool dynamically based on your environment.

:::image type="content" source="./media/review-nas-assessment/target-recommendations.png" alt-text="Screenshot that shows the Target recommendations tab for an assessed file share, with target details, estimated cost, the SKU rationale, and migration tool guidance." lightbox="./media/review-nas-assessment/target-recommendations.png":::

> [!NOTE]
> All costs shown are examples and might differ from your results.

## Act on the results

- **Generate a wave plan** from a path card to sequence the migration into waves.
- **Build a business case** to compare the economics of a PaaS-preferred modernization approach against an IaaS lift-and-shift option across the estate.
- **Download the report** to review the results offline and share them with stakeholders.
- **Recalculate** after a new discovery cycle or after changing assessment settings, so the results reflect the current environment.

## Things to know

- On-premises TCO cost estimates are directional. The NAS on-premises cost assumption uses a default for on-premises TCO, which you can view and change under **Manage** > **Cost assumptions (storage)** in your Azure Migrate project settings. This cost isn't calibrated against individual customer environments.
- Blob recommendations aren't performance-validated. There's no scale, performance, or IOPS/throughput validation behind Blob sizing in this release.
- Performance values might be derived. Where deep-discovery metrics weren't available, performance values are calculated from predefined formulas rather than from measurement.
- Azure NetApp Files is offered only for NetApp-origin shares, which is why that path can cover fewer workloads than the others.
- Co-located shares are included. Shares that reside on the same volume as a selected share are added to the assessment scope automatically, so results might cover more shares than you selected.
- Azure Migrate doesn't move the data. The assessment plans the migration and points to a suitable tool. Data movement is performed by tools such as Azure Storage Mover and Azure NetApp Files migration tooling.
