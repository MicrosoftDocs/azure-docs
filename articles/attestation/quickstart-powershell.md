---
title: Set up Azure Attestation with Azure PowerShell
description: How to set up and configure an attestation provider using Azure PowerShell.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 11/14/2022
ms.author: mbaldwin 
ms.custom: devx-track-azurepowershell


---
# Quickstart: Set up Azure Attestation with Azure PowerShell

Follow the below steps to create and configure an attestation provider using Azure PowerShell. See [Overview of Azure PowerShell](/powershell/azure/) for information on how to install and run Azure PowerShell.

> [!NOTE]
> The Az.Attestation PowerShell module is now integrated into Az PowerShell module. Minimum version of Az module required to support attestation operations:
  - Az PowerShell module 6.5.0
  
The PowerShell Gallery has deprecated Transport Layer Security (TLS) versions 1.0 and 1.1. TLS 1.2 or a later version is recommended. Hence you may receive the following errors:

- WARNING: Unable to resolve package source 'https://www.powershellgallery.com/api/v2'
- PackageManagement\Install-Package: No match was found for the specified search criteria and module name 

To continue to interact with the PowerShell Gallery, run the following command before the Install-Module commands

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 
```

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

Register the Microsoft.Attestation resource provider in subscription. For more information about Azure resource providers and how to configure and manage resources providers, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md). Registering a resource provider is required only once for a subscription.

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.Attestation
```
## Regional availability of Azure Attestation

```powershell
(Get-AzResourceProvider -ProviderNamespace Microsoft.Attestation)[0].Locations
```

## Create an Azure resource group

Create a resource group for the attestation provider. Other Azure resources (including a virtual machine with client application instance) can be put in the same resource group.

```powershell
$location = "uksouth" 
$attestationResourceGroup = "<attestation provider resource group name>"
New-AzResourceGroup -Name $attestationResourceGroup -Location $location 
```

 > [!NOTE]
   > Once an attestation provider is created in this resource group, a Microsoft Entra user must have **Attestation Contributor** role on the provider to perform operations like policy configuration/ policy signer certificates management. These permissions can also be inherited with roles such as **Owner** (wildcard permissions)/ **Contributor** (wildcard permissions) on  the subscription/ resource group.  

## Create and manage an attestation provider

New-AzAttestation creates an attestation provider.

```powershell
$attestationProvider = "<attestation provider name>" 
New-AzAttestationProvider -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Location $location
```

PolicySignerCertificateFile is a file specifying a set of trusted signing keys. If a filename is specified for the PolicySignerCertificateFile parameter, attestation provider can be configured only with policies in signed JWT format. Else policy can be configured in text or an unsigned JWT format.

```powershell
New-AzAttestationProvider -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Location $location -PolicySignersCertificateFile "C:\test\policySignersCertificates.pem"
```

For PolicySignersCertificateFile sample, see [examples of policy signer certificate](policy-signer-examples.md).

Get-AzAttestation retrieves the attestation provider properties like status and AttestURI. Take a note of AttestURI, as it will be needed later.

```azurepowershell
Get-AzAttestationProvider -Name $attestationProvider -ResourceGroupName $attestationResourceGroup  
```

The above command should produce output in this format: 

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

Attestation providers can be deleted using the Remove-AzAttestation cmdlet.  

```powershell
Remove-AzAttestationProvider -Name $attestationProvider -ResourceGroupName $attestationResourceGroup
```

## Policy management

In order to manage policies, a Microsoft Entra user requires the following permissions for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read
- Microsoft.Attestation/attestationProviders/attestation/write
- Microsoft.Attestation/attestationProviders/attestation/delete

 To perform these actions, a Microsoft Entra user must have **Attestation Contributor** role on the attestation provider. These permissions can also be inherited with roles such as **Owner** (wildcard permissions)/ **Contributor** (wildcard permissions) on  the subscription/ resource group.  

In order to read policies, a Microsoft Entra user requires the following permission for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read

 To perform this action, a Microsoft Entra user must have **Attestation Reader** role on the attestation provider. The read permissions can also be inherited with roles such as **Reader** (wildcard permissions) on  the subscription/ resource group.  

These PowerShell cmdlets provide policy management for an attestation provider (one TEE at a time).

Get-AzAttestationPolicy returns the current policy for the specified TEE. The cmdlet displays policy in both text and JWT format of the policy.

```powershell
$teeType = "<tee Type>"
Get-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 
```

Supported TEE types are "SgxEnclave", "OpenEnclave" and "VbsEnclave".

Set-AttestationPolicy sets a new policy for the specified TEE. The cmdlet accepts policy in either text or JWT format and is controlled by the PolicyFormat parameter. "Text" is the default value for PolicyFormat. 

```powershell
$policyFormat = "<policy format>"
$policy=Get-Content -path "C:\test\policy.txt" -Raw
Set-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType -Policy $policy -PolicyFormat $policyFormat 
```

If PolicySignerCertificateFile is provided during creation of an attestation provider, policies can be configured only in signed JWT format. Else policy can be configured in text or an unsigned JWT format.

Attestation policy in JWT format must contain a claim named "AttestationPolicy". For signed policy, JWT must be signed with private key corresponding to any of the existing policy signer certificates.

For policy samples, see [examples of an attestation policy](policy-examples.md).

Reset-AzAttestationPolicy resets the policy to default for the specified TEE.

```powershell
Reset-AzAttestationPolicy -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 
```

## Policy signer certificates management

These PowerShell cmdlets provide policy signer certificates management for an attestation provider:

```powershell
Get-AzAttestationPolicySigners -Name $attestationProvider -ResourceGroupName $attestationResourceGroup

Add-AzAttestationPolicySigner -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Signer <signer>

Remove-AzAttestationPolicySigner -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Signer <signer>
```

Policy signer certificate is a signed JWT with claim named "maa-policyCertificate". Value of the claim is a JWK, which contains the trusted signing key to add. The JWT must be signed with private key corresponding to any of the existing policy signer certificates.

All semantic manipulation of the policy signer certificate must be done outside of PowerShell. As far as PowerShell is concerned, it is a simple string.

For policy signer certificate sample, see [examples of policy signer certificate](policy-signer-examples.md).

For more information on the cmdlets and its parameters, see [Azure Attestation PowerShell cmdlets](/powershell/module/az.attestation/#attestation) 

## Next steps

- [How to author and sign an attestation policy](author-sign-policy.md)
- [Attest an SGX enclave using code samples](/samples/browse/?expanded=azure&terms=attestation)
