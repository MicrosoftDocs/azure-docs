---
title: Identity providers for External Identities - Azure AD
description: Azure Active Directory B2B collaboration supports multi-factor authentication (MFA) for selective access to your corporate applications

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 05/19/2020

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS

ms.collection: M365-identity-device-management
---

# Identity Providers for External Identities

An *identity provider* creates, maintains, and manages identity information while providing authentication services to applications. When sharing your apps and resources with external users, Azure AD is the default identity provider for sharing. This means when you invite external users who already have an Azure AD or Microsoft account, they can automatically sign in without further configuration on your part.

However, you can enable users to sign in with various identity providers.

- **Google**: Google federation allows external users to redeem invitations from you by signing in to your apps with their own Gmail accounts. Google federation can also be used in your self-service sign-up user flows.
   > [!NOTE]
   > In the current self-service sign-up preview, if a user flow is associated with an app and you send a user an invitation to that app, the user won't be able to use a Gmail account to redeem the invitation. As a workaround, the user can go through the self-service sign-up process. Or, they can redeem the invitation by accessing a different app or by using their My Apps portal at https://myapps.microsoft.com.

- **Facebook**: When building an app, you can configure self-service sign-up and enable Facebook federation so that users can sign up for your app using their own Facebook accounts. Facebook can only be used for self-service sign-up user flows and isn't available as a sign-in option when users are redeeming  invitations from you.

- **Direct federation**: You can also set up direct federation with any external identity provider that supports the SAML or WS-Fed protocols. Direct federation allows external users to redeem invitations from you by signing in to your apps with their existing social or enterprise accounts. 
   > [!NOTE]
   > Direct federation identity providers can't be used in your self-service sign-up user flows.


## How it works

The Azure AD External Identities self-service sign up feature allows users to sign up with their Azure AD, Google, or Facebook account. To set up social identity providers in your Azure AD tenant, you'll create an application at each identity provider and configure credentials. You'll obtain a client or app ID and a client or app secret, which you can then add to your Azure AD tenant.

Once you've added an identity provider to your Azure AD tenant:

- When you invite an external user to apps or resources in your organization, the external user can sign in using their own account with that identity provider.
- When you enable [self-service sign-up](self-service-sign-up-overview.md) for your apps, external users can sign up for your apps using their own accounts with the identity providers you've added.

> [!NOTE]
> Azure AD is enabled by default for self-service sign-up, so users always have the option of signing up using an Azure AD account.

When redeeming your invitation or signing up for your app, the external user has the option to sign in and authenticate with the social identity provider:

![Screenshot showing the sign-in screen with Google and Facebook options](media/identity-providers/sign-in-with-social-identity.png)

For an optimal sign-in experience, federate with identity providers whenever possible so you can give your invited guests a seamless sign-in experience when they access your apps.  

## Next steps

To learn how to add identity providers for sign-in to your applications, refer to the following articles:

- [Add Google](google-federation.md) to your list of social identity providers
- [Add Facebook](facebook-federation.md) to your list of social identity providers
- [Set up direct federation](direct-federation.md) with any organization whose identity provider supports the SAML 2.0 or WS-Fed protocol. Note that direct federation is not an option for self-service sign-up user flows.
