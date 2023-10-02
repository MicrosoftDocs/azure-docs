---
title: Windows smart card sign-in using Microsoft Entra certificate-based authentication
description: Learn how to enable Windows smart card sign-in using Microsoft Entra certificate-based authentication

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Windows smart card sign-in using Microsoft Entra certificate-based authentication

Microsoft Entra users can authenticate using X.509 certificates on their smart cards directly against Microsoft Entra ID at Windows sign-in. There's no special configuration needed on the Windows client to accept the smart card authentication. 
 
## User experience 

Follow these steps to set up Windows smart card sign-in:

1. Join the machine to either Microsoft Entra ID or a hybrid environment (hybrid join). 
1. Configure Microsoft Entra CBA in your tenant as described in [Configure Microsoft Entra CBA](how-to-certificate-based-authentication.md).
1. Make sure the user is either on managed authentication or using [Staged Rollout](../hybrid/connect/how-to-connect-staged-rollout.md). 
1. Present the physical or virtual smart card to the test machine.
1. Select the smart card icon, enter the PIN, and authenticate the user.  

   :::image type="content" border="false" source="./media/concept-certificate-based-authentication/smartcard.png" alt-text="Screenshot of smart card sign-in.":::

Users will get a primary refresh token (PRT) from Microsoft Entra ID after the successful sign-in. Depending on the CBA configuration, the PRT will contain the multifactor claim. 

<a name='expected-behavior-of-windows-sending-user-upn-to-azure-ad-cba'></a>

## Expected behavior of Windows sending user UPN to Microsoft Entra CBA

|Sign-in | Microsoft Entra join | Hybrid join |
|--------|---------------|----------------------|
|First sign-in | Pull from certificate | AD UPN or x509Hint |
|Subsequent sign-in | Pull from certificate | Cached Microsoft Entra UPN |

<a name='windows-rules-for-sending-upn-for-azure-ad-joined-devices'></a>

### Windows rules for sending UPN for Microsoft Entra joined devices

Windows will first use a principal name and if not present then RFC822Name from the SubjectAlternativeName (SAN) of the certificate being used to sign into Windows. If neither are present, the user must additionally supply a User Name Hint. For more information, see [User Name Hint](/windows/security/identity-protection/smart-cards/smart-card-group-policy-and-registry-settings#allow-user-name-hint)

<a name='windows-rules-for-sending-upn-for-hybrid-azure-ad-joined-devices'></a>

### Windows rules for sending UPN for Microsoft Entra hybrid joined devices

Hybrid Join sign-in must first successfully sign-in against the Active Directory(AD) domain. The users AD UPN is sent to Microsoft Entra ID. In most cases, the Active Directory UPN value is the same as the Microsoft Entra UPN value and is synchronized with Microsoft Entra Connect. 

Some customers may maintain different and sometimes may have non-routable UPN values in Active Directory (such as user@woodgrove.local) In these cases the value sent by Windows may not match the users Microsoft Entra UPN. To support these scenarios where Microsoft Entra ID can't match the value sent by Windows, a subsequent lookup is performed for a user with a matching value in their **onPremisesUserPrincipalName** attribute. If the sign-in is successful, Windows will cache the users Microsoft Entra UPN and is sent in subsequent sign-ins.

>[!NOTE]
>In all cases, a user supplied username login hint (X509UserNameHint) will be sent if provided. For more information, see [User Name Hint](/windows/security/identity-protection/smart-cards/smart-card-group-policy-and-registry-settings#allow-user-name-hint)

>[!IMPORTANT]
> If a user supplies a username login hint (X509UserNameHint), the value provided **MUST** be in UPN Format.

For more information about the Windows flow, see [Certificate Requirements and Enumeration (Windows)](/windows/security/identity-protection/smart-cards/smart-card-certificate-requirements-and-enumeration).

## Supported Windows platforms

The Windows smart card sign-in works with the latest preview build of Windows 11. The functionality is also available for these earlier Windows versions after you apply one of the following updates [KB5017383](https://support.microsoft.com/topic/september-20-2022-kb5017383-os-build-22000-1042-preview-62753265-68e9-45d2-adcb-f996bf3ad393):

- [Windows 11 - kb5017383](https://support.microsoft.com/topic/september-20-2022-kb5017383-os-build-22000-1042-preview-62753265-68e9-45d2-adcb-f996bf3ad393)
- [Windows 10 - kb5017379](https://support.microsoft.com/topic/20-september-2022-kb5017379-os-build-17763-3469-preview-50a9b9e2-745d-49df-aaae-19190e10d307)
- [Windows Server 20H2- kb5017380](https://support.microsoft.com/topic/20-september-2022-kb5017380-os-builds-19042-2075-19043-2075-og-19044-2075-preview-59ab550c-105e-4481-b440-c37f07bf7897)
- [Windows Server 2022 - kb5017381](https://support.microsoft.com/topic/20-september-2022-kb5017381-os-build-20348-1070-preview-dc843fea-bccd-4550-9891-a021ae5088f0)
- [Windows Server 2019 - kb5017379](https://support.microsoft.com/topic/20-september-2022-kb5017379-os-build-17763-3469-preview-50a9b9e2-745d-49df-aaae-19190e10d307)

## Supported browsers

|Edge | Chrome | Safari | Firefox |
|--------|---------|------|-------|
|&#x2705; | &#x2705; | &#x2705; |&#x2705; |

>[!NOTE] 
>Microsoft Entra CBA supports both certificates on-device as well as external storage like security keys on Windows. 

## Windows Out of the box experience (OOBE)

Windows OOBE should allow the user to login using an external smart card reader and authenticate against Microsoft Entra CBA. Windows OOBE by default should have the necessary smart card drivers or the smart card drivers previously added to the Windows image before OOBE setup.

## Restrictions and caveats  

- Microsoft Entra CBA is supported on Windows devices that are hybrid or Microsoft Entra joined.  
- Users must be in a managed domain or using Staged Rollout and can't use a federated authentication model.

## Next steps

- [Overview of Microsoft Entra CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Microsoft Entra CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Microsoft Entra CBA](how-to-certificate-based-authentication.md)
- [Microsoft Entra CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Microsoft Entra CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
