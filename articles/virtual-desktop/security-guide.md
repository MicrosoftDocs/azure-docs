---
title: Windows Virtual Desktop security best practices - Azure
description: Best practices for keeping your Windows Virtual Desktop environment secure.
services: virtual-desktop
author: heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/07/2020
ms.author: helohr
manager: lizross
---
# Security best practices

Windows Virtual Desktop is a managed virtual desktop service that includes many security capabilities for keeping your organization safe. In a Windows Virtual Desktop deployment, Microsoft manages portions of the services on the customer’s behalf. The service has many built-in advanced security features, such as Reverse Connect, which reduce the risk involved with having remote desktops accessible from anywhere.

This article describes additional steps you can take as an admin to keep your customers' Windows Virtual Desktop deployments secure.

## Security responsibilities

What makes cloud services different from traditional on-premises virtual desktop infrastructures (VDIs) is how they handle security responsibilities. For example, in a traditional on-premises VDI, the customer would be responsible for all aspects of security. However, in most cloud services, these responsibilities are shared between the customer and the company.

When you use Windows Virtual Desktop, it’s important to understand that while some components come already secured for your environment, you'll need to configure other areas yourself to fit your organization’s security needs.

Here are the security needs you're responsible for in your Windows Virtual Desktop deployment:

| Security need | Is the customer responsible for this? |
|---------------|:-------------------------:|
|Identity|Yes|
|User devices (mobile and PC)|Yes|
|App security|Yes|
|Session host OS|Yes|
|Deployment configuration|Yes|
|Network controls|Yes|
|Virtualization control plane|No|
|Physical hosts|No|
|Physical network|No|
|Physical datacenter|No|

The security needs the customer isn't responsible for are handled by Microsoft.

## Azure security best practices

Windows Virtual Desktop is a service under Azure. To maximize the safety of your Windows Virtual Desktop deployment, you should make sure to secure the surrounding Azure infrastructure and management plane as well. To secure your infrastructure, consider how Windows Virtual Desktop fits into your larger Azure ecosystem. To learn more about the Azure ecosystem, see [Azure security best practices and patterns](../security/fundamentals/best-practices-and-patterns.md).

This section describes best practices for securing your Azure ecosystem.

### Enable Azure Security Center

We recommend you enable Azure Security Center Standard for subscriptions, virtual machines, key vaults, and storage accounts.

With Azure Security Center Standard, you can:

* Manage vulnerabilities.
* Assess compliance with common frameworks like PCI.
* Strengthen the overall security of your environment.

To learn more, see [Onboard your Azure subscription to Security Center Standard](../security-center/security-center-get-started.md).

### Improve your Secure Score

Secure Score provides recommendations and best practice advice for improving your overall security. These recommendations are prioritized to help you pick which ones are most important, and the Quick Fix options help you address potential vulnerabilities quickly. These recommendations also update over time, keeping you up to date on the best ways to maintain your environment’s security. To learn more, see [Improve your Secure Score in Azure Security Center](../security-center/security-center-secure-score.md).

## Windows Virtual Desktop security best practices

Windows Virtual Desktop has many built-in security controls. In this section, you'll learn about security controls you can use to keep your users and data safe.

### Require multi-factor authentication

Requiring multi-factor authentication for all users and admins in Windows Virtual Desktop improves the security of your entire deployment. To learn more, see [Enable Azure Multi-Factor Authentication for Windows Virtual Desktop](set-up-mfa.md).

### Enable Conditional Access

Enabling [Conditional Access](../active-directory/conditional-access/best-practices.md) lets you manage risks before you grant users access to your Windows Virtual Desktop environment. When deciding which users to grant access to, we recommend you also consider who the user is, how they sign in, and which device they're using.

### Collect audit logs

Enabling audit log collection lets you view user and admin activity related to Windows Virtual Desktop. Some examples of key audit logs are:

-   [Azure Activity Log](../azure-monitor/platform/activity-log-collect.md)
-   [Azure Active Directory Activity Log](../active-directory/reports-monitoring/concept-activity-logs-azure-monitor.md)
-   [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md)
-   [Session hosts](../azure-monitor/platform/agent-windows.md)
-   [Windows Virtual Desktop Diagnostic Log](../virtual-desktop/diagnostics-log-analytics.md)
-   [Key Vault logs](../key-vault/general/logging.md)

### Use RemoteApps

When choosing a deployment model, you can either provide remote users access to entire virtual desktops or only select applications. Remote applications, or RemoteApps, provide a seamless experience as the user works with apps on their virtual desktop. RemoteApps reduce risk by only letting the user work with with a subset of the remote machine exposed by the application.

### Monitor usage with Azure Monitor

Monitor your Windows Virtual Desktop service's usage and availability with [Azure Monitor](https://azure.microsoft.com/services/monitor/). Consider creating [service health alerts](../service-health/alerts-activity-log-service-notifications.md) for the Windows Virtual Desktop service to receive notifications whenever there's a service impacting event.

## Session host security best practices

Session hosts are virtual machines that run inside an Azure subscription and virtual network. Your Windows Virtual Desktop deployment's overall security depends on the security controls you put on your session hosts. This section describes best practices for keeping your session hosts secure.

### Enable endpoint protection

To protect your deployment from known malicious software, we recommend enabling endpoint protection on all session hosts. You can use either Windows Defender Antivirus or a third-party program. To learn more, see [Deployment guide for Windows Defender Antivirus in a VDI environment](/windows/security/threat-protection/windows-defender-antivirus/deployment-vdi-windows-defender-antivirus). 

For profile solutions like FSLogix or other solutions that mount VHD files, we recommend excluding VHD file extensions.

### Install an endpoint detection and response product

We recommend you install an endpoint detection and response (EDR) product to provide advanced detection and response capabilities. For server operating systems with [Azure Security Center](../security-center/security-center-services.md) enabled, installing an EDR product will deploy Defender ATP. For client operating systems, you can deploy [Defender ATP](/windows/security/threat-protection/microsoft-defender-atp/onboarding) or a third-party product to those endpoints.

### Enable threat and vulnerability management assessments

Identifying software vulnerabilities that exist in operating systems and applications is critical to keeping your environment secure. Azure Security Center can help you identify problem spots through vulnerability assessments for server operating systems. You can also use Defender ATP, which provides threat and vulnerability management for desktop operating systems. You can also use third-party products if you're so inclined, although we recommend using Azure Security Center and Defender ATP.

### Patch software vulnerabilities in your environment

Once you identify a vulnerability, you must patch it. This applies to virtual environments as well, which includes the running operating systems, the applications that are deployed inside of them, and the images you create new machines from. Follow your vendor patch notification communications and apply patches in a timely manner. We recommend patching your base images monthly to ensure that newly deployed machines are as secure as possible.

### Establish maximum inactive time and disconnection policies

Signing users out when they're inactive preserves resources and prevents access by unauthorized users. We recommend that timeouts balance user productivity as well as resource usage. For users that interact with stateless applications, consider more aggressive policies that turn off machines and preserve resources. Disconnecting long running applications that continue to run if a user is idle, such as a simulation or CAD rendering, can interrupt the user's work and may even require restarting the computer.

### Set up screen locks for idle sessions

You can prevent unwanted system access by configuring Windows Virtual Desktop to lock a machine's screen during idle time and requiring authentication to unlock it.

### Establish tiered admin access

We recommend you don't grant your users admin access to virtual desktops. If you need software packages, we recommend you make them available through configuration management utilities like Microsoft Endpoint Manager. In a multi-session environment, we recommend you don't let users install software directly.

### Consider which users should access which resources

Consider session hosts as an extension of your existing desktop deployment. We recommend you control access to network resources the same way you would for other desktops in your environment, such as using network segmentation and filtering. By default, session hosts can connect to any resource on the internet. There are several ways you can limit traffic, including using Azure Firewall, Network Virtual Appliances, or proxies. If you need to limit traffic, make sure you add the proper rules so that Windows Virtual Desktop can work properly.

### Manage Office Pro Plus security

In addition to securing your session hosts, it's important to also secure the applications running inside of them. Office Pro Plus is one of the most common applications deployed in session hosts. To improve the Office deployment security, we recommend you use the [Security Policy Advisor](/DeployOffice/overview-of-security-policy-advisor) for Microsoft 365 Apps for enterprise. This tool identifies policies that can you can apply to your deployment for more security. Security Policy Advisor also recommends policies based on their impact to your security and productivity.

### Other security tips for session hosts

By restricting operating system capabilities, you can strengthen the security of your session hosts. Here are a few things you can do:

- Control device redirection by redirecting drives, printers, and USB devices to a user's local device in a remote desktop session. We recommend that you evaluate your security requirements and check if these features ought to be disabled or not.

- Restrict Windows Explorer access by hiding local and remote drive mappings. This prevents users from discovering unwanted information about system configuration and users.

- Avoid direct RDP access to session hosts in your environment. If you need direct RDP access for administration or troubleshooting, enable [just-in-time](../security-center/security-center-just-in-time.md) access to limit the potential attack surface on a session host.

- Grant users limited permissions when they access local and remote file systems. You can restrict permissions by making sure your local and remote file systems use access control lists with least privilege. This way, users can only access what they need and can't change or delete critical resources.

- Prevent unwanted software from running on session hosts. You can enable App Locker for additional security on session hosts, ensuring that only the apps you allow can run on the host.

## Next steps

To learn how to enable multi-factor authentication, see [Set up multi-factor authentication](set-up-mfa.md).