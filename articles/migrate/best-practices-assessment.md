---
title: Best practices for creating assessment with Azure Migrate Server Assessment | Microsoft Docs
description: Provides tips for creating assessments with Azure Migrate Server Assessment.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: raynew
---

# Best practices for creating assessments

[Azure Migrate](migrate-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings. 

This article summarizes best practices when creating assessments using the Azure Migrate Server Assessment tool. 

## About assessments

Assessments you create with Azure Migrate Server Assessment are a point-in-time snapshot of data. There are two types of assessments in Azure Migrate.

**Assessment type** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that make recommendations based on collected performance data | VM size recommendation is based on CPU and memory utilization data.<br/><br/> Disk type recommendation (standard or premium managed disks) is based on the IOPS and throughput of the on-premises disks.
**As-is on-premises** | Assessments that don't use performance data to make recommendations. | VM size recommendation is based on the on-premises VM size<br/><br> The recommended disk type is based on what you select in the storage type setting for the assessment.

### Example
As an example, if you have an on-premises VM with four cores at 20% utilization, and memory of 8 GB with 10% utilization, the assessments will be as follows:

- **Performance-based assessment**:
    - Recommends cores and memory based on core (0.8 cores), and memory (0.8 GB) utilization.
    - The assessment applies a default comfort factor of 30%.
    - VM recommendation: ~1.4 cores (0.8 x1.3) and ~1.4 GB memory.
- **As-is (on-premises) assessment**:
    -  Recommends a VM with four cores; 8 GB of memory.

## Best practices for creating assessments

The Azure Migrate appliance continuously profiles your on-premises environment, and sends metadata and performance data to Azure. Follow these best practices for creating assessments:

- **Create as-is assessments**: You can create as-is assessments immediately after discovery.
- **Create performance-based assessment**: After setting up discovery, we recommend that you wait at least a day before running a performance-based assessment:
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.
    - For performance data, the appliance collects real-time data points every 20 seconds for each performance metric, and rolls them up to a single five-minute data point. The appliance sends the five-minute data point to Azure every hour for assessment calculation.  
- **Get the latest data**: Assessments aren't automatically updated with the latest data. To update an assessment with the latest data, you need to rerun it. 
- **Make sure durations match**: When you're running performance-based assessments, make sure your profile your environment for the assessment duration. For example, if you create an assessment with a performance duration set to one week, you need to wait for at least a week after you start discovery, for all the data points to be collected. If you don't, the assessment won't get a five-star rating. 
- **Avoid missing data points**: The following issues might result in missing data points in a performance-based assessment:
    - VMs are powered off during the assessment and performance data isn't collected. 
    - If you create VMs during the month on which you base performance history. the data for those VMs will be less than a month. 
    - The assessment is created immediately after discovery, or the assessment time doesn't match the performance data collection time.

## Best practices for confidence ratings

When you run performance-based assessments, a confidence rating from 1-star (lowest) to 5-star (highest) is awarded to the assessment. To use confidence ratings effectively:
- Azure Migrate Server Assessment needs the utilization data for VM CPU/Memory, and the disk IOPS/throughput data.
- For each network adapter attached to a VM, Azure Migrate needs the network in/out data.
- If utilization data isn't available in vCenter Server, the size recommendation done by Azure Migrate might not be reliable. 

Depending on the percentage of data points available, the confidence ratings for an assessment are summarized in the following table.

   **Data point availability** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Star
   41%-60% | 3 Star
   61%-80% | 4 Star
   81%-100% | 5 Star

- If you receive a confidence rating for an assessment that's below five stars, wait at least a day and then recalculate the assessment.
- A low rating means that sizing recommendations might not be reliable. In this case, we recommend that you modify the assessment properties to use as-is on-premises assessment.

## Common assessment issues

Here's how to address some common environment issues that affect assessments.

###  Out-of-sync assessments

If you add or remove machines from a group after you create an assessment, the assessment you created will be marked **out-of-sync**. Run the assessment again (**Recalculate**) to reflect the group changes.

### Outdated assessments

If there are on-premises changes to VMs that are in a group that's been assessed, the assessment is marked **outdated**. To reflect the changes, run the assessment again.

### Missing data points

An assessment might not have all the data points for a number of reasons:

- VMs might be powered off during the assessment and performance data isn't collected. 
- VMs might be created during the month on which performance history is based, thus their performance data is less than a month. 
- The assessment was created immediately after discovery. In order to gather performance data for a specified amount of time, you need to wait the specified amount of time before you run an assessment. For example, if you want to assess performance data for a week, you need to wait a week after discovery. If you don't the assessment won't get a five-star rating. 


## Next steps

- [Learn](concepts-assessment-calculation.md) how assessments are calculated.
- [Learn](how-to-modify-assessment.md) how to customize an assessment.
