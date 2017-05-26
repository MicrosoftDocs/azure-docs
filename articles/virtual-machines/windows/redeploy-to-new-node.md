---
title: Redeploy Windows virtual machines in Azure | Microsoft Docs
description: How to redeploy Windows virtual machines in Azure to mitigate RDP connection issues.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
tags: azure-resource-manager,top-support-issue

ms.assetid: 0ee456ee-4595-4a14-8916-72c9110fc8bd
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: support-article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 12/16/2016
ms.author: iainfou

---
# Redeploy Windows virtual machine to new Azure node
If you have been facing difficulties troubleshooting Remote Desktop (RDP) connection or application access to Windows-based Azure virtual machine (VM), redeploying the VM may help. When you redeploy a VM, it moves the VM to a new node within the Azure infrastructure and then powers it back on, retaining all your configuration options and associated resources. This article shows you how to redeploy a VM using Azure PowerShell or the Azure portal.

> [!NOTE]
> After you redeploy a VM, the temporary disk is lost and dynamic IP addresses associated with virtual network interface are updated. 


## Using Azure PowerShell
Make sure you have the latest Azure PowerShell 1.x installed on your machine. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

The following example deploys the VM named `myVM` in the resource group named `myResourceGroup`:

```powershell
Set-AzureRmVM -Redeploy -ResourceGroupName "myResourceGroup" -Name "myVM"
```


[!INCLUDE [virtual-machines-common-redeploy-to-new-node](../../../includes/virtual-machines-common-redeploy-to-new-node.md)]

## Next steps
If you are having issues connecting to your VM, you can find specific help on [troubleshooting RDP connections](troubleshoot-rdp-connection.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) or [detailed RDP troubleshooting steps](detailed-troubleshoot-rdp.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). If you cannot access an application running on your VM, you can also read [application troubleshooting issues](troubleshoot-app-connection.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

