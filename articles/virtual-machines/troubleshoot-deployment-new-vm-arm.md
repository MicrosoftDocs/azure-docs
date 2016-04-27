<properties
   pageTitle="Troubleshoot VM deployment-RM | Microsoft Azure"
   description="Troubleshoot resource manager deployment issues when you create a new virtual machine in Azure"
   services="virtual-machines, azure-RM"
   documentationCenter=""
   authors="jiangchen79"
   manager="felixwu"
   editor=""
   tags="top-support-issue"/>

<tags
  ms.service="virtual-machines"
  ms.workload="na"
  ms.tgt_pltfrm="vm"
  ms.devlang="na"
  ms.topic="article"
  ms.date="04/27/2016"
  ms.author="cjiang"/>

# Troubleshoot resource manager deployment issues with creating a new Azure Virtual Machine

[AZURE.INCLUDE [troubleshoot-deployment-new-vm-selectors](../../includes/troubleshoot-deployment-new-vm-selectors-include.md)]

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

[AZURE.INCLUDE [troubleshoot-deployment-new-vm-opening](../../includes/troubleshoot-deployment-new-vm-opening-include.md)]

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Troubleshooting steps

### Identify your issues

To start troubleshooting your deployment issue, you must begin by collecting the audit logs to identify the error associated with the issue. The following links contained detailed information on the process to follow.

[Troubleshoot resource group deployments with Azure Portal](https://azure.microsoft.com/documentation/articles/resource-manager-troubleshoot-deployments-portal/)

[Audit operations with Resource Manager](https://azure.microsoft.com/documentation/articles/resource-group-audit/)

### Resolve your issue
[AZURE.INCLUDE [troubleshoot-deployment-new-vm-issue1](../../includes/troubleshoot-deployment-new-vm-issue1-include.md)]

#### Issue 2: You’re using a custom, gallery or marketplace image, and the audit log indicates an allocation failure
This error arises in situations when the new VM request is pinned to a cluster that either cannot support the VM size being requested, or does not have available free space to accommodate the request.

**Cause 1:** The cluster cannot support the requested VM size.

**Resolution 1:**

- Retry the request using a smaller VM size.
- If the size of the requested VM cannot be changed, stop all the VMs in the same availability set. Create the new VM, and then restart each existing VM. Here’s how:

  - Click **Resource groups** > *your resource group* > **Resources** > *your availability set* > **Virtual Machines** > *your virtual machine* > **Stop**.
  - After all the VMs stop, create the new VM in the desired size. Then select each of the stopped VMs and click **Start**.

**Cause 2:** The cluster does not have free resources.

**Resolution 2:**

- Retry the request at a later time.
- If the new VM can be part of a different availability set, create a new VM in a different availability set (in the same region). This new VM can then be added to the same virtual network.
