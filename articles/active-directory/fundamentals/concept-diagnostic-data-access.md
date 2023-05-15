---
title: Diagnostic data that Azure identity support can access - Azure Active Directory | Microsoft Docs
description: Learn about what diagnostic information Azure identity support can access
services: active-directory
author: shlipsey3
manager: amycolannino
ms.author: sarahlipsey
ms.reviewer: jeffsta
ms.service: active-directory
ms.topic: troubleshooting
ms.subservice: fundamentals
ms.workload: identity
ms.date: 05/14/2023
ms.collection: M365-identity-device-management

---
# Microsoft Support and identity diagnostic data

When you submit a support request to Microsoft, Microsoft Support may need access to your [identity diagnostic data](/troubleshoot/azure/active-directory/support-data-collection-diagnostic-logs) in Azure Active Directory (Azure AD) in order to help you solve your problem. Microsoft Support's access to your diagnostic data is read-only, and lasts only as long as we are actively working with you to solve your problem.

Microsoft Support accesses your identity diagnostic data only with your approval. For many support requests created in the Azure Portal, you can manage Microsoft Support's access to your identity diagnostic data by setting the "Allow collection of advanced diagnostic information" property in the Azure Portal's support request management experience.

## Microsoft Support Access Requests

Microsoft Support Access Requests (preview) enable you to manage Microsoft Support's access to your identity diagnostic data for support requests where you cannot manage that access in the Azure Portal's support request management experience. The following scenarios can trigger a Microsoft Support Access Request:

- You created a support request in a tenant other than the tenant in which your problem needs to be diagnosed. For example, you submitted your support request in your production tenant, but the problem needs to be diagnosed in your test tenant.
- You submitted your support request in a portal other than the Azure portal or the Microsoft 365 Admin Center.

## Support access role permissions

To manage Microsoft Support Access Requests, you must be assigned to an Azure AD role that has full permission to manage Azure support tickets for the tenant. This role permission is included in Azure AD built-in roles with the action `microsoft.azure.supportTickets/allEntities/allTasks`. You can see which Azure AD roles have this permission in the [Azure AD built-in roles](../roles/permissions-reference.md) article.

## Next steps

- [Manage Microsoft Support Access Requests](how-to-manage-support-access-requests.md)

- [Learn about how Microsoft uses data for Azure support](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/)

- [Learn about advanced diagnostic information logs](../../azure-portal/supportability/how-to-create-azure-support-request.md#advanced-diagnostic-information-logs)
