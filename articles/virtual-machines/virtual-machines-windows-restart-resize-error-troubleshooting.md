<properties
   pageTitle="VM restarting or resizing issues | Microsoft Azure"
   description="Troubleshoot Resource Manager deployment issues with restarting or resizing an existing Windows Virtual Machine in Azure"
   services="virtual-machines-windows, azure-resource-manager"
   documentationCenter=""
   authors="Deland-Han"
   manager="felixwu"
   editor=""
   tags="top-support-issue"/>

<tags
   ms.service="virtual-machines-windows"
   ms.topic="support-article"
   ms.tgt_pltfrm="vm-windows"
   ms.devlang="na"
   ms.workload="required"
   ms.date="06/16/2016"
   ms.author="delhan"/>

# Troubleshoot Resource Manager deployment issues with restarting or resizing an existing Windows Virtual Machine in Azure

> [AZURE.SELECTOR]
- [Classic](../articles/virtual-machines/virtual-machines-windows-classic-restart-resize-error-troubleshooting.md)
- [Resource Manager](../articles/virtual-machines/virtual-machines-windows-restart-resize-error-troubleshooting.md)

When you try to start a stopped Azure Virtual Machine (VM), or resize an existing Azure VM, the common error you encounter is an allocation failure. This error results when the cluster or region either does not have resources available or cannot support the requested VM size.

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Collect audit logs

To start troubleshooting, collect the audit logs to identify the error associated with the issue. The following links contain detailed information on the process:

[Troubleshooting resource group deployments with Azure Portal](../resource-manager-troubleshoot-deployments-portal.md)

[Audit operations with Resource Manager](../resource-group-audit.md)

## Issue: Error when starting a stopped VM

You try to start a stopped VM but get an allocation failure.

### Cause

The request to start the stopped VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not have free space available to fulfill the request.

### Resolution

*	Stop all the VMs in the availability set, and then restart each VM.

  1. Click **Resource groups** > _your resource group_ > **Resources** > _your availability set_ > **Virtual Machines** > _your virtual machine_ > **Stop**.

  2. After all the VMs stop, select each of the stopped VMs and click Start.

*	Retry the restart request at a later time.

## Issue: Error when resizing an existing VM

You try to resize an existing VM but get an allocation failure.

### Cause

The request to resize the VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not support the requested VM size.

### Resolution

* Retry the request using a smaller VM size.

* If the size of the requested VM cannot be changed：

  1. Stop all the VMs in the availability set.

    * Click **Resource groups** > _your resource group_ > **Resources** > _your availability set_ > **Virtual Machines** > _your virtual machine_ > **Stop**.

  2. After all the VMs stop, resize the desired VM to a larger size.
  3. Select the resized VM and click **Start**, and then start each of the stopped VMs.

## Next steps

If you encounter issues when you create a new Windows VM in Azure, see [Troubleshoot deployment issues with creating a new Windows virtual machine in Azure](../virtual-machines/virtual-machines-windows-troubleshoot-deployment-new-vm.md).
