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
1.	On machine with Azure PowerShell, install the Az.Attestation PowerShell module containing cmdlets for MAA.
a.	For Initial installation – Terminate all existing PowerShell windows

To install for “current user” 
Launch a non-elevated Powershell window and run:
Install-Module -Name Az.Attestation -AllowClobber -Scope CurrentUser

To install for "all users"
Launch an elevated PowerShell window and run:
Install-Module -Name Az.Attestation -AllowClobber -Scope AllUsers
Close the elevated PowerShell console.

b.	To update the installation – Terminate all existing PowerShell windows

To update for “current user” 
Launch a non-elevated Powershell window and run:
Update-Module -Name Az.Attestation

To update for "all users"
Launch an elevated PowerShell window and run:
Update-Module -Name Az.Attestation
Close the elevated PowerShell console.

2.	Sign in to Azure in PowerShell console (without elevated access privileges).

Connect-AzAccount

3.	If needed, switch to the subscription to be used for MAA.

Set-AzContext -Subscription <subscription id>  

4.	Register Microsoft.Attestation resource provider in subscription. For more information about Azure resource providers and how to configure and manage resources providers, see Azure resource providers and types.  Note that registering a resource provider is required only once for a subscription. 

Register-AzResourceProvider -ProviderNamespace Microsoft.Attestation 

5.	Create a resource group for attestation provider. Note that other Azure resources (including a VM with client application instance) can be put in the same resource group.	
$location = “uk south” 

$attestationResourceGroup = "<attestation provider resource group name>"
New-AzResourceGroup -Name $attestationResourceGroup -Location $location 

MAA is currently supported in the following locations
uksouth – TEE implementation supporting SGX attestation
eastus2, centralus – non TEE implementations upporting SGX and VBS attestation

6.	Create an attestation provider.
$attestationProvider = "<attestation provider name>" 

New-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Location $location

MAA is currently deployed  in the following locations
uksouth – TEE implementation supporting SGX attestation
eastus2, centralus – non TEE implementation upporting SGX and VBS attestation

Azure AD is the default trust model for new attestation providers.  The Isolated trust model will be used for a attestation provider if a filename is specified for the PolicySignerCertificateFile parameter. PolicySignerCertificateFile  is a file specifying a set of trusted signing keys. Please refer to “Benefits of policy signing” section of this document for more details.

New-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Location $location -PolicySignersCertificateFile “C:\test\policySignersCertificates.pem”


Example of PolicySignersCertificateFile content 

-----BEGIN CERTIFICATE-----
MIIDLDCCAhSgAwIBAgIIZSansCWcKTMwDQYJKoZIhvcNAQELBQAwFzEVMBMGA1UEAwwMTWFhVGVzdENlcnQxMCAXDTIwMDQyNTAwMDAwMFoYDzIwNzAwNDI1MDAwMDAwWjAXMRUwEwYDVQQDDAxNYWFUZXN0Q2VydDEwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCclUDpbgT373/FeFBKIpe1h/y4u36gOMI2NpVUKzUgi+uZySN6u199YDHKpaUTdMb77zLwBFrfulxHz7iY2LAVNj9GMdezHlgkd82i2t7dfwxdlo1e9klaaBe+LFV/WHL2k7RRxnfDU6bKk+ydYf8DKREGrdG6o2jEmBAPqDD3i+34CUV9rNy6mnULb5f1Cfr4xDYLGTL3rKECiMvHP2VYgm0gxJfuyCGYZbDfIemq07BiLbkxvn18mjGGs4yBCFKffk0oXkQG1OnDzrYWNlem5mfPNCcTj9ETc0jlB7ogLqVV5Lq9oioC5Kq+GxKil1JNuRt+fLDe1meiWZ+eu897AgMBAAGjejB4MEYGA1UdIwQ/MD2AFEhDF0Zt1jrSjCFCVvZpnXY7ovN1oRukGTAXMRUwEwYDVQQDDAxNYWFUZXN0Q2VydDGCCGUmp7AlnCkzMB0GA1UdDgQWBBRIQxdGbdY60owhQlb2aZ12O6LzdTAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQA90rXJV8ZjGqdlqeYxEwE0hxCatpZcN2rGcRC/URtRnJBQbWpB+79dzZHXO+UIF7zhVUww3eQyQuah0aC6s6tBUKjgFjkK9ZL6Sc/4qpyb6RE1HgjRCcegmU+80CdcqxgoqXTUyFWyqmAlsHXzW3xijrN1H9zdt7ptsbCXO4pb0Njqz54zsKMQL84ZTM9fXjkt7aZpKnhl5NP311SCMUO4kzmqim331RpWvuxZnt1f1kl4QeLh/YAF7+OEKNaFgyxOXF2DNvMFDYEWEw5F9vDk0VesUErOga3vFlIY9yfE8hF79qntsMYQncJAFIA5RZffLTn9HlYmZtJeOZlCGyzi
-----END CERTIFICATE-----

 For more information on the command and its parameters, see New-AzAttestation


7.	Retrieve the Status and AttestURI properties of the newly created provider. Note that initially the status value is Not Ready. It can take up to 10 minutes for it to become Ready. Therefore, run the below command a few times to confirm the new attestation provider is ready to use. Take a note of AttestURI, as it will be needed later.

Get-AzAttestation -Name $attestationProvider -ResourceGroupName $attestationResourceGroup  

For more information on the command and its parameters, see Get-AzAttestation
The above command should produce an output like the one below: 
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

Policy management
In order to manage policies, an Azure AD user requires the following permissions for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read
- Microsoft.Attestation/attestationProviders/attestation/write
- Microsoft.Attestation/attestationProviders/attestation/delete
These permissions can be assigned to an AD user through a role such as "Owner" (wildcard permissions), "Contributor" (wildcard permissions) or "Attestation Contributor" (specific permissions for MAA only).  
In order to read policies, an Azure AD user requires the following permission for "Actions":
- Microsoft.Attestation/attestationProviders/attestation/read
This permission can be assigned to an AD user through a role such as "Reader" (wildcard permissions) or "Attestation Reader" (specific permissions for MAA only).

Three PowerShell cmdlets will enable managing policy (one TEE at a time) for an attestation provider in both Azure AD and Isolated trust models:

$teeType = "<tee Type>"
Supported TEE types are “sgxenclave” and “vbsenclave”

Get-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 

$policyFormat = "<policy format>"
Supported policy formats are “Text” and “JWT”. Policy format is optional and “Text” is the default format. In Azure AD trust model, user can upload policy in MAA specific policy format (PolicyFormat=”Text”) or in JWT format (PolicyFormat=”JWT”). In isolated trust model, user can upload a policy only in JWT format.

$policy=Get-Content -path "C:\test\policy.txt" -Raw
Set-AzAttestationPolicy   -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType -Policy $policy -PolicyFormat $policyFormat 

Reset-AzAttestationPolicy -Name $attestationProvider -ResourceGroupName $attestationResourceGroup -Tee $teeType 
Please refer to “Authoring and signing attestation policy” section of this document to understand how to create a policy.

Get-AzAttestationPolicy returns the current policy for the specified TEE.  The cmdlet displays both human readable and JWT encoded version of the policy.

Set-AttestationPolicy sets a new policy for the specified TEE.  The cmdlet accepts either human readable or JWT encoded policy for the Policy parameter, controlled by the value of a parameter named PolicyFormat.

Reset-AzAttestationPolicy resets the policy to default for the specified TEE.  

Examples of policy content
Policy for SGX enclave with PolicyFormat=Text       
version= 1.0;authorizationrules{c:[type=="$is-debuggable"] => permit();};issuancerules{c:[type=="$is-debuggable"] => issue(type="is-debuggable", value=c.value);c:[type=="$sgx-mrsigner"] => issue(type="sgx-mrsigner", value=c.value);c:[type=="$sgx-mrenclave"] => issue(type="sgx-mrenclave", value=c.value);c:[type=="$product-id"] => issue(type="product-id", value=c.value);c:[type=="$svn"] => issue(type="svn", value=c.value);c:[type=="$tee"] => issue(type="tee", value=c.value);};
Unsigned Policy for SGX enclave with PolicyFormat=JWT        eyJhbGciOiJub25lIn0.eyJBdHRlc3RhdGlvblBvbGljeSI6ICJkbVZ5YzJsdmJqMGdNUzR3TzJGMWRHaHZjbWw2WVhScGIyNXlkV3hsYzN0ak9sdDBlWEJsUFQwaUpHbHpMV1JsWW5WbloyRmliR1VpWFNBOVBpQndaWEp0YVhRb0tUdDlPMmx6YzNWaGJtTmxjblZzWlhON1l6cGJkSGx3WlQwOUlpUnBjeTFrWldKMVoyZGhZbXhsSWwwZ1BUNGdhWE56ZFdVb2RIbHdaVDBpYVhNdFpHVmlkV2RuWVdKc1pTSXNJSFpoYkhWbFBXTXVkbUZzZFdVcE8yTTZXM1I1Y0dVOVBTSWtjMmQ0TFcxeWMybG5ibVZ5SWwwZ1BUNGdhWE56ZFdVb2RIbHdaVDBpYzJkNExXMXljMmxuYm1WeUlpd2dkbUZzZFdVOVl5NTJZV3gxWlNrN1l6cGJkSGx3WlQwOUlpUnpaM2d0YlhKbGJtTnNZWFpsSWwwZ1BUNGdhWE56ZFdVb2RIbHdaVDBpYzJkNExXMXlaVzVqYkdGMlpTSXNJSFpoYkhWbFBXTXVkbUZzZFdVcE8yTTZXM1I1Y0dVOVBTSWtjSEp2WkhWamRDMXBaQ0pkSUQwLUlHbHpjM1ZsS0hSNWNHVTlJbkJ5YjJSMVkzUXRhV1FpTENCMllXeDFaVDFqTG5aaGJIVmxLVHRqT2x0MGVYQmxQVDBpSkhOMmJpSmRJRDAtSUdsemMzVmxLSFI1Y0dVOUluTjJiaUlzSUhaaGJIVmxQV011ZG1Gc2RXVXBPMk02VzNSNWNHVTlQU0lrZEdWbElsMGdQVDRnYVhOemRXVW9kSGx3WlQwaWRHVmxJaXdnZG1Gc2RXVTlZeTUyWVd4MVpTazdmVHMifQ.

Signed Policy for SGX enclave with PolicyFormat=JWT 
eyAiYWxnIjoiUlMyNTYiLCAieDVjIjogWyJNSUlETERDQ0FoU2dBd0lCQWdJSVpTYW5zQ1djS1RNd0RRWUpLb1pJaHZjTkFRRUxCUUF3RnpFVk1CTUdBMVVFQXd3TVRXRmhWR1Z6ZEVObGNuUXhNQ0FYRFRJd01EUXlOVEF3TURBd01Gb1lEekl3TnpBd05ESTFNREF3TURBd1dqQVhNUlV3RXdZRFZRUUREQXhOWVdGVVpYTjBRMlZ5ZERFd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0SUJEd0F3Z2dFS0FvSUJBUUNjbFVEcGJnVDM3My9GZUZCS0lwZTFoL3k0dTM2Z09NSTJOcFZVS3pVZ2krdVp5U042dTE5OVlESEtwYVVUZE1iNzd6THdCRnJmdWx4SHo3aVkyTEFWTmo5R01kZXpIbGdrZDgyaTJ0N2Rmd3hkbG8xZTlrbGFhQmUrTEZWL1dITDJrN1JSeG5mRFU2YktrK3lkWWY4REtSRUdyZEc2bzJqRW1CQVBxREQzaSszNENVVjlyTnk2bW5VTGI1ZjFDZnI0eERZTEdUTDNyS0VDaU12SFAyVllnbTBneEpmdXlDR1laYkRmSWVtcTA3QmlMYmt4dm4xOG1qR0dzNHlCQ0ZLZmZrMG9Ya1FHMU9uRHpyWVdObGVtNW1mUE5DY1RqOUVUYzBqbEI3b2dMcVZWNUxxOW9pb0M1S3ErR3hLaWwxSk51UnQrZkxEZTFtZWlXWitldTg5N0FnTUJBQUdqZWpCNE1FWUdBMVVkSXdRL01EMkFGRWhERjBadDFqclNqQ0ZDVnZacG5YWTdvdk4xb1J1a0dUQVhNUlV3RXdZRFZRUUREQXhOWVdGVVpYTjBRMlZ5ZERHQ0NHVW1wN0FsbkNrek1CMEdBMVVkRGdRV0JCUklReGRHYmRZNjBvd2hRbGIyYVoxMk82THpkVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUE5MHJYSlY4WmpHcWRscWVZeEV3RTBoeENhdHBaY04yckdjUkMvVVJ0Um5KQlFiV3BCKzc5ZHpaSFhPK1VJRjd6aFZVd3czZVF5UXVhaDBhQzZzNnRCVUtqZ0Zqa0s5Wkw2U2MvNHFweWI2UkUxSGdqUkNjZWdtVSs4MENkY3F4Z29xWFRVeUZXeXFtQWxzSFh6VzN4aWpyTjFIOXpkdDdwdHNiQ1hPNHBiME5qcXo1NHpzS01RTDg0WlRNOWZYamt0N2FacEtuaGw1TlAzMTFTQ01VTzRrem1xaW0zMzFScFd2dXhabnQxZjFrbDRRZUxoL1lBRjcrT0VLTmFGZ3l4T1hGMkROdk1GRFlFV0V3NUY5dkRrMFZlc1VFck9nYTN2RmxJWTl5ZkU4aEY3OXFudHNNWVFuY0pBRklBNVJaZmZMVG45SGxZbVp0SmVPWmxDR3l6aSJdfQ.eyJBdHRlc3RhdGlvblBvbGljeSI6ICJ2ZXJzaW9uPSAxLjA7YXV0aG9yaXphdGlvbnJ1bGVze2M6W3R5cGU9PVwiJGlzLWRlYnVnZ2FibGVcIl0gPT4gcGVybWl0KCk7fTtpc3N1YW5jZXJ1bGVze2M6W3R5cGU9PVwiJGlzLWRlYnVnZ2FibGVcIl0gPT4gaXNzdWUodHlwZT1cImlzLWRlYnVnZ2FibGVcIiwgdmFsdWU9Yy52YWx1ZSk7YzpbdHlwZT09XCIkc2d4LW1yc2lnbmVyXCJdID0-IGlzc3VlKHR5cGU9XCJzZ3gtbXJzaWduZXJcIiwgdmFsdWU9Yy52YWx1ZSk7YzpbdHlwZT09XCIkc2d4LW1yZW5jbGF2ZVwiXSA9PiBpc3N1ZSh0eXBlPVwic2d4LW1yZW5jbGF2ZVwiLCB2YWx1ZT1jLnZhbHVlKTtjOlt0eXBlPT1cIiRwcm9kdWN0LWlkXCJdID0-IGlzc3VlKHR5cGU9XCJwcm9kdWN0LWlkXCIsIHZhbHVlPWMudmFsdWUpO2M6W3R5cGU9PVwiJHN2blwiXSA9PiBpc3N1ZSh0eXBlPVwic3ZuXCIsIHZhbHVlPWMudmFsdWUpO2M6W3R5cGU9PVwiJHRlZVwiXSA9PiBpc3N1ZSh0eXBlPVwidGVlXCIsIHZhbHVlPWMudmFsdWUpO2M6W3R5cGU9PVwiJHRlZS1mdXR1cmVcIl0gPT4gaXNzdWUodHlwZT1cInRlZS1mdXR1cmVcIiwgdmFsdWU9Yy52YWx1ZSk7fTsifQ.Rm_KOcxPzo_6AytCyoWrgRa50efT_87gR9_Yewxeuesji99drOepXp50qabnPc0oCyy5ArcPSETeYCaYQrrNVhCTEW-3U_WJxXKrHuQIa9IcE06muFrA4X4esjCitbgrTujKzf83puB5u8vUG0KI_y9FAKGIjrZzDRXAG0126DOCjMltUxyRpNpXq5Ex6SQI5q-CQctoO9kYkMrYoUTqAxiAJ8mpNvC4Ufe4TjF8t6SpSI2zXXta_gY_decJ8AkyDx4YkzbHn5QzjaXaXoHMgbj_76D_RnGhANC0u5rBHvqScFMTO50QnPW94frkn-9PBtWuQ0g7Q1TeERkoMknhBA       

Please note that all semantic manipulation of the Policy must be done outside of PowerShell – as far as PowerShell is concerned, Policy is a simple string.

Three PowerShell cmdlets will enable managing policy signing keys (RFC) for an attestation provider :
Get-AzAttestationPolicySigners  -Name $attestationProvider -ResourceGroupName $attestationResourceGroup 

Add-AzAttestationPolicySigner  -Name $attestationProvider -ResourceGroupName $attestationResourceGroup  -Signer <signer>

Remove-AzAttestationPolicySigner -Name $attestationProvider -ResourceGroupName $attestationResourceGroup  -Signer <signer>
Signer specifies the RFC7519 JSON Web Token containing a claim named "maa-policyCertificate" whose value is an RFC7517 JSON Web Key which contains a new trusted signing key to add. The RFC7519 JWT must be signed with one of the existing trusted signing keys.

Get-AzAttestationPolicySigners returns the complete set of trusted policy signers.  
Add-AttestationPolicySigner adds a new trusted signer.  
Remove-AzAttestationPolicySigner removes the specified signer.  

Example of Signer content
eyAiYWxnIjoiUlMyNTYiLCAieDVjIjogWyJNSUlETERDQ0FoU2dBd0lCQWdJSVpTYW5zQ1djS1RNd0RRWUpLb1pJaHZjTkFRRUxCUUF3RnpFVk1CTUdBMVVFQXd3TVRXRmhWR1Z6ZEVObGNuUXhNQ0FYRFRJd01EUXlOVEF3TURBd01Gb1lEekl3TnpBd05ESTFNREF3TURBd1dqQVhNUlV3RXdZRFZRUUREQXhOWVdGVVpYTjBRMlZ5ZERFd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0SUJEd0F3Z2dFS0FvSUJBUUNjbFVEcGJnVDM3My9GZUZCS0lwZTFoL3k0dTM2Z09NSTJOcFZVS3pVZ2krdVp5U042dTE5OVlESEtwYVVUZE1iNzd6THdCRnJmdWx4SHo3aVkyTEFWTmo5R01kZXpIbGdrZDgyaTJ0N2Rmd3hkbG8xZTlrbGFhQmUrTEZWL1dITDJrN1JSeG5mRFU2YktrK3lkWWY4REtSRUdyZEc2bzJqRW1CQVBxREQzaSszNENVVjlyTnk2bW5VTGI1ZjFDZnI0eERZTEdUTDNyS0VDaU12SFAyVllnbTBneEpmdXlDR1laYkRmSWVtcTA3QmlMYmt4dm4xOG1qR0dzNHlCQ0ZLZmZrMG9Ya1FHMU9uRHpyWVdObGVtNW1mUE5DY1RqOUVUYzBqbEI3b2dMcVZWNUxxOW9pb0M1S3ErR3hLaWwxSk51UnQrZkxEZTFtZWlXWitldTg5N0FnTUJBQUdqZWpCNE1FWUdBMVVkSXdRL01EMkFGRWhERjBadDFqclNqQ0ZDVnZacG5YWTdvdk4xb1J1a0dUQVhNUlV3RXdZRFZRUUREQXhOWVdGVVpYTjBRMlZ5ZERHQ0NHVW1wN0FsbkNrek1CMEdBMVVkRGdRV0JCUklReGRHYmRZNjBvd2hRbGIyYVoxMk82THpkVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQTBHQ1NxR1NJYjNEUUVCQ3dVQUE0SUJBUUE5MHJYSlY4WmpHcWRscWVZeEV3RTBoeENhdHBaY04yckdjUkMvVVJ0Um5KQlFiV3BCKzc5ZHpaSFhPK1VJRjd6aFZVd3czZVF5UXVhaDBhQzZzNnRCVUtqZ0Zqa0s5Wkw2U2MvNHFweWI2UkUxSGdqUkNjZWdtVSs4MENkY3F4Z29xWFRVeUZXeXFtQWxzSFh6VzN4aWpyTjFIOXpkdDdwdHNiQ1hPNHBiME5qcXo1NHpzS01RTDg0WlRNOWZYamt0N2FacEtuaGw1TlAzMTFTQ01VTzRrem1xaW0zMzFScFd2dXhabnQxZjFrbDRRZUxoL1lBRjcrT0VLTmFGZ3l4T1hGMkROdk1GRFlFV0V3NUY5dkRrMFZlc1VFck9nYTN2RmxJWTl5ZkU4aEY3OXFudHNNWVFuY0pBRklBNVJaZmZMVG45SGxZbVp0SmVPWmxDR3l6aSJdfQ.eyJtYWEtcG9saWN5Q2VydGlmaWNhdGUiOiB7Imt0eSI6IlJTQSIsICJ4NWMiOlsiTUlJRExEQ0NBaFNnQXdJQkFnSUlmek9mOVIzcTBJc3dEUVlKS29aSWh2Y05BUUVMQlFBd0Z6RVZNQk1HQTFVRUF3d01UV0ZoVkdWemRFTmxjblF5TUNBWERUSXdNRFF5TlRBd01EQXdNRm9ZRHpJd056QXdOREkxTURBd01EQXdXakFYTVJVd0V3WURWUVFEREF4TllXRlVaWE4wUTJWeWRESXdnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDWCtWU2ZOY01sLzVoWTFUcUY2d3JmMTU0UzZQNDh6YmU1cUI4N2wzYkRIb2hMb2FHTUxvN0NDR3Z5SXZFWUw0a3d2eDZLRU1MNkN5UHB2UndYSVZQaGZ5dGhYQnRaZ2Fyb3hLUDF1OVlYVnhQRkNIRTd5NE56ODFtTE9LSVkwMllzcHIzdGl3WllpSmQ0cFRzVUxITHNnSUJMRk1Hdjc0K1JtaDJxTzc0eEs5SXBKdkdsWlVnNFRXNGgvNHRjOGkzYVVjYVpGRGNIaU40aHlMcUczc05WOUhVRHVaaGR5eHJJZUlVUkNoQ0JwUWN4V000MGxGZU5EV3R5VFRRaURkWUthb1hQY2NUTDNjZWxlVUVQMm1YOVUrb2dZd0M4S0NQbXZrUVRWL1I3djdiVDI5UWtvWXBjRC80L29zL1pLMzVNNDR5emtTZ3BWdWVYNnJOZTZqcXZBZ01CQUFHamVqQjRNRVlHQTFVZEl3US9NRDJBRkpTdVVoaS9jWXhHUDZmZ01UVkJXTkEzeFZ2NG9SdWtHVEFYTVJVd0V3WURWUVFEREF4TllXRlVaWE4wUTJWeWRES0NDSDh6bi9VZDZ0Q0xNQjBHQTFVZERnUVdCQlNVcmxJWXYzR01SaituNERFMVFWalFOOFZiK0RBUEJnTlZIUk1CQWY4RUJUQURBUUgvTUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFCMFJYa0Jjb1E0b3lSenB2VXZDTEt6amJGemQ5UU40ZnprNWtMRXN2RUFpdmJCN01Oam9EV0NYSEhkV2FjeDRsb0FrY2RIR1A2amczN2dKUFhSTVJnTlVlREFjTFpITk52WEtQTE9Ka1BldWtDMzZ4S0F3WTI2cUhrTlV2bmx4UmZ0cEdaUUJpVjdUYnVnY3NGeExQSFE2K3FidDZ1ejc0Y2cxQUVvejh2VlpGTVdvK1ZHY0VFRVhtVEtLZFpDWTk5NC9mQWpJbGdvV01Gb2xxeFZhRjBnUTlhQ2dab1RibkNoYTcvTkcvZklHMDNFbHQzTGlYOEFOczhMMHBpQjJRVEw2bDYxd0dWcXViOGN1bnRwTGpnaHRoM1dBUWtMdnpMSC84R2k0S2xqYmRZeXpGemtjNVVSM0pxUStKMXcwWVlEN0xSTHpGcjY3bWFxamtPMjJmdm8iXX19.dROaeoVXpzJuOI4VIAYvhr9ruhfDRXbFAHNSp63XWTpfmi3MGRELa8YtWRpuITt73fYCW_vow2xnFBwttCg1lbWvFxKDGJvKecIz-FjAgXOxToaKsu-Xn8KJVi1lo_cB0xTSJzjbJ7rtdjIOcT-gTHy4Hajf0OeJSepa2rGngkuccAOmJ-cM49KpRl2ptRxyN62rhIWLxymdtofJPdgtbiwvV-Q5ETX2efOwcuWD7CnIf7rSPN1ec3JrWJT5TFtHz5NIYytadsOxBKWlWFSiDJt7XO_KAMqtJuVpbkkmhT-SMmar1xP3TQS1wRhd4QUUVFAsjdiGol98Jyi_3QBneA

Note that all semantic manipulation of the policy signers must be done outside of PowerShell – as far as PowerShell is concerned, Signer is a simple string.


Configure an Azure AD identity for client application
1.	During an attestation workflow, client application will send attestation requests to MAA. For that, it must obtain an authentication token from Azure AD, which requires an identity in Azure AD. 
2.	If the client application instance is running in an Azure VM, we recommend using system-assigned managed identities 
3.	 If the client application is running outside of Azure, customers may need to use service principals with application IDs and secrets.

Provision a managed identity
This section explains how to assign a system-assigned managed identity to customer’s VM and how to retrieve it using Azure PowerShell. For further details and related information see:
- Configure managed identities for Azure resources on an Azure VM using PowerShell 
- Configure managed identities for Azure resources on a VM using the Azure portal
The following instructions assume there is an active PowerShell session, customer has signed into Azure, and connected to a subscription containing VM and attestation provider. Customers can execute the below steps on any machine.
1.	Enable a system-assigned managed identity for VM.
$vmResourceGroup = “<VM resource group name>”
$vmName = “<VM name>”
$vm = Get-AzVM -ResourceGroupName $vmResourceGroup -Name $vmName
Update-AzVM -ResourceGroupName $vmResourceGroup -VM $vm -AssignIdentity:$SystemAssigned

2.	Retrieve a service principal representing the VM in Azure AD. It may take a while for the managed identity to propagate in Azure AD. Therefore, if the output of the below commands is empty, wait for a few minutes and repeat them.

$vm = Get-AzVM -ResourceGroupName $vmResourceGroup -Name $vmName
$sp = Get-AzADServicePrincipal -ObjectId $vm.Identity.PrincipalId 
$sp 
3.	Output an application id of the service principal. Take note of the application id, as it will be needed in a later step.

Write-Host "Application Id:" $sp.ApplicationId.Guid 

Provision a service principal
This section explains how to create a service principal and retrieve information about it using Azure PowerShell. For further details and related information see:
- Create an Azure service principal with Azure PowerShell
- How to: Use the portal to create an Azure AD application and service principal that can access resources
The following instructions assume there is an active PowerShell session, customer has signed in to Azure and connected to a subscription containing VM and attestation provider.
1.	Create a service principal in Azure AD. 
$servicePrincipalName = "<service principal name>"
$sp = New-AzADServicePrincipal -DisplayName $servicePrincipalName

2.	Export the secret of the created service principal.
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp.Secret)
$UnsecureSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

3.	Output an application id and the secret of the new service principal. Take note of this information, as it will be needed in a later step.
Write-Host "Application Id:" $sp.ApplicationId.Guid 
Write-Host "Secret:" $UnsecureSecret
 

Grant client application access to MAA
In this step, Azure AD identity created for client application instance in the previous step should be assigned to the Attestation Reader role in Azure RBAC for the resource group containing MAA provider. This will allow client application to send attestation requests to attestation provider. This section describes how to do that using Azure PowerShell.  For further details and related information see:
- Manage access to Azure resources using RBAC and Azure PowerShell
- How to: Use the portal to create an Azure AD application and service principal that can access resources
The following instructions assume there is a retained the PowerShell session from the previous step.
1.	Assign the service principal from Step 3 of “Configure an Azure AD identity for client application” section to the Attestation Reader role of the resource group containing attestation provider.
$attestationResourceGroup = "<attestation provider resource group name>"
New-AzRoleAssignment -ApplicationId $sp.ApplicationId.Guid -RoleDefinitionName "Attestation Reader" -ResourceGroupName $attestationResourceGroup

2.	Validate the service principal is assigned to the Attestation Reader role.

Get-AzRoleAssignment -ServicePrincipalName $sp.ApplicationId.Guid -ResourceGroupName $attestationResourceGroup

Access MAA from client application
Now enclave attestation can be performed using MAA.
In order to perform an attestation operation, a few pieces of data should be prepared ahead of time:
1)	Data to be attested – This could be an encryption key for example, but there are no restrictions on the actual data to be attested
2)	An evidence from the enclave – The first 32 bytes of the reportData field of the enclave report must be set to the SHA256 hash of the data in step #1
3)	An Azure Active Directory Bearer token for the user who will perform the attestation. More information about retrieving an Azure AD bearer token can be found here: https://blogs.msdn.microsoft.com/jpsanders/2017/03/17/accessing-azure-app-services-using-azure-ad-bearer-token-2/ (see the portion of this blog post that discusses “Create code to get a Bearer token from Azure AD and use this token to call the Target app”
a.	Note: The resource URI of MAA required for the bearer token should be set.
eg. “https://attest.azure.net”
b.	MAA will respond with an HTTP 401 and standard OAuth 2.0 bearer challenge in the WWW-Authenticate response header when a bearer token is not presented as part of the attestation request.  This challenge can be parsed used to determine the appropriate resource and authority for an Azure AD token request.  An example of such challenge is shown below:
HTTP 401; Unauthorized 
WWW-Authenticate: Bearer authorization_uri="https://login.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47", resource="https://attest.azure.net" 

Validation of the Attestation Token
One of the important steps in the attestation process is the validation of the returned JSON Web Token. Fortunately, as MAA follows standard JWT format, it can be verified and parsed by various existing libraries.
For example, the following code will validate the JWT returned by MAA (using the APIs in the Microsoft.IdentityModel.Tokens namespace).
Simple validation of the JWT can be done as:
                var jwtHandler = new JsonWebTokenHandler();
                var validatedToken = jwtHandler.ValidateToken(encodedJwt, tokenValidationParams);
                Assert.IsTrue(validatedToken.IsValid);
For MAA, the certificate which is used to sign the quote is a self-signed certificate with a subject name, whose name matches the attestUri value for the tenant.



MAA APIs
MAA supports the following operations (the path for the API is in parenthesis). Each of the APIs is a RESTful API and is accessed via HTTP URIs.
The following are the currently supported attestation APIs
Attest an SGX Enclave
Processes an SGX enclave quote, producing an artifact. The type of artifact produced is dependent upon attestation policy.
Schemes: https
HTTP Verb: POST
URL: <attestUri>/attest/SgxEnclave
(Note - For OpenEnclave generated quotes use the following URL: <attestUri>/attest/Tee/OpenEnclave)
Required Parameters: api-version=2018-09-01-preview
Example URL: https://tradewinds.us.attest.azure.net:443/attest/SgxEnclave?api-version=2018-09-01-preview
Example URL to attest OpenEnclave generated quotes:  https://tradewinds.us.attest.azure.net:443/attest/Tee/OpenEnclave?api-version=2018-09-01-preview
Required Headers: Authorization: Bearer <Azure AD Bearer token>
Required permissions: “Read”
HTTP Body: JSON Attestation request object 
Properties:
"Quote" –Quote of the enclave to be attested, "type" :"string"
"EnclaveHeldData" –Enclave-held data corresponding to quote , type :string
"DraftPolicyForAttestation " –Attest against the provided draft policy. Note that the resulting token cannot be validated, type :string
HTTP Response: 
Status code “200” – success, type :string 
Status code “400” – the input is not valid, type :string
Status code “401” – Request is unauthorized, type: string

Get OpenID Metadata
The Get OpenID Metadata API returns an OpenID Configuration response as specified by the OpenID Connect Discovery protocol. The API retrieves metadata about the attestation signing keys in use by MAA
HTTP Verb: GET
URL: <attestUri>/.well-known/openid-configuration
Required Parameters: <None>
Example URL: https://tradewinds.us.attest.azure.net:443/.well-known/openid-configuration
Required Headers:<None>
Required permissions: N/A
HTTP Body: None
Response: On a successful HTTP response (200), the body of the response to the well-known/openid-configuration API will be an OpenID Provider Configuration Response.
An example configuration response from MAA looks like:
{
	"response_types_supported":[
		"token",
		"none"
	],
	"id_token_signing_alg_values_supported":["RS256"],
	“revocation_endpoint”:”https://tradewinds.us.attest.azure.net/revoke”,
	"jwks_uri":"https://tradewinds.us.attest.azure.net/certs",
	"claims_supported":[
		"is-debuggable",
		"sgx-mrsigner",
		"sgx-mrenclave",
		"product-id",
		"svn",
		"tee",
		"device_id",
		"component_0_id",
		"expected_components"
	]
}

Status code 400: This is a general validation error. The body in the response for a 400 status code will contain information about the cause of the failure formatted as a JSON document.

Get Attestation Signing Keys
The Get Attestation Signing Keys API returns an RFC 7517 JSON Web Key Set that contains the signing keys used to sign the attestation response.
HTTP Verb: GET
URL: <attestUri>/certs
Required Parameters: <None>
Example URL: https://tradewinds.us.attest.azure.net:443/.certs
Required Headers:<None>
Required permissions: N/A
HTTP Body: None
Response: On a successful HTTP response (200), the body of the response to the /certs API will be an RFC 7517 JSON Web Key Set
An example key response from MAA looks like:
{
    "keys": [
        {
            "x5c": [
                "MIIC6jCCAdKgAwIBAgIQFqNSMWGaf7RN4iOlBGU3bjANBgkqhkiG9w0BAQsFADAxMS8wLQYDVQQDEyZodHRwczovL3RyYWRld2luZHMudXMuYXR0ZXN0LmF6dXJlLm5ldDAeFw0xOTA5MTEwMDIwNDBaFw0yMDA5MTAwNjIwNDBaMDExLzAtBgNVBAMTJmh0dHBzOi8vdHJhZGV3aW5kcy51cy5hdHRlc3QuYXp1cmUubmV0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Y/cu5YHLGMPleFrlMs+Ji8D7nU7T9m7FBAHrRHukDGSq2IW0w63jF04WNljhf2N2kSBueGoD5jhbbNSWTHe0Hvyl90NC8pY6ESesBADV5NYwf6xg5eCHAOAzvKCxAfLbEvEoF2pOkUi8M6umiFxtS3ditAhtXlp8e2ZJOyMd7p/DiwD6Gfakg8mGVv3oNfM7/SdPk8P8w7b7tqj7SocUO/Sini4bCLKMkbpd0tZWTbmlLwn/9eeWrzrm7Zb4XC2zzbIpYLPNl9L7Ye9WYYu3k7SIzBDh+uPQc0n13G6/tp6WjVjNAPE4wW8Zj82iNfoQM872VCjbVuIrohYg7izzwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQDHcDhtf5lxDLPA196Sj3Zodj5wrEJ8rOiXonaLCywAXuS2G8JaPQx2jHvpKwgVFm9G/ipk5qtkLmzEhA0Zud4VrLAUGKZY7tx/I2LYEQX7SmvYtZnuFRXrSMptaTrwx/lP/0jsLdmp2HjLAjE+N8MLqPpz5BIbl1tfhRT9jXNhHsARlwjBWxrcxjj10CsLQkhRjMnmnM5wJPeVJCuvc4bPlGnD0t0CICcZ7Ke5OeHcVeGyfRSvtN5XnpY1/kYHbAMPJMw7kQfiCF3eJK8zEKreAnwReZyAOrfLvLzpuZ++crzY5CsnzASdynaaVxZDGRO0lEUp29wJgM1sP79GB6tI"
            ],
            "kid": "f1lIjBlb6jUHEUp1/nH6BNUHc6vwiUyMKKhReZeEpGc=",
            "kty": "RSA"
        },
        {
            "x5c": [
                "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",
                "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",
                "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"
            ],
            "kid": "ZQzLfoNwhBNCu9r8Fucjn6H4Cdw",
            "kty": "RSA"
        }
    ]
}

Status code 400: This is a general validation error. The body in the response for a 400 status code will contain information about the cause of the failure formatted as a JSON document.
The error response is a JSON document with a single property named “error”. The value of the “error” property is an object which in turn contains two properties: “code”, which is a string representation of the error returned and “message” which contains additional information about the details of the error. eError.


## Next steps

