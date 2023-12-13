---
title: Management and monitoring security features - Microsoft Azure | Microsoft Docs
description: This article provides an overview of the security features and services that Azure provides to aid in the management and monitoring of Azure cloud services and virtual machines.
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin

ms.assetid: 5cf2827b-6cd3-434d-9100-d7411f7ed424
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/20/2023
ms.author: terrylan

---
# Azure security management and monitoring overview
This article provides an overview of the security features and services that Azure provides to aid in the management and monitoring of Azure cloud services and virtual machines.

## Azure role-based access control

Azure role-based access control (Azure RBAC) provides detailed access management for Azure resources. By using Azure RBAC, you can grant people only the amount of access that they need to perform their jobs. Azure RBAC can also help you ensure that when people leave the organization, they lose access to resources in the cloud.

Learn more:

* [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md)

## Antimalware

With Azure, you can use antimalware software from major security vendors such as Microsoft, Symantec, Trend Micro, McAfee, and Kaspersky. This software helps protect your virtual machines from malicious files, adware, and other threats.

Microsoft Antimalware for Azure Cloud Services and Virtual Machines offers you the ability to install an antimalware agent for both PaaS roles and virtual machines. Based on System Center Endpoint Protection, this feature brings proven on-premises security technology to the cloud.

Symantec Endpoint Protection (SEP) is also supported on Azure. Through portal integration, you can specify that you intend to use SEP on a VM. SEP can be installed on a new VM via the Azure portal, or it can be installed on an existing VM via PowerShell.

Learn more:

* [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](antimalware.md)
* [New Antimalware Options for Protecting Azure Virtual Machines](https://azure.microsoft.com/blog/new-antimalware-options-for-protecting-azure-virtual-machines/)

<a name='multi-factor-authentication'></a>

## Multifactor authentication

Microsoft Entra multifactor authentication is a method of authentication that requires the use of more than one verification method. It adds a critical second layer of security to user sign-ins and transactions.

Multifactor authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification options (phone call, text message, or mobile app notification or verification code) and third-party OATH tokens.

Learn more:

* [Multifactor authentication](../../active-directory/authentication/overview-authentication.md#azure-ad-multi-factor-authentication)
* [How Microsoft Entra multifactor authentication works](../../active-directory/authentication/concept-mfa-howitworks.md)

## ExpressRoute

You can use Azure ExpressRoute to extend your on-premises networks into the Microsoft Cloud over a dedicated private connection that's facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services such as Azure, Microsoft 365, and CRM Online. Connectivity can be from:

* An any-to-any (IP VPN) network.
* A point-to-point Ethernet network.
* A virtual cross-connection through a connectivity provider at a co-location facility.

ExpressRoute connections don't go over the public internet. They can offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the internet.

Learn more:

* [ExpressRoute technical overview](../../expressroute/expressroute-introduction.md)

## Virtual network gateways

VPN gateways, also called Azure virtual network gateways, are used to send network traffic between virtual networks and on-premises locations. They are also used to send traffic between multiple virtual networks within Azure (network to network). VPN gateways provide secure cross-premises connectivity between Azure and your infrastructure.

Learn more:

* [About VPN gateways](../../vpn-gateway/vpn-gateway-about-vpngateways.md)
* [Azure network security overview](network-overview.md)

## Privileged Identity Management

Sometimes users need to carry out privileged operations in Azure resources or other SaaS applications. This often means organizations give them permanent privileged access in Microsoft Entra ID.

This is a growing security risk for cloud-hosted resources because organizations can't sufficiently monitor what those users are doing with their privileged access. Additionally, if a user account with privileged access is compromised, that one breach can affect an organization's overall cloud security. Microsoft Entra Privileged Identity Management helps to resolve this risk by lowering the exposure time of privileges and increasing visibility into usage.  

Privileged Identity Management introduces the concept of a temporary admin for a role or “just in time” administrator access. This kind of admin is a user who needs to complete an activation process for that assigned role. The activation process changes the assignment of the user to a role in Microsoft Entra ID from inactive to active, for a specified time period.

Learn more:

* [Microsoft Entra Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md)
* [Start using Privileged Identity Management](../../active-directory/privileged-identity-management/pim-getting-started.md)

## Identity Protection

Microsoft Entra ID Protection provides a consolidated view of suspicious sign-in activities and potential vulnerabilities to help protect your business. Identity Protection detects suspicious activities for users and privileged (admin) identities, based on signals like:

* Brute-force attacks.
* Leaked credentials.
* Sign-ins from unfamiliar locations and infected devices.

By providing notifications and recommended remediation, Identity Protection helps to mitigate risks in real time. It calculates user risk severity. You can configure risk-based policies to automatically help safeguard application access from future threats.

Learn more:

* [Microsoft Entra ID Protection](../../active-directory/identity-protection/concept-identity-protection-security-overview.md)

## Defender for Cloud

Microsoft Defender for Cloud helps you prevent, detect, and respond to threats. Defender for Cloud gives you increased visibility into, and control over, the security of your Azure resources as well as those in your hybrid cloud environment. 

Defender for Cloud performs continuous security assessments of your connected resources and compares their configuration and deployment against the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) to provide detailed security recommendations tailored for your environment.

Defender for Cloud helps you optimize and monitor the security of your Azure resources by:

- Enabling you to define policies for your Azure subscription resources according to:
    - Your organization's security needs.
    - The type of applications or sensitivity of the data in each subscription.
    - Any industry or regulatory standards or benchmarks you apply to your subscriptions.
- Monitoring the state of your Azure virtual machines, networking, and applications.
- Providing a list of prioritized security alerts, including alerts from integrated partner solutions. It also provides the information that you need to quickly investigate an attack and recommendations on how to remediate it.

Learn more:

* [Introduction to Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md)
* [Improve your secure score in Microsoft Defender for Cloud](../../defender-for-cloud/secure-score-security-controls.md)

## Next Steps
Learn about the [shared responsibility model](shared-responsibility.md) and which security tasks are handled by Microsoft and which tasks are handled by you.

For more information about security management, see [Security management in Azure](management.md).
