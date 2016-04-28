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

[AZURE.INCLUDE [troubleshoot-deployment-new-vm-opening](../../includes/troubleshoot-deployment-new-vm-opening-include.md)]

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Identify your issues

To start troubleshooting your deployment issue, you must begin by collecting the audit logs to identify the error associated with the issue. The following links contained detailed information on the process to follow.

[Troubleshoot resource group deployments with Azure Portal](../resource-manager-troubleshoot-deployments-portal.md)

[Audit operations with Resource Manager](../resource-group-audit.md)

## Resolve your issues
[AZURE.INCLUDE [troubleshoot-deployment-new-vm-issue1](../../includes/troubleshoot-deployment-new-vm-issue1-include.md)]

| OS status \ Process stage | If Uploaded as Specialized                                                                                                               | If Uploaded as Generalized                                                                                                                                                                                                                             | If Captured as Specialized                                                                                                                                                                                                   | If Captured as Generalized                                                                                                                                                                                                                                                                                 |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Windows Generalized       | <strong>Error:</strong> Provisioning timeout<br /><strong>Resolution</strong>: Use the original VHD that’s available on-prem, run sysprep, and then <a href="https://msdn.microsoft.com/library/mt603554.aspx/">use Add-AzureRMVhd to upload</a> as generalized.      | No error                                                                                                                                                                                                                                               | <strong>Error</strong>: Provisioning timeout, because the original VM is not usable as it is marked as generalized.<br /><strong>Resolution:</strong> Delete the current image from the portal, and <a href="https://azure.microsoft.com/documentation/articles/virtual-machines-windows-capture-image/">recreate it from the current VHDs with the generalized setting</a>. | No error                                                                                                                                                                                                                                                                                                   |
| Windows Specialized       | No error                                                                                                                                 | <strong>Error</strong>: Provisioning failure, because the new VM is running with the original computer name, username and password.<br /><strong>Resolution:</strong> Use the original VHD that’s available on-prem to <a href="https://msdn.microsoft.com/library/mt603554.aspx/">upload</a> as specialized, or run sysprep to make the OS generalized.      | No error                                                                                                                                                                                                                     | <strong>Error</strong>: Provisioning failure, because the new VM is running with the original computer name, username and password. The original VM is not usable as it is marked as specialized.<br /><strong>Resolution:</strong> Delete the current image from the portal, and <a href="https://azure.microsoft.com/documentation/articles/virtual-machines-windows-capture-image/">recreate it from the current VHDs with the specialized setting</a>. |
| Linux Generalized         | <strong>Error</strong>: Provisioning timeout<br /><strong>Resolution:</strong> Use the original VHD that’s available on-prem, run -deprovision, and then upload as generalized. | No error                                                                                                                                                                                                                                               | <strong>Error</strong>: Provisioning timeout, because the original VM is not usable as it is marked as generalized.<br /><strong>Resolution:</strong> Delete the current image from the portal, and <a href="https://azure.microsoft.com/documentation/articles/virtual-machines-linux-capture-image/">recreate it from the current VHDs with the generalized setting</a>. | No error                                                                                                                                                                                                                                                                                                   |
| Linux Specialized         | No error                                                                                                                                 | <strong>Error</strong>: Provisioning failure, because the new VM is running with the original computer name, username and password.<br /><strong>Resolution:</strong> Use the original VHD that’s available on-prem to upload as specialized, or run -deprovision to make the OS generalized. | No error                                                                                                                                                                                                                     | <strong>Error</strong>: Provisioning failure, because the new VM is running with the original computer name, username and password. The original VM is not usable as it is marked as specialized.<br /><strong>Resolution:</strong> Delete the current image from the portal, and <a href="https://azure.microsoft.com/documentation/articles/virtual-machines-linux-capture-image/">recreate it from the current VHDs with the specialized setting</a>. |

### Issue 2: You’re using a custom, gallery or marketplace image, and the audit log indicates an allocation failure
This error arises in situations when the new VM request is pinned to a cluster that either cannot support the VM size being requested, or does not have available free space to accommodate the request.

**Cause 1:** The cluster cannot support the requested VM size.

**Resolution 1:**

- Retry the request using a smaller VM size.
- If the size of the requested VM cannot be changed, stop all the VMs in the availability set. Create and start the new VM, and then restart each existing VM. Here’s how:

  - Click **Resource groups** > *your resource group* > **Resources** > *your availability set* > **Virtual Machines** > *your virtual machine* > **Stop**.
  - After all the VMs stop, create the new VM in the desired size. Then start the new VM first, and then select each of the stopped VMs and click **Start**.

**Cause 2:** The cluster does not have free resources.

**Resolution 2:**

- Retry the request at a later time.
- If the new VM can be part of a different availability set, create a new VM in a different availability set (in the same region). This new VM can then be added to the same virtual network.
