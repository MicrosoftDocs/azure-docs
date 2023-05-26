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
ms.date: 05/26/2023
ms.author: sarahlipsey
ms.reviewer: jamesmantu

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Migrate from the Azure Active Directory Library to the Microsoft Authentication Libraries

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to migrate from the Azure Active Directory Library to the Microsoft Authentication Libraries. This recommendation is called `AdalToMsalMigration` in the recommendations API in Microsoft Graph. 

## Description

The Azure Active Directory Authentication Library (ADAL) is [currently slated for end-of-support](../fundamentals/whats-new.md#adal-end-of-support-announcement) on June 30, 2023. We recommend that customers migrate to Microsoft Authentication Libraries (MSAL), which replaces ADAL. 

This recommendation shows up if your tenant has applications that still use ADAL.

## Value 

MSAL is designed to enable a secure solution without developers having to worry about the implementation details. MSAL simplifies how tokens are acquired, managed, cached, and refreshed. MSAL also uses best practices for resilience. For more information on migrating to MSAL, see [Migrate applications to MSAL](../develop/msal-migration.md).

Existing apps that use ADAL will continue to work after the end-of-support date.

## Action plan

The first step to migrating your apps from ADAL to MSAL is to identify all applications in your tenant that are currently using ADAL. You can identify your apps in the Azure portal or programmatically.

### Identify your apps in the Azure portal

There are four steps to identifying and updating your apps in the Azure portal. The following steps are covered in detail in the [List all apps using ADAL](../develop/howto-get-list-of-all-active-directory-auth-library-apps.md) article. 

1. Send Azure AD sign-in event to Azure Monitor.
1. [Access the sign-ins workbook in Azure AD.](../develop/howto-get-list-of-all-active-directory-auth-library-apps.md)
1. Identify the apps that use ADAL.
1. Update your code.
    - The steps to update your code vary depending on the type of application.
    - For example, the steps for .NET and Python applications have separate instructions.
    - For a full list of instructions for each scenario, see [How to migrate to MSAL](../develop/msal-migration.md#how-to-migrate-to-msal).

### Identify your apps with the Microsoft Graph API

You can use Microsoft Graph to identify apps that need to be migrated to MSAL. To get started, see [How to use Microsoft Graph with Azure AD recommendations](howto-use-recommendations.md#how-to-use-microsoft-graph-with-azure-active-directory-recommendations).

Run the following query in Microsoft Graph, replacing the `<TENANT_ID>` placeholder with your tenant ID. This query returns a list of the impacted resources in your tenant.

```http
https://graph.microsoft.com/beta/directory/recommendations/<TENANT_ID>_Microsoft.Identity.IAM.Insights.AdalToMsalMigration/impactedResources
```

The following response provides the details of the impacted resources using ADAL:

```json
{
    "id": "<APPLICATION_ID>",
    "subjectId": "<APPLICATION_ID>",
    "recommendationId": "TENANT_ID_Microsoft.Identity.IAM.Insights.AdalToMsalMigration",
    "resourceType": "app",
    "addedDateTime": "2023-03-29T09:29:01.1708723Z",
    "postponeUntilDateTime": null,
    "lastModifiedDateTime": "0001-01-01T00:00:00Z",
    "lastModifiedBy": "System",
    "displayName": "sample-adal-app",
    "owner": null,
    "rank": 1,
    "portalUrl": "
df.onecloud.azure-test.net/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Branding/appId/{0}"
    "apiUrl": null,
    "status": "completedBySystem",
    "additionalDetails": [
        {
            "key": "Library",
            "value": "ADAL.Net"
        }
    ]
}
```

### Identify your apps with Microsoft Graph PowerShell SDK

You can run the following set of commands in Windows PowerShell. These commands use the [Microsoft Graph PowerShell SDK](/graph/powershell/installation) to get a list of all applications in your tenant that use ADAL.

1. Open Windows PowerShell as an administrator.

1. Connect to Microsoft Graph:
    - `Connect-MgGraph-Tenant <YOUR_TENANT_ID>`

1. Select your profile:
    - `Select-MgProfile beta`

1. Get a list of your recommendations:
    - `Get-MgDirectoryRecommendation | Format-List`

1. Update the code for your apps using the instructions in [How to migrate to MSAL](../develop/msal-migration.md#how-to-migrate-to-msal).

## Next steps

- [Review the Azure AD recommendations overview](overview-recommendations.md)
- [Learn how to use Azure AD recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)