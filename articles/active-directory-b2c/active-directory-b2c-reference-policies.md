---
title: Built-in policies in Azure Active Directory B2C | Microsoft Docs
description: A topic on the extensible policy framework of Azure Active Directory B2C and on how to create various policy types.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 01/26/2017
ms.author: davidmu
ms.component: B2C
---

# Azure Active Directory B2C: Built-in policies


The extensible policy framework of Azure Active Directory (Azure AD) B2C is the core strength of the service. Policies fully describe consumer identity experiences such as sign-up, sign-in, or profile editing. For instance, a sign-up policy allows you to control behaviors by configuring the following settings:

* Account types (social accounts such as Facebook or local accounts such as email addresses) that consumers can use to sign up for the application
* Attributes (for example, first name, postal code, and shoe size) to be collected from the consumer during sign-up
* Use of Azure Multi-Factor Authentication
* The look and feel of all sign-up pages
* Information (which manifests as claims in a token) that the application receives when the policy run finishes

You can create multiple policies of different types in your tenant and use them in your applications as needed. Policies can be reused across applications. This flexibility enables developers to define and modify consumer identity experiences with minimal or no changes to their code.

Policies are available for use via a simple developer interface. Your application triggers a policy by using a standard HTTP authentication request (passing a policy parameter in the request) and receives a customized token as response. For example, the only difference between requests that invoke a sign-up policy and requests that invoke a sign-in policy is the policy name that's used in the "p" query string parameter:

```

https://contosob2c.b2clogin.com/contosob2c.onmicrosoft.com/oauth2/v2.0/authorize?
client_id=2d4d11a2-f814-46a7-890a-274a72a7309e      // Your registered Application ID
&redirect_uri=https%3A%2F%2Flocalhost%3A44321%2F    // Your registered Reply URL, url encoded
&response_mode=form_post                            // 'query', 'form_post' or 'fragment'
&response_type=id_token
&scope=openid
&nonce=dummy
&state=12345                                        // Any value provided by your application
&p=b2c_1_siup                                       // Your sign-up policy

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
&p=b2c_1_siin                                       // Your sign-in policy

```

## Create a sign-up or sign-in policy

This policy handles both consumer sign-up & sign-in experiences with a single configuration. Consumers are led down the right path (sign-up or sign-in) depending on the context. It also describes the contents of tokens that the application will receive upon successful sign-ups or sign-ins.  A code sample for the **sign-up or sign-in** policy is [available here](active-directory-b2c-devquickstarts-web-dotnet-susi.md).  It is recommended that you use this policy over a **sign-up** policy or a **sign-in** policy.  

[!INCLUDE [active-directory-b2c-create-sign-in-sign-up-policy](../../includes/active-directory-b2c-create-sign-in-sign-up-policy.md)]

## Create a sign-up policy

[!INCLUDE [active-directory-b2c-create-sign-up-policy](../../includes/active-directory-b2c-create-sign-up-policy.md)]

## Create a sign-in policy

[!INCLUDE [active-directory-b2c-create-sign-in-policy](../../includes/active-directory-b2c-create-sign-in-policy.md)]

## Create a profile editing policy

[!INCLUDE [active-directory-b2c-create-profile-editing-policy](../../includes/active-directory-b2c-create-profile-editing-policy.md)]

## Create a password reset policy

[!INCLUDE [active-directory-b2c-create-password-reset-policy](../../includes/active-directory-b2c-create-password-reset-policy.md)]

## Preview policies

As we release new features, some of these may not be available on existing policies.  We plan to replace older versions with the latest of the same type once these policies enter GA.  Your existing policies will not change and in order to take advantage of these new features you will have to create new policies.

## Frequently asked questions

### How do I link a sign-up or sign-in policy with a password reset policy?
When you create a **sign-up or sign-in** policy (with local accounts), you see a **Forgot password?** link on the first page of the experience. Clicking this link doesn't automatically trigger a password reset policy. 

Instead, the error code **`AADB2C90118`** is returned to your app. Your app needs to handle this error code by invoking a specific password reset policy. For more information, see a [sample that demonstrates the approach of linking policies](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-DotNet-SUSI).

### Should I use a sign-up or sign-in policy or a sign-up policy and a sign-in policy?
We recommend that you use a **sign-up or sign-in** policy over a **sign-up** policy and a **sign-in** policy.  

The **sign-up or sign-in** policy has more capabilities than the **sign-in** policy. It also enables you to use page UI customization and has better support for localization. 

The **sign-in** policy is recommended if you don't need to localize your policies, only need minor customization capabilities for branding, and want password reset built into it.

## Next steps
* [Token, session, and single sign-on configuration](active-directory-b2c-token-session-sso.md)
* [Disable email verification during consumer sign-up](active-directory-b2c-reference-disable-ev.md)

