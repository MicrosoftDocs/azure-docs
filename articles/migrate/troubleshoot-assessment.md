---
title: Troubleshoot assessments in Azure Migrate
description: Get help with assessment in Azure Migrate.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: troubleshooting
ms.service: azure-migrate
ms.date: 01/17/2023
ms.custom: engagement-fy23
---

# Troubleshoot assessment

This article helps you troubleshoot issues with assessment and dependency visualization with [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool).

## Common assessment errors

Assessment service uses the [configuration data](discovered-metadata.md) and the [performance data](concepts-assessment-calculation.md#how-does-the-appliance-calculate-performance-data) for calculating the assessments. The data is fetched by the Azure Migrate appliance at specific intervals in case of appliance-based discovery and assessments.
The following table summarizes the errors encountered while fetching the data by the assessment service. 

**Error** | **Cause** | **Action**
--- | --- | ---
60001:UnableToConnectToPhysicalServer | Either the prerequisites to connect to the server have not been met or there are network issues in connecting to the server, for instance some proxy settings. | - Ensure that the server meets the prerequisites and port access requirements. <br/><br/> - Add the IP addresses of the remote machines (discovered servers) to the WinRM TrustedHosts list on the Azure Migrate appliance and retry the operation. This is to allow remote inbound connections on servers: *Windows: WinRM port 5985 (HTTP) and Linux: SSH port 22 (TCP)*. <br/><br/> - Ensure that you have chosen the correct authentication method on the appliance to connect to the server. <br/><br/> - If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).
60002: InvalidServerCredentials | Unable to connect to server due to incorrect credentials on the appliance, or the credentials previously provided have expired or the server credentials have changed. | - Ensure that you have provided the correct credentials for the server on the appliance. You can check that by trying to connect to the server using those credentials. <br/><br/> - If the credentials added are incorrect or have expired, edit the credentials on the appliance and revalidate the added servers. If the validation succeeds, the issue is resolved. <br/><br/> - If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).
60004: NoPerfDataAvailableForServers | The appliance is unable to fetch the required performance data from the server due to network issues or the credentials provided on the appliance do not have enough permissions to fetch the metadata. | - Ensure that the server is accessible from the appliance. <br/><br/> - Ensure that the guest credentials provided on the appliance have [required permissions](migrate-support-matrix-physical.md#physical-server-requirements). <br/><br/> - If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).
60005: SSHOperationTimeout | The operation took longer than expected either due to network latency issues or due to the lack of latest updates on Linux server.| - Ensure that the impacted server has the latest kernel and OS updates installed. <br/><br/> - Ensure that there is no network latency between the appliance and the server. It is recommended to have the appliance and source server on the same domain to avoid latency issues.<br/><br/> - Connect to the impacted server from the appliance and run the commands documented here to check if they return null or empty data. <br/><br/> - If the issue persists, submit a Microsoft support case providing the appliance machine ID (available in the footer of the appliance configuration manager).
60006: ServerAccessDenied | The operation could not be completed due to forbidden access on the server. The guest credentials provided do not have enough permissions to access the servers. | 
60011: ServerWindowsWMICallFailed | WMI call failed due to WMI service failure. This might be a transient error, if the server is unreachable due to network issue or in case of physical sever the server might be switched off. | - Please ensure WinRM is running and the server is reachable from the appliance VM. <br/><br/> - Ensure that the server is switched on.<br/><br/> - For troubleshooting with physical servers, follow the [instructions](migrate-support-matrix-physical.md#physical-server-requirements).<br/><br/> - If the issue persists, submit a Microsoft support case providing the appliance machine ID (available in the footer of the appliance configuration manager).
10004: CredentialNotProvidedForGuestOSType | The credentials for the server OS type weren't added on the appliance. | - Ensure that you add the credentials for the OS type of the affected server on the appliance.<br/><br/> - You can now add multiple server credentials on the appliance.
751: Unable to connect to Server | Unable to connect to the server due to connectivity issues. | Resolve the connectivity issue mentioned in the error message.
754: Performance Data not available | Azure Migrate is unable to collect performance data if the vCentre is not configured to give out the performance data | Configure the statistics level on VCentre server to 3 to make the performance data available. Wait for a day before running the assessment for the data to populate. 
757: Virtual Machine not found | The Azure Migrate service is unable to locate the specified virtual machine. This may occur if the virtual machine has been deleted by the administrator on the VMware environment.| Please verify that the virtual machine still exists in the VMware environment.
758: Request timeout while fetching Performance data | Azure Migrate assessment service is unable to retrieve performance data. This could happen if the vCenter server is not reachable. | - Please verify the vCenter server credentials are correct.<br/><br/> - Ensure that the server is reachable before attempting to retrieve performance data again.<br/><br/> - If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).
760: Unable to get Performance counters | Azure Migrate assessment service is unable to retrieve performance counters. This can happen due to multiple reasons. Check the error message to find the exact reason.| - Ensure that you resolve the error flagged in the error message.<br/><br/> - If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).
8002: Virtual Machine could not be found  | Azure Migrate discovery service could not find the virtual machine. This could happen if the virtual machine is deleted or its UUID has changed. | - Ensure that the on-premises virtual machine exists and then restart the job. <br/><br/> - If the issue persists, submit a Microsoft support case, providing the appliance machine ID (available in the footer of the appliance configuration manager).
9003: Operating system type running on the server isn't supported. | The operating system running on the server isn't Windows or Linux. | Only Windows and Linux OS types are supported. If the server is running Windows or Linux OS, check the operating system type specified in vCenter Server.
9004: Server isn't in a running state. | The server is in a powered-off state. | Ensure that the server is in a running state.
9010: The server is powered off. | The server is in a powered-off state. | Ensure that the server is in a running state.
9014: Unable to retrieve the file containing the discovered metadata because of an error encountered on the ESXi host | The error details will be mentioned with the error.| Ensure that port 443 is open on the ESXi host on which the server is running. Learn more on how to remediate the issue.
9015: The vCenter Server user account provided for server discovery doesn't have guest operations privileges enabled. | The required privileges of guest operations haven't been enabled on the vCenter Server user account. | Ensure that the vCenter Server user account has privileges enabled for **Virtual Machines** > **Guest Operations** to interact with the server and pull the required data. [Learn more](troubleshoot-discovery.md#error-9014-httpgetrequesttoretrievefilefailed) on how to set up the vCenter Server account with required privileges.
9022: The access is denied to run the Get-WmiObject cmdlet on the server. | The role associated with the credentials provided on the appliance or a group policy on-premises is restricting access to the WMI object. You encounter this issue when you try the following credentials on the server: `FriendlyNameOfCredentials`. | Check if the credentials provided on the appliance have created file administrator privileges and have WMI enabled.<br/><br/> If the credentials on the appliance don't have the required permissions, either provide another set of credentials or edit an existing one. (Find the friendly name of the credentials tried by Azure Migrate in the possible causes.) <br/><br/> [Learn more](tutorial-discover-vmware.md#prepare-vmware) on how to remediate the issue.


## Azure VM assessment readiness issues

This table lists help for fixing the following assessment readiness issues.

**Issue** | **Fix**
--- | ---
Unsupported boot type | Azure does not support UEFI boot type for VMs with the Windows Server 2003/Windows Server 2003 R2/Windows Server 2008/Windows Server 2008 R2 operating systems. Check the list of operating systems that support UEFI-based machines [here](./common-questions-server-migration.md#which-operating-systems-are-supported-for-migration-of-uefi-based-machines-to-azure).
Conditionally supported Windows operating system | The operating system has passed its end-of-support date and needs a Custom Support Agreement for [support in Azure](/troubleshoot/azure/virtual-machines/server-software-support). Consider upgrading before you migrate to Azure. Review information about [preparing servers running Windows Server 2003](prepare-windows-server-2003-migration.md) for migration to Azure.
Unsupported Windows operating system | Azure supports only [selected Windows OS versions](/troubleshoot/azure/virtual-machines/server-software-support). Consider upgrading the server before you migrate to Azure.
Conditionally endorsed Linux OS | Azure endorses only [selected Linux OS versions](../virtual-machines/linux/endorsed-distros.md). Consider upgrading the server before you migrate to Azure. [Learn more](#linux-vms-are-conditionally-ready-in-an-azure-vm-assessment).
Unendorsed Linux OS | The server might start in Azure, but Azure provides no operating system support. Consider upgrading to an [endorsed Linux version](../virtual-machines/linux/endorsed-distros.md) before you migrate to Azure.
Unknown operating system | The operating system of the VM was specified as **Other** in vCenter Server or could not be identified as a known OS in Azure Migrate. This behavior blocks Azure Migrate from verifying the Azure readiness of the VM. Ensure that the operating system is [supported](./migrate-support-matrix-vmware-migration.md#azure-vm-requirements) by Azure before you migrate the server.
Unsupported bit version | VMs with a 32-bit operating system might boot in Azure, but we recommend that you upgrade to 64-bit before you migrate to Azure.
Requires a Microsoft Visual Studio subscription | The server is running a Windows client operating system, which is supported only through a Visual Studio subscription.
VM not found for the required storage performance | The storage performance (input/output operations per second (IOPS) and throughput) required for the server exceeds Azure VM support. Reduce storage requirements for the server before migration.
VM not found for the required network performance | The network performance (in/out) required for the server exceeds Azure VM support. Reduce the networking requirements for the server.
VM not found in the specified location | Use a different target location before migration.
One or more unsuitable disks | One or more disks attached to the VM don't meet Azure requirements.<br><br> Azure Migrate: Discovery and assessment assesses the disks based on the disk limits for Ultra disks (64 TB).<br><br> For each disk attached to the VM, make sure that the size of the disk is < 64 TB (supported by Ultra SSD disks).<br><br> If it isn't, reduce the disk size before you migrate to Azure, or use multiple disks in Azure and [stripe them together](../virtual-machines/premium-storage-performance.md#disk-striping) to get higher storage limits. Make sure that the performance (IOPS and throughput) needed by each disk is supported by [Azure managed virtual machine disks](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-storage-limits).
One or more unsuitable network adapters | Remove unused network adapters from the server before migration.
Disk count exceeds limit | Remove unused disks from the server before migration.
Disk size exceeds limit | Azure Migrate: Discovery and assessment supports disks with up to 64 TB size (Ultra disks). Shrink disks to less than 64 TB before migration, or use multiple disks in Azure and [stripe them together](../virtual-machines/premium-storage-performance.md#disk-striping) to get higher storage limits.
Disk unavailable in the specified location | Make sure the disk is in your target location before you migrate.
Disk unavailable for the specified redundancy | The disk should use the redundancy storage type defined in the assessment settings (LRS by default).
Couldn't determine disk suitability because of an internal error | Try creating a new assessment for the group.
VM with required cores and memory not found | Azure couldn't find a suitable VM type. Reduce the memory and number of cores of the on-premises server before you migrate.
Couldn't determine VM suitability because of an internal error | Try creating a new assessment for the group.
Couldn't determine suitability for one or more disks because of an internal error | Try creating a new assessment for the group.
Couldn't determine suitability for one or more network adapters because of an internal error | Try creating a new assessment for the group.
No VM size found for offer currency Reserved Instance (RI) | Server marked **not suitable** because the VM size wasn't found for the selected combination of RI, offer, and currency. Edit the assessment properties to choose the valid combinations and recalculate the assessment. 

## Azure VMware Solution (AVS) assessment readiness issues

This table lists help for fixing the following assessment readiness issues.

**Issue** | **Fix**
--- | ---
Unsupported IPv6 | Only applicable to Azure VMware Solution assessments. Azure VMware Solution doesn't support IPv6 internet addresses. Contact the Azure VMware Solution team for remediation guidance if your server is detected with IPv6.
Unsupported OS | Support for certain Operating System versions has been deprecated by VMware and the assessment recommends you to upgrade the operating system before migrating to Azure VMware Solution. [Learn more](https://www.vmware.com/resources/compatibility/search.php?deviceCategory=software).


## Suggested migration tool in an import-based Azure VMware Solution assessment is unknown

For servers imported via a CSV file, the default migration tool in an Azure VMware Solution assessment is unknown. For servers in a VMware environment, use the VMware Hybrid Cloud Extension (HCX) solution. [Learn more](../azure-vmware/configure-vmware-hcx.md).

## Linux VMs are "conditionally ready" in an Azure VM assessment

In the case of VMware and Hyper-V VMs, an Azure VM assessment marks Linux VMs as **conditionally ready** because of a known gap. 

- The gap prevents it from detecting the minor version of the Linux OS installed on the on-premises VMs.
- For example, for RHEL 6.10, currently an Azure VM assessment detects only RHEL 6 as the OS version. This behavior occurs because the vCenter Server and the Hyper-V host don't provide the kernel version for Linux VM operating systems.
- Since Azure endorses only specific versions of Linux, the Linux VMs are currently marked as **conditionally ready** in an Azure VM assessment.
- You can determine whether the Linux OS running on the on-premises VM is endorsed in Azure by reviewing [Azure Linux support](../virtual-machines/linux/endorsed-distros.md).
- After you've verified the endorsed distribution, you can ignore this warning.

This gap can be addressed by enabling [application discovery](./how-to-discover-applications.md) on the VMware VMs. An Azure VM assessment uses the operating system detected from the VM by using the guest credentials provided. This Operating System data identifies the right OS information in the case of both Windows and Linux VMs.

## Operating system version not available

For physical servers, the operating system minor version information should be available. If it isn't available, contact Microsoft Support. For servers in a VMware environment, Azure Migrate uses the operating system information specified for the VM in the vCenter Server. But vCenter Server doesn't provide the minor version for operating systems. To discover the minor version, set up [application discovery](./how-to-discover-applications.md). For Hyper-V VMs, operating system minor version discovery isn't supported. 

## Azure SKUs bigger than on-premises in an Azure VM assessment

An Azure VM assessment might recommend Azure VM SKUs with more cores and memory than the current on-premises allocation based on the type of assessment:

- The VM SKU recommendation depends on the assessment properties.
- The recommendation is affected by the type of assessment you perform in an Azure VM assessment. The two types are **Performance-based** or **As on-premises**.
- For performance-based assessments, the Azure VM assessment considers the utilization data of the on-premises VMs (CPU, memory, disk, and network utilization) to determine the right target VM SKU for your on-premises VMs. It also adds a comfort factor when determining effective utilization.
- For on-premises sizing, performance data isn't considered, and the target SKU is recommended based on on-premises allocation.

Let's look at an example recommendation:

We have an on-premises VM with 4 cores and 8 GB of memory, with 50% CPU utilization and 50% memory utilization, and a specified comfort factor of 1.3.

- If the assessment is **As on-premises**, an Azure VM SKU with 4 cores and 8 GB of memory is recommended.
- If the assessment is **Performance-based**, based on effective CPU and memory utilization (50% of 4 cores * 1.3 = 2.6 cores and 50% of 8 GB memory * 1.3 = 5.2 GB memory), the cheapest VM SKU of 4 cores (nearest supported core count) and 8 GB of memory (nearest supported memory size) is recommended.
- [Learn more](concepts-assessment-calculation.md#types-of-assessments) about assessment sizing.

## Why is the recommended Azure disk SKU bigger than on-premises in an Azure VM assessment?

Azure VM assessment might recommend a bigger disk based on the type of assessment:

- Disk sizing depends on two assessment properties: sizing criteria and storage type.
- If the sizing criteria is **Performance-based** and the storage type is set to **Automatic**, the IOPS and throughput values of the disk are considered when identifying the target disk type (Standard HDD, Standard SSD, Premium, or Ultra disk). A disk SKU from the disk type is then recommended, and the recommendation considers the size requirements of the on-premises disk.
- If the sizing criteria is **Performance-based** and the storage type is **Premium**, a premium disk SKU in Azure is recommended based on the IOPS, throughput, and size requirements of the on-premises disk. The same logic is used to perform disk sizing when the sizing criteria is **As on-premises** and the storage type is **Standard HDD**, **Standard SSD**, **Premium**, or **Ultra disk**.

For example, say you have an on-premises disk with 32 GB of memory, but the aggregated read and write IOPS for the disk is 800 IOPS. The Azure VM assessment recommends a premium disk because of the higher IOPS requirements. It also recommends a disk SKU that can support the required IOPS and size. The nearest match in this example would be P15 (256 GB, 1100 IOPS). Even though the size required by the on-premises disk was 32 GB, the Azure VM assessment recommended a larger disk because of the high IOPS requirement of the on-premises disk.

## Why is performance data missing for some or all VMs in my assessment report?

For **Performance-based** assessment, the assessment report export says 'PercentageOfCoresUtilizedMissing' or 'PercentageOfMemoryUtilizedMissing' when the Azure Migrate appliance can't collect performance data for the on-premises VMs. Make sure to check:

- If the VMs are powered on for the duration for which you're creating the assessment.
- If only memory counters are missing and you're trying to assess Hyper-V VMs, check if you have dynamic memory enabled on these VMs. Because of a known issue, currently the Azure Migrate appliance can't collect memory utilization for such VMs.
- If all of the performance counters are missing, ensure the port access requirements for assessment are met. Learn more about the port access requirements for [VMware](./migrate-support-matrix-vmware.md#port-access-requirements), [Hyper-V](./migrate-support-matrix-hyper-v.md#port-access), and [physical](./migrate-support-matrix-physical.md#port-access) assessments.
If any of the performance counters are missing, Azure Migrate: Discovery and assessment falls back to the allocated cores/memory on-premises and recommends a VM size accordingly.

## Why is performance data missing for some or all servers in my Azure VM or Azure VMware Solution assessment report?

For **Performance-based** assessment, the assessment report export says **PercentageOfCoresUtilizedMissing** or **PercentageOfMemoryUtilizedMissing** when the Azure Migrate appliance can't collect performance data for the on-premises servers. Make sure to check:

- If the servers are powered on for the duration for which you're creating the assessment.
- If only memory counters are missing and you're trying to assess servers in a Hyper-V environment. In this scenario, enable dynamic memory on the servers and recalculate the assessment to reflect the latest changes. The appliance can collect memory utilization values for servers in a Hyper-V environment only when the server has dynamic memory enabled.
- If all of the performance counters are missing, ensure that outbound connections on ports 443 (HTTPS) are allowed.

    > [!Note]
    > If any of the performance counters are missing, Azure Migrate: Discovery and assessment falls back to the allocated cores/memory on-premises and recommends a VM size accordingly.

## Why is performance data missing for some or all SQL instances or databases in my Azure SQL assessment?

To ensure performance data is collected, make sure to check:

- If the SQL servers are powered on for the duration for which you're creating the assessment.
- If the connection status of the SQL agent in Azure Migrate is **Connected**, and also check the last heartbeat. 
- If the Azure Migrate connection status for all SQL instances is **Connected** in the discovered SQL instance pane.
- If all of the performance counters are missing, ensure that outbound connections on port 443 (HTTPS) are allowed.

If any of the performance counters are missing, the Azure SQL assessment recommends the smallest Azure SQL configuration for that instance or database.

## Why is the confidence rating of my assessment low?

The confidence rating is calculated for **Performance-based** assessments based on the percentage of [available data points](./concepts-assessment-calculation.md#ratings) needed to compute the assessment. An assessment could get a low confidence rating for the following reasons:

- You didn't profile your environment for the duration for which you're creating the assessment. For example, if you're creating an assessment with performance duration set to one week, you need to wait for at least a week after you start the discovery for all the data points to get collected. If you can't wait for the duration, change the performance duration to a shorter period and recalculate the assessment.
- The assessment isn't able to collect the performance data for some or all the servers in the assessment period. For a high confidence rating, ensure that: 
    - Servers are powered on for the duration of the assessment.
    - Outbound connections on ports 443 are allowed.
    - For Hyper-V Servers, dynamic memory is enabled.
    - The connection status of agents in Azure Migrate is **Connected**. Also check the last heartbeat.
    - For Azure SQL assessments, Azure Migrate connection status for all SQL instances is **Connected** in the discovered SQL instance pane.

    Recalculate the assessment to reflect the latest changes in confidence rating.

- For Azure VM and Azure VMware Solution assessments, few servers were created after discovery had started. For example, say you're creating an assessment for the performance history of the past month, but a few servers were created in the environment only a week ago. In this case, the performance data for the new servers won't be available for the entire duration and the confidence rating would be low. [Learn more](./concepts-assessment-calculation.md#confidence-ratings-performance-based).
- For Azure SQL assessments, few SQL instances or databases were created after discovery had started. For example, say you're creating an assessment for the performance history of the past month, but a few SQL instances or databases were created in the environment only a week ago. In this case, the performance data for the new servers won't be available for the entire duration and the confidence rating would be low. [Learn more](./concepts-azure-sql-assessment-calculation.md#confidence-ratings).

## Why is my RAM utilization greater than 100%?

By design, in Hyper-V if maximum memory provisioned is less than what is required by the VM, the assessment will show memory utilization to be more than 100%.

## Is the operating system license included in an Azure VM assessment?

An Azure VM assessment currently considers the operating system license cost only for Windows servers. License costs for Linux servers aren't currently considered.

## How does performance-based sizing work in an Azure VM assessment?

An Azure VM assessment continuously collects performance data of on-premises servers and uses it to recommend the VM SKU and disk SKU in Azure. [Learn more](concepts-assessment-calculation.md#calculate-sizing-performance-based) about how performance-based data is collected.

## Can I migrate my disks to an Ultra disk by using Azure Migrate?

No. Currently, both Azure Migrate and Azure Site Recovery don't support migration to Ultra disks. [Learn more](../virtual-machines/disks-enable-ultra-ssd.md?tabs=azure-portal#deploy-an-ultra-disk) about deploying an Ultra disk.

## Why are the provisioned IOPS and throughput in my Ultra disk more than my on-premises IOPS and throughput?

As per the [official pricing page](https://azure.microsoft.com/pricing/details/managed-disks/), Ultra disk is billed based on the provisioned size, provisioned IOPS, and provisioned throughput. For example, if you provisioned a 200-GiB Ultra disk with 20,000 IOPS and 1,000 MB/second and deleted it after 20 hours, it will map to the disk size offer of 256 GiB. You'll be billed for 256 GiB, 20,000 IOPS, and 1,000 MB/second for 20 hours.

IOPS to be provisioned = (Throughput discovered) * 1024/256

## Does the Ultra disk recommendation consider latency?

No, currently only disk size, total throughput, and total IOPS are used for sizing and costing.

## I can see M series supports Ultra disk, but in my assessment where Ultra disk was recommended, it says "No VM found for this location"

This result is possible because not all VM sizes that support Ultra disks are present in all Ultra disk supported regions. Change the target assessment region to get the VM size for this server.

## Why is my assessment showing a warning that it was created with an invalid offer?

Your assessment was created with an offer that is no longer valid and hence, the **Edit** and **Recalculate** buttons are disabled. You can create a new assessment with any of the valid offers - *Pay as you go*, *Pay as you go Dev/Test*, and *Enterprise Agreement*. You can also use the **Discount(%)** field to specify any custom discount on top of the Azure offer. [Learn more](how-to-create-assessment.md).

## Why is my assessment showing a warning that it was created with a target Azure location that has been deprecated?

Your assessment was created with an Azure region that has been deprecated and hence the **Edit** and **Recalculate** buttons are disabled. You can [create a new assessment](how-to-create-assessment.md) with any of the valid target locations. [Learn more](concepts-assessment-calculation.md#whats-in-an-azure-vm-assessment).

## Why is my assessment showing a warning that it was created with an invalid combination of Reserved Instances, VM uptime, and Discount (%)?

When you select **Reserved Instances**, the **Discount (%)** and **VM uptime** properties aren't applicable. As your assessment was created with an invalid combination of these properties, the **Edit** and **Recalculate** buttons are disabled. Create a new assessment. [Learn more](./concepts-assessment-calculation.md#whats-an-assessment).

## Why are some of my assessments marked as "to be upgraded to latest assessment version"? 

Recalculate your assessment to view the upgraded Azure SQL assessment experience to identify the ideal migration target for your SQL deployments across Azure SQL Managed Instances, SQL Server on Azure VM, and Azure SQL DB:
   - We recommended migrating instances to *SQL Server on Azure VM* as per the Azure best practices.
   - *Right sized Lift and Shift* - Server to *SQL Server on Azure VM*. We recommend this when SQL Server credentials are not available. 
   - Enhanced user-experience that covers readiness and cost estimates for multiple migration targets for SQL deployments in one assessment.

We recommend that you export your existing assessment before recalculating.

## I don't see performance data for some network adapters on my physical servers

This issue can happen if the physical server has Hyper-V virtualization enabled. On these servers, because of a product gap, Azure Migrate currently discovers both the physical and virtual network adapters. The network throughput is captured only on the virtual network adapters discovered.

## The recommended Azure VM SKU for my physical server is oversized

This issue can happen if the physical server has Hyper-V virtualization enabled. On these servers, Azure Migrate currently discovers both the physical and virtual network adapters. As a result, the number of network adapters discovered is higher than the actual number. The Azure VM assessment picks an Azure VM that can support the required number of network adapters, which can potentially result in an oversized VM. [Learn more](./concepts-assessment-calculation.md#calculating-sizing) about the impact of the number of network adapters on sizing. This product gap will be addressed going forward.

## The readiness category is marked "Not ready" for my physical server

The readiness category might be incorrectly marked as **Not ready** in the case of a physical server that has Hyper-V virtualization enabled. On these servers, because of a product gap, Azure Migrate currently discovers both the physical and virtual adapters. As a result, the number of network adapters discovered is higher than the actual number. In both **As on-premises** and **Performance-based** assessments, the Azure VM assessment picks an Azure VM that can support the required number of network adapters. If the number of network adapters is discovered to be higher than 32, the maximum number of NICs supported on Azure VMs, the server will be marked **Not ready**. [Learn more](./concepts-assessment-calculation.md#calculating-sizing) about the impact of number of NICs on sizing.

## The number of discovered NICs is higher than actual for physical servers

This issue can happen if the physical server has Hyper-V virtualization enabled. On these servers, Azure Migrate currently discovers both the physical and virtual adapters. As a result, the number of NICs discovered is higher than the actual number.

## Capture network traffic

To collect network traffic logs:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select F12 to start Developer Tools. If needed, clear the **Clear entries on navigation** setting.
1. Select the **Network** tab, and start capturing network traffic:
   - In Chrome, select **Preserve log**. The recording should start automatically. A red circle indicates that traffic is being captured. If the red circle doesn't appear, select the black circle to start.
   - In Microsoft Edge and Internet Explorer, recording should start automatically. If it doesn't, select the green play button.
1. Try to reproduce the error.
1. After you've encountered the error while recording, stop recording and save a copy of the recorded activity:
   - In Chrome, right-click and select **Save as HAR with content**. This action compresses and exports the logs as a .har file.
   - In Microsoft Edge or Internet Explorer, select the **Export captured traffic** option. This action compresses and exports the log.
1. Select the **Console** tab to check for any warnings or errors. To save the console log:
   - In Chrome, right-click anywhere in the console log. Select **Save as** to export, and zip the log.
   - In Microsoft Edge or Internet Explorer, right-click the errors and select **Copy all**.
1. Close Developer Tools.

## Where is the Operating System data in my assessment discovered from?

- For VMware VMs, by default, it's the operating system data provided by the vCenter Server.
   - For VMware Linux VMs, if application discovery is enabled, the OS details are fetched from the guest VM. To check which OS details are in the assessment, go to the **Discovered servers** view, and hover over the value in the **Operating system** column. In the text that pops up, you'd be able to see whether the OS data you see is gathered from the vCenter Server or from the guest VM by using the VM credentials.
   - For Windows VMs, the operating system details are always fetched from the vCenter Server.
- For Hyper-V VMs, the operating system data is gathered from the Hyper-V host.
- For physical servers, it is fetched from the server.

## Common web apps discovery errors

Azure Migrate provides options to assess discovered ASP.NET web apps for migration to Azure App Service by using the Azure Migrate: Discovery and assessment tool. Refer to the [assessment](tutorial-assess-webapps.md) tutorial to get started.

Typical App Service assessment errors are summarized in the table.

| **Error** | **Cause** | **Recommended action** |
|--|--|--|
|**Application pool check**|The IIS site is using the following application pools: {0}.|Azure App Service doesn't support more than one application pool configuration per App Service application. Move the workloads to a single application pool and remove other application pools.|
|**Application pool identity check**|The site's application pool is running as an unsupported user identity type: {0}.|App Service doesn't support using the LocalSystem or SpecificUser application pool identity types. Set the application pool to run as ApplicationPoolIdentity.|
|**Authorization check**|The following unsupported authentication types were found: {0}.|App Service supported authentication types and configuration are different from on-premises IIS. Disable the unsupported authentication types on the site. After the migration is complete, it will be possible to configure the site by using one of the App Service supported authentication types.|
|**Authorization check unknown**|Unable to determine enabled authentication types for all of the site configuration.|Unable to determine authentication types. Fix all configuration errors and confirm that all site content locations are accessible to the administrators group.|
|**Configuration error check**|The following configuration errors were found: {0}.|Migration readiness can't be determined without reading all applicable configuration. Fix all configuration errors. Make sure configuration is valid and accessible.|
|**Content size check**|The site content appears to be greater than the maximum allowed of 2 GB for successful migration.|For successful migration, site content should be less than 2 GB. Evaluate if the site could switch to using non-file-system-based storage options for static content, such as Azure Storage.|
|**Content size check unknown**|File content size couldn't be determined, which usually indicates an access issue.|Content must be accessible to migrate the site. Confirm that the site isn't using UNC shares for content and that all site content locations are accessible to the administrators group.|
|**Global module check**|The following unsupported global modules were detected: {0}.|App Service supports limited global modules. Remove the unsupported modules from the GlobalModules section, along with all associated configuration.|
|**ISAPI filter check**|The following unsupported ISAPI filters were detected: {0}.|Automatic configuration of custom ISAPI filters isn't supported. Remove the unsupported ISAPI filters.|
|**ISAPI filter check unknown**|Unable to determine ISAPI filters present for all of the site configuration.|Automatic configuration of custom ISAPI filters isn't supported. Fix all configuration errors and confirm that all site content locations are accessible to the administrators group.|
|**Location tag check**|The following location paths were found in the applicationHost.config file: {0}.|The migration method doesn't support moving location path configuration in applicationHost.config. Move the location path configuration to either the site's root web.config file or to a web.config file associated with the specific application to which it applies.|
|**Protocol check**|Bindings were found by using the following unsupported protocols: {0}.|App Service only supports the HTTP and HTTPS protocols. Remove the bindings with protocols that aren't HTTP or HTTPS.|
|**Virtual directory check**|The following virtual directories are hosted on UNC shares: {0}.|Migration doesn't support migrating site content hosted on UNC shares. Move content to a local file path or consider changing to a non-file-system-based storage option, such as Azure Storage. If you use shared configuration, disable shared configuration for the server before you modify the content paths.|
|**HTTPS binding check**|The application uses HTTPS.|More manual steps are required for HTTPS configuration in App Service. Other post-migration steps are required to associate certificates with the App Service site.|
|**TCP port check**|Bindings were found on the following unsupported ports: {0}.|App Service supports only ports 80 and 443. Clients making requests to the site should update the port in their requests to use 80 or 443.|
|**Framework check**|The following non-.NET frameworks or unsupported .NET framework versions were detected as possibly in use by this site: {0}.|Migration doesn't validate the framework for non-.NET sites. App Service supports multiple frameworks, but these have different migration options. Confirm that the non-.NET frameworks aren't being used by the site, or consider using an alternate migration option.|

## Next steps

[Create](how-to-create-assessment.md) or [customize](how-to-modify-assessment.md) an assessment.