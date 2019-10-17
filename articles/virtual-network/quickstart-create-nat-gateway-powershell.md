---
title: 'Quickstart: Create a NAT Gateway - Azure PowerShell'
titlesuffix: Azure NAT service
description: This quickstart shows how to create a NAT Gateway using Azure PowerShell
services: virtual-network
documentationcenter: na
author: asudbring
manager: twooley
Customer intent: I want to create a NAT Gateway for outbound connectivity for my virtual network.
ms.service: virtual-network
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/25/2019
ms.author: allensu

---

# Quickstart: Create a NAT Gateway using Azure PowerShell

This quickstart shows you how to use Azure NAT service and create a NAT gateway to provide outbound connectivity for a virtual machine in Azure. 

>[!NOTE] 
>Azure NAT service is available as Public Preview at this time and available in a limited set of [regions](https://azure.microsoft.com/global-infrastructure/regions/). This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.comsupport/legal/preview-supplemental-terms) for details.


[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can complete this tutorial using Azure cloud shell or run the respective commands locally.  If you have never used Azure cloud shell, [login now](https://shell.azure.com) to go through the initial setup.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Create a resource group

Create a resource group with [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup?view=latest). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **myResourceGroupNAT** in the **eastus2** location:

```azurepowershell-interactive
  New-AzResourceGroup -Name myResourceGroupNAT -Location eastus2
```

## Create the NAT Gateway

You can use one or more public IP address resources or one or more public IP prefixes or both with NAT gateway. We will add a public IP resource and a public IP prefix resource to this scenario to demonstrate.

### Create a public IP address

To access the public Internet, you need one or more public IP addresses for the NAT gateway. Use [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress?view=latest) to create a public IP address resource named **myPublicIP** in **myResourceGroupNAT**. The result of this command will be stored in a variable named **$publicIP** for later use.

```azurepowershell-interactive
  $publicIP = New-AzPublicIpAddress -Name myPublicIP -ResourceGroupName myResourceGroupNAT -AllocationMethod Static -Location eastus2 -sku Standard
```

### Create a public IP prefix

 Use [New-AzPublicIpPrefix](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipprefix?view=latest) to create a public IP prefix resource named **myPublicIPprefix** in **myResourceGroupNAT**.  The result of this command will be stored in a variable named **$publicIPPrefix** for later use.

```azurepowershell-interactive
  $publicIPPrefix = New-AzPublicIpPrefix -Name myPublicIPprefix -ResourceGroupName myResourceGroupNAT -Location eastus2 -PrefixLength 31
```

### Create a NAT gateway resource

This section details how you can create and configure the following components of the NAT service using the NAT gateway resource:
  - A public IP pool and public IP prefix to use for outbound flows translated by the NAT gateway resource.
  - Change the idle timeout from the default of 4 minutes to 10 minutes.

Create a global Azure NAT Gateway with [New-AzNatGateway](https://docs.microsoft.com/powershell/module/az.network/new-aznatgateway) named **myNATgateway** that uses both the public IP address **myPublicIP** and the public IP prefix **myPublicIPprefix** and changes the idle timeout to 10 minutes.  The result of this command will be stored in a variable named **$natGateway** for later use.

```azurepowershell-interactive
  $natGateway = New-AzNatGateway -Name myNATgateway -ResourceGroupName myResourceGroupNAT -PublicIpAddress $publicIP -PublicIpPrefix $publicPrefix -Location eastus2 -Sku Standard -IdleTimeoutInMinutes 10      
  ```

At this point, the NAT gateway is functional and all that is missing is to configure which subnets of a virtual network should use it.

## Configure virtual network

Before you deploy a VM and can use your NAT gateway, we need to create the virtual network and associate the NAT gateway to the subnet of the virtual network.

Create a virtual network named **myVnet** with a subnet named **mySubnet** using [New-AzVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetworksubnetconfig?view=latest) in the **myResourceGroup** using [New-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetwork?view=latest). The IP address space for the virtual network is **192.168.0.0/16** and the subnet within the virtual network is **192.168.0.0/24**.  The result of the commands will be stored in variables named **$subnet** and **$vnet** for later use.

```azurepowershell-interactive
  $subnet = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix "192.168.0.0/24" -NatGateway $natGateway

  $vnet = New-AzVirtualNetwork -Name myVnet -ResourceGroupName myResourceGroupNAT -Location eastus2 -AddressPrefix "192.168.0.0/16" -Subnet $subnet
```

All outbound traffic to Internet destinations is now using the NAT service.  It is not necessary to configure a UDR.

## Create a VM to use the NAT service

We'll now create a VM to use the NAT service.  This VM has a public IP to use as an instance-level Public IP to allow you to access the VM.  NAT service is flow direction aware and will replace the default Internet destination in your subnet. The VM's public IP address won't be used for outbound connections.

### Create public IP for source VM

We create a public IP to be used to access the VM.  Use [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress?view=latest) to create a public IP address resource named **myPublicIPVM** in **myResourceGroupNAT**.  The result of this command will be stored in a variable named **$publicIpVM** for later use.

```azurepowershell-interactive
   $publicIpVM = New-AzPublicIpAddress -Name myPublicIPVM -ResourceGroupName myResourceGroupNAT -AllocationMethod Static -Location eastus2 -sku Standard
```

### Create an NSG and expose SSH endpoint for VM

Because Standard Public IP addresses are 'secure by default', we need to create an NSG to allow inbound access for ssh access. Use [New-AzNetworkSecurityGroup](https://docs.microsoft.com/powershell/module/az.network/new-aznetworksecuritygroup?view=latest) and [New-AzNetworkSecurityRuleConfig](https://docs.microsoft.com/powershell/module/az.network/new-aznetworksecurityruleconfig?view=latest) to create a NSG resource named **myNSG** and a NSG rule for SSH access named **ssh** in **myResourceGroupNAT**.  The result of this command will be stored in variable named **$nsg** for later use.

```azurepowershell-interactive
  $sshrule = New-AzNetworkSecurityRuleConfig -Name ssh -Description "SSH access" -Access Allow -Protocol Tcp -Direction Inbound -Priority 100 -SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 22

  $nsg = New-AzNetworkSecurityGroup -ResourceGroupName myResourceGroupNAT -Name myNSG -Location eastus2 -SecurityRules $sshrule 
```

### Create NIC for VM

Create a network interface with [New-AzNetworkInterface](https://docs.microsoft.com/powershell/module/az.network/new-aznetworkinterface?view=azps-2.8.0) named **myNic** and associate with the Public IP address and the network security group. The result of this command will be stored in a variable named **$nic** for later use.

```azurepowershell-interactive
  $nic = New-AzNetworkInterface -ResourceGroupName myResourceGroupNAT -Name myNic -NetworkSecurityGroupID $nsg.Id -PublicIPAddressID $publicIPVM.Id -SubnetID $vnet.Subnets[0].Id -Location eastus2
```

### Create VM

#### Create SSH key pair

You need an SSH key pair to complete this quickstart. If you already have an SSH key pair, you can skip this step.

Use ssh-keygen to create an SSH key pair.

```azurepowershell-interactive
ssh-keygen -t rsa -b 2048
```
For more detailed information on how to create SSH key pairs, including the use of PuTTy, see [How to use SSH keys with Windows](https://docs.microsoft.com/azure/virtual-machines/linux/ssh-from-windows).

If you create your SSH key pair using the Cloud Shell, it will be stored in a container image in a [storage account that is automatically created by Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/persisting-shell-storage). Don't delete the storage account, or the files share within it, until after you have retrieved your keys or you will lose access to the VM.

#### Create VM Configuration

To create a VM in PowerShell, you create a configuration that has settings like the image to use, size, and authentication options. Then the configuration is used to build the VM.

Define the SSH credentials, OS information, and VM size. In this example, the SSH key is stored in ~/.ssh/id_rsa.pub.

```azurepowershell-interactive
# Define a credential object

$securePassword = ConvertTo-SecureString ' ' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("azureuser", $securePassword)

# Create a virtual machine configuration

$vmConfig = New-AzVMConfig -VMName "myVM" -VMSize "Standard_D1"

Set-AzVMOperatingSystem -VM $vmConfig -Linux -ComputerName "myVM" -Credential $cred -DisablePasswordAuthentication

Set-AzVMSourceImage -VM $vmConfig -PublisherName "Canonical" -Offer "UbuntuServer" -Skus "16.04-LTS" -Version "latest"

Add-AzVMNetworkInterface -VM $vmConfig -Id $nic.Id

# Configure the SSH key

$sshPublicKey = cat ~/.ssh/id_rsa.pub

Add-AzVMSshPublicKey -VM $vmconfig -KeyData $sshPublicKey -Path "/home/azureuser/.ssh/authorized_keys"

```
Combine the configuration definitions to create a VM named **myVM** with [New-AzVM]((https://docs.microsoft.com/powershell/module/az.compute/new-azvm?view=azps-2.8.0)) in **myResourceGroupNAT**.

```azurepowershell-interactive
New-AzVM -ResourceGroupName myResourceGroupNAT -Location eastus2 -VM $vmconfig
```

Wait for the VM to finish deploying then proceed with the rest of the steps.

## Discover the IP address of the VM

First we need to discover the IP address of the VM you've created. To retrieve the public IP address of the VM, use [Get-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/get-azpublicipaddress?view=latest). 

```azurepowershell-interactive
  Get-AzPublicIpAddress -ResourceGroupName myResourceGroupNAT -Name myPublicIPVM | select IpAddress
``` 

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it to access the VM.

### Sign in to VM

The SSH credentials should be stored in your cloud shell from the previous operation.  Open an [Azure Cloud Shell](https://shell.azure.com) in your browser. Use the IP address retrieved in the previous step to SSH to the virtual machine.

```bash
ssh azureuser@<ip-address-destination>
```

You're now ready to use the NAT service.

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=latest) command to remove the resource group and all resources contained within.

```azurepowershell-interactive 
  Remove-AzResourceGroup -Name myResourceGroupNAT
```

## Next steps

In this tutorial, you created a NAT gateway and a VM to use the NAT service. To learn more about Azure NAT service, continue to other tutorials for Azure NAT service.

You can also review metrics in Azure Monitor to see your NAT service operating and diagnose issues such as resource exhaustion of available SNAT ports.  Resource exhaustion of SNAT ports is easily addressed by adding additional public IP address resources or public IP prefix resources or both.

> [!div class="nextstepaction"]

