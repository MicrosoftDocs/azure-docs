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
> [Define policies for access to an application »](identity-governance-critical-applications-define.md)

Azure Active Directory (Azure AD) Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility. It provides you with capabilities to ensure that the right people have the right access to the right resources.

Organizations with compliance requirements or risk management plans will have sensitive or business-critical applications. The application sensitivity may be based on its purpose or the data it contains, such as financial information or personal information of the organization's customers. For those applications, only a subset of all the users in the organization will typically be authorized to have access, and access should only be permitted based on documented business requirements.  As part of your organization's controls for managing access, you can use Azure AD features to

* set up appropriate access,
* enforce access checks, and
* produce reports to demonstrate how those controls are being used to meet your compliance and risk management objectives.

In addition to application access governance scenario, identity governance and the other Azure AD features can also be used for other scenarios, such as [reviewing and removing users from other organizations](../governance/access-reviews-external-users.md) or [managing users who are excluded from Conditional Access policies](../governance/conditional-access-exclusion.md).  If your organization has multiple administrators in Azure AD or Azure, uses B2B or self-service group management, then you should [plan an access reviews deployment](deploy-access-reviews.md) for those scenarios.

## Getting started with governing access to an application

Azure AD identity governance can be integrated with many applications, using [standards](../fundamentals/auth-sync-overview.md) such as OpenID Connect, SAML, SCIM, SQL and LDAP.  Through these standards, Azure AD can be used with many popular SaaS applications, as well as on-premises applications, and applications which your organization has developed.  This three step deployment plan covers how to connect your application to Azure AD and enable identity governance features to be used for that application.

1. [Define policies for access to the application](identity-governance-critical-applications-define.md)
1. [Integrate the application with Azure AD to ensure only authorized users cannot access the application, and review user's existing access to the application to set a baseline of all users having been reviewed](identity-governance-critical-applications-integrate.md)
1. [Deploy policies for automating access assignments and monitoring to adjust those policies and access as needed](identity-governance-critical-applications-deploy.md)

## Prerequisite: validate your Azure AD environment is prepared for integrating with the application

Before you begin the process of governing application access from Azure AD, you will need to validate your Azure AD environment is prepared for integrating with those applications.

1. Ensure your Azure AD and Microsoft Online Services environment is ready for the [compliance requirements](../standards/standards-overview.md) for that application.  Compliance is a shared responsibility among Microsoft, cloud service providers (CSPs), and organizations.

1. To use Azure AD to govern access to applications, you must have one of the following licenses in your tenant:

   * Azure AD Premium P2
   * Enterprise Mobility + Security (EMS) E5 license

   You will need to have at least as many licenses as the number of member (non-guest) users who have or can request access to the application.

1. Use of Azure Monitor requires an Azure subscription linked to the Azure AD tenant.

1. Check whether Azure AD is already sending its audit log to Azure Monitor. You can see this by visiting the Azure portal, selecting Azure Active Directory, and selecting *Workbooks* from the left. If this integration not configured, then you should [configure Azure AD to use Azure Monitor](../governance/entitlement-management-logs-and-reporting.md). To deploy this, you'll need a user who is in the `Global Administrator` or `Security Administrator` roles for the Azure AD tenant, and has the ability to create resources in one of your organization's Azure subscriptions.  For background, Azure AD stores audit events for up to 30 days in the audit log. However, you can keep the audit data for longer than the default retention period, outlined in [How long does Azure AD store reporting data?](../reports-monitoring/reference-reports-data-retention.md), by using Azure Monitor to retain a copy of the events for longer, up to 2 years or an earlier cutoff period. You can then use Azure Monitor workbooks and custom queries and reports across current and historical audit data.

1. Reduce the number of users in highly privileged administrative roles in your Azure AD tenant. Administrators in the `Global Administrator`, `Identity Governance Administrator`, `User Administrator`, `Application Administrator`, `Cloud Application Administrator` and `Privileged Role Administrator` can make changes to users and their application role assignments.  If the memberships of those roles have not yet been recently reviewed, you will need a user who is in the `Global Administrator` or `Privileged Role Administrator` to ensure that [access review of these directory roles](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md) are started.  You will also want to ensure that users in Azure roles in subscriptions which hold the Azure Monitor and other resources needed by your Azure AD configuration have also been reviewed.

1. If your organization is also using Active Directory on-premises, and has connected AD to Azure AD, then check that you have [configure your systems to protect your Microsoft 365 cloud environment from on-premises compromise](../fundamentals/protect-m365-from-on-premises-attacks.md).

## Next steps

> [!div class="step-by-step"]
> [Define policies for access to an application »](identity-governance-critical-applications-define.md)
