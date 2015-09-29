<properties
	pageTitle="Integrating your on-premises identities with Azure Active Directory. | Microsoft Azure"
	description="This is the Azure AD Connect that describes what it is and why you would use it."
	services="active-directory"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/29/2015"
	ms.author="andkjell;billmath"/>

# Integrating your on-premises identities with Azure Active Directory
This topic describes Azure AD Connect and helps you decide if this is the right tool for you, how to prepare and install it.

Today, users want to be able to access applications both on-premises and in the cloud.  They want to be able to do this from any device, be it a laptop, smart phone, or tablet.  In order for this to occur, you and your organization need to be able to provide a way for users to access these apps, however moving entirely to the cloud is not always an option.  

<center>![What is Azure AD Connect](./media/active-directory-aadconnect/arch.png)</center>

Azure AD Connect provides the following benefits:

- Your users can sign on with a common identity both in the cloud and on-premises.  They don't need to remember multiple passwords or accounts and administrators don't have to worry about the additional overhead multiple accounts can bring.
- A single tool and guided experience for connecting your on-premises directories with Azure Active Directory. Once installed the wizard deploys and configures all components required to get your directory integration up and running including sync services, password sync or AD FS, and prerequisites such as the Azure AD PowerShell module.

## Why use Azure AD Connect

Integrating your on-premises directories with Azure AD makes your users more productive by providing a common identity for accessing both cloud and on-premises resources.  With this integration users and organizations can take advantage of the following:

* Organizations can provide users with a common hybrid identity across on-premises or cloud-based services leveraging Windows Server Active Directory and then connecting to Azure Active Directory.
* Administrators can provide conditional access based on application resource, device and user identity, network location and multi-factor authentication.
* Users can leverage their common identity through accounts in Azure AD to Office 365, Intune, SaaS apps and third-party applications.  
* Developers can build applications that leverage the common identity model, integrating applications into Active Directory on-premises or Azure for cloud-based applications

Azure AD Connect makes this integration easy and simplifies the management of your on-premises and cloud identity infrastructure.

### How Azure AD Connect works

Azure Active Directory Connect is made up of three primary parts.  They are the synchronization services, the optional Active Directory Federation Services piece, and the monitoring piece which is done using [Azure AD Connect Health](https://msdn.microsoft.com/library/azure/dn906722.aspx).

<center>![Azure AD Connect Stack](./media/active-directory-aadconnect-how-it-works/AADConnectStack2.png)
</center>

- Synchronization - This part is made up of the components and functionality previously released as Dirsync and Azure AD Sync.  This is the part that is responsible for creating users and groups.  It is also responsible for making sure that the information on users and groups in your on-premises environment, matches the cloud.
- AD FS - This is an optional part of Azure AD Connect and can be used to setup a hybrid environment using an on-premises AD FS infrastructure.  This part can be used by organizations to address complex deployments that include such things as domain join SSO, enforcement of AD login policy and smart card or 3rd party MFA.  For additional information on configuring SSO see [DirSync with Single-Sign On](https://msdn.microsoft.com/library/azure/dn441213.aspx).
- Health Monitoring - For complex deployments using AD FS, Azure AD Connect Health can provide robust monitoring of your federation servers and provide a central location in the Azure portal to view this activity.  For additional information see [Azure Active Directory Connect Health](https://msdn.microsoft.com/library/azure/dn906722.aspx).

## Install Azure AD Connect

You can find the download for Azure AD Connect on [Microsoft Download Center](http://go.microsoft.com/fwlink/?LinkId=615771).

The majority of customers who will use Azure AD Connect will have a simple environment with a single forest on-premises and with the intent to use password sync as the single-sign on solution. If this describes you, then you can use express settings and don't have to worry about other details in this topic.

[Express settings](active-directory-aadconnect-get-started-express.md) is the default option and is used when you have a single on-premises Active Directory forest. It will deploy sync with password synchronization as sign-in to the cloud. This is the most common option to use and with only a few clicks extends your on-premises directory to the cloud.

[Customized settings](active-directory-aadconnect-get-started-custom.md) is used when you have multiple forests on-premises or when you want to configure more advanced settings, such as federation and which attributes to synchronize to the cloud. If you plan to use this, then also read the [design and prepare](#design-and-prepare) section before you start the installation.

If you have an existing DirSync server running it can be [upgraded](active-directory-aadconnect-dirsync-upgrade-get-started.md) to Azure AD Connect. Most configuration settings can be migrated automatically.

[After installation](active-directory-aadconnect-whats-next.md) you should verify it is working as expected and assign licenses to the users.

If you use Express settings we will need an enterprise admin account to make required changes to you directory. With Customized settings all pre-reqs can be prepared in advance and no special accounts and permissions are required to run the actual installer.

### Next steps to Install Azure AD Connect

| Topic |  |
| --------- | --------- |
| Download Azure AD Connect | [Download Azure AD Connect](http://go.microsoft.com/fwlink/?LinkId=615771) |
| Install using Express settings | [Express installation of Azure AD Connect](active-directory-aadconnect-get-started-express.md) |
| Install using Customized settings | [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md) |
| Upgrade from DirSync | [Upgrade from Windows Azure AD sync tool (DirSync)](active-directory-aadconnect-dirsync-upgrade-get-started.md) |
| After installation | [Verify the installation and assign licenses ](active-directory-aadconnect-whats-next.md) |
| Accounts used for installation | [More about Azure AD Connect credentials and permissions](active-directory-aadconnect-account-summary.md) |

## Design and prepare
Azure AD Connect can be used with many different [topologies](active-directory-aadconnect-topologies.md). There are many different topologies supported.

If you have a more advanced topology you want to make sure you understand which topology you have so during the installation you can chose the correct options.
If you have multiple forests and move users you want to make sure you understand the [sourceAnchor](active-directory-aadconnect-design-concepts.md#sourceAnchor) concept and have selected a good attribute to use.

You also want to prepare for [operational](active-directory-aadconnectsync-operations.md) concerns. You might want to have a stand-by server so you easily can fall over in case of a [disaster](active-directory-aadconnectsync-operations.md#disaster-recovery). If you plan to make frequent configuration changes you should plan for a [staging mode](active-directory-aadconnectsync-operations.md#staging-mode) server.

### Next steps to design and prepare

| Topic |  |
| --------- | --------- |
| Topologies | [Topologies for Azure AD Connect](active-directory-aadconnect-topologies.md) |
| Design concepts | [Azure AD Connect design concepts](active-directory-aadconnect-design-concepts.md) |
| Operational planning | [Azure AD Connect sync: Operational tasks and considerations](active-directory-aadconnectsync-operations.md) |
| Hardware and prerequisites | [Azure AD Connect: Hardware and prerequisites](active-directory-aadconnect-prerequisites.md) |

## Configure features
Azure AD Connect comes with several features you can optionally turn on or are enabled by default. Some features might in some cases require additional configuration in certain scenarios and topologies.

[Filtering](active-directory-aadconnectsync-configure-filtering.md) is used when you want to limit which objects are synchronized to Azure AD. By default all users, contacts, groups, and Windows 10 computers are synchronized, but you can limit this based on domains, OUs, or attributes.

[Password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) will synchronize the password hash in Active Directory to Azure AD. This allows the user to use the same password on-premises and in the cloud but only manage it in one location. Since it will use your on-premises Active Directory it will also allow you to use your own password policy.

[Device writeback](active-directory-aadconnect-get-started-custom-device-writeback.md) will allow a device registered in Azure AD to be written back to on-premises Active Directory so it can be used for conditional access.

The [prevent accidental deletes](active-directory-aadconnectsync-feature-prevent-accidental-deletes.md) feature is turned on by default and will protect your cloud directory from a lot of deletes at the same time. By default it will only allow 500 deletes per run and this can be changed depending on your organization’s size.

### Next steps to configure features

| Topic |  |
| --------- | --------- |
| Configure filtering | [Azure AD Connect sync: Configure filtering](active-directory-aadconnectsync-configure-filtering.md) |
| Password synchronization | [Azure AD Connect sync: Implement password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) |
| Device writeback | [Enabling device writeback in Azure AD Connect](active-directory-aadconnect-get-started-custom-device-writeback.md) |
| Prevent accidental deletes | [Azure AD Connect sync: Prevent accidental deletes](active-directory-aadconnectsync-feature-prevent-accidental-deletes.md) |

## Customize Azure AD Connect sync
Azure AD Connect sync comes with a default configuration which is intended to work for most customers and topologies. But there are always situations where the default configuration will not work and must be adjusted. It is supported to make changes as documented in this section and linked topics.

If you have not worked with a synchronization topology before you want to start to understand the basics and the terms used as described in the [technical concepts](active-directory-aadconnect-technical-concepts.md). Azure AD Connect is the evolution of MIIS2003, ILM2007, and FIM2010 and even if some things are identical, a lot has changed as well.

The configuration assumes there might be more than one forest in the configuration. In those topologies a user object might be represented as a contact in another forest. The user might also have a linked mailbox in another resource forest. The behavior of the default configuration is described in [users and contacts](active-directory-aadconnectsync-understanding-users-and-contacts.md).

The configuration model in sync is called [declarative provisioning](active-directory-aadconnectsync-understanding-declarative-provisioning-expressions.md). The advanced attribute flows are using [functions](active-directory-aadconnectsync-functions-reference.md) to express attribute transformations. You can see and examine the entire configuration using tolls which comes with Azure AD Connect. If you need to make changes to the configuration, make sure you follow the [best practices](active-directory-aadconnectsync-best-practices-changing-default-configuration.md) so it will be easier to adopt new releases as these are made available.

### Next steps to customize Azure AD Connect sync

| Topic |  |
| --------- | --------- |
| Technical concepts | [Azure AD Connect sync: Technical Concepts](active-directory-aadconnect-technical-concepts.md) |
| Understanding users and contacts | [Azure AD Connect sync: Understanding Users and Contacts](active-directory-aadconnectsync-understanding-users-and-contacts.md) |
| Declarative provisioning | [Azure AD Connect Sync: Understanding Declarative Provisioning Expressions](active-directory-aadconnectsync-understanding-declarative-provisioning-expressions.md) |
| Declarative provisioning functions reference | [Azure AD Connect sync: Functions Reference](active-directory-aadconnectsync-functions-reference.md) |
| Best practices | [Best practices for changing the default configuration](active-directory-aadconnectsync-best-practices-changing-default-configuration.md) |

## More information

| Topic |  |
| --------- | --------- |
| Version history | [Version history](active-directory-aadconnect-version-history.md) |
| Compare DirSync, Azure ADSync, and Azure AD Connect | [Directory integration tools comparison](active-directory-aadconnect-get-started-tools-comparison.md) |
| Attributes synchronized | [Attributes synchronized](active-directory-aadconnectsync-attributes-synchronized.md) |


Also, some of the documentation that was created for Azure AD Sync is still relevant and applies to Azure AD Connect.  Although every effort is being made to bring this documentation over to Azure.com, some of this documentation still resides in the MSDN scoped library.  For additional documentation see [Azure AD Connect on MSDN](active-directory-aadconnect.md) and [Azure AD Sync on MSDN](https://msdn.microsoft.com/library/azure/dn790204.aspx).


**Additional Resources**


Ignite 2015 presentation on extending your on-premises directories to the cloud.

[AZURE.VIDEO microsoft-ignite-2015-extending-on-premises-directories-to-the-cloud-made-easy-with-azure-active-directory-connect]

[Multi-forest Directory Sync with Single Sign-On Scenario](https://msdn.microsoft.com/library/azure/dn510976.aspx) - Integrate multiple directories with Azure AD.

[Azure AD Connect Health](active-directory-aadconnect-health.md) - Monitor the health of your on-premises AD FS infrastructure.

[Azure AD Connect FAQ](active-directory-aadconnect-faq.md) - Frequently asked questions around Azure AD Connect.
