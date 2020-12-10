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
1. After the VM is created, deploy GPU extension using the extension template.

1. If needed, could switch the compute network back to whatever customer needs. 


> [!NOTE]
> When updating your software version from 2011 to later, you will need to manually stop the GPU VMs.

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

The file `addGPUExtLinuxVM.parameters.json`  takes the following parameters:

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

#### Deploy template

Deploy the template `addGPUextensiontoVM.json`. This template deploys extension to an existing VM. Run the following command:


```powershell
$templateFile = "Path to addGPUextensiontoVM.json" 
$templateParameterFile = "Path to addGPUExtLinuxVM.parameters.json" 
$RGName = "<Name of your resource group>" 
New-AzureRmResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "<Name for your deployment>"
```	
#### Track deployment status	
	
To check the deployment state of extensions for a given VM, run the following command: 

```powershell
Get-AzureRmVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```
Extension execution output is logged to the following file. Refer to this file to track the status of installation. 
`/var/log/azure/nvidia-vmext-status`.

#### Verify driver installation

SSH too the VM and run the nvidia-smi command-line utility installed with the driver.
If the driver is installed. You will see output similar to the following.

For more information, see [Nvidia GPU driver extension for Linux](../virtual-machines/extensions/hpccompute-gpu-linux.md).

Screenshot:

PS C:\Users\niachary> $templateFile = "C:\azure-stack-edge-deploy-vms\ExtensionTemplates\addGPUextensiontoVM.json"
PS C:\Users\niachary> $templateParameterFile = "C:\azure-stack-edge-deploy-vms\ExtensionTemplates\addGPUExtLinuxVM.parameters.json"
PS C:\Users\niachary> New-AzureRmResourceGroupDeployment -ResourceGroupName rg1 -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "AddGPUExtensionLinux"




 

## Next steps

[Azure Resource Manager cmdlets](/powershell/module/azurerm.resources/?view=azurermps-6.13.0)