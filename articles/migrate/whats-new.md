---
title: What's new in Azure Migrate | Microsoft Docs
description: Provides an overview of the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 06/10/2019
ms.author: raynew
ms.custom: mvc
---

# What's new in Azure Migrate

[Azure Migrate](migrate-services-overview.md) helps you to discover, assess, and migrate servers, apps, and data to the Microsoft Azure cloud. This article summarizes new features in Azure Migrate.



## Azure Migrate new version

A new version of Azure Migrate was released in July 2019. 

- **Current (new) version**: Use this version to create Azure Migrate projects, discover on-premises machines, and orchestrate assessments and migrations. 
- **Previous version**: For customer using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can no longer create new Azure Migrate projects, or perform new discoveries. You can still access existing projects. To do this in the Azure portal > All services, search for Azure Migrate. In the Azure Migrate notifications, there's a link to access old Azure Migrate projects.


## Azure Migrate features

The new version of Azure Migrate provides a number of new features:


- **Unified migration platform**: Azure Migrate now provides a single portal to centralize, manage, and track your migration journey to Azure, with an improved deployment flow and portal experience.
- **Assessment and migration tools**: Azure Migrate provides native tools, and integrates with other Azure services, as well as with independent software vendor (ISV) tools. [Learn more](migrate-services-overview.md#isv-integration) about ISV integration.
- **Azure Migrate assessment**: Using the Azure Migrate Server Assessment tool, you can assess VMware VMs and Hyper-V VMs for migration to Azure. You can also assess for migration using other Azure services, and ISV tools.
- **Azure Migrate migration**: Using the Azure Migrate Server Migration tool, you can migrate on-premises VMware VMs and Hyper-V VMs to Azure, as well as physical servers, other virtualized servers, and private/public cloud VMs. In addition, you can migrate to Azure using ISV tools.
- **Azure Migrate appliance**: Azure Migrate deploys a lightweight appliance for discovery and assessment of on-premises VMware VMs and Hyper-V VMs.
    - This appliance is used by Azure Migrate Server Assessment, and Azure Migrate Server Migration for agentless migration.
    - The appliance continuously discovers server metadata and performance data, for the purposes of assessment and migration.  
- **VMware VM migration**:  Azure Migrate Server Migration provides a couple of methods for migrating on-premises VMware VMs to Azure.  An agentless migration using the Azure Migrate appliance, and an agent-based migration that uses a replication appliance, and deploys an agent on each VM you want to migrate. [Learn more](server-migrate-overview.md)
 - **Database assessment and migration**: From Azure Migrate, you can assess on-premises databases for migration to Azure using the Azure Database Migration Assistant. You can migrate databases using the Azure Database Migration Service.
- **Web app migration**: You can assess web apps using a public endpoint URL with the Azure App Service. For migration of internal .NET apps, you can download and run the App Service Migration Assistant. 
- **Data Box**: Import large amounts offline data into Azure using Azure Data Box in Azure Migrate.


## Next steps

- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
- Try out our tutorials to assess [VMware VMs](tutorial-assess-vmware.md) and [Hyper-V VMs](tutorial-assess-hyper-v.md).
