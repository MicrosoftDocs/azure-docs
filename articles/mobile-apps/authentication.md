---
title: Authentication
description: Learn how to set up user authentication in mobile apps
author: elamalani

ms.assetid: 34a8a070-2222-4faf-9090-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 08/27/2019
ms.author: emalani
---

# Authenticate users and manage user identities for securing data

Having a view of the user and their behavior across your app empowers developers to better engage users by creating tailored experiences for them. Whether you are an app developer building a collaboration app for users inside your organization or the next social network platform, you will need a way to authenticate users and manage user identities. Using an identity management service is one of the most important features of a mobile backend service as it helps your users to get securely signed into your apps.

## Azure Services

1. ### **Visual Studio App Center**
   [App Center Auth](https://docs.microsoft.com/en-us/appcenter/auth/) is a cloud-based identity management service that enables developers to authenticate users and manage user identities. App Center Auth also integrates with other parts of App Center, enabling developers to leverage user identity to [view user data](https://docs.microsoft.com/en-us/appcenter/data/index) in other services and even [send push notifications to users instead of individual devices](https://docs.microsoft.com/en-us/appcenter/push/push-to-user#app-center-auth-set-identity). 

    **Key Features**
    - **Powered by Azure Active Directory B2C(Azure AD B2C)** which is an enterprise-grade, highly available, and secure global service.
    - **Bring your own Identity** and use other popular identity and access management providers such as Auth0 and Firebase.
    - **AAD Support** with the ability to connect exisitng AAD tenants to enable authenticating against a corporate domain and managing access to sensitive data.
    - **Simple user experience** and magical SDK experience by wrapping MSAL library with App Center SDK.
    - **Platform Support** - iOS, Android, Xamarin, React Native.

    **References**
    - [App Center Portal](https://appcenter.ms) 
    - [Get started with App Center Auth](https://docs.microsoft.com/en-us/appcenter/auth/)

2. ### **Azure Active Directory B2C**
   [Azure Active Directory (Azure AD) B2C](https://azure.microsoft.com/en-us/services/active-directory-b2c/) is a business-to-consumer identity management service that enables developers to authenticate their customers. This white-label service let developers customize and control how users securely interact with their web, desktop, mobile, or single-page applications. Using Azure AD B2C, users can sign up, sign in, reset passwords, and edit profiles. Azure AD B2C implements a form of the OpenID Connect and OAuth 2.0 protocols. 

    **Key Features**
    - Securely autheticate customers with their preferred identity provider.
    - **Customer identity and access management**.
    - Connect to your user accounts using **industry standard protocols** such as OpenID Connect or SAML to make identity management possible on a variety of platforms.
    - Provide branded registration and login experiences.
    - Easily integrate with CRM databases, marketing analytics tools, and account verification systems. 
    - Capture login, preference, and conversion data for customers.

    **References**
    - [Azure Portal](https://portal.azure.com/)
    - [Azure AD B2C documentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/)
    - [Quickstarts](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-quickstarts-web-app)
    - [Samples](https://docs.microsoft.com/en-us/azure/active-directory-b2c/code-samples)

3. ### **Azure Active Directory**
    [Azure Active Directory (Azure AD)](https://azure.microsoft.com/en-us/services/active-directory/) is Microsoft’s cloud-based identity and access management service, which helps your employee sign in and access resources in:
    - External resources, such as Microsoft Office 365, the Azure portal, and thousands of other SaaS applications.
    - Internal resources, such as apps on your corporate network and intranet, along with any cloud apps developed by your own organization.

    **Key Features**
    - **Seamless, highly secure access** by connecting users to the app they need.
    - **Comprehensive identity protection** and enhanced security for identities and access based on user, location, device, data, and app context.
    - **Thousands of pre-integrated apps** both commericial and custom apps like Office 365, Salesforce.com, Box etc.
    - **Manage access at scale**
        
    **References**
    - [Azure Portal](https://portal.azure.com/)
    - [What is Azure AD?](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis)
    - [Get started with Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-whatis)
    - [Quickstarts](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)