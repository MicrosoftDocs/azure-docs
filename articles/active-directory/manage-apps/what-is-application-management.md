---
title: Managing Applications with Azure Active Directory | Microsoft Docs
description: This article the benefits of integrating Azure Active Directory with your on-premises, cloud and SaaS applications.
services: active-directory
author: barbkess
manager: mtillman
ms.service: active-directory
ms.component: app-mgmt
ms.topic: overview
ms.workload: identity
ms.date: 07/23/2018
ms.author: barbkess
ms.reviewer: arvinh

---

# What is application management in Azure Active Directory?

You can use Azure Active Directory (Azure AD) to manage user access to applications including Office 365, on-premises apps, line of business (LOB), and software as a service (SaaS) apps. When applications are managed in Azure AD, users can sign on to any application by using their Azure AD accounts. After a single sign-on, users can access the other applications without signing in again.


![Apps federated via Azure AD](media/migrate-adfs-apps-to-azure/migrate2.png)

## Why manage applications with a cloud solution?

Organizations often have hundreds of applications that users depend on to get their work done. Users access these applications from a vast range of devices and locations. In addition, new apps are added, developed, and sunset every day. With so many applications and access points, it is more critical than ever to use a cloud-based solution to manage user access to all applications.

## Benefits of using Azure AD for application management

Azure AD provides a cloud solution for managing user access to applications. 


### Improve productivity with single sign-on
Enabling single sign-on across applications and Office 365 provides a superior log in experience for existing users, reducing or eliminating log on prompts. The user’s environment feels more cohesive and is less distracting without multiple prompts, or the need to manage multiple passwords. Access control can be managed and approved by the business group, saving IT management costs through self-service and dynamic membership, and improving the overall security of our identity system by ensuring the right people in the business manage access to this application.

Without single sign-on:

- Administrators need to create and update user accounts in all applications separately. These activities take a lot of time  

- Users have to memorize multiple credentials to access the applications they need to work with. As a result, users tend to write down their passwords or use other password management solutions. These alternatives introduce other data security risks.

### Manage risk with conditional access policies
Coupling Azure AD SSO with conditional access policies can offer significantly improved security experiences. These include cloud-scale identity protection, risk-based access control capabilities, native multi-factor authentication support, and conditional access policies which allow for granular control policies based on applications, or on groups that need higher levels of security.

### Address governance and compliance with audit logs
Auditing access requests and approvals for the application, as well as understanding overall application usage, becomes easier with Azure Active Directory, which supports native audit logs for every application access request performed. Auditing includes requester identity, requested date, business justification, approval status, and approver identity. This data is also available from an API, which will enables importing this data into a Security Incident and Event Monitoring (SIEM) system of choice.

### Manage costs with self-service access
Replacing current access management and provisioning process and migration to Azure Active Directory to manage self-service access to the application (as well as other SaaS applications in the future) will allow for significant cost reductions related to running, managing, and maintaining our current infrastructure. Additionally, eliminating application specific passwords eliminates costs related to password reset for that application, and lost productivity while retrieving passwords.





