---
title: What is Azure Active Directory?
description: Use Azure Active Directory to extend your existing on-premises identities into the cloud or develop Azure AD integrated applications.
services: active-directory
documentationcenter: ''
author: jeffgilb
manager: femila
ms.reviewer: jsnow
ms.author: jeffgilb
ms.assetid: 498820c4-9ebe-42be-bda2-ecf38cc514ca
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/17/2017
ms.custom: it-pro

---
# What is Azure Active Directory?
Azure Active Directory (Azure AD) is Microsoft’s multi-tenant, cloud based directory and identity management service. Azure AD combines core directory services, advanced identity governance, and application access management. Azure AD also offers a rich, standards-based platform that enables developers to deliver access control to their applications, based on centralized policy and rules. 

For IT Admins, Azure AD provides an affordable, easy to use solution to give employees and business partners single sign-on (SSO) access to [thousands of cloud SaaS Applications](active-directory-saas-tutorial-list.md) like Office365, Salesforce.com, DropBox, and Concur.

For application developers, Azure AD lets you focus on building your application by making it fast and simple to integrate with a world class identity management solution used by millions of organizations around the world.

Azure AD also includes a full suite of identity management capabilities including multi-factor authentication, device registration, self-service password management, self-service group management, privileged account management, role based access control, application usage monitoring, rich auditing and security monitoring and alerting. These capabilities can help secure cloud based applications, streamline IT processes, cut costs and help ensure that corporate compliance goals are met.

Additionally, with just [four clicks](./connect/active-directory-aadconnect-get-started-express.md), Azure AD can be integrated with an existing Windows Server Active Directory, giving organizations the ability to leverage their existing on-premises identity investments to manage access to cloud based SaaS applications.

If you are an Office 365, Azure or Dynamics CRM Online customer, you might not realize that you are already using Azure AD. Every Office 365, Azure and Dynamics CRM tenant is actually already an Azure AD tenant. Whenever you want you can start using that tenant to manage access to thousands of other cloud applications Azure AD integrates with!

![Azure AD Connect Stack](./media/active-directory-whatis/Azure_Active_Directory.png)

## How reliable is Azure AD?
The multi-tenant, geo-distributed, high availability design of Azure AD means that you can rely on it for your most critical business needs. Running out of 28 data centers around the world with automated failover, you’ll have the comfort of knowing that Azure AD is highly reliable and that even if a data center goes down, copies of your directory data are live in at least two more regionally dispersed data centers and available for instant access.

For more details, see [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

## Choose an edition
All Microsoft Online business services rely on Azure Active Directory (Azure AD) for sign-in and other identity needs. If you subscribe to any of Microsoft Online business services (for example, Office 365 or Microsoft Azure), you get Azure AD with access to all of the Free features. With the Azure Active Directory Free edition, you can manage users and groups, synchronize with on-premises directories, get single sign-on across Azure, Office 365, and thousands of popular SaaS applications like Salesforce, Workday, Concur, DocuSign, Google Apps, Box, ServiceNow, Dropbox, and more. 

To enhance your Azure Active Directory, you can add paid capabilities using the Azure Active Directory Basic, Premium P1, and Premium P2 editions. Azure Active Directory paid editions are built on top of your existing free directory, providing enterprise class capabilities spanning self-service, enhanced monitoring, security reporting, Multi-Factor Authentication (MFA), and secure access for your mobile workforce.

> [!NOTE]
> For the pricing options of these editions, see [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/). Azure Active Directory Premium P1, Premium P2, and Azure Active Directory Basic are not currently supported in China. Please contact us at the Azure Active Directory Forum for more information.
>

* **Azure Active Directory Basic** - Designed for task workers with cloud-first needs, this edition provides cloud centric application access and self-service identity management solutions. With the Basic edition of Azure Active Directory, you get productivity enhancing and cost reducing features like group-based access management, self-service password reset for cloud applications, and Azure Active Directory Application Proxy (to publish on-premises web applications using Azure Active Directory), all backed by an enterprise-level SLA of 99.9 percent uptime.
* **Azure Active Directory Premium P1** - Designed to empower organizations with more demanding identity and access management needs, Azure Active Directory Premium edition adds feature-rich enterprise-level identity management capabilities and enables hybrid users to seamlessly access on-premises and cloud capabilities. This edition includes everything you need for information worker and identity administrators in hybrid environments across application access, self-service identity and access management (IAM), identity protection and security in the cloud. It supports advanced administration and delegation resources like dynamic groups and self-service group management. It includes Microsoft Identity Manager (an on-premises identity and access management suite) and provides cloud write-back capabilities enabling solutions like self-service password reset for your on-premises users.
* **Azure Active Directory Premium P2** - Designed with advanced protection for all your users and administrators, this new offering includes all the capabilities in Azure AD Premium P1 as well as our new Identity Protection and Privileged Identity Management. Azure Active Directory Identity Protection leverages billions of signals to provide risk-based conditional access to your applications and critical company data. We also help you manage and protect privileged accounts with Azure Active Directory Privileged Identity Management so you can discover, restrict and monitor administrators and their access to resources and provide just-in-time access when needed.  

> [!NOTE]
> A number of Azure Active Directory capabilities are available through "pay as you go" editions:
>
> * Active Directory B2C is the identity and access management solution for your consumer-facing applications. For more details, see [Azure Active Directory B2C](https://azure.microsoft.com/documentation/services/active-directory-b2c/)
> * Azure Multi-Factor Authentication can be used through per user or per authentication providers. For more details, see [What is Azure Multi-Factor Authentication?](../multi-factor-authentication/multi-factor-authentication.md)
>

## How can I get started?

**If you are an IT admin:**

* [Try it out!](https://azure.microsoft.com/trial/get-started-active-directory/) - you can sign up for a free 30 day trial today and deploy your first cloud solution in under 5 minutes using this link

* Read [Getting started with Azure AD](https://docs.microsoft.com/azure/active-directory/active-directory-get-started-premium) for tips and tricks on getting an Azure AD tenant up and running fast

**If you are a developer:**
 
* Check out our [Developers Guide](active-directory-developers-guide.md) to Azure Active Directory

* [Start a trial](https://azure.microsoft.com/trial/get-started-active-directory/) – sign up for a free 30 day trial today and  start integrating your apps with Azure AD

## Next steps
[Learn more about the fundamentals of Azure identity and access management](https://docs.microsoft.com/azure/active-directory/identity-fundamentals)
