<properties
   pageTitle="Azure Security Management and Monitoring Overview | Microsoft Azure"
   description=" Azure provides security mechanisms to aid in the management and monitoring of Azure cloud services and virtual machines.  This article provides an overview of these core security features and services. "
   services="security"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="StevenPo"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/26/2016"
   ms.author="terrylan"/>

# Azure Security Management and Monitoring Overview

Azure provides security mechanisms to aid in the management and monitoring of Azure cloud services and virtual machines. This article provides an overview of these core security features and services. Links are provided to articles that will give details of each so you can learn more.

The security of your Microsoft cloud services is a partnership and shared responsibility between you and Microsoft. Shared responsibility means Microsoft is responsible for the Microsoft Azure and physical security of its data centers (through the use of security protections such as locked badge entry doors, fences, and guards). In addition, Azure provides strong levels of cloud security at the software layer that meets the security, privacy, and compliance needs of its demanding customers.

You own your data and identities, the responsibility for protecting them, the security of your on-premises resources, and the security of cloud components over which you have control. Microsoft provides you with security controls and capabilities to help you protect your data and applications. Your responsibility for security is based on the type of cloud service.

The following chart summarizes the balance of responsibility for both Microsoft and the customer.

![Shared responsibility][1]

For a deeper dive into security management, see [Security management in Azure](azure-security-management.md).

Here are the core features to be covered in this article:

- Role-Based Access Control
- Antimalware
- Multi-Factor Authentication
- ExpressRoute
- Virtual network gateways
- Privileged identity management
- Identity protection
- Security Center

## Role-Based Access Control

Role-Based Access Control (RBAC) provides fine-grained access management for Azure resources. Using RBAC, you can grant people only the amount of access that they need to perform their jobs.  RBAC can also help you ensure that when people leave the organization they lose access to resources in the cloud.

Learn more:

- [Active Directory team blog on RBAC](http://i1.blogs.technet.com/b/ad/archive/2015/10/12/azure-rbac-is-ga.aspx)
- [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md)

## Antimalware

With Azure you can use antimalware software from major security vendors such as Microsoft, Symantec, Trend Micro, McAfee, and Kaspersky to help protect your virtual machines from malicious files, adware, and other threats.

Microsoft Antimalware offers you the ability to install an antimalware agent for both PaaS roles and virtual machines. Based on System Center Endpoint Protection, this feature brings proven on-premises security technology to the cloud.

We also offer deep integration for Trend’s [Deep Security](http://www.trendmicro.com/us/enterprise/cloud-solutions/deep-security/)™ and [SecureCloud](http://www.trendmicro.com/us/enterprise/cloud-solutions/secure-cloud/)™ products in the Azure platform. DeepSecurity is an Antivirus solution and SecureCloud is an encryption solution. DeepSecurity will be deployed inside of VMs using an extension model. Using the portal UI and PowerShell, you can choose to use DeepSecurity inside of new VMs that are being spun up, or existing VMs that are already deployed.

Symantec End Point Protection (SEP) is also supported on Azure. Through portal integration, customers have the ability to specify that they intend to use SEP within a VM. SEP can be installed on a brand new VM via the Azure Portal or can be installed on an existing VM using PowerShell.

Learn more:

- [Deploying Antimalware Solutions on Azure Virtual Machines](https://azure.microsoft.com/blog/deploying-antimalware-solutions-on-azure-virtual-machines/)
- [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../azure-security-antimalware.md)
- [How to install and configure Trend Micro Deep Security as a Service on a Windows VM](../virtual-machines/virtual-machines-windows-classic-install-trend.md)
- [How to install and configure Symantec Endpoint Protection on a Windows VM](../virtual-machines/virtual-machines-windows-classic-install-symantec.md)
- [New Antimalware Options for Protecting Azure Virtual Machines – McAfee Endpoint Protection](https://azure.microsoft.com/blog/new-antimalware-options-for-protecting-azure-virtual-machines/)

## Multi-Factor Authentication

Azure Multi-factor authentication (MFA) is a method of authentication that requires the use of more than one verification method and adds a critical second layer of security to user sign-ins and transactions. MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication via a range of verification options—phone call, text message, or mobile app notification or verification code and 3rd party OATH tokens.

Learn more:

- [Multi-factor authentication](https://azure.microsoft.com/documentation/services/multi-factor-authentication/)
- [What is Azure Multi-Factor Authentication?](../multi-factor-authentication/multi-factor-authentication.md)
- [How Azure Multi-Factor Authentication works](../multi-factor-authentication/multi-factor-authentication-how-it-works.md)

## ExpressRoute

Microsoft Azure ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a dedicated private connection facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services, such as Microsoft Azure, Office 365, and CRM Online. Connectivity can be from an any-to-any (IP VPN) network, a point-to-point Ethernet network, or a virtual cross-connection through a connectivity provider at a co-location facility. ExpressRoute connections do not go over the public Internet. This allows ExpressRoute connections to offer more reliability, faster speeds, lower latencies, and higher security than typical connections over the Internet.

Learn more:

- [ExpressRoute technical overview](../expressroute/expressroute-introduction.md)

## Virtual network gateways

VPN Gateways, also called Azure Virtual Network Gateways, are used to send network traffic between virtual networks and on-premises locations. They are also used to send traffic between multiple virtual networks within Azure (VNet-to-VNet).  VPN gateways provide secure cross-premises connectivity between Azure and your infrastructure.

Learn more:

- [About VPN gateways](../vpn-gateway/vpn-gateway-about-vpngateways.md)
- [Azure Network Security Overview](security-network-overview.md)

## Privileged Identity Management

Sometimes users need to carry out privileged operations in Azure resources or other SaaS applications. This often means organizations have to give them permanent privileged access in Azure Active Directory (Azure AD). This is a growing security risk for cloud-hosted resources because organizations can't sufficiently monitor what those users are doing with their privileged access.
Additionally, if a user account with privileged access is compromised, that one breach could impact your overall cloud security. Azure AD Privileged Identity Management helps to resolve this risk by lowering the exposure time of privileges and increasing visibility into usage.  

Privileged Identity Management introduces the concept of a temporary admin for a role or “just in time” administrator access, which is a user who needs to complete an activation process for that assigned role. The activation process changes the assignment of the user to a role in Azure AD from inactive to active, for a specified time period such as 8 hours.

Learn more:

- [Azure AD Privileged Identity Management](../active-directory/active-directory-privileged-identity-management-configure.md)
- [Get started with Azure AD Privileged Identity Management](../active-directory/active-directory-privileged-identity-management-getting-started.md)

## Identity Protection

Azure Active Directory (AD) Identity Protection provides a consolidated view of suspicious sign-in activities and potential vulnerabilities to help protect your business. Identity Protection detects suspicious activities for users and privileged (admin) identities, based on signals like brute-force attacks, leaked credentials, and sign-ins from unfamiliar locations and infected devices.

By providing notifications and recommended remediation, Identity Protection helps to mitigate risks in real time. It calculates user risk severity, and you can configure risk-based policies to automatically help safeguard application access from future threats.

Learn more:

- [Azure Active Directory Identity Protection](../active-directory/active-directory-identityprotection.md)
- [Channel 9: Azure AD and Identity Show: Identity Protection Preview](https://channel9.msdn.com/Series/Azure-AD-Identity/Azure-AD-and-Identity-Show-Identity-Protection-Preview)

## Security Center

Azure Security Center helps you prevent, detect, and respond to threats, and provides you increased visibility into, and control over, the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

Security Center helps you optimize and monitor the security of your Azure resources by:

- Enabling you to define policies for your Azure subscription resources according to your company’s security needs and the type of applications or sensitivity of the data in each subscription.
- Monitoring the state of your Azure virtual machines, networking, and applications.
- Providing a list of prioritized security alerts, including alerts from integrated partner solutions, along with the information you need to quickly investigate and recommendations on how to remediate an attack.

Learn more:

- [Introduction to Azure Security Center](../security-center/security-center-intro.md)

<!--Image references-->
[1]: ./media/security-management-and-monitoring-overview/shared-responsibility.png
