---
title: How to Integrate with Azure Active Directory | Microsoft Docs
description: A guide to benefits of and resources for integration with Azure Active Directory.
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: d13bba54-96bd-4b81-bee9-c8025ffa1648
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/27/2017
ms.author: celested
ms.reviewer: bryanla
ms.custom: aaddev
---

# Integrating with Azure Active Directory

[!INCLUDE [active-directory-devguide](../../../includes/active-directory-devguide.md)]

Azure Active Directory provides organizations with enterprise-grade identity management for cloud applications. Azure AD integration gives your users a streamlined sign-in experience, and helps your application conform to IT policy.

## How To Integrate
There are several ways for your application to integrate with Azure AD. Take advantage of as many or as few of these scenarios as is appropriate for your application.

### Support Azure AD as a Way to Sign In to Your Application
**Reduce sign in friction and reduce support costs.** By using Azure AD to sign in to your application, your users won't have one more name and password to remember. As a developer, you'll have one less password to store and protect. Not having to handle forgotten password resets may be a significant savings alone. Azure AD powers sign in for some of the world's most popular cloud applications, including Office 365 and Microsoft Azure. With hundreds of millions users from millions of organizations, chances are your user is already signed in to Azure AD. Learn more about [adding support for Azure AD sign in](authentication-scenarios.md).

**Simplify sign up for your application.**  During sign up for your application, Azure AD can send essential information about a user so that you can pre-fill your sign up form or eliminate it completely. Users can sign up for your application using their Azure AD account via a familiar consent experience similar to those found in social media and mobile applications. Any user can sign up and sign in to an application that is integrated with Azure AD without requiring IT involvement. Learn more about [signing-up your application for Azure AD Account login](../../app-service/app-service-mobile-how-to-configure-active-directory-authentication.md).

### Browse for Users, Manage User Provisioning, and Control Access to Your Application
**Browse for users in the directory.**  Use the Graph API to help users search and browse for other people in their organization when inviting others or granting access, instead of requiring them to type email addresses. Users can browse using a familiar address book style interface, including viewing the details of the organizational hierarchy. Learn more about the [Graph API](active-directory-graph-api.md).

**Re-use Active Directory groups and distribution lists your customer is already managing.**  Azure AD contains the groups that your customer is already using for email distribution and managing access. Using the Graph API, re-use these groups instead of requiring your customer to create and manage a separate set of groups in your application. Group information can also be sent to your application in sign in tokens. Learn more about the [Graph API](active-directory-graph-api.md).

**Use Azure AD to control who has access to your application.**  Administrators and application owners in Azure AD can assign access to applications to specific users and groups. Using the Graph API, you can read this list and use it to control provisioning and de-provisioning of resources and access within your application.

**Use Azure AD for Roles Based Access Control.**  Administrators and application owners can assign users and groups to roles that you define when you register your application in Azure AD. Role information is sent to your application in sign in tokens and can also be read using the Graph API. Learn more about [using Azure AD for authorization](https://cloudblogs.microsoft.com/enterprisemobility/2014/12/18/azure-active-directory-now-with-group-claims-and-application-roles/).

### Get Access to User's Profile, Calendar, Email, Contacts, Files, and More
**Azure AD is the authorization server for Office 365 and other Microsoft business services.**  If you support Azure AD for sign in to your application or support linking your current user accounts to Azure AD user accounts using OAuth 2.0, you can request read and write access to a user's profile, calendar, email, contacts, files, and other information. You can seamlessly write events to user's calendar, and read or write files to their OneDrive. Learn more about [accessing the Office 365 APIs](https://msdn.microsoft.com/office/office365/howto/platform-development-overview).

### Promote Your Application in the Azure and Office 365 Marketplaces
**Promote your application to the millions of organizations who are already using Azure AD.**  Users who search and browse these marketplaces are already using one or more cloud services, making them qualified cloud service customers. Learn more about promoting your application in [the Azure Marketplace](https://azure.microsoft.com/marketplace/partner-program/).

**When users sign up for your application, it will appear in their Azure AD access panel and Office 365 app launcher.**  Users will be able to quickly and easily return to your application later, improving user engagement. Learn more about the [Azure AD access panel](../user-help/active-directory-saas-access-panel-introduction.md).

### Secure Device-to-Service and Service-to-Service Communication
**Using Azure AD for identity management of services and devices reduces the code you need to write and enables IT to manage access.**  Services and devices can get tokens from Azure AD using OAuth and use those tokens to access web APIs. Using Azure AD you can avoid writing complex authentication code. Since the identities of the services and devices are stored in Azure AD, IT can manage keys and revocation in one place instead of having to do this separately in your application.

## Benefits of Integration
Integration with Azure AD comes with benefits that do not require you to write additional code.

### Integration with Enterprise Identity Management
**Help your application comply with IT policies.**  Organizations integrate their enterprise identity management systems with Azure AD, so when a person leaves an organization, they will automatically lose access to your application without IT needing to take extra steps. IT can manage who can access your application and determine what access policies are required - for example multi-factor authentication - reducing your need to write code to comply with complex corporate policies. Azure AD provides administrators with a detailed audit log of who signed in to your application so IT can track usage.

**Azure AD extends Active Directory to the cloud so that your application can integrate with AD.**  Many organizations around the world use Active Directory as their principal sign-in and identity management system, and require their applications to work with AD. Integrating with Azure AD integrates your app with Active Directory.

### Advanced Security Features
**Multi-factor authentication.**  Azure AD provides native multi-factor authentication. IT administrators can require multi-factor authentication to access your application, so that you do not have to code this support yourself. Learn more about [Multi-Factor Authentication](https://azure.microsoft.com/documentation/services/multi-factor-authentication/).

**Anomalous sign in detection.**  Azure AD processes more than a billion sign-ins a day, while using machine learning algorithms to detect suspicious activity and notify IT administrators of possible problems. By supporting Azure AD sign-in, your application gets the benefit of this protection. Learn more about [viewing Azure Active Directory access report](../active-directory-view-access-usage-reports.md).

**Conditional access.**  In addition to multi-factor authentication, administrators can require specific conditions be met before users can sign-in to your application. Conditions that can be set include the IP address range of client devices, membership in specified groups, and the state of the device being used for access. Learn more about [Azure Active Directory conditional access](../active-directory-conditional-access-azure-portal.md).

### Easy Development
**Industry standard protocols.**  Microsoft is committed to supporting industry standards. Azure AD supports the SAML 2.0, OpenID Connect 1.0, OAuth 2.0, and WS-Federation 1.2 authentication protocols. The Graph API is OData 4.0 compliant. If your application already supports the SAML 2.0 or OpenID Connect 1.0 protocols for federated sign in, adding support for Azure AD can be straightforward. Learn more about [Azure AD supported authentication protocols](active-directory-authentication-protocols.md).

**Open source libraries.**  Microsoft provides fully supported open source libraries for popular languages and platforms to speed development. The source code is licensed under Apache 2.0, and you are free to fork and contribute back to the projects. Learn more about [Azure AD authentication libraries](active-directory-authentication-libraries.md).

### Worldwide Presence and High Availability
**Azure AD is deployed in datacenters around the world and is managed and monitored around the clock.**  Azure AD is the identity management system for Microsoft Azure and Office 365 and is deployed in 28 datacenters around the world. Directory data is guaranteed to be replicated to at least three datacenters. Global load balancers ensure users access the closest copy of Azure AD containing their data, and automatically re-route requests to other datacenters if a problem is detected.

## Next Steps
[Get started writing code](azure-ad-developers-guide.md#get-started).

[Sign Users In Using Azure AD](authentication-scenarios.md)

