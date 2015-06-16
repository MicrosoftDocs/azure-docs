<properties
   pageTitle="Automated SaaS App User Provisioning in Azure AD | Microsoft Azure"
   description="An introduction to how you can use Azure AD to automatically provision, de-provision, and continuously update user accounts across multiple third-party SaaS applications."
   services="active-directory"
   documentationCenter=""
   authors="liviodlc"
   manager="TerryLanfear"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/07/2015"
   ms.author="liviodlc"/>

#Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory

##What is Automated SaaS App User Provisioning?

Azure Active Directory allows you to automate the creation, maintenance, and removal of user identities in cloud (SaaS) applications such as Dropbox, Salesforce, ServiceNow, and more. Some common motivations for using this feature include:

- To avoid the costs, inefficiencies, and human error associated with manual provisioning processes.
- To secure your organization by instantly removing users' identities from key SaaS apps when they leave the organization.
- To easily import a bulk number of users into a particular SaaS application.

A key benefit to using Azure AD to handle your SaaS app provisioning is that it's fully integrated with the access management policies that you have already defined for single sign-on (SSO). Therefore, granting a new user access to a particular application will not only enable SSO but will also ensure that an account has been provisioned for them.

Automated user provisioning also includes the following functionality:

- Customization options that let you tailor your provisioning solution around the SaaS apps that your organization is currently using, as they are currently configured.
- Automated maintenance that keeps provisioned users up to date based on changes from the directory.
- Provisioning of non-user objects such as groups to SaaS apps that support them.
- Optional email alerts for provisioning errors.
- Reporting and activity logs to help with monitoring and troubleshooting.

##Frequently Asked Questions

**How frequently does Azure AD write directory changes to the SaaS app?**

Azure AD checks for changes every five to ten minutes. If the SaaS app is returning several errors (such as in the case of invalid admin credentials), then Azure AD will gradually slow its frequency to up to once per day until the errors are fixed.

**How long will it take to provision my users?**

Incremental changes happen nearly instantly but if you are trying to provision most of your directory, then it depends on the number of users and groups that you have. Small directories take only a few minutes, medium-sized directories may take several minutes, and very large directories may take several hours.

**How can I track the progress of the current provisioning job?**

You can review the Account Provisioning Report under the Reports section of your directory. Another option is to visit the Dashboard tab for the SaaS application that you are provisioning to, and look under the "Integration Status" section near the bottom of the page.

**How will I know if users fail to get provisioned properly?**

At the end of the provisioning configuration wizard there is an option to subscribe to email notifications for provisioning failures. You can also check the Provisioning Errors Report to see which users failed to be provisioned and why.

**Can Azure AD write changes from the SaaS app back to the directory?**

For most SaaS apps, provisioning is outbound-only, which means that users are written from the directory to the application, and changes from the application cannot be written back to the directory. For [Workday](https://msdn.microsoft.com/library/azure/dn762434.aspx), however, provisioning is inbound-only, which means that that users are imported into the directory from Workday, and likewise, changes in the directory do not get written back into Workday.

##How Does Automated Provisioning Work?

Azure AD provisions users to SaaS apps by connecting to provisioning endpoints provided by each application vendor. These endpoints allow Azure AD to programmatically create, update, and remove users. Below is a brief overview of the different steps that Azure AD takes to automate provisioning.

1. When you enable provisioning for an application for the first time, the following actions are performed:
 - Azure AD will attempt to match any existing users in the SaaS app with their corresponding identities in the directory.
 - When a user is matched, they are automatically assigned access to the application, which enables them for single sign-on.
 - If you have already specified which users should be assigned to the application, and if Azure AD fails to find existing accounts for those users, Azure AD will provision new accounts for them in the application.
2. Once the initial synchronization has been completed as described above, Azure AD will check every 10 minutes for the following changes:
 - If new users have been assigned to the application (either directly or through group membership), then they will be provisioned a new account in the SaaS app.
 - If a user's access has been removed, then their account in the SaaS app will be marked as disabled (users are never fully deleted, which protects you from data loss in the event of a misconfiguration).
 - If a user was recently assigned to the application and they already had an account in the SaaS app, that account will be marked as enabled, and certain user properties may be updated if they are out-of-date compared to the directory.
 - If a user's information (such as phone number, office location, etc) has been changed in the directory, then that information will also be updated in the SaaS application.

For more information on how attributes are mapped between Azure AD and your SaaS app, see the article on [Customizing Attribute Mappings](https://msdn.microsoft.com/library/azure/dn872469.aspx).

##Getting Started with Automated User Provisioning

Below is a list of tutorials on how to configure your SaaS application to use Azure AD for automated user provisioning:

- [Box](http://go.microsoft.com/fwlink/?LinkId=286016)
- [Citrix GoToMeeting](http://go.microsoft.com/fwlink/?LinkId=309580)
- [Concur](http://go.microsoft.com/fwlink/?LinkId=309575)
- [Docusign](http://go.microsoft.com/fwlink/?LinkId=403254)
- [Dropbox for Business](http://go.microsoft.com/fwlink/?LinkId=309581)
- [Google Apps](http://go.microsoft.com/fwlink/?LinkId=309577)
- [Jive](http://go.microsoft.com/fwlink/?LinkId=309591)
- [Salesforce](http://go.microsoft.com/fwlink/?LinkId=286017)
- [Salesforce Sandbox](http://go.microsoft.com/fwlink/?LinkId=327869)
- [ServiceNow](http://go.microsoft.com/fwlink/?LinkId=309587)
- [Workday](https://msdn.microsoft.com/library/azure/dn762434.aspx) (inbound provisioning)
