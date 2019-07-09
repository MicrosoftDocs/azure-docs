---
title: NVIDIA GPU Driver Extension - Azure Windows VMs | Microsoft Docs
description: Microsoft Azure extension for installing NVIDIA GPU Drivers on N-series compute VMs running Windows.
services: virtual-machines-windows
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 01/09/2019
ms.author: roiyz

---
# NVIDIA GPU Driver Extension for Windows

## Overview

This extension installs NVIDIA GPU drivers on Windows N-series VMs. Depending on the VM family, the extension installs CUDA or GRID drivers. When you install NVIDIA drivers using this extension, you are accepting and agreeing to the terms of the [NVIDIA End-User License Agreement](https://go.microsoft.com/fwlink/?linkid=874330). During the installation process, the VM may reboot to complete the driver setup.

Instructions on manual installation of the drivers and the current supported versions are available [here](https://docs.microsoft.com/azure/virtual-machines/windows/n-series-driver-setup).
An extension is also available to install NVIDIA GPU drivers on [Linux N-series VMs](hpccompute-gpu-linux.md).

## Prerequisites

### Operating system

This extension supports the following OSs:

| Distribution | Version |
|---|---|
| Windows 10 | Core |
| Windows Server 2016 | Core |
| Windows Server 2012R2 | Core |

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
    "type": "NvidiaGpuDriverWindows",
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
| type | NvidiaGpuDriverWindows | string |
| typeHandlerVersion | 1.2 | int |


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
    "type": "NvidiaGpuDriverWindows",
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
    -ExtensionName "NvidiaGpuDriverWindows" `
    -ExtensionType "NvidiaGpuDriverWindows" `
    -TypeHandlerVersion 1.2 `
    -SettingString '{ `
	}'
```

### Azure CLI

```azurecli
az vm extension set `
  --resource-group myResourceGroup `
  --vm-name myVM `
  --name NvidiaGpuDriverWindows `
  --publisher Microsoft.HpcCompute `
  --version 1.2 `
  --settings '{ `
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

Extension execution output is logged to the following directory:

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.HpcCompute.NvidiaGpuDriverMicrosoft\
```

### Error codes

| Error Code | Meaning | Possible Action |
| :---: | --- | --- |
| 0 | Operation successful |
| 1 | Operation successful. Reboot required. |
| 100 | Operation not supported or could not be completed. | Possible causes: PowerShell version not supported, VM size is not an N-series VM, Failure downloading data. Check the log files to determine cause of error. |
| 240, 840 | Operation timeout. | Retry operation. |
| -1 | Exception occurred. | Check the log files to determine cause of exception. |
| -5x | Operation interrupted due to pending reboot. | Reboot VM. Installation will continue after reboot. Uninstall should be invoked manually. |


### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select Get support. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps
For more information about extensions, see [Virtual machine extensions and features for Windows](features-windows.md).

For more information about N-series VMs, see [GPU optimized virtual machine sizes](../windows/sizes-gpu.md).
