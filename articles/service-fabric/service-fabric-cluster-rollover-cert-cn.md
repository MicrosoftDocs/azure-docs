---
title: Rollover an Azure Service Fabric cluster certificate | Microsoft Docs
description: Learn how to rollover a Service Fabric cluster certificate identified by the certificate common name.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chackdan
editor: aljo

ms.assetid: 5441e7e0-d842-4398-b060-8c9d34b07c48
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/24/2018
ms.author: aljo

---
# Manually roll over a Service Fabric cluster certificate
When a Service Fabric cluster certificate is close to expiring, you need to update the certificate.  Certificate rollover is simple if the cluster was [set up to use certificates based on common name](service-fabric-cluster-change-cert-thumbprint-to-cn.md) (instead of thumbprint).  Get a new certificate from a certificate authority with a new expiration date.  Self-signed certificates are not support for production Service Fabric clusters, to include certificates generated during Azure portal Cluster creation workflow. The new certificate must have the same common name as the older certificate. 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Service Fabric cluster will automatically use the declared certificate with a further into the future expiration date; when more than one validate certificate is installed on the host. A best practice is to use a Resource Manager template to provision Azure Resources. For non-production environment the following script can be used to upload a new certificate to a key vault and then installs the certificate on the virtual machine scale set: 

```powershell
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser -Force

$SubscriptionId  =  <subscription ID>

# Sign in to your Azure account and select your subscription
Login-AzAccount -SubscriptionId $SubscriptionId

$region = "southcentralus"
$KeyVaultResourceGroupName  = "keyvaultgroup"
$VaultName = "cntestvault2"
$certFilename = "C:\users\sfuser\sftutorialcluster20180419110824.pfx"
$certname = "cntestcert"
$Password  = "!P@ssw0rd321"
$VmssResourceGroupName     = "sfclustertutorialgroup"
$VmssName                  = "prnninnxj"

# Create new Resource Group 
New-AzResourceGroup -Name $KeyVaultResourceGroupName -Location $region

# Get the key vault.  The key vault must be enabled for deployment.
$keyVault = Get-AzKeyVault -VaultName $VaultName -ResourceGroupName $KeyVaultResourceGroupName 
$resourceId = $keyVault.ResourceId  

# Add the certificate to the key vault.
$PasswordSec = ConvertTo-SecureString -String $Password -AsPlainText -Force
$KVSecret = Import-AzureKeyVaultCertificate -VaultName $vaultName -Name $certName  -FilePath $certFilename -Password $PasswordSec

$CertificateThumbprint = $KVSecret.Thumbprint
$CertificateURL = $KVSecret.SecretId
$SourceVault = $resourceId
$CommName    = $KVSecret.Certificate.SubjectName.Name

Write-Host "CertificateThumbprint    :"  $CertificateThumbprint
Write-Host "CertificateURL           :"  $CertificateURL
Write-Host "SourceVault              :"  $SourceVault
Write-Host "Common Name              :"  $CommName    

Set-StrictMode -Version 3
$ErrorActionPreference = "Stop"

$certConfig = New-AzVmssVaultCertificateConfig -CertificateUrl $CertificateURL -CertificateStore "My"

# Get current VM scale set 
$vmss = Get-AzVmss -ResourceGroupName $VmssResourceGroupName -VMScaleSetName $VmssName

# Add new secret to the VM scale set.
$vmss = Add-AzVmssSecret -VirtualMachineScaleSet $vmss -SourceVaultId $SourceVault -VaultCertificate $certConfig

# Update the VM scale set 
Update-AzVmss -ResourceGroupName $VmssResourceGroupName -Name $VmssName -VirtualMachineScaleSet $vmss  -Verbose
```

>[!NOTE]
> Computes Virtual Machine Scale Set Secrets do not support the same resource id for two separate secrets, as each secret is a versioned unique resource. 

To learn more, read the following:
* Learn about [cluster security](service-fabric-cluster-security.md).
* [Update and Manage cluster certificates](service-fabric-cluster-security-update-certs-azure.md)

