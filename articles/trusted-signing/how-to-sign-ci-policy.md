---
title: Signing CI Policies 
description: Learn how to sign new CI policies with Trusted Signing.  
author: microsoftshawarma 
ms.author: rakiasegev 
ms.service: azure-code-signing 
ms.topic: how-to 
ms.date: 04/04/2024 
ms.custom: template-how-to-pattern 
---

# Sign CI Policies with Trusted Signing

To sign new CI policies with the service first install several prerequisites.

Prerequisites:

* A Trusted Signing account, Identity Validation, and Certificate Profile.
* Ensure there are proper individual or group role assignments for signing (the Trusted Signing Certificate Profile Signer role).
* [Azure PowerShell in Windows](/powershell/azure/install-azps-windows) installed.
* [Az.CodeSigning](/powershell/module/az.codesigning/) module downloaded.

Overview of steps:

1. ⁠Unzip the Az.CodeSigning module to a folder.
1. ⁠Open Windows PowerShell [PowerShell 7](https://github.com/PowerShell/PowerShell/releases/latest).
1. In the Az.CodeSigning folder, run

   ```powershell
   Import-Module .\Az.CodeSigning.psd1
   ```

1. Optionally you can create a `metadata.json` file:

   ```json
   "Endpoint": "https://xxx.codesigning.azure.net/" 
   "TrustedSigningAccountName": "<Trusted Signing Account Name>", 
   "CertificateProfileName": "<Certificate Profile Name>",
   ```

1. [Get the root certificate](/powershell/module/az.codesigning/get-azcodesigningrootcert) to be added to the trust store:

   ```powershell
   Get-AzCodeSigningRootCert -AccountName TestAccount -ProfileName TestCertProfile -EndpointUrl https://xxx.codesigning.azure.net/ -Destination c:\temp\root.cer
   ```

   Or using a metadata.json file:

   ```powershell
   Get-AzCodeSigningRootCert -MetadataFilePath C:\temp\metadata.json https://xxx.codesigning.azure.net/ -Destination c:\temp\root.cer 
   ```

1. To get the EKU (Extended Key Usage) to insert into your policy:

   ```powershell
   Get-AzCodeSigningCustomerEku -AccountName TestAccount -ProfileName TestCertProfile -EndpointUrl https://xxx.codesigning.azure.net/ 
   ```

   Or

   ```powershell
   Get-AzCodeSigningCustomerEku -MetadataFilePath C:\temp\metadata.json 
   ```

1. To sign your policy, you run the invoke command:

   ```powershell
   Invoke-AzCodeSigningCIPolicySigning -accountName TestAccount -profileName TestCertProfile -endpointurl "https://xxx.codesigning.azure.net/" -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
   ```

   Or use a `metadata.json` file and the following command:

   ```powershell
   Invoke-AzCodeSigningCIPolicySigning -MetadataFilePath C:\temp\metadata.json -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
   ```

## Create and deploy a CI policy

For steps to complete to create and deploy your CI policy, see these articles:

* [Use signed policies to protect Windows Defender Application Control against tampering](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering)
* [Windows Defender Application Control design guide](/windows/security/application-security/application-control/windows-defender-application-control/design/wdac-design-guide)
