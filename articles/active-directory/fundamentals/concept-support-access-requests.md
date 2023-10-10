---
title: Support access requests in Microsoft Entra ID
description: Learn how Microsoft Support engineers can access identity diagnostic information in Microsoft Entra ID.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.author: sarahlipsey
ms.reviewer: jeffsta
ms.service: active-directory
ms.topic: troubleshooting
ms.subservice: fundamentals
ms.workload: identity
ms.date: 07/31/2023
ms.collection: M365-identity-device-management

---
# About Microsoft Support access requests (preview)

Microsoft Support requests are automatically assigned to a support engineer with expertise in solving similar problems. To expedite solution delivery, our support engineers use diagnostic tooling to read [identity diagnostic data](/troubleshoot/azure/active-directory/support-data-collection-diagnostic-logs) for your tenant.

Microsoft Support's access to your identity diagnostic data is granted only with your approval, is read-only, and lasts only as long as we are actively working with you to solve your problem.

For many support requests created in the Microsoft Entra admin center, you can manage the access to your identity diagnostic data by enabling the "Allow collection of advanced diagnostic information" property. If this setting is set to "no" our support engineers must ask *you* to collect the data needed to solve your problem, which could slow down your problem resolution. 

## Microsoft Support access requests

Sometimes support engineers need additional approval from you to access identity diagnostic data to solve your problem. For example, if a support engineer needs to access identity diagnostic data in a different Microsoft Entra tenant than the one in which you created the support request, the engineer must ask you to grant them access to that data.

Microsoft Support access requests (preview) enable you to manage Microsoft Support's access to your identity diagnostic data for support requests where you cannot manage that access in the Microsoft Entra admin center's support request management experience.

## Support access role permissions

To manage Microsoft Support access requests, you must be assigned to a role that has full permission to manage Microsoft Entra ID support tickets for the tenant. This role permission is included in Microsoft Entra built-in roles with the action `microsoft.azure.supportTickets/allEntities/allTasks`. You can see which Microsoft Entra roles have this permission in the [Microsoft Entra built-in roles](../roles/permissions-reference.md) article.


## Next steps

- [Approve Microsoft Support access requests](how-to-approve-support-access-requests.md)
- [Manage Microsoft Support access requests](how-to-manage-support-access-requests.md)
- [View Microsoft Support access request logs](how-to-view-support-access-request-logs.md)
- [Learn how Microsoft uses data for Azure support](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/)
