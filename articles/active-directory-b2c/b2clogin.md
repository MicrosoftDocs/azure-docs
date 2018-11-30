---
title: Set redirect URLs to b2clogin.com for Azure Active Directory B2C | Microsoft Docs
description: Learn about using b2clogin.com in your redirect URLs for Azure Active Directory B2C. 
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: davidmu
ms.component: B2C
---

# Set redirect URLs to b2clogin.com for Azure Active Directory B2C

When you set up an identity provider for sign-up and sign-in in your Azure Active Directory (Azure AD) B2C application, you need to specify a redirect URL. In the past, login.microsoftonline.com was used, now you should be using b2clogin.com.

Using b2clogin.com gives you additional benefits, such as:

- Cookies are no longer shared with the other Microsoft services.
- Your URLs no longer include a reference to Microsoft. For example, `https://your-tenant-name.b2clogin.com/tfp/your-tenant-ID/policyname/v2.0/.well-known/openid-configuration`.

Consider these settings that might need to change when using b2clogin.com:

- Set the redirect URLs in your identity provider applications to use b2clogin.com. 
- Set your Azure AD B2C application to use b2clogin.com for user flow references and token endpoints. 
- If you are using MSAL, you need to set the **ValidateAuthority** property to `false`.
- Make sure that you change any **Allowed Origins** that you have defined in the CORS settings for [user-interface customization](active-directory-b2c-ui-customization-custom-dynamic.md).  

## Change redirect URLs

To use b2clogin.com, in the settings for your identity provider application, look for and change the list of trusted URLs to redirect back to Azure AD B2C.  Currently, you probably have it set up to redirect back to some login.microsoftonline.com site. 

You'll need to change the redirect URL so that `your-tenant-name.b2clogin.com` is authorized. Make sure to replace `your-tenant-name` with the name of your Azure AD B2C tenant and remove `/te` if it exists in the URL. There are slight variations to this URL for each identity provider so check the corresponding page to get the exact URL.

You can find set-up information for identity providers in the following articles:

- [Microsoft account](active-directory-b2c-setup-msa-app.md)
- [Facebook](active-directory-b2c-setup-fb-app.md)
- [Google](active-directory-b2c-setup-goog-app.md)
- [Amazon](active-directory-b2c-setup-amzn-app.md)
- [LinkedIn](active-directory-b2c-setup-li-app.md)
- [Twitter](active-directory-b2c-setup-twitter-app.md)
- [GitHub](active-directory-b2c-setup-github-app.md)
- [Weibo](active-directory-b2c-setup-weibo-app.md)
- [QQ](active-directory-b2c-setup-qq-app.md)
- [WeChat](active-directory-b2c-setup-wechat-app.md)
- [Azure AD](active-directory-b2c-setup-oidc-azure-active-directory.md)
- [Custom OIDC](active-directory-b2c-setup-oidc-idp.md)

## Update your application

Your Azure AD B2C application probably refers to `login.microsoftonline.com` in several places, such as your user flow references and token endpoints.  Make sure that your authorization endpoint, token endpoint, and issuer have been updated to use `your-tenant-name.b2clogin.com`.  

## Set the ValidateAuthority property

If you're using MSAL, set the **ValidateAuthority** to `false`. The following example shows how you might set the property:

In [MSAL for .Net](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet):

```CSharp
 ConfidentialClientApplication client = new ConfidentialClientApplication(...); // can also be PublicClientApplication
 client.ValidateAuthority = false;
```

And in [MSAL for Javascript](https://github.com/AzureAD/microsoft-authentication-library-for-js):

```Javascript
this.clientApplication = new UserAgentApplication(
  env.auth.clientId,
  env.auth.loginAuthority,
  this.authCallback.bind(this),
  {
    validateAuthority: false
  }
);
```
