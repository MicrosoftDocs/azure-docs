---
title: 'Application management: Best practices and recommendations | Microsoft Docs'
description: Learn best practices and recommendations for managing applications in Azure Active Directory, using automatic provisioning, and publishing on-premises apps with Application Proxy.

services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG
editor: ''
ms.assetid: 
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/04/2019
ms.subservice: app-mgmt
ms.author: mimart

ms.collection: M365-identity-device-management
---
# Application Management best practices
This article contains recommendations and best practices for managing applications in Azure Active Directory (Azure AD), using automatic provisioning, and publishing on-premises apps with Application Proxy.

## Cloud app and single sign-on recommendations
| Recommendation | Comments |
| --- | --- |
| Check the Azure AD application gallery for apps  | Azure AD has a gallery that contains thousands of pre-integrated applications that are enabled with Enterprise single sign-on. For app-specific setup guidance, see the [List of SaaS app tutorials](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/).  | 
| Use federated SAML-based single sign-on (SSO)  | When an application supports it, use Federated, SAML-based single sign-on (SSO) with Azure AD instead of password-based SSO and ADFS.  | 
| Use SHA-256 for certificate signing  | Azure AD uses the SHA-256 algorithm by default to sign the SAML response. Use SHA-256 unless the application requires SHA-1 (see [Certificate signing options](https://docs.microsoft.com/azure/active-directory/manage-apps/certificate-signing-options) and [Application sign-in problem](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-problem-application-error).)  | 
| Require user assignment  | By default, users can access to your enterprise applications without being assigned to them. However, if the application exposes roles, or if you want the application to appear on a user’s access panel, require user assignment. (See [Developer guidance for integrating applications](https://docs.microsoft.com/azure/active-directory/manage-apps/developer-guidance-for-integrating-applications).)  | 
| Deploy the My Apps access panel to your users | The [access panel](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/end-user-experiences) at `https://myapps.microsoft.com` is a web-based portal that provides users with a single point of entry for their assigned cloud-based applications. As additional capabilities like group management and self-service password reset are added, users can find them in the access panel. See [Plan an access panel deployment](https://docs.microsoft.com/azure/active-directory/manage-apps/access-panel-deployment-plan).
| Use group assignment  | If included in your subscription, assign groups to an application so you can delegate ongoing access management to the group owner. (See [Developer guidance for integrating applications](https://docs.microsoft.com/azure/active-directory/manage-apps/developer-guidance-for-integrating-applications).)   | 

## Provisioning recommendations
| Recommendation | Comments |
| --- | --- |
| Use tutorials to set up provisioning with cloud apps | Check the [List of SaaS app tutorials](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/) for step-by-step guidance for configuring provisioning for the gallery app you want to add. |
| Use Azure AD provisioning service to support other identity providers | The Azure AD provisioning service uses SCIM. If you want to support other SCIM-compliant IdPs, use the Azure AD provisioning service so the IdP can connect to your SCIM endpoint. (See [Plan for automatic provisioning](https://docs.microsoft.com/azure/active-directory/manage-apps/isv-automatic-provisioning-multi-tenant-apps).) |
Use Privileged Identity Management (PIM) | Use [Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-configure) to manage your roles to provide additional auditing, control, and access review for users with directory permissions. |
| Establish a process for managing certificates | The maximum lifetime of a signing certificate is three years. To prevent or minimize outage due to a certificate expiring, use roles and email distribution lists to ensure that certificate-related change notifications are closely monitored. |

## Application Proxy recommendations
| Recommendation | Comments |
| --- | --- |
| Use multiple Windows servers for high availability | For high availability in your production environment, we recommend having more than one Windows server. |
| Use Azure AD pre-authentication | Use Application Proxy with pre-authentication and Conditional Access policies for remote access from the internet and to allow for features like Multi-Factor Authentication. (See [Application Proxy planning](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-deployment-plan).) |
| Use custom domains | Set up custom domains for your applications (see [Configure custom domains](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-custom-domain)) so that URLs for users and between applications will work from either inside or outside of your network, and so you can control your branding and customize your URLs. |
| Enable auto-updates for connectors | Enable auto-updates for your connectors for the latest features and bug fixes. Microsoft provides direct support for the latest connector version and one version before. (See [Application Proxy release version history](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-release-version-history).) |
| Directly authenticate with Azure AD for intranet use | To provide Conditional Access for intranet use, modernize applications so they can directly authenticate with Azure AD. (See [Migrating applications to Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/migration-resources) and [Application Proxy planning](https://docs.microsoft.com/azure/active-directory/application-proxy-deployment-plan).) |
| Plan for a public certificate for custom domains | When using custom domain names, plan to acquire a public certificate from a non-Microsoft trusted certificate authority. Azure Application Proxy supports standard, ([wildcard](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-wildcard)), or SAN-based certificates. (See [Application Proxy planning](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-deployment-plan).) |
| Use multiple connectors | Use two or more Application Proxy connectors for greater resiliency, availability, and scale (see [Application Proxy connectors](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connectors)). Create connector groups and ensure each connector group has at least two connectors (three connectors is optimal). |
| Bypass your on-premises proxy | For easier maintenance, configure the connector to bypass your on-premises proxy so it directly connects to the Azure services. (See [Application Proxy connectors and proxy servers](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-connectors-with-proxy-servers).) |
| Use Azure AD Application Proxy over Web Application Proxy | Use Azure AD Application Proxy for most on-premises scenarios. Web Application Proxy is only preferred in scenarios that require a proxy server for AD FS and where you can't use custom domains in Azure Active Directory. (See [Application Proxy migration](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-migration).) |
