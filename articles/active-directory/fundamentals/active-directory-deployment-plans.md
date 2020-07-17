---
title: Deployment plans - Azure Active Directory | Microsoft Docs
description: End-to-end guidance about how to deploy many Azure Active Directory capabilities.
services: active-directory
author: msaburnley
manager: daveba

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 08/20/2019
ms.author: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Azure Active Directory deployment plans
Looking for end-to-end guidance on deploying Azure Active Directory (Azure AD) capabilities? Azure AD deployment plans walk you through the business value, planning considerations, and operational procedures needed to successfully deploy common Azure AD capabilities.

From any of the plan pages, use your browser's Print to PDF capability to create an up-to-date offline version of the documentation.
## Include the right stakeholders

When beginning your deployment planning for a new capability, it's important to include key stakeholders across your organization. We recommend that you identify and document the person or people who fulfill each of the following roles, and work with them to determine their involvement in the project.  

Roles might include the following 

|Role |Description |
|-|-|
|End-user|A representative group of users for which the capability will be implemented. Often previews the changes in a pilot program.
|IT Support Manager|IT support organization representative who can provide input on the supportability of this change from a helpdesk perspective.  
|Identity Architect or Azure Global Administrator|Identity management team representative in charge of defining how this change is aligned with the core identity management infrastructure in your organization.|
|Application Business Owner |The overall business owner of the affected application(s), which may include managing access.  May also provide input on the user experience and usefulness of this change from an end-user's perspective.
|Security Owner|A representative from the security team that can sign off that the plan will meet the security requirements of your organization.|
|Compliance Manager|The person within your organization responsible for ensuring compliance with  corporate, industry, or governmental requirements.|

**Levels of involvement might include:**

- **R**esponsible for implementing project plan and outcome 

- **A**pproval of project plan and outcome 

- **C**ontributor to project plan and outcome 

- **I**nformed of project plan and outcome


## Best practices for a pilot
A pilot allows you to test with a small group before turning a capability on for everyone. Ensure that as part of your testing, each use case within your organization is thoroughly tested. It's best to target a specific group of pilot users before rolling this out to your organization as a whole.

In your first wave, target IT, usability, and other appropriate users who can test and provide feedback. This feedback should be used to further develop the communications and instructions you send to your users, and to give insights into the types of issues your support staff may see. 

Widening the rollout to larger groups of users should be carried out by increasing the scope of the group(s) targeted. This can be done through [dynamic group membership](../users-groups-roles/groups-dynamic-membership.md), or by manually adding users to the targeted group(s).


## Deploy authentication

| Capability | Description|
| -| -|
| [Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md)| Azure Multi-Factor Authentication (MFA) is Microsoft's two-step verification solution. Using admin-approved authentication methods, Azure MFA helps safeguard access to your data and applications while meeting the demand for a simple sign-in process. |
| [Conditional Access](../conditional-access/plan-conditional-access.md)| With Conditional Access, you can implement automated access control decisions for who can access your cloud apps, based on conditions. |
| [Self-service password reset](../authentication/howto-sspr-deployment.md)| Self-service password reset helps your users reset their passwords without administrator intervention, when and where they need to. |
| [Passwordless](../authentication/howto-authentication-passwordless-deployment.md) | Implement passwordless authentication using the the Microsoft Authenticator app or FIDO2 Security keys in your organization |

## Deploy application and device management

| Capability | Description|
| -| - |
| [Single sign-on](../manage-apps/plan-sso-deployment.md)| Single sign-on helps your users access the apps and resources they need to do business while signing in only once. After they've signed in, they can go from Microsoft Office to SalesForce to Box to internal applications without being required to enter credentials a second time. |
| [Access panel](../manage-apps/access-panel-deployment-plan.md)| Offer your users a simple hub to discover and access all their applications. Enable them to be more productive with self-service capabilities, like requesting access to apps and groups, or managing access to resources on behalf of others. |
| [Devices](../devices/plan-device-deployment.md) | This article helps you evaluate the methods to integrate your device with Azure AD, choose the implementation plan, and provides key links to supported device management tools. |


## Deploy hybrid scenarios

| Capability | Description|
| -| -|
| [ADFS to Password Hash Sync](../hybrid/plan-migrate-adfs-password-hash-sync.md)| With Password Hash Synchronization, hashes of user passwords are synchronized from on-premises Active Directory to Azure AD, letting Azure AD authenticate users with no interaction with the on-premises Active Directory |
| [ADFS to Pass Through Authentication](../hybrid/plan-migrate-adfs-pass-through-authentication.md)| Azure AD Pass-through Authentication helps your users sign in to both on-premises and cloud-based applications using the same passwords. This feature provides users with a better experience - one less password to remember - and reduces IT helpdesk costs because users are less likely to forget how to sign in. When people sign in using Azure AD, this feature validates users' passwords directly against your on-premises Active Directory. |
| [Azure AD Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-deployment-plan) |Employees today want to be productive at any place, at any time, and from any device. They need to access SaaS apps in the cloud and corporate apps on-premises. Azure AD Application proxy enables this robust access without costly and complex virtual private networks (VPNs) or demilitarized zones (DMZs). |
| [Seamless SSO](../hybrid/how-to-connect-sso-quick-start.md)| Azure Active Directory Seamless Single Sign-On (Azure AD Seamless SSO) automatically signs users in when they are on their corporate devices connected to your corporate network. With this feature, users won't need to type in their passwords to sign in to Azure AD and usually won't need to enter their usernames. This feature provides authorized users with easy access to your cloud-based applications without needing any additional on-premises components. |

## Deploy user provisioning

| Capability | Description|
| -| -|
| [User provisioning](../app-provisioning/plan-auto-user-provisioning.md)| Azure AD helps you automate the creation, maintenance, and removal of user identities in cloud (SaaS) applications, such as Dropbox, Salesforce, ServiceNow, and more. |
| [Cloud HR user provisioning](../app-provisioning/plan-cloud-hr-provision.md)| Cloud HR user provisioning to Active Directory creates a foundation for ongoing identity governance and enhances the quality of business processes that rely on authoritative identity data. Using this feature with your cloud HR product, such as Workday or Successfactors, you can seamlessly manage the identity lifecycle of employees and contingent workers by configuring rules that map Joiner-Mover-Leaver processes (such as New Hire, Terminate, Transfer) to IT provisioning actions (such as Create, Enable, Disable) |

## Deploy governance and reporting

| Capability | Description|
| -| -|
| [Privileged Identity Management](../privileged-identity-management/pim-deployment-plan.md)| Azure AD Privileged Identity Management (PIM) helps you manage privileged administrative roles across Azure AD, Azure resources, and other Microsoft Online Services. PIM provides solutions like just-in-time access, request approval workflows, and fully integrated access reviews so you can identify, uncover, and prevent malicious activities of privileged roles in real time. |
| [Reporting and Monitoring](../reports-monitoring/plan-monitoring-and-reporting.md)| The design of your Azure AD reporting and monitoring solution depends on your legal, security, and operational requirements as well as your existing environment and processes. This article presents the various design options and guides you to the right deployment strategy. |
