---
title: Enhance remote management security in Azure | Microsoft Docs
description: "This article discusses steps for enhancing remote management security while administering Microsoft Azure environments, including cloud services, virtual machines, and custom applications."
services: security
author: msmbaldwin
manager: rkarlin

ms.assetid: 2431feba-3364-4a63-8e66-858926061dd3
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.date: 09/03/2024
ms.author: mbaldwin

---
# Security management in Azure
Azure subscribers may manage their cloud environments from multiple devices, including management workstations, developer PCs, and even privileged end-user devices that have task-specific permissions. In some cases, administrative functions are performed through web-based consoles such as the [Azure portal](https://azure.microsoft.com/features/azure-portal/). In other cases, there may be direct connections to Azure from on-premises systems over Virtual Private Networks (VPNs), Terminal Services, client application protocols, or (programmatically) the Azure classic deployment model. Additionally, client endpoints can be either domain joined or isolated and unmanaged, such as tablets or smartphones.

Although multiple access and management capabilities provide a rich set of options, this variability can add significant risk to a cloud deployment. It can be difficult to manage, track, and audit administrative actions. This variability may also introduce security threats through unregulated access to client endpoints that are used for managing cloud services. Using general or personal workstations for developing and managing infrastructure opens unpredictable threat vectors such as web browsing (for example, watering hole attacks) or email (for example, social engineering and phishing).

![A diagram showing the different ways a threat could mount a attacks.](./media/management/typical-management-network-topology.png)

The potential for attacks increases in this type of environment because it's challenging to construct security policies and mechanisms to appropriately manage access to Azure interfaces (such as SMAPI) from widely varied endpoints.

### Remote management threats
Attackers often attempt to gain privileged access by compromising account credentials (for example, through password brute forcing, phishing, and credential harvesting), or by tricking users into running harmful code (for example, from harmful websites with drive-by downloads or from harmful email attachments). In a remotely managed cloud environment, account breaches can lead to an increased risk due to anywhere, anytime access.

Even with tight controls on primary administrator accounts, lower-level user accounts can be used to exploit weaknesses in one's security strategy. Lack of appropriate security training can also lead to breaches through accidental disclosure or exposure of account information.

When a user workstation is also used for administrative tasks, it can be compromised at many different points. Whether a user is browsing the web, using 3rd-party and open-source tools, or opening a harmful document file that contains a trojan.

In general, most targeted attacks that result in data breaches can be traced to browser exploits, plug-ins (such as Flash, PDF, Java), and spear phishing (email) on desktop machines. These machines may have administrative-level or service-level permissions to access live servers or network devices for operations when used for development or management of other assets.

### Operational security fundamentals
For more secure management and operations, you can minimize a client's attack surface by reducing the number of possible entry points. This can be done through security principles: "separation of duties" and "segregation of environments."

Isolate sensitive functions from one another to decrease the likelihood that a mistake at one level leads to a breach in another. Examples:

* Administrative tasks shouldn't be combined with activities that might lead to a compromise (for example, malware in an administrator's email that then infects an infrastructure server).
* A workstation used for high-sensitivity operations shouldn't be the same system used for high-risk purposes such as browsing the Internet.

Reduce the system's attack surface by removing unnecessary software. Example:

* Standard administrative, support, or development workstation shouldn't require installation of an email client or other productivity applications if the device's main purpose is to manage cloud services.

Client systems that have administrator access to infrastructure components should be subjected to the strictest possible policy to reduce security risks. Examples:

* Security policies can include Group Policy settings that deny open Internet access from the device and use of a restrictive firewall configuration.
* Use Internet Protocol security (IPsec) VPNs if direct access is needed.
* Configure separate management and development Active Directory domains.
* Isolate and filter management workstation network traffic.
* Use antimalware software.
* Implement multi-factor authentication to reduce the risk of stolen credentials.

Consolidating access resources and eliminating unmanaged endpoints also simplifies management tasks.

### Providing security for Azure remote management
Azure provides security mechanisms to aid administrators who manage Azure cloud services and virtual machines. These mechanisms include:

* Authentication and [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).
* Monitoring, logging, and auditing.
* Certificates and encrypted communications.
* A web management portal.
* Network packet filtering.

With client-side security configuration and datacenter deployment of a management gateway, it's possible to restrict and monitor administrator access to cloud applications and data.

> [!NOTE]
> Certain recommendations in this article may result in increased data, network, or compute resource usage, and may increase your license or subscription costs.
>
>

## Hardened workstation for management
The goal of hardening a workstation is to eliminate all but the most critical functions required for it to operate, making the potential attack surface as small as possible. System hardening includes minimizing the number of installed services and applications, limiting application execution, restricting network access to only what is needed, and always keeping the system up to date. Furthermore, using a hardened workstation for management segregates administrative tools and activities from other end-user tasks.

Within an on-premises enterprise environment, you can limit the attack surface of your physical infrastructure through dedicated management networks, server rooms that have card access, and workstations that run on protected areas of the network. In a cloud or hybrid IT model, being diligent about secure management services can be more complex because of the lack of physical access to IT resources. Implementing protection solutions requires careful software configuration, security-focused processes, and comprehensive policies.

Using a least-privilege minimized software footprint in a locked-down workstation for cloud management and for application development can reduce the risk of security incidents by standardizing the remote management and development environments. A hardened workstation configuration can help prevent the compromise of accounts that are used to manage critical cloud resources by closing many common avenues used by malware and exploits. Specifically, you can use [Windows AppLocker](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd759117(v=ws.11)) and Hyper-V technology to control and isolate client system behavior and mitigate threats, including email or Internet browsing.

On a hardened workstation, the administrator runs a standard user account (which blocks administrative-level execution) and associated applications are controlled by an allowlist. The basic elements of a hardened workstation are as follows:

* Active scanning and patching. Deploy antimalware software, perform regular vulnerability scans, and update all workstations by using the latest security update in a timely fashion.
* Limited functionality. Uninstall any applications that aren't needed and disable unnecessary (startup) services.
* Network hardening. Use Windows Firewall rules to allow only valid IP addresses, ports, and URLs related to Azure management. Ensure that inbound remote connections to the workstation are also blocked.
* Execution restriction. Allow only a set of predefined executable files that are needed for management to run (referred to as "default-deny"). By default, users should be denied permission to run any program unless it's explicitly defined in the allowlist.
* Least privilege. Management workstation users shouldn't have any administrative privileges on the local machine itself. This way, they can't change the system configuration or the system files, either intentionally or unintentionally.

You can enforce all this by using [Group Policy Objects (GPOs)](../../active-directory-domain-services/manage-group-policy.md) in Active Directory Domain Services (AD DS) and applying them through your (local) management domain to all management accounts.

### Managing services, applications, and data
Azure cloud services configuration is performed through either the Azure portal or SMAPI, via the Windows PowerShell command-line interface or a custom-built application that takes advantage of these RESTful interfaces. Services using these mechanisms include Microsoft Entra ID, Azure Storage, Azure Websites, and Azure Virtual Network, and others.

Virtual Machine deployed applications provide their own client tools and interfaces as needed, such as the Microsoft Management Console (MMC), an enterprise management console (such as Microsoft System Center or Windows Intune), or another management application Microsoft SQL Server Management Studio, for example. These tools typically reside in an enterprise environment or client network. They may depend on specific network protocols, such as Remote Desktop Protocol (RDP), that require direct, stateful connections. Some may have web-enabled interfaces that shouldn't be openly published or accessible via the Internet.

You can restrict access to infrastructure and platform services management in Azure by using [multi-factor authentication](../../active-directory/authentication/concept-mfa-howitworks.md), X.509 management certificates, and firewall rules. The Azure portal and SMAPI require Transport Layer Security (TLS). However, services and applications that you deploy into Azure require you to take protection measures that are appropriate based on your application. These mechanisms can frequently be enabled more easily through a standardized hardened workstation configuration.

## Security guidelines
In general, helping to secure administrator workstations for use with the cloud is similar to the practices used for any workstation on-premises. For example, minimized build and restrictive permissions. Some unique aspects of cloud management are more akin to remote or out-of-band enterprise management. These include the use and auditing of credentials, security-enhanced remote access, and threat detection and response.

### Authentication
You can use Azure logon restrictions to constrain source IP addresses for accessing administrative tools and audit access requests. To help Azure identify management clients (workstations and/or applications), you can configure both SMAPI (via customer-developed tools such as Windows PowerShell cmdlets) and the Azure portal to require client-side management certificates to be installed, in addition to TLS/SSL certificates. We also recommend that administrator access require multi-factor authentication.

Some applications or services that you deploy into Azure may have their own authentication mechanisms for both end-user and administrator access, whereas others take full advantage of Microsoft Entra ID. Depending on whether you're federating credentials via Active Directory Federation Services (AD FS), using directory synchronization or maintaining user accounts solely in the cloud, using [Microsoft Identity Manager](/microsoft-identity-manager/) (part of Microsoft Entra ID P1 or P2) helps you manage identity lifecycles between the resources.

### Connectivity
Several mechanisms are available to help secure client connections to your Azure virtual networks. Two of these mechanisms, site-to-site VPN (S2S) and [point-to-site VPN](../../vpn-gateway/vpn-gateway-howto-point-to-site-classic-azure-portal.md) (P2S), enable the use of industry standard IPsec (S2S) for encryption and tunneling. When Azure is connecting to public-facing Azure services management such as the Azure portal, Azure requires Hypertext Transfer Protocol Secure (HTTPS).

A stand-alone hardened workstation that doesn't connect to Azure through an RD Gateway should use the SSTP-based point-to-site VPN to create the initial connection to the Azure Virtual Network, and then establish RDP connection to individual virtual machines from with the VPN tunnel.

### Management auditing vs. policy enforcement
Typically, there are two approaches for helping to secure management processes: auditing and policy enforcement. Doing both provides comprehensive controls, but may not be possible in all situations. In addition, each approach has different levels of risk, cost, and effort associated with managing security, particularly as it relates to the level of trust placed in both individuals and system architectures.

Monitoring, logging, and auditing provide a basis for tracking and understanding administrative activities, but it may not always be feasible to audit all actions in complete detail due to the amount of data generated. Auditing the effectiveness of the management policies is a best practice, however.

Policy enforcement that includes strict access controls puts programmatic mechanisms in place that can govern administrator actions, and it helps ensure that all possible protection measures are being used. Logging provides proof of enforcement, in addition to a record of who did what, from where, and when. Logging also enables you to audit and crosscheck information about how administrators follow policies, and it provides evidence of activities

## Client configuration
We recommend three primary configurations for a hardened workstation. The biggest differentiators between them are cost, usability, and accessibility, while maintaining a similar security profile across all options. The following table provides a short analysis of the benefits and risks to each. (Note that "corporate PC" refers to a standard desktop PC configuration that would be deployed for all domain users, regardless of roles.)

| Configuration | Benefits | Cons |
| --- | --- | --- |
| Stand-alone hardened workstation |Tightly controlled workstation |higher cost for dedicated desktops |
| - | Reduced risk of application exploits |Increased management effort |
| - | Clear separation of duties | - |
| Corporate PC as virtual machine |Reduced hardware costs | - |
| - | Segregation of role and applications | - |

It's important that the hardened workstation is the host and not the guest, with nothing between the host operating system and the hardware. Following the "clean source principle" (also known as "secure origin") means that the host should be the most hardened. Otherwise, the hardened workstation (guest) is subject to attacks on the system on which it's hosted.

You can further segregate administrative functions through dedicated system images for each hardened workstation that have only the tools and permissions needed for managing select Azure and cloud applications, with specific local AD DS GPOs for the necessary tasks.

For IT environments that have no on-premises infrastructure (for example, no access to a local AD DS instance for GPOs because all servers are in the cloud), a service such as [Microsoft Intune](/mem/intune/) can simplify deploying and maintaining workstation configurations.

### Stand-alone hardened workstation for management
With a stand-alone hardened workstation, administrators have a PC or laptop that they use for administrative tasks and another, separate PC or laptop for non-administrative tasks. In the stand-alone hardened workstation scenario (shown below), the local instance of Windows Firewall (or a non-Microsoft client firewall) is configured to block inbound connections, such as RDP. The administrator can log on to the hardened workstation and start an RDP session that connects to Azure after establishing a VPN connect with an Azure Virtual Network, but can't log on to a corporate PC and use RDP to connect to the hardened workstation itself.

![A diagram showing the stand-alone hardened workstation scenario.](./media/management/stand-alone-hardened-workstation-topology.png)

### Corporate PC as virtual machine
In cases where a separate stand-alone hardened workstation is cost prohibitive or inconvenient, the hardened workstation can host a virtual machine to perform non-administrative tasks.

![A diagram showing the hardened workstation hosting a virtual machine to perform non-administrative tasks.](./media/management/hardened-workstation-enabled-with-hyper-v.png)

To avoid several security risks that can arise from using one workstation for systems management and other daily work tasks, you can deploy a Windows Hyper-V virtual machine to the hardened workstation. This virtual machine can be used as the corporate PC. The corporate PC environment can remain isolated from the Host, which reduces its attack surface and removes the user's daily activities (such as email) from coexisting with sensitive administrative tasks.

The corporate PC virtual machine runs in a protected space and provides user applications. The host remains a "clean source" and enforces strict network policies in the root operating system (for example, blocking RDP access from the virtual machine).

## Best practices
Consider the following additional guidelines when you're managing applications and data in Azure.

### Dos and don'ts
Don't assume that because a workstation has been locked down that other common security requirements don't need to be met. The potential risk is higher because of elevated access levels that administrator accounts generally possess. Examples of risks and their alternate safe practices are shown in the table below.

| Don't | Do |
| --- | --- |
| Don't email credentials for administrator access or other secrets (for example, TLS/SSL or management certificates) |Maintain confidentiality by delivering account names and passwords by voice (but not storing them in voice mail), perform a remote installation of client/server certificates (via an encrypted session), download from a protected network share, or distribute by hand via removable media. |
| - | Proactively manage your management certificate life cycles. |
| Don't store account passwords unencrypted or un-hashed in application storage (such as in spreadsheets, SharePoint sites, or file shares). |Establish security management principles and system hardening policies, and apply them to your development environment. |
| Don't share accounts and passwords between administrators, or reuse passwords across multiple user accounts or services, particularly those for social media or other nonadministrative activities. |Create a dedicated Microsoft account to manage your Azure subscription, an account that is not used for personal email. |
| Don't email configuration files. |Configuration files and profiles should be installed from a trusted source (for example, an encrypted USB flash drive), not from a mechanism that can be easily compromised, such as email. |
| Don't use weak or simple logon passwords. |Enforce strong password policies, expiration cycles (change-on-first-use), console timeouts, and automatic account lockouts. Use a client password management system with multi-factor authentication for password vault access. |
| Don't expose management ports to the Internet. |Lock down Azure ports and IP addresses to restrict management access. |
| - | Use firewalls, VPNs, and NAP for all management connections. |

## Azure operations
Within Microsoft's operation of Azure, operations engineers and support personnel who access Azure's production systems use [hardened workstation PCs with VMs](#stand-alone-hardened-workstation-for-management) provisioned on them for internal corporate network access and applications (such as e-mail, intranet, etc.). All management workstation computers have TPMs, the host boot drive is encrypted with BitLocker, and they're joined to a special organizational unit (OU) in Microsoft's primary corporate domain.

System hardening is enforced through Group Policy, with centralized software updating. For auditing and analysis, event logs (such as security and AppLocker) are collected from management workstations and saved to a central location.

In addition, dedicated jump-boxes on Microsoft's network that require two-factor authentication are used to connect to Azure's production network.

## Azure security checklist
Minimizing the number of tasks that administrators can perform on a hardened workstation helps minimize the attack surface in your development and management environment. Use the following technologies to help protect your hardened workstation:

* A web browser is a key entry point for harmful code due to its extensive interactions with external servers. Review your client policies and enforce running in protected mode, disabling add-ons, and disabling file downloads. Ensure that security warnings are displayed. Take advantage of Internet zones and create a list of trusted sites for which you have configured reasonable hardening. Block all other sites and in-browser code, such as ActiveX and Java.
* Standard user. Running as a standard user brings a number of benefits, the biggest of which is that stealing administrator credentials via malware becomes more difficult. In addition, a standard user account doesn't have elevated privileges on the root operating system, and many configuration options and APIs are locked out by default.
* Code signing. Code signing all tools and scripts used by administrators provides a manageable mechanism for deploying application lockdown policies. Hashes don't scale with rapid changes to the code, and file paths don't provide a high level of security. [Set the PowerShell execution policies for Windows computers](/powershell/module/microsoft.powershell.security/set-executionpolicy).
* Group Policy. Create a global administrative policy that is applied to any domain workstation that is used for management (and block access from all others), and to user accounts authenticated on those workstations.
* Security-enhanced provisioning. Safeguard your baseline hardened workstation image to help protect against tampering. Use security measures like encryption and isolation to store images, virtual machines, and scripts, and restrict access (perhaps use an auditable check-in/check-out process).
* Patching. Maintain a consistent build (or have separate images for development, operations, and other administrative tasks), scan for changes and malware routinely, keep the build up to date, and only activate machines when they're needed.
* Governance. Use AD DS GPOs to control all the administrators' Windows interfaces, such as file sharing. Include management workstations in auditing, monitoring, and logging processes. Track all administrator and developer access and usage.

## Summary
Using a hardened workstation configuration for administering your Azure cloud services, Virtual Machines, and applications can help you avoid numerous risks and threats that can come from remotely managing critical IT infrastructure. Both Azure and Windows provide mechanisms that you can employ to help protect and control communications, authentication, and client behavior.

## Next steps
The following resources are available to provide more general information about Azure and related Microsoft services:

* Securing Privileged Access - get the technical details for designing and building a secure administrative workstation for Azure management
* [Microsoft Trust Center](https://microsoft.com/trustcenter/cloudservices/azure) - learn about Azure platform capabilities that protect the Azure fabric and the workloads that run on Azure
* [Microsoft Security Response Center](https://www.microsoft.com/msrc) - where Microsoft security vulnerabilities, including issues with Azure, can be reported or via email to [secure@microsoft.com](mailto:secure@microsoft.com)
