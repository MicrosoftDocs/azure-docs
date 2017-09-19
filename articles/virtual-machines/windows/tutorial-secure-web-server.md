
---
title: Secure IIS with SSL certificates in Azure | Microsoft Docs
description: Learn how to secure the IIS web server with SSL certificates on a Windows VM in Azure 
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
ms.date: 07/14/2017
ms.author: iainfou
ms.custom: mvc
---

# Secure IIS web server with SSL certificates on a Windows virtual machine in Azure
To secure web servers, a Secure Sockets Later (SSL) certificate can be used to encrypt web traffic. These SSL certificates can be stored in Azure Key Vault, and allow secure deployments of certificates to Windows virtual machines (VMs) in Azure. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create an Azure Key Vault
> * Generate or upload a certificate to the Key Vault
> * Create a VM and install the IIS web server
> * Inject the certificate into the VM and configure IIS with an SSL binding

This tutorial requires the Azure PowerShell module version 3.6 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).


## Overview
Azure Key Vault safeguards cryptographic keys and secrets, such certificates or passwords. Key Vault helps streamline the certificate management process and enables you to maintain control of keys that access those certificates. You can create a self-signed certificate inside Key Vault, or upload an existing, trusted certificate that you already own.

Rather than using a custom VM image that includes certificates baked-in, you inject certificates into a running VM. This process ensures that the most up-to-date certificates are installed on a web server during deployment. If you renew or replace a certificate, you don't also have to create a new custom VM image. The latest certificates are automatically injected as you create additional VMs. During the whole process, the certificates never leave the Azure platform or are exposed in a script, command-line history, or template.


## Create an Azure Key Vault
Before you can create a Key Vault and certificates, create a resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). The following example creates a resource group named *myResourceGroupSecureWeb* in the *East US* location:

```powershell-interactive
$resourceGroup = "myResourceGroupSecureWeb"
$location = "East US"
New-AzureRmResourceGroup -ResourceGroupName $resourceGroup -Location $location
```

Next, create a Key Vault with [New-​Azure​Rm​Key​Vault](/powershell/module/azurerm.keyvault/new-azurermkeyvault). Each Key Vault requires a unique name, and should be all lower case. Replace `<mykeyvault>` in the following example with your own unique Key Vault name:

```powershell-interactive
$keyvaultName="<mykeyvault>"
New-AzureRmKeyVault -VaultName $keyvaultName `
    -ResourceGroup $resourceGroup `
    -Location $location `
    -EnabledForDeployment
```

## Generate a certificate and store in Key Vault
For production use, you should import a valid certificate signed by trusted provider with [Import-​Azure​Key​Vault​Certificate](/powershell/module/azurerm.keyvault/import-azurekeyvaultcertificate). For this tutorial, the following example shows how you can generate a self-signed certificate with [Add-AzureKeyVaultCertificate](/powershell/module/azurerm.keyvault/add-azurekeyvaultcertificate) that uses the default certificate policy from [New-AzureKeyVaultCertificatePolicy](/powershell/module/azurerm.keyvault/new-azurekeyvaultcertificatepolicy). 

```powershell-interactive
$policy = New-AzureKeyVaultCertificatePolicy `
    -SubjectName "CN=www.contoso.com" `
    -SecretContentType "application/x-pkcs12" `
    -IssuerName Self `
    -ValidityInMonths 12

Add-AzureKeyVaultCertificate `
    -VaultName $keyvaultName `
    -Name "mycert" `
    -CertificatePolicy $policy 
```


## Create a virtual machine
Set an administrator username and password for the VM with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```powershell-interactive
$cred = Get-Credential
```

Now you can create the VM with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). The following example creates the required virtual network components, the OS configuration, and then creates a VM named *myVM*:

```powershell-interactive
# Create a subnet configuration
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig `
    -Name mySubnet `
    -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzureRmVirtualNetwork `
    -ResourceGroupName $resourceGroup `
    -Location $location `
    -Name "myVnet" `
    -AddressPrefix 192.168.0.0/16 `
    -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$publicIP = New-AzureRmPublicIpAddress `
    -ResourceGroupName $resourceGroup `
    -Location $location `
    -AllocationMethod Static `
    -IdleTimeoutInMinutes 4 `
    -Name "myPublicIP"

# Create an inbound network security group rule for port 3389
$nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig `
    -Name "myNetworkSecurityGroupRuleRDP"  `
    -Protocol "Tcp" `
    -Direction "Inbound" `
    -Priority 1000 `
    -SourceAddressPrefix * `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange 3389 `
    -Access Allow

# Create an inbound network security group rule for port 443
$nsgRuleWeb = New-AzureRmNetworkSecurityRuleConfig `
    -Name "myNetworkSecurityGroupRuleWWW"  `
    -Protocol "Tcp" `
    -Direction "Inbound" `
    -Priority 1001 `
    -SourceAddressPrefix * `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange 443 `
    -Access Allow

# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup `
    -ResourceGroupName $resourceGroup `
    -Location $location `
    -Name "myNetworkSecurityGroup" `
    -SecurityRules $nsgRuleRDP,$nsgRuleWeb

# Create a virtual network card and associate with public IP address and NSG
$nic = New-AzureRmNetworkInterface `
    -Name "myNic" `
    -ResourceGroupName $resourceGroup `
    -Location $location `
    -SubnetId $vnet.Subnets[0].Id `
    -PublicIpAddressId $publicIP.Id `
    -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration
$vmConfig = New-AzureRmVMConfig -VMName "myVM" -VMSize "Standard_DS2" | `
Set-AzureRmVMOperatingSystem -Windows -ComputerName "myVM" -Credential $cred | `
Set-AzureRmVMSourceImage -PublisherName "MicrosoftWindowsServer" `
    -Offer "WindowsServer" -Skus "2016-Datacenter" -Version "latest" | `
Add-AzureRmVMNetworkInterface -Id $nic.Id

# Create virtual machine
New-AzureRmVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig

# Use the Custom Script Extension to install IIS
Set-AzureRmVMExtension -ResourceGroupName $resourceGroup `
    -ExtensionName "IIS" `
    -VMName "myVM" `
    -Location $location `
    -Publisher "Microsoft.Compute" `
    -ExtensionType "CustomScriptExtension" `
    -TypeHandlerVersion 1.8 `
    -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server -IncludeManagementTools"}'
```

It takes a few minutes for the VM to be created. The last step uses the Azure Custom Script Extension to install the IIS web server with [Set-AzureRmVmExtension](/powershell/module/azurerm.compute/set-azurermvmextension).


## Add a certificate to VM from Key Vault
To add the certificate from Key Vault to a VM, obtain the ID of your certificate with [Get-AzureKeyVaultSecret](/powershell/module/azurerm.keyvault/get-azurekeyvaultsecret). Add the certificate to the VM with [Add-AzureRmVMSecret](/powershell/module/azurerm.compute/add-azurermvmsecret):

```powershell-interactive
$certURL=(Get-AzureKeyVaultSecret -VaultName $keyvaultName -Name "mycert").id

$vm=Get-AzureRMVM -ResourceGroupName $resourceGroup -Name "myVM"
$vaultId=(Get-AzureRmKeyVault -ResourceGroupName $resourceGroup -VaultName $keyVaultName).ResourceId
$vm = Add-AzureRmVMSecret -VM $vm -SourceVaultId $vaultId -CertificateStore "My" -CertificateUrl $certURL

Update-AzureRmVM -ResourceGroupName $resourceGroup -VM $vm
```


## Configure IIS to use the certificate
Use the Custom Script Extension again with [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) to update the IIS configuration. This update applies the certificate injected from Key Vault to IIS and configures the web binding:

```powershell-interactive
$PublicSettings = '{
    "fileUris":["https://raw.githubusercontent.com/iainfoulds/azure-samples/master/secure-iis.ps1"],
    "commandToExecute":"powershell -ExecutionPolicy Unrestricted -File secure-iis.ps1"
}'

Set-AzureRmVMExtension -ResourceGroupName $resourceGroup `
    -ExtensionName "IIS" `
    -VMName "myVM" `
    -Location $location `
    -Publisher "Microsoft.Compute" `
    -ExtensionType "CustomScriptExtension" `
    -TypeHandlerVersion 1.8 `
    -SettingString $publicSettings
```


### Test the secure web app
Obtain the public IP address of your VM with [Get-AzureRmPublicIPAddress](/powershell/resourcemanager/azurerm.network/get-azurermpublicipaddress). The following example obtains the IP address for `myPublicIP` created earlier:

```powershell-interactive
Get-AzureRmPublicIPAddress -ResourceGroupName $resourceGroup -Name "myPublicIP" | select "IpAddress"
```

Now you can open a web browser and enter `https://<myPublicIP>` in the address bar. To accept the security warning if you used a self-signed certificate, select **Details** and then **Go on to the webpage**:

![Accept web browser security warning](./media/tutorial-secure-web-server/browser-warning.png)

Your secured IIS website is then displayed as in the following example:

![View running secure IIS site](./media/tutorial-secure-web-server/secured-iis.png)


## Next steps

In this tutorial, you secured an IIS web server with an SSL certificate stored in Azure Key Vault. You learned how to:

> [!div class="checklist"]
> * Create an Azure Key Vault
> * Generate or upload a certificate to the Key Vault
> * Create a VM and install the IIS web server
> * Inject the certificate into the VM and configure IIS with an SSL binding

Follow this link to see pre-built virtual machine script samples.

> [!div class="nextstepaction"]
> [Windows virtual machine script samples](./powershell-samples.md)