---
title: 'Tutorial: Create and test a NAT gateway - Azure PowerShell'
titlesuffix: Azure NAT service
description: This tutorial shows how to create a NAT gateway using the Azure PowerShell and test the NAT service
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
Customer intent: I want to test a NAT gateway for outbound connectivity for my virtual network.
ms.service: virtual-network
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/04/2019
ms.author: allensu
---
# Tutorial: Create a NAT gateway using Azure PowerShell and test the NAT service

This tutorial shows you how to use Azure NAT service and create a NAT gateway. NAT gateway provides outbound connectivity for virtual machines in Azure. To test the NAT gateway, you deploy a source and destination virtual machine. You'll test the NAT gateway by making outbound connections to a public IP address. These connections will come from the source to the destination virtual machine. This tutorial deploys source and destination in two different virtual networks in the same resource group for simplicity.

>[!NOTE] 
>Azure NAT service is available as Public Preview at this time and available in a limited set of [regions](https://azure.microsoft.com/global-infrastructure/regions/). This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms) for details.


[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You can complete this tutorial using Azure cloud shell or run the respective commands locally.  If you have never used Azure cloud shell, you should [sign in now](https://shell.azure.com).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Create a resource group

Create a resource group with [az group create](https://docs.microsoft.com/cli/azure/group). An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named **myResourceGroupNAT** in the **eastus2** location:


```azurepowershell-interactive
  New-AzResourceGroup -Name myResourceGroupNAT -Location eastus2
```

## Create the NAT gateway

### Create a public IP address

To access the Internet, you need one or more public IP addresses for the NAT gateway. Use [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress?view=latest) to create a public IP address resource named **myPublicIPsource** in **myResourceGroupNAT**. The result of this command will be stored in a variable named **$publicIP** for later use.

```azurepowershell-interactive
  $publicIPsource = New-AzPublicIpAddress -Name myPublicIPsource -ResourceGroupName myResourceGroupNAT -AllocationMethod Static -Location eastus2 -Sku Standard
```

### Create a public IP prefix

 Use [New-AzPublicIpPrefix](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipprefix?view=latest) to create a public IP prefix resource named **myPublicIPprefixsource** in **myResourceGroupNAT**.  The result of this command will be stored in a variable named **$publicIPPrefix** for later use.

```azurepowershell-interactive
  $publicIPPrefixsource = New-AzPublicIpPrefix -Name myPublicIPprefixsource -ResourceGroupName myResourceGroupNAT -Location eastus2 -PrefixLength 31
```

### Create a NAT gateway resource

This section details how you can create and configure the following components of the NAT service using the NAT gateway resource:
  - A public IP pool and public IP prefix to use for outbound flows translated by the NAT gateway resource.
  - Change the idle timeout from the default of 4 minutes to 10 minutes.

Create a global Azure NAT gateway with [New-AzNatGateway](https://docs.microsoft.com/powershell/module/az.network/new-aznatgateway). The result of this command will create a gateway resource named **myNATgateway** that uses the public IP address **myPublicIPsource** and the public IP prefix **myPublicIPprefixsource**. The idle timeout is set to 10 minutes.  The result of this command will be stored in a variable named **$natGateway** for later use.

```azurepowershell-interactive
  $natGateway = New-AzNatGateway -Name myNATgateway -ResourceGroupName myResourceGroupNAT -PublicIpAddress $publicIPsource -PublicIpPrefix $publicIPPrefixsource -Location eastus2 -Sku Standard -IdleTimeoutInMinutes 10      
  ```

At this point, the NAT gateway is functional and all that is missing is to configure which subnets of a virtual network should use it.

## Prepare the source for outbound traffic

We'll guide you through setup of a full test environment. You'll set up a test using open source tools to verify the NAT gateway. We'll start with the source, which will use the NAT gateway we created previously.

### Configure virtual network for source

Create the virtual network and associate the subnet to the gateway.

Create a virtual network named **myVnetsource** with a subnet named **mySubnetsource** using [New-AzVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetworksubnetconfig?view=latest) in the **myResourceGroupNAT** using [New-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetwork?view=latest). The IP address space for the virtual network is **192.168.0.0/16**. The subnet within the virtual network is **192.168.0.0/24**.  The result of the commands will be stored in variables named **$subnetsource** and **$vnetsource** for later use.

```azurepowershell-interactive
  $subnetsource = New-AzVirtualNetworkSubnetConfig -Name mySubnetsource -AddressPrefix "192.168.0.0/24" -NatGateway $natGateway

  $vnetsource = New-AzVirtualNetwork -Name myVnetsource -ResourceGroupName myResourceGroupNAT -Location eastus2 -AddressPrefix "192.168.0.0/16" -Subnet $subnet
```

All outbound traffic to Internet destinations is now using the NAT service.  It isn't necessary to configure a UDR.

Before we can test the NAT gateway, we need to create a source VM.  We'll assign a public IP address resource as an instance-level Public IP to access this VM from the outside. This address is only used to access it for the test.  We'll demonstrate how the NAT service takes precedence over other outbound options.

You could also create this VM without a public IP and create another VM to use as a jumpbox without a public IP as an exercise.

### Create public IP for source VM

We create a public IP to be used to access the VM.  Use [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress?view=latest) to create a public IP address resource named **myPublicIPVM** in **myResourceGroupNAT**.  The result of this command will be stored in a variable named **$publicIpsourceVM** for later use.

```azurepowershell-interactive
   $publicIpsourceVM = New-AzPublicIpAddress -Name myPublicIpsourceVM -ResourceGroupName myResourceGroupNAT -AllocationMethod Static -Location eastus2 -sku Standard
```

### Create an NSG and expose SSH endpoint for VM

Because Standard Public IP addresses are 'secure by default', we create an NSG to allow inbound access for ssh. NAT service is flow direction aware. This NSG won't be used for outbound once NAT gateway is configured on the same subnet. Use [New-AzNetworkSecurityGroup](https://docs.microsoft.com/powershell/module/az.network/new-aznetworksecuritygroup?view=latest) to create an NSG resource named **myNSGsource**. Use [New-AzNetworkSecurityRuleConfig](https://docs.microsoft.com/powershell/module/az.network/new-aznetworksecurityruleconfig?view=latest) to create an NSG rule for SSH access named **ssh** in **myResourceGroupNAT**. The result of this command will be stored in variable named **$nsgsource** for later use.

```azurepowershell-interactive
  $sshrule = New-AzNetworkSecurityRuleConfig -Name ssh -Description "SSH access" -Access Allow -Protocol Tcp -Direction Inbound -Priority 100 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 22

  $nsgsource = New-AzNetworkSecurityGroup -ResourceGroupName myResourceGroupNAT -Name myNSGsource -Location eastus2 -SecurityRules $sshrule 
```

### Create NIC for source VM

Create a network interface with [New-AzNetworkInterface](https://docs.microsoft.com/powershell/module/az.network/new-aznetworkinterface?view=azps-2.8.0) named **myNicsource**. This command will associate the Public IP address and the network security group. The result of this command will be stored in a variable named **$nicsource** for later use.

```azurepowershell-interactive
  $nicsource = New-AzNetworkInterface -ResourceGroupName myResourceGroupNAT -Name myNicsource -NetworkSecurityGroupID $nsgsource.Id -PublicIPAddressID $publicIPVMsource.Id -SubnetID $vnetsource.Subnets[0].Id -Location eastus2
```

### Create a source VM

#### Create SSH key pair

You need an SSH key pair to complete this quickstart. If you already have an SSH key pair, you can skip this step.

Use ssh-keygen to create an SSH key pair.

```azurepowershell-interactive
ssh-keygen -t rsa -b 2048
```
For more detailed information on how to create SSH key pairs, including the use of PuTTy, see [How to use SSH keys with Windows](https://docs.microsoft.com/azure/virtual-machines/linux/ssh-from-windows).

If you create the SSH key pair using the Cloud Shell, the key pair is stored in a container image. This [storage account is automatically created](https://docs.microsoft.com/azure/cloud-shell/persisting-shell-storage). Don't delete the storage account, or the file share within, until after you've retrieved your keys.

#### Create VM Configuration

To create a VM in PowerShell, you create a configuration that has settings like the image to use, size, and authentication options. Then the configuration is used to build the VM.

Define the SSH credentials, OS information, and VM size. In this example, the SSH key is stored in ~/.ssh/id_rsa.pub.

```azurepowershell-interactive
# Define a credential object

$securePassword = ConvertTo-SecureString ' ' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("azureuser", $securePassword)

# Create a virtual machine configuration

$vmConfigsource = New-AzVMConfig -VMName "myVMsource" -VMSize "Standard_D1"

Set-AzVMOperatingSystem -VM $vmConfigsource -Linux -ComputerName "myVMsource" -Credential $cred -DisablePasswordAuthentication

Set-AzVMSourceImage -VM $vmConfigsource -PublisherName "Canonical" -Offer "UbuntuServer" -Skus "16.04-LTS" -Version "latest"

Add-AzVMNetworkInterface -VM $vmConfigsource -Id $nicsource.Id

# Configure the SSH key

$sshPublicKey = cat ~/.ssh/id_rsa.pub

Add-AzVMSshPublicKey -VM $vmConfigsource -KeyData $sshPublicKey -Path "/home/azureuser/.ssh/authorized_keys"

```
Combine the configuration definitions to create a VM named **myVMsource** with [New-AzVM]((https://docs.microsoft.com/powershell/module/az.compute/new-azvm?view=azps-2.8.0)) in **myResourceGroupNAT**.

```azurepowershell-interactive
New-AzVM -ResourceGroupName myResourceGroupNAT -Location eastus2 -VM $vmConfigsource
```

While the command will return immediately, it may take a few minutes for the VM to get deployed.

## Prepare destination for outbound traffic

We'll now create a destination for the outbound traffic translated by the NAT service to allow you to test it.

### Configure virtual network for destination

We need to create a virtual network where the destination virtual machine will be.  These commands are the same steps as for the source VM. Small changes have been added to expose the destination endpoint.

Create a virtual network named **myVnetdestination** with a subnet named **mySubnetdestination** using [New-AzVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetworksubnetconfig?view=latest) in the **myResourceGroupNAT** using [New-AzVirtualNetwork](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetwork?view=latest). The IP address space for the virtual network is **192.168.0.0/16**. The subnet within the virtual network is **192.168.0.0/24**.  The result of the commands will be stored in variables named **$subnetdestination** and **$vnetdestination** for later use.

```azurepowershell-interactive
  $subnetdestination = New-AzVirtualNetworkSubnetConfig -Name mySubnetdestination -AddressPrefix "192.168.0.0/24"

  $vnetdestination = New-AzVirtualNetwork -Name myVnetdestination -ResourceGroupName myResourceGroupNAT -Location eastus2 -AddressPrefix "192.168.0.0/16" -Subnet $subnetdestination
```

### Create public IP for destination VM

We create a public IP to be used to access the source VM.  Use [New-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress?view=latest) to create a public IP address resource named **myPublicIPdestinationVM** in **myResourceGroupNAT**.  The result of this command will be stored in a variable named **$publicIpdestinationVM** for later use.

```azurepowershell-interactive
   $publicIpdestinationVM = New-AzPublicIpAddress -Name myPublicIpdestinationVM -ResourceGroupName myResourceGroupNAT -AllocationMethod Static -Location eastus2 -Sku Standard
```

### Create an NSG and expose SSH and HTTP endpoint for VM

Standard Public IP addresses are 'secure by default', we create an NSG to allow inbound access for ssh. Use [New-AzNetworkSecurityGroup](https://docs.microsoft.com/powershell/module/az.network/new-aznetworksecuritygroup?view=latest) to create an NSG resource named **myNSGdestination**. Use [New-AzNetworkSecurityRuleConfig](https://docs.microsoft.com/powershell/module/az.network/new-aznetworksecurityruleconfig?view=latest) to create an NSG rule for SSH access named **ssh**.  Use [New-AzNetworkSecurityRuleConfig](https://docs.microsoft.com/powershell/module/az.network/new-aznetworksecurityruleconfig?view=latest) to create an NSG rule for HTTP access named **http**. Both rules will be created in **myResourceGroupNAT**. The result of this command will be stored in a variable named **$nsgdestination** for later use.

```azurepowershell-interactive
  $sshrule = New-AzNetworkSecurityRuleConfig -Name ssh -Description "SSH access" -Access Allow -Protocol Tcp -Direction Inbound -Priority 100 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 22

  $httprule = New-AzNetworkSecurityRuleConfig -Name http -Description "HTTP access" -Access Allow -Protocol Tcp -Direction Inbound -Priority 101 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 80

  $nsgdestination = New-AzNetworkSecurityGroup -ResourceGroupName myResourceGroupNAT -Name myNSGdestination -Location eastus2 -SecurityRules $sshrule,$httprule
```

### Create NIC for destination VM

Create a network interface with [New-AzNetworkInterface](https://docs.microsoft.com/powershell/module/az.network/new-aznetworkinterface?view=azps-2.8.0) named **myNicdestination**. This command will associate with the Public IP address and the network security group. The result of this command will be stored in a variable named **$nicdestination** for later use.

```azurepowershell-interactive
  $nicdestination = New-AzNetworkInterface -ResourceGroupName myResourceGroupNAT -Name myNicdestination -NetworkSecurityGroupID $nsgdestination.Id -PublicIPAddressID $publicIPdestinationVM.Id -SubnetID $vnetdestination.Subnets[0].Id -Location eastus2
```

### Create a destination VM

#### Create VM Configuration

To create a VM in PowerShell, you create a configuration that has settings like the image to use, size, and authentication options. Then the configuration is used to build the VM.

Define the SSH credentials, OS information, and VM size. In this example, the SSH key is stored in ~/.ssh/id_rsa.pub.

```azurepowershell-interactive
# Define a credential object

$securePassword = ConvertTo-SecureString ' ' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("azureuser", $securePassword)

# Create a virtual machine configuration

$vmConfigdestination = New-AzVMConfig -VMName "myVMdestination" -VMSize "Standard_D1"

Set-AzVMOperatingSystem -VM $vmConfigdestination -Linux -ComputerName "myVMdestination" -Credential $cred -DisablePasswordAuthentication

Set-AzVMSourceImage -VM $vmConfigdestination -PublisherName "Canonical" -Offer "UbuntuServer" -Skus "16.04-LTS" -Version "latest"

Add-AzVMNetworkInterface -VM $vmConfigdestination -Id $nicdestination.Id

# Configure the SSH key

$sshPublicKey = cat ~/.ssh/id_rsa.pub

Add-AzVMSshPublicKey -VM $vmConfigdestination -KeyData $sshPublicKey -Path "/home/azureuser/.ssh/authorized_keys"

```
Combine the configuration definitions to create a VM named **myVMdestination** with [New-AzVM]((https://docs.microsoft.com/powershell/module/az.compute/new-azvm?view=azps-2.8.0)) in **myResourceGroupNAT**.

```azurepowershell-interactive
New-AzVM -ResourceGroupName myResourceGroupNAT -Location eastus2 -VM $vmConfigdestination
```

While the command will return immediately, it may take a few minutes for the VM to get deployed.

## Prepare a web server and test payload on destination VM

First we need to discover the IP address of the destination VM.  To get the public IP address of the VM, use [Get-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/get-azpublicipaddress?view=latest). 

```azurepowershell-interactive
  Get-AzPublicIpAddress -ResourceGroupName myResourceGroupNAT -Name myPublicIPdestinationVM | select IpAddress
``` 

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it in subsequent steps. Indicate this is the destination virtual machine.

### Sign in to destination VM

The SSH credentials should be stored in your cloud shell from the previous operation.  Open an [Azure Cloud Shell](https://shell.azure.com) in your browser. Use the IP address retrieved in the previous step to SSH to the virtual machine. 

```bash
ssh azureuser@<ip-address-destination>
```

Copy and paste the following commands once you've logged in.  

```bash
sudo apt-get -y update && \
sudo apt-get -y upgrade && \
sudo apt-get -y dist-upgrade && \
sudo apt-get -y autoremove && \
sudo apt-get -y autoclean && \
sudo apt-get -y install nginx && \
sudo ln -sf /dev/null /var/log/nginx/access.log && \
sudo touch /var/www/html/index.html && \
sudo rm /var/www/html/index.nginx-debian.html && \
sudo dd if=/dev/zero of=/var/www/html/100k bs=1024 count=100
```

These commands will update your virtual machine, install nginx, and create a 100-KBytes file. This file will be retrieved from the source VM using the NAT service.

Close the SSH session with the destination VM.

## Prepare test on source VM

First we need to discover the IP address of the source VM.  To get the public IP address of the VM, use [Get-AzPublicIpAddress](https://docs.microsoft.com/powershell/module/az.network/get-azpublicipaddress?view=latest). 

```azurepowershell-interactive
  Get-AzPublicIpAddress -ResourceGroupName myResourceGroupNAT -Name myPublicIPsourceVM | select IpAddress
``` 

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it in subsequent steps. Indicate this is the source virtual machine.

### Log into source VM

Again, the SSH credentials are stored in cloud shell. Open a new tab for [Azure Cloud Shell](https://shell.azure.com) in your browser.  Use the IP address retrieved in the previous step to SSH to the virtual machine. 

```bash
ssh azureuser@<ip-address-source>
```

Copy and paste the following commands to prepare for testing the NAT service.

```bash
sudo apt-get -y update && \
sudo apt-get -y upgrade && \
sudo apt-get -y dist-upgrade && \
sudo apt-get -y autoremove && \
sudo apt-get -y autoclean && \
sudo apt-get install -y nload golang && \
echo 'export GOPATH=${HOME}/go' >> .bashrc && \
echo 'export PATH=${PATH}:${GOPATH}/bin' >> .bashrc && \
. ~/.bashrc &&
go get -u github.com/rakyll/hey

```

These commands will update your virtual machine, install go, install [hey](https://github.com/rakyll/hey) from GitHub, and update your shell environment.

You're now ready to test NAT service.

## Validate NAT service

While logged into the source VM, you can use **curl** and **hey** to generate requests to the destination IP address.

Use curl to retrieve the 100-KBytes file.  Replace **\<ip-address-destination>** in the example below with the destination IP address you have previously copied.  The **--output** parameter indicates that the retrieved file will be discarded.

```bash
curl http://<ip-address-destination>/100k --output /dev/null
```

You can also generate a series of requests using **hey**. Again, replace **\<ip-address-destination>** with the destination IP address you have previously copied.

```bash
hey -n 100 -c 10 -t 30 --disable-keepalive http://<ip-address-destination>/100k
```

This command will generate 100 requests, 10 concurrently, with a timeout of 30 seconds. The TCP connection won't be reused.  Each request will retrieve 100 Kbytes.  At the end of the run, **hey** will report some statistics about how well the NAT service did.

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/remove-azresourcegroup?view=latest) command to remove the resource group and all resources contained within.

```azurepowershell-interactive 
  Remove-AzResourceGroup -Name myResourceGroupNAT
```

## Next steps
In this tutorial, you created a NAT gateway. You created a source and destination VM, and tested the NAT gateway. To learn more about Azure NAT service, continue to other tutorials for Azure NAT service.

You can also review metrics in Azure Monitor to see your NAT service is operating. You can diagnose issues such as resource exhaustion of available SNAT ports. Resource exhaustion of SNAT ports is addressed by adding an additional public IP address and/or public IP prefix.

> [!div class="nextstepaction"]

