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

1. Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).

3. Install Az.CloudService PowerShell module  

    ```powershell
    Install-Module -Name Az.CloudService 
    ```

4. Create a new resource group. This step is optional if using an existing resource group.   

    ```powershell
    New-AzResourceGroup -ResourceGroupName “ContosOrg” -Location “East US” 
    ```

5. Create a storage account and container which will be used to store cloud service package (cspkg). You must use a unique name for storage account name. 

    ```powershell
    $storageAccount = New-AzStorageAccount -ResourceGroupName “ContosOrg” -Name “contosostorageaccount” -Location “East US” -SkuName “Standard_RAGRS” -Kind “StorageV2” 
    $container = New-AzStorageContainer -Name “contosocontainer” -Context $storageAccount.Context -Permission Blob 
    ```

6. Upload your cloud service package (cspkg) to the storage account. The SAS URI of the package will be generated which will be used in later steps. 

    ```powershell
    $tokenStartTime = Get-Date 
    $tokenEndTime = $tokenStartTime.AddYears(1) 
    $cspkgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cspkg” -Container “ContosoContainer” -Blob “ContosoApp.cspkg” -Context $storageAccount.Context 
    $cspkgToken = New-AzStorageBlobSASToken -Container “ContosoContainer” -Blob $cspkgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context 
    $cspkgUrl = $cspkgBlob.ICloudBlob.Uri.AbsoluteUri + $cspkgToken 
    ```
 

7.  Upload your cloud service configuration (cscfg) to the storage account. The SAS URI of the configuration will be generated which will be used in later steps. 

    ```powershell
    $cscfgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cscfg” -Container ContosoContainer -Blob “ContosoApp.cscfg” -Context $storageAccount.Context 
    $cscfgToken = New-AzStorageBlobSASToken -Container “ContosoContainer” -Blob $cscfgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context 
    $cscfgUrl = $cscfgBlob.ICloudBlob.Uri.AbsoluteUri + $cscfgToken 
    ```


8. Create a virtual network and subnet. This step is optional if using an existing network and subnet. This example uses a single virtual network and subnet for both cloud service roles (WebRole and WorkerRole). 

    ```powershell
    $subnet = New-AzVirtualNetworkSubnetConfig -Name "ContosoWebTier1" -AddressPrefix "10.0.0.0/24" -WarningAction SilentlyContinue 
    $virtualNetwork = New-AzVirtualNetwork -Name “ContosoVNet” -Location “East US” -ResourceGroupName “ContosOrg” -AddressPrefix "10.0.0.0/24" -Subnet $subnet 
    ```
 
9. Create a public IP address and (optionally) set the DNS label property of the public IP address. If you are using a static IP, it needs to referenced as a Reserved IP in Service Configuration file.  

    ```powershell
    $publicIp = New-AzPublicIpAddress -Name “ContosIp” -ResourceGroupName “ContosOrg” -Location “East US” -AllocationMethod Dynamic -IpAddressVersion IPv4 -DomainNameLabel “ContosoAppDNS” -Sku Basic 
    ```

10. Create Network Profile Object and associate public IP address to the frontend of the platform created load balancer.  

    ```powershell
    $publicIP = Get-AzPublicIpAddress -ResourceGroupName ContosOrg -Name ContosIp  
    $feIpConfig = New-AzCloudServiceLoadBalancerFrontendIPConfigurationObject -Name 'ContosoFe' -PublicIPAddressId $publicIP.Id 
    $loadBalancerConfig = New-AzCloudServiceLoadBalancerConfigurationObject -Name 'ContosoLB' -FrontendIPConfiguration $feIpConfig 
    $networkProfile = @{loadBalancerConfiguration = $loadBalancerConfig} 
    ```
 
11. Create a Key Vault. This Key Vault will be used to store certificates that are associated with the cloud service roles. The key vault needs to be enabled for deployment which permits role instances to retrieve certificate stored as secrets from key vault. The vault name must be unique.  

    ```powershell
    New-AzKeyVault -Name "ContosKeyVault” -ResourceGroupName “ContosOrg” -Location “East US” 
    ```
 

13. Update the Key Vault access policy and grant certificate permissions to your user account. 

    ```powershell
    Set-AzKeyVaultAccessPolicy -VaultName 'ContosKeyVault' -ResourceGroupName 'ContosoOrg' -UserPrincipalName 'user@domain.com' -PermissionsToCertificates create,get,list,delete 
    ```

    Alternatively, set access policy via ObjectId (which can be obtained by running `Get-AzADUser`) 
    
    ```powershell
    Set-AzKeyVaultAccessPolicy -VaultName 'ContosKeyVault' -ResourceGroupName 'ContosOrg' -ObjectId 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' -PermissionsToCertificates create,get,list,delete 
    ```
 

14. For the purpose of this example we will add a self signed certificate to a Key Vault. The certificate thumbprint needs to be added in cloud service configuration (cscfg) file for deployment on cloud service roles. 

    ```powershell
    $Policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal 
    Add-AzKeyVaultCertificate -VaultName "ContosKeyVault" -Name "ContosCert" -CertificatePolicy $Policy 
    ```
 
15. Create an OS Profile in-memory object. OS Profile specifies the certificates which are associated to cloud service roles. This will be the same certificate created in the previous step. 

    ```powershell
    $keyVault = Get-AzKeyVault -ResourceGroupName ContosOrg -VaultName ContosKeyVault 
    $certificate = Get-AzKeyVaultCertificate -VaultName ContosKeyVault -Name ContosCert 
    $secretGroup = New-AzCloudServiceVaultSecretGroupObject -Id $keyVault.ResourceId -CertificateUrl $certificate.SecretId 
    $osProfile = @{secret = @($secretGroup)} 
    ```

16. Create a Role Profile in-memory object. Role profile defines a roles sku specific properties such as name, capacity and tier. For this example, we have defined two roles: frontendRole and backendRole. Role profile information should match the role configuration defined in configuration (cscfg) file and service definition (csdef) file. 

    ```powershell
    $frontendRole = New-AzCloudServiceCloudServiceRoleProfilePropertiesObject -Name 'ContosoFrontend' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2 
    $backendRole = New-AzCloudServiceCloudServiceRoleProfilePropertiesObject -Name 'ContosoBackend' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2 
    $roleProfile = @{role = @($frontendRole, $backendRole)} 
    ```

17. Create a Extension Profile in-memory object that you want to add to your cloud service. For this example we will add RDP extension. 

    ```powershell
    $credential = Get-Credential 
    $expiration = (Get-Date).AddYears(1) 
    $extension = New-AzCloudServiceRemoteDesktopExtensionObject -Name 'RDPExtension' -Credential $credential -Expiration $expiration -TypeHandlerVersion '1.2.1' 
    $extensionProfile = @{extension = @($extension)} 
    ```
18. (Optional) Define Tags as PowerShell hash table which you want to add to your cloud service. 

    ```powershell
    $tag=@{"Owner" = "Contoso"} 
    ```

19. Create Cloud Service deployment using profile objects & SAS URLs 

    ```powershell
    $cloudService = New-AzCloudService                                            	    ` 
    -Name “ContosoCS”                                      	    ` 
    -ResourceGroupName “ContosOrg”                     ` 
    -Location “East US”                                           ` 
    -PackageUrl $cspkgUrl     				    ` 
    -ConfigurationUrl $cscfgUrl                                  	    ` 
    -UpgradeMode 'Auto'                                           ` 
    -RoleProfileRole $roleProfile                                       ` 
    -NetworkProfileLoadBalancerConfiguration $networkProfile  ` 
    -ExtensionProfileExtension $extensionProfile ` 
    -OsProfile $osProfile  
    -Tag $tag 
    ```

    `-Configuration $cscfgContent` is also supported 

 ## Next steps
For more information, see [Frequently asked questions about Cloud services (extended support)](faq.md)
