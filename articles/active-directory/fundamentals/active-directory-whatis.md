---
title: What is Azure Active Directory (Azure AD)? | Microsoft Docs
description: Learn about how to use Azure Active Directory to extend your existing on-premises identities into the cloud or to develop Azure AD integrated apps.
services: active-directory
author: eross-msft
manager: mtillman
ms.author: lizross
ms.assetid: 498820c4-9ebe-42be-bda2-ecf38cc514ca

ms.service: active-directory
ms.component: fundamentals
ms.workload: identity
ms.topic: overview
ms.date: 09/13/2018
ms.custom: it-pro
---

# What is Azure Active Directory?
Azure Active Directory (Azure AD) is Microsoft’s multi-tenant, cloud-based directory, and identity management service. Azure AD combines core directory services, application access management, and identity protection in a single solution, offering a standards-based platform that helps developers deliver access control to their apps, based on centralized policy and rules.

![Azure AD Connect Stack](./media/active-directory-whatis/Azure_Active_Directory.png)

## Benefits of Azure AD
Azure AD helps you to:

-   Create and manage a single identity for each user across your entire enterprise, keeping users, groups, and devices in sync with [Azure AD Connect](../connect/active-directory-aadconnect.md).

-   Provide single sign-on access to your apps, including thousands of pre-integrated SaaS apps, and to provide more secure remote access to on-premises SaaS applications using the [Azure AD Application Proxy](../manage-apps/application-proxy.md).

-   Allow application access security by enforcing rules-based [Multi-Factor Authentication](../authentication/concept-mfa-howitworks.md) policies for both on-premises and cloud apps.

-   Improve user productivity with [self-service password reset](../user-help/user-help-reset-password.md), and group and application access requests using the [MyApps portal](../user-help/active-directory-saas-access-panel-introduction.md).

-   Take advantage of the [high-availability and reliability](https://docs.microsoft.com/azure/architecture/checklist/availability) of a worldwide, enterprise-grade, cloud-based identity and access management solution.

## Who uses Azure AD
Azure AD is intended for IT admins, app developers, and for users of Office 365, Azure, or Dynamics CRM Online.

- **IT admins.** Azure AD provides a more secure solution for your organization through the use of stronger identity management and single sign-on (SSO) access to thousands of [cloud-based SaaS apps](../saas-apps/tutorial-list.md) and on-premises apps. Through these apps, you'll also get cloud-based app security, seamless access, enhanced collaboration, and automation of the identity lifecycle for your users, helping to increase both security and compliance.

    Additionally, with [Azure AD Connect](../connect/active-directory-aadconnect-get-started-express.md), you can integrate Azure AD with an existing Windows Server Active Directory, letting your organization use your existing on-premises identity investments to manage cloud-based SaaS app access.

- **For app developers.** Azure AD helps you focus on building your apps by providing integration with an identity management solution that's used by millions of organizations around the world.

- **For Office 365, Azure, or Dynamics CRM Online customers.** You're already using Azure AD. Each Office 365, Azure, and Dynamics CRM Online tenant is actually an Azure AD tenant, letting you immediately start to manage your user-access to your integrated cloud apps.

## How reliable is Azure AD?
The multi-tenant, geographically distributed, and high availability design of Azure AD means that you can rely on it for your most critical business needs. Azure AD runs out of 28 data centers around the world with automated failover. That means that even if a data center goes down, copies of your directory data are live in at least two more regionally dispersed data centers and available for instant access.

For more information about service level agreements, see [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

## Choose an edition
All Microsoft Online business services rely on Azure AD for sign-in and other identity needs. If you subscribe to any Microsoft Online business services (for example, Office 365 or Microsoft Azure), you automatically get Azure AD with access to all of the Free features. Using the Azure Active Directory Free edition, you can manage users and groups, synchronize with on-premises directories, get single sign-on across Azure, Office 365, and thousands of popular SaaS apps like Salesforce, Workday, Concur, DocuSign, Google Apps, Box, ServiceNow, Dropbox, and more. 

To enhance your Azure AD implementation, you can also add paid capabilities bu upgrading to Azure Active Directory Basic, Premium P1, or Premium P2 editions. Azure AD paid editions are built on top of your existing free directory, providing enterprise class capabilities that span self-service, enhanced monitoring, security reporting, Multi-Factor Authentication (MFA), and secure access for your mobile workforce.

> [!NOTE]
> For the pricing options of these editions, see [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/). Azure Active Directory Premium P1, Premium P2, and Azure Active Directory Basic are not currently supported in China. For more information about Azure AD pricing, you can contact the Azure Active Directory Forum.

- **Azure Active Directory Basic.** Intended for task workers with cloud-first needs, this edition provides cloud-centric application access and self-service identity management solutions. With the Basic edition, you get productivity-enhancing and cost-reducing features, like group-based access management, self-service password reset for cloud apps, and Azure Active Directory Application Proxy (to publish on-premises web apps using Azure AD), all backed by an enterprise SLA of 99.9 percent uptime.

- **Azure Active Directory Premium P1.** Intended to empower organizations with more demanding identity and access management needs, Azure Active Directory Premium edition adds feature-rich enterprise-level identity management capabilities and enables hybrid users to seamlessly access on-premises and cloud capabilities. This edition includes everything you need for information worker and identity administrators in hybrid environments across application access, self-service identity, and access management (IAM), identity protection, and security in the cloud. It supports advanced administration and delegation resources like dynamic groups and self-service group management. It includes Microsoft Identity Manager (an on-premises identity and access management suite) and provides cloud write-back capabilities enabling solutions like self-service password reset for your on-premises users.

- **Azure Active Directory Premium P2.** Designed around advanced protection for your users and administrators, this new offering includes all the capabilities in Azure AD Premium P1 as well as Identity Protection and Privileged Identity Management. Azure Active Directory Identity Protection leverages billions of signals to provide risk-based conditional access to your apps and critical company data. We also help you manage and protect privileged accounts with Azure Active Directory Privileged Identity Management so you can discover, restrict, and monitor administrators and their access to resources and provide just-in-time access when needed.  

> [!NOTE]
> A number of Azure Active Directory capabilities are also available through "pay as you go" editions:<ul><li>**Azure Active Directory B2C.** Identity and access management solution for your consumer-facing apps. For more information, see [Azure Active Directory B2C](https://azure.microsoft.com/documentation/services/active-directory-b2c/).</li><li>**Azure Multi-Factor Authentication.** Used per-user or per-authentication provider. For more information, see [What is Azure Multi-Factor Authentication?](../authentication/multi-factor-authentication.md).

## As an admin, how do I get started?
Sign up for a free 30-day trial and deploy your first cloud solution, see [Azure Active Directory Premium trial](https://azure.microsoft.com/trial/get-started-active-directory/).

## As a developer, how do I get started?
Sign up for a free 30-day trial and start integrating your apps with Azure AD, see [Azure Active Directory Premium trial](https://azure.microsoft.com/trial/get-started-active-directory/). For more information, you can also see the [Developers Guide](../develop/azure-ad-developers-guide.md) for Azure Active Directory.

## Next steps
- [Learn more about the fundamentals of Azure identity and access management](identity-fundamentals.md).

- [Integrate Azure AD with Windows Server Active directory](../hybrid/how-to-connect-install-express.md).