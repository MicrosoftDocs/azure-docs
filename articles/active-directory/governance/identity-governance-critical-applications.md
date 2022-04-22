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

Azure AD identity governance can be integrated with any application, using [standards](../fundamentals/auth-sync-overview.md) such as OpenID Connect, SAML, SCIM, SQL and LDAP.  Through these standards, Azure AD can be used with many popular SaaS applications, as well as on-premises applications, and applications which your organization has developed.  This six step deployment plan covers how to connect your application to Azure AD and enable identity governance features to be used for that application.

<!-- TODO It'd be good to link these to the respective sections once the titles are finalized -->

<!-- TODO One aspect I'm struggling with is the challenge of the role. What if the person who wants this isn't a GA. So maybe:

How to prepare and establish policy, goals (any user)
What you need to have your GA (or SI partner) go do (give this section or a separate article to your GA)
Now that your GA has done their prep, what you do next (delegated)
Ongoing monitoring ... -->

1. Define policies for access to the application
1. Validate your Azure AD environment is prepared for integrating with the application

1. Integrate the application with Azure AD to ensure only authorized users cannot access the application
1. Review user's existing access to the application to set a baseline of all users having been reviewed

1. Deploy policies for automating access assignments
1. Monitor to adjust policies and access as needed

> [!div class="step-by-step"]
> [Define policies »](identity-governance-critical-applications-define.md)


## Integrate the application with Azure AD to ensure only authorized users cannot access the application

Once you have established the policies for who should have access to your application, then you will [connect your application to Azure AD](../manage-apps/what-is-application-management.md). Typically this begins with configuring your application to rely upon Azure AD for user authentication, with a federated single sign-on (SSO) protocol connection.  The most commonly used protocols for SSO are [SAML and OpenID Connect](../develop/active-directory-v2-protocols.md).  If the application permits provisioning, to automatically add, remove or update users, then you should also configure provisioning, so that Azure AD can signal to the application when a user has been granted access or access has been removed.  These provisioning signals permit the application to make automatic corrections, such as to reassign content created by an employee who has left to their manager.

1. Check if your app is on the [list of enterprise applications](../manage-apps/view-applications-portal.md) or [list of app registrations](../develop/app-objects-and-service-principals.md). If the application is already present in your tenant, then skip to step 5 in this section.
1. If your application isn't already registered in your tenant, then check if the app is available the [application gallery](../manage-apps/overview-application-gallery.md) for applications that can be integrated for federated SSO. If it is, then use the [tutorials](../saas-apps/tutorial-list.md) to configure the application for federation, and if it supports it, and [configuration the application](/app-provisioning/configure-automatic-user-provisioning-portal.md) . When complete, skip to step 5 in this section.
1. If the application isn't in the gallery, then [ask the SaaS vendor to onboard](manage-apps/v2-howto-app-gallery-listing.md).  If this is a private or custom application, you can also select a single sign on integration that's most appropriate, based on the location and capabilities of the application.

   * If this application is a SaaS application, and it supports one of these protocols, then configure single sign-on.

     |Application supports| Next steps|
     |----|-----|
     | OpenID Connect | [Add an OpenID Connect OAuth application](../saas-apps/openidoauth-tutorial.md) |
     | SAML 2.0 | Register the application and configure the application with [the SAML endpoints and certificate of Azure AD](../develop/active-directory-saml-protocol-reference.md) |
     | SAML 1.1 | [Add a SAML-based application](../saas-apps/saml-tutorial.md) |

   * Otherwise, if this is an on-premises or IaaS hosted application, and it supports one of these protocols, then configure signle sign-on.

     |Application supports| Next steps|
     |----|-----|
     | SAML 2.0| Deploy the [application proxy](/app-proxy/application-proxy.md) and configure an application for [SAML SSO](../app-proxy/application-proxy-configure-single-sign-on-on-premises-apps.md) |
     | Integrated Windows Auth (IWA) | Deploy the [application proxy](/app-proxy/application-proxy.md), configure an application for [Integrated Windows authentication SSO](../app-proxy/application-proxy-configure-single-sign-on-with-kcd.md), and set firewall rules to prevent access to the application's endpoints except via the proxy.|
     | header-based authentication | Deploy the [application proxy](/app-proxy/application-proxy.md) and configure an application for [header-based SSO](../app-proxy/application-proxy-configure-single-sign-on-with-headers.md) |

1. If the application is configured for federated single sign-on via SAML, OpenID Connect, IWA or header based authentication, confirm the Conditional Access policies that are in scope for the user being able to sign into the app. For most business critical applications, there should be a policy that requires multi-factor authentication.  In addition, some organizations may also block access by locations, or [require the user to access from a registered device](../conditional-access/howto-conditional-access-policy-compliant-device.md). You can also determine what policies would apply for a user with the [Conditional Access what if tool](../conditional-access/troubleshoot-conditional-access-what-if.md).

1. If the application supports provisioning, then configure provisioning from Azure AD to that application.  If this is a private or custom application, you can also select the integration that's most appropriate, based on the location and capabilities of the application.

   * If this application a SaaS application that supports SCIM, then configure provisioning.

     |Application supports| Next steps|
     |----|-----|
     | SCIM | Configure an application with SCIM [for user provisioning](../app-provisioning/use-scim-to-provision-users-and-groups.md) |

   * Otherwise, if this is an on-premises or IaaS hosted application, then configure provisioning to that application.

     |Application supports| Next steps|
     |----|-----|
     | SCIM | configure an application with the [provisioning agent for on-premises SCIM-based apps](../app-provisioning/on-premises-scim-provisioning.md)|
     | local user accounts, stored in a SQL database or LDAP directory | configure an application with the [provisioning agent for on-premises SQL-based applications](../app-provisioning/on-premises-sql-connector-configure.md) or the [provisioning agent for on-premises LDAP-based applications](../app-provisioning/on-premises-ldap-connector-configure.md) |


1. If your application has multiple roles, then configure those app roles in Azure AD on your application.  Those roles can be added using the [app roles UI](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui) and will later be sent to the application in federation claims or during provisioning.

## Review user's existing access to the application to set a baseline of all users having been reviewed

<!-- TODO permissions and consent review -->

If the application already existed in your environment, then it is possible that users may have gotten access in the past through manual or out-of-band processes, and those users should now be reviewed to have confirmation that their access is still needed and appropriate going forward.

1. If this is a new application you have not used before, and therefore no one has pre-existing access, or if you have already been performing access reviews for this application, then skip to the next section.

1. If this is an existing application, we recommend performing an access review of the users who already have access to the application, to ensure that those users are authorized for continued access.

* If the application relies upon Azure AD application role assignments to determine who has access, then create a one-time [access review](../governance/create-access-review.md) of that application.
* If the application relies upon Azure AD group memberships to determine who has access, then create a one-time [access review](../governance/create-access-review.md) of the membership of those groups.
<!-- TODO * If the application uses an AD DS group, ... -->
<!-- TODO * If the application has a local data store accessible via SCIM ... -->
<!-- TODO * If the application uses a SQL database or another LDAP directory, ... -->

## Deploy policies for automating access assignments

1. If you don't already have a catalog for your application governance scenario, [create a catalog](../governance/entitlement-management-catalog-create.md) in Azure AD entitlement management.
1. Add the application, as well as any Azure AD groups which the application relies upon, [as resources in that catalog](../governance/entitlement-management-catalog-create.md).

1. For each of the applications' roles or groups, [create an access package](../governance/entitlement-management-access-package-create.md) which includes that role or group as its resource. At this stage of configuring  that access package, configure the policy for direct assignment, so that only administrators can create assignments.  In that policy, set the access review requirements for existing users, if any, so that they don't retain access indefinitely.
1. If you have [separation of duties](entitlement-management-access-package-incompatible.md) requirements, then configure the incompatible access packages or existing groups for your access package.  If your scenario requires the ability to override a separation of duties check, then you will also [set up additional access packages for those override scenarios](entitlement-management-access-package-incompatible.md#configuring-multiple-access-packages-for-override-scenarios).
1. For each access package, assign existing users of the application in that role, or members of that group, to the access package.
1. In each access package, [create additional policies](..//governance/entitlement-management-access-package-request-policy.md#open-an-existing-access-package-and-add-a-new-policy-of-request-settings) for users to request access.  Configure the approval and recurring access review requirements in that policy.

## Monitor to adjust policies and access as needed

At regular intervals, such as weekly, monthly or quarterly, based on the volume of application access assignment changes for your application, use the Azure portal to ensure that access is being granted in accordance with the policies, and the identified users for approval and review are still the correct individuals for these tasks.

1. Use the `Application role assignment activity` in Azure Monitor to [monitor and report on any application role assignments that were not made through entitlement management](../governance/entitlement-management-access-package-incompatible.md#monitor-and-report-on-access-assignments).

1. If the application has a local user account store, within the app or in a database or LDAP directory, and does not rely upon Azure AD for single sign-on, then check that users were only added to the application's local user store through Azure AD provisioning those users.

1. For each access package that you configured in the previous section, ensure policies continue to have the correct approvers and reviewers. Update policies if the approvers and reviewers that were previously configured are no longer present in the organization, or are in a different role.

1. Also, monitor recurring access reviews for those access packages, to ensure reviewers are participating and making decisions to approve or deny user's continued need for access.

<!-- TODO Should this link to an access review article that shows how you can alert on this? Mby this is something that could be done through Azure Monitor? -->

## Next steps

- [Access reviews deployment plan](deploy-access-reviews.md)
