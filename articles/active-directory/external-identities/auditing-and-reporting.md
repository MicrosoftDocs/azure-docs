---
title: Auditing and reporting a B2B collaboration user
description: Guest user properties are configurable in Microsoft Entra B2B collaboration

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 11/24/2022

ms.author: cmulligan
author: csmulligan
manager: celestedg
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: engagement-fy23, M365-identity-device-management

# Customer intent: As a tenant administrator, I want to see access reviews, and system and user activities in my tenant.
---

# Auditing and reporting a B2B collaboration user
With guest users, you have auditing capabilities similar to with member users.

## Access reviews
You can use access reviews to periodically verify whether guest users still need access to your resources. The **Access reviews** feature is available in **Microsoft Entra ID** under **Identity Governance** > **Access reviews**. To learn how to use access reviews, see [Manage guest access with Microsoft Entra access reviews](../governance/manage-guest-access-with-access-reviews.md).

## Audit logs

The Microsoft Entra audit logs provide records of system and user activities, including activities initiated by guest users. To access audit logs, in **Identity**, under **Monitoring & health**, select **Audit logs**. To access audit logs of one specific user, select **Identity** > **Users** > **All users** > select the user > **Audit logs**.

:::image type="content" source="media/auditing-and-reporting/audit-log.png" alt-text="Screenshot showing an example of audit log output." lightbox="media/auditing-and-reporting/audit-log-large.png":::

You can dive into each of these events to get the details. For example, let's look at the user update details.

:::image type="content" source="media/auditing-and-reporting/activity-details.png" alt-text="Screenshot showing an example of activity details output." lightbox="media/auditing-and-reporting/activity-details-large.png":::

You can also export these logs from Microsoft Entra ID and use the reporting tool of your choice to get customized reports.

## Sponsors field for B2B users (preview) 

You can also manage and track your guest users in the organization using the sponsors feature (preview). The **Sponsors** field on the user account displays who is responsible for the guest user. A sponsor can be a user or a group. To learn more about the sponsors feature (preview), see [Add sponsors to a guest user](b2b-sponsors.md).

### Next steps

- [B2B collaboration user properties](user-properties.md)
- [Leave an organization](leave-the-organization.md)
- [Troubleshoot B2B collaboration](troubleshoot.md)
