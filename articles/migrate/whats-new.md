---
title: What's new in Azure Migrate 
description: Learn about what's new and recent updates in the Azure Migrate service.
ms.topic: overview
author: anvar-ms
ms.author: anvar
ms.manager: bsiva
ms.date: 04/19/2020
ms.custom: mvc
---

# What's new in Azure Migrate

[Azure Migrate](migrate-services-overview.md) helps you to discover, assess, and migrate on-premises servers, apps, and data to the Microsoft Azure cloud. This article summarizes new releases and features in Azure Migrate.

## Update (March 2021)
- Support to provide multiple server credentials on Azure Migrate appliance to discover installed applications (software inventory), agentless dependency analysis and discover SQL Server instances and databases in your VMware environment. [Learn more](tutorial-discover-vmware.md#provide-server-credentials)
- Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. [Learn More](concepts-azure-sql-assessment-calculation.md) Refer to the [Discovery](tutorial-discover-vmware.md) and [assessment](tutorial-assess-sql.md) tutorials to get started.
- Agentless VMware migration now supports concurrent replication of 500 VMs per vCenter.

## Update (January 2021)
-  Azure Migrate: Server Migration tool now lets you migrate VMware virtual machines, physical servers, and virtual machines from other clouds to Azure virtual machines with disks encrypted with server-side encryption with customer-managed keys (CMK).

## Update (December 2020)
- Azure Migrate now automatically installs the Azure VM agent on the VMware VMs while migrating them to Azure using the agentless method of VMware migration. (Windows Server 2008 R2 and later)
- Migration of VMware VMs to Azure virtual machines with disks encrypted using server-side encryption (SSE) with customer-managed keys (CMK), using Azure Migrate Server Migration (agentless replication) is now available through Azure portal.

## Update (September 2020)
- Migration of servers to Availability Zones is now supported.
- Migration of UEFI-based VMs and physical servers to Azure generation 2 VMs is now supported. With this release, Azure Migrate: Server Migration tool will not perform the conversion from Gen 2 VM to Gen 1 VM during migration.
- A new Azure Migrate Power BI assessment dashboard is available to help you compare costs across different assessment settings. The dashboard comes with a PowerShell utility that automatically creates the assessments that plug into the Power BI dashboard. [Learn more.](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/assessment-utility)
- Dependency analysis (agentless) can now be run concurrently on a 1000 VMs.
- Dependency analysis (agentless) can now be enabled or disabled at scale using PowerShell scripts. [Learn more.](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/dependencies-at-scale)
- Visualize network connections in Power BI using the data collected using dependency analysis (agentless) [Learn more.](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/dependencies-at-scale)
- Migration of VMware VMs with data disk size of up to 32 TB is now supported using the Azure Migrate: Server Migration agentless VMware migration method.

## Update (August 2020)

- Improved onboarding experience where an Azure Migrate project key is generated from the portal and is used to complete the appliance registration.
- Option to download either OVA/VHD files or the installer scripts from the portal to set up the VMware and Hyper-V appliances respectively.
- Refreshed appliance configuration manager with enhanced user experience.
- Multiple credentials support for Hyper-V VMs discovery.

## Update (July 2020)

- Agentless VMware migration now supports concurrent replication of 300 VMs per vCenter

## Update (June 2020)

- Assessments for migrating on-premises VMware VMs to [Azure VMware Solution (AVS)](./concepts-azure-vmware-solution-assessment-calculation.md) is now supported. [Learn more](how-to-create-azure-vmware-solution-assessment.md)
- Support for multiple credentials on appliance for physical server discovery.
- Support to allow Azure login from appliance for tenant where tenant restriction has been configured.


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

- **RackWare**: Offering cloud migration.
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
- Try out our tutorials to assess [VMware VMs](./tutorial-assess-vmware-azure-vm.md) and [Hyper-V VMs](tutorial-assess-hyper-v.md).
