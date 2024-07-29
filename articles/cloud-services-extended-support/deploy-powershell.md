---
title: Deploy Azure Cloud Services (extended support) - Azure PowerShell
description: Deploy Azure Cloud Services (extended support) by using Azure PowerShell.
ms.topic: quickstart
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 07/24/2024
ms.custom: devx-track-azurepowershell
---

# Deploy Cloud Services (extended support) by using Azure PowerShell

This article shows you how to use the Az.CloudService Azure PowerShell module to create an Azure Cloud Services (extended support) deployment that has multiple roles (WebRole and WorkerRole).

## Prerequisites

Complete the following steps as prerequisites to creating your deployment by using Azure PowerShell.

1. Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support) and create the required resources.

1. Install the Az.CloudService PowerShell module:

    ```azurepowershell-interactive
    Install-Module -Name Az.CloudService 
    ```

1. Create a new resource group. This step is optional if you use an existing resource group.

    ```azurepowershell-interactive
    New-AzResourceGroup -ResourceGroupName “ContosOrg” -Location “East US” 
    ```

1. Create a storage account and container in Azure to store the package (.cspkg or .zip) file and configuration (.cscfg) file for the Cloud Services (extended support) deployment. You must use a unique name for the storage account name. This step is optional if you use an existing storage account.

    ```azurepowershell-interactive
    $storageAccount = New-AzStorageAccount -ResourceGroupName “ContosOrg” -Name “contosostorageaccount” -Location “East US” -SkuName “Standard_RAGRS” -Kind “StorageV2” 
    $container = New-AzStorageContainer -Name “contosocontainer” -Context $storageAccount.Context -Permission Blob 
    ```

## Deploy Cloud Services (extended support)

To deploy Cloud Services (extended support), use any of the following PowerShell cmdlet options:

- Quick-create a deployment by using a [storage account](#quick-create-a-deployment-by-using-a-storage-account)

  - This parameter set inputs the package (.cspkg or .zip) file, the configuration (.cscfg) file, and the definition (.csdef) file for the deployment as inputs with the storage account.
  - The cmdlet creates the Cloud Services (extended support) role profile, network profile, and OS profile with minimal input.
  - To input a certificate, you must specify a key vault name. The certificate thumbprints in the key vault are validated against the certificates that you specify in the configuration (.cscfg) file for the deployment.

- Quick-create a deployment by using a [shared access signature URI](#quick-create-a-deployment-by-using-an-sas-uri)

  - This parameter set inputs the shared access signature (SAS) URI of the package (.cspkg or .zip) file with the local paths to the configuration (.cscfg) file and definition (.csdef) file. No storage account input is required.
  - The cmdlet creates the cloud service role profile, network profile, and OS profile minimal input.
  - To input a certificate, you must specify a key vault name. The certificate thumbprints in the key vault are validated against the certificates that you specify in the configuration (.cscfg) file for the deployment.

- Create a deployment by using a [role profile, OS profile, network profile, and extension profile with shared access signature URIs](#create-a-deployment-by-using-profile-objects-and-sas-uris)

  - This parameter set inputs the SAS URIs of the package (.cspkg or .zip) file and configuration (.cscfg) file.
  - You must specify profile objects: role profile, network profile, OS profile, and extension profile. The profiles must match the values that you set in the configuration (.cscfg) file and definition (.csdef) file.

### Quick-create a deployment by using a storage account

Create a Cloud Services (extended support) deployment by using the package (.cspkg or .zip) file, configuration (.cscfg) file, and definition (.csdef) files:

```azurepowershell-interactive
$cspkgFilePath = "<Path to .cspkg file>"
$cscfgFilePath = "<Path to .cscfg file>"
$csdefFilePath = "<Path to .csdef file>"
      
# Create a Cloud Services (extended support) deployment   
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

### Quick-create a deployment by using an SAS URI

1. Upload the package (.cspkg or .zip) file for the deployment to the storage account:

    ```azurepowershell-interactive
    $tokenStartTime = Get-Date 
    $tokenEndTime = $tokenStartTime.AddYears(1) 
    $cspkgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cspkg” -Container “contosocontainer” -Blob “ContosoApp.cspkg” -Context $storageAccount.Context 
    $cspkgToken = New-AzStorageBlobSASToken -Container “contosocontainer” -Blob $cspkgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context 
    $cspkgUrl = $cspkgBlob.ICloudBlob.Uri.AbsoluteUri + $cspkgToken 
    $cscfgFilePath = "<Path to cscfg file>"
    $csdefFilePath = "<Path to csdef file>"
    ```

1. Create the Cloud Services (extended support) deployment by using the package (.cspkg or .zip) file, configuration (.cscfg) file, and definition (.csdef) file SAS URI:

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

### Create a deployment by using profile objects and SAS URIs

1. Upload your Cloud Services (extended support) configuration (.cscfg) file to the storage account:

    ```azurepowershell-interactive
    $cscfgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cscfg” -Container contosocontainer -Blob “ContosoApp.cscfg” -Context $storageAccount.Context 
    $cscfgToken = New-AzStorageBlobSASToken -Container “contosocontainer” -Blob $cscfgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context 
    $cscfgUrl = $cscfgBlob.ICloudBlob.Uri.AbsoluteUri + $cscfgToken 
    ```

1. Upload your Cloud Services (extended support) package (.cspkg or .zip) file to the storage account:

    ```azurepowershell-interactive
    $tokenStartTime = Get-Date 
    $tokenEndTime = $tokenStartTime.AddYears(1) 
    $cspkgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cspkg” -Container “contosocontainer” -Blob “ContosoApp.cspkg” -Context $storageAccount.Context 
    $cspkgToken = New-AzStorageBlobSASToken -Container “contosocontainer” -Blob $cspkgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context 
    $cspkgUrl = $cspkgBlob.ICloudBlob.Uri.AbsoluteUri + $cspkgToken 
    ```

1. Create a virtual network and subnet. This step is optional if you use an existing network and subnet. This example uses a single virtual network and subnet for both Cloud Services (extended support) roles (WebRole and WorkerRole).

    ```azurepowershell-interactive
    $subnet = New-AzVirtualNetworkSubnetConfig -Name "ContosoWebTier1" -AddressPrefix "10.0.0.0/24" -WarningAction SilentlyContinue 
    $virtualNetwork = New-AzVirtualNetwork -Name “ContosoVNet” -Location “East US” -ResourceGroupName “ContosOrg” -AddressPrefix "10.0.0.0/24" -Subnet $subnet 
    ```

1. Create a public IP address and set a DNS label value for the public IP address. Cloud Services (extended support) supports only a [Basic](../virtual-network/ip-services/public-ip-addresses.md#sku) SKU public IP address. Standard SKU public IP addresses don't work with Cloud Services (extended support).

   If you use a static IP address, you must reference it as a reserved IP address in the configuration (.cscfg) file for the deployment.

    ```azurepowershell-interactive
    $publicIp = New-AzPublicIpAddress -Name “ContosIp” -ResourceGroupName “ContosOrg” -Location “East US” -AllocationMethod Dynamic -IpAddressVersion IPv4 -DomainNameLabel “contosoappdns” -Sku Basic 
    ```

1. Create a network profile object, and then associate the public IP address to the front end of the load balancer. The Azure platform automatically creates a Classic SKU load balancer resource in the same subscription as the Cloud Services (extended support) resource. The load balancer is a read-only resource in Azure Resource Manager. You can update resources only via the Cloud Services (extended support) configuration (.cscfg) file and deployment (.csdef) file.

    ```azurepowershell-interactive
    $publicIP = Get-AzPublicIpAddress -ResourceGroupName ContosOrg -Name ContosIp  
    $feIpConfig = New-AzCloudServiceLoadBalancerFrontendIPConfigurationObject -Name 'ContosoFe' -PublicIPAddressId $publicIP.Id 
    $loadBalancerConfig = New-AzCloudServiceLoadBalancerConfigurationObject -Name 'ContosoLB' -FrontendIPConfiguration $feIpConfig 
    $networkProfile = @{loadBalancerConfiguration = $loadBalancerConfig} 
    ```

1. Create a key vault. The key vault stores certificates that are associated with Cloud Services (extended support) roles. The key vault must be in the same region and subscription as the Cloud Services (extended support) deployment and have a unique name. For more information, see [Use certificates with Cloud Services (extended support)](certificates-and-key-vault.md).

    ```azurepowershell-interactive
    New-AzKeyVault -Name "ContosKeyVault” -ResourceGroupName “ContosOrg” -Location “East US” 
    ```

1. Update the key vault access policy and grant certificate permissions to your user account:

    ```azurepowershell-interactive
    Set-AzKeyVaultAccessPolicy -VaultName 'ContosKeyVault' -ResourceGroupName 'ContosOrg' -EnabledForDeployment
    Set-AzKeyVaultAccessPolicy -VaultName 'ContosKeyVault' -ResourceGroupName 'ContosOrg' -UserPrincipalName 'user@domain.com' -PermissionsToCertificates create,get,list,delete 
    ```

    Alternatively, set the access policy by using the `ObjectId` value. To get the `ObjectId` value, run `Get-AzADUser`:

    ```azurepowershell-interactive
    Set-AzKeyVaultAccessPolicy -VaultName 'ContosKeyVault' -ResourceGroupName 'ContosOrg' -ObjectId 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' -PermissionsToCertificates create,get,list,delete 
    ```

1. The following example adds a self-signed certificate to a key vault. You must add the certificate thumbprint via the configuration (.cscfg) file for Cloud Services (extended support) roles.

    ```azurepowershell-interactive
    $Policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal 
    Add-AzKeyVaultCertificate -VaultName "ContosKeyVault" -Name "ContosCert" -CertificatePolicy $Policy 
    ```

1. Create an OS profile in-memory object. An OS profile specifies the certificates that are associated with Cloud Services (extended support) roles, which is the certificate that you created in the preceding step.

    ```azurepowershell-interactive
    $keyVault = Get-AzKeyVault -ResourceGroupName ContosOrg -VaultName ContosKeyVault 
    $certificate = Get-AzKeyVaultCertificate -VaultName ContosKeyVault -Name ContosCert 
    $secretGroup = New-AzCloudServiceVaultSecretGroupObject -Id $keyVault.ResourceId -CertificateUrl $certificate.SecretId 
    $osProfile = @{secret = @($secretGroup)} 
    ```

1. Create a role profile in-memory object. A role profile defines a role's SKU-specific properties such as name, capacity, and tier. In this example, two roles are defined: frontendRole and backendRole. Role profile information must match the role configuration defined in the deployment configuration (.cscfg) file and definition (.csdef) file.

    ```azurepowershell-interactive
    $frontendRole = New-AzCloudServiceRoleProfilePropertiesObject -Name 'ContosoFrontend' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2 
    $backendRole = New-AzCloudServiceRoleProfilePropertiesObject -Name 'ContosoBackend' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2 
    $roleProfile = @{role = @($frontendRole, $backendRole)} 
    ```

1. (Optional) Create an extension profile in-memory object to add to your Cloud Services (extended support) deployment. This example adds a Remote Desktop Protocol (RDP) extension:

    ```azurepowershell-interactive
    $credential = Get-Credential 
    $expiration = (Get-Date).AddYears(1) 
    $rdpExtension = New-AzCloudServiceRemoteDesktopExtensionObject -Name 'RDPExtension' -Credential $credential -Expiration $expiration -TypeHandlerVersion '1.2.1' 

    $storageAccountKey = Get-AzStorageAccountKey -ResourceGroupName "ContosOrg" -Name "contosostorageaccount"
    $configFile = "<WAD public configuration file path>"
    $wadExtension = New-AzCloudServiceDiagnosticsExtension -Name "WADExtension" -ResourceGroupName "ContosOrg" -CloudServiceName "ContosCS" -StorageAccountName "contosostorageaccount" -StorageAccountKey $storageAccountKey[0].Value -DiagnosticsConfigurationPath $configFile -TypeHandlerVersion "1.5" -AutoUpgradeMinorVersion $true 
    $extensionProfile = @{extension = @($rdpExtension, $wadExtension)} 
    ```

    The configuration (.cscfg) file should have only `PublicConfig` tags and should contain a namespace as shown in the following example:

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <PublicConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
        ...............
    </PublicConfig>
    ```

1. (Optional) In a PowerShell hash table, you can define tags to add to your deployment:

    ```azurepowershell-interactive
    $tag=@{"Owner" = "Contoso"} 
    ```

1. Create the Cloud Services (extended support) deployment by using the profile objects and SAS URIs that you defined:

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

## Related content

- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy Cloud Services (extended support) by using the [Azure portal](deploy-portal.md), an [ARM template](deploy-template.md), or [Visual Studio](deploy-visual-studio.md).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support).
