---
title: Use number matching in multifactor authentication (MFA) notifications (Preview) - Azure Active Directory
description: Learn how to use number matching in MFA notifications
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/07/2022
ms.author: justinha
author: mjsantani
ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# How to use number matching in multifactor authentication (MFA) notifications (Preview) - Authentication methods policy

This topic covers how to enable number matching in Microsoft Authenticator push notifications to improve user sign-in security.  

>[!NOTE]
>Number matching is a key security upgrade to traditional second factor notifications in the Authenticator app that will be enabled by default for all tenants a few months after general availability (GA).<br> 
>We highly recommend enabling number matching in the near-term for improved sign-in security.

## Prerequisites

- Your organization needs to enable Microsoft Authenticator (traditional second factor) push notifications for some users or groups by using the new Authentication methods policy. You can edit the Authentication methods policy by using the Azure portal or Microsoft Graph API. 

  >[!NOTE]
  >The policy schema for Microsoft Graph APIs has been improved. The older policy schema is now deprecated. Make sure you use the new schema to help prevent errors.

- If your organization is using ADFS adapter or NPS extensions, upgrade to the latest versions for a consistent experience. 

## Number matching

Number matching can be targeted to only a single group, which can be dynamic or nested. On-premises synchronized security groups and cloud-only security groups are supported for the Authentication methods policy. 

Number matching is available for the following scenarios. When enabled, all scenarios support number matching.

- [Multifactor authentication](tutorial-enable-azure-mfa.md)
- [Self-service password reset](howto-sspr-deployment.md)
- [Combined SSPR and MFA registration during Authenticator app set up](howto-registration-mfa-sspr-combined.md)
- [AD FS adapter](howto-mfaserver-adfs-windows-server.md)
- [NPS extension](howto-mfa-nps-extension.md)

>[!NOTE]
>For passwordless users, enabling or disabling number matching has no impact because it's already part of the passwordless experience. 

Number matching will be available in Azure Government two weeks after General Availability. Number matching isn't supported for Apple Watch notifications. Apple Watch users need to use their phone to approve notifications when number matching is enabled.

### Multifactor authentication

When a user responds to an MFA push notification using the Authenticator app, they'll be presented with a number. They need to type that number into the app to complete the approval. 

![Screenshot of user entering a number match.](media/howto-authentication-passwordless-phone/phone-sign-in-microsoft-authenticator-app.png)

### SSPR

During self-service password reset, the Authenticator app notification will show a number that the user will need to type in their Authenticator app notification. This number will only be seen to users who have been enabled for number matching.

### Combined registration

When a user goes through combined registration to set up the Authenticator app, the user is asked to approve a notification as part of adding the account. For users who are enabled for number matching, this notification will show a number that they need to type in their Authenticator app notification. 

### AD FS adapter

The AD FS adapter supports number matching after installing an update. Earlier versions of Windows Server don't support number matching. On earlier versions, users will continue to see the **Approve**/**Deny** experience and won't see number matching until you upgrade.

| Version | Update |
|---------|--------|
| Windows Server 2022 | [October 26, 2021—KB5006745 (OS Build 20348.320) Preview](https://support.microsoft.com/topic/october-26-2021-kb5006745-os-build-20348-320-preview-8ff9319a-19e7-40c7-bbd1-cd70fcca066c) |
| Windows Server 2019 | [October 19, 2021—KB5006744 (OS Build 17763.2268) Preview](https://support.microsoft.com/topic/october-19-2021-kb5006744-os-build-17763-2268-preview-e043a8a3-901b-4190-bb6b-f5a4137411c0) |
| Windows Server 2016 | [October 12, 2021—KB5006669 (OS Build 14393.4704)](https://support.microsoft.com/topic/october-12-2021-kb5006669-os-build-14393-4704-bcc95546-0768-49ae-bec9-240cc59df384) |


### NPS extension

Make sure you run the latest version of the [NPS extension](https://www.microsoft.com/download/details.aspx?id=54688). NPS extension versions beginning with 1.0.1.40 support number matching. 

Because the NPS extension can't show a number, a user who is enabled for number matching will still be prompted to **Approve**/**Deny**. However, you can create a registry key that overrides push notifications to ask a user to enter a One-Time Passcode (OTP). The user must have an OTP authentication method registered to see this behavior. Common OTP authentication methods include the OTP available in the Authenticator app, other software tokens, and so on. 

If the user doesn't have an OTP method registered, they'll continue to get the **Approve**/**Deny** experience. A user with number matching disabled will always see the **Approve**/**Deny** experience.

To create the registry key that overrides push notifications:

1. On the NPS Server, open the Registry Editor.
1. Navigate to HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureMfa.
1. Set the following Key Value Pair:
   Key: OVERRIDE_NUMBER_MATCHING_WITH_OTP
   Value = TRUE
1. Restart the NPS Service. 

### Policy schema changes 

Identify your single target group for the schema configuration. Then use the following API endpoint to change the numberMatchingRequiredState property under featureSettings to **enabled**, and include or exclude groups:

```
https://graph.microsoft.com/beta/authenticationMethodsPolicy/authenticationMethodConfigurations/MicrosoftAuthenticator
```

>[!NOTE]
>Make sure you use the new policy schema for Microsoft Graph APIs. In Graph Explorer, you'll need to consent to the **Policy.Read.All** and **Policy.ReadWrite.AuthenticationMethod** permissions. 


#### MicrosoftAuthenticatorAuthenticationMethodConfiguration properties

**PROPERTIES**

| Property | Type | Description |
|---------|------|-------------|
| id | String | The authentication method policy identifier. |
| state | authenticationMethodState | Possible values are: **enabled**<br>**disabled** |
 
**RELATIONSHIPS**

| Relationship | Type | Description |
|--------------|------|-------------|
| includeTargets | [microsoftAuthenticatorAuthenticationMethodTarget](/graph/api/resources/passwordlessmicrosoftauthenticatorauthenticationmethodtarget) collection | A collection of users or groups who are enabled to use the authentication method |
| featureSettings | [microsoftAuthenticatorFeatureSettings](/graph/api/resources/passwordlessmicrosoftauthenticatorauthenticationmethodtarget) collection | A collection of Microsoft Authenticator features. |
 
#### MicrosoftAuthenticator includeTarget properties
 
**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| authenticationMode | String | Possible values are:<br>**any**: Both passwordless phone sign-in and traditional second factor notifications are allowed.<br>**deviceBasedPush**: Only passwordless phone sign-in notifications are allowed.<br>**push**: Only traditional second factor push notifications are allowed. |
| id | String | Object ID of an Azure AD user or group. |
| targetType | authenticationMethodTargetType | Possible values are: **user**, **group**.|



#### MicrosoftAuthenticator featureSettings properties
 
**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| numberMatchingRequiredState | authenticationMethodFeatureConfiguration | Require number matching for MFA notifications. Value is ignored for phone sign-in notifications. |
| displayAppInformationRequiredState | authenticationMethodFeatureConfiguration | Determines whether the user is shown application name in Microsoft Authenticator notification. |
| displayLocationInformationRequiredState | authenticationMethodFeatureConfiguration | Determines whether the user is shown geographic location context in Microsoft Authenticator notification. |

#### Authentication method feature configuration properties

**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| excludeTarget | featureTarget | A single entity that is excluded from this feature. <br>You can only exclude one group for number matching. |
| includeTarget | featureTarget | A single entity that is included in this feature. <br>You can only include one group for number matching.|
| State | advancedConfigState | Possible values are:<br>**enabled** explicitly enables the feature for the selected group.<br>**disabled** explicitly disables the feature for the selected group.<br>**default** allows Azure AD to manage whether the feature is enabled or not for the selected group. |

#### Feature target properties

**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| id | String | ID of the entity targeted. |
| targetType | featureTargetType | The kind of entity targeted, such as group, role, or administrative unit. The possible values are: ‘group’, 'administrativeUnit’, ‘role’, unknownFutureValue’. |

>[!NOTE]
>Number matching can be enabled only for a single group. 

#### Example of how to enable number matching for all users

In **featureSettings**, you'll need to change the **numberMatchingRequiredState** from **default** to **enabled**. 

The value of Authentication Mode can be either **any** or **push**, depending on whether or not you also want to enable passwordless phone sign-in. In these examples, we will use **any**, but if you don't want to allow passwordless, use **push**. 

>[!NOTE]
>For passwordless users, enabling or disabling number matching has no impact because it's already part of the passwordless experience. 

You might need to patch the entire schema to prevent overwriting any previous configuration. In that case, do a GET first, update only the relevant fields, and then PATCH. The following example only shows the update to the **numberMatchingRequiredState** under **featureSettings**. 

Only users who are enabled for Microsoft Authenticator under Microsoft Authenticator’s **includeTargets** will see the number match requirement. Users who aren't enabled for Microsoft Authenticator won't see the feature.

```json
//Retrieve your existing policy via a GET. 
//Leverage the Response body to create the Request body section. Then update the Request body similar to the Request body as shown below.
//Change the Query to PATCH and Run query
 
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        "numberMatchingRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "all_users"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
      }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/beta/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any",        
        }
    ]
}
 
```
 
To confirm the change is applied, run the GET request by using the following endpoint: 

```http
GET https://graph.microsoft.com/beta/authenticationMethodsPolicy/authenticationMethodConfigurations/MicrosoftAuthenticator
```

#### Example of how to enable number matching for a single group
 
In **featureSettings**, you'll need to change the **numberMatchingRequiredState** value from **default** to **enabled.** 
Inside the **includeTarget**, you'll need to change the **id** from **all_users** to the ObjectID of the group from the Azure AD portal.

You need to PATCH the entire configuration to prevent overwriting any previous configuration. We recommend that you do a GET first, and then update only the relevant fields and then PATCH. The example below only shows the update to the **numberMatchingRequiredState**. 

Only users who are enabled for Microsoft Authenticator under Microsoft Authenticator’s **includeTargets** will see the number match requirement. Users who aren't enabled for Microsoft Authenticator won't see the feature.

```json
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        "numberMatchingRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "1ca44590-e896-4dbe-98ed-b140b1e7a53a"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": "00000000-0000-0000-0000-000000000000"
            }
        }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/beta/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any"
        }
    ]
}
```
 
To verify, run GET again and verify the ObjectID:

```http
GET https://graph.microsoft.com/beta/authenticationMethodsPolicy/authenticationMethodConfigurations/MicrosoftAuthenticator
```

#### Example of removing the excluded group from number matching

In **featureSettings**, you'll need to change the **numberMatchingRequiredState** value from **default** to **enabled.** 
You need to change the **id** of the **excludeTarget** to `00000000-0000-0000-0000-000000000000`.

You need to PATCH the entire configuration to prevent overwriting any previous configuration. We recommend that you do a GET first, and then update only the relevant fields and then PATCH. The example below only shows the update to the **numberMatchingRequiredState**. 

Only users who are enabled for Microsoft Authenticator under Microsoft Authenticator’s **includeTargets** will be excluded from the number match requirement. Users who aren't enabled for Microsoft Authenticator won't see the feature.

```json
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        "numberMatchingRequiredState": {
            "state": "enabled",
            "includeTarget": {
                "targetType": "group",
                "id": "1ca44590-e896-4dbe-98ed-b140b1e7a53a"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": " 00000000-0000-0000-0000-000000000000"
            }
        }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/beta/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any"
        }
    ]
}
```

### Turn off number matching

To turn number matching off, you'll need to PATCH remove **numberMatchingRequiredState** from **enabled** to **disabled**/**default**.

```json
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#authenticationMethodConfigurations/$entity",
    "@odata.type": "#microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration",
    "id": "MicrosoftAuthenticator",
    "state": "enabled",
    "featureSettings": {
        "numberMatchingRequiredState": {
            "state": "default",
            "includeTarget": {
                "targetType": "group",
                "id": "1ca44590-e896-4dbe-98ed-b140b1e7a53a"
            },
            "excludeTarget": {
                "targetType": "group",
                "id": " 00000000-0000-0000-0000-000000000000"
            }
        }
    },
    "includeTargets@odata.context": "https://graph.microsoft.com/beta/$metadata#authenticationMethodsPolicy/authenticationMethodConfigurations('MicrosoftAuthenticator')/microsoft.graph.microsoftAuthenticatorAuthenticationMethodConfiguration/includeTargets",
    "includeTargets": [
        {
            "targetType": "group",
            "id": "all_users",
            "isRegistrationRequired": false,
            "authenticationMode": "any"
        }
    ]
}
```

## Enable number matching in the portal

To enable number matching in the Azure AD portal, complete the following steps:

1. In the Azure AD portal, click **Security** > **Authentication methods** > **Microsoft Authenticator**.
1. On the **Basics** tab, click **Yes** and **All users** to enable the policy for everyone or add selected users and groups. Set the **Authentication mode** for these users/groups to **Any**/**Push**. 

   Only users who are enabled for Microsoft Authenticator here can be included in the policy to require number matching for sign-in, or excluded from it. Users who aren't enabled for Microsoft Authenticator can't see the feature.

   :::image type="content" border="true" source="./media/how-to-mfa-number-match/enable-settings-number-match.png" alt-text="Screenshot of how to enable Microsoft Authenticator settings for Push authentication mode.":::

1. On the **Configure** tab, for **Require number matching for push notifications (Preview)**, change **Status** to **Enabled**, choose who to include or exclude from number matching, and click **Save**. 

   :::image type="content" border="true" source="./media/how-to-mfa-number-match/number-match.png" alt-text="Screenshot of how to enable number matching.":::

## Next steps

[Authentication methods in Azure Active Directory](concept-authentication-authenticator-app.md)
