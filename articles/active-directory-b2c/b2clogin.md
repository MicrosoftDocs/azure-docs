---
title: Using b2clogin.com | Microsoft Docs
description: Learn about using b2clogin.com instead of login.microsoftonline.com. 
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/29/2018
ms.author: davidmu
ms.component: B2C
---

# Using B2Clogin.com

Going forward, we're encouraging all customers to use `<YourDirectoryName>.b2clogin.com` and we'll be deprecating `login.microsoftonline.com`. B2Clogin.com gives you additional benefits such as:
* You no longer share the same cookie with the other Microsoft services.
* You can remove all references to Microsoft in your URL (you can replace `<YourDirectoryName>.onmicrosoft.com` with your directory ID). For example: `https://<YourDirectoryName>.b2clogin.com/tfp/<YourDirectoryID>/<policyname>/v2.0/.well-known/openid-configuration`.

Here's what you need to do to migrate over to b2clogin.com

* Change the redirect URIs for your social identity provider apps
* Edit your application to use B2Clogin.com instead of `login.microsoftonline.com` for policy references and token endpoints.
* If you're using MSAL, you need to set `ValidateAuthority=false`.  

##Redirect URIs for social identity providers

If you have social account identity providers set up in your directory you'll need to make modifications in their applications.  There is a parameter for the application for with each social provider that contains a list of trusted URLs to redirect back to Azure AD B2C.  Currently, you probably have it set up to redirect back to some `login.microsoftonline.com` site, you'll need to change this URL so that `YourDirectoryName.b2clogin.com` will be an authorized redirect URI.  Make sure to remove the `/te` as well.  There are slight variations to this URL for each identity provider so check the corresponding page to get the exact URL.  

| Identity provider |
|-------------------|
|[Microsoft account](active-directory-b2c-setup-msa-app.md)|
|[Facebook](active-directory-b2c-setup-fb-app.md)|
|[Google](active-directory-b2c-setup-goog-app.md)|
|[Amazon](active-directory-b2c-setup-amzn-app.md)|
|[LinkedIn](active-directory-b2c-setup-li-app.md)|
|[Twitter](active-directory-b2c-setup-twitter-app.md)|
|[GitHub](active-directory-b2c-setup-github-app.md)|
|[Weibo](active-directory-b2c-setup-weibo-app.md)|
|[QQ](active-directory-b2c-setup-qq-app.md)|
|[WeChat](active-directory-b2c-setup-wechat-app.md)|
|[Azure AD](active-directory-b2c-setup-oidc-azure-active-directory.md)|
|[Custom OIDC](active-directory-b2c-setup-oidc-idp.md)|

##Update your application references

Your application probably refers to `login.microsoftonline.com` in several places, such as your policy references and token endpoints.  Make sure that your authorization endpoint, token endpoint, and issuer have been updated.  

##Set `ValidateAuthority=false` in MSAL

If you're using MSAL, you'll need to set `ValidateAuthority=false`.  For more information, see [this documentation](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.clientapplicationbase?view=azure-dotnet).