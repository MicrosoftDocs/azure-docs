---
title: System-preferred multifactor authentication (MFA)
description: Learn how to use system-preferred multifactor authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 04/30/2023
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

System-preferred MFA is a Microsoft managed setting, which is a [tristate policy](#authentication-method-feature-configuration-properties). For preview, the **default** state is disabled. If you want to turn it on for all users or a group of users during preview, you need to explicitly change the Microsoft managed state to **Enabled**. Sometime after general availability, the Microsoft managed state for system-preferred MFA will change to **Enabled**. 

After system-preferred MFA is enabled, the authentication system does all the work. Users don't need to set any authentication method as their default because the system always determines and presents the most secure method they registered. 

>[!NOTE]
>System-preferred MFA is a key security upgrade to traditional second factor notifications. We highly recommend enabling system-preferred MFA in the near term for improved sign-in security. 

## Enable system-preferred MFA in the Azure portal

By default, system-preferred MFA is Microsoft managed and disabled for all users. 

1. In the Azure portal, click **Security** > **Authentication methods** > **Settings**.
1. For **System-preferred multifactor authentication**, choose whether to explicitly enable or disable the feature, and include or exclude any users. Excluded groups take precedence over include groups. 

   For example, the following screenshot shows how to make system-preferred MFA explicitly enabled for only the Engineering group. 

   :::image type="content" border="true" source="./media/concept-system-preferred-multifactor-authentication/enable.png" alt-text="Screenshot of how to enable Microsoft Authenticator settings for Push authentication mode.":::

1. After you finish making any changes, click **Save**. 

## Enable system-preferred MFA using Graph APIs

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
| ID | String | ID of the entity targeted. |
| targetType | featureTargetType | The kind of entity targeted, such as group, role, or administrative unit. The possible values are: 'group', 'administrativeUnit', 'role', 'unknownFutureValue'. |

Use the following API endpoint to enable **systemCredentialPreferences** and include or exclude groups:

```
https://graph.microsoft.com/beta/policies/authenticationMethodsPolicy
```

>[!NOTE]
>In Graph Explorer, you need to consent to the **Policy.ReadWrite.AuthenticationMethod** permission. 

### Request

The following example excludes a sample target group and includes all users. For more information, see [Update authenticationMethodsPolicy](/graph/api/authenticationmethodspolicy-update).

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

## Known issue

[FIDO2 security keys](../develop/support-fido2-authentication.md#mobile) on mobile devices and [registration for certificate-based authentication (CBA)](concept-certificate-based-authentication.md) aren't supported due to an issue that might surface when system-preferred MFA is enabled. Until a fix is available, we recommend not using FIDO2 security keys on mobile devices or registering for CBA. To disable system-preferred MFA for these users, you can either add them to an excluded group or remove them from an included group.

## Common questions

### How does system-preferred MFA determine the most secure method?

When a user signs in, the authentication process checks which authentication methods are registered for the user. The user is prompted to sign-in with the most secure method according to the following order. The order of authentication methods is dynamic. It's updated as the security landscape changes, and as better authentication methods emerge. Click the link for information about each method.

1. [Temporary Access Pass](howto-authentication-temporary-access-pass.md)
1. [Certificate-based authentication](concept-certificate-based-authentication.md)
1. [FIDO2 security key](concept-authentication-passwordless.md#fido2-security-keys)
1. [Microsoft Authenticator push notifications](concept-authentication-authenticator-app.md)
1. [Time-based one-time password (TOTP)](concept-authentication-oath-tokens.md)<sup>1</sup>
1. [Telephony](concept-authentication-phone-options.md)<sup>2</sup>

<sup>1</sup> Includes hardware or software TOTP from Microsoft Authenticator, Authenticator Lite, or third-party applications.

<sup>2</sup> Includes SMS and voice calls.

### How does system-preferred MFA affect AD FS or NPS extension?

System-preferred MFA doesn't affect users who sign in by using Active Directory Federation Services (AD FS) or Network Policy Server (NPS) extension. Those users don't see any change to their sign-in experience.

### What happens for users who aren't specified in the Authentication methods policy but enabled in the legacy MFA tenant-wide policy?

The system-preferred MFA also applies for users who are enabled for MFA in the legacy MFA policy.

:::image type="content" border="true" source="./media/how-to-mfa-number-match/legacy-settings.png" alt-text="Screenshot of legacy MFA settings.":::

## Next steps

* [Authentication methods in Azure Active Directory](concept-authentication-authenticator-app.md)
* [How to run a registration campaign to set up Microsoft Authenticator](how-to-mfa-registration-campaign.md)
