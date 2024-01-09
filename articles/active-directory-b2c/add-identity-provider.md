---
title: Add an identity provider - Azure Active Directory B2C  
description: Learn how to add an identity provider to your Active Directory B2C tenant.

author: garrodonnell
manager: CelesteDG

ms.author: godonnell
ms.date: 02/08/2023
ms.custom: mvc
ms.topic: how-to
ms.service: active-directory
ms.subservice: B2C
---

# Add an identity provider to your Azure Active Directory B2C tenant

You can configure Azure AD B2C to allow users to sign in to your application with credentials from external social or enterprise identity providers (IdP). Azure AD B2C supports external identity providers like Facebook, Microsoft account, Google, Twitter, and any identity provider that supports OAuth 1.0, OAuth 2.0, OpenID Connect, and SAML protocols.

With external identity provider federation, you can offer your consumers the ability to sign in with their existing social or enterprise accounts, without having to create a new account just for your application.

On the sign-up or sign-in page, Azure AD B2C presents a list of external identity providers the user can choose for sign-in. Once a user selects an external identity provider, they're redirected to the selected provider's website to complete their sign-in. After they successfully sign in, they're returned to Azure AD B2C for authentication with your application.

![Diagram showing mobile sign-in example with a social account (Facebook).](media/add-identity-provider/external-idp.png)

You can add identity providers that are supported by Azure Active Directory B2C (Azure AD B2C) to your [user flows](user-flow-overview.md) using the Azure portal. You can also add identity providers to your [custom policies](user-flow-overview.md).

## Select an identity provider

You typically use only one identity provider in your applications, but you have the option to add more. The how-to articles below show you how to create the identity provider application, add the identity provider to your tenant, and add the identity provider to your user flow or custom policy.

* [AD FS](identity-provider-adfs.md)
* [Amazon](identity-provider-amazon.md)
* [Apple](identity-provider-apple-id.md)
* [Microsoft Entra ID (Single-tenant)](identity-provider-azure-ad-single-tenant.md)
* [Microsoft Entra ID (Multi-tenant)](identity-provider-azure-ad-multi-tenant.md)
* [Azure AD B2C](identity-provider-azure-ad-b2c.md)
* [eBay](identity-provider-ebay.md)
* [Facebook](identity-provider-facebook.md)
* [Generic identity provider](identity-provider-generic-openid-connect.md)
* [GitHub](identity-provider-github.md)
* [ID.me](identity-provider-id-me.md)
* [Google](identity-provider-google.md)
* [LinkedIn](identity-provider-linkedin.md)
* [Microsoft Account](identity-provider-microsoft-account.md)
* [Mobile ID](identity-provider-mobile-id.md)
* [PingOne](identity-provider-ping-one.md) (Ping Identity)
* [QQ](identity-provider-qq.md)
* [Salesforce](identity-provider-salesforce.md)
* [Salesforce (SAML protocol)](identity-provider-salesforce-saml.md)
* [SwissID](identity-provider-swissid.md)
* [Twitter](identity-provider-twitter.md)
* [WeChat](identity-provider-wechat.md)
* [Weibo](identity-provider-weibo.md)
