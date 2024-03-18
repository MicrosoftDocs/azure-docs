---
title: NVIDIA GPU Driver Extension - Azure Linux VMs
description: Microsoft Azure extension for installing NVIDIA GPU drivers on N-series compute VMs running Linux.
services: virtual-machines
manager: gwallace
ms.service: virtual-machines
ms.subservice: hpc
ms.collection: linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.custom: linux-related-content
ms.date: 07/28/2023
ms.author: jushiman
author: ju-shim
---
# NVIDIA GPU Driver Extension for Linux

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This extension installs NVIDIA GPU drivers on Linux N-series virtual machines (VMs). Depending on the VM family, the extension installs CUDA or GRID drivers. When you install NVIDIA drivers by using this extension, you're accepting and agreeing to the terms of the [NVIDIA End-User License Agreement](https://www.nvidia.com/en-us/data-center/products/nvidia-ai-enterprise/eula/). During the installation process, the VM might reboot to complete the driver setup.

Instructions on manual installation of the drivers and the current supported versions are available. An extension is also available to install NVIDIA GPU drivers on [Windows N-series VMs](hpccompute-gpu-windows.md).

> [!NOTE]
> With Secure Boot enabled, all OS boot components (boot loader, kernel, kernel drivers) must be signed by trusted publishers (key trusted by the system). Secure Boot is not supported using Windows or Linux extensions. For more information on manually installing GPU drivers with Secure Boot enabled, see [Azure N-series GPU driver setup for Linux](../linux/n-series-driver-setup.md).
>
> [!Note]
> The GPU driver extensions do not automatically update the driver after the extension is installed. If you need to move to a newer driver version then either manually download and install the driver or remove and add the extension again.
>

## Prerequisites

### Operating system

This extension supports the following OS distros, depending on driver support for the specific OS version:

| Distribution | Version |
|---|---|
| Linux: Ubuntu | 20.04 LTS |
| Linux: Red Hat Enterprise Linux | 7.9 |
| Linux: CentOS | 7 |

> [!NOTE]
> The latest supported CUDA drivers for NC-series VMs are currently 470.82.01. Later driver versions aren't supported on the K80 cards in NC. While the extension is being updated with this end of support for NC, install CUDA drivers manually for K80 cards on the NC-series.

> [!IMPORTANT]
> This document references a release version of Linux that is nearing or at, End of Life (EOL). Please consider updating to a more current version.

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
    "type": "NvidiaGpuDriverLinux",
    "typeHandlerVersion": "1.6",
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
| type | NvidiaGpuDriverLinux | string |
| typeHandlerVersion | 1.6 | int |

### Settings

All settings are optional. The default behavior is to not update the kernel if not required for driver installation and install the latest supported driver and the CUDA toolkit (as applicable).

| Name | Description | Default value | Valid values | Data type |
| ---- | ---- | ---- | ---- | ---- |
| updateOS | Update the kernel even if not required for driver installation. | false | true, false | boolean |
| driverVersion | NV: GRID driver version.<br> NC/ND: CUDA toolkit version. The latest drivers for the chosen CUDA are installed automatically. | latest | [List](https://github.com/Azure/azhpc-extensions/blob/master/NvidiaGPU/resources.json) of supported driver versions | string |
| installCUDA | Install CUDA toolkit. Only relevant for NC/ND series VMs. | true | true, false | boolean |

## Deployment

### Azure portal

You can deploy Azure NVIDIA VM extensions in the Azure portal.

1. In a browser, go to the [Azure portal](https://portal.azure.com).

1. Go to the virtual machine on which you want to install the driver.

1. On the left menu, select **Extensions**.

    :::image type="content" source="./media/nvidia-ext-portal/extensions-menu-linux.png" alt-text="Screenshot that shows selecting Extensions in the Azure portal menu.":::

1. Select **Add**.

    :::image type="content" source="./media/nvidia-ext-portal/add-extension-linux.png" alt-text="Screenshot that shows adding a V M extension for the selected V M.":::

1. Scroll to find and select **NVIDIA GPU Driver Extension**, and then select **Next**.

    :::image type="content" source="./media/nvidia-ext-portal/select-nvidia-extension-linux.png" alt-text="Screenshot that shows selecting NVIDIA G P U Driver Extension.":::

1. Select **Review + create**, and select **Create**. Wait a few minutes for the driver to deploy.

    :::image type="content" source="./media/nvidia-ext-portal/create-nvidia-extension-linux.png" alt-text="Screenshot that shows selecting the Review + create button.":::

1. Verify that the extension was added to the list of installed extensions.

    :::image type="content" source="./media/nvidia-ext-portal/verify-extension-linux.png" alt-text="Screenshot that shows the new extension in the list of extensions for the V M.":::

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
    "type": "NvidiaGpuDriverLinux",
    "typeHandlerVersion": "1.6",
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
    -TypeHandlerVersion 1.6 `
    -SettingString '{ `
	}'
```

### Azure CLI

The following example mirrors the preceding Resource Manager and PowerShell examples:

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name NvidiaGpuDriverLinux \
  --publisher Microsoft.HpcCompute \
  --version 1.6
```

The following example also adds two optional custom settings as an example for nondefault driver installation. Specifically, it updates the OS kernel to the latest and installs a specific CUDA toolkit version driver. Again, note the `--settings` are optional and default. Updating the kernel might increase the extension installation times. Also, choosing a specific (older) CUDA toolkit version might not always be compatible with newer kernels.

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name NvidiaGpuDriverLinux \
  --publisher Microsoft.HpcCompute \
  --version 1.6 \
  --settings '{ \
    "updateOS": true, \
    "driverVersion": "10.0.130" \
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

Extension execution output is logged to the following file. Refer to this file to track the status of any long-running installation and for troubleshooting any failures.

```bash
/var/log/azure/nvidia-vmext-status
```

### Exit codes

| Exit code | Meaning | Possible action |
| :---: | --- | --- |
| 0 | Operation successful |
| 1 | Incorrect usage of extension | Check the execution output log. |
| 10 | Linux Integration Services for Hyper-V and Azure not available or installed | Check the output of lspci. |
| 11 | NVIDIA GPU not found on this VM size | Use a [supported VM size and OS](../linux/n-series-driver-setup.md). |
| 12 | Image offer not supported |
| 13 | VM size not supported | Use an N-series VM to deploy. |
| 14 | Operation unsuccessful | Check the execution output log. |

### Support

If you need more help at any point in this article, contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file an Azure support incident. Go to [Azure support](https://azure.microsoft.com/support/options/) and select **Get support**. For information about using Azure support, read the [Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps

- For more information about extensions, see [Virtual machine extensions and features for Linux](features-linux.md).
- For more information about N-series VMs, see [GPU optimized virtual machine sizes](../sizes-gpu.md).
