---
title: Govern access for critical applications in your environment| Microsoft Docs
description: Azure Active Directory Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility.  You can integrate your existing business critical third party on-premises and cloud-based applications with Azure AD for identity governance scenarios.
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

# Integrating applications with Azure AD

> [!div class="step-by-step"]
> [« Define policies](identity-governance-critical-applications-define.md)
> [Deploy policies »](identity-governance-critical-applications-deploy.md)

Azure AD identity governance can be integrated with any application, using [standards](../fundamentals/auth-sync-overview.md) such as OpenID Connect, SAML, SCIM, SQL and LDAP.  Through these standards, Azure AD can be used with many popular SaaS applications, as well as on-premises applications, and applications which your organization has developed.  This six step deployment plan covers how to connect your application to Azure AD and enable identity governance features to be used for that application.

## Integrate the application with Azure AD to ensure only authorized users cannot access the application

Once you have established the policies for who should have access to your application, then you will [connect your application to Azure AD](../manage-apps/what-is-application-management.md). Typically this begins with configuring your application to rely upon Azure AD for user authentication, with a federated single sign-on (SSO) protocol connection.  The most commonly used protocols for SSO are [SAML and OpenID Connect](../develop/active-directory-v2-protocols.md).  If the application permits provisioning, to automatically add, remove or update users, then you should also configure provisioning, so that Azure AD can signal to the application when a user has been granted access or access has been removed.  These provisioning signals permit the application to make automatic corrections, such as to reassign content created by an employee who has left to their manager.

1. Check if your app is on the [list of enterprise applications](../manage-apps/view-applications-portal.md) or [list of app registrations](../develop/app-objects-and-service-principals.md). If the application is already present in your tenant, then skip to step 5 in this section.
1. If your application isn't already registered in your tenant, then check if the app is available the [application gallery](../manage-apps/overview-application-gallery.md) for applications that can be integrated for federated SSO. If it is, then use the [tutorials](../saas-apps/tutorial-list.md) to configure the application for federation, and if it supports it, and [configuration the application](/app-provisioning/configure-automatic-user-provisioning-portal.md) . When complete, skip to step 5 in this section.
1. If the application isn't in the gallery, then [ask the SaaS vendor to onboard](../manage-apps/v2-howto-app-gallery-listing.md).  If this is a private or custom application, you can also select a single sign on integration that's most appropriate, based on the location and capabilities of the application.

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

## Next steps

> [!div class="step-by-step"]
> [« Define policies](identity-governance-critical-applications-define.md)
> [Deploy policies »](identity-governance-critical-applications-deploy.md)
