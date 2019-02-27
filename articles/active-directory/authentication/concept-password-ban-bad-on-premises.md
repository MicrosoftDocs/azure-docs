---
title: Azure AD password protection preview
description: Ban weak passwords in on-premises Active Directory using the Azure AD password protection preview

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

# Preview: Enforce Azure AD password protection for Windows Server Active Directory

|     |
| --- |
| Azure AD password protection and the custom banned password list are public preview features of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

Azure AD password protection is a new feature in public preview powered by Azure Active Directory (Azure AD) to enhance password policies in an organization. The on-premises deployment of Azure AD password protection uses both the global and custom banned password lists stored in Azure AD, and performs the same checks on-premises as Azure AD cloud-based changes.

## Design principles

Azure AD Password Protection for Active Directory is designed with the following principles in mind:

* Domain controllers are never required to communicate directly with the Internet
* No new network ports are opened on domain controllers.
* No Active Directory schema changes are required. The software uses the existing Active Directory container and serviceConnectionPoint schema objects.
* No minimum Active Directory Domain or Forest Functional level (DFL\FFL) is required.
* The software does not create or require any accounts in the Active Directory domains it protects.
* User clear-text passwords never leave the domain controller (whether during password validation operations or at any other time).
* Incremental deployment is supported with the tradeoff that password policy is only enforced where the domain controller agent is installed.
* It is recommended to install the DC agent on all DCs to ensure ubiquitous password protection security enforcement.

## Architectural diagram

It is important to have an understanding of the underlying design and functional concepts before deploying Azure AD Password Protection in an on-premises Active Directory environment. The following diagram shows how the components of Azure AD Password Protection work together:

![How Azure AD password protection components work together](./media/concept-password-ban-bad-on-premises/azure-ad-password-protection.png)

The above diagram shows the three basic software components that make up Azure AD password protection:

* The Azure AD Password Protection Proxy service runs on any domain-joined machine in the current Active Directory forest. Its primary purpose is to forward password policy download requests from domain controllers to Azure AD and return the response from Azure AD back to the domain controller.
* The Azure AD Password Protection DC Agent password filter dll receives user password validation requests from the operating system and forwards them to the Azure AD Password Protection DC Agent service running locally on the domain controller.
* The Azure AD Password Protection DC Agent service receives password validation requests from the DC Agent password filter dll, processes them using the current (locally available) password policy, and returns the result (pass\fail).

## Theory of operations

So given the above diagram and design principles, how does Azure AD Password Protection actually work?

Each Azure AD Password Protection Proxy service advertises itself to domain controllers in the forest by creating a serviceConnectionPoint object in Active Directory.

Each Azure AD Password Protection DC Agent service also creates a serviceConnectionPoint object in Active Directory. However this is used primarily for reporting and diagnostics.

The Azure AD Password Protection DC Agent service is responsible for initiating the download of a new password policy from Azure AD. The first step is to locate an Azure AD Password Protection Proxy service by querying the forest for proxy serviceConnectionPoint objects. Once an available proxy service is found, a password policy download request is sent from the DC agent service to the proxy service, which in turn sends it to Azure AD, and then returns the response to the DC agent service. After receiving a new password policy from Azure AD, the DC agent service stores the policy in a dedicated folder at the root of its domain sysvol share. The DC agent service also monitors this folder in case newer policies replicate in from other DC agent services in the domain.

The Azure AD Password Protection DC Agent service will always request a new policy on service startup. After the DC Agent service is started, it will periodically (once every hour) check the age of the current locally available policy; if the current policy is older than one hour the DC agent service will request a new policy from Azure AD as described above, otherwise the DC agent will continue to use the current policy.

The Azure AD Password Protection DC Agent service communicates with the Azure AD Password Protection Proxy service using RPC (Remote Procedure Call) over TCP. The Proxy service listens for these calls on either a dynamic or static RPC port (as configured).

The Azure AD Password Protection DC Agent never listens on a network-available port and the Proxy service never attempts to call the DC agent service.

The Azure AD Password Protection Proxy service is stateless; it never caches policies or any other state downloaded from Azure.

The Azure AD Password Protection DC Agent service will only ever evaluate a user's password using the most recent locally available password policy. If no password policy is available on the local DC, the password will be automatically accepted and an event log message will be logged to warn the administrator.

Azure AD Password Protection is not a real-time policy application engine. There may be a delay in the time between a password policy configuration change is made in Azure AD and the time it reaches and is enforced on all domain controllers.

## Forest\tenant binding for Azure AD Password Protection

Deployment of Azure AD Password Protection in an Active Directory forest requires registration of the Active Directory forest, and any deployed Azure AD Password Protection Proxy services, with Azure AD. Both such registrations (forest and proxies) are associated with a specific Azure AD tenant which is identified implicitly via the credentials used during registration. Anytime an Azure AD Password Protection password policy is downloaded, it is always specific to this tenant (i.e., that policy will always be a combination of the Microsoft global banned password list and the per-tenant custom banned password list). It is not supported to configure different domains or proxies in a forest to be bound to different Azure AD tenants.

## License requirements

The benefits of the global banned password list apply to all users of Azure Active Directory (Azure AD).

The custom banned password list requires Azure AD Basic licenses.

Azure AD Password Protection for Windows Server Active Directory requires Azure AD Premium licenses.

Additional licensing information, including costs, can be found on the [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/).

## Download

The two required agent installers for Azure AD Password Protection that can be downloaded from the [Microsoft download center](https://www.microsoft.com/download/details.aspx?id=57071)

## Next steps

[Deploy Azure AD password protection](howto-password-ban-bad-on-premises-deploy.md)
