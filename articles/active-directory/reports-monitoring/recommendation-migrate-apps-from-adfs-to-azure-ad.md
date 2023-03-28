---
title: Azure Active Directory recommendation - Migrate apps from ADFS to Azure AD in Azure AD
description: Learn why you should migrate apps from ADFS to Azure AD in Azure AD
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 03/25/2023
ms.author: sarahlipsey
ms.reviewer: hafowler

ms.collection: M365-identity-device-management
---
# Azure AD recommendation: Migrate apps from ADFS to Azure AD 

[Azure AD recommendations](overview-recommendations.md) provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to migrate apps from Active Directory Federated Services (AD FS) to Azure Active Directory (Azure AD). This recommendation is called `adfsAppsMigration` in the recommendations API in Microsoft Graph.

## Description

As an admin responsible for managing applications, you want your applications to use Azure AD’s security features and maximize their value. This recommendation shows up if your tenant has apps on ADFS that can 100% be migrated to Azure AD.

## Value 

Using Azure AD gives you granular per-application access controls to secure access to applications. With Azure AD's B2B collaboration, you can increase user productivity. Automated app provisioning automates the user identity lifecycle in cloud SaaS apps such as Dropbox, Salesforce and more. 

## Action plan

1. [Install Azure AD Connect Health](../hybrid/how-to-connect-install-roadmap.md) on your AD FS server. 
1. [Review the AD FS application activity report](../manage-apps/migrate-adfs-application-activity.md) to get insights about your AD FS applications. 
1. Read the solution guide for [migrating applications to Azure AD](../manage-apps/migrate-adfs-apps-to-azure.md). 
1. Migrate applications to Azure AD. For more information, see the article [Migrate from federation to cloud authentication](../hybrid/migrate-from-federation-to-cloud-authentication.md).

### Guided walkthrough

For a guided walkthrough of many of the recommendations in this article, see the migration guide [Migrate from AD FS to Microsoft Azure Active Directory for identity management](https://setup.microsoft.com/azure/migrate-ad-fs-to-microsoft-azure-ad).

## Next steps

- [Review the Azure AD recommendations overview](overview-recommendations.md)
- [Learn how to use Azure AD recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)
