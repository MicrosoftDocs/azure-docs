---
title: Assessment best practices in Azure Migrate Server Assessment
description: Tips for creating assessments with Azure Migrate Server Assessment.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 11/19/2019
ms.author: raynew
---

# Best practices for creating assessments

[Azure Migrate](migrate-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings.

This article summarizes best practices when creating assessments using the Azure Migrate Server Assessment tool.

## About assessments

Assessments you create with Azure Migrate Server Assessment are a point-in-time snapshot of data. There are two types of assessments in Azure Migrate.

**Assessment type** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that make recommendations based on collected performance data | VM size recommendation is based on CPU and memory utilization data.<br/><br/> Disk type recommendation (standard HDD/SSD or premium-managed disks) is based on the IOPS and throughput of the on-premises disks.
**As-is on-premises** | Assessments that don't use performance data to make recommendations. | VM size recommendation is based on the on-premises VM size<br/><br> The recommended disk type is based on what you select in the storage type setting for the assessment.

### Example
As an example, if you have an on-premises VM with four cores at 20% utilization, and memory of 8 GB with 10% utilization, the assessments will be as follows:

- **Performance-based assessment**:
    - Identifies effective cores and memory based on core (4 x 0.20 = 0.8), and memory (8 GB x 0.10 = 0.8) utilization.
    - Applies the comfort factor specified in assessment properties (let's say 1.3x) to get the values to be used for sizing. 
    - Recommends the nearest VM size in Azure that can support ~1.04 cores (0.8 x 1.3) and ~1.04 GB (0.8 x 1.3) memory.

- **As-is (as on-premises) assessment**:
    -  Recommends a VM with four cores; 8 GB of memory.

## Best practices for creating assessments

The Azure Migrate appliance continuously profiles your on-premises environment, and sends metadata and performance data to Azure. Follow these best practices for assessments of servers discovered using an appliance:

- **Create as-is assessments**: You can create as-is assessments immediately once your machines show up in the Azure Migrate portal.
- **Create performance-based assessment**: After setting up discovery, we recommend that you wait at least a day before running a performance-based assessment:
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.
    - When you're running performance-based assessments, make sure you profile your environment for the assessment duration. For example, if you create an assessment with a performance duration set to one week, you need to wait for at least a week after you start discovery, for all the data points to be collected. If you don't, the assessment won't get a five-star rating.
- **Recalculate assessments**: Since assessments are point-in-time snapshots, they aren't automatically updated with the latest data. To update an assessment with the latest data, you need to recalculate it.

Follow these best practices for assessments of servers imported into Azure Migrate via .CSV file:

- **Create as-is assessments**: You can create as-is assessments immediately once your machines show up in the Azure Migrate portal.
- **Create performance-based assessment**: This helps to get a better cost estimate, especially if you have overprovisioned server capacity on-premises. However, the accuracy of the performance-based assessment depends on the performance data specified by you for the servers. 
- **Recalculate assessments**: Since assessments are point-in-time snapshots, they aren't automatically updated with the latest data. To update an assessment with the latest imported data, you need to recalculate it.

## Best practices for confidence ratings

When you run performance-based assessments, a confidence rating from 1-star (lowest) to 5-star (highest) is awarded to the assessment. To use confidence ratings effectively:
- Azure Migrate Server Assessment needs the utilization data for VM CPU/Memory.
- For each disk attached to the on-premises VM, it needs the read/write IOPS/throughput data.
- For each network adapter attached to the VM, it needs the network in/out data.

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

If you add or remove machines from a group after you create an assessment, the assessment you created will be marked **out-of-sync**. Run the assessment again (**Recalculate**) to reflect the group changes.

### Outdated assessments

If there are on-premises changes to VMs that are in a group that's been assessed, the assessment is marked **outdated**. An assessment can be marked as “Outdated” because of one or more changes in below properties:

- Number of processor cores
- Allocated memory
- Boot type or firmware
- Operating system name, version and architecture
- Number of disks
- Number of network adaptor
- Disk size change(GB Allocated)
- Update to Nic properties. Example: Mac address changes, IP address addition etc.

Run the assessment again (**Recalculate**) to reflect the changes.

### Low confidence rating

An assessment might not have all the data points for a number of reasons:

- You did not profile your environment for the duration for which you are creating the assessment. For example, if you are creating a *performance-based assessment* with performance duration set to one week, you need to wait for at least a week after you start the discovery for all the data points to get collected. You can always click on **Recalculate** to see the latest applicable confidence rating. Confidence rating is applicable only when you create a *performance-based* assessment.

- Few VMs were shut down during the period for which the assessment is calculated. If some VMs were powered off for some duration, Server Assessment will not be able to collect the performance data for that period.

- Few VMs were created after discovery in Server Assessment had started. For example, if you are creating an assessment for the performance history of last one month, but few VMs were created in the environment only a week ago. In this case, the performance data for the new VMs will not be available for the entire duration and the confidence rating would be low.


## Next steps

- [Learn](concepts-assessment-calculation.md) how assessments are calculated.
- [Learn](how-to-modify-assessment.md) how to customize an assessment.
