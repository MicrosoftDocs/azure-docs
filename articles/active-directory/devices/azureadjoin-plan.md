---
title: Usage scenarios and deployment considerations for Azure AD Join| Microsoft Docs
description: Explains how administrators can set up Azure AD Join for their end users (employees, students, other users). It also discusses the different real-world scenarios for using Azure AD Join.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''
tags: azure-classic-portal

ms.component: devices
ms.assetid: 81d4461e-21c8-4fdd-9076-0e4991979f62
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2018
ms.author: markvi

---
# Usage scenarios and deployment considerations for Azure AD Join
## Usage scenarios for Azure AD Join
### Scenario 1: Businesses largely in the cloud
Azure Active Directory Join (Azure AD Join) can benefit you if you currently operate and manage identities for your business in the cloud or are moving to the cloud soon. You can use an account that you have created in Azure AD to sign in to Windows 10. Through [the first run experience (FRX) process](azuread-joined-devices-frx.md), or by joining Azure AD from [the settings menu](../user-help/device-management-azuread-joined-devices-setup.md), your users can join their machines to Azure AD.  Your users can also enjoy single sign-on (SSO) access to  cloud resources like Office 365, either in their browsers or in Office applications.

### Scenario 2: Educational institutions
Educational institutions usually have two user types: faculty and students. Faculty members are considered longer-term members of the organization. Creating on-premises accounts for them is desirable. But students are shorter-term members of the organization and  their accounts can be managed in Azure AD. This means that directory scale can be pushed to the cloud instead of being stored on-premises. It also means that students  will be able to sign in to Windows with their Azure AD accounts and get access to Office 365 resources in Office applications.

### Scenario 3: Retail businesses
Retail businesses have seasonal workers and long-term employees. You typically create on-premises accounts and use domain-joined machines for longer-term full-time employees. But seasonal workers are shorter-term members of the organization, and it's desirable to manage their accounts where user licenses can be more easily moved around. When you create their user accounts in the cloud with Office 365 licenses, these users get the benefits of signing in to Windows and Office applications with an Azure AD account, while you maintain more flexibility with their licenses after they leave.

### Scenario 4: Additional scenarios
Along with the benefits discussed earlier, you  benefit from having your users join their devices to Azure AD because of a simplified joining experience, efficient device management, automatic mobile device management enrollment, and single sign-on to Azure AD and on-premises resources.  

## Deployment considerations for Azure AD Join
### Enable your users to join a company-owned device directly to Azure AD
Enterprises can provide cloud-only accounts to partner companies and organizations. These partners can then easily access company apps and resources with single sign-on. This scenario is applicable to users who access resources primarily in the cloud, such as Office 365 or SaaS apps that rely on Azure AD for authentication.

### Prerequisites
**At the enterprise level (administrator)**

* Azure subscription with Azure Active Directory  

**At the user level**

* Windows 10 (Professional and Enterprise editions)

### Administrator tasks
* [Set up device registration](device-management-azure-portal.md)

### User tasks
* [Set up a new Windows 10 device with Azure AD during setup](azuread-joined-devices-frx.md)
* [Set up a Windows 10 device with Azure AD from the settings menu](../user-help/device-management-azuread-registered-devices-windows10-setup.md)
* [Join a personal Windows 10 device to your organization](../user-help/device-management-azuread-joined-devices-setup.md)

## Enable BYOD in your organization for Windows 10
You can set up your users and employees to use their personal Windows devices (BYOD) to access company apps and resources. Your users can add their Azure AD accounts (work or school accounts) to a personal Windows device to access resources in a secure and compliant fashion.

### Prerequisites
**At the enterprise level (administrator)**

* Azure AD subscription

**At the user level**

* Windows 10 (Professional and Enterprise editions)

### Administrator tasks
* [Set up device registration](device-management-azure-portal.md)

### User tasks
* [Join a personal Windows 10 device to your organization](../user-help/device-management-azuread-joined-devices-setup.md)

## Next steps

- [Device management](overview.md)

