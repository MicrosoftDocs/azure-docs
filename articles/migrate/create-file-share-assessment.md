---
title: Create a fileshare assessment
description: Learn how to create an Azure Files assessment in Azure Migrate to evaluate readiness, cost, and migration options for on-premises file shares.
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: concept-article
ms.reviewer: v-uhabiba
ms.date: 11/05/2024
# Customer intent: As a cloud architect, I want to create an application assessment using Azure Migrate, so that I can evaluate migration strategies, identify optimal targets, and understand the cost and readiness of my application workloads for the cloud transition.
---

# Assessment of file shares hosted on servers to Azure Files

An Azure Files assessment in Azure Migrate helps you evaluate the readiness, cost, and suitability of migrating on-premises file shares to Azure Files. The assessment analyzes discovered file shares and provides recommendations to support your migration planning.

This article explains how to create Azure Files assessments for **file shares** hosted on Windows and Linux servers. For details information on general Azure Migrate assessment concepts, see [assessment overview](concepts-assessment-overview.md). 

To quickly migrate your on-premises **file shares** to Azure, create an Azure Files assessment to check readiness, cost, and get migration advice for your workloads. 

> [!Note]
>  All assessments created with Azure Migrate are point‑in‑time snapshots. Assessment results can change based on aggregated server performance data or changes in the source environment configuration.  

## Prerequisites 

Before you create an Azure File assessment, ensure that
 - Your on-premises servers, and file shares hosted on these VMs are discovered.
 - You can view all the servers and file shares in the **All inventory** and **Infrastructure** tab. 
For more information about prerequisites, see [Prerequisites for assessments](assessment-prerequisites.md). 

After discovery, decide whether you want to create:
- An As-is on-premises assessment, or
- A Performance-based assessment.
Check [Performance vs. As-is on-premises assessments](target-right-sizing.md) for more details.  

## Create an assessment 

To create an assessment, follow these steps:

1. In the **Azure Migrate** portal, select **Infrastructure** and then select file shares.
1. Select the file shares you want to assess.
1. Apply column-based filters or custom tag–based filters to identify and add file shares to the assessment scope. 
1. After selecting the required file shares, select **Create assessment**.  
1. Provide a friendly name for the assessment. 
1. Review the query used to select the fileshares and verify the number of fileshares added.
1. (Optional) To add more fileshares to the assessment, select **Add workloads**.
1. After the assessment scope is complete, select **Next**.
 
    > [!Note]
    > For accurate calculations, servers hosting the selected fileshares and other colocated fileshares will be automatically added to the assessment scope.  
1. Select Next to move to the Azure Files–specific assessment properties.
1. Select Edit defaults to review and customize Azure Files–specific settings.
1. Select Save after updating any settings.
1. On the Review + create assessment page, review the assessment details, and then select **Create Assessment** to run the assessment.
1. After the assessment is created, view it under **Decide and plan** > **Assessments** > **Workloads**

## Next steps

- Learn how to use [dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
