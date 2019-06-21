---
title: Conditional Access adoption kit - Azure Active Directory
description: Conditional Access deployment adoption kit

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 06/21/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
#  Adopting Azure AD Conditional Access

## Awareness

### Business overview

In a mobile-first, cloud-first world, users can access your organization's resources from anywhere using different kinds of devices and apps. As a result, just focusing on who can access a resource is no longer enough. You can control who has access and identify where the user is and what device is being used and much more.

To provide this control, **Azure Active Directory (AD) Conditional Access** allows you to specify the conditions any user must meet for access to an application, such as Multi-Factor Authentication (MFA). Using conditional access policies controls how authorized users (users that have been granted access to a cloud app) access cloud apps under specific conditions. Refer to [What is conditional access in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/conditional-access/overview#conditional-access-policies)?

For information on common access scenarios using Azure AD Conditional Access, watch this video, **Enable Azure Active Directory for Conditional Access for Secure User Access**

> [!VIDEO https://www.youtube.com/embed/eLAYBwjCGoA]

Refer to [Azure AD Conditional Access FAQ](https://docs.microsoft.com/azure/active-directory/conditional-access/faqs) for common questions on using Conditional Access service.

### Pricing and licensing requirements

Azure AD Conditional Access capability requires you to use Azure Active Directory Premium P1, Premium P2. For more information about licensing and editions, see [Sign up for Azure Active Directory Premium editions](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-get-started-premium).

For more information on pricing, see [Azure Active Directory pricing](https://azure.microsoft.com/pricing/details/active-directory/).

### Key benefits

The key benefits of using Azure AD Conditional Access are:

* **Increase Productivity:** Conditional Access (CA) policies allow you to target the point at which users are prompted to use MFA, have access blocked, or are required to use a trusted device. For example, you can set policies such as only requiring users to MFA into an application when off the corporate network. Reducing MFA requests keeps users more productive than if they have to MFA each time they sign in. Furthermore, Azure AD Conditional Access allows you to specify policies per user basis and also creates app-specific policies.

* **Manage Risk:** Enabling Conditional Access policies provides you with cloud-scale identity protection, risk-based access control capabilities, and native multi-factor authentication support. Coupling Conditional Access with identity protection allows you to define when access to an application is blocked or gated.

* **Address Compliance and Governance:** Auditing access requests and approvals for the application, and understanding overall application usage is easier with Azure AD because it supports native audit logs for every application access request performed. Auditing includes requester identity, requested date, business justification, approval status, and approver identity. This data is also available from an API, which will enable importation of this data into a Security Incident and Event Monitoring (SIEM) system of choice.

* **Manage Cost:** Moving access policies to Azure AD reduces reliance on custom or on-premises solutions such as Active Directory Federation Services (ADFS) for Conditional Access, reducing the cost of running that infrastructure.

### Customer case studies

Discover how most organizations use Azure AD Conditional Access to define and implement automated access control decisions to access cloud apps based on conditions. The following featured stories demonstrate how these customer needs are met.

* [**Wipro** drives mobile productivity with Microsoft cloud security tools to improve customer engagements.](https://customers.microsoft.com/story/wipro-professional-services-enterprise-mobility-security) The conditional access policies in Azure AD have enabled the company to share documents, resources, and applications with trusted outside entities---who can use their own credentials---while maintaining control over its own corporate data.

* [**Accenture** safeguards its move to the cloud with Microsoft Cloud App security](https://customers.microsoft.com/story/accenture-professional-services-cloud-app-security) Accenture is evaluating the [Conditional Access App Control](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad) feature of Cloud App Security, which uses Azure Active Directory Conditional Access to gate application access based on certain conditions. LePenske says that this feature could be useful for, say, enabling read-only file access while prohibiting downloads.

* [**Aramex** delivery limited - Global logistics and transportation company creates cloud-connected office with identity and access management solution](https://customers.microsoft.com/story/aramex-azure-active-directory-travel-transportation-united-arab-emirates-en). Ensuring secure access was especially difficult with Aramex's remote employees. The company is now applying conditional access to let these remote employees access their SaaS applications from outside the network. The conditional access rule will decide whether to enforce Multi-Factor Authentication, giving only the right people the right access.

To learn more about customer and partner experiences on Azure AD Conditional Access, visit - [See the amazing things people are doing with Azure](https://azure.microsoft.com/case-studies/?service=active-directory).

### Announcements

Azure AD receives improvements on an ongoing basis. To stay up-to-date with the most recent developments, see [What's new in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/fundamentals/whats-new)

Recent blogs by the Tech Community and Microsoft Identity Division:

* September 24, 2018, [Azure Active Directory conditional access in Azure Databricks](https://azure.microsoft.com/updates/azure-active-directory-conditional-access-in-azure-databricks/)

* September 21, 2018, [Azure AD conditional access custom controls are in public preview](https://azure.microsoft.com/updates/azure-ad-conditional-access-custom-controls-are-in-public-preview/)

* September 21, 2018, [Azure AD conditional access support for limited access with Microsoft Cloud App Security is now available](https://azure.microsoft.com/updates/azure-ad-conditional-access-support-for-limited-access-with-microsoft-cloud-app-security-is-now-available/)

* September 21, 2018, [Azure AD Conditional Access: Managed browser support for iOS/Android platforms now in preview](https://azure.microsoft.com/updates/azure-ad-conditional-access-managed-browser-support-for-ios-android-platforms-now-in-preview/)

* September 21, 2018, [Azure AD conditional access for country codes is in public preview](https://azure.microsoft.com/updates/azure-ad-conditional-access-for-country-codes-is-in-public-preview/)

* September 21, 2018, [Azure AD terms-of-use now available](https://azure.microsoft.com/updates/azure-ad-terms-of-use-now-available/)

## Learning resources

### Level 100 knowledge concepts

Follow the links below to get an overview of how Azure AD Conditional Access functions.

* Learn "[What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)"

* Know "[What are conditions in Azure Active Directory conditional access?](https://docs.microsoft.com/azure/active-directory/conditional-access/conditions)"

* Know "[What is the location condition in Azure Active Directory conditional access?](https://docs.microsoft.com/azure/active-directory/conditional-access/location-condition)"

* Know "[What are access controls in Azure Active Directory conditional access?](https://docs.microsoft.com/azure/active-directory/conditional-access/controls)"

* Find "[What is the what if tool in Azure Active Directory conditional access?"](https://docs.microsoft.com/azure/active-directory/conditional-access/what-if-tool)

* Follow [Best practices for conditional access in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/conditional-access/best-practices)

Additionally, refer to the following links for guidance to protect access to all services that are integrated with Azure Active Directory.

* [What is baseline protection (preview)?](https://docs.microsoft.com/azure/active-directory/conditional-access/baseline-protection) Baseline protection ensures that you have at least the baseline level of security enabled in your Azure Active Directory environment.

* [Identity and device access configurations](file:///C:Usersv-dihoobAppDataLocalMicrosoftWindowsINetCacheContent.OutlookT446X18Maka.msm365goldenconfig). Describes how to configure secure access to cloud services through Enterprise Mobility + Security products by implementing a recommended environment and configuration, including a prescribed set of conditional access policies and related capabilities.

* [Azure Active Directory conditional access settings reference](https://docs.microsoft.com/azure/active-directory/conditional-access/technical-reference). Learn:

   * What apps use conditional access?
   * What services are enabled with conditional access?

* [Enable Azure Active Directory Conditional Access for Secure User Access](https://www.youtube.com/watch?v=eLAYBwjCGoA). Watch this video to learn how Conditional Access plays a role in other Enterprise and Mobility Suite's workloads.

### Role-based guidance for IT administrators

Sign in to your [Azure portal](https://portal.azure.com/) as global administrator, security administrator, or conditional access administrator. Refer to [Administrator role permissions in Azure Active Directory.](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles)

As an IT administrator, you use [Azure AD conditional access](https://docs.microsoft.com/azure/active-directory/conditional-access/overview) to require users to authenticate using multi-factor authentication (MFA) or sign in from a trusted network or device.

Here are useful links to help you get started:

* [Best practices for conditional access in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/conditional-access/best-practices)

* [Use Azure AD access reviews to manage users that have been excluded from conditional access policies](https://docs.microsoft.com/azure/active-directory/governance/conditional-access-exclusion)

* [How To: Plan your conditional access deployment in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/conditional-access/plan-conditional-access)

* [Quickstart: Require MFA for specific apps with Azure Active Directory conditional access](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-mfa)

* [Quickstart: Require terms of use to be accepted before accessing cloud apps](https://docs.microsoft.com/azure/active-directory/conditional-access/require-tou)

* [Quickstart: Block access when a session risk is detected with Azure Active Directory conditional access](https://docs.microsoft.com/azure/active-directory/conditional-access/app-sign-in-risk)

* [Azure AD Conditional Access FAQs](https://docs.microsoft.com/azure/active-directory/conditional-access/faqs)

### Role-based guidance for help desk

* Refer to [Azure AD Conditional Access FAQs](https://docs.microsoft.com/azure/active-directory/conditional-access/faqs) for common questions.

* For additional questions, you can also view the [MSDN forum](https://social.msdn.microsoft.com/Forums/home?forum=WindowsAzureAD&sort=relevancedesc&brandIgnore=True&searchTerm=password+reset+azure).

* If you cannot find the answer to a problem, our support teams are always available to assist you further. Use [Contact Microsoft support](https://docs.microsoft.com/azure/active-directory/authentication/active-directory-passwords-troubleshoot#contact-microsoft-support).

### Training videos

* YouTube - **Conditional Access in Enterprise Mobility + Security**

> [!VIDEO https://www.youtube.com/embed/A7IrxAH87wc]

* YouTube - **Device-based Conditional Access**

> [!VIDEO https://www.youtube.com/embed/AdM0zYB-3WQ]

* YouTube - **Enable Azure Active Directory for Conditional Access for Secure User Access**

> [!VIDEO https://www.youtube.com/embed/eLAYBwjCGoA]

### Online Courses

Refer to the following Conditional Access courses and more on [Pluralsight.com](https://www.pluralsight.com/):

* Pluralsight.com: [Design Identity Management in Microsoft Azure](https://www.pluralsight.com/courses/microsoft-azure-identity-management-design)

    "This course guides you through the key items you need to know to design your identity management solution with Azure AD." Azure AD Conditional Access is covered in "Using Roles and Access Control with Azure AD" module.

* Pluralsight.com: [Design Authentication for Microsoft Azure](https://www.pluralsight.com/courses/microsoft-azure-authentication-design)

    "This course explains how to use Azure AD to solve all your cloud authentication requirements." Azure AD Conditional Access is covered in "Authentication Requirements for Different Scenarios" module.

* Pluralsight.com: [Design Authorization for Microsoft Azure](https://www.pluralsight.com/courses/microsoft-azure-authorization-design)

    "This course teaches authorization options available with Azure and Azure AD." Azure AD Conditional Access is covered in "Authorization with Azure Resource Manager and Azure AD" module.

### Books

* O'Reilly- [Implementing Azure Solutions - Second Edition.](https://www.oreilly.com/library/view/implementing-azure-solutions/9781789343045/b7ead3db-eb1c-4ace-897e-86ee25ea86be.xhtml)

    "Get up and running with Azure services and learn how to implement them in your organization. Azure AD Conditional Access is covered in the chapter [Deploying and Synchronizing Azure Active Directory](https://learning.oreilly.com/library/view/implementing-azure-solutions/9781789343045/02ca8bba-08cf-4691-a7d0-1b96e286e7ea.xhtml)."

* Wiley- [Mastering Microsoft Azure Infrastructure Services](https://www.wiley.com/Mastering+Microsoft+Azure+Infrastructure+Services-p-9781119003298)

    "Here's everything you need to understand, evaluate, deploy, and maintain environments that utilize Microsoft Azure."

### Tutorials

* [**Quickstart: Require MFA for specific apps with Azure Active Directory conditional access**](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-mfa)

    This quickstart shows how to configure an Azure AD conditional access policy that requires multi-factor authentication for a selected cloud app in your environment.

* [**Quickstart: Require terms of use to be accepted before accessing cloud apps**](https://docs.microsoft.com/azure/active-directory/conditional-access/require-tou)

    This quickstart shows how to configure an Azure AD conditional access policy that requires a ToU to be accepted for a selected cloud app in your environment.

* [**Quickstart: Block access when a session risk is detected with Azure Active Directory conditional access**](https://docs.microsoft.com/azure/active-directory/conditional-access/app-sign-in-risk)

    This quickstart shows how to configure a conditional access policy that blocks a sign-in when a configured sign-in risk level has been detected.

* [Tutorial: **Migrate a classic policy that requires multi-factor authentication in the Azure portal**](https://docs.microsoft.com/azure/active-directory/conditional-access/policy-migration-mfa)

    This tutorial shows how to migrate a classic policy that requires multi-factor authentication (MFA) for a cloud app.

### Whitepapers

* Published December 18, 2018, [Create a resilient access control management strategy with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/authentication/concept-resilient-controls)

    This document provides guidance on strategies an organization might adopt to provide resilience to reduce the risk of lockout during unforeseen disruptions.

* Published September 18, 2018, [Resources for migrating applications to Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/migration-resources)

    This whitepaper includes a list of resources to help you migrate application access and authentication to Azure Active Directory (Azure AD).

* Published July 12, 2018 [Azure Security and Compliance Blueprint: PaaS Web Application Hosting for UK OFFICIAL Workloads](https://docs.microsoft.com/azure/security/blueprints/ukofficial-paaswa-overview)

    Azure Blueprints consist of guidance documents and automation templates that deploy cloud-based architectures to offer solutions to scenarios that have accreditation or compliance requirements.

### FAQs

Refer to [Azure AD Conditional Access FAQs](https://docs.microsoft.com/azure/active-directory/conditional-access/faqs) for common questions.

## End-user Readiness and Communication

Conditional Access uses other Azure AD capabilities that may affect end-users' experience. For example, you can use Azure Multi-factor authentication to enable strong authentication for users. In that case, you will use the end-user templates of Azure MFA.

## Next steps

* Start your deployment with the [conditional access deployment planning documentation](https://docs.microsoft.com/azure/active-directory/conditional-access/plan-conditional-access).