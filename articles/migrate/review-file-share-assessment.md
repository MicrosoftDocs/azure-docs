---
title: Review Azure Files assessment results in Azure Migrate
description: Learn how to review Azure Files assessment results created using Azure Migrate to evaluate readiness, risks, and cost estimates.
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: concept-article
ms.reviewer: v-uhabiba
ms.date: 11/05/2024
monikerRange:
# Customer intent: As a migration planner, I want to conduct an Azure Files assessment for my Fileshares, so that I can determine the best migration strategies and prepare for a successful transition to Azure.
---

# Review an Azure Files assessment

This article describes the components of an Azure Files assessment and how to review the assessment after it’s created.

## Overview

An Azure Migrate assessment evaluates on‑premises workloads or workloads hosted in other public clouds for migration to Azure by analyzing readiness, right‑sizing, and cost. An Azure Files assessment helps you evaluate file shares and identify a strategy to migrate them to Azure Files. 

## Review an assessment

To review an Azure Files assessment, follow the steps: 

1. On the Azure Migrate project **Overview** page, under **Decide and Plan**, select **Assessments**.
   :::image type="content" source="./media/review-application-assessment/overview.png" alt-text="The screenshot that shows where the user can start with application assessment review." lightbox="./media/review-application-assessment/overview.png":::
   
1. Use the **Workloads** filter to search for the assessment, and then select it.
   :::image type="content" source="./media/review-application-assessment/assessments.png" alt-text="The screenshot that shows where the user can start with application assessment review." lightbox="./media/review-application-assessment/assessments.png":::
   

1. Review the **Overview** page to view a summary of the assessed fileshares and available migration paths. The recommended migration path is automatically selected based on your migration preferences. 
      :::image type="content" source="./media/review-fileshare-assessment/file-share-assessment-overview.jpg" alt-text="A screenshot that shows where the user can start with application assessment review." lightbox="./media/review-fileshare-assessment/file-share-assessment-overview.jpg":::

## Migration scenarios
   Migration scenarios represent the available migration paths for assessed file shares. For each scenario, you can review readiness for the target deployment type and cost estimates for shares that are marked as Ready or Ready with conditions. 

### Recommended path

A Microsoft‑recommended target minimizes migration effort. When a fileshare supports both Azure Files and Azure VM options, Azure Migrate recommends the most cost‑effective and migration‑ready path, including readiness checks and monthly cost estimates for shares marked Ready or Ready with conditions. By default, the Modernize option is recommended to prioritize PaaS targets.

:::image type="content" source="./media/review-fileshare-assessment/recommended-path.jpg" alt-text="A screenshot that shows where the user can start with recommended path review." lightbox="./media/review-fileshare-assessment/recommended-path.jpg":::

You can use this path to: 

- Review the best recommended path, readiness states, cost estimates, and suggested configurations for Azure Files or Azure VMs or a combination of both. 

- Understand migration issues and warnings that must be remediated before migrating to Azure Files.  

> [!Note]
> - The recommended deployment strategy is Azure Files when fileshares are assessed successfully and meet readiness requirements with cost benefits.
> - Azure Migrate attempts to provide a successful migration path for all selected file shares.
> - If an error is encountered during assessment, such as volume or size estimation issues, the affected fileshare and all collocated shares on the server are recommended for an Azure virtual machine migration path.

### Migrate all files shares to Azure Files

This strategy shows readiness and cost estimates for migrating fileshares to Azure Files. Review individual share details, source information, target recommendations, and estimated monthly costs.
:::image type="content" source="./media/review-fileshare-assessment/fileshare-to-azure-files.jpg" alt-text="A screenshot that shows where the user can start with Azure Files path review." lightbox="./media/review-fileshare-assessment/fileshare-to-azure-files.jpg":::

Select **View details** to see following information on each fileshare: 
- Various readiness states of each of the file shares 
- Source servers hosting such instances 
- Monthly cost 
- Target Azure service SKU 
- Top file shares by used capacity and  

:::image type="content" source="./media/review-fileshare-assessment/view-assessment-details.jpg" alt-text="A screenshot that shows where the user can check the assessment details." lightbox="./media/review-fileshare-assessment/view-assessment-details.jpg":::

A drill-down view provides details on readiness states, source properties, and target recommendations.

:::image type="content" source="./media/review-fileshare-assessment/instance-level-details.jpg" alt-text="A screenshot that shows where the user can check the instance level details." lightbox="./media/review-fileshare-assessment/instance-level-details.jpg":::

### Migrate all shares to Azure VM

This strategy lets you rehost all file shares on Azure virtual machines. You can review readiness and cost estimates, using the same readiness and sizing logic as Azure virtual machine assessments. 

This assessment accounts for all the shares on a server to a suitable size Azure VM. It includes: 
- Server readiness state 
- VM SKU 
- Total monthly cost (compute, storage, security) 

:::image type="content" source="./media/review-fileshare-assessment/files-vm-details.jpg" alt-text="A screenshot that shows where the user can check the VM path details." lightbox="./media/review-fileshare-assessment/files-vm-details.jpg":::


### Migration issues

- Fileshare size is 0: If the file share size is reported as 0, a target recommendation isn’t generated. Verify that the file share still exists on the on-premises server.

- Fileshare size exceeds maximum size: If the on-premises file share size exceeds the maximum supported size for Azure Files, the share can’t be migrated to Azure Files. Consider splitting the data across multiple file shares before migration.

