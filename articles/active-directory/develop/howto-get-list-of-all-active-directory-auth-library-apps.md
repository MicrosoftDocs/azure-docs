---
title: "How to: Get a complete list of all apps using Active Directory Authentication Library (ADAL) in your tenant | Azure"
titleSuffix: Microsoft identity platform
description: In this how-to guide, you get a complete list of all apps that are using ADAL in your tenant.
services: active-directory
author: SHERMANOUKO
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to 
ms.workload: identity
ms.date: 05/27/2021
ms.author: shermanouko
ms.custom: aaddev
ms.reviewer: aiwang, marsma
# Customer intent: As an application developer / IT admin, I need to know / identify which of my apps are using ADAL.
---

# How to: Get a complete list of apps using ADAL in your tenant

Support for Active Directory Authentication Library (ADAL) will end on June 30, 2022. Apps using ADAL on existing OS versions will continue to work, but technical support and security updates will end. Without continued security updates, apps using ADAL will become increasingly vulnerable to the latest security attack patterns. This article provides guidance on how to use Azure Monitor workbooks to obtain a list of all apps that use ADAL in your tenant.

## Sign-ins workbook

Workbooks are a set of queries that collect and visualize information that is available in Azure AD logs. [Learn more about the sign-in logs schema here](../reports-monitoring/reference-azure-monitor-sign-ins-log-schema.md). The Sign-ins workbook in the Azure AD admin portal now has a new table to assist you in determining which applications use ADAL and how often they are used. First, we’ll detail how to access the workbook before showing the visualization for the list of applications.

### Access the workbook

If your organization is new to Azure Monitoring workbooks, [integrate your Azure AD sign-in and audit logs with Azure Monitor](../reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) before accessing the workbook. This integration allows you to store, query, and visualize your logs using workbooks for up to two years. Only sign-in and audit events created after Azure Monitor integration will be stored. Insights before the date of the Azure Monitor integration won't be available. You can use the workbook to assess past insights if your Azure AD sign-in and audit logs is already integrated with Azure Monitor.

To access the workbook: 

1. Sign into the Azure portal 
2. Navigate to **Azure Active Directory** > **Monitoring** > **Workbooks** 
3. In the Usage section, open the **Sign-ins** workbook 

   :::image type="content" source="media/howto-get-list-of-all-active-directory-auth-library-apps/sign-in-workbook.png" alt-text="Screenshot of the Azure Active Directory portal workbooks interface highlighting the sign-ins workbook.":::

### Identify apps using ADAL for authentication

The Sign-ins workbook has a new table at the bottom of the page that can show you which recently used apps are using ADAL as shown below. You can also export a list of the apps. Update these apps to use MSAL.

:::image type="content" source="media/howto-get-list-of-all-active-directory-auth-library-apps/active-directory-auth-library-apps-present.png" alt-text="Screenshot of sign-ins workbook displaying apps that use Active Directory Authentication Library.":::

If there are no apps using ADAL, the workbook will display a view as shown below. 

:::image type="content" source="media/howto-get-list-of-all-active-directory-auth-library-apps/no-active-directory-auth-library-apps.png" alt-text="Screenshot of sign-ins workbook when no app is using Active Directory Authentication Library.":::

## Next steps

After identifying your apps, we recommend you [start migrating all ADAL apps to MSAL](msal-migration.md).
