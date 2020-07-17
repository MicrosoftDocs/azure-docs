---
title: Azure AD password protection - Azure Active Directory
description: Ban weak passwords in on-premises Active Directory by using Azure AD password protection

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/17/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: jsimmons
ms.collection: M365-identity-device-management
---

# Enforce Azure AD password protection for Windows Server Active Directory

Azure AD password protection is a feature that enhances password policies in an organization. On-premises deployment of password protection uses both the global and custom banned-password lists that are stored in Azure AD. It does the same checks on-premises as Azure AD does for cloud-based changes. These checks are performed during password changes and password reset scenarios.

## Design principles

Azure AD password protection is designed with these principles in mind:

* Domain controllers (DCs) never have to communicate directly with the internet.
* No new network ports are opened on DCs.
* No Active Directory schema changes are required. The software uses the existing Active Directory *container* and *serviceConnectionPoint* schema objects.
* No minimum Active Directory domain or forest functional level (DFL/FFL) is required.
* The software doesn't create or require accounts in the Active Directory domains that it protects.
* User clear-text passwords never leave the domain controller, either during password validation operations or at any other time.
* The software isn't dependent on other Azure AD features. For example, Azure AD password hash sync (PHS) isn't related or required for Azure AD password protection.
* Incremental deployment is supported, however the password policy is only enforced where the Domain Controller Agent (DC Agent) is installed.

## Incremental deployment

Azure AD password protection supports incremental deployment across DCs in an AD DS domain but it's important to understand what this really means and what the tradeoffs are.

The Azure AD password protection DC agent software can only validate passwords when it's installed on a DC, and only for password changes that are sent to that DC. It isn't possible to control which DCs are chosen by Windows client machines for processing user password changes. To guarantee consistent behavior and universal password protection security enforcement, the DC agent software must be installed on all DCs in a domain.

Many organizations want to carefully test Azure AD password protection on a subset of their DCs prior to a full deployment. To support this scenario, Azure AD password protection supports partial deployment. The DC agent software on a given DC actively validates passwords even when other DCs in the domain don't have the DC agent software installed. Partial deployments of this type aren't secure and aren't recommended other than for testing purposes.

## Architectural diagram

It's important to understand the underlying design and function concepts before you deploy Azure AD password protection in an on-premises AD DS environment. The following diagram shows how the components of password protection work together:

![How Azure AD password protection components work together](./media/concept-password-ban-bad-on-premises/azure-ad-password-protection.png)

* The Azure AD Password Protection Proxy service runs on any domain-joined machine in the current AD DS forest. The service's primary purpose is to forward password policy download requests from DCs to Azure AD and then return the responses from Azure AD to the DC.
* The password filter DLL of the DC Agent receives user password-validation requests from the operating system. The filter forwards them to the DC Agent service that's running locally on the DC.
* The DC Agent service of password protection receives password-validation requests from the password filter DLL of the DC Agent. The DC Agent service processes them by using the current (locally available) password policy and returns the result of *pass* or *fail*.

## How password protection works

The on-premises password protection components work as follows:

1. Each Azure AD Password Protection Proxy service instance advertises itself to the DCs in the forest by creating a *serviceConnectionPoint* object in Active Directory.

    Each DC Agent service for password protection also creates a *serviceConnectionPoint* object in Active Directory. This object is used primarily for reporting and diagnostics.

1. The DC Agent service is responsible for initiating the download of a new password policy from Azure AD. The first step is to locate an Azure AD Password Protection Proxy service by querying the forest for proxy *serviceConnectionPoint* objects.

    When an available proxy service is found, the DC Agent sends a password policy download request to the proxy service. The proxy service in turn sends the request to Azure AD. The proxy service then returns the response to the DC Agent service.

1. After the DC Agent service receives a new password policy from Azure AD, the service stores the policy in a dedicated folder at the root of its domain *sysvol* folder share. The DC Agent service also monitors this folder in case newer policies replicate in from other DC Agent services in the domain.

1. The DC Agent service always requests a new policy at service startup. After the DC Agent service is started, it checks the age of the current locally available policy hourly. If the policy is older than one hour, the DC Agent requests a new policy from Azure AD via the proxy service, as described previously. If the current policy isn't older than one hour, the DC Agent continues to use that policy.

### Key considerations and features

* Whenever an Azure AD password protection password policy is downloaded, that policy is specific to a tenant. In other words, password policies are always a combination of the Microsoft global banned-password list and the per-tenant custom banned-password list.
* The DC Agent communicates with the proxy service via RPC over TCP. The proxy service listens for these calls on a dynamic or static RPC port, depending on the configuration.
* The DC Agent never listens on a network-available port.
* The proxy service never calls the DC Agent service.
* The proxy service is stateless. It never caches policies or any other state downloaded from Azure.
* The DC Agent service always uses the most recent locally available password policy to evaluate a user's password. If no password policy is available on the local DC, the password is automatically accepted. When that happens, an event message is logged to warn the administrator.
* Azure AD password protection isn't a real-time policy application engine. There can be a delay between when a password policy configuration change is made in Azure AD and when that change reaches and is enforced on all DCs.
* Azure AD password protection acts as a supplement to the existing AD DS password policies, not a replacement. This includes any other 3rd-party password filter dlls that may be installed. AD DS always requires that all password validation components agree before accepting a password.

## Forest / tenant binding for password protection

Deployment of Azure AD password protection in an AD DS forest requires registration of that forest with Azure AD. Each proxy service that is deployed must also be registered with Azure AD. These forest and proxy registrations are associated with a specific Azure AD tenant, which is identified implicitly by the credentials that are used during registration.

The AD DS forest and all deployed proxy services within a forest must be registered with the same tenant. It's not supported to have an AD DS forest or any proxy services in that forest being registered to different Azure AD tenants. Symptoms of such a mis-configured deployment include the inability to download password policies.

## Download

The two required agent installers for Azure AD password protection are available from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=57071).

## Next steps

To get started with using on-premises password protection, complete the following how-to:

> [!div class="nextstepaction"]
> [Deploy on-premises Azure AD password protection](howto-password-ban-bad-on-premises-deploy.md)
