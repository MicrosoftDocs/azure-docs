---
title: Deploy a Cloud Service (extended support) - PowerShell
description: Deploy a Cloud Service (extended support) using PowerShell
ms.topic: tutorial
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: devx-track-azurepowershell
---

# Deploy a Cloud Service (extended support) using Azure PowerShell

This article shows how to use the `Az.CloudService` PowerShell module to deploy Cloud Services (extended support) in Azure that has multiple roles (WebRole and WorkerRole).

## Pre-requisites

1. Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support) and create the associated resources. 
2. Install Az.CloudService PowerShell module.

    ```azurepowershell-interactive
    Install-Module -Name Az.CloudService 
    ```

3. Create a new resource group. This step is optional if using an existing resource group.   

    ```azurepowershell-interactive
    New-AzResourceGroup -ResourceGroupName “ContosOrg” -Location “East US” 
    ```

4. Create a storage account and container, which will be used to store the Cloud Service package (.cspkg) and Service Configuration (.cscfg) files. A unique name for storage account name is required. This step is optional if using an existing storage account.

    ```azurepowershell-interactive
    $storageAccount = New-AzStorageAccount -ResourceGroupName “ContosOrg” -Name “contosostorageaccount” -Location “East US” -SkuName “Standard_RAGRS” -Kind “StorageV2” 
    $container = New-AzStorageContainer -Name “contosocontainer” -Context $storageAccount.Context -Permission Blob 
    ```
    
## Deploy a Cloud Services (extended support)

Use any of the following PowerShell cmdlets to deploy Cloud Services (extended support):

1. [**Quick Create Cloud Service using a Storage Account**](#quick-create-cloud-service-using-a-storage-account)

    - This parameter set inputs the .cscfg, .cspkg and .csdef files as inputs along with the storage account. 
    - The cloud service role profile, network profile, and OS profile are created by the cmdlet with minimal input from the user. 
    - For certificate input, the keyvault name is to be specified. The certificate thumbprints in the keyvault are validated against those specified in the .cscfg file.
    
 2. [**Quick Create Cloud Service using a SAS URI**](#quick-create-cloud-service-using-a-sas-uri)
 
    - This parameter set inputs the SAS URI of the .cspkg along with the local paths of .csdef and .cscfg files. There is no storage account input required. 
    - The cloud service role profile, network profile, and OS profile are created by the cmdlet with minimal input from the user. 
    - For certificate input, the keyvault name is to be specified. The certificate thumbprints in the keyvault are validated against those specified in the .cscfg file.
    
3. [**Create Cloud Service with role, OS, network and extension profile and SAS URIs**](#create-cloud-service-using-profile-objects--sas-uris)

    - This parameter set inputs the SAS URIs of the .cscfg and .cspkg files.
    - The role, network, OS, and extension profile must be specified by the user and must match the values in the .cscfg and .csdef. 

### Quick Create Cloud Service using a Storage Account

Create Cloud Service deployment using .cscfg, .csdef and .cspkg files.

```azurepowershell-interactive
$cspkgFilePath = "<Path to cspkg file>"
$cscfgFilePath = "<Path to cscfg file>"
$csdefFilePath = "<Path to csdef file>"
      
# Create Cloud Service       
New-AzCloudService
-Name "ContosoCS" `
-ResourceGroupName "ContosOrg" `
-Location "EastUS" `
-ConfigurationFile $cscfgFilePath `
-DefinitionFile $csdefFilePath `
-PackageFile $cspkgFilePath `
-StorageAccount $storageAccount `
[-KeyVaultName <string>]
```

### Quick Create Cloud Service using a SAS URI

1. Upload your Cloud Service package (cspkg) to the storage account.

    ```azurepowershell-interactive
    $tokenStartTime = Get-Date 
    $tokenEndTime = $tokenStartTime.AddYears(1) 
    $cspkgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cspkg” -Container “contosocontainer” -Blob “ContosoApp.cspkg” -Context $storageAccount.Context 
    $cspkgToken = New-AzStorageBlobSASToken -Container “contosocontainer” -Blob $cspkgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context 
    $cspkgUrl = $cspkgBlob.ICloudBlob.Uri.AbsoluteUri + $cspkgToken 
    $cscfgFilePath = "<Path to cscfg file>"
    $csdefFilePath = "<Path to csdef file>"
    ```

 2. Create Cloud Service deployment using .cscfg, .csdef and .cspkg SAS URI.

    ```azurepowershell-interactive
    New-AzCloudService
        -Name "ContosoCS" `
        -ResourceGroupName "ContosOrg" `
        -Location "EastUS" `
        -ConfigurationFile $cspkgFilePath `
        -DefinitionFile $csdefFilePath `
        -PackageURL $cspkgUrl `
        [-KeyVaultName <string>]
    ```
    
### Create Cloud Service using profile objects & SAS URIs

1.  Upload your cloud service configuration (cscfg) to the storage account. 

    ```azurepowershell-interactive
    $cscfgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cscfg” -Container contosocontainer -Blob “ContosoApp.cscfg” -Context $storageAccount.Context 
    $cscfgToken = New-AzStorageBlobSASToken -Container “contosocontainer” -Blob $cscfgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context 
    $cscfgUrl = $cscfgBlob.ICloudBlob.Uri.AbsoluteUri + $cscfgToken 
    ```
2. Upload your Cloud Service package (cspkg) to the storage account.

    ```azurepowershell-interactive
    $tokenStartTime = Get-Date 
    $tokenEndTime = $tokenStartTime.AddYears(1) 
    $cspkgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cspkg” -Container “contosocontainer” -Blob “ContosoApp.cspkg” -Context $storageAccount.Context 
    $cspkgToken = New-AzStorageBlobSASToken -Container “contosocontainer” -Blob $cspkgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context 
    $cspkgUrl = $cspkgBlob.ICloudBlob.Uri.AbsoluteUri + $cspkgToken 
    ```
    
3. Create a virtual network and subnet. This step is optional if using an existing network and subnet. This example uses a single virtual network and subnet for both cloud service roles (WebRole and WorkerRole). 

    ```azurepowershell-interactive
    $subnet = New-AzVirtualNetworkSubnetConfig -Name "ContosoWebTier1" -AddressPrefix "10.0.0.0/24" -WarningAction SilentlyContinue 
    $virtualNetwork = New-AzVirtualNetwork -Name “ContosoVNet” -Location “East US” -ResourceGroupName “ContosOrg” -AddressPrefix "10.0.0.0/24" -Subnet $subnet 
    ```
 
4. Create a public IP address and set the DNS label property of the public IP address. Cloud Services (extended support) only supports [Basic](../virtual-network/ip-services/public-ip-addresses.md#sku) SKU Public IP addresses. Standard SKU Public IPs do not work with Cloud Services.
If you are using a Static IP, you need to reference it as a Reserved IP in Service Configuration (.cscfg) file.

    ```azurepowershell-interactive
    $publicIp = New-AzPublicIpAddress -Name “ContosIp” -ResourceGroupName “ContosOrg” -Location “East US” -AllocationMethod Dynamic -IpAddressVersion IPv4 -DomainNameLabel “contosoappdns” -Sku Basic 
    ```

5. Create a Network Profile Object and associate the public IP address to the frontend of the load balancer. The Azure platform automatically creates a 'Classic' SKU load balancer resource in the same subscription as the cloud service resource. The load balancer resource is a read-only resource in Azure Resource Manager. Any updates to the resource are supported only via the cloud service deployment files (.cscfg & .csdef).

    ```azurepowershell-interactive
    $publicIP = Get-AzPublicIpAddress -ResourceGroupName ContosOrg -Name ContosIp  
    $feIpConfig = New-AzCloudServiceLoadBalancerFrontendIPConfigurationObject -Name 'ContosoFe' -PublicIPAddressId $publicIP.Id 
    $loadBalancerConfig = New-AzCloudServiceLoadBalancerConfigurationObject -Name 'ContosoLB' -FrontendIPConfiguration $feIpConfig 
    $networkProfile = @{loadBalancerConfiguration = $loadBalancerConfig} 
    ```
 
6. Create a Key Vault. This Key Vault will be used to store certificates that are associated with the Cloud Service (extended support) roles. The Key Vault must be located in the same region and subscription as cloud service and have a unique name. For more information, see [use certificates with Azure Cloud Services (extended support)](certificates-and-key-vault.md).

    ```azurepowershell-interactive
    New-AzKeyVault -Name "ContosKeyVault” -ResourceGroupName “ContosOrg” -Location “East US” 
    ```

7. Update the Key Vault access policy and grant certificate permissions to your user account. 

    ```azurepowershell-interactive
    Set-AzKeyVaultAccessPolicy -VaultName 'ContosKeyVault' -ResourceGroupName 'ContosOrg' -EnabledForDeployment
    Set-AzKeyVaultAccessPolicy -VaultName 'ContosKeyVault' -ResourceGroupName 'ContosOrg' -UserPrincipalName 'user@domain.com' -PermissionsToCertificates create,get,list,delete 
    ```

    Alternatively, set access policy via ObjectId (which can be obtained by running `Get-AzADUser`). 
    
    ```azurepowershell-interactive
    Set-AzKeyVaultAccessPolicy -VaultName 'ContosKeyVault' -ResourceGroupName 'ContosOrg' -ObjectId 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' -PermissionsToCertificates create,get,list,delete 
    ```
 

8. In this example, we will add a self-signed certificate to a Key Vault. The certificate thumbprint needs to be added in Cloud Service Configuration (.cscfg) file for deployment on cloud service roles. 

    ```azurepowershell-interactive
    $Policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal 
    Add-AzKeyVaultCertificate -VaultName "ContosKeyVault" -Name "ContosCert" -CertificatePolicy $Policy 
    ```
 
9. Create an OS Profile in-memory object. OS Profile specifies the certificates, which are associated to cloud service roles. This will be the same certificate created in the previous step. 

    ```azurepowershell-interactive
    $keyVault = Get-AzKeyVault -ResourceGroupName ContosOrg -VaultName ContosKeyVault 
    $certificate = Get-AzKeyVaultCertificate -VaultName ContosKeyVault -Name ContosCert 
    $secretGroup = New-AzCloudServiceVaultSecretGroupObject -Id $keyVault.ResourceId -CertificateUrl $certificate.SecretId 
    $osProfile = @{secret = @($secretGroup)} 
    ```

10. Create a Role Profile in-memory object. Role profile defines a role sku specific properties such as name, capacity, and tier. In this example, we have defined two roles: frontendRole and backendRole. Role profile information should match the role configuration defined in configuration (cscfg) file and service definition (csdef) file. 

    ```azurepowershell-interactive
    $frontendRole = New-AzCloudServiceRoleProfilePropertiesObject -Name 'ContosoFrontend' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2 
    $backendRole = New-AzCloudServiceRoleProfilePropertiesObject -Name 'ContosoBackend' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2 
    $roleProfile = @{role = @($frontendRole, $backendRole)} 
    ```

11. (Optional) Create an Extension Profile in-memory object that you want to add to your cloud service. For this example we will add RDP extension. 

    ```azurepowershell-interactive
    $credential = Get-Credential 
    $expiration = (Get-Date).AddYears(1) 
    $rdpExtension = New-AzCloudServiceRemoteDesktopExtensionObject -Name 'RDPExtension' -Credential $credential -Expiration $expiration -TypeHandlerVersion '1.2.1' 

    $storageAccountKey = Get-AzStorageAccountKey -ResourceGroupName "ContosOrg" -Name "contosostorageaccount"
    $configFile = "<WAD public configuration file path>"
    $wadExtension = New-AzCloudServiceDiagnosticsExtension -Name "WADExtension" -ResourceGroupName "ContosOrg" -CloudServiceName "ContosCS" -StorageAccountName "contosostorageaccount" -StorageAccountKey $storageAccountKey[0].Value -DiagnosticsConfigurationPath $configFile -TypeHandlerVersion "1.5" -AutoUpgradeMinorVersion $true 
    $extensionProfile = @{extension = @($rdpExtension, $wadExtension)} 
    ```
    
    ConfigFile should have only PublicConfig tags and should contain a namespace as following:
   
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <PublicConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
        ...............
    </PublicConfig>
    ```
    
12. (Optional) Define Tags as PowerShell hash table that you want to add to your cloud service. 

    ```azurepowershell-interactive
    $tag=@{"Owner" = "Contoso"} 
    ```

13. Create Cloud Service deployment using profile objects & SAS URLs.

    ```azurepowershell-interactive
    $cloudService = New-AzCloudService ` 
        -Name “ContosoCS” ` 
        -ResourceGroupName “ContosOrg” ` 
        -Location “East US” ` 
        -PackageUrl $cspkgUrl ` 
        -ConfigurationUrl $cscfgUrl ` 
        -UpgradeMode 'Auto' ` 
        -RoleProfile $roleProfile ` 
        -NetworkProfile $networkProfile  ` 
        -ExtensionProfile $extensionProfile ` 
        -OSProfile $osProfile `
        -Tag $tag 
    ```

## Next steps 
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support).
