<properties 
    pageTitle="I can rely on Azure AD to enable single sign-on (SSO) to all of my applications | Microsoft Azure" 
    description="Learn how Azure Active Directory helps you to extend the sope of an identity and the management og them." 
    services="active-directory" 
    authors="markusvi"  
    documentationCenter="na" 
    manager="stevenpo"/>

<tags 
    ms.service="active-directory" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="identity" 
    ms.date="10/12/2015" 
    ms.author="markvi" />


#I can rely on Azure AD to enable single sign-on (SSO) to all of my applications
This article is intended for IT decision makes that want to learn about the business value Azure Active Directory provides for applications your organization is using. 

## Running apps in a cloud-based environment  

Today, in a cloud-based world, you can find thousands of apps to get any job done. IT departments often don’t even know all the SaaS apps that are used in their organizations. In many cases use of the app is known but getting any level of governance and security is expensive and time consuming. Many of the applications don’t support integration with enterprise identity systems, in other cases one-off integrations are avoided due to cost and complexity.  

As a consequence of this, 

- Many organizations have concerns about unauthorized access to corporate data, possible data leakage and other security risks inherent in the application introduced by unmanaged applications. Because they don’t even know how many apps or which apps are being used, even getting started building a plan to deal with these risks seems daunting..
- Administrators need to individually manage all IAM service providers that are introduced by the managed apps in your environment. This includes tasks such as creating and deleting users and groups as well as grating or revoking access to these apps.
- Your users need to memorize various credentials to access the apps they need to work with. Forgotten passwords represent a huge hit on the operational costs of many organizations. What all these issues have in common is that they have a negative impact on your users’ productivity and your operational costs.  
 
## How does Azure Active Directory help?
Azure Active Directory helps you to address these issues by enabling you to easily extend your existing identity infrastructure to the cloud and through that:

- Extend the reach of your mobile users to any app 
- Extend the reach of access management to any cloud app 
- Detect the apps used accessed by your users


### Extending the reach of your identity to any app 

By design, Azure Active Directory provides you with SSO to cloud apps that are hosted on Azure and other Microsoft online services like Office 365, CRM Online and Intune.

In addition to this, it can be your identity broker for single sign-on to apps in any other public cloud such as Google, Amazon, IBM and others. <br>
If an app is broadly known or popular, we are pre-integrating it into Azure Active Directory’s app gallery. Today, you can find around 2500 pre-integrated apps in the app gallery and the number is growing on ongoing basis. <br>
Configuring SSO for any of the pre-integrated apps in the app gallery is just a matter of a few clicks.   
What if my app is not listed in the app gallery yet? You can integrate any public app into your Azure Active Directory using a wizard and enable that way SSO for them. For more details, see [Deploying single sign-on using Azure Active Directory for newly acquired SaaS apps](active-directory-single-sign-on-newly-acquired-saas-apps.md)  and [Integrate Azure Active Directory SSO with existing apps](active-directory-sso-integrate-existing-apps.md)<br>
What about apps developed by your organization? We provide you with the related documentation that enables your developers to easily integrate apps developed by your organization into Azure Active Directory. If you want to know more about this, see [Azure AD and Applications: Guiding Developers](active-directory-applications-guiding-developers-for-lob-applications.md).

Providing you with support for the pre-integrated apps, public apps that are not in the app gallery and the apps your organization has developed, Azure Active Directory enables to provide SSO for all your cloud apps.

The value of Azure Active Directory goes beyond “*just*” cloud apps. With Azure Active Directory, you can also extend the reach of Azure identities by providing secure remote access to on-premises apps via SSO. This means, remote access that doesn’t require technologies such as VPNs or other traditional remote access infrastructures to access on-premises web apps. Azure Active Directory offers this functionality through app proxy capabilities. 

The traditional SSO model is a based on a mapping of two individual accounts in two identity repositories. With Azure Active Directory, you can even map an individual account with a shared corporate account such as your corporate Twitter account. By implementing SSO for your corporate shared accounts, there is no need to actually share the account credentials with your users, which significantly improves the protection of these accounts.
I you want to know more about this, see [Sharing accounts with Azure AD](active-directory-sharing-accounts.md)

By extending the reach of your identities, one password provides you with access to thousand apps.



### Extending the reach of access management to any cloud app

Managing access to your cloud apps is expensive if you have to do this manually on a per app basis. With Azure Active Directory, you can manage the access to your cloud apps based on groups from a central point - the Azure portal. You can assign access to individual users or even to groups. For more details, see [Managing access to apps](active-directory-managing-access-to-apps.md).

Some app’s such as Salesforce, Box, Google Apps and Concur provide automation interfaces for creation and removal (or deactivation) of accounts. If a provider offers such an interface, it is leveraged by Azure Active Directory. In other words, Azure Active Directory provides support for automated user provisioning for apps that offer a related automation interface. 

With automated user provisioning:

- When a user that has been granted access to a related app, Azure Active Directory automatically provisions the required SSO account to the app.
- When a user’s account in Azure Active Directory has been deleted, the account in the app is either deactivated or deleted.
Configuring automated user provisioning providers and provides you with the following benefits:
- 	It reduces your operational costs because it automates administrative tasks that would have to be performed by your IT staff.
- It improves the security of your environment because it decreases the chance that access to apps exists that is not needed.

For more details about automated user provisioning, see [Automate User Provisioning and Deprovisioning to SaaS Apps with Azure Active Directory](active-directory-saas-app-provisioning.md).


### Detecting the apps used accessed by your users

With SSO and account provisioning, Azure Active Directory provides you with powerful mechanisms to improve how your users and your administrators can work with the apps in your environment you are aware of. However, in modern enterprises, IT departments are often not aware of all the cloud apps that are used. With Cloud App Discovery, Azure Active Directory provides you also with a solution to detect these apps. 
With Cloud App Discovery, you can:

- Discover apps in use and measure usage by number of users, volume of traffic or number of web requests to the app.
- Identify the users that are using an app.
- Export data for addition offline analysis.
- Prioritize apps to bring under IT control and integrate apps easily to enable Single Sign-on and user management.

For more details about Cloud App Discovery, see [How can I discover unsanctioned cloud apps that are used within my organization](active-directory-cloudappdiscovery-whatis.md).


## How can I get started?

First, if you aren't already using Azure AD and you are an IT admin:

- [Try it out](https://azure.microsoft.com/trial/get-started-active-directory)! - you can sign up for a free 30 trial today and deploy your first cloud solution in under 5 minutes using this link





