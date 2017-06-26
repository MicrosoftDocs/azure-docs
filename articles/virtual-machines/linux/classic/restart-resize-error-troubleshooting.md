---
title: VM restarting or resizing issues | Microsoft Docs
description: Troubleshoot classic deployment issues with restarting or resizing an existing Linux Virtual Machine in Azure
services: virtual-machines-linux
documentationcenter: ''
author: Deland-Han
manager: felixwu
editor: ''
tags: top-support-issue

ms.assetid: 73f2672c-602e-4766-8948-2b180115d299
ms.service: virtual-machines-linux
ms.topic: support-article
ms.tgt_pltfrm: vm-linux
ms.workload: required
ms.date: 01/10/2017
ms.devlang: na
ms.author: delhan

---
# Troubleshoot classic deployment issues with restarting or resizing an existing Linux Virtual Machine in Azure
> [!div class="op_single_selector"]
> * [Classic](restart-resize-error-troubleshooting.md)
> * [Resource Manager](../restart-resize-error-troubleshooting.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
> 
> 

When you try to start a stopped Azure Virtual Machine (VM), or resize an existing Azure VM, the common error you encounter is an allocation failure. This error results when the cluster or region either does not have resources available or cannot support the requested VM size.

> [!IMPORTANT] 
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../resource-manager-deployment-model.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. For the Resource Manager version, see [here](../restart-resize-error-troubleshooting.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

[!INCLUDE [support-disclaimer](../../../../includes/support-disclaimer.md)]

## Collect audit logs
To start troubleshooting, collect the audit logs to identify the error associated with the issue.

In the Azure portal, click **Browse** > **Virtual machines** > *your Linux virtual machine* > **Settings** > **Audit logs**.

## Issue: Error when starting a stopped VM
You try to start a stopped VM but get an allocation failure.

### Cause
The request to start the stopped VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not have free space available to fulfill the request.

### Resolution
* Create a new cloud service and associate it with either a region or a region-based virtual network, but not an affinity group.
* Delete the stopped VM.
* Recreate the VM in the new cloud service by using the disks.
* Start the re-created VM.

If you get an error when trying to create a new cloud service, either retry at a later time or change the region for the cloud service.

> [!IMPORTANT]
> The new cloud service will have a new name and VIP, so you will need to change that information for all the dependencies that use that information for the existing cloud service.
> 
> 

## Issue: Error when resizing an existing VM
You try to resize an existing VM but get an allocation failure.

### Cause
The request to resize the VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not support the requested VM size.

### Resolution
Reduce the requested VM size, and retry the resize request.

* Click **Browse all** > **Virtual machines (classic)** > *your virtual machine* > **Settings** > **Size**. For detailed steps, see [Resize the virtual machine](https://msdn.microsoft.com/library/dn168976.aspx).

If it is not possible to reduce the VM size, follow these steps:

* Create a new cloud service, ensuring it is not linked to an affinity group and not associated with a virtual network that is linked to an affinity group.
* Create a new, larger-sized VM in it.

You can consolidate all your VMs in the same cloud service. If your existing cloud service is associated with a region-based virtual network, you can connect the new cloud service to the existing virtual network.

If the existing cloud service is not associated with a region-based virtual network, then you have to delete the VMs in the existing cloud service, and recreate them in the new cloud service from their disks. However, it is important to remember that the new cloud service will have a new name and VIP, so you will need to update these for all the dependencies that currently use this information for the existing cloud service.

## Next steps
If you encounter issues when you create a new Linux VM in Azure, see [Troubleshoot deployment issues with creating a new Linux virtual machine in Azure](../troubleshoot-deployment-new-vm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

