---
title: Signing CI Policies #Required; page title is displayed in search results. Include the brand.
description: Learn how to sign new CI policies with Trusted Signing. #Required; article description that is displayed in search results. 
author: microsoftshawarma #Required; your GitHub user alias, with correct capitalization.
ms.author: rakiasegev #Required; microsoft alias of author; optional team alias.
ms.service: azure-code-signing #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 04/04/2024 #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Sign CI Policies with Trusted Signing

To sign new CI policies with the service first install several prerequisites. 


Prerequisites: 
* A Trusted Signing account, Identity Validation, and Certificate Profile.
* Ensure there are proper individual or group role assignments for signing (“Trusted Signing Certificate Profile Signer” role).
* [Azure PowerShell on Windows](https://learn.microsoft.com/powershell/azure/install-azps-windows) installed 
* [Az.CodeSigning](https://learn.microsoft.com/powershell/module/az.codesigning/) module downloaded

Overview of steps:
1. ⁠Unzip the Az.CodeSigning module to a folder
2. ⁠Open Windows PowerShell [PowerShell 7](https://github.com/PowerShell/PowerShell/releases/latest)
3. In the Az.CodeSigning folder, run 
```
Import-Module .\Az.CodeSigning.psd1
``` 
4. Optionally you can create a `metadata.json` file:
```
Endpoint "https://scus.codesigning.azure.net/" 
CodeSigningAccountName "youracsaccount" 
CertificateProfileName "youracscertprofile" 
```
5. [Get the root certificate](https://learn.microsoft.com/powershell/module/az.codesigning/get-azcodesigningrootcert) to be added to the trust store
```
Get-AzCodeSigningRootCert -AccountName TestAccount -ProfileName TestCertProfile -EndpointUrl https://xxx.codesigning.azure.net/ -Destination c:\temp\root.cer
```
Or using a metadata.json
```
Get-AzCodeSigningRootCert -MetadataFilePath C:\temp\metadata.sample.scus.privateci.json https://xxx.codesigning.azure.net/ -Destination c:\temp\root.cer 
```
6. To get the EKU (Extended Key Usage) to insert into your policy:
```
Get-AzCodeSigningCustomerEku -AccountName acstestcanary -ProfileName acstestcanaryCert1 -EndpointUrl https://xxx.codesigning.azure.net/ 
```
Or

```
Get-AzCodeSigningCustomerEku -MetadataFilePath C:\temp\metadata.sample.scus.privateci.json 
```
7. To sign your policy, you run the invoke command:
``` 
Invoke-AzCodeSigningCIPolicySigning -accountName acstestcanary -profileName acstestcanaryCert1 -endpointurl "https://xxx.codesigning.azure.net/" -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
```
 
Or use a `metadata.json` file and the following command: 

```
Invoke-AzCodeSigningCIPolicySigning -MetadataFilePath C:\temp\metadata.sample.scus.privateci.json -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
```

## Creating and Deploying a CI Policy

For steps on creating and deploying your CI policy refer to:
* [Use signed policies to protect Windows Defender Application Control against tampering](https://learn.microsoft.com/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering)
* [Windows Defender Application Control design guide](https://learn.microsoft.com/windows/security/application-security/application-control/windows-defender-application-control/design/wdac-design-guide)

