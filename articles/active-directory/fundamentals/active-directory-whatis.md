---
title: What is Azure Active Directory? - Azure Active Directory | Microsoft Docs
description: Overview and conceptual information about Azure Active Directory, including terminology, what licenses are available, and a list of associated features with links for more information.
services: active-directory
author: msaburnley
manager: daveba

ms.service: active-directory
ms.topic: overview
ms.date: 05/08/2019
ms.author: ajburnle
ms.custom: "it-pro, seodec18, seo-update-azuread-jan"

#customer intent: As a new administrator, I want to understand what Azure Active Directory is, which license is right for me, and what features are available.
ms.collection: M365-identity-device-management
---

# What is Azure Active Directory?

Azure Active Directory (Azure AD) is Microsoft’s cloud-based identity and access management service, which helps your employee's sign in and access resources in:

- External resources, such as Microsoft Office 365, the Azure portal, and thousands of other SaaS applications.

- Internal resources, such as apps on your corporate network and intranet, along with any cloud apps developed by your own organization.

You can use the various [Microsoft Cloud for Enterprise Architects Series](https://docs.microsoft.com/office365/enterprise/microsoft-cloud-it-architecture-resources#identity) posters to better understand the core identity services in Azure, Azure AD, and Office 365.

## Who uses Azure AD?

Azure AD is intended for:

- **IT admins.** As an IT admin, you can use Azure AD to control access to your apps and your app resources, based on your business requirements. For example, you can use Azure AD to require multi-factor authentication when accessing important organizational resources. Additionally, you can use Azure AD to automate user provisioning between your existing Windows Server AD and your cloud apps, including Office 365. Finally, Azure AD gives you powerful tools to automatically help protect user identities and credentials and to meet your access governance requirements. To get started, sign up for a [free 30-day Azure Active Directory Premium trial](https://azure.microsoft.com/trial/get-started-active-directory/).

- **App developers.** As an app developer, Azure AD gives you a standards-based approach for adding single sign-on (SSO) to your app, allowing it to work with a user's pre-existing credentials. Azure AD also provides APIs that can help you build personalized app experiences using existing organizational data. To get started, sign up for a [free 30-day Azure Active Directory Premium trial](https://azure.microsoft.com/trial/get-started-active-directory/). For more information, you can also see [Azure Active Directory for developers](../develop/index.yml).

- **Microsoft 365, Office 365, Azure, or Dynamics CRM Online subscribers.** As a subscriber, you're already using Azure AD. Each Microsoft 365, Office 365, Azure, and Dynamics CRM Online tenant is automatically an Azure AD tenant. You can immediately start to manage access to your integrated cloud apps.

## What are the Azure AD licenses?

Microsoft Online business services, such as Office 365 or Microsoft Azure, require Azure AD for sign-in and to help with identity protection. If you subscribe to any Microsoft Online business service, you automatically get Azure AD with access to all the free features.

To enhance your Azure AD implementation, you can also add paid capabilities by upgrading to Azure Active Directory Basic, Premium P1, or Premium P2 licenses. Azure AD paid licenses are built on top of your existing free directory, providing self-service, enhanced monitoring, security reporting, and secure access for your mobile users.

>[!Note]
>For the pricing options of these licenses, see [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/).
>
>Azure Active Directory Premium P1, Premium P2, and Azure Active Directory Basic are not currently supported in China. For more information about Azure AD pricing, contact the [Azure Active Directory Forum](https://azure.microsoft.com/support/community/?product=active-directory).

- **Azure Active Directory Free.** Provides user and group management, on-premises directory synchronization, basic reports, self-service password change for cloud users, and single sign-on across Azure, Office 365, and many popular SaaS apps.

- **Azure Active Directory Basic.** In addition to the Free features, Basic also provides cloud-centric app access, group-based access management, self-service password reset for cloud apps, and Azure AD Application Proxy, which lets you publish on-premises web apps using Azure AD.

- **Azure Active Directory Premium P1.** In addition to the Free and Basic features, P1 also lets your hybrid users access both on-premises and cloud resources. It also supports advanced administration, such as dynamic groups, self-service group management, Microsoft Identity Manager (an on-premises identity and access management suite) and cloud write-back capabilities, which allow self-service password reset for your on-premises users.

- **Azure Active Directory Premium P2.** In addition to the Free, Basic, and P1 features, P2 also offers [Azure Active Directory Identity Protection](../identity-protection/enable.md) to help provide risk-based Conditional Access to your apps and critical company data and [Privileged Identity Management](../privileged-identity-management/pim-getting-started.md) to help discover, restrict, and monitor administrators and their access to resources and to provide just-in-time access when needed.

- **"Pay as you go" feature licenses.** You can also get additional feature licenses, such as Azure Active Directory Business-to-Customer (B2C). B2C can help you provide identity and access management solutions for your customer-facing apps. For more information, see [Azure Active Directory B2C documentation](../../active-directory-b2c/index.yml).

For more information about associating an Azure subscription to Azure AD, see [How to: Associate or add an Azure subscription to Azure Active Directory](active-directory-how-subscriptions-associated-directory.md) and for more information about assigning licenses to your users, see [How to: Assign or remove Azure Active Directory licenses](license-users-groups.md).

## Terminology

To better understand Azure AD and its documentation, we recommend reviewing the following terms.

|Term or concept|Description|
|---------------|-----------|
|Identity| A thing that can get authenticated. An identity can be a user with a username and password. Identities also include applications or other servers that might require authentication through secret keys or certificates.|
|Account| An identity that has data associated with it. You cannot have an account without an identity.|
|Azure AD account| An identity created through Azure AD or another Microsoft cloud service, such as Office 365. Identities are stored in Azure AD and accessible to your organization's cloud service subscriptions. This account is also sometimes called a Work or school account.|
|Azure subscription| Used to pay for Azure cloud services. You can have many subscriptions and they're linked to a credit card.|
|Azure tenant| A dedicated and trusted instance of Azure AD that's automatically created when your organization signs up for a Microsoft cloud service subscription, such as Microsoft Azure, Microsoft Intune, or Office 365. An Azure tenant represents a single organization.|
|Single tenant| Azure tenants that access other services in a dedicated environment are considered single tenant.|
|Multi-tenant| Azure tenants that access other services in a shared environment, across multiple organizations, are considered multi-tenant.|
|Azure AD directory|Each Azure tenant has a dedicated and trusted Azure AD directory. The Azure AD directory includes the tenant's users, groups, and apps and is used to perform identity and access management functions for tenant resources.|
|Custom domain|Every new Azure AD directory comes with an initial domain name, domainname.onmicrosoft.com. In addition to that initial name, you can also add your organization's domain names, which include the names you use to do business and your users use to access your organization's resources, to the list. Adding custom domain names helps you to create user names that are familiar to your users, such as alain@contoso.com.|
|Account Administrator|This classic subscription administrator role is conceptually the billing owner of a subscription. This role has access to the [Azure Account Center](https://account.azure.com/Subscriptions) and enables you to manage all subscriptions in an account. For more information, see [Classic subscription administrator roles, Azure Role-based access control (RBAC) roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).|
|Service Administrator|This classic subscription administrator role enables you to manage all Azure resources, including access. This role has the equivalent access of a user who is assigned the Owner role at the subscription scope. For more information, see [Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).|
|Owner|This role helps you manage all Azure resources, including access. This role is built on a newer authorization system called role-base access control (RBAC) that provides fine-grained access management to Azure resources. For more information, see [Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).|
|Azure AD Global administrator|This administrator role is automatically assigned to whomever created the Azure AD tenant. Global administrators can do all of the administrative functions for Azure AD and any services that federate to Azure AD, such as Exchange Online, SharePoint Online, and Skype for Business Online. You can have multiple Global administrators, but only Global administrators can assign administrator roles (including assigning other Global administrators) to users.<br><br>**Note**<br>This administrator role is called Global administrator in the Azure portal, but it's called **Company administrator** in Microsoft Graph API, Azure AD Graph API, and Azure AD PowerShell.<br><br>For more information about the various administrator roles, see [Administrator role permissions in Azure Active Directory](../users-groups-roles/directory-assign-admin-roles.md).|
|Microsoft account (also called, MSA)|Personal accounts that provide access to your consumer-oriented Microsoft products and cloud services, such as Outlook, OneDrive, Xbox LIVE, or Office 365. Your Microsoft account is created and stored in the Microsoft consumer identity account system that's run by Microsoft.|

## Which features work in Azure AD?

After you choose your Azure AD license, you'll get access to some or all of the following features for your organization:

|Category|Description|
|-------|-----------|
|Application management|Manage your cloud and on-premises apps using Application Proxy, single sign-on, the My Apps portal (also known as the Access panel), and Software as a Service (SaaS) apps. For more information, see [How to provide secure remote access to on-premises applications](../manage-apps/application-proxy.md) and [Application Management documentation](../manage-apps/index.yml).|
|Authentication|Manage Azure Active Directory self-service password reset, Multi-Factor Authentication, custom banned password list, and smart lockout. For more information, see [Azure AD Authentication documentation](../authentication/index.yml).|
|Business-to-Business (B2B)|Manage your guest users and external partners, while maintaining control over your own corporate data. For more information, see [Azure Active Directory B2B documentation](../b2b/index.yml).|
|Business-to-Customer (B2C)|Customize and control how users sign up, sign in, and manage their profiles when using your apps. For more information, see [Azure Active Directory B2C documentation](../../active-directory-b2c/index.yml).|
|Conditional Access|Manage access to your cloud apps. For more information, see [Azure AD Conditional Access documentation](../conditional-access/index.yml).|
|Azure Active Directory for developers|Build apps that sign in all Microsoft identities, get tokens to call Microsoft Graph, other Microsoft APIs, or custom APIs. For more information, see [Microsoft identity platform (Azure Active Directory for developers)](../develop/index.yml).|
|Device Management|Manage how your cloud or on-premises devices access your corporate data. For more information, see [Azure AD Device Management documentation](../devices/index.yml).|
|Domain services|Join Azure virtual machines to a domain without using domain controllers. For more information, see [Azure AD Domain Services documentation](../../active-directory-domain-services/index.yml).|
|Enterprise users|Manage license assignment, access to apps, and set up delegates using groups and administrator roles. For more information, see [Azure Active Directory user management documentation](../users-groups-roles/index.yml).|
|Hybrid identity|Use Azure Active Directory Connect and Connect Health to provide a single user identity for authentication and authorization to all resources, regardless of location (cloud or on-premises). For more information, see [Hybrid identity documentation](../hybrid/index.yml).|
|Identity governance|Manage your organization's identity through employee, business partner, vendor, service, and app access controls. You can also perform access reviews. For more information, see [Azure AD identity governance documentation](../governance/identity-governance-overview.md) and [Azure AD access reviews](../governance/access-reviews-overview.md).|
|Identity protection|Detect potential vulnerabilities affecting your organization's identities, configure policies to respond to suspicious actions, and then take appropriate action to resolve them. For more information, see [Azure AD Identity Protection](../identity-protection/index.yml).|
|Managed identities for Azure resources|Provides your Azure services with an automatically managed identity in Azure AD that can authenticate any Azure AD-supported authentication service, including Key Vault. For more information, see [What is managed identities for Azure resources?](../managed-identities-azure-resources/overview.md).|
|Privileged identity management (PIM)|Manage, control, and monitor access within your organization. This feature includes access to resources in Azure AD and Azure, and other Microsoft Online Services, like Office 365 or Intune. For more information, see [Azure AD Privileged Identity Management](../privileged-identity-management/index.yml).|
|Reports and monitoring|Gain insights into the security and usage patterns in your environment. For more information, see [Azure Active Directory reports and monitoring](../reports-monitoring/index.yml).|

## Next steps

- [Sign up for Azure Active Directory Premium](active-directory-get-started-premium.md)

- [Associate an Azure subscription to your Azure Active Directory](active-directory-how-subscriptions-associated-directory.md)

- [Access Azure Active Directory and create a new tenant](active-directory-access-create-new-tenant.md)

- [Azure Active Directory Premium P2 feature deployment checklist](active-directory-deployment-checklist-p2.md)
