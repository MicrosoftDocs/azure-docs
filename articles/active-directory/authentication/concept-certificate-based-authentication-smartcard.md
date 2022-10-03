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

Users will get a primary refresh token (PRT) from Azure AD after the successful sign-in. Depending on the CBA configuration, the PRT will contain the multifactor claim. 

## Expected behavior of Windows sending user UPN to Azure AD CBA

|Sign-in | Azure AD Join | Hybrid Azure AD join |
|--------|---------------|----------------------|
|First sign-in | Pull from certificate | AD UPN or x509Hint |
|Subsequent sign-in | Pull from certificate | Cached Azure AD UPN |

### Windows rules for sending UPN for Azure AD join machines

Windows will follow this order to find the UPN value from the certificate:
1. SAN Principal Name 
1. SAN RFC822 Name 
1. User must enter the username login hint

If no UPN is in the certificate, or if the subject has E=xx or CN=xx, the entire value is sent, which will not work. The user must enter the username login hint (X509UserNameHint).

### Windows rules for sending UPN for Hybrid Azure AD join machines

Once AD login is successful, the AD UPN will be sent to Azure AD. 
If the mapping uses a non-routable UPN such as user@woodgrove.local, then Azure AD can locate the user's tenant by using the domain hint supplied, and the user in the tenant is found by matching against the user's **onPremisesUserPrincipalName** attribute.
The user's Azure AD UPN is cached and sent in subsequent sign-ins.

>[!NOTE]
>In all cases, a user supplied User Name Hint (x509Hint) will be sent if provided. For a cloud-only user on a device joined to Azure AD with a certificate that contains a non-routable value, the user must pass the User Name Hint (x509Hint).

For more information about the flow, see [Certificate Requirements and Enumeration (Windows)](/windows/security/identity-protection/smart-cards/smart-card-certificate-requirements-and-enumeration).

## Supported Windows platforms

The Windows smart card sign-in works with the latest preview build of Windows 11. The functionality is also available for these earlier Windows versions after you apply update [KB5017383](https://support.microsoft.com/topic/september-20-2022-kb5017383-os-build-22000-1042-preview-62753265-68e9-45d2-adcb-f996bf3ad393):

- Windows 11 22H2 (preview)
- Windows 11 21H2 and later
- Windows 10 20H1 and later
- Windows Server 2019 and later

[Windows 11 - kb5017383](https://support.microsoft.com/en-us/topic/september-20-2022-kb5017383-os-build-22000-1042-preview-62753265-68e9-45d2-adcb-f996bf3ad393)
[Windows 10 - kb5017379](https://support.microsoft.com/da-dk/topic/20-september-2022-kb5017379-os-build-17763-3469-preview-50a9b9e2-745d-49df-aaae-19190e10d307)
[Windows Server 20H2- kb5017380](https://support.microsoft.com/da-dk/topic/20-september-2022-kb5017380-os-builds-19042-2075-19043-2075-og-19044-2075-preview-59ab550c-105e-4481-b440-c37f07bf7897)
[Windows Server 2022 - kb5017381](https://support.microsoft.com/da-dk/topic/20-september-2022-kb5017381-os-build-20348-1070-preview-dc843fea-bccd-4550-9891-a021ae5088f0)
[Windows Server 2019 - kb5017379](https://support.microsoft.com/da-dk/topic/20-september-2022-kb5017379-os-build-17763-3469-preview-50a9b9e2-745d-49df-aaae-19190e10d307)

## Supported browsers

|Edge | chrome | safari | firefox |
|--------|---------|------|-------|
|&#x2705; | &#x2705; | &#x2705; |&#x2705; |

>[!NOTE] 
>Azure AD CBA supports both certificates on-device as well as external storage like security keys on Windows.

## Restrictions and caveats  

- Azure AD CBA is supported on Windows Hybrid or Azure AD Joined.  
- Users must be in a managed domain or using Staged Rollout and can't use a federated authentication model.

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Azure AD CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Azure AD CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [Advanced features](concept-certificate-based-authentication-advanced-features.md)
- [FAQ](certificate-based-authentication-faq.yml)
