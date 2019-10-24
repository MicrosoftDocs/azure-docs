---
title: Add authentication to your mobile apps with Visual Studio App Center and Azure services
description: Learn about the services such as App Center that help set up user authentication and enable mobile applications to authenticate with social accounts, Azure Active Directory, and custom authentication.
author: elamalani
ms.assetid: 34a8a070-2222-4faf-9090-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 10/22/2019
ms.author: emalani
---

# Add authentication and manage user identities in your mobile apps

Having a view of the user and their behavior across your application empowers developers to better engage users by creating tailored experiences for them. Whether you are an application developer building a collaboration application for users inside your organization or are creating the next social network platform, you will need a way to authenticate users and manage user identities. Using an identity management service is one of the most important features of a mobile backend service.

Use the following services to enable user authentication in your mobile apps.

## Visual Studio App Center
[App Center Auth](/appcenter/auth/) is a cloud-based identity management service that enables developers to authenticate users and manage user identities. App Center Auth also integrates with other parts of App Center, enabling developers to leverage user identity to [view user data](/appcenter/data/index) in other services and even [send push notifications to users instead of individual devices](/appcenter/push/push-to-user#app-center-auth-set-identity). 

**Key features**
- **Powered by Azure Active Directory B2C (Azure AD B2C)** 
    - Enterprise-grade.
    - Highly available.
    - Secure and global service.
- **Bring your own Identity** and use other popular identity and access management providers such as Auth0 and Firebase.
- **AAD Support** 
    - Connect existing AAD tenants. 
    - Enable authenticating against a corporate domain.
    - Manage access to sensitive data.
- **Simple user experience** and magical SDK experience by wrapping MSAL library with App Center SDK.
- **Platform Support** - iOS, Android, Xamarin, React Native.

**References**
- [Sign up with App Center](https://appcenter.ms/signup?utm_source=Mobile%20Development%20Docs&utm_medium=Azure&utm_campaign=New%20azure%20docs) 
- [Get started with App Center Auth](/appcenter/auth/)

## Azure Active Directory B2C
[Azure AD B2C](https://azure.microsoft.com/services/active-directory-b2c/) is a business-to-consumer identity management service that enables developers to authenticate their customers. This white-label service let developers customize and control how users securely interact with their web, desktop, mobile, or single-page applications. Using Azure AD B2C, users can sign up, sign in, reset passwords, and edit profiles. Azure AD B2C implements a form of the OpenID Connect and OAuth 2.0 protocols. 

**Key features**
- Securely authenticate customers with their preferred identity provider.
- **Customer identity and access management**.
- Social logins supported such as Facebook, GitHub, Google, LinkedIn, Twitter, WeChat, Weibo.
- Connect to your user accounts using **industry standard protocols** such as OpenID Connect or SAML to make identity management possible on a variety of platforms.
- Provide branded registration and login experiences.
- Easily integrate with CRM databases, marketing analytics tools, and account verification systems.
- Capture login, preference, and conversion data for customers.

**References**
- [Azure portal](https://portal.azure.com/)
- [Azure AD B2C documentation](/azure/active-directory-b2c/)
- [Quickstarts](/azure/active-directory-b2c/active-directory-b2c-quickstarts-web-app)
- [Samples](/azure/active-directory-b2c/code-samples)

## Azure Active Directory
[Azure Active Directory (Azure AD)](https://azure.microsoft.com/services/active-directory/) is Microsoft's cloud-based identity and access management service, which helps your employee sign in and access.
- External resources, such as Microsoft Office 365, the Azure portal, and thousands of other SaaS applications.
- Internal resources, such as apps on your corporate network and intranet, along with any cloud apps developed by your own organization.

**Key features**
- **Seamless, highly secure access** by connecting users to the applications they need.
- **Comprehensive identity protection** and enhanced security for identities and access based on user, location, device, data, and application context.
- **Thousands of pre-integrated apps** both commercial and custom applications such as Office 365, Salesforce.com, and Box.
- **Manage access at scale**.

**References**
- [Azure portal](https://portal.azure.com/)
- [What is Azure AD?](/azure/active-directory/fundamentals/active-directory-whatis)
- [Get started with Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis)
- [Quickstarts](/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)