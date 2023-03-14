---
title: How to enable Authenticator Lite for Microsoft Outlook
description: Learn about how to you can set up Authenticator Lite for Microsoft Outlook to help users validate their identity

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/14/2023

ms.author: justinha
author: sabina-smith
ms.reviewer: sabina-smith
manager: amycolannino

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to understand how default protection can improve our security posture.
---
# How to enable Authenticator Lite for Microsoft Outlook

Authenticator Lite is another surface for Azure Active Directory (Azure AD) users to complete multifactor authentication by using push notifications or time-based one-time passcodes (TOTP) on their Android or iOS device. With Authenticator Lite, users can satisfy a multifactor authentication requirement from the convenience of a familiar app. Authenticator Lite is currently enabled in Microsoft Outlook. 

Users receive a notification in Outlook to approve or deny sign-in, or they can enter the TOTP of Authenticator in Outlook during sign-in. 

## Prerequisites

- Your organization needs to enable Microsoft Authenticator (second factor) push notifications for some users or groups by using the Authentication methods policy. You can edit the Authentication methods policy by using the Azure portal or Microsoft Graph API.
- If your organization is using the Active Directory Federation Services (AD FS) adapter or Network Policy Server (NPS) extensions, upgrade to the latest versions for a consistent experience.
- Users enabled for shared device mode on Outlook aren't eligible for Authenticator Lite.
- Users must run a minimum Outlook version.

  | Operating system | Outlook version |
  |:----------------:|:---------------:|
  |Android           | 4.2308.0        |
  |iOS               | 4.2309.0        |

## Enable Authenticator Lite

By default, Authenticator Lite is [Microsoft managed](concept-authentication-default-enablement.md#microsoft-managed-settings) and disabled during preview. After generally availability, the Microsoft managed state default value will change to enable Authenticator Lite. 

| Property | Type | Description |
|----------|------|-------------|
| excludeTarget | featureTarget | A single entity that is excluded from this feature. <br>You can only exclude one group from Authenticator Lite, which can be a dynamic or nested group.|
| includeTarget | featureTarget | A single entity that is included in this feature. <br>You can only include one group for Authenticator Lite, which can be a dynamic or nested group.|
| State | advancedConfigState | Possible values are:<br>**enabled** explicitly enables the feature for the selected group.<br>**disabled** explicitly disables the feature for the selected group.<br>**default** allows Azure AD to manage whether the feature is enabled or not for the selected group. |

Once you identify the single target group, use the following API endpoint to change the **CompanionAppsAllowedState** property under **featureSettings**. 

```http
https://graph.microsoft.com/beta/authenticationMethodsPolicy/authenticationMethodConfigurations/MicrosoftAuthenticator
```

In Graph Explorer, you need to consent to the **Policy.ReadWrite.AuthenticationMethod** permission.

### Request

```http
PATCH https://graph.microsoft.com/beta/policies/authenticationMethodsPolicy
Content-Type: application/json
 
{
    "CompanionAppAllowedState": {
        "state": "enabled",
        "excludeTargets": [
            {
                "id": "s4432809-3bql-5m2l-0p42-8rq4707rq36m",
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


## User Registration
If enabled for Authenticator Lite, users are prompted to register their account directly from Outlook. Authenticator Lite registration isn't available by using [MySignIns](https://aka.ms/mysignins). Users can also enable or disable Authenticator Lite from within Outlook. For more information on user experience, please visit the [Authenticator Lite support page](https://aka.ms/authappliteuserdocs). 

## Monitoring Authenticator Lite Usage
[Sign-in logs](/graph/api/signin-list) can show which app was used to complete user authentication. To view the latest sign-ins, use the following call on the beta API endpoint:

```http
GET auditLogs/signIns
```

If the sign-in was done by phone app notification, under **authenticationAppDeivceDetails** the **clientApp** field returns **microsoftAuthenticator** or **Outlook**.

If a user has registered Authenticator Lite, the user’s registered authentication methods include **Microsoft Authenticator (in Outlook)**. 

## Push Notifications in Authenticator Lite
Push Notifications sent by Authenticator Lite aren't configurable and don't depend on the Authenticator feature settings. The default setting for features included in the Authenticator Lite experience are listed in the following table. 

| Authenticator Feature    | Authenticator Lite Experience|
|:------------------------:|:----------------------------:|
| Number Matching          | Enabled                      |
| Location Context         | Disabled                     |
| Application Context      | Disabled                     |

## AD FS adapters and NPS extensions 

Authenticator Lite enforces number matching in every authentication. If your tenant is using an AD FS adapter or an NPS extension, your users may not be able to complete Authenticator Lite notifications. For more information about how number matching affects these scenarios, see [AD FS adapter](how-to-mfa-number-match.md#ad-fs-adapter) and [NPS extension](how-to-mfa-number-match.md#nps-extension).

To learn more about verification notifications, see [Microsoft Authenticator authentication method](concept-authentication-authenticator-app.md).

## FAQs 

### Does Authenticator Lite work as a broker app?
No, Authenticator Lite is only available for push notifications and TOTP. 

### Can Authenticator Lite be used for SSPR?
No, Authenticator Lite is only available for push notifications and TOTP. 

### Where can users register for Authenticator Lite?
Users can only register for Authenticator Lite from Outlook. Authenticator Lite registration can be managed from [aka.ms/mysignins](https://aka.ms/mysignins). 

### Can users register Microsoft Authenticator and Authenticator Lite?

Users that have Microsoft Authenticator on their device can't register Authenticator Lite. If a user has an Authenticator Lite registration and then later downloads Microsoft Authenticator, they can register both. If a user has two devices, they can register Authenticator Lite on one and Microsoft Authenticator on the other.

## Next steps

[Authentication methods in Azure Active Directory](concept-authentication-authenticator-app.md)
