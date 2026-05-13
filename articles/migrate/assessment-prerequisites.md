---
title: Assessment Prerequisites
description: This article lists the prerequisites to perform assessments in Azure Migrate.
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 09/08/2025
ms.reviewer: v-uhabiba
ms.update-cycle: 180-days

# Customer intent: As a cloud administrator, I want to ensure that all prerequisites for Azure Migrate assessments are met so that I can obtain accurate readiness and sizing evaluations for our workloads before migration.
---

# Prerequisites for assessments

Azure Migrate assessments identify the readiness and rightsized Azure targets by using the configuration and performance data collected from the source workloads. The quality of assessments depends on the quality of the data available for assessments. To get high-quality assessments, make sure that you meet all the prerequisites. Before you create the assessments, ensure that you:

- Discovered the inventory of all the workloads and applications that you intend to assess.
- Resolved any data collection issues for which your workloads were flagged.
- Have enough performance data collected before you create the assessment. You can create assessments anytime, but we recommend that you let the appliance collect the performance data for at least 24 hours.
- Confirmed that the appliances are in a connected state and performance data is flowing for better results for appliance-based discovery.
- Have access to the required subscriptions if you have an Enterprise Agreement with Microsoft and want to use the negotiated prices to identify the resource cost.

## Discovery sources

The discovery source might vary for different workloads depending on the data that's required to create the assessments. You can discover your on-premises servers by using one of the following methods:

   - [Deploy](tutorial-discover-vmware.md) a lightweight Azure Migrate appliance to perform agentless discovery.
   - [Import](tutorial-import-vmware-using-rvtools-xlsx.md) the workload information by using predefined templates.

We recommend the Azure Migrate appliance as the discovery source. It provides an in-depth view of your machines and ensures regular flow of configuration and performance data. It also accounts for changes in the source environment.

## What data does the appliance collect?

If you use the Azure Migrate appliance for assessment, see the [metadata and performance data](discovered-metadata.md) that's collected as an input for the assessment.

## Tag workloads correctly

Make sure that you tag all the servers and workloads correctly for the appropriate target recommendations. Assessment uses special tags to identify the machines and workloads that operate in the dev/test environment and mark the workloads and servers for retention or retirement.

If the workloads and servers operate in the dev/test environment, tag them with `AzM.Environment: Dev`. If this tag is absent on the servers or workloads, they're considered as production workloads by default.

To retain or retire workloads and servers, tag them with `AzM.MigrationIntent: Retain` or `AzM.MigrationIntent: Retire`. If the tag isn't applied, Azure Migrate treats the server or workload as a candidate for migration or modernization. Apply the same tag consistently to servers and all associated workloads to ensure accurate recommendations. For example, if Server 1 must be retained, apply the `Retain` tag to the server and all hosted databases.

## Related content

- Migrate [VMware VMs](tutorial-migrate-vmware.md), [Hyper-V VMs](tutorial-migrate-hyper-v.md), and [physical servers](tutorial-migrate-physical-virtual-machines.md).
