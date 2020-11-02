---
title: Deploy a Cloud Service (extended support) - Portal
description: Deploy a Cloud Service (extended support) using the Azure Portal
ms.topic: quickstart
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Deploy a Cloud Service (extended support) using the Azure Portal
Cloud Services (extended support) provides various methods to create a deployment. The following diagram talks about all the possible methods. This document talks about using PowerShell to create Cloud Services (extended support) deployment using Method 1 & 2. 
 
:::image type="content" source="media/deploy-portal1.png" alt-text="Alt text here.":::

(Link: https://microsoft.sharepoint.com/:i:/t/CloudServicesonVMSS/EVVevH28W39CsaIQxkvFzOsBX--plPvO_BBiBFEytLfSzw?e=oeCOud) 

## Deployment Method #1
Process to create Cloud Services (extended support) deployment using Method 1:
Method 1 takes template & parameters file as parameters to create/update the Cloud Services (extended support) deployment. 

1.	Create the template & parameters   file for your Cloud Service (extended support) deployment. 

2.	Login to Power Shell & select the right subscription.

    ```PowerShell
    Add-AzureAccount
    Select-AzureSubscription –SubscriptionName "My Azure Subscription"
    ```
3.	Upload Cscfg & Cspkg file to Storage Account and obtain the SAS URLs using Portal or PS. Add SAS URLs to cloudservices resource section of Template (Using Portal or PS).
 
4.	Ensure necessary resources (Vnet, Resource Group, Public IP, Key Vault, Storage Account) will be available before creating Cloud Services:

    a.	Make sure necessary resources are defined in the Template, dependsOn clause correctly defines the order and resource names are correctly mentioned in the cloudservices resource section of the Template. 

    b.	Or make sure necessary resources already exist and the resource names are correctly mentioned in the cloudservices resource section of the Template.
 
5.	Create Cloud Services (extended support) resource using ARM’s Power shell command to create using Template:

    ```PowerShell
    New-AzResourceGroupDeployment -ResourceGroupName “Resource group name” -TemplateParameterFile "file path to your parameters file" -TemplateFile "file path to your template file”
    ```

For more information deploying resources using Template, see Deploy resources with ARM Template & Azure Power Shell

## Deployment Method #2

Process to create Cloud Services (extended support) deployment using Method 2:
In method 2, customers need to use multiple Power Shell commands to manually perform the automations done using Templates or Parameters file. The below process describes the steps needed for a completely new environment. It is possible to skip steps for resources that already exist and are to be reused (e.g. storage accounts creation)

1.	Create Resource Group  . (Optional if using existing Resource Group)

    ```PowerShell
    New-AzResourceGroup -ResourceGroupName “ContosoResourceGroup” -Location “East US”
    ```

2.	Create Storage Account (Optional if using existing Storage Account)

    ```PowerShell
    $storageAccount = New-AzStorageAccount -ResourceGroupName “ContosoResourceGroup” -Name “ContosoStorageAccount” -Location “East US” -SkuName “Standard_RAGRS” -Kind “StorageV2”
    $container = New-AzStorageContainer -Name “ContosoContainer” -Context $storageAccount.Context -Permission Blob
    ```

3.	Create cspkg file, upload cspkg to storage account and obtain SAS URL

    ```PowerShell
    $tokenStartTime = Get-Date
    $tokenEndTime = $tokenStartTime.AddYears(1)
    $cspkgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cspkg” -Container “ContosoContainer” -Blob “ContosoApp.cspkg” -Context $storageAccount.Context
    $cspkgToken = New-AzStorageBlobSASToken -Container “ContosoContainer” -Blob $cspkgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context
    $cspkgUrl = $cspkgBlob.ICloudBlob.Uri.AbsoluteUri + $cspkgToken
    ```

4.	Create cscfg, upload cscfg to storage account & obtain SAS URL or create base64 encoded string for Cloud Services

    ```PowerShell
    $cscfgBlob = Set-AzStorageBlobContent -File “./ContosoApp/ContosoApp.cscfg” -Container ContosoContainer -Blob “ContosoApp.cscfg” -Context $storageAccount.Context
    $cscfgToken = New-AzStorageBlobSASToken -Container “ContosoContainer” -Blob $cscfgBlob.Name -Permission rwd -StartTime $tokenStartTime -ExpiryTime $tokenEndTime -Context $storageAccount.Context
    $cscfgUrl = $cscfgBlob.ICloudBlob.Uri.AbsoluteUri + $cscfgToken
    ```

    OR

    ```PowerShell
    $cscfgText = [IO.File]::ReadAllText(“./ContosoApp/ContosoApp.cscfg”) 
    $cscfgBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($cscfgText))
    ``` 

5.	Create VNet, Subnet & Public IP (Optional if using existing Vnet, Subnet or Public Ip)

    ```PowerShell
    $subnet = New-AzVirtualNetworkSubnetConfig -Name "ContosoWebTier1" -AddressPrefix "10.0.0.0/24" -WarningAction SilentlyContinue
    $virtualNetwork = New-AzVirtualNetwork -Name “ContosoVNet” -Location “East US” -ResourceGroupName “ContosoResourceGroup” -AddressPrefix "10.0.0.0/24" -Subnet $subnet
    $publicIp = New-AzPublicIpAddress -Name “ContosoPublicIp” -ResourceGroupName “ContosoResourceGroup” -Location “East US” -AllocationMethod Dynamic -IpAddressVersion IPv4 -DomainNameLabel “ContosoAppDNS” -Sku Basic
    ```

6.	Create Key vault & upload the certificates (Optional)

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

10.	Create Network Profile Object (Load balancer frontend IP object + Load balancer object)

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

12.	Create Cloud Service deployment using profile objects & SAS URLs

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

> [!NOTE]
 -Configuration $cscfgBase64 is also supported

For more information, see <Add link to CS Powershell reference documents> 

For examples script, see <link>
