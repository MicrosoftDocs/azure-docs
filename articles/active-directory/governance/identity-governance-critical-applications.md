---
title: Govern access for critical applications | Microsoft Docs
description: Azure Active Directory Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility.  These features can be used for your existing business critical on-premises and cloud-based applications.
services: active-directory
documentationcenter: ''
author: ajburnle
manager: karenhoran
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 4/11/2022
ms.author: ajburnle
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Govern access for critical applications

Azure Active Directory (Azure AD) Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility. It provides you with capabilities to ensure that the right people have the right access to the right resources.

In most organizations subject to compliance requirements or that have a risk management plan, there will be some applications the organization is using which are particularly sensitive or business-critical. Their sensitivity might be based on the data the application contains, such as financial or personal information, or be due to the mission of the application. For those applications, only a subset of all the users in the organization will typically be authorized to have access, and access should only be permitted based on documented business requirements.  As part of your organization's controls for managing access, you can use Azure AD features to
* set up appropriate access,
* enforce access checks, and
* produce reports to demonstrate how those controls are being used to meet your compliance and risk management objectives.  

Note that identity governance and  other Azure AD features can also be used for other scenarios, such as [reviewing and removing users from other organizations](access-reviews-external-users.md) or [managing users who are excluded from Conditional Access policies](conditional-access-exclusion.md).

## Getting started with governing access to an application

Azure AD identity governance integrates with applications using standards such as OpenID Connect, SAML, SCIM, SQL and LDAP.  Through these interfaces, Azure AD can be used with many popular SaaS applications, as well as on-premises applications, and applications which your organization has developed.  This five step deployment plan covers how to connect your application to Azure AD and enable identity governance features to be used for that application.

1. Establish policies for who should have access
1. Ensure unauthorized users cannot access the application
1. Review existing access to the application
1. Deploy policies for ongoing access assignments
1. Monitor to adjust policies and access as needed

## Establish policies who should have access


## Ensure unauthorized users cannot access the application

(connect your app to Azure AD for federated SSO...)

1. Check if your app is on the enterprise applications or app registrations list ...
1. Check if the app is in the application gallery for federation ...
1. If not in the gallery, ...

 * If the application supports OAuth / OpenID Connect ...
 * If the application supports SAML ...
 * If the application supports Integrated Windows Auth (IWA) with AD DS ...
 * If the application uses header based authentication ...
 * If the application has a local credential, stored in a SQL database or LDAP directory ...

1. Ensure CA policy ...

1. Configure application roles ...


## Review existing access to the application

If this is a new application ...

Otherwise, ...

* If the application uses an Azure AD group, ...
* If the application uses an AD DS group, ...
* If the application uses a SQL database or another LDAP directory, ...


## Deploy policies for ongoing access assignments

Add app (and its underlying resource) to a catalog...

Create an access package per application role...

If SOD...

Create policy for direct assignment...

Create policy for request...


## Monitor to adjust policies and access as needed

Connect to Azure Monitor...

Watch app role assignments not made by EM...

Ensure policies have identified approvers and reviewers...

Schedule recurring reviews...

## Next steps

