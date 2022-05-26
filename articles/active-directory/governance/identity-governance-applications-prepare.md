---
title: Govern access for applications in your environment - Azure AD
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
ms.date: 5/12/2022
ms.author: ajburnle
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Govern access for applications in your environment

> [!div class="step-by-step"]
> [Define organizational policies for governing access to an application »](identity-governance-applications-define.md)

Azure Active Directory (Azure AD) Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility. It provides you with capabilities to ensure that the right people have the right access to the right resources.

Organizations with compliance requirements or risk management plans will have sensitive or business-critical applications. The application sensitivity may be based on its purpose or the data it contains, such as financial information or personal information of the organization's customers. For those applications, only a subset of all the users in the organization will typically be authorized to have access, and access should only be permitted based on documented business requirements.  As part of your organization's controls for managing access, you can use Azure AD features to

* set up appropriate access,
* enforce access checks, and
* produce reports to demonstrate how those controls are being used to meet your compliance and risk management objectives.

In addition to the application access governance scenario, identity governance and the other Azure AD features can also be used for other scenarios, such as [reviewing and removing users from other organizations](../governance/access-reviews-external-users.md) or [managing users who are excluded from Conditional Access policies](../governance/conditional-access-exclusion.md).  If your organization has multiple administrators in Azure AD or Azure, uses B2B or self-service group management, then you should [plan an access reviews deployment](deploy-access-reviews.md) for those scenarios.

## Getting started with governing access to applications

Azure AD identity governance can be integrated with many applications, using [standards](../fundamentals/auth-sync-overview.md) such as OpenID Connect, SAML, SCIM, SQL and LDAP.  Through these standards, Azure AD can be used with many popular SaaS applications, as well as on-premises applications, and applications that your organization has developed.  This three step deployment plan covers how to connect your application to Azure AD and enable identity governance features to be used for that application.

1. [Define your organizational policies for access to the application](identity-governance-applications-define.md)
1. [Integrate the application with Azure AD to ensure only authorized users can access the application, and review user's existing access to the application to set a baseline of all users having been reviewed](identity-governance-applications-integrate.md)
1. [Deploy those policies for automating access assignments, and monitor to adjust those policies and access as needed](identity-governance-applications-deploy.md)

## Prerequisite checks for your Azure AD environment

Before you begin the process of governing application access from Azure AD, you should check your Azure AD environment is appropriately configured.

1. **Ensure your Azure AD and Microsoft Online Services environment is ready for the [compliance requirements](../standards/standards-overview.md) for the applications to be integrated and properly licensed**.  Compliance is a shared responsibility among Microsoft, cloud service providers (CSPs), and organizations.  To use Azure AD to govern access to applications, you must have one of the following licenses in your tenant:

   * Azure AD Premium P2
   * Enterprise Mobility + Security (EMS) E5 license

   You will need to have at least as many licenses as the number of member (non-guest) users who have or can request access to the applications, approve, or review access to the applications.  With an appropriate license, you can then govern access to up to 1500 applications per user.

1. **If you will be governing guest's access to the application, link your Azure AD tenant to a subscription for MAU billing**. This step will be necessary prior to having a guest request or review their access. For more information, see [billing model for Azure AD External Identities](../external-identities/external-identities-pricing.md).

1. **Check that Azure AD is already sending its audit log, and optionally other logs, to Azure Monitor.** Azure Monitor is optional, but useful for governing access to apps, as Azure AD only stores audit events for up to 30 days in its audit log. You can keep the audit data for longer than the default retention period, outlined in [How long does Azure AD store reporting data?](../reports-monitoring/reference-reports-data-retention.md), and use Azure Monitor workbooks and custom queries and reports on historical audit data. You can check the Azure AD configuration to see if it is using Azure Monitor, in **Azure Active Directory** in the Azure portal, by clicking on **Workbooks**. If this integration isn't configured, and you have an Azure subscription and are in the `Global Administrator` or `Security Administrator` roles, you can [configure Azure AD to use Azure Monitor](../governance/entitlement-management-logs-and-reporting.md).

1. **Make sure only authorized users are in the highly privileged administrative roles in your Azure AD tenant.** Administrators in the `Global Administrator`, `Identity Governance Administrator`, `User Administrator`, `Application Administrator`, `Cloud Application Administrator` and `Privileged Role Administrator` can make changes to users and their application role assignments.  If the memberships of those roles have not yet been recently reviewed, you'll need a user who is in the `Global Administrator` or `Privileged Role Administrator` to ensure that [access review of these directory roles](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md) are started.  You should also ensure that users in Azure roles in subscriptions that hold the Azure Monitor, Logic Apps and other resources needed for the operation of your Azure AD configuration have been reviewed.

1. **Check your tenant has appropriate isolation.** If your organization is using Active Directory on-premises, and these AD domains are connected to Azure AD, then you will need to ensure that highly-privileged administrative operations for cloud-hosted services are isolated from on-premises accounts. Check that you have [configured your systems to protect your Microsoft 365 cloud environment from on-premises compromise](../fundamentals/protect-m365-from-on-premises-attacks.md).

## Next steps

> [!div class="step-by-step"]
> [Define organizational policies for governing access to an application »](identity-governance-applications-define.md)
