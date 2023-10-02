---
title: Microsoft Entra recommendation - Migrate apps from ADFS to Microsoft Entra ID
description: Learn why you should migrate apps from ADFS to Microsoft Entra ID
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 09/22/2023
ms.author: sarahlipsey
ms.reviewer: hafowler
---
# Microsoft Entra recommendation: Migrate apps from ADFS to Microsoft Entra ID 

[Microsoft Entra recommendations](overview-recommendations.md) provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to migrate apps from Active Directory Federated Services (AD FS) to Microsoft Entra ID. This recommendation is called `adfsAppsMigration` in the recommendations API in Microsoft Graph.

## Description

As an admin responsible for managing applications, you want your applications to use the security features of Microsoft Entra ID and maximize their value. This recommendation shows up if your tenant has apps on ADFS that can 100% be migrated to Microsoft Entra ID.

## Value 

Using Microsoft Entra ID gives you granular per-application access controls to secure access to applications. With Microsoft Entra B2B collaboration, you can increase user productivity. Automated app provisioning automates the user identity lifecycle in cloud SaaS apps such as Dropbox, Salesforce and more. 

## Action plan

1. [Install Microsoft Entra Connect](../hybrid/connect/how-to-connect-install-roadmap.md) on your AD FS server. 
1. [Review the AD FS application activity report](../manage-apps/migrate-adfs-application-activity.md) to get insights about your AD FS applications. 
1. Read the solution guide for [migrating applications to Microsoft Entra ID](../manage-apps/migrate-adfs-apps-stages.md). 
1. Migrate applications to Microsoft Entra ID. For more information, see the article [Migrate from federation to cloud authentication](../hybrid/connect/migrate-from-federation-to-cloud-authentication.md).

### Guided walkthrough

For a guided walkthrough of many of the recommendations in this article, see the migration guide [Migrate from AD FS to Microsoft Entra ID for identity management](https://go.microsoft.com/fwlink/?linkid=2225005) when signed in to the Microsoft 365 Admin Center.  To review best practices without signing in and activating automated setup features, go to the [M365 Setup portal](https://go.microsoft.com/fwlink/?linkid=2229256).

## Next steps

- [Review the Microsoft Entra recommendations overview](overview-recommendations.md)
- [Learn how to use Microsoft Entra recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)
