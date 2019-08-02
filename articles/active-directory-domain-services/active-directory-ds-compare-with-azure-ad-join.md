---
title: 'Compare Azure AD Join and Azure Active Directory Domain Services | Microsoft Docs'
description: Deciding between Azure AD Join and Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: 31a71d36-58c1-4839-b958-80da0c6a77eb
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/20/2019
ms.author: iainfou
---

# Choose between Azure Active Directory join and Azure Active Directory Domain Services
This article describes differences between Azure Active Directory (AD) join and Azure AD Domain Services and helps you choose, based on your use-cases.

## Azure AD registered and Azure AD joined devices
Azure AD enables you to manage the identity of devices used by your organization and control access to corporate resources from these devices. Users can register their personal (bring-your-own) device with Azure AD, which provides the device with an identity. Subsequently, Azure AD can authenticate the device when a user signs in to Azure AD and uses the device to access secured resources. Further, you can manage the device using Mobile Device Management (MDM) software like Microsoft Intune. This feature enables you to restrict access to sensitive resources from managed and policy-compliant devices.

You can also join organization owned devices to Azure AD. This mechanism offers the same benefits of registering a personal device with Azure AD. Additionally, users can sign in to the device using their corporate credentials. Azure AD joined devices give you the following benefits:
* Single-sign-on (SSO) to applications secured by Azure AD
* Enterprise policy-compliant roaming of user settings across devices.
* Access to the Windows Store for Business using your corporate credentials.
* Windows Hello for Business
* Restricted access to apps and resources from devices compliant with corporate policy.

| **Type of device** | **Device platforms** | **Mechanism** |
|:---| --- | --- |
| Personal devices | Windows 10, iOS, Android, Mac OS | Azure AD registered |
| Organization owned device not joined to on-premises AD | Windows 10 | Azure AD joined |
| Organization owned device joined to an on-premises AD | Windows 10 | Hybrid Azure AD joined |

On an Azure AD joined or registered device, user authentication happens using modern OAuth/OpenID Connect based protocols. These protocols are designed to work over the internet and are great for mobile scenarios where users access corporate resources from anywhere.


## Domain join to Azure AD Domain Services managed domains
Azure AD Domain Services provides a managed AD domain in an Azure virtual network. You can join machines to this managed domain using traditional domain-join mechanisms. Windows client (Windows 7, Windows 10) and Windows Server machines can be joined to the managed domain. Additionally, you can also join Linux and Mac OS machines to the managed domain. When you join a machine to an AD domain, users can sign in to the machine using their corporate credentials. These machines can be managed using Group Policy, thus enforcing compliance with your organization's security policies.

On a domain-joined machine, user authentication happens using NTLM or Kerberos authentication protocols. The domain-joined machine needs line of sight to the domain controllers of the managed domain in order for user authentication to work. Therefore, the domain joined machine needs to be on the same virtual network as the managed domain. Alternately, the domain joined machine needs to be connected to the managed domain over a peered virtual network or over a site-to-site VPN/ExpressRoute connection. Thus, this mechanism isn't a great fit for devices that are mobile or connect to resources from outside the corporate network.

> [!NOTE]
> Technically, it is possible to join an on-premises client workstation to the managed domain over a site-to-site VPN or ExpressRoute connection. However, for end-user devices we strongly recommend you use either register the device with Azure AD (personal devices) or join the device to Azure AD (corporate devices). This mechanism works better over the internet and enables end users to work from anywhere. Azure AD Domain Services is great for Windows or Linux Server virtual machines deployed in your Azure virtual networks, on which your applications are deployed.


## Summary - key differences
| **Aspect** | **Azure AD Join** | **Azure AD Domain Services** |
|:---| --- | --- |
| Device controlled by | Azure AD | Azure AD Domain Services managed domain |
| Representation in the directory | Device objects in the Azure AD directory. | Computer objects in the AAD-DS managed domain. |
| Authentication | OAuth/OpenID Connect based protocols | Kerberos, NTLM protocols |
| Management | Mobile Device Management (MDM) software like Intune | Group Policy |
| Networking | Works over the internet | Requires machines to be on the same virtual network as the managed domain.|
| Great for ... | End-user mobile or desktop devices | Server virtual machines deployed in Azure |


## Next steps
### Learn more about Azure AD Domain Services
* [Overview of Azure AD Domain Services](overview.md)
* [Features](active-directory-ds-features.md)
* [Deployment scenarios](scenarios.md)
* [Find out if Azure AD Domain Services suits your use-cases](comparison.md)
* [Understand how Azure AD Domain Services synchronizes with your Azure AD directory](synchronization.md)

### Learn more about Azure AD Join
* [Introduction to device management in Azure Active Directory](../active-directory/device-management-introduction.md)

### Get started with Azure AD Domain Services
* [Enable Azure AD Domain Services using the Azure portal](create-instance.md)
