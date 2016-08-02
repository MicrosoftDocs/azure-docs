<properties
   pageTitle="Troubleshoot Windows VM deployment-RM | Microsoft Azure"
   description="Troubleshoot Resource Manager deployment issues when you create a new Windows virtual machine in Azure"
   services="virtual-machines-windows, azure-resource-manager"
   documentationCenter=""
   authors="jiangchen79"
   manager="felixwu"
   editor=""
   tags="top-support-issue, azure-resource-manager"/>

<tags
  ms.service="virtual-machines-windows"
  ms.workload="na"
  ms.tgt_pltfrm="vm-windows"
  ms.devlang="na"
  ms.topic="article"
  ms.date="06/20/2016"
  ms.author="cjiang"/>

# Troubleshoot Resource Manager deployment issues with creating a new Windows virtual machine in Azure

[AZURE.INCLUDE [virtual-machines-troubleshoot-deployment-new-vm-selectors](../../includes/virtual-machines-windows-troubleshoot-deployment-new-vm-selectors-include.md)]

[AZURE.INCLUDE [virtual-machines-troubleshoot-deployment-new-vm-opening](../../includes/virtual-machines-troubleshoot-deployment-new-vm-opening-include.md)]

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Collect audit logs

To start troubleshooting, collect the audit logs to identify the error associated with the issue. The following links contain detailed information on the process to follow.

[Troubleshoot resource group deployments with Azure Portal](../resource-manager-troubleshoot-deployments-portal.md)

[Audit operations with Resource Manager](../resource-group-audit.md)

[AZURE.INCLUDE [virtual-machines-troubleshoot-deployment-new-vm-issue1](../../includes/virtual-machines-troubleshoot-deployment-new-vm-issue1-include.md)]

[AZURE.INCLUDE [virtual-machines-windows-troubleshoot-deployment-new-vm-table](../../includes/virtual-machines-windows-troubleshoot-deployment-new-vm-table.md)]

**Y:** If the OS is Windows generalized, and it is uploaded and/or captured with the generalized setting, then there won’t be any errors. Similarly, if the OS is Windows specialized, and it is uploaded and/or captured with the specialized setting, then there won’t be any errors.

**Upload Errors:**

**N<sup>1</sup>:** If the OS is Windows generalized, and it is uploaded as specialized, you will get a provisioning timeout error with the VM stuck at the OOBE screen.

**N<sup>2</sup>:** If the OS is Windows specialized, and it is uploaded as generalized, you will get a provisioning failure error with the VM stuck at the OOBE screen because the new VM is running with the original computer name, username and password.

**Resolution**

To resolve both these errors, use [Add-AzureRMVhd to upload the original VHD](https://msdn.microsoft.com/library/mt603554.aspx), available on-prem, with the same setting as that for the OS (generalized/specialized). To upload as generalized, remember to run sysprep first.

**Capture Errors:**

**N<sup>3</sup>:** If the OS is Windows generalized, and it is captured as specialized, you will get a provisioning timeout error because the original VM is not usable as it is marked as generalized.

**N<sup>4</sup>:** If the OS is Windows specialized, and it is captured as generalized, you will get a provisioning failure error because the new VM is running with the original computer name, username and password. Also, the original VM is not usable because it is marked as specialized.

**Resolution**

To resolve both these errors, delete the current image from the portal, and [recapture it from the current VHDs](virtual-machines-windows-capture-image.md) with the same setting as that for the OS (generalized/specialized).

## Issue: Custom/ gallery/ marketplace image; allocation failure
This error arises in situations when the new VM request is pinned to a cluster that either cannot support the VM size being requested, or does not have available free space to accommodate the request.

**Cause 1:** The cluster cannot support the requested VM size.

**Resolution 1:**

- Retry the request using a smaller VM size.
- If the size of the requested VM cannot be changed:
  - Stop all the VMs in the availability set.
  Click **Resource groups** > *your resource group* > **Resources** > *your availability set* > **Virtual Machines** > *your virtual machine* > **Stop**.
  - After all the VMs stop, create the new VM in the desired size.
  - Start the new VM first, and then select each of the stopped VMs and click **Start**.

**Cause 2:** The cluster does not have free resources.

**Resolution 2:**

- Retry the request at a later time.
- If the new VM can be part of a different availability set
  - Create a new VM in a different availability set (in the same region).
  - Add the new VM to the same virtual network.

## Next steps
If you encounter issues when you start a stopped Windows VM or resize an existing Windows VM in Azure, see [Troubleshoot Resource Manager deployment issues with restarting or resizing an existing Windows Virtual Machine in Azure](virtual-machines-windows-restart-resize-error-troubleshooting.md).
