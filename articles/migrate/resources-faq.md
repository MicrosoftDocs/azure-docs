---
title: Azure Migrate - Frequently Asked Questions (FAQ) | Microsoft Docs
description: Addresses frequently asked questions about Azure Migrate
author: snehaamicrosoft
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 03/28/2019
ms.author: snehaa
---

# Azure Migrate - Frequently Asked Questions (FAQ)

This article includes frequently asked questions about Azure Migrate. If you have any further queries after reading this article, post them on the [Azure Migrate forum](https://aka.ms/AzureMigrateForum).

## General

### Which Azure geographies are supported by Azure Migrate?
Azure Migrate currently supports Europe, United States, and Azure Government as the project geographies. Even though you can only create migration projects in these geographies, you can still assess your machines for multiple target locations. The project geography is only used to store the discovered metadata.

**Geography** | **Metadata storage location**
Azure Government | US Gov Virginia
Asia | Southeast Asia
Europe | North Europe or West Europe
Unites States | East US or West Central US

### How is Azure Migrate different from Azure Site Recovery?

Azure Migrate provides tools that helps you to discover, assess, and migratemachines and workloads to Azure. [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/migrate-tutorial-on-premises-azure) is a disaster recovery solution.

## Azure Migrate appliance (VMware/physical servers)

### How does the Azure Migrate appliance connect to Azure?

The connection can be over the internet or use ExpressRoute with public peering.

### What network connectivity requirements are needed for Azure Migrate?

For the URLs and ports needed for Azure Migrate to communicate with Azure, see [URLs for connectivity](https://docs.microsoft.com/azure/migrate/concepts-collector#urls-for-connectivity).

### Can I harden the VM set up with the OVA template?

Additional components (for example anti-virus) can be added into the OVA template as long as the communication and firewall rules required for the Azure Migrate appliance to work are left as is.   

### To harden the Azure Migrate appliance, what are the recommended Antivirus (AV) exclusions?

You need to exclude the following folders in the appliance for antivirus scanning:

- Folder that has the binaries for Azure Migrate Service. Exclude all sub-folders.
  %ProgramFiles%\ProfilerService  
- Azure Migrate Web Application. Exclude all sub-folders.
  %SystemDrive%\inetpub\wwwroot
- Local Cache for Database and log files. Azure migrate service needs RW access to this folder.
  %SystemDrive%\Profiler

### What data is collected by Azure Migrate?

Azure Migrate supports two kinds of discovery, appliance-based discovery and agent-based discovery. The appliance-based discovery collects metadata about the on-premises VMs, the complete list of metadata collected by the appliance is listed below:

**Configuration data of the VM**
- VM display name (on vCenter)
- VM inventory path (host/cluster/folder in vCenter)
- IP address
- MAC address
- Operating system
- Number of cores, disks, NICs
- Memory size, Disk sizes

**Performance data of the VM**
- CPU usage
- Memory usage
- For each disk attached to the VM:
  - Disk read throughput
  - Disk writes throughput
  - Disk read operations per sec
  - Disk writes operations per sec
- For each network adapter attached to the VM:
  - Network in
  - Network out

The agent-based discovery is an option available on top of the appliance-based discovery and helps customers [visualize dependencies](how-to-create-group-machine-dependencies.md) of the on premises VMs. The dependency agents collect details like, FQDN, OS, IP address, MAC address, processes running inside the VM and the incoming/outgoing TCP connections from the VM. The agent-based discovery is optional and you can choose to not install the agents if you do not want to visualize the dependencies of the VMs.

### Would there be any performance impact on the analyzed ESXi host environment?

With continuous profiling of performance data, there is no need to change the vCenter Server statistics level to run a performance-based assessment. The collector appliance will profile the on-premises machines to measure the performance data of the virtual machines. This would have almost zero performance impact on the ESXi hosts as well as on the vCenter Server.

### Where is the collected data stored and for how long?

The data collected by the collector appliance is stored in the Azure location that you specify while creating the migration project. The data is securely stored in a Microsoft subscription and is deleted when the user deletes the Azure Migrate project.

For dependency visualization, if you install agents on the VMs, the data collected by the dependency agents is stored in the US in a Log Analytics workspace created in user’s subscription. This data is deleted when you delete the Log Analytics workspace in your subscription. [Learn more](https://docs.microsoft.com/azure/migrate/concepts-dependency-visualization).

### What is the volume of data which is uploaded by Azure Migrate in the case of continuous profiling?

The volume of data which is sent to Azure Migrate would vary based on several parameters. To give an indicative number, a project having ten machines (each having one disk and one NIC), would send around 50 MB per day. This is an approximate value and would change based on the number of data points for the NICs and disks (the data sent would be non-linear if the number of machines, NICs or disks increase).

### Is the data encrypted at rest and while in transit?

Yes, the collected data is encrypted both at rest and while in transit. The metadata collected by the appliance is securely sent to the Azure Migrate service over internet via https. The collected metadata is stored in [Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/database-encryption-at-rest) and in [Azure blob storage](https://docs.microsoft.com/azure/storage/common/storage-service-encryption) in a Microsoft subscription and is encrypted at rest.

The data collected by the dependency agents is also encrypted in transit (secure https channel) and is stored in a Log Analytics workspace in the user’s subscription. It is also encrypted at rest.

### How does the collector communicate with the vCenter Server and the Azure Migrate service?

The collector appliance connects to the vCenter Server (port 443) using the credentials provided by the user in the appliance. It queries the vCenter Server using VMware PowerCLI to collect metadata about the VMs managed by vCenter Server. It collects both configuration data about VMs (cores, memory, disks, NIC etc.) as well as performance history of each VM for the last one month from vCenter Server. The collected metadata is then sent to the Azure Migrate service (over internet via https) for assessment. [Learn more](concepts-collector.md)

### Can I connect the same collector appliance to multiple vCenter servers?

Yes, a single collector appliance can be used to discover multiple vCenter Servers, but not concurrently. You need to run the discovery one after another.

### Is the OVA template used by Site Recovery integrated with the OVA used by Azure Migrate?

Currently there is no integration. The .OVA template in Site Recovery is used to set up a Site Recovery configuration server for VMware VM/physical server replication. The .OVA used by Azure Migrate is used to discover VMware VMs managed by a vCenter server, for the purposes of migration assessment.

### I changed my machine size. Can I rerun the assessment?

The Azure Migrate appliance continuously collects information about the on-premises environment, however, an assessment is a point-in-time snapshot of the on-premises VMs. If you change the settings on an on-premises VM you want to assess, you can use the 'Recalculate' option on the assessment to update the assessment with the latest changes.

### How can I discover a multi-tenant environment in Azure Migrate?

For VMware, if you have an environment that is shared across tenants and you do not want to discover the VMs of one tenant in another tenant's subscription, create a vCenter Server credential that has access to only those VMs that you want to discover and use it to while kicking off discovery in the Azure Migrate appliance.

For Hyper-V, the discovery is done using Hyper-V host credentials, if the VMs are sharing the same Hyper-V host, currently there is no way to separate the discovery.  

### How many virtual machines can be discovered using a single migration appliance?

You can discover up to 10,000 VMware VMs and up to 5,000 Hyper-V VMs using a single migration appliance.  If you have more machines in your on-premises environment, [learn more](how-to-scale-assessment.md) about how you can discover a large environment in a single migration project.


## Azure Migrate: Server Assessment

### Does Azure Migrate: Server Assessment support assessment of physical servers?

No, Azure Migrate currently does not support assessment of physical servers. Support for physical servers will be enabled in future.

### Does Azure Migrate need vCenter Server to discover a VMware environment?

Yes, Azure Migrate requires vCenter Server to discover a VMware environment. It does not support discovery of ESXi hosts that are not managed by a vCenter Server.

### What's the difference between using Azure Migrate: Server Assessment and the Map Toolkit?

[Azure Migrate](migrate-overview.md) provides migration assessment specifically to assist with migration readiness and evaluation of on-premises workloads into Azure. [Microsoft Assessment and Planning (MAP) Toolkit](https://www.microsoft.com/en-us/download/details.aspx?id=7826) has other functionalities such as migration planning for newer versions of Windows client and server operating systems and software usage tracking. For those scenarios, continue to use the MAP Toolkit.

### How is Azure Migrate: Server Assessment different from Azure Site Recovery Deployment Planner?

Azure Migrate: Server Assessment is a migration planning tool and Azure Site Recovery Deployment Planner is a disaster recovery (DR) planning tool.

**Migration from VMware/Hyper-V to Azure**: If you intend to migrate your on-premises servers to Azure, use Azure Migrate: Server Assessment for migration planning. Azure Migrate: Server Assessment assesses on-premises workloads and provides guidance, insights, and mechanisms to assist you in migrating to Azure. Once you are ready with your migration plan, you can use services such as Azure Migrate: Server Migration to migrate the machines to Azure.

**Disaster Recovery from VMware/Hyper-V to Azure**: If you intend to do disaster recovery (DR) on Azure using Azure Site Recovery (Site Recovery), use Site Recovery Deployment Planner for DR planning. Site Recovery Deployment Planner does a deep, ASR-specific assessment of your on-premises environment. It provides recommendations that are required by Site Recovery for successful DR operations such as replication, failover of your virtual machines.  

### Does Azure Migrate support Enterprise Agreement (EA) based cost estimation?

Azure Migrate currently does not support cost estimation for [Enterprise Agreement offer](https://azure.microsoft.com/offers/enterprise-agreement-support/). The workaround is to specify Pay-As-You-Go as the offer and manually specifying the discount percentage (applicable to the subscription) in the 'Discount' field of the assessment properties.

  ![Discount](./media/resources-faq/discount.png)

### What is the difference between as-on-premises sizing and performance-based sizing?

When you specify the sizing criterion to be as-on-premises sizing, Azure Migrate does not consider the performance data of the VMs and sizes the VMs based on the on-premises configuration. If the sizing criterion is performance-based, the sizing is done based on utilization data. For example, if there is an on-premises VM with 4 cores and 8 GB memory with 50% CPU utilization and 50% memory utilization. If the sizing criterion is as on-premises sizing an Azure VM SKU with 4 cores and 8GB memory is recommended, however, if the sizing criterion is performance-based as VM SKU of 2 cores and 4 GB would be recommended as the utilization percentage is considered while recommending the size. Similarly, for disks, the disk sizing depends on two assessment properties - sizing criterion and storage type. If the sizing criterion is performance-based and storage type is automatic, the IOPS and throughput values of the disk are considered to identify the target disk type (Standard or Premium). If the sizing criterion is performance-based and storage type is premium, a premium disk is recommended, the premium disk SKU in Azure is selected based on the size of the on-premises disk. The same logic is used to do disk sizing when the sizing criterion is as on-premises sizing and storage type is standard or premium.

### What impact does performance history and percentile utilization have on the size recommendations?

These properties are only applicable for performance-based sizing. Azure Migrate collects performance history of on-premises machines and uses it to recommend the VM size and disk type in Azure. The collector appliance continuously profiles the on-premises environment to gather real-time utilization data every 20 seconds. The appliance rolls up the 20-second samples, and creates a single data point for every 15 minutes. To create the single data point, the appliance selects the peak value from all the 20-second samples, and sends it to Azure. When you create an assessment in Azure, based on the performance duration and performance history percentile value, Azure Migrate calculates the effective utilization value and uses it for sizing. For example, if you have set the performance duration to be 1 day and percentile value to 95 percentile, Azure Migrate uses the 15 min sample points sent by collector for the last one day, sorts them in ascending order and picks the 95th percentile value as the effective utilization. The 95th percentile value ensures that you are ignoring any outliers which may come if you pick the 99th percentile. If you want to pick the peak usage for the period and do not want to miss any outliers, you should select the 99th percentile.

### What is dependency visualization?

Dependency visualization enables you to assess groups of VMs for migration with greater confidence by cross-checking machine dependencies before you run an assessment. Dependency visualization helps you to ensure that nothing is left behind, avoiding unexpected outages when you migrate to Azure. Azure Migrate leverages the Service Map solution in Azure Monitor logs to enable dependency visualization.

> [!NOTE]
> The dependency visualization functionality is not available in Azure Government.

### Do I need to pay to use the dependency visualization feature?

No. Learn more about Azure Migrate pricing [here](https://azure.microsoft.com/pricing/details/azure-migrate/).

### Do I need to install anything for dependency visualization?

To use dependency visualization, you need to download and install agents on each on-premises machine that you want to evaluate.

- [Microsoft Monitoring agent(MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows) needs to be installed on each machine.
- The [Dependency agent](https://docs.microsoft.com/azure/monitoring/monitoring-service-map-configure) needs to be installed on each machine.
- In addition, if you have machines with no internet connectivity, you need to download and install Log Analytics gateway on them.

You don't need these agents on machines you want to assess unless you're using dependency visualization.

### Can I use an existing workspace for dependency visualization?

Yes, Azure Migrate now allows you to attach an existing workspace to the migration project and leverage it for dependency visualization. [Learn more](https://docs.microsoft.com/azure/migrate/concepts-dependency-visualization#how-does-it-work).

### Can I export the dependency visualization report?

No, the dependency visualization cannot be exported. However, since Azure Migrate uses Service Map for dependency visualization, you can use the [Service Map REST APIs](https://docs.microsoft.com/rest/api/servicemap/machines/listconnections) to get the dependencies in a json format.

### How can I automate the installation of Microsoft Monitoring Agent (MMA) and dependency agent?

[Here](https://docs.microsoft.com/azure/monitoring/monitoring-service-map-configure#installation-script-examples) is a script that you can use for installation of dependency agent. [Here](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#install-and-configure-agent) are instructions on how you can install MMA using command line or automated methods. For
MMA, you can also leverage a script available [here](https://gallery.technet.microsoft.com/scriptcenter/Install-OMS-Agent-with-2c9c99ab) on Technet.

In addition to scripts, you can also leverage deployment tools like System Center Configuration Manager (SCCM), [Intigua](https://www.intigua.com/getting-started-intigua-for-azure-migration) etc. to deploy the agents.

### What are the operating systems supported by MMA?

The list of Windows operating systems supported by MMA is [here](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems).
The list of Linux operating systems supported by MMA is [here](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems).

### What are the operating systems supported by dependency agent?

The list of Windows operating systems supported by dependency agent is [here](https://docs.microsoft.com/azure/monitoring/monitoring-service-map-configure#supported-windows-operating-systems).
The list of Linux operating systems supported by dependency agent is [here](https://docs.microsoft.com/azure/monitoring/monitoring-service-map-configure#supported-linux-operating-systems).

### Can I visualize dependencies in Azure Migrate for more than one hour duration?
No, Azure Migrate lets you visualize dependencies for up to one hour duration. Azure Migrate allows you to go back to a particular date in the history for up to last one month, but the maximum duration for which you can visualize the dependencies is up to 1 hour. For example, you can use the time duration functionality in the dependency map, to view dependencies for yesterday, but can only view it for a one hour window. However, you can use Azure Monitor logs to [query the dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

### Is dependency visualization supported for groups with more than 10 VMs?
You can [visualize dependencies for groups](https://docs.microsoft.com/azure/migrate/how-to-create-group-dependencies) that have up to 10 VMs. If you have a group with more than 10 VMs, we recommend you to split the group in to smaller groups and visualize the dependencies.

## Azure Migrate: Server Migration

### How is Azure Migrate: Server Migration different from Azure Site Recovery?

Azure Migrate: Server Migration leverages Azure Site Recovery's replication engine to migrate on-premises servers to Azure, providing a simple way to orchestrate and track migration.

## Next steps
Read the [Azure Migrate overview](migrate-services-overview.md)
