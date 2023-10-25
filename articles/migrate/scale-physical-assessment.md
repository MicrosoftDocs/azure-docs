---
title: Assess large numbers of physical servers for migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to assess large numbers of physical servers for migration to Azure using the Azure Migrate service.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 05/02/2022
---

# Assess large numbers of physical servers for migration to Azure

This article describes how to assess large numbers of on-premises physical servers for migration to Azure, using the Azure Migrate: Discovery and assessment tool.

[Azure Migrate](migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings. 


In this article, you learn how to:
> [!div class="checklist"]
> * Plan for assessment at scale.
> * Configure Azure permissions and prepare physical servers for assessment.
> * Create an Azure Migrate project, and create an assessment.
> * Review the assessment as you plan for migration.


> [!NOTE]
> If you want to try out a proof-of-concept to assess a couple of servers before assessing at scale, follow our [tutorial series](./tutorial-discover-physical.md).

## Plan for assessment

When planning for assessment of large number of physical servers, there are a couple of things to think about:

- **Plan Azure Migrate projects**: Figure out how to deploy Azure Migrate projects. For example, if your data centers are in different geographies, or you need to store discovery, assessment, or migration-related metadata in a different geography, you might need multiple projects.
- **Plan appliances**: Azure Migrate uses an on-premises Azure Migrate appliance, deployed on a Windows server, to continually discover servers for assessment and migration. The appliance monitors environment changes such as adding servers, disks, or network adapters. It also sends metadata and performance data about them to Azure. You need to figure out how many appliances to deploy.


## Planning limits
 
Use the limits summarized in this table for planning.

**Planning** | **Limits**
--- | --- 
**Azure Migrate projects** | Assess up to 35,000 servers in a project.
**Azure Migrate appliance** | An appliance can discover up to 1000 servers.<br/> An appliance can only be associated with a single Azure Migrate project.<br/> Any number of appliances can be associated with a single Azure Migrate project. <br/><br/> 
**Group** | You can add up to 35,000 servers in a single group.
**Azure Migrate assessment** | You can assess up to 35,000 servers in a single assessment.


## Other planning considerations

- To start discovery from the appliance, you must select each physical server. 

## Prepare for assessment

Prepare Azure and physical servers for Discovery and assessment tool:  

1. Verify [physical server support requirements and limitations](migrate-support-matrix-physical.md).
2. Set up permissions for your Azure account to interact with Azure Migrate.
3. Prepare the physical servers.

Follow the instructions in [this tutorial](./tutorial-discover-physical.md) to configure these settings.

## Create a project

In accordance with your planning requirements, do the following:

1. Create an Azure Migrate project.
2. Add the Azure Migrate Discovery and assessment tool to the projects.

[Learn more](./create-manage-projects.md) about creating projects.

## Create and review an assessment

1. Create assessments for physical servers.
1. Review the assessments in preparation for migration planning.

[Learn more](tutorial-assess-physical.md) about creating and reviewing assessments.
    

## Next steps

In this article, you:
 
> [!div class="checklist"] 
> * Planned to scale Azure Migrate assessments for physical servers.
> * Prepared Azure and physical servers for assessment.
> * Created an Azure Migrate project and ran assessments.
> * Reviewed assessments in preparation for migration.

Now, [learn how](concepts-assessment-calculation.md) assessments are calculated, and how to [modify assessments](how-to-modify-assessment.md).