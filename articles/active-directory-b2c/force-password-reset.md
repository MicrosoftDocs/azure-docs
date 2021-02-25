---
title: Configure force password reset
titleSuffix: Azure AD B2C
description: Learn how to set up a force password reset flow in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 02/03/2021
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up force password reset flow in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

As an administrator, you can reset a user's password if the password is forgotten, the user gets locked out, or if the user never received a password. In this article, you learn how to force the password anytime the password has expired and need to be changed.

## Overview

The [Sign In and Sign Up journey](add-sign-up-and-sign-in-policy.md) checks the value of the [forceChangePasswordNextSignIn attribute](user-profile-attributes.md#password-profile-property). The value of the attribute is changed to true, when an administrator resets a user's password through Azure portal. If it set to true, Azure AD B2C asks the force to reset the password. After the password is reset, the value of the attribute back to false.

![Force password reset flow](./media/force-password-reset/force-password-reset-flow.png)

The password reset flow is applicable to local accounts in Azure AD B2C that use an [email address](identity-provider-local.md#email-sign-in) or [username](identity-provider-local.md#username-sign-in) with a password for sign-in. The password reset flow doesn't apply to federated accounts.

### Force password after 90 days

By default, passwords are not expired. Administrator can change the user's password expiration policy using [MS Graph](microsoft-graph-operation.md). If the force password reset is enabled, and password expiration is enabled for a user, the user is forced to reset the password every 90 days.

For more information how to set user's password expiration policy, see [Password policy attribute](user-profile-attributes.md#password-policy-attribute).

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Configure your policy 

::: zone pivot="b2c-user-flow"

To enable force password reset to the sign-up or sign-in user flow:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select a sign-up or sign-in (type of Recommended) user flow you want to customize.
1. Under **Settings** in the left menu, select **Properties**.
1. Under **Password complexity**, select **Forced password reset**.
1. Select **Save**.

### Test the user flow

1. Sign in to the [Azure portal](https://portal.azure.com) as a user administrator, or password administrator. For more information about the available roles, see [Assigning administrator roles in Azure Active Directory](../active-directory/roles/permissions-reference#available-roles).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **Users**, search for and select a user that wants the reset, and then select **Reset Password**.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select a sign-up or sign-in (type of Recommended) user flow you want to test.
1. Select **Run user flow**.
1. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select **Run user flow**
1. Sign-in with the account that you reset the password.
1. You now must change the password for the user. Change the password and select **Continue**. The token is returned to `https://jwt.ms` and should be displayed to you.

::: zone-end

::: zone pivot="b2c-custom-policy"

This feature is currently available only to the user flows.

::: zone-end

## Next steps

Set up a [self-service password reset](add-password-reset-policy.md).