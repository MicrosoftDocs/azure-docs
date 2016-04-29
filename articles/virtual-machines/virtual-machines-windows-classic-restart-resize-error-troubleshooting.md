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
   ms.date="04/28/2016"
   ms.devlang="na"
   ms.author="delhan"/>

# Troubleshoot deployment issues with restarting or resizing an existing Azure Virtual Machine

[AZURE.SELECTOR]
[Classic](../articles/virtual-machines/virtual-machines-windows-classic-restart-resize-error-troubleshooting.md)
[Resource Manager](../articles/virtual-machines/virtual-machines-windows-arm-restart-resize-error-troubleshooting.md)

When you try to start a stopped Azure Virtual Machine (VM), or resize an existing Azure VM, the common error you encounter is an allocation failure. This error results when the cluster or region either does not have resources available or cannot support the requested VM size. This article details how to troubleshoot a classic deployment Azure VM restarting or resizing issue.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting steps

### Collect the audit logs

Before you start troubleshooting the deployment issue, you must collect the audit logs to identify the error associated with the issue. To collect the log, follow these steps:

In the Azure portal, click **Browse** > **Virtual machines** > _your Windows virtual machine_ > **Settings** > **Audit logs**.

See the following two articles for details:<br />
[Troubleshooting resource group deployments with Azure Portal](../resource-manager-troubleshoot-deployments-portal.md)<br />[Audit operations with Resource Manager](../resource-group-audit.md)

### Issue 1: You try to start a stopped VM but get an allocation failure.

**Cause**

The request to start the stopped VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not have free space available to fulfill the request.

**Resolution**

Create a new cloud service and associate it with either a region or a region-based virtual network, but not an affinity group. Delete the stopped VM, and recreate it in the new cloud service by using the disks. Then start the re-created VM.
If you get an error when trying to create a new cloud service, either retry at a later time or change the region for the cloud service.

**Important** The new cloud service will have a new name and VIP, so you will need to change that information for all the dependencies that use that information for the existing cloud service.

### Issue 2: You try to resize an existing VM but get an allocation failure.

**Cause**

The request to resize the VM has to be attempted at the original cluster that hosts the cloud service. However, the cluster does not support the requested VM size.

**Resolution**

* Reduce the requested VM size, and retry the resize request. <br />
Click **Browse all** > **Virtual machines (classic)** > _your virtual machine_ > **Settings** > **Size**. For detailed steps, see [Resize the virtual machine](https://msdn.microsoft.com/library/dn168976.aspx).
* If it is not possible to reduce the VM size, create a new cloud service. Ensure the cloud service is not linked to an affinity group and not associated with a virtual network that is linked to an affinity group. Then create the new, larger-sized VM in it. <br />
You can consolidate all your VMs in the same cloud service. If your existing cloud service is associated with a region-based virtual network, you can connect the new cloud service to the existing virtual network.<br />
If the existing cloud service is not associated with a region-based virtual network, then you have to delete the VMs in the existing cloud service, and recreate them in the new cloud service from their disks. However, it is important to remember that the new cloud service will have a new name and VIP, so you will need to update these for all the dependencies that currently use this information for the existing cloud service.
