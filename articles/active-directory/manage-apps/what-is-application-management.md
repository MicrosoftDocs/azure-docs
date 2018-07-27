---
title: Managing Applications with Azure Active Directory | Microsoft Docs
description: This article the benefits of integrating Azure Active Directory with your on-premises, cloud and SaaS applications.
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.service: active-directory
ms.component: app-mgmt
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/23/2018
ms.author: barbkess
ms.reviewer: asteen

---

# What is application management in Azure Active Directory?

Application management is a capability of Azure Active Directory that centralizes the way you manage user access to applications in your organization. When your organization's applications are managed in your Azure AD tenant, users can sign on to any application by using their Azure AD accounts. With a single sign-on, users can access the other applications without signing in again.

![Apps federated via Azure AD](media/migrate-adfs-apps-to-azure/migrate2.png)

## Why centralize application management?

Organizations often have hundreds of applications that users depend on to get their work done. Users access these applications from a vast range of devices and locations. In addition, new apps are added, developed, and sunset every day. With so many applications and access points, it is more critical than ever for businesses to manage costs, manage risks, improve user productivity, and address governance and compliance needs.


### Single sign-on improves productivity
Enabling single sign-on across enterprise applications and Office 365 provides a superior log in experience for existing users, reducing or eliminating log on prompts. The user’s environment feels more cohesive and is less distracting without multiple prompts, or the need to manage multiple passwords. Access control can be managed and approved by the business group, saving IT management costs through self-service and dynamic membership, and improving the overall security of our identity system by ensuring the right people in the business manage access to this application.

### Manage risk
Coupling Azure AD SSO with conditional access policies can offer significantly improved security experiences. These include cloud-scale identity protection, risk-based access control capabilities, native multi-factor authentication support, and conditional access policies which allow for granular control policies based on applications, or on groups that need higher levels of security.

### Address governance and compliance
Auditing access requests and approvals for the application, as well as understanding overall application usage, becomes easier with Azure Active Directory, which supports native audit logs for every application access request performed. Auditing includes requester identity, requested date, business justification, approval status, and approver identity. This data is also available from an API, which will enables importing this data into a Security Incident and Event Monitoring (SIEM) system of choice.

### Manage costs
Replacing current access management and provisioning process and migration to Azure Active Directory to manage self-service access to the application (as well as other SaaS applications in the future) will allow for significant cost reductions related to running, managing, and maintaining our current infrastructure. Additionally, eliminating application specific passwords eliminates costs related to password reset for that application, and lost productivity while retrieving passwords.


### Results of not centralizing application management

Okay, so what’s the problem? If user access to applications is not managed in one place with an integrated solution:

- Identity administrators have to individually create and update user accounts in all applications separately, a redundant and time consuming activity.

- Users have to memorize multiple credentials to access the applications they need to work with. As a result, users tend to write down their passwords or use other password management solutions. These alternatives introduce other data security risks.

- Redundant, time consuming activities reduce the time users and administrators spend working on business activities that increase your business’s bottom line.



