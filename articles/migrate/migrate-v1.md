---
title: Work with Azure Migrate v1 | Microsoft Docs
description: Provides a summary for working with the old version of Azure Migrate
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: overview
ms.date: 07/11/2019
ms.author: raynew
ms.custom: mvc
---


# Work with Azure Migrate v1

This article provides information about working with Azure Migrate v1


There are two versions of the Azure Migrate service:

- **Current version**: Use this version to create Azure Migrate projects, discover on-premises machines, and orchestrate assessments and migrations. [Learn more](whats-new.md) about what's new in this version.
- **Previous version (v1)**: If you were using the previous version of Azure Migrate (only assessment of on-premises VMware VMs was supported), you should now use the current version. If you still need to use Azure Migrate projects you previously created with v1, this is what you can and can't do:
    - You can no longer create Azure Migrate projects using v1.
    - You can't perform new discoveries with v1.
    - You can still access existing projects.
    - You can still run assessments on previously discovered VMware VMs.



## Find v1 projects

Find v1 projects as follows:

1. In the Azure portal > **All services**, search for and select **Azure Migrate**. 
2. On the Azure Migrate dashboard, there's a notification and a link to access old Azure Migrate projects.
3. Click the link to open v1 projects.


## Create an assessment

After VMs are discovered in the portal, you group them and create assessments.

- You can immediately create as on-premises assessments immediately after VMs are discovered in the portal.
- For performance-based assessments, we recommend you wait at least a day before creating a performance-based assessment, to get reliable size recommendations.

Create an assessment as follows:

1. In the project **Overview** page, click **+Create assessment**.
2. Click **View all** to review the assessment properties.
3. Create the group, and specify a group name.
4. Select the machines that you want to add to the group.
5. Click **Create Assessment**, to create the group and the assessment.
6. After the assessment is created, view it in **Overview** > **Dashboard**.
7. Click **Export assessment**, to download it as an Excel file.

If you would like to update an existing assessment with the latest performance data, you can use the **Recalculate** command on the assessment to update it.

## Review an assessment 

An assessment has three stages:

- An assessment starts with a suitability analysis to figure out whether machines are compatible in Azure.
- Sizing estimations.
- Monthly cost estimation.

A machine only moves along to a later stage if it passes the previous one. For example, if a machine fails the suitability check, it’s marked as unsuitable for Azure, and sizing and costing isn't done.


### Review Azure readiness

The Azure readiness view in the assessment shows the readiness status of each VM.

**Readiness** | **State** | **Details**
--- | --- | ---
Ready for Azure | No compatibility issues. The machine can be migrated as-is to Azure, and it will boot in Azure will full Azure support. | For VMs that are ready, Azure Migrate recommends a VM size in Azure.
Conditionally ready for Azure | The machine might boot in Azure, but might not have full Azure support. For example, a machine with an older version of Windows Server that isn't supported in Azure. | Azure Migrate explains the readiness issues, and provides remediation steps.
Not ready for Azure |  The VM won't boot in Azure. For example, if a VM has a disk that's more than 4 TB, it can't be hosted on Azure. | Azure Migrate explains the readiness issues, and provides remediation steps.
Readiness unknown | Azure Migrate can't identify Azure readiness, usually because data isn't available.


#### Azure VM properties
Readiness takes into account a number of VM properties, to identify whether  the VM can run in Azure.


**Property** | **Details** | **Readiness**
--- | --- | ---
**Boot type** | BIOS supported. UEFI not supported. | Conditionally ready if boot type is UEFI.
**Cores** | Machines core <= the maximum number of cores (128) supported for an Azure VM.<br/><br/> If performance history is available, Azure Migrate considers the utilized cores.<br/>If a <br/>comfort factor is specified in the assessment settings, the number of utilized cores is multiplied by the comfort factor.<br/><br/> If there's no performance history, Azure Migrate uses the allocated cores, without applying the comfort factor. | Ready if less than or equal to limits.
**Memory** | The machine memory size <= the maximum memory (3892 GB on Azure M series Standard_M128m&nbsp;<sup>2</sup>) for an Azure VM. [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).<br/><br/> If performance history is available, Azure Migrate considers the utilized memory.<br/><br/>If a comfort factor is specified, the utilized memory is multiplied by the comfort factor.<br/><br/> If there's no history the allocated  memory is used, without applying the comfort factor.<br/><br/> | Ready if within limits.
**Storage disk** | Allocated size of a disk must be 4 TB (4096 GB) or less.<br/><br/> The number of disks attached to the machine must be 65 or less, including the OS disk. | Ready if within limits.
**Networking** | A machine must have 32 or less NICs attached to it. | Ready if within limits.

#### Guest operating system

Along with VM properties, Azure Migrate also looks at the guest OS of the on-premises VM to identify if the VM can run in Azure.

- Azure Migrate considers the OS specified in vCenter Server.
- Since the discovery done by Azure Migrate is appliance-based, it does not have a way to verify if the OS running inside the VM is same as the one specified in vCenter Server.

The following logic is used.

**Operating System** | **Details** | **Readiness**
--- | --- | ---
Windows Server 2016 and all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 R2 and all SPs | Azure provides full support. | Ready for Azure
Windows Server 2012 and all SPs | Azure provides full support. | Ready for Azure
Windows Server 2008 R2 and all SPs | Azure provides full support.| Ready for Azure
Windows Server 2008 (32-bit and 64-bit) | Azure provides full support. | Ready for Azure
Windows Server 2003, 2003 R2 | Out-of-support and need a [Custom Support Agreement (CSA)](https://aka.ms/WSosstatement) for support in Azure. | Conditionally ready for Azure, consider upgrading the OS before migrating to Azure.
Windows 2000, 98, 95, NT, 3.1, MS-DOS | Out-of-support. The machine might boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to upgrade the OS before migrating to Azure.
Windows Client 7, 8 and 10 | Azure provides support with [Visual Studio subscription only.](https://docs.microsoft.com/azure/virtual-machines/windows/client-images) | Conditionally ready for Azure
Windows 10 Pro Desktop | Azure provides support with [Multitenant Hosting Rights.](https://docs.microsoft.com/azure/virtual-machines/windows/windows-desktop-multitenant-hosting-deployment) | Conditionally ready for Azure
Windows Vista, XP Professional | Out-of-support. The machine might boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to upgrade the OS before migrating to Azure.
Linux | Azure endorses these [Linux operating systems](../virtual-machines/linux/endorsed-distros.md). Other Linux operating systems might boot in Azure, but we recommend upgrading the OS to an endorsed version, before migrating to Azure. | Ready for Azure if the version is endorsed.<br/><br/>Conditionally ready if the version is not endorsed.
Other operating systems<br/><br/> For example,  Oracle Solaris, Apple Mac OS etc., FreeBSD, etc. | Azure doesn't endorse these operating systems. The machine may boot in Azure, but no OS support is provided by Azure. | Conditionally ready for Azure, it is recommended to install a supported OS before migrating to Azure.  
OS specified as **Other** in vCenter Server | Azure Migrate cannot identify the OS in this case. | Unknown readiness. Ensure that the OS running inside the VM is supported in Azure.
32-bit operating systems | The machine may boot in Azure, but Azure may not provide full support. | Conditionally ready for Azure, consider upgrading the OS of the machine from 32-bit OS to 64-bit OS before migrating to Azure.


### Review sizing

 The Azure Migrate size recommendation depends on the sizing criterion specified in the assessment properties.

- If sizing is performance-based, the size recommendation considers the performance history of the VMs (CPU and memory) and disks (IOPS and throughput).
- If the sizing criterion is 'as on-premises', the size recommendation in Azure is based on the size of the VM on-premises. Disk sizing is based on the Storage type specified in the assessment properties (default is premium disks). Azure Migrate doesn't consider the performance data for the VM and disks.

### Review cost estimates

Cost estimates show the total compute and storage cost of running the VMs in Azure, along with the details for each machine.

- Cost estimates are calculated using the size recommendation for a VM machine, and its disks, and the assessment properties.
- Estimated monthly costs for compute and storage are aggregated for all VMs in the group.
- The cost estimation is for running the on-premises VM as Azure Infrastructure as a service (IaaS) VMs. Azure Migrate doesn't consider Platform as a service (PaaS), or Software as a service (SaaS) costs.

### Review confidence rating (performance-based assessment)

Each performance-based assessment is associated with a confidence rating.

- A confidence rating ranges from one-star to five-star (one-start being the lowest and five-start the highest).
- The confidence rating is assigned to an assessment, based on the availability of data points needed to compute the assessment.
- The confidence rating of an assessment helps you estimate the reliability of the size recommendations provided by Azure Migrate.
- Confidence rating isn't available for "as-is" on-premises assessments.

For performance-based sizing, Azure Migrate needs the following:
- Utilization data for CPU.
- VM memory data.
- For every disk attached to the VM, it needs the disk IOPS and throughput data.
- For each network adapter attached to a VM, Azure Migrate needs the network input/output.
- If any of the above aren't available, size recommendations (and thus confidence ratings) might not be reliable.


Depending on the percentage of data points available, the possible confidence ratings are summarized in the table.

**Availability of data points** | **Confidence rating**
--- | ---
0%-20% | 1 Star
21%-40% | 2 Star
41%-60% | 3 Star
61%-80% | 4 Star
81%-100% | 5 Star


#### Assessment issues affecting confidence ratings

An assessment might not have all the data points available due to a number of reasons:

- You didn't profile your environment for the duration of the assessment. For example, if you create the assessment with performance duration set to one day, you must wait for at least a day after you start the discovery, or all the data points to be collected.
- Some VMs were shut down during the period for which the assessment was calculated. If any VMs were powered off for part of the duration, Azure Migrate can't collect performance data for that period.
- Some VMs were created in between during the assessment calculation period. For example, if you create an assessment using the last month's performance history, but create a number of VMs in the environment a week ago, the performance history of the new VMs won't be for the entire duration.

> [!NOTE]
> If the confidence rating of any assessment is below five-stars, wait for at least a day for the appliance to profile the environment, and then recalculate the assessment. If you don't performance-based sizing might not be reliable. If you don't want to recalculate, we recommended switching to as on-premises sizing, by changing the assessment properties.



## Next steps

- [Learn about](migrate-services-overview.md) the latest version of Azure Migrate.
