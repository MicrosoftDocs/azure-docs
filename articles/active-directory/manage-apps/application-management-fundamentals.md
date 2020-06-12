---
title: 'Application management: Best practices and recommendations | Microsoft Docs'
description: Learn best practices and recommendations for managing applications in Azure Active Directory. Learn about using automatic provisioning and publishing on-premises apps with Application Proxy.

services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
editor: ''
ms.assetid: 
ms.service: active-directory
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/13/2019
ms.subservice: app-mgmt
ms.author: kenwith
ms.collection: M365-identity-device-management
---

# Application management best practices

This article contains recommendations and best practices for managing applications in Azure Active Directory (Azure AD), using automatic provisioning, and publishing on-premises apps with Application Proxy.

## Cloud app and single sign-on recommendations
| Recommendation | Comments |
| --- | --- |
| Check the Azure AD application gallery for apps  | Azure AD has a gallery that contains thousands of pre-integrated applications that are enabled with Enterprise single sign-on (SSO). For app-specific setup guidance, see the [List of SaaS app tutorials](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/).  | 
| Use federated SAML-based SSO  | When an application supports it, use Federated, SAML-based SSO with Azure AD instead of password-based SSO and ADFS.  | 
| Use SHA-256 for certificate signing  | Azure AD uses the SHA-256 algorithm by default to sign the SAML response. Use SHA-256 unless the application requires SHA-1 (see [Certificate signing options](certificate-signing-options.md) and [Application sign-in problem](application-sign-in-problem-application-error.md).)  | 
| Require user assignment  | By default, users can access to your enterprise applications without being assigned to them. However, if the application exposes roles, or if you want the application to appear on a user’s access panel, require user assignment. (See [Developer guidance for integrating applications](developer-guidance-for-integrating-applications.md).)  | 
| Deploy the My Apps access panel to your users | The [access panel](end-user-experiences.md) at `https://myapps.microsoft.com` is a web-based portal that provides users with a single point of entry for their assigned cloud-based applications. As additional capabilities like group management and self-service password reset are added, users can find them in the access panel. See [Plan an access panel deployment](access-panel-deployment-plan.md).
| Use group assignment  | If included in your subscription, assign groups to an application so you can delegate ongoing access management to the group owner. (See [Developer guidance for integrating applications](developer-guidance-for-integrating-applications.md).)   | 
| Establish a process for managing certificates | The maximum lifetime of a signing certificate is three years. To prevent or minimize outage due to a certificate expiring, use roles and email distribution lists to ensure that certificate-related change notifications are closely monitored. |

## Provisioning recommendations
| Recommendation | Comments |
| --- | --- |
| Use tutorials to set up provisioning with cloud apps | Check the [List of SaaS app tutorials](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/) for step-by-step guidance on configuring provisioning for the gallery app you want to add. |
| Use provisioning logs (preview) to monitor status | The [provisioning logs](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context) give details about all actions performed by the provisioning service, including status for individual users. |
| Assign a distribution group to the provisioning notification email | To increase the visibility of critical alerts sent by the provisioning service, assign a distribution group to the Notification Emails setting. |


## Application Proxy recommendations
| Recommendation | Comments |
| --- | --- |
| Use Application Proxy for remote access to internal resources | Application Proxy is recommended for giving remote users access to internal resources, replacing the need for a VPN or reverse proxy. It is not intended for accessing resources from within the corporate network because it could add latency.
| Use custom domains | Set up custom domains for your applications (see [Configure custom domains](application-proxy-configure-custom-domain.md)) so that URLs for users and between applications will work from either inside or outside of your network. You'll also be able to control your branding and customize your URLs.  When using custom domain names, plan to acquire a public certificate from a non-Microsoft trusted certificate authority. Azure Application Proxy supports standard, ([wildcard](application-proxy-wildcard.md)), or SAN-based certificates. (See [Application Proxy planning](application-proxy-deployment-plan.md).) |
| Synchronize users before deploying Application Proxy | Before deploying application proxy, synchronize user identities from an on-premises directory or create them directly in Azure AD. Identity synchronization allows Azure AD to pre-authenticate users before granting them access to App Proxy published applications. It also provides the necessary user identifier information to perform single sign-on (SSO). (See [Application Proxy planning](application-proxy-deployment-plan.md).) |
| Follow our tips for high availability and load balancing | To learn how traffic flows among users, Application Proxy connectors, and back-end app servers, and to get tips for optimizing performance and load balancing, see [High availability and load balancing of your Application Proxy connectors and applications](application-proxy-high-availability-load-balancing.md). |
| Use multiple connectors | Use two or more Application Proxy connectors for greater resiliency, availability, and scale (see [Application Proxy connectors](application-proxy-connectors.md)). Create connector groups and ensure each connector group has at least two connectors (three connectors is optimal). |
| Locate connector servers close to application servers, and make sure they're in the same domain | To optimize performance, physically locate the connector server close to the application servers (see [Network topology considerations](application-proxy-network-topology.md)). Also, the connector server and web applications servers should belong to the same Active Directory domain, or they should span trusting domains. This configuration is required for SSO with Integrated Windows Authentication (IWA) and Kerberos Constrained Delegation (KCD). If the servers are in different domains, you'll need to use resource-based delegation for SSO (see [KCD for single sign-on with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)). |
| Enable auto-updates for connectors | Enable auto-updates for your connectors for the latest features and bug fixes. Microsoft provides direct support for the latest connector version and one version before. (See [Application Proxy release version history](application-proxy-release-version-history.md).) |
| Bypass your on-premises proxy | For easier maintenance, configure the connector to bypass your on-premises proxy so it directly connects to the Azure services. (See [Application Proxy connectors and proxy servers](application-proxy-configure-connectors-with-proxy-servers.md).) |
| Use Azure AD Application Proxy over Web Application Proxy | Use Azure AD Application Proxy for most on-premises scenarios. Web Application Proxy is only preferred in scenarios that require a proxy server for AD FS and where you can't use custom domains in Azure Active Directory. (See [Application Proxy migration](application-proxy-migration.md).) |
