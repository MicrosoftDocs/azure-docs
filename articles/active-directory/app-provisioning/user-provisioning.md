---
title: What is automated SaaS app user provisioning in Azure Active Directory
description: An introduction to how you can use Azure Active Directory to automatically provision, de-provision, and continuously update user accounts across multiple third-party SaaS applications.
services: active-directory
author: kenwith
manager: mtillman
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: overview
ms.workload: identity
ms.date: 05/28/2021
ms.author: kenwith
ms.reviewer: arvinh
---

# What is app provisioning in Azure Active Directory?

In Azure Active Directory (Azure AD), the term *app provisioning* refers to automatically creating user identities and roles for applications.
	
![Diagram that shows provisioning scenarios.](../governance/media/what-is-provisioning/provisioning.png)

Azure AD to software as a service (SaaS) application provisioning refers to automatically creating user identities and roles in the cloud ([SaaS](https://azure.microsoft.com/overview/what-is-saas/)) applications that users need access to. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change. Common scenarios include provisioning an Azure AD user into applications like [Dropbox](../../active-directory/saas-apps/dropboxforbusiness-provisioning-tutorial.md), [Salesforce](../../active-directory/saas-apps/salesforce-provisioning-tutorial.md), [ServiceNow](../../active-directory/saas-apps/servicenow-provisioning-tutorial.md), and more.

Azure AD supports provisioning users into SaaS applications and applications hosted on-premises or an infrastructure as a service (IaaS) solution such as a virtual machine. You might have a legacy application that relies on an LDAP user store or a SQL database. By using the Azure AD provisioning service, you can create, update, and delete users into on-premises applications without having to open up firewalls or deal with TCP ports. 

Using lightweight agents, you can provision users into on-premises applications and govern access. When Azure AD is used with the application proxy, you can manage access to your on-premises application and provide automatic user provisioning (with the provisioning service) and single sign-on (with app proxy). 

App provisioning lets you:

- **Automate provisioning**: Automatically create new accounts in the right systems for new people when they join your team or organization.
- **Automate deprovisioning**: Automatically deactivate accounts in the right systems when people leave the team or organization.
- **Synchronize data between systems**: Ensure that the identities in your apps and systems are kept up to date based on changes in the directory or your human resources system.
- **Provision groups**: Provision groups to applications that support them.
- **Govern access**: Monitor and audit who has been provisioned into your applications.
- **Seamlessly deploy in brown field scenarios**: Match existing identities between systems and allow for easy integration, even when users already exist in the target system.
- **Use rich customization**: Take advantage of customizable attribute mappings that define what user data should flow from the source system to the target system.
- **Get alerts for critical events**: The provisioning service provides alerts for critical events and allows for Log Analytics integration where you can define custom alerts to suit your business needs.

## What is SCIM?

To help automate provisioning and deprovisioning, apps expose proprietary user and group APIs. But anyone who's tried to manage users in more than one app will tell you that every app tries to perform the same actions, such as creating or updating users, adding users to groups, or deprovisioning users. Yet, all these actions are implemented slightly differently by using different endpoint paths, different methods to specify user information, and a different schema to represent each element of information.

To address these challenges, the System for Cross-domain Identity Management (SCIM) specification provides a common user schema to help users move into, out of, and around apps. SCIM is becoming the de facto standard for provisioning and, when used with federation standards like Security Assertions Markup Language (SAML) or OpenID Connect (OIDC), provides administrators an end-to-end standards-based solution for access management.

For detailed guidance on developing a SCIM endpoint to automate the provisioning and deprovisioning of users and groups to an application, see [Build a SCIM endpoint and configure user provisioning](use-scim-to-provision-users-and-groups.md). For pre-integrated applications in the gallery, such as Slack, Azure Databricks, and Snowflake, you can skip the developer documentation and use the tutorials provided in [Tutorials for integrating SaaS applications with Azure Active Directory](../../active-directory/saas-apps/tutorial-list.md).

## Manual vs. automatic provisioning

Applications in the Azure AD gallery support one of two provisioning modes:

* **Manual** provisioning means there's no automatic Azure AD provisioning connector for the app yet. User accounts must be created manually. Examples are adding users directly into the app's administrative portal or uploading a spreadsheet with user account detail. Consult the documentation provided by the app, or contact the app developer to determine what mechanisms are available.
* **Automatic** means that an Azure AD provisioning connector has been developed for this application. Follow the setup tutorial specific to setting up provisioning for the application. App tutorials can be found in [Tutorials for integrating SaaS applications with Azure Active Directory](../../active-directory/saas-apps/tutorial-list.md).

The provisioning mode supported by an application is also visible on the **Provisioning** tab after you've added the application to your enterprise apps.

## Benefits of automatic provisioning

As the number of applications used in modern organizations continues to grow, IT admins are tasked with access management at scale. Standards such as SAML or OIDC allow admins to quickly set up single sign-on (SSO), but access also requires users to be provisioned into the app. To many admins, provisioning means manually creating every user account or uploading CSV files each week. These processes are time-consuming, expensive, and error prone. Solutions such as SAML just-in-time (JIT) have been adopted to automate provisioning. Enterprises also need a solution to deprovision users when they leave the organization or no longer require access to certain apps based on role change.

Some common motivations for using automatic provisioning include:

- Maximizing the efficiency and accuracy of provisioning processes.
- Saving on costs associated with hosting and maintaining custom-developed provisioning solutions and scripts.
- Securing your organization by instantly removing users' identities from key SaaS apps when they leave the organization.
- Easily importing a large number of users into a particular SaaS application or system.
- Having a single set of policies to determine who is provisioned and who can sign in to an app.

Azure AD user provisioning can help address these challenges. To learn more about how customers have been using Azure AD user provisioning, read the [ASOS case study](https://aka.ms/asoscasestudy). The following video provides an overview of user provisioning in Azure AD.

> [!VIDEO https://www.youtube.com/embed/_ZjARPpI6NI]

## What applications and systems can I use with Azure AD automatic user provisioning?

Azure AD features pre-integrated support for many popular SaaS apps and human resources systems, and generic support for apps that implement specific parts of the [SCIM 2.0 standard](https://techcommunity.microsoft.com/t5/Identity-Standards-Blog/Provisioning-with-SCIM-getting-started/ba-p/880010).

* **Pre-integrated applications (gallery SaaS apps)**: You can find all applications for which Azure AD supports a pre-integrated provisioning connector in [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md). The pre-integrated applications listed in the gallery generally use SCIM 2.0-based user management APIs for provisioning. 

   ![Image that shows logos for DropBox, Salesforce, and others.](./media/user-provisioning/gallery-app-logos.png)

   If you want to request a new application for provisioning, you can [request that your application be integrated with our app gallery](../develop/v2-howto-app-gallery-listing.md). For a user provisioning request, we require the application to have a SCIM-compliant endpoint. Request that the application vendor follow the SCIM standard so we can onboard the app to our platform quickly.

* **Applications that support SCIM 2.0**: For information on how to generically connect applications that implement SCIM 2.0-based user management APIs, see [Build a SCIM endpoint and configure user provisioning](use-scim-to-provision-users-and-groups.md).

## How do I set up automatic provisioning to an application?

For pre-integrated applications listed in the gallery, step-by-step guidance is available for setting up automatic provisioning. See [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md). The following video demonstrates how to set up automatic user provisioning for SalesForce.

> [!VIDEO https://www.youtube.com/embed/pKzyts6kfrw]

For other applications that support SCIM 2.0, follow the steps in [Build a SCIM endpoint and configure user provisioning](use-scim-to-provision-users-and-groups.md).


## Next steps

- [List of tutorials on how to integrate SaaS apps](../saas-apps/tutorial-list.md)
- [Customizing attribute mappings for user provisioning](customize-application-attributes.md)
- [Scoping filters for user provisioning](define-conditional-rules-for-provisioning-user-accounts.md)
