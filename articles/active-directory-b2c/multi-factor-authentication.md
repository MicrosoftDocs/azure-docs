---
title: Multi-Factor Authentication in Azure Active Directory B2C | Microsoft Docs
description: How to enable Multi-Factor Authentication in consumer-facing applications secured by Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/10/2021
ms.custom: project-no-code
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Enable multi-factor authentication in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

Azure Active Directory B2C (Azure AD B2C) integrates directly with [Azure AD Multi-Factor Authentication](../active-directory/authentication/concept-mfa-howitworks.md) so that you can add a second layer of security to sign-up and sign-in experiences in your applications. You enable multi-factor authentication without writing a single line of code. If you already created sign up and sign-in user flows, you can still enable multi-factor authentication.

This feature helps applications handle scenarios such as:

- You don't require multi-factor authentication to access one application, but you do require it to access another. For example, the customer can sign into an auto insurance application with a social or local account, but must verify the phone number before accessing the home insurance application registered in the same directory.
- You don't require multi-factor authentication to access an application in general, but you do require it to access the sensitive portions within it. For example, the customer can sign in to a banking application with a social or local account and check the account balance, but must verify the phone number before attempting a wire transfer.

### Verification methods

With [Conditional Access](conditional-access-identity-protection-overview.md) users may or may not be challenged for MFA based on configuration decisions that you can make as an administrator. The months of the multi-factor authentication are:

- Email
- SMS
- Phone calls

## Set multi-factor authentication

::: zone pivot="b2c-user-flow"

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Use the **Directory + subscription** filter in the top menu to select the directory that contains your Azure AD B2C tenant.
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
   > - Multi-factor authentication (MFA) is disabled by default for sign-up user flows. You can enable MFA in user flows with phone sign-up, but because a phone number is used as the primary identifier, email one-time passcode is the only option available for the second authentication factor.

1. Select **Save**. MFA is now enabled for this user flow.

You can use **Run user flow** to verify the experience. Confirm the following scenario:

A customer account is created in your tenant before the multi-factor authentication step occurs. During the step, the customer is asked to provide a phone number and verify it. If verification is successful, the phone number is attached to the account for later use. Even if the customer cancels or drops out, the customer can be asked to verify a phone number again during the next sign-in with multi-factor authentication enabled.

::: zone-end

::: zone pivot="b2c-custom-policy"

To enable Multi-Factor Authentication get the custom policy starter packs from GitHub, then update the XML files in the **SocialAndLocalAccountsWithMFA** starter pack with your Azure AD B2C tenant name. The **SocialAndLocalAccountsWithMFA**  enables social, local, and multi-factor authentication options. For more information, see [Get started with custom policies in Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy). 

::: zone-end
