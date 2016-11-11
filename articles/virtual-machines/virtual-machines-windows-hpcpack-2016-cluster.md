---
title: HPC Pack 2016 cluster in Azure | Microsoft Docs
description: Learn how to deploy an HPC Pack 2016 cluster in Azure 
services: virtual-machines-windows
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 78f6833c-4aa6-4b3e-be71-97201abb4721
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-multiple
ms.workload: big-compute
ms.date: 11/14/2016
ms.author: danlep
---

# Deploy an HPC Pack 2016 cluster in Azure 

Follow the steps in this article to deploy a [Microsoft HPC Pack 2016](https://technet.microsoft.com/library/cc514029) cluster in Azure virtual machines.  HPC Pack is Microsoft's free HPC solution built on Microsoft Azure and Windows Server technologies and supports a wide range of HPC workloads.

Use one of several [Azure Resource Manager templates](https://github.com/MsHpcPack/HPCPack2016) to deploy the cluster. You have several choices of cluster topology with different numbers of cluster head nodes, and using either Linux or Windows compute nodes.

## Prerequisites

### PFX certificate

A Microsoft HPC Pack 2016 cluster requires a Personal Information Exchange (PFX) certificate to secure the communication between the HPC nodes. The certificate must meet the following requirements: 

* Have a private key that is capable of key exchange
* Key usage includes Digital Signature and Key Encipherment
* Enhanced key usage includes Client Authentication and Server Authentication 

Before deploying the HPC cluster, upload the certificate to an [Azure key vault](../key-vault/) as a secret, and record the following information for use during the deployment:  key vault name, resource group name, secret ID, and certificate thumbprint. 

A sample PowerShell script to upload the certificate follows. For more information uploading a certificate to an Azure key vault, see [Get started with Azure Key Vault](../key-vault/key-vault-get-started.md).

```powershell
#Give the following values
$VaultName = "mytestvault"
$SecretName = "hpcpfxcert"
$VaultRG = "myresourcegroup"
$location = "westus"
$PfxFile = "c:\Temp\mytest.pfx"
$Password = "yourpfxkeyprotectionpassword"
#Validate the pfx file
try {
    $pfxCert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList $PfxFile, $Password
}
catch [System.Management.Automation.MethodInvocationException]
{
    throw $_.Exception.InnerException
}
$thumbprint = $pfxCert.Thumbprint
$pfxCert.Dispose()
# Create and encode the JSON object
$pfxContentBytes = Get-Content $PfxFile -Encoding Byte
$pfxContentEncoded = [System.Convert]::ToBase64String($pfxContentBytes)
$jsonObject = @"
{
"data": "$pfxContentEncoded",
"dataType": "pfx",
"password": "$Password"
}
"@
$jsonObjectBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonObject)
$jsonEncoded = [System.Convert]::ToBase64String($jsonObjectBytes)
#Create an Azure key vault and upload the certificate as a secret
$secret = ConvertTo-SecureString -String $jsonEncoded -AsPlainText -Force
$rg = Get-AzureRmResourceGroup -Name $VaultRG -Location $location -ErrorAction SilentlyContinue
if($null -eq $rg)
{
    $rg = New-AzureRmResourceGroup -Name $VaultRG -Location $location
}
$hpcKeyVault = New-AzureRmKeyVault -VaultName $VaultName -ResourceGroupName $VaultRG -Location $location -EnabledForDeployment -EnabledForTemplateDeployment
$hpcSecret = Set-AzureKeyVaultSecret -VaultName $VaultName -Name $SecretName -SecretValue $secret
"The following Information will be used in the deployment template"
"Vault Name             :   $VaultName"
"Vault Resource Group   :   $VaultRG"
"Certificate URL        :   $($hpcSecret.Id)"
"Certificate Thumbprint :   $thumbprint" 

```


### Supported topologies

Choose one of the [Azure Resource Manager templates](https://github.com/MsHpcPack/HPCPack2016) to deploy the HPC Pack 2016 cluster. Following are three supported cluster topologies. High-availability topologies can include multiple cluster head nodes.

1. High-availability cluster with Active Directory domain 




2. High-availability cluster without Active Directory domain


3. Cluster with a single head node

## Next steps
* Submit jobs to your cluster. See [Submit jobs to HPC an HPC Pack cluster in Azure](virtual-machines-windows-hpcpack-cluster-submit-jobs.md) and [Manage an HPC Pack 2016 cluster in Azure using Azure Active Directory](virtual-machines-windows-hpcpack-cluster-active-directory.md).

