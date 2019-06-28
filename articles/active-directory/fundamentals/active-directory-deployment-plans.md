---
title: Deployment plans - Azure Active Directory | Microsoft Docs
description: End-to-end guidance about how to deploy many Azure Active Directory capabilities.
services: active-directory
author: eross-msft
manager: daveba

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 02/08/2019
ms.author: lizross
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Azure Active Directory deployment plans
Looking for end-to-end guidance about how to deploy some of Azure Active Directory (Azure AD) capabilities? The following deployment plans walk through the business value, planning considerations, design, and operational procedures needed to successfully roll a few of the more common Azure AD capabilities. 

Within the documents you will find e-mail templates, system architecture diagrams, common test cases, and more. 

We'd love your feedback on the documents. Take this short [survey](https://aka.ms/deploymentplanfeedback) about how the documents worked for you. 

## Include the right stakeholders

When beginning your deployment planning for a new capability, it’s important to include key stakeholders across your organization. We recommend that you identify and document the person or people who fulfill each of the following roles, and work with them to determine their involvement in the project.  

Roles might include the following 

|Role |Description |
|-|-|
|End-user|A representative group of users for which the capability will be implemented. Often previews the changes in a pilot program.
|IT Support Manager|IT support organization representative who can provide input on the supportability of this change from a helpdesk perspective.  
|Identity Architect or Azure Global Administrator|Identity management team representative in charge of defining how this change is aligned with the core identity management infrastructure in your organization.|
|Application Business Owner |The overall business owner of the affected application(s), which may include managing access.  May also provide input on the user experience and usefulness of this change from an end-user’s perspective.
|Security Owner|A representative from the security team that can sign off that the plan will meet the security requirements of your organization.|
|Compliance Manager|The person within your organization responsible for ensuring compliance with  corporate, industry, or governmental requirements.|

**Levels of involvement might include:**

- **R**esponsible for implementing project plan and outcome 

- **A**pproval of project plan and outcome 

- **C**ontributor to project plan and outcome 

- **I**nformed of project plan and outcome
 
## Deployment Plans



|Scenario |Description |
|-|-|
|[Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md)|Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution. Using admin-approved authentication methods, Azure MFA helps safeguard your access to data and applications, while meeting the demand for a simple sign-in process.|
|[Conditional Access](https://aka.ms/deploymentplans/ca)|With Conditional Access, you can implement automated access control decisions for who can access your cloud apps, based on conditions.|
|[Self-service password reset](https://aka.ms/SSPRDPDownload)|Self-service password reset helps your users reset their password, without administrator intervention, when and where they need to.|
|[Privileged Identity Management](https://aka.ms/deploymentplans/pim)|Azure AD Privileged Identity Management (PIM) helps you manage privileged administrative roles across Azure AD, Azure resources, and other Microsoft Online Services. PIM provides solutions like just-in-time access, request approval workflows, and fully integrated access reviews so you can identify, uncover, and prevent malicious activities of privileged roles in real time.|
|[Single sign-on](https://aka.ms/SSODPDownload)|Single sign-on helps you access all the apps and resources you need to do business, while signing in only once, using a single user account. After you've signed in, you can go from Microsoft Office to SalesForce, to Box without being required to authenticate (for example, type a password) a second time.|
|[Seamless SSO](https://aka.ms/SeamlessSSODPDownload)|Azure Active Directory Seamless Single Sign-On (Azure AD Seamless SSO) automatically signs users in when they are on their corporate devices connected to your corporate network. After you turn on this feature, users won't need to type in their passwords to sign in to Azure AD, and usually, won't even need to type in their usernames. This feature provides your users easy access to your cloud-based applications without needing any additional on-premises components.|
|[Access Panel](https://aka.ms/AccessPanelDPDownload)|Offer your users a simple hub to discover and access all their applications. Enable them to be more productive with self-service capabilities, such as the ability to request access to new apps and groups, or manage access to these resources on behalf of others.|
|[ADFS to Password Hash Sync](https://aka.ms/deploymentplans/adfs2phs)|With Password Hash Synchronization, hashes of user passwords are synchronized from on-premises Active Directory to Azure AD, letting Azure AD to authenticate users with no interaction with the on-premises Active Directory|
|[ADFS to Pass Through Authentication](https://aka.ms/deploymentplans/adfs2pta)|Azure AD Pass-through Authentication helps your users sign in to both on-premises and cloud-based applications, using the same passwords. This feature provides your users a better experience - one less password to remember, and reduces IT helpdesk costs because your users are less likely to forget how to sign in. When people sign in using Azure AD, this feature validates users' passwords directly against your on-premises Active Directory.|
|[Azure AD Application Proxy](https://aka.ms/deploymentplans/appproxy)|Employees today want to be productive at any place, at any time, and from any device. They want to work on their own devices, whether they are tablets, phones, or laptops. And employees expect to be able to access all their applications, both SaaS apps in the cloud and corporate apps on-premises. Providing access to on-premises applications has traditionally involved virtual private networks (VPNs) or demilitarized zones (DMZs). Not only are these solutions complex and hard to make secure, but they are costly to set up and manage. There is a better way! - Azure AD Application Proxy|
|[User provisioning](https://aka.ms/UserProvisioningDPDownload)|Azure AD helps you automate the creation, maintenance, and removal of user identities in cloud (SaaS) applications, such as Dropbox, Salesforce, ServiceNow, and more.|
|[Workday-driven Inbound User Provisioning](https://aka.ms/WorkdayDeploymentPlan)|Workday-driven Inbound User Provisioning to Active Directory creates a foundation for ongoing identity governance and enhances the quality of business processes that rely on authoritative identity data. Using this feature, you can seamlessly manage the identity lifecycle of employees and contingent workers by configuring rules that map Joiner-Mover-Leaver processes (such as New Hire, Terminate, Transfer) to IT provisioning actions (such as Create, Enable, Disable, Delete accounts).|
