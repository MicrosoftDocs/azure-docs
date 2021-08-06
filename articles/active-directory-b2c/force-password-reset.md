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
ms.date: 06/10/2021
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up a force password reset flow in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

## Overview

As an administrator, you can [reset a user's password](manage-users-portal.md#reset-a-users-password) if the user forgets their password. Or you would like to force them to reset the password. In this article, you'll learn how to force a password reset in these scenarios.

When an administrator resets a user's password via the Azure portal, the value of the [forceChangePasswordNextSignIn](user-profile-attributes.md#password-profile-property) attribute is set to `true`. The [sign-in and sign-up journey](add-sign-up-and-sign-in-policy.md) checks the value of this attribute. After the user completes the sign-in, if the attribute is set to `true`, the user must reset their password. Then the value of the attribute is set to back `false`.

![Force password reset flow](./media/force-password-reset/force-password-reset-flow.png)

The password reset flow is applicable to local accounts in Azure AD B2C that use an [email address](sign-in-options.md#email-sign-in) or [username](sign-in-options.md#username-sign-in) with a password for sign-in.

::: zone pivot="b2c-user-flow"

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Configure your user flow

To enable the **Forced password reset** setting in a sign-up or sign-in user flow:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select the sign-up and sign-in, or sign-in user flow (of type **Recommended**) that you want to customize.
1. In the left menu under **Settings**, select **Properties**.
1. Under **Password configuration**, select **Forced password reset**.
1. Select **Save**.

## Test the user flow

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

## Force password reset on next login

To force reset the password on next login, update the account password profile using MS Graph [Update user](/graph/api/user-update) operation. The following example updates the password profile [forceChangePasswordNextSignIn](user-profile-attributes.md#password-profile-property) attribute to `true`, which forces the user to reset the password on next login.

```http
PATCH https://graph.microsoft.com/v1.0/users/<user-object-ID>
Content-type: application/json

{
"passwordProfile": {
  "forceChangePasswordNextSignIn": true
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

```http
PATCH https://graph.microsoft.com/v1.0/users/<user-object-ID>
Content-type: application/json

{
  "passwordPolicies": "DisableStrongPassword"
}
```

Once a password expiration policy has been set, you must also configure force password reset flow, as described in this article.

### Password expiry duration

The password expiry duration default value is **90** days. The value is configurable by using the [Set-MsolPasswordPolicy](/powershell/module/msonline/set-msolpasswordpolicy) cmdlet from the Azure Active Directory Module for Windows PowerShell. This command updates the tenant, so that all users' passwords expire after number of days you configure.

::: zone-end

::: zone pivot="b2c-custom-policy"

This feature is currently only available for User Flows. For setup steps, choose **User Flow** above. For custom policies, use the force password reset first logon [GitHub sample](https://github.com/azure-ad-b2c/samples/tree/master/policies/force-password-reset-first-logon).

::: zone-end

## Next steps

Set up a [self-service password reset](add-password-reset-policy.md).
