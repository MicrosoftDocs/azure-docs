---
title: Set up Azure AD B2C local account identity provider
titleSuffix: Azure AD B2C
description: Define the identity types uses can use to sign-up or sign-in (email, username, phone number) in your Azure Active Directory B2C tenant.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/22/2021
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---
# Set up the local account identity provider

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

This article describes how to configure sign-in settings for local accounts in your Azure B2C tenant. A local account refers to an account that is created in your Azure AD B2C tenant either by an admin or by the user through self-service sign-up. Azure AD B2C serves as the identity provider for these accounts, and usernames and passwords are stored locally.

Several sign-in options are available for local accounts:

- **Email**: Users can sign up and sign in with their email address and password. Email sign-up is enabled by default in your local account identity provider settings. [Learn more about email sign-in](sign-in-options.md#email-sign-in)
- **Username**: Users can sign up and sign in with a username and password. [Learn more about username sign-in](sign-in-options.md#username-sign-in)
- **Phone (or "passwordless authentication")**: Users can sign up and sign in for the app using a phone number as their primary sign-in identifier. They don't need to sign in with a password. One-time passwords are sent to your users via SMS text messages. [Learn more about phone sign-in and pricing.](sign-in-options.md#phone-sign-in)
- **Phone or email**: Users can sign up or sign in by entering a phone number or an email address. Based on the user input, Azure AD B2C takes the user to the corresponding flow in the sign-up or sign-in page. [Learn more.](sign-in-options.md#phone-or-email-sign-in)
- **Phone recovery**: If you've enabled phone sign-up or sign-in, phone recovery lets users provide an email address that can be used to recover their account when they don't have their phone. [Learn more](sign-in-options.md#phone-recovery).

To manage settings for social or enterprise identities, where the identity of the user is managed by a federated identity provider like Facebook, and Google, see [Add an identity provider](add-identity-provider.md).

::: zone pivot="b2c-user-flow"

## Configure local account identity provider settings

You can configure the local identity providers available to be used within a user flow by enabling or disabling the providers (email, username, or phone number).  You can have more than one local identity provider enabled at the tenant level.

A user flow can only be configured to use one of the local account identity providers at any one time. Each user flow can have a different local account identity provider set, if more than one has been enabled at the tenant level.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your Azure AD tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Under **Manage**, select **Identity providers**.
1. In the identity provider list, select **Local account**.
1. In the **Configure local IDP** page, selected at least one of the allowable identity types consumers can use to create their local accounts in your Azure AD B2C tenant.
1. Select **Save**.

## Configure your user flow

1. In the left menu of the Azure portal, select **Azure AD B2C**.
1. Under **Policies**, select **User flows (policies)**.
1. Select the user flow for which you'd like to configure the sign-up and sign-in experience.
1. Select **Identity providers**
1. Under the **Local accounts**, select one of the following: **Email signup**,  **User ID signup**, **Phone signup**, **Phone/Email signup**, or **None**.

### Enable the recovery email prompt

If you choose the **Phone signup**, **Phone/Email signup** option, enable the recovery email prompt.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. In Azure AD B2C, under **Policies**, select **User flows**.
1. Select the user flow from the list.
1. Under **Settings**, select **Properties**.
1. Next to **Enable recovery email prompt for phone number signup and sign in (preview)**, select:
   - **On** to show the recovery email prompt during both sign-up and sign-in.
   - **Off** to hide the recovery email prompt.
1. Select **Save**.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Get the starter pack

Custom policies are a set of XML files you upload to your Azure AD B2C tenant to define user journeys. We provide starter packs with several pre-built policies. Download the relevant starter-pack: 

- [Email sign-in](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/SocialAndLocalAccounts)
- [Username sign-in](https://github.com/azure-ad-b2c/samples/tree/master/policies/username-signup-or-signin)
- [Phone sign-in](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/phone-number-passwordless). Select the [SignUpOrSignInWithPhone.xml](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/blob/master/scenarios/phone-number-passwordless/SignUpOrSignInWithPhone.xml) relying party policy. 
- [Phone or email sign-in](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/phone-number-passwordless). Select the [SignUpOrSignInWithPhone.xml](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/blob/master/scenarios/phone-number-passwordless/SignUpOrSignInWithPhoneOrEmail.xml) relying party policy.

After you download the starter pack.

1. In each file, replace the string `yourtenant` with the name of your Azure AD B2C tenant. For example, if the name of your B2C tenant is *contosob2c*, all instances of `yourtenant.onmicrosoft.com` become `contosob2c.onmicrosoft.com`.

1. Complete the steps in the [Add application IDs to the custom policy](tutorial-create-user-flows.md?pivots=b2c-custom-policy#add-application-ids-to-the-custom-policy) section of [Get started with custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy). For example, update `/phone-number-passwordless/`**`Phone_Email_Base.xml`** with the **Application (client) IDs** of the two applications you registered when completing the prerequisites, *IdentityExperienceFramework* and *ProxyIdentityExperienceFramework*.
1. Upload the policy files

::: zone-end

## Next steps

- [Add external identity providers](add-identity-provider.md)
- [Create a user flow](tutorial-create-user-flows.md)
