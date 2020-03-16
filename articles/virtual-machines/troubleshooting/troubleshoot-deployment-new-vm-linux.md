---
title: Troubleshoot Linux VM deployment| Microsoft Docs
description: Troubleshoot Resource Manager deployment issues when you create a new Linux virtual machine in Azure
services: virtual-machines-linux, azure-resource-manager
documentationcenter: ''
author: JiangChen79
manager: gwallace
editor: ''
tags: top-support-issue, azure-resource-manager

ms.assetid: 906a9c89-6866-496b-b4a4-f07fb39f990c
ms.service: virtual-machines-linux
ms.workload: na
ms.tgt_pltfrm: vm-linux

ms.topic: troubleshooting
ms.date: 09/09/2016
ms.author: cjiang

---
# Troubleshoot Resource Manager deployment issues with creating a new Linux virtual machine in Azure
[!INCLUDE [virtual-machines-troubleshoot-deployment-new-vm-opening](../../../includes/virtual-machines-troubleshoot-deployment-new-vm-opening-include.md)]

[!INCLUDE [support-disclaimer](../../../includes/support-disclaimer.md)]

## Top issues
[!INCLUDE [support-disclaimer](../../../includes/virtual-machines-linux-troubleshoot-deploy-vm-top.md)]

For other VM deployment issues and questions, see [Troubleshoot deploying Linux virtual machine issues in Azure](troubleshoot-deploy-vm-linux.md).

## Collect activity logs
To start troubleshooting, collect the activity logs to identify the error associated with the issue. The following links contain detailed information on the process to follow.

[View deployment operations](../../azure-resource-manager/templates/deployment-history.md)

[View activity logs to manage Azure resources](../../resource-group-audit.md)

[!INCLUDE [virtual-machines-troubleshoot-deployment-new-vm-issue1](../../../includes/virtual-machines-troubleshoot-deployment-new-vm-issue1-include.md)]

[!INCLUDE [virtual-machines-linux-troubleshoot-deployment-new-vm-table](../../../includes/virtual-machines-linux-troubleshoot-deployment-new-vm-table.md)]

**Y:** If the OS is Linux generalized, and it is uploaded and/or captured with the generalized setting, then there won’t be any errors. Similarly, if the OS is Linux specialized, and it is uploaded and/or captured with the specialized setting, then there won’t be any errors.

**Upload Errors:**

**N<sup>1</sup>:** If the OS is Linux generalized, and it is uploaded as specialized, you will get a provisioning timeout error because the VM is stuck at the provisioning stage.

**N<sup>2</sup>:** If the OS is Linux specialized, and it is uploaded as generalized, you will get a provisioning failure error because the new VM is running with the original computer name, username and password.

**Resolution:**

To resolve both these errors, upload the original VHD, available on premises, with the same setting as that for the OS (generalized/specialized). To upload as generalized, remember to run -deprovision first.

**Capture Errors:**

**N<sup>3</sup>:** If the OS is Linux generalized, and it is captured as specialized, you will get a provisioning timeout error because the original VM is not usable as it is marked as generalized.

**N<sup>4</sup>:** If the OS is Linux specialized, and it is captured as generalized, you will get a provisioning failure error because the new VM is running with the original computer name, username and password. Also, the original VM is not usable because it is marked as specialized.

**Resolution:**

To resolve both these errors, delete the current image from the portal, and [recapture it from the current VHDs](../linux/capture-image.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) with the same setting as that for the OS (generalized/specialized).

## Issue: Custom/ gallery/ marketplace image; allocation failure
This error arises in situations when the new VM request is pinned to a cluster that either cannot support the VM size being requested, or does not have available free space to accommodate the request.

**Cause 1:** The cluster cannot support the requested VM size.

**Resolution 1:**

* Retry the request using a smaller VM size.
* If the size of the requested VM cannot be changed:
  * Stop all the VMs in the availability set.
    Click **Resource groups** > *your resource group* > **Resources** > *your availability set* > **Virtual Machines** > *your virtual machine* > **Stop**.
  * After all the VMs stop, create the new VM in the desired size.
  * Start the new VM first, and then select each of the stopped VMs and click **Start**.

**Cause 2:** The cluster does not have free resources.

**Resolution 2:**

* Retry the request at a later time.
* If the new VM can be part of a different availability set
  * Create a new VM in a different availability set (in the same region).
  * Add the new VM to the same virtual network.

## Next steps
If you encounter issues when you start a stopped Linux VM or resize an existing Linux VM in Azure, see [Troubleshoot Resource Manager deployment issues with restarting or resizing an existing Linux Virtual Machine in Azure](../linux/restart-resize-error-troubleshooting.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

