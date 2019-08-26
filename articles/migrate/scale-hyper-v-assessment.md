---
title: Assess large numbers of Hyper-V VMs for migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to assess large numbers of Hyper-V VMs for migration to Azure using the Azure Migrate service.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: raynew
---

# Assess large numbers of Hyper-V VMs for migration to Azure

This article describes how to assess large numbers (> 1000) of on-premises Hyper-V VMs for migration to Azure, using the Azure Migrate Server Assessment tool.

[Azure Migrate](migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings. 


In this article, you learn how to:
> [!div class="checklist"]
> * Plan for assessment at scale.
> * Configure Azure permissions, and prepare Hyper-V for assessment.
> * Create an Azure Migrate project, and create an assessment.
> * Review the assessment as you plan for migration.


> [!NOTE]
> If you want to try out a proof-of-concept to assess a couple of VMs before assessing at scale, follow our [tutorial series](tutorial-prepare-hyper-v.md)

## Plan for assessment

When planning for assessment of large number of Hyper-V VMs, there are a couple of things to think about:

- **Plan Azure Migrate projects**: Figure out how to deploy Azure Migrate projects. For example, if your data centers are in different geographies, or you need to store discovery, assessment or migration-related metadata in a different geography, you might need multiple projects.
- **Plan appliances**: Azure Migrate uses an on-premises Azure Migrate appliance, deployed as a Hyper-V VM, to continually discover VMs for assessment and migration. The appliance monitors environment changes such as adding VMs, disks, or network adapters. It also sends metadata and performance data about them to Azure. You need to figure out how many appliances to deploy.


## Planning limits
 
Use the limits summarized in this table for planning.

**Planning** | **Limits**
--- | --- 
**Azure Migrate projects** | Assess up to 10,000 VMs in a project.
**Azure Migrate appliance** | An appliance can discover up to 5000 VMs.<br/> An appliance can connect to up to 300 Hyper-V hosts.<br/> An appliance can only be associated with a single Azure Migrate project.<br/><br/> 
**Azure Migrate assessment** | You can assess up to 10,000 VMs in a single assessment.



## Other planning considerations

- To start discovery from the appliance, you have to select each Hyper-V host. 
- If you're running a multi-tenant environment, you can't currently discover only VMs that belong to a specific tenant. 

## Prepare for assessment

Prepare Azure and Hyper-V for server assessment. 

1. Verify [Hyper-V support requirements and limitations](migrate-support-matrix-hyper-v.md).
2. Set up permissions for your Azure account to interact with Azure Migrate
3. Prepare Hyper-V hosts and VMs

Follow the instructions in [this tutorial](tutorial-prepare-hyper-v.md) to configure these settings.

## Create a project

In accordance with your planning requirements, do the following:

1. Create an Azure Migrate projects.
2. Add the Azure Migrate Server Assessment tool to the projects.

[Learn more](how-to-add-tool-first-time.md)

## Create and review an assessment

1. Create assessments for Hyper-V VMs.
1. Review the assessments in preparation for migration planning.

[Learn more](tutorial-assess-hyper-v.md) about creating and reviewing assessments.
    

## Next steps

In this article, you:
 
> [!div class="checklist"] 
> * Planned to scale Azure Migrate assessments for Hyper-V VMs
> * Prepared Azure and Hyper-V for assessment
> * Created an Azure Migrate project and ran assessments
> * Reviewed assessments in preparation for migration.

Now, [learn how](concepts-assessment-calculation.md) assessments are calculated, and how to [modify assessments](how-to-modify-assessment.md)
