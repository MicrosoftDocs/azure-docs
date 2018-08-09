---
title: Troubleshoot disks attached to Azure VMs | Microsoft Docs
description: Azure Blob storage is designed to store massive amounts of unstructured object data, such as text or binary data. Your applications can access objects in Blob storage from PowerShell or the Azure CLI, from code via Azure Storage client libraries, or over REST.  
services: storage
author: genlin

ms.service: storage
ms.topic: article
ms.date: 05/01/2018
ms.author: genli
ms.component: disks
---

# Troubleshoot disks attached to Azure VMs 

Azure Virtual Machines (VMs) rely on Virtual Hard Disks (VHDs) for the OS disk and any attached data disks. VHDs are stored as page blobs in one or more Azure Storage accounts. This article points to troubleshooting content for common issues that may arise with VHDs. 

## Troubleshoot storage deletion errors for a VM

In certain cases, you may encounter an error while deleting a storage resource when a VM in a Resource Manager deployment contains attached VHDs. For help in resolving this issue, see one of the following articles: 

  * On Linux VMs: [Storage deletion errors in Resource Manager deployment](../../virtual-machines/linux/storage-resource-deletion-errors.md)  
  * On Windows VMs: [Storage deletion errors in Resource Manager deployment](../../virtual-machines/windows/storage-resource-deletion-errors.md)  

## Troubleshoot unexpected reboots of VMs with attached VHDs

If you encounter unexpected reboots of a VM with a large number of attached VHDs, see one of the following articles:

  * On Linux VMs: [Unexpected reboots of VMs with attached VHDs](../../virtual-machines/linux/unexpected-reboots-attached-vhds.md)
  * On Windows VMs: [Unexpected reboots of VMs with attached VHDs](../../virtual-machines/linux/unexpected-reboots-attached-vhds.md)
