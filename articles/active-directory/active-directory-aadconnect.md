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
	ms.date="10/06/2015"
	ms.author="andkjell;billmath"/>

# Integrating your on-premises identities with Azure Active Directory
Azure AD Connect is the tool to integrate your on-premises identity system such as Windows Server Active Directory with Azure Active Directory and connect your users to Office 365, Azure and 1000’s of SaaS applications. This topic provides a comprehensive guide to prepare and deploy the necessary components for your end users to access cloud services with the same identity that they use today to access existing company apps.

![What is Azure AD Connect](./media/active-directory-aadconnect/arch.png)

## Why use Azure AD Connect
Integrating your on-premises directories with Azure AD makes your users more productive by providing a common identity for accessing both cloud and on-premises resources.  With this integration users and organizations can take advantage of the following:

- Users can use a single identity to access on-premises applications and cloud services such as Office 365.

- Single tool to provide an easy deployment experience for synchronization and sign-in.

- Provides the newest capabilities for your scenarios. Azure AD Connect replaces older versions of identity integration tools such as DirSync and Azure AD Sync. For more information, see [Directory integration tools comparison](active-directory-aadconnect-get-started-tools-comparison.md).


### How Azure AD Connect works

Azure Active Directory Connect is made up of three primary parts.  They are the synchronization services, the optional Active Directory Federation Services piece, and the monitoring piece which is done using [Azure AD Connect Health](active-directory-aadconnect-health.md).

<center>![Azure AD Connect Stack](./media/active-directory-aadconnect-how-it-works/AADConnectStack2.png)
</center>

- Synchronization - This part is made up of the components and functionality previously released as [Dirsync and Azure AD Sync](active-directory-aadconnect-get-started-tools-comparison.md).  This is the part that is responsible for creating users and groups.  It is also responsible for making sure that the information on users and groups in your on-premises environment, matches the cloud.
- AD FS - This is an optional part of Azure AD Connect and can be used to setup a hybrid environment using an on-premises AD FS infrastructure.  This part can be used by organizations to address complex deployments that include such things as domain join SSO, enforcement of AD login policy and smart card or 3rd party MFA.
- Health Monitoring - Azure AD Connect Health can provide robust monitoring of your AD FS servers and provide a central location in the Azure portal to view this activity.  For additional information see [Azure Active Directory Connect Health](active-directory-aadconnect-health.md).

## Install Azure AD Connect

You can find the download for Azure AD Connect on [Microsoft Download Center](http://go.microsoft.com/fwlink/?LinkId=615771).


| Solution | Scenario |
| ----- | ----- |
| [Express settings](active-directory-aadconnect-get-started-express.md) | <li>Recommended and default option if you have a single forest AD.</li> <li>User sign in with the same password using password synchronziation.</li>
| [Customized settings](active-directory-aadconnect-get-started-custom.md) | <li>Used when you have multiple forests. Supports many on-premises [topologies](active-directory-aadconnect-topologies.md).</li> <li>Customize your sign-in option , such as ADFS for federation or use a 3rd party identity provider.</li> <li>Customize synchronization features, such as filtering and writeback.</li>
| [Upgrade from DirSync](active-directory-aadconnect-dirsync-upgrade-get-started.md) | <li>If you have an existing DirSync server already running.</li>
| Upgrade from Azure AD Sync | <li>This is a seamless in-place upgrade.</li>


[After installation](active-directory-aadconnect-whats-next.md) you should verify it is working as expected and assign licenses to the users.

### Next steps to Install Azure AD Connect

| Topic |  |
| --------- | --------- |
| Hardware and prerequisites | [Azure AD Connect: Hardware and prerequisites](active-directory-aadconnect-prerequisites.md) |
| Download Azure AD Connect | [Download Azure AD Connect](http://go.microsoft.com/fwlink/?LinkId=615771) |
| Install using Express settings | [Express installation of Azure AD Connect](active-directory-aadconnect-get-started-express.md) |
| Install using Customized settings | [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md) |
| Upgrade from DirSync | [Upgrade from Azure AD sync tool (DirSync)](active-directory-aadconnect-dirsync-upgrade-get-started.md) |
| After installation | [Verify the installation and assign licenses ](active-directory-aadconnect-whats-next.md) |

### Learn more about Install Azure AD Connect

You also want to prepare for [operational](active-directory-aadconnectsync-operations.md) concerns. You might want to have a stand-by server so you easily can fall over in case of a [disaster](active-directory-aadconnectsync-operations.md#disaster-recovery). If you plan to make frequent configuration changes you should plan for a [staging mode](active-directory-aadconnectsync-operations.md#staging-mode) server.

| Topic |  |
| --------- | --------- |
| Supported topologies | [Topologies for Azure AD Connect](active-directory-aadconnect-topologies.md) |
| Design concepts | [Azure AD Connect design concepts](active-directory-aadconnect-design-concepts.md) |
| Accounts used for installation | [More about Azure AD Connect credentials and permissions](active-directory-aadconnect-accounts-permissions.md) |
| Operational planning | [Azure AD Connect sync: Operational tasks and considerations](active-directory-aadconnectsync-operations.md) |

## Configure features
Azure AD Connect comes with several features you can optionally turn on or are enabled by default. Some features might in some cases require additional configuration in certain scenarios and topologies.

[Filtering](active-directory-aadconnectsync-configure-filtering.md) is used when you want to limit which objects are synchronized to Azure AD. By default all users, contacts, groups, and Windows 10 computers are synchronized, but you can limit this based on domains, OUs, or attributes.

[Password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) will synchronize the password hash in Active Directory to Azure AD. This allows the user to use the same password on-premises and in the cloud but only manage it in one location. Since it will use your on-premises Active Directory it will also allow you to use your own password policy.

[Password writeback](active-directory-passwords-getting-started.md) will allow your users to change and reset their passwords in the cloud and have your on-premises password policy applied.

[Device writeback](active-directory-aadconnect-get-started-custom-device-writeback.md) will allow a device registered in Azure AD to be written back to on-premises Active Directory so it can be used for conditional access.

The [prevent accidental deletes](active-directory-aadconnectsync-feature-prevent-accidental-deletes.md) feature is turned on by default and will protect your cloud directory from a lot of deletes at the same time. By default it will allow 500 deletes per run and this can be changed depending on your organization’s size.

### Next steps to configure features

| Topic |  |
| --------- | --------- |
| Configure filtering | [Azure AD Connect sync: Configure filtering](active-directory-aadconnectsync-configure-filtering.md) |
| Password synchronization | [Azure AD Connect sync: Implement password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) |
| Password writeback | [Getting started with password management](active-directory-passwords-getting-started.md) |
| Device writeback | [Enabling device writeback in Azure AD Connect](active-directory-aadconnect-get-started-custom-device-writeback.md) |
| Prevent accidental deletes | [Azure AD Connect sync: Prevent accidental deletes](active-directory-aadconnectsync-feature-prevent-accidental-deletes.md) |

## Customize Azure AD Connect sync
Azure AD Connect sync comes with a default configuration which is intended to work for most customers and topologies. But there are always situations where the default configuration will not work and must be adjusted. It is supported to make changes as documented in this section and linked topics.

If you have not worked with a synchronization topology before you want to start to understand the basics and the terms used as described in the [technical concepts](active-directory-aadconnect-technical-concepts.md). Azure AD Connect is the evolution of MIIS2003, ILM2007, and FIM2010. Even if some things are identical, a lot has changed as well.

The configuration assumes there might be more than one forest in the configuration. In those topologies a user object might be represented as a contact in another forest. The user might also have a linked mailbox in another resource forest. The behavior of the default configuration is described in [users and contacts](active-directory-aadconnectsync-understanding-users-and-contacts.md).

The configuration model in sync is called [declarative provisioning](active-directory-aadconnectsync-understanding-declarative-provisioning-expressions.md). The advanced attribute flows are using [functions](active-directory-aadconnectsync-functions-reference.md) to express attribute transformations. You can see and examine the entire configuration using tools which comes with Azure AD Connect. If you need to make changes to the configuration, make sure you follow the [best practices](active-directory-aadconnectsync-best-practices-changing-default-configuration.md) so it will be easier to adopt new releases as these are made available.

### Next steps to customize Azure AD Connect sync

| Topic |  |
| --------- | --------- |
| Technical concepts | [Azure AD Connect sync: Technical Concepts](active-directory-aadconnect-technical-concepts.md) |
| Understanding users and contacts | [Azure AD Connect sync: Understanding Users and Contacts](active-directory-aadconnectsync-understanding-users-and-contacts.md) |
| Declarative provisioning | [Azure AD Connect Sync: Understanding Declarative Provisioning Expressions](active-directory-aadconnectsync-understanding-declarative-provisioning-expressions.md) |
| Declarative provisioning functions reference | [Azure AD Connect sync: Functions Reference](active-directory-aadconnectsync-functions-reference.md) |
| Best practices | [Best practices for changing the default configuration](active-directory-aadconnectsync-best-practices-changing-default-configuration.md) |

## More information and references

| Topic |  |
| --------- | --------- |
| Version history | [Version history](active-directory-aadconnect-version-history.md) |
| Compare DirSync, Azure ADSync, and Azure AD Connect | [Directory integration tools comparison](active-directory-aadconnect-get-started-tools-comparison.md) |
| Attributes synchronized | [Attributes synchronized](active-directory-aadconnectsync-attributes-synchronized.md) |
| Monitoring using Azure AD Connect Health | [Azure AD Connect Health](active-directory-aadconnect-health.md) |
| Frequently Asked Questions | [Azure AD Connect FAQ](active-directory-aadconnect-faq.md) |


**Additional Resources**


Ignite 2015 presentation on extending your on-premises directories to the cloud.

[AZURE.VIDEO microsoft-ignite-2015-extending-on-premises-directories-to-the-cloud-made-easy-with-azure-active-directory-connect]
