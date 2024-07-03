---
title: Troubleshoot assessments FAQ in Azure Migrate
description: FAQs for Troubleshooting assessments in Azure Migrate.
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.topic: troubleshooting
ms.service: azure-migrate
ms.date: 02/16/2024
ms.custom: engagement-fy24
---

# Troubleshoot assessment - FAQ

This article provides answers to some of the most common questions about troubleshoot issues with assessment. See articles [Troubleshoot](troubleshoot-assessment.md) issues with assessment and [Supported Scenarios](troubleshoot-assessment-supported-scenarios.md) for troubleshooting assessments.

## Why is the recommended Azure disk SKU bigger than on-premises in an Azure VM assessment?

Azure VM assessment might recommend a bigger disk based on the type of assessment:

- Disk sizing depends on two assessment properties: sizing criteria and storage type.
- If the sizing criteria are **Performance-based** and the storage type is set to **Automatic**, the IOPS and throughput values of the disk are considered when identifying the target disk type (Standard HDD, Standard SSD, Premium, or Ultra disk). A disk SKU from the disk type is then recommended, and the recommendation considers the size requirements of the on-premises disk.
- If the sizing criteria are **Performance-based** and the storage type is **Premium**, a premium disk SKU in Azure is recommended based on the IOPS, throughput, and size requirements of the on-premises disk. The same logic is used to perform disk sizing when the sizing criteria is **As on-premises** and the storage type is **Standard HDD**, **Standard SSD**, **Premium**, or **Ultra disk**.

For example, say you have an on-premises disk with 32 GB of memory, but the aggregated read and write IOPS for the disk is 800 IOPS. The Azure VM assessment recommends a premium disk because of the higher IOPS requirements. It also recommends a disk SKU that can support the required IOPS and size. The nearest match in this example would be P15 (256 GB, 1100 IOPS). Even though the size required by the on-premises disk was 32 GB, the Azure VM assessment recommended a larger disk because of the high IOPS requirement of the on-premises disk.

## Why is performance data missing for some or all VMs in my assessment report?

For **Performance-based** assessment, the assessment report export says 'PercentageOfCoresUtilizedMissing' or 'PercentageOfMemoryUtilizedMissing' when the Azure Migrate appliance can't collect performance data for the on-premises VMs. Make sure to check:

- If the VMs are powered on for the duration for which you're creating the assessment.
- If only memory counters are missing and you're trying to assess Hyper-V VMs, check if you have dynamic memory enabled on these VMs. Because of a known issue, currently the Azure Migrate appliance can't collect memory utilization for such VMs.
- If all of the performance counters are missing, ensure the port access requirements for assessment are met. Learn more about the port access requirements for [VMware](./migrate-support-matrix-vmware.md#port-access-requirements), [Hyper-V](./migrate-support-matrix-hyper-v.md#port-access), and [physical](./migrate-support-matrix-physical.md#port-access) assessments.
If any of the performance counters are missing, Azure Migrate: Discovery and assessment fall back to the allocated cores/memory on-premises and recommend a VM size accordingly.

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

## How performance-based sizing works in an Azure VM assessment?

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

## Next steps

[Create](how-to-create-assessment.md) or [customize](how-to-modify-assessment.md) an assessment.