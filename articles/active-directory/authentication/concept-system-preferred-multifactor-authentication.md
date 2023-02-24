---
title: System-preferred multifactor authentication (MFA) - Azure Active Directory
description: Learn how to use system-preferred multifactor authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 02/15/2023
ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: msft-poulomi
ms.collection: M365-identity-device-management


# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# System-preferred multifactor authentication  - Authentication methods policy

System-preferred multifactor authentication (MFA) prompts users to sign in by using the most secure method registered. Administrators can enable system-preferred MFA to improve sign-in security and discourage less secure sign-in methods like SMS.

For example, if a user has registered both SMS and Microsoft Authenticator push notifications as methods for MFA, system-preferred MFA prompts the user to sign in by using the more secure push notification method. The user can still choose to sign in by using another method, but they are first prompted to try the most secure method that's available to them. 

Authentication Policy Administrators can enable system-preferred MFA by using Microsoft Graph API. 

## How does system-preferred multifactor authentication work?

When a user signs in, Azure AD checks which authentication methods are available. The user is prompted to sign-in with the most secure method according to the following order. This method order is dynamic and updated based upon the current landscape of security threats and vulnerabilities, and as better authentication methods emerge.

1. Temporary Access Pass
1. Certificate-based authentication
1. FIDO2 security key
1. Microsoft Authenticator notification
1. Companion app notification
1. Microsoft Authenticator time-based one-time password (TOTP)
1. Companion app TOTP
1. Hardware token based TOTP
1. Software token based TOTP
1. SMS over mobile
1. OnewayVoiceMobileOTP
1. OnewayVoiceAlternateMobileOTP
1. OnewayVoiceOfficeOTP
1. TwowayVoiceMobile
1. TwowayVoiceAlternateMobile
1. TwowayVoiceOffice
1. TwowaySMSOverMobile


## Enable system-preferred MFA

By default, system-preferred MFA is Microsoft managed and set as disabled during preview. When system-preferred MFA becomes generally available, the Microsoft managed setting will change to be enabled. 

To enable system-preferred MFA, you'll need to choose a single target group for the schema configuration, as shown in the following example. Then use the API endpoint to enable **systemCredentialPreferences** and include or exclude groups:

```
https://graph.microsoft.com/beta/authenticationMethodsPolicy
```

>[!NOTE]
>In Graph Explorer, you'll need to consent to the **Policy.ReadWrite.AuthenticationMethod** permission. 

### Request

```http
PATCH https://graph.microsoft.com/beta/policies/authenticationMethodsPolicy
Content-Type: application/json

{
    "systemCredentialPreferences": {
        "state": "enabled",
        "excludeTargets": [
            {
                "id": "d1411007-6fcf-4b4c-8d70-1da1857ed33c",
                "targetType": "group"
            }
        ],
        "includeTargets": [
            {
                "id": "all_users",
                "targetType": "group"
            }
        ]
    }
}
```

### Response 


## Known issues

- FIDO2 security key isn't supported on iOS mobile devices. This issue might surface when system-preferred MFA is enabled. Until a fix is available, we recommend not using FIDO2 security keys on iOS devices. 

## Common questions

### How does system-preferred MFA affect AD FS or NPS extension?

System-preferred MFA has no affect on users who sign in by using Active Directory Federation Services (AD FS) or Network Policy Server (NPS) extension. Those users will not see any change to their sign-in experience.

## Next steps
