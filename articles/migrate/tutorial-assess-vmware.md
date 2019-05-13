---
title: Assess VMware VMs for migration with Azure Migrate
description: Describes how to assess on-premises VMware VMs for migration to Azure using Azure Migrate.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 02/26/2019
ms.author: raynew
ms.custom: mvc
---

# Assess VMware VMs for migration

As you move on-premises resources to the cloud, [Azure Migrate](migrate-overview.md) helps you to discover, assess, and migrate machines and workloads to Microsoft Azure. This article describes how to assess on-premises VMware VMs before migrating them to Azure.


> [!NOTE]
> This article describes how to assess VMware VMs using the latest version of Azure Migrate. If you're using the earlier classic version of Azure Migrate, you set up an assessment using [this article](tutorial-assessment-vmware-classic.md). How can I check which version I'm using?


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Group discovered VMs, and assess the group.
> * Review the assessment.


## About assessments

### Assessment types

There are two types of assessments in Azure Migrate.

**Assessment type** | **Details** | **Data**
--- | --- | ---
**Performance-based assessment** | You run an assessment using collected performance data | VM size recommendation is based on CPU and memory utilization data.<br/><br/> Disk type recommendation (standard or premium managed disks) is on the IOPS and throughput of the on-premises disks.
**As-is assessment** | You run an assessment that doesn't use collected performance data. <br/><br/>VM size recommendation is based on the on-premises VM size<br/><br> The recommended disk type is always a standard managed disk. 

#### Example
For example if you have an on-premises VM with four cores at 20% utilization, and memory of 8 GB with 10% utilization, the assessments will be as follows:

 
- **Performance-based assessment**:
    - Recommends cores and RAM based on core (0.8 cores), and memory (0.8 GB) utilization.
    - The assessment applies a default comfort factor of 30%.
    - VM recommendation: ~1.4 cores (0.8 x1.3) and ~1.4 GB memory.
- **As-is assessment**:
    -  Recommends a VM with 4 cores; 8 GB of memory.

[Learn more](concepts-assessment-calculation.md) about how sizing works.

### Creating assessments

Assessments are a point-in-time snapshot of data available in Azure Migrate. 

- Assessments aren't automatically updated with the latest data. To update an assessment with the latest data, you need to rerun it.
- You can create as-is assessments immediately after discovery.
- For performance assessments, we recommend that you wait at least a day after discovery:
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.
    - For performance data, the appliance collects real-time data points every 20 seconds for each performance metrics, and rolls them up to a single five minute data point. The appliance sends the five-minute data point to Azure every hour for assessment calculation.  
- [Learn more](https://docs.microsoft.com/azure/migrate/concepts-collector#what-data-is-collected) about what's collected by the appliance.

## Before you start

Before you begin this tutorial you should deploy the Azure Migrate appliance and start discovery. 


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

    

## Check VMs in the portal

Before you run an assessment, check that the VMs you want to assess appear as expected in the Azure portal:

1. Open the Azure Migrate dashboard
2. In the **Server Assessment Service** page, click the icon that displays the count for the discovered machines. 


## Create an assessment

Create a group and run an assessment as follows:

1. On the Azure Migrate dashboard, click **Create assessment**.
2. Before you start, click **View all** to review the assessment properties.

    ![Assessment properties](./media/tutorial-assess-vmware/assessment-properties.png)

3. Select **Create New** to create a new group. A group gathers together one or more VMs that you want to assess together.
4. Select the machines that you want to add to the group.
5. Click **Create Assessment**, to create the group and the assessment.

    ![Create an assessment](./media/tutorial-assess-vmware/assessment-create.png)

1. After the assessment is created, view it in **Overview** > **Dashboard**.
2. Click **Export assessment**, to download it as an Excel file.
3. Under **Migration goals**, click **Servers**.
4. Under **Assessment tools**, click **+Discover**.

## Review an assessment

An assessment specifies:

- **Azure readiness**: Whether VMs are suitable for migration to Azure.
- **Montly cost estimation**: The estimated monthly compute and storage costs of running VMs in Azure.
- **Monthly storage cost estimation**: Estimated costs for disk storage after migration.

### View an assessment

1. In the Azure Migrate dashboard, under **Manage**, click **Assessments**.
2. Click on an assessment to open it.

![Assessment summary](./media/tutorial-assess-vmware/assessment-summary.png)

### Review readiness
In **Azure readiness**, verify whether VMs are ready for migration to Azure.

1. Review the VM status:
    - Ready: Azure Migrate recommends a VM size and cost estimates for VMs in the assessment.
    - Ready with conditions: Issues and suggested remediation shown.
    - Not ready for Azure: Issues and suggested remediation shown.
    - Readiness unknown: Used when Azure Migrate can't assess readiness, due to data availability issues.

2. Click on a VM to drill down to see source VM settings, and recommended target settings.


### Review monthly cost estimates

This view shows the estimate compute and storage cost of running VMs in Azure.

1. Review the montly compute and storage costs. Costs are aggregated for all VMs in the assessed group.
2. You can view the split between compute and storage.

    - Cost estimates are based on the size recommendations for a machine, and its disks and properties.
    - Estimated monthly costs for compute and storage are 
    - The cost estimation is for running the on-premises VMs as IaaS VMs. Azure Migrate doesn't consider PaaS or SaaS costs. 

### Review monthly storage cost estimates

This view shows aggregated storage costs for the group,  split over different types of storage disks.





### Review confidence rating 

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

## Common assessment issues

There can be a number of issues with assessments.

###  Out-of-sync assessments

If you add or remove machines from a group after you create an assessment, the assessment you created will be marked **out-of-sync**. You need to run the assessment again (**Recalculate**) to reflect the group changes.

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
- [Migrate VMware VMs to Azure](tutorial-server-migration-vmware.md) with Azure Migrate Server Migration



