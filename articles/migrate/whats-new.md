---
title: What's New in Azure Migrate
description: Learn about what's new and recent updates in the Azure Migrate service.
ms.topic: overview
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.service: azure-migrate
ms.date: 02/24/2025
ms.custom: mvc, engagement-fy25
---

# What's new in Azure Migrate

[Azure Migrate](migrate-services-overview.md) helps you discover, assess, and migrate on-premises servers, apps, and data to the Azure cloud platform. This article summarizes new releases and features in Azure Migrate.

## Update (June) 2025

- Public preview: Azure Migrate supports end-to-end migration of Gen2 VMs—(VM with UEFI boot type)—to Trusted Launch virtual machines (TVMs). This is available for all migration scenarios (VMware, Hyper-V, and Physical). Users can now assess their Gen2 VMs for TVM readiness and perform direct migrations to TVMs using Azure Migrate. It includes full support for  Secure boot, **test migrations** and **scaled migrations**, enabling a seamless and secure transition to Trusted Launch VMs.
- Public preview: Azure Migrate supports sustainability efforts by offering Sustainability insights in its Business Case. It empowers IT, finance, and sustainability teams estimate on-premise emissions, compare them with Azure emissions, track yearly reductions, and show both cost and environmental benefits in a single view. This enables customers to make smart migration choices that reduce carbon emissions and support their organization’s ESG goals.


## Update (May 2025)

- General availability: Azure Migrate enhances support for [Premium v2 SSD Disks](/azure/virtual-machines/disks-deploy-premium-v2?tabs=azure-cli). This offers a seamless experience to migrate their on-premise workloads to Azure and benefit from the with advanced disk options that offer greater flexibility and enhanced performance of Pv2 disks in Azure. 
- Public preview: Azure Migrate expands support for migrations with [Ultra SSD](/azure/virtual-machines/disks-enable-ultra-ssd?tabs=azure-portal).This enables customers to seamlessly migrate their on-premise workloads to Azure while taking advantage of Ultra Disk’s cutting-edge performance and scalability.
- Public preview: Azure Migrate enhances resiliency by supporting migration to [ZRS Disks](/azure/virtual-machines/disks-deploy-zrs?tabs=portal) during Migration only. **Zone-Redundant Storage (ZRS)** for Azure Disks synchronously replicates data across three physically separate availability zones within a region – each with independent power, cooling, and networking – enhancing Disk availability and resiliency.

- General availability: Azure Migrate now supports a simplified experience through its upgraded version of the agent-based migration stack. This stack offers a streamlined experience for customers and is set to replace the classic experience over the next three years. [Learn more](simplified-experience-for-azure-migrate.md).

- Public preview: Azure Migrate supports application awareness to offer an enhanced and modernized user experience. This feature streamlines the discovery, assessment, and migration of on-premises applications and workloads to Azure. It streamlines and enhances the decision-making, planning, and migration workflow by identifying and evaluating the current state of your on-premises infrastructure.

- Updated inventory view: Explore the inventory of discovered workloads across the infrastructure, data, and web tiers. [Learn more](how-to-review-discovered-inventory.md).

- Tags: Tags in Azure Migrate enhance analysis by enabling customers to group and visualize related resources based on specific properties. [Learn more](resource-tagging.md).

- Enhanced dependency analysis: Use the new dependency analysis experience to identify application boundaries and group workloads accordingly. [Learn more](how-to-create-group-machine-dependencies-agentless.md).

- Application assessment: You can include constituent workloads, such as application servers, web apps, and databases. The assessment then evaluates all potential Azure target services for these workloads and provides a recommended migration path, along with cost and readiness details. [Learn more](review-application-assessment.md).

- Action Center: Azure Migrate now includes Action Center, which offers a centralized hub for users to view and manage all migration-related issues, pending actions, and jobs within a project. [Learn more](centralized-issue-tracking.md).

## Update (February 2025)

- Public preview: Azure Migrate now supports discovery and assessment of MySQL databases. You can use this capability to:
  - Discover MySQL instances and their attributes within your environment.
  - Assess the readiness of these instances for migration to Azure Database for MySQL.
  - Obtain recommendations on suitable compute and storage options, along with the associated costs.
  
  [Learn more](assessments-overview-migrate-to-azure-db-mysql.md).


## Update (November 2024)

- Azure VMware Solution assessments now support cost assessments with the AV64 host type and Azure NetApp Files as an external storage option. [Learn more](how-to-create-azure-vmware-solution-assessment.md).
- Azure Migrate offers support for the cost of host types when you're porting an on-premises VMware Cloud Foundation subscription to Azure VMware Solution.
- Azure Migrate offers support for migrating Enterprise Linux machines (RHEL and SLES) in VMware and Hyper-V environments to Azure, through Azure Hybrid Benefit. [Learn more](tutorial-migrate-hyper-v.md).
- Public preview: Azure Migrate now supports creating a business case for Azure Arc and onboarding servers to Azure Arc from the Azure Migrate inventory. [Learn more](how-to-arc-enable-inventory.md).

By using these capabilities, you can visualize the value that Azure Arc brings to your on-premises estate throughout the migration journey. This visualization helps enable confident, informed decisions. You can also check if your on-premises servers are already Azure Arc-enabled. If they're not Azure Arc-enabled, you can generate an onboarding script to deploy at scale by using automation tools for the servers that you choose to enable.

## Update (October 2024)

The RVTools XLSX (preview) file import now reads storage data, when available, from vPartition and vMemory (for storage required for unreserved memory) sheets. [Learn more](tutorial-import-vmware-using-rvtools-xlsx.md#prerequisites).

## Update (April 2024)

- Movere: The Movere service retired on March 1, 2024. Users should use Azure Migrate for the discovery and assessment of on-premises workloads.
- Public preview: Azure Migrate now supports discovery and assessment of SAP systems. By using this capability, you can perform import-based assessments for your on-premises SAP inventory and workloads. [Learn more](./concepts-azure-sap-systems-assessment.md).
- Public preview: You can now assess your Java (Tomcat) web apps for both Azure App Service and Azure Kubernetes Service (AKS). [Learn more](concepts-azure-webapps-assessment-calculation.md).

## Update (March 2024)

- Public preview: Spring Boot app discovery and assessment is now available through a packaged solution to deploy a Kubernetes appliance. [Learn more](tutorial-discover-spring-boot.md).

## Update (February 2024)

- Public preview: Envision savings with Azure Hybrid Benefit by bringing your existing Enterprise Linux subscriptions (RHEL and SLES) to Azure via Azure VM assessments and a business case. [Learn more](concepts-azure-sql-assessment-calculation.md).

## Update (January 2024)

- Public preview: By using the RVTools XLSX file, you can import an on-premises VMware environment's server configuration data into Azure Migrate and create a quick business case. You can also assess the cost of hosting these workloads on Azure and Azure VMware Solution environments. [Learn more](migrate-support-matrix-vmware.md#import-servers-using-rvtools-xlsx-preview).

## Update (December 2023)

- Envision cost savings from Azure management services (Azure Backup, Azure Monitor, and Azure Update Manager) by using an Azure Migrate business case. [Learn more](how-to-view-a-business-case.md).

## Update (November 2023)

- Public preview: Assess your ASP.NET web apps for migration to Azure Kubernetes Service. By using this feature, you get insights such as app readiness, cluster rightsizing, and cost of running these web apps on AKS. [Learn more](tutorial-assess-aspnet-aks.md).
- Public preview: Assess your ASP.NET web apps for migration to Azure App Service containers. [Learn more](tutorial-assess-webapps.md).
- Public preview: Get the total cost of ownership (TCO) comparison for your ASP.NET web apps running on AKS and App Service containers in an Azure Migrate business case. [Learn more](how-to-build-a-business-case.md).

## Update (September 2023)

- Azure Migrate now supports discovery and assessment of Spring Boot apps. [Learn more](how-to-create-azure-spring-apps-assessment.md).

## Update (August 2023)

- Azure Migrate now helps you gain deeper insights into the support posture of your IT estate by providing Windows Server and SQL Server license support information. You can stay ahead of license support deadlines with information that helps you understand the time left until the end of support for servers and databases.
- Azure Migrate provides clear guidance regarding actionable steps that you can take to secure servers and databases in extended support or out of support.
- Envision Extended Security Update (ESU) savings for out-of-support Windows Server and SQL Server licenses by using an Azure Migrate business case.

## Update (July 2023)

- Discover Azure Migrate from the System Center Operations Manager console: In Operations Manager 2019 UR3 and later, you can discover Azure Migrate from the console. You can now generate a complete inventory of your on-premises environment without an appliance. You can use this capability in Azure Migrate to assess machines at scale. [Learn more](https://support.microsoft.com/topic/discover-azure-migrate-for-operations-manager-04b33766-f824-4e99-9065-3109411ede63).
- Public preview: Upgrade your Windows OS during migration by using the Migration and modernization tool in your VMware environment. [Learn more](how-to-upgrade-windows.md).

## Update (June 2023)

- Envision security cost savings with [Microsoft Defender for Cloud](https://www.microsoft.com/security/business/cloud-security/microsoft-defender-cloud) by using an Azure Migrate business case.
- Resolve problems that affect the collection of performance data and the accuracy of Azure VM and Azure VMware Solution assessment recommendations, and improve the confidence ratings of assessments. [Learn more](common-questions-discovery-assessment.md).

## Update (May 2023)

- SQL Server discovery and assessment in Azure Migrate is now generally available. [Learn more](concepts-azure-sql-assessment-calculation.md).

## Update (April 2023)

- Build a quick business case for servers imported via a .csv file. [Learn more](tutorial-discover-import.md).
- Build a business case by using Azure Migrate for:
  - Servers and workloads running in your Microsoft Hyper-V and physical/bare-metal environments, in addition to infrastructure as a service (IaaS) services of other public clouds.
  - SQL Server Always On failover cluster instances and Always On availability groups. [Learn more](how-to-discover-applications.md).
- Envision savings with Azure Hybrid Benefit by bringing your existing Windows Server licenses to Azure via Azure VM assessments.

## Update (March 2023)

- Support for discovery and assessment of web apps for Azure App Service for Hyper-V and physical servers. [Learn more](how-to-create-azure-app-service-assessment.md).

## Update (February 2023)

- Azure Migrate now supports discovery and assessment of SQL Server Always On failover cluster instances and Always On availability groups. [Learn more](how-to-discover-applications.md).
- Public preview: Modernize your ASP.NET web apps on Azure Kubernetes Service directly through Azure Migrate. [Learn more](tutorial-modernize-asp-net-aks.md).

## Update (January 2023)

- Envision savings with the [Azure savings plan for compute](https://azure.microsoft.com/pricing/offers/savings-plan-compute) option. An Azure savings plan for compute is now available for an Azure Migrate business case, Azure VM assessment, Azure SQL assessment, and Azure App Service assessment.
- Support is available for the export of a business case report into an .xlsx workbook from the portal. [Learn more](common-questions-business-case.md#how-can-i-export-the-business-case).
- Azure Migrate is now supported in Sweden geography. [Learn more](supported-geographies.md#public-cloud).

## Update (December 2022)

- General availability: Perform [software inventory](how-to-discover-applications.md) and [agentless dependency analysis](how-to-create-group-machine-dependencies-agentless.md) at scale for Hyper-V virtual machines, bare-metal servers, or servers running on other clouds (like AWS or GCP).

- Public preview: Build a business case by using Azure Migrate for servers and workloads running in your VMware environment. A business case helps you eliminate guesswork in your cost-planning process. It also adds data-driven insights to help you understand how Azure can bring the most value to your business.

  Key highlights include:

  - Total cost of ownership for on-premises versus Azure.
  - Year-on-year cashflow analysis.
  - Resource utilization-based insights to identify servers and workloads that are ideal for the cloud.
  - Quick wins for migration and modernization, including end-of-support Windows OS and SQL versions.
  - Long-term cost savings by moving from a capital expenditure model to an operating expenditure model, so you pay for only what you use.

- General availability: Discover, assess, and migrate servers over a private network by using [Azure Private Link](../private-link/private-endpoint-overview.md). [Learn more](how-to-use-azure-migrate-with-private-endpoints.md).

## Update (November 2022)

- Support for providing a Sudo user account to perform agentless dependency analysis on Linux servers running in VMware, Hyper-V, and physical/other cloud environments.
- Support for selecting a virtual network and subnet during test migration by using PowerShell for an agentless VMware scenario.
- Support for OS disk swap by using the Azure portal and PowerShell for an agentless VMware scenario.
- Support for pausing and resuming replications by using PowerShell for an agentless VMware scenario.

## Update (October 2022)

- Support for export of errors and notifications from the portal for software inventory and agentless dependency. [Learn more](troubleshoot-dependencies.md).

## Update (September 2022)

- Support for pausing and resuming ongoing replications without having to do a complete replication again. You can also retry VM migrations without the need to do a full initial replication again.
- Enhanced notifications for test migration and migration completion status.
- Java web app discovery on Apache Tomcat running on Linux servers hosted in a VMware environment.
- Enhanced collection of discovery data, including detection of database connecting strings, application directories, and authentication mechanisms for ASP.NET web apps.
- General availability: Discover, assess, and migrate servers over a private network by using [Azure Private Link](../private-link/private-endpoint-overview.md). [Learn more](how-to-use-azure-migrate-with-private-endpoints.md).

## Update (August 2022)

- SQL discovery and assessment for Microsoft Hyper-V and physical/bare-metal environments, in addition to IaaS services of other public clouds.

## Update (June 2022)

- Perform at-scale agentless migration of ASP.NET web apps running on IIS web servers hosted on a Windows OS in a VMware environment. [Learn more](tutorial-modernize-asp-net-appservice-code.md).

## Update (May 2022)

- Upgrade of the Azure SQL assessment experience to identify the ideal migration target for your SQL deployments across Azure SQL Managed Instance, SQL Server on Azure Virtual Machines, and Azure SQL Database:
  - We recommended migrating instances to SQL Server on Azure Virtual Machines, according to Azure best practices.
  - We recommend a *right-sized lift and shift* (server to SQL Server on Azure Virtual Machines) when SQL Server credentials aren't available.
  - An enhanced user experience covers readiness and cost estimates for multiple migration targets for SQL deployments in one assessment.
- Support for Storage vMotion during replication for agentless VMware VM migrations.

## Update (March 2022)

- Perform agentless VMware VM discovery, assessments, and migrations over a private network by using Azure Private Link. [Learn more](how-to-use-azure-migrate-with-private-endpoints.md).
- General availability: Select subnets for each network adapter of a replicating virtual machine in a VMware agentless migration scenario.

## Update (February 2022)

- General availability: Migrate Windows and Linux Hyper-V virtual machines with large data disks (up to 32 TB in size).
- Azure Migrate is now supported in Microsoft Azure operated by 21Vianet. [Learn more](/azure/china/overview-operations#azure-operations-in-china).
- Public preview: Perform software inventory and agentless dependency analysis at scale for Hyper-V virtual machines, bare-metal servers, or servers running on other clouds (like AWS or GCP).

## Update (December 2021)

- Support to discover, assess, and migrate VMs from multiple vCenter Servers by using a single Azure Migrate appliance. [Learn more](tutorial-discover-vmware.md#start-continuous-discovery).
- Simplified [Azure VMware Solution assessment](./concepts-azure-vmware-solution-assessment-calculation.md) experience to understand sizing assumptions, resource utilization, and limiting factors for migrating on-premises VMware VMs to Azure VMware Solution. Other enhancements include:
  - Support for two new target assessment regions: Central US and Canada East.
  - Support for reserved instances in assessment properties for more accurate cost estimates.
  - A new readiness condition to highlight operating systems that VMware deprecated.
  - Support for storage utilization parameters in storage sizing logic (only for discovery via a .csv file).

## Update (October 2021)

- Azure Migrate supports new public cloud geographies and regions. [Learn more](supported-geographies.md#public-cloud).

## Update (September 2021)

- Discovery, assessment, and migration of servers over a private network by using [Azure Private Link](../private-link/private-endpoint-overview.md) is now in preview in supported [government cloud geographies](supported-geographies.md#azure-government). [Learn more](how-to-use-azure-migrate-with-private-endpoints.md).
- Azure Migrate supports tagging and adding custom names to resources for agentless VMware VM migrations by using PowerShell.
- Azure Migrate appliance: You have the option to remove servers from the list of discovered physical servers.

## Update (August 2021)

- At-scale discovery and assessment of ASP.NET web apps running on IIS servers in your VMware environment, now in preview. [Learn more](concepts-azure-webapps-assessment-calculation.md). To get started, refer to the [discovery](tutorial-discover-vmware.md) and [assessment](tutorial-assess-webapps.md) tutorials.
- Support for Azure [ultra disks](/azure/virtual-machines/disks-types#ultra-disks) in Azure VM assessment recommendations.
- General availability of at-scale software inventory and agentless dependency analysis for VMware virtual machines.
- Azure Migrate appliance updates:
  - Ability of users to diagnose and solve appliance problems.
  - Unified installer script: a common script where users need to select from the scenario, cloud, and connectivity options to deploy an appliance with the desired configuration.
  - Support to add a user account with Sudo access on the appliance configuration manager to perform discovery of Linux servers (as an alternative to providing a root account or enabling `setcap` permissions).
  - Support to edit the SQL Server connection properties on the appliance configuration manager.

## Update (July 2021)

- An app containerization tool in Azure Migrate now lets you package applications running on servers into a container image and deploy the containerized application to Azure App Service containers, in addition to Azure Kubernetes Service. You can also automatically integrate application monitoring for Java apps with Azure Application Insights and use Azure Key Vault to manage application secrets, such as certificates and parameterized configurations.

  For more information, see [ASP.NET app containerization and migration to Azure App Service](tutorial-app-containerization-aspnet-app-service.md) and [Java web app containerization and migration to Azure App Service](tutorial-app-containerization-java-app-service.md).

## Update (June 2021)

- Azure Migrate supports new public cloud geographies and regions. [Learn more](supported-geographies.md#public-cloud).
- Azure Migrate allows you to register servers running SQL Server with a SQL Server on Azure Virtual Machines resource provider during replication, to automatically install the SQL Server IaaS Agent extension. This feature is available for agentless VMware, agentless Hyper-V, and agent-based migrations.
- Import of a CSV file for assessment now supports up to 20 disks. Earlier, it was limited to eight disks per server.

## Update (May 2021)

- Azure Migrate now supports the migration of VMs and physical servers with OS disks up to 4 TB via the agent-based migration method.

## Update (March 2021)

- Azure Migrate supports providing multiple server credentials on Azure Migrate appliances to discover installed applications (software inventory), conduct agentless dependency analysis, and discover SQL Server instances and databases in your VMware environment. [Learn more](tutorial-discover-vmware.md#provide-server-credentials).
- Discovery and assessment of SQL Server instances and databases running in your VMware environment is now in preview. [Learn more](concepts-azure-sql-assessment-calculation.md). To get started, refer to the [discovery](tutorial-discover-vmware.md) and [assessment](tutorial-assess-sql.md) tutorials.
- Agentless VMware migration now supports concurrent replication of 500 VMs per vCenter.
- The app containerization tool in Azure Migrate now lets you package applications running on servers into a container image and deploy the containerized application to Azure Kubernetes Service. For more information, see [ASP.NET app containerization and migration to Azure Kubernetes Service](tutorial-app-containerization-aspnet-kubernetes.md) and [Java web app containerization and migration to Azure Kubernetes Service](tutorial-app-containerization-java-kubernetes.md).

## Update (January 2021)

- You can now use the Migration and modernization tool to migrate VMware virtual machines, physical servers, and virtual machines from other clouds to Azure virtual machines. In this capability, disks are encrypted with server-side encryption via customer-managed keys.

## Update (December 2020)

- Azure Migrate now automatically installs the Azure VM agent on the VMware VMs while migrating them to Azure by using the agentless method of VMware migration. The capability applies to Windows Server 2008 R2 and later.
- Migration of VMware VMs to Azure virtual machines with disks encrypted through server-side encryption with customer-managed keys, by using the Migration and modernization (agentless replication) tool, is now available through the Azure portal.

## Update (September 2020)

- Azure Migrate now supports the migration of servers to availability zones.
- Azure Migrate now supports the migration of UEFI-based VMs and physical servers to Azure Generation 2 VMs. With this release, the Migration and modernization tool won't perform the conversion from Generation 2 VMs to Generation 1 VMs during migration.
- A new Azure Migrate Power BI assessment dashboard is available to help you compare costs across assessment settings. The dashboard comes with a PowerShell utility that automatically creates the assessments that plug into the Power BI dashboard. [Learn more](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/assessment-utility).
- You can now run dependency analysis (agentless) concurrently on 1,000 VMs.
- You can now enable or disable dependency analysis (agentless) at scale by using PowerShell scripts. [Learn more](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/dependencies-at-scale).
- Visualize network connections in Power BI by using the data collected in dependency analysis (agentless). [Learn more](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/dependencies-at-scale).
- Azure Migrate now supports the migration of VMware VMs with a data disk size of up to 32 TB via the agentless VMware migration method in the Migration and modernization tool.

## Update (August 2020)

- Improved onboarding experience where an Azure Migrate project key is generated from the portal and is used to complete the appliance registration.
- Option to download either OVA/VHD files or the installer scripts from the portal to set up the VMware and Hyper-V appliances, respectively.
- Refreshed appliance configuration manager with an enhanced user experience.
- Support for multiple credentials for Hyper-V VM discovery.

## Update (July 2020)

- Agentless VMware migration now supports concurrent replication of 300 VMs per vCenter.

## Update (June 2020)

- Azure Migrate now supports assessments for migrating on-premises VMware VMs to [Azure VMware Solution](./concepts-azure-vmware-solution-assessment-calculation.md). [Learn more](how-to-create-azure-vmware-solution-assessment.md).
- Azure Migrate includes support for multiple credentials on an appliance for physical server discovery.
- Azure Migrate includes support to allow Azure sign-in from an appliance for a tenant where tenant restriction is configured.

## Update (April 2020)

Azure Migrate supports deployments in Microsoft Azure Government:

- You can discover and assess VMware VMs, Hyper-V VMs, and physical servers.
- You can migrate VMware VMs, Hyper-V VMs, and physical servers to Azure.
- For VMware migration, you can use agentless or agent-based migration. [Learn more](server-migrate-overview.md).
- You can [review supported geographies and regions](supported-geographies.md#azure-government) for Azure Government.
- [Agent-based dependency analysis](concepts-dependency-visualization.md#agent-based-analysis) isn't supported in Azure Government.
- Features in preview are supported in Azure Government, [agentless dependency analysis](concepts-dependency-visualization.md#agentless-analysis), and [application discovery](how-to-discover-applications.md).

## Update (March 2020)

A script-based installation is now available to set up the [Azure Migrate appliance](migrate-appliance.md):

- The script-based installation is an alternative to the OVA (VMware) or VHD (Hyper-V) installation of the appliance.
- You can use a PowerShell installer script to set up the appliance for VMware or Hyper-V on an existing machine running Windows Server 2016.

## Update (November 2019)

Many new features were added to Azure Migrate:

- **Physical server assessment**: Azure Migrate now supports assessment of on-premises physical servers, in addition to the physical server migration that's already supported.
- **Import-based assessment**: Azure Migrate now supports assessment of machines by using metadata and performance data provided in a CSV file.
- **Application discovery**: Azure Migrate now supports application-level discovery of apps, roles, and features by using the Azure Migrate appliance. This capability is currently supported for VMware VMs only, and it's limited to discovery only. (Assessment isn't currently supported.) [Learn more](how-to-discover-applications.md).
- **Agentless dependency visualization**: You no longer need to explicitly install agents for dependency visualization. Both agentless and agent-based visualization are now supported.
- **Virtual desktop**: Use software development company (SDC) tools to assess and migrate on-premises virtual desktop infrastructure (VDI) to Windows Virtual Desktop in Azure.
- **Web app**: The Azure App Service Migration Assistant, used for assessing and migration web apps, is now integrated into Azure Migrate.

New assessment and migration tools were added to Azure Migrate:

- **RackWare**: Offers cloud migration.
- **Movere**: Offers assessment.

For more information about using tools and SDC offerings for assessment and migration in Azure Migrate, see [What is Azure Migrate?](migrate-services-overview.md).

## Azure Migrate current version

The current version of Azure Migrate (released in July 2019) provides many new features:

- **Unified migration platform**: Azure Migrate now provides a single portal to centralize, manage, and track your migration journey to Azure, with an improved deployment flow and portal experience.
- **Assessment and migration tools**: Azure Migrate provides native tools. It also integrates with other Azure services and with tools from SDCs.
- **Azure Migrate assessment**: By using the Azure Migrate Server Assessment tool, you can assess VMware VMs and Hyper-V VMs for migration to Azure. You can also assess VMs for migration by using other Azure services and SDC tools.
- **Azure Migrate migration**: By using the Migration and modernization tool, you can migrate on-premises VMware VMs and Hyper-V VMs, physical servers, other virtualized servers, and private/public cloud VMs to Azure. In addition, you can migrate to Azure by using SDC tools.
- **Azure Migrate appliance**: Azure Migrate deploys a lightweight appliance for discovery and assessment of on-premises VMware VMs and Hyper-V VMs.
  - The Azure Migrate Server Assessment tool and the Migration and modernization tool use this appliance for agentless migration.
  - The appliance continuously discovers server metadata and performance data, for the purposes of assessment and migration.  
- **VMware VM migration**: The Migration and modernization tool provides two methods for migrating on-premises VMware VMs to Azure: an agentless migration that uses the Azure Migrate appliance, and an agent-based migration that uses a replication appliance. The tool deploys an agent on each VM that you want to migrate. [Learn more](server-migrate-overview.md).
- **Database assessment and migration**: From Azure Migrate, you can assess on-premises databases for migration to Azure by using the Azure Database Migration Assistant. You can migrate databases by using Azure Database Migration Service.
- **Web app migration**: You can assess web apps by using a public endpoint URL with Azure App Service. For migration of internal .NET apps, you can download and run the App Service Migration Assistant.
- **Azure Data Box**: Import large amounts of offline data into Azure by using Azure Data Box in Azure Migrate.

## Azure Migrate previous version

If you're using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. In the previous version, you can no longer create new Azure Migrate projects or perform new discoveries. You can still access existing projects in the Azure portal:

1. Go to **All services** and search for **Azure Migrate**.
1. In the Azure Migrate notifications, there's a link to access old Azure Migrate projects.

## Related content

- Learn about [Azure Migrate pricing](https://azure.microsoft.com/pricing/details/azure-migrate/).
- Review [frequently asked questions about Azure Migrate](resources-faq.md).
- Try tutorials to assess [VMware VMs](./tutorial-assess-vmware-azure-vm.md) and [Hyper-V VMs](tutorial-assess-hyper-v.md).
