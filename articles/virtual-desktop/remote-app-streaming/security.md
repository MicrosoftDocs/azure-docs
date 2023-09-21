---
title: Security guide for cross-organizational apps Azure Virtual Desktop - Azure
description: A guide for how to keep the apps you host in Azure Virtual Desktop secure across multiple organizations.
author: Heidilohr
ms.topic: conceptual
ms.date: 07/14/2021
ms.author: helohr 
ms.custom:
manager: femila
---

# Security guidelines for cross-organizational apps

When you host or stream apps on Azure Virtual Desktop, you reach a wide variety of users inside and outside of your organization. As a result, it's extremely important to know how to keep your deployment secure so that you can keep your organization and your customers safe. This guide will give you a basic understanding of possible safety concerns and how to address them.

## Shared responsibility

Before Azure Virtual Desktop, on-premises virtualization solutions like Remote Desktop Services require granting users access to roles like Gateway, Broker, Web Access, and so on. These roles had to be fully redundant and able to handle peak capacity. Admins would install these roles as part of the Windows Server OS, and they had to be domain-joined with specific ports accessible to public connections. To keep deployments secure, admins had to constantly make sure everything in the infrastructure was maintained and up-to-date.

Meanwhile, Azure Virtual Desktop manages portions of the services on the customer's behalf. Specifically, Microsoft hosts and manages the infrastructure parts as part of the service. Partners and customers no longer have to manually manage the required infrastructure to let users access session host virtual machines (VMs). The service also has built-in advanced security capabilities like reverse connect, which reduces the risk involved with allowing users to access their remote desktops from anywhere.

To keep the service flexible, the session hosts are hosted in the partner or customers' Azure subscription. This lets customers integrate the service with other Azure services and lets them connect on-premises network infrastructure with ExpressRoute or a virtual private network (VPN).

Like many cloud services, there's a [shared set of security responsibilities](../../security/fundamentals/shared-responsibility.md) between you and Microsoft. When you use Azure Virtual Desktop, it's important to understand that while some parts of the service are secured for you, there are others you'll need to configure yourself according to your organization's security needs.

You'll need to configure security in the following areas:

- End-user devices
- Application security
- Session host operating systems
- Deployment configuration
- Network controls

For more information about how to configure each of these areas, check out our [security best practices](./../security-guide.md).

## Combined Microsoft security platform

You can protect workloads by using security features and controls from Microsoft 365, Azure, and Azure Virtual Desktop.

When the user connects to the service over the internet, Azure Active Directory (Azure AD) authenticates the user's credentials, enabling protective features like [multifactor authentication](../../active-directory/authentication/concept-mfa-howitworks.md) to help greatly reduce the risk of user identities being compromised.

Azure Virtual Desktop has features like [Reverse Connect](../network-connectivity.md#reverse-connect-transport) that allow users to access the session host without having to open inbound ports. This feature is designed with scalability and service in mind, so it shouldn't limit your ability to expand session hosts, either. You can also use existing GPOs with this feature to apply additional security with support for Active Directory-joined VMs or, for Windows 10 session hosts that might involve Azure Active Directory Join scenarios, [Microsoft Intune](/mem/intune/fundamentals/windows-virtual-desktop-multi-session).

## Defense in depth

Today's threat landscape requires designs with security approaches in mind. Ideally, you'll want to build a series of security mechanisms and controls layered throughout your computer network to protect your data and network from being compromised or attacked. This type of security design is what the United States Cybersecurity and Infrastructure Security Agency (CISA) calls "defense in depth".

## Security boundaries

Security boundaries separate the code and data of security domains with different levels of trust. For example, there's usually a security boundary between kernel mode and user mode. Most Microsoft software and services depend on multiple security boundaries to isolate devices on networks, VMs, and applications on devices. The following table lists each security boundary for Windows and what they do for overall security.

| Security boundary             | What the boundary does      |
|-----------------------------------|--------------------------------------|
| Network boundary              | An unauthorized network endpoint can't access or tamper with code and data on a customer’s device.                                                                   |
| Kernel boundary               | A non-administrative user mode process can't access or tamper with kernel code and data. Administrator-to-kernel is not a security boundary.                             |
| Process boundary              | An unauthorized user mode process can't access or tamper with the code and data of another process.                                                                      |
| AppContainer sandbox boundary | An AppContainer-based sandbox process can't access or tamper with code and data outside of the sandbox based on the container capabilities.                               |
| User boundary                 | A user can't access or tamper with the code and data of another user without being authorized.                                                                           |
| Session boundary              | A user session can't access or tamper with another user session without being authorized.                                                                    |
| Web browser boundary          | An unauthorized website can't violate the same-origin policy, nor can it access or tamper with the native code and data of the Microsoft Edge web browser sandbox.       |
| Virtual machine boundary      | An unauthorized Hyper-V guest virtual machine can't access or tamper with the code and data of another guest virtual machine; this includes Hyper-V isolated containers. |
| Virtual Secure Mode (VSM) boundary  | Code running outside of the VSM trusted process or enclave can't access or tamper with data and code within the trusted process.                              |

## Security features

Security features build upon security boundaries to strengthen protection against specific threats. However, in some cases, there can be by-design limitations that prevent the security feature from fully protecting the deployment.

Azure Virtual Desktop supports most security features available in Windows. Security features that rely on hardware features, such as (v)TPM or nested virtualization, might require a separate support statement from the Azure Virtual Desktop team.

To learn more about security feature support and servicing, see our [Microsoft Security Servicing Criteria for Windows](https://www.microsoft.com/msrc/windows-security-servicing-criteria).

## Recommended security boundaries for Azure Virtual Desktop scenarios

You'll also need to make certain choices about security boundaries on a case-by-case basis. For example, if a user in your organization needs local administrative privileges to install apps, you'll need to give them a personal desktop instead of a shared RDSH. We don't recommend giving users local admin privileges in multi-session pooled scenarios because these users can cross security boundaries for sessions or NTFS data permissions, shut down multi-session VMs, or do other things that could interrupt service or cause data losses.

Users from the same organization, like knowledge workers with apps that don't require admin privileges, are great candidates for multi-session Remote Desktop session hosts like Windows 10 Enterprise multi-session. These session hosts reduce costs for your organization because multiple users can share a single VM, with only the overhead costs of a single OS. With profile technology like FSLogix, users can be assigned any VM in a host pool without noticing any service interruptions. This feature also lets you optimize costs by doing things like shutting down VMs during off-peak hours.

If your situation requires users from different organizations to connect to your deployment, we recommend you have a separate tenant for identity services like Active Directory and Azure AD. We also recommend you have a separate subscription for hosting Azure resources like Azure Virtual Desktop and VMs.

The following table lists our recommendations for each scenario.

| Trust level scenario                                 | Recommended solution                |
|------------------------------------------------------|-------------------------------------|
| Users from one organization with standard privileges | Windows 10 Enterprise multi-session |
| Users require administrative privileges             | Personal Desktops (VDI)             |
| Users from different organizations connecting        | Separate Azure subscription         |

Let's take a look at our recommendations for some example scenarios.

### Should I share Identity resources to reduce costs?

We don't currently recommend using a shared identity system in Azure Virtual Desktop. We recommend that you have separate Identity resources that you deploy in a separate Azure subscription. These resources include Active Directories, Azure AD, and VM workloads. Every user working for an individual organization will need additional infrastructure and associated maintenance costs, but this is currently the most feasible solution for security purposes. 

### Should I share a multi-session Remote Desktop (RD) session host VM to reduce costs?

Multi-session RD session hosts save costs by sharing hardware resources like CPU and memory among users. This resource sharing lets you design for peak capacity, even if it’s unlikely all users will need maximum resources at the same time. In a shared multi-session environment, hardware resources are shared and allocated so that they reduce the gap between usage and costs.

In many cases, using multi-session is an acceptable way to reduce costs, but whether we recommend it depends on the trust level between users with simultaneous access to a shared multi-session instance. Typically, users that belong to the same organization have a sufficient and agreed-upon trust relationship. For example, a department or workgroup where people collaborate and can access each other’s personal information is an organization with a high trust level.

Windows uses security boundaries and controls to ensure user processes and data are isolated between sessions. However, Windows still provides access to the instance the user is working on.

This deployment would benefit from a security in depth strategy that adds more security boundaries that prevent users within and outside of the organization from getting unauthorized access to other users' personal information. Unauthorized data access happens because of an error in the configuration process by the system admin, such as an undisclosed security vulnerability or a known vulnerability that hasn't been patched out yet.

On the other hand, Microsoft doesn't support granting users that work for different or competing companies access to the same multi-session environment. These scenarios have several security boundaries that can be attacked or abused, like network, kernel, process, user, or sessions. A single security vulnerability could cause unauthorized data and credential theft, personal information leaks, identity theft, and other issues. Virtualized environment providers are responsible for offering well-designed systems with multiple strong security boundaries and extra safety features enabled wherever possible.

Reducing these potential threats requires a fault-proof configuration, patch management design process, and regular patch deployment schedules. It's better to follow the principles of defense in depth and keep environments separate.

## Next steps

Find our recommended guidelines for configuring security for your Azure Virtual Desktop deployment at our [security best practices](./../security-guide.md).
