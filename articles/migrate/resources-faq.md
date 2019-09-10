---
title: Azure Migrate - frequently asked questions (FAQ) | Microsoft Docs
description: Addresses frequently asked questions about Azure Migrate
author: snehaamicrosoft
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 08/07/2019
ms.author: snehaa
---

# Azure Migrate: Frequently asked questions (FAQ)

This article answers frequently asked questions about Azure Migrate. If you have further queries after reading this article, post them on the [Azure Migrate forum](https://aka.ms/AzureMigrateForum).

## General

### Which Azure geographies does Azure Migrate support?

See the [list for VMware](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#azure-migrate-projects) and the [list for Hyper-V](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#azure-migrate-projects).

### What's the difference between Azure Migrate and Azure Site Recovery?

Azure Migrate provides a centralized hub to start your migration, execute and track discovery and assessment of machines and workloads, and execute and track the migration of machines and workloads to Azure. [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/migrate-tutorial-on-premises-azure) is a disaster recovery solution. Azure Migrate Server Migration uses Azure Site Recovery on the backend to enable migration scenarios for lift-and-shift migration of on-premises machines.

### How do I delete an Azure Migrate project

To delete an Azure Migrate project and its associated resources including sites, recovery services vaults, migrate vaults, key vaults, assessment projects etc, go to "Resource groups" page on the Azure portal, select the resource group where the migrate project was created and select "Show hidden types". Then select the migrate project and its associated resources listed below and delete them. Alternatively, if the resource group is exclusively used by the migrate project and its associated resources, you can delete the entire resource group. Note that this list is an exhaustive list of all resource types created for all scenarios (discovery, assessment and migration). You will only find the resources that were created for your scenario in the resource group.

#### Resources created for servers on VMware or physical servers [Resource (Type)]:

- <Appliancename>kv (Key vault)
- <Appliancename>site (Microsoft.OffAzure/VMwareSites)
- <ProjectName> (Microsoft.Migrate/migrateprojects)
- <ProjectName>project (Microsoft.Migrate/assessmentProjects)
- <ProjectName>rsvault (Recovery Services vault)
- <ProjectName>-MigrateVault-* (Recovery Services vault)
- migrateappligwsa* (Storage account)
- migrateapplilsa* (Storage account)
- migrateapplicsa* (Storage account)
- migrateapplikv* (Key vault)
- migrateapplisbns16041 (Service Bus Namespace)

Note: Delete storage accounts and key vaults with caution as they may contain application data and security keys respectively.

#### Resources created for servers on Hyper-V [Resource (Type)]:

- <ProjectName> (Microsoft.Migrate/migrateprojects)
- <ProjectName>project (Microsoft.Migrate/assessmentProjects)
- HyperV*kv (Key vault)
- HyperV*site (Microsoft.OffAzure/HyperVSites)
- <ProjectName>-MigrateVault-* (Recovery Services vault) 

Note: Delete the key vault with caution as it may contain security keys.

## Azure Migrate appliance

### How does the Azure Migrate appliance connect to Azure?

The connection can be over the internet, or you can use Azure ExpressRoute with public/Microsoft peering.

### What are the network connectivity requirements for Azure Migrate server assessment and migration?

See the [VMware](migrate-support-matrix-vmware.md) and [Hyper-V](migrate-support-matrix-hyper-v.md) support matrices for information about the URLs and ports needed to enable Azure Migrate to communicate with Azure.

### Can I harden the appliance VM that I set up with the template?

You can add components (for example, antivirus) to the template, as long as you leave the communication and firewall rules required for the Azure Migrate appliance as is.

### What data is collected by the Azure Migrate appliance?

You can view details about the data collected by the Azure Migrate appliance [in the Azure Migrate documentation](https://docs.microsoft.com/azure/migrate/migrate-appliance#collected-performance-data-vmware).

### Is there any performance impact on the analyzed VMware or Hyper-V environment?

The Azure Migrate appliance profiles on-premises machines continuously to measure VM performance data. This profiling has almost no performance impact on the Hyper-V/ESXi hosts or on vCenter Server.

### Where is the collected data stored, and for how long?

The data collected by the Azure Migrate appliance is stored in the Azure location that you choose when you create the migration project. The data is securely stored in a Microsoft subscription and is deleted when you delete the Azure Migrate project.

For dependency visualization, if you install agents on the VMs, the data collected by the dependency agents is stored in the US, in a Log Analytics workspace created in the Azure subscription. This data is deleted when you delete the Log Analytics workspace in your subscription. For more information, see [Dependency visualization](concepts-dependency-visualization.md).

### What volume of data is uploaded by the Azure Migrate appliance during continuous profiling?

The volume of data sent to Azure Migrate varies depending on several parameters. To give you a sense of the volume: an Azure Migrate project with 10 machines (each with one disk and one NIC) sends around 50 MB per day. This value is an approximation. It changes based on the number of data points for the NICs and disks. (The increase in data sent is nonlinear if the number of machines, NICs, or disks increases.)

### Is the data encrypted at rest and in transit?

Yes, both. The metadata is securely sent to the Azure Migrate service over the internet, via HTTPS. The metadata is stored in an [Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/database-encryption-at-rest) database and in [Azure Blob storage](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) in a Microsoft subscription. The metadata is encrypted at rest.

The data collected by the dependency agents is also encrypted in transit (secure HTTPS). It's stored in a Log Analytics workspace in your subscription. It's also encrypted at rest.

### How does the Azure Migrate appliance communicate with vCenter Server and the Azure Migrate service?

The appliance connects to vCenter Server (port 443) by using the credentials you provided when you set up the appliance. It uses VMware PowerCLI to query vCenter Server to collect metadata about the VMs managed by vCenter Server. It collects configuration data about VMs (cores, memory, disks, NICs, and so on) and also the performance history of each VM for the past month. The collected metadata is then sent to Azure Migrate Server Assessment (over the internet via HTTPS) for assessment.

### Can I connect the same appliance to multiple vCenter Server instances?

No. There's a one-to-one mapping between an appliance and vCenter Server. If you have to discover VMs on multiple vCenter Server instances, you need to deploy multiple appliances.


### I changed my machine size. Can I run the assessment again?

The Azure Migrate appliance continuously collects information about the on-premises environment. But an assessment is a point-in-time snapshot of on-premises VMs. If you change the settings on a VM that you want to assess, use the Recalculate option to update the assessment with the latest changes.

### How can I perform discovery in a multitenant environment in Azure Migrate Server Assessment?

For VMware, if you have an environment that's shared across tenants, and you don't want to discover the VMs of one tenant in another tenant's subscription, create vCenter Server credentials that can access only to the VMs you want to discover. Then use those credentials when you start discovery in the Azure Migrate appliance.

For Hyper-V, discovery uses Hyper-V host credentials. If VMs share the same Hyper-V host, there's currently no way to separate the discovery.  

### How many VMs can I discover with a single migration appliance?

You can discover up to 10,000 VMware VMs and up to 5,000 Hyper-V VMs with a single migration appliance. If you have more machines in your on-premises environment, learn how to scale [Hyper-V](scale-hyper-v-assessment.md) and [VMware](scale-vmware-assessment.md) assessment.

### Can I delete the Azure Migrate appliance from the project?
Currently deletion of appliance from the project is not supported. The only way to delete the appliance is to delete the resource group which has the Azure Migrate project, associated with the appliance but that will also delete other registered appliances, the discovered inventory, assessments and all other Azure artifacts associated with the project in the resource group.

## Azure Migrate Server Assessment

### Does Azure Migrate Server Assessment support assessment of physical servers?

No, Azure Migrate doesn't currently support assessment of physical servers.

### Does Azure Migrate need vCenter Server to perform discovery in a VMware environment?

Yes, Azure Migrate needs vCenter Server to perform discovery in a VMware environment. It doesn't support discovery of ESXi hosts that aren't managed by vCenter Server.

### What's the difference between Azure Migrate Server Assessment and the MAP Toolkit?

Azure Migrate Server Assessment provides migration assessment to help with migration readiness, and evaluation of workloads for migration to Azure. [Microsoft Assessment and Planning (MAP) Toolkit](https://www.microsoft.com/download/details.aspx?id=7826) helps with other tasks, like migration planning for newer versions of Windows client and server operating systems and software usage tracking. For those scenarios, continue to use the MAP Toolkit.

### What's the difference between Azure Migrate Server Assessment and the Azure Site Recovery Deployment Planner?

Azure Migrate Server Assessment is a migration planning tool. The Azure Site Recovery Deployment Planner is a disaster recovery planning tool.

**Migration from VMware/Hyper-V to Azure**: If you plan to migrate your on-premises servers to Azure, use Azure Migrate Server Assessment for migration planning. It assesses on-premises workloads and provides guidance, insights, and tools to help you migrate your servers to Azure. After you're ready with your migration plan, you can use tools like Azure Migrate Server Migration to migrate the machines to Azure.

**Disaster recovery from VMware/Hyper-V to Azure**: For disaster recovery to Azure via Site Recovery, use the Site Recovery Deployment Planner for planning. Site Recovery Deployment Planner does a deep, Site Recovery-specific assessment of your on-premises environment. It provides recommendations needed by Site Recovery for successful disaster operations like replication and failover of VMs.

### Does Azure Migrate support cost estimation for the Enterprise Agreement (EA) program?

Azure Migrate currently doesn't support cost estimation for the [Enterprise Agreement program](https://azure.microsoft.com/offers/enterprise-agreement-support/). The workaround is to specify **Pay-As-You-Go** as the **Offer** and manually specify the discount percentage (applicable to the subscription) in the **Discount** box of the assessment properties:

  ![Assessment properties](./media/resources-faq/discount.png)

### What's the difference between as-on-premises sizing and performance-based sizing?

With as-on-premises sizing, Azure Migrate doesn't consider VM performance data. It sizes the VMs based on the on-premises configuration. With performance-based sizing, sizing is based on utilization data.

For example, consider an on-premises VM that has 4 cores and 8 GB of memory at 50% CPU utilization and 50% memory utilization. For this VM, as-on-premises sizing recommends an Azure VM SKU that has four cores and 8 GB of memory. Performance-based sizing recommends a VM SKU that has two cores and 4 GB of memory, because the utilization percentage is considered.

Similarly, disk sizing depends on two assessment properties: sizing criteria and storage type. If the sizing criteria is performance-based and the storage type is automatic, Azure Migrate takes into account the IOPS and throughput values of the disk when it identifies the target disk type (standard or premium).

If the sizing criteria is performance-based and the storage type is premium, Azure Migrate recommends a premium disk. The premium disk SKU is selected based on the size of the on-premises disk. The same logic is used to do disk sizing when the sizing criteria is as-on-premises sizing and the storage type is standard or premium.

### What impact does performance history and utilization percentile have on size recommendations?

These properties are only applicable for performance-based sizing.

Azure Migrate collects the performance history of on-premises machines and uses it to recommend the VM size and disk type in Azure.

The appliance continuously profiles the on-premises environment to gather real-time utilization data every 20 seconds. The appliance rolls up the 20-second samples and creates a single data point for every 15 minutes. To create the data point, the appliance selects the peak value from all the 20-second samples. The appliance sends this data point to Azure.

When you create an assessment in Azure (based on the performance duration and performance history percentile value), Azure Migrate calculates the effective utilization value and uses it for sizing.

For example, assume you set the performance duration to one day and the percentile value to 95 percentile. Azure Migrate sorts the 15-minute sample points sent by collector for the past day in ascending order and picks the 95th percentile value as the effective utilization.

The 95th percentile value ensures you're ignoring any outliers. Outliers could be included if you use the 99th percentile. If you want to pick the peak usage for the period and don't want to miss any outliers, select the 99th percentile.

### What is dependency visualization?

Dependency visualization enables you to assess groups of VMs for migration with greater confidence. It cross-checks machine dependencies before you run an assessment. Dependency visualization helps ensure that nothing is left behind to avoid unexpected outages when you migrate to Azure. Azure Migrate uses the Service Map solution in Azure Monitor logs to enable dependency visualization.

> [!NOTE]
> The dependency visualization isn't available in Azure Government.

### Do I need to pay to use dependency visualization?

No. For more information, see [Azure Migrate pricing](https://azure.microsoft.com/pricing/details/azure-migrate/).

### Do I need to install anything for dependency visualization?

To use dependency visualization, you need to download and install agents on each on-premises machine that you want to evaluate.

You need to install the following agents on each machine:
- [Microsoft Monitoring Agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows).
- [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent).
- If you have machines with no internet connectivity, you need to download and install Log Analytics gateway on them.

You don't need these agents unless you're using dependency visualization.

### Can I use an existing workspace for dependency visualization?

Yes, you can attach an existing workspace to the migration project and use it for dependency visualization. For more information, see "How does it work" in the [Dependency visualization](concepts-dependency-visualization.md#how-does-it-work) article.

### Can I export the dependency visualization report?

No, the dependency visualization can't be exported. But because Azure Migrate uses Service Map for dependency visualization, you can use the [Service Map REST API](https://docs.microsoft.com/rest/api/servicemap/machines/listconnections) to get the dependencies in JSON format.

### How can I automate the installation of Microsoft Monitoring Agent (MMA) and the Dependency agent?

Use this [script to install the Dependency agent](../azure-monitor/insights/vminsights-enable-hybrid-cloud.md#installation-script-examples). Follow these [instructions to install MMA](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#install-and-configure-agent) by using the command line or automation. For
MMA, use [this script](https://gallery.technet.microsoft.com/scriptcenter/Install-OMS-Agent-with-2c9c99ab).

In addition to scripts, you can also use deployment tools like System Center Configuration Manager and [Intigua](https://www.intigua.com/getting-started-intigua-for-azure-migration) to deploy the agents.

### What operating systems are supported by MMA?

- View the list of [Windows operating systems supported by MMA](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems).
- View the list of [Linux operating systems supported by MMA](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems).

### What operating systems are supported by the Dependency agent?

View the list of [Windows and Linux operating systems that Azure Monitor for VMs supports](../azure-monitor/insights/vminsights-enable-overview.md#supported-operating-systems).

### Can I visualize dependencies in Azure Migrate for more than an hour?
No. You can visualize dependencies for up to an hour. You can go back to a particular date in history, as far back as a month, but the maximum duration for visualization is an hour. For example, you can use the time duration in the dependency map to view dependencies for yesterday, but you can view it only for a one-hour window. However, you can use Azure Monitor logs to [query dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

### Can I use dependency visualization for groups that contain more than 10 VMs?
You can [visualize dependencies for groups](https://docs.microsoft.com/azure/migrate/how-to-create-group-dependencies) that contain up to 10 VMs. If you have a group with more than 10 VMs, we recommend that you split the group into smaller groups and then visualize the dependencies.

## Azure Migrate Server Migration

### What's the difference between Azure Migrate Server Migration and Azure Site Recovery?

Azure Migrate Server Migration uses the Site Recovery replication engine for agent-based migration of VMware VMs, migration of Hyper-V VMs, and migration of physical servers to Azure. The agentless option to migrate VMware VMs is natively built into Server Migration.

## Next steps
Read the [Azure Migrate overview](migrate-services-overview.md).
