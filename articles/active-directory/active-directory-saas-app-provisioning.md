<properties
    pageTitle="Automated SaaS App User Provisioning in Azure AD | Microsoft Azure"
    description="An introduction to how you can use Azure AD to automatically provision, de-provision, and continuously update user accounts across multiple third-party SaaS applications."
    services="active-directory"
    documentationCenter=""
    authors="asmalser-msft"
    manager="stevenpo"
    editor=""/>

<tags
    ms.service="active-directory"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity"
    ms.date="02/09/2016"
    ms.author="asmalser-msft"/>

#Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory

##What is Automated User Provisioning for SaaS Apps?

Azure Active Directory (Azure AD) allows you to automate the creation, maintenance, and removal of user identities in cloud ([SaaS](https://azure.microsoft.com/overview/what-is-saas/)) applications such as Dropbox, Salesforce, ServiceNow, and more.

**Below are some examples of what this feature allows you to do:**

- Automatically create new accounts in the right SaaS apps for new people when they join your team.
- Automatically deactivate accounts from SaaS apps when people inevitably leave the team.
- Ensure that the identities in your SaaS apps are kept up to date based on changes in the directory.
- Provision non-user objects, such as groups, to SaaS apps that support them.

**Automated user provisioning also includes the following functionality:**

- The ability to match existing identities between Azure AD and SaaS apps.
- Customization options to help Azure AD fit the current configurations of the SaaS apps that your organization is currently using.
- Optional email alerts for provisioning errors.
- Reporting and activity logs to help with monitoring and troubleshooting.

##Why Use Automated Provisioning?

Some common motivations for using this feature include:

- To avoid the costs, inefficiencies, and human error associated with manual provisioning processes.
- To secure your organization by instantly removing users' identities from key SaaS apps when they leave the organization.
- To easily import a bulk number of users into a particular SaaS application.
- To enjoy the convenience of having your provisioning solution run off of the same app access policies that you defined for Azure AD Single Sign-On.

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

**How can I submit feedback to the engineering team?**

Please contact us through the [Azure Active Directory feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory/).

##How Does Automated Provisioning Work?

Azure AD provisions users to SaaS apps by connecting to provisioning endpoints provided by each application vendor. These endpoints allow Azure AD to programmatically create, update, and remove users. Below is a brief overview of the different steps that Azure AD takes to automate provisioning.

1. When you enable provisioning for an application for the first time, the following actions are performed:
 - Azure AD will attempt to match any existing users in the SaaS app with their corresponding identities in the directory. When a user is matched, they are *not* automatically enabled for single sign-on. In order for a user to have access to the application, they must be explicitly assigned to the app in Azure AD, either directly or via group membership.
 - If you have already specified which users should be assigned to the application, and if Azure AD fails to find existing accounts for those users, Azure AD will provision new accounts for them in the application.
2. Once the initial synchronization has been completed as described above, Azure AD will check every 10 minutes for the following changes:
 - If new users have been assigned to the application (either directly or through group membership), then they will be provisioned a new account in the SaaS app.
 - If a user's access has been removed, then their account in the SaaS app will be marked as disabled (users are never fully deleted, which protects you from data loss in the event of a misconfiguration).
 - If a user was recently assigned to the application and they already had an account in the SaaS app, that account will be marked as enabled, and certain user properties may be updated if they are out-of-date compared to the directory.
 - If a user's information (such as phone number, office location, etc) has been changed in the directory, then that information will also be updated in the SaaS application.

For more information on how attributes are mapped between Azure AD and your SaaS app, see the article on [Customizing Attribute Mappings](active-directory-saas-customizing-attribute-mappings.md).

##List of Apps that Support Automated User Provisioning

Click on an app to see a tutorial on how to configure automated provisioning for it:

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
- [Workday](http://go.microsoft.com/fwlink/?LinkId=690250) (inbound provisioning)

In order for an application to support automated user provisioning, it must first provide the necessary endpoints that allow for external programs to automate the creation, maintenance, and removal of users. Therefore, not all SaaS apps are compatible with this feature. For apps that do support this, the Azure AD engineering team will then be able to build a provisioning connector to those apps, and this work is prioritized by the needs of current and prospective customers.

To contact the Azure AD engineering team to request provisioning support for additional applications, please submit a message through the [Azure Active Directory feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory/).

##Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [Customizing Attribute Mappings for User Provisioning](active-directory-saas-customizing-attribute-mappings.md)
- [Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md)
- [Scoping Filters for User Provisioning](active-directory-saas-scoping-filters.md)
- [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md)
- [Account Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md)
- [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)
