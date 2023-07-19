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
ms.date: 07/19/2023
ms.collection: M365-identity-device-management

---
# How Microsoft Support accesses identity diagnostic data

Microsoft Support requests are automatically assigned to a support engineer with expertise in solving similar problems. To expedite solution delivery, our support engineers use diagnostic tooling to read [identity diagnostic data](/troubleshoot/azure/active-directory/support-data-collection-diagnostic-logs) for your tenant.

Microsoft Support access to your identity diagnostic data is granted only with your approval, is read-only, and lasts only as long as we are actively working with you to solve your problem. For many support requests created in the Microsoft Entra admin center, you can manage Microsoft Support's access to your identity diagnostic data by enabling the "Allow collection of advanced diagnostic information" property in the Microsoft Entra admin center's support request management experience. If this setting is set to "no" our support engineers must ask *you* to collect the data needed to solve your problem, which could slow down your problem resolution. 

## Microsoft Support access requests

Sometimes support engineers need additional approval from you to access identity diagnostic data to solve your problem. For example, if a support engineer needs to access identity diagnostic data in a different Microsoft Entra tenant than the one in which you created the support request, the engineer must ask you to grant them access to that data.

Microsoft Support access requests (preview) enable you to manage Microsoft Support's access to your identity diagnostic data for support requests where you cannot manage that access in the Microsoft Entra admin center's support request management experience.

## Support access role permissions

To manage Microsoft Support access requests, you must be assigned to a role that has full permission to manage Microsoft Entra support tickets for the tenant. This role permission is included in Azure AD built-in roles with the action `microsoft.azure.supportTickets/allEntities/allTasks`. You can see which Azure AD roles have this permission in the [Azure AD built-in roles](../roles/permissions-reference.md) article. Azure Active Directory is being renamed to Microsoft Entra ID. For more information see [New name for Azure Active Directory](../fundamentals/new-name.md).

## Next steps

- [Manage Microsoft Support Access Requests](how-to-manage-support-access-requests.md)

- [Learn about how Microsoft uses data for Azure support](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/)

- [Learn about advanced diagnostic information logs](../../azure-portal/supportability/how-to-create-azure-support-request.md#advanced-diagnostic-information-logs)
