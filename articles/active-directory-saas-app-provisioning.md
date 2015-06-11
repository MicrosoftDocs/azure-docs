<properties
   pageTitle="Automated SaaS App User Provisioning in Azure AD | Microsoft Azure"
   description="An introduction to how you can use Azure AD to automatically provision, de-provision, and continuously update user accounts across multiple third-party SaaS applications."
   services="active-directory"
   documentationCenter=""
   authors="acceleron3000"
   manager="TerryLanfear"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/07/2015"
   ms.author="acceleron3000"/>

#Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory

[What is It](../active-directory-saas-app-provisioning-what-is/)
[How it Works](../active-directory-saas-app-provisioning-how-it-works/)
[Getting Started](../active-directory-saas-app-provisioning-get-started/)
[Whats Next](../active-directory-saas-app-provisioning-whats-next/)
[Learn More](../active-directory-saas-app-provisioning-learn-more/) 

##What is Automated SaaS App User Provisioning?

Azure AD allows you to automate the creation, maintenance, and removal of user identities in cloud (SaaS) applications such as Salesforce, ServiceNow, and more. Some common motivations for using this feature include:

- To avoid the costs, inefficiencies, and human error associated with manual provisioning processes.
- To secure your organization by instantly removing users' identities from key SaaS apps when they leave the organization.
- To easily import a bulk number of users into a particular SaaS application.

A key benefit to using Azure AD to handle your SaaS app provisioning is that it's fully integrated with the access management policies that you have already defined for single sign-on (SSO). Therefore, granting a new user access to a particular application will not only enable SSO but will also ensure that an account has been provisioned for them. Automated user provisioning also includes the following functionality:

- Customize provisioning rules to fit your organization's existing app deployments.
- Provisioned users will be continuously kept up-to-date based on changes from the directory.
- You can provision non-user objects such as groups and contacts, depending on what the SaaS app supports.
- Optional email alerts for provisioning errors.
- Reporting and activity logs to help with monitoring and troubleshooting.

##List of Applications that Support Automated Provisioning

Below is a list of the apps that support automated user provisioning today, with links to tutorials on how to get started with integrating these applications:

1. [Box](http://go.microsoft.com/fwlink/?LinkId=286016)
2. [Citrix GoToMeeting](http://go.microsoft.com/fwlink/?LinkId=309580)
3. [Concur](http://go.microsoft.com/fwlink/?LinkId=309575)
4. [Docusign](http://go.microsoft.com/fwlink/?LinkId=403254)
5. [Dropbox for Business](http://go.microsoft.com/fwlink/?LinkId=309581)
6. [Google Apps](http://go.microsoft.com/fwlink/?LinkId=309577)
7. [Jive](http://go.microsoft.com/fwlink/?LinkId=309591)
8. [Netsuite](http://go.microsoft.com/fwlink/?LinkId=403239) (preview)
9. [Salesforce](http://go.microsoft.com/fwlink/?LinkId=286017)
10. [Salesforce Sandbox](http://go.microsoft.com/fwlink/?LinkId=327869)
11. [ServiceNow](http://go.microsoft.com/fwlink/?LinkId=309587)
12. [Workday (inbound provisioning)](https://msdn.microsoft.com/library/azure/dn762434.aspx) (preview)

To request support for additional applications, please contact the engineering team through the following email address: [aad-saas-apps-team@microsoft.com](mailto:aad-saas-apps-team@microsoft.com). The team will then work with you and the application vendor to roll out a provisioning solution in a timely manner.

##Frequently Asked Questions

How frequently does Azure AD check for changes in the directory in order to write them to the application?

> Azure AD checks for changes every 10 minutes.

*If a user is provisioned into a cloud app and then their account info is updated in the application, can that change be written back to Azure AD?*

> Today provisioning can only happen in one direction: it's either outbound or inbound, but not both.

**How long does it take to provision my users?**

> For small and medium-sized directories, it takes only a few minutes. Very large directories may take several hours.

***How can I track the progress of the current provisioning job?***

In the Azure Management Portal, visit the Dashboard tab for the application that you are configuring, and look under the "Integration Status" section. [image required]

*What happens if something goes wrong?*

Stuff happens.

##How to Customize Attribute Mappings

stuff

##Technical Overview of How Users Get Provisioned

Below is a brief technical overview of the different steps that Azure AD takes to automate provisioning.

1. (Full sync, setup phase, ) When you first turn on provisioning for an application, Azure AD will attempt to find matches between users in your directory and their corresponding accounts in the application. When a user is matched, they are automatically [assigned](some link about assignment) to the application.

2. After the setup phase, Azure AD will check every 10 minutes for changes to write to the directory.

//outbound/inbound

//bulk-assignment when provisioning is first enabled

1. explain provisioning schedule / flow

connect through API access
every 10 mins.
detect changes
one-way

2. explain outbound/inbound ?

3. explain how to check progress

4. explain how to troubleshoot

5. explain attribute mappings

6. explain editing the user id
