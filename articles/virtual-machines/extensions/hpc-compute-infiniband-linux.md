---
title: InfiniBand driver extension - Azure Linux VMs
description: Microsoft Azure Extension for installing InfiniBand Drivers on HB- and N-series compute VMs running Linux.
services: virtual-machines
ms.service: virtual-machines
ms.subservice: hpc
ms.collection: linux
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.date: 04/21/2023
ms.custom: devx-track-azurepowershell, linux-related-content
ms.author: jushiman
author: ju-shim
---

# InfiniBand Driver Extension for Linux

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This extension installs InfiniBand OFED drivers on InfiniBand and SR-IOV-enabled ('r' sizes) [HB-series](../sizes-hpc.md) and [N-series](../sizes-gpu.md) VMs running Linux. Depending on the VM family, the extension installs the appropriate drivers for the Connect-X NIC. It does not install the InfiniBand ND drivers on the non-SR-IOV enabled [HB-series](../sizes-hpc.md) and [N-series](../sizes-gpu.md) VMs.

Instructions on manual installation of the OFED drivers are available in [Enable InfiniBand on HPC VMs](enable-infiniband.md#manual-installation).

An extension is also available to install InfiniBand drivers for [Windows VMs](hpc-compute-infiniband-windows.md).

## Prerequisites

### Operating system

This extension supports the following OS distros, depending on driver support for specific OS version. For latest list of supported OS and driver versions, refer to [resources.json](https://github.com/Azure/azhpc-extensions/blob/master/InfiniBand/resources.json)

| Distribution | Version | InfiniBand NIC drivers |
|---|---|---|
| Ubuntu | 18.04 LTS, 20.04 LTS | CX3-Pro, CX5, CX6 |
| CentOS | 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.1, 8,2 | CX3-Pro, CX5, CX6 |
| Red Hat Enterprise Linux | 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.1, 8,2 | CX3-Pro, CX5, CX6 |

> [!IMPORTANT]
> This document references a release version of Linux that is nearing or at, End of Life (EOL). Please consider updating to a more current version.

### Internet connectivity

The Microsoft Azure Extension for InfiniBand Drivers requires that the target VM is connected to and has access to the internet.

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
    "type": "InfiniBandDriverLinux",
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
| type | InfiniBandDriverLinux | string |
| typeHandlerVersion | 1.2 | int |



## Deployment


### Azure Resource Manager Template

Azure VM extensions can be deployed with Azure Resource Manager templates. Templates are ideal when deploying one or more virtual machines that require post deployment configuration.

The JSON configuration for a virtual machine extension can be nested inside the virtual machine resource, or placed at the root or top level of a Resource Manager JSON template. The placement of the JSON configuration affects the value of the resource name and type. For more information, see [Set name and type for child resources](../../azure-resource-manager/templates/child-resource-name-type.md).

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
    "type": "InfiniBandDriverLinux",
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
    -ExtensionName "InfiniBandDriverLinux" `
    -ExtensionType "InfiniBandDriverLinux" `
    -TypeHandlerVersion 1.2 `
    -SettingString '{ `
	}'
```

### Azure CLI

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name InfiniBandDriverLinux \
  --publisher Microsoft.HpcCompute \
  --version 1.2
```

### Add extension to a Virtual Machine Scale Set

The following example installs the latest version 1.2 InfiniBandDriverLinux extension on all RDMA-capable VMs in an existing virtual machine scale set named *myVMSS* deployed in the resource group named *myResourceGroup*:

  ```powershell
  $VMSS = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myVMSS"
  Add-AzVmssExtension -VirtualMachineScaleSet $VMSS -Name "InfiniBandDriverLinux" -Publisher "Microsoft.HpcCompute" -Type "InfiniBandDriverLinux" -TypeHandlerVersion "1.2"
  Update-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "MyVMSS" -VirtualMachineScaleSet $VMSS
  Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myVMSS" -InstanceId "*"
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

Extension execution output is logged to the following file. Refer to this file to track the status of the installation as well as for troubleshooting any failures.

```bash
/var/log/azure/ib-vmext-status
```

### Exit codes

The following table describes the meaning and recommended action based on the exit codes of the extension installation process.

| Exit Code | Meaning | Possible Action |
| :---: | --- | --- |
| 0 | Operation successful |
| 1 | Incorrect usage of extension | Check execution output log |
| 10 | Linux Integration Services for Hyper-V and Azure not available or installed | Check output of lspci |
| 11 | Mellanox InfiniBand not found on this VM size | Use a [supported VM size and OS](../sizes-hpc.md) |
| 12 | Image offer not supported |
| 13 | VM size not supported | Use an InfiniBand-enabled ('r' size) [H-series](../sizes-hpc.md) and [N-series](../sizes-gpu.md)N-series VM to deploy |
| 14 | Operation unsuccessful | Check execution output log |


### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file a support incident through the [Azure support site](https://azure.microsoft.com/support/options/). For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps
For more information about InfiniBand-enabled ('r' sizes), see [HB-series](../sizes-hpc.md) and [N-series](../sizes-gpu.md) VMs.

> [!div class="nextstepaction"]
> [Learn more about Linux VMs extensions and features](features-linux.md)
