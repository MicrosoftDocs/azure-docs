---
title: System-preferred multifactor authentication (MFA) - Azure Active Directory
description: Learn how to use system-preferred multifactor authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/02/2023
ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: msft-poulomi
ms.collection: M365-identity-device-management


# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# System-preferred multifactor authentication  - Authentication methods policy

System-preferred multifactor authentication (MFA) prompts users to sign in by using the most secure method they registered. Administrators can enable system-preferred MFA to improve sign-in security and discourage less secure sign-in methods like SMS.

For example, if a user registered both SMS and Microsoft Authenticator push notifications as methods for MFA, system-preferred MFA prompts the user to sign in by using the more secure push notification method. The user can still choose to sign in by using another method, but they're first prompted to try the most secure method they registered. 

System-preferred MFA is a Microsoft managed setting, which is a [tristate policy](#authentication-method-feature-configuration-properties). For preview, the **default** state is disabled. If you want to turn it on for all users or a group of users during preview, you need to explicitly change the Microsoft managed state to **enabled** by using Microsoft Graph API. Sometime after general availability, the Microsoft managed state for system-preferred MFA will change to **enabled**. 

After system-preferred MFA is enabled, the authentication system does all the work. Users don't need to set any authentication method as their default because the system always determines and presents the most secure method they registered. 

## Enable system-preferred MFA

To enable system-preferred MFA in advance, you need to choose a single target group for the schema configuration, as shown in the [Request](#request) example. 

### Authentication method feature configuration properties

By default, system-preferred MFA is [Microsoft managed](concept-authentication-default-enablement.md#microsoft-managed-settings) and disabled during preview. After generally availability, the Microsoft managed state default value will change to enable system-preferred MFA. 

| Property | Type | Description |
|----------|------|-------------|
| excludeTarget | featureTarget | A single entity that is excluded from this feature. <br>You can only exclude one group from system-preferred MFA, which can be a dynamic or nested group.|
| includeTarget | featureTarget | A single entity that is included in this feature. <br>You can only include one group for system-preferred MFA, which can be a dynamic or nested group.|
| State | advancedConfigState | Possible values are:<br>**enabled** explicitly enables the feature for the selected group.<br>**disabled** explicitly disables the feature for the selected group.<br>**default** allows Azure AD to manage whether the feature is enabled or not for the selected group. |

### Feature target properties

System-preferred MFA can be enabled only for a single group, which can be a dynamic or nested group. 

| Property | Type | Description |
|----------|------|-------------|
| id | String | ID of the entity targeted. |
| targetType | featureTargetType | The kind of entity targeted, such as group, role, or administrative unit. The possible values are: 'group', 'administrativeUnit', 'role', 'unknownFutureValue'. |

Use the following API endpoint to enable **systemCredentialPreferences** and include or exclude groups:

```
https://graph.microsoft.com/beta/policies/authenticationMethodsPolicy
```

>[!NOTE]
>In Graph Explorer, you need to consent to the **Policy.ReadWrite.AuthenticationMethod** permission. 

### Request

The following example excludes a sample target group and includes all users. For more information, see [Update authenticationMethodsPolicy](/graph/api/authenticationmethodspolicy-update?view=graph-rest-beta).

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

## Known issues

- [FIDO2 security key isn't supported on mobile devices](../develop/support-fido2-authentication.md#mobile). This issue might surface when system-preferred MFA is enabled. Until a fix is available, we recommend not using FIDO2 security keys on mobile devices. 

## Common questions

### How does system-preferred MFA determine the most secure method?

When a user signs in, the authentication process checks which authentication methods are registered for the user. The user is prompted to sign-in with the most secure method according to the following order. The order of authentication methods is dynamic. It's updated as the security landscape changes, and as better authentication methods emerge.

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

### How does system-preferred MFA affect AD FS or NPS extension?

System-preferred MFA doesn't affect users who sign in by using Active Directory Federation Services (AD FS) or Network Policy Server (NPS) extension. Those users don't see any change to their sign-in experience.

### What happens for users who aren't specified in the Authentication methods policy but enabled in the legacy MFA tenant-wide policy?

The system-preferred MFA also applies for users who are enabled for MFA in the legacy MFA policy.
:::image type="content" border="true" source="./media/how-to-mfa-number-match/legacy-settings.png" alt-text="Screenshot of legacy MFA settings.":::

## Next steps

* [Authentication methods in Azure Active Directory](concept-authentication-authenticator-app.md)
* [How to run a registration campaign to set up Microsoft Authenticator](how-to-mfa-registration-campaign.md)
