---
title: VM restarting or resizing issues in Azure | Microsoft Docs
description: Troubleshoot Resource Manager deployment issues with restarting or resizing an existing Virtual Machine in Azure
services: virtual-machines
documentationcenter: ''
author: Deland-Han
manager: felixwu
editor: ''
tags: top-support-issue

ms.assetid: 0756b52d-4f5a-4503-ae45-c00a6a2edcdf
ms.service: virtual-machines
ms.topic: troubleshooting
ms.date: 06/15/2018
ms.author: delhan
ms.custom: H1Hack27Feb2017

---
# Troubleshoot deployment issues with restarting or resizing an existing Windows VM in Azure
When you try to start a stopped Azure Virtual Machine (VM), or resize an existing Azure VM, the common error you encounter is an allocation failure. This error results when the cluster or region either does not have resources available or cannot support the requested VM size.

[!INCLUDE [support-disclaimer](../../../includes/support-disclaimer.md)]

## Collect activity logs
To start troubleshooting, collect the activity logs to identify the error associated with the issue. The following links contain detailed information on the process:

[View deployment operations](../../azure-resource-manager/resource-manager-deployment-operations.md)

[View activity logs to manage Azure resources](../../resource-group-audit.md)

## Issue: Error when starting a stopped VM
You try to start a stopped VM but get an allocation failure.

### Cause
The request to start the stopped VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not have free space available to fulfill the request.

### Resolution
* Stop all the VMs in the availability set, and then restart each VM.
  
  1. Click **Resource groups** > *your resource group* > **Resources** > *your availability set* > **Virtual Machines** > *your virtual machine* > **Stop**.
  2. After all the VMs stop, select each of the stopped VMs and click Start.
* Retry the restart request at a later time.

## Issue: Error when resizing an existing VM
You try to resize an existing VM but get an allocation failure.

### Cause
The request to resize the VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not support the requested VM size.

### Resolution
* Retry the request using a smaller VM size.
* If the size of the requested VM cannot be changed：
  
  1. Stop all the VMs in the availability set.
     
     * Click **Resource groups** > *your resource group* > **Resources** > *your availability set* > **Virtual Machines** > *your virtual machine* > **Stop**.
  2. After all the VMs stop, resize the desired VM to a larger size.
  3. Select the resized VM and click **Start**, and then start each of the stopped VMs.

## Next steps
If you encounter issues when you create a new Windows VM in Azure, see [Troubleshoot deployment issues with creating a new Windows virtual machine in Azure](../windows/troubleshoot-deployment-new-vm.md).

