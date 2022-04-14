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
ms.date: 4/13/2022
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

In addition to application access governance scenario, identity governance and the other Azure AD features can also be used for other scenarios, such as [reviewing and removing users from other organizations](access-reviews-external-users.md) or [managing users who are excluded from Conditional Access policies](conditional-access-exclusion.md).

## Getting started with governing access to an application

Azure AD identity governance can be integrated with any application, using standards such as OpenID Connect, SAML, SCIM, SQL and LDAP.  Through these standards, Azure AD can be used with many popular SaaS applications, as well as on-premises applications, and applications which your organization has developed.  This five step deployment plan covers how to connect your application to Azure AD and enable identity governance features to be used for that application.

1. Establish policies for who should have access to the application
1. Ensure only authorized users cannot access the application
1. Review user's existing access to the application
1. Deploy policies for ongoing access assignments
1. Monitor to adjust policies and access as needed

## Establish policies for who should have access

1. Collect the roles and permissions that the app provides which are to be governed in Azure AD.  Some apps may have only a single role, e.g., "User", others may surface multiple roles that provides broad constraints on the access someone would have within the app, e.g., "User" and "Administrator".    Other apps may also rely upon group memberships for finer-grained role checks, which can be provided to the app from Azure AD in provisioning or federation protocols.

1. Identify if there are requirements for prerequisite criteria that a user must meet prior to that user having access to an application. For example, under normal circumstances, only full time employees, or those in a particular department or cost center, should be allowed to obtain access to a particular department's application, even as a non-administrator user.  In addition, you may wish to require, in the policy for a user getting access, one or more approvers, to ensure access requests are appropriate and decisions are accountable.  For example, requests for access by an employee could have two stages of approval, first by the requesting user's manager, and second by one of the resource owners responsible for data held in the application.

1. Determine how long a user who has been approved for access, should have access.  Typically, a user might have access indefinitely, until they are no longer affiliated with the organization. In some situations, access may be tied to particular projects or milestones, so that when the project ends, access is removed automatically.  Or, you may wish to configure quarterly or yearly reviews of everyone's access, so that there is regular oversight that ensures users lose access eventually if it is no longer needed.

1. Determine how exceptions to those criteria should be handled.  For example, an application may typically only be available for designated employees, but an auditor or vendor may need temporary access for a specific project.  In these situations, you may wish to also have a policy for approval that may have different stages.  A vendor who is signed in as a guest user in your Azure AD tenant may not have a manager, so instead their access requests could be approved by a sponsor for their organization, or by a resource owner, or a security officer.

## Ensure only authorized users cannot access the application

(connect your app to Azure AD for federated SSO...)

1. Ensure the users in highly privileged administrative roles in your Azure AD tenant have been reviewed. Administrators in the `Global Administrator`, `Identity Governance Administrator`, `User Administrator`, `Application Administrator`, `Cloud Application Administrator` and `Privileged Role Administrator` can make changes to users and their application role assignments.  If the memberships of those roles have not yet been recently reviewed, you should ensure [access review of these directory roles](../privileged-identity-management/pim-create-azure-ad-roles-and-resource-roles-review.md) are started.
1. Check if your app is on the [list of enterprise applications](../manage-apps/view-applications-portal.md) or [list of app registrations](../develop/app-objects-and-service-principals.md). If the application is already present in your tenant, then skip to step 5 in this section.
1. If your application is not already present, then check if the app is available the [application gallery](../manage-apps/overview-application-gallery.md) for applications that can be integrated for federated SSO and optionally provisioning. If it is, then use the [tutorials](../saas-apps/tutorial-list.md) to configure the application for federation, and if it supports it, and [configuration the application](/app-provisioning/configure-automatic-user-provisioning-portal.md) . When complete, skip to step 5 in this section.
1. If the application is not in the gallery, then select which integrations are possible, based on the capabilities of the application:

   |Application location|Application supports| Next steps|
   |----|----|-----|
   |Cloud| OpenID Connect | [Add an OpenID Connect OAuth application](../saas-apps/openidoauth-tutorial.md) |
   |Cloud| SAML 2.0 | Register the application and configure the application with [the SAML endpoints and certificate of Azure AD](../develop/active-directory-saml-protocol-reference.md) |
   |On-premises or IaaS-hosted| SAML 2.0| Deploy the [application proxy](/app-proxy/application-proxy.md) and configure an application for [SAML SSO](../app-proxy/application-proxy-configure-single-sign-on-on-premises-apps.md) |
   |Cloud| SAML 1.1 | [Add a SAML-based application](../saas-apps/saml-tutorial.md) |
   |On-premises or IaaS-hosted | Integrated Windows Auth (IWA) | Deploy the [application proxy](/app-proxy/application-proxy.md), configure an application for [Integrated Windows authentication SSO](../app-proxy/application-proxy-configure-single-sign-on-with-kcd.md), and set firewall rules to prevent access to the application's endpoints except via the proxy.|
   |On-premises or IaaS-hosted | header-based authentication | Deploy the [application proxy](/app-proxy/application-proxy.md) and configure an application for [header-based SSO](app-proxy/application-proxy-configure-single-sign-on-with-headers.md) |
   |Cloud| local user accounts, with SCIM | Configure an application with SCIM [for user provisioning](../app-provisioning/use-scim-to-provision-users-and-groups.md) |
   |On-premises or IaaS-hosted | local user accounts, with SCIM | you will not be able to configure single sign on for that application, but you can configure an application with the [provisioning agent for on-premises SCIM-based apps](../app-provisioning/on-premises-scim-provisioning.md)|
    | On-premises or IaaS-hosted | local user accounts, stored in a SQL database or LDAP directory | you will not be able to configure single sign on for that application, but you can configure an application with the [provisioning agent for on-premises SQL-based applications](../app-provisioning/on-premises-sql-connector-configure.md) or the [provisioning agent for on-premises LDAP-based applications](../app-provisioning/on-premises-ldap-connector-configure.md) |

1. If the application is configured for federated single sign on via SAML, OpenID Connect, IWA or header based authentication, confirm the Conditional Access policies that are in scope for the user being able to sign into the app. For most business critical applications, there should be a policy that requires multi-factor authentication.  In addition, some organizations may also block access by locations, or [require the user to access from a registered device](../conditional-access/howto-conditional-access-policy-compliant-device.md). You can also determine what policies would apply for a user with the [Conditional Access what if tool](../conditional-access/troubleshoot-conditional-access-what-if.md).

1. If the application supports SCIM, then configure provisioning from Azure AD to that application.  If the application is on-premises, then [provisioning agent for on-premises SCIM-based apps](../app-provisioning/on-premises-scim-provisioning.md).

1. If your application has multiple roles, then configure those app roles in Azure AD on your application.  Those role can be added using the [app roles UI](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui) and will later be sent to the application in federation claims or during provisioning.

## Review user's existing access to the application

First, if Azure AD is not already sending its audit log to an Azure Monitor deployed in one of your organization's Azure subscriptions, then you should [Configure Azure AD to use Azure Monitor](entitlement-management-logs-and-reporting.md) for its audit log.  Azure AD stores audit events for up to 30 days in the audit log. However, you can keep the audit data for longer than the default retention period, outlined in [How long does Azure AD store reporting data?](../reports-monitoring/reference-reports-data-retention.md), by using Azure Monitor. You can then use Azure Monitor workbooks and custom queries and reports across current and historical audit data.

Next, if this is a new application you have not used before and therefore no one has access, or if you have already been performing access reviews for this application, then skip to the next section.

If this is an existing application, we recommend performing an access review of the users who already have access to the application, to ensure that those users have a need for continued access.

* If the application uses Azure AD application role assignments to determine who has access, ...
* If the application uses an Azure AD group, ...
<!-- * If the application uses an AD DS group, ... -->
<!-- * If the application has a local data store accessible via SCIM -->
<!-- * If the application uses a SQL database or another LDAP directory, ... -->

## Deploy policies for ongoing access assignments

1. If you do not already have a catalog for your scenario, create a catalog....
1. Add the application, and its underlying resources, to that catalog...
1. For each application role in which ..., create an access package... In that access package, configure the policy for direct assignment...
1. If you have separation of duties requirements...
1. Assign existing users ...
1. In each access package, create a policy for request...
   approval review



## Monitor to adjust policies and access as needed


Watch app role assignments not made by EM...

Ensure policies have identified approvers and reviewers...

Schedule recurring reviews...

## Next steps

