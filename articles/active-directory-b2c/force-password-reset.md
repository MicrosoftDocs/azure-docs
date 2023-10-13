---
title: Configure a force password reset flow in Azure AD B2C
titleSuffix: Azure AD B2C
description: Learn how to set up a forced password reset flow in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/26/2023
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: b2c-support, has-azure-ad-ps-ref
zone_pivot_groups: b2c-policy-type
---

# Set up a force password reset flow in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

## Overview

As an administrator, you can [reset a user's password](manage-users-portal.md#reset-a-users-password) if the user forgets their password. Or you would like to force them to reset the password. In this article, you'll learn how to force a password reset in these scenarios.

When an administrator resets a user's password via the Azure portal, the value of the [forceChangePasswordNextSignIn](user-profile-attributes.md#password-profile-property) attribute is set to `true`. The [sign-in and sign-up journey](add-sign-up-and-sign-in-policy.md) checks the value of this attribute. After the user completes the sign-in, if the attribute is set to `true`, the user must reset their password. Then the value of the attribute is set to back `false`.

![Force password reset flow](./media/force-password-reset/force-password-reset-flow.png)

The password reset flow is applicable to local accounts in Azure AD B2C that use an [email address](sign-in-options.md#email-sign-in) or [username](sign-in-options.md#username-sign-in) with a password for sign-in.


## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

::: zone pivot="b2c-user-flow"

## Configure your user flow

To enable the **Forced password reset** setting in a sign-up or sign-in user flow:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select the sign-up and sign-in, or sign-in user flow (of type **Recommended**) that you want to customize.
1. In the left menu under **Settings**, select **Properties**.
1. Under **Password configuration**, select **Forced password reset**.
1. Select **Save**.

## Test the user flow

1. Sign in to the [Azure portal](https://portal.azure.com) as a user administrator or a password administrator. For more information about the available roles, see [Assigning administrator roles in Microsoft Entra ID](../active-directory/roles/permissions-reference.md#all-roles).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
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

## Configure your custom policy

Get the example of the force password reset policy on [GitHub](https://github.com/azure-ad-b2c/samples/tree/master/policies/force-password-reset). In each file, replace the string `yourtenant` with the name of your Azure AD B2C tenant. For example, if the name of your B2C tenant is *contosob2c*, all instances of `yourtenant.onmicrosoft.com` become `contosob2c.onmicrosoft.com`.

## Upload and test the policy

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity Experience Framework**.
1. In **Custom Policies**, select **Upload Policy**.
1. Select the *TrustFrameworkExtensionsCustomForcePasswordReset.xml* file.
1. Select **Upload**.
1. Repeat steps 6 through 8 for the relying party file *TrustFrameworkExtensionsCustomForcePasswordReset.xml*.

## Run the policy

1. Open the policy that you uploaded *B2C_1A_TrustFrameworkExtensions_custom_ForcePasswordReset*.
1. For **Application**, select the application that you registered earlier. To see the token, the **Reply URL** should show `https://jwt.ms`.
1. Select **Run now**. 
1. Sign in with the user account for which you reset the password.
1. You now must change the password for the user. Change the password and select **Continue**. The token is returned to `https://jwt.ms` and should be displayed to you.

::: zone-end

## Force password reset on next login

To force reset the password on next login, update the account password profile using MS Graph [Update user](/graph/api/user-update) operation. To do this, you need to assign your [Microsoft Graph application](microsoft-graph-get-started.md) the [User administrator](../active-directory/roles/permissions-reference.md#user-administrator) role. Follow the steps in [Grant user administrator role](microsoft-graph-get-started.md?tabs=app-reg-ga#optional-grant-user-administrator-role) to assign your Microsoft Graph application a User administrator role. 

The following example updates the password profile [forceChangePasswordNextSignIn](user-profile-attributes.md#password-profile-property) attribute to `true`, which forces the user to reset the password on next login.

```http
PATCH https://graph.microsoft.com/v1.0/users/<user-object-ID>
Content-type: application/json

{
    "passwordProfile": {
      "forceChangePasswordNextSignIn": true
    }
}
```

Once the account password profile has been set, you must also configure force password reset flow, as described in this article.

## Force a password reset after 90 days

As an administrator, you can set a user's password expiration to 90 days, using [MS Graph](microsoft-graph-operations.md). After 90 days, the value of [forceChangePasswordNextSignIn](user-profile-attributes.md#password-profile-property) attribute is automatically set to `true`. To force a password reset after 90 days, remove the `DisablePasswordExpiration` value from the user's profile [Password policy](user-profile-attributes.md#password-policy-attribute) attribute.

The following example updates the password policy to `None`, which forces a password reset after 90 days:

```http
PATCH https://graph.microsoft.com/v1.0/users/<user-object-ID>
Content-type: application/json

{
  "passwordPolicies": "None"
}
```

If you disabled the strong [password complexity](password-complexity.md), update the password policy to [DisableStrongPassword](user-profile-attributes.md#password-policy-attribute):

> [!NOTE]
> After the user resets their password, the passwordPolicies will be changed back to DisablePasswordExpiration

```http
PATCH https://graph.microsoft.com/v1.0/users/<user-object-ID>
Content-type: application/json

{
  "passwordPolicies": "DisableStrongPassword"
}
```

Once a password expiration policy has been set, you must also configure force password reset flow, as described in this article.

### Password expiry duration

By default, the password is set not to expire. However, the value is configurable by using the [Set-MsolPasswordPolicy](/powershell/module/msonline/set-msolpasswordpolicy) cmdlet from the Azure AD PowerShell module. This command updates the tenant, so that all users' passwords expire after number of days you configure.

## Next steps

Set up a [self-service password reset](add-password-reset-policy.md).
