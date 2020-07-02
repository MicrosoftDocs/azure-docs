---
title: Managing Applications with Azure Active Directory | Microsoft Docs
description: An overview of using Azure Active Directory (AD) as an Identity and Authorization Management (IAM) system for your cloud and on-premises applications.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: overview
ms.workload: identity
ms.date: 07/01/2020
ms.author: kenwith
ms.reviewer: arvinh
ms.collection: M365-identity-device-management
#Customer intent: As an IT manager, I want to understand what application management is in Azure AD so that I can determine if I want to integrate apps with it.
---

# What is application management?

Azure AD is an Identity and Authorization Management (IAM) system. It provides a single place to store information about digital identities. You can configure your software applications to use Azure AD as the place where user information is stored. 

Azure AD must be configured to integrate with an application. In other words, it needs to know what applications are using it as an identity system. The process of keeping Azure AD aware of these applications, and how it should handle them, is known as application management.

You manage applications on the **Enterprise applications** blade located in the Manage section of the Azure Active Directory portal.

![The Enterprise applications option under the Manage section of the Azure AD portal.](media/what-is-application-management/enterprise-applications-in-nav.png)

## What is an Identity and Authorization Management (IAM) system?
An application is a piece of software that is used for some purpose. Most applications require users to sign in so that the application can provide a tailored experience for that particular user. In other words, the application needs to know the identity of the user using the application. Because it knows what functionality to offer, or remove, for the user.

If each application kept track of users separately then the result would be a silo of different usernames and logins for every application. One application wouldn't know anything about the users in other applications.

A centralized identity system solves this problem by providing a single place to store user information that can then be used by all applications. These systems have come to be known as Identity and Authorization Management (IAM) systems. Azure Active AD is the IAM system for the Microsoft cloud.

>[!TIP]
>An IAM system provides a single place to keep track of user identities. Azure AD is the IAM system for the Microsoft cloud.


## Why manage applications with a cloud solution?

Organizations often have hundreds of applications that users depend on to get their work done. Users access these applications from many devices and locations. New applications are added, developed, and sunset every day. With so many applications and access points, it's more critical than ever to use a cloud-based solution to manage user access to all applications.

>[!TIP]
>The Azure AD app gallery contains many popular applications that are already pre-configured to work with Azure AD as an identity provider.

## How does Azure AD work with applications?

Azure AD simplifies the way you manage your applications by providing a single identity system for your cloud and on-premises apps. You can add your software as a service (SaaS) applications, on-premises applications, and line of business (LOB) apps to Azure AD. Then users sign in once to securely and seamlessly access these applications, along with Office 365 and other business applications from Microsoft. You can reduce administrative costs by [automating user provisioning](../app-provisioning/user-provisioning.md). You can also use multi-factor authentication and Conditional Access policies to provide secure application access.

![Diagram that shows apps federated via Azure AD](media/what-is-application-management/app-management-overview.png)

## What types of applications can I integrate with Azure AD?

There are four main types of applications that you can add to your **Enterprise applications** and manage with Azure AD:

- **Azure AD Gallery applications** – Azure AD has a gallery that contains thousands of applications that have been pre-integrated for single sign-on with Azure AD. Some of the applications your organization uses are probably in the gallery. [Learn about planning your app integration](plan-an-application-integration.md), or get detailed integration steps for individual apps in the [SaaS application tutorials](https://docs.microsoft.com/azure/active-directory/saas-apps/).

- **On-premises applications with Application Proxy** – With Azure AD Application Proxy, you can integrate your on-premises web apps with Azure AD to support single sign-on. Then end users can access your on-premises web apps in the same way they access Office 365 and other SaaS apps, see [Provide remote access to on-premises applications through Azure AD's Application Proxy](application-proxy.md).

- **Custom-developed applications** – When building your own line-of-business applications, you can integrate them with Azure AD to support single sign-on. By registering your application with Azure AD, you have control over the authentication policy for the application. For more information, see [guidance for developers](developer-guidance-for-integrating-applications.md).

- **Non-Gallery applications** – Bring your own applications! Support single sign-on for other apps by adding them to Azure AD. There are multiple ways to integrate an application, some of these are listed below. For more information, see [Configure single sign-on for non-gallery apps](configure-single-sign-on-non-gallery-applications.md).

>[!TIP]
>You can integrate Azure AD with an application even if it is not already pre-configured and in the app gallery. You can **integrate Azure AD with any** of the following
> - Any web link, or application, that renders a **username and password field**.
> - Any application that supports **SAML or OpenID Connect protocols**.
> - Any application that supports the **System for Cross-domain Identity Management (SCIM)** standard.

## Manage risk with Conditional Access policies

Coupling Azure AD single sign-on (SSO) with [Conditional Access](../conditional-access/concept-conditional-access-cloud-apps.md) provides high levels of security for accessing applications. Security capabilities include cloud-scale identity protection, risk-based access control, native multi-factor authentication, and Conditional Access policies. These capabilities allow for granular control policies based on applications, or on groups that need higher levels of security.

## Improve productivity with single sign-on

Enabling single sign-on (SSO) across applications and Office 365 provides a superior sign-in experience for existing users by reducing or eliminating sign-in prompts. The user’s environment feels more cohesive and is less distracting without multiple prompts, or the need to manage multiple passwords. The business group can manage and approve access through self-service and dynamic membership. Allowing the right people in the business to manage access to an application improves the security of the identity system.

SSO improves security. *Without single sign-on*, administrators need to create and update user accounts for each individual application, which takes time. Also, users have to track multiple credentials to access their applications. As a result, users tend to write down their passwords or use other password management solutions, which introduce data security risks. [Read more about single sign-on](what-is-single-sign-on.md).

## Address governance and compliance

With Azure AD, you can monitor application sign-ins through reports that leverage Security Incident and Event Monitoring (SIEM) tools. You can access the reports from the portal, or from APIs. Programmatically audit who has access to your applications, and remove access to inactive users via access reviews.

## Manage costs

By migrating to Azure AD, you can save costs and remove the hassle of managing your on-premises infrastructure. Azure AD also provides self-service access to applications, which saves time for both administrators and users. Single sign-on eliminates application-specific passwords. This ability to sign on once saves costs related to password reset for applications, and lost productivity while retrieving passwords.

For Human Resources focused applications, or other applications with a large set of users, you can leverage App provisioning to automate the process of provisioning and deprovisioning users, see [What is application provisioning?](../app-provisioning/user-provisioning.md).

## Next steps

- [View applications already configured in your Azure AD tenant](view-applications-portal.md)
- [Quickstart: Add a gallery application to your Azure AD tenant](add-application-portal.md)
- [Add a gallery app to your Azure AD organization](add-gallery-app.md)
- [Get started with application integration](plan-an-application-integration.md)
- [Learn how to automate provisioning](../app-provisioning/user-provisioning.md)