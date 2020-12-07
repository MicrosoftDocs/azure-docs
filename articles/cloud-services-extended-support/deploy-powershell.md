---
title: Deploy a Cloud Service (extended support) - PowerShell
description: Deploy a Cloud Service (extended support) using PowerShell
ms.topic: tutorial
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Create a Cloud Service (extended support) using Azure PowerShell

This article shows how to use the `Az.CloudService` PowerShell module to deploy Cloud Services (extended support) in Azure that has multiple roles (WebRole and WorkerRole) and remote desktop extension. 

> [!IMPORTANT]
> Cloud Services (extended support) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Register the feature for your subscription
Cloud Services (extended support) is currently in preview. Register the feature for your subscription as follows:

```powershell
Register-AzProviderFeature -FeatureName CloudServices -ProviderNamespace Microsoft.Compute
```

## Create a Resource Group

Create a new resource group.

```powershell
New-AzResourceGroup -Name 'ContosoOrg' -Location 'East US'
```

## Create a Key Vault

Create a Key Vault that will be used to store certificates associated to the Cloud Service roles.The Key Vault name must be unique.

```powershell
$keyVault = New-AzKeyVault -Name 'ContosoKeyVault' -ResourceGroupName 'ContosoOrg' -Location 'East US' -EnabledForDeployment
```

## Give user accounts permissions to manage certificates in Key Vault

Use the `Set-AzKeyVaultAccessPolicy` command to update the Key Vault access policy and grant certificate permissions to the user accounts.

```powershell
Set-AzKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -ResourceGroupName 'ContosoOrg' -UserPrincipalName 'user@domain.com' -PermissionsToCertificates create,get,list,delete
```

Optionally, you can set access policy using the ObjectId. This can be obtained by using the `Get-AzADUser` cmdlet.

```PowerShell
Set-AzKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -ResourceGroupName 'ContosoOrg' -ObjectId 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' -PermissionsToCertificates create,get,list,delete
```

## Add a certificate to the Key Vault

> [!NOTE]
> The certificate thumbprint needs to be added in the Cloud Service configuration (cscfg) file.

```powershell
$policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal
Add-AzKeyVaultCertificate -VaultName 'ContosoKeyVault' -Name 'ContosoCert' -CertificatePolicy $policy
```

## Create a storage account and container

Create a storage account and container that will be used to store the Cloud Service package (cspkg).

> [!NOTE]
> The storage account name must be unique.

```powershell
$storageAccount = New-AzStorageAccount -ResourceGroupName 'ContosoOrg' -Name 'contosostorageaccount' -Location 'East US' -SkuName 'Standard_RAGRS' -Kind 'StorageV2'
$container = New-AzStorageContainer -Name 'contosocontainer' -Context $storageAccount.Context -Permission blob
```

## Upload the Cloud Service package (cspkg) to the storage account

Upload the Cloud Service package (cspkg) to the storage account. The SAS URL of the package will be generated which will be used for creating the Cloud Service.

```powershell
$cspkgFilePath = '<Path to cspkg file>'
$blob = Set-AzStorageBlobContent -File $cspkgFilePath -Container 'contosocontainer' -Blob 'ContosoCS.cspkg' -Context $storageAccount.Context
```

## Create a virtual network

Create a virtual network and subnet as per configuration defined in the Cloud Service configuration (cscfg). For this example, we have defined single virtual network and subnet for both Cloud Service roles (WebRole and WorkerRole).

> [!NOTE]
> Virtual network and subnet name must be same as defined in Cloud Service configuration (cscfg) file.

```powershell
$subnet = New-AzVirtualNetworkSubnetConfig -Name 'ContosoSubnet' -AddressPrefix '10.0.0.0/24'
New-AzVirtualNetwork -Name 'ContosoVNet' -ResourceGroupName 'ContosoOrg' -Location 'East US' -AddressPrefix '10.0.0.0/24' -Subnet $subnet
```

## Create a public IP address

Create a public IP address to be associate with the load balancer.

```powershell
$publicIp = New-AzPublicIpAddress -Name 'ContosoPublicIP' -ResourceGroupName 'ContosoOrg' -Location 'East US' -AllocationMethod 'Dynamic' -IpAddressVersion 'IPv4' -DomainNameLabel 'contosocloudservice' -Sku 'Basic'
```

## Create an OS profile

Create an OS profile in-memory object. The OS profile specifies the certificates that are associated to the Cloud Service roles.

```powershell
$certificate = Get-AzKeyVaultCertificate -VaultName 'ContosoKeyVault' -Name 'ContosoCert'
$secretGroup = New-AzCloudServiceVaultSecretGroupObject -Id $keyVault.ResourceId -CertificateUrl $certificate.SecretId
```

## Create a role profile

Create a role profile in-memory object. The role profile defines the sku specific properties such as name, capacity and tier. For this example, we have defined two roles: WebRole and WorkerRole.

> [!NOTE]
> Role profile information should match the role configuration defined in configuration (cscfg) file and service definition (csdef) file.

```powershell
$role1 = New-AzCloudServiceRoleProfilePropertiesObject -Name 'WebRole' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2
$role2 = New-AzCloudServiceRoleProfilePropertiesObject -Name 'WorkerRole' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2
$roles = @($role1, $role2)
```

## Create a network profile

Create a network profile in-memory object. Network profile specifies the load balancer configuration including the public IP address.

```powershell
$feIpConfig = New-AzCloudServiceLoadBalancerFrontendIPConfigurationObject -Name 'ContosoFE' -PublicIPAddressId $publicIp.Id
$loadBalancerConfig = New-AzCloudServiceLoadBalancerConfigurationObject -Name 'ContosoLB' -FrontendIPConfiguration $feIpConfig
```

## Create an extension profile

Create an extension profile in-memory object to add to the Cloud Service. For this example we will add remote desktop extension and Geneva monitoring extension.

```powershell
# RDP extension
$credential = Get-Credential
$expiration = (Get-Date).AddYears(1)
$rdpExtension = New-AzCloudServiceRemoteDesktopExtensionObject -Name 'RDPExtension' -Credential $credential -Expiration $expiration -TypeHandlerVersion '1.2.1'

# Geneva extension
$genevaExtension = New-AzCloudServiceExtensionObject -Name 'GenevaExtension' -Publisher 'Microsoft.Azure.Geneva' -Type 'GenevaMonitoringPaaS' -TypeHandlerVersion '2.14.0.2'
$extensions = @($rdpExtension, $genevaExtension)
```

## (Optional) Add tags to your Cloud Service

Define tags as a PowerShell hash table and add them to the Cloud Service.

```powershell
$tag=@{"Owner" = "Contoso"; "Client" = "PowerShell"}
```

## Read configuration (cscfg) file and generate package (cspkg) SAS URL

Read the Cloud Service configuration (cscfg) file and generate the SAS URL of Cloud Service package (cspkg) that was uploaded to storage account in previous steps.

```powershell
# Read Configuration File
$cscfgFilePath = '<Path to cscfg file>'
$cscfgContent = Get-Content $cscfgFilePath | Out-String

# Generate a SAS token for Cloud Service package
$token = New-AzStorageBlobSASToken -Container 'contosocontainer' -Blob 'ContosoCS.cspkg' -Permission rwd -Context $storageAccount.Context
$cspkgUrl = $blob.ICloudBlob.Uri.AbsoluteUri + $token
```

## Create the Cloud Service (extended support) deployment

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

## Get Remote desktop file

Get the remote desktop file using `Get-AzCloudServiceRoleInstanceRemoteDesktopFile`. Sign in to the role instance using the credentials specified when the remote desktop extension was applied. 

```powershell
Get-AzCloudServiceRoleInstanceRemoteDesktopFile -ResourceGroupName "ContosoOrg" -CloudServiceName "ContosoCS" -RoleInstanceName "WebRole_IN_0" -OutFile "C:\temp\WebRole_IN_0.rdp"
```

## Next steps
For more information, see [Frequently asked questions about Cloud services (extended support)](faq.md)
