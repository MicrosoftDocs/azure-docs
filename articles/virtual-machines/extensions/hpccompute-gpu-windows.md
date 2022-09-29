---
title: NVIDIA GPU Driver Extension - Azure Windows VMs 
description: Azure extension for installing NVIDIA GPU drivers on N-series compute VMs running Windows.
services: virtual-machines
documentationcenter: ''
ms.service: virtual-machines
ms.subservice: hpc
ms.collection: windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 10/14/2021
ms.custom: devx-track-azurepowershell
ms.author: mamccrea
author: mamccrea
---
# NVIDIA GPU Driver Extension for Windows

This extension installs NVIDIA GPU drivers on Windows N-series virtual machines (VMs). Depending on the VM family, the extension installs CUDA or GRID drivers. When you install NVIDIA drivers by using this extension, you're accepting and agreeing to the terms of the [NVIDIA End-User License Agreement](https://www.nvidia.com/en-us/data-center/products/nvidia-ai-enterprise/eula/). During the installation process, the VM might reboot to complete the driver setup.

Instructions on manual installation of the drivers and the current supported versions are available. For more information, see [Azure N-series NVIDIA GPU driver setup for Windows](../windows/n-series-driver-setup.md).
An extension is also available to install NVIDIA GPU drivers on [Linux N-series VMs](hpccompute-gpu-linux.md).

## Prerequisites

### Operating system

This extension supports the following OSs:

| Distribution | Version |
|---|---|
| Windows 10 | Core |
| Windows Server 2019 | Core |
| Windows Server 2016 | Core |
| Windows Server 2012 R2 | Core |

### Internet connectivity

The Microsoft Azure Extension for NVIDIA GPU Drivers requires that the target VM is connected to the internet and has access.

## Extension schema

The following JSON shows the schema for the extension:

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
    "typeHandlerVersion": "1.4",
    "autoUpgradeMinorVersion": true,
    "settings": {
    }
  }
}
```

### Properties

| Name | Value/Example | Data type |
| ---- | ---- | ---- |
| apiVersion | 2015-06-15 | date |
| publisher | Microsoft.HpcCompute | string |
| type | NvidiaGpuDriverWindows | string |
| typeHandlerVersion | 1.4 | int |

## Deployment

### Azure portal

You can deploy Azure NVIDIA VM extensions in the Azure portal.

1. In a browser, go to the [Azure portal](https://portal.azure.com).

1. Go to the virtual machine on which you want to install the driver.

1. On the left menu, select **Extensions**.

    :::image type="content" source="./media/nvidia-ext-portal/extensions-menu.png" alt-text="Screenshot that shows selecting Extensions in the Azure portal menu.":::

1. Select **Add**.

    :::image type="content" source="./media/nvidia-ext-portal/add-extension.png" alt-text="Screenshot that shows adding a V M extension for the selected V M.":::

1. Scroll to find and select **NVIDIA GPU Driver Extension**, and then select **Next**.

    :::image type="content" source="./media/nvidia-ext-portal/select-nvidia-extension.png" alt-text="Screenshot that shows selecting NVIDIA G P U Driver Extension.":::

1. Select **Review + create**, and select **Create**. Wait a few minutes for the driver to deploy.

    :::image type="content" source="./media/nvidia-ext-portal/create-nvidia-extension.png" alt-text="Screenshot that shows selecting the Review + create button.":::
  
1. Verify that the extension was added to the list of installed extensions.

    :::image type="content" source="./media/nvidia-ext-portal/verify-extension.png" alt-text="Screenshot that shows the new extension in the list of extensions for the V M.":::

### Azure Resource Manager template

You can use Azure Resource Manager templates to deploy Azure VM extensions. Templates are ideal when you deploy one or more virtual machines that require post-deployment configuration.

The JSON configuration for a virtual machine extension can be nested inside the virtual machine resource or placed at the root or top level of a Resource Manager JSON template. The placement of the JSON configuration affects the value of the resource name and type. For more information, see [Set name and type for child resources](../../azure-resource-manager/templates/child-resource-name-type.md).

The following example assumes the extension is nested inside the virtual machine resource. When the extension resource is nested, the JSON is placed in the `"resources": []` object of the virtual machine.

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
    "typeHandlerVersion": "1.4",
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
    -TypeHandlerVersion 1.4 `
    -SettingString '{ `
	}'
```

### Azure CLI

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name NvidiaGpuDriverWindows \
  --publisher Microsoft.HpcCompute \
  --version 1.4 \
  --settings '{ \
  }'
```

## Troubleshoot and support

### Troubleshoot

You can retrieve data about the state of extension deployments from the Azure portal and by using Azure PowerShell and the Azure CLI. To see the deployment state of extensions for a given VM, run the following command:

```powershell
Get-AzVMExtension -ResourceGroupName myResourceGroup -VMName myVM -Name myExtensionName
```

```azurecli
az vm extension list --resource-group myResourceGroup --vm-name myVM -o table
```

Extension execution output is logged to the following directory:

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.HpcCompute.NvidiaGpuDriverWindows\
```

### Error codes

| Error Code | Meaning | Possible action |
| :---: | --- | --- |
| 0 | Operation successful. |
| 1 | Operation successful. Reboot required. |
| 100 | Operation not supported or couldn't be completed. | Possible causes are that the PowerShell version isn't supported, the VM size isn't an N-series VM, or a failure occurred in downloading data. Check the log files to determine the cause of the error. |
| 240, 840 | Operation timeout. | Retry operation. |
| -1 | Exception occurred. | Check the log files to determine the cause of the exception. |
| -5x | Operation interrupted due to pending reboot. | Reboot VM. Installation continues after the reboot. Uninstall should be invoked manually. |

### Support

If you need more help at any point in this article, contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an Azure support incident. Go to [Azure support](https://azure.microsoft.com/support/options/) and select **Get support**. For information about using Azure support, read the [Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps

- For more information about extensions, see [Virtual machine extensions and features for Windows](features-windows.md).
- For more information about N-series VMs, see [GPU optimized virtual machine sizes](../sizes-gpu.md).
