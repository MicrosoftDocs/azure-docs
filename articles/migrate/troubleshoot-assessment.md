---
title: Troubleshoot assessment and dependency visualization in Azure Migrate
description: Get help with troubleshooting assessment and dependency visualization in Azure Migrate.
ms.service: azure-migrate
ms.topic: troubleshooting
author: musa-57
ms.manager: abhemraj
ms.author: hamusa
ms.date: 01/02/2020
---

# Troubleshoot assessment/dependency visualization

This article helps you troubleshoot issues with assessment and dependency visualization with [Azure Migrate: Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool).


## Assessment readiness issues

Fix assessment readiness issues as follows:

**Issue** | **Fix**
--- | ---
Unsupported boot type | Azure doesn't support VMs with an EFI boot type. We recommend that you convert the boot type to BIOS before you run a migration. <br/><br/>You can use Azure Migrate Server Migration to handle the migration of such VMs. It will convert the boot type of the VM to BIOS during the migration.
Conditionally supported Windows operating system | The operating system has passed its end-of-support date, and needs a Custom Support Agreement (CSA) for [support in Azure](https://aka.ms/WSosstatement). Consider upgrading before you migrate to Azure.
Unsupported Windows operating system | Azure supports only [selected Windows OS versions](https://aka.ms/WSosstatement). Consider upgrading the machine before you migrate to Azure.
Conditionally endorsed Linux OS | Azure endorses only [selected Linux OS versions](../virtual-machines/linux/endorsed-distros.md). Consider upgrading the machine before you migrate to Azure.
Unendorsed Linux OS | The machine might start in Azure, but Azure provides no operating system support. Consider upgrading to an [endorsed Linux version](../virtual-machines/linux/endorsed-distros.md) before you migrate to Azure.
Unknown operating system | The operating system of the VM was specified as "Other" in vCenter Server. This behavior blocks Azure Migrate from verifying the Azure readiness of the VM. Make sure that the operating system is [supported](https://aka.ms/azureoslist) by Azure before you migrate the machine.
Unsupported bit version | VMs with a 32-bit operating systems might boot in Azure, but we recommended that you upgrade to 64-bit before you migrate to Azure.
Requires a Microsoft Visual Studio subscription | The machine is running a Windows client operating system, which is supported only through a Visual Studio subscription.
VM not found for the required storage performance | The storage performance (input/output operations per second [IOPS] and throughput) required for the machine exceeds Azure VM support. Reduce storage requirements for the machine before migration.
VM not found for the required network performance | The network performance (in/out) required for the machine exceeds Azure VM support. Reduce the networking requirements for the machine.
VM not found in the specified location | Use a different target location before migration.
One or more unsuitable disks | One or more disks attached to the VM don't meet Azure requirements.A<br/><br/> Azure Migrate: Server Assessment currently doesn't support Ultra SSD disks, and assesses the disks based on the disk limits for premium managed disks (32 TB).<br/><br/> For each disk attached to the VM, make sure that the size of the disk is < 64 TB (supported by Ultra SSD disks).<br/><br/> If it isn't, reduce the disk size before you migrate to Azure, or use multiple disks in Azure and [stripe them together](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage-performance#disk-striping) to get higher storage limits. Make sure that the performance (IOPS and throughput) needed by each disk is supported by Azure [managed virtual machine disks](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#storage-limits).
One or more unsuitable network adapters. | Remove unused network adapters from the machine before migration.
Disk count exceeds limit | Remove unused disks from the machine before migration.
Disk size exceeds limit | Azure Migrate: Server Assessment currently doesn't support Ultra SSD disks, and assesses the disks based on premium disk limits (32 TB).<br/><br/> However, Azure supports disks with up to 64-TB size (supported by Ultra SSD disks). Shrink disks to less than 64 TB before migration, or use multiple disks in Azure and [stripe them together](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage-performance#disk-striping) to get higher storage limits.
Disk unavailable in the specified location | Make sure the disk is in your target location before you migrate.
Disk unavailable for the specified redundancy | The disk should use the redundancy storage type defined in the assessment settings (LRS by default).
Could not determine disk suitability because of an internal error | Try creating a new assessment for the group.
VM with required cores and memory not found | Azure couldn't find a suitable VM type. Reduce the memory and number of cores of the on-premises machine before you migrate.
Could not determine VM suitability because of an internal error | Try creating a new assessment for the group.
Could not determine suitability for one or more disks because of an internal error | Try creating a new assessment for the group.
Could not determine suitability for one or more network adapters because of an internal error | Try creating a new assessment for the group.
No VM size found for offer currency Reserved Instance | Machine marked Not suitable because the VM size was not found for the selected combination of RI, offer and currency. Edit the assessment properties to choose the valid combinations and recalculate the assessment. 
Conditionally ready Internet Protocol | Only applicable to Azure VMware Solution (AVS) assessments. AVS does not support IPv6 internet addresses factor. Contact the AVS team for remediation guidance if your machine is detected with IPv6.

## Suggested migration tool in import-based AVS assessment marked as unknown

For machines imported via a CSV file, the default migration tool in and AVS assessment is unknown. Though, for VMware machines, its is recommended to use the VMWare Hybrid Cloud Extension (HCX) solution. [Learn More](https://docs.microsoft.com/azure/azure-vmware/hybrid-cloud-extension-installation).

## Linux VMs are "conditionally ready" in an Azure VM assessment

In the case of VMware and Hyper-V VMs, Server Assessment marks Linux VMs as "Conditionally ready" due to a known gap in Server Assessment. 

- The gap prevents it from detecting the minor version of the Linux OS installed on the on-premises VMs.
- For example, for RHEL 6.10, currently Server Assessment detects only RHEL 6 as the OS version. This is because the vCenter Server ar the Hyper-V host do not provide the kernel version for Linux VM operating systems.
-  Because Azure endorses only specific versions of Linux, the Linux VMs are currently marked as conditionally ready in Server Assessment.
- You can determine whether the Linux OS running on the on-premises VM is endorsed in Azure by reviewing [Azure Linux support](https://aka.ms/migrate/selfhost/azureendorseddistros).
-  After you've verified the endorsed distribution, you can ignore this warning.

This gap can be addressed by enabling [application discovery](https://docs.microsoft.com/azure/migrate/how-to-discover-applications) on the VMware VMs. Server Assessment uses the operating system detected from the VM using the guest credentials provided. This operating system data identifies the right OS information in the case of both Windows and Linux VMs.


## Azure SKUs bigger than on-premises in an Azure VM assessment

Azure Migrate Server Assessment might recommend Azure VM SKUs with more cores and memory than current on-premises allocation based on the type of assessment:


- The VM SKU recommendation depends on the assessment properties.
- This is affected by the type of assessment you perform in Server Assessment: *Performance-based*, or *As on-premises*.
- For performance-based assessments, Server Assessment considers the utilization data of the on-premises VMs (CPU, memory, disk, and network utilization) to determine the right target VM SKU for your on-premises VMs. It also adds a comfort factor when determining effective utilization.
- For on-premises sizing, performance data is not considered, and the target SKU is recommended based on-premises allocation.

To show how this can affect recommendations, let's take an example:

We have an on-premises VM with four cores and eight GB of memory, with 50% CPU utilization and 50% memory utilization, and a specified comfort factor of 1.3.

-  If the assessment is **As on-premises**, an Azure VM SKU with four cores and 8 GB of memory is recommended.
- If the assessment is performance-based, based on effective CPU and memory utilization (50% of 4 cores * 1.3 = 2.6 cores and 50% of 8-GB memory * 1.3 = 5.3-GB memory), the cheapest VM SKU of four cores (nearest supported core count) and eight GB of memory (nearest supported memory size) is recommended.
- [Learn more](concepts-assessment-calculation.md#types-of-assessments) about assessment sizing.

## Azure disk SKUs bigger than on-premises in an Azure VM assessment

Azure Migrate Server Assessment might recommend a bigger disk based on the type of assessment.
- Disk sizing in Server Assessment depends on two assessment properties: sizing criteria and storage type.
- If the sizing criteria is **Performance-based**, and the storage type is set to **Automatic**, the IOPS, and throughput values of the disk are considered when identifying the target disk type (Standard HDD, Standard SSD, or Premium). A disk SKU from the disk type is then recommended, and the recommendation considers the size requirements of the on-premises disk.
- If the sizing criteria is **Performance-based**, and the storage type is **Premium**, a premium disk SKU in Azure is recommended based on the IOPS, throughput, and size requirements of the on-premises disk. The same logic is used to perform disk sizing when the sizing criteria is **As on-premises** and the storage type is **Standard HDD**, **Standard SSD**, or **Premium**.

As an example, if you have an on-premises disk with 32 GB of memory, but the aggregated read and write IOPS for the disk is 800 IOPS, Server Assessment recommends a premium disk (because of the higher IOPS requirements), and then recommends a disk SKU that can support the required IOPS and size. The nearest match in this example would be P15 (256 GB, 1100 IOPS). Even though the size required by the on-premises disk was 32 GB, Server Assessment recommends a larger disk because of the high IOPS requirement of the on-premises disk.

## Utilized core/memory percentage missing

Server Assessment reports "PercentageOfCoresUtilizedMissing" or "PercentageOfMemoryUtilizedMissing" when the Azure Migrate appliance can't collect performance data for the relevant on-premises VMs.

- This can occur if the VMs are turned off during the assessment duration. The appliance can't collect performance data for a VM when it's turned off.
- If only the memory counters are missing and you're trying to assess Hyper-V VMs, check whether you have dynamic memory enabled on these VMs. There's a known issue for Hyper-V VMs only, in which an Azure Migrate appliance can't collect memory utilization data for VMs that don't have dynamic memory enabled.
- If any of the performance counters are missing, Azure Migrate Server Assessment falls back to the allocated cores and memory, and it recommends a corresponding VM size.
- If all of the performance counters are missing, ensure the port access requirements for assessment are met. Learn more about the port access requirements for [VMware](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-vmware#port-access), [Hyper-V](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-hyper-v#port-access) and [physical](https://docs.microsoft.com/azure/migrate/migrate-support-matrix-physical#port-access) server assessment.

## Is the operating system license included in an Azure VM assessment?

Azure Migrate Server Assessment currently considers the operating system license cost only for Windows machines. License costs for Linux machines aren't currently considered.

## How does performance-based sizing work in an Azure VM assessment?

Server Assessment continuously collects performance data of on-premises machines and uses it to recommend the VM SKU and disk SKU in Azure. [Learn how](concepts-assessment-calculation.md#calculate-sizing-performance-based) performance-based data is collected.

## Why is my assessment showing a warning that it was created with an invalid combination of Reserved Instances, VM uptime and Discount (%)?
When you select 'Reserved instances', the 'Discount (%)' and 'VM uptime' properties are not applicable. As your assessment was created with an invalid combination of these properties, the edit and recalculate buttons are disabled. Please create a new assessment. [Learn more](https://go.microsoft.com/fwlink/?linkid=2131554).

## I do not see performance data for some network adapters on my physical servers

This can happen if the physical server has Hyper-V virtualization enabled. On these servers, due to a product gap, Azure Migrate currently discovers both the physical and virtual network adapters. The network throughput is captured only on the virtual network adapters discovered.

## Recommended Azure VM SKU for my physical server is oversized

This can happen if the physical server has Hyper-V virtualization enabled. On these servers, Azure Migrate currently discovers both the physical and virtual network adapters. Hence, the no. of network adapters discovered is higher than actual. As Server Assessment picks an Azure VM that can support the required number of network adapters, this can potentially result in an oversized VM. [Learn more](https://docs.microsoft.com/azure/migrate/concepts-assessment-calculation#calculating-sizing) about the impact of no. of network adapters on sizing. This is a product gap that will be addressed going forward.

## Readiness category "Not ready" for my physical server

Readiness category may be incorrectly marked as "Not Ready" in the case of a physical server that has Hyper-V virtualization enabled. On these servers, due to a product gap, Azure Migrate currently discovers both the physical and virtual adapters. Hence, the no. of network adapters discovered is higher than actual. In both as-on-premises and performance-based assessments, Server Assessment picks an Azure VM that can support the required number of network adapters. If the number of network adapters is discovered to be being higher than 32, the maximum no. of NICs supported on Azure VMs, the machine will be marked “Not ready”.  [Learn more](https://docs.microsoft.com/azure/migrate/concepts-assessment-calculation#calculating-sizing) about the impact of no. of NICs on sizing.


## Number of discovered NICs higher than actual for physical servers

This can happen if the physical server has Hyper-V virtualization enabled. On these servers, Azure Migrate currently discovers both the physical and virtual adapters. Hence, the no. of NICs discovered is higher than actual.


## Low confidence rating on physical server assessments
The rating is assigned based on the availability of data points that are needed to compute the assessment. In case of physical servers that have Hyper-V virtualization enabled, there is a known product gap due to which low confidence rating may be incorrectly assigned to physical server assessments. On these servers, Azure Migrate currently discovers both the physical and virtual adapters. The network throughput is captured on the virtual network adapters discovered, but not on the physical network adapters. Due to the absence of data points on the physical network adapters, the confidence rating may be impacted resulting in a low rating. This is a product gap that will be addressed going forward.

## Dependency visualization in Azure Government

Azure Migrate depends on Service Map for the dependency visualization functionality. Because Service Map is currently unavailable in Azure Government, this functionality is not available in Azure Government.

## Dependencies don't show after agent install

After you've installed the dependency visualization agents on on-premises VMs, Azure Migrate typically takes 15-30 minutes to display the dependencies in the portal. If you've waited for more than 30 minutes, make sure that the Microsoft Monitoring Agent (MMA) can connect to the Log Analytics workspace.

For Windows VMs:
1. In the Control Panel, start MMA.
2. In the **Microsoft Monitoring Agent properties** > **Azure Log Analytics (OMS)**, make sure that the **Status** for the workspace is green.
3. If the status isn't green, try removing the workspace and adding it again to MMA.

    ![MMA status](./media/troubleshoot-assessment/mma-properties.png)

For Linux VMs, make sure that the installation commands for MMA and the dependency agent succeeded.

## Supported operating systems

- **MMS agent**: Review the supported [Windows](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems), and [Linux](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems) operating systems.
- **Dependency agent**: the supported [Windows and Linux](../azure-monitor/insights/vminsights-enable-overview.md#supported-operating-systems) operating systems.

## Visualize dependencies for > hour

With agentless dependency analysis, you can visualize dependencies or export them in a map for a duration of up to 30 days.

With agent-based dependency analysis, Although Azure Migrate allows you to go back to a particular date in the last month, the maximum duration for which you can visualize the dependencies is one hour. For example, you can use the time duration functionality in the dependency map to view dependencies for yesterday, but you can view them for a one-hour period only. However, you can use Azure Monitor logs to [query the dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

## Visualized dependencies for > 10 machines

In Azure Migrate Server Assessment, with agent-based dependency analysis, you can [visualize dependencies for groups](https://docs.microsoft.com/azure/migrate/how-to-create-group-dependencies) with up to 10 VMs. For larger groups, we recommend that you split the VMs into smaller groups to visualize dependencies.


## Machines show "Install agent"

After migrating machines with dependency visualization enabled to Azure, machines might show "Install agent" action instead of "View dependencies" due to the following behavior:


- After migration to Azure, on-premises machines are turned off and equivalent VMs are spun up in Azure. These machines acquire a different MAC address.
- Machines might also have a different IP address, based on whether you've retained the on-premises IP address or not.
- If both MAC and IP addresses are different from on-premises, Azure Migrate doesn't associate the on-premises machines with any Service Map dependency data. In this case, it will show the option to install the agent rather than to view dependencies.
- After a test migration to Azure, on-premises machines remain turned on as expected. Equivalent machines spun up in Azure acquire different MAC address and might acquire different IP addresses. Unless you block outgoing Azure Monitor log traffic from these machines, Azure Migrate won't associate the on-premises machines with any Service Map dependency data, and thus will show the option to install agents, rather than to view dependencies.

## Dependencies export CSV shows "Unknown process"
In agentless dependency analysis, the process names are captured on a best-effort basis. In certain scenarios, although the source and destination server names and the destination port are captured, it is not feasible to determine the process names at both ends of the dependency. In such cases, the process is marked as "Unknown process".


## Capture network traffic

Collect network traffic logs as follows:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Press F12 to start Developer Tools. If needed, clear the  **Clear entries on navigation** setting.
3. Select the **Network** tab, and start capturing network traffic:
   - In Chrome, select **Preserve log**. The recording should start automatically. A red circle indicates that traffic is being captured. If the red circle doesn't appear, select the black circle to start.
   - In Microsoft Edge and Internet Explorer, recording should start automatically. If it doesn't, select the green play button.
4. Try to reproduce the error.
5. After you've encountered the error while recording, stop recording, and save a copy of the recorded activity:
   - In Chrome, right-click and select **Save as HAR with content**. This action compresses and exports the logs as a .har file.
   - In Microsoft Edge or Internet Explorer, select the **Export captured traffic** option. This action compresses and exports the log.
6. Select the **Console** tab to check for any warnings or errors. To save the console log:
   - In Chrome, right-click anywhere in the console log. Select **Save as**, to export, and zip the log.
   - In Microsoft Edge or Internet Explorer, right-click the errors and select **Copy all**.
7. Close Developer Tools.


## Where is the operating system data in my assessment discovered from?

- For VMware VMs, by default, it is the operating system data provided by the vCenter. 
   - For VMware linux VMs, if application discovery is enabled, the OS details are fetched from the guest VM. To check which OS details in the assessment, go to the Discovered servers view, and mouse over the value in the "Operating system" column. In the text that pops up, you would be able to see whether the OS data you see is gathered from vCenter server or from the guest VM using the VM credentials. 
   - For Windows VMs, the operating system details are always fetched from the vCenter Server.
- For Hyper-V VMs, the operating system data is gathered from the Hyper-V host
- For physical servers, it is fetched from the server.

## Next steps

[Create](how-to-create-assessment.md) or [customize](how-to-modify-assessment.md) an assessment.
