---
title: Troubleshoot GPU extension issues for GPU VMs on Azure Stack Edge Pro GPU 
description: Describes how to troubleshoot GPU extension installation issues for GPU VMs on Azure Stack Edge Pro GPU.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 08/02/2021
ms.author: alkohli
---
# Troubleshoot GPU extension issues for GPU VMs on Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-gpu-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-sku.md)]

This article gives guidance for resolving the most common issues that cause installation of the GPU extension on a GPU VM to fail on an Azure Stack Edge Pro GPU device.

For installation steps, see [Install GPU extension](./azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md?tabs=linux).

## VM size is not GPU VM size

**Error description:** A GPU VM must be either Standard_NC4as_T4_v3 or Standard_NC8as_T4_v3 size. If any other VM size is used, the GPU extension will fail to be attached.

**Suggested solution:** Create a VM with the Standard_NC4as_T4_v3 or Standard_NC8as_T4_v3 VM size. For more information, see [Supported VM sizes for GPU VMs](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview). For information about specifying the size, see [Create GPU VMs](./azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#create-gpu-vms).


## Image OS is not supported

**Error description:** The GPU extension doesn't support the operating system that's installed on the VM image. 

**Suggested solution:** Prepare a new VM image that has an operating system that the GPU extension supports. 

* For a list of supported operating systems, see [Supported OS and GPU drivers for GPU VMs](./azure-stack-edge-gpu-overview-gpu-virtual-machines.md#supported-os-and-gpu-drivers).

* For image preparation requirements for a GPU VM, see [Create GPU VMs](./azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#create-gpu-vms).


## Extension parameter is incorrect

**Error description:** Incorrect extension settings were used when deploying the GPU extension on a Linux VM. 

**Suggested solution:** Edit the parameters file before deploying the GPU extension. For more information, see [Install GPU extension](./azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md?tabs=linux).


## VM extension installation failed in downloading package

**Error description:** Extension provisioning failed during extension installation or while in the Enable state.

1. Check the guest log for the associated error. To collect the guest logs, see [Collect guest logs for VMs on an Azure Stack Edge Pro](azure-stack-edge-gpu-collect-virtual-machine-guest-logs.md).

   On a Linux VM:
   * Look in `/var/log/waagent.log` or `/var/log/azure/nvidia-vmext-status`.

   On a Windows VM:
   * Find out the error status in `C:\Packages\Plugins\Microsoft.HpcCompute.NvidiaGpuDriverWindows\1.3.0.0\Status`.
   * Review the complete execution log: `C:\WindowsAzure\Logs\WaAppAgent.txt`.

   If installation failed during the package download, that error indicates the VM couldn't access the public network to download the driver.

**Suggested solution:**

1.	Enable compute on a port that's connected to the Internet. For guidance, see [Create GPU VMs](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#create-gpu-vms).

1.	Deallocate the VM by stopping the VM in the portal. To stop the VM, go to **Virtual machines** > **Overview**, and select the VM. Then, on the VM properties page, select **Stop**.<!--Follow-up (formatting): Create an include file for stopping a VM. Use it here and in prerequisites for "Use the Azure portal to manage network interfaces on the VMs" (https://docs.microsoft.com/azure/databox-online/azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal#prerequisites).-->
 
1.	Create a new VM.


## VM Extension failed with error `dpkg is used/yum lock is used` (Linux VM)

**Error description:** GPU extension deployment on a Linux VM failed because another process was using `dpkg` or another process has created a `yum lock`. 

**Suggested solution:** To resolve the issue, do these steps:

1.	To find out what process is applying the lock, search the \var\log\azure\nvidia-vmext-status log for an error such as “dpkg is used by another process” or ”Another app is holding `yum lock`”.

1. Either wait for the process to finish, or end the process.

1.	[Install the GPU extension](./azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md?tabs=linux) again.

1.	If extension deployment fails again, create a new VM and make sure the lock isn't present before you install the GPU extension.


## Next steps

[Collect guest logs, and create a Support package](azure-stack-edge-gpu-collect-virtual-machine-guest-logs.md)
