---
title: Use number matching in multifactor authentication (MFA) notifications (Preview) - Azure Active Directory
description: Learn how to use number matching in MFA notifications
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/18/2022
ms.author: justinha
author: mjsantani
ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# How to use number matching in multifactor authentication (MFA) notifications (Preview) - Authentication Methods Policy

This topic covers how to enable number matching in Microsoft Authenticator push notifications to improve user sign-in security.  

>[!NOTE]
>Number matching is a key security upgrade to traditional second factor notifications in Microsoft Authenticator that will be enabled by default for all tenants a few months after general availability (GA).<br> 
>We highly recommend enabling number matching in the near-term for improved sign-in security.

## Prerequisites

Your organization will need to enable Authenticator (traditional second factor) push notifications for some users or groups only by using the Azure AD portal. The new Authentication Methods Policy API will soon be ready as another configuration option. If your organization is using ADFS adapter or NPS extensions, please upgrade to the latest versions for a consistent experience. 

## Number matching

<!---check below with Mayur. The bit about the policy came from the number match FAQ at the end.--->

Number matching can be targeted to only a single group, which can be dynamic or nested. On-premises synchronized security groups and cloud-only security groups are supported for the Authentication Method Policy. 

Number matching is available for the following scenarios. When enabled, all scenarios support number matching.

- [Multifactor authentication](tutorial-enable-azure-mfa.md)
- [Self-service password reset](howto-sspr-deployment.md)
- [Combined SSPR and MFA registration during Authenticator app set up](howto-registration-mfa-sspr-combined.md)
- [AD FS adapter](howto-mfaserver-adfs-windows-server.md)
- [NPS extension](howto-mfa-nps-extension.md)

>[!NOTE]
>For passwordless users, enabling or disabling number matching has no impact because it's already part of the passwordless experience. 

Number matching is not supported for Apple Watch notifications. Apple Watch users need to use their phone to approve notifications when number matching is enabled.

### Multifactor authentication

When a user responds to an MFA push notification using the Authenticator app, they will be presented with a number. They need to type that number into the app to complete the approval. 

![Screenshot of user entering a number match.](media/howto-authentication-passwordless-phone/phone-sign-in-microsoft-authenticator-app.png)

### SSPR

During self-service password reset, the Authenticator app notification will show a number that the user will need to type in their Authenticator app notification. This number will only be seen to users who have been enabled for number matching.

### Combined registration

When a user is goes through combined registration to set up the Authenticator app, the user is asked to approve a notification as part of adding the account. For users who are enabled for number matching, this notification will show a number that they need to type in their Authenticator app notification. 

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

If the user doesn't have an OTP method registered, they will continue to get the **Approve**/**Deny** experience. A user with number matching disabled will always see the **Approve**/**Deny** experience.

To create the registry key that overrides push notifications:

1. On the NPS Server, open the Registry Editor.
1. Navigate to HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureMfa.
1. Set the following Key Value Pair:
   Key: OVERRIDE_NUMBER_MATCHING_WITH_OTP
   Value = TRUE
1. Restart the NPS Service. 

## Enable number matching in the portal

To enable number matching in the Azure AD portal, complete the following steps:

1. In the Azure AD portal, click **Security** > **Authentication methods** > **Microsoft Authenticator**.
1. Select the target users, click the three dots on the right, and click **Configure**.
1. Select the **Authentication mode**, and then for **Require number matching (Preview)**, click **Enable**, and then click **Done**. 


## Next steps

[Authentication methods in Azure Active Directory](concept-authentication-authenticator-app.md)