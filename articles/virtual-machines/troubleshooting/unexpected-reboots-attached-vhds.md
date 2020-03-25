---
title: Troubleshoot unexpected reboots of VMs with attached VHDs on Azure VMs | Microsoft Docs
description: How to troubleshoot unexpected reboots of VMs.
keywords: ssh connection refused, ssh error, azure ssh, SSH connection failed
services: virtual-machines
author: genlin
manager: dcscontentpm
tags: top-support-issue,azure-service-management,azure-resource-manager

ms.service: virtual-machines
ms.topic: article
ms.date: 11/01/2018
ms.author: genli
---

# Troubleshoot unexpected reboots of VMs with attached VHDs

If an Azure Virtual Machine (VM) has a large number of attached VHDs that are in the same storage account, you may exceed the scalability targets for an individual storage account, causing the VM to reboot unexpectedly. Check the minute metrics for the storage account (**TotalRequests**/**TotalIngress**/**TotalEgress**) for spikes that exceed the scalability targets for a storage account. See [Metrics show an increase in PercentThrottlingError](../../storage/common/storage-monitoring-diagnosing-troubleshooting.md#metrics-show-an-increase-in-PercentThrottlingError) for assistance in determining whether throttling has occurred on your storage account.

In general, each individual input or output operation on a VHD from a Virtual Machine translates to **Get Page** or **Put Page** operations on the underlying page blob. Therefore, you can use the estimated IOPS for your environment to tune how many VHDs you can have in a single storage account based on the specific behavior of your application. Microsoft recommends having 40 or fewer disks in a single storage account. For more information about scalability targets for standard storage accounts, see [Scalability targets for standard storage accounts](../../storage/common/scalability-targets-standard-account.md). For more information about scalability targets for premium page blob storage accounts, see [Scalability targets for premium page blob storage accounts](../../storage/blobs/scalability-targets-premium-page-blobs.md).

If you are exceeding the scalability targets for your storage account, place your VHDs in multiple storage accounts to reduce the activity in each individual account.
