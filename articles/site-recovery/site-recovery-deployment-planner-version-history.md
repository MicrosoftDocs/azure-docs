---
title: Azure Site Recovery deployment planner version history| Microsoft Docs
description: This article describes update version history of Azure Site Recovery deployment planner tool.
services: site-recovery
documentationcenter: ''
author: nsoneji
manager: garavd
editor:

ms.assetid:
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 11/26/2017
ms.author: nisoneji

---

# Version history

## 2.0
Updated: 

Following new features are added.
* Added support for Hyper-V to Azure scenario.
* Added cost calculator
* Added OS version check for VMware to Azure to determine if the VM is compatible or incompatible for the protection. The OS version is the guest operating system version that user has selected while creating the VM in VMware.

Known limitations:
* For Hyper-V to Azure, VM name contains following characters: , “” [] ` are not supported.  If profiled, report generation will fail or will have incorrect result.
* For VMware to Azure, VM name contains comma is not supported. If profiled, report generation fails or will have incorrect result.


## 1.3.1
Updated: July 19, 2017

Following new feature is added:

* Added support for large disks (> 1 TB) in report generation. Now you can use deployment planner to plan replication for virtual machines that have disk sizes greater than 1 TB (upto 4095 GB).
Read more about [Large disk support in Azure Site Recovery](https://azure.microsoft.com/en-us/blog/azure-site-recovery-large-disks/)


### 1.3
Updated: May 9, 2017

Following new feature is added:

* Added Managed Disk support in report generation. The number of virtual machines can be placed to a single storage account is calculated based on if managed disk is selected for Failover/Test failover.        


### 1.2
Updated: April 7, 2017

Added following fixes:

* Added boot type (BIOS or EFI) checks for each virtual machine to determine if the virtual machine is compatible or incompatible for the protection.
* Added OS type information for each virtual machine in the Compatible VMs  and Incompatible VMs worksheets.
* The GetThroughput operation is now supported in the US Government and China Microsoft Azure regions.
* Added few more prerequisite checks for vCenter and ESXi Server.
* Incorrect report was getting generated when locale settings are set to non-English.


### 1.1
Updated: March 9, 2017

Fixed the following issues:

* The tool cannot profile VMs if the vCenter has two or more VMs with the same name or IP address across various ESXi hosts.
* Copy and search are disabled for the Compatible VMs and Incompatible VMs worksheets.

### 1.0
Updated: February 23, 2017

Azure Site Recovery Deployment Planner public preview 1.0 has the following known issues (to be addressed in upcoming updates):

* The tool works only for VMware-to-Azure scenarios, not for Hyper-V-to-Azure deployments. For Hyper-V-to-Azure scenarios, use the [Hyper-V capacity planner tool](./site-recovery-capacity-planning-for-hyper-v-replication.md).
* The GetThroughput operation is not supported in the US Government and China Microsoft Azure regions.
* The tool cannot profile VMs if the vCenter server has two or more VMs with the same name or IP address across various ESXi hosts. In this version, the tool skips profiling for duplicate VM names or IP addresses in the VMListFile. The workaround is to profile the VMs by using an ESXi host instead of the vCenter server. You must run one instance for each ESXi host.