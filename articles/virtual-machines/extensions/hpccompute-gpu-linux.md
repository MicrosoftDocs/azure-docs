---
title: NVIDIA GPU Driver Extension - Azure Linux VMs | Microsoft Docs
description: Microsoft Azure Extension for installing NVIDIA GPU Drivers on N-series compute VMs running Linux.
services: virtual-machines-linux
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 02/11/2019
ms.author: roiyz

---
# NVIDIA GPU Driver Extension for Linux

## Overview

This extension installs NVIDIA GPU drivers on Linux N-series VMs. Depending on the VM family, the extension installs CUDA or GRID drivers. When you install NVIDIA drivers using this extension, you are accepting and agreeing to the terms of the [NVIDIA End-User License Agreement](https://go.microsoft.com/fwlink/?linkid=874330). During the installation process, the VM may reboot to complete the driver setup.

Instructions on manual installation of the drivers and the current supported versions are available [here](
https://docs.microsoft.com/azure/virtual-machines/linux/n-series-driver-setup).
An extension is also available to install NVIDIA GPU drivers on [Windows N-series VMs](hpccompute-gpu-windows.md).

## Prerequisites

### Operating system

This extension supports the following OS distros, depending on driver support for specific OS version.

| Distribution | Version |
|---|---|
| Linux: Ubuntu | 16.04 LTS, 18.04 LTS |
| Linux: Red Hat Enterprise Linux | 7.3, 7.4, 7.5, 7.6 |
| Linux: CentOS | 7.3, 7.4, 7.5, 7.6 |

### Internet connectivity

The Microsoft Azure Extension for NVIDIA GPU Drivers requires that the target VM is connected to the internet and have access.

## Extension schema

The following JSON shows the schema for the extension.

```json
{
  "name": "<myExtensionName>",
  "type": "extensions",
  "apiVersion": "2015-06-15",
  "location": "<location>",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', <myVM>)]"
  ],
  "properties": {
    "publisher": "Microsoft.HpcCompute",
    "type": "NvidiaGpuDriverLinux",
    "typeHandlerVersion": "1.2",
    "autoUpgradeMinorVersion": true,
    "settings": {
    }
  }
}
```

### Properties

| Name | Value / Example | Data Type |
| ---- | ---- | ---- |
| apiVersion | 2015-06-15 | date |
| publisher | Microsoft.HpcCompute | string |
| type | NvidiaGpuDriverLinux | string |
| typeHandlerVersion | 1.2 | int |

### Settings

All settings are optional. The default behavior is to not update the kernel if not required for driver installation, install the latest supported driver and the CUDA toolkit (as applicable).

| Name | Description | Default Value | Valid Values | Data Type |
| ---- | ---- | ---- | ---- | ---- |
| updateOS | Update the kernel even if not required for driver installation | false | true, false | boolean |
| driverVersion | NV: GRID driver version<br> NC/ND: CUDA toolkit version. The latest drivers for the chosen CUDA are installed automatically. | latest | GRID: "430.30", "418.70", "410.92", "410.71", "390.75", "390.57", "390.42"<br> CUDA: "10.0.130", "9.2.88", "9.1.85" | string |
| installCUDA | Install CUDA toolkit. Only relevant for NC/ND series VMs. | true | true, false | boolean |


## Deployment


### Azure Resource Manager Template 

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when deploying one or more virtual machines that require post deployment configuration.

The JSON configuration for a virtual machine extension can be nested inside the virtual machine resource, or placed at the root or top level of a Resource Manager JSON template. The placement of the JSON configuration affects the value of the resource name and type. For more information, see [Set name and type for child resources](../../azure-resource-manager/resource-manager-template-child-resource.md). 

The following example assumes the extension is nested inside the virtual machine resource. When nesting the extension resource, the JSON is placed in the `"resources": []` object of the virtual machine.

```json
{
  "name": "myExtensionName",
  "type": "extensions",
  "location": "[resourceGroup().location]",
  "apiVersion": "2015-06-15",
  "dependsOn": [
    "[concat('Microsoft.Compute/virtualMachines/', myVM)]"
  ],
  "properties": {
    "publisher": "Microsoft.HpcCompute",
    "type": "NvidiaGpuDriverLinux",
    "typeHandlerVersion": "1.2",
    "autoUpgradeMinorVersion": true,
    "settings": {
    }
  }
}
```

### PowerShell

```powershell
Set-AzVMExtension
    -ResourceGroupName "myResourceGroup" `
    -VMName "myVM" `
    -Location "southcentralus" `
    -Publisher "Microsoft.HpcCompute" `
    -ExtensionName "NvidiaGpuDriverLinux" `
    -ExtensionType "NvidiaGpuDriverLinux" `
    -TypeHandlerVersion 1.2 `
    -SettingString '{ `
	}'
```

### Azure CLI

The following example mirrors the above Azure Resource Manager and PowerShell examples and also adds custom settings as an example for non-default driver installation. Specifically, it updates the OS kernel and installs a specific CUDA toolkit version driver.

```azurecli
az vm extension set `
  --resource-group myResourceGroup `
  --vm-name myVM `
  --name NvidiaGpuDriverLinux `
  --publisher Microsoft.HpcCompute `
  --version 1.2 `
  --settings '{ `
    "updateOS": true, `
    "driverVersion": "9.1.85", `
  }'
```

## Troubleshoot and support

### Troubleshoot

Data about the state of extension deployments can be retrieved from the Azure portal, and by using Azure PowerShell and Azure CLI. To see the deployment state of extensions for a given VM, run the following command.

```powershell
Get-AzVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

Extension execution output is logged to the following file:

```bash
/var/log/azure/nvidia-vmext-status
```

### Exit codes

| Exit Code | Meaning | Possible Action |
| :---: | --- | --- |
| 0 | Operation successful |
| 1 | Incorrect usage of extension | Check execution output log |
| 10 | Linux Integration Services for Hyper-V and Azure not available or installed | Check output of lspci |
| 11 | NVIDIA GPU not found on this VM size | Use a [supported VM size and OS](../linux/n-series-driver-setup.md) |
| 12 | Image offer not supported |
| 13 | VM size not supported | Use an N-series VM to deploy |
| 14 | Operation unsuccessful | Check execution output log |


### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps
For more information about extensions, see [Virtual machine extensions and features for Linux](features-linux.md).

For more information about N-series VMs, see [GPU optimized virtual machine sizes](../linux/sizes-gpu.md).
