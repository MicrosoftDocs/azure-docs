---
title: Azure Active Directory recommendation - Migrate from ADAL to MSAL | Microsoft Docs
description: Learn why you should migrate from the Azure Active Directory Library to the Microsoft Authentication Libraries.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 03/15/2023
ms.author: sarahlipsey
ms.reviewer: jamesmantu

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Migrate from the Azure Active Directory Library to the Microsoft Authentication Libraries

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to migrate from the Azure Active Directory Library to the Microsoft Authentication Libraries. This recommendation is called `???` in the recommendations API in Microsoft Graph. 

## Description

The Azure Active Directory Authentication Library (ADAL) is [currently slated for end-of-support](../fundamentals/whats-new.md#adal-end-of-support-announcement) on June 30th, 2023. We recommend that customers migrate to Microsoft Authentication Libraries (MSAL), which replaces ADAL. 

This recommendation shows up if your tenant has applications that still use ADAL.

## Value 

MSAL is designed to enable a secure solution without developers having to worry about the implementation details. MSAL simplifies and manages acquiring, managing, caching, and refreshing tokens, and uses best practices for resilience. For more information on migrating to MSAL, see [Migrate applications to MSAL](../develop/msal-migration.md).

Existing apps that use ADAL will continue to work after the end-of-support date.

## Action plan

The first step to migrating your apps from ADAL to MSAL is to identify all applications in your tenant that are currently using ADAL. You can run the following set of commands in Windows PowerShell or [view the Sign-ins Workbook in Azure AD](../develop/howto-get-list-of-all-active-directory-auth-library-apps.md).

1. Open Windows Powershell as an administrator.
1. Connect to Microsoft Graph:
    - `Connect-MgGraph-Tenant <YOUR_TENANT_ID>`
1. Select your profile:
    - `Select-MgProfile beta`
1. Get a list of your recommendations:
    - `Get-MgDirectoryRecommendation | Format-List`

The steps to migrate from ADAL to MSAL vary depending on the type of application. For example, the steps for .NET and Python applications have separate instructions. For a full list of instructions for each scenario, see [How to migrate to MSAL](../develop/msal-migration.md#how-to-migrate-to-msal)


## Next steps

- [Review the Azure AD recommendations overview](overview-recommendations.md)
- [Learn how to use Azure AD recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)