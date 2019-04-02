---
title: Azure AD password protection - Azure Active Directory
description: Ban weak passwords in on-premises Active Directory by using Azure AD password protection

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 02/18/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jsimmons
ms.collection: M365-identity-device-management
---

# Enforce Azure AD password protection for Windows Server Active Directory

Azure AD password protection is a feature that enhances password policies in an organization. On-premises deployment password protection uses both the global and custom banned-password lists that are stored in Azure AD. It does the same checks on-premises as Azure AD for cloud-based changes.

## Design principles

Azure AD password protection is designed with these principles in mind:

* Domain controllers never have to communicate directly with the internet.
* No new network ports are opened on domain controllers.
* No Active Directory schema changes are required. The software uses the existing Active Directory **container** and **serviceConnectionPoint** schema objects.
* No minimum Active Directory domain or forest functional level (DFL/FFL) is required.
* The software doesn't create or require accounts in the Active Directory domains that it protects.
* User clear-text passwords don't leave the domain controller during password validation operations or at any other time.
* Incremental deployment is supported. But the password policy is only enforced where the Domain Controller Agent (DC Agent) is installed.
* We recommend that you install the DC Agent on all domain controllers to ensure universal password protection security enforcement.

## Architectural diagram

It's important to understand the underlying design and function concepts before you deploy Azure AD password protection in an on-premises Active Directory environment. The following diagram shows how the components of password protection work together:

![How Azure AD password protection components work together](./media/concept-password-ban-bad-on-premises/azure-ad-password-protection.png)

* The Azure AD Password Protection Proxy service runs on any domain-joined machine in the current Active Directory forest. Its primary purpose is to forward password policy download requests from domain controllers to Azure AD. It then returns the responses from Azure AD to the domain controller.
* The password filter DLL of the DC Agent receives user password-validation requests from the operating system. It forwards them to the DC Agent service that's running locally on the domain controller.
* The DC Agent service of password protection receives password-validation requests from the password filter DLL of the DC Agent. It processes them by using the current (locally available) password policy and returns the result: *pass* or *fail*.

## How password protection works

Each Azure AD Password Protection Proxy service instance advertises itself to the domain controllers in the forest by creating a **serviceConnectionPoint** object in Active Directory.

Each DC Agent service for password protection also creates a **serviceConnectionPoint** object in Active Directory. This object is used primarily for reporting and diagnostics.

The DC Agent service is responsible for initiating the download of a new password policy from Azure AD. The first step is to locate an Azure AD Password Protection Proxy service by querying the forest for proxy **serviceConnectionPoint** objects. When an available proxy service is found, the DC Agent sends a password policy download request to the proxy service. The proxy service in turn sends the request to Azure AD. The proxy service then returns the response to the DC Agent service.

After the DC Agent service receives a new password policy from Azure AD, the service stores the policy in a dedicated folder at the root of its domain *sysvol* folder share. The DC Agent service also monitors this folder in case newer policies replicate in from other DC Agent services in the domain.

The DC Agent service always requests a new policy at service startup. After the DC Agent service is started, it checks the age of the current locally available policy hourly. If the policy is older than one hour, the DC Agent requests a new policy from Azure AD, as described previously. If the current policy isn't older than one hour, the DC Agent continues to use that policy.

Whenever an Azure AD password protection password policy is downloaded, that policy is specific to a tenant. In other words, password policies are always a combination of the Microsoft global banned-password list and the per-tenant custom banned-password list.

The DC Agent communicates with the proxy service via RPC over TCP. The proxy service listens for these calls on a dynamic or static RPC port, depending on the configuration.

The DC Agent never listens on a network-available port.

The proxy service never calls the DC Agent service.

The proxy service is stateless. It never caches policies or any other state downloaded from Azure.

The DC Agent service always uses the most recent locally available password policy to evaluate a user's password. If no password policy is available on the local DC, the password is automatically accepted. When that happens, an event message is logged to warn the administrator.

Azure AD password protection isn't a real-time policy application engine. There can be a delay between when a password policy configuration change is made in Azure AD and when that change reaches and is enforced on all domain controllers.

## Forest/tenant binding for password protection

Deployment of Azure AD password protection in an Active Directory forest requires registration of that forest with Azure AD. Each proxy service that is deployed must also be registered with Azure AD. These forest and proxy registrations are associated with a specific Azure AD tenant, which is identified implicitly by the credentials that are used during registration.

The Active Directory forest and all deployed proxy services within a forest must be registered with the same tenant. It is not supported to have an Active Directory forest or any proxy services in that forest being registered to different Azure AD tenants. Symptoms of such a mis-configured deployment include the inability to download password policies.

## License requirements

The benefits of the global banned password list apply to all users of Azure AD.

The custom banned-password list requires Azure AD Basic licenses.

Azure AD password protection for Windows Server Active Directory requires Azure AD Premium licenses.

For additional licensing information, see [Azure Active Directory pricing](https://azure.microsoft.com/pricing/details/active-directory/).

## Download

The two required agent installers for Azure AD password protection are available from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=57071).

## Next steps
[Deploy Azure AD password protection](howto-password-ban-bad-on-premises-deploy.md)
