---
title: Revoke a certificate profile in Trusted Signing #Required; page title displayed in search results. Include the word "quickstart". Include the brand.
description: How-To revoke a Trusted Signing certificate from Azure portal #Required; article description that is displayed in search results. Include the word "quickstart".
author: mehasharma #Required; your GitHub user alias, with correct capitalization.
ms.author: mesharm #Required; microsoft alias of author; optional team alias.
ms.service: azure-code-signing #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/31/2024 #Required; mm/dd/yyyy format.
---



# Revoke a certificate profile in Trusted Signing

Certificate revocation is an act of invalidating a certificate. Once a certificate has been successfully revoked, all the files signed with a revoked certificate will become invalid from the selected revocation date and time. 

If the certificate issued to you doesn’t match your intended values or if you suspect any compromise of your account, consider the following steps:

1. **Revoke the Existing Certificate**:
Revoking the certificate ensures that any compromised or incorrect certificates become invalid.
Make sure to promptly revoke any certificates that no longer meet your requirements.

2. **Contact Microsoft for Certificate Revocation Requests**:
- If you encounter any issues revoking a certificate through the Azure portal (especially for non-misuse or non-abuse scenarios), reach out to Microsoft.
- For any misuse or abuse of certificates issued to you by Trusted Signing, contact Microsoft immediately at acsrevokeadmins@microsoft.com.

3. **To continue signing with Trusted Signing**:
- Initiate a new Identity Validation request.
    - Verify that the information in certificate subject preview accurately reflects your intended values. 
- Create a new certificate profile with newly Completed Identity Validation.


Before initiating a certificate revocation, it’s crucial to verify that all the details are accurate and as intended. Once a certificate is revoked, reversing the process is not possible. Therefore, exercise caution and double-check the information before proceeding with the revocation process. 

Revocation can only be completed in the Azure portal – it can't be completed with Azure CLI.

In this tutorial, you’ll learn how to revoke a certificate profile from a Trusted Signing account. 

## Prerequisites
- Ensure you have “Owner” role for the Subscription. For RBAC access management, see <link to role assignment>. 

## Revoke a certificate

Complete these steps to revoke a certificate profile from Trusted Signing:

1.	Sign in to the [Azure portal](https://portal.azure.com/).
2.	Navigate to your **Trusted Signing account** resource page in the Azure portal.
3.	Select **certificate profile** from either the Account Overview page or Objects page. 
4.	Select the relevant certificate profile.
5.	In the Search box, enter the thumbprint of the certificate to be revoked.  
•	For example for .cer file, thumbprint can be found on the Details tab. 
6.	Select the thumbprint, then select **Revoke**. 
7.	In the **Revocation reason** pull-down menu, select a reason.
8.	Enter **Revocation date time** (must be within the certification created and expiry date).
•	 The Revocation date time is converted to your local time zone.
9.	Enter **Remarks**.
10.	Select **Revoke**.
11.	Once the certificate is successfully revoked:
    - The status will be updated for the thumbprint that was revoked.
    - An email will be sent to the email addresses provided during Identity Validation. 
    