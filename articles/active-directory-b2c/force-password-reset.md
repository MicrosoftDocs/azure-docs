---
title: Configure a force password reset flow in Azure AD B2C
titleSuffix: Azure AD B2C
description: Learn how to set up a forced password reset flow in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/03/2021
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up a force password reset flow in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

As an administrator, you can [reset a user's password](manage-users-portal.md#reset-a-users-password) if the user forgets their password. Or you would like to force them to reset the password. In this article, you'll learn how to force a password reset in these scenarios.

## Overview

When an administrator resets a user's password via the Azure portal, the value of the [forceChangePasswordNextSignIn](user-profile-attributes.md#password-profile-property) attribute is set to `true`.

The [sign-in and sign-up journey](add-sign-up-and-sign-in-policy.md) checks the value of this attribute. After the user completes the sign-in, if the attribute is set to `true`, the user must reset their password. Then the value of the attribute is set to back `false`.

![Force password reset flow](./media/force-password-reset/force-password-reset-flow.png)

The password reset flow is applicable to local accounts in Azure AD B2C that use an [email address](identity-provider-local.md#email-sign-in) or [username](identity-provider-local.md#username-sign-in) with a password for sign-in.

### Force a password reset after 90 days

As an administrator, you can set a user's password expiration to 90 days, using [MS Graph](microsoft-graph-operations.md). After 90 days, the value of [forceChangePasswordNextSignIn](user-profile-attributes.md#password-profile-property) attribute is automatically set to `true`. For more information on how to set a user's password expiration policy, see [Password policy attribute](user-profile-attributes.md#password-policy-attribute).

Once a password expiration policy has been set, you must also configure force password reset flow, as described in this article.  

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Configure your policy

::: zone pivot="b2c-user-flow"

To enable the **Forced password reset** setting in a sign-up or sign-in user flow:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select the sign-up and sign-in, or sign-in user flow (of type **Recommended**) that you want to customize.
1. In the left menu under **Settings**, select **Properties**.
1. Under **Password complexity**, select **Forced password reset**.
1. Select **Save**.

### Test the user flow

1. Sign in to the [Azure portal](https://portal.azure.com) as a user administrator or a password administrator. For more information about the available roles, see [Assigning administrator roles in Azure Active Directory](../active-directory/roles/permissions-reference.md#all-roles).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **Users**. Search for and select the user you'll use to test the password reset, and then select **Reset Password**.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select a sign-up or sign-in user flow (of type **Recommended**) that you want to test.
1. Select **Run user flow**.
1. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select **Run user flow**.
1. Sign in with the user account for which you reset the password.
1. You now must change the password for the user. Change the password and select **Continue**. The token is returned to `https://jwt.ms` and should be displayed to you.

::: zone-end

::: zone pivot="b2c-custom-policy"

1. Get the example of a force password reset on [GitHub](https://github.com/azure-ad-b2c/samples/tree/master/policies/force-password-reset).
1. In each file, replace the string `yourtenant` with the name of your Azure AD B2C tenant. For example, if the name of your B2C tenant is *contosob2c*, all instances of `yourtenant.onmicrosoft.com` become `contosob2c.onmicrosoft.com`.
1. Upload the policy files in the following order: the extension policy `TrustFrameworkExtensionsCustomForcePasswordReset.xml`, then the relying party policy `SignUpOrSigninCustomForcePasswordReset.xml`.

### Test the policy

1. Sign in to the [Azure portal](https://portal.azure.com) as a user administrator or a password administrator. For more information about the available roles, see [Assigning administrator roles in Azure Active Directory](../active-directory/roles/permissions-reference.md#all-roles).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **Users**. Search for and select the user you'll use to test the password reset, and then select **Reset Password**.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select the `B2C_1A_signup_signin_Custom_ForcePasswordReset` policy to open it. 
1. For **Application**, select a web application that you [previously registered](troubleshoot-custom-policies.md#troubleshoot-the-runtime). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. Sign in with the user account for which you reset the password.
1. You now must change the password for the user. Change the password and select **Continue**. The token is returned to `https://jwt.ms` and should be displayed to you.

::: zone-end

## Next steps

Set up a [self-service password reset](add-password-reset-policy.md).
