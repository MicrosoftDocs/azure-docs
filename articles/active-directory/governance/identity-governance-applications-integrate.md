---
title: Integrate your applications for identity governance and establishing a baseline of reviewed access - Azure AD 
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

# Integrating applications with Azure AD and establishing a baseline of reviewed access

> [!div class="step-by-step"]
> [« Define organizational policies for governing access to an application](identity-governance-applications-define.md)
> [Deploy organizational policies for governing access to an application »](identity-governance-applications-deploy.md)


Once you have established the policies for who should have access to your application, then you can [connect your application to Azure AD](../manage-apps/what-is-application-management.md) and then deploy the policies for governing access to them.

Azure AD identity governance can be integrated with many applications, using [standards](../fundamentals/auth-sync-overview.md) such as OpenID Connect, SAML, SCIM, SQL and LDAP.  Through these standards, Azure AD can be used with many popular SaaS applications and on-premises applications, including applications which your organization has developed.  This deployment plan covers how to connect your application to Azure AD and enable identity governance features to be used for that application.

In order for Azure AD identity governance to be used for an application, then the application must first be integrated with Azure AD. An application being integrated with Azure AD means one of two requirements must be met:

* The application relies upon Azure AD for federated SSO, and Azure AD controls authentication token issuance. If Azure AD is the only identity provider for the application, then only users who are assigned to one of the application's roles in Azure AD are able to sign into the application. Those users that lose their application role assignment can no longer get a new token to sign in to the application.
* The application relies upon user or group lists that are provided to the application by Azure AD. This fulfillment could be done through a provisioning protocol such as SCIM or by the application querying Azure AD via Microsoft Graph.

If neither of those criteria are met for an application, as the application doesn't rely upon Azure AD, then identity governance can still be used, however there may be some limitations. For instance, users that aren't in your Azure AD, or aren't assigned to the application roles in Azure AD, won't be included in access reviews of the application, until you add them to the application roles. For more information, see [Preparing for an access review of users' access to an application](access-reviews-application-preparation.md).

## Integrate the application with Azure AD to ensure only authorized users can access the application

Typically this process of integrating an application begins with configuring that application to rely upon Azure AD for user authentication, with a federated single sign-on (SSO) protocol connection, and then adds provisioning.  The most commonly used protocols for SSO are [SAML and OpenID Connect](../develop/active-directory-v2-protocols.md).  You can read more about the tools and process to [discover and migrate application authentication to Azure AD](../manage-apps/migrate-application-authentication-to-azure-active-directory.md).

Next, if the application implements a provisioning protocol, then you should configure Azure AD to provision users to the application, so that Azure AD can signal to the application when a user has been granted access or a user's access has been removed.  These provisioning signals permit the application to make automatic corrections, such as to reassign content created by an employee who has left to their manager.

1. Check if your application is on the [list of enterprise applications](../manage-apps/view-applications-portal.md) or [list of app registrations](../develop/app-objects-and-service-principals.md). If the application is already present in your tenant, then skip to step 5 in this section.
1. If your application is a SaaS application that isn't already registered in your tenant, then check if the application is available the [application gallery](../manage-apps/overview-application-gallery.md) for applications that can be integrated for federated SSO. If it is in the gallery, then use the tutorials to integrate the application with Azure AD.
   1. Follow the [tutorial](../saas-apps/tutorial-list.md) to configure the application for federated SSO with Azure AD.
   1. if the application supports provisioning, [configure the application for provisioning](../app-provisioning/configure-automatic-user-provisioning-portal.md).
   1. When complete, skip to the next section in this article.
   If the SaaS application isn't in the gallery, then [ask the SaaS vendor to onboard](../manage-apps/v2-howto-app-gallery-listing.md).  
1. If this is a private or custom application, you can also select a single sign on integration that's most appropriate, based on the location and capabilities of the application.

   * If this application is in the public cloud, and it supports single sign on, then configure single sign-on directly from Azure AD to the application.

     |Application supports| Next steps|
     |----|-----|
     | OpenID Connect | [Add an OpenID Connect OAuth application](../saas-apps/openidoauth-tutorial.md) |
     | SAML 2.0 | Register the application and configure the application with [the SAML endpoints and certificate of Azure AD](../develop/active-directory-saml-protocol-reference.md) |
     | SAML 1.1 | [Add a SAML-based application](../saas-apps/saml-tutorial.md) |

   * Otherwise, if this is an on-premises or IaaS hosted application that supports single sign on, then configure single sign-on from Azure AD to the application through the application proxy.

     |Application supports| Next steps|
     |----|-----|
     | SAML 2.0| Deploy the [application proxy](../app-proxy/application-proxy.md) and configure an application for [SAML SSO](../app-proxy/application-proxy-configure-single-sign-on-on-premises-apps.md) |
     | Integrated Windows Auth (IWA) | Deploy the [application proxy](../app-proxy/application-proxy.md), configure an application for [Integrated Windows authentication SSO](../app-proxy/application-proxy-configure-single-sign-on-with-kcd.md), and set firewall rules to prevent access to the application's endpoints except via the proxy.|
     | header-based authentication | Deploy the [application proxy](../app-proxy/application-proxy.md) and configure an application for [header-based SSO](../app-proxy/application-proxy-configure-single-sign-on-with-headers.md) |

1. If your application has multiple roles, and relies upon Azure AD to send a user's role as part of a user signing into the application, then configure those application roles in Azure AD on your application.  Those roles can be added using the [app roles UI](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui).

1. If the application supports provisioning, then [configure provisioning](../app-provisioning/configure-automatic-user-provisioning-portal.md) of assigned users and groups from Azure AD to that application.  If this is a private or custom application, you can also select the integration that's most appropriate, based on the location and capabilities of the application.

   * If this application is in the public cloud and supports SCIM, then configure provisioning of users via SCIM.

     |Application supports| Next steps|
     |----|-----|
     | SCIM | Configure an application with SCIM [for user provisioning](../app-provisioning/use-scim-to-provision-users-and-groups.md) |

   * Otherwise, if this is an on-premises or IaaS hosted application, then configure provisioning to that application, either via SCIM or to the underlying database or directory of the application.

     |Application supports| Next steps|
     |----|-----|
     | SCIM | configure an application with the [provisioning agent for on-premises SCIM-based apps](../app-provisioning/on-premises-scim-provisioning.md)|
     | local user accounts, stored in a SQL database |  configure an application with the  [provisioning agent for on-premises SQL-based applications](../app-provisioning/on-premises-sql-connector-configure.md)|
     | local user accounts, stored in an LDAP directory | configure an application with the [provisioning agent for on-premises LDAP-based applications](../app-provisioning/on-premises-ldap-connector-configure.md) |

1. If your application uses Microsoft Graph to query groups from Azure AD, then [consent](../develop/consent-framework.md) to the applications to have the appropriate permissions to read from your tenant.

1. Set that access to the application is only permitted for users assigned to the application.  This will prevent users from inadvertently seeing the application in MyApps, and attempting to sign into the application, prior to Conditional Access policies being enabled.

## Perform an initial access review

If this is a new application your organization hasn't used before, and therefore no one has pre-existing access, or if you have already been performing access reviews for this application, then skip to the [next section](identity-governance-applications-deploy.md).

However, if the application already existed in your environment, then it is possible that users may have gotten access in the past through manual or out-of-band processes, and those users should now be reviewed to have confirmation that their access is still needed and appropriate going forward. We recommend performing an access review of the users who already have access to the application, before enabling policies for more users to be able to request access. This will set a baseline of all users having been reviewed at least once, to ensure that those users are authorized for continued access.

1. Follow the steps in [Preparing for an access review of users' access to an application](access-reviews-application-preparation.md).
1. If the application was not integrated for provisioning, then once the review is complete, you may need to manually update the application's internal database or directory to remove those users who were denied.
1. Once the review has been completed and the application access updated, or if no users have access, then continue in the next steps to deploy conditional access and entitlement management policies for the application.

Now that you have a baseline that ensures existing access has been reviewed, then you can deploy the organization's policies for ongoing access and any new access requests.

## Next steps

> [!div class="step-by-step"]
> [« Define organizational policies for governing access to an application](identity-governance-applications-define.md)
> [Deploy organizational policies for governing access to an application »](identity-governance-applications-deploy.md)
