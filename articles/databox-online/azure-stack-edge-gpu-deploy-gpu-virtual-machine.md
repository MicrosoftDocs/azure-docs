---
title: Overview and deployment of GPU VMs on your Azure Stack Edge Pro device
description: Describes how to create and manage GPU virtual machines (VMs) on an Azure Stack Edge Pro device using templates.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 12/09/2020
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge Pro device using APIs so that I can efficiently manage my VMs.
---

# GPU VMs for your Azure Stack Edge Pro device

This article provides an overview of GPU virtual machines (VMs) and describes how to create a GPU VM on your Azure Stack Edge Pro device using templates. 

In this article, we’ll use pre-written sample templates for creating resources. You won’t need to edit the template file and you can modify just the `.parameters.json` files to customize the deployment to your machine. 

## About GPU VMs

Your Azure Stack Edge Pro devices are equipped with 1 or 2 of Nvidia's Tesla T4 GPU. To deploy GPU-accelerated VM workloads on these devices, use GPU optimized VM sizes that are available with single or multiple GPUs. For example, the NC T4 v3-series should be used to deploy inference workloads featuring T4 GPUs. 

## Supported operating systems and drivers

To take advantage of the GPU capabilities of Azure N-series VMs, NVIDIA GPU drivers must be installed.

For VMs backed by NVIDIA GPUs, the NVIDIA GPU Driver Extension installs appropriate NVIDIA CUDA or GRID drivers. Install or manage the extension using the Azure portal or tools such as Azure PowerShell or Azure Resource Manager templates. See the NVIDIA GPU Driver Extension documentation for supported operating systems and deployment steps. For general information about VM extensions, see Azure virtual machine extensions and features.

Alternatively, you may install NVIDIA GPU drivers manually. See Install NVIDIA GPU drivers on N-series VMs running Windows or Install NVIDIA GPU drivers on N-series VMs running Linux for supported operating systems, drivers, installation, and verification steps.

## GPU VMs and Kubernetes on your device

Consider the following scenarios while deploying GPU VMs on a device that has Kubernetes configured.

#### For 1 GPU device: 

- **Create a GPU VM followed by Kubernetes configuration on your device**: In this scenario, the GPU VM creation and Kubernetes configuration will both be successful.

- **Configure Kubernetes on your device followed by creation of a GPU VM**: In this scenario, the Kubernetes will claim the GPU on your device and the VM creation will fail as there are no GPU resources available.

#### For 2 GPU device

- **Create a GPU VM followed by Kubernetes configuration on your device**: In this scenario, the GPU VM that you create will claim 1 GPU on your device and Kubernetes configuration will also be successful and claim the remaining 1 GPU.	

- **Create 2 GPU VMs followed by Kubernetes configuration on your device**: In this scenario, the 2 GPU VMs will claim the 2 GPUs on the device and the Kubernetes is configured successfully with no GPUs. 

- **Configure Kubernetes on your device followed by creation of a GPU VMs**: In this scenario, the Kubernetes will claim both the GPUs on your device and the VM creation will fail as no GPU resources are available.

If you have GPU VMs running on your device and Kubernetes is also configured, then any time the VM is deallocated (when you stop or remove a VM using Stop-AzureRmVM or Remove-AzureRmVM), there is a risk that the Kubernetes cluster will claim all the GPUs available on the device. In such an instance, you will not be able to restart the GPU VMs deployed on your device.



## Create GPU VMs

Follow these steps when deploying GPU VMs on your device:

1. Identify if your device will also be running Kubernetes. If the device will run Kubernetes, then you'll need to create the GPU VM first and then configure Kubernetes. If Kubernetes is configured first, then it will claim all the available GPU resources and the GPU VM creation will fail.
1. To create GPU VMs, follow all the steps in the [Deploy VM on your Azure Stack Edge Pro using templates](azure-stack-edge-gpu-deploy-virtual-machine-templates.md) except for the following differences: 

    1. While configuring compute network, enable the port that is connected to the Internet, for compute. This allows you to download the GPU drivers required for GPU extensions for your GPU VMs.
    1. Create a VM using the templates. When specifying GPU VM sizes, make sure to use the NCasT4-v3-series as these are supported for GPU VMs.
    1. Once the GPU VM is successfully created, you can view this VM in the list of virtual machines in your Azure Stack Edge resource in the Azure portal.

1. Select the VM and drill down to the details. Copy the IP allocated to the VM.
1. Connect to this VM.
1. After the VM is created, deploy GPU extension using the extension template. For linux VMs, see [Install GPU extension for Linux](#gpu-extension-for-linux) and for Windows VMs, see [Install GPU extension for Windows](#gpu-extension-for-windows).

1. If needed, could switch the compute network back to whatever customer needs. 


> [!NOTE]
> When updating your software version from 2011 to later, you will need to manually stop the GPU VMs.

After you've created the VM, the next step is to install the GPU extension.

## Install GPU extension

Depending on the operating system for your VM, you could install GPU extension for Windows or for Linux.

> [!NOTE]
> Before you install the GPU extension, make sure that the port enabled for compute network on your device is connected to Internet and has access. The GPU drivers are downloaded through the internet access.

### GPU extension for Windows

To deploy Nvidia GPU drivers for an existing VM, edit the `addGPUExtWindowsVM.parameters.json` parameters file and then deploy the template `addGPUextensiontoVM.json`.

#### Edit parameters file

The file `addGPUExtWindowsVM.parameters.json` takes the following parameters:

```json
"parameters": {	
	"vmName": {
	"value": "<name of the VM>" 
	},
	"extensionName": {
	"value": "<name for the extension. Example: windowsGpu>" 
	},
	"publisher": {
	"value": "Microsoft.HpcCompute" 
	},
	"type": {
	"value": "NvidiaGpuDriverWindows" 
	},
	"typeHandlerVersion": {
	"value": "1.3" 
	},
	"settings": {
	"value": {
	"DriverURL" : "http://us.download.nvidia.com/tesla/442.50/442.50-tesla-desktop-winserver-2019-2016-international.exe",
	"DriverCertificateUrl" : "https://go.microsoft.com/fwlink/?linkid=871664",
	"DriverType":"CUDA"
	}
	}
	}
```
#### Deploy template

Deploy the template `addGPUextensiontoVM.json`. This template deploys extension to an existing VM. Run the following command:

```powershell
$templateFile = "Path to addGPUextensiontoVM.json" 
$templateParameterFile = "Path to addGPUExtWindowsVM.parameters.json" 
$RGName = "<Name of your resource group>"
New-AzureRmResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "<Name for your deployment>"
```

#### Track deployment

To check the deployment state of extensions for a given VM, run the following command: 

```powershell
Get-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

Extension execution output is logged to the following file. Refer to this file to track the status of installation. 
`C:\Packages\Plugins\Microsoft.HpcCompute.NvidiaGpuDriverWindows\1.3.0.0\Status`

A successful install is indicated by a status `Enable Extension`.

```powershell
"status":  {
                       "formattedMessage":  {
                                                "message":  "Enable Extension",
                                                "lang":  "en"
                                            },
                       "name":  "NvidiaGpuDriverWindows",
                       "status":  "success",
```

#### Verify driver installation

Log in the VM and run the nvidia-smi command-line utility installed with the driver. The `nvidia-smi.exe` should be located at  `C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe`. If you do not see the file, it's possible that the driver installation is still running in the background. Wait for 10 minutes and check again.

If the driver is installed, you see an output similar to the following sample: 

For more information, see [Nvidia GPU driver extension for Windows](../virtual-machines/extensions/hpccompute-gpu-windows.md)

### GPU extension for Linux

To deploy Nvidia GPU drivers for an existing VM, edit the `addGPUExtLinuxVM.parameters.json` parameters file and then deploy the template `addGPUextensiontoVM.json`.

#### Edit parameters file

The file `addGPUExtLinuxVM.parameters.json` takes the following parameters:

```powershell
"parameters": {	
	"vmName": {
	"value": "<name of the VM>" 
	},
	"extensionName": {
	"value": "<name for the extension. Example: linuxGpu>" 
	},
	"publisher": {
	"value": "Microsoft.HpcCompute" 
	},
	"type": {
	"value": "NvidiaGpuDriverLinux" 
	},
	"typeHandlerVersion": {
	"value": "1.3" 
	},
	"settings": {
	"value": {
	"DRIVER_URL": "https://go.microsoft.com/fwlink/?linkid=874271",
	"PUBKEY_URL": "http://download.microsoft.com/download/F/F/A/FFAC979D-AD9C-4684-A6CE-C92BB9372A3B/7fa2af80.pub",
	"CUDA_ver": "10.0.130",
	"InstallCUDA": "true"
	}
	}
	}
```
Here is a sample parameter file that was used in this article:

```powershell
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vmName": {
            "value": "VM1" 
        },
        "extensionName": {
            "value": "gpuLinux" 
        },
        "publisher": {
            "value": "Microsoft.HpcCompute" 
        },
        "type": {
            "value": "NvidiaGpuDriverLinux" 
        },
        "typeHandlerVersion": {
            "value": "1.3" 
        },
        "settings": {
            "value": {
            "DRIVER_URL": "https://go.microsoft.com/fwlink/?linkid=874271",
            "PUBKEY_URL": "http://download.microsoft.com/download/F/F/A/FFAC979D-AD9C-4684-A6CE-C92BB9372A3B/7fa2af80.pub",
            "CUDA_ver": "10.0.130",
            "InstallCUDA": "true"
            }
        }
    }
}
```
#### Deploy template

Deploy the template `addGPUextensiontoVM.json`. This template deploys extension to an existing VM. Run the following command:


```powershell
$templateFile = "Path to addGPUextensiontoVM.json" 
$templateParameterFile = "Path to addGPUExtLinuxVM.parameters.json" 
$RGName = "<Name of your resource group>" 
New-AzureRmResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "<Name for your deployment>"
```	

This is a long running job and takes about 10 minutes to complete.

Here is a sample output:

```powershell
PS C:\WINDOWS\system32> $templateFile = "C:\12-09-2020\ExtensionTemplates\addGPUextensiontoVM.json"
PS C:\WINDOWS\system32> $templateParameterFile = "C:\12-09-2020\ExtensionTemplates\addGPUExtLinuxVM.parameters.json"
PS C:\WINDOWS\system32> $RGName = "rg2"
PS C:\WINDOWS\system32> New-AzureRmResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "delpoyment7"

DeploymentName          : delpoyment7
ResourceGroupName       : rg2
ProvisioningState       : Succeeded
Timestamp               : 12/10/2020 10:43:23 PM
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name             Type                       Value
                          ===============  =========================  ==========
                          vmName           String                     VM1
                          extensionName    String                     gpuLinux
                          publisher        String                     Microsoft.HpcCompute
                          type             String                     NvidiaGpuDriverLinux
                          typeHandlerVersion  String                     1.3
                          settings         Object                     {
                            "DRIVER_URL": "https://go.microsoft.com/fwlink/?linkid=874271",
                            "PUBKEY_URL":
                          "http://download.microsoft.com/download/F/F/A/FFAC979D-AD9C-4684-A6CE-C92BB9372A3B/7fa2af80.pub",
                            "CUDA_ver": "10.0.130",
                            "InstallCUDA": "true"
                          }

Outputs                 :
DeploymentDebugLogLevel :
PS C:\WINDOWS\system32>
```

#### Track deployment status	
	
Template deployment is a long running job. To check the deployment state of extensions for a given VM, open another PowerShell session (run as administrator). Run the following command: 

```powershell
Get-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName <VM Name> -Name <Extension Name>
```
Here is a sample output: 

```powershell
Copyright (C) Microsoft Corporation. All rights reserved.
Try the new cross-platform PowerShell https://aka.ms/pscore6

PS C:\WINDOWS\system32> Get-AzureRmVMExtension -ResourceGroupName rg2 -VMName VM1 -Name gpulinux

ResourceGroupName       : rg2
VMName                  : VM1
Name                    : gpuLinux
Location                : dbelocal
Etag                    : null
Publisher               : Microsoft.HpcCompute
ExtensionType           : NvidiaGpuDriverLinux
TypeHandlerVersion      : 1.3
Id                      : /subscriptions/947b3cfd-7a1b-4a90-7cc5-e52caf221332/resourceGroups/rg2/providers/Microsoft.Compute/virtualMachines/VM1/extensions/gpuLinux
PublicSettings          : {
                            "DRIVER_URL": "https://go.microsoft.com/fwlink/?linkid=874271",
                            "PUBKEY_URL": "http://download.microsoft.com/download/F/F/A/FFAC979D-AD9C-4684-A6CE-C92BB9372A3B/7fa2af80.pub",
                            "CUDA_ver": "10.0.130",
                            "InstallCUDA": "true"
                          }
ProtectedSettings       :
ProvisioningState       : Creating
Statuses                :
SubStatuses             :
AutoUpgradeMinorVersion : True
ForceUpdateTag          :

PS C:\WINDOWS\system32>
```

When the deployment is complete, the `ProvisioningState` changes to `Succeeded`.

The extension execution output is logged to the following file:
`/var/log/azure/nvidia-vmext-status`.

#### Verify driver installation

Follow these steps to verify the driver installation:

1. Connect to the GPU VM. Follow the instructions in [Connect to a Linux VM](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#connect-to-linux-vm). 

    Here is a sample output:

    ```powershell
    PS C:\WINDOWS\system32> ssh -l Administrator 10.57.50.60
    Administrator@10.57.50.60's password:
    Welcome to Ubuntu 18.04.4 LTS (GNU/Linux 5.0.0-1031-azure x86_64)
     * Documentation:  https://help.ubuntu.com
     * Management:     https://landscape.canonical.com
     * Support:        https://ubuntu.com/advantage
      System information as of Thu Dec 10 22:57:01 UTC 2020
    
      System load:  0.0                Processes:           133
      Usage of /:   24.8% of 28.90GB   Users logged in:     0
      Memory usage: 2%                 IP address for eth0: 10.57.50.60
      Swap usage:   0%
    
    249 packages can be updated.
    140 updates are security updates.
    
    Welcome to Ubuntu 18.04.4 LTS (GNU/Linux 5.0.0-1031-azure x86_64)    
     * Documentation:  https://help.ubuntu.com
     * Management:     https://landscape.canonical.com
     * Support:        https://ubuntu.com/advantage    
      System information as of Thu Dec 10 22:57:01 UTC 2020    
      System load:  0.0                Processes:           133
      Usage of /:   24.8% of 28.90GB   Users logged in:     0
      Memory usage: 2%                 IP address for eth0: 10.57.50.60
      Swap usage:   0%
        
    249 packages can be updated.
    140 updates are security updates.
    
    New release '20.04.1 LTS' available.
    Run 'do-release-upgrade' to upgrade to it.
        
    *** System restart required ***
    Last login: Thu Dec 10 21:49:29 2020 from 10.90.24.23
    To run a command as administrator (user "root"), use "sudo <command>".
    See "man sudo_root" for details.
    
    Administrator@VM1:~$
	```
2. Run the nvidia-smi command line utility installed with the driver. If the driver is successfully installed, you will be able to run the utility and see the following output:

    ```powershell
    Administrator@VM1:~$ nvidia-smi
    Thu Dec 10 22:58:46 2020
    +-----------------------------------------------------------------------------+
    | NVIDIA-SMI 455.45.01    Driver Version: 455.45.01    CUDA Version: 11.1     |
    |-------------------------------+----------------------+----------------------+
    | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
    | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
    |                               |                      |               MIG M. |
    |===============================+======================+======================|
    |   0  Tesla T4            Off  | 0000941F:00:00.0 Off |                    0 |
    | N/A   48C    P0    27W /  70W |      0MiB / 15109MiB |      5%      Default |
    |                               |                      |                  N/A |
    +-------------------------------+----------------------+----------------------+
    
    +-----------------------------------------------------------------------------+
    | Processes:                                                                  |
    |  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
    |        ID   ID                                                   Usage      |
    |=============================================================================|
    |  No running processes found                                                 |
    +-----------------------------------------------------------------------------+
    Administrator@VM1:~$
    ```

For more information, see [Nvidia GPU driver extension for Linux](../virtual-machines/extensions/hpccompute-gpu-linux.md).


## Next steps

[Azure Resource Manager cmdlets](/powershell/module/azurerm.resources/?view=azurermps-6.13.0)