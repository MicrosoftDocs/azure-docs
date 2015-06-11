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

Below is a list of the apps that support automated user provisioning today, with links to tutorials on how to get started with integrating them:

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

To request support for additional applications, please contact the engineering team: [aad-saas-apps-team@microsoft.com](mailto:aad-saas-apps-team@microsoft.com). They will then work with you and the SaaS application vendor to roll out a provisioning solution in a timely manner.

##Frequently Asked Questions

**How frequently does Azure AD update users who have already been provisioned?**

Azure AD checks for changes about every 10 minutes.

**How long will it take to provision my users?**

Incremental changes happen fairly quickly but if you are trying to provision most of your directory, then it depends on the number of users that you have. Small directories take only a few minutes, medium-sized directories may take several minutes, and very large directories may take hours.

**Can Azure AD write changes from the SaaS app to the directory?**

Today provisioning works in only one direction: it's either outbound or inbound, but not both. Therefore, if you use Azure AD to provision a user to a SaaS app, and then that SaaS app modified a user property, we don't yet support the ability to have that modification written back to the directory.

***How can I track the progress of the current provisioning job?***

In the Azure Management Portal, visit the Dashboard tab for the application that you are configuring, and look under the "Integration Status" section. [image required]

**What happens if something goes wrong?**

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
