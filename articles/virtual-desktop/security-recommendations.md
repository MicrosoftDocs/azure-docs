---
title: Security recommendations for Azure Virtual Desktop
description: Learn about recommendations for helping keep your Azure Virtual Desktop environment secure.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 01/09/2024
---

# Security recommendations for Azure Virtual Desktop

Azure Virtual Desktop is a managed virtual desktop service that includes many security capabilities for keeping your organization safe. The architecture of Azure Virtual Desktop comprises many components that make up the service connecting users to their desktops and apps.

Azure Virtual Desktop has many built-in advanced security features, such as Reverse Connect where no inbound network ports are required to be open, which reduces the risk involved with having remote desktops accessible from anywhere. The service also benefits from many other security features of Azure, such as multifactor authentication and conditional access. This article describes steps you can take as an administrator to keep your Azure Virtual Desktop deployments secure, whether you provide desktops and apps to users in your organization or to external users.

## Shared security responsibilities

Before Azure Virtual Desktop, on-premises virtualization solutions like Remote Desktop Services require granting users access to roles like Gateway, Broker, Web Access, and so on. These roles had to be fully redundant and able to handle peak capacity. Administrators would install these roles as part of the Windows Server operating system, and they had to be domain-joined with specific ports accessible to public connections. To keep deployments secure, administrators had to constantly make sure everything in the infrastructure was maintained and up-to-date.

In most cloud services, however, there's a [shared set of security responsibilities](../security/fundamentals/shared-responsibility.md) between Microsoft and the customer or partner. For Azure Virtual Desktop, most components are Microsoft-managed, but session hosts and some supporting services and components are customer-managed or partner-managed. To learn more about the Microsoft-managed components of Azure Virtual Desktop, see [Azure Virtual Desktop service architecture and resilience](service-architecture-resilience.md).

While some components come already secured for your environment, you'll need to configure other areas yourself to fit your organization's or customer's security needs. Here are the components of which you're responsible for the security in your Azure Virtual Desktop deployment:

| Component | Responsibility |
|--|:-:|
| Identity | Customer or partner |
| User devices (mobile and PC) | Customer or partner |
| App security | Customer or partner |
| Session host operating system | Customer or partner |
| Deployment configuration | Customer or partner |
| Network controls | Customer or partner |
| Virtualization control plane | Microsoft |
| Physical hosts | Microsoft |
| Physical network | Microsoft |
| Physical datacenter | Microsoft |

## Security boundaries

Security boundaries separate the code and data of security domains with different levels of trust. For example, there's usually a security boundary between kernel mode and user mode. Most Microsoft software and services depend on multiple security boundaries to isolate devices on networks, virtual machines (VMs), and applications on devices. The following table lists each security boundary for Windows and what they do for overall security.

| Security boundary | Description |
|--|--|
| Network boundary | An unauthorized network endpoint can't access or tamper with code and data on a customer’s device. |
| Kernel boundary | A non-administrative user mode process can't access or tamper with kernel code and data. Administrator-to-kernel is not a security boundary. |
| Process boundary | An unauthorized user mode process can't access or tamper with the code and data of another process. |
| AppContainer sandbox boundary | An AppContainer-based sandbox process can't access or tamper with code and data outside of the sandbox based on the container capabilities. |
| User boundary | A user can't access or tamper with the code and data of another user without being authorized. |
| Session boundary | A user session can't access or tamper with another user session without being authorized. |
| Web browser boundary | An unauthorized website can't violate the same-origin policy, nor can it access or tamper with the native code and data of the Microsoft Edge web browser sandbox. |
| Virtual machine boundary | An unauthorized Hyper-V guest virtual machine can't access or tamper with the code and data of another guest virtual machine; this includes Hyper-V isolated containers. |
| Virtual Secure Mode (VSM) boundary | Code running outside of the VSM trusted process or enclave can't access or tamper with data and code within the trusted process. |

### Recommended security boundaries for Azure Virtual Desktop scenarios

You'll also need to make certain choices about security boundaries on a case-by-case basis. For example, if a user in your organization needs local administrator privileges to install apps, you'll need to give them a personal desktop instead of a shared session host. We don't recommend giving users local administrator privileges in multi-session pooled scenarios because these users can cross security boundaries for sessions or NTFS data permissions, shut down multi-session VMs, or do other things that could interrupt service or cause data losses.

Users from the same organization, like knowledge workers with apps that don't require administrator privileges, are great candidates for multi-session  session hosts like Windows 11 Enterprise multi-session. These session hosts reduce costs for your organization because multiple users can share a single VM, with only the overhead costs of a VM per user. With user profile management products like FSLogix, users can be assigned any VM in a host pool without noticing any service interruptions. This feature also lets you optimize costs by doing things like shutting down VMs during off-peak hours.

If your situation requires users from different organizations to connect to your deployment, we recommend you have a separate tenant for identity services like Active Directory and Microsoft Entra ID. We also recommend you have a separate subscription for those users for hosting Azure resources like Azure Virtual Desktop and VMs.

In many cases, using multi-session is an acceptable way to reduce costs, but whether we recommend it depends on the trust level between users with simultaneous access to a shared multi-session instance. Typically, users that belong to the same organization have a sufficient and agreed-upon trust relationship. For example, a department or workgroup where people collaborate and can access each other’s personal information is an organization with a high trust level.

Windows uses security boundaries and controls to ensure user processes and data are isolated between sessions. However, Windows still provides access to the instance the user is working on.

Multi-session deployments would benefit from a security in depth strategy that adds more security boundaries that prevent users within and outside of the organization from getting unauthorized access to other users' personal information. Unauthorized data access happens because of an error in the configuration process by the system admin, such as an undisclosed security vulnerability or a known vulnerability that hasn't been patched out yet.

We don't recommend granting users that work for different or competing companies access to the same multi-session environment. These scenarios have several security boundaries that can be attacked or abused, like network, kernel, process, user, or sessions. A single security vulnerability could cause unauthorized data and credential theft, personal information leaks, identity theft, and other issues. Virtualized environment providers are responsible for offering well-designed systems with multiple strong security boundaries and extra safety features enabled wherever possible.

Reducing these potential threats requires a fault-proof configuration, patch management design process, and regular patch deployment schedules. It's better to follow the principles of defense in depth and keep environments separate.

The following table summarizes our recommendations for each scenario.

| Trust level scenario                                 | Recommended solution                |
|------------------------------------------------------|-------------------------------------|
| Users from one organization with standard privileges | Use a Windows Enterprise multi-session OS. |
| Users require administrative privileges             | Use a personal host pool and assign each user their own session host.         |
| Users from different organizations connecting        | Separate Azure tenant and Azure subscription         |

## Azure security best practices

Azure Virtual Desktop is a service under Azure. To maximize the safety of your Azure Virtual Desktop deployment, you should make sure to secure the surrounding Azure infrastructure and management plane as well. To secure your infrastructure, consider how Azure Virtual Desktop fits into your larger Azure ecosystem. To learn more about the Azure ecosystem, see [Azure security best practices and patterns](../security/fundamentals/best-practices-and-patterns.md).

Today's threat landscape requires designs with security approaches in mind. Ideally, you'll want to build a series of security mechanisms and controls layered throughout your computer network to protect your data and network from being compromised or attacked. This type of security design is what the United States Cybersecurity and Infrastructure Security Agency (CISA) calls *defense in depth*.

The following sections contain recommendations for securing an Azure Virtual Desktop deployment.

### Enable Microsoft Defender for Cloud

We recommend enabling Microsoft Defender for Cloud's enhanced security features to:

- Manage vulnerabilities.
- Assess compliance with common frameworks like from the PCI Security Standards Council.
- Strengthen the overall security of your environment.

To learn more, see [Enable enhanced security features](../defender-for-cloud/enable-enhanced-security.md).

### Improve your Secure Score

Secure Score provides recommendations and best practice advice for improving your overall security. These recommendations are prioritized to help you pick which ones are most important, and the Quick Fix options help you address potential vulnerabilities quickly. These recommendations also update over time, keeping you up to date on the best ways to maintain your environment’s security. To learn more, see [Improve your Secure Score in Microsoft Defender for Cloud](../defender-for-cloud/secure-score-security-controls.md).

### Require multifactor authentication

Requiring multifactor authentication for all users and admins in Azure Virtual Desktop improves the security of your entire deployment. To learn more, see [Enable Microsoft Entra multifactor authentication for Azure Virtual Desktop](set-up-mfa.md).

### Enable Conditional Access

Enabling [Conditional Access](../active-directory/conditional-access/overview.md) lets you manage risks before you grant users access to your Azure Virtual Desktop environment. When deciding which users to grant access to, we recommend you also consider who the user is, how they sign in, and which device they're using.

### Collect audit logs

Enabling audit log collection lets you view user and admin activity related to Azure Virtual Desktop. Some examples of key audit logs are:

-   [Azure Activity Log](../azure-monitor/essentials/activity-log.md)
-   [Microsoft Entra Activity Log](../active-directory/reports-monitoring/concept-activity-logs-azure-monitor.md)
-   [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md)
-   [Session hosts](../azure-monitor/agents/agent-windows.md)
-   [Key Vault logs](../key-vault/general/logging.md)

### Use RemoteApp

When choosing a deployment model, you can either provide remote users access to entire desktops, or only select applications when published as a RemoteApp. RemoteApp provides a seamless experience as the user works with apps from their virtual desktop. RemoteApp reduces risk by only letting the user work with a subset of the remote machine exposed by the application.

### Monitor usage with Azure Monitor

Monitor your Azure Virtual Desktop service's usage and availability with [Azure Monitor](https://azure.microsoft.com/services/monitor/). Consider creating [service health alerts](../service-health/alerts-activity-log-service-notifications-portal.md) for the Azure Virtual Desktop service to receive notifications whenever there's a service impacting event.

### Encrypt your session hosts

Encrypt your session hosts with [managed disk encryption options](../virtual-machines/disk-encryption-overview.md) to protect stored data from unauthorized access. 

## Session host security best practices

Session hosts are virtual machines that run inside an Azure subscription and virtual network. Your Azure Virtual Desktop deployment's overall security depends on the security controls you put on your session hosts. This section describes best practices for keeping your session hosts secure.

### Enable endpoint protection

To protect your deployment from known malicious software, we recommend enabling endpoint protection on all session hosts. You can use either Windows Defender Antivirus or a third-party program. To learn more, see [Deployment guide for Windows Defender Antivirus in a VDI environment](/windows/security/threat-protection/windows-defender-antivirus/deployment-vdi-windows-defender-antivirus).

For profile solutions like FSLogix or other solutions that mount virtual hard disk files, we recommend excluding those file extensions.

### Install an endpoint detection and response product

We recommend you install an endpoint detection and response (EDR) product to provide advanced detection and response capabilities. For server operating systems with [Microsoft Defender for Cloud](../defender-for-cloud/integration-defender-for-endpoint.md) enabled, installing an EDR product will deploy Microsoft Defender for Endpoint. For client operating systems, you can deploy [Microsoft Defender for Endpoint](/windows/security/threat-protection/microsoft-defender-atp/onboarding) or a third-party product to those endpoints.

### Enable threat and vulnerability management assessments

Identifying software vulnerabilities that exist in operating systems and applications is critical to keeping your environment secure. Microsoft Defender for Cloud can help you identify problem spots through [Microsoft Defender for Endpoint's threat and vulnerability management solution](../defender-for-cloud/deploy-vulnerability-assessment-defender-vulnerability-management.md). You can also use third-party products if you're so inclined, although we recommend using Microsoft Defender for Cloud and Microsoft Defender for Endpoint.

### Patch software vulnerabilities in your environment

Once you identify a vulnerability, you must patch it. This applies to virtual environments as well, which includes the running operating systems, the applications that are deployed inside of them, and the images you create new machines from. Follow your vendor patch notification communications and apply patches in a timely manner. We recommend patching your base images monthly to ensure that newly deployed machines are as secure as possible.

### Establish maximum inactive time and disconnection policies

Signing users out when they're inactive preserves resources and prevents access by unauthorized users. We recommend that timeouts balance user productivity as well as resource usage. For users that interact with stateless applications, consider more aggressive policies that turn off machines and preserve resources. Disconnecting long running applications that continue to run if a user is idle, such as a simulation or CAD rendering, can interrupt the user's work and may even require restarting the computer.

### Set up screen locks for idle sessions

You can prevent unwanted system access by configuring Azure Virtual Desktop to lock a machine's screen during idle time and requiring authentication to unlock it.

### Establish tiered admin access

We recommend you don't grant your users admin access to virtual desktops. If you need software packages, we recommend you make them available through configuration management utilities like Microsoft Intune. In a multi-session environment, we recommend you don't let users install software directly.

### Consider which users should access which resources

Consider session hosts as an extension of your existing desktop deployment. We recommend you control access to network resources the same way you would for other desktops in your environment, such as using network segmentation and filtering. By default, session hosts can connect to any resource on the internet. There are several ways you can limit traffic, including using Azure Firewall, Network Virtual Appliances, or proxies. If you need to limit traffic, make sure you add the proper rules so that Azure Virtual Desktop can work properly.

### Manage Microsoft 365 app security

In addition to securing your session hosts, it's important to also secure the applications running inside of them. Microsoft 365 apps are some of the most common applications deployed in session hosts. To improve the Microsoft 365 deployment security, we recommend you use the [Security Policy Advisor](/DeployOffice/overview-of-security-policy-advisor) for Microsoft 365 Apps for enterprise. This tool identifies policies that can you can apply to your deployment for more security. Security Policy Advisor also recommends policies based on their impact to your security and productivity.

### User profile security

User profiles can contain sensitive information. You should restrict who has access to user profiles and the methods of accessing them, especially if you're using [FSLogix Profile Container](/fslogix/tutorial-configure-profile-containers) to store user profiles in a virtual hard disk file on an SMB share. You should follow the security recommendations for the provider of your SMB share. For example, If you're using Azure Files to store these virtual hard disk files, you can use [private endpoints](../storage/files/storage-files-networking-overview.md#private-endpoints) to make them only accessible within an Azure virtual network. 

### Other security tips for session hosts

By restricting operating system capabilities, you can strengthen the security of your session hosts. Here are a few things you can do:

- Control device redirection by redirecting drives, printers, and USB devices to a user's local device in a remote desktop session. We recommend that you evaluate your security requirements and check if these features ought to be disabled or not.

- Restrict Windows Explorer access by hiding local and remote drive mappings. This prevents users from discovering unwanted information about system configuration and users.

- Avoid direct RDP access to session hosts in your environment. If you need direct RDP access for administration or troubleshooting, enable [just-in-time](../defender-for-cloud/just-in-time-access-usage.yml) access to limit the potential attack surface on a session host.

- Grant users limited permissions when they access local and remote file systems. You can restrict permissions by making sure your local and remote file systems use access control lists with least privilege. This way, users can only access what they need and can't change or delete critical resources.

- Prevent unwanted software from running on session hosts. You can enable App Locker for additional security on session hosts, ensuring that only the apps you allow can run on the host.

## Trusted launch

Trusted launch are Gen2 Azure VMs with enhanced security features aimed to protect against bottom-of-the-stack threats through attack vectors such as rootkits, boot kits, and kernel-level malware. The following are the enhanced security features of trusted launch, all of which are supported in Azure Virtual Desktop. To learn more about trusted launch, visit [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).

### Enable trusted launch as default

Trusted launch protects against advanced and persistent attack techniques. This feature also allows for secure deployment of VMs with verified boot loaders, OS kernels, and drivers. Trusted launch also protects keys, certificates, and secrets in the VMs. Learn more about trusted launch at [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).

When you add session hosts using the Azure portal, the security type automatically changes to **Trusted virtual machines**. This ensures that your VM meets the mandatory requirements for Windows 11. For more information about these requirements, see [Virtual machine support](/windows/whats-new/windows-11-requirements#virtual-machine-support).

## Azure Confidential computing virtual machines

Azure Virtual Desktop support for Azure Confidential computing virtual machines ensures a user’s virtual desktop is encrypted in memory, protected in use, and backed by hardware root of trust. Azure Confidential computing VMs for Azure Virtual Desktop are compatible with [supported operating systems](prerequisites.md#operating-systems-and-licenses). Deploying confidential VMs with Azure Virtual Desktop gives users access to Microsoft 365 and other applications on session hosts that use hardware-based isolation, which hardens isolation from other virtual machines, the hypervisor, and the host OS. These virtual desktops are powered by the latest Third-generation (Gen 3) Advanced Micro Devices (AMD) EPYC™ processor with Secure Encrypted Virtualization Secure Nested Paging (SEV-SNP) technology. Memory encryption keys are generated and safeguarded by a dedicated secure processor inside the AMD CPU that can't be read from software. For more information, see the [Azure Confidential computing overview](../confidential-computing/overview.md).

The following operating systems are supported for use as session hosts with confidential VMs on Azure Virtual Desktop:

- Windows 11 Enterprise, version 22H2
- Windows 11 Enterprise multi-session, version 22H2
- Windows Server 2022
- Windows Server 2019

You can create session hosts using confidential VMs when you [create a host pool](create-host-pool.md) or [add session hosts to a host pool](add-session-hosts-host-pool.md).

### OS disk encryption

Encrypting the operating system disk is an extra layer of encryption that binds disk encryption keys to the Confidential computing VM's Trusted Platform Module (TPM). This encryption makes the disk content accessible only to the VM. Integrity monitoring allows cryptographic attestation and verification of VM boot integrity and monitoring alerts if the VM didn’t boot because attestation failed with the defined baseline. For more information about integrity monitoring, see [Microsoft Defender for Cloud Integration](../virtual-machines/trusted-launch.md#microsoft-defender-for-cloud-integration). You can enable confidential compute encryption when you create session hosts using confidential VMs when you [create a host pool](create-host-pool.md) or [add session hosts to a host pool](add-session-hosts-host-pool.md).

### Secure Boot

Secure Boot is a mode that platform firmware supports that protects your firmware from malware-based rootkits and boot kits. This mode only allows signed operating systems and drivers to boot. 

### Monitor boot integrity using Remote Attestation

Remote attestation is a great way to check the health of your VMs. Remote attestation verifies that Measured Boot records are present, genuine, and originate from the Virtual Trusted Platform Module (vTPM). As a health check, it provides cryptographic certainty that a platform started up correctly. 

### vTPM

A vTPM is a virtualized version of a hardware Trusted Platform Module (TPM), with a virtual instance of a TPM per VM. vTPM enables remote attestation by performing integrity measurement of the entire boot chain of the VM (UEFI, OS, system, and drivers). 

We recommend enabling vTPM to use remote attestation on your VMs. With vTPM enabled, you can also enable BitLocker functionality with Azure Disk Encryption, which provides full-volume encryption to protect data at rest. Any features using vTPM will result in secrets bound to the specific VM. When users connect to the Azure Virtual Desktop service in a pooled scenario, users can be redirected to any VM in the host pool. Depending on how the feature is designed this may have an impact.

> [!NOTE]
> BitLocker shouldn't be used to encrypt the specific disk where you're storing your FSLogix profile data.

### Virtualization-based Security

Virtualization-based Security (VBS) uses the hypervisor to create and isolate a secure region of memory that's inaccessible to the OS. Hypervisor-Protected Code Integrity (HVCI) and Windows Defender Credential Guard both use VBS to provide increased protection from vulnerabilities. 

#### Hypervisor-Protected Code Integrity

HVCI is a powerful system mitigation that uses VBS to protect Windows kernel-mode processes against injection and execution of malicious or unverified code.

#### Windows Defender Credential Guard

Enable Windows Defender Credential Guard. Windows Defender Credential Guard uses VBS to isolate and protect secrets so that only privileged system software can access them. This prevents unauthorized access to these secrets and credential theft attacks, such as Pass-the-Hash attacks. For more information, see [Credential Guard overview](/windows/security/identity-protection/credential-guard/).

### Windows Defender Application Control

Enable Windows Defender Application Control. Windows Defender Application Control is designed to protect devices against malware and other untrusted software. It prevents malicious code from running by ensuring that only approved code, that you know, can be run. For more information, see [Application Control for Windows](/windows/security/application-security/application-control/windows-defender-application-control/wdac).

> [!NOTE]
> When using Windows Defender Access Control, we recommend only targeting policies at the device level. Although it's possible to target policies to individual users, once the policy is applied, it affects all users on the device equally.

## Windows Update

Keep your session hosts up to date with updates from Windows Update. Windows Update provides a secure way to keep your devices up-to-date. Its end-to-end protection prevents manipulation of protocol exchanges and ensures updates only include approved content. You may need to update firewall and proxy rules for some of your protected environments in order to get proper access to Windows Updates. For more information, see [Windows Update security](/windows/deployment/update/windows-update-security).

## Remote Desktop client and updates on other OS platforms

Software updates for the Remote Desktop clients you can use to access Azure Virtual Desktop services on other OS platforms are secured according to the security policies of their respective platforms. All client updates are delivered directly by their platforms. For more information, see the respective store pages for each app:

- [macOS](https://apps.apple.com/app/microsoft-remote-desktop/id1295203466?mt=12)
- [iOS](https://apps.apple.com/us/app/remote-desktop-mobile/id714464092)
- [Android](https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx)

## Next steps

- Learn how to [Set up multifactor authentication](set-up-mfa.md).
- [Apply Zero Trust principles for an Azure Virtual Desktop deployment](/security/zero-trust/azure-infrastructure-avd).
