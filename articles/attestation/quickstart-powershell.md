---
title: Azure Attestation 
description: XXX
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---
# Quickstart: Azure Attestation with Azure PowerShell

Follow the below steps to create and configure an attestation provider using Azure PowerShell. See Overview of Azure PowerShell for information on how to install and run Azure PowerShell.

## Setup

### Install Attestation PowerShell module

On machine with Azure PowerShell, install the Az.Attestation PowerShell module containing cmdlets for Azure Attestation.  

For Initial installation, terminate all existing PowerShell windows.

To install for "current user", launch a non-elevated Powershell window and run:

```powershell
Install-Module -Name Az.Attestation -AllowClobber -Scope CurrentUser
```

To install for "all users", launch an elevated PowerShell window and run:

```powershell
Install-Module -Name Az.Attestation -AllowClobber -Scope AllUsers
```

To update the installation:

Terminate all existing PowerShell windows

To update for "current user". Launch a non-elevated Powershell window and run:

```powershell
Update-Module -Name Az.Attestation
```

To update for "all users", launch an elevated PowerShell window and run:

```powershell
Update-Module -Name Az.Attestation
```

### Sign in to Azure

Sign in to Azure in PowerShell console (without elevated access privileges).

```powershell
Connect-AzAccount
```
If needed, switch to the subscription to be used for Azure Attestation.

```powershell
Set-AzContext -Subscription <subscription id>  
```

### Register Microsoft.Attestation

Register the Microsoft.Attestation resource provider in you subscription. For more information about Azure resource providers and how to configure and manage resources providers, see [Azure resource providers and types](..azure-resource-manager/resource-manager-supported-services.md).  Note that registering a resource provider is required only once for a subscription. 

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
- uksouth – TEE implementation supporting SGX attestation
- eastus2, centralus – non TEE implementations upporting SGX and VBS attestation

## Create an Attestation provider

Create an attestation provider.

```powershell
$attestationProvider = "<attestation provider name>" 

New-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Location $location
```

Azure Attestation is currently deployed in the following locations
- **uksouth**TEE implementation supporting SGX attestation
- **eastus2**, **centralus**: **non TEE implementation upporting SGX and VBS attestation.

Azure AD is the default trust model for new attestation providers.  The Isolated trust model will be used for a attestation provider if a filename is specified for the PolicySignerCertificateFile parameter. PolicySignerCertificateFile  is a file specifying a set of trusted signing keys. Please refer to "Benefits of policy signing" section of this document for more details.

```powershell
New-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Location $location -PolicySignersCertificateFile "C:\test\policySignersCertificates.pem"
```

Example of PolicySignersCertificateFile content:

```
-----BEGIN CERTIFICATE-----
MIIDLDCCAhSgAwIBAgIIZSansCWcKTMwDQYJKoZIhvcNAQELBQAwFzEVMBMGA1UEAwwMTWFhVGVzdENlcnQxMCAXDTIwMDQyNTAwMDAwMFoYDzIwNzAwNDI1MDAwMDAwWjAXMRUwEwYDVQQDDAxNYWFUZXN0Q2VydDEwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCclUDpbgT373/FeFBKIpe1h/y4u36gOMI2NpVUKzUgi+uZySN6u199YDHKpaUTdMb77zLwBFrfulxHz7iY2LAVNj9GMdezHlgkd82i2t7dfwxdlo1e9klaaBe+LFV/WHL2k7RRxnfDU6bKk+ydYf8DKREGrdG6o2jEmBAPqDD3i+34CUV9rNy6mnULb5f1Cfr4xDYLGTL3rKECiMvHP2VYgm0gxJfuyCGYZbDfIemq07BiLbkxvn18mjGGs4yBCFKffk0oXkQG1OnDzrYWNlem5mfPNCcTj9ETc0jlB7ogLqVV5Lq9oioC5Kq+GxKil1JNuRt+fLDe1meiWZ+eu897AgMBAAGjejB4MEYGA1UdIwQ/MD2AFEhDF0Zt1jrSjCFCVvZpnXY7ovN1oRukGTAXMRUwEwYDVQQDDAxNYWFUZXN0Q2VydDGCCGUmp7AlnCkzMB0GA1UdDgQWBBRIQxdGbdY60owhQlb2aZ12O6LzdTAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQA90rXJV8ZjGqdlqeYxEwE0hxCatpZcN2rGcRC/URtRnJBQbWpB+79dzZHXO+UIF7zhVUww3eQyQuah0aC6s6tBUKjgFjkK9ZL6Sc/4qpyb6RE1HgjRCcegmU+80CdcqxgoqXTUyFWyqmAlsHXzW3xijrN1H9zdt7ptsbCXO4pb0Njqz54zsKMQL84ZTM9fXjkt7aZpKnhl5NP311SCMUO4kzmqim331RpWvuxZnt1f1kl4QeLh/YAF7+OEKNaFgyxOXF2DNvMFDYEWEw5F9vDk0VesUErOga3vFlIY9yfE8hF79qntsMYQncJAFIA5RZffLTn9HlYmZtJeOZlCGyzi
-----END CERTIFICATE-----
```

For more information on the command and its parameters, see New-AzAttestation


Retrieve the Status and AttestURI properties of the newly created provider. Note that initially the status value is Not Ready. It can take up to 10 minutes for it to become Ready. Therefore, run the below command a few times to confirm the new attestation provider is ready to use. Take a note of AttestURI, as it will be needed later.

```powershell
Get-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup  
```powershell

```
For more information on the command and its parameters, see Get-AzAttestation.

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
Customers can delete any of their attestation providers via the Remove-AzAttestation cmdlet.  
Remove-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup
```

## Policy management

In order to manage policies, an Azure AD user requires the following permissions for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read
- Microsoft.Attestation/attestationProviders/attestation/write
- Microsoft.Attestation/attestationProviders/attestation/delete

These permissions can be assigned to an AD user through a role such as "Owner" (wildcard permissions), "Contributor" (wildcard permissions) or "Attestation Contributor" (specific permissions for Azure Attestation only).  

In order to read policies, an Azure AD user requires the following permission for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read

This permission can be assigned to an AD user through a role such as "Reader" (wildcard permissions) or "Attestation Reader" (specific permissions for Azure Attestation only).

Three PowerShell cmdlets will enable managing policy (one TEE at a time) for an attestation provider in both Azure AD and Isolated trust models:

```
$teeType = "<tee Type>"
```

Supported TEE types are "sgxenclave" and "vbsenclave".

```powershell
Get-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 

$policyFormat = "<policy format>"
```

Supported policy formats are "Text" and "JWT". Policy format is optional and "Text" is the default format. In Azure AD trust model, user can upload policy in Azure Attestation specific policy format (PolicyFormat="Text") or in JWT format (PolicyFormat="JWT"). In isolated trust model, user can upload a policy only in JWT format.

```powershell
$policy=Get-Content -path "C:\test\policy.txt" -Raw
Set-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType -Policy $policy -PolicyFormat $policyFormat 

Reset-AzAttestationPolicy -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 
```

Please refer to "Authoring and signing attestation policy" section of this document to understand how to create a policy.

Get-AzAttestationPolicy returns the current policy for the specified TEE.  The cmdlet displays both human readable and JWT encoded version of the policy.

Set-AttestationPolicy sets a new policy for the specified TEE.  The cmdlet accepts either human readable or JWT encoded policy for the Policy parameter, controlled by the value of a parameter named PolicyFormat.

Reset-AzAttestationPolicy resets the policy to default for the specified TEE.  

For sample output, see [Examples of policy content](samples.md).

## Configure an Azure AD identity for client application

1. During an attestation workflow, client application will send attestation requests to Azure Attestation. For that, it must obtain an authentication token from Azure AD, which requires an identity in Azure AD. 
1. If the client application instance is running in an Azure VM, we recommend using system-assigned managed identities 
1. If the client application is running outside of Azure, customers may need to use service principals with application IDs and secrets.

### Provision a managed identity

This section explains how to assign a system-assigned managed identity to customer’s VM and how to retrieve it using Azure PowerShell. For further details and related information see:

- Configure managed identities for Azure resources on an Azure VM using PowerShell 
- Configure managed identities for Azure resources on a VM using the Azure portal

The following instructions assume there is an active PowerShell session, customer has signed into Azure, and connected to a subscription containing VM and attestation provider. Customers can execute the below steps on any machine.

1.	Enable a system-assigned managed identity for VM.

```powershell
$vmResourceGroup = "<VM resource group name>"
$vmName = "<VM name>"
$vm = Get-AzVM -ResourceGroupName $vmResourceGroup -Name $vmName
Update-AzVM -ResourceGroupName $vmResourceGroup -VM $vm -AssignIdentity:$SystemAssigned
```

1. Retrieve a service principal representing the VM in Azure AD. It may take a while for the managed identity to propagate in Azure AD. Therefore, if the output of the below commands is empty, wait for a few minutes and repeat them.

```powershell
$vm = Get-AzVM -ResourceGroupName $vmResourceGroup -Name $vmName
$sp = Get-AzADServicePrincipal -ObjectId $vm.Identity.PrincipalId 
$sp 
```

3.	Output an application id of the service principal. Take note of the application id, as it will be needed in a later step.
  
```powershell
Write-Host "Application Id:" $sp.ApplicationId.Guid 
```

### Provision a service principal

This section explains how to create a service principal and retrieve information about it using Azure PowerShell. For further details and related information see:

- Create an Azure service principal with Azure PowerShell
- How to: Use the portal to create an Azure AD application and service principal that can access resources

The following instructions assume there is an active PowerShell session, customer has signed in to Azure and connected to a subscription containing VM and attestation provider.

1. Create a service principal in Azure AD.

```powershell
$servicePrincipalName = "<service principal name>"
$sp = New-AzADServicePrincipal -DisplayName $servicePrincipalName
```

1. Export the secret of the created service principal.

```console
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret)
$UnsecureSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
```

1. Output an application id and the secret of the new service principal. Take note of this information, as it will be needed in a later step.

```console
Write-Host "Application Id:" $sp.ApplicationId.Guid 
Write-Host "Secret:" $UnsecureSecret
```

## Grant client application access to Azure Attestation

In this step, Azure AD identity created for client application instance in the previous step should be assigned to the Attestation Reader role in Azure RBAC for the resource group containing Azure Attestation provider. This will allow client application to send attestation requests to attestation provider. This section describes how to do that using Azure PowerShell.  For further details and related information see:

- Manage access to Azure resources using RBAC and Azure PowerShell
- How to: Use the portal to create an Azure AD application and service principal that can access resources

The following instructions assume there is a retained the PowerShell session from the previous step.

1. Assign the service principal from Step 3 of "Configure an Azure AD identity for client application" section to the Attestation Reader role of the resource group containing attestation provider.

```powershell
$attestationResourceGroup = "<attestation provider resource group name>"
New-AzRoleAssignment -ApplicationId $sp.ApplicationId.Guid -RoleDefinitionName "Attestation Reader" -ResourceGroupName $attestationResourceGroup
```

1. Validate the service principal is assigned to the Attestation Reader role.

```powershell
Get-AzRoleAssignment -ServicePrincipalName $sp.ApplicationId.Guid -ResourceGroupName $attestationResourceGroup
```

## Access Azure Attestation from client application

Now enclave attestation can be performed using Azure Attestation.

In order to perform an attestation operation, a few pieces of data should be prepared ahead of time:

1. Data to be attested – This could be an encryption key for example, but there are no restrictions on the actual data to be attested
1. An evidence from the enclave – The first 32 bytes of the reportData field of the enclave report must be set to the SHA256 hash of the data in step #1
1. An Azure Active Directory Bearer token for the user who will perform the attestation. More information about retrieving an Azure AD bearer token can be found here: https://blogs.msdn.microsoft.com/jpsanders/2017/03/17/accessing-azure-app-services-using-azure-ad-bearer-token-2/ (see the portion of this blog post that discusses "Create code to get a Bearer token from Azure AD and use this token to call the Target app"
  1. Note: The resource URI of Azure Attestation required for the bearer token should be set.
eg. "https://attest.azure.net"
  1. Azure Attestation will respond with an HTTP 401 and standard OAuth 2.0 bearer challenge in the WWW-Authenticate response header when a bearer token is not presented as part of the attestation request.  This challenge can be parsed used to determine the appropriate resource and authority for an Azure AD token request.  An example of such challenge is shown below:
  
```
HTTP 401; Unauthorized 
WWW-Authenticate: Bearer authorization_uri="https://login.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47", resource="https://attest.azure.net" 
```

## Validation of the Attestation Token

One of the important steps in the attestation process is the validation of the returned JSON Web Token. Fortunately, as Azure Attestation follows standard JWT format, it can be verified and parsed by various existing libraries.

For example, the following code will validate the JWT returned by Azure Attestation (using the APIs in the Microsoft.IdentityModel.Tokens namespace).
Simple validation of the JWT can be done as:
```json
var jwtHandler = new JsonWebTokenHandler();
var validatedToken = jwtHandler.ValidateToken(encodedJwt, tokenValidationParams);
Assert.IsTrue(validatedToken.IsValid);
```

For Azure Attestation, the certificate which is used to sign the quote is a self-signed certificate with a subject name, whose name matches the attestUri value for the tenant.

## Next steps

