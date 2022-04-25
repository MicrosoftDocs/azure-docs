---
title: Govern access for critical applications in your environment| Microsoft Docs
description: Azure Active Directory Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility.  These features can be used for your existing business critical third party on-premises and cloud-based applications.
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
ms.date: 4/22/2022
ms.author: ajburnle
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Govern access for critical applications in your environment

> [!div class="step-by-step"]
> [Define policies »](identity-governance-critical-applications-define.md)

Azure Active Directory (Azure AD) Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility. It provides you with capabilities to ensure that the right people have the right access to the right resources.

Organizations with compliance requirements or risk management plans will have sensitive or business-critical applications. The application sensitivity may be based on its purpose or the data it contains, such as financial information or personal information of the organization's customers. For those applications, only a subset of all the users in the organization will typically be authorized to have access, and access should only be permitted based on documented business requirements.  As part of your organization's controls for managing access, you can use Azure AD features to

* set up appropriate access,
* enforce access checks, and
* produce reports to demonstrate how those controls are being used to meet your compliance and risk management objectives.

In addition to application access governance scenario, identity governance and the other Azure AD features can also be used for other scenarios, such as [reviewing and removing users from other organizations](../governance/access-reviews-external-users.md) or [managing users who are excluded from Conditional Access policies](../governance/conditional-access-exclusion.md).

<!-- TODO guidance for apps that use Graph? -->
<!-- TODO guidance for in-house apps -->

## Getting started with governing access to an application

Azure AD identity governance can be integrated with any application, using [standards](../fundamentals/auth-sync-overview.md) such as OpenID Connect, SAML, SCIM, SQL and LDAP.  Through these standards, Azure AD can be used with many popular SaaS applications, as well as on-premises applications, and applications which your organization has developed.  This three step deployment plan covers how to connect your application to Azure AD and enable identity governance features to be used for that application.

1. [Define policies for access to the application](identity-governance-critical-applications-define.md)
1. [Integrate the application with Azure AD to ensure only authorized users cannot access the application, and review user's existing access to the application to set a baseline of all users having been reviewed](identity-governance-critical-applications-integrate.md)
1. [Deploy policies for automating access assignments and monitoring to adjust those policies and access as needed](identity-governance-critical-applications-deploy.md)

## Validate your Azure AD environment is prepared for integrating with the application

Before you begin, you will need to validate your Azure AD environment is prepared for integrating with the application.

<!-- TODO: do you have the data in your AAD? Might need to sync more users attributes -->
<!-- TODO: link to standards and fundamentals for security and compliance -->

1. First, check whether Azure AD is already sending its audit log to an Azure Monitor deployed in one of your organization's Azure subscriptions. If not, then you should [Configure Azure AD to use Azure Monitor](../governance/entitlement-management-logs-and-reporting.md) for retention of its audit log.  Azure AD stores audit events for up to 30 days in the audit log. However, you can keep the audit data for longer than the default retention period, outlined in [How long does Azure AD store reporting data?](../reports-monitoring/reference-reports-data-retention.md), by using Azure Monitor. You can then use Azure Monitor workbooks and custom queries and reports across current and historical audit data.

1. Reduce the number of users in highly privileged administrative roles in your Azure AD tenant. Administrators in the `Global Administrator`, `Identity Governance Administrator`, `User Administrator`, `Application Administrator`, `Cloud Application Administrator` and `Privileged Role Administrator` can make changes to users and their application role assignments.  If the memberships of those roles have not yet been recently reviewed, you should ensure that [access review of these directory roles](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md) are started.

> [!div class="step-by-step"]
> [Define policies »](identity-governance-critical-applications-define.md)
