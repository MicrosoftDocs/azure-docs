---
title: Sign a CI policy 
description: Learn how to sign new CI policies by using Trusted Signing.  
author: microsoftshawarma 
ms.author: rakiasegev 
ms.service: trusted-signing
ms.topic: how-to 
ms.date: 06/03/2024 
ms.custom: template-how-to-pattern, devx-track-azurepowershell
---

# Sign a CI policy by using Trusted Signing

This article shows you how to sign new code integrity (CI) policies by using the Trusted Signing service.

## Prerequisites

To complete the steps in this article, you need:

- A Trusted Signing account, identity validation, and certificate profile.
- Individual or group assignment of the Trusted Signing Certificate Profile Signer role.
- [Azure PowerShell in Windows](/powershell/azure/install-azps-windows) installed.
- [Az.TrustedSigning](/powershell/module/az.trustedsigning/) module downloaded.

## Sign a CI policy

1. ⁠Open [PowerShell 7](https://github.com/PowerShell/PowerShell/releases/latest).

1. Optionally, you can create a *metadata.json* file that looks like this example:(`"Endpoint"` URI value must be a URI that aligns with the region where you created your Trusted Signing account and certificate profile when you set up these resources.)

   ```json
   {
   "Endpoint":"https://xxx.codesigning.azure.net/",
   "CodeSigningAccountName":"<Trusted Signing Account Name>",
   "CertificateProfileName":"<Certificate Profile Name>"
   }
   ```

1. Get the [root certificate](/powershell/module/az.trustedsigning/get-aztrustedsigningcertificateroot) that you want to add to the trust store:

   ```powershell
   Get-AzTrustedSigningCertificateRoot -AccountName TestAccount -ProfileName TestCertProfile -EndpointUrl https://xxx.codesigning.azure.net/ -Destination c:\temp\root.cer
   ```

   If you're using a *metadata.json* file, run this command instead:

   ```powershell
   Get-AzTrustedSigningCertificateRoot -MetadataFilePath C:\temp\metadata.json -Destination c:\temp\root.cer 
   ```

1. To get the [Extended Key Usage (EKU)](/powershell/module/az.trustedsigning/get-aztrustedsigningcustomereku) to insert into your policy:

   ```powershell
   Get-AzTrustedSigningCustomerEku -AccountName TestAccount -ProfileName TestCertProfile -EndpointUrl https://xxx.codesigning.azure.net/ 
   ```

   If you're using a *metadata.json* file, run this command instead:

   ```powershell
   Get-AzTrustedSigningCustomerEku -MetadataFilePath C:\temp\metadata.json 
   ```

1. To [sign your policy](/powershell/module/az.trustedsigning/invoke-aztrustedsigningcipolicysigning), run the `invoke` command:

   ```powershell
   Invoke-AzTrustedSigningCIPolicySigning -accountName TestAccount -profileName TestCertProfile -endpointurl "https://xxx.codesigning.azure.net/" -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
   ```

   If you're using a *metadata.json* file, run this command instead:

   ```powershell
   Invoke-AzTrustedSigningCIPolicySigning -MetadataFilePath C:\temp\metadata.json -Path C:\Temp\defaultpolicy.bin -Destination C:\Temp\defaultpolicy_signed.bin -TimeStamperUrl: http://timestamp.acs.microsoft.com 
   ```

## Create and deploy a CI policy

For steps to create and deploy your CI policy, see these articles:

- [Use signed policies to protect Windows Defender Application Control against tampering](/windows/security/application-security/application-control/windows-defender-application-control/deployment/use-signed-policies-to-protect-wdac-against-tampering)
- [Windows Defender Application Control design guide](/windows/security/application-security/application-control/windows-defender-application-control/design/wdac-design-guide)
