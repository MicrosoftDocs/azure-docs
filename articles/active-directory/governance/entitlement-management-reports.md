---
title: View reports & logs in entitlement management - Azure AD
description: Learn how to view the user assignments report and audit logs in Azure Active Directory entitlement management.
services: active-directory
documentationCenter: ''
author: barclayn
manager: daveba
editor: jocastel-MSFT
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 03/22/2020
ms.author: barclayn
ms.reviewer: jocastel
ms.collection: M365-identity-device-management


#Customer intent: As an administrator, I want view resources a user has access to and view request logs for auditing purposes.

---

# View reports and logs in Azure AD entitlement management

The Azure AD entitlement management reports and Azure AD audit log provide additional details about what resources users have access to. As an administrator, you can view the access packages and resource assignments for a user and view request logs for auditing purposes or to determine the status of a user's request. This article describes how to use the entitlement management reports and Azure AD audit logs.

Watch the following video to learn how to view what resources users have access to in entitlement management:

>[!VIDEO https://www.youtube.com/embed/omtNJ7ySjS0]

## View access packages for a user

This report enables you to list all of the access packages a user can request and the access packages that are currently assigned to the user.

**Prerequisite role:** Global administrator or User administrator

1. Click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Reports**.

1. Click **Access packages for a user**.

1. Click **Select users** to open the Select users pane.

1. Find the user in the list and then click **Select**.

    The **Can request** tab displays a list of the access packages the user can request. This list is determined by the [request policies](entitlement-management-access-package-request-policy.md#for-users-in-your-directory) defined for the access packages. 

    ![Access packages for a user](./media/entitlement-management-reports/access-packages-report.png)

1. If there are more than one resource roles or policies for an access package, click the resource roles or policies entry to see selection details.

1. Click the **Assigned** tab to see a list of the access packages currently assigned to the user. When an access package is assigned to a user, it means that the user has access to all of the resource roles in the access package.

## View resource assignments for a user

This report enables you to list the resources currently assigned to a user in entitlement management. Note that this report is for resources managed with entitlement management. The user might have access to other resources in your directory outside of entitlement management.

**Prerequisite role:** Global administrator or User administrator

1. Click **Azure Active Directory** and then click **Identity Governance**.

1. In the left menu, click **Reports**.

1. Click **Resource assignments for a user**.

1. Click **Select users** to open the Select users pane.

1. Find the user in the list and then click **Select**.

    A list of the resources currently assigned to the user is displayed. The list also shows the access package and policy they got the resource role from, along with start and end date for access.
    
    If a user got access to the same resource in two or more packages, you can click an arrow to see each package and policy.

    ![Resource assignments for a user](./media/entitlement-management-reports/resource-assignments-report.png)

## Determine the status of a user's request

To get additional details on how a user requested and received access to an access package, you can use the Azure AD audit log. In particular, you can use the log records in the `EntitlementManagement` and `UserManagement` categories to get additional details on the processing steps for each request.  

1. Click **Azure Active Directory** and then click **Audit logs**.

1. At the top, change the **Category** to either `EntitlementManagement` or `UserManagement`, depending on the audit record you're looking for.  

1. Click **Apply**.

1. To download the logs, click **Download**.

When Azure AD receives a new request, it writes an audit record, in which the **Category** is `EntitlementManagement` and the **Activity** is typically `User requests access package assignment`.  In the case of a direct assignment created in the Azure portal, the **Activity** field of the audit record is `Administrator directly assigns user to access package`, and the user performing the assignment is identified by the **ActorUserPrincipalName**.

Azure AD will write additional audit records while the request is in progress, including:

| Category | Activity | Request status |
| :---- | :------------ | :------------ |
| `EntitlementManagement` | `Auto approve access package assignment request` | Request does not require approval |
| `UserManagement` | `Create request approval` | Request requires approval |
| `UserManagement` | `Add approver to request approval` | Request requires approval |
| `EntitlementManagement` | `Approve access package assignment request` | Request approved |
| `EntitlementManagement` | `Ready to fulfill access package assignment request` |Request approved, or does not require approval |

When a user is assigned access, Azure AD writes an audit record for the `EntitlementManagement` category with **Activity** `Fulfill access package assignment`.  The user who received the access is identified by **ActorUserPrincipalName** field.

If access was not assigned, then Azure AD writes an audit record for the `EntitlementManagement` category with **Activity** either `Deny access package assignment request`, if the request was denied by an approver, or `Access package assignment request timed out (no approver action taken)`, if the request timed out before an approver could approve.

When the user's access package assignment expires, is canceled by the user, or removed by an administrator, then Azure AD writes an audit record for the `EntitlementManagement` category with **Activity** of `Remove access package assignment`.

## Next steps

- [Archive reports and Logs](entitlement-management-logs-and-reporting.md)
- [Troubleshoot Azure AD entitlement management](entitlement-management-troubleshoot.md)
- [Common scenarios](entitlement-management-scenarios.md)
