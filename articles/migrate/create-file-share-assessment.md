---
title: Create a file share assessment
description: Learn how to create an Azure Migrate assessment for discovered file shares—hosted on servers or NAS systems—to evaluate readiness, right-sized targets, and cost for Azure Files, Azure Blob, and Azure NetApp Files.
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: concept-article
ms.reviewer: v-gajeronika
ms.date: 11/05/2025
ms.update-cycle: 365-days
# Customer intent: As a cloud architect, I want to create an application assessment using Azure Migrate, so that I can evaluate migration strategies, identify optimal targets, and understand the cost and readiness of my application workloads for the cloud transition.
---

# Assessment of file shares to Azure Files, Azure Blob, and Azure NetApp Files

A file share assessment in Azure Migrate helps you evaluate the readiness, right-sized target configuration, and cost of migrating on-premises file shares to Azure Files, Azure Blob Storage, and Azure NetApp Files. The assessment analyzes discovered file shares and provides recommendations to support your migration planning.

This article explains how to create assessments for file shares hosted on Windows and Linux servers, and for file shares hosted on network-attached storage (NAS) systems. The share is the unit of assessment: each SMB, NFS, or S3 share is evaluated individually and receives its own readiness verdict, target recommendation, and cost estimate. For general Azure Migrate assessment concepts, see [Assessment overview](concepts-assessment-overview.md).

> [!Note]
>  All assessments created with Azure Migrate are point‑in‑time snapshots. Assessment results can change based on aggregated server performance data or changes in the source environment configuration.  
> Azure Migrate supports assessment of file shares hosted on Windows Server with version greater than Windows Server 2012 R2. It's supported on all Linux distros.

## Prerequisites 

Before you create a file share assessment, ensure that:

- You discovered your on-premises servers and the file shares hosted on them. To assess NAS file shares, ensure that you discovered your NAS systems and they appear in the project.
- You can view the servers, NAS clusters, and file shares in the **All inventory** and **Infrastructure** views.
- At least one discovery cycle completed, so that capacity and protocol metadata is populated.

For more information about prerequisites, see [Prerequisites for assessments](assessment-prerequisites.md).

After discovery, decide which sizing basis you want before you start:

Sizing criteria | What it uses | When to choose it
--- | --- | ---
**As-is on-premises** | The capacity discovered on the source share. | The deep discovery pass didn't run, or you want a capacity-only view that doesn't depend on performance data.
**Performance-based** | Discovered performance data such as IOPS and throughput, adjusted by percentile utilization and comfort factor. | Deep discovery collected performance data and you want a right-sized target rather than a like-for-like one.

For more details, see [Performance vs. As-is on-premises assessments](target-right-sizing.md).

> [!IMPORTANT]
> Where deep-discovery metrics aren't available for a share, Azure Migrate calculates performance values from predefined formulas rather than from measurement. A performance-based assessment still returns a result in that case, so confirm whether the underlying values were measured or derived before you rely on the sizing.

> [!NOTE]
> Azure Migrate doesn’t support file share discovery and TCO assessment on Windows Server 2008 R2. This limitation exists because the operating system lacks the required PowerShell capabilities and system APIs needed to discover file shares and collect assessment data.  

## Create an assessment

To create a file share assessment, follow these steps.

### Select the file shares to assess

1. In the **Azure Migrate** project, select **Explore inventory** > **All inventory**, or select **Infrastructure** and then the **File share** tile.
1. Narrow the list to storage. In **All inventory**, select **Add filter**, set **Filter** to **Type**, and select **NAS** and **File share**.
1. (Optional) Apply column-based filters or custom tag–based filters to narrow the list further, for example to a single business unit or cost center.
1. Select the file shares you want to assess. You can also select a NAS cluster to include the shares it hosts.
1. Select **Create assessment**.
1. On the **Basics** tab, enter a friendly name for the assessment.
1. Review the workloads in scope and verify the number of file shares added. To add more, select **Add workloads**.
1. Select **Next**.

   > [!NOTE]
   > For accurate calculations, servers hosting the selected file shares and co-located file shares (shares that reside on the same volume as a selected share) are automatically added to the assessment scope. The assessment can therefore contain more shares than you explicitly selected.

### Set target, pricing, and sizing options

The **General** tab controls where the workloads land, how they're priced, and how they're sized.

**Target and pricing**

Setting | Description
--- | ---
**Default target location** | The Azure region used for the assessment. SKU availability and price vary by region, so the same share can return a different recommendation in two regions.
**Default environment** | The environment the workloads represent, for example Production. This setting affects the pricing applied.
**Currency** | The currency used for all cost estimates.
**Program/offer** | The pricing program applied, for example Pay-As-You-Go.
**Default savings option** | The reserved capacity or savings plan assumption applied to the estimate. The current release doesn't use a savings option for file shares.
**Discount (%)** | Any organization-specific discount to apply on top of the retail price.
**Subscription** | The subscription whose pricing is applied, where applicable.
**Uptime** | Days per month and hours per day the workload runs. Applies to compute-based targets rather than storage-only targets.

**Assessment criteria**

Setting | Description
--- | ---
**Sizing criteria** | **As-is on-premises** or **Performance-based**.
**Performance history** | The window of discovered performance data to evaluate, for example 1 day. Used only with performance-based sizing.
**Percentile utilization** | The percentile of the performance data used for sizing, for example 95th. A lower percentile produces a smaller target.
**Comfort factor** | A multiplier applied to the sizing basis to create headroom. A comfort factor of 1 applies no headroom; higher values increase sized capacity, and therefore cost.

> [!NOTE]
> Comfort factor is the single setting that moves the cost estimate most. If a TCO figure looks unexpectedly high, check the comfort factor before you investigate anything else.

Select **Next** to continue to the **Advanced** tab.

### Choose target services and storage settings

The **Advanced** tab lists the workload types in the assessment. For file shares, open the **Fileshare assessment settings** to choose which Azure storage services to evaluate and how to configure them. You can change these settings after the assessment is created.

**Target services**

Select which Azure storage services Azure Migrate evaluates each share against.

Target service | Notes
--- | ---
**Azure Files** | Evaluated for discovered file shares. Supports SSD and HDD media.
**Azure Blob** | Evaluated for discovered file shares and buckets.
**Azure NetApp Files** | Selected by default and can't be changed. A share is assessed against Azure NetApp Files only when Azure Migrate detects that the source share is on NetApp NAS; it isn't offered for other platforms.

**Workload type**

Workload type tells Azure Migrate what kind of data the shares hold, so that it can recommend an appropriate performance level and access tier.

Workload type | Use it for
--- | ---
**Mixed workloads** | A general estate where share usage varies and no single profile applies.
**AI/ML workloads** | Shares that feed training or inference pipelines.
**Enterprise, Mission critical** | Latency-sensitive or business-critical shares.
**General purpose file shares** | Standard departmental and user file shares.
**Infrequently used (Archive or backup)** | Shares that are retained but rarely read.

**Storage configuration**

Setting | Description
--- | ---
**Azure Files redundancy type** | The redundancy applied to Azure Files recommendations, for example zone-redundant storage (ZRS). Redundancy affects both availability and price.
**Azure Blob redundancy type** | The redundancy applied to Azure Blob recommendations.
**Azure Files media preferences** | The media types Azure Migrate might recommend, for example Premium SSD, Standard HDD, or both.
**Azure Blob access frequency** | How often the data is read, for example Frequently - Data accessed regularly. This drives the recommended access tier.

Select **Save** to apply the settings, and then select **Next**.

### Review and create

1. On the **Review + create assessment** tab, confirm the assessment name, assessment type, sizing criteria, default target location, target services, and savings options.
1. Review the note about co-located file shares being added to scope.
1. Select **Create assessment** to run the assessment.

A notification confirms that creation is in progress. Recommendations typically appear within a few minutes.

## View the assessment

1. In the project, select **Decide and plan** > **Assessments** > **Workloads**.
1. Use the workload filter to find the assessment, and then select it.

## Things to know

- Assessments are point-in-time. Rerun or recalculate an assessment after a new discovery cycle to pick up changes in the source environment.
- The share is the unit of assessment. Clusters provide context, but readiness, target recommendation, and cost are produced per share.
- Azure NetApp Files is offered only where the source share is NetApp-origin. A Dell PowerScale estate never receives an Azure NetApp Files recommendation.
- Blob sizing isn't performance-validated. Blob recommendations are based on capacity and access frequency inputs. There's no scale, performance, or IOPS/throughput validation.
- On-premises cost estimates are directional. The NAS on-premises cost assumption uses a default for on-premises TCO, which you can view and change under **Manage** > **Cost assumptions (storage)** in your Azure Migrate project settings. This cost hasn't been calibrated against individual customer environments.
- Settings can be edited after creation. You can change the file share assessment settings and recalculate rather than creating a new assessment.

## Next steps

- Learn how to use [dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
