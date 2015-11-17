<properties 
	pageTitle="Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join| Microsoft Azure" 
	description="A topic that explains Azure AD Join." 
	services="active-directory" 
	documentationCenter="" 
	authors="femila" 
	manager="stevenpo" 
	editor=""/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/30/2015" 
	ms.author="femila"/>

# Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join

## What is Azure Active Directory Join 
Azure Active Directory (Azure AD) Join is the functionality that registers a company-owned device in Azure Active Directory to enable centralized management. It means users (employees, students) can now be connected to the enterprise cloud through Azure Active Directory. This enables simplified Windows deployments, access to organizational apps and resources from any Windows device, both corp-owned or personally owned devices (BYOD). 

Azure AD Join is intended for enterprises that are cloud-first/cloud-only (typically small and medium sized businesses that do not have on-premises Active Directory infrastructure That said, Azure AD Join can and will also be used by large organizations on devices that are incapable of doing traditional domain join (like mobile devices, for example) or for users who need to primarily access Office 365 or other Azure AD SaaS apps. 

While traditional domain join is still going to get you the best on-premises experiences on devices that are capable of domain joining, Azure AD join is suitable for devices that cannot domain join and in areas where you want to manage users in the cloud with MDM capabilities instead of your traditional domain management experiences with Group Policy and SCCM. 

![](./media/active-directory-azureadjoin/active-directory-azureadjoin-overview.png)


## Why should enterprises adopt Azure AD join 

 * **If your business is largely in the cloud**: If you have or are moving to a model where you are reducing your on-premises footprint and want to operate more in the cloud, Azure AD join could benefit you. Maybe you have created Azure AD accounts manually or through synchronizing your on-premises AD. Either way, you have an account in Azure AD and you can use it to sign in to Windows 10. You users can join their computers to Azure AD through either the OOBE process or through the Settings experience. Your users now enjoy SSO access to their cloud resources like Office 365 either in the browser or in the Office applications. 
* **Educational institutions**: One of the big scenarios we hear about is how education institutions have two user types: faculty and students. Faculty members are considered longer term members of the organization and creating on-premises accounts for them is desired. But students are shorter term members of the org and thus can be managed in Azure AD so directory scale can be pushed to the cloud instead of on-premises. These students can now sign in to Windows with their Azure AD account and get access to the Office 365 resources in the Office applications. 
* **Retail businesses**:Another area we’ve heard from customers is their design to have easier management of seasonal workers.  Again, longer term full time employees are created as on-premises accounts and would typically use domain joined machines. But seasonal workers are shorter term members of the org and thus are desired to managed where user licenses can be more easily moved around. Creating these users in the cloud with Office 365 licenses allows these users to get the benefits of signing in to Windows and Office applications with an Azure AD account while maintaining more mobility of their licenses once they leave. 
* **Other businesses**: And broader than these specific scenarios, you might find that even though you maintain users in your on-premises AD directory, you could still benefit with having users Azure AD join because of simplified joining experience, device management in Azure AD, automatic MDM enrollment, and single sign-on to Azure AD and on-premises resources.  

## Azure AD Join capabilities
With Azure AD Join, you get the following: 

* **Self-provisioning of corp-owned devices**: With Windows 10, end users can configure a brand new, shrink-wrapped device in the out-of-box experience, without IT involvement.


* **Support for modern form factors**: Azure AD Join will work on devices that don’t have the traditional domain join capabilities.  


* **Uses existing organizational accounts**: End users no longer need to create and maintain a personal Microsoft account to get the best experience on company-issued devices, like they did on Windows 8. They can use their existing work account in Azure AD instead. For many organizations, this basically means setting up and signing on to Windows with the same credentials that are used to access Office 365. 


* **Automatic MDM enrollment**: Devices can get automatically enrolled in management when connected to Azure AD. This will work with Microsoft Intune and with 3rd party MDMs. When managed with Intune, IT will be able to monitor/manage Azure AD Joined devices alongside domain joined devices in the SCCM management console.


* **Single Sign-On to company resources**: Users enjoy single sign-on from the Windows desktop to apps and resources in the cloud, such as Office 365 and thousands of business applications that rely on Azure AD for authentication through [Azure AD Connect](active-directory-azureadjoin-deployment-aadjoindirect.md). Corp-owned devices that are joined to Azure AD will also enjoy SSO to on-premises resources when the device is on corpnet, and from anywhere when these resources are exposed via the [Azure AD Application Proxy](https://msdn.microsoft.com/library/azure/Dn768219.aspx). 


* **OS State Roaming**: Things like accessibility settings, websites and Wi-Fi passwords will be synchronized across corp-owned devices without requiring a personal Microsoft account.


* **Enterprise-ready Windows store**: Windows Store will support app acquisition and licensing with Azure AD accounts. Organizations will be able to volume-license apps and make them available to the users in their organization.

## How different devices work with Azure AD Join

| Corporate device (Joined to On-Premises Domain)                                                                                                                                                                                         | Corporate device  (Joined to the cloud)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Pesonal device                                                                                                         |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Users sign in to Windows with work credentials (as they do today)                                                                                                                                                                        | Users can sign in to Windows with work credentials that are managed in Azure AD. This is relevant for corporate devices in three cases:  The organization doesn’t have AD on premises (for example, small business) The organization doesn’t create all user accounts in AD (for example students, consultants, seasonal workers) Corporate devices that can’t be joined to a (on-premises) Domain, like phones or tablets running a Mobile SKU. For example, secondary device taken to factory/retail floor, Works for managed and federated organizations. | Users sign in to Windows with their personal MSA credentials (no change)                                                |
| Users have access to roaming of settings and Windows Store – These services work with work account (no need for personal MSA) Requires organizations to connect their on-premises AD to Azure AD                                        | Self-service setup – users can go through first-run experience (FRX) through their work account (as an alternative to IT provisioning the devices – both methods are supported)                                                                                                                                                                                                                                                                                                                                                                             | Super easy to add a work account that’s managed in AD or Azure AD                                                      |
| SSO from desktop to work apps/websites/resources, both on-premises and in the cloudApps that use Azure AD for authentication                                                                                                            | Auto-registration in enterprise directory (Azure AD) and auto-enrolment in MDM. (Azure AD Premium feature)                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Provides SSO across apps and to websites/resources with this work account                                              |
| Users can add their personal MSA to access their personal pictures/files without impacting enterprise data (roaming settings continues to work with work account) The MSA account enables SSO and no longer drives roaming of settings  | Self-service password reset (SSPR) on winlogon (ability to reset forgotten password) (You need AzureAD Premium for this)                                                                                                                                                                                                                                                                                                                                                                                                                                    | Provides access to enterprise Store front/section so that users can acquire and use LoB apps on their personal devices |                                                               |

## Next Steps
* [Learn about usage scenarios and deployment considerations for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)


