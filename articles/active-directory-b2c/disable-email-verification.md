---
title: Disable email verification during customer sign-up
titleSuffix: Azure AD B2C
description: Learn how to disable email verification during customer sign-up in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: azure-active-directory

ms.topic: how-to
ms.date: 01/11/2024
ms.author: kengaderdus
ms.subservice: b2c
zone_pivot_groups: b2c-policy-type


#Customer intent: As an Azure AD B2C application developer, I want to disable email verification during the customer sign-up process, so that I can create a smoother sign-up experience and have the flexibility to differentiate between verified and unverified customers.

---

# Disable email verification during customer sign-up in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

By default, Azure Active Directory B2C (Azure AD B2C) verifies your customer's email address for local accounts (accounts for users who sign up with email address or username). Azure AD B2C ensures valid email addresses by requiring customers to verify them during the sign-up process. It also prevents malicious actors from using automated processes to generate fraudulent accounts in your applications.

Some application developers prefer to skip email verification during the sign-up process and instead have customers verify their email address later. To support this, Azure AD B2C can be configured to disable email verification. Doing so creates a smoother sign-up process and gives developers the flexibility to differentiate customers that have verified their email address from customers that have not.

> [!WARNING]
> Disabling email verification in the sign-up process may lead to spam. If you disable the default Azure AD B2C-provided email verification, we recommend that you implement a replacement verification system.

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]
## Disable email verification

::: zone pivot="b2c-user-flow"

Follow these steps to disable email verification:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select the user flow for which you want to disable email verification.
1. Select **Page layouts**.
1. Select **Local account sign-up page**.
1. Under **User attributes**, select **Email Address**.
1. In the **Requires Verification** drop-down, select **No**.
1. Select **Save**. Email verification is now disabled for this user flow.

::: zone-end

::: zone pivot="b2c-custom-policy"
The **LocalAccountSignUpWithLogonEmail** technical profile is a [self-asserted](self-asserted-technical-profile.md), which is invoked during the sign-up flow. To disable the email verification, set the `EnforceEmailVerification` metadata to false. Override the LocalAccountSignUpWithLogonEmail technical profiles in the extension file. 

1. Open the extensions file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>.
1. Find the `ClaimsProviders` element. If the element doesn't exist, add it.
1. Add the following claims provider to the `ClaimsProviders` element:

```xml
<ClaimsProvider>
  <DisplayName>Local Account</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="LocalAccountSignUpWithLogonEmail">
      <Metadata>
        <Item Key="EnforceEmailVerification">false</Item>
      </Metadata>
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```
::: zone-end

::: zone pivot="b2c-user-flow"

## Test your policy 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select the user flow for which you want to disable email verification. For example, *B2C_1_signinsignup*.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Click **Run user flow**
1. You should be able to sign up using an email address without the validation.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Update and test the relying party file

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Microsoft Entra ID tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
1. Select **Identity Experience Framework**.
1. Select **Upload Custom Policy**, and then upload the two policy files that you changed.
1. Select the sign-up or sign-in policy that you uploaded, and click the **Run now** button.
1. You should be able to sign up using an email address without the validation.

::: zone-end


## Next steps

- Learn how to [customize the user interface in Azure Active Directory B2C](customize-ui-with-html.md)
