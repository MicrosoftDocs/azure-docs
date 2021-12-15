---
title: Secure identity in line-of-business applications using Zero Trust principles
titleSuffix: Microsoft identity platform
description: Learn our recommended approach for securing identity in the line of business applications you develop using a Zero Trust approach.
services: active-directory
author: knicholasa
manager: martincoetzer

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/09/2021
ms.custom: template-concept
ms.author: nichola
ms.reviewer: cchiedo, kylemar, stsoneff

# Customer intent: I am a technical decision maker (dev or IT pro) creating or maintaining a server-side line-of-business app. I want architecture-level recommendations on how I can protect my server-side line-of-business apps using a Zero Trust strategy for Identity
---

# Secure identity in line-of-business application using Zero Trust principles

Zero Trust is a framework for organizational security designed to support modern work scenarios like remote collaboration and working from home. App developers should support Zero Trust principles for a couple reasons. First, developers should adopt security best practices that are designed for the modern environments. Second, customers will expect a secure solution that follows the Zero Trust principles they use to secure their organization. This guidance explains how app developers can implement a Zero Trust strategy for managing identity in line-of-business apps.

Line-of-business apps are defined here as applications used by employees as part of their day-to-day work that are developed by or specifically for the organization. These applications were traditionally accessed from inside a secure corporate network. Now, employees increasingly access them from remote networks and their own devices. To support this new paradigm, apps should be accessible from the internet and not just from inside a corporate network.

The guidance is structured around the key principles of Zero Trust: verify explicitly, use least-privileged access, and assume breach.

## Verify explicitly

A secure identity solution means that an app only provides access to authenticated users. Most developers are not identity experts. So it is important that you find a solution that makes it easy for you or your team to implement secure modern authentication. You can use one of the following solutions.

- For a new application, use a cloud-hosted solution that handles authentication for you.
- To update the security of an existing application, either use a Zero Trust network access (ZTNA) solution that uses modern authentication, or implement authentication using the Microsoft Authentication Library (MSAL) and use Azure Active Directory as your identity provider.

These solutions are explained in more detail below.

### Cloud-hosted solution

Using a cloud hosted solution can provide modern authentication without needing to implement any lines of code. For example, [Microsoft 365](/microsoft-365/enterprise/about-microsoft-365-identity), Dynamics 365 and [Power Apps](/powerapps/maker/portals/configure/use-simplified-authentication-configuration) allow you to secure access with Azure Active Directory – giving you single sign-on and multifactor authentication for free.

If you are building your own application, Azure App Service has [built in authentication and authorization](/azure/app-service/overview-authentication-authorization) that will protect your application without needing to use any particular language, SDK, or even code.

We recommend this approach because it is easy and leaves the least room for error. For example, if you use Azure App Service to host your app you can focus on implementing the business logic of the app. [Registration with Azure Active Directory](/azure/app-service/configure-authentication-provider-aad) can be done automatically. However, you do have the flexibility to customize the authentication logic and choose an alternative identity provider if you want.

### Zero Trust network access solution

Zero Trust network access solutions provide secure remote access to individual on-premises applications. Azure AD works with partners to enable scalable Zero Trust network access that supports various authentication protocols. You can find a list of partners and integrations on the [secure hybrid access docs page](/azure/active-directory/manage-apps/secure-hybrid-access).

[Azure AD Application Proxy](/azure/active-directory/app-proxy/application-proxy) is another solution which uses Azure AD to support modern authentication and remote access for on-premises applications that use header-based, Kerberos, SAML, and anonymous authentication. You can use this solution without having to modify your existing apps. With it, users can access the on-premises apps through an external URL or internal application portal. You can enable Azure AD security features and controls such as single sign-on, conditional access, and multifactor authentication.

:::image type="content" source="./media/secure-line-of-business-apps/secure-hybrid-access.png" alt-text="Illustration of Secure Hybrid Access partner integrations and Application Proxy providing access to legacy and on-premises applications after authentication with Azure AD." border="false":::

### Custom built – hosted anywhere

Finally, you can implement secure authentication and authorization in your application using a trusted authentication library and Azure Active Directory. Our [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) is designed to make it easy to implement authentication and authorization – you implement minimal logic in your own app and the library handles the details of authentication for you. Using this approach makes sense if you have already implemented authentication logic in the app and are looking to update it to modern auth.

However, using this approach takes extra care. IT admins will need to work with developers to plan and enable which security features to add. It also requires developers to learn how to implement the features you need, and a library that fits well to your development scenario. Finally, your application can still be discoverable. For example, someone may still be able to access the login page for your application – whereas if you use a Zero Trust network solution can hide the app completely from unauthenticated users.

## Use least privileged access

Any application can potentially be abused by bad actors who pretend to be someone they are not and use the application as an entry point to gain further access into the network. For this reason, it is important to design your application so that it is given the minimal privilege necessary to serve its purpose. By limiting what your app is capable of doing, you reduce the potential blast radius of attacks. This is especially important with line-of-business applications, which often need access to sensitive company information.

To design your application for least privilege access, you can follow our guidance on [enhancing app security with the principle of least privilege](/azure/active-directory/develop/secure-least-privileged-access). The recommendations include revoking unused and reducible permissions, requiring that a human consents to the app's request to access protected data, building applications with least privilege in mind during all stages of development, and auditing your deployed applications periodically to identify over-privileged apps.

## Assume breach

Using the Zero Trust framework, applications are designed so that if a cybersecurity incident does occur, you are able to minimize the blast radius and respond swiftly.

You should make your application auditable by logging authentication behavior. Azure App Service allows you to [enable application logging](/azure/app-service/overview-authentication-authorization#logging-and-tracing), as does [Azure AD Application Proxy](/azure/active-directory/app-proxy/application-proxy-connectors#under-the-hood). MSAL has instructions for how to implement logging for the various languages it supports, like [MSAL.NET](/azure/active-directory/develop/msal-logging-dotnet).

## Next steps

[Zero Trust guidance for identity](/security/zero-trust/develop/identity)
