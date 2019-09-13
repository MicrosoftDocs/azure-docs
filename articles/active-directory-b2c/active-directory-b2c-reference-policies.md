---
title: User flows in Azure Active Directory B2C | Microsoft Docs
description: Learn more about the extensible policy framework of Azure Active Directory B2C and how to create various user flows.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: marsma
ms.subservice: B2C
---

# User flows in Azure Active Directory B2C

The extensible policy framework of Azure Active Directory (Azure AD) B2C is the core strength of the service. Policies fully describe identity experiences such as sign-up, sign-in, or profile editing. To help you set up the most common identity tasks, the Azure AD B2C portal includes predefined, configurable policies called **user flows**. 

## What are user flows?

A user flow enables you to control behaviors in your applications by configuring the following settings:

- Account types used for sign-in, such as social accounts like a Facebook or local accounts
- Attributes to be collected from the consumer, such as first name, postal code, and shoe size
- Azure Multi-Factor Authentication
- Customization of the user interface
- Information that the application receives as claims in a token 

You can create many user flows of different types in your tenant and use them in your applications as needed. User flows can be reused across applications. This flexibility enables you to define and modify identity experiences with minimal or no changes to your code. Your application triggers a user flow by using a standard HTTP authentication request that includes a user flow parameter. A customized [token](active-directory-b2c-reference-tokens.md) is received as a response. 

The following examples show the "p" query string parameter that specifies the user flow to be used:

```
https://contosob2c.b2clogin.com/contosob2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e      // Your registered Application ID
&redirect_uri=https%3A%2F%2Flocalhost%3A44321%2F    // Your registered Reply URL, url encoded
&response_mode=form_post                            // 'query', 'form_post' or 'fragment'
&response_type=id_token
&scope=openid
&nonce=dummy
&state=12345                                        // Any value provided by your application
&p=b2c_1_siup                                       // Your sign-up user flow
```

```
https://contosob2c.b2clogin.com/contosob2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e      // Your registered Application ID
&redirect_uri=https%3A%2F%2Flocalhost%3A44321%2F    // Your registered Reply URL, url encoded
&response_mode=form_post                            // 'query', 'form_post' or 'fragment'
&response_type=id_token
&scope=openid
&nonce=dummy
&state=12345                                        // Any value provided by your application
&p=b2c_1_siin                                       // Your sign-in user flow
```

## User flow versions

In the Azure portal, new [versions of user flows](user-flow-versions.md) are being added all the time. When you get started with Azure AD B2C, tested user flows are recommended for you to use. When you create a new user flow, you choose the user flow that you need from the **Recommended** tab.

The following user flows are currently recommended:

- **Sign up and sign in** - Handles both of the sign-up and sign-in experiences with a single configuration. Users are led down the right path depending on the context. It's recommended that you use this user flow over a **sign-up** user flow or a **sign-in** user flow.
- **Profile editing** - Enables users to edit their profile information.
- **Password reset** - Enables you to configure whether and how users can reset their password.

## Linking user flows

A **sign-up or sign-in** user flow with local accounts includes a **Forgot password?** link on the first page of the experience. Clicking this link doesn't automatically trigger a password reset user flow. 

Instead, the error code `AADB2C90118` is returned to your application. Your application needs to handle this error code by running a specific user flow that resets the password. To see an example, take a look at a [simple ASP.NET sample](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-DotNet-SUSI) that demonstrates the linking of user flows.

## Email address storage

An email address can be required as part of a user flow. If the user authenticates with a social identity provider, the email address is stored in the **otherMails** property. If a local account is based on a user name, then the email address is stored in a strong authentication detail property. If a local account is based on an email address, then the email address is stored in the **signInNames** property.
 
The email address isn't guaranteed to be verified in any of these cases. A tenant administrator can disable email verification in the basic policies for local accounts. Even if email address verification is enabled, addresses aren't verified if they come from a social identity provider and they haven't been changed.
 
Only the **otherMails** and **signInNames** properties are exposed through the Active Directory Graph API. The email address in the strong authentication detail property is not available.

## Next steps

To create the recommended user flows, follow the instructions in [Tutorial: Create a user flow](tutorial-create-user-flows.md).


