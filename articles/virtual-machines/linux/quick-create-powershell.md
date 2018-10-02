---
title: Quickstart - Create a Linux VM with Azure PowerShell | Microsoft Docs
description: In this quickstart, you learn how to use Azure PowerShell to create a Linux virtual machine
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/24/2018
ms.author: cynthn
ms.custom: mvc
---

# Quickstart: Create a Linux virtual machine in Azure with PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This quickstart shows you how to use the Azure PowerShell module to deploy a Linux virtual machine (VM) in Azure that runs Ubuntu. To see your VM in action, you then SSH to the VM and install the NGINX web server.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

Finally, a public SSH key with the name *id_rsa.pub* needs to be stored in the *.ssh* directory of your Windows user profile. For detailed information on how to create and use SSH keys, see [Create SSH keys for Azure](ssh-from-windows.md).

## Create a resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed:

```azurepowershell-interactive
New-AzureRmResourceGroup -Name "myResourceGroup" -Location "EastUS"
```

## Create virtual network resources

Create a virtual network, subnet, and a public IP address. These resources are used to provide network connectivity to the VM and connect it to the internet:

```azurepowershell-interactive
# Create a subnet configuration
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name "mySubnet" -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzureRmVirtualNetwork -ResourceGroupName "myResourceGroup" -Location "EastUS" `
-Name "myVNET" -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$pip = New-AzureRmPublicIpAddress -ResourceGroupName "myResourceGroup" -Location "EastUS" `
-AllocationMethod Static -IdleTimeoutInMinutes 4 -Name "mypublicdns$(Get-Random)"
```

Create an Azure Network Security Group and traffic rule. The Network Security Group secures the VM with inbound and outbound rules. In the following example, an inbound rule is created for TCP port 22 that allows SSH connections. To allow incoming web traffic, an inbound rule for TCP port 80 is also created.

```azurepowershell-interactive
# Create an inbound network security group rule for port 22
$nsgRuleSSH = New-AzureRmNetworkSecurityRuleConfig -Name "myNetworkSecurityGroupRuleSSH"  -Protocol "Tcp" `
-Direction "Inbound" -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
-DestinationPortRange 22 -Access "Allow"

# Create an inbound network security group rule for port 80
$nsgRuleWeb = New-AzureRmNetworkSecurityRuleConfig -Name "myNetworkSecurityGroupRuleWWW"  -Protocol "Tcp" `
-Direction "Inbound" -Priority 1001 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
-DestinationPortRange 80 -Access "Allow"

# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName "myResourceGroup" -Location "EastUS" `
-Name "myNetworkSecurityGroup" -SecurityRules $nsgRuleSSH,$nsgRuleWeb
```

Create a virtual network interface card (NIC) with [New-AzureRmNetworkInterface](/powershell/module/azurerm.network/new-azurermnetworkinterface). The virtual NIC connects the VM to a subnet, Network Security Group, and public IP address.

```azurepowershell-interactive
# Create a virtual network card and associate with public IP address and NSG
$nic = New-AzureRmNetworkInterface -Name "myNic" -ResourceGroupName "myResourceGroup" -Location "EastUS" `
-SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id
```

## Create a virtual machine

A virtual machine configuration includes the settings that are used when a VM is deployed such as a VM image, size, and authentication options. Define the SSH credentials, OS information, and VM size as follows:

```azurepowershell-interactive
# Define a credential object
$securePassword = ConvertTo-SecureString ' ' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("azureuser", $securePassword)

# Create a virtual machine configuration
$vmConfig = New-AzureRmVMConfig -VMName "myVM" -VMSize "Standard_D1" | `
Set-AzureRmVMOperatingSystem -Linux -ComputerName "myVM" -Credential $cred -DisablePasswordAuthentication | `
Set-AzureRmVMSourceImage -PublisherName "Canonical" -Offer "UbuntuServer" -Skus "16.04-LTS" -Version "latest" | `
Add-AzureRmVMNetworkInterface -Id $nic.Id

# Configure SSH Keys
$sshPublicKey = Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"
Add-AzureRmVMSshPublicKey -VM $vmconfig -KeyData $sshPublicKey -Path "/home/azureuser/.ssh/authorized_keys"
```

Now, combine the previous configuration definitions to create with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm):

```azurepowershell-interactive
New-AzureRmVM -ResourceGroupName "myResourceGroup" -Location eastus -VM $vmConfig
```

## Connect to virtual machine

After the deployment has completed, SSH to the VM. To see your VM in action, the NGINX web server is then installed.

To see the public IP address of the VM, use the [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) cmdlet:

```azurepowershell-interactive
Get-AzureRmPublicIpAddress -ResourceGroupName "myResourceGroup" | Select "IpAddress"
```

Use an SSH client to connect to the VM. You can use the Azure Cloud Shell from a web browser, or if you use Windows, you can use [Putty](ssh-from-windows.md) or the [Windows Subsystem for Linux](/windows/wsl/install-win10). Provide the public IP address of your VM:

```bash
ssh azureuser@IpAddress
```

When prompted, the login user name is *azureuser*. If a passphrase is used with your SSH keys, you need to enter that when prompted.

## Install web server

To see your VM in action, install the NGINX web server. To update package sources and install the latest NGINX package, run the following commands from your SSH session:

```bash
# update packages
sudo apt-get -y update

# install NGINX
sudo apt-get -y install nginx
```

When done, `exit` the SSH session

## View the web server in action

With NGINX installed and port 80 now open on your VM from the Internet, use a web browser of your choice to view the default NGINX welcome page. Use the public IP address of your VM obtained in a previous step. The following example shows the default NGINX web site:

![NGINX default site](./media/quick-create-cli/nginx.png)

## Clean up resources

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) cmdlet to remove the resource group, VM, and all related resources:

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name "myResourceGroup"
```

## Next steps

In this quickstart, you deployed a simple virtual machine, created a Network Security Group and rule, and installed a basic web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.

> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
