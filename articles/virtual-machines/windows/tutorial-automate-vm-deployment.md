---
title: Customize a Windows VM in Azure | Microsoft Docs
description: Learn how to use the custom script extension and Key Vault to customize Windows VMs in Azure 
services: virtual-machines-windows
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 04/19/2017
ms.author: iainfou
---

# How to customize a Windows virtual machine in Azure
To configure virtual machines (VMs) in a quick and consistent manner, some form of automation is typically desired. A common approach to customize a Windows VM is to use [Custom Script Extension for Windows](extensions-customscript.md). This tutorial describes how you can use the Custom Script Extension to install and configure IIS to run a basic website.

The steps in this tutorial can be completed using the latest [Azure PowerShell](/powershell/azureps-cmdlets-docs/) module.


## Custom script extension overview
The Custom Script Extension downloads and executes scripts on Azure VMs. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run time. The Custom Script extension integrates with Azure Resource Manager templates, and can also be run using the Azure CLI, PowerShell, Azure portal, or the Azure Virtual Machine REST API. You can use the Custom Script Extension with both Windows and Linux VMs.


## Create virtual machine
Before you can create a VM, create a resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). The following example creates a resource group named `myRGAutomate` in the `westus` location:

```powershell
New-AzureRmResourceGroup -ResourceGroupName myRGAutomate -Location westus
```

Set an administrator username and password for the VMs with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```powershell
$cred = Get-Credential
```

Now you can create the VM with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). The following example creates the required virtual network components, the OS configuration, and then creates a VM named `myVM`:

```powershell
# Create a subnet configuration
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzureRmVirtualNetwork -ResourceGroupName myRGAutomate -Location westus `
-Name myVnet -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$publicIP = New-AzureRmPublicIpAddress -ResourceGroupName myRGAutomate -Location westus `
-AllocationMethod Static -IdleTimeoutInMinutes 4 -Name "myPublicIP"

# Create an inbound network security group rule for port 3389
$nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
-Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
-DestinationPortRange 3389 -Access Allow

# Create an inbound network security group rule for port 80
$nsgRuleWeb = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleWWW  -Protocol Tcp `
-Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
-DestinationPortRange 80 -Access Allow

# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName myRGAutomate -Location westus `
-Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP,$nsgRuleWeb

# Create a virtual network card and associate with public IP address and NSG
$nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName myRGAutomate -Location westus `
-SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $publicIP.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration
$vmConfig = New-AzureRmVMConfig -VMName myVM -VMSize Standard_DS2 | `
Set-AzureRmVMOperatingSystem -Windows -ComputerName myVM -Credential $cred | `
Set-AzureRmVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest | `
Add-AzureRmVMNetworkInterface -Id $nic.Id

New-AzureRmVM -ResourceGroupName myRGAutomate -Location westus -VM $vmConfig
```

It takes a few minutes for the resources and VM to be created.


## Automate IIS install
Use [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) to install the custom script extension. The extension runs `powershell Add-WindowsFeature Web-Server` to install the IIS webserver and then updates the `Default.htm` page to show the hostname of the VM:

```powershell
Set-AzureRmVMExtension -ResourceGroupName myRGAutomate `
    -ExtensionName IIS `
    -VMName myVM `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.4 `
    -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}' `
    -Location westus
```


## Test web site
Obtain the public IP address of your load balancer with [Get-AzureRmPublicIPAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress). The following example obtains the IP address for `myPublicIP` created earlier:

```powershell
Get-AzureRmPublicIPAddress -ResourceGroupName myRGAutomate -Name myPublicIP | select IpAddress
```

You can then enter the public IP address in to a web browser. The website is be displayed, including the hostname of the VM that the load balancer distributed traffic to as in the following example:

![Running IIS website](./media/tutorial-automate-vm-deployment/running-iis-website.png)


## Inject certificates from Key Vault
This optional section shows how you can securely store certificates in Azure Key Vault and inject them during the VM deployment. Rather than using a custom image that includes the certificates baked-in, this process ensures that the most up-to-date certificates are injected to a VM on first boot. During the process, the certificate never leaves the Azure platform.

Azure Key Vault safeguards cryptographic keys and secrets, such certificates or passwords. Key Vault helps streamline the key management process and enables you to maintain control of keys that access and encrypt your data. This scenario introduces some Key Vault concepts to create and use a certificate, though is not an exhaustive overview on how to use Key Vault.

The following steps show how you can:

- Create an Azure Key Vault
- Generate or upload a certificate to the Key Vault
- Create a secret from the certificate to inject in to a VM
- Create a VM and inject the certificate

### Create an Azure Key Vault
First, create a Key Vault with [New-​Azure​Rm​Key​Vault](/powershell/module/azurerm.keyvault/new-azurermkeyvault) and enable it for use when you deploy a VM. Each Key Vault requires a unique name, and should be all lower case. Replace `<mykeyvault>` in the following example with your own unique Key Vault name:

```powershell
$keyvaultName=<mykeyvault>
New-AzureRmKeyVault -VaultName $keyvaultName `
    -ResourceGroup myRGAutomate `
    -Location westus `
    -EnabledForDeployment
```

### Generate certificate and store in Key Vault
For this tutorial, the following example shows how you can generate a self-signed certificate with [Add-AzureKeyVaultCertificate](/powershell/module/azurerm.keyvault/add-azurekeyvaultcertificate) that uses the default certificate policy from [New-AzureKeyVaultCertificatePolicy](/powershell/module/azurerm.keyvault/new-azurekeyvaultcertificatepolicy). For production use, you should import a valid certificate signed by trusted provider.

```powershell
$policy = New-AzureKeyVaultCertificatePolicy `
    -SubjectName "CN=www.contoso.com" `
    -IssuerName Self `
    -ValidityInMonths 12

Add-AzureKeyVaultCertificate `
    -VaultName $keyvaultName `
    -Name mycert `
    -CertificatePolicy $policy 
```


### Retrieve certificate secret
To use the certificate during the VM create process, obtain the ID of your certificate with [Get-AzureKeyVaultSecret](/powershell/module/azurerm.keyvault/get-azurekeyvaultsecret). You use this secret to obtain the URI of the certificate to inject in to the VM.:

```powershell
$secret = Get-AzureKeyVaultSecret `
    -VaultName $keyvaultName `
    -Name mycert
$secret.id
```


### Create secure VM
Now create a VM with [az vm create](/cli/azure/vm#create). The certificate data is injected from Key Vault with the `--secrets` parameter. As in the previous example, you also pass in the cloud-init config with the `--custom-data` parameter:

Set an administrator username and password for the VMs with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```powershell
$cred = Get-Credential
```

Now you can create the VM with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). The following example creates the required virtual network components, the OS configuration, and then creates a VM named `myVM`:

```powershell
# Create a subnet configuration
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzureRmVirtualNetwork -ResourceGroupName myRGAutomate -Location westus `
-Name myVnet -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$publicIP = New-AzureRmPublicIpAddress -ResourceGroupName myRGAutomate -Location westus `
-AllocationMethod Static -IdleTimeoutInMinutes 4 -Name "myPublicIPSecured"

# Create an inbound network security group rule for port 3389
$nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
-Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
-DestinationPortRange 3389 -Access Allow

# Create an inbound network security group rule for port 80
$nsgRuleWeb = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleHTTPS  -Protocol Tcp `
-Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
-DestinationPortRange 443 -Access Allow

# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName myRGAutomate -Location westus `
-Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP,$nsgRuleWeb

# Create a virtual network card and associate with public IP address and NSG
$nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName myRGAutomate -Location westus `
-SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $publicIP.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration
$vmConfig = New-AzureRmVMConfig -VMName myVMSecured -VMSize Standard_DS2 | `
Set-AzureRmVMOperatingSystem -Windows -ComputerName myVMSecured -Credential $cred | `
Set-AzureRmVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest | `
Add-AzureRmVMNetworkInterface -Id $nic.Id

New-AzureRmVM -ResourceGroupName myRGAutomate -Location westus -VM $vmConfig
```

It takes a few minutes for the VM to be created, the packages to install, and the app to start. When the VM has been created, take note of the `publicIpAddress` displayed by the Azure CLI. This address is used to access the Node.js app via a web browser.


### Test secure web app
Obtain the public IP address of your load balancer with [Get-AzureRmPublicIPAddress](/powershell/resourcemanager/azurerm.network/v3.6.0/get-azurermpublicipaddress). The following example obtains the IP address for `myPublicIP` created earlier:

```powershell
Get-AzureRmPublicIPAddress -ResourceGroupName myRGAutomate -Name myPublicIPSecured | select IpAddress
```

Now you can open a web browser and enter `https://<publicIpAddress>` in the address bar. Provide your own public IP address from the VM create process. You need to accept the security warning if you used a self-signed certificate:

![Accept web browser security warning](./media/tutorial-automate-vm-deployment/browser-warning.png)

Your secured IIS website is then displayed as in the following example:

![View running secure NGINX site](./media/tutorial-automate-vm-deployment/secured-nginx.png)


## Next steps
Tutorial - [Load balance virtual machines](./tutorial-custom-images.md)

Further reading:

- [What is Azure Key Vault?](../../key-vault/key-vault-whatis.md)