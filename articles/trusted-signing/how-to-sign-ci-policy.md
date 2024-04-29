---
title: Signing CI Policies 
description: Learn how to sign new CI policies with Trusted Signing.  
author: microsoftshawarma 
ms.author: rakiasegev 
ms.service: trusted-signing
ms.topic: how-to 
ms.date: 04/04/2024 
ms.custom: template-how-to-pattern 
---

# Sign CI Policies with Trusted Signing

To sign new CI policies with the service first install several prerequisites. 


Prerequisites: 
* A Trusted Signing account, Identity Validation, and Certificate Profile.
* Ensure there are proper individual or group role assignments for signing (“Trusted Signing Certificate Profile Signer” role).
* [Azure PowerShell on Windows](/powershell/azure/install-azps-windows) installed 
* [Az.CodeSigning](/powershell/module/az.codesigning/) module downloaded

Overview of steps:
1. ⁠Unzip the Az.CodeSigning module to a folder
2. ⁠Open Windows PowerShell [PowerShell 7](https://github.com/PowerShell/PowerShell/releases/latest)
3. In the Az.CodeSigning folder, run 
```
Import-Module .\Az.CodeSigning.psd1
``` 
4. Optionally you can create a `metadata.json` file:
```
"Endpoint": "https://xxx.codesigning.azure.net/" 
"TrustedSigningAccountName": "<Trusted Signing Account Name>", 
"CertificateProfileName": "<Certificate Profile Name>",
```
5. [Get the root certificate](/powershell/module/az.codesigning/get-azcodesigningrootcert) to be added to the trust store
```
Get-AzCodeSigningRootCert -AccountName TestAccount -ProfileName TestCertProfile -EndpointUrl https://xxx.codesigning.azure.net/ -Destination c:\temp\root.cer
```
Or using a metadata.json
```
Get-AzCodeSigningRootCert -MetadataFilePath C:\temp\metadata.json https://xxx.codesigning.azure.net/ -Destination c:\temp\root.cer 
```
6. To get the EKU (Extended Key Usage) to insert into your policy:
```
Get-AzCodeSigningCustomerEku -AccountName TestAccount -ProfileName TestCertProfile -EndpointUrl https://xxx.codesigning.azure.net/ 
```
Or

```
Get-AzCodeSigningCustomerEku -MetadataFilePath C:\temp\metadata.json 
```
7. To sign your policy, you run the invoke command:
``` 
Invoke-AzCodeSigningCIPolicySigning -accountName TestAccount -profileName TestCertProfile -endpointurl "https://xxx.codesigning.azure.net/" -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
```
 
Or use a `metadata.json` file and the following command: 

```
Invoke-AzCodeSigningCIPolicySigning -MetadataFilePath C:\temp\metadata.json -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
```

## Creating and Deploying a CI Policy

For steps on creating and deploying your CI policy refer to:
* [Use signed policies to protect Windows Defender Application Control against tampering](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering)
* [Windows Defender Application Control design guide](/windows/security/application-security/application-control/windows-defender-application-control/design/wdac-design-guide)