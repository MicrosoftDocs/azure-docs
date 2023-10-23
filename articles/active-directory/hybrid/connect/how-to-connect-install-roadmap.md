---
title: 'Microsoft Entra Connect and Microsoft Entra Connect Health installation roadmap.'
description: This document provides an overview of the installation options and paths available for installing Microsoft Entra Connect and Connect Health.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Microsoft Entra Connect and Microsoft Entra Connect Health installation roadmap

<a name='install-azure-ad-connect'></a>

## Install Microsoft Entra Connect

> [!IMPORTANT]
> Microsoft doesn't support modifying or operating Microsoft Entra Connect Sync outside of the actions that are formally documented. Any of these actions might result in an inconsistent or unsupported state of Microsoft Entra Connect Sync. As a result, Microsoft can't provide technical support for such deployments.

You can find the download for Microsoft Entra Connect on [Microsoft Download Center](https://go.microsoft.com/fwlink/?LinkId=615771).

| Solution | Scenario |
| --- | --- |
| Before you start - [Hardware and prerequisites](how-to-connect-install-prerequisites.md) |<li>Steps to complete before you start to install Microsoft Entra Connect.</li> |
| [Express settings](how-to-connect-install-express.md) |<li>If you have a single forest AD then this is the recommended option to use.</li> <li>User sign in with the same password using password synchronization.</li> |
| [Customized settings](how-to-connect-install-custom.md) |<li>Used when you have multiple forests. Supports many on-premises [topologies](plan-connect-topologies.md).</li> <li>Customize your sign-in option, such as pass-through authentication, ADFS for federation or use a 3rd party identity provider.</li> <li>Customize synchronization features, such as filtering and writeback.</li> |
| [Upgrade from DirSync](how-to-dirsync-upgrade-get-started.md) |<li>Used when you have an existing DirSync server already running.</li> |
| [Upgrade from Azure AD Sync or Microsoft Entra Connect](how-to-upgrade-previous-version.md) |<li>There are several different methods depending on your preference.</li> |

[After installation](how-to-connect-post-installation.md) you should verify it is working as expected and assign licenses to the users.

<a name='next-steps-to-install-azure-ad-connect'></a>

### Next steps to Install Microsoft Entra Connect
|Topic |Link|  
| --- | --- |
|Download Microsoft Entra Connect | [Download Microsoft Entra Connect](https://go.microsoft.com/fwlink/?LinkId=615771)|
|Install using Express settings | [Express installation of Microsoft Entra Connect](./how-to-connect-install-express.md)|
|Install using Customized settings | [Custom installation of Microsoft Entra Connect](./how-to-connect-install-custom.md)|
|Upgrade from DirSync | [Upgrade from Azure AD Sync tool (DirSync)](./how-to-dirsync-upgrade-get-started.md)|
|After installation | [Verify the installation and assign licenses](how-to-connect-post-installation.md)|

<a name='learn-more-about-install-azure-ad-connect'></a>

### Learn more about Install Microsoft Entra Connect
You also want to prepare for [operational](./how-to-connect-sync-staging-server.md) concerns. You might want to have a stand-by server so you easily can fail over if there is a [disaster](how-to-connect-sync-staging-server.md#disaster-recovery). If you plan to make frequent configuration changes, you should plan for a [staging mode](how-to-connect-sync-staging-server.md) server.

|Topic |Link|  
| --- | --- |
|Supported topologies | [Topologies for Microsoft Entra Connect](plan-connect-topologies.md)|
|Design concepts | [Microsoft Entra Connect design concepts](plan-connect-design-concepts.md)|
|Accounts used for installation | [More about Microsoft Entra Connect credentials and permissions](reference-connect-accounts-permissions.md)|
|Operational planning | [Microsoft Entra Connect Sync: Operational tasks and considerations](./how-to-connect-sync-staging-server.md)|
|User sign-in options | [Microsoft Entra Connect User sign-in options](plan-connect-user-signin.md)|

## Configure sync features
Microsoft Entra Connect comes with several features you can optionally turn on or are enabled by default. Some features might sometimes require more configuration in certain scenarios and topologies.

[Filtering](how-to-connect-sync-configure-filtering.md) is used when you want to limit which objects are synchronized to Microsoft Entra ID. By default all users, contacts, groups, and Windows 10 computers are synchronized. You can change the filtering based on domains, OUs, or attributes.

[Password hash synchronization](how-to-connect-password-hash-synchronization.md) synchronizes the password hash in Active Directory to Microsoft Entra ID. The  end-user can use the same password on-premises and in the cloud but only manage it in one location. Since it uses your on-premises Active Directory as the authority, you can also use your own password policy.

[Password writeback](../../authentication/tutorial-enable-sspr.md) will allow your users to change and reset their passwords in the cloud and have your on-premises password policy applied.

[Device writeback](how-to-connect-device-writeback.md) will allow a device registered in Microsoft Entra ID to be written back to on-premises Active Directory so it can be used for Conditional Access.

The [prevent accidental deletes](how-to-connect-sync-feature-prevent-accidental-deletes.md) feature is turned on by default and protects your cloud directory from numerous deletes at the same time. By default it allows 500 deletes per run. You can change this setting depending on your organization size.

[Automatic upgrade](how-to-connect-install-automatic-upgrade.md) is enabled by default for express settings installations and ensures your Microsoft Entra Connect is always up to date with the latest release.

### Next steps to configure sync features
|Topic |Link|  
| --- | --- |
|Configure filtering | [Microsoft Entra Connect Sync: Configure filtering](how-to-connect-sync-configure-filtering.md)|
|Password hash synchronization | [Password hash synchronization](how-to-connect-password-hash-synchronization.md)|
|Pass-through Authentication | [Pass-through authentication](how-to-connect-pta.md)
|Password writeback | [Getting started with password management](../../authentication/tutorial-enable-sspr.md)|
|Device writeback | [Enabling device writeback in Microsoft Entra Connect](how-to-connect-device-writeback.md)|
|Prevent accidental deletes | [Microsoft Entra Connect Sync: Prevent accidental deletes](how-to-connect-sync-feature-prevent-accidental-deletes.md)|
|Automatic upgrade | [Microsoft Entra Connect: Automatic upgrade](how-to-connect-install-automatic-upgrade.md)|

<a name='customize-azure-ad-connect-sync'></a>

## Customize Microsoft Entra Connect Sync
Microsoft Entra Connect Sync comes with a default configuration that is intended to work for most customers and topologies. But there are always situations where the default configuration does not work and must be adjusted. It is supported to make changes as documented in this section and linked topics.

If you have not worked with a synchronization topology before you want to start to understand the basics and the terms used as described in the [technical concepts](how-to-connect-sync-technical-concepts.md). Microsoft Entra Connect is the evolution of MIIS2003, ILM2007, and FIM2010. Even if some things are identical, a lot has changed as well.

The [default configuration](concept-azure-ad-connect-sync-default-configuration.md) assumes there might be more than one forest in the configuration. In those topologies a user object might be represented as a contact in another forest. The user might also have a linked mailbox in another resource forest. The behavior of the default configuration is described in [users and contacts](concept-azure-ad-connect-sync-user-and-contacts.md).

The configuration model in sync is called [declarative provisioning](concept-azure-ad-connect-sync-declarative-provisioning-expressions.md). The advanced attribute flows are using [functions](reference-connect-sync-functions-reference.md) to express attribute transformations. You can see and examine the entire configuration using tools which comes with Microsoft Entra Connect. If you need to make configuration changes, make sure you follow the [best practices](how-to-connect-sync-best-practices-changing-default-configuration.md) so it is easier to adopt new releases.

<a name='next-steps-to-customize-azure-ad-connect-sync'></a>

### Next steps to customize Microsoft Entra Connect Sync
|Topic |Link|  
| --- | --- |
|All Microsoft Entra Connect Sync articles | [Microsoft Entra Connect Sync](how-to-connect-sync-whatis.md)|
|Technical concepts | [Microsoft Entra Connect Sync: Technical Concepts](how-to-connect-sync-technical-concepts.md)|
|Understanding the default configuration | [Microsoft Entra Connect Sync: Understanding the default configuration](concept-azure-ad-connect-sync-default-configuration.md)|
|Understanding users and contacts | [Microsoft Entra Connect Sync: Understanding Users and Contacts](concept-azure-ad-connect-sync-user-and-contacts.md)|
|Declarative provisioning | [Microsoft Entra Connect Sync: Understanding Declarative Provisioning Expressions](concept-azure-ad-connect-sync-declarative-provisioning-expressions.md)|
|Change the default configuration | [Best practices for changing the default configuration](how-to-connect-sync-best-practices-changing-default-configuration.md)|

## Configure federation features

Microsoft Entra Connect provides several features that simplify federating with Microsoft Entra ID using AD FS and managing your federation trust. Microsoft Entra Connect supports AD FS on Windows Server 2012R2 or later.

[Update TLS/SSL certificate of AD FS farm](how-to-connect-fed-ssl-update.md) even if you are not using Microsoft Entra Connect to manage your federation trust.

[Add an AD FS server](how-to-connect-fed-management.md#addadfsserver) to your farm to expand the farm as required.

[Repair the trust](how-to-connect-fed-management.md#repairthetrust) with Microsoft Entra ID in a few simple clicks.

ADFS can be configured to support [multiple domains](how-to-connect-install-multiple-domains.md). For example you might have multiple top domains you need to use for federation.

If your ADFS server has not been configured to automatically update certificates from Microsoft Entra ID or if you use a non-ADFS solution, then you will be notified when you have to [update certificates](how-to-connect-fed-o365-certs.md).

### Next steps to configure federation features
|Topic |Link|  
| --- | --- |
|All AD FS articles | [Microsoft Entra Connect and federation](how-to-connect-fed-whatis.md)|
|Configure ADFS with subdomains | [Multiple Domain Support for Federating with Microsoft Entra ID](how-to-connect-install-multiple-domains.md)|
|Manage AD FS farm | [AD FS management and customization with Microsoft Entra Connect](how-to-connect-fed-management.md)|
|Manually updating federation certificates | [Renewing Federation Certificates for Microsoft 365 and Microsoft Entra ID](how-to-connect-fed-o365-certs.md)|


<a name='get-started-with-azure-ad-connect-health'></a>

## Get started with Microsoft Entra Connect Health
To get started with Microsoft Entra Connect Health, use the following steps:

1. [Get Microsoft Entra ID P1 or P2](../../fundamentals/get-started-premium.md) or [start a trial](https://azure.microsoft.com/trial/get-started-active-directory/).
2. [Download and install Microsoft Entra Connect Health Agents](#download-and-install-azure-ad-connect-health-agent) on your identity servers.
3. View the Microsoft Entra Connect Health dashboard at [https://aka.ms/aadconnecthealth](https://aka.ms/aadconnecthealth).

> [!NOTE]
> Remember that before you see data in your Microsoft Entra Connect Health dashboard, you need to install the Microsoft Entra Connect Health Agents on your targeted servers.
>
>

<a name='download-and-install-azure-ad-connect-health-agent'></a>

## Download and install Microsoft Entra Connect Health Agent
* Make sure that you [satisfy the requirements](how-to-connect-health-agent-install.md#requirements) for Microsoft Entra Connect Health.
* Get started using Microsoft Entra Connect Health for AD FS
    * [Download Microsoft Entra Connect Health Agent for AD FS.](https://go.microsoft.com/fwlink/?LinkID=518973)
    * [See the installation instructions](how-to-connect-health-agent-install.md#install-the-agent-for-ad-fs).
* Get started using Microsoft Entra Connect Health for sync
    * [Download and install the latest version of Microsoft Entra Connect](https://go.microsoft.com/fwlink/?linkid=615771). The Health Agent for sync will be installed as part of the Microsoft Entra Connect installation (version 1.0.9125.0 or higher).
* Get started using Microsoft Entra Connect Health for AD DS
    * [Download Microsoft Entra Connect Health Agent for AD DS](https://go.microsoft.com/fwlink/?LinkID=820540).
    * [See the installation instructions](how-to-connect-health-agent-install.md#install-the-agent-for-azure-ad-ds).


<a name='azure-ad-connect-health-portal'></a>

## Microsoft Entra Connect Health portal
The Microsoft Entra Connect Health portal shows views of alerts, performance monitoring, and usage analytics. The  https://aka.ms/aadconnecthealth URL takes you to the main blade of Microsoft Entra Connect Health. You can think of a blade as a window. On The main blade, you see **Quick Start**, services within Microsoft Entra Connect Health, and additional configuration options. See the following screenshot and brief explanations that follow the screenshot. After you deploy the agents, the health service automatically identifies the services that Microsoft Entra Connect Health is monitoring.

> [!NOTE]
> For licensing information, see the [Microsoft Entra Connect Health FAQ](reference-connect-health-faq.yml) or the [Microsoft Entra pricing page](https://aka.ms/aadpricing).
    
![Microsoft Entra Connect Health Portal](./media/whatis-hybrid-identity-health/portalsidebar.png)

* **Quick Start**: When you select this option, the **Quick Start** blade opens. You can download the Microsoft Entra Connect Health Agent by selecting **Get Tools**. You can also access documentation and provide feedback.
* **Microsoft Entra Connect (sync)**: This option shows your Microsoft Entra Connect servers that Microsoft Entra Connect Health is currently monitoring. **Sync errors** entry will show basic sync errors of your first onboarded sync service  by categories. When you select the **Sync services** entry, the blade that opens shows information about your Microsoft Entra Connect servers. Read more about the capabilities at [Using Microsoft Entra Connect Health for sync](how-to-connect-health-sync.md).
* **Active Directory Federation Services**: This option shows all the AD FS services that Microsoft Entra Connect Health is currently monitoring. When you select an instance, the blade that opens shows information about that service instance. This information includes an overview, properties, alerts, monitoring, and usage analytics. Read more about the capabilities at [Using Microsoft Entra Connect Health with AD FS](how-to-connect-health-adfs.md).
* **Active Directory Domain Services**: This option shows all the AD DS forests that Microsoft Entra Connect Health is currently monitoring. When you select a forest, the blade that opens shows information about that forest. This information includes an overview of essential information, the Domain Controllers dashboard, the Replication Status dashboard, alerts, and monitoring. Read more about the capabilities at [Using Microsoft Entra Connect Health with AD DS](how-to-connect-health-adds.md).
* **Configure**: This section includes options to turn the following on or off:

   - The **automatic update** of the Microsoft Entra Connect Health agent to the latest version: the Microsoft Entra Connect Health agent is automatically updated whenever new versions are available. This option is enabled by default.
   - **Access to data** from the Microsoft Entra directory integrity by Microsoft only for troubleshooting purposes: if this option is enabled, Microsoft can access the same data viewed by the user. This information can be useful for troubleshooting and to provide the necessary assistance. This option is disabled by default
* **Role based access control (IAM)** is the section to manage the access to Connect Health data in role base. 

## Next Steps

- [Hardware and prerequisites](how-to-connect-install-prerequisites.md) 
- [Express settings](how-to-connect-install-express.md)
- [Customized settings](how-to-connect-install-custom.md)
- [Password hash synchronization](how-to-connect-password-hash-synchronization.md)|
- [Pass-through authentication](how-to-connect-pta.md)
- [Microsoft Entra Connect and federation](how-to-connect-fed-whatis.md)
- [Install Microsoft Entra Connect Health agents](how-to-connect-health-agent-install.md) 
- [Microsoft Entra Connect Sync](how-to-connect-sync-whatis.md)
