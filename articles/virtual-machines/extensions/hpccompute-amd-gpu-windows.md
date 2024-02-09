---
title: AMD GPU Driver Extension - Azure Windows VMs 
description: Microsoft Azure extension for installing AMD GPU drivers on NVv4-series VMs running Windows.
services: virtual-machines-windows
author: vikancha-MSFT
manager: jkabat
ms.topic: article
ms.service: virtual-machines
ms.subservice: hpc
ms.collection: windows
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 10/14/2021
ms.author: vikancha 
---
# AMD GPU Driver Extension for Windows

This article provides an overview of the virtual machine (VM) extension to deploy AMD GPU drivers on Windows N-series VMs. When you install AMD drivers by using this extension, you're accepting and agreeing to the terms of the [AMD End-User License Agreement](https://amd.com/radeonsoftwarems). During the installation process, the VM might reboot to complete the driver setup.

Instructions on manual installation of the drivers and the current supported versions are available. For more information, see [Azure N-series AMD GPU driver setup for Windows](../windows/n-series-amd-driver-setup.md).

## Prerequisites

### Internet connectivity

The Microsoft Azure Extension for AMD GPU Drivers requires that the target VM is connected to the internet and has access.

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
    "type": "AmdGpuDriverWindows",
    "typeHandlerVersion": "1.1",
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
| type | AmdGpuDriverWindows | string |
| typeHandlerVersion | 1.1 | int |

## Deployment

### Azure portal

You can deploy Azure AMD VM extensions in the Azure portal.

1. In a browser, go to the [Azure portal](https://portal.azure.com).

1. Go to the virtual machine on which you want to install the driver.

1. On the left menu, select **Extensions**.

    :::image type="content" source="./media/amd-ext-portal/extensions-menu.png" alt-text="Screenshot that shows selecting Extensions in the Azure portal menu.":::

1. Select **Add**.

    :::image type="content" source="./media/amd-ext-portal/add-extension.png" alt-text="Screenshot that shows adding a V M extension for the selected V M.":::

1. Scroll to find and select **AMD GPU Driver Extension**, and then select **Next**.

    :::image type="content" source="./media/amd-ext-portal/select-amd-extension.png" alt-text="Screenshot that shows selecting AMD G P U Driver Extension.":::

1. Select **Review + create**, and select **Create**. Wait a few minutes for the driver to deploy.

    :::image type="content" source="./media/amd-ext-portal/create-amd-extension.png" alt-text="Screenshot that shows selecting the Review + create button.":::
  
1. Verify that the extension was added to the list of installed extensions.

    :::image type="content" source="./media/amd-ext-portal/verify-extension.png" alt-text="Screenshot that shows the new extension in the list of extensions for the V M.":::

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
    "type": "AmdGpuDriverWindows",
    "typeHandlerVersion": "1.1",
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
    -ExtensionName "AmdGpuDriverWindows" `
    -ExtensionType "AmdGpuDriverWindows" `
    -TypeHandlerVersion 1.1 `
    -SettingString '{ `
	}'
```

### Azure CLI

```azurecli
az vm extension set `
  --resource-group myResourceGroup `
  --vm-name myVM `
  --name AmdGpuDriverWindows `
  --publisher Microsoft.HpcCompute `
  --version 1.1 `
  --settings '{ `
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
C:\WindowsAzure\Logs\Plugins\Microsoft.HpcCompute.AmdGpuDriverMicrosoft\
```

### Error codes

| Error Code | Meaning | Possible action |
| :---: | --- | --- |
| 0 | Operation successful. |
| 1 | Operation successful. Reboot required. |
| 100 | Operation not supported or couldn't be completed. | Possible causes are that the PowerShell version isn't supported, the VM size isn't an N-series VM, and a failure occurred in downloading data. Check the log files to determine the cause of the error. |
| 240, 840 | Operation timeout. | Retry operation. |
| -1 | Exception occurred. | Check the log files to determine the cause of the exception. |
| -5x | Operation interrupted due to pending reboot. | Reboot VM. Installation continues after the reboot. Uninstall should be invoked manually. |

### Support

If you need more help at any point in this article, contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an Azure support incident. Go to [Azure support](https://azure.microsoft.com/support/options/) and select **Get support**. For information about using Azure support, read the [Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps

- For more information about extensions, see [Virtual machine extensions and features for Windows](features-windows.md).
- For more information about N-series VMs, see [GPU optimized virtual machine sizes](../sizes-gpu.md).
