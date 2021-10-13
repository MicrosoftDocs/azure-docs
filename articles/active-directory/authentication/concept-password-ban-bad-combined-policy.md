---
title: Combined password policy and weak password ckeck in Azure Active Directory
description: Learn how to dynamically ban weak passwords from your environment with Azure Active Directory Password Protection

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/13/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: rogoya

ms.collection: M365-identity-device-management
---
# Combined password policy and weak password check in Azure Active Directory

Beginning in October 2021, Azure Active Directory (Azure AD) validation for compliance with password policies includes a check for known weak passwords and their variants. 
As the combined password check is rolled out to customers gradually, users may see differences when they create, change, or reset their password. This topc explains details about the password policy criteria checked by Aure AD and some cases where the user experience is changed by the combined check. 

## Azure AD password policies

A password policy is applied to all user and admin accounts that are created and managed directly in Azure AD. You can ban weak passwords and define parameters to lock out an account after repeated bad password attempts. Other password policy settings can't be modified.

The Azure AD password policy doesn't apply to user accounts synchronized from an on-premises AD DS environment using Azure AD Connect, unless you enable EnforceCloudPasswordPolicyForPasswordSyncedUsers.

The following Azure AD password policy requirements apply for all passwords that are created, changed, or reset in Azure AD. This includes during user provisioning, password change, and password reset flows. Unless noted, you can't change these settings:


