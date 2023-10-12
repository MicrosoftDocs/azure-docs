---
title: View activity logs for Microsoft Support access requests (preview)
description: How to view activity logs for Microsoft Support access requests.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.author: sarahlipsey
ms.reviewer: jeffsta
ms.service: active-directory
ms.topic: troubleshooting
ms.subservice: fundamentals
ms.workload: identity
ms.date: 09/12/2023
---
# View activity logs for Microsoft Support access requests (preview)

All activities related to Microsoft Support access requests are included in the Microsoft Entra audit logs. Activities can include requests from users in your tenant or an automated service. This article describes how to view the different types of activity logs.

## Prerequisites

To access the audit logs for a tenant, you must have one of the following roles: 

- Reports Reader
- Security Reader
- Security Administrator
- Global Administrator

## How to access the logs

You can access a filtered view of audit logs for your tenant from the Microsoft Support access requests area. Select **Audit logs** from the side menu to view the audit logs with the category pre-selected.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Service Support Administrator](../roles/permissions-reference.md#service-support-administrator).

1. Browse to **Learn & support** > **Diagnose and solve problems**.

1. Scroll to the bottom of the page and select **Manage pending requests** from the **Microsoft Support Access Requests** section.

1. Select **Audit logs** from the side menu.

You can also access these logs from the Microsoft Entra audit logs. Select **Core Directory** as the service and `MicrosoftSupportAccessManagement` as the category.

## Types of requests

There are some details associated with support access request audit logs that are helpful to understand. Knowing the difference between the types of request may help when exploring the logs.

Activity logs for Microsoft Support access requests fall into two categories: user-initiated activities, and automated activities.

### User-initiated activities

There are three user-initiated activities that you can see in your audit logs. These are actions requested by administrators of your tenant.

- Approval of a Microsoft Support access request
- Rejection of a Microsoft Support access request
- Manual removal of Microsoft Support access before your support request is closed

### Automated requests

There are three activities that can be associated with an automated or system-initiated Microsoft Support access request:

- Creation of a Microsoft Support access *request* in the support request tenant
- Creation of a Microsoft Support access *approval* in the resource tenant. This is done automatically after a Microsoft Support access request is approved by a user who is an administrator of both the support request tenant, and the resource tenant
- Removal of Microsoft Support access upon closure of your support request

## Next steps

- [Manage Microsoft Support access requests](how-to-manage-support-access-requests.md)
- [Learn about audit logs](../../active-directory/reports-monitoring/concept-audit-logs.md)
