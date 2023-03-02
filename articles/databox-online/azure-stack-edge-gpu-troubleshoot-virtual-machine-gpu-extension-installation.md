---
title: Troubleshoot GPU extension issues for GPU VMs on Azure Stack Edge Pro GPU 
description: Describes how to troubleshoot GPU extension installation issues for GPU VMs on Azure Stack Edge Pro GPU.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 06/28/2022
ms.author: alkohli
---
# Troubleshoot GPU extension issues for GPU VMs on Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-gpu-pro-pro2-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-pro-2-pro-r-sku.md)]

This article gives guidance for resolving the most common issues that cause installation of the GPU extension on a GPU VM to fail on an Azure Stack Edge Pro GPU device.

For installation steps, see [Install GPU extension](./azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md?tabs=linux).

## In versions lower than 2205, Linux GPU extension installs old signing keys: signature and/or required key missing

**Error description:** The Linux GPU extension installs old signing keys, preventing download of the required GPU driver. In this case, you'll see the following error in the syslog of the Linux VM:
 
   ```powershell
   /var/log/syslog and /var/log/waagent.log 
   May  5 06:04:53 gpuvm12 kernel: [  833.601805] nvidia:module verification failed: signature and/or required key missing- tainting kernel 
   ```
**Suggested solutions:** You have two options to mitigate this issue: 
 
- **Option 1:** Apply the Azure Stack Edge 2205 updates to your device.
- **Option 2:** After creating a GPU virtual machine of size in NCasT4_v3-series, manually install the new signing keys before installing the extension, then set required signing keys using steps in [Updating the CUDA Linux GPG Repository Key | NVIDIA Technical Blog](https://developer.nvidia.com/blog/updating-the-cuda-linux-gpg-repository-key/).

    Here's an example that installs signing keys on an Ubuntu 1804 virtual machine: 

    ```powershell
    $ sudo apt-key adv --fetch-
    keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/3bf863cc.pub 
    ```

## Failure to install GPU extension on a Windows 2016 VHD

**Error description:** This is a known issue in versions lower than 2205. The GPU extension requires TLS 1.2. In this case, you may see the following error message:

   ```azurecli
   Failed to download https://go.microsoft.com/fwlink/?linkid=871664 after 10 attempts. Exiting!
   ```

Additional details:

- Check the guest log for the associated error. To collect the guest logs, see [Collect guest logs for VMs on an Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-collect-virtual-machine-guest-logs.md).
- On a Linux VM, look in `/var/log/waagent.log` or `/var/log/azure/nvidia-vmext-status`.
- On a Windows VM, find the error status in `C:\Packages\Plugins\Microsoft.HpcCompute.NvidiaGpuDriverWindows\1.3.0.0\Status`.
- Review the complete execution log in `C:\WindowsAzure\Logs\WaAppAgent.txt`.

If the installation failed during the package download, that error indicates the VM couldn't access the public network to download the driver.


**Suggested solution:** Use the following steps to enable TLS 1.2 on a Windows 2016 VM, and then deploy the GPU extension.

1. Run the following command inside the VM to enable TLS 1.2:

   ```powershell
   sp hklm:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319 SchUseStrongCrypto 1
   ```

1. Deploy the template `addGPUextensiontoVM.json` to install the extension on an existing VM. You can install the extension manually, or you can install the extension from the Azure portal.

    - To install the extension manually, see [Install GPU extension on VMs for your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md)
    - To install the template using the Azure portal, see [Deploy GPU VMs on your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md).

   > [!NOTE]
   > The extension deployment is a long running job and takes about 10 minutes to complete.

## Manually install the Nvidia driver on RHEL 7

**Error description:** When installing the GPU extension on an RHEL 7 VM, the installation may fail due to a certificate rotation issue and an incompatible driver version.

**Suggested solution:** In this case, you have two options:

- **Option 1:** Resolve the certificate rotation issue and then install an Nvidia driver lower than version 510.

   1. To resolve the certificate rotation issue, run the following command:

      ```powershell
      $ sudo yum-config-manager --add-repo  https://developer.download.nvidia.com/compute/cuda/repos/rhel7/$arch/cuda-rhel7.repo
      ```
 
   1. Install an Nvidia driver lower than version 510.

- **Option 2:** Deploy the GPU extension. Use the following settings when deploying the ARM extension: 
 
   ```powershell
   settings": { 
   "isCustomInstall": true, 
   "InstallMethod": 0, 
   "DRIVER_URL": "  https://developer.download.nvidia.com/compute/cuda/11.4.4/local_installers/cuda-repo-rhel7-11-4-local-11.4.4_470.82.01-1.x86_64.rpm", 
   "DKMS_URL" : "  https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm", 
   "LIS_URL": "  https://aka.ms/lis", 
   "LIS_RHEL_ver": "3.10.0-1062.9.1.el7" 
   } 
   ```

## VM size is not GPU VM size

**Error description:** A GPU VM must be either Standard_NC4as_T4_v3 or Standard_NC8as_T4_v3 size. If any other VM size is used, the GPU extension will fail to be attached.

**Suggested solution:** Create a VM with the Standard_NC4as_T4_v3 or Standard_NC8as_T4_v3 VM size. For more information, see [Supported VM sizes for GPU VMs](azure-stack-edge-gpu-virtual-machine-sizes.md#n-series-gpu-optimized). For information about specifying the size, see [Create GPU VMs](./azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#create-gpu-vms).


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

1.	Deallocate the VM by stopping the VM in the portal. To stop the VM, go to **Virtual machines** > **Overview**, and select the VM. Then, on the VM properties page, select **Stop**.<!--Follow-up (formatting): Create an include file for stopping a VM. Use it here and in prerequisites for "Use the Azure portal to manage network interfaces on the VMs" (https://learn.microsoft.com/azure/databox-online/azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal#prerequisites).-->
 
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
