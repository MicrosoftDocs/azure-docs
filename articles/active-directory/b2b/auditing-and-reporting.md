---
title: Auditing and reporting an Azure Active Directory B2B collaboration user | Microsoft Docs
description: Guest user properties are configurable in Azure Active Directory B2B collaboration

services: active-directory
ms.service: active-directory
ms.component: B2B
ms.topic: conceptual
ms.date: 04/12/2017

ms.author: mimart
author: msmimart
manager: mtillman
ms.reviewer: sasubram

---

# Auditing and reporting a B2B collaboration user
With guest users, you have auditing capabilities similar to with member users. 

## Access reviews
Use access reviews to periodically verify whether guest users still need access to your resources. Use the **Access reviews** feature in the Azure Active Directory portal by going to either **Security** > **Conditional Access** or **Manage** > **Organizational Relationships**. For details about conducting access reviews, see [Manage guest access with Azure AD access reviews](../governance/manage-guest-access-with-access-reviews).

## Audit logs

Here's an example of the invitation and redemption history of invitee Sam Oogle:

![audit log](./media/auditing-and-reporting/audit-log.png)

You can dive into each of these events to get the details. For example, let's look at the acceptance details.

![activity details](./media/auditing-and-reporting/activity-details.png)

You can also export these logs from Azure AD and use the reporting tool of your choice to get customized reports.

### Next steps

- [B2B collaboration user properties](user-properties.md)

