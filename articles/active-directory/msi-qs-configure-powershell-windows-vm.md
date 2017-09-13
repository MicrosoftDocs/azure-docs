---
title: How to configure MSI on an Azure VM using PowerShell
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure VM, using PowerShell.
services: active-directory
documentationcenter: 
author: bryanla
manager: mbaldwin
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: bryanla
---

# Configure a VM Managed Service Identity (MSI) using PowerShell

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to enable and remove MSI for an Azure Windows VM, using PowerShell.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

Also, install [Azure PowerShell version 4.3.1](https://www.powershellgallery.com/packages/AzureRM/4.3.1) if you haven't already.

## Enable MSI during creation of an Azure VM

A new MSI-enabled Windows Virtual Machine resource is created in a new resource group, using the specified configuration parameters. Also note that many these cmdlets can run 30 seconds or more before returning, with the final VM creation taking several minutes to complete.

1. Sign in to Azure using `Login-AzureRmAccount`. Use an account that is associated with the Azure subscription under which you would like to deploy the VM.

   ```powershell
   Login-AzureRmAccount
   ```

2. Create a [resource group](../azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your VM and its related resources, using the `New-AzureRmResourceGroup` cmdlet. You can skip this step if you already have a resource group you would like to use instead:

   ```powershell
   New-AzureRmResourceGroup -Name myResourceGroup -Location WestUS
   ```
3. Create networking resources for the VM.

   a. Create a virtual network, subnet, and a public IP address. These resources are used to provide network connectivity to the virtual machine and connect it to the internet:

   ```powershell
   # Create a subnet configuration
   $subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

   # Create a virtual network
   $vnet = New-AzureRmVirtualNetwork -ResourceGroupName myResourceGroup -Location WestUS -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

   # Create a public IP address and specify a DNS name
   $pip = New-AzureRmPublicIpAddress -ResourceGroupName myResourceGroup -Location WestUS -AllocationMethod Static -IdleTimeoutInMinutes 4 -Name "mypublicdns$(Get-Random)"
   ```

   b. Create a network security group and a network security group rule. The network security group secures the virtual machine using inbound and outbound rules. In this case, an inbound rule is created for port 3389, which allows incoming remote desktop connections. We also want to create an inbound rule for port 80, which allows incoming web traffic:

   ```powershell
   # Create an inbound network security group rule for port 3389
   $nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 3389 -Access Allow

   # Create an inbound network security group rule for port 80
   $nsgRuleWeb = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleWWW  -Protocol Tcp -Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 80 -Access Allow

   # Create a network security group
   $nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName myResourceGroup -Location WestUS -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP,$nsgRuleWeb
   ```

   c. Create a virtual network card for the virtual machine. The network card connects the virtual machine to a subnet, network security group, and public IP address:

   ```powershell
   # Create a virtual network card and associate with public IP address and NSG
   $nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName myResourceGroup -Location WestUS -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id
   ```

4. Create the VM.

   a. Create a configurable VM object. These settings are used when deploying the virtual machine, such as a virtual machine image, size, and authentication configuration. The `-IdentityType "SystemAssigned"` parameter used in the [New-AzureRmVMConfig](/powershell/module/azurerm.compute/new-azurermvm) cmdlet causes the VM to be provisioned with an MSI. The `Get-Credential` cmdlet prompts for credentials, which are configured as the user name and password for the virtual machine:

   ```powershell
   # Define a credential object (prompts for user/password to be used for VM authentication)
   $cred = Get-Credential

   # Create a configurable VM object with a Managed Service Identity
   $vmConfig = New-AzureRmVMConfig -VMName myVM -VMSize Standard_DS2 -IdentityType "SystemAssigned" | Set-AzureRmVMOperatingSystem -Windows -ComputerName myVM -Credential $cred | Set-AzureRmVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest | Add-AzureRmVMNetworkInterface -Id $nic.Id
   ```

   b. Provision the new VM:

   ```powershell
   New-AzureRmVM -ResourceGroupName myResourceGroup -Location WestUS -VM $vmConfig
   ```

5. Add the MSI VM extension using the `-Type "ManagedIdentityExtensionForWindows"` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition:

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```

## Enable MSI on an existing Azure VM

If you need to enable MSI on an existing Virtual Machine:

1. Sign in to Azure using `Login-AzureRmAccount`. Use an account that is associated with the Azure subscription under which you would like to deploy the VM:

   ```powershell
   Login-AzureRmAccount
   ```

2. First retrieve the VM properties using the `Get-AzureRmVM` cmdlet. Then to enable MSI, use the `-IdentityType` switch on the [Update-AzureRmVM](/powershell/module/azurerm.compute/update-azurermvm) cmdlet:

   ```powershell
   $vm = Get-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM
   Update-AzureRmVM -ResourceGroupName myResourceGroup -VM $vm -IdentityType "SystemAssigned"
   ```

3. Add the MSI VM extension using the `-Type "ManagedIdentityExtensionForWindows"` parameter on the [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) cmdlet. The `-Settings` parameter specifies the port used by the OAuth token endpoint for token acquisition. Be sure to specify the correct `-Location` parameter, matching the location of the existing VM:

   ```powershell
   $settings = @{ "port" = 50342 }
   Set-AzureRmVMExtension -ResourceGroupName myResourceGroup -Location WestUS -VMName myVM -Name "ManagedIdentityExtensionForWindows" -Type "ManagedIdentityExtensionForWindows" -Publisher "Microsoft.ManagedIdentity" -TypeHandlerVersion "1.0" -Settings $settings 
   ```

## Remove MSI from an Azure VM

If you have a Virtual Machine that no longer needs an MSI, you can use the `RemoveAzureRmVMExtension` cmdlet to remove MSI from the VM:

1. Use the `-Name "ManagedIdentityExtensionForWindows"` switch with the [Remove-AzureRmVMExtension](/powershell/module/azurerm.compute/remove-azurermvmextension) cmdlet:

```powershell
Remove-AzureRmVMExtension -ResourceGroupName myResourceGroup -Name "ManagedIdentityExtensionForWindows" -VMName myVM
```

## Related content

- [Managed Service Identity overview](msi-overview.md)
- This article is adapted from the [Create a Windows virtual machine with PowerShell](../virtual-machines/windows/quick-create-powershell.md) QuickStart, modified to include MSI-specific instructions. 

Use the following comments section to provide feedback and help us refine and shape our content.
















