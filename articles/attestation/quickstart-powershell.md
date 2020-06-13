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
# Azure Attestation

Follow the below steps to create and configure an attestation provider using Azure PowerShell. See Overview of Azure PowerShell for information on how to install and run Azure PowerShell.

1. On machine with Azure PowerShell, install the Az.Attestation PowerShell module containing cmdlets for MAA.
a.	For Initial installation – Terminate all existing PowerShell windows

To install for "current user" 
Launch a non-elevated Powershell window and run:

```powershell
Install-Module -Name Az.Attestation -AllowClobber -Scope CurrentUser
```

To install for "all users"
Launch an elevated PowerShell window and run:

```powershell
Install-Module -Name Az.Attestation -AllowClobber -Scope AllUsers
```

Close the elevated PowerShell console.

b.	To update the installation – Terminate all existing PowerShell windows

To update for "current user". Launch a non-elevated Powershell window and run:

```powershell
Update-Module -Name Az.Attestation
```

To update for "all users", launch an elevated PowerShell window and run:

```powershell
Update-Module -Name Az.Attestation
```

Close the elevated PowerShell console.

1. Sign in to Azure in PowerShell console (without elevated access privileges).

```powershell
Connect-AzAccount
```

1. If needed, switch to the subscription to be used for MAA.

```powershell
Set-AzContext -Subscription <subscription id>  
```

1. Register Microsoft.Attestation resource provider in subscription. For more information about Azure resource providers and how to configure and manage resources providers, see Azure resource providers and types.  Note that registering a resource provider is required only once for a subscription. 

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.Attestation 
```

1. Create a resource group for attestation provider. Note that other Azure resources (including a VM with client application instance) can be put in the same resource group.	

```powershell
$location = "uk south" 

$attestationResourceGroup = "<attestation provider resource group name>"
New-AzResourceGroup -Name $attestationResourceGroup -Location $location 
```

MAA is currently supported in the following locations
- uksouth – TEE implementation supporting SGX attestation
- eastus2, centralus – non TEE implementations upporting SGX and VBS attestation

1. Create an attestation provider.

```powershell
$attestationProvider = "<attestation provider name>" 

New-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Location $location
```

MAA is currently deployed in the following locations
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


1. Retrieve the Status and AttestURI properties of the newly created provider. Note that initially the status value is Not Ready. It can take up to 10 minutes for it to become Ready. Therefore, run the below command a few times to confirm the new attestation provider is ready to use. Take a note of AttestURI, as it will be needed later.

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
These permissions can be assigned to an AD user through a role such as "Owner" (wildcard permissions), "Contributor" (wildcard permissions) or "Attestation Contributor" (specific permissions for MAA only).  
In order to read policies, an Azure AD user requires the following permission for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read
This permission can be assigned to an AD user through a role such as "Reader" (wildcard permissions) or "Attestation Reader" (specific permissions for MAA only).

Three PowerShell cmdlets will enable managing policy (one TEE at a time) for an attestation provider in both Azure AD and Isolated trust models:
```
$teeType = "<tee Type>"
```

Supported TEE types are "sgxenclave" and "vbsenclave"

```powershell
Get-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 

$policyFormat = "<policy format>"
```

Supported policy formats are "Text" and "JWT". Policy format is optional and "Text" is the default format. In Azure AD trust model, user can upload policy in MAA specific policy format (PolicyFormat="Text") or in JWT format (PolicyFormat="JWT"). In isolated trust model, user can upload a policy only in JWT format.

```powershell
$policy=Get-Content -path "C:\test\policy.txt" -Raw
Set-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType -Policy $policy -PolicyFormat $policyFormat 

Reset-AzAttestationPolicy -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 
```

Please refer to "Authoring and signing attestation policy" section of this document to understand how to create a policy.

Get-AzAttestationPolicy returns the current policy for the specified TEE.  The cmdlet displays both human readable and JWT encoded version of the policy.

Set-AttestationPolicy sets a new policy for the specified TEE.  The cmdlet accepts either human readable or JWT encoded policy for the Policy parameter, controlled by the value of a parameter named PolicyFormat.

Reset-AzAttestationPolicy resets the policy to default for the specified TEE.  

## Examples of policy content

### Policy for SGX enclave with PolicyFormat=Text

```
version= 1.0;authorizationrules{c:[type=="$is-debuggable"] => permit();};issuancerules{c:[type=="$is-debuggable"] => issue(type="is-debuggable", value=c.value);c:[type=="$sgx-mrsigner"] => issue(type="sgx-mrsigner", value=c.value);c:[type=="$sgx-mrenclave"] => issue(type="sgx-mrenclave", value=c.value);c:[type=="$product-id"] => issue(type="product-id", value=c.value);c:[type=="$svn"] => issue(type="svn", value=c.value);c:[type=="$tee"] => issue(type="tee", value=c.value);};
Unsigned Policy for SGX enclave with PolicyFormat=JWT        eyJhbGciOiJub25lIn0.eyJBdHRlc3RhdGlvblBvbGljeSI6ICJkbVZ5YzJsdmJqMGdNUzR3TzJGMWRHaHZjbWw2WVhScGIyNXlkV3hsYzN0ak9sdDBlWEJsUFQwaUpHbHpMV1JsWW5WbloyRmliR1VpWFNBOVBpQndaWEp0YVhRb0tUdDlPMmx6YzNWaGJtTmxjblZzWlhON1l6cGJkSGx3WlQwOUlpUnBjeTFrWldKMVoyZGhZbXhsSWwwZ1BUNGdhWE56ZFdVb2RIbHdaVDBpYVhNdFpHVmlkV2RuWVdKc1pTSXNJSFpoYkhWbFBXTXVkbUZzZFdVcE8yTTZXM1I1Y0dVOVBTSWtjMmQ0TFcxeWMybG5ibVZ5SWwwZ1BUNGdhWE56ZFdVb2RIbHdaVDBpYzJkNExXMXljMmxuYm1WeUlpd2dkbUZzZFdVOVl5NTJZV3gxWlNrN1l6cGJkSGx3WlQwOUlpUnpaM2d0YlhKbGJtTnNZWFpsSWwwZ1BUNGdhWE56ZFdVb2RIbHdaVDBpYzJkNExXMXlaVzVqYkdGMlpTSXNJSFpoYkhWbFBXTXVkbUZzZFdVcE8yTTZXM1I1Y0dVOVBTSWtjSEp2WkhWamRDMXBaQ0pkSUQwLUlHbHpjM1ZsS0hSNWNHVTlJbkJ5YjJSMVkzUXRhV1FpTENCMllXeDFaVDFqTG5aaGJIVmxLVHRqT2x0MGVYQmxQVDBpSkhOMmJpSmRJRDAtSUdsemMzVmxLSFI1Y0dVOUluTjJiaUlzSUhaaGJIVmxQV011ZG1Gc2RXVXBPMk02VzNSNWNHVTlQU0lrZEdWbElsMGdQVDRnYVhOemRXVW9kSGx3WlQwaWRHVmxJaXdnZG1Gc2RXVTlZeTUyWVd4MVpTazdmVHMifQ.
```

### Signed Policy for SGX enclave with PolicyFormat=JWT 

```
eyAiYWxnIjoiUlMyNTYiLCAieDVjIjogWyJNSUlETERDQ0FoU2dBd0lCQWdJSVpTYW5zQ1djS1RNd0RRWUpLb1pJaHZjTkFRRUxCUUF3RnpFVk1CTUdBMVVFQXd3TVRXRmhWR1Z6ZEVObGNuUXhNQ0FYRFRJd01EUXlOVEF3TURBd01Gb1lEekl3TnpBd05ESTFNREF3TURBd1dqQVhNUlV3RXdZRFZRUUREQXhOWVdGVVpYTjBRMlZ5ZERFd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0SUJEd0F3Z2dFS0FvSUJBUUNjbFVEcGJnVDM3My9GZUZCS0lwZTFoL3k0dTM2Z09NSTJOcFZVS3pVZ2krdVp5U042dTE5OVlESEtwYVVUZE1iNzd6THdCRnJmdWx4SHo3aVkyTEFWTmo5R01kZXpIbGdrZDgyaTJ0N2Rmd3hkbG8xZTlrbGFhQmUrTEZWL1dITDJrN1JSeG5mRFU2YktrK3lkWWY4REtSRUdyZEc2bzJqRW1CQVBxREQzaSszNENVVjlyTnk2bW5VTGI1ZjFDZnI0eERZTEdUTDNyS0VDaU12SFAyVllnbTBneEpmdXlDR1laYkRmSWVtcTA3QmlMYmt4dm4xOG1qR0dzNHlCQ0ZLZmZrMG9Ya1FHMU9uRHpyWVdObGVtNW1mUE5DY1RqOUVUYzBqbEI3b2dMcVZWNUxxOW9pb0M1S3ErR3hLaWwxSk51UnQrZkxEZTFtZWlXWitldTg5N0FnTUJBQUdqZWpCNE1FWUdBMVVkSXdRL01EMkFGRWhERjBadDFqclNqQ0ZDVnZacG5YWTdvdk4xb1J1a0dUQVhNUlV3RXdZRFZRUUREQXhOWVdGVVpYTjBRMlZ5ZERHQ0NHVW1wN0FsbkNrek1CMEdBMVVkRGdRV0JCUklReGRHYmRZNjBvd2hRbGIyYVoxMk82THpkVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUE5MHJYSlY4WmpHcWRscWVZeEV3RTBoeENhdHBaY04yckdjUkMvVVJ0Um5KQlFiV3BCKzc5ZHpaSFhPK1VJRjd6aFZVd3czZVF5UXVhaDBhQzZzNnRCVUtqZ0Zqa0s5Wkw2U2MvNHFweWI2UkUxSGdqUkNjZWdtVSs4MENkY3F4Z29xWFRVeUZXeXFtQWxzSFh6VzN4aWpyTjFIOXpkdDdwdHNiQ1hPNHBiME5qcXo1NHpzS01RTDg0WlRNOWZYamt0N2FacEtuaGw1TlAzMTFTQ01VTzRrem1xaW0zMzFScFd2dXhabnQxZjFrbDRRZUxoL1lBRjcrT0VLTmFGZ3l4T1hGMkROdk1GRFlFV0V3NUY5dkRrMFZlc1VFck9nYTN2RmxJWTl5ZkU4aEY3OXFudHNNWVFuY0pBRklBNVJaZmZMVG45SGxZbVp0SmVPWmxDR3l6aSJdfQ.eyJBdHRlc3RhdGlvblBvbGljeSI6ICJ2ZXJzaW9uPSAxLjA7YXV0aG9yaXphdGlvbnJ1bGVze2M6W3R5cGU9PVwiJGlzLWRlYnVnZ2FibGVcIl0gPT4gcGVybWl0KCk7fTtpc3N1YW5jZXJ1bGVze2M6W3R5cGU9PVwiJGlzLWRlYnVnZ2FibGVcIl0gPT4gaXNzdWUodHlwZT1cImlzLWRlYnVnZ2FibGVcIiwgdmFsdWU9Yy52YWx1ZSk7YzpbdHlwZT09XCIkc2d4LW1yc2lnbmVyXCJdID0-IGlzc3VlKHR5cGU9XCJzZ3gtbXJzaWduZXJcIiwgdmFsdWU9Yy52YWx1ZSk7YzpbdHlwZT09XCIkc2d4LW1yZW5jbGF2ZVwiXSA9PiBpc3N1ZSh0eXBlPVwic2d4LW1yZW5jbGF2ZVwiLCB2YWx1ZT1jLnZhbHVlKTtjOlt0eXBlPT1cIiRwcm9kdWN0LWlkXCJdID0-IGlzc3VlKHR5cGU9XCJwcm9kdWN0LWlkXCIsIHZhbHVlPWMudmFsdWUpO2M6W3R5cGU9PVwiJHN2blwiXSA9PiBpc3N1ZSh0eXBlPVwic3ZuXCIsIHZhbHVlPWMudmFsdWUpO2M6W3R5cGU9PVwiJHRlZVwiXSA9PiBpc3N1ZSh0eXBlPVwidGVlXCIsIHZhbHVlPWMudmFsdWUpO2M6W3R5cGU9PVwiJHRlZS1mdXR1cmVcIl0gPT4gaXNzdWUodHlwZT1cInRlZS1mdXR1cmVcIiwgdmFsdWU9Yy52YWx1ZSk7fTsifQ.Rm_KOcxPzo_6AytCyoWrgRa50efT_87gR9_Yewxeuesji99drOepXp50qabnPc0oCyy5ArcPSETeYCaYQrrNVhCTEW-3U_WJxXKrHuQIa9IcE06muFrA4X4esjCitbgrTujKzf83puB5u8vUG0KI_y9FAKGIjrZzDRXAG0126DOCjMltUxyRpNpXq5Ex6SQI5q-CQctoO9kYkMrYoUTqAxiAJ8mpNvC4Ufe4TjF8t6SpSI2zXXta_gY_decJ8AkyDx4YkzbHn5QzjaXaXoHMgbj_76D_RnGhANC0u5rBHvqScFMTO50QnPW94frkn-9PBtWuQ0g7Q1TeERkoMknhBA       
```

Please note that all semantic manipulation of the Policy must be done outside of PowerShell – as far as PowerShell is concerned, Policy is a simple string.

Three PowerShell cmdlets will enable managing policy signing keys (RFC) for an attestation provider:

```powershell
Get-AzAttestationPolicySigners  -Name $attestationProvider -ResourceGroupName $attestationResourceGroup 

Add-AzAttestationPolicySigner  -Name $attestationProvider -ResourceGroupName $attestationResourceGroup  -Signer <signer>

Remove-AzAttestationPolicySigner -Name $attestationProvider -ResourceGroupName $attestationResourceGroup  -Signer <signer>

```

Signer specifies the RFC7519 JSON Web Token containing a claim named "maa-policyCertificate" whose value is an RFC7517 JSON Web Key which contains a new trusted signing key to add. The RFC7519 JWT must be signed with one of the existing trusted signing keys.

- **Get-AzAttestationPolicySigners**: Returns the complete set of trusted policy signers.  
- **Add-AttestationPolicySigner**: Adds a new trusted signer.  
- **Remove-AzAttestationPolicySigner**: Removes the specified signer.  

### Example of Signer content

```
eyAiYWxnIjoiUlMyNTYiLCAieDVjIjogWyJNSUlETERDQ0FoU2dBd0lCQWdJSVpTYW5zQ1djS1RNd0RRWUpLb1pJaHZjTkFRRUxCUUF3RnpFVk1CTUdBMVVFQXd3TVRXRmhWR1Z6ZEVObGNuUXhNQ0FYRFRJd01EUXlOVEF3TURBd01Gb1lEekl3TnpBd05ESTFNREF3TURBd1dqQVhNUlV3RXdZRFZRUUREQXhOWVdGVVpYTjBRMlZ5ZERFd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0SUJEd0F3Z2dFS0FvSUJBUUNjbFVEcGJnVDM3My9GZUZCS0lwZTFoL3k0dTM2Z09NSTJOcFZVS3pVZ2krdVp5U042dTE5OVlESEtwYVVUZE1iNzd6THdCRnJmdWx4SHo3aVkyTEFWTmo5R01kZXpIbGdrZDgyaTJ0N2Rmd3hkbG8xZTlrbGFhQmUrTEZWL1dITDJrN1JSeG5mRFU2YktrK3lkWWY4REtSRUdyZEc2bzJqRW1CQVBxREQzaSszNENVVjlyTnk2bW5VTGI1ZjFDZnI0eERZTEdUTDNyS0VDaU12SFAyVllnbTBneEpmdXlDR1laYkRmSWVtcTA3QmlMYmt4dm4xOG1qR0dzNHlCQ0ZLZmZrMG9Ya1FHMU9uRHpyWVdObGVtNW1mUE5DY1RqOUVUYzBqbEI3b2dMcVZWNUxxOW9pb0M1S3ErR3hLaWwxSk51UnQrZkxEZTFtZWlXWitldTg5N0FnTUJBQUdqZWpCNE1FWUdBMVVkSXdRL01EMkFGRWhERjBadDFqclNqQ0ZDVnZacG5YWTdvdk4xb1J1a0dUQVhNUlV3RXdZRFZRUUREQXhOWVdGVVpYTjBRMlZ5ZERHQ0NHVW1wN0FsbkNrek1CMEdBMVVkRGdRV0JCUklReGRHYmRZNjBvd2hRbGIyYVoxMk82THpkVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUE5MHJYSlY4WmpHcWRscWVZeEV3RTBoeENhdHBaY04yckdjUkMvVVJ0Um5KQlFiV3BCKzc5ZHpaSFhPK1VJRjd6aFZVd3czZVF5UXVhaDBhQzZzNnRCVUtqZ0Zqa0s5Wkw2U2MvNHFweWI2UkUxSGdqUkNjZWdtVSs4MENkY3F4Z29xWFRVeUZXeXFtQWxzSFh6VzN4aWpyTjFIOXpkdDdwdHNiQ1hPNHBiME5qcXo1NHpzS01RTDg0WlRNOWZYamt0N2FacEtuaGw1TlAzMTFTQ01VTzRrem1xaW0zMzFScFd2dXhabnQxZjFrbDRRZUxoL1lBRjcrT0VLTmFGZ3l4T1hGMkROdk1GRFlFV0V3NUY5dkRrMFZlc1VFck9nYTN2RmxJWTl5ZkU4aEY3OXFudHNNWVFuY0pBRklBNVJaZmZMVG45SGxZbVp0SmVPWmxDR3l6aSJdfQ.eyJtYWEtcG9saWN5Q2VydGlmaWNhdGUiOiB7Imt0eSI6IlJTQSIsICJ4NWMiOlsiTUlJRExEQ0NBaFNnQXdJQkFnSUlmek9mOVIzcTBJc3dEUVlKS29aSWh2Y05BUUVMQlFBd0Z6RVZNQk1HQTFVRUF3d01UV0ZoVkdWemRFTmxjblF5TUNBWERUSXdNRFF5TlRBd01EQXdNRm9ZRHpJd056QXdOREkxTURBd01EQXdXakFYTVJVd0V3WURWUVFEREF4TllXRlVaWE4wUTJWeWRESXdnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDWCtWU2ZOY01sLzVoWTFUcUY2d3JmMTU0UzZQNDh6YmU1cUI4N2wzYkRIb2hMb2FHTUxvN0NDR3Z5SXZFWUw0a3d2eDZLRU1MNkN5UHB2UndYSVZQaGZ5dGhYQnRaZ2Fyb3hLUDF1OVlYVnhQRkNIRTd5NE56ODFtTE9LSVkwMllzcHIzdGl3WllpSmQ0cFRzVUxITHNnSUJMRk1Hdjc0K1JtaDJxTzc0eEs5SXBKdkdsWlVnNFRXNGgvNHRjOGkzYVVjYVpGRGNIaU40aHlMcUczc05WOUhVRHVaaGR5eHJJZUlVUkNoQ0JwUWN4V000MGxGZU5EV3R5VFRRaURkWUthb1hQY2NUTDNjZWxlVUVQMm1YOVUrb2dZd0M4S0NQbXZrUVRWL1I3djdiVDI5UWtvWXBjRC80L29zL1pLMzVNNDR5emtTZ3BWdWVYNnJOZTZqcXZBZ01CQUFHamVqQjRNRVlHQTFVZEl3US9NRDJBRkpTdVVoaS9jWXhHUDZmZ01UVkJXTkEzeFZ2NG9SdWtHVEFYTVJVd0V3WURWUVFEREF4TllXRlVaWE4wUTJWeWRES0NDSDh6bi9VZDZ0Q0xNQjBHQTFVZERnUVdCQlNVcmxJWXYzR01SaituNERFMVFWalFOOFZiK0RBUEJnTlZIUk1CQWY4RUJUQURBUUgvTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFCMFJYa0Jjb1E0b3lSenB2VXZDTEt6amJGemQ5UU40ZnprNWtMRXN2RUFpdmJCN01Oam9EV0NYSEhkV2FjeDRsb0FrY2RIR1A2amczN2dKUFhSTVJnTlVlREFjTFpITk52WEtQTE9Ka1BldWtDMzZ4S0F3WTI2cUhrTlV2bmx4UmZ0cEdaUUJpVjdUYnVnY3NGeExQSFE2K3FidDZ1ejc0Y2cxQUVvejh2VlpGTVdvK1ZHY0VFRVhtVEtLZFpDWTk5NC9mQWpJbGdvV01Gb2xxeFZhRjBnUTlhQ2dab1RibkNoYTcvTkcvZklHMDNFbHQzTGlYOEFOczhMMHBpQjJRVEw2bDYxd0dWcXViOGN1bnRwTGpnaHRoM1dBUWtMdnpMSC84R2k0S2xqYmRZeXpGemtjNVVSM0pxUStKMXcwWVlEN0xSTHpGcjY3bWFxamtPMjJmdm8iXX19.dROaeoVXpzJuOI4VIAYvhr9ruhfDRXbFAHNSp63XWTpfmi3MGRELa8YtWRpuITt73fYCW_vow2xnFBwttCg1lbWvFxKDGJvKecIz-FjAgXOxToaKsu-Xn8KJVi1lo_cB0xTSJzjbJ7rtdjIOcT-gTHy4Hajf0OeJSepa2rGngkuccAOmJ-cM49KpRl2ptRxyN62rhIWLxymdtofJPdgtbiwvV-Q5ETX2efOwcuWD7CnIf7rSPN1ec3JrWJT5TFtHz5NIYytadsOxBKWlWFSiDJt7XO_KAMqtJuVpbkkmhT-SMmar1xP3TQS1wRhd4QUUVFAsjdiGol98Jyi_3QBneA
```

Note that all semantic manipulation of the policy signers must be done outside of PowerShell – as far as PowerShell is concerned, Signer is a simple string.

### Configure an Azure AD identity for client application

1. During an attestation workflow, client application will send attestation requests to MAA. For that, it must obtain an authentication token from Azure AD, which requires an identity in Azure AD. 
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

1.	Create a service principal in Azure AD.

```powershell
$servicePrincipalName = "<service principal name>"
$sp = New-AzADServicePrincipal -DisplayName $servicePrincipalName
```

2.	Export the secret of the created service principal.

```console
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret)
$UnsecureSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
```

3.	Output an application id and the secret of the new service principal. Take note of this information, as it will be needed in a later step.

```console
Write-Host "Application Id:" $sp.ApplicationId.Guid 
Write-Host "Secret:" $UnsecureSecret
```

## Grant client application access to MAA

In this step, Azure AD identity created for client application instance in the previous step should be assigned to the Attestation Reader role in Azure RBAC for the resource group containing MAA provider. This will allow client application to send attestation requests to attestation provider. This section describes how to do that using Azure PowerShell.  For further details and related information see:

- Manage access to Azure resources using RBAC and Azure PowerShell
- How to: Use the portal to create an Azure AD application and service principal that can access resources

The following instructions assume there is a retained the PowerShell session from the previous step.

1.	Assign the service principal from Step 3 of "Configure an Azure AD identity for client application" section to the Attestation Reader role of the resource group containing attestation provider.

```powershell
$attestationResourceGroup = "<attestation provider resource group name>"
New-AzRoleAssignment -ApplicationId $sp.ApplicationId.Guid -RoleDefinitionName "Attestation Reader" -ResourceGroupName $attestationResourceGroup
```

2.	Validate the service principal is assigned to the Attestation Reader role.

```powershell
Get-AzRoleAssignment -ServicePrincipalName $sp.ApplicationId.Guid -ResourceGroupName $attestationResourceGroup
```

## Access MAA from client application

Now enclave attestation can be performed using MAA.

In order to perform an attestation operation, a few pieces of data should be prepared ahead of time:

1. Data to be attested – This could be an encryption key for example, but there are no restrictions on the actual data to be attested
1. An evidence from the enclave – The first 32 bytes of the reportData field of the enclave report must be set to the SHA256 hash of the data in step #1
1. An Azure Active Directory Bearer token for the user who will perform the attestation. More information about retrieving an Azure AD bearer token can be found here: https://blogs.msdn.microsoft.com/jpsanders/2017/03/17/accessing-azure-app-services-using-azure-ad-bearer-token-2/ (see the portion of this blog post that discusses "Create code to get a Bearer token from Azure AD and use this token to call the Target app"
  1. Note: The resource URI of MAA required for the bearer token should be set.
eg. "https://attest.azure.net"
  1. MAA will respond with an HTTP 401 and standard OAuth 2.0 bearer challenge in the WWW-Authenticate response header when a bearer token is not presented as part of the attestation request.  This challenge can be parsed used to determine the appropriate resource and authority for an Azure AD token request.  An example of such challenge is shown below:
  
  ```
  HTTP 401; Unauthorized 
  WWW-Authenticate: Bearer authorization_uri="https://login.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47", resource="https://attest.azure.net" 
   ```

## Validation of the Attestation Token

One of the important steps in the attestation process is the validation of the returned JSON Web Token. Fortunately, as MAA follows standard JWT format, it can be verified and parsed by various existing libraries.

For example, the following code will validate the JWT returned by MAA (using the APIs in the Microsoft.IdentityModel.Tokens namespace).
Simple validation of the JWT can be done as:
```json
                var jwtHandler = new JsonWebTokenHandler();
                var validatedToken = jwtHandler.ValidateToken(encodedJwt, tokenValidationParams);
                Assert.IsTrue(validatedToken.IsValid);
```
For MAA, the certificate which is used to sign the quote is a self-signed certificate with a subject name, whose name matches the attestUri value for the tenant.



## MAA APIs

## Next steps

