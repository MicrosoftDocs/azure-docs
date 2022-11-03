---

title: Get started with the Azure AD reporting API | Microsoft Docs
description: How to get started with the Azure Active Directory reporting API
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 11/03/2022
ms.author: sarahlipsey
ms.reviewer: dhanyahk
ms.collection: M365-identity-device-management
---
# Get started with the Azure Active Directory reporting API

Azure Active Directory provides you with several [reports](overview-reports.md), containing useful information such as security information and event management (SIEM) systems, audit, and business intelligence tools. By using the Microsoft Graph API for Azure AD reports, you can gain programmatic access to the data through a set of REST-based APIs. You can call these APIs from various programming languages and tools.

This article provides you with an overview of the reporting API, including ways to access it. If you run into issues, see [how to get support for Azure Active Directory](../fundamentals/active-directory-troubleshooting-support-howto.md).

## Prerequisites

To access the reporting API, with or without user intervention, you need to:

1. Confirm your roles and licenses
1. Register an application
1. Grant permissions
1. Gather configuration settings

For detailed instructions, see the [prerequisites to access the Azure Active Directory reporting API](howto-configure-prerequisites-for-reporting-api.md). 

## API Endpoints 

Microsoft Graph API endpoints:
- **Audit logs:** `https://graph.microsoft.com/v1.0/auditLogs/directoryAudits`
- **Sign-in logs:** `https://graph.microsoft.com/v1.0/auditLogs/signIns`

Programmatic access APIs:
- **Security detections:** [Identity Protection risk detections API](/graph/api/resources/identityprotection-root)
- **Tenant provisioning events:** [Provisioning logs API](/graph/api/resources/provisioningobjectsummary)

Check out the following helpful resources for Microsoft Graph API:
- [Audit log API reference](/graph/api/resources/directoryaudit)
- [Sign-in log API reference](/graph/api/resources/signIn)
- [Get started with Azure Active Directory Identity Protection and Microsoft Graph](../identity-protection/howto-identity-protection-graph-api.md)

  
## APIs with Microsoft Graph Explorer

You can use the [Microsoft Graph explorer](https://developer.microsoft.com/graph/graph-explorer) to verify your sign-in and audit API data. Sign in to your account using both of the sign-in buttons in the Graph Explorer UI, and set **AuditLog.Read.All** and **Directory.Read.All** permissions for your tenant as shown.   

![Graph Explorer](./media/concept-reporting-api/graph-explorer.png)

![Modify permissions UI](./media/concept-reporting-api/modify-permissions.png)

## Use certificates to access the Azure AD reporting API 

Use the Azure AD Reporting API with certificates if you plan to retrieve reporting data without user intervention.

For detailed instructions, see [Get data using the Azure AD Reporting API with certificates](tutorial-access-api-with-certificates.md).

## Next steps

 * [Prerequisites to access reporting API](howto-configure-prerequisites-for-reporting-api.md) 
 * [Get data using the Azure AD Reporting API with certificates](tutorial-access-api-with-certificates.md)
 * [Troubleshoot errors in Azure AD reporting API](troubleshoot-graph-api.md)
