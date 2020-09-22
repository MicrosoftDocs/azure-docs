---
title: Disable email verification during customer sign-up with a custom policy
titleSuffix: Azure AD B2C
description: Learn how to disable email verification during customer sign-up in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/11/2020
ms.author: mimart
ms.subservice: B2C
---

# Disable email verification during customer sign-up using a custom policy in Azure Active Directory B2C

[!INCLUDE [disable email verification intro](../../includes/active-directory-b2c-disable-email-verification.md)]

## Prerequisites

Complete the steps in [Get started with custom policies](custom-policy-get-started.md). You should have a working custom policy for sign-up and sign-in with social and local accounts.

## Add the metadata to the self-asserted technical profile

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

## Test the custom policy

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your Azure AD tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
4. Select **Identity Experience Framework**.
5. Select **Upload Custom Policy**, and then upload the two policy files that you changed.
2. Select the sign-up or sign-in policy that you uploaded, and click the **Run now** button.
3. You should be able to sign up using an email address without the validation.


## Next steps

- Learn more about the [self-asserted technical profile](self-asserted-technical-profile.md) in the IEF reference.
