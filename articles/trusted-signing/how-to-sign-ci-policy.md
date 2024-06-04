---
title: Sign a CI policy 
description: Learn how to sign new CI policies by using Trusted Signing.  
author: microsoftshawarma 
ms.author: rakiasegev 
ms.service: trusted-signing
ms.topic: how-to 
ms.date: 06/03/2024 
ms.custom: template-how-to-pattern 
---

# Sign a CI policy by using Trusted Signing

This article shows you how to sign new code integrity (CI) policies by using the Trusted Signing service.

## Prerequisites

To complete the steps in this article, you need:

- A Trusted Signing account, identity validation, and certificate profile.
- Individual or group assignment of the Trusted Signing Certificate Profile Signer role.
- [Azure PowerShell in Windows](/powershell/azure/install-azps-windows) installed.
- [Az.CodeSigning](/powershell/module/az.codesigning/) module downloaded.

## Sign a CI policy

1. ⁠Unzip the Az.CodeSigning module to a folder.
1. ⁠Open [PowerShell 7](https://github.com/PowerShell/PowerShell/releases/latest).
1. In the *Az.CodeSigning* folder, run this command:

   ```powershell
   Import-Module .\Az.CodeSigning.psd1
   ```

1. Optionally, you can create a *metadata.json* file that looks like this example:(`"Endpoint"` URI value must be a URI that aligns with the region where you created your Trusted Signing account and certificate profile when you set up these resources.)

   ```json
   {
   "Endpoint":"https://xxx.codesigning.azure.net/",
   "CodeSigningAccountName":"<Trusted Signing Account Name>",
   "CertificateProfileName":"<Certificate Profile Name>"
   }
   ```

1. Get the [root certificate](/powershell/module/az.codesigning/get-azcodesigningrootcert) that you want to add to the trust store:

   ```powershell
   Get-AzCodeSigningRootCert -AccountName TestAccount -ProfileName TestCertProfile -EndpointUrl https://xxx.codesigning.azure.net/ -Destination c:\temp\root.cer
   ```

   If you're using a *metadata.json* file, run this command instead:

   ```powershell
   Get-AzCodeSigningRootCert -MetadataFilePath C:\temp\metadata.json https://xxx.codesigning.azure.net/ -Destination c:\temp\root.cer 
   ```

1. To get the Extended Key Usage (EKU) to insert into your policy:

   ```powershell
   Get-AzCodeSigningCustomerEku -AccountName TestAccount -ProfileName TestCertProfile -EndpointUrl https://xxx.codesigning.azure.net/ 
   ```

   If you're using a *metadata.json* file, run this command instead:

   ```powershell
   Get-AzCodeSigningCustomerEku -MetadataFilePath C:\temp\metadata.json 
   ```

1. To sign your policy, run the `invoke` command:

   ```powershell
   Invoke-AzCodeSigningCIPolicySigning -accountName TestAccount -profileName TestCertProfile -endpointurl "https://xxx.codesigning.azure.net/" -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
   ```

   If you're using a *metadata.json* file, run this command instead:

   ```powershell
   Invoke-AzCodeSigningCIPolicySigning -MetadataFilePath C:\temp\metadata.json -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
   ```

## Create and deploy a CI policy

For steps to create and deploy your CI policy, see these articles:

- [Use signed policies to protect Windows Defender Application Control against tampering](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering)
- [Windows Defender Application Control design guide](/windows/security/application-security/application-control/windows-defender-application-control/design/wdac-design-guide)
