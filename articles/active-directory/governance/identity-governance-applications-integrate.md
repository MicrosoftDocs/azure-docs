---
title: Integrate your applications for identity governance and establishing a baseline of reviewed access
description: Microsoft Entra ID Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility.  You can integrate your existing business critical third party on-premises and cloud-based applications with Microsoft Entra ID for identity governance scenarios.
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
ms.date: 7/29/2022
ms.author: owinfrey
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Integrating applications with Microsoft Entra ID and establishing a baseline of reviewed access


Once you've [established the policies](identity-governance-applications-define.md) for who should have access to an application, then you can [connect your application to Microsoft Entra ID](../manage-apps/what-is-application-management.md) and then [deploy the policies](identity-governance-applications-deploy.md) for governing access to them.

Microsoft Entra ID Governance can be integrated with many applications, including well-known applications such as SAP and those using [standards](../architecture/auth-sync-overview.md) such as OpenID Connect, SAML, SCIM, SQL, LDAP, SOAP and REST.  Through these standards, you can use Microsoft Entra ID with many popular SaaS applications and on-premises applications, including applications that your organization has developed.  This deployment plan covers how to connect your application to Microsoft Entra ID and enable identity governance features to be used for that application.

In order for Microsoft Entra ID Governance to be used for an application, the application must first be integrated with Microsoft Entra ID. An application being integrated with Microsoft Entra ID means one of two requirements must be met:

* The application relies upon Microsoft Entra ID for federated SSO, and Microsoft Entra ID controls authentication token issuance. If Microsoft Entra ID is the only identity provider for the application, then only users who are assigned to one of the application's roles in Microsoft Entra ID are able to sign into the application. Those users that lose their application role assignment can no longer get a new token to sign in to the application.
* The application relies upon user or group lists that are provided to the application by Microsoft Entra ID. This fulfillment could be done through a provisioning protocol such as SCIM, by the application querying Microsoft Entra ID via Microsoft Graph, or the application using AD Kerberos to obtain a user's group memberships.

If neither of those criteria are met for an application, for example when the application doesn't rely upon Microsoft Entra ID, then identity governance can still be used. However, there may be some limitations using identity governance without meeting the criteria. For instance, users that aren't in your Microsoft Entra ID, or aren't assigned to the application roles in Microsoft Entra ID, won't be included in access reviews of the application, until you add them to the application roles. For more information, see [Preparing for an access review of users' access to an application](access-reviews-application-preparation.md).

<a name='integrate-the-application-with-azure-ad-to-ensure-only-authorized-users-can-access-the-application'></a>

## Integrate the application with Microsoft Entra ID to ensure only authorized users can access the application

Typically this process of integrating an application begins when you configure that application to rely upon Microsoft Entra ID for user authentication, with a federated single sign-on (SSO) protocol connection, and then add provisioning.  The most commonly used protocols for SSO are [SAML and OpenID Connect](../develop/v2-protocols.md).  You can read more about the tools and process to [discover and migrate application authentication to Microsoft Entra ID](../manage-apps/migrate-adfs-apps-phases-overview.md).

Next, if the application implements a provisioning protocol, then you should configure Microsoft Entra ID to provision users to the application, so that Microsoft Entra ID can signal to the application when a user has been granted access or a user's access has been removed.  These provisioning signals permit the application to make automatic corrections, such as to reassign content created by an employee who has left to their manager.

1. Check if your application is on the [list of enterprise applications](../manage-apps/view-applications-portal.md) or [list of app registrations](../develop/app-objects-and-service-principals.md). If the application is already present in your tenant, then skip to step 5 in this section.
1. If your application is a SaaS application that isn't already registered in your tenant, then check if the application is available the [application gallery](../manage-apps/overview-application-gallery.md) for applications that can be integrated for federated SSO. If it's in the gallery, then use the tutorials to integrate the application with Microsoft Entra ID.
   1. Follow the [tutorial](../saas-apps/tutorial-list.md) to configure the application for federated SSO with Microsoft Entra ID.
   1. if the application supports provisioning, [configure the application for provisioning](../app-provisioning/configure-automatic-user-provisioning-portal.md).
   1. When complete, skip to the next section in this article.
   If the SaaS application isn't in the gallery, then [ask the SaaS vendor to onboard](../manage-apps/v2-howto-app-gallery-listing.md).  
1. If this is a private or custom application, you can also select a single sign-on integration that's most appropriate, based on the location and capabilities of the application.

   * If this application is in the public cloud, and it supports single sign-on, then configure single sign-on directly from Microsoft Entra ID to the application.

     |Application supports| Next steps|
     |----|-----|
     | OpenID Connect | [Add an OpenID Connect OAuth application](../saas-apps/openidoauth-tutorial.md) |
     | SAML 2.0 | Register the application and configure the application with [the SAML endpoints and certificate of Microsoft Entra ID](../develop/saml-protocol-reference.md) |
     | SAML 1.1 | [Add a SAML-based application](../saas-apps/saml-tutorial.md) |

   * Otherwise, if this is an on-premises or IaaS hosted application that supports single sign-on, then configure single sign-on from Microsoft Entra ID to the application through the application proxy.

     |Application supports| Next steps|
     |----|-----|
     | SAML 2.0| Deploy the [application proxy](../app-proxy/application-proxy.md) and configure an application for [SAML SSO](../app-proxy/application-proxy-configure-single-sign-on-on-premises-apps.md) |
     | Integrated Windows Auth (IWA) | Deploy the [application proxy](../app-proxy/application-proxy.md), configure an application for [Integrated Windows authentication SSO](../app-proxy/application-proxy-configure-single-sign-on-with-kcd.md), and set firewall rules to prevent access to the application's endpoints except via the proxy.|
     | header-based authentication | Deploy the [application proxy](../app-proxy/application-proxy.md) and configure an application for [header-based SSO](../app-proxy/application-proxy-configure-single-sign-on-with-headers.md) |

1. If your application has multiple roles, each user has only one role in the application, and the application relies upon Microsoft Entra ID to send a user's single application-specific role as a claim of a user signing into the application, then configure those application roles in Microsoft Entra ID on your application, and then assign each user to the application role. You can use  the [app roles UI](../develop/howto-add-app-roles-in-apps.md#app-roles-ui) to add those roles to the application manifest.  If you're using the Microsoft authentication libraries, there is a [code sample](../develop/sample-v2-code) for how to use app roles inside your application for access control.  If a user could have multiple roles simultaneously, then you may wish to implement the application to check security groups, either in the token claims or available via Microsoft Graph, instead of using application roles from the app manifest for access control.

1. If the application supports provisioning, then [configure provisioning](../app-provisioning/configure-automatic-user-provisioning-portal.md) of assigned users and groups from Microsoft Entra ID to that application.  If this is a private or custom application, you can also select the integration that's most appropriate, based on the location and capabilities of the application.

   * If this application is in the public cloud and supports SCIM, then configure provisioning of users via SCIM.

     |Application supports| Next steps|
     |----|-----|
     | SCIM | Configure an application with SCIM [for user provisioning](../app-provisioning/use-scim-to-provision-users-and-groups.md) |

   * If this application uses AD, then configure group writeback, and either update the application to use the Microsoft Entra ID-created groups, or nest the Microsoft Entra ID-created groups into the applications' existing AD security groups.

     |Application supports| Next steps|
     |----|-----|
     | Kerberos | Configure Microsoft Entra Connect [group writeback to AD](../hybrid/connect/how-to-connect-group-writeback-v2.md), create groups in Microsoft Entra ID and [write those groups to AD](../enterprise-users/groups-write-back-portal.md) |

   * Otherwise, if this is an on-premises or IaaS hosted application, and isn't integrated with AD, then configure provisioning to that application, either via SCIM or to the underlying database or directory of the application.

     |Application supports| Next steps|
     |----|-----|
     | SCIM | configure an application with the [provisioning agent for on-premises SCIM-based apps](../app-provisioning/on-premises-scim-provisioning.md)|
     | local user accounts, stored in a SQL database |  configure an application with the  [provisioning agent for on-premises SQL-based applications](../app-provisioning/on-premises-sql-connector-configure.md)|
     | local user accounts, stored in an LDAP directory | configure an application with the [provisioning agent for on-premises LDAP-based applications](../app-provisioning/on-premises-ldap-connector-configure.md) |
     | local user accounts, managed through a SOAP or REST API | configure an application with the [provisioning agent with the web services connector](../app-provisioning/on-premises-web-services-connector.md)|
     | local user accounts, managed through a MIM connector | configure an application with the [provisioning agent with a custom connector](../app-provisioning/on-premises-custom-connector.md)|
     | SAP ECC with NetWeaver AS ABAP 7.0 or later | configure an application with the [provisioning agent with a SAP ECC configured web services connector](../app-provisioning/on-premises-sap-connector-configure.md)|

1. If your application uses Microsoft Graph to query groups from Microsoft Entra ID, then [consent](../develop/application-consent-experience.md) to the applications to have the appropriate permissions to read from your tenant.

1. Set that access to **the application is only permitted for users assigned to the application**.  This setting prevents users from inadvertently seeing the application in MyApps, and attempting to sign into the application, prior to Conditional Access policies being enabled.

## Perform an initial access review

If this is a new application your organization hasn't used before, and therefore no one has pre-existing access, or if you've already been performing access reviews for this application, then skip to the [next section](identity-governance-applications-deploy.md).

However, if the application already existed in your environment, then it's possible that users may have gotten access in the past through manual or out-of-band processes, and those users should now be reviewed to have confirmation that their access is still needed and appropriate going forward. We recommend performing an access review of the users who already have access to the application, before enabling policies for more users to be able to request access. This review sets a baseline of all users having been reviewed at least once, to ensure that those users are authorized for continued access.

1. Follow the steps in [Preparing for an access review of users' access to an application](access-reviews-application-preparation.md).
1. If the application wasn't using Microsoft Entra ID or AD, but does support a provisioning protocol or had an underlying SQL or LDAP database, bring in any [existing users and create application role assignments](identity-governance-applications-existing-users.md) for them.
1. If the application wasn't using Microsoft Entra ID or AD, and doesn't support a provisioning protocol, then [obtain a list of users from the application and create application role assignments for each of them](identity-governance-applications-not-provisioned-users.md).
1. If the application was using AD security groups, then you need to review the membership of those security groups.
1. If the application had its own directory or database and wasn't integrated for provisioning, then once the review is complete, you may need to manually update the application's internal database or directory to remove those users who were denied.
1. If the application was using AD security groups, and those groups were created in AD, then once the review is complete, you need to manually update the AD groups to remove memberships of those users who were denied.  Subsequently, to have denied access rights removed automatically, you can either update the application to use an AD group that was created in Microsoft Entra ID and [written back to Microsoft Entra ID](../enterprise-users/groups-write-back-portal.md), or move the membership from the AD group to the Microsoft Entra group, and nest the written back group as the only member of the AD group.
1. Once the review has been completed and the application access updated, or if no users have access, then continue on to the next steps to deploy Conditional Access and entitlement management policies for the application.

Now that you have a baseline that ensures existing access has been reviewed, then you can [deploy the organization's policies](identity-governance-applications-deploy.md) for ongoing access and any new access requests.

## Next steps

- [Deploy governance policies](identity-governance-applications-deploy.md)
