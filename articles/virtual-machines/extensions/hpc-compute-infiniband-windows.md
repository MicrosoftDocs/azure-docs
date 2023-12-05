---
title: InfiniBand driver extension - Azure Windows VMs 
description: Microsoft Azure Extension for installing InfiniBand Drivers on H- and N-series compute VMs running Windows.
services: virtual-machines
documentationcenter: ''
editor: ''
ms.assetid:
ms.service: virtual-machines
ms.subservice: hpc
ms.collection: windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 1/13/2022
ms.custom: devx-track-azurepowershell
ms.author: mamccrea
author: mamccrea
---

# InfiniBand Driver Extension for Windows

This extension installs InfiniBand ND drivers (for non-SR-IOV enabled) and OFED drivers (for SR-IOV-enabled) ('r' sizes) [H-series](../sizes-hpc.md) and [N-series](../sizes-gpu.md) VMs running Windows. Depending on the VM family, the extension installs the appropriate drivers for the Connect-X NIC.

An extension is also available to install InfiniBand drivers for [Linux VMs](hpc-compute-infiniband-linux.md).

## Prerequisites

### Operating system

This extension supports the following OS distros, depending on driver support for specific OS version. Note the appropriate InfiniBand NIC for the H and N-series VM sizes of interest.

| Distribution | InfiniBand NIC drivers |
|---|---|
| Windows 10 | CX5, CX6 |
| Windows Server 2019 | CX5, CX6 |
| Windows Server 2016 | CX5, CX6 |
| Windows Server 2012 R2 | CX5, CX6 |

For latest list of supported OS and driver versions, refer to [resources.json](https://github.com/Azure/azhpc-extensions/blob/master/InfiniBand/resources.json)

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
    "type": "InfiniBandDriverWindows",
    "typeHandlerVersion": "1.5",
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
| type | InfiniBandDriverWindows | string |
| typeHandlerVersion | 1.5 | int |



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
    "type": "InfiniBandDriverWindows",
    "typeHandlerVersion": "1.5",
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
    -ExtensionName "InfiniBandDriverWindows" `
    -ExtensionType "InfiniBandDriverWindows" `
    -TypeHandlerVersion 1.5 `
    -SettingString '{ `
	}'
```

### Azure CLI

```azurecli
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name InfiniBandDriverWindows \
  --publisher Microsoft.HpcCompute \
  --version 1.5 
```

### Add extension to a Virtual Machine Scale Set

The following example installs the latest version 1.5 InfiniBandDriverWindows extension on all RDMA-capable VMs in an existing virtual machine scale set named *myVMSS* deployed in the resource group named *myResourceGroup*:

  ```powershell
  $VMSS = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myVMSS"
  Add-AzVmssExtension -VirtualMachineScaleSet $VMSS -Name "InfiniBandDriverWindows" -Publisher "Microsoft.HpcCompute" -Type "InfiniBandDriverWindows" -TypeHandlerVersion "1.5"
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

```cmd
C:\WindowsAzure\Logs\Plugins\Microsoft.HpcCompute.InfiniBandDriverWindows\
```

### Exit codes

The following table describes the meaning and recommended action based on the exit codes of the extension installation process.

| Error Code | Meaning | Possible Action |
| :---: | --- | --- |
| 0 | Operation successful |
| 3010 | Operation successful. Reboot required. |
| 100 | Operation not supported or could not be completed. | Possible causes: PowerShell version not supported, VM size is not an InfiniBand-enabled VM, Failure downloading data. Check the log files to determine cause of error. |
| 240, 840 | Operation timeout. | Retry operation. |
| -1 | Exception occurred. | Check the log files to determine cause of exception. |

### Support

If you need more help at any point in this article, you can contact the Azure experts on the [MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/community/). Alternatively, you can file a support incident through the [Azure support site](https://azure.microsoft.com/support/options/). For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Next steps
For more information about InfiniBand-enabled ('r' sizes), see [H-series](../sizes-hpc.md) and [N-series](../sizes-gpu.md) VMs.
