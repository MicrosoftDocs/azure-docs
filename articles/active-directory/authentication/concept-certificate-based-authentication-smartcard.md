---
title: Windows smart card logon using Azure Active Directory certificate-based authentication - Azure Active Directory
description: Learn how to enable Windows smart card logon using Azure Active Directory certificate-based authentication

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/30/2022

ms.author: justinha
author: vimrang
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Windows smart card sign-in using Azure Active Directory certificate-based authentication

Azure Active Directory (Azure AD) users can authenticate using X.509 certificates on their smart cards directly against Azure AD at Windows logon. There's no special configuration needed on the Windows client to accept the smart card authentication. 
 
## User experience 

Follow these steps to set up Windows smart card sign-in:

1. Join the machine to either Azure AD or a hybrid environment (hybrid join). 
1. Configure Azure AD CBA in your tenant as described in [Configure Azure AD CBA](how-to-certificate-based-authentication.md).
1. Make sure the user is either on managed authentication or using [Staged Rollout](../hybrid/how-to-connect-staged-rollout.md). 
1. Present the physical or virtual smart card to the test machine.
1. Select the smart card icon, enter the PIN, and authenticate the user.  

   :::image type="content" border="false" source="./media/concept-certificate-based-authentication/smartcard.png" alt-text="Screenshot of smart card sign in.":::

Users will get a primary refresh token (PRT) from Azure AD after the successful sign-in, and depending on the certificate-based authentication configuration, the PRT will contain the multifactor claim. 

## Expected behavior of Windows sending user UPN to Azure AD CBA

| | Azure AD Join | Hybrid Azure AD join |
|-|---------------|----------------------|
|First sign-in | Pull from certificate | Pull from certificate |
|Subsequent sign-in | Pull from certificate | Cached Azure AD UPN |

More information of "Pull from certificate" logic is explained at [Certificate Requirements and Enumeration (Windows)](https://learn.microsoft.com/en-us/windows/security/identity-protection/smart-cards/smart-card-certificate-requirements-and-enumeration)

> [!NOTE]
> In all cases, a user supplied User Name Hint (x509Hint) will be sent if provided. For a cloud-only user on a device joined to Azure AD with a certificate that contain a non-routable value, the user must pass the User Name Hint (x509Hint).

## Supported platforms

The Windows smart card sign-in works with the latest preview build of Windows 11 and the functionality is available for these earlier Windows versions after you apply update [KB5017383](https://support.microsoft.com/topic/september-20-2022-kb5017383-os-build-22000-1042-preview-62753265-68e9-45d2-adcb-f996bf3ad393):

- Windows 11 22H2 (preview)
- Windows 11 21H2 and later
- Windows 10 20H1 and later
- Windows Server 2019 and later

## Restrictions and caveats  

- Only Windows machines that are joined to either Azure AD or a hybrid environment can test smart card logon.  
- As in the other Azure AD CBA scenarios, the user must be in a managed domain or using Staged Rollout and can't use a federated authentication model.

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [Limitations with Azure AD CBA](concept-certificate-based-authentication-limitations.md)
- [Azure AD CBA on mobile devices (Android and iOS)](concept-certificate-based-authentication-mobile.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
