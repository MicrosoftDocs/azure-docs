---
title: Deploy a Cloud Service (extended support) - PowerShell
description: Deploy a Cloud Service (extended support) using PowerShell
ms.topic: quickstart
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Create a Cloud Service (extended)

This example shows you how to use the `Az.CloudService` PowerShell module to deploy a Cloud Service (extended support) in Azure that has multiple roles (WebRole and WorkerRole) and RDP extension. 

## Create a Resource Group

Create an Azure resource group with New-AzResourceGroup. A resource group is a logical container into which Azure resources are deployed and managed.

```powershell
New-AzResourceGroup -Name 'ContosoOrg' -Location 'East US'
```

## Create a Key Vault

Next you will create a Key Vault. This Key Vault will be used to store certificates that are associated to cloud service roles, hence you need to enable Key Vault for deployment which permits role instances to retrieve certificate stored as secrets from Key Vault. <br>
For creating Key Vault you need following information:

- **Vault name**: ContosoKeyVault
- **Resource group name**: ContosoOrg
- **Location**: EastUS

Although we use "ContosoKeyVault" as the name of our Key Vault through out, you must use a unique name.

```powershell
$keyVault = New-AzKeyVault -Name 'ContosoKeyVault' -ResourceGroupName 'ContosoOrg' -Location 'East US' -EnabledForDeployment
```

## Give your user account permissions to manage certificates in Key Vault

Use the Azure PowerShell Set-AzKeyVaultAccessPolicy cmdlet to update the Key Vault access policy and grant certificate permissions to your user account.

```powershell
Set-AzKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -ResourceGroupName 'ContosoOrg' -UserPrincipalName 'user@domain.com' -PermissionsToCertificates create,get,list,delete

# Or, you could set access policy via ObjectId (which you can get using Get-AzADUser)
Set-AzKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -ResourceGroupName 'ContosoOrg' -ObjectId 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' -PermissionsToCertificates create,get,list,delete
```

## Add a certificate to Key Vault

For the purpose of this example we will add a self signed certificate to a Key Vault.

Note: Certificate thumbprint needs to be added in cloud service configuration (cscfg) file for deployment on cloud service roles.

```powershell
$policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal
Add-AzKeyVaultCertificate -VaultName 'ContosoKeyVault' -Name 'ContosoCert' -CertificatePolicy $policy
```

## Create a Storage Account and Container

Create a storage account and container which will be used to store cloud service package (cspkg).<br>

Note: You must use a unique name for storage account name.

```powershell
$storageAccount = New-AzStorageAccount -ResourceGroupName 'ContosoOrg' -Name 'contosostorageaccount' -Location 'East US' -SkuName 'Standard_RAGRS' -Kind 'StorageV2'
$container = New-AzStorageContainer -Name 'contosocontainer' -Context $storageAccount.Context -Permission blob
```

## Upload Cloud Service package (cspkg) to Storage Account

Upload cloud service package (cspkg) to storage account, later SAS URL of the package will be generated which will be used for creating cloud service.

```powershell
$cspkgFilePath = '<Path to cspkg file>'
$blob = Set-AzStorageBlobContent -File $cspkgFilePath -Container 'contosocontainer' -Blob 'ContosoCS.cspkg' -Context $storageAccount.Context
```

## Create a Virtual Network

Create a virtual network and virtual network subnet as per configuration defined in cloud service configuration (cscfg). For this example, we have defined single virtual network subnet for both cloud service roles (WebRole and WorkerRole).

Note: Virtual Network name and Virtual Network Subnet name should be same as defined in cloud service configuration (cscfg) file.

```powershell
$subnet = New-AzVirtualNetworkSubnetConfig -Name 'ContosoSubnet' -AddressPrefix '10.0.0.0/24'
New-AzVirtualNetwork -Name 'ContosoVNet' -ResourceGroupName 'ContosoOrg' -Location 'East US' -AddressPrefix '10.0.0.0/24' -Subnet $subnet
```

## Create a Public IP Address

Create a public IP address which will be associated to the loadbalancer of cloud service.

```powershell
$publicIp = New-AzPublicIpAddress -Name 'ContosoPublicIP' -ResourceGroupName 'ContosoOrg' -Location 'East US' -AllocationMethod 'Dynamic' -IpAddressVersion 'IPv4' -DomainNameLabel 'contosocloudservice' -Sku 'Basic'
```

## Create a Cloud Service

Above you have created resources which are required to create a cloud service. Next set of steps will show you how to create a cloud service once the dependent resources are created.

### Create an OS Profile

Create an OS Profile in-memory object. OS Profile specifies the certificates which are assosiated to cloud service roles. Over here you will use the certificates that was created in previous steps.

```powershell
$certificate = Get-AzKeyVaultCertificate -VaultName 'ContosoKeyVault' -Name 'ContosoCert'
$secretGroup = New-AzCloudServiceVaultSecretGroupObject -Id $keyVault.ResourceId -CertificateUrl $certificate.SecretId
```

### Create a Role Profile

Create a Role Profile in-memory object. Role profile defines role's sku specific properties such as name, capacity and tier. For this example, we have defined two roles: WebRole and WorkerRole.

Note: Role profile information should match the role configuration defined in configuration (cscfg) file and service definition (csdef) file.

```powershell
$role1 = New-AzCloudServiceRoleProfilePropertiesObject -Name 'WebRole' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2
$role2 = New-AzCloudServiceRoleProfilePropertiesObject -Name 'WorkerRole' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2
$roles = @($role1, $role2)
```

### Create a Network Profile

Create a Network Profile in-memory object. Network profile specifies the load balancer related configuration including the public IP address.

```powershell
$feIpConfig = New-AzCloudServiceLoadBalancerFrontendIPConfigurationObject -Name 'ContosoFE' -PublicIPAddressId $publicIp.Id
$loadBalancerConfig = New-AzCloudServiceLoadBalancerConfigurationObject -Name 'ContosoLB' -FrontendIPConfiguration $feIpConfig
```

### Create an Extension Profile

Create a Extension Profile in-memory object that you want to add to your cloud service. For this example we will add RDP extension and Geneva monitoring extension.

```powershell
# RDP extension
$credential = Get-Credential
$expiration = (Get-Date).AddYears(1)
$rdpExtension = New-AzCloudServiceRemoteDesktopExtensionObject -Name 'RDPExtension' -Credential $credential -Expiration $expiration -TypeHandlerVersion '1.2.1'

# Geneva extension
$genevaExtension = New-AzCloudServiceExtensionObject -Name 'GenevaExtension' -Publisher 'Microsoft.Azure.Geneva' -Type 'GenevaMonitoringPaaS' -TypeHandlerVersion '2.14.0.2'
$extensions = @($rdpExtension, $genevaExtension)
```

### Add Tags to your Cloud Service

Define Tags as PowerShell hash table which you want to add to your cloud service.

```powershell
$tag=@{"Owner" = "Contoso"; "Client" = "PowerShell"}
```

### Read configuration (cscfg) file and generate package (cspkg) SAS URL

Read cloud service configuration (cscfg) file and generated the SAS URL of cloud service packge (cspkg) that was uploaded to storage account in previous steps.

```powershell
# Read Configuration File
$cscfgFilePath = '<Path to cscfg file>'
$cscfgContent = Get-Content $cscfgFilePath | Out-String

# Generate a SAS token for cloud service package
$token = New-AzStorageBlobSASToken -Container 'contosocontainer' -Blob 'ContosoCS.cspkg' -Permission rwd -Context $storageAccount.Context
$cspkgUrl = $blob.ICloudBlob.Uri.AbsoluteUri + $token
```

### Create Cloud Service

Until now you have created all objects in-memory, next you will exectue command to create a cloud service.

```powershell
$cloudService = New-AzCloudService `
                  -Name 'ContosoCS' `
                  -ResourceGroupName 'ContosoOrg' `
                  -Location 'East US' `
                  -PackageUrl $cspkgUrl `
                  -Configuration $cscfgContent `
                  -UpgradeMode 'Auto' `
                  -RoleProfileRole $roles `
                  -NetworkProfileLoadBalancerConfiguration $loadBalancerConfig `
                  -ExtensionProfileExtension $extensions `
                  -OSProfileSecret $secretGroup `
                  -Tag $tag
```

## Get Remote Desktop File

Get the RDP file using Get-AzCloudServiceRoleInstanceRemoteDesktopFile. Login into the role instance using the credentials specified while creating RDP extension.<br>

In this example RDP extension is installed on all role instances, thus you can get RDP file for any of the role instance. In below command we are downloading RDP file for WebRole instance 0.

```powershell
Get-AzCloudServiceRoleInstanceRemoteDesktopFile -ResourceGroupName "ContosoOrg" -CloudServiceName "ContosoCS" -RoleInstanceName "WebRole_IN_0" -OutFile "C:\temp\WebRole_IN_0.rdp"
```

## Next steps
For more information, see [Cloud Services (extended support) Reference Documentation](https://docs.microsoft.com/rest/api/compute/cloudservices/) 