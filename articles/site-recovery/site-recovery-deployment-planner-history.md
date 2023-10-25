---
title: Azure Site Recovery Deployment Planner Version History
description: Known different Site Recovery Deployment Planner Versions fixes and known limitations along with their release dates.
services: site-recovery
author: ankitaduttaMSFT
manager: carmonm
ms.topic: article
ms.service: site-recovery
ms.custom: devx-track-linux
ms.date: 6/4/2020
ms.author: ankitadutta
---
# Azure Site Recovery Deployment Planner Version History

This article provides history of all versions of Azure Site Recovery Deployment Planner along with the fixes, known limitations in each and their release dates.

## Version 2.52

**Release Date: June 4, 2020**

**Fixes:**

- Added support for vCenter 7.0
- Added support for following operating systems:

    - SUSE Linux Enterprise 15 (with all minor versions)
    - Red Hat Enterprise Linux 8 (with all minor versions)


## Version 2.51

**Release Date: August 22, 2019**

**Fixes:**

- Fixed the cost recommendation issue with Deployment Planner version 2.5

## Version 2.5

**Release Date: July 29, 2019**

**Fixes:**

- For VMware virtual machines, recommendation is updated to be based on replication to Managed Disks.
- Added support for Windows 10 (x64), Windows 8.1 (x64), Windows 8 (x64), Windows 7 (x64) SP1 or later

## Version 2.4

**Release Date: April 17, 2019**

**Fixes:**

- Improved operating system compatibility, specifically when handling localization-based errors.
- Added VMs with up to 20 Mbps of data change rate (churn) to the compatibility checklist.
- Improved error messages
- Added support for vCenter 6.7.
- Added support for Windows Server 2019 and Red Hat Enterprise Linux (`RHEL`) workstation.

> [!Note]
>- It is not recommended to run the deployment planner on the ESXi version 6.7.0 Update 2 Build 13006603, as it does not work as expected. 

## Version 2.3

**Release Date: December 3, 2018**

**Fixes:**

- Fixed an issue that prevented the Deployment Planner from generating a report with the provided target location and subscription.

## Version 2.2 

**Release Date: April 25, 2018**

**Fixes:**

- GetVMList operations:
  - Fixed an issue that caused GetVMList to fail if the specified folder doesn’t exist. It now either creates the default directory, or creates the directory specified in the outputfile parameter.
  - Added more detailed failure reasons for GetVMList.
- Added VM type information as a column in the compatible VMs sheet of the Deployment Planner report.
- Hyper-V to Azure disaster recovery:
  - Excluded VMs with shared VHDs and PassThrough disks from profiling. The Startprofiling operation shows the list of excluded VMs in the console.
  - Added VMs with more than 64 disks to the list of incompatible VMs.
  - Updated the initial replication (IR) and delta replication (DR) compression factor.
  - Added limited support for SMB storage.

## Version 2.1

**Release Date: January 3, 2018**

**Fixes:**

- Updated the Excel report.
- Fixed bugs in the GetThroughput operation.
- Added option to limit the number of VMs to profile or generate the report. The default limit is 1,000 VMs.
- VMware to Azure disaster recovery:
  - Fixed an issue of Windows Server 2016 VM going into the incompatible table. 
  - Updated compatibility messages for Extensible Firmware Interface (EFI) Windows VMs.
- Updated the VMware to Azure and Hyper-V to Azure, VM data churn limit per VM. 
- Improved reliability of VM list file parsing.

## Version 2.0.1

**Release Date: December 7,  2017**

**Fixes:**

- Added recommendation to optimize the network bandwidth.

## Version 2.0

**Release Date: November 28, 2017**

**Fixes:**

- Added support for Hyper-V to Azure disaster recovery.
- Added cost calculator.
- Added OS version check for VMware to Azure disaster recovery to determine if the VM is compatible or incompatible for the protection. The tool uses the OS version string that is returned by the vCenter server for that VM. It's the guest operating system version that user has selected while creating the VM in VMware.

**Known limitations:**

- For Hyper-V to Azure disaster recovery, VM with name containing the characters like: `,`, `"`, `[`, `]`, and ``` ` ``` aren't supported. If profiled, report generation will fail or will have an incorrect result.
- For VMware to Azure disaster recovery, VM with name containing comma isn't supported. If profiled, report generation fails or will have an incorrect result.

## Version 1.3.1

**Release Date: July 19, 2017** 

**Fixes:**

- Added support for large disks (> 1 TB) in report generation. Now you can use Deployment Planner to plan replication for virtual machines that have disk sizes greater than 1 TB (up to 4095 GB).
Read more about [Large disk support in Azure Site Recovery](https://azure.microsoft.com/blog/azure-site-recovery-large-disks/)

## Version 1.3

**Release Date: May 9, 2017**

**Fixes:**

- Added support for managed disk in report generation. The number of VMs that can be placed to a single storage account is calculated based on if the managed disk is selected for Failover/Test Failover.

## Version 1.2

**Release Date: April 7, 2017**

**Fixes:**

- Added boot type (BIOS or EFI) checks for each VM to determine if the VM is compatible or incompatible for the protection.
- Added OS type information for each virtual machine in the compatible VMs and incompatible VMs worksheets.
- Added support for GetThroughput operation for the US Government and China Microsoft Azure regions.
- Added few more prerequisite checks for vCenter and ESXi Server.
- Fixed an issue of incorrect report getting generated when locale settings are set to non-English.

## Version 1.1

**Release Date: March 9, 2017**

**Fixes:**

- Fixed an issue that prevented profiling VMs when there are two or more VMs with the same name or IP address across various vCenter ESXi hosts.
- Fixed an issue that caused copy and search to be disabled for the compatible VMs and incompatible VMs worksheets.

## Version 1.0

**Release Date: February 23, 2017**

**Known limitations:**

- Supports only for VMware to Azure disaster recovery scenarios. For Hyper-V to Azure disaster recovery scenarios, use the [Hyper-V capacity planner tool](./hyper-v-deployment-planner-overview.md).
- Doesn't support the GetThroughput operation for the US Government and China Microsoft Azure regions.
- The tool cann't profile VMs if the vCenter server has two or more VMs with the same name or IP address across various ESXi hosts.
In this version, the tool skips profiling for duplicate VM names or IP addresses in the VMListFile. The workaround is to profile the VMs by using an ESXi host instead of the vCenter server. Ensure to run one instance for each ESXi host.
