---
title: "How to: Identify apps running on ADAL and migrate them to MSAL | Azure"
titleSuffix: Microsoft identity platform
description: In this how-to guide, you get to identify apps that are running on ADAL to aid in migrating them to MSAL.
services: active-directory
author: SHERMANOUKO
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to 
ms.workload: identity
ms.date: 05/12/2021
ms.author: shermanouko
ms.custom: aaddev
ms.reviewer: aiwang, marsma
# Customer intent: As an application developer / IT admin, I need to know / identify which of my apps are running on ADAL so that I can migrate them to MSAL.
---

# How to: Identify apps running on ADAL and migrate them to MSAL

Azure Active Directory self-service portal provides a workbook to identify apps using ADAL for their authentication. This article provides guidance on determining apps that run on ADAL using the self-service portal. Support for ADAL is ending on June 30 2022. Apps using ADAL on existing OS versions will continue to work, but technical support or security updates will be unavailable after June 30 2022.

## Prerequisites

The following article is recommended before going through this article:

- [MSAL overview](./msal-overview.md)

## Identify apps using ADAL in your tenant

Migrating your app from ADAL to MSAL requires you to identify apps that use ADAL for authentication.  The Sign-ins workbook now has a new table. This table contains a list of applications that use ADAL and how often these applications are used. The information in this workbook is available in [sign in logs](../reports-monitoring/reference-azure-monitor-sign-ins-log-schema.md), but the workbook helps you collect and visualize the information in one view.  

## Accessing the workbook

If your organization is new to Azure Monitor workbooks, [integrate your Azure AD sign-in and audit logs with Azure Monitor](../reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) before accessing the workbook. This integration allows you to store, and query, and visualize your logs using workbooks for up to two years. Only sign-in and audit events created after Azure Monitor integration will be stored. Insights before the date of the Azure Monitor integration won't be available. You can use the workbook to assess past insights if your Azure AD sign-in and audit logs is already integrated with Azure Monitor.

To access the workbook: 

1. Sign into the Azure portal 
2. Navigate to **Azure Active Directory** > **Monitoring** > **Workbooks** 
3. In the Usage section, open the **Sign-ins** workbook 

![Screenshot of the Azure Active Directory monitoring workbooks interface highlighting the Sign Ins workbook.](./media/howto-identify-apps-running-on-adal/sign-in-workbook.png)

The Sign-ins workbook has a new table at the bottom of the page that can show you which recently used apps are using ADAL as shown below. Update these apps to use MSAL.

![Screenshot of the Azure Active Directory monitoring Sign Ins workbook displaying Sign ins from apps that use ADAL.](./media/howto-identify-apps-running-on-adal/present-adal-apps.png)

If there are no apps running on ADAL, the workbook will display a view as shown below. 

![Screenshot of the Azure Active Directory monitoring Sign Ins workbook displaying workbook interface when no app is using ADAL.](./media/howto-identify-apps-running-on-adal/no-adal-apps.png)

## Next steps

After identifying your apps, we recommend you [start migrating all ADAL apps to MSAL](msal-migration.md).
