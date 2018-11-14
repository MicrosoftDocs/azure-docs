---
title: Discover and assess on-premises Hyper-V VMs for migration to Azure with the Azure Migrate Server Assessment Service | Microsoft Docs
description: Describes how to discover and assess on-premises Hyper-V VMs for migration to Azure, using the Azure Migrate Server Assessment Service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 11/08/2018
ms.author: raynew
ms.custom: mvc
---

# Discover and assess on-premises Hyper-V VMs for migration to Azure with the Server Assessment Service

As you move on-premises resources to the cloud, use [Azure Migrate](migrate-overview.md) to discover, assess, and migrate machines and workloads to Microsoft Azure. This article describes how to assess on-premises Hyper-V VMs

> [!NOTE]
> Azure Migrate Server Assessment is currently in public preview. Discover and assessment of Hyper-V VMs isn't supported in the General Availability (GA) version of Azure Migrate. 


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Group VMs discovered by Azure Migrate, and assess the VM group.
> * Review the assessment, including suitability of VMs for migration to Azure, estimated Azure VM sizes, and cost estimations for running the VMs in Azure.


## Assessment types

There are two types of assessments you can run.

**Assessment type** | **Assessment recommendations**
--- | ---
**Performance-based assessment** | VM size recommendation based on CPU and memory utilization data.<br/><br/> Disk type recommendation (standard or premium managed disks) based on the IOPS and throughput of the on-premises disks.
**As-is assessment** | The assessment doesn't use performance data for recommendations.<br/><br/>VM size recommendation based on the on-premises VM size<br/><br> Disk type recommended is always a standard managed disk. 
**Example assessment:**<br/> - **4-core (20% utilization)**<br/><br/> - **8 GB RAM (10% utilization)** | **Performance-based assessment** recommends cores and RAM based on core (0.8 cores), and memory (0.8 GB) utilization. The assessment also applies a default comfort factor of 30%. VM recommendation: ~1.4 cores (0.8 x1.3); ~1.4 GB memory.<br/><br/> **As-is assessment** recommends a VM with 4 cores; 8 GB of memory.



## Before you start

- Before you begin this tutorial you should deployed the Azure Migrate appliance. If you haven't, [complete this tutorial](tutorial-deploy-appliance-hyper-v.md) to set up the appliance, before you begin the assessment.
- To learn more about this preview:
    - Review the [preview features and limitations](migrate-overview.md#azure-migrate-services-public-preview).
    - Learn about [Hyper-V](migrate-overview.md#hyper-v-architecture) assessment architecture and processes.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.




### Verify VMs in the portal

Verify that the VMs appear as expected in the Azure portal:

1. Open the Azure Migrate dashboard
2. In the **Server Assessment Service** page, click the icon that displays the count for the discovered machines. 

Note the following:
- You can run assessments after discovery. We recommend that you wait at least a day to create performance-based assessments, so that data can be collected.
- The appliance continuously profiles the on-premises environment and sends metadata.
- For performance data, the appliance collects real-time data points every 20 seconds for each performance metrics, and rolls them up to a single five minute data point, and sends it to Azure for assessment calculation.  
- [Learn more](https://docs.microsoft.com/azure/migrate/concepts-collector#what-data-is-collected) about the data that's collected by the appliance. 

 
## Create an assessment


- Assessments are a point-in-time snapshot of data available in Azure Migrate. They aren't automatically updated with the latest data. To update an assessment with the latest data, you need to rerun it.
- You can create as-is assessments immediately after discovery.
- For performance assessments, we recommend that you wait at least a day after discovery:
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.
    - For performance data, the appliance collects real-time data points every 20 seconds for each performance metrics, and rolls them up to a single five minute data point. The appliance sends the five-minute data point to Azure every hour for assessment calculation.  
    - [Learn more](https://docs.microsoft.com/azure/migrate/concepts-collector#what-data-is-collected) about the data that's collected by the appliance.


Create a group and run an assessment as follows:

1. On the Azure Migrate dashboard, click **Assess Servers**.
2. Click **View all** to review the assessment properties.
3. To create the group of VMs, specify a group name.
4. Select the machines that you want to add to the group.
5. Click **Create Assessment**, to create the group and the assessment.
6. After the assessment is created, view it in **Overview** > **Dashboard**.
7. Click **Export assessment**, to download it as an Excel file.

## Review an assessment

An assessment specifies:

- **Readiness**: Whether VMs are suitable for migration to Azure
- **Size estimation**: An estimated size for the Azure VM after migration.
- **Cost estimation**: The estimated monthly costs of running the VM in Azure.


![Assessment report](./media/tutorial-assessment-vmware/assessment-report.png)

### Review Azure readiness

The assessment shows VM readiness in one of the states summarized in the following table.

**State** | **Details**
--- | ---
**Ready** | Azure Migrate recommends a VM size in Azure:<br/><br/> - For performance-based assessment, sizing is based on VM CPU/RAM utilization and disk IOPS/throughput.<br/><br/> - For as-is assessment, sizing is based on the size of the on-premises VM, and disk storge type specified in the assessment (premium by default).<br/><br/> - [Learn more](concepts-assessment-calculation.md) about sizing.
**Conditionally ready** | Details of readiness issues and remediation steps.
**Not ready** | Details of readiness issues and remediation steps.
**Readiness unknown** | This state is used for VMs for which Azure Migrate can't assess readiness, due to data availability issues.


#### Review monthly cost estimate

This view shows the estimate compute and storage cost of running the VMs in Azure. 

- Cost estimates are based on the size recommendations for a machine, and its disks and properties.
- Estimated monthly costs for compute and storage are aggregated for all VMs in the assessed group.
- The cost estimation is for running the on-premises VMs as IaaS VMs. Azure Migrate doesn't consider PaaS or SaaS costs. 


### Review confidence ratings

When you run performance-based assessments, a confidence rating is assigned to the assessment.

- A rating from 1-star (lowest) to 5-star (highest) is awarded.
- The confidence rating helps you estimate the reliability of the size recommendations provided by the assessment.
- The confidence rating is based on the availability of data points needed to compute the assessment.
- To provide a rating Azure Migrate needs the utilization data for VM CPU/Memory, and the disk IOPS/throughput data. For each network adapter attached to a VM, Azure Migrate needs the network in/out data.
- In particular, if utilization data isn't available in vCenter Server, the size recommendation done by Azure Migrate might not be reliable. 

Depending on the percentage of data points available, the confidence rating for an assessment are summarized in the following table.

   **Data point availability** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Star
   41%-60% | 3 Star
   61%-80% | 4 Star
   81%-100% | 5 Star

If you run a one-time discovery and the assessment is less than 4-star, make sure the statistic level in vCenter is set to 3, wait at least a day, and recalculate the assessment. If this isn't possible, run an as-is assessment instead.

### Assessment issues

There can be a number of issues with assessments.

####  Group or VM changes

- If you add or remove machines from a group after you create an assessment, the assessment you created will be marked **out-of-sync**. You need to run the assessment again (**Recalculate**) to reflect the group changes.
- If there are on-premises changes to VMs that are in a group that's been assessed, the assessment is marked **outdated**. To reflect the changes, run the assessment again.

#### Missing data points

An assessment might not have all the data points for a number of reasons:

- VMs might be powered off during the assessment and performance data isn't collected. 
- VMs might be created during the month on which performance history is based, thus their performance data is less than a month. 
- The assessment was created immediately after discovery. In order to gather performance data for a specified amount of time, you need to wait the specified amount of time before you run an assessment. For example, if you want to assess performance data for a week, you need to wait a week after discovery. If you don't the assessment won't get a five-star rating. 


## Next steps

- [Learn](concepts-assessment-calculation.md) how assessments are calculated.
- [Learn](how-to-modify-assessment.md) how to customize an assessment.
