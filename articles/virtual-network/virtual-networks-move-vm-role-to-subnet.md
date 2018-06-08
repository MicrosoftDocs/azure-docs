---
title: Move a VM (Classic) or Cloud Services role instance to a different subnet - Azure PowerShell | Microsoft Docs
description: Learn how to move VMs (Classic) and Cloud Services role instances to a different subnet using PowerShell.
services: virtual-network
documentationcenter: na
author: genlin
manager: cshepard
editor: tysonn

ms.assetid: de4135c7-dc5b-4ffa-84cc-1b8364b7b427
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/22/2016
ms.author: genli
ms.custom: H1Hack27Feb2017

---
# Move a VM (Classic) or Cloud Services role instance to a different subnet using PowerShell
You can use PowerShell to move your VMs (Classic) from one subnet to another in the same virtual network (VNet). Role instances can be moved by editing the CSCFG file, rather than using PowerShell.

> [!NOTE]
> This article explains how to move VMs deployed through the classic deployment model only.
> 
> 

Why move VMs to another subnet? Subnet migration is useful when the older subnet is too small and cannot be expanded due to existing running VMs in that subnet. In that case, you can create a new, larger subnet and migrate the VMs to the new subnet, then after migration is complete, you can delete the old empty subnet.

## How to move a VM to another subnet
To move a VM, run the Set-AzureSubnet PowerShell cmdlet, using the example below as a template. In the example below, we are moving TestVM from its present subnet, to Subnet-2. Be sure to edit the example to reflect your environment. Note that whenever you run the Update-AzureVM cmdlet as part of a procedure, it will restart your VM as part of the update process.

    Get-AzureVM –ServiceName TestVMCloud –Name TestVM `
    | Set-AzureSubnet –SubnetNames Subnet-2 `
    | Update-AzureVM

If you specified a static internal private IP for your VM, you'll have to clear that setting before you can move the VM to a new subnet. In that case, use the following:

    Get-AzureVM -ServiceName TestVMCloud -Name TestVM `
    | Remove-AzureStaticVNetIP `
    | Update-AzureVM
    Get-AzureVM -ServiceName TestVMCloud -Name TestVM `
    | Set-AzureSubnet -SubnetNames Subnet-2 `
    | Update-AzureVM

## To move a role instance to another subnet
To move a role instance, edit the CSCFG file. In the example below, we are moving "Role0" in virtual network *VNETName* from its present subnet to *Subnet-2*. Because the role instance was already deployed, you'll just change the Subnet name = Subnet-2. Be sure to edit the example to reflect your environment.

    <NetworkConfiguration>
        <VirtualNetworkSite name="VNETName" />
        <AddressAssignments>
           <InstanceAddress roleName="Role0">
                <Subnets><Subnet name="Subnet-2" /></Subnets>
           </InstanceAddress>
        </AddressAssignments>
    </NetworkConfiguration> 
