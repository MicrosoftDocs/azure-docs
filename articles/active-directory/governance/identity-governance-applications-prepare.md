---
title: Govern access for applications in your environment
description: Microsoft Entra ID Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility.  These features can be used for your existing business critical third party on-premises and cloud-based applications.
services: active-directory
documentationcenter: ''
author: owinfreyATL
manager: amycolannino
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 6/28/2022
ms.author: owinfrey
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Govern access for applications in your environment

Microsoft Entra ID Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility. Its features ensure that the right people have the right access to the right resources in your organization at the right time.

Organizations with compliance requirements or risk management plans have sensitive or business-critical applications. The application sensitivity may be based on its purpose or the data it contains, such as financial information or personal information of the organization's customers. For those applications, only a subset of all the users in the organization will typically be authorized to have access, and access should only be permitted based on documented business requirements.  As part of your organization's controls for managing access, you can use Microsoft Entra features to

* set up appropriate access
* provision users to applications
* enforce access checks
* produce reports to demonstrate how those controls are being used to meet your compliance and risk management objectives.

In addition to the application access governance scenario, you can also use identity governance and the other Microsoft Entra features for other scenarios, such as [reviewing and removing users from other organizations](../governance/access-reviews-external-users.md) or [managing users who are excluded from Conditional Access policies](../governance/conditional-access-exclusion.md).  If your organization has multiple administrators in Microsoft Entra ID or Azure, uses B2B or self-service group management, then you should [plan an access reviews deployment](deploy-access-reviews.md) for those scenarios.

## License requirements
[!INCLUDE [active-directory-entra-governance-license.md](../../../includes/active-directory-entra-governance-license.md)]

## Getting started with governing access to applications

Microsoft Entra ID Governance can be integrated with many applications, using [standards](../architecture/auth-sync-overview.md) such as OpenID Connect, SAML, SCIM, SQL and LDAP.  Through these standards, you can use Microsoft Entra ID  with many popular SaaS applications, on-premises applications, and applications that your organization has developed. Once you've prepared your Microsoft Entra environment, as described in the section below, the three step plan covers how to connect an application to Microsoft Entra ID and enable identity governance features to be used for that application.

1. [Define your organization's policies for governing access to the application](identity-governance-applications-define.md)
1. [Integrate the application with Microsoft Entra ID](identity-governance-applications-integrate.md) to ensure only authorized users can access the application, and review user's existing access to the application to set a baseline of all users having been reviewed. This allows authentication and user provisioning
1. [Deploy those policies](identity-governance-applications-deploy.md) for controlling single sign-on (SSO) and automating access assignments for that application

<a name='prerequisites-before-configuring-azure-ad-for-identity-governance'></a>

## Prerequisites before configuring Microsoft Entra ID for identity governance

Before you begin the process of governing application access from Microsoft Entra ID, you should check your Microsoft Entra environment is appropriately configured.

* **Ensure your Microsoft Entra ID and Microsoft Online Services environment is ready for the [compliance requirements](../standards/standards-overview.md) for the applications to be integrated and properly licensed**.  Compliance is a shared responsibility among Microsoft, cloud service providers (CSPs), and organizations.  To use Microsoft Entra ID to govern access to applications, you must have one of the following [license combinations](licensing-fundamentals.md) in your tenant:

  *  **Microsoft Entra ID Governance** and its prerequisite, Microsoft Entra ID P1
  * **Microsoft Entra ID Governance Step Up for Microsoft Entra ID P2** and its prerequisite, either Microsoft Entra ID P2 or Enterprise Mobility + Security (EMS) E5

   Your tenant needs to have at least as many licenses as the number of member (non-guest) users who are governed, including those that have or can request access to the applications, approve, or review access to the applications.  With an appropriate license for those users, you can then govern access to up to 1500 applications per user.

* **If you will be governing guest's access to the application, link your Microsoft Entra tenant to a subscription for MAU billing**. This step is necessary prior to having a guest request or review their access. For more information, see [billing model for Microsoft Entra External ID](../external-identities/external-identities-pricing.md).

* **Check that Microsoft Entra ID is already sending its audit log, and optionally other logs, to Azure Monitor.** Azure Monitor is optional, but useful for governing access to apps, as Microsoft Entra-only stores audit events for up to 30 days in its audit log. You can keep the audit data for longer than the default retention period, outlined in [How long does Microsoft Entra ID store reporting data?](../reports-monitoring/reference-reports-data-retention.md), and use Azure Monitor workbooks and custom queries and reports on historical audit data. You can check the Microsoft Entra configuration to see if it's using Azure Monitor, in **Microsoft Entra ID** in the Microsoft Entra admin center, by clicking on **Workbooks**. If this integration isn't configured, and you have an Azure subscription and are in the `Global Administrator` or `Security Administrator` roles, you can [configure Microsoft Entra ID to use Azure Monitor](../governance/entitlement-management-logs-and-reporting.md).

* **Make sure only authorized users are in the highly privileged administrative roles in your Microsoft Entra tenant.** Administrators in the *Global Administrator*, *Identity Governance Administrator*, *User Administrator*, *Application Administrator*, *Cloud Application Administrator* and *Privileged Role Administrator* can make changes to users and their application role assignments.  If the memberships of those roles haven't yet been recently reviewed, you need a user who is in the *Global Administrator* or *Privileged Role Administrator* to ensure that [access review of these directory roles](../privileged-identity-management/pim-create-roles-and-resource-roles-review.md) are started.  You should also ensure that users in Azure roles in subscriptions that hold the Azure Monitor, Logic Apps and other resources needed for the operation of your Microsoft Entra configuration have been reviewed.

* **Check your tenant has appropriate isolation.** If your organization is using Active Directory on-premises, and these AD domains are connected to Microsoft Entra ID, then you need to ensure that highly privileged administrative operations for cloud-hosted services are isolated from on-premises accounts. Check that you've [configured your systems to protect your Microsoft 365 cloud environment from on-premises compromise](../architecture/protect-m365-from-on-premises-attacks.md).

Once you have checked your Microsoft Entra environment is ready, then proceed to [define the governance policies](identity-governance-applications-define.md) for your applications.

## Next steps

- [Define governance policies](identity-governance-applications-define.md)
- [Integrate an application with Microsoft Entra ID](identity-governance-applications-integrate.md)
- [Deploy governance policies](identity-governance-applications-deploy.md)
