---
title: Install the password reset extension on VMs for your Azure Stack Edge Pro GPU device
description: Describes how to install the password reset extension on virtual machines (VMs) on an Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 04/01/2022
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how install the password reset extension on virtual machines (VMs) on my Azure Stack Edge Pro GPU device.
---
# Install password reset extension on VMs for your Azure Stack Edge Pro device

[!INCLUDE [applies-to-GPU-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-sku.md)]

This article describes how to install the password reset extension on a VM that is your Azure Stack Edge device. The article covers steps to install the password reset extension using Azure Resource Manager templates on both Windows and Linux VMs. Additionally, the article includes steps to deploy, verify, and then remove the extension.

## Prerequisites

Before you install the password reset extension on the VMs running on your device, make sure to:

1. Ensure that you have access to an Azure Stack Edge device on which you've deployed one or more VMs. For more information, see [Deploy VMs on your Azure Stack Edge Pro GPU device via the Azure portal](azure-stack-edge-gpu-deploy-gpu-virtual-machine-portal.md).

        Here is an example where Port 2 was used to enable the compute network. If Kubernetes is not deployed on your environment, you can skip the Kubernetes node IP and external service IP assignment.

        ![Screenshot of the Compute pane for an Azure Stack Edge device. Compute settings for Port 2 are highlighted.](media/azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension/enable-compute-network-1.png)
1. [Download the templates](https://aka.ms/ase-vm-templates) to your client machine. Unzip the files into a directory you’ll use as a working directory.
1. Verify that the client you'll use to access your device is connected to the local Azure Resource Manager over Azure PowerShell. For detailed instructions, see [Connect to Azure Resource Manager on your Azure Stack Edge device](azure-stack-edge-gpu-connect-resource-manager.md).

    The connection to Azure Resource Manager expires every 1.5 hours or if your Azure Stack Edge device restarts. If this happens, any cmdlets that you execute will return error messages to the effect that you are not connected to Azure. In this case, sign in again.

## Edit parameters file

Depending on the operating system for your VM, you can install the extension for Windows or for Linux.

### [Windows](#tab/windows)

==new.1 start==

To change the password for an existing VM, edit the UpdateTheFileName.json parameters file and then deploy the template UpdateTheTemplateName.json.

The file UpdateTheFileName.json file takes the following parameters:

{ 
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#", 
  "contentVersion": "1.0.0.0", 
  "parameters": { 
      "vmName": { 
          "value": "<Name of the VM>" 
      }, 
      "extensionType": { 
          "value": "<OS type of the VM, for example, Linux or Windows>" 
      }, 
      "username": { 
          "value": "<Existing username for connecting to your VM>" 
      }, 
      "Password": { 
          "value": "<New password for the user>" 
      } 
  } 
} 

==new.1 end==

==old.1 start===

To deploy Nvidia GPU drivers for an existing VM, edit the `addGPUExtWindowsVM.parameters.json` parameters file and then deploy the template `addGPUextensiontoVM.json`.

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
==old.1 end==

### [Linux](#tab/linux)

==new.2 start==
To change the password for an existing VM, edit the UpdateTheFileName.json parameters file and then deploy the template UpdateTheTemplateName.json.

The file UpdateTheFileName.json file takes the following parameters:

{ 
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#", 
  "contentVersion": "1.0.0.0", 
  "parameters": { 
      "vmName": { 
          "value": "<Name of the VM>" 
      }, 
      "extensionType": { 
          "value": "<OS type of the VM, for example, Linux or Windows>" 
      }, 
      "username": { 
          "value": "<Existing username for connecting to your VM>" 
      }, 
      "Password": { 
          "value": "<New password for the user>" 
      } 
  } 
}
==new.2 end==

==old.2 start==
To deploy Nvidia GPU drivers for an existing Linux VM, edit the parameters file and then deploy the template `addGPUextensiontoVM.json`. 

If using Ubuntu or Red Hat Enterprise Linux (RHEL), the `addGPUExtLinuxVM.parameters.json` file takes the following parameters:

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
	}
	}
	}
```

Here is a sample Ubuntu parameter file that was used in this article:

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
        }
    }
}
```
==old.2 end==

### GPU VMs from RHEL BYOS images

==remove.1, right? start==

If you created your VM using a Red Hat Enterprise Linux Bring Your Own Subscription image (RHEL BYOS), make sure that:

- You've followed the steps in [using RHEL BYOS image](azure-stack-edge-gpu-create-virtual-machine-image.md). 
- After you created the GPU VM, register and subscribe the VM with the Red Hat Customer portal. If your VM is not properly registered, installation does not proceed as the VM is not entitled. See [Register and automatically subscribe in one step using the Red Hat Subscription Manager](https://access.redhat.com/solutions/253273). This step allows the installation script to download relevant packages for the GPU driver.
- You either manually install the `vulkan-filesystem` package or add CentOS7 repo to your yum repo list. When you install the GPU extension, the installation script looks for a `vulkan-filesystem` package that is on CentOS7 repo (for RHEL7). 

---

==remove.1, right? end==

## Deploy template 

### [Windows](#tab/windows)

==new.3 start==
On Windows, deploy the template `UpdateFileName.json`. This template deploys extension to an existing VM. Run the following command:

PS C:\WINDOWS\system32> $templateFile = "C:\PasswordResetVmExtensionTemplates\addPasswordResetExtensionTemplate.json" 
PS C:\WINDOWS\system32> $templateParameterFile = "C:\PasswordResetVmExtensionTemplates\addPasswordResetExtensionTemplate.parameters.json" 
PS C:\WINDOWS\system32> $RGName = "myasepro2rg" 
PS C:\WINDOWS\system32> New-AzResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "windowsvmdeploy" -AsJob 
  
Id     Name            PSJobTypeName   State         HasMoreData     Location             Command 
--     ----            -------------   -----         -----------     --------             ------- 
9      Long Running... AzureLongRun... Running       True            localhost            New-AzResourceGro... 

PS C:\WINDOWS\system32> 

==new.3 end==

==old.3 start==

Deploy the template `addGPUextensiontoVM.json`. This template deploys extension to an existing VM. Run the following command:

```powershell
$templateFile = "<Path to addGPUextensiontoVM.json>" 
$templateParameterFile = "<Path to addGPUExtWindowsVM.parameters.json>" 
$RGName = "<Name of your resource group>"
New-AzureRmResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "<Name for your deployment>"
```
> [!NOTE]
> The extension deployment is a long running job and takes about 10 minutes to complete.

Here is a sample output:

```powershell
PS C:\WINDOWS\system32> "C:\12-09-2020\ExtensionTemplates\addGPUextensiontoVM.json"
C:\12-09-2020\ExtensionTemplates\addGPUextensiontoVM.json
PS C:\WINDOWS\system32> $templateFile = "C:\12-09-2020\ExtensionTemplates\addGPUextensiontoVM.json"
PS C:\WINDOWS\system32> $templateParameterFile = "C:\12-09-2020\ExtensionTemplates\addGPUExtWindowsVM.parameters.json"
PS C:\WINDOWS\system32> $RGName = "myasegpuvm1"
PS C:\WINDOWS\system32> New-AzureRmResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "deployment3"

DeploymentName          : deployment3
ResourceGroupName       : myasegpuvm1
ProvisioningState       : Succeeded
Timestamp               : 12/16/2020 12:18:50 AM
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name             Type                       Value
                          ===============  =========================  ==========
                          vmName           String                     VM2
                          extensionName    String                     windowsgpuext
                          publisher        String                     Microsoft.HpcCompute
                          type             String                     NvidiaGpuDriverWindows
                          typeHandlerVersion  String                     1.3
                          settings         Object                     {
                            "DriverURL": "http://us.download.nvidia.com/tesla/442.50/442.50-tesla-desktop-winserver-2019-2016-international.exe",
                            "DriverCertificateUrl": "https://go.microsoft.com/fwlink/?linkid=871664",
                            "DriverType": "CUDA"
                          }

Outputs                 :
DeploymentDebugLogLevel :
PS C:\WINDOWS\system32>
```
==old.3 end==

### [Linux](#tab/linux)

==new.4 start==
On Linux, deploy the template `UpdateFileName.json`. This template deploys extension to an existing VM. Run the following command:

PS C:\WINDOWS\system32> $templateFile = "C:\PasswordResetVmExtensionTemplates\addPasswordResetExtensionTemplate.json" 
PS C:\WINDOWS\system32> $templateParameterFile = "C:\PasswordResetVmExtensionTemplates\addPasswordResetExtensionTemplate.parameters.json" 
PS C:\WINDOWS\system32> $RGName = "myasepro2rg" 
PS C:\WINDOWS\system32> New-AzResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "myvmdeployext" -AsJob 
 
Sample output: 
Id     Name            PSJobTypeName   State         HasMoreData     Location             Command 
--     ----            -------------   -----         -----------     --------             ------- 
4      Long Running... AzureLongRun... Running       True            localhost            New-AzResourceGroupDep... 

==new.4 end==

==old.4 start==

Deploy the template `addGPUextensiontoVM.json`. This template deploys extension to an existing VM. Run the following command:

```powershell
$templateFile = "Path to addGPUextensiontoVM.json" 
$templateParameterFile = "Path to addGPUExtLinuxVM.parameters.json" 
$RGName = "<Name of your resource group>" 
New-AzureRmResourceGroupDeployment -ResourceGroupName $RGName -TemplateFile $templateFile -TemplateParameterFile $templateParameterFile -Name "<Name for your deployment>"
```	

> [!NOTE]
> The extension deployment is a long running job and takes about 10 minutes to complete.

Here is a sample output:

```powershell
Copyright (C) Microsoft Corporation. All rights reserved.
Try the new cross-platform PowerShell https://aka.ms/pscore6

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
---

==old.4 end==

## Track deployment

### [Windows](#tab/windows)

==new.5 start==

On Windows, to check the deployment status of extensions for a given VM, run the following command:

PS C:\WINDOWS\system32> Get-AzVMExtension -ResourceGroupName myasepro2rg -VMName mywindowsvm -Name windowsVMAccessExt 

ResourceGroupName       : myasepro2rg 
VMName                  : mywindowsvm 
Name                    : windowsVMAccessExt 
Location                : dbelocal 
Etag                    : null 
Publisher               : Microsoft.Compute 
ExtensionType           : VMAccessAgent 
TypeHandlerVersion      : 2.4 
Id                      : /subscriptions/04a485ed-7a09-44ab-6671-66db7f111122/resourceGroups/myasepro2rg/provi 
                          ders/Microsoft.Compute/virtualMachines/mywindowsvm/extensions/windowsVMAccessExt 
PublicSettings          : { 
                            "username": "azureuser" 
                          } 
ProtectedSettings       : 
ProvisioningState       : Creating 
Statuses                : 
SubStatuses             : 
AutoUpgradeMinorVersion : True 
ForceUpdateTag          : 
  
PS C:\WINDOWS\system32> 
  
PS C:\WINDOWS\system32> Get-AzVMExtension -ResourceGroupName myasepro2rg -VMName mywindowsvm -Name windowsVMAccessExt 
 
ResourceGroupName       : myasepro2rg 
VMName                  : mywindowsvm 
Name                    : windowsVMAccessExt 
Location                : dbelocal 
Etag                    : null 
Publisher               : Microsoft.Compute 
ExtensionType           : VMAccessAgent 
TypeHandlerVersion      : 2.4 
Id                      : /subscriptions/04a485ed-7a09-44ab-6671-66db7f111122/resourceGroups/myasepro2rg/provi 
                          ders/Microsoft.Compute/virtualMachines/mywindowsvm/extensions/windowsVMAccessExt 
PublicSettings          : { 
                            "username": "azureuser" 
                          } 
ProtectedSettings       : 
ProvisioningState       : Succeeded 
Statuses                : 
SubStatuses             : 
AutoUpgradeMinorVersion : True 
ForceUpdateTag          : 
  
PS C:\WINDOWS\system32> 

==new.5 end==

==old.5 start== 

To check the deployment state of extensions for a given VM, run the following command: 

```powershell
Get-AzureRmVMExtension -ResourceGroupName <Name of resource group> -VMName <Name of VM> -Name <Name of the extension>
```
Here is a sample output:

```powershell
PS C:\WINDOWS\system32> Get-AzureRmVMExtension -ResourceGroupName myasegpuvm1 -VMName VM2 -Name windowsgpuext

ResourceGroupName       : myasegpuvm1
VMName                  : VM2
Name                    : windowsgpuext
Location                : dbelocal
Etag                    : null
Publisher               : Microsoft.HpcCompute
ExtensionType           : NvidiaGpuDriverWindows
TypeHandlerVersion      : 1.3
Id                      : /subscriptions/947b3cfd-7a1b-4a90-7cc5-e52caf221332/resourceGroups/myasegpuvm1/providers/Microsoft.Compute/virtualMachines/VM2/extensions/windowsgpuext
PublicSettings          : {
                            "DriverURL": "http://us.download.nvidia.com/tesla/442.50/442.50-tesla-desktop-winserver-2019-2016-international.exe",
                            "DriverCertificateUrl": "https://go.microsoft.com/fwlink/?linkid=871664",
                            "DriverType": "CUDA"
                          }
ProtectedSettings       :
ProvisioningState       : Creating
Statuses                :
SubStatuses             :
AutoUpgradeMinorVersion : True
ForceUpdateTag          :

PS C:\WINDOWS\system32>
```

Extension execution output is logged to the following file. Refer to this file `C:\Packages\Plugins\Microsoft.HpcCompute.NvidiaGpuDriverWindows\1.3.0.0\Status` to track the status of installation. 

A successful install is indicated by a `message` as `Enable Extension` and `status` as `success`.

```powershell
"status":  {
                       "formattedMessage":  {
                                                "message":  "Enable Extension",
                                                "lang":  "en"
                                            },
                       "name":  "NvidiaGpuDriverWindows",
                       "status":  "success",
```

old.5 end==

### [Linux](#tab/linux)

==new.6 start==
On Linux, to check the deployment status of extensions for a given VM, run the following command:

PS C:\WINDOWS\system32> Get-AzVMExtension -ResourceGroupName myasepro2rg -VMName mylinuxvm5 -Name linuxVMAccessExt 

ResourceGroupName       : myasepro2rg 
VMName                  : mylinuxvm5 
Name                    : linuxVMAccessExt 
Location                : dbelocal 
Etag                    : null 
Publisher               : Microsoft.OSTCExtensions 
ExtensionType           : VMAccessForLinux 
TypeHandlerVersion      : 1.5 
Id                      : /subscriptions/04a485ed-7a09-44ab-6671-66db7f111122/resourceGroups 
                          /myasepro2rg/providers/Microsoft.Compute/virtualMachines/mylinuxvm 
                          5/extensions/linuxVMAccessExt 
PublicSettings          : {} 
ProtectedSettings       : 
ProvisioningState       : Creating 
Statuses                : 
SubStatuses             : 
AutoUpgradeMinorVersion : True 
ForceUpdateTag          : 
  
PS C:\WINDOWS\system32> Get-AzVMExtension -ResourceGroupName myasepro2rg -VMName mylinuxvm5 -Name linuxVMAccessExt 

ResourceGroupName       : myasepro2rg 
VMName                  : mylinuxvm5 
Name                    : linuxVMAccessExt 
Location                : dbelocal 
Etag                    : null 
Publisher               : Microsoft.OSTCExtensions 
ExtensionType           : VMAccessForLinux 
TypeHandlerVersion      : 1.5 
Id                      : /subscriptions/04a485ed-7a09-44ab-6671-66db7f111122/resourceGroups 
                          /myasepro2rg/providers/Microsoft.Compute/virtualMachines/mylinuxvm 
                          5/extensions/linuxVMAccessExt 
PublicSettings          : {} 
ProtectedSettings       : 
ProvisioningState       : Succeeded 
Statuses                : 
SubStatuses             : 
AutoUpgradeMinorVersion : True 
ForceUpdateTag          : 

  
PS C:\WINDOWS\system32> 

==new.6 end==

==old.6 start==

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

> [!NOTE]
> When the deployment is complete, the `ProvisioningState` changes to `Succeeded`.

The extension execution output is logged to the following file: `/var/log/azure/nvidia-vmext-status`.

---

==old.6 end==

## Verify the updated VM password

### [Windows](#tab/windows)

==new.7 start==
On Windows, to verify the VM password update, connect to the VM using the new password.

If authentication fails...

==new.7 end==

==old.7 start==

Sign in to the VM and run the nvidia-smi command-line utility installed with the driver. The `nvidia-smi.exe` is located at  `C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe`. If you do not see the file, it's possible that the driver installation is still running in the background. Wait for 10 minutes and check again.

If the driver is installed, you see an output similar to the following sample: 

```powershell
PS C:\Users\Administrator> cd "C:\Program Files\NVIDIA Corporation\NVSMI"
PS C:\Program Files\NVIDIA Corporation\NVSMI> ls

    Directory: C:\Program Files\NVIDIA Corporation\NVSMI

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----        2/26/2020  12:00 PM         849640 MCU.exe
-a----        2/26/2020  12:00 PM         443104 nvdebugdump.exe
-a----        2/25/2020   2:06 AM          81823 nvidia-smi.1.pdf
-a----        2/26/2020  12:01 PM         566880 nvidia-smi.exe
-a----        2/26/2020  12:01 PM         991344 nvml.dll

PS C:\Program Files\NVIDIA Corporation\NVSMI> .\nvidia-smi.exe
Wed Dec 16 00:35:51 2020
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 442.50       Driver Version: 442.50       CUDA Version: 10.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name            TCC/WDDM | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  Tesla T4            TCC  | 0000503C:00:00.0 Off |                    0 |
| N/A   35C    P8    11W /  70W |      8MiB / 15205MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
PS C:\Program Files\NVIDIA Corporation\NVSMI>
```

==old.7 end==

For more information, see [Nvidia GPU driver extension for Windows](../virtual-machines/extensions/hpccompute-gpu-windows.md).

> [!NOTE]
> After you finish installing the GPU driver and GPU extension, you no longer need to use a port with Internet access for compute.

### [Linux](#tab/linux)

==new.8 start==
On Linux, to verify the VM password update, connect to the VM using the new password.

You should be able to connect to the VM with the new password. Open a cmd window and connect to the Linux VM. Following is a sample output: 
  
Microsoft Windows [Version 10.0.22000.556] 
(c) Microsoft Corporation. All rights reserved. 
  
C:\WINDOWS\system32>ssh -l azureuser 10.57.51.13 
azureuser@10.57.51.13's password: 
Welcome to Ubuntu 18.04.3 LTS (GNU/Linux 5.0.0-1027-azure x86_64) 
  
* Documentation:  https://help.ubuntu.com 
* Management:     https://landscape.canonical.com 
* Support:        https://ubuntu.com/advantage 
  
  System information as of Wed Mar 30 21:22:24 UTC 2022 
  
  System load:  1.06              Processes:           113 
  Usage of /:   5.4% of 28.90GB   Users logged in:     0 
  Memory usage: 14%               IP address for eth0: 10.57.51.13 
  Swap usage:   0% 
  
* Super-optimized for small spaces - read how we shrank the memory 
   footprint of MicroK8s to make it the smallest full K8s around. 
  
   https://ubuntu.com/blog/microk8s-memory-optimisation 
  
230 packages can be updated. 
160 updates are security updates. 
  
New release '20.04.4 LTS' available. 
Run 'do-release-upgrade' to upgrade to it. 
  
*** System restart required *** 
Last login: Wed Mar 30 21:16:52 2022 from 10.191.227.85 
To run a command as administrator (user "root"), use "sudo <command>". 
See "man sudo_root" for details. 
  
azureuser@mylinuxvm5:~$ 

If authentication fails...

==new.8 end==

==old.8 start==

Follow these steps to verify the driver installation:

1. Connect to the GPU VM. Follow the instructions in [Connect to a Linux VM](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#connect-to-a-linux-vm). 

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
2. Run the nvidia-smi command-line utility installed with the driver. If the driver is successfully installed, you will be able to run the utility and see the following output:

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

> [!NOTE]
> After you finish installing the GPU driver and GPU extension, you no longer need to use a port with Internet access for compute.

---

==old.8 end==

## Remove GPU extension

==new.9 start==

### [Windows](#tab/windows)

On Windows, to remove the password reset extension, use the following command:

PS C:\WINDOWS\system32> Remove-AzVMExtension -ResourceGroupName <ResourceGroupName> -VMName <VMName> -Name windowsVMAccessExt 
  
Virtual machine extension removal operation 
This cmdlet will remove the specified virtual machine extension. Do you want to continue? 
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y 
  
RequestId IsSuccessStatusCode StatusCode ReasonPhrase 
--------- ------------------- ---------- ------------ 
                         True         OK OK 
  
  
PS C:\WINDOWS\system32> 


### [Linux](#tab/linux)

On Linux, to remove the password reset extension, use the following command:

To clean the extension, run the following cmd: 
  
Remove-AzVMExtension -ResourceGroupName <Resource group name> -VMName <VM name> -Name <Extension name> 
  
  
PS C:\WINDOWS\system32> Remove-AzVMExtension -ResourceGroupName myasepro2rg -VMName mylinuxvm5 -Name linuxVMAccessExt 
  
Virtual machine extension removal operation 
This cmdlet will remove the specified virtual machine extension. Do you want to continue? 
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Yes 
  
RequestId IsSuccessStatusCode StatusCode ReasonPhrase 
--------- ------------------- ---------- ------------ 
                         True         OK OK 
  
  
PS C:\WINDOWS\system32> 

==new.9 end==

==old.9 start==

To remove the GPU extension, use the following command:

`Remove-AzureRmVMExtension -ResourceGroupName <Resource group name> -VMName <VM name> -Name <Extension name>`

Here is a sample output:

```powershell
PS C:\azure-stack-edge-deploy-vms> Remove-AzureRmVMExtension -ResourceGroupName rgl -VMName WindowsVM -Name windowsgpuext
Virtual machine extension removal operation
This cmdlet will remove the specified virtual machine extension. Do you want to continue? [Y] Yes [N] No [S] Suspend [?] Help (default is "Y"): y
Requestld IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------    
          True                OK         OK
```

==old.9 end==

## Next steps

Learn how to:

- [Troubleshoot GPU extension issues](azure-stack-edge-gpu-troubleshoot-virtual-machine-gpu-extension-installation.md).
- [Monitor VM activity on your device](azure-stack-edge-gpu-monitor-virtual-machine-activity.md).
- [Manage VM disks](azure-stack-edge-gpu-manage-virtual-machine-disks-portal.md).
- [Manage VM network interfaces](azure-stack-edge-gpu-manage-virtual-machine-network-interfaces-portal.md).
- [Manage VM sizes](azure-stack-edge-gpu-manage-virtual-machine-resize-portal.md).