---
title: Azure Active Directory recommendation - Migrate apps from ADFS to Azure AD in Azure AD | Microsoft Docs
description: Learn why you should migrate apps from ADFS to Azure AD in Azure AD
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 03/02/2023
ms.author: sarahlipsey
ms.reviewer: hafowler

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Migrate apps from ADFS to Azure AD 

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to migrate apps from Active Directory Federated Services (AD FS) to Azure Active Directory (Azure AD). This recommendation is called `adfsAppsMigration` in the recommendations API in Microsoft Graph.

## Description

As an admin responsible for managing applications, I want my applications to use Azure AD’s security features and maximize their value. 

## Logic 

If a tenant has apps on AD FS, and any of these apps are deemed 100% migratable, this recommendation shows up. 

## Value 

Using Azure AD gives you granular per-application access controls to secure access to applications. With Azure AD's B2B collaboration, you can increase user productivity. Automated app provisioning automates the user identity lifecycle in cloud SaaS apps such as Dropbox, Salesforce and more. 

## Action plan

1. [Install Azure AD Connect Health](../hybrid/how-to-connect-install-roadmap.md) on your AD FS server. 

2. [Review the AD FS application activity report](../manage-apps/migrate-adfs-application-activity.md) to get insights about your AD FS applications. 

3. Read the solution guide for [migrating applications to Azure AD](../manage-apps/migrate-adfs-apps-to-azure.md). 

4. Migrate applications to Azure AD. For more information, use [the deployment plan for enabling single sign-on](https://go.microsoft.com/fwlink/?linkid=2110877&amp;clcid=0x409).
 
## Next steps

- [Review the Azure AD recommendations overview](overview-recommendations.md)
- [Learn how to use Azure AD recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)
