---
title: What's new in Azure Migrate 
description: Learn about what's new and recent updates in the Azure Migrate service.
ms.topic: overview
ms.date: 04/19/2020
ms.custom: mvc
---

# What's new in Azure Migrate

[Azure Migrate](migrate-services-overview.md) helps you to discover, assess, and migrate on-premises servers, apps, and data to the Microsoft Azure cloud. This article summarizes new releases and features in Azure Migrate.

## Update (June 2020)

New Azure Migrate appliance versions.

### Azure public cloud

**Scenario*** | **Download** | **SHA256**
--- | --- | ---
Hyper-V (8.93 MB) | [Latest version](https://aka.ms/migrate/appliance/hyperv) |  572be425ea0aca69a9aa8658c950bc319b2bdbeb93b440577264500091c846a1
VMware (10.9 GB) | [Latest version](https://aka.ms/migrate/appliance/vmware) | cacbdaef927fe5477fa4e1f494fcb7203cbd6b6ce7402b79f234bc0fe69663dd
Physical (63.1 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2105112) | 0a27adf13cc5755e4b23df0c05732c6ac08d1fe8850567cb57c9906fbc3b85a0


### Azure Government

**Scenario*** | **Download** | **SHA256**
--- | --- | ---
Hyper-V (63.1 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2120200&clcid=0x409) |  2c5e73a1e5525d4fae468934408e43ab55ff397b7da200b92121972e683f9aa3
VMware (63.1 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2120300&clcid=0x409 ) | 3d5822038646b81f458d89d706832c0a2c0e827bfa9b0a55cc478eaf2757a4de
Physical (63.1 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2120100&clcid=0x409) | 93dfef131026e70acdfad2769cd208ff745ab96a96f013cdf3f9e1e61c9b37e1



## Update (April 2020)

Azure Migrate supports deployments in Azure Government. 

- You can discover and assess VMware VMs, Hyper-V VMs, and physical servers.
- You can migrate VMware VMs, Hyper-V VMs, and physical servers to Azure.
- For VMware migration, you can use agentless or agent-based migration. [Learn more](server-migrate-overview.md).
- [Review](migrate-support-matrix.md#supported-geographies-azure-government) supported geographies and regions for Azure Government.
- [Agent-based dependency analysis](concepts-dependency-visualization.md#agent-based-analysis) isn't supported in Azure Government.
- Features in preview are supported in Azure Government, specifically [agentless dependency analysis](concepts-dependency-visualization.md#agentless-analysis), and [application discovery](how-to-discover-applications.md).


## Update (March 2020)

A script-based installation is now available to set up the [Azure Migrate appliance](migrate-appliance.md):

- The script-based installation is an alternative to the .OVA (VMware)/VHD (Hyper-V) installation of the appliance.
- It provides a PowerShell installer script that can be used to set up the appliance for VMware/Hyper-V on an existing machine running Windows Server 2016.

## Update (November 2019)

A number of new features were added to Azure Migrate:

- **Physical server assessment**. Assessment of on-premises physical servers is now supported, in addition to physical server migration that is already supported.
- **Import-based assessment**. Assessment of machines using metadata and performance data provided in a CSV file is now supported.
- **Application discovery**: Azure Migrate now supports application-level discovery of apps, roles, and features using the Azure Migrate appliance. This is currently supported for VMware VMs only, and is limited to discovery only (assessment isn't currently supported). [Learn more](how-to-discover-applications.md)
- **Agentless dependency visualization**: You no longer need to explicitly install agents for dependency visualization. Both agentless and agent-based are now supported.
- **Virtual Desktop**: Use ISV tools to assess and migrate on-premises virtual desktop infrastructure (VDI) to Windows Virtual Desktop in Azure.
- **Web app**: The Azure App Service Migration Assistant, used for assessing and migration web apps, is now integrated into Azure Migrate.

New assessment and migration tools were added to Azure Migrate:

- **Rackware**: Offering cloud migration.
- **Movere**: Offering assessment.

[Learn more](migrate-services-overview.md) about using tools and ISV offerings for assessment and migration in Azure Migrate.

## Azure Migrate current version

The current version of Azure Migrate (released in July 2019) provides a number of new features:

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

## Azure Migrate previous version

If you're using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can no longer create new Azure Migrate projects, or perform new discoveries. You can still access existing projects. To do this in the Azure portal > **All services**, search for **Azure Migrate**. In the Azure Migrate notifications, there's a link to access old Azure Migrate projects.



## Next steps

- [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.
- [Review frequently asked questions](resources-faq.md) about Azure Migrate.
- Try out our tutorials to assess [VMware VMs](tutorial-assess-vmware.md) and [Hyper-V VMs](tutorial-assess-hyper-v.md).
