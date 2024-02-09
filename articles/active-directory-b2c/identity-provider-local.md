---
title: Set up Azure AD B2C local account identity provider
titleSuffix: Azure AD B2C
description: Define the identity types uses can use to sign-up or sign-in (email, username, phone number) in your Azure Active Directory B2C tenant.

author: garrodonnell
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.date: 09/02/2022
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---
# Set up the local account identity provider

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

This article describes how to determine sign-in methods for your Azure AD B2C local accounts. A local account refers to an account that is created in your Azure AD B2C directory when a user signs up for your application or an admin creates the account. Usernames and passwords are stored locally and Azure AD B2C serves as the identity provider for local accounts.

Several sign-in methods are available for local accounts:

- **Email**: Users can sign up and sign in to your app with their email address and password. Email sign-up is enabled by default in your local account identity provider settings.
- **Username**: Users can sign up and sign in with a username and password.
- **Phone (or "passwordless authentication")**: Users can sign up and sign in to your app using a phone number as their primary sign-in identifier. They don't need to create passwords. One-time passwords are sent to your users via SMS text messages.
- **Phone or email**: Users can sign up or sign in by entering a phone number or an email address. Based on the user input, Azure AD B2C takes the user to the corresponding flow in the sign-up or sign-in page.
- **Phone recovery**: If you've enabled phone sign-up or sign-in, phone recovery lets users provide an email address that can be used to recover their account when they don't have their phone.

To learn more about these methods, see [Sign-in options](sign-in-options.md). 

To configure settings for social or enterprise identities, where the identity of a user is managed by a federated identity provider like Facebook or Google, see [Add an identity provider](add-identity-provider.md).

::: zone pivot="b2c-user-flow"

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]


## Configure local account identity provider settings


You can choose the local account sign-in methods (email, username, or phone number) you want to make available in your tenant by configuring the **Local account** provider in your list of Azure AD B2C **Identity providers**. Then when you set up a user flow, you can choose one of the local account sign-in methods you've enabled tenant-wide. You can select only one local account sign-in method for a user flow, but you can select a different option for each user flow.

To set your local account sign-in options at the tenant level: 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Under **Azure services**, select **Azure AD B2C**. Or use the search box to find and select **Azure AD B2C**.
1. Under **Manage**, select **Identity providers**.
1. In the identity provider list, select **Local account**.
1. In the **Configure local IDP** page, select one or more identity types you want to enable for user flows in your Azure AD B2C tenant. Selecting an option here simply makes it available for use tenant-wide; when you create or modify a user flow, you'll be able to choose from the options you enable here.

   - **Phone**: Users are prompted for a phone number, which is verified at sign-up and becomes their user ID.
   - **Username**: Users can create their own unique user ID. An email address will be collected from the user and verified.
   - **Email**: Users will be prompted for an email address which will be verified at sign-up and become their user ID.
1. Select **Save**.

## Configure your user flow

1. In the left menu of the Azure portal, select **Azure AD B2C**.
1. Under **Policies**, select **User flows**.
1. Select the user flow for which you'd like to configure the sign-up and sign-in experience.
1. Select **Identity providers**
1. Under the **Local accounts**, select one of the following: **Email signup**,  **User ID signup**, **Phone signup**, **Phone/Email signup**, or **None**.

### Enable the recovery email prompt

If you choose the **Phone signup**, **Phone/Email signup** option, enable the recovery email prompt.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
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
