---
title: View activity logs for Microsoft Support access requests (preview)
description: How to view activity logs for Microsoft Support access requests
services: active-directory
author: shlipsey3
manager: amycolannino
ms.author: sarahlipsey
ms.reviewer: jeffsta
ms.service: active-directory
ms.topic: troubleshooting
ms.subservice: fundamentals
ms.workload: identity
ms.date: 07/25/2023
ms.collection: M365-identity-device-management

---
# View activity logs for Microsoft Support access requests (preview)

All activities related to Microsoft Support access requests are included in the Microsoft Entra ID audit logs. Activities can include requests from users in your tenant or an automated service. This article describes how to view the different types of activity logs.

## Prerequisites

To access the audit logs for a tenant, you must have one of the following roles: 

- Reports Reader
- Security Reader
- Security Administrator
- Global Administrator

Only certain Azure Active Directory (Azure AD) roles are authorized to manage Microsoft Support access requests. To manage Microsoft Support access requests, a role must have the permission `microsoft.azure.supportTickets/allEntities/allTasks`. To see which Azure AD roles have this permission, search the [Azure AD built-in roles](../roles/permissions-reference.md) for the required permission.

## How to access the logs

You can access a filtered view of audit logs for your tenant from the Microsoft Support access requests area. Select **Audit logs** from the side menu to view the logs with the category pre-selected.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/) and navigate to **Diagnose and solve problems**.

1. Scroll to the bottom of the page and select **Manage pending requests** from the **Microsoft Support Access Requests** section.

1. Select **Audit logs** from the side menu.

You can also access these logs from the Microsoft Entra ID Audit logs. Select **Core Directory** as the service and `MicrosoftSupportAccessManagement` as the category.

## Types of requests
Activity logs for Microsoft Support access requests fall into three categories: user-initiated requests, automated requests, and cross-tenant support requests.

### User-initiated requests

There are three activities that can be associated with a user-initiated Microsoft Support access request:

- Approval
- Rejection
- Manual removal of Microsoft Support access before your support request is closed

### Automated requests

There are three activities that can be associated with an automated or system-initiated Microsoft Support access request:

- Creation of a support access *request*
- Creation of a support access *approval*
- Removal of Microsoft Support access upon closure of your support request

### Cross-tenant requests

There are three activities that can be associated with cross-tenant Microsoft Support access request:

**Support request tenant**:
- Creation
- Approval
- Rejection

**Resource tenant**:
- Creation of a support access approval
- Manual removal of Microsoft Support access before your support request is closed
- Removal of Microsoft Support access upon closure of your support request

## Next steps

- [Manage Microsoft Support access requests](how-to-manage-support-access-requests.md)
- [Learn about audit logs](../../active-directory/reports-monitoring/concept-audit-logs.md)