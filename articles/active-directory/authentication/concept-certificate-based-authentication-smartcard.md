---
title: Windows SmartCard logon using Azure Active Directory certificate-based authentication - Azure Active Directory
description: Learn how to enable Windows SmartCard logon using Azure Active Directory certificate-based authentication

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/15/2022

ms.author: justinha
author: vimrang
manager: daveba
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---
# Windows SmartCard logon using Azure Active Directory certificate-based authentication (Preview)

Azure AD users can authenticate using X.509 certificates on their SmartCards directly against Azure AD at Windows logon. There is no special configuration needed on the Windows client to accept the SmartCard authentication. 
 
## User experience 

Follow these steps to set up Windows SmartCard logon:

1. Join the machine to either Azure AD or a hybrid environment (hybrid join). 
1. Configure Azure AD CBA in your tenant as described in [Configure Azure AD CBA](how-to-certificate-based-authentication.md).
1. Make sure the user is either on managed authentication or using staged rollout. 
1. Present the physical or virtual SmartCard to the test machine.
1. Select SmartCard icon, enter the PIN and authenticate the user.  

   :::image type="content" border="false" source="./media/concept-certificate-based-authentication/smartcard.png" alt-text="Screenshot of SmartCard sign in.":::

Users will get a primary refresh token (PRT) from Azure Active Directory after the successful login and depending on the Certificate-based authentication configuration, the PRT will contain the multifactor claim. 

## Restrictions and caveats  

- The Windows login only works with the latest preview build of Windows 11. We are working to backport the functionality to Windows 10 and Windows Server.
- Only Windows machines that are joined to either Azure AD or a hybrid environment can test SmartCard logon.  
- Like in the other Azure AD CBA scenarios, the user must be on a managed domain or using staged rollout and cannot use a federated authentication model.

## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)   
- [Limitations with Azure AD CBA](concept-certificate-based-authentication-limitations.md)
- [Azure AD CBA on mobile devices (Android and iOS)](concept-certificate-based-authentication-mobile.md)
- [FAQ](certificate-based-authentication-faq.yml)
- [Troubleshoot Azure AD CBA](troubleshoot-certificate-based-authentication.md)
