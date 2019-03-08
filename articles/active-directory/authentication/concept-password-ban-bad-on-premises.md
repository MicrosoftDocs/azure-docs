---
title: Password protection for Azure Active Directory preview
description: Ban weak passwords in on-premises Active Directory by using Password protection for Azure Active Directory preview

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

# Preview: Enforce password protection for Azure Active Directory for Windows Server Active Directory

|     |
| --- |
| Password protection for Azure Active Directory and the custom banned password list are public preview features of Azure Active Directory (Azure AD). For information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).|
|     |

Password protection for Azure Active Directory is a new feature in public preview that enhances password policies in an organization. On-premises deployment password protection uses both the global and custom banned password lists that are stored in Azure AD. It does the same checks on-premises as for Azure AD cloud-based changes.

## Design principles

Password protection for Active Directory is designed with these principles in mind:

* Domain controllers never have to communicate directly with the Internet.
* No new network ports are opened on domain controllers.
* No Active Directory schema changes are required. The software uses the existing Active Directory container and serviceConnectionPoint schema objects.
* No minimum Active Directory domain or forest functional level (DFL/FFL) is required.
* The software doesn't create or require accounts in the Active Directory domains that it protects.
* User clear-text passwords don't leave the domain controller during password validation operations or at any other time.
* Incremental deployment is supported. But the password policy is only enforced where the Domain Controller Agent is installed.
* We recommend that you install the DC Agent on all domain controllers to ensure ubiquitous password protection security enforcement.
## Architectural diagram

It's important to understand the underlying design and function concepts before you deploy password protection for Azure Active Directory in an on-premises Active Directory environment. The following diagram shows how the components of password protection work together:

![How password protection for Azure Active Directory components works together](./media/concept-password-ban-bad-on-premises/azure-ad-password-protection.png)

This diagram shows the three basic software components of password protection for Azure Active Directory:

* The password protection proxy service runs on any domain-joined machine in the current Active Directory forest. Its primary purpose is to forward password policy download requests from domain controllers to Azure AD. It then returns the responses from Azure AD to the domain controller.
* The password protection DC Agent password filter DLL receives user password-validation requests from the operating system. It forwards them to the password protection DC Agent service that's running locally on the domain controller.
* The password protection DC Agent service receives password-validation requests from the DC Agent password filter DLL. It processes them by using the current locally available password policy and returns the result: pass or fail.

## How password protection works

Each proxy service for password protection for Azure Active Directory advertises itself to domain controllers in the forest by creating a *serviceConnectionPoint* object in Active Directory.

Each password protection for Azure Active Directory
DC Agent service also creates a serviceConnectionPoint object in Active Directory. But this object is used primarily for reporting and diagnostics.

The DC Agent service is responsible for initiating the download of a new password policy from Azure AD. The first step is to locate a password protection proxy service by querying the forest for proxy serviceConnectionPoint objects. When an available proxy service is found, the DC agent sends a password policy download request to the proxy service. The proxy service in turn sends the request to Azure AD. The proxy service then returns the response to the DC Agent service. After the DC Agent service receives a new password policy from Azure AD, the service stores the policy in a dedicated folder at the root of its domain sysvol folder share. The DC Agent service also monitors this folder in case newer policies replicate in from other DC Agent services in the domain.

The password protection DC Agent service always requests a new policy at service startup. After the DC Agent service is started, it checks the age of the current locally available policy hourly. If the current policy is older than one hour, the DC Agent service requests a new policy from Azure AD, as described previously. If the current policy isn't older than one hour, the DC agent continues to use that policy.

The password protection DC Agent service communicates with the password protection proxy service via Remote Procedure Call (RPC) over TCP. The proxy service listens for these calls on a dynamic or static RPC port, depending on the configuration.

The password protection DC Agent never listens on a network-available port. And the proxy service never tries to call the DC Agent service.

The password protection proxy service is stateless. It never caches policies or any other state that's downloaded from Azure.

The password protection DC Agent service always uses the most recent locally available password policy to evaluate a user's password. If no password policy is available on the local DC, the password is automatically accepted. When that happens, an event message is logged to warn the administrator.

Password protection for Azure Active Directory is not a real-time policy application engine. There can be a delay between when a password policy configuration change is made in Azure AD and when that change reaches and is enforced on all domain controllers.

## Forest/tenant binding for password protection

Deployment of password protection in an Active Directory forest requires registration of that forest with Azure AD. Any deployed password protection for Azure Active Directory proxy services must also be registered. These forest and proxy registrations are associated with a specific Azure AD tenant. That tenant is identified implicitly by the credentials that are used during registration. Whenever a password protection password policy is downloaded, that policy is specific to the tenant. In other words, that policy is always a combination of the Microsoft global banned password list and the per-tenant custom banned password list. You can't configure different domains or proxies in a forest to be bound to different Azure AD tenants.

## License requirements

The benefits of the global banned password list apply to all users of Azure AD.

The custom banned password list requires Azure AD Basic licenses.

Password protection for Azure Active Directory for Windows Server Active Directory requires Azure AD Premium licenses.

For additional licensing information, see [Azure Active Directory pricing](https://azure.microsoft.com/pricing/details/active-directory/).

## Download

The two required agent installers for password protection for Azure Active Directory are available from the [Microsoft download center](https://www.microsoft.com/download/details.aspx?id=57071).

## Next steps

[Deploy password protection for Azure Active Directory](howto-password-ban-bad-on-premises-deploy.md)
