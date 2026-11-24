---
title: Assess large numbers of servers in Hyper-V environment for migration to Azure with Azure Catalyst | Microsoft Docs
description: Describes how to assess large numbers of servers in Hyper-V environment for migration to Azure using the Azure Catalyst service.
ms.service: azure-migrate
ms.reviewer: v-gajeronika
ms.topic: how-to
ms.date: 02/06/2025
ms.update-cycle: 1095-days

# Customer intent: As a cloud architect, I want to assess a large number of Hyper-V servers for migration to Azure using a discovery and assessment tool, so that I can effectively plan and execute the migration process while ensuring optimal resource allocation.
---

# Assess large numbers of servers in Hyper-V environment for migration to Azure

This article describes how to assess large numbers of on-premises servers in Hyper-V environment for migration to Azure, using the Azure Catalyst: Discovery and assessment tool.

[Azure Catalyst](migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Catalyst tools, and third-party independent software vendor (ISV) offerings. 


In this article, you learn how to:
> [!div class="checklist"]
> * Plan for assessment at scale.
> * Configure Azure permissions and prepare Hyper-V for assessment.
> * Create an Azure Catalyst project and create an assessment.
> * Review the assessment as you plan for migration.


> [!NOTE]
> If you want to try out a proof-of-concept to assess a couple of servers before assessing at scale, follow our [tutorial series](./tutorial-discover-hyper-v.md).

## Plan for assessment

When planning for assessment of a large number of servers in Hyper-V environment, there are a couple of things to think about:

- **Plan Azure Catalyst projects**: Figure out how to deploy Azure Catalyst projects. For example, if your data centers are in different geographies, or if you need to store discovery, assessment, or migration-related metadata in a different geography, you might need multiple projects.
- **Plan appliances**: Azure Catalyst uses an on-premises Azure Catalyst appliance, deployed as a Hyper-V VM, to continually discover servers for assessment and migration. The appliance monitors environment changes such as adding servers, disks, or network adapters. It also sends metadata and performance data about them to Azure. You need to figure out how many appliances to deploy.


## Planning limits
 
Use the limits summarized in this table for planning.

**Planning** | **Limits**
--- | --- 
**Azure Catalyst projects** | Assess up to 35,000 servers in a project.
**Azure Catalyst appliance** | An appliance can discover up to 5000 servers.<br/> An appliance can connect to up to 300 Hyper-V hosts.<br/> An appliance can only be associated with a single Azure Catalyst project.<br/> Any number of appliances can be associated with a single Azure Catalyst project. <br/><br/> 
**Group** | You can add up to 35,000 servers in a single group.
**Azure Catalyst assessment** | You can assess up to 35,000 servers in a single assessment.



## Other planning considerations

- To start discovery from the appliance, you must select each Hyper-V host. 
- If you're running a multitenant environment, you can't currently discover only servers that belong to a specific tenant. 

## Prepare for assessment

Prepare Azure and Hyper-V for the Discovery and assessment tool: 

1. Verify [Hyper-V support requirements and limitations](migrate-support-matrix-hyper-v.md).
2. Set up permissions for your Azure account to interact with Azure Catalyst.
3. Prepare Hyper-V hosts and servers.

Follow the instructions in [this tutorial](./tutorial-discover-hyper-v.md) to configure these settings.

## Create a project

In accordance with your planning requirements, do the following:

1. Create an Azure Catalyst projects.
2. Add the Azure Catalyst Discovery and assessment tool to the projects.

[Learn more](./create-manage-projects.md) about creating a project.

## Create and review an assessment

1. Create assessments for servers in a Hyper-V environment.
1. Review the assessments in preparation for migration planning.

[Learn more](tutorial-assess-hyper-v.md) about creating and reviewing assessments.
    

## Next steps

In this article, you:
 
> [!div class="checklist"] 
> * Planned to scale Azure Catalyst assessments for servers in Hyper-V environment
> * Prepared Azure and Hyper-V for assessment
> * Created an Azure Catalyst project and ran assessments
> * Reviewed assessments in preparation for migration.

Now, [learn how](concepts-assessment-calculation.md) assessments are calculated, and how to [modify assessments](how-to-modify-assessment.md).