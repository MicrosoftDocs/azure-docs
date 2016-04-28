<properties
   pageTitle="VM restarting or resizing issues | Microsoft Azure"
   description="Troubleshoot deployment issues with restarting or resizing an existing Azure Virtual Machine"
   services="virtual-machines"
   documentationCenter=""
   authors="delhan"
   manager="felixwu"
   editor=""
   tags="top-support-issue"/>

<tags
   ms.service="virtual-machines"
   ms.topic="article"
   ms.tgt_pltfrm="virtual-machines"
   ms.workload="required"
   ms.date="4/28/2016"
   ms.author="delhan"/>

# Troubleshoot deployment issues with restarting or resizing an existing Azure Virtual Machine

[AZURE.SELECTOR]
[Classic](../articles/virtual-machines/virtual-machines-windows-classic-restart-resize-error-troubleshooting.md)
[Resource Manager](../articles/virtual-machines/virtual-machines-windows-arm-restart-resize-error-troubleshooting.md)

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Resource Manager model.

[AZURE.INCLUDE [learn-about-deployment-models](../../learn-about-deployment-models-both-include.md)]

When you try to start a stopped Azure Virtual Machine (VM), or resize an existing Azure VM, the common error you encounter is an allocation failure. This error results when the cluster or region either does not have resources available or cannot support the requested VM size. This article details how to troubleshoot a classic deployment Azure VM restarting or resizing issue.

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting steps

### Collect the audit logs

Before you start troubleshooting the deployment issue, you must collect the audit logs to identify the error associated with the issue. To collect the log, follow these steps:

In the Azure portal, click **Browse** > **Virtual machines** > **your Windows virtual machine** > **Settings** > **Audit logs**.

See the following two articles for details:<br />
[Troubleshooting resource group deployments with Azure Portal](https://azure.microsoft.com/en-us/documentation/articles/resource-manager-troubleshoot-deployments-portal/)<br />[Audit operations with Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/resource-group-audit/ )

### Issue 1: You try to start a stopped VM but get an allocation failure.

**Cause**

The request to start the stopped VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not have free space available to fulfill the request.

**Resolution**

*	Stop all the VMs in the availability set, and then restart each VM. Follow these steps:

  1. Click **Resource groups** > _your resource group_ > **Resources** > _your availability set_ > **Virtual Machines** > _your virtual machine_ > **Stop**.

  2. After all the VMs stop, select each of the stopped VMs and click Start.

*	Retry the restart request at a later time.

### Issue 2: You try to resize an existing VM but get an allocation failure.

**Cause**

The request to resize the VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not support the requested VM size.

**Resolution**

* Retry the request using a smaller VM size.

* If the size of the requested VM cannot be changed, stop all the VMs in the availability set, resize and start the VM, and then restart the other VMs. To do so, follow these steps:

  1. Click **Resource groups** > _your resource group_ > **Resources** > _your availability set_ > **Virtual Machines** > _your virtual machine_ > **Stop**.

  2. After all the VMs stop, resize the desired VM to a larger size. Then start the resized VM first, and then select each of the stopped VMs and click Start.
