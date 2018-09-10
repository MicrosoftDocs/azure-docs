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
ms.date: 09/10/2018
ms.author: barbkess
ms.reviewer: arvinh

---

# What is application management in Azure Active Directory?

You can use Azure Active Directory (Azure AD) to manage user access to Office 365 and all other business applications from Microsoft, thousands of software as a service (SaaS) applications, on-premises applications, and line of business (LOB) apps. When application access is managed with Azure AD, users can sign on to any application by using their Azure AD accounts. After a single sign-on, users can access the other applications without signing in again.


![Apps federated via Azure AD](media/migrate-adfs-apps-to-azure/migrate2.png)

## Why manage applications with a cloud solution?

Organizations often have hundreds of applications that users depend on to get their work done. Users access these applications from a vast range of devices and locations. In addition, new apps are added, developed, and sunset every day. With so many applications and access points, it is more critical than ever to use a cloud-based solution to manage user access to all applications.

## Benefits of using Azure AD for application management

Azure AD provides a cloud solution for managing user access to applications. 

### Manage risk with conditional access policies
Coupling Azure AD single sign-on (SSO) with conditional access policies can offer significantly improved security experiences. These include cloud-scale identity protection, risk-based access control capabilities, native multi-factor authentication support, and conditional access policies which allow for granular control policies based on applications, or on groups that need higher levels of security.

### Improve productivity with single sign-on
Enabling single sign-on across applications and Office 365 provides a superior log in experience for existing users, reducing or eliminating log on prompts. The user’s environment feels more cohesive and is less distracting without multiple prompts, or the need to manage multiple passwords. Access control can be managed and approved by the business group, saving IT management costs through self-service and dynamic membership, and improving the overall security of our identity system by ensuring the right people in the business manage access to this application.

Without single sign-on:

- Administrators need to create and update user accounts in all applications separately. These activities take a lot of time  

- Users have to memorize multiple credentials to access the applications they need to work with. As a result, users tend to write down their passwords or use other password management solutions. These alternatives introduce other data security risks.



### Address governance and compliance
With Azure AD, you can audit access requests and approvals for the application, as well as understand overall application usage. Azure AD supports native audit logs for every application access request performed. Auditing data is also available from an API, which enables you to import this data into a Security Incident and Event Monitoring (SIEM) system of choice. You can review which users have access to an application, as well as programmatically remove access for users that haven't accessed the application recently.

### Manage costs
By migrating to Azure AD, you can save costs associated with managing your current infrastructure by allowing Azure AD to manage self-service access to your applications. Additionally, using single sign-on (SSO) eliminates application-specific passwords. Using SSO saves costs related to password reset for applications, and lost productivity while retrieving passwords.




