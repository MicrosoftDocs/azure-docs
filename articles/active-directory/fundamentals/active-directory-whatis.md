---
title: What is Azure Active Directory (Azure AD)? | Microsoft Docs
description: Use Azure Active Directory to extend your existing on-premises identities into the cloud or develop Azure AD integrated applications.
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
Azure Active Directory (Azure AD) is Microsoft’s multi-tenant, cloud-based directory, and identity management service that combines core directory services, application access management, and identity protection into a single solution. Azure AD also offers a rich, standards-based platform that enables developers to deliver access control to their applications, based on centralized policy and rules.

![Azure AD Connect Stack](./media/active-directory-whatis/Azure_Active_Directory.png)

- **For IT admins.** Azure AD provides a more secure solution for your organization through the use of stronger identity management and single sign-on (SSO) access to thousands of [cloud-based SaaS apps](../saas-apps/tutorial-list.md) and on-premises apps. Through these apps, you'll also get cloud-based app security, seamless access, enhanced collaboration, and automation of the identity lifecycle for your employees, helping to increase both security and compliance.

    Additionally, with just [four clicks](./../connect/active-directory-aadconnect-get-started-express.md), you can integrate Azure AD with an existing Windows Server Active Directory, letting your organization use your existing on-premises identity investments to manage cloud-based SaaS app access.

- **For app developers.** Azure AD lets you focus on building your apps by letting you integrate with an identity management solution that's used by millions of organizations around the world.

- **For Office 365, Azure, or Dynamics CRM Online customers.** You're already using Azure AD. Each Office 365, Azure, and Dynamics CRM Online tenant is actually an Azure AD tenant, letting you immediately start to manage your employee-access to your integrated cloud apps.

## How reliable is Azure AD?
The multi-tenant, geo-distributed, high availability design of Azure AD means that you can rely on it for your most critical business needs. Running out of 28 data centers around the world with automated failover, you’ll have the comfort of knowing that Azure AD is highly reliable and that even if a data center goes down, copies of your directory data are live in at least two more regionally dispersed data centers and available for instant access.

For more information about service level agreements, see [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

## Choose an edition
All Microsoft Online business services rely on Azure Active Directory (Azure AD) for sign-in and other identity needs. If you subscribe to any of Microsoft Online business services (for example, Office 365 or Microsoft Azure), you get Azure AD with access to all of the Free features. With the Azure Active Directory Free edition, you can manage users and groups, synchronize with on-premises directories, get single sign-on across Azure, Office 365, and thousands of popular SaaS applications like Salesforce, Workday, Concur, DocuSign, Google Apps, Box, ServiceNow, Dropbox, and more. 

To enhance your Azure Active Directory, you can add paid capabilities using the Azure Active Directory Basic, Premium P1, and Premium P2 editions. Azure Active Directory paid editions are built on top of your existing free directory, providing enterprise class capabilities spanning self-service, enhanced monitoring, security reporting, Multi-Factor Authentication (MFA), and secure access for your mobile workforce.

> [!NOTE]
> For the pricing options of these editions, see [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/). Azure Active Directory Premium P1, Premium P2, and Azure Active Directory Basic are not currently supported in China. For more information about Azure AD pricing, you can contact the Azure Active Directory Forum.
>

- **Azure Active Directory Basic.** Designed for task workers with cloud-first needs, this edition provides cloud-centric application access and self-service identity management solutions. With the Basic edition of Azure Active Directory, you get productivity enhancing and cost reducing features like group-based access management, self-service password reset for cloud applications, and Azure Active Directory Application Proxy (to publish on-premises web applications using Azure Active Directory), all backed by an enterprise-level SLA of 99.9 percent uptime.

- **Azure Active Directory Premium P1.** Designed to empower organizations with more demanding identity and access management needs, Azure Active Directory Premium edition adds feature-rich enterprise-level identity management capabilities and enables hybrid users to seamlessly access on-premises and cloud capabilities. This edition includes everything you need for information worker and identity administrators in hybrid environments across application access, self-service identity, and access management (IAM), identity protection, and security in the cloud. It supports advanced administration and delegation resources like dynamic groups and self-service group management. It includes Microsoft Identity Manager (an on-premises identity and access management suite) and provides cloud write-back capabilities enabling solutions like self-service password reset for your on-premises users.

- **Azure Active Directory Premium P2.** Designed around advanced protection for your users and administrators, this new offering includes all the capabilities in Azure AD Premium P1 as well as Identity Protection and Privileged Identity Management. Azure Active Directory Identity Protection leverages billions of signals to provide risk-based conditional access to your applications and critical company data. We also help you manage and protect privileged accounts with Azure Active Directory Privileged Identity Management so you can discover, restrict, and monitor administrators and their access to resources and provide just-in-time access when needed.  

> [!NOTE]
> A number of Azure Active Directory capabilities are also available through "pay as you go" editions:<ul><li>**Azure Active Directory B2C.** Identity and access management solution for your consumer-facing applications. For more information, see [Azure Active Directory B2C](https://azure.microsoft.com/documentation/services/active-directory-b2c/).</li><li>**Azure Multi-Factor Authentication.** Used per-user or per-authentication provider. For more information, see [What is Azure Multi-Factor Authentication?](../authentication/multi-factor-authentication.md).

## How do I get started?

## If you're an IT admin
Sign up for a free 30-day trial and deploy your first cloud solution, see [Azure Active Directory Premium trial](https://azure.microsoft.com/trial/get-started-active-directory/).

## If you're a developer
Sign up for a free 30-day trial and start integrating your apps with Azure AD, see [Azure Active Directory Premium trial](https://azure.microsoft.com/trial/get-started-active-directory/). For more information, you can also see the [Developers Guide](../develop/azure-ad-developers-guide.md) for Azure Active Directory.

## Next steps
[Learn more about the fundamentals of Azure identity and access management](https://docs.microsoft.com/azure/active-directory/identity-fundamentals)
