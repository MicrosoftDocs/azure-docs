---
title: How number matching works in multifactor authentication push notifications for Microsoft Authenticator
description: Learn how to use number matching in MFA notifications
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 05/10/2023
ms.author: justinha
author: justinha
ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to explain how number matching in MFA push notifications from Authenticator in Microsoft Entra ID works in different use cases.
---
# How number matching works in multifactor authentication push notifications for Authenticator - Authentication methods policy

This topic covers how number matching in Microsoft Authenticator push notifications improves user sign-in security. 
Number matching is a key security upgrade to traditional second factor notifications in Authenticator. 

Beginning May 8, 2023, number matching is enabled for all Authenticator push notifications. 
As relevant services deploy, users worldwide who are enabled for Authenticator push notifications will begin to see number matching in their approval requests. 
Users can be enabled for Authenticator push notifications either in the Authentication methods policy or the legacy multifactor authentication policy if **Notifications through mobile app** is enabled.

## Number matching scenarios

Number matching is available for the following scenarios. When enabled, all scenarios support number matching.

- [Multifactor authentication](#multifactor-authentication)
- [Self-service password reset](#sspr)
- [Combined SSPR and MFA registration during Authenticator app set up](#combined-registration)
- [AD FS adapter](#ad-fs-adapter)
- [NPS extension](#nps-extension)

Number matching isn't supported for push notifications for Apple Watch or Android wearable devices. Wearable device users need to use their phone to approve notifications when number matching is enabled.  

### Multifactor authentication

When a user responds to an MFA push notification using Authenticator, they'll be presented with a number. They need to type that number into the app to complete the approval. For more information about how to set up MFA, see [Tutorial: Secure user sign-in events with Microsoft Entra multifactor authentication](tutorial-enable-azure-mfa.md).

![Screenshot of user entering a number match.](media/howto-authentication-passwordless-phone/phone-sign-in-microsoft-authenticator-app.png)

### SSPR

Self-service password reset (SSPR) with Authenticator requires number matching when using Authenticator. During self-service password reset, the sign-in page shows a number that the user needs to type into the Authenticator notification. For more information about how to set up SSPR, see [Tutorial: Enable users to unlock their account or reset passwords](howto-sspr-deployment.md).

### Combined registration

Combined registration with Authenticator requires number matching. When a user goes through combined registration to set up Authenticator, the user needs to approve a notification to add the account. This notification shows a number that they need to type into the Authenticator notification. For more information about how to set up combined registration, see [Enable combined security information registration](howto-registration-mfa-sspr-combined.md).

### AD FS adapter

AD FS adapter requires number matching on supported versions of Windows Server. On earlier versions, users continue to see the **Approve**/**Deny** experience and don’t see number matching until you upgrade. The AD FS adapter supports number matching only after you install one of the updates in the following table. For more information about how to set up AD FS adapter, see [Configure Azure Multi-Factor Authentication Server to work with AD FS in Windows Server](howto-mfaserver-adfs-windows-server.md).

>[!NOTE]
>Unpatched versions of Windows Server don't support number matching. Users continue to see the **Approve**/**Deny** experience and don't see number matching unless these updates are applied.

| Version | Update |
|---------|--------|
| Windows Server 2022 | [November 9, 2021—KB5007205 (OS Build 20348.350)](https://support.microsoft.com/topic/november-9-2021-kb5007205-os-build-20348-350-af102e6f-cc7c-4cd4-8dc2-8b08d73d2b31) |
| Windows Server 2019 | [November 9, 2021—KB5007206 (OS Build 17763.2300)](https://support.microsoft.com/topic/november-9-2021-kb5007206-os-build-17763-2300-c63b76fa-a9b4-4685-b17c-7d866bb50e48) |
| Windows Server 2016 | [October 12, 2021—KB5006669 (OS Build 14393.4704)](https://support.microsoft.com/topic/october-12-2021-kb5006669-os-build-14393-4704-bcc95546-0768-49ae-bec9-240cc59df384) |

### NPS extension

Although NPS doesn't support number matching, the latest NPS extension does support time-based one-time password (TOTP) methods such as the TOTP available in Authenticator, other software tokens, and hardware FOBs. TOTP sign-in provides better security than the alternative **Approve**/**Deny** experience. Make sure you run the latest version of the [NPS extension](https://www.microsoft.com/download/details.aspx?id=54688). 

Anyone who performs a RADIUS connection with NPS extension version 1.2.2216.1 or later is prompted to sign in with a TOTP method instead of **Approve**/**Deny**. 
Users must have a TOTP authentication method registered to see this behavior. Without a TOTP method registered, users continue to see **Approve**/**Deny**. 
 
Organizations that run any of these earlier versions of NPS extension can modify the registry to require users to enter a TOTP:

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

- Users who perform TOTP must have either Authenticator registered as an authentication method, or some other hardware or software OATH token. A user who can't use a TOTP method will always see **Approve**/**Deny** options with push notifications if they use a version of NPS extension earlier than 1.2.2216.1.
- The NPS Server where the NPS extension is installed must be configured to use PAP protocol. For more information, see [Determine which authentication methods your users can use](howto-mfa-nps-extension.md#determine-which-authentication-methods-your-users-can-use). 

  >[!IMPORTANT] 
  >MSCHAPv2 doesn't support TOTP. If the NPS Server isn't configured to use PAP, user authorization fails with events in the **AuthZOptCh** log of the NPS Extension server in Event Viewer:<br>
  >NPS Extension for Azure MFA: Challenge requested in Authentication Ext for User npstesting_ap. 
  >You can configure the NPS Server to support PAP. If PAP is not an option, you can set OVERRIDE_NUMBER_MATCHING_WITH_OTP = FALSE to fall back to **Approve**/**Deny** push notifications.

If your organization uses Remote Desktop Gateway and the user is registered for a TOTP code along with Authenticator push notifications, the user can't meet the Microsoft Entra multifactor authentication challenge and Remote Desktop Gateway sign-in fails. In this case, you can set OVERRIDE_NUMBER_MATCHING_WITH_OTP = FALSE to fall back to **Approve**/**Deny** push notifications with Authenticator.

## FAQs

### Can I opt out of number matching?

No, users can't opt out of number matching in Authenticator push notifications. 

Relevant services will begin deploying these changes after May 8, 2023 and users will start to see number match in approval requests. As services deploy, some may see number match while others don't. To ensure consistent behavior for all users, we highly recommend you enable number match for Authenticator push notifications in advance. 

### Does number matching only apply if Authenticator push notifications are set as the default authentication method?

Yes. If the user has a different default authentication method, there's no change to their default sign-in. If the default method is Authenticator push notifications, they get number matching. If the default method is anything else, such as TOTP in Authenticator or another provider, there's no change. 

Regardless of their default method, any user who is prompted to sign-in with Authenticator push notifications sees number matching. If prompted for another method, they won't see any change. 

### What happens for users who aren't specified in the Authentication methods policy but they are enabled for Notifications through mobile app in the legacy MFA tenant-wide policy?
Users who are enabled for MFA push notifications in the legacy MFA policy will also see number match if the legacy MFA policy has enabled **Notifications through mobile app**. Users will see number matching regardless of whether they are enabled for Authenticator in the Authentication methods policy.

:::image type="content" border="true" source="./media/how-to-mfa-number-match/notifications-through-mobile-app.png" alt-text="Screenshot of Notifications through mobile app setting.":::

### Is number matching supported with MFA Server?

No, number matching isn't enforced because it's not a supported feature for MFA Server, which is [deprecated](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-september-2022-train/ba-p/2967454).

### What happens if a user runs an older version of Authenticator?  

If a user is running an older version of Authenticator that doesn't support number matching, authentication won't work. Users need to upgrade to the latest version of Authenticator to use it for sign-in.

### How can users recheck the number on mobile iOS devices after the match request appears?

During mobile iOS broker flows, the number match request appears over the number after a two-second delay. To recheck the number, click **Show me the number again**. This action only occurs in mobile iOS broker flows. 

### Is Apple Watch supported for Authenticator?

In the Authenticator release in January 2023 for iOS, there is no companion app for watchOS due to it being incompatible with Authenticator security features. You can't install or use Authenticator on Apple Watch. We therefore recommend that you [delete Authenticator from your Apple Watch](https://support.apple.com/HT212064), and sign in with Authenticator on another device.

## Next steps

[Authentication methods in Microsoft Entra ID](concept-authentication-authenticator-app.md)
