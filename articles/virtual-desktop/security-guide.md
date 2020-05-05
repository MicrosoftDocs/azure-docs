---
title: Windows Virtual Desktop security best practices - Azure
description: Best practices for keeping your Windows Virtual Desktop environment secure.
services: virtual-desktop
author: heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/06/2020
ms.author: helohr
manager: lizross
---
# Security best practices

Windows Virtual Desktop is a managed virtual desktop service that includes many security capabilities for keeping your organization safe. In a Windows Virtual Desktop deployment, Microsoft manages portions of the services on the customer’s behalf. The service has namyh built-in advanced security features, such as Reverse Connect, which reduces the risk involved with having remote desktops accessible from anywhere.

This article describes additional steps you can take as an admin to keep your customers' Windows Virtual Desktop deployments secure.

# Security responsibilities

As with many cloud services, there are a shared set of security responsibilities. If you are adopting Windows Virtual Desktop, it’s important to understand that while some components come already secured for your environment, there are other areas you'll need to configure to fit your organization’s security needs.

The following table shows which security needs users are responsible for. Anything that the customer isn't responsible for is handled by Microsoft.

| Security need | Customer responsibility in on-premises VDI | Customer responsibility in Windows Virtual Desktop |
|---------------|:-----------------:|:-------------------------:|
|Identity|&#10004;|&#10004;|
|User devices (mobile and PC)|&#10004;|&#10004;|
|App security|&#10004;|&#10004;|
|Session host OS|&#10004;|&#10004;|
|Virtualization control plane|&#10004;|&#10006;|
|Deployment configuration|&#10004;|&#10004;|
|Network controls|&#10004;|&#10004;|
|Physical hosts|&#10004;|&#10006;|
|Physical network|&#10004;|&#10006;|
|Physical datacenter|&#10004;|&#10006;|

## Azure Security Best Practices

### Enable Azure Security Center

We recommend you enable Azure Security Center Standard for subscriptions, virtual machines, key vaults, and storage accounts.

With Azure Security Center Standard, you can:

* Manage vulnerabilities.
* Assess compliance with common frameworks like PCI.
* Strengthen the overall security of your environment.

To learn more, see [Onboard your Azure subscription to Security Center Standard](../security-center/security-center-get-started.md).

### Improve your Secure Score

Secure Score provides recommendations and best practice advice for improving your overall security. These recommendations come prioritized to help you pick which ones are most important, and the Quick Fix options help you address potential vulnerabilities quickly. These recommendations also update over time, keeping you up-to-date on the best ways to maintain your environment’s security. To learn more, see [Improve your Secure Score in Azure Security Center](../security-center/security-center-secure-score.md).

### Windows Virtual Desktop as part of your Azure environment

To maximize the safety of your Windows Virtual Desktop deployment, you should make sure to secure the surrounding infrastructure and management plane as well. To secure your infrastructure, consider how Windows Virtual Desktop fits into your larger Azure ecosystem. To learn more about the Azure ecosystem, see [Azure security best practices and patterns](../security/fundamentals/best-practices-and-patterns.md).

## Windows Virtual Desktop service security best practices

This section explains best practices for Windows Virtual Desktop service security.

### Require multi-factor authentication

Requiring multi-factor authentication for all users and admins in Windows Virtual Desktop improves the security of your entire deployment. To learn more, see [Enable Azure Multi-Factor Authentication for Windows Virtual Desktop](set-up-mfa.md).

### Enable Conditional Access

Enabling [Conditional Access](../active-directory/conditional-access/best-practices.md) helps you manage risks before you grant users access to your Windows Virtual Desktop environment. When deciding which users to allow access, we recommend you also consider who the user is, which sign-in method they're using, and which device they're using.

### Collect audit logs

Enabling audit log collection lets you view user and admin activity related to Windows Virtual Desktop. Some examples of key audit logs are:

-   [Azure Activity Log](../azure-monitor/platform/activity-log-collect.md)
-   [Azure Active Directory Activity Log](../active-directory/reports-monitoring/concept-activity-logs-azure-monitor.md)
-   [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md)
-   [Session hosts](../azure-monitor/platform/agent-windows,md)
-   [Windows Virtual Desktop Diagnostic Log](../virtual-desktop/diagnostics-log-analytics.md)
-   [Key Vault logs](../key-vault/general/logging.md)

### Use RemoteApps

When choosing a deployment model, you have the choice to provide remote users access to desktops or applications. Remote applications provide a more seamless experience with other applications a user may be interacting with and reduces risk, since the user is only interacting with a subset of the remote machine that is exposed by the application.

### Monitor usage with Azure Monitor

Ensure that the Windows Virtual Desktop service is monitored using [Azure Monitor](https://azure.microsoft.com/en-us/services/monitor/) for usage and availability. Consider creating [service health alerts](../service-health/alerts-activity-log-service-notifications.md) for the Windows Virtual Desktop service to receive notification in the event of a service impacting event.

## Session host security best practices

### Enable endpoint protection

To prevent against known malicious software, we recommend enabling endpoint protection on all session hosts. You may choose to use either Windows Defender Antivirus or a third-party program. To optimize for a VDI environment, follow the recommendations outlined [here](https://docs.microsoft.com/en-us/windows/security/threat-protection/windows-defender-antivirus/deployment-vdi-windows-defender-antivirus). Additionally, for profile solutions like FSLogix or others that mount VHD files, we recommend excluding VHD file extensions.

### Install an endpoint detection and response (EDR) product

To provide advanced detection and response capabilities, we recommend that you install an EDR product. For server operating systems that have [Azure Security Center](https://docs.microsoft.com/en-us/azure/security-center/security-center-services?tabs=features-windows) enabled, this will deploy Defender ATP. For client operating systems, you can deploy [Defender ATP](https://docs.microsoft.com/en-us/windows/security/threat-protection/microsoft-defender-atp/onboarding) or a third party product to those endpoints.

### Enable threat and vulnerability management assessments

Identifying software vulnerabilities that exist in operating systems and applications is critical to keeping your environment secure. Azure Security Center can fulfill this need, as it includes vulnerability assessments for server operating systems. You can also use Defender ATP, which provides threat and vulnerability management for desktop operating systems, or even leverage a third party to address this best practice.

### Patch software vulnerabilities in your environment

Identifying a software vulnerability won’t do you any good unless you follow up by patching it, which is why we recommend vulnerability identification and patching go hand in hand. This extends to virtual environments as well which includes the running operating systems, applications deployed inside of them, and the images that new machines are created from. Follow your vendor patch notification communications and apply patches in a timely manner. We recommend patching your base images monthly to ensure that newly deployed machines address the most recent set of security vulnerabilities.

### Establish maximum inactive time and disconnection policies

Logging users off when they are inactive is a best practice. This helps preserve resources and prevent unintentional access. We recommend that timeouts balance user productivity as well as resource usage. For users that interact with stateless applications, consider more aggressive policies which lets machines to be turned off and resources to be preserved. Be aware, however, disconnecting long running applications which continue to run a user is idle, such as a simulation or CAD rendering, are disconnected, may interrupt their work and require it to be restarted.

### Set up screen locks for idle sessions

Setting virtual desktop to lock a machine's screen during idle time and requiring authentication to unlock helps to prevent against unwanted system access.

### Establish tiered admin access

As a best practice, we recommend users not be granted admin access to virtual desktops. If software packages are needed, we recommend they be made available through configuration management utilities like Microsoft Endpoint Manager. In a multi session environment it is strongly recommended that users are not allowed to install software directly.

### Consider what resources should be accessible to which users

Consider session hosts as an extension of your existing desktop deployment. We recommend ensuring that you are controlling access to network resources in the same way that you do for other desktops in your environment, including using network segmentation and filtering. By default, Session Hosts will have the ability to connect to any resource on the internet. There are several ways to limit traffic including using Azure Firewall, Network Virtual Appliances or Proxies. If limiting traffic is needed, ensure that the proper rules are added to allow Windows Virtual Desktop to operate properly.

### Manage Office Pro Plus security

In addition to adopting practices to secure session hosts, it is important to consider the security of applications running inside of them. Office Pro Plus is one of the most common applications that is deployed. To improve the security for Office deployments, Microsoft recommends using the [Security Policy Advisor](/DeployOffice/overview-of-security-policy-advisor) for Microsoft 365 Apps for Enterprise. This tool will help to identify policies that can be applied to improve security and provide recommendations to help assess the impact on both security and productivity.

### Other security tips for session hosts

By restricting operating system capabilities, you can strengthen the security of your session hosts. Here are a few examples of how to do this:

- **Control device redirection**: In a remote desktop session, drives, printers, and USB devices can be redirected to a user’s local device. We recommend that you evaluate your security requirements and check if these features ought to be disabled or not.

- **Restrict Windows Explorer Access**: Consider hiding local and remote drive mappings. This prevents users from discovering unwanted information about system configuration and users.

- **Avoid direct RDP to session hosts:** Do not allow direct RDP access to session hosts in your environment. If this is needed for administration or troubleshooting, enable [just-in-time](http://go.microsoft.com/fwlink/?LinkId=2004425) access to limit the attack surface on a session host.

- **Grant users limited permissions:** Ensure that your local and remote file systems use access control lists with least privilege, so that users only have access to what they need and cannot change or delete critical resources.

- **Prevent unwanted software from running on session hosts:** Enable App Locker for additional security on Session Hosts. App Locker lets hosts to be locked down so that only approved applications will be allowed to run.

## Next steps

To learn how to enable multi-factor authentication, see [Set up multi-factor authentication](set-up-mfa.md).