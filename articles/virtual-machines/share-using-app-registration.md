---
title: "Share gallery images across tenants using an app registration"
description: Learn how to share Azure Compute Gallery images across Azure tenants using an app registration.
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.date: 02/02/2023
ms.reviewer: cynthn
ms.custom: devx-track-azurecli devx-track-azurepowershell
author: sandeepraichura
ms.author: saraic
---
# Share gallery VM images across Azure tenants using an app registration

With Azure Compute Galleries, you can share an image to another organization by using an app registration. For more information about other sharing options, see the [Share the gallery](./share-gallery.md).

[!INCLUDE [virtual-machines-share-images-across-tenants](./includes/virtual-machines-share-images-across-tenants.md)]

> [!IMPORTANT]
> You cannot use the portal to deploy a VM from an image in another azure tenant. To create a VM from an image shared between tenants, you must use the Azure CLI or PowerShell.

## Create the VM

You will need the following before creating a VM from an image shared to you using an app registration:
- The tenant IDs from both the source subscription and the subscription where you want to create the VM. 
- The client ID of the app registration and the secret.
- The image ID of the image that you want to use.
### [CLI](#tab/cli)

Sign in the service principal for tenant 1 using the appID, the app key, and the ID of tenant 1. You can use `az account show --query "tenantId"` to get the tenant IDs if needed.

In this example, we are showing how to create a VM from a generalized image. If you are using a specialized image, see [Create a VM using a specialized image version](vm-specialized-image-version.md).

```azurecli-interactive

tenant1='<ID for tenant 1>'
tenant2='<ID for tenant 2>'
appid='<client ID of the app registration>'
secret='<secret from the app registration>'

az account clear
az login --service-principal -u $appid -p $secret --tenant $tenant1
az account get-access-token 
```
 
Sign in the service principal for tenant 2 using the appID, the app key, and the ID of tenant 2:

```azurecli-interactive
az login --service-principal -u $appid -p $secret --tenant $tenant2
az account get-access-token
```

Create the VM. Replace the information in the example with your own.

```azurecli-interactive
imageid="<ID of the image that you want to use>"
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image $imageid \
  --admin-username azureuser \
  --generate-ssh-keys
```


### [PowerShell](#tab/powershell)

Sign in to both tenants using the application ID, secret and tenant ID.

```azurepowershell-interactive
$applicationId = '<App ID>'
$secret = <Secret> | ConvertTo-SecureString -AsPlainText -Force
$tenant1 = "<Tenant 1 ID>"
$tenant2 = "<Tenant 2 ID>"
$cred = New-Object -TypeName PSCredential -ArgumentList $applicationId, $secret
Clear-AzContext
Connect-AzAccount -ServicePrincipal -Credential $cred  -Tenant "<Tenant 1 ID>"
Connect-AzAccount -ServicePrincipal -Credential $cred -Tenant "<Tenant 2 ID>"
```

Create the VM in the resource group that has permission on the app registration. Replace the information in this example with your own.

In this example, we are showing how to create a VM from a generalized image. If you are using a specialized image, see [Create a VM using a specialized image version](vm-specialized-image-version.md).


```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$location = "South Central US"
$vmName = "myVMfromImage"

# Set a variable for the image version in Tenant 1 using the full image ID of the image version
$image = "/subscriptions/<Tenant 1 subscription>/resourceGroups/<Resource group>/providers/Microsoft.Compute/galleries/<Gallery>/images/<Image definition>/versions/<version>"

# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a resource group
New-AzResourceGroup -Name $resourceGroup -Location $location

# Networking pieces
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24
$vnet = New-AzVirtualNetwork -ResourceGroupName $resourceGroup -Location $location `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig
$pip = New-AzPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration using the $image variable to specify the image
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize Standard_D1_v2 | `
Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
Set-AzVMSourceImage -Id $image | `
Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig
```

## Next steps

If you run into any issues, you can [troubleshoot galleries](troubleshooting-shared-images.md).
