---

title: Get started with the Azure AD reporting API | Microsoft Docs
description: How to get started with the Azure Active Directory reporting API
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: 8813b911-a4ec-4234-8474-2eef9afea11e
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 01/21/2021
ms.author: markvi
ms.reviewer: dhanyahk

ms.collection: M365-identity-device-management
---
# Get started with the Azure Active Directory reporting API

Azure Active Directory provides you with a variety of [reports](overview-reports.md), containing useful information for applications such as SIEM systems, audit, and business intelligence tools. 

By using the Microsoft Graph API for Azure AD reports, you can gain programmatic access to the data through a set of REST-based APIs. You can call these APIs from a variety of programming languages and tools.

This article provides you with an overview of the reporting API, including ways to access it.

If you run into issues, see [how to get support for Azure Active Directory](../fundamentals/active-directory-troubleshooting-support-howto.md).

## Prerequisites

To access the reporting API, with or without user intervention, you need to:

1. Assign roles (Security Reader, Security Admin, Global Admin)
2. Register an application
3. Grant permissions
4. Gather configuration settings

For detailed instructions, see the [prerequisites to access the Azure Active Directory reporting API](howto-configure-prerequisites-for-reporting-api.md). 

## API Endpoints 

The Microsoft Graph API endpoint for audit logs is `https://graph.microsoft.com/v1.0/auditLogs/directoryAudits` and the Microsoft Graph API endpoint for sign-ins is `https://graph.microsoft.com/v1.0/auditLogs/signIns`. For more information, see the [audit API reference](/graph/api/resources/directoryaudit) and [sign-in API reference](/graph/api/resources/signIn).

You can use the [Identity Protection risk detections API](/graph/api/resources/identityriskevent?view=graph-rest-beta&preserve-view=true) to gain programmatic access to security detections using Microsoft Graph. For more information, see [Get started with Azure Active Directory Identity Protection and Microsoft Graph](../identity-protection/howto-identity-protection-graph-api.md). 
  
You can also use the [provisioning logs API](/graph/api/resources/provisioningobjectsummary?view=graph-rest-beta&preserve-view=true) to get programmatic access to provisioning events in your tenant. 

## APIs with Microsoft Graph Explorer

You can use the [Microsoft Graph explorer](https://developer.microsoft.com/graph/graph-explorer) to verify your sign-in and audit API data. Make sure to sign in to your account using both of the sign-in buttons in the Graph Explorer UI, and set **AuditLog.Read.All** and **Directory.Read.All** permissions for your tenant as shown.   

![Graph Explorer](./media/concept-reporting-api/graph-explorer.png)

![Modify permissions UI](./media/concept-reporting-api/modify-permissions.png)

## Use certificates to access the Azure AD reporting API 

Use the Azure AD Reporting API with certificates if you plan to retrieve reporting data without user intervention.

For detailed instructions, see [Get data using the Azure AD Reporting API with certificates](tutorial-access-api-with-certificates.md).

## Next steps

 * [Prerequisites to access reporting API](howto-configure-prerequisites-for-reporting-api.md) 
 * [Get data using the Azure AD Reporting API with certificates](tutorial-access-api-with-certificates.md)
 * [Troubleshoot errors in Azure AD reporting API](troubleshoot-graph-api.md)