<properties
	pageTitle="Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join| Microsoft Azure"
	description="Provides a detailed overview of how Widows 10 devices can utilize Azure AD Join to get registered on Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor=""
	tags="azure-classic-portal"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/07/2015"
	ms.author="femila"/>

# Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join

## What is Azure Active Directory Join?
Azure Active Directory Join (Azure AD Join )is the functionality that registers a company-owned device in Azure Active Directory to enable centralized management of the device. It means that users such as employees and students can now be connected to the enterprise cloud through Azure Active Directory. This enables simplified Windows deployments and access to organizational apps and resources from any Windows device, both corporate-owned and personally-owned. (BYOD).

Azure AD Join is intended for enterprises that are cloud-first/cloud-only--typically small- and medium-sized businesses that do not have an on-premises Windows Server Active Directory infrastructure. That said, Azure AD Join can and will also be used by large organizations on devices that are incapable of doing a traditional domain join  mobile devices, for example) or for users who need to access primarily Office 365 or other Azure AD SaaS apps.

Although the traditional domain join still offers the best on-premises experience on devices that are capable of domain joining, Azure AD Join is suitable for devices that cannot domain join. Azure AD Join is also suitable for managing users in the cloud with mobile device management capabilities instead of with the traditional domain management tools like Group Policy and System Center Configuration Manager (SCCM).

![](./media/active-directory-azureadjoin/active-directory-azureadjoin-overview.png)


## Why should enterprises adopt Azure AD Join?

* **If your business is largely in the cloud**: If you have or are moving to a model in which you are reducing your on-premises footprint and want to operate more in the cloud, Azure AD Join could benefit you. Maybe you have created Azure AD accounts manually or through synchronizing your on-premises Active Directory. Either way, you have an account in Azure AD and you can use it to sign in to Windows 10. You users can join their computers to Azure AD through either the out-of-box experience (OOBE) process or through the Settings experience. Your users now enjoy single sign-on (SSO) access to  cloud resources like Office 365 either in their browser or in  Office applications.

* **Educational institutions**: One of the big scenarios we hear about is that educational institutions have two user types: faculty and students. Faculty members are considered longer-term members of the organization, so creating on-premises accounts for them is desirable. But students are shorter term members of the organization and thus can be managed in Azure AD, so directory scale can be pushed to the cloud instead of stored on-premises. These students can now sign in to Windows with their Azure AD account and get access to the Office 365 resources in  Office applications.

* **Retail businesses**: Another area we’ve heard about from customers is their desire to have easier management of seasonal workers.  Again, longer-term, full-time employees are created as on-premises accounts and would typically use domain joined machines. But seasonal workers are shorter-term members of the org and thus are desired to managed where user licenses can be more easily moved around. Creating these users in the cloud with Office 365 licenses allows these users to get the benefits of signing in to Windows and Office applications with an Azure AD account while maintaining more mobility of their licenses once they leave.
* **Other businesses**: You might find that even though you maintain users in your on-premises AD directory, you could still benefit from having users be Azure-AD-joined, because of the simplified joining experience, efficient device management, automatic mobile device management  enrollment, and single sign-on capability for Azure AD and on-premises resources.  

## Azure AD Join capabilities
With Azure AD Join, you get the following:

* **Self-provisioning of corporate-owned devices**: With Windows 10, users can configure a brand new, shrink-wrapped device in the out-of-box experience, without IT involvement.


* **Support for modern form factors**: Azure AD Join will work on devices that don’t have the traditional domain join capabilities.  


* **Uses existing organizational accounts**: Users no longer need to create and maintain a a personal Microsoft account to get the best experience on company-issued devices, as they did with Windows 8. They can use their existing work account in Azure AD instead. For many organizations, this basically means setting up and signing in to Windows with the same credentials that they use to access Office 365.


* **Automatic mobile device management  enrollment**: Devices can be automatically enrolled in management when connected to Azure AD. This will work with Microsoft Intune and with partner mobile device management apps. When device management is done  with Intune, IT can monitor/manage Azure AD-joined devices alongside domain-joined devices in the SCCM management console.


* **Single sign-on to company resources**: Users enjoy single sign-on from the Windows desktop to apps and resources in the cloud, such as Office 365 and thousands of business applications that rely on Azure AD for authentication through [Azure AD Connect](active-directory-azureadjoin-deployment-aadjoindirect.md). Corporate-owned devices that are joined to Azure AD will also enjoy SSO to on-premises resources when the device is on corpnet, and from anywhere when these resources are exposed via the [Azure AD Application Proxy](https://msdn.microsoft.com/library/azure/Dn768219.aspx).


* **OS State Roaming**: Things like accessibility settings, websites, and Wi-Fi passwords will be synchronized across corporate-owned devices without requiring a personal Microsoft account.


* **Enterprise-ready Windows store**: Windows Store will support app acquisition and licensing with Azure AD accounts. Organizations will be able to volume-license apps and make them available to the users in their organization.

## How different devices work with Azure AD Join

| Corporate device (joined to on-premises domain)                                                                                                                                                                                         | Corporate device  (joined to the cloud)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Personal device                                                                                                         |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Users can sign into Windows with work credentials (as they do today).                                                                                                                                                                        | Users can log on to Windows with work credentials that are managed in Azure AD. This is relevant for corporate devices in three cases: The organization doesn’t have Active Directory on premises (for example, a small business) The organization doesn’t create all user accounts in AD (for example students, consultants, or seasonal workers) Azure AD Join supports joining of corporate devices that can’t be joined to an (on-premises) domain, like phones or tablets running a Mobile SKU (for example, secondary device taken to factory/retail floor). This works for both managed and federated organizations. | Users log on to Windows with their personal MSA credentials (no change)                                                |
| Users have access to roaming  settings and Windows Store--these services work with work accounts (no need for personal Microsoft account). This requires organizations to connect their on-premises AD to Azure AD                                        | Users can do self-service setup--they can go through first-run experience (FRX) through their work account (as an alternative to having IT provision the devices, although both methods are supported).                                                                                                                                                                                                                                                                                                                                                                             | Super easy to add a work account that’s managed in AD or Azure AD                                                      |
| SSO from desktop to work apps/websites/resources, both on-premises and in the cloudApps that use Azure AD for authentication                                                                                                            | Auto-registration in enterprise directory (Azure AD) and auto-enrolment in MDM. (Azure AD Premium feature)                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Provides SSO across apps and to websites/resources with this work account                                              |
| Users can add their personal MSA to access their personal pictures/files without impacting enterprise data (roaming settings continues to work with work account) The MSA account enables SSO and no longer drives roaming of settings  | Self-service password reset (SSPR) on winlogon (ability to reset forgotten password) (You need AzureAD Premium for this)                                                                                                                                                                                                                                                                                                                                                                                                                                    | Provides access to enterprise Store so that users can acquire and use LoB apps on their personal devices |                                                               |


## Additional information
* [Windows 10 for the enterprise: Ways to use devices for work](active-directory-azureadjoin-windows10-devices-overview.md)
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Authenticating identities without passwords through Microsoft Passport](active-directory-azureadjoin-passport.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)
