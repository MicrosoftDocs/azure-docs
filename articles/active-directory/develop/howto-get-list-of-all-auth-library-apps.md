---
title: "How to: Get a complete list of all apps using Active Directory Authentication Library (ADAL) in your tenant"
description: In this how-to guide, you get a complete list of all apps that are using ADAL in your tenant.
services: active-directory
author: SHERMANOUKO
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to 
ms.workload: identity
ms.date: 03/03/2022
ms.author: shermanouko
ms.custom: aaddev, has-adal-ref
ms.reviewer: aiwang, dmwendia
# Customer intent: As an application developer / IT admin, I need to know / identify which of my apps are using ADAL.
---

# Get a complete list of apps using ADAL in your tenant

Azure Active Directory Authentication Library (ADAL) has been deprecated. While existing apps that use ADAL continue to work, Microsoft will no longer release security fixes on ADAL. Use the [Microsoft Authentication Library (MSAL)](/entra/msal/) to avoid putting your app's security at risk. If you have existing applications that use ADAL, be sure to [migrate them to MSAL](../develop/msal-migration.md). This article provides guidance on how to use Azure Monitor workbooks to obtain a list of all apps that use ADAL in your tenant.

## Sign-ins workbook

Workbooks are a set of queries that collect and visualize information that is available in Microsoft Entra logs. [Learn more about the sign-in logs schema here](../reports-monitoring/reference-azure-monitor-sign-ins-log-schema.md). The Sign-ins workbook in the Azure portal now has a table to assist you in determining which applications use ADAL and how often they are used. First, we’ll detail how to access the workbook before showing the visualization for the list of applications.

<a name='step-1-send-azure-ad-sign-in-events-to-azure-monitor'></a>

## Step 1: Send Microsoft Entra sign-in events to Azure Monitor

Microsoft Entra ID doesn't send sign-in events to Azure Monitor by default, which the Sign-ins workbook in Azure Monitor requires.

Configure AD to send sign-in events to Azure Monitor by following the steps in [Integrate your Microsoft Entra sign-in and audit logs with Azure Monitor](../reports-monitoring/howto-integrate-activity-logs-with-azure-monitor-logs.md). In the **Diagnostic settings** configuration step, select the **SignInLogs** check box.

No sign-in event that occurred *before* you configure Microsoft Entra ID to send the events to Azure Monitor will appear in the Sign-ins workbook.

## Step 2: Access sign-ins workbook in Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Once you've integrated your Microsoft Entra sign-in and audit logs with Azure Monitor as specified in the Azure Monitor integration, access the sign-ins workbook:

   1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Reports Reader](../roles/permissions-reference.md#reports-reader).
   1. Browse to **Identity** > **Monitoring & health** > **Workbooks**.
   1. In the **Usage** section, open the **Sign-ins** workbook.

   :::image type="content" source="media/howto-get-list-of-all-auth-library-apps/sign-in-workbook.png" alt-text="Screenshot of the Azure portal workbooks interface highlighting the sign-ins workbook.":::

## Step 3: Identify apps that use ADAL

The table at the bottom of the Sign-ins workbook page lists apps that recently used ADAL. You can also export a list of the apps. Update these apps to use MSAL.
    
:::image type="content" source="media/howto-get-list-of-all-auth-library-apps/auth-library-apps-present.png" alt-text="Screenshot of sign-ins workbook displaying apps that use Active Directory Authentication Library.":::
    
If there are no apps using ADAL, the workbook will display a view as shown below. 
    
:::image type="content" source="media/howto-get-list-of-all-auth-library-apps/no-auth-library-apps.png" alt-text="Screenshot of sign-ins workbook when no app is using Active Directory Authentication Library.":::

## Step 4: Update your code

After identifying your apps that use ADAL, migrate them to MSAL depending on your application type as illustrated below.

[!INCLUDE [application type](includes/adal-msal-migration.md)]

## Next steps

For more information about MSAL, including usage information and which libraries are available for different programming languages and application types, see:

- [Acquire and cache tokens using MSAL](msal-acquire-cache-tokens.md)
- [Application configuration options](msal-client-application-configuration.md)
- [List of MSAL authentication libraries](reference-v2-libraries.md)
