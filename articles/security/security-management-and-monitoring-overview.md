---
title: Management and monitoring security features - Microsoft Azure | Microsoft Docs
description: This article provides an overview of the security features and services that Azure provides to aid in the management and monitoring of Azure cloud services and virtual machines.
services: security
documentationcenter: na
author: TerryLanfear
manager: barbkess
editor: TomSh

ms.assetid: 5cf2827b-6cd3-434d-9100-d7411f7ed424
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/28/2019
ms.author: terrylan

---
# Azure security management and monitoring overview
This article provides an overview of the security features and services that Azure provides to aid in the management and monitoring of Azure cloud services and virtual machines.

## Shared responsibility

The security of your Microsoft cloud services is a partnership and a shared responsibility between you and Microsoft. Microsoft is responsible for the Azure platform and the physical security of its datacenters (by using security protections such as locked badge-entry doors, fences, and guards). Azure provides strong levels of cloud security at the software layer that meets the security, privacy, and compliance needs of its customers.

You own your data and identities, the responsibility for protecting them, the security of your on-premises resources, and the security of cloud components over which you have control. Microsoft gives you security controls and capabilities to help you protect your data and applications. Your degree of responsibility for security is based on the type of cloud service.

The following chart summarizes the balance of responsibility between Microsoft and the customer.

![Shared responsibility][1]

For more information about security management, see [Security management in Azure](azure-security-management.md).

## Role-Based Access Control

Role-Based Access Control (RBAC) provides detailed access management for Azure resources. By using RBAC, you can grant people only the amount of access that they need to perform their jobs. RBAC can also help you ensure that when people leave the organization, they lose access to resources in the cloud.

Learn more:

* [Active Directory team blog on RBAC](https://cloudblogs.microsoft.com/enterprisemobility/?product=azure-active-directory)
* [Azure Role-Based Access Control](../role-based-access-control/role-assignments-portal.md)

## Antimalware

With Azure, you can use antimalware software from major security vendors such as Microsoft, Symantec, Trend Micro, McAfee, and Kaspersky. This software helps protect your virtual machines from malicious files, adware, and other threats.

Microsoft Antimalware for Azure Cloud Services and Virtual Machines offers you the ability to install an antimalware agent for both PaaS roles and virtual machines. Based on System Center Endpoint Protection, this feature brings proven on-premises security technology to the cloud.

We also offer deep integration for Trend’s [Deep Security](https://www.trendmicro.com/us/enterprise/cloud-solutions/deep-security/) and [SecureCloud](https://www.trendmicro.com/us/enterprise/cloud-solutions/secure-cloud/) products in the Azure platform. Deep Security is an antivirus solution, and SecureCloud is an encryption solution. Deep Security is deployed inside VMs through an extension model. By using the Azure portal UI and PowerShell, you can choose to use Deep Security inside new VMs that are being spun up, or existing VMs that are already deployed.

Symantec Endpoint Protection (SEP) is also supported on Azure. Through portal integration, you can specify that you intend to use SEP on a VM. SEP can be installed on a new VM via the Azure portal, or it can be installed on an existing VM via PowerShell.

Learn more:

* [Deploying Antimalware Solutions on Azure Virtual Machines](https://azure.microsoft.com/blog/deploying-antimalware-solutions-on-azure-virtual-machines/)
* [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](azure-security-antimalware.md)
* [How to install and configure Trend Micro Deep Security as a Service on a Windows VM](../virtual-machines/windows/classic/install-trend.md)
* [How to install and configure Symantec Endpoint Protection on a Windows VM](../virtual-machines/windows/classic/install-symantec.md)
* [New Antimalware Options for Protecting Azure Virtual Machines](https://azure.microsoft.com/blog/new-antimalware-options-for-protecting-azure-virtual-machines/)

## Multi-Factor Authentication

Azure Multi-Factor Authentication is a method of authentication that requires the use of more than one verification method. It adds a critical second layer of security to user sign-ins and transactions.

Multi-Factor Authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification options (phone call, text message, or mobile app notification or verification code) and third-party OATH tokens.

Learn more:

* [Multi-Factor Authentication](https://azure.microsoft.com/documentation/services/multi-factor-authentication/)
* [What is Azure Multi-Factor Authentication?](../active-directory/authentication/multi-factor-authentication.md)
* [How Azure Multi-Factor Authentication works](../active-directory/authentication/concept-mfa-howitworks.md)

## ExpressRoute

You can use Azure ExpressRoute to extend your on-premises networks into the Microsoft Cloud over a dedicated private connection that's facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services such as Azure, Office 365, and CRM Online. Connectivity can be from:

* An any-to-any (IP VPN) network.
* A point-to-point Ethernet network.
* A virtual cross-connection through a connectivity provider at a co-location facility.

ExpressRoute connections don't go over the public internet. They can offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the internet.

Learn more:

* [ExpressRoute technical overview](../expressroute/expressroute-introduction.md)

## Virtual network gateways

VPN gateways, also called Azure virtual network gateways, are used to send network traffic between virtual networks and on-premises locations. They are also used to send traffic between multiple virtual networks within Azure (network to network). VPN gateways provide secure cross-premises connectivity between Azure and your infrastructure.

Learn more:

* [About VPN gateways](../vpn-gateway/vpn-gateway-about-vpngateways.md)
* [Azure network security overview](security-network-overview.md)

## Privileged Identity Management

Sometimes users need to carry out privileged operations in Azure resources or other SaaS applications. This often means organizations give them permanent privileged access in Azure Active Directory (Azure AD).

This is a growing security risk for cloud-hosted resources because organizations can't sufficiently monitor what those users are doing with their privileged access. Additionally, if a user account with privileged access is compromised, that one breach can affect an organization's overall cloud security. Azure AD Privileged Identity Management helps to resolve this risk by lowering the exposure time of privileges and increasing visibility into usage.  

Privileged Identity Management introduces the concept of a temporary admin for a role or “just in time” administrator access. This kind of admin is a user who needs to complete an activation process for that assigned role. The activation process changes the assignment of the user to a role in Azure AD from inactive to active, for a specified time period.

Learn more:

* [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md)
* [Get started with Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-getting-started.md)

## Identity Protection

Azure AD Identity Protection provides a consolidated view of suspicious sign-in activities and potential vulnerabilities to help protect your business. Identity Protection detects suspicious activities for users and privileged (admin) identities, based on signals like:

* Brute-force attacks.
* Leaked credentials.
* Sign-ins from unfamiliar locations and infected devices.

By providing notifications and recommended remediation, Identity Protection helps to mitigate risks in real time. It calculates user risk severity. You can configure risk-based policies to automatically help safeguard application access from future threats.

Learn more:

* [Azure Active Directory Identity Protection](../active-directory/active-directory-identityprotection.md)
* [Channel 9: Azure AD and Identity Show: Identity Protection Preview](https://channel9.msdn.com/Series/Azure-AD-Identity/Azure-AD-and-Identity-Show-Identity-Protection-Preview)

## Security Center

Azure Security Center helps you prevent, detect, and respond to threats. Security Center gives you increased visibility into, and control over, the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions. It helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

Security Center helps you optimize and monitor the security of your Azure resources by:

* Enabling you to define policies for your Azure subscription resources according to:
  * Your company’s security needs.
  * The type of applications or sensitivity of the data in each subscription.
* Monitoring the state of your Azure virtual machines, networking, and applications.
* Providing a list of prioritized security alerts, including alerts from integrated partner solutions. It also provides the information that you need to quickly investigate an attack and recommendations on how to remediate it.

Learn more:

* [Introduction to Azure Security Center](../security-center/security-center-intro.md)
* [Improve your secure score in Azure Security Center](../security-center/security-center-secure-score.md)

## Intelligent Security Graph

Intelligent Security Graph provides real-time threat protection in Microsoft products and services. It uses advanced analytics that link a massive amount of threat intelligence and security data to provide insights that can strengthen organizational security. Microsoft uses advanced analytics—processing more than 450 billion authentications per month, scanning 400 billion emails for malware and phishing, and updating one billion devices—to deliver richer insights. These insights can help your organization detect and respond to attacks quickly.

* [Intelligent Security Graph](https://www.microsoft.com/security/intelligence)

<!--Image references-->
[1]: ./media/security-management-and-monitoring-overview/shared-responsibility.png
