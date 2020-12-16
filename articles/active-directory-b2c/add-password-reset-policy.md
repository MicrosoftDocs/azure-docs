---
title: Set up a password reset flow
titleSuffix: Azure AD B2C
description: Learn how to set up a password reset flow in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 05/12/2020
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up a password reset flow in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

## Prerequisites

If you haven't already done so, [register a web application in Azure Active Directory B2C](../articles/active-directory-b2c/tutorial-register-applications.md).

::: zone pivot="b2c-user-flow"

## Create a password reset user flow

To enable users of your application to reset their password, you use a password reset user flow.

1. In the Azure AD B2C tenant overview menu, select **User flows**, and then select **New user flow**.
1. On the **Create a user flow** page, select the **Password reset** user flow. 
1. Under **Select a version**, select **Recommended**, and then select **Create**.
1. Enter a **Name** for the user flow. For example, *passwordreset1*.
1. For **Identity providers**, enable **Reset password using email address**.
2. Under Application claims, click **Show more** and choose the claims that you want returned in the authorization tokens sent back to your application. For example, select **User's Object ID**.
3. Click **OK**.
4. Click **Create** to add the user flow. A prefix of *B2C_1* is automatically appended to the name.

### Test the user flow

1. Select the user flow you created to open its overview page, then select **Run user flow**.
1. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Click **Run user flow**, verify the email address of the account that you previously created, and select **Continue**.
1. You now have the opportunity to change the password for the user. Change the password and select **Continue**. The token is returned to `https://jwt.ms` and should be displayed to you.

::: zone-end

::: zone pivot="b2c-custom-policy"

Custom policies are a set of XML files you upload to your Azure AD B2C tenant to define user journeys. We provide starter packs with several pre-built policies including: sign-up and sign-in, password reset and profile editing policy. For more information, see [Get started with custom policies in Azure AD B2C](custom-policy-get-started).

::: zone-end

## Next steps

Set up a [profile editing flow](add-profile-editing-policy.md).