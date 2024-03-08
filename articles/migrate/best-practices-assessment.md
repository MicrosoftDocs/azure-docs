---
title: Assessment best practices in Azure Migrate Discovery and assessment tool
description: Tips for creating assessments with Azure Migrate Discovery and assessment tool.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 08/11/2021
ms.custom: engagement-fy23
---

# Best practices for creating assessments

[Azure Migrate](./migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings.

This article summarizes the best practices when creating assessments using the Azure Migrate Discovery and assessment tool.

Assessments you create with Azure Migrate: Discovery and assessment tool are a point-in-time snapshot of data. There are four types of assessments you can create using Azure Migrate: Discovery and assessment:

**Assessment Type** | **Details**
--- | ---
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. <br/><br/> You can assess your on-premises servers in [VMware](how-to-set-up-appliance-vmware.md) and [Hyper-V](how-to-set-up-appliance-hyper-v.md) environment, and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure using this assessment type. [Learn more](concepts-assessment-calculation.md)
**Azure SQL** | Assessments to migrate your on-premises SQL servers from your VMware environment to Azure SQL Database or Azure SQL Managed Instance. [Learn More](concepts-azure-sql-assessment-calculation.md)
**Azure App Service** | Assessments to migrate your on-premises ASP.NET web apps running on IIS web server, from your VMware environment to Azure App Service. [Learn More](concepts-azure-webapps-assessment-calculation.md)
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md). <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type. [Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

> [!NOTE]
> If the number of Azure VM or AVS assessments are incorrect on the Discovery and assessment tool, click on the total number of assessments to navigate to all the assessments and recalculate the Azure VM or AVS assessments. The Discovery and assessment tool will then show the correct count for that assessment type. 

### Sizing criteria
Sizing criteria options in Azure Migrate assessments:

**Sizing criteria** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that make recommendations based on collected performance data. | **Azure VM assessment**: VM size recommendation is based on CPU and memory utilization data.<br/><br/> Disk type recommendation (standard HDD/SSD, premium-managed or ultra disks) is based on the IOPS and throughput of the on-premises disks.<br/><br/>**Azure SQL assessment**: The Azure SQL configuration is based on performance data of SQL instances and databases, which includes: CPU utilization, Memory utilization, IOPS (Data and Log files), throughput, and latency of IO operations<br/><br/>**Azure VMware Solution (AVS) assessment**: AVS nodes recommendation is based on CPU and memory utilization data.
**As-is on-premises** | Assessments that don't use performance data to make recommendations. | **Azure VM assessment**: VM size recommendation is based on the on-premises VM size<br/><br> The recommended disk type is based on what you select in the storage type setting for the assessment.<br/><br/> **Azure App Service assessment**: Assessment recommendation is based on on-premises web apps configuration data.<br/><br/> **Azure VMware Solution (AVS) assessment**: AVS nodes recommendation is based on the on-premises VM size.

#### Example
As an example, if you have an on-premises VM with four cores at 20% utilization, and memory of 8 GB with 10% utilization, the Azure VM assessment will be as follows:

- **Performance-based assessment**:
    - Identifies effective cores and memory based on core (4 x 0.20 = 0.8), and memory (8 GB x 0.10 = 0.8) utilization.
    - Applies the comfort factor specified in assessment properties (let's say 1.3x) to get the values to be used for sizing. 
    - Recommends the nearest VM size in Azure that can support ~1.04 cores (0.8 x 1.3) and ~1.04 GB (0.8 x 1.3) memory.

- **As-is (as on-premises) assessment**:
    -  Recommends a VM with four cores; 8 GB of memory.


## Best practices for creating assessments

The Azure Migrate appliance continuously profiles your on-premises environment, and sends metadata and performance data to Azure. Follow these best practices for assessments of servers discovered using an appliance:

- **Create as-is assessments**: You can create as-is assessments immediately once your servers show up in the Azure Migrate portal. You cannot create an Azure SQL assessment with sizing criteria "As on-premises". Azure App Service assessment by default is "As on-premises".
- **Create performance-based assessment**: After setting up discovery, we recommend that you wait at least a day before running a performance-based assessment:
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.
    - When you're running performance-based assessments, make sure you profile your environment for the assessment duration. For example, if you create an assessment with a performance duration set to one week, you need to wait for at least a week after you start discovery, for all the data points to be collected. If you don't, the assessment won't get a five-star rating.
- **Recalculate assessments**: Since assessments are point-in-time snapshots, they aren't automatically updated with the latest data. To update an assessment with the latest data, you need to recalculate it.

Follow these best practices for assessments of servers imported into Azure Migrate via .CSV file:

- **Create as-is assessments**: You can create as-is assessments immediately once your servers show up in the Azure Migrate portal.
- **Create performance-based assessment**: This helps to get a better cost estimate, especially if you have overprovisioned server capacity on-premises. However, the accuracy of the performance-based assessment depends on the performance data specified by you for the servers. 
- **Recalculate assessments**: Since assessments are point-in-time snapshots, they aren't automatically updated with the latest data. To update an assessment with the latest imported data, you need to recalculate it.
 
### FTT Sizing Parameters for AVS assessments

The storage engine used in AVS is vSAN. vSAN storage policies define storage requirements for your virtual machines. These policies guarantee the required level of service for your VMs because they determine how storage is allocated to the VM. These are the available FTT-Raid Combinations: 

**Failures to Tolerate (FTT)** | **RAID Configuration** | **Minimum Hosts Required** | **Sizing consideration**
--- | --- | --- | ---
1 | RAID-1 (Mirroring) | 3 | A 100GB VM would consume 200GB.
1 | RAID-5 (Erasure Coding) | 4 | A 100GB VM would consume 133.33GB
2 | RAID-1 (Mirroring) | 5 | A 100GB VM would consume 300GB.
2 | RAID-6 (Erasure Coding) | 6 | A 100GB VM would consume 150GB.
3 | RAID-1 (Mirroring) | 7 | A 100GB VM would consume 400GB.

## Best practices for confidence ratings

When you run performance-based assessments, a confidence rating from 1-star (lowest) to 5-star (highest) is awarded to the assessment. To use confidence ratings effectively:

- Azure VM and AVS assessments need:
    - The CPU and memory utilization data for each of the servers
    - The read/write IOPS/throughput data for each disk attached to the on-premises server
    - The network in/out data for each network adapter attached to the server.
     
- Azure SQL assessments need the performance data of the SQL instances and databases being assessed, which include:
    - The CPU and memory utilization data
    - The read/write IOPS/throughput data of data and Log files
    - The latency of IO operations

Depending on the percentage of data points available for the selected duration, the confidence rating for an assessment is provided as summarized in the following table.

   **Data point availability** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Star
   41%-60% | 3 Star
   61%-80% | 4 Star
   81%-100% | 5 Star

## Common assessment issues

Here's how to address some common environment issues that affect assessments.

###  Out-of-sync assessments

If you add or remove servers from a group after you create an assessment, the assessment you created will be marked **out-of-sync**. Run the assessment again (**Recalculate**) to reflect the group changes.

### Outdated assessments

#### Azure VM assessment and AVS assessment

If there are changes on the on-premises servers that are in a group that's been assessed, the assessment is marked **outdated**. An assessment can be marked as “Outdated” because of one or more changes in below properties:

- Number of processor cores
- Allocated memory
- Boot type or firmware
- Operating system name, version and architecture
- Number of disks
- Number of network adaptor
- Disk size change(GB Allocated)
- Nic properties update. Example: Mac address changes, IP address addition etc.

Run the assessment again (**Recalculate**) to reflect the changes.

#### Azure SQL assessment

If there are changes to on-premises SQL instances and databases that are in a group that's been assessed, the assessment is marked **outdated**. An assessment can be marked as “Outdated” because of one or more reasons below:

- SQL instance was added or removed from a server
- SQL database was added or removed from a SQL instance
- Total database size in a SQL instance changed by more than 20%
- Change in number of processor cores
- Change in allocated memory
  
    Run the assessment again (**Recalculate**) to reflect the changes.

#### Azure App Service assessment

If there are changes to on-premises web apps that are in a group that's been assessed, the assessment is marked **outdated**. An assessment can be marked as “Outdated” because of one or more reasons below:

- Web apps were added or removed from a server
- Configuration changes made to existing web apps.
  
    Run the assessment again (**Recalculate**) to reflect the changes.

### Low confidence rating

An assessment might not have all the data points for many reasons:

- You did not profile your environment for the duration for which you are creating the assessment. For example, if you are creating an assessment with performance duration set to one week, you need to wait for at least a week after you start the discovery for all the data points to get collected. If you cannot wait for the duration, please change the performance duration to a smaller period and 'Recalculate' the assessment.
 
- Assessment is not able to collect the performance data for some or all the servers in the assessment period. For a high confidence rating, please ensure that: 
    - Servers are powered on during the assessment
    - Outbound connections on ports 443 are allowed
    - For Hyper-V Servers dynamic memory is enabled 
    - The connection status of agents in Azure Migrate are 'Connected' and check the last heartbeat
    - For Azure SQL assessments, Azure Migrate connection status for all SQL instances is "Connected" in the discovered SQL instance blade

    Please 'Recalculate' the assessment to reflect the latest changes in confidence rating.

- For Azure VM and AVS assessments, few servers were created after discovery had started. For example, if you are creating an assessment for the performance history of last one month, but few servers were created in the environment only a week ago. In this case, the performance data for the new servers will not be available for the entire duration and the confidence rating would be low.

- For Azure SQL assessments, few SQL instances or databases were created after discovery had started. For example, if you are creating an assessment for the performance history of last one month, but few SQL instances or databases were created in the environment only a week ago. In this case, the performance data for the new servers will not be available for the entire duration and the confidence rating would be low.

### Migration Tool Guidance for AVS assessments

In the Azure readiness report for Azure VMware Solution (AVS) assessment, you can see the following suggested tools: 
- **VMware HCX or Enterprise**: For VMware servers, VMware Hybrid Cloud Extension (HCX) solution is the suggested migration tool to migrate your on-premises workload to your Azure VMware Solution (AVS) private cloud. [Learn More](../azure-vmware/install-vmware-hcx.md).
- **Unknown**: For servers imported via a CSV file, the default migration tool is unknown. Though, for servers in VMware environment, its is recommended to use the VMware Hybrid Cloud Extension (HCX) solution.


## Next steps

- [Learn](concepts-assessment-calculation.md) how assessments are calculated.
- [Learn](how-to-modify-assessment.md) how to customize an assessment.
