---

title: One-time passcode authentication for B2B guest users - Azure AD
description: How to use Email one-time passcode to authenticate B2B guest users without the need for a Microsoft account.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 04/26/2022

ms.author: mimart
author: msmimart
manager: CelesteDG
ms.reviewer: mal
ms.custom: "it-pro, seo-update-azuread-jan, seoapril2019, contperf-fy21q4-portal"
ms.collection: M365-identity-device-management
---

# Email one-time passcode authentication

The email one-time passcode feature is a way to authenticate B2B collaboration users when they can't be authenticated through other means, such as Azure AD, Microsoft account (MSA), or social identity providers. When a B2B guest user tries to redeem your invitation or sign in to your shared resources, they can request a temporary passcode, which is sent to their email address. Then they enter this passcode to continue signing in.

You can enable this feature at any time in the Azure portal by configuring the Email one-time passcode identity provider under your tenant's External Identities settings. You can choose to enable the feature, disable it, or wait for automatic enablement.

![Email one-time passcode overview diagram](media/one-time-passcode/email-otp.png)

> [!IMPORTANT]
>
> - We've begun rolling out a change to turn on the email one-time passcode feature for all existing tenants and enable it by default for new tenants. We're enabling the email one-time passcode feature because it provides a seamless fallback authentication method for your guest users. However, if you don't want to allow this feature to turn on automatically, you can [disable it](#disable-email-one-time-passcode). Soon, we'll stop creating new, unmanaged ("viral") Azure AD accounts and tenants during B2B collaboration invitation redemption.
> - Email one-time passcode settings have moved in the Azure portal from **External collaboration settings** to **All identity providers**.

> [!NOTE]
> One-time passcode users must sign in using a link that includes the tenant context (for example, `https://myapps.microsoft.com/?tenantid=<tenant id>` or `https://portal.azure.com/<tenant id>`, or in the case of a verified domain, `https://myapps.microsoft.com/<verified domain>.onmicrosoft.com`). Direct links to applications and resources also work as long as they include the tenant context. Guest users are currently unable to sign in using endpoints that have no tenant context. For example, using `https://myapps.microsoft.com`, `https://portal.azure.com` will result in an error.

## User experience for one-time passcode guest users

When the email one-time passcode feature is enabled, newly invited users [who meet certain conditions](#when-does-a-guest-user-get-a-one-time-passcode) will use one-time passcode authentication. Guest users who redeemed an invitation before email one-time passcode was enabled will continue to use their same authentication method.

With one-time passcode authentication, the guest user can redeem your invitation by clicking a direct link or by using the invitation email. In either case, a message in the browser indicates that a code will be sent to the guest user's email address. The guest user selects **Send code**:

   ![Screenshot showing the Send code button](media/one-time-passcode/otp-send-code.png)

A passcode is sent to the user’s email address. The user retrieves the passcode from the email and enters it in the browser window:

   ![Screenshot showing the Enter code page](media/one-time-passcode/otp-enter-code.png)

The guest user is now authenticated, and they can see the shared resource or continue signing in.

> [!NOTE]
> One-time passcodes are valid for 30 minutes. After 30 minutes, that specific one-time passcode is no longer valid, and the user must request a new one. User sessions expire after 24 hours. After that time, the guest user receives a new passcode when they access the resource. Session expiration provides added security, especially when a guest user leaves their company or no longer needs access.

## When does a guest user get a one-time passcode?

When a guest user redeems an invitation or uses a link to a resource that has been shared with them, they’ll receive a one-time passcode if:

- They don't have an Azure AD account
- They don't have a Microsoft account
- The inviting tenant didn't set up federation with social (like [Google](google-federation.md)) or other identity providers.

At the time of invitation, there's no indication that the user you're inviting will use one-time passcode authentication. But when the guest user signs in, one-time passcode authentication will be the fallback method if no other authentication methods can be used.


> [!NOTE]
> When a user redeems a one-time passcode and later obtains an MSA, Azure AD account, or other federated account, they'll continue to be authenticated using a one-time passcode. If you want to update the user's authentication method, you can [reset their redemption status](reset-redemption-status.md).

### Example

Guest user teri@gmail.com is invited to Fabrikam, which doesn't have Google federation set up. Teri doesn't have a Microsoft account. They'll receive a one-time passcode for authentication.

## Enable email one-time passcode

1. Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD global administrator.

1. In the navigation pane, select **Azure Active Directory**.

1. Select **External Identities** > **All identity providers**.

1. Select **Email one-time passcode** to open the configuration pane.

1. Under **Email one-time passcode for guests**, select one of the following:

   - **Automatically enable email one-time passcode for guests starting October 2021** if you don't want to enable the feature immediately and want to wait for the automatic enablement date.
   - **Enable email one-time passcode for guests effective now** to enable the feature now.
   - **Yes** to enable the feature now if you see a Yes/No toggle (this toggle appears if the feature was previously disabled).

   ![Email one-time passcode toggle enabled](media/one-time-passcode/enable-email-otp-options.png)

1. Select **Save**.

> [!NOTE]
> Email one-time passcode settings can also be configured with the [emailAuthenticationMethodConfiguration](/graph/api/resources/emailauthenticationmethodconfiguration) resource type in the Microsoft Graph API.

## Disable email one-time passcode

We've begun rolling out a change to turn on the email one-time passcode feature for all existing tenants and enable it by default for new tenants. We're enabling the email one-time passcode feature because it provides a seamless fallback authentication method for your guest users. However, if you don't want to allow this feature to turn on automatically, you can disable it. Soon, we'll stop creating new, unmanaged ("viral") Azure AD accounts and tenants during B2B collaboration invitation redemption.

> [!NOTE]
>
> If the email one-time passcode feature has been enabled in your tenant and you turn it off, any guest users who have redeemed a one-time passcode will not be able to sign in. You can [reset their redemption status](reset-redemption-status.md) so they can sign in again using another authentication method.

### To disable the email one-time passcode feature

1. Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD global administrator.

1. In the navigation pane, select **Azure Active Directory**.

1. Select **External Identities** > **All identity providers**.

1. Select **Email one-time passcode**, and then under **Email one-time passcode for guests**, select **Disable email one-time passcode for guests** (or **No** if the feature was previously enabled, disabled, or opted into during preview).

   ![Email one-time passcode toggle disabled](media/one-time-passcode/disable-email-otp-options.png)

   > [!NOTE]
   > Email one-time passcode settings have moved in the Azure portal from **External collaboration settings** to **All identity providers**.
   > If you see a toggle instead of the email one-time passcode options, this means you've previously enabled, disabled, or opted into the preview of the feature. Select **No** to disable the feature.

1. Select **Save**.

## Note for public preview customers

If you've previously opted in to the email one-time passcode public preview, automatic feature enablement doesn't apply to you, so your related business processes won't be affected. Additionally, in the Azure portal, under the **Email one-time passcode for guests** properties, you won't see the option to **Automatically enable email one-time passcode for guests starting October 2021**. Instead, you'll see the following **Yes** or **No** toggle:

![Email one-time passcode opted in](media/one-time-passcode/enable-email-otp-opted-in.png)

However, if you'd prefer to opt out of the feature and allow it to be automatically enabled, you can revert to the default settings by using the Microsoft Graph API [email authentication method configuration resource type](/graph/api/resources/emailauthenticationmethodconfiguration). After you revert to the default settings, the following options will be available under **Email one-time passcode for guests**:

![Enable Email one-time passcode opted in](media/one-time-passcode/email-otp-options.png)

- **Automatically enable email one-time passcode for guests starting October 2021**. (Default) If the email one-time passcode feature isn't already enabled for your tenant, it will be automatically turned on. No further action is necessary if you want the feature enabled at that time. If you've already enabled or disabled the feature, this option will be unavailable.

- **Enable email one-time passcode for guests effective now**. Turns on the email one-time passcode feature for your tenant.

- **Disable email one-time passcode for guests**. Turns off the email one-time passcode feature for your tenant, and prevents the feature from turning on at the automatic enablement date.

## Note for Azure US Government customers

The email one-time passcode feature is disabled by default in the Azure US Government cloud. Your partners will be unable to sign in unless this feature is enabled. Unlike the Azure public cloud, the Azure US Government cloud doesn't support redeeming invitations with self-service Azure Active Directory accounts.

 ![Email one-time passcode disabled](media/one-time-passcode/enable-email-otp-disabled.png)

To enable the email one-time passcode feature in Azure US Government cloud:

1. Sign in to the [Azure portal](https://portal.azure.com) as an Azure AD global administrator.
2. In the navigation pane, select **Azure Active Directory**.
3. Select **Organizational relationships** > **All identity providers**.

   > [!NOTE]
   > - If you don't see **Organizational relationships**, search for "External Identities” in the search bar at the top.

4. Select **Email one-time passcode**, and then select **Yes**.
5. Select **Save**.

For more information about current limitations, see [Azure AD B2B in government and national clouds](b2b-government-national-clouds.md).

## Frequently asked questions

**Why do I still see “Automatically enable email one-time passcode for guests starting October 2021” selected in my email one-time passcode settings?**

We've begun globally rolling out the change to enable email one-time passcode. In the meantime, you might still see “Automatically enable email one-time passcode for guests starting October 2021” selected in your email one-time passcode settings.

**What happens to my existing guest users if I enable email one-time passcode?**

Your existing guest users won't be affected if you enable email one-time passcode, as your existing users are already past the point of redemption. Enabling email one-time passcode will only affect future redemption activities where new guest users are redeeming into the tenant.

**What is the user experience for guests during global rollout?**

The user experience depends on your current email one-time passcode settings, whether the user already has an unmanaged account, and whether you [reset a user's redemption status](reset-redemption-status.md). The following table describes these scenarios.

|User scenario  |With email one-time passcode enabled prior to rollout  |With email one-time passcode disabled prior to rollout   |
|---------|---------|---------|
|**User has an existing unmanaged Azure AD account (not from redemption in your tenant)**      |Both before and after rollout, the user redeems invitations using email one-time passcode.         |Both before and after rollout, the user continues signing in with their unmanaged account.<sup>1</sup>             |
|**User previously redeemed an invitation to your tenant using an unmanaged Azure AD account**      |Both before and after rollout, the user continues to use their unmanaged account. Or, you can [reset their redemption status](reset-redemption-status.md) so they can redeem a new invitation using email one-time passcode.          |Both before and after rollout, the user continues to use their unmanaged account, even if you reset their redemption status and reinvite them.<sup>1</sup>         |
|**User with no unmanaged Azure AD account**      |Both before and after rollout, the user redeems invitations using email one-time passcode.           |Both before and after rollout, the user redeems invitations using an unmanaged account.<sup>2</sup>          |

<sup>1</sup> In a separate release, we’ll roll out a change that will enforce redemption with a Microsoft account. To prevent your users from having to manage both an unmanaged Azure AD account and an MSA, we strongly encourage you to enable email one-time passcode.

<sup>2</sup> The user might see a sign-in error when they're redeeming a direct application link and they weren't added to your directory in advance. In a separate release, we’ll roll out a change that will enforce redemption and future sign-ins with a Microsoft account.

For more information about the different redemption pathways, see [B2B collaboration invitation redemption](redemption-experience.md).

**Does this mean the “No account? Create one!” option for self-service sign-up is going away?**

It’s easy to get [self-service sign-up in the context of External Identities](self-service-sign-up-overview.md) confused with self-service sign-up for email-verified users, but they're two different features. The feature that's going away is [self-service sign-up with email-verified users](../enterprise-users/directory-self-service-signup.md), which results in your guests creating an unmanaged Azure AD account. However, self-service sign-up for External Identities will continue to be available, which results in your guests signing up to your organization with a [variety of identity providers](identity-providers.md).  

**What does Microsoft recommend we do with existing Microsoft accounts (MSA)?**

When we support the ability to disable Microsoft Account in the Identity providers settings (not available today), we strongly recommend you disable Microsoft Account and enable email one-time passcode. Then you should [reset the redemption status](reset-redemption-status.md) of existing guests with Microsoft accounts so that they can re-redeem using email one-time passcode authentication and use email one-time passcode to sign in going forward.

**Does this change include SharePoint and OneDrive integration with Azure AD B2B?**

No, the global rollout of the change to enable email one-time passcode by default doesn't include enabling SharePoint and OneDrive integration with Azure AD B2B. To learn how to enable integration so that collaboration on SharePoint and OneDrive uses B2B capabilities, or how to disable this integration, see [SharePoint and OneDrive Integration with Azure AD B2B](/sharepoint/sharepoint-azureb2b-integration).
