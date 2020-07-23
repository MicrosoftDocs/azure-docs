---
title: Assess Hyper-V VMs for migration to Azure VMs with Azure Migration Server Assessment 
description: Learn how to assess Hyper-V VMs for migration to Azure VMs with Server Assessment.
ms.topic: how-to
ms.date: 07/21/2020
---

# Assess Hyper-V VMs for migration (to Azure VMs)

This article shows you how to assess on-premises Hyper-V VMs with the[Azure Migrate:Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool) tool, in preparation for migration to Azure VMs.


## What's assessment based on?

The Server Assessment tool uses a lightweight appliance to continuously discover:

- Machine metadata (disks, NICs).
- Performance metadata (CPU, memory utilization, disk IOPS and throughput) if you enable performance-based(concepts-assessment-calculation.md#types-of-assessments) assessment.
- Apps, roles, and features running on the VM, if app-discovery is enabled. 
- Dependencies between VMs, if dependency mapping is enabled.

You can assess this data as follows:

- Run an assessment based on static machine data.
- Run an assessment based on performance data.
- Do agentless or agent-based [dependency visualization](concepts-dependency-visualization.md).
- 
> [!NOTE]
> App discovery is in preview and currently limited to discovery only. You can't yet create assessments based on app data.

## Assessment steps

![Summary of steps](./media/assess-vmware-migrate-azure-vm/process.png)

The Azure Migrate:Server Assessment tool uses the lightweight Azure Migrate appliance for agentless discovery and assessment of VMware VMs. The appliance continuously discovers:

## Step 1: Kick off discovery

Follow the instructions in [this article](discover-vmware.md) to start discovering VMware VMs.

## Step 2: Select an assessment type

Decide whether you want to run an assessment based on static machine metadata that's collected as-is on-premises, or on dynamic performance data.

**Type** | **Details** | **Data**
--- | --- | ---
**As-is on-premises** | Assess based on static machine data.  | Recommended Azure VM size is based on the on-premises VM size<br/><br> The recommended Azure disk type is based on what you select in the storage type setting in the assessment.
**Performance-based** | Assess based on collected dynamic performance data. | Recommended Azure VM size is based on CPU and memory utilization data.<br/><br/> The recommended disk type is based on the IOPS and throughput of the on-premises disks.

To help you decide:

- [Learn about](concepts-azure-vmware-solution-assessment-calculation.md) assessments.
- Review [assessment best practices](best-practices-assessment.md).

## Step 3: Run an assessment

Run an assessment as follows:

1. On the **Servers** tab, in the **Azure Migrate: Server Assessment** tile, select **Assess**.

   ![Location of the Assess button](./media/assess-vmware-migrate-azure-vm/assess.png)

2. In **Assess servers** > **Assessment type**, select **Azure VM**.
3. Select **Machines discovered from Azure Migrate appliance**.
4. Specify a name for the assessment.
5. Click **View all** to review the assessment properties.

    ![Assess servers](./media/assess-vmware-migrate-azure-vm/assess-servers.png)
 

6. In **Assessment properties**, specify the **Target Properties**.
    - In **Target location**, specify the Azure region to which you want to migrate.
        - Size and cost recommendations are based on the location that you specify.
        - In Azure Government, you can target assessments in [these regions](migrate-support-matrix.md#supported-geographies-azure-government)
    - In **Storage type**,
        - If you select to use performance-based data, you can select **Automatic** if you want Azure Migrate to recommend a storage type based on disk IOPS and throughput.
        - Alternatively, select the storage type you want to use for VM when you migrate it.
    - In **Reserved Instances**, specify whether you want to use reserve instances for the VM when you migrate it.
        - If you select to use a reserved instances, you can't specify  '**Discount (%)**, or **VM uptime**. 
        - [Learn more](https://aka.ms/azurereservedinstances).
 7. In **VM Size**, select the following:
 
    - In **Sizing criterion**, select if you want to base the assessment on static metadata, or on performance-based data. If you use performance data:
        - In **Performance history**, indicate the data duration on which you want to base the assessment
        - In **Percentile utilization**, specify the percentile value you want to use for the performance sample. 
    - In **VM Series**, specify the Azure VM series you want to consider. For example, if you don't have a production environment that needs A-series VMs in Azure, you can exclude A-series from the list of series.
    - In **Comfort factor**, indicate the buffer you want to use during assessment. This accounts for issues like seasonal usage, short performance history, and likely increases in future usage. For example:
    **Details** | **Utilization** | **Add comfort factor (2.0)**
    Read IOPS | 100 | 200
    Write IOPS | 100 | 200
    Read throughput | 100 Mbps | 200 Mbps
    Write throughput | 100 Mbps | 200 Mbps
   
8. In **Pricing**:
    - In **Offer**, specify the [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) if you're enrolled. Server Assessment estimates the cost for that offer.
    - In **Currency**, select the billing currency for your account.
    - In **Discount (%)**, add any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
    - In **VM Uptime**, specify the duration (days per month/hour per day) that VMs will run.
        - This is useful for Azure VMs that won't run continuously.
        - Cost estimates are based on the duration specified.
        - Default is 31 days per month/24 hours per day.

    - In **EA Subscription**, specify whether to take an Enterprise Agreement (EA) subscription discount into account for cost estimation. 
    - In **Azure Hybrid Benefit**, specify whether you whether you have software assurance, and are eligible for [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If you do, Azure prices for operating systems other than Windows are considered for Windows VMs.


9. Click **Save** if you make changes.

    ![Assessment properties](./media/assess-vmware-migrate-azure-vm/assessment-properties.png)

10. In **Assess Servers**, click **Next**.
11. In **Assess Servers** > **Select machines to assess**, to create a new group of servers for assessment, select **Create New**, and specify a group name. 
12. Select the appliance, and select the VMs you want to add to the group. Then click **Next**.

     ![Add VMs to a group](./media/assess-vmware-migrate-azure-vm/assess-group.png)

13. In **Review + create assessment** , review the assessment details, and click **Create Assessment** to create the group and run the assessment.

    ![Create an assessment](./media/assess-vmware-migrate-azure-vm/create-assessment.png)

    > [!NOTE]
    > For performance-based assessments, we recommend that you wait at least a day after starting discovery before you create an assessment. This provides time to collect performance data with higher confidence.

## Step 4: Review an assessment

An assessment describes:

- **Azure readiness**: Whether VMs are suitable for migration to Azure.
- **Monthly cost estimation**: The estimated monthly compute and storage costs for running the VMs in Azure.
- **Monthly storage cost estimation**: Estimated costs for disk storage after migration.

To view an assessment:

1. In **Migration goals** > **Servers**, select **Assessments** in **Azure Migrate: Server Assessment**.
2. In **Assessments**, select an assessment to open it.

    ![Assessment summary](./media/assess-vmware-migrate-azure-vm/assessment-summary.png)

    - To export the assessment to Excel or review, click **Export assessment**.
    - To modify the assessment settings, click **Edit properties**.
    - To run the assessment again, click **Recalculate**.
 
### Review readiness

1. In **Azure readiness**, verify whether VMs are ready for migration to Azure.
2. Review the VM status:
    - **Ready for Azure**: Used when Azure Migrate recommends a VM size and cost estimates, for VMs in the assessment.
    - **Ready with conditions**: Shows issues and suggested remediation.
    - **Not ready for Azure**: Shows issues and suggested remediation.
    - **Readiness unknown**: Used when Azure Migrate can't assess readiness, because of data availability issues.

3. Select an **Azure readiness** status. You can view VM readiness details. You can also drill down to see VM details, including compute, storage, and network settings.

### Review cost estimates

The assessment summary shows the estimated compute and storage cost of running VMs in Azure. 

1. Review the monthly total costs. Costs are aggregated for all VMs in the assessed group.

    - Cost estimates are based on the size recommendations for a machine, its disks, and its properties.
    - Estimated monthly costs for compute and storage are shown.
    - The cost estimation is for running the on-premises VMs on Azure VMs. The estimation doesn't consider PaaS or SaaS costs.

2. Review monthly storage costs. The view shows the aggregated storage costs for the assessed group, split over different types of storage disks. 
3. You can drill down to see cost details for specific VMs.

### Review confidence rating

Server Assessment assigns a confidence rating to performance-based assessments. Rating is from one star (lowest) to five stars (highest).

![Confidence rating](./media/assess-vmware-migrate-azure-vm/confidence-rating.png)

The confidence rating helps you estimate the reliability of  size recommendations in the assessment. The rating is based on the availability of data points needed to compute the assessment.

Confidence ratings are as follows.

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 star
21%-40% | 2 stars
41%-60% | 3 stars
61%-80% | 4 stars
81%-100% | 5 stars

[Learn more](concepts-assessment-calculation.md#confidence-ratings-performance-based) about confidence ratings.

## Next steps

- [Learn about](concepts-dependency-visualization.md) analyzing VM dependencies.
- Set up [agentless](how-to-create-group-machine-dependencies-agentless.md) or [agent-based](how-to-create-group-machine-dependencies.md) dependency mapping.