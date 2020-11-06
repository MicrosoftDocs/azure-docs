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

# Deploy a Cloud Service (extended support) using PowerShell
Cloud Services (extended support) provides various methods to create a deployment.  This article shows you how to use various PowerShell commands to create a Cloud Services (extended support) deployment. 
 
:::image type="content" source="media/deploy-portal1.png" alt-text="Image shows possible deployment methods and an associated diagram.":::


## PowerShell Deployment Method #1
This method takes the users template & parameter file and uses them as parameters to create or update the Cloud Services (extended support) deployment. 

1.	Create the template and parameters file for your Cloud Service (extended support) deployment. 

2.	Login and select an Azure subscription.

    ```PowerShell
    Add-AzureAccount
    Select-AzureSubscription –SubscriptionName "My Azure Subscription"
    ```
3.	Upload a `.cscfg` and `.cspkg` file to a storage account and obtain the SAS URLs using portal or PowerShell. Add the SAS URLs to Cloud Services resource section of Azure Resource Manager (ARM) Template.
 
4.	Ensure necessary resources (VNET, Resource Group, Public IP, Key Vault, Storage Account) will be available before creating Cloud Services:

    a.	Make sure necessary resources are defined in the Template, dependsOn clause correctly defines the order and resource names are correctly mentioned in the cloud services resource section of the Template. 

    b.	Or make sure necessary resources already exist and the resource names are correctly mentioned in the cloud services resource section of the Template.
 
5.	Create Cloud Services (extended support) resource using Azure Resource Manager’s Power shell command to create using Template:

    ```PowerShell
    New-AzResourceGroupDeployment -ResourceGroupName “Resource group name” -TemplateParameterFile "file path to your parameters file" -TemplateFile "file path to your template file”
    ```

For more information deploying resources using Template, see [Deploy resources with Azure Resource Manager]()

## PowerShell Deployment Method #2

In this method, PowerShell commands are used to create the `.cspkg` and `.cscfg` files needed for a new deployment.

1.  Login and select an Azure subscription.

    ```PowerShell
    Add-AzureAccount
    Select-AzureSubscription –SubscriptionName "My Azure Subscription"
    ```
2.	Create a new Resource Group. 

    ```PowerShell
    New-AzResourceGroup -ResourceGroupName “ContosoResourceGroup” -Location “East US”
    ```

3.	Create a new Storage Account

    ```PowerShell
    $storageAccount = New-AzStorageAccount -ResourceGroupName “ContosoResourceGroup” -Name “ContosoStorageAccount” -Location “East US” -SkuName “Standard_RAGRS” -Kind “StorageV2”
    $container = New-AzStorageContainer -Name “ContosoContainer” -Context $storageAccount.Context -Permission Blob
    ```

3.	Create .`cspkg` file and upload it to your newly created storage account. Once uploaded, obtain SAS URL.

    ```PowerShell
    $tokenStartTime = Get-Date
    $tokenEndTime = $tokenStartTime.AddYears(1)
    $cspkgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cspkg” -Container “ContosoContainer” -Blob “ContosoApp.cspkg” -Context $storageAccount.Context
    $cspkgToken = New-AzStorageBlobSASToken -Container “ContosoContainer” -Blob $cspkgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context
    $cspkgUrl = $cspkgBlob.ICloudBlob.Uri.AbsoluteUri + $cspkgToken
    ```

4.	Create `.cscfg` and uploaded it to your newly created storage account. Once uploaded, obtain the SAS URL. count & obtain SAS URL. 

    ```PowerShell
    $cscfgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cscfg” -Container ContosoContainer -Blob “ContosoApp.cscfg” -Context $storageAccount.Context
    $cscfgToken = New-AzStorageBlobSASToken -Container “ContosoContainer” -Blob $cscfgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context
    $cscfgUrl = $cscfgBlob.ICloudBlob.Uri.AbsoluteUri + $cscfgToken
    ```

5.	Create new virtual network, subnet and public IP address. 

    ```PowerShell
    $subnet = New-AzVirtualNetworkSubnetConfig -Name "ContosoWebTier1" -AddressPrefix "10.0.0.0/24" -WarningAction SilentlyContinue
    $virtualNetwork = New-AzVirtualNetwork -Name “ContosoVNet” -Location “East US” -ResourceGroupName “ContosoResourceGroup” -AddressPrefix "10.0.0.0/24" -Subnet $subnet
    $publicIp = New-AzPublicIpAddress -Name “ContosoPublicIp” -ResourceGroupName “ContosoResourceGroup” -Location “East US” -AllocationMethod Dynamic -IpAddressVersion IPv4 -DomainNameLabel “ContosoAppDNS” -Sku Basic
    ```

6.	Create a key vault resource and upload the certificates required to connect. 

    ```PowerShell
    New-AzKeyVault -Name "ContosoKeyVault” -ResourceGroupName “ContosoResourceGroup” -Location “East US”
    $Policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal
    Add-AzKeyVaultCertificate -VaultName "ContosoKeyVault" -Name "ContosoAppCertificate" -CertificatePolicy $Policy
    ```

7.	Create Role Profile Object

    ```PowerShell
    $frontendRole = New-AzCloudServiceCloudServiceRoleProfilePropertiesObject -Name 'ContosoFrontend' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2
    $backendRole = New-AzCloudServiceCloudServiceRoleProfilePropertiesObject -Name 'ContosoBackend' -SkuName 'Standard_D1_v2' -SkuTier 'Standard' -SkuCapacity 2
    $roles = @($frontendRole, $backendRole)
    ```

8.	Create Extension Profile Object 

    ```PowerShell
    $credential = Get-Credential
    $expiration = (Get-Date).AddYears(1)
    $extension  = New-AzCloudServiceRemoteDesktopExtensionObject -Name 'RDPExtension' -Credential $credential -Expiration $expiration -TypeHandlerVersion '1.2.1'
    ```

9.	Create OS Profile Object 

    ```powershell
    
    ```

10.	Create a Network Profile Object 

    ```PowerShell
    $publicIP = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ContosoResourceGroup/providers/Microsoft.Network/publicIPAddresses/ContosoPublicIP"
    $loadBalancerId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/ContosoResourceGroup/providers/Microsoft.Network/loadBalancers/ContosoLB"
    $feIpConfig = New-AzCloudServiceLoadBalancerFrontendIPConfigurationObject -Name 'ContosoFe' -PublicIPAddressId $publicIP
    $loadBalancerConfig = New-AzCloudServiceLoadBalancerConfigurationObject -Name 'ContosoLB' -Id $loadBalancerId -FrontendIPConfiguration $feIpConfig
    ```

11.	Create Tags (Optional)

    ```PowerShell
    $tag=@{"Owner" = "Contoso"}
    ```

12.	Create Cloud Service deployment using profile objects & SAS URLs.

    ```PowerShell
    $cloudService = New-AzCloudService `
    -Name “ContosoCSApp” `
    -ResourceGroupName “ContosoResourceGroup” `
    -Location “East US” `
    -PackageUrl $cspkgUrl `
    -Configuration $cscfgUrl `
    -UpgradeMode 'Auto' `
    -RoleProfileRole $roles `
    -NetworkProfileLoadBalancerConfiguration $loadBalancerConfig `
    -ExtensionProfileExtension $extension `
    -Tag $tag
    ```


For more information, see [Cloud Services (extended support) Reference Documentation]() 