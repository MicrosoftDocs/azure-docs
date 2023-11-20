---
title: Multifactor authentication in Azure Active Directory B2C  
description: How to enable multifactor authentication in consumer-facing applications secured by Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.date: 07/20/2022
ms.custom: project-no-code
ms.author: kengaderdus
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Enable multifactor authentication in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

Azure Active Directory B2C (Azure AD B2C) integrates directly with [Microsoft Entra multifactor authentication](../active-directory/authentication/concept-mfa-howitworks.md) so that you can add a second layer of security to sign-up and sign-in experiences in your applications. You enable multifactor authentication without writing a single line of code. If you already created sign up and sign-in user flows, you can still enable multifactor authentication.

This feature helps applications handle scenarios such as:

- You don't require multifactor authentication to access one application, but you do require it to access another. For example, the customer can sign into an auto insurance application with a social or local account, but must verify the phone number before accessing the home insurance application registered in the same directory.
- You don't require multifactor authentication to access an application in general, but you do require it to access the sensitive portions within it. For example, the customer can sign in to a banking application with a social or local account and check the account balance, but must verify the phone number before attempting a wire transfer.

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

### Verification methods

With [Conditional Access](conditional-access-identity-protection-overview.md) users may or may not be challenged for MFA based on configuration decisions that you can make as an administrator. The methods of the multifactor authentication are:

- **Email** - During sign-in, a verification email containing a one-time password (OTP) is sent to the user. The user provides the OTP code that was sent in the email. 
- **SMS or phone call** - During the first sign-up or sign-in, the user is asked to provide and verify a phone number. During subsequent sign-ins, the user is prompted to select either the **Send Code** or **Call Me** phone MFA option. Depending on the user's choice, a text message is sent or a phone call is made to the verified phone number to identify the user. The user either provides the OTP code sent via text message or approves the phone call.
- **Phone call only** - Works in the same way as the SMS or phone call option, but only a phone call is made. 
- **SMS only** - Works in the same way as the SMS or phone call option, but only a text message is sent. 
- **Authenticator app - TOTP** - The user must install an authenticator app that supports time-based one-time password (TOTP) verification, such as the [Microsoft Authenticator app](https://www.microsoft.com/security/mobile-authenticator-app), on a device that they own. During the first sign-up or sign-in, the user scans a QR code or enters a code manually using the authenticator app. During subsequent sign-ins, the user types the TOTP code that appears on the authenticator app. See [how to set up the Microsoft Authenticator app](#enroll-a-user-in-totp-with-an-authenticator-app-for-end-users). 

> [!IMPORTANT]
> Authenticator app - TOTP provides stronger security than SMS/Phone and email is the least secure. [SMS/Phone-based multifactor authentication incurs separate charges from the normal Azure AD B2C MAU's pricing model](https://azure.microsoft.com/pricing/details/active-directory/external-identities/). 

## Set multifactor authentication

::: zone pivot="b2c-user-flow"

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select the user flow for which you want to enable MFA. For example, *B2C_1_signinsignup*.
1. Select **Properties**.
1. In the **Multifactor authentication** section, select the desired **Type of method**. Then under **MFA enforcement** select an option:

   - **Off** - MFA is never enforced during sign-in, and users are not prompted to enroll in MFA during sign-up or sign-in.
   - **Always on** - MFA is always required, regardless of your Conditional Access setup. During sign-up, users are prompted to enroll in MFA. During sign-in, if users aren't already enrolled in MFA, they're prompted to enroll.
   - **Conditional** - During sign-up and sign-in, users are prompted to enroll in MFA (both new users and existing users who aren't enrolled in MFA). During sign-in, MFA is enforced only when an active Conditional Access policy evaluation requires it:

        - If the result is an MFA challenge with no risk, MFA is enforced. If the user isn't already enrolled in MFA, they're prompted to enroll.
        - If the result is an MFA challenge due to risk *and* the user is not enrolled in MFA, sign-in is blocked.

   > [!NOTE]
   >
   > - With general availability of Conditional Access in Azure AD B2C, users are now prompted to enroll in an MFA method during sign-up. Any sign-up user flows you created prior to general availability won't automatically reflect this new behavior, but you can include the behavior by creating new user flows.
   > - If you select **Conditional**, you'll also need to [add Conditional Access to user flows](conditional-access-user-flow.md), and specify the apps you want the policy to apply to.
   > - Multifactor authentication is disabled by default for sign-up user flows. You can enable MFA in user flows with phone sign-up, but because a phone number is used as the primary identifier, email one-time passcode is the only option available for the second authentication factor.

1. Select **Save**. MFA is now enabled for this user flow.

You can use **Run user flow** to verify the experience. Confirm the following scenario:

A customer account is created in your tenant before the multifactor authentication step occurs. During the step, the customer is asked to provide a phone number and verify it. If verification is successful, the phone number is attached to the account for later use. Even if the customer cancels or drops out, the customer can be asked to verify a phone number again during the next sign-in with multifactor authentication enabled.

::: zone-end

::: zone pivot="b2c-custom-policy"

To enable multifactor authentication, get the custom policy starter pack from GitHub as follows:

-  [Download the .zip file](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/archive/master.zip) or clone the repository from `https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack`, and then update the XML files in the **SocialAndLocalAccountsWithMFA** starter pack with your Azure AD B2C tenant name. The **SocialAndLocalAccountsWithMFA**  enables social and local sign in options, and multifactor authentication options, except for the Authenticator app - TOTP option.
- To support the **Authenticator app - TOTP** MFA option, download the custom policy files from `https://github.com/azure-ad-b2c/samples/tree/master/policies/totp`, and then update the XML files with your Azure AD B2C tenant name. Make sure to include `TrustFrameworkExtensions.xml`, `TrustFrameworkLocalization.xml`, and `TrustFrameworkBase.xml` XML files from the **SocialAndLocalAccounts** starter pack.
- Update your [page layout] to version `2.1.14`. For more information, see [Select a page layout](contentdefinitions.md#select-a-page-layout).

::: zone-end

## Enroll a user in TOTP with an authenticator app (for end users)

When an Azure AD B2C application enables MFA using the TOTP option, end users need to use an authenticator app to generate TOTP codes. Users can  use the [Microsoft Authenticator app](https://www.microsoft.com/security/mobile-authenticator-app) or any other authenticator app that supports TOTP verification. An Azure AD B2C system admin needs to advise end users to set up the Microsoft Authenticator app using the following steps:

1. [Download and install the Microsoft Authenticator app](https://www.microsoft.com/en-us/security/mobile-authenticator-app) on your Android or iOS mobile device.
1. Open the application requiring you to use TOTP for MFA, for example *Contoso webapp*, and then sign in or sign up by entering the required information.
1. If you're asked to enroll your account by scanning a QR code using an authenticator app, open the Microsoft Authenticator app in your phone, and in the upper right corner, select the **3-dotted** menu icon (for Android) or **+** menu icon (for IOS).
1. Select **+ Add account**.
1. Select **Other account (Google, Facebook, etc.)**, and then scan the QR code shown in the application (for example, *Contoso webapp*) to enroll your account. If you're unable to scan the QR code, you can add the account manually:
    1. In the Microsoft Authenticator app on your phone, select **OR ENTER CODE MANUALLY**.
    1. In the application (for example, *Contoso webapp*), select **Still having trouble?**. This displays **Account Name** and **Secret**.
    1. Enter the **Account Name** and **Secret** in your Microsoft Authenticator app, and then select **FINISH**.
1. In the application (for example, *Contoso webapp*), select **Continue**.
1. In **Enter your code**, enter the code that appears in your Microsoft Authenticator app.
1. Select **Verify**.
1. During subsequent sign-in to the application, type the code that appears in the Microsoft Authenticator app.

Learn about [OATH software tokens](../active-directory/authentication/concept-authentication-oath-tokens.md)

## Delete a user's TOTP authenticator enrollment (for system admins)

In Azure AD B2C, you can delete a user's TOTP authenticator app enrollment. Then the user would be required to re-enroll their account to use TOTP authentication again. To delete a user's TOTP enrollment, you can use either the [Azure portal](https://portal.azure.com) or the [Microsoft Graph API](/graph/api/softwareoathauthenticationmethod-delete).

> [!NOTE]
> - Deleting a user's TOTP authenticator app enrollment from Azure AD B2C doesn't remove the user's account in the TOTP authenticator app. The system admin needs to direct the user to manually delete their account from the TOTP authenticator app before trying to enroll again.
> - If the user accidentally deletes their account from the TOTP authenticator app, they need to notify a system admin or app owner who can delete the user's TOTP authenticator enrollment from Azure AD B2C so the user can re-enroll. 

### Delete TOTP authenticator app enrollment using the Azure portal 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the left menu, select **Users**.
1. Search for and select the user for which you want to delete TOTP authenticator app enrollment.
1. In the left menu, select **Authentication methods**.
1. Under **Usable authentication methods**, find **Software OATH token**, and then select the ellipsis menu next to it. If you don't see this interface, select the option to **"Switch to the new user authentication methods experience! Click here to use it now"** to switch to the new authentication methods experience.
1. Select **Delete**, and then select **Yes** to confirm. 

:::image type="content" source="media/multi-factor-authentication/authentication-methods.png" alt-text="User authentication methods":::

### Delete TOTP authenticator app enrollment using the Microsoft Graph API

Learn how to [delete a user's Software OATH token authentication method](/graph/api/softwareoathauthenticationmethod-delete) using the Microsoft Graph API.

::: zone pivot="b2c-custom-policy"

## Next steps

- Learn about the [TOTP display control](display-control-time-based-one-time-password.md) and [Microsoft Entra ID multifactor authentication technical profile](multi-factor-auth-technical-profile.md)

::: zone-end
