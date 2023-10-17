---
title: 'Phase 1: Discover and scope apps'
description: This article describes phase 1 of planning migration of applications from AD FS to Microsoft Entra ID
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 05/30/2023
ms.author: jomondi
ms.reviewer: gasinh
ms.collection: M365-identity-device-management
---

# Phase 1: Discover and scope apps

Application discovery and analysis are a fundamental exercise to give you a good start. You may not know everything so be prepared to accommodate the unknown apps.

## Find your apps

The first decision in the migration process is which apps to migrate, which if any should remain, and which apps to deprecate. There's always an opportunity to deprecate the apps that you won't use in your organization. There are several ways to find apps in your organization. While discovering apps, ensure you include in-development and planned apps. Use Microsoft Entra ID for authentication in all future apps.

Discover applications using ADFS:

- **Use Microsoft Entra Connect Health for ADFS**: If you have a Microsoft Entra ID P1 or P2 license, we recommend deploying [Microsoft Entra Connect Health](../hybrid/connect/how-to-connect-health-adfs.md) to analyze the app usage in your on-premises environment. You can use the [ADFS application report](./migrate-adfs-application-activity.md) to discover ADFS applications that can be migrated and evaluate the readiness of the application to be migrated.

- If you don’t have Microsoft Entra ID P1 or P2 licenses, we recommend using the ADFS to Microsoft Entra app migration tools based on [PowerShell](https://github.com/AzureAD/Deployment-Plans/tree/master/ADFS%20to%20AzureAD%20App%20Migration). Refer to [solution guide](./migrate-adfs-apps-stages.md):

> [!VIDEO https://www.youtube.com/embed/PxLIacDpHh4]

>[!NOTE]
> This video covers both phase 1 and 2 of the migration process.
 
## Using other identity providers (IdPs)

- If you’re currently using Okta, refer to our [Okta to Microsoft Entra migration guide](migrate-applications-from-okta.md).

- If you’re currently using Ping Federate, then consider using the [Ping Administrative API](https://docs.pingidentity.com/r/en-us/pingfederate-112/pf_admin_api) to discover applications.

- If the applications are integrated with Active Directory, search for service principals or service accounts that may be used for applications.  

## Using cloud discovery tools

In the cloud environment, you need rich visibility, control over data travel, and sophisticated analytics to find and combat cyber threats across all your cloud services. You can gather your cloud app inventory using the following tools:

- **Cloud Access Security Broker (CASB**) – A [CASB](/defender-cloud-apps/) typically works alongside your firewall to provide visibility into your employees’ cloud application usage and helps you protect your corporate data from cybersecurity threats. The CASB report can help you determine the most used apps in your organization, and the early targets to migrate to Microsoft Entra ID.
- **Cloud Discovery** - By configuring [Microsoft Defender for Cloud Apps](/defender-cloud-apps/what-is-defender-for-cloud-apps), you gain visibility into the cloud app usage, and can discover unsanctioned or Shadow IT apps.
- **Azure Hosted Applications** - For apps connected to Azure infrastructure, you can use the APIs and tools on those systems to begin to take an inventory of hosted apps. In the Azure environment:
  - Use the [Get-AzureWebsite](/powershell/module/servicemanagement/azure/get-azurewebsite) cmdlet to get information about Azure websites.
  - Use the [Get-AzureRMWebApp](/powershell/module/azurerm.websites/get-azurermwebapp) cmdlet to get information about your Azure Web Apps.D
  - Query Microsoft Entra ID looking for [Applications](/previous-versions/azure/ad/graph/api/entity-and-complex-type-reference#application-entity) and [Service Principals](/previous-versions/azure/ad/graph/api/entity-and-complex-type-reference#serviceprincipal-entity).

## Manual discovery process

Once you've taken the automated approaches described in this article, you have a good handle on your applications. However, you might consider doing the following to ensure you have good coverage across all user access areas:

- Contact the various business owners in your organization to find the applications in use in your organization.
- Run an HTTP inspection tool on your proxy server, or analyze proxy logs, to see where traffic is commonly routed.
- Review weblogs from popular company portal sites to see what links users access the most.
- Reach out to executives or other key business members to ensure that you've covered the business-critical apps.

## Type of apps to migrate

Once you find your apps, you identify these types of apps in your organization:

- Apps that use modern authentication protocols such as [Security Assertion Markup Language (SAML)](../architecture/auth-saml.md) or [OpenID Connect (OIDC)](../architecture/auth-oidc.md).
- Apps that use legacy authentication such as [Kerberos](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889) or NT LAN Manager (NTLM) that you choose to modernize.
- Apps that use legacy authentication protocols that you choose NOT to modernize
- New Line of Business (LoB) apps

### Apps that use modern authentication already

The already modernized apps are the most likely to be moved to Microsoft Entra ID. These apps already use modern authentication protocols such as SAML or OIDC and can be reconfigured to authenticate with Microsoft Entra ID.

We recommend you search and add applications from the [Microsoft Entra app gallery](https://azuremarketplace.microsoft.com/marketplace/apps/category/azure-active-directory-apps). If you don’t find them in the gallery, you can still onboard a custom application.

### Legacy apps that you choose to modernize

For legacy apps that you want to modernize, moving to Microsoft Entra ID for core authentication and authorization unlocks all the power and data-richness that the [Microsoft Graph](https://developer.microsoft.com/graph/gallery/?filterBy=Samples,SDKs) and [Intelligent Security Graph](https://www.microsoft.com/security/operations/intelligence?rtc=1) have to offer.

We recommend updating the authentication stack code for these applications from the legacy protocol (such as Windows-Integrated Authentication, Kerberos, HTTP Headers-based authentication) to a modern protocol (such as SAML or OpenID Connect).

### Legacy apps that you choose NOT to modernize

For certain apps using legacy authentication protocols, sometimes modernizing their authentication isn't the right thing to do for business reasons. These include the following types of apps:

- Apps kept on-premises for compliance or control reasons.
- Apps connected to an on-premises identity or federation provider that you don't want to change.
- Apps developed using on-premises authentication standards that you have no plans to move

Microsoft Entra ID can bring great benefits to these legacy apps. You can enable modern Microsoft Entra security and governance features like [Multi-Factor Authentication](../authentication/concept-mfa-howitworks.md), [Conditional Access](../conditional-access/overview.md), [Identity Protection](../identity-protection/index.yml), [Delegated Application Access](./manage-self-service-access.md), and [Access Reviews](../governance/manage-user-access-with-access-reviews.md#create-and-perform-an-access-review) against these apps without touching the app at all!

- Start by extending these apps into the cloud with [Microsoft Entra application proxy](../app-proxy/application-proxy.md).
- Or explore using on of our [Secure Hybrid Access (SHA) partner integrations](secure-hybrid-access.md) that you might have deployed already.

### New Line of Business (LoB) apps

You usually develop LoB apps for your organization’s in-house use. If you have new apps in the pipeline, we recommend using the [Microsoft identity platform](../develop/v2-overview.md) to implement OIDC.

## Apps to deprecate

Apps without clear owners and clear maintenance and monitoring present a security risk for your organization. Consider deprecating applications when:

- Their **functionality is highly redundant** with other systems
- There's **no business owner**
- There's clearly **no usage**

We recommend that you **do not deprecate high impact, business-critical applications**. In those cases, work with business owners to determine the right strategy.

## Exit criteria

You're successful in this phase with:

- A good understanding of the applications in scope for migration, those that require modernization, those that should stay as-is, or  those you've marked for deprecation.

## Next steps

- [Phase 2 - Classify apps and plan pilot](migrate-adfs-classify-apps-plan-pilot.md).
