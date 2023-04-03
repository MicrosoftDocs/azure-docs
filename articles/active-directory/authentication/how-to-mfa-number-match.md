---
title: Use number matching in multifactor authentication (MFA) notifications
description: Learn how to use number matching in MFA notifications
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 03/28/2023
ms.author: justinha
author: justinha
ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# How to use number matching in multifactor authentication (MFA) notifications  - Authentication methods policy

This topic covers how to enable number matching in Microsoft Authenticator push notifications to improve user sign-in security.  

>[!NOTE]
>Number matching is a key security upgrade to traditional second factor notifications in Microsoft Authenticator. We will remove the admin controls and enforce the number match experience tenant-wide for all users of Microsoft Authenticator push notifications starting May 8, 2023.<br> 
>We highly recommend enabling number matching in the near term for improved sign-in security. Relevant services will begin deploying these changes after May 8, 2023 and users will start to see number match in approval requests. As services deploy, some may see number match while others don't. To ensure consistent behavior for all users, we highly recommend you enable number match for Microsoft Authenticator push notifications in advance. 

## Prerequisites

- Your organization needs to enable Microsoft Authenticator (traditional second factor) push notifications for some users or groups by using the new Authentication methods policy. You can edit the Authentication methods policy by using the Azure portal or Microsoft Graph API. 

- If your organization is using AD FS adapter or NPS extensions, upgrade to the latest versions for a consistent experience. 

## Number matching

Number matching can be targeted to only a single group, which can be dynamic or nested. On-premises synchronized security groups and cloud-only security groups are supported for the Authentication methods policy. 

Number matching is available for the following scenarios. When enabled, all scenarios support number matching.

- [Multifactor authentication](#multifactor-authentication)
- [Self-service password reset](#sspr)
- [Combined SSPR and MFA registration during Authenticator app set up](#combined-registration)
- [AD FS adapter](#ad-fs-adapter)
- [NPS extension](#nps-extension)

Number matching isn't supported for push notifications for Apple Watch or Android wearable devices. Wearable device users need to use their phone to approve notifications when number matching is enabled.  

### Multifactor authentication

When a user responds to an MFA push notification using the Authenticator app, they'll be presented with a number. They need to type that number into the app to complete the approval. For more information about how to set up MFA, see [Tutorial: Secure user sign-in events with Azure AD Multi-Factor Authentication](tutorial-enable-azure-mfa.md).

![Screenshot of user entering a number match.](media/howto-authentication-passwordless-phone/phone-sign-in-microsoft-authenticator-app.png)

### SSPR

Self-service password reset (SSPR) with Microsoft Authenticator will require number matching when using Microsoft Authenticator. During self-service password reset, the sign-in page will show a number that the user will need to type into the Microsoft Authenticator notification. This number will only be seen by users who are enabled for number matching. For more information about how to set up SSPR, see [Tutorial: Enable users to unlock their account or reset passwords](howto-sspr-deployment.md).

### Combined registration

Combined registration with Microsoft Authenticator will require number matching. When a user goes through combined registration to set up the Authenticator app, the user is asked to approve a notification as part of adding the account. For users who are enabled for number matching, this notification will show a number that they need to type in their Authenticator app notification. For more information about how to set up combined registration, see [Enable combined security information registration](howto-registration-mfa-sspr-combined.md).

### AD FS adapter

AD FS adapter will require number matching on supported versions of Windows Server. On earlier versions, users will continue to see the **Approve**/**Deny** experience and won’t see number matching until you upgrade. The AD FS adapter supports number matching only after installing one of the updates in the following table. For more information about how to set up AD FS adapter, see [Configure Azure Active Directory (Azure AD) Multi-Factor Authentication Server to work with AD FS in Windows Server](howto-mfaserver-adfs-windows-server.md).

>[!NOTE]
>Unpatched versions of Windows Server don't support number matching. Users will continue to see the **Approve**/**Deny** experience and won't see number matching unless these updates are applied.

| Version | Update |
|---------|--------|
| Windows Server 2022 | [November 9, 2021—KB5007205 (OS Build 20348.350)](https://support.microsoft.com/topic/november-9-2021-kb5007205-os-build-20348-350-af102e6f-cc7c-4cd4-8dc2-8b08d73d2b31) |
| Windows Server 2019 | [November 9, 2021—KB5007206 (OS Build 17763.2300)](https://support.microsoft.com/topic/november-9-2021-kb5007206-os-build-17763-2300-c63b76fa-a9b4-4685-b17c-7d866bb50e48) |
| Windows Server 2016 | [October 12, 2021—KB5006669 (OS Build 14393.4704)](https://support.microsoft.com/topic/october-12-2021-kb5006669-os-build-14393-4704-bcc95546-0768-49ae-bec9-240cc59df384) |

### NPS extension

Although NPS doesn't support number matching, the latest NPS extension does support time-based one-time password (TOTP) methods such as the TOTP available in Microsoft Authenticator, other software tokens, and hardware FOBs. TOTP sign-in provides better security than the alternative **Approve**/**Deny** experience. Make sure you run the latest version of the [NPS extension](https://www.microsoft.com/download/details.aspx?id=54688). 

After May 8, 2023, when number matching is enabled for all users, anyone who performs a RADIUS connection with NPS extension version 1.2.2216.1 or later will be prompted to sign in with a TOTP method instead. 

Users must have a TOTP authentication method registered to see this behavior. Without a TOTP method registered, users continue to see **Approve**/**Deny**. 
 
Prior to the release of NPS extension version 1.2.2216.1 after May 8, 2023, organizations that run any of these earlier versions of NPS extension can modify the registry to require users to enter a TOTP:

- 1.2.2131.2
- 1.2.1959.1
- 1.2.1916.2
- 1.1.1892.2
- 1.0.1850.1
- 1.0.1.41
- 1.0.1.40

>[!NOTE] 
>NPS extensions versions earlier than 1.0.1.40 don't support TOTP enforced by number matching. These versions will continue to present users with **Approve**/**Deny**.

To create the registry entry to override the **Approve**/**Deny** options in push notifications and require a TOTP instead:

1. On the NPS Server, open the Registry Editor.
1. Navigate to HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureMfa.
1. Create the following String/Value pair:
   - Name: OVERRIDE_NUMBER_MATCHING_WITH_OTP
   - Value = TRUE
1. Restart the NPS Service. 

In addition:

- Users who perform TOTP must have either Microsoft Authenticator registered as an authentication method, or some other hardware or software OATH token. A user who can't use an OTP method will always see **Approve**/**Deny** options with push notifications if they use a version of NPS extension earlier than 1.2.2216.1.
- Users must be [enabled for number matching](#enable-number-matching-in-the-portal). 
- The NPS Server where the NPS extension is installed must be configured to use PAP protocol. For more information, see [Determine which authentication methods your users can use](howto-mfa-nps-extension.md#determine-which-authentication-methods-your-users-can-use). 

  >[!IMPORTANT] 
  >MSCHAPv2 doesn't support TOTP. If the NPS Server isn't configured to use PAP, user authorization will fail with events in the **AuthZOptCh** log of the NPS Extension server in Event Viewer:<br>
  >NPS Extension for Azure MFA: Challenge requested in Authentication Ext for User npstesting_ap. 
  >You can configure the NPS Server to support PAP. If PAP is not an option, you can set OVERRIDE_NUMBER_MATCHING_WITH_OTP = FALSE to fall back to Approve/Deny push notifications.

If your organization uses Remote Desktop Gateway and the user is registered for a TOTP code along with Microsoft Authenticator push notifications, the user won't be able to meet the Azure AD MFA challenge and Remote Desktop Gateway sign-in will fail. In this case, you can set OVERRIDE_NUMBER_MATCHING_WITH_OTP = FALSE to fall back to **Approve**/**Deny** push notifications with Microsoft Authenticator.

### Apple Watch supported for Microsoft Authenticator

In the upcoming Microsoft Authenticator release in January 2023 for iOS, there will be no companion app for watchOS due to it being incompatible with Authenticator security features. You won't be able to install or use Microsoft Authenticator on Apple Watch. We therefore recommend that you [delete Microsoft Authenticator from your Apple Watch](https://support.apple.com/HT212064), and sign in with Microsoft Authenticator on another device.

## Enable number matching in the portal

To enable number matching in the Azure portal, complete the following steps:

1. In the Azure portal, click **Security** > **Authentication methods** > **Microsoft Authenticator**.
1. On the **Enable and Target** tab, click **Yes** and **All users** to enable the policy for everyone or add selected users and groups. Set the **Authentication mode** for these users/groups to **Any** or **Push**. 

   Only users who are enabled for Microsoft Authenticator here can be included in the policy to require number matching for sign-in, or excluded from it. Users who aren't enabled for Microsoft Authenticator can't see the feature.

   :::image type="content" border="true" source="./media/how-to-mfa-number-match/enable-settings-number-match.png" alt-text="Screenshot of how to enable Microsoft Authenticator settings for Push authentication mode.":::

1. On the **Configure** tab, for **Require number matching for push notifications**, change **Status** to **Enabled**, choose who to include or exclude from number matching, and click **Save**. 

   :::image type="content" border="true" source="./media/how-to-mfa-number-match/number-match.png" alt-text="Screenshot of how to enable number matching.":::

## Enable number matching using Graph APIs 

Identify your single target group for the schema configuration. Then use the following API endpoint to change the numberMatchingRequiredState property under featureSettings to **enabled**, and include or exclude groups:

```
https://graph.microsoft.com/beta/authenticationMethodsPolicy/authenticationMethodConfigurations/MicrosoftAuthenticator
```

>[!NOTE]
>In Graph Explorer, you'll need to consent to the **Policy.Read.All** and **Policy.ReadWrite.AuthenticationMethod** permissions. 


### MicrosoftAuthenticatorAuthenticationMethodConfiguration properties

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
 
### MicrosoftAuthenticator includeTarget properties
 
**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| authenticationMode | String | Possible values are:<br>**any**: Both passwordless phone sign-in and traditional second factor notifications are allowed.<br>**deviceBasedPush**: Only passwordless phone sign-in notifications are allowed.<br>**push**: Only traditional second factor push notifications are allowed. |
| id | String | Object ID of an Azure AD user or group. |
| targetType | authenticationMethodTargetType | Possible values are: **user**, **group**.|



### MicrosoftAuthenticator featureSettings properties
 
**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| numberMatchingRequiredState | authenticationMethodFeatureConfiguration | Require number matching for MFA notifications. Value is ignored for phone sign-in notifications. |
| displayAppInformationRequiredState | authenticationMethodFeatureConfiguration | Determines whether the user is shown application name in Microsoft Authenticator notification. |
| displayLocationInformationRequiredState | authenticationMethodFeatureConfiguration | Determines whether the user is shown geographic location context in Microsoft Authenticator notification. |

### Authentication method feature configuration properties

**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| excludeTarget | featureTarget | A single entity that is excluded from this feature. <br>You can only exclude one group for number matching. |
| includeTarget | featureTarget | A single entity that is included in this feature. <br>You can only include one group for number matching.|
| State | advancedConfigState | Possible values are:<br>**enabled** explicitly enables the feature for the selected group.<br>**disabled** explicitly disables the feature for the selected group.<br>**default** allows Azure AD to manage whether the feature is enabled or not for the selected group. |

### Feature target properties

**PROPERTIES**

| Property | Type | Description |
|----------|------|-------------|
| id | String | ID of the entity targeted. |
| targetType | featureTargetType | The kind of entity targeted, such as group, role, or administrative unit. The possible values are: ‘group’, 'administrativeUnit’, ‘role’, unknownFutureValue’. |

>[!NOTE]
>Number matching can be enabled only for a single group. 

### Example of how to enable number matching for all users

In **featureSettings**, you'll need to change the **numberMatchingRequiredState** from **default** to **enabled**. 

The value of Authentication Mode can be either **any** or **push**, depending on whether or not you also want to enable passwordless phone sign-in. In these examples, we'll use **any**, but if you don't want to allow passwordless, use **push**. 

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

### Example of how to enable number matching for a single group
 
In **featureSettings**, you'll need to change the **numberMatchingRequiredState** value from **default** to **enabled.** 
Inside the **includeTarget**, you'll need to change the **id** from **all_users** to the ObjectID of the group from the Azure portal.
To remove an excluded group from number matching, change the **id** of the **excludeTarget** to `00000000-0000-0000-0000-000000000000`.

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

## FAQs

### When will my tenant see number matching if I don't use the Azure portal or Graph API to roll out the change?

Number match will be enabled for all users of Microsoft Authenticator push notifications after May 8, 2023. We had previously announced that we will remove the admin controls and enforce the number match experience tenant-wide for all users of Microsoft Authenticator push notifications starting February 27, 2023. After listening to customers, we will extend the availability of the rollout controls for a few more weeks. 

Relevant services will begin deploying these changes after May 8, 2023 and users will start to see number match in approval requests. As services deploy, some may see number match while others don't. To ensure consistent behavior for all your users, we highly recommend you use the Azure portal or Graph API to roll out number match for all Microsoft Authenticator users. 

### Will the changes after May 8th, 2023, override number matching settings that are configured for a group in the Authentication methods policy?

No, the changes after May 8th won't affect the **Enable and Target** tab for Microsoft Authenticator in the Authentication methods policy. Administrators can continue to target specific users and groups or **All Users** for Microsoft Authenticator **Push** or **Any** authentication mode. 

When Microsoft begins protecting all organizations by enabling number matching after May 8th, 2023, administrators will see the **Require number matching for push notifications** setting on the **Configure** tab of the Microsoft Authenticator policy is set to **Enabled** for **All users** and can't be disabled. In addition, the **Exclude** option for this setting will be removed.

### What happens for users who aren't specified in the Authentication methods policy but they are enabled for Notifications through mobile app in the legacy MFA tenant-wide policy?

Users who are enabled for MFA push notifications in the legacy MFA policy will also see number match after May 8th, 2023. If the legacy MFA policy has enabled **Notifications through mobile app**, users will see number matching regardless of whether or not it's enabled on the **Enable and Target** tab for Microsoft Authenticator in the Authentication methods policy.

:::image type="content" border="true" source="./media/how-to-mfa-number-match/notifications-through-mobile-app.png" alt-text="Screenshot of Notifications through mobile app setting.":::

### How should users be prepared for default number matching?

Here are differences in sign-in scenarios that Microsoft Authenticator users will see after number matching is enabled by default:

- Authentication flows will require users to do number match when using Microsoft Authenticator. If their version of Microsoft Authenticator doesn’t support number match, their authentication will fail.
- Self-service password reset (SSPR) and combined registration will also require number match when using Microsoft Authenticator. 
- AD FS adapter will require number matching on [supported versions of Windows Server](#ad-fs-adapter). On earlier versions, users will continue to see the **Approve**/**Deny** experience and won’t see number matching until you upgrade. 
- NPS extension versions beginning 1.2.2131.2 will require users to do number matching. Because the NPS extension can’t show a number, the user will be asked to enter a TOTP. The user must have a TOTP authentication method such as Microsoft Authenticator or software OATH tokens registered to see this behavior. If the user doesn’t have a TOTP method registered, they’ll continue to get the **Approve**/**Deny** experience.  
 
  To create a registry entry that overrides this behavior and prompts users with **Approve**/**Deny**: 

  1. On the NPS Server, open the Registry Editor.
  1. Navigate to HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureMfa.
  1. Create the following String/Value:
     - Name: OVERRIDE_NUMBER_MATCHING_WITH_OTP
     - Value = FALSE
  1. Restart the NPS Service. 

- Apple Watch will remain unsupported for number matching. We recommend you uninstall the Microsoft Authenticator Apple Watch app because you have to approve notifications on your phone.

### How can users enter a TOTP with the NPS extension?

The VPN and NPS server must be using PAP protocol for TOTP prompts to appear. If they're using a protocol that doesn't support TOTP, such as MSCHAPv2, they'll continue to see the **Approve/Deny** notifications.

### Will users get a prompt similar to a number matching prompt, but will need to enter a TOTP?

They'll see a prompt to supply a verification code. They must select their account in Microsoft Authenticator and enter the random generated code that appears there.

### Can I opt out of number matching?

Yes, currently you can disable number matching. We highly recommend that you enable number matching for all users in your tenant to protect yourself from MFA fatigue attacks. To protect the ecosystem and mitigate these threats, Microsoft will enable number matching for all tenants starting May 8, 2023. After protection is enabled by default, users can't opt out of number matching in Microsoft Authenticator push notifications. 

Relevant services will begin deploying these changes after May 8, 2023 and users will start to see number match in approval requests. As services deploy, some may see number match while others don't. To ensure consistent behavior for all users, we highly recommend you enable number match for Microsoft Authenticator push notifications in advance. 

### Does number matching only apply if Microsoft Authenticator is set as the default authentication method?

If the user has a different default authentication method, there won't be any change to their default sign-in. If the default method is Microsoft Authenticator and the user is specified in either of the following policies, they'll start to receive number matching approval after May 8th, 2023:

- Authentication methods policy (in the portal, click **Security** > **Authentication methods** > **Policies**)
- Legacy MFA tenant-wide policy (in the portal, click **Security** > **Multifactor Authentication** > **Additional cloud-based multifactor authentication settings**)

Regardless of their default method, any user who is prompted to sign-in with Authenticator push notifications will see number match after May 8th, 2023. If the user is prompted for another method, they won't see any change. 

### Is number matching supported with MFA Server?

No, number matching isn't enforced because it's not a supported feature for MFA Server, which is [deprecated](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-september-2022-train/ba-p/2967454).

### What happens if a user runs an older version of Microsoft Authenticator?  

If a user is running an older version of Microsoft Authenticator that doesn't support number matching, authentication won't work if number matching is enabled. Users need to upgrade to the latest version of Microsoft Authenticator to use it for sign-in if they use Android versions prior to 6.2006.4198, or iOS versions prior to 6.4.12.

### Why is my user prompted to tap on one of three numbers rather than enter the number in their Microsoft Authenticator app?

Older versions of Microsoft Authenticator prompt users to tap and select a number rather than enter the number in Microsoft Authenticator. These authentications won't fail, but Microsoft highly recommends that users upgrade to the latest version of Microsoft Authenticator if they use Android versions prior to 6.2108.5654, or iOS versions prior to 6.5.82, so they can use number match.

Minimum Microsoft Authenticator version supporting number matching:

- Android: 6.2006.4198
- iOS: 6.4.12

Minimum Microsoft Authenticator version for number matching which prompts to enter a number:

- Android 6.2111.7701
- iOS 6.5.85

## Next steps

[Authentication methods in Azure Active Directory](concept-authentication-authenticator-app.md)
