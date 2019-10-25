---
title: Common questions about Azure Migrate
description: Addresses common and frequently asked questions about Azure Migrate
author: snehaamicrosoft
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 10/22/2019
ms.author: snehaa
---

# Azure Migrate: Common questions

This article answers common questions about Azure Migrate. If you have further queries after reading this article, post them on the [Azure Migrate forum](https://aka.ms/AzureMigrateForum).

## General

### Which Azure geographies are supported?

Review the Azure Migrate supported geographies for [VMware VM](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#azure-migrate-projects) and for [Hyper-V VMs](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#azure-migrate-projects).

### What's the difference between Azure Migrate and Site Recovery?

Azure Migrate provides a centralized hub to manage and track discovery, assessment, and migration of on-premises machines and workloads to Azure. [Azure Site Recovery](../site-recovery/site-recovery-overview.md) is a disaster recovery solution. Azure Migrate: Server Migration tool uses some backend Site Recovery functionality for lift-and-shift migration of some on-premises machines.

### How do I delete an Azure Migrate project?

Follow [these instructions](how-to-delete-project.md) to delete a project. [Review the resources](how-to-delete-project.md#created-resources) that are created as you discover, assess, and migrate machines and workloads in an Azure Migrate project.


## Azure Migrate appliance

### How does the appliance connect to Azure?

The connection can be over the internet, or use Azure ExpressRoute with public/Microsoft peering.

### What network connectivity is needed for Azure Migrate server assessment and migration?

Review the [VMware](migrate-support-matrix-vmware.md) and [Hyper-V](migrate-support-matrix-hyper-v.md) support matrices for information about the URLs and ports needed for Azure Migrate to communicate with Azure.

### Can I harden the appliance VM created with the template?

You can add components (for example, antivirus) to the template, as long as you leave the communication and firewall rules required for the Azure Migrate appliance as is.

### What data is collected by the Azure Migrate appliance?

Review data collected by the appliance as follows:
- [Performance data](migrate-appliance.md#collected-performance-data-vmware) and [metadata](migrate-appliance.md#collected-metadata-vmware) for VMware VMs.
- [Performance data](migrate-appliance.md#collected-performance-data-hyper-v) and [metadata](migrate-appliance.md#collected-metadata-hyper-v) for Hyper-V VMs.


### Does appliance analysis impact performance?

The Azure Migrate appliance profiles on-premises machines continuously to measure VM performance data. This profiling has almost no performance impact on the Hyper-V/ESXi hosts or on vCenter Server.

### Where and how long is collected data stored?

The data collected by the Azure Migrate appliance is stored in the Azure location that you choose when you create the migration project. The data is securely stored in a Microsoft subscription, and is deleted when you delete the Azure Migrate project.

For dependency visualization, the data collected is stored in the United States, in a Log Analytics workspace created in the Azure subscription. This data is deleted when you delete the Log Analytics workspace in your subscription. [Learn more](concepts-dependency-visualization.md) about dependency visualization.

### What volume of data is uploaded during continuous profiling?

The volume of data sent to Azure Migrate varies depending on several parameters. To give you a sense of the volume, an Azure Migrate project with 10 machines (each with one disk and one NIC) sends around 50 MB per day. This value is approximate, and changes based on the number of data points for the NICs and disks. The increase in data sent is non-linear if the number of machines, NICs, or disks increases.

### Is the data encrypted at-rest and in transit?

Yes, both.
- Metadata is securely sent to the Azure Migrate service over the internet, via HTTPS.
- The metadata is stored in an [Azure Cosmos database ](../cosmos-db/database-encryption-at-rest.md) database and in [Azure Blob storage](../storage/common/storage-service-encryption.md) in a Microsoft subscription. The metadata is encrypted at-rest.
- The data for dependency analysis is also encrypted in-transit (secure HTTPS). It's stored in a Log Analytics workspace in your subscription. It's also encrypted at-rest.

### How does the appliance communicate with vCenter Server and Azure Migrate?

1. The appliance connects to vCenter Server (port 443), using the credentials you provided when you set up the appliance.
2. The appliance uses VMware PowerCLI to query vCenter Server, to collect metadata about the VMs managed by vCenter Server. It collects configuration data about VMs (cores, memory, disks, NICs) and the performance history of each VM for the past month.
3. The collected metadata is then sent to Azure Migrate: Server Assessment (over the internet via HTTPS) for assessment.

### Can I connect the same appliance to multiple vCenter Server instances?

No. There's a one-to-one mapping between an appliance and vCenter Server. To discover VMs on multiple vCenter Server instances, you need to deploy multiple appliances.


### Machine size changed. Can I run the assessment again?

The Azure Migrate appliance continuously collects information about the on-premises environment. But an assessment is a point-in-time snapshot of on-premises VMs. If you change the settings on a VM that you want to assess, use the recalculate option to update the assessment with the latest changes.

### How can I perform discovery in a multitenant environment?

- For VMware, if your environment is shared across tenants, and you don't want to discover the VMs of one tenant in another tenant's subscription, create vCenter Server credentials that can access only the VMs you want to discover. Then, use those credentials when you start discovery in the Azure Migrate appliance.
- For Hyper-V, discovery uses Hyper-V host credentials. If VMs share the same Hyper-V host, there's currently no way to separate the discovery.  

### How many VMs can I discover with a single appliance?

You can discover up to 10,000 VMware VMs and up to 5,000 Hyper-V VMs with a single migration appliance. If you have more machines in your on-premises environment, learn how to scale [Hyper-V](scale-hyper-v-assessment.md) and [VMware](scale-vmware-assessment.md) assessment.

### Can I delete the Azure Migrate appliance from the project?

Currently deletion of appliance from the project isn't supported.

- The only way to delete the appliance is to delete the resource group that contains the Azure Migrate project associated with the appliance.
- However, deleting the resource group will also delete other registered appliances, the discovered inventory, assessments and all other Azure components associated with the project in the resource group.

## Azure Migrate Server Assessment


### Does Azure Migrate need vCenter Server for VMWare VM discovery?

Yes, Azure Migrate needs vCenter Server to perform discovery in a VMware environment. It doesn't support discovery of ESXi hosts that aren't managed by vCenter Server.

### What's the difference between Azure Migrate Server Assessment and the MAP Toolkit?

Server Assessment provides assessment to help with migration readiness, and evaluation of workloads for migration to Azure. [Microsoft Assessment and Planning (MAP) Toolkit](https://www.microsoft.com/download/details.aspx?id=7826) helps with other tasks, including migration planning for newer versions of Windows client/server operating systems, and software usage tracking. For these scenarios, continue to use the MAP Toolkit.

### What's the difference between Server Assessment and the Site Recovery Deployment Planner?

Server Assessment is a migration planning tool. The Site Recovery Deployment Planner is a disaster recovery planning tool. 

- **Plan on-premises migration to Azure**: If you plan to migrate your on-premises servers to Azure, use Server Assessment for migration planning. It assesses on-premises workloads and provides guidance and tools to help you migrate. After the migration plan is in place, you can use tools, including Azure Migrate Server Migration, to migrate the machines to Azure.
- **Plan disaster recovery to Azure**: If you plan to set up disaster recovery from on-premises to Azure with Site Recovery, use the Site Recovery Deployment Planner. The Deployment Planner provides a deep, Site Recovery-specific assessment of your on-premises environment for the purpose of disaster recovery. It provides recommendations around disaster recovery, such as replication and failover.

### Does Azure Migrate estimate costs for the Enterprise Agreement (EA) program?

Azure Migrate Server Assessment currently doesn't support cost estimations for the [Enterprise Agreement program](https://azure.microsoft.com/offers/enterprise-agreement-support/). As a workaround, when you create an assessment, you can specify **Pay-As-You-Go** as the **Offer**, and manually add the discount percentage (applicable to the subscription) as the **Discount** in the assessment properties:

  ![Assessment properties](./media/resources-faq/discount.png)

### What's the difference between as-on-premises and performance-based sizing?

With as-on-premises sizing, Azure Migrate doesn't consider VM performance data for assessment. It assesses VM sizes based on the on-premises configuration. With performance-based sizing, sizing is based on utilization data.

- For example, if an on-premises VM has 4 cores and 8 GB of memory at 50% CPU utilization and 50% memory utilization, the following will occur:
    - As-on-premises sizing will recommend an Azure VM SKU that has four cores and 8 GB of memory.
    - Performance-based sizing will recommend a VM SKU that has two cores and 4 GB of memory, because the utilization percentage is considered.

- Similarly, disk sizing depends on two assessment properties: sizing criteria and storage type.
    - If the sizing criteria is performance-based and the storage type is automatic, Azure Migrate takes the IOPS and throughput values of the disk into account when it identifies the target disk type (standard or premium).
    - If the sizing criteria is performance-based and the storage type is premium, Azure Migrate recommends a premium disk SKU, based on the size of the on-premises disk. The same logic is applied to disk sizing, when the sizing is as-on-premises, and the storage type is standard or premium.

### Does performance history and utilization percentile impact size recommendations?

These properties are only applicable for performance-based sizing.

- Azure Migrate collects the performance history of on-premises machines, and uses it to recommend the VM size and disk type in Azure.
- The appliance continuously profiles the on-premises environment, to gather real-time utilization data every 20 seconds.
- The appliance rolls up the 20-second samples and creates a single data point every 15 minutes.
- To create the data point, the appliance selects the peak value from all the 20-second samples.
- The appliance sends this data point to Azure.

When you create an assessment in Azure, based on performance duration and performance history percentile value, Azure Migrate calculates the effective utilization value, and uses it for sizing.

- For example, if you set the performance duration to one day and the percentile value to 95 percentile, Azure Migrate sorts the 15-minute sample points sent by collector for the past day in ascending order, and picks the 95th percentile value as the effective utilization.
- Using the 95th percentile value ensures outliers are ignored. Outliers could be included if you use the 99th percentile. If you want to pick the peak usage for the period, without missing any outliers, select the 99th percentile.

## Server assessment - dependency visualization


### What is dependency visualization?

Use dependency visualization to assess groups of VMs for migration with greater confidence. Dependency visualization cross-checks machine dependencies before you run an assessment. It helps ensure that nothing is left behind, and thus helps to avoid unexpected outages when you migrate to Azure. Azure Migrate uses the Service Map solution in Azure Monitor to enable dependency visualization. [learn more](concepts-dependency-visualization.md).

> [!NOTE]
> Dependency visualization isn't available in Azure Government.

### Do I need to pay to use dependency visualization?
No. [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.

### Do I need to install anything for dependency visualization?

To use dependency visualization, you need to download and install agents on each on-premises machine that you want to evaluate.

You need to install the following agents on each machine:
- [Microsoft Monitoring Agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows).
- [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent).
- If you have machines with no internet connectivity, you need to download and install Log Analytics gateway on them.

You don't need these agents unless you're using dependency visualization.

### Can I use an existing workspace for dependency visualization?

Yes, you can attach an existing workspace to the migration project and use it for dependency visualization. [Learn more](concepts-dependency-visualization.md#how-does-it-work).

### Can I export the dependency visualization report?

No, the dependency visualization can't be exported. However, Azure Migrate uses Service Map, and you can use the [Service Map REST API](https://docs.microsoft.com/rest/api/servicemap/machines/listconnections) to retrieve the dependencies in JSON format.

### How can I automate the installation of Microsoft Monitoring Agent (MMA) and the Dependency agent?

Use this [script to install the Dependency agent](../azure-monitor/insights/vminsights-enable-hybrid-cloud.md#installation-script-examples). Follow these [instructions to install MMA](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#install-and-configure-agent) by using the command line or automation. For
MMA, use [this script](https://gallery.technet.microsoft.com/scriptcenter/Install-OMS-Agent-with-2c9c99ab).

In addition to scripts, you can also use deployment tools like System Center Configuration Manager and [Intigua](https://www.intigua.com/getting-started-intigua-for-azure-migration) to deploy the agents.


### What operating systems are supported by MMA?

- View the list of [Windows operating systems supported by MMA](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems).
- View the list of [Linux operating systems supported by MMA](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems).

### Can I visualize dependencies for more than an hour?
No. You can visualize dependencies for up to an hour. You can go back to a particular date in history, as far back as a month, but the maximum duration for visualization is an hour. For example, you can use the time duration in the dependency map to view dependencies for yesterday, but you can view dependencies for a one-hour window only. However, you can use Azure Monitor logs to [query dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

### Can I use dependency visualization for groups of more than 10 VMs?
You can [visualize dependencies](https://docs.microsoft.com/azure/migrate/how-to-create-group-dependencies) for groups containing up to 10 VMs. If you have a group with more than 10 VMs, we recommend that you split the group into smaller groups, and then visualize the dependencies.

## Azure Migrate Server Migration

### What's the difference between Azure Migrate Server Migration and Site Recovery?

- Agentless migration of on-premises VMware VMs is native within Azure Migrate Server Migration.
- For migration of Hyper-V VMs, physical servers, and agent-based VMware VMs, Azure Migrate Server Migration uses the Azure Site Recovery replication engine.


## Next steps
Read the [Azure Migrate overview](migrate-services-overview.md).
