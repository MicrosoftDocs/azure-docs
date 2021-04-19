---
title: OATH tokens authentication method - Azure Active Directory
description: Learn about using OATH tokens in Azure Active Directory to help improve and secure sign-in events

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/31/2021

ms.author: justinha
author: justinha
manager: daveba

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to understand how to use OATH tokens in Azure AD to improve and secure user sign-in events.
---
# Authentication methods in Azure Active Directory - OATH tokens 

OATH TOTP (Time-based One Time Password) is an open standard that specifies how one-time password (OTP) codes are generated. OATH TOTP can be implemented using either software or hardware to generate the codes. Azure AD doesn't support OATH HOTP, a different code generation standard.

## OATH software tokens

Software OATH tokens are typically applications such as the Microsoft Authenticator app and other authenticator apps. Azure AD generates the secret key, or seed, that's input into the app and used to generate each OTP.

The Authenticator app automatically generates codes when set up to do push notifications so a user has a backup even if their device doesn't have connectivity. Third-party applications that use OATH TOTP to generate codes can also be used.

Some OATH TOTP hardware tokens are programmable, meaning they don't come with a secret key or seed pre-programmed. These programmable hardware tokens can be set up using the secret key or seed obtained from the software token setup flow. Customers can purchase these tokens from the vendor of their choice and use the secret key or seed in their vendor's setup process.

## OATH hardware tokens (Preview)

Azure AD supports the use of OATH-TOTP SHA-1 tokens that refresh codes every 30 or 60 seconds. Customers can purchase these tokens from the vendor of their choice.

OATH TOTP hardware tokens typically come with a secret key, or seed, pre-programmed in the token. These keys must be input into Azure AD as described in the following steps. Secret keys are limited to 128 characters, which may not be compatible with all tokens. The secret key can only contain the characters *a-z* or *A-Z* and digits *2-7*, and must be encoded in *Base32*.

Programmable OATH TOTP hardware tokens that can be reseeded can also be set up with Azure AD in the software token setup flow.

OATH hardware tokens are supported as part of a public preview. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

![Uploading OATH tokens to the MFA OATH tokens blade](media/concept-authentication-methods/mfa-server-oath-tokens-azure-ad.png)

Once tokens are acquired they must be uploaded in a comma-separated values (CSV) file format including the UPN, serial number, secret key, time interval, manufacturer, and model, as shown in the following example:

```csv
upn,serial number,secret key,time interval,manufacturer,model
Helga@contoso.com,1234567,2234567abcdef2234567abcdef,60,Contoso,HardwareKey
```  

> [!NOTE]
> Make sure you include the header row in your CSV file. If a UPN has a single quote, escape it with another single quote. For example, if the UPN is my’user@domain.com, change it to my’’user@domain.com when uploading the file.

Once properly formatted as a CSV file, a Global Administrator can then sign in to the Azure portal, navigate to **Azure Active Directory > Security > MFA > OATH tokens**, and upload the resulting CSV file.

Depending on the size of the CSV file, it may take a few minutes to process. Select the **Refresh** button to get the current status. If there are any errors in the file, you can download a CSV file that lists any errors for you to resolve. The field names in the downloaded CSV file are different than the uploaded version.  

Once any errors have been addressed, the administrator then can activate each key by selecting **Activate** for the token and entering the OTP displayed on the token. You can activate a maximum of 200 OATH tokens every 5 minutes. 

Users may have a combination of up to five OATH hardware tokens or authenticator applications, such as the Microsoft Authenticator app, configured for use at any time. Hardware OATH tokens cannot be assigned to guest users in the resource tenant.

## Next steps

Learn more about configuring authentication methods using the [Microsoft Graph REST API](/graph/api/resources/authenticationmethods-overview).
