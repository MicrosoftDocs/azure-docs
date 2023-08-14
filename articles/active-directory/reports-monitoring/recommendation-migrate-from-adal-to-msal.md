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
ms.date: 08/10/2023
ms.author: sarahlipsey
ms.reviewer: jamesmantu

ms.collection: M365-identity-device-management
---

# Azure AD recommendation: Migrate from the Azure Active Directory Library to the Microsoft Authentication Libraries

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to migrate from the Azure Active Directory Library to the Microsoft Authentication Libraries. This recommendation is called `AdalToMsalMigration` in the recommendations API in Microsoft Graph. 

## Description

The Azure Active Directory Authentication Library (ADAL) is currently slated for end-of-support on June 30, 2023. We recommend that customers migrate to Microsoft Authentication Libraries (MSAL), which replaces ADAL. 

This recommendation shows up if your tenant has applications that still use ADAL. The service marks any application in your tenant that makes a token request from the ADAL as an ADAL application. Applications that use both ADAL and MSAL are marked as ADAL applications.

When an application is identified as an ADAL application, each day the recommendation looks back 30 days for any new ADAL requests from applications within the tenant. If an ADAL recommendation doesn't send any new ADAL requests for 30 days, the recommendation is marked as completed. When all applications are completed, the recommendation status changes to completed. If a new ADAL request is detected for an application that was completed, the status changes back to active.

## Value 

MSAL is designed to enable a secure solution without developers having to worry about the implementation details. MSAL simplifies how tokens are acquired, managed, cached, and refreshed. MSAL also uses best practices for resilience. For more information on migrating to MSAL, see [Migrate applications to MSAL](../develop/msal-migration.md).

Existing apps that use ADAL will continue to work after the end-of-support date.

## Action plan

The first step to migrating your apps from ADAL to MSAL is to identify all applications in your tenant that are currently using ADAL. You can identify your apps in the Azure portal or programmatically with the Microsoft Graph API or the Microsoft Graph PowerShell SDK.

### [Azure portal](#tab/Azure-portal)

There are four steps to identifying and updating your apps in the Azure portal. The following steps are covered in detail in the [List all apps using ADAL](../develop/howto-get-list-of-all-active-directory-auth-library-apps.md) article. 

1. Send Azure AD sign-in event to Azure Monitor.
1. [Access the sign-ins workbook in Azure AD.](../develop/howto-get-list-of-all-active-directory-auth-library-apps.md)
1. Identify the apps that use ADAL.
1. Update your code.
    - The steps to update your code vary depending on the type of application.
    - For example, the steps for .NET and Python applications have separate instructions.
    - For a full list of instructions for each scenario, see [How to migrate to MSAL](../develop/msal-migration.md#how-to-migrate-to-msal).

### [Microsoft Graph API](#tab/Microsoft-Graph-API)

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

### [Microsoft Graph PowerShell SDK](#tab/Microsoft-Graph-PowerShell-SDK)

You can run the following set of commands in Windows PowerShell. These commands use the [Microsoft Graph PowerShell SDK](/graph/powershell/installation) to get a list of all applications in your tenant that use ADAL.

1. Open Windows PowerShell as an administrator.

1. Connect to Microsoft Graph:
    - `Connect-MgGraph-Tenant <YOUR_TENANT_ID>`

1. Select your profile:
    - `Select-MgProfile beta`

1. Get a list of your recommendations:
    - `Get-MgDirectoryRecommendation | Format-List`

1. Update the code for your apps using the instructions in [How to migrate to MSAL](../develop/msal-migration.md#how-to-migrate-to-msal).

---

## Frequently asked questions

### Why does it take 30 days to change the status to completed?

To reduce false positives, the service uses a 30 day window for ADAL requests. This way, the service can go several days without an ADAL request and not be falsely marked as completed. 

### How were ADAL applications identified before the recommendation was released?

The [Azure AD sign-ins workbook](../develop/howto-get-list-of-all-auth-library-apps.md) is an alternative method to identify these apps. The workbook is still available to you, but using the workbook requires streaming sign-in logs to Azure Monitor first. The ADAL to MSAL recommendation works out of the box. Plus, the sign-ins workbook does not capture Service Principal sign-ins, while the recommendation does.

### Why is the number of ADAL applications different in the workbook and the recommendation?

Because the recommendation captures Service Principal sign-ins and the workbook doesn't, the recommendation may show more ADAL applications.

### How do I identify the owner of an application in my tenant?

You can locate owner from the recommendation details. Select the resource, which takes you to the application details. Select **Owners** from the navigation menu.

### Can the status change from *completed* to *active*?

Yes. If an application was marked as completed - so no ADAL requests were made during the 30 day window - that application would be marked as complete. If the service detects a new ADAL request, the status changes back to *active*.

## Next steps

- [Review the Azure AD recommendations overview](overview-recommendations.md)
- [Learn how to use Azure AD recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)