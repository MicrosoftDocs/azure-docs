---
title: Microsoft Azure Attestation 
description: XXX
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Microsoft Azure Attestation set up with Azure PowerShell

Follow the below steps to create and configure an attestation provider using Azure PowerShell. See [Overview of Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/?view=azps-2.8.0&viewFallbackFrom=azps-2.4.0) for information on how to install and run Azure PowerShell.

## Install Az.Attestation PowerShell module

On machine with Azure PowerShell, install the Az.Attestation PowerShell module which contains cmdlets for Azure Attestation.  

### Initial installation

Terminate all existing PowerShell windows.

To install for "current user", launch a non-elevated Powershell window and run:

```powershell
Install-Module -Name Az.Attestation -AllowClobber -Scope CurrentUser
```

To install for "all users", launch an elevated PowerShell window and run:

```powershell
Install-Module -Name Az.Attestation -AllowClobber -Scope AllUsers
```

Close the elevated PowerShell console.

### Update the installation

Terminate all existing PowerShell windows.

To update for "current user", launch a non-elevated Powershell window and run:

```powershell
Update-Module -Name Az.Attestation
```

To update for "all users", launch an elevated PowerShell window and run:

```powershell
Update-Module -Name Az.Attestation
```

Close the elevated PowerShell console.

## Sign in to Azure

Sign in to Azure in PowerShell console (without elevated access privileges).

```powershell
Connect-AzAccount
```

If needed, switch to the subscription to be used for Azure Attestation.

```powershell
Set-AzContext -Subscription <subscription id>  
```

## Register Microsoft.Attestation resource provider

Register the Microsoft.Attestation resource provider in subscription. For more information about Azure resource providers and how to configure and manage resources providers, see [Azure resource providers and types](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/resource-providers-and-types). Note that registering a resource provider is required only once for a subscription. 

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.Attestation 
```

## Create an Azure resource group

Create a resource group for attestation provider. Note that other Azure resources (including a virtual machine with client application instance) can be put in the same resource group.

```powershell
$location = "uk south" 
$attestationResourceGroup = "<attestation provider resource group name>"
New-AzResourceGroup -Name $attestationResourceGroup -Location $location 
```

Azure Attestation is currently supported in the following locations:
- **uksouth** – TEE implementation supporting SGX attestation
- **eastus2**, **centralus** – non TEE implementations upporting SGX and VBS attestation

## Create and manage an attestation provider

New-AzAttestation creates an attestation provider.

```powershell
$attestationProvider = "<attestation provider name>" 
New-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Location $location
```

Azure AD is the default trust model for new attestation providers. The isolated trust model will be used for a attestation provider if a filename is specified for the PolicySignerCertificateFile parameter. PolicySignerCertificateFile is a file specifying a set of trusted signing keys.

```powershell
New-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Location $location -PolicySignersCertificateFile "C:\test\policySignersCertificates.pem"
```

For PolicySignersCertificateFile sample, see [Examples of policy signer certificate](samples.md).

Get-AzAttestation retrieve attestation provider properties like status and AttestURI. Take a note of AttestURI, as it will be needed later.

```powershell
Get-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup  
```

The above command should produce an output like the one below: 

```
Id:/subscriptions/MySubscriptionID/resourceGroups/MyResourceGroup/providers/Microsoft.Attestation/attestationProviders/MyAttestationProvider
Location: MyLocation
ResourceGroupName: MyResourceGroup
Name: MyAttestationProvider
Status: Ready
TrustModel: AAD
AttestUri: https://MyAttestationProvider.us.attest.azure.net 
Tags: 
TagsTable: 
```

Attestation providers can deleted using the Remove-AzAttestation cmdlet.  
Remove-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup

## Policy management

In order to manage policies, an Azure AD user requires the following permissions for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read
- Microsoft.Attestation/attestationProviders/attestation/write
- Microsoft.Attestation/attestationProviders/attestation/delete

These permissions can be assigned to an AD user through a role such as "Owner" (wildcard permissions), "Contributor" (wildcard permissions) or "Attestation Contributor" (specific permissions for Azure Attestation only).  

In order to read policies, an Azure AD user requires the following permission for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read

This permission can be assigned to an AD user through a role such as "Reader" (wildcard permissions) or "Attestation Reader" (specific permissions for Azure Attestation only).

Below PowerShell cmdlets provide policy management for an attestation provider (one TEE at a time) in both Azure AD and Isolated trust models:

Get-AzAttestationPolicy returns the current policy for the specified TEE. The cmdlet displays both human readable and JWT encoded version of the policy.

```powershell
$teeType = "<tee Type>"
Get-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 
```

Supported TEE types are "sgxenclave" and "vbsenclave".

Set-AttestationPolicy sets a new policy for the specified TEE. The cmdlet accepts either human readable or JWT encoded policy for the Policy parameter, controlled by the value of a parameter named PolicyFormat.

```powershell
$policyFormat = "<policy format>"
$policy=Get-Content -path "C:\test\policy.txt" -Raw
Set-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType -Policy $policy -PolicyFormat $policyFormat 
```
Supported policy formats are "Text" and "JWT". Policy format is optional and "Text" is the default format. 
In Azure AD trust model, policy can be uploaded in Azure Attestation specific policy format (PolicyFormat="Text") or in an unsigned JWT format (PolicyFormat="JWT"). 
In isolated trust model, policy can be configured only in signed JWT format (PolicyFormat="JWT").

For policy samples, see [Examples of attestation policy](samples.md).

Reset-AzAttestationPolicy resets the policy to default for the specified TEE.

```powershell
Reset-AzAttestationPolicy -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 
```

## Policy signer certificates management

Below PowerShell cmdlets provide policy signer certificates management for an attestation provider :

```powershell
Get-AzAttestationPolicySigners -Name $attestationProvider -ResourceGroupName $attestationResourceGroup

Add-AzAttestationPolicySigner -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Signer <signer>

Remove-AzAttestationPolicySigner -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Signer <signer>
```

Policy signer certificate is signed JWT with a claim named "maa-policyCertificate". Value of the claim is a JWK which contains the trusted signing key to add. The JWT must be signed with one of the existing policy signer certificates.

Note that all semantic manipulation of the policy signer certificate must be done outside of PowerShell. As far as PowerShell is concerned, is is a simple string.

For policy signer certificate sample, see [Examples of policy signer certificate](samples.md).

For more information on the cmdlets and its parameters, see [Azure Attestation PowerShell cmdlets](https://docs.microsoft.com/en-us/powershell/module/az.attestation/?view=azps-4.3.0#attestation) 

## Next steps

