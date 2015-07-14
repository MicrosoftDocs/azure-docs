<properties 
   pageTitle="How to move a VM or role instance to a different subnet"
   description="Learn how to move VMs and role instances to a different subnet"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/29/2015"
   ms.author="telmos" />

# How to move a VM or role instance to a different subnet

You can use PowerShell to move your VMs from one subnet to another in the same virtual network (VNet). Role instances can be moved by editing the CSCFG, rather than using PowerShell.

Why move VMs to another subnet? Subnet migration is useful when the older subnet is too small and cannot be expanded due to existing running VMs in that subnet. In that case, you can create a new, larger subnet and migrate the VMs to the new subnet, then after migration is complete, you can delete the old empty subnet.

## How to move a VM to another subnet

To move a VM, run the Set-AzureSubnet PowerShell cmdlet, using the example below as a template. In the example below, we are moving TestVM from its present subnet, to Subnet-2. Be sure to edit the example to reflect your environment. Note that whenever you run the Update-AzureVM cmdlet as part of a procedure, it will restart your VM as part of the update process.

	Get-AzureVM –ServiceName TestVMCloud –Name TestVM `
	| Set-AzureSubnet –SubnetNames Subnet-2 `
	| Update-AzureVM

If you specified a static DIP for your VM, you'll have to clear that setting before you can move the VM to a new subnet. In that case, use the following:

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